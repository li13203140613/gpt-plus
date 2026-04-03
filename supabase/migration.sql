-- Activation codes table
CREATE TABLE IF NOT EXISTS activation_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL DEFAULT 99.00,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  stripe_session_id TEXT,
  buyer_email TEXT,
  reserved_at TIMESTAMPTZ,
  sold_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS gptplus_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code_id UUID REFERENCES activation_codes(id),
  stripe_session_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'failed', 'refunded')),
  buyer_email TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reminder_sent BOOLEAN DEFAULT FALSE
);

-- Site settings table (key-value)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default activation URL
INSERT INTO site_settings (key, value) VALUES ('activation_url', 'https://chong.plus')
ON CONFLICT (key) DO NOTHING;

-- Payment currency and amount in payment currency (may differ from internal CNY amount)
ALTER TABLE gptplus_orders ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'cny';
ALTER TABLE gptplus_orders ADD COLUMN IF NOT EXISTS paid_amount DECIMAL(10,2);

-- Google Click ID for server-side conversion tracking
ALTER TABLE gptplus_orders ADD COLUMN IF NOT EXISTS gclid TEXT;

-- WeChat Pay support
ALTER TABLE gptplus_orders ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'stripe';
ALTER TABLE gptplus_orders ADD COLUMN IF NOT EXISTS out_trade_no TEXT;
CREATE INDEX IF NOT EXISTS idx_gptplus_orders_out_trade_no ON gptplus_orders(out_trade_no) WHERE out_trade_no IS NOT NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_codes_status ON activation_codes(status);
CREATE INDEX IF NOT EXISTS idx_codes_session ON activation_codes(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_codes_reserved ON activation_codes(status, reserved_at) WHERE status = 'reserved';
CREATE INDEX IF NOT EXISTS idx_gptplus_orders_session ON gptplus_orders(stripe_session_id);

-- Renewal reminder tracking fields
ALTER TABLE activation_codes ADD COLUMN IF NOT EXISTS renewal_reminder_1_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE activation_codes ADD COLUMN IF NOT EXISTS renewal_reminder_2_sent BOOLEAN DEFAULT FALSE;

-- Order source tracking (e.g. 'renewal_email', 'organic', 'ad')
ALTER TABLE gptplus_orders ADD COLUMN IF NOT EXISTS source TEXT;
