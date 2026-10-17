import React, { useState } from 'react'
import {
  ArrowUpRight,
  ArrowRight,
  X,
  Clock,
  BookOpen,
  Share2,
  Check,
  Sparkles,
  MessageCircle
} from 'lucide-react'
import { saveNewsletterSubscriber } from '../lib/supabase'

export default function BlogPage({ t, lang, onNavigateHome }) {
  const page = t.blogPage
  const isAr = lang === 'ar'

  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedStory, setSelectedStory] = useState(null)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // Filter stories by category
  const filteredStories = activeCategory === 'all'
    ? page.stories
    : page.stories.filter(s => s.category === activeCategory)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (newsletterEmail.trim()) {
      const emailToSave = newsletterEmail.trim()
      setSubscribed(true)
      setNewsletterEmail('')
      await saveNewsletterSubscriber(emailToSave, 'blog')
      setTimeout(() => setSubscribed(false), 5000)
    }
  }

  const handleShareStory = (story) => {
    const text = isAr
      ? `اقرأ مقال "${story.title}" على مدونة Sinai Booking:`
      : `Read "${story.title}" on Sinai Booking Blog:`
    const url = window.location.href
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
  }

  return (
    <div className="bg-[#FAF6EF] text-[#22211F] animate-in fade-in duration-300">
      
      {/* 1. Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs font-medium text-[#8C867C]">
          <button
            onClick={onNavigateHome}
            className="hover:text-[#C8553D] transition-colors cursor-pointer"
          >
            {page.breadcrumbHome}
          </button>
          <span>/</span>
          <span className="text-[#22211F] font-semibold">{page.breadcrumbCurrent}</span>
        </nav>
      </div>

      {/* 2. Top Hero Section */}
      <section className="pt-6 pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Heading & Handwritten Note */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold tracking-[0.16em] text-[#C45437] uppercase">
                  {page.hero.badge}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-bold text-[#183B33] tracking-tight leading-[1.08] whitespace-pre-line">
                {page.hero.title}
              </h1>

              <p className="text-base sm:text-lg text-[#656057] font-normal leading-relaxed max-w-xl">
                {page.hero.subtitle}
              </p>

              {/* Handwritten Script Note: "notes from the road" */}
              <div className="pt-2">
                <span className={`${isAr ? 'font-scriptAr text-3xl' : 'font-script text-3xl sm:text-4xl'} text-[#C45437] inline-block -rotate-1`}>
                  {page.hero.handwritten}
                </span>
              </div>
            </div>

            {/* Right Column: Abstract Field Notes Graphic Artwork (Matching Exact Screenshot) */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/11] sm:aspect-[4/3] lg:aspect-[16/11] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-md border border-[#E0D5C3] bg-[#E8DFD1] p-6 sm:p-8 flex flex-col justify-between">
                
                {/* Top Label & Sun */}
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-mono font-bold tracking-[0.18em] text-[#4A463F] uppercase">
                    {page.hero.cardBadge}
                  </span>
                  {/* Terracotta Sun Circle */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#9E442B] shadow-sm"></div>
                </div>

                {/* Minimalist Desert Horizon Bands */}
                <div className="space-y-0 pt-8 w-4/5">
                  <div className="h-9 sm:h-11 bg-[#C6AB80] rounded-t-sm"></div>
                  <div className="h-16 sm:h-20 bg-[#985F3B] rounded-b-sm shadow-inner"></div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Section 2: "Stories, tips & local know-how" with Filters and 3 Cards */}
      <section className="pt-4 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="space-y-2 mb-8">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E1D1A] tracking-tight">
              {page.section.title}
            </h2>
            <p className="text-sm sm:text-base text-[#6B665E] max-w-2xl leading-relaxed">
              {page.section.subtitle}
            </p>
          </div>

          {/* Category Filter Pills (Matching Exact Screenshot) */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            {page.section.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#183B33] text-white shadow-sm'
                    : 'bg-white text-[#22211F] border border-[#D9D0C2] hover:bg-[#F2ECE1]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 3 Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
            {filteredStories.map((story) => (
              <article
                key={story.id}
                className="bg-white rounded-[22px] border border-[#E7DFCE] p-3.5 sm:p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
                onClick={() => setSelectedStory(story)}
              >
                {/* Visual Block (Matching the exact solid colored card blocks in screenshot) */}
                <div
                  className="aspect-[16/10] rounded-[16px] overflow-hidden mb-4 transition-transform duration-500 group-hover:scale-[1.02] shadow-inner relative flex items-center justify-center"
                  style={{ backgroundColor: story.color }}
                >
                  <span className="text-white/20 font-serif text-3xl font-bold tracking-widest select-none">
                    SB
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 justify-between space-y-4 px-1 pb-1">
                  <div className="space-y-2">
                    <span className="text-xs font-bold tracking-wider text-[#C45437] uppercase block">
                      {story.categoryLabel}
                    </span>
                    <h3 className="text-xl sm:text-[22px] font-serif font-bold text-[#22211F] leading-snug group-hover:text-[#C45437] transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#69645C] leading-relaxed pt-1">
                      {story.excerpt}
                    </p>
                  </div>

                  {/* Read Link: "5 MIN READ · READ STORY ↗" */}
                  <div className="pt-3 border-t border-[#F2EDE4]">
                    <span className="text-xs font-bold text-[#C45437] flex items-center gap-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                      <span>{story.time} · {story.action}</span>
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>

              </article>
            ))}
          </div>

          {/* 4. Section 3: In-line Newsletter Bar (Matching Exact Screenshot) */}
          <div className="mt-12 bg-[#12362E] text-white rounded-[20px] p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                {page.newsletter.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/70">
                {page.newsletter.subtitle}
              </p>
            </div>

            <div className="w-full md:w-auto">
              {subscribed ? (
                <div className="px-5 py-3 bg-white/10 border border-white/20 rounded-full text-xs sm:text-sm text-[#86EFAC] font-medium flex items-center gap-2">
                  <Check size={16} />
                  <span>{isAr ? 'تم الاشتراك بنجاح! شكراً لك.' : 'Subscribed successfully! Thank you.'}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative w-full sm:w-80">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={page.newsletter.placeholder}
                    required
                    className="w-full pl-5 pr-12 rtl:pr-5 rtl:pl-12 py-3.5 bg-[#EDE5D8] text-[#22211F] placeholder-[#7A7367] rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C45437]"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#12362E] text-white flex items-center justify-center hover:bg-[#1C4E43] transition-colors cursor-pointer"
                    title={page.newsletter.button}
                  >
                    <ArrowRight size={14} className="rtl:rotate-180" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 5. Article Reading Modal */}
      {selectedStory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="bg-[#FAF6EF] w-full max-w-2xl rounded-[28px] border border-[#E7DFCE] shadow-2xl p-6 sm:p-10 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#E7DFCE] pb-4">
              <div>
                <span className="text-xs font-bold tracking-wider text-[#C45437] uppercase">
                  {selectedStory.categoryLabel}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#22211F] mt-1">
                  {selectedStory.title}
                </h3>
                <span className="text-xs font-medium text-[#7A7367] mt-1 block">
                  {selectedStory.time}
                </span>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className="w-9 h-9 rounded-full bg-white border border-[#E3DBD0] flex items-center justify-center text-[#6C6963] hover:text-black cursor-pointer shadow-sm flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Visual Header */}
            <div
              className="aspect-[16/7] rounded-[18px] overflow-hidden flex items-center justify-center shadow-inner"
              style={{ backgroundColor: selectedStory.color }}
            >
              <span className="text-white/40 font-serif text-2xl font-bold tracking-wider">
                Sinai Booking · Field Notes
              </span>
            </div>

            {/* Article Content */}
            <div className="space-y-4 text-sm sm:text-base text-[#4A463F] leading-relaxed pt-2">
              {selectedStory.content.map((paragraph, idx) => (
                <p key={idx} className="bg-white/60 p-3.5 rounded-xl border border-[#EBE3D3]">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#E7DFCE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                onClick={() => handleShareStory(selectedStory)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs sm:text-sm font-bold shadow transition-all cursor-pointer"
              >
                <Share2 size={16} />
                <span>{isAr ? 'مشاركة عبر واتساب' : 'Share story on WhatsApp'}</span>
              </button>

              <button
                onClick={() => setSelectedStory(null)}
                className="px-6 py-2.5 rounded-full border border-[#D9D0C2] hover:bg-white text-xs font-semibold text-[#5C574F] cursor-pointer"
              >
                {isAr ? 'إغلاق القصة' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
