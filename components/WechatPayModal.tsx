'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { QRCodeSVG } from 'qrcode.react'
import { X, Loader2, CheckCircle } from 'lucide-react'
import { Button } from './ui/button'

interface WechatPayModalProps {
  open: boolean
  onClose: () => void
  codeUrl: string
  outTradeNo: string
  amount: number
}

type PayStatus = 'waiting' | 'checking' | 'success' | 'failed'

export function WechatPayModal({ open, onClose, codeUrl, outTradeNo, amount }: WechatPayModalProps) {
  const router = useRouter()
  const [payStatus, setPayStatus] = useState<PayStatus>('waiting')
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pollCountRef = useRef(0)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current)
    }
  }, [])

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setPayStatus('waiting')
      pollCountRef.current = 0
    } else {
      if (pollRef.current) clearTimeout(pollRef.current)
    }
  }, [open])

  async function checkPaymentStatus() {
    try {
      const res = await fetch(`/api/payment/wechat-query/${outTradeNo}`)
      if (!res.ok) return false

      const data = await res.json()
      if (data.status === 'completed') {
        return true
      }
      return false
    } catch {
      return false
    }
  }

  async function startPolling() {
    setPayStatus('checking')
    pollCountRef.current = 0

    async function poll() {
      if (pollCountRef.current >= 60) {
        setPayStatus('failed')
        return
      }

      const paid = await checkPaymentStatus()
      if (paid) {
        setPayStatus('success')
        // Redirect to success page after a brief moment
        setTimeout(() => {
          router.push(`/success?session_id=${outTradeNo}`)
        }, 1500)
        return
      }

      pollCountRef.current++
      pollRef.current = setTimeout(poll, 2000)
    }

    poll()
  }

  function handleConfirmPayment() {
    startPolling()
  }

  return (
    <Dialog.Root open={open} onOpenChange={() => { /* Prevent closing by clicking overlay */ }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl focus:outline-none"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          {/* Close button */}
          <Dialog.Close asChild>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="关闭"
            >
              <X className="size-5" />
            </button>
          </Dialog.Close>

          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-green-50">
                <svg viewBox="0 0 1024 1024" className="size-6" fill="#07C160">
                  <path d="M404.511405 600.865957c-4.042059 2.043542-8.602935 3.223415-13.447267 3.223415-11.197016 0-20.934798-6.169513-26.045189-15.278985l-1.959631-4.296863-81.56569-178.973184c-0.880043-1.954515-1.430582-4.14746-1.430582-6.285147 0-8.251941 6.686283-14.944364 14.938224-14.944364 3.351328 0 6.441713 1.108241 8.94165 2.966565l96.242971 68.521606c7.037277 4.609994 15.433504 7.305383 24.464181 7.305383 5.40101 0 10.533914-1.00284 15.328104-2.75167l452.645171-201.459315C811.496653 163.274644 677.866167 100.777241 526.648117 100.777241c-247.448742 0-448.035176 167.158091-448.035176 373.361453 0 112.511493 60.353576 213.775828 154.808832 282.214547 7.582699 5.405103 12.537548 14.292518 12.537548 24.325012 0 3.312442-0.712221 6.358825-1.569752 9.515724-7.544837 28.15013-19.62599 73.202209-20.188808 75.314313-0.940418 3.529383-2.416026 7.220449-2.416026 10.917654 0 8.245801 6.692423 14.933107 14.944364 14.933107 3.251044 0 5.89015-1.202385 8.629541-2.7793l98.085946-56.621579c7.377014-4.266164 15.188934-6.89913 23.790846-6.89913 4.577249 0 9.003048 0.703011 13.174044 1.978051 45.75509 13.159718 95.123474 20.476357 146.239666 20.476357 247.438509 0 448.042339-167.162184 448.042339-373.372709 0-62.451354-18.502399-121.275087-51.033303-173.009356L407.778822 598.977957 404.511405 600.865957z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">微信支付</h2>
                <p className="text-2xl font-bold text-green-600">¥{amount.toFixed(2)}</p>
              </div>
            </div>

            {/* QR Code */}
            {payStatus === 'waiting' && (
              <>
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-2xl border-2 border-green-100 bg-white p-4">
                    <QRCodeSVG
                      value={codeUrl}
                      size={220}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  <p className="text-sm text-gray-500">请使用微信扫描二维码完成支付</p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleConfirmPayment}
                    className="h-12 w-full rounded-xl bg-[#07C160] text-base font-semibold text-white hover:bg-[#06AD56]"
                  >
                    已完成支付
                  </Button>
                  <p className="text-center text-xs text-gray-400">
                    为保证到账，付款完成后请点击「已完成支付」
                  </p>
                </div>
              </>
            )}

            {/* Checking status */}
            {payStatus === 'checking' && (
              <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 className="size-12 animate-spin text-green-500" />
                <div className="text-center">
                  <p className="text-base font-medium text-gray-900">正在确认支付结果...</p>
                  <p className="mt-1 text-sm text-gray-500">请稍候，正在查询微信支付状态</p>
                </div>
              </div>
            )}

            {/* Success */}
            {payStatus === 'success' && (
              <div className="flex flex-col items-center gap-4 py-8">
                <CheckCircle className="size-12 text-green-500" />
                <div className="text-center">
                  <p className="text-base font-medium text-gray-900">支付成功！</p>
                  <p className="mt-1 text-sm text-gray-500">正在跳转到激活码页面...</p>
                </div>
              </div>
            )}

            {/* Failed / Timeout */}
            {payStatus === 'failed' && (
              <div className="flex flex-col items-center gap-4 py-6">
                <p className="text-base font-medium text-gray-900">未检测到支付</p>
                <p className="text-sm text-gray-500">如果您已完成支付，请稍等片刻后重试</p>
                <div className="flex gap-3 w-full">
                  <Button
                    onClick={() => { setPayStatus('waiting') }}
                    variant="outline"
                    className="flex-1 h-11 rounded-xl"
                  >
                    返回二维码
                  </Button>
                  <Button
                    onClick={handleConfirmPayment}
                    className="flex-1 h-11 rounded-xl bg-[#07C160] text-white hover:bg-[#06AD56]"
                  >
                    重新查询
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
