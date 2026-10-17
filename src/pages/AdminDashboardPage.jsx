import React, { useState, useEffect } from 'react'
import {
  Shield,
  Lock,
  LogOut,
  Building2,
  Compass,
  Bus,
  Mail,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  Search,
  ExternalLink,
  Phone,
  MessageCircle,
  DollarSign,
  TrendingUp,
  MapPin,
  Sparkles,
  Layers,
  ChevronRight,
  ArrowUpRight,
  Check,
  AlertCircle
} from 'lucide-react'
import {
  fetchApartmentBookings,
  fetchSafariBookings,
  fetchTransferBookings,
  fetchNewsletterSubscribers,
  updateBookingStatus,
  deleteBookingRecord,
  fetchApartments,
  createApartment,
  updateApartment,
  deleteApartment,
  DEFAULT_APARTMENTS
} from '../lib/supabase'

export default function AdminDashboardPage({ onNavigateHome, lang = 'ar' }) {
  const isAr = lang === 'ar'

  // Admin Auth State (Stored in session / local storage)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sinai_admin_auth') === 'true'
  })
  const [passwordInput, setPasswordInput] = useState('')
  const [loginError, setLoginError] = useState('')

  // Active Tab: 'overview' | 'apartments' | 'apt-bookings' | 'safari-bookings' | 'transfer-bookings' | 'subscribers'
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Data States
  const [apartments, setApartments] = useState(DEFAULT_APARTMENTS)
  const [aptBookings, setAptBookings] = useState([])
  const [safariBookings, setSafariBookings] = useState([])
  const [transferBookings, setTransferBookings] = useState([])
  const [subscribers, setSubscribers] = useState([])

  // Modal States
  const [roomModalOpen, setRoomModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [roomFormData, setRoomFormData] = useState({
    title: '',
    title_ar: '',
    code: '',
    location: 'Dahab - Mashraba',
    location_ar: 'دهب - المشربة',
    badge: 'DUPLEX APARTMENT',
    badge_ar: 'استوديو دوبلكس',
    price_usd: 40,
    price_egp: 2000,
    monthly_usd: 1200,
    monthly_egp: 60000,
    max_guests: 3,
    description: '',
    description_ar: '',
    images: ['/images/duplex-hero-loft.jpg'],
    amenities: ['Air Conditioning', 'High-Speed Wi-Fi', 'Private Bathroom', 'Smart TV'],
    amenities_ar: ['تكييف هواء', 'واي فاي سريع', 'حمام خاص', 'تلفزيون ذكي'],
    is_available: true
  })
  const [imageInputText, setImageInputText] = useState('')
  const [statusMessage, setStatusMessage] = useState(null)

  // 1. Initial Load & Auth Check
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData()
    }
  }, [isAuthenticated])

  const handleLogin = (e) => {
    e.preventDefault()
    // Default PIN: 'sinai2026' or 'admin123'
    if (passwordInput.trim() === 'sinai2026' || passwordInput.trim() === 'admin123' || passwordInput.trim() === '01116664591') {
      localStorage.setItem('sinai_admin_auth', 'true')
      setIsAuthenticated(true)
      setLoginError('')
      loadAllData()
    } else {
      setLoginError(isAr ? 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى' : 'Invalid admin password, please try again')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('sinai_admin_auth')
    setIsAuthenticated(false)
  }

  const showNotification = (msg) => {
    setStatusMessage(msg)
    setTimeout(() => setStatusMessage(null), 4000)
  }

  // 2. Fetch all database data
  const loadAllData = async () => {
    setLoading(true)
    try {
      const [aptRes, aptBRes, safBRes, trBRes, subRes] = await Promise.all([
        fetchApartments(),
        fetchApartmentBookings(),
        fetchSafariBookings(),
        fetchTransferBookings(),
        fetchNewsletterSubscribers()
      ])

      if (aptRes.data?.length) setApartments(aptRes.data)
      if (aptBRes.data) setAptBookings(aptBRes.data)
      if (safBRes.data) setSafariBookings(safBRes.data)
      if (trBRes.data) setTransferBookings(trBRes.data)
      if (subRes.data) setSubscribers(subRes.data)
    } catch (err) {
      console.error('Error fetching admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  // 3. Status update
  const handleUpdateStatus = async (table, id, newStatus) => {
    const { error } = await updateBookingStatus(table, id, newStatus)
    if (!error) {
      if (table === 'apartment_bookings' && newStatus === 'confirmed') {
        showNotification(isAr ? 'تم تأكيد الحجز وقفل المواعيد تلقائياً على الموقع لمنع تداخل الحجوزات! 🔒' : 'Booking confirmed & dates automatically locked on website! 🔒')
      } else if (table === 'apartment_bookings' && newStatus !== 'confirmed') {
        showNotification(isAr ? 'تم فك قفل المواعيد وتحديث حالة الحجز' : 'Status updated & dates released')
      } else {
        showNotification(isAr ? 'تم تحديث حالة الحجز بنجاح' : 'Status updated successfully')
      }

      if (table === 'apartment_bookings') {
        setAptBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
      } else if (table === 'safari_bookings') {
        setSafariBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
      } else if (table === 'transfer_bookings') {
        setTransferBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
      }
    }
  }

  // 4. Delete booking
  const handleDeleteBooking = async (table, id) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا السجل نهائياً؟' : 'Are you sure you want to permanently delete this record?')) return
    const { error } = await deleteBookingRecord(table, id)
    if (!error) {
      showNotification(isAr ? 'تم حذف السجل' : 'Record deleted')
      if (table === 'apartment_bookings') {
        setAptBookings(prev => prev.filter(b => b.id !== id))
      } else if (table === 'safari_bookings') {
        setSafariBookings(prev => prev.filter(b => b.id !== id))
      } else if (table === 'transfer_bookings') {
        setTransferBookings(prev => prev.filter(b => b.id !== id))
      }
    }
  }

  // 5. Room Modal Actions
  const handleOpenAddRoom = () => {
    setEditingRoom(null)
    setRoomFormData({
      title: '',
      title_ar: '',
      code: `studio-${apartments.length + 1}`,
      location: 'Dahab - Mashraba',
      location_ar: 'دهب - المشربة',
      badge: 'STUDIO APARTMENT',
      badge_ar: 'استوديو سياحي',
      price_usd: 40,
      price_egp: 2000,
      monthly_usd: 1200,
      monthly_egp: 60000,
      max_guests: 3,
      description: '',
      description_ar: '',
      images: ['/images/duplex-hero-loft.jpg'],
      amenities: ['Air Conditioning', 'High-Speed Wi-Fi', 'Private Bathroom', 'Smart TV'],
      amenities_ar: ['تكييف هواء', 'واي فاي سريع', 'حمام خاص', 'تلفزيون ذكي'],
      is_available: true
    })
    setImageInputText('/images/duplex-hero-loft.jpg')
    setRoomModalOpen(true)
  }

  const handleOpenEditRoom = (room) => {
    setEditingRoom(room)
    setRoomFormData({
      title: room.title || '',
      title_ar: room.title_ar || '',
      code: room.code || '',
      location: room.location || 'Dahab - Mashraba',
      location_ar: room.location_ar || 'دهب - المشربة',
      badge: room.badge || 'STUDIO APARTMENT',
      badge_ar: room.badge_ar || 'استوديو سياحي',
      price_usd: room.price_usd || 40,
      price_egp: room.price_egp || 2000,
      monthly_usd: room.monthly_usd || 1200,
      monthly_egp: room.monthly_egp || 60000,
      max_guests: room.max_guests || 3,
      description: room.description || '',
      description_ar: room.description_ar || '',
      images: room.images || ['/images/duplex-hero-loft.jpg'],
      amenities: room.amenities || [],
      amenities_ar: room.amenities_ar || [],
      is_available: room.is_available !== false
    })
    setImageInputText((room.images || []).join('\n'))
    setRoomModalOpen(true)
  }

  const handleSaveRoom = async (e) => {
    e.preventDefault()
    const imgs = imageInputText.split('\n').map(s => s.trim()).filter(Boolean)
    const payload = {
      ...roomFormData,
      images: imgs.length > 0 ? imgs : ['/images/duplex-hero-loft.jpg']
    }

    if (editingRoom) {
      const { data, error } = await updateApartment(editingRoom.id, payload)
      if (!error) {
        showNotification(isAr ? 'تم حفظ تعديلات الغرفة بنجاح' : 'Room updated successfully')
        setApartments(prev => prev.map(r => r.id === editingRoom.id ? { ...r, ...payload } : r))
        setRoomModalOpen(false)
      } else {
        alert(error.message || 'Error updating room')
      }
    } else {
      const { data, error } = await createApartment(payload)
      if (!error && data) {
        showNotification(isAr ? 'تم إضافة الغرفة الجديدة بنجاح' : 'New room added successfully')
        setApartments(prev => [...prev, data])
        setRoomModalOpen(false)
      } else {
        alert(error?.message || 'Error creating room')
      }
    }
  }

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذه الغرفة نهائياً؟' : 'Are you sure you want to delete this room?')) return
    const { error } = await deleteApartment(roomId)
    if (!error) {
      showNotification(isAr ? 'تم حذف الغرفة' : 'Room deleted')
      setApartments(prev => prev.filter(r => r.id !== roomId))
    }
  }

  const handleToggleRoomAvailability = async (room) => {
    const updated = !room.is_available
    const { error } = await updateApartment(room.id, { is_available: updated })
    if (!error) {
      setApartments(prev => prev.map(r => r.id === room.id ? { ...r, is_available: updated } : r))
      showNotification(updated ? (isAr ? 'تم تفعيل الغرفة وتعيينها كمتاحة' : 'Room is now available') : (isAr ? 'تم تعطيل الغرفة' : 'Room disabled'))
    }
  }

  // Calculate totals for overview
  const totalBookingsCount = aptBookings.length + safariBookings.length + transferBookings.length
  const totalRevenueUsd = aptBookings.reduce((sum, b) => sum + (Number(b.estimated_total_usd) || 0), 0) +
    safariBookings.reduce((sum, b) => sum + (Number(b.estimated_price_usd) || 0), 0)
  const totalRevenueEgp = aptBookings.reduce((sum, b) => sum + (Number(b.estimated_total_egp) || 0), 0)

  // Direct WhatsApp customer helper
  const openCustomerWhatsApp = (phone, name, details) => {
    if (!phone) {
      alert(isAr ? 'لم يقم العميل بإدخال رقم هاتف' : 'Customer did not provide a phone number')
      return
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '')
    const fullPhone = cleanPhone.startsWith('0') ? `2${cleanPhone}` : cleanPhone
    const text = isAr
      ? `مرحباً ${name || 'عزيزنا العميل'}، نتواصل معك من إدارة Sinai Booking بخصوص طلب حجزك (${details}).`
      : `Hello ${name || 'Guest'}, contacting you from Sinai Booking regarding your booking (${details}).`
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`, '_blank')
  }

  // ==========================================================
  // Login Screen (If not authenticated)
  // ==========================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#132724] text-[#E7D6C4] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#1B3632] border border-[#2D5A53] rounded-[28px] p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-[#254641] rounded-2xl flex items-center justify-center mx-auto text-[#E7D6C4] shadow-inner">
              <Shield size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              {isAr ? 'لوحة تحكم Sinai Booking' : 'Sinai Booking Admin'}
            </h1>
            <p className="text-xs sm:text-sm text-[#A5C0BA]">
              {isAr ? 'أدخل كلمة مرور الإدارة للوصول إلى الحجوزات وإدارة الموقع' : 'Enter admin password to manage bookings & website rooms'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#CBDED9] mb-1.5 uppercase tracking-wider">
                {isAr ? 'كلمة المرور / الرمز السري' : 'Admin Passcode'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={isAr ? 'أدخل كلمة المرور (الافتراضية: sinai2026)' : 'Enter password (default: sinai2026)'}
                  className="w-full bg-[#132724] border border-[#2D5A53] rounded-xl px-4 py-3 text-white placeholder-[#688E86] text-sm focus:outline-none focus:ring-2 focus:ring-[#C45437]"
                  autoFocus
                />
                <Lock size={16} className="absolute right-3.5 rtl:right-auto rtl:left-3.5 top-3.5 text-[#688E86]" />
              </div>
              {loginError && (
                <p className="text-xs text-[#FF8A7A] mt-1.5 font-medium flex items-center gap-1">
                  <AlertCircle size={13} />
                  <span>{loginError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#C45437] hover:bg-[#A9432B] text-white font-semibold text-sm shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              {isAr ? 'تسجيل الدخول إلى الداشبورد' : 'Login to Dashboard'}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={onNavigateHome}
              className="text-xs text-[#8BAAA3] hover:text-white transition-colors cursor-pointer"
            >
              ← {isAr ? 'العودة للموقع الرئيسي' : 'Return to website'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================================
  // Main Dashboard View
  // ==========================================================
  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#22211F] font-sans">
      
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-[#132724] text-[#E7D6C4] border-b border-[#2D5A53] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 group cursor-pointer"
              title={isAr ? 'زيارة الموقع' : 'Visit website'}
            >
              <div className="w-10 h-10 rounded-xl bg-[#254641] flex items-center justify-center text-[#E7D6C4] font-serif font-bold text-lg">
                SB
              </div>
              <div>
                <span className="font-serif font-bold text-base sm:text-lg text-white block leading-tight">
                  Sinai Booking Admin
                </span>
                <span className="text-[11px] text-[#A5C0BA] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse"></span>
                  {isAr ? 'قاعدة بيانات سوبابيز متصلة لايف' : 'Live Supabase Connected'}
                </span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              disabled={loading}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#254641] hover:bg-[#2F5751] text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
              title={isAr ? 'تحديث البيانات' : 'Refresh Data'}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{isAr ? 'تحديث' : 'Refresh'}</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6EF]/10 hover:bg-[#FAF6EF]/20 text-xs text-white transition-all cursor-pointer"
            >
              <Eye size={14} />
              <span>{isAr ? 'معاينة الموقع' : 'Preview Site'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#C45437]/20 hover:bg-[#C45437] text-[#FF8A7A] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title={isAr ? 'تسجيل الخروج' : 'Log out'}
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">{isAr ? 'خروج' : 'Logout'}</span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-[#183430] border-t border-[#254641] overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 py-1.5">
            {[
              { id: 'overview', labelAr: 'لوحة الإحصائيات', labelEn: 'Overview', icon: TrendingUp },
              { id: 'apartments', labelAr: 'إدارة الغرف والشقق', labelEn: 'Rooms & Units', icon: Building2, count: apartments.length },
              { id: 'apt-bookings', labelAr: 'حجوزات الشقق', labelEn: 'Apartment Bookings', icon: Calendar, count: aptBookings.length },
              { id: 'safari-bookings', labelAr: 'حجوزات السفاري', labelEn: 'Safari Bookings', icon: Compass, count: safariBookings.length },
              { id: 'transfer-bookings', labelAr: 'الانتقالات والمواصلات', labelEn: 'Transfers', icon: Bus, count: transferBookings.length },
              { id: 'subscribers', labelAr: 'النشرة البريدية', labelEn: 'Subscribers', icon: Mail, count: subscribers.length },
            ].map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#C45437] text-white font-bold shadow'
                      : 'text-[#CBDED9] hover:bg-[#254641] hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      active ? 'bg-white/20 text-white' : 'bg-[#132724] text-[#A5C0BA]'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Status Notification Toast */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#132724] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#34D399] flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} className="text-[#34D399]" />
          <span className="text-xs sm:text-sm font-medium">{statusMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ==========================================================
            TAB 1: OVERVIEW DASHBOARD
            ========================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white rounded-[24px] p-6 border border-[#E7DFCE] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[#7A7367]">
                  <span className="text-xs font-bold uppercase tracking-wider">{isAr ? 'إجمالي الحجوزات' : 'Total Bookings'}</span>
                  <div className="w-8 h-8 rounded-lg bg-[#FAF5ED] text-[#C45437] flex items-center justify-center">
                    <Layers size={18} />
                  </div>
                </div>
                <div className="text-3xl font-serif font-bold text-[#22211F]">
                  {totalBookingsCount}
                </div>
                <p className="text-[11px] text-[#7A7367]">
                  {aptBookings.length} {isAr ? 'شقق' : 'apartments'} · {safariBookings.length} {isAr ? 'سفاري' : 'safaris'} · {transferBookings.length} {isAr ? 'نقل' : 'transfers'}
                </p>
              </div>

              <div className="bg-white rounded-[24px] p-6 border border-[#E7DFCE] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[#7A7367]">
                  <span className="text-xs font-bold uppercase tracking-wider">{isAr ? 'الإيرادات التقديرية' : 'Estimated USD'}</span>
                  <div className="w-8 h-8 rounded-lg bg-[#E2ECE5] text-[#2A6543] flex items-center justify-center">
                    <DollarSign size={18} />
                  </div>
                </div>
                <div className="text-3xl font-serif font-bold text-[#2A6543]">
                  ${totalRevenueUsd.toLocaleString()}
                </div>
                <p className="text-[11px] text-[#7A7367]">
                  {totalRevenueEgp > 0 ? `${totalRevenueEgp.toLocaleString()} EGP` : (isAr ? 'حسب الحجوزات المسجلة' : 'From logged bookings')}
                </p>
              </div>

              <div className="bg-white rounded-[24px] p-6 border border-[#E7DFCE] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[#7A7367]">
                  <span className="text-xs font-bold uppercase tracking-wider">{isAr ? 'الغرف النشطة' : 'Active Units'}</span>
                  <div className="w-8 h-8 rounded-lg bg-[#FAF5ED] text-[#132724] flex items-center justify-center">
                    <Building2 size={18} />
                  </div>
                </div>
                <div className="text-3xl font-serif font-bold text-[#22211F]">
                  {apartments.filter(a => a.is_available).length} <span className="text-sm font-normal text-[#7A7367]">/ {apartments.length}</span>
                </div>
                <p className="text-[11px] text-[#7A7367]">
                  {isAr ? 'جاهزة للحجز الفوري بالموقع' : 'Live for bookings on site'}
                </p>
              </div>

              <div className="bg-white rounded-[24px] p-6 border border-[#E7DFCE] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[#7A7367]">
                  <span className="text-xs font-bold uppercase tracking-wider">{isAr ? 'المشتركون بالمدونة' : 'Subscribers'}</span>
                  <div className="w-8 h-8 rounded-lg bg-[#FAF5ED] text-[#C45437] flex items-center justify-center">
                    <Mail size={18} />
                  </div>
                </div>
                <div className="text-3xl font-serif font-bold text-[#22211F]">
                  {subscribers.length}
                </div>
                <p className="text-[11px] text-[#7A7367]">
                  {isAr ? 'مشترك بالنشرة البريدية' : 'Newsletter email leads'}
                </p>
              </div>

            </div>

            {/* Quick Actions & Recent Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Recent Bookings */}
              <div className="lg:col-span-8 bg-white rounded-[28px] p-6 sm:p-8 border border-[#E7DFCE] shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-[#22211F]">
                      {isAr ? 'أحدث حجوزات الشقق الواردة' : 'Recent Apartment Requests'}
                    </h2>
                    <p className="text-xs text-[#7A7367]">
                      {isAr ? 'الطلبات المسجلة من الموقع مباشرة' : 'Direct bookings from website guests'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('apt-bookings')}
                    className="text-xs font-bold text-[#C45437] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{isAr ? 'عرض الكل' : 'View All'}</span>
                    <ChevronRight size={14} className="rtl:rotate-180" />
                  </button>
                </div>

                {aptBookings.length === 0 ? (
                  <div className="py-10 text-center text-[#7A7367] space-y-2">
                    <Calendar size={32} className="mx-auto text-[#D9D0C2]" />
                    <p className="text-sm font-medium">{isAr ? 'لا توجد حجوزات مسجلة بعد' : 'No bookings logged yet'}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#F0E9DC]">
                    {aptBookings.slice(0, 5).map((b) => (
                      <div key={b.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#22211F]">
                              {b.customer_name || (isAr ? 'عميل بدون اسم' : 'Unnamed Guest')}
                            </span>
                            <span className="text-xs text-[#7A7367]">· {b.apartment_name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              b.status === 'confirmed' ? 'bg-[#E2ECE5] text-[#2A6543]' :
                              b.status === 'cancelled' ? 'bg-[#FFECEB] text-[#D93829]' :
                              'bg-[#FAF0E4] text-[#C45437]'
                            }`}>
                              {b.status || 'pending'}
                            </span>
                          </div>
                          <div className="text-xs text-[#7A7367] flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>📅 {b.check_in_date || 'N/A'} → {b.check_out_date || 'N/A'}</span>
                            <span>👥 {b.guests_count} {isAr ? 'أفراد' : 'guests'}</span>
                            {b.transportation_station && b.transportation_station !== 'None' && (
                              <span>🚐 {b.transportation_station}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {b.customer_phone && (
                            <button
                              onClick={() => openCustomerWhatsApp(b.customer_phone, b.customer_name, b.apartment_name)}
                              className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                            >
                              <MessageCircle size={13} />
                              <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                            </button>
                          )}
                          <select
                            value={b.status || 'pending'}
                            onChange={(e) => handleUpdateStatus('apartment_bookings', b.id, e.target.value)}
                            className="text-xs font-semibold bg-[#FAF5ED] border border-[#E7DFCE] rounded-xl px-2.5 py-1.5 text-[#22211F] focus:outline-none"
                          >
                            <option value="pending">⏳ {isAr ? 'قيد الانتظار' : 'Pending'}</option>
                            <option value="confirmed">✅ {isAr ? 'مؤكد' : 'Confirmed'}</option>
                            <option value="cancelled">❌ {isAr ? 'ملغي' : 'Cancelled'}</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Quick Management & Rooms Shortcut */}
              <div className="lg:col-span-4 space-y-6">
                
                <div className="bg-[#132724] text-[#E7D6C4] rounded-[28px] p-6 sm:p-7 border border-[#2D5A53] shadow-md space-y-5">
                  <div className="space-y-1">
                    <span className="text-[11px] text-[#A5C0BA] uppercase tracking-wider font-semibold block">
                      {isAr ? 'إجراءات سريعة' : 'Quick Actions'}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white">
                      {isAr ? 'إدارة وحدات دهب' : 'Dahab Units CMS'}
                    </h3>
                  </div>

                  <p className="text-xs text-[#CBDED9] leading-relaxed">
                    {isAr
                      ? 'يمكنك إضافة شقق واستوديوهات جديدة في دهب بأسعارها وصورها ومميزاتها لتظهر للزوار فوراً.'
                      : 'Add new rooms & studios in Dahab with custom rates, photos, and features.'}
                  </p>

                  <div className="space-y-2 pt-1">
                    <button
                      onClick={handleOpenAddRoom}
                      className="w-full py-3 px-4 rounded-xl bg-[#C45437] hover:bg-[#A9432B] text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>{isAr ? 'إضافة شقة / استوديو جديد' : 'Add New Room / Studio'}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('apartments')}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#254641] hover:bg-[#2F5751] text-white text-xs font-medium text-center transition-all cursor-pointer"
                    >
                      {isAr ? 'استعراض كل الغرف وتعديلها' : 'Manage All Rooms'}
                    </button>
                  </div>
                </div>

                {/* Direct Line Note */}
                <div className="bg-white rounded-[24px] p-6 border border-[#E7DFCE] text-xs space-y-2 text-[#7A7367]">
                  <span className="font-bold text-[#22211F] block">{isAr ? 'خط الحجوزات الرسمي:' : 'Official Booking Line:'}</span>
                  <div className="flex items-center gap-2 font-mono font-bold text-[#2A6543] text-sm">
                    <Phone size={15} />
                    <span>01116664591 (+20)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {isAr
                      ? 'يتم توجيه كافة رسائل واتساب الموقع تلقائياً لهذا الرقم ومحفظة فودافون كاش.'
                      : 'All website booking messages are routed to this WhatsApp and wallet.'}
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==========================================================
            TAB 2: APARTMENTS & ROOMS CMS
            ========================================================== */}
        {activeTab === 'apartments' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#22211F]">
                  {isAr ? 'إدارة الشقق والغرف (Rooms CMS)' : 'Rooms & Units Management'}
                </h2>
                <p className="text-xs sm:text-sm text-[#7A7367]">
                  {isAr ? 'أضف وعدل وامسح الغرف والأسعار والصور المعروضة في الموقع' : 'Add, edit, and delete rooms, prices, and photos displayed on the website'}
                </p>
              </div>

              <button
                onClick={handleOpenAddRoom}
                className="py-3 px-5 rounded-2xl bg-[#C45437] hover:bg-[#A9432B] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Plus size={18} />
                <span>{isAr ? 'إضافة شقة جديدة' : 'Add New Apartment'}</span>
              </button>
            </div>

            {/* Rooms Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apartments.map((room) => (
                <div
                  key={room.id || room.code}
                  className="bg-white rounded-[24px] border border-[#E7DFCE] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Room Cover Photo */}
                    <div className="relative aspect-[16/10] bg-[#FAF5ED] overflow-hidden">
                      <img
                        src={room.images?.[0] || '/images/duplex-hero-loft.jpg'}
                        alt={room.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          room.is_available
                            ? 'bg-[#E2ECE5] text-[#2A6543]'
                            : 'bg-[#FFECEB] text-[#D93829]'
                        }`}>
                          {room.is_available ? (isAr ? 'متاحة للحجز' : 'Available') : (isAr ? 'غير متاحة' : 'Disabled')}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3">
                        <span className="px-2.5 py-1 bg-[#132724]/90 backdrop-blur text-[#E7D6C4] font-mono text-xs rounded-lg">
                          code: {room.code}
                        </span>
                      </div>
                    </div>

                    {/* Room Content */}
                    <div className="p-5 space-y-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#C45437] uppercase tracking-wider block">
                          {isAr ? room.badge_ar || room.badge : room.badge}
                        </span>
                        <h3 className="text-lg font-serif font-bold text-[#22211F]">
                          {isAr ? room.title_ar || room.title : room.title}
                        </h3>
                        <p className="text-xs text-[#7A7367] flex items-center gap-1">
                          <MapPin size={12} className="text-[#C45437]" />
                          <span>{isAr ? room.location_ar || room.location : room.location}</span>
                        </p>
                      </div>

                      <p className="text-xs text-[#6C6963] line-clamp-2 leading-relaxed">
                        {isAr ? room.description_ar || room.description : room.description}
                      </p>

                      {/* Pricing Info */}
                      <div className="pt-2 border-t border-[#F0E9DC] flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-[#7A7367] block">{isAr ? 'السعر اليومي:' : 'Daily Rate:'}</span>
                          <span className="font-bold text-[#22211F]">${room.price_usd} · {Number(room.price_egp).toLocaleString()} جم</span>
                        </div>
                        {room.monthly_usd && (
                          <div className="text-right rtl:text-left">
                            <span className="text-[10px] text-[#7A7367] block">{isAr ? 'السعر الشهري:' : 'Monthly:'}</span>
                            <span className="font-bold text-[#2A6543]">${room.monthly_usd}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 bg-[#FAF5ED] border-t border-[#E7DFCE] flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleRoomAvailability(room)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        room.is_available
                          ? 'bg-[#FFECEB] text-[#D93829] hover:bg-[#FFD9D6]'
                          : 'bg-[#E2ECE5] text-[#2A6543] hover:bg-[#CDE3D3]'
                      }`}
                    >
                      {room.is_available ? (isAr ? 'تعطيل' : 'Disable') : (isAr ? 'تفعيل' : 'Enable')}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditRoom(room)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF5ED] border border-[#D9D0C2] text-xs font-semibold text-[#22211F] flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Edit2 size={13} />
                        <span>{isAr ? 'تعديل' : 'Edit'}</span>
                      </button>

                      {apartments.length > 1 && (
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="p-1.5 rounded-xl bg-white hover:bg-[#FFECEB] border border-[#D9D0C2] text-[#D93829] transition-all cursor-pointer"
                          title={isAr ? 'حذف' : 'Delete'}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==========================================================
            TAB 3: APARTMENT BOOKINGS
            ========================================================== */}
        {activeTab === 'apt-bookings' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#22211F]">
                  {isAr ? 'حجوزات الشقق والإقامة' : 'Apartment Bookings'}
                </h2>
                <p className="text-xs text-[#7A7367]">
                  {isAr ? 'إجمالي الحجوزات:' : 'Total bookings:'} {aptBookings.length}
                </p>
              </div>

              {/* Search input */}
              <div className="relative max-w-xs w-full">
                <input
                  type="text"
                  placeholder={isAr ? 'بحث بالاسم أو الهاتف...' : 'Search by name or phone...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-white border border-[#D9D0C2] rounded-xl pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 text-[#22211F] focus:outline-none focus:ring-2 focus:ring-[#C45437]"
                />
                <Search size={14} className="absolute left-3 rtl:left-auto rtl:right-3 top-2.5 text-[#7A7367]" />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[24px] border border-[#E7DFCE] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right text-xs">
                  <thead className="bg-[#FAF5ED] text-[#7A7367] uppercase font-bold text-[11px] border-b border-[#E7DFCE]">
                    <tr>
                      <th className="px-4 py-3.5">{isAr ? 'العميل' : 'Customer'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'الوحدة' : 'Unit'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'التواريخ' : 'Dates'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'الضيوف' : 'Guests'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'انتقال القاهرة' : 'Cairo Transport'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'طريقة الدفع' : 'Payment'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'السعر' : 'Total'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'الحالة' : 'Status'}</th>
                      <th className="px-4 py-3.5 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E9DC]">
                    {aptBookings
                      .filter(b => {
                        if (!searchQuery) return true
                        const q = searchQuery.toLowerCase()
                        return (
                          (b.customer_name || '').toLowerCase().includes(q) ||
                          (b.customer_phone || '').includes(q) ||
                          (b.apartment_name || '').toLowerCase().includes(q)
                        )
                      })
                      .map((b) => (
                        <tr key={b.id} className="hover:bg-[#FAF8F3] transition-colors">
                          <td className="px-4 py-3 font-semibold text-[#22211F]">
                            <div>{b.customer_name || (isAr ? 'غير مسجل' : 'Unnamed')}</div>
                            <div className="text-[11px] text-[#7A7367] font-mono">{b.customer_phone || '—'}</div>
                            <span className="text-[10px] text-[#C45437] font-normal">{b.nationality === 'foreign' ? '🌍 Foreign' : '🇪🇬 Egyptian'}</span>
                          </td>
                          <td className="px-4 py-3 text-[#22211F]">
                            <div className="font-medium">{b.apartment_name}</div>
                            <span className="text-[10px] text-[#7A7367]">{b.stay_type === 'monthly' ? (isAr ? 'إقامة شهرية' : 'Monthly') : (isAr ? 'إقامة يومية' : 'Daily')}</span>
                          </td>
                          <td className="px-4 py-3 text-[#5A554E] whitespace-nowrap">
                            <div>{b.check_in_date || '—'}</div>
                            <div className="text-[10px] text-[#7A7367]">→ {b.check_out_date || '—'}</div>
                          </td>
                          <td className="px-4 py-3 text-[#22211F]">
                            <span>{b.guests_count || 1} {isAr ? 'بالغ' : 'adults'}</span>
                            {b.children_count > 0 && <span className="text-[#7A7367] block text-[10px]">+{b.children_count} {isAr ? 'أطفال' : 'children'}</span>}
                          </td>
                          <td className="px-4 py-3 text-[#5A554E] text-[11px]">
                            {b.transportation_station || 'None'}
                          </td>
                          <td className="px-4 py-3 text-[#5A554E]">
                            <span className="px-2 py-0.5 rounded-md bg-[#FAF5ED] font-mono text-[10px]">
                              {b.payment_method || 'wallet'}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-[#2A6543] whitespace-nowrap">
                            ${b.estimated_total_usd || '—'}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={b.status || 'pending'}
                              onChange={(e) => handleUpdateStatus('apartment_bookings', b.id, e.target.value)}
                              className="text-[11px] font-semibold bg-[#FAF5ED] border border-[#E7DFCE] rounded-lg px-2 py-1 text-[#22211F]"
                            >
                              <option value="pending">⏳ {isAr ? 'معلق' : 'Pending'}</option>
                              <option value="confirmed">✅ {isAr ? 'مؤكد (يقفل المعاد)' : 'Confirmed (Locks dates)'}</option>
                              <option value="cancelled">❌ {isAr ? 'ملغي' : 'Cancelled'}</option>
                            </select>
                            {b.status === 'confirmed' && (
                              <div className="mt-1">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200 shadow-2xs">
                                  <Lock size={10} className="text-green-600" />
                                  <span>{isAr ? 'مقفل على الموقع' : 'Locked on site'}</span>
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {b.customer_phone && (
                                <button
                                  onClick={() => openCustomerWhatsApp(b.customer_phone, b.customer_name, b.apartment_name)}
                                  className="p-1.5 rounded-lg bg-[#25D366] text-white hover:bg-[#20BA5A] transition-all cursor-pointer"
                                  title="WhatsApp"
                                >
                                  <MessageCircle size={14} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteBooking('apartment_bookings', b.id)}
                                className="p-1.5 rounded-lg text-[#D93829] hover:bg-[#FFECEB] transition-all cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 4: SAFARI BOOKINGS
            ========================================================== */}
        {activeTab === 'safari-bookings' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#22211F]">
                {isAr ? 'حجوزات رحلات السفاري' : 'Safari & Tour Bookings'}
              </h2>
              <p className="text-xs text-[#7A7367]">
                {isAr ? 'إجمالي طلبات السفاري:' : 'Total safari requests:'} {safariBookings.length}
              </p>
            </div>

            <div className="bg-white rounded-[24px] border border-[#E7DFCE] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right text-xs">
                  <thead className="bg-[#FAF5ED] text-[#7A7367] uppercase font-bold text-[11px] border-b border-[#E7DFCE]">
                    <tr>
                      <th className="px-4 py-3.5">{isAr ? 'العميل' : 'Customer'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'الرحلة' : 'Tour'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'التاريخ' : 'Date'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'الأفراد' : 'Guests'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'الكامب' : 'Camp'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'انتقال القاهرة' : 'Cairo Transport'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'الحالة' : 'Status'}</th>
                      <th className="px-4 py-3.5 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E9DC]">
                    {safariBookings.map((s) => (
                      <tr key={s.id} className="hover:bg-[#FAF8F3] transition-colors">
                        <td className="px-4 py-3 font-semibold text-[#22211F]">
                          <div>{s.customer_name || (isAr ? 'غير مسجل' : 'Unnamed')}</div>
                          <div className="text-[11px] text-[#7A7367] font-mono">{s.customer_phone || '—'}</div>
                        </td>
                        <td className="px-4 py-3 text-[#22211F] font-medium">
                          {s.tour_name}
                        </td>
                        <td className="px-4 py-3 text-[#5A554E] whitespace-nowrap">
                          {s.tour_date || '—'}
                        </td>
                        <td className="px-4 py-3 text-[#22211F]">
                          {s.travelers_count} {isAr ? 'أفراد' : 'guests'}
                        </td>
                        <td className="px-4 py-3 text-[#5A554E]">
                          {s.preferred_camp ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#E2ECE5] text-[#2A6543] font-medium text-[10px]">
                              {s.preferred_camp}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-3 text-[#5A554E] text-[11px]">
                          {s.transportation_station || 'None'}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={s.status || 'pending'}
                            onChange={(e) => handleUpdateStatus('safari_bookings', s.id, e.target.value)}
                            className="text-[11px] font-semibold bg-[#FAF5ED] border border-[#E7DFCE] rounded-lg px-2 py-1 text-[#22211F]"
                          >
                            <option value="pending">⏳ {isAr ? 'معلق' : 'Pending'}</option>
                            <option value="confirmed">✅ {isAr ? 'مؤكد' : 'Confirmed'}</option>
                            <option value="cancelled">❌ {isAr ? 'ملغي' : 'Cancelled'}</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {s.customer_phone && (
                              <button
                                onClick={() => openCustomerWhatsApp(s.customer_phone, s.customer_name, s.tour_name)}
                                className="p-1.5 rounded-lg bg-[#25D366] text-white hover:bg-[#20BA5A] transition-all cursor-pointer"
                              >
                                <MessageCircle size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteBooking('safari_bookings', s.id)}
                              className="p-1.5 rounded-lg text-[#D93829] hover:bg-[#FFECEB] transition-all cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 5: TRANSFERS & BUS BOOKINGS
            ========================================================== */}
        {activeTab === 'transfer-bookings' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#22211F]">
                {isAr ? 'حجوزات الباصات والانتقالات' : 'Bus & Transfer Bookings'}
              </h2>
              <p className="text-xs text-[#7A7367]">
                {isAr ? 'إجمالي الطلبات:' : 'Total transfer requests:'} {transferBookings.length}
              </p>
            </div>

            <div className="bg-white rounded-[24px] border border-[#E7DFCE] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right text-xs">
                  <thead className="bg-[#FAF5ED] text-[#7A7367] uppercase font-bold text-[11px] border-b border-[#E7DFCE]">
                    <tr>
                      <th className="px-4 py-3.5">{isAr ? 'العميل' : 'Customer'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'المركبة' : 'Vehicle'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'المسار (من → إلى)' : 'Route'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'التاريخ' : 'Date'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'الركاب' : 'Passengers'}</th>
                      <th className="px-4 py-3.5">{isAr ? 'الحالة' : 'Status'}</th>
                      <th className="px-4 py-3.5 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E9DC]">
                    {transferBookings.map((t) => (
                      <tr key={t.id} className="hover:bg-[#FAF8F3] transition-colors">
                        <td className="px-4 py-3 font-semibold text-[#22211F]">
                          <div>{t.customer_name || (isAr ? 'غير مسجل' : 'Unnamed')}</div>
                          <div className="text-[11px] text-[#7A7367] font-mono">{t.customer_phone || '—'}</div>
                        </td>
                        <td className="px-4 py-3 text-[#22211F]">
                          <span className="px-2.5 py-1 rounded-lg bg-[#FAF5ED] font-semibold text-[11px]">
                            {t.service_type === 'private_car' ? (isAr ? '🚗 ملاكي خاصة' : '🚗 Private Car') : (isAr ? '🚐 باص هايس' : '🚐 Hiace Bus')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#22211F]">
                          <div className="font-semibold">{t.pickup_location}</div>
                          <div className="text-[#7A7367] text-[11px]">→ {t.dropoff_location}</div>
                        </td>
                        <td className="px-4 py-3 text-[#5A554E] whitespace-nowrap">
                          {t.travel_date || '—'}
                        </td>
                        <td className="px-4 py-3 text-[#22211F]">
                          {t.passengers_count} {isAr ? 'ركاب' : 'passengers'}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={t.status || 'pending'}
                            onChange={(e) => handleUpdateStatus('transfer_bookings', t.id, e.target.value)}
                            className="text-[11px] font-semibold bg-[#FAF5ED] border border-[#E7DFCE] rounded-lg px-2 py-1 text-[#22211F]"
                          >
                            <option value="pending">⏳ {isAr ? 'معلق' : 'Pending'}</option>
                            <option value="confirmed">✅ {isAr ? 'مؤكد' : 'Confirmed'}</option>
                            <option value="cancelled">❌ {isAr ? 'ملغي' : 'Cancelled'}</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {t.customer_phone && (
                              <button
                                onClick={() => openCustomerWhatsApp(t.customer_phone, t.customer_name, `${t.pickup_location} to ${t.dropoff_location}`)}
                                className="p-1.5 rounded-lg bg-[#25D366] text-white hover:bg-[#20BA5A] transition-all cursor-pointer"
                              >
                                <MessageCircle size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteBooking('transfer_bookings', t.id)}
                              className="p-1.5 rounded-lg text-[#D93829] hover:bg-[#FFECEB] transition-all cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 6: NEWSLETTER SUBSCRIBERS
            ========================================================== */}
        {activeTab === 'subscribers' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#22211F]">
                  {isAr ? 'المشتركون في النشرة البريدية' : 'Newsletter Subscribers'}
                </h2>
                <p className="text-xs text-[#7A7367]">
                  {isAr ? 'إجمالي الإيميلات المسجلة:' : 'Total subscriber emails:'} {subscribers.length}
                </p>
              </div>

              <button
                onClick={() => {
                  const emails = subscribers.map(s => s.email).join(', ')
                  navigator.clipboard.writeText(emails)
                  showNotification(isAr ? 'تم نسخ جميع الإيميلات إلى الحافظة' : 'Copied all emails to clipboard')
                }}
                className="px-4 py-2 rounded-xl bg-[#254641] hover:bg-[#2F5751] text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>{isAr ? 'نسخ كل الإيميلات' : 'Copy All Emails'}</span>
              </button>
            </div>

            <div className="bg-white rounded-[24px] border border-[#E7DFCE] overflow-hidden shadow-sm">
              <div className="divide-y divide-[#F0E9DC]">
                {subscribers.map((sub, idx) => (
                  <div key={sub.id || idx} className="p-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#FAF5ED] text-[#C45437] flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <span className="font-semibold text-[#22211F]">{sub.email}</span>
                      <span className="text-[10px] text-[#7A7367] bg-[#FAF5ED] px-2 py-0.5 rounded-full font-mono">
                        {sub.source || 'website'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#7A7367]">
                      {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ==========================================================
          MODAL: ADD / EDIT ROOM (APARTMENT CMS)
          ========================================================== */}
      {roomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[28px] max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-[#E7DFCE] shadow-2xl animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-[#F0E9DC] pb-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#22211F]">
                  {editingRoom ? (isAr ? 'تعديل بيانات الغرفة' : 'Edit Room Details') : (isAr ? 'إضافة شقة / استوديو جديد' : 'Add New Room / Studio')}
                </h3>
                <p className="text-xs text-[#7A7367]">
                  {isAr ? 'ستنعكس التعديلات على صفحات الموقع فور الحفظ' : 'Changes will immediately update the live website'}
                </p>
              </div>
              <button
                onClick={() => setRoomModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FAF5ED] hover:bg-[#F0E9DC] text-[#22211F] flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-4 text-xs">
              
              {/* Titles EN & AR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#22211F] mb-1">
                    {isAr ? 'اسم الشقة بالإنجليزية' : 'Room Title (English)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={roomFormData.title}
                    onChange={(e) => setRoomFormData({ ...roomFormData, title: e.target.value })}
                    placeholder="e.g. Mashraba duplex (Studio 2)"
                    className="w-full bg-[#FAF5ED] border border-[#D9D0C2] rounded-xl px-3.5 py-2.5 text-[#22211F] focus:outline-none focus:ring-2 focus:ring-[#C45437]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#22211F] mb-1">
                    {isAr ? 'اسم الشقة بالعربية' : 'Room Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={roomFormData.title_ar}
                    onChange={(e) => setRoomFormData({ ...roomFormData, title_ar: e.target.value })}
                    placeholder="مثال: استوديو دوبلكس مشربه (Studio 2)"
                    className="w-full bg-[#FAF5ED] border border-[#D9D0C2] rounded-xl px-3.5 py-2.5 text-[#22211F] focus:outline-none focus:ring-2 focus:ring-[#C45437]"
                  />
                </div>
              </div>

              {/* Code & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#22211F] mb-1">
                    {isAr ? 'كود الوحدة (Backend ID)' : 'Unit Code (Unique)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={roomFormData.code}
                    onChange={(e) => setRoomFormData({ ...roomFormData, code: e.target.value })}
                    placeholder="e.g. studio-2"
                    className="w-full bg-[#FAF5ED] border border-[#D9D0C2] rounded-xl px-3 py-2 text-[#22211F] font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#22211F] mb-1">
                    {isAr ? 'الموقع' : 'Location'}
                  </label>
                  <input
                    type="text"
                    value={roomFormData.location}
                    onChange={(e) => setRoomFormData({ ...roomFormData, location: e.target.value })}
                    placeholder="Dahab - Mashraba"
                    className="w-full bg-[#FAF5ED] border border-[#D9D0C2] rounded-xl px-3 py-2 text-[#22211F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#22211F] mb-1">
                    {isAr ? 'السعة القصوى (أفراد)' : 'Max Guests'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={roomFormData.max_guests}
                    onChange={(e) => setRoomFormData({ ...roomFormData, max_guests: Number(e.target.value) })}
                    className="w-full bg-[#FAF5ED] border border-[#D9D0C2] rounded-xl px-3 py-2 text-[#22211F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Pricing USD & EGP */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF5ED] p-3.5 rounded-2xl border border-[#E7DFCE]">
                <div>
                  <label className="block text-[11px] font-bold text-[#7A7367] mb-1">{isAr ? 'يومي ($)' : 'Daily ($)'}</label>
                  <input
                    type="number"
                    value={roomFormData.price_usd}
                    onChange={(e) => setRoomFormData({ ...roomFormData, price_usd: Number(e.target.value) })}
                    className="w-full bg-white border border-[#D9D0C2] rounded-xl px-3 py-1.5 font-bold text-[#22211F]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#7A7367] mb-1">{isAr ? 'يومي (جم)' : 'Daily (EGP)'}</label>
                  <input
                    type="number"
                    value={roomFormData.price_egp}
                    onChange={(e) => setRoomFormData({ ...roomFormData, price_egp: Number(e.target.value) })}
                    className="w-full bg-white border border-[#D9D0C2] rounded-xl px-3 py-1.5 font-bold text-[#22211F]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#7A7367] mb-1">{isAr ? 'شهري ($)' : 'Monthly ($)'}</label>
                  <input
                    type="number"
                    value={roomFormData.monthly_usd}
                    onChange={(e) => setRoomFormData({ ...roomFormData, monthly_usd: Number(e.target.value) })}
                    className="w-full bg-white border border-[#D9D0C2] rounded-xl px-3 py-1.5 font-bold text-[#2A6543]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#7A7367] mb-1">{isAr ? 'شهري (جم)' : 'Monthly (EGP)'}</label>
                  <input
                    type="number"
                    value={roomFormData.monthly_egp}
                    onChange={(e) => setRoomFormData({ ...roomFormData, monthly_egp: Number(e.target.value) })}
                    className="w-full bg-white border border-[#D9D0C2] rounded-xl px-3 py-1.5 font-bold text-[#2A6543]"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#22211F] mb-1">
                    {isAr ? 'الوصف بالعربية' : 'Description (Arabic)'}
                  </label>
                  <textarea
                    rows="3"
                    value={roomFormData.description_ar}
                    onChange={(e) => setRoomFormData({ ...roomFormData, description_ar: e.target.value })}
                    placeholder="وصف تفصيلي للغرفة ومميزاتها..."
                    className="w-full bg-[#FAF5ED] border border-[#D9D0C2] rounded-xl p-3 text-[#22211F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#22211F] mb-1">
                    {isAr ? 'الوصف بالإنجليزية' : 'Description (English)'}
                  </label>
                  <textarea
                    rows="3"
                    value={roomFormData.description}
                    onChange={(e) => setRoomFormData({ ...roomFormData, description: e.target.value })}
                    placeholder="Detailed room features..."
                    className="w-full bg-[#FAF5ED] border border-[#D9D0C2] rounded-xl p-3 text-[#22211F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Photos URLs */}
              <div>
                <label className="block font-bold text-[#22211F] mb-1">
                  {isAr ? 'روابط صور الغرفة (رابط في كل سطر)' : 'Image URLs (one per line)'}
                </label>
                <textarea
                  rows="3"
                  value={imageInputText}
                  onChange={(e) => setImageInputText(e.target.value)}
                  placeholder="/images/duplex-hero-loft.jpg&#10;/images/duplex-full-structure.jpg"
                  className="w-full bg-[#FAF5ED] border border-[#D9D0C2] rounded-xl p-3 text-[#22211F] font-mono text-[11px] focus:outline-none"
                />
              </div>

              {/* Availability checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={roomFormData.is_available}
                  onChange={(e) => setRoomFormData({ ...roomFormData, is_available: e.target.checked })}
                  className="rounded text-[#C45437] focus:ring-[#C45437] w-4 h-4"
                />
                <span className="font-semibold text-xs text-[#22211F]">
                  {isAr ? 'تفعيل هذه الغرفة وإظهارها فوراً في الموقع للزوار' : 'Make this room available on the website'}
                </span>
              </label>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0E9DC]">
                <button
                  type="button"
                  onClick={() => setRoomModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#D9D0C2] hover:bg-[#FAF5ED] text-[#7A7367] font-semibold transition-all cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C45437] hover:bg-[#A9432B] text-white font-bold shadow-md transition-all cursor-pointer"
                >
                  {editingRoom ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'إضافة الغرفة' : 'Create Room')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  )
}
