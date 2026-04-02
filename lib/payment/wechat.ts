import crypto from 'crypto'

const WECHAT_API_BASE = 'https://api.mch.weixin.qq.com'

function getConfig() {
  const mchId = process.env.WECHAT_MCH_ID?.trim()
  const appId = process.env.WECHAT_APP_ID?.trim()
  const apiKey = process.env.WECHAT_API_KEY?.trim()

  if (!mchId || !appId || !apiKey) {
    throw new Error('Missing WeChat Pay environment variables: WECHAT_MCH_ID, WECHAT_APP_ID, WECHAT_API_KEY')
  }

  return { mchId, appId, apiKey }
}

function generateNonce(): string {
  return crypto.randomBytes(16).toString('hex')
}

/** Build MD5 signature for WeChat Pay V2 API */
function sign(params: Record<string, string | number>, apiKey: string): string {
  // Sort keys alphabetically, exclude empty values and 'sign'
  const sorted = Object.keys(params)
    .filter(k => k !== 'sign' && params[k] !== '' && params[k] !== undefined)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&')

  const stringSignTemp = `${sorted}&key=${apiKey}`
  return crypto.createHash('md5').update(stringSignTemp, 'utf8').digest('hex').toUpperCase()
}

/** Convert JS object to XML string */
function toXml(obj: Record<string, string | number>): string {
  const items = Object.entries(obj)
    .map(([k, v]) => `<${k}><![CDATA[${v}]]></${k}>`)
    .join('')
  return `<xml>${items}</xml>`
}

/** Parse XML string to JS object (simple, no dependencies) */
function parseXml(xml: string): Record<string, string> {
  const result: Record<string, string> = {}
  // Match leaf elements only (no nested XML), handle CDATA and plain text
  const regex = /<(\w+)><!\[CDATA\[([\s\S]*?)\]\]><\/\1>|<(\w+)>([^<]+)<\/\3>/g
  let match
  while ((match = regex.exec(xml)) !== null) {
    const key = match[1] || match[3]
    const value = match[2] ?? match[4]
    if (key && key !== 'xml') {
      result[key] = value
    }
  }
  return result
}

export function generateOutTradeNo(): string {
  const now = new Date()
  const dateStr = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
  const rand = crypto.randomBytes(4).toString('hex')
  return `WX${dateStr}${rand}`
}

interface CreateNativeOrderParams {
  outTradeNo: string
  description: string
  totalAmountCents: number
  notifyUrl: string
  clientIp?: string
}

export async function createNativeOrder({
  outTradeNo,
  description,
  totalAmountCents,
  notifyUrl,
  clientIp = '127.0.0.1',
}: CreateNativeOrderParams): Promise<{ code_url: string }> {
  const config = getConfig()

  const params: Record<string, string | number> = {
    appid: config.appId,
    mch_id: config.mchId,
    nonce_str: generateNonce(),
    body: description,
    out_trade_no: outTradeNo,
    total_fee: totalAmountCents,
    spbill_create_ip: clientIp,
    notify_url: notifyUrl,
    trade_type: 'NATIVE',
  }

  params.sign = sign(params, config.apiKey)

  const xmlBody = toXml(params)

  const response = await fetch(`${WECHAT_API_BASE}/pay/unifiedorder`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    body: xmlBody,
  })

  const responseText = await response.text()
  const result = parseXml(responseText)

  if (result.return_code !== 'SUCCESS') {
    console.error('[WeChatPay] unifiedorder return failed:', result.return_msg)
    throw new Error(`WeChat Pay error: ${result.return_msg}`)
  }

  if (result.result_code !== 'SUCCESS') {
    console.error('[WeChatPay] unifiedorder result failed:', result.err_code, result.err_code_des)
    throw new Error(`WeChat Pay error: ${result.err_code_des || result.err_code}`)
  }

  if (!result.code_url) {
    throw new Error('WeChat Pay: missing code_url in response')
  }

  return { code_url: result.code_url }
}

export interface WechatCallbackResult {
  out_trade_no: string
  transaction_id: string
  result_code: string
  total_fee: string
  openid?: string
}

/** Verify and parse WeChat Pay V2 callback XML */
export function verifyAndParseCallback(xmlBody: string): WechatCallbackResult {
  const config = getConfig()
  const data = parseXml(xmlBody)

  if (data.return_code !== 'SUCCESS') {
    throw new Error(`Callback return_code not SUCCESS: ${data.return_msg}`)
  }

  // Verify signature
  const expectedSign = sign(
    Object.fromEntries(
      Object.entries(data).filter(([k]) => k !== 'sign')
    ),
    config.apiKey,
  )

  if (expectedSign !== data.sign) {
    throw new Error('WeChat Pay callback signature verification failed')
  }

  return {
    out_trade_no: data.out_trade_no,
    transaction_id: data.transaction_id,
    result_code: data.result_code,
    total_fee: data.total_fee,
    openid: data.openid,
  }
}

/** Build success response XML for WeChat callback */
export function callbackSuccessXml(): string {
  return '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>'
}

/** Build fail response XML for WeChat callback */
export function callbackFailXml(msg: string): string {
  return `<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[${msg}]]></return_msg></xml>`
}

export interface WechatOrderQueryResult {
  trade_state: string
  out_trade_no: string
  transaction_id?: string
  total_fee?: string
}

/** Query order status via V2 API */
export async function queryOrder(outTradeNo: string): Promise<WechatOrderQueryResult> {
  const config = getConfig()

  const params: Record<string, string | number> = {
    appid: config.appId,
    mch_id: config.mchId,
    out_trade_no: outTradeNo,
    nonce_str: generateNonce(),
  }

  params.sign = sign(params, config.apiKey)

  const xmlBody = toXml(params)

  const response = await fetch(`${WECHAT_API_BASE}/pay/orderquery`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    body: xmlBody,
  })

  const responseText = await response.text()
  const result = parseXml(responseText)

  if (result.return_code !== 'SUCCESS') {
    throw new Error(`WeChat Pay query error: ${result.return_msg}`)
  }

  return {
    trade_state: result.trade_state,
    out_trade_no: result.out_trade_no,
    transaction_id: result.transaction_id,
    total_fee: result.total_fee,
  }
}
