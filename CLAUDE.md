# CLAUDE.md - GPT Plus 充值网站

## 项目概述

ChatGPT Plus 充值网站 - 售卖 ChatGPT Plus 激活码（卡密），用户购买后获取激活码并前往卡密网站激活。

- **框架**: Next.js 15 (App Router)
- **UI**: Tailwind CSS + shadcn/ui (emerald/teal 主题色)
- **支付**: Stripe (支付宝/微信支付/信用卡)
- **数据库**: Neon (PostgreSQL)
- **部署**: Vercel
- **域名**: gpt-plus.ai

## 核心功能

1. 首页展示激活码（部分遮蔽），Stripe 支付
2. 支付成功后展示完整激活码，引导用户到卡密激活网站
3. 管理 API (`/api/admin/codes`) 管理激活码
4. 10 个 SEO 内页覆盖关键词

## SEO 关键词内页

- /chatgpt-plus-kaitong (开通)
- /chatgpt-plus-shengji (升级)
- /chatgpt-plus-dingyue (订阅)
- /chatgpt-plus-goumai (购买)
- /chatgpt-plus-kaitong-fuwu (开通服务)
- /chatgpt-plus-dingyue-fuwu (订阅服务)
- /chatgpt-plus-zhifu-xiezhu (支付协助)
- /chatgpt-plus-dai-kaitong (代开通)
- /chatgpt-plus-dai-dingyue (代订阅)
- /chatgpt-plus-chongzhi (充值)

## 数据库

迁移脚本: `supabase/migration.sql` (Neon PostgreSQL)
- `activation_codes` - 激活码表
- `orders` - 订单表

## 环境变量

见 `.env.example`

## 开发命令

```bash
pnpm dev      # 开发模式 (port 3001)
pnpm build    # 构建
pnpm start    # 生产模式
```

## Code Update Log

| Date | Module | Changes | Scope | Note |
|------|----------|----------|----------|------|
| 2026-03-07 | Components | Modified: BookmarkPrompt.tsx | components/BookmarkPrompt.tsx | AI Auto |
| 2026-03-07 | Components | Modified: SocialProof.tsx | components/SocialProof.tsx | AI Auto |
| 2026-03-07 | Components | Modified: table.tsx | C:/Users/LILI/Desktop/gpt-plus/components/ui/table.tsx | AI Auto |
| 2026-03-07 | Components | Modified: badge.tsx | C:/Users/LILI/Desktop/gpt-plus/components/ui/badge.tsx | AI Auto |
| 2026-03-06 | Components | Modified: label.tsx | C:/Users/LILI/Desktop/gpt-plus/components/ui/label.tsx | AI Auto |
| 2026-03-06 | Components | Modified: input.tsx | C:/Users/LILI/Desktop/gpt-plus/components/ui/input.tsx | AI Auto |
| 2026-03-06 | Docs | Modified: CLAUDE.md | C:/Users/LILI/Desktop/gpt-plus/CLAUDE.md | AI Auto |
| 2026-03-06 | Library | Modified: db.ts | C:/Users/LILI/Desktop/gpt-plus/lib/db.ts | AI Auto |
| 2026-03-06 | Other | Modified: sitemap.ts | C:/Users/LILI/Desktop/gpt-plus/app/sitemap.ts | AI Auto |
| 2026-03-06 | Other | Modified: robots.ts | C:/Users/LILI/Desktop/gpt-plus/app/robots.ts | AI Auto |
| 2026-03-06 | Other | Modified: page.tsx | C:/Users/LILI/Desktop/gpt-plus/app/page.tsx | AI Auto |
| 2026-03-06 | Other | Modified: layout.tsx | C:/Users/LILI/Desktop/gpt-plus/app/layout.tsx | AI Auto |
| 2026-03-06 | Components | Modified: SeoInternalLinks.tsx | C:/Users/LILI/Desktop/gpt-plus/components/seo/SeoInternalLinks.tsx | AI Auto |
| 2026-03-06 | Components | Modified: SeoCta.tsx | C:/Users/LILI/Desktop/gpt-plus/components/seo/SeoCta.tsx | AI Auto |
| 2026-03-06 | Components | Modified: SeoFaq.tsx | C:/Users/LILI/Desktop/gpt-plus/components/seo/SeoFaq.tsx | AI Auto |
| 2026-03-06 | Components | Modified: SeoSection.tsx | C:/Users/LILI/Desktop/gpt-plus/components/seo/SeoSection.tsx | AI Auto |
| 2026-03-06 | Components | Modified: SeoHero.tsx | C:/Users/LILI/Desktop/gpt-plus/components/seo/SeoHero.tsx | AI Auto |
| 2026-03-06 | Components | Modified: SeoPageLayout.tsx | C:/Users/LILI/Desktop/gpt-plus/components/seo/SeoPageLayout.tsx | AI Auto |
| 2026-03-06 | Components | Modified: CodeGrid.tsx | C:/Users/LILI/Desktop/gpt-plus/components/CodeGrid.tsx | AI Auto |
| 2026-03-06 | Components | Modified: CodeCard.tsx | C:/Users/LILI/Desktop/gpt-plus/components/CodeCard.tsx | AI Auto |
| 2026-03-06 | Components | Modified: Footer.tsx | C:/Users/LILI/Desktop/gpt-plus/components/Footer.tsx | AI Auto |
| 2026-03-06 | Components | Modified: Header.tsx | C:/Users/LILI/Desktop/gpt-plus/components/Header.tsx | AI Auto |
| 2026-03-06 | API | Modified: route.ts | C:/Users/LILI/Desktop/gpt-plus/app/api/codes/route.ts | AI Auto |
| 2026-03-06 | Other | Modified: migration.sql | C:/Users/LILI/Desktop/gpt-plus/supabase/migration.sql | AI Auto |
| 2026-03-06 | Library | Modified: service.ts | C:/Users/LILI/Desktop/gpt-plus/lib/payment/service.ts | AI Auto |
| 2026-03-06 | Library | Modified: stripe.ts | C:/Users/LILI/Desktop/gpt-plus/lib/payment/stripe.ts | AI Auto |
| 2026-03-06 | Library | Modified: admin.ts | C:/Users/LILI/Desktop/gpt-plus/lib/supabase/admin.ts | AI Auto |
| 2026-03-06 | Components | Modified: sonner.tsx | C:/Users/LILI/Desktop/gpt-plus/components/ui/sonner.tsx | AI Auto |
| 2026-03-06 | Components | Modified: button.tsx | C:/Users/LILI/Desktop/gpt-plus/components/ui/button.tsx | AI Auto |
| 2026-03-06 | Library | Modified: utils.ts | C:/Users/LILI/Desktop/gpt-plus/lib/utils.ts | AI Auto |
| 2026-03-06 | Styles | Modified: globals.css | C:/Users/LILI/Desktop/gpt-plus/app/globals.css | AI Auto |
| 2026-03-06 | Other | Modified: .gitignore | C:/Users/LILI/Desktop/gpt-plus/.gitignore | AI Auto |
| 2026-03-06 | Other | Modified: .env.example | C:/Users/LILI/Desktop/gpt-plus/.env.example | AI Auto |
| 2026-03-06 | Styles | Modified: postcss.config.mjs | C:/Users/LILI/Desktop/gpt-plus/postcss.config.mjs | AI Auto |
| 2026-03-06 | Other | Modified: tailwind.config.ts | C:/Users/LILI/Desktop/gpt-plus/tailwind.config.ts | AI Auto |
| 2026-03-06 | Other | Modified: next.config.js | C:/Users/LILI/Desktop/gpt-plus/next.config.js | AI Auto |
| 2026-03-06 | Other | Modified: tsconfig.json | C:/Users/LILI/Desktop/gpt-plus/tsconfig.json | AI Auto |
| 2026-03-06 | Other | Modified: package.json | C:/Users/LILI/Desktop/gpt-plus/package.json | AI Auto |

