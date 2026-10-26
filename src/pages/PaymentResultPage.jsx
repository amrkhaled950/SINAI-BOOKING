import React, { useEffect, useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  MessageCircle,
  Copy,
  Check,
  ShieldCheck,
  Home
} from 'lucide-react'
import { verifyPayTabsTransaction } from '../lib/paytabs'
import { updateBookingPaymentStatus, getBookingById } from '../lib/supabase'

export default function PaymentResultPage({ lang = 'ar', onNavigateHome }) {
  const isAr = lang === 'ar'
  const [loading, setLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [paymentData, setPaymentData] = useState(null)
  const [bookingData, setBookingData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function handlePaymentReturn() {
      try {
        setLoading(true)

        // Extract params from both search params and hash params
        const urlObj = new URL(window.location.href)
        const searchParams = urlObj.searchParams

        // PayTabs might append to hash (e.g., #payment-result?tranRef=...)
        let hashParams = new URLSearchParams()
        if (window.location.hash.includes('?')) {
          const hashQuery = window.location.hash.split('?')[1]
          hashParams = new URLSearchParams(hashQuery)
        }

        const tranRef =
          searchParams.get('tranRef') ||
          searchParams.get('tran_ref') ||
          hashParams.get('tranRef') ||
          hashParams.get('tran_ref')

        const bookingId =
          searchParams.get('bookingId') ||
          searchParams.get('cart_id') ||
          hashParams.get('bookingId') ||
          hashParams.get('cart_id')

        const bookingType =
          searchParams.get('type') ||
          hashParams.get('type') ||
          'apartment'

        // Check if PayTabs sent a response status in URL
        const respStatus = searchParams.get('respStatus') || hashParams.get('respStatus')

        if (!tranRef && !bookingId) {
          setLoading(false)
          setErrorMessage(isAr ? 'لم يتم العثور على بيانات عملية الدفع' : 'No payment transaction details found')
          return
        }

        let verifiedResult = null
        if (tranRef) {
          verifiedResult = await verifyPayTabsTransaction(tranRef)
        }

        const success = verifiedResult?.isPaid || respStatus === 'A'
        setIsSuccess(success)
        setPaymentData(verifiedResult || { tran_ref: tranRef })

        // If bookingId exists, fetch and update Supabase
        const targetId = bookingId || verifiedResult?.cart_id
        if (targetId) {
          if (success) {
            await updateBookingPaymentStatus(bookingType, targetId, {
              status: 'confirmed',
              payment_status: 'paid',
              paytabs_tran_ref: tranRef || verifiedResult?.tran_ref,
              paid_amount: verifiedResult?.cart_amount || null,
              paid_currency: verifiedResult?.cart_currency || 'EGP'
            })
          }

          const { data: bData } = await getBookingById(bookingType, targetId)
          if (bData) {
            setBookingData(bData)
          }
        }

        if (!success) {
          setErrorMessage(
            verifiedResult?.response_message ||
            (isAr ? 'تم إلغاء عملية الدفع أو لم تتم الموافقة على البطاقة' : 'Payment was declined or cancelled')
          )
        }

      } catch (err) {
        console.error('Payment result processing error:', err)
        setErrorMessage(err.message || 'An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    handlePaymentReturn()
  }, [isAr])

  const handleCopyRef = () => {
    const ref = paymentData?.tran_ref || bookingData?.paytabs_tran_ref
    if (ref) {
      navigator.clipboard.writeText(ref)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleWhatsAppConfirmation = () => {
    const ref = paymentData?.tran_ref || bookingData?.paytabs_tran_ref || 'PayTabs'
    const name = bookingData?.customer_name || 'عميل سيناء بوكينج'
    const itemTitle = bookingData?.apartment_name || bookingData?.tour_name || 'حجز سيناء بوكينج'
    const amount = paymentData?.cart_amount || bookingData?.paid_amount || bookingData?.estimated_total_egp || ''
    const currency = paymentData?.cart_currency || bookingData?.paid_currency || 'EGP'

    const msg = isAr
      ? `مساء الخير سيناء بوكينج، أنا قمت بإتمام الدفع بنجاح بالفيزا عبر PayTabs لحجز "${itemTitle}".
• الاسم: ${name}
• رقم العملية PayTabs: ${ref}
• المبلغ المدفوع: ${amount} ${currency}
برجاء إرسال تفاصيل الدخول والاستلام.`
      : `Hello Sinai Booking, I have successfully paid online via PayTabs for "${itemTitle}".
• Name: ${name}
• PayTabs Ref: ${ref}
• Paid Amount: ${amount} ${currency}
Please confirm arrival/check-in details.`

    window.open(`https://wa.me/201116664591?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#22211F] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-white rounded-[32px] border border-[#E7DFCE] shadow-xl p-8 sm:p-10 space-y-8 relative overflow-hidden">
        
        {/* Decorative Top Accent Bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-2.5 ${
            loading
              ? 'bg-[#C8553D] animate-pulse'
              : isSuccess
              ? 'bg-[#2A6543]'
              : 'bg-[#9C2727]'
          }`}
        />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-[#C8553D]/20 border-t-[#C8553D] animate-spin flex items-center justify-center">
              <Clock className="text-[#C8553D]" size={28} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#22211F]">
              {isAr ? 'جاري التحقق من عملية الدفع...' : 'Verifying your payment with PayTabs...'}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7367]">
              {isAr ? 'برجاء الانتظار لحظات لتأكيد المعاملة البنكية' : 'Please wait a moment while we confirm transaction status'}
            </p>
          </div>
        )}

        {/* Success State */}
        {!loading && isSuccess && (
          <div className="space-y-6 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-[#E2ECE5] text-[#2A6543] flex items-center justify-center shadow-inner relative">
              <CheckCircle2 size={46} className="stroke-[2.2]" />
              <div className="absolute inset-0 rounded-full border-2 border-[#2A6543] animate-ping opacity-25 pointer-events-none" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest text-[#2A6543] uppercase bg-[#E2ECE5] px-3.5 py-1 rounded-full inline-block">
                {isAr ? 'تم الدفع بنجاح عبر PayTabs' : 'Payment Successful via PayTabs'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#183B33]">
                {isAr ? 'تم تأكيد حجزك بنجاح! 🎉' : 'Your Booking is Confirmed! 🎉'}
              </h1>
              <p className="text-sm text-[#666159] leading-relaxed max-w-md mx-auto">
                {isAr
                  ? 'تم استلام المبلغ وتأكيد المعاملة فوراً، وجميع بيانات الحجز مسجلة وجاهزة في نظام سيناء بوكينج.'
                  : 'We have received your payment. Your reservation is securely confirmed in Sinai Booking system.'}
              </p>
            </div>

            {/* Receipt Details Card */}
            <div className="bg-[#FAF6EF] rounded-2xl border border-[#E7DFCE] p-5 text-left rtl:text-right space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between border-b border-[#E7DFCE] pb-2.5">
                <span className="text-[#7A7367]">{isAr ? 'رقم المعاملة (PayTabs Ref):' : 'Transaction Ref:'}</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-[#22211F]">
                  <span>{paymentData?.tran_ref || bookingData?.paytabs_tran_ref || 'PTE-Confirmed'}</span>
                  <button
                    onClick={handleCopyRef}
                    className="p-1 text-[#7A7367] hover:text-[#C8553D] transition-colors cursor-pointer"
                    title="Copy reference"
                  >
                    {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {(bookingData?.apartment_name || bookingData?.tour_name) && (
                <div className="flex items-center justify-between border-b border-[#E7DFCE] pb-2.5">
                  <span className="text-[#7A7367]">{isAr ? 'تفاصيل الحجز:' : 'Booking Service:'}</span>
                  <span className="font-semibold text-[#183B33]">
                    {bookingData?.apartment_name || bookingData?.tour_name}
                  </span>
                </div>
              )}

              {bookingData?.customer_name && (
                <div className="flex items-center justify-between border-b border-[#E7DFCE] pb-2.5">
                  <span className="text-[#7A7367]">{isAr ? 'اسم الضيف:' : 'Guest Name:'}</span>
                  <span className="font-semibold text-[#22211F]">{bookingData?.customer_name}</span>
                </div>
              )}

              {(paymentData?.cart_amount || bookingData?.paid_amount || bookingData?.estimated_total_egp) && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[#7A7367]">{isAr ? 'المبلغ المدفوع بالبطاقة:' : 'Amount Paid:'}</span>
                  <span className="text-base font-bold text-[#2A6543]">
                    {paymentData?.cart_amount || bookingData?.paid_amount || bookingData?.estimated_total_egp}{' '}
                    {paymentData?.cart_currency || bookingData?.paid_currency || 'EGP'}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleWhatsAppConfirmation}
                className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                <MessageCircle size={20} />
                <span>{isAr ? 'إرسال إيصال الحجز عبر واتساب' : 'Send Receipt via WhatsApp'}</span>
              </button>

              <button
                onClick={onNavigateHome}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#FAF6EF] hover:bg-[#EBE2D4] border border-[#E7DFCE] text-[#4A463F] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Home size={16} />
                <span>{isAr ? 'العودة للصفحة الرئيسية' : 'Return to Home'}</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#7A7367] pt-2">
              <ShieldCheck size={14} className="text-[#2A6543]" />
              <span>{isAr ? 'معاملة مؤمنة بالكامل بمعايير PCI DSS البنكية' : 'Fully secured under PCI DSS banking standards'}</span>
            </div>
          </div>
        )}

        {/* Failed / Cancelled State */}
        {!loading && !isSuccess && (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#FDE8E8] text-[#9C2727] flex items-center justify-center shadow-inner">
              <XCircle size={46} className="stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest text-[#9C2727] uppercase bg-[#FDE8E8] px-3.5 py-1 rounded-full inline-block">
                {isAr ? 'فشل إتمام المعاملة' : 'Transaction Incomplete'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#22211F]">
                {isAr ? 'لم تكتمل عملية الدفع' : 'Payment Was Not Completed'}
              </h1>
              <p className="text-sm text-[#666159] leading-relaxed max-w-md mx-auto">
                {errorMessage ||
                  (isAr
                    ? 'لم يتم خصم أي مبالغ من بطاقتك. يمكنك إعادة المحاولة أو إتمام الحجز عبر فودافون كاش / انستاباي / الواتساب.'
                    : 'No funds were charged from your card. You can try again or complete your booking via WhatsApp / InstaPay.')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleWhatsAppConfirmation}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
              >
                <MessageCircle size={18} />
                <span>{isAr ? 'إتمام الحجز والمساعدة عبر واتساب' : 'Complete via WhatsApp & Get Help'}</span>
              </button>

              <button
                onClick={onNavigateHome}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#FAF6EF] hover:bg-[#EBE2D4] border border-[#E7DFCE] text-[#4A463F] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ArrowRight size={16} className="rtl:rotate-180" />
                <span>{isAr ? 'العودة لاختيار الإقامة أو الرحلة' : 'Return to Browse Stays & Safaris'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
