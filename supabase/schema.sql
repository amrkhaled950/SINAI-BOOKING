-- ==========================================================
-- Sinai Booking (سيناء بوكينج) - Full Database & Admin Schema
-- Run this script in your Supabase SQL Editor (SQL Editor -> New Query)
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================
-- 1. جدول الشقق والغرف (Apartments & Rooms CMS)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.apartments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,               -- e.g. 'studio-1', 'studio-2'
    location VARCHAR(100) DEFAULT 'Dahab - Mashraba',
    location_ar VARCHAR(100) DEFAULT 'دهب - المشربة',
    badge VARCHAR(100) DEFAULT 'DUPLEX APARTMENT',
    badge_ar VARCHAR(100) DEFAULT 'استوديو دوبلكس',
    price_usd NUMERIC(10, 2) NOT NULL DEFAULT 40,
    price_egp NUMERIC(10, 2) NOT NULL DEFAULT 2000,
    monthly_usd NUMERIC(10, 2) DEFAULT 1200,
    monthly_egp NUMERIC(10, 2) DEFAULT 60000,
    max_guests INT DEFAULT 3,
    description TEXT,
    description_ar TEXT,
    images TEXT[] NOT NULL DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    amenities_ar TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed initial Mashraba Duplex (Studio 1) if not exists
INSERT INTO public.apartments (
    title, title_ar, code, location, location_ar, badge, badge_ar,
    price_usd, price_egp, monthly_usd, monthly_egp, max_guests,
    description, description_ar, images, amenities, amenities_ar, is_available
) VALUES (
    'Mashraba duplex (Studio 1)',
    'استوديو دوبلكس مشربه (Studio 1)',
    'studio-1',
    'Dahab - Mashraba',
    'دهب - المشربة',
    'DUPLEX APARTMENT',
    'استوديو دوبلكس',
    40, 2000, 1200, 60000, 3,
    'Comfortable duplex loft, sea view, AC and private bathroom with cozy living area and wooden staircase.',
    'غرفة دوبلكس مريحة، إطلالة بحرية، تكييف وحمام خاص، مع ركن معيشة فندقي مودرن ودرج خشبي للدور العلوي.',
    ARRAY[
        '/images/duplex-hero-loft.jpg',
        '/images/duplex-full-structure.jpg',
        '/images/duplex-lower-lounge.jpg',
        '/images/duplex-living-room.jpg',
        '/images/duplex-living-tv.jpg',
        '/images/duplex-living-wide.jpg',
        '/images/duplex-lounge-outward.jpg',
        '/images/duplex-coffee-corner.jpg'
    ],
    ARRAY['Air Conditioning', 'High-Speed Wi-Fi', 'Private Bathroom', 'Smart TV', 'Kitchenette', 'Sea/Garden View'],
    ARRAY['تكييف هواء سبليت', 'واي فاي سريع', 'حمام خاص متكامل', 'تلفزيون ذكي سمارت', 'مطبخ تحضيري', 'إطلالة هادئة'],
    TRUE
) ON CONFLICT (code) DO NOTHING;

-- ==========================================================
-- 2. جدول حجوزات الشقق والإقامة (Apartment Bookings)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.apartment_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    apartment_name VARCHAR(255) NOT NULL,
    apartment_code VARCHAR(100) DEFAULT 'Studio 1',
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    nationality VARCHAR(50) DEFAULT 'egyptian',        -- 'egyptian' | 'foreign'
    check_in_date DATE,
    check_out_date DATE,
    nights_count INT DEFAULT 1,
    guests_count INT DEFAULT 2,
    children_count INT DEFAULT 0,
    stay_type VARCHAR(20) DEFAULT 'daily',             -- 'daily' | 'monthly'
    transportation_station VARCHAR(255),               -- 'Abdel Moneim Riad' | 'UAE Embassy' | 'Rehab' | 'Madinaty' | 'none'
    payment_method VARCHAR(50) DEFAULT 'wallet',       -- 'wallet' | 'instapay' | 'card'
    estimated_total_usd NUMERIC(10, 2),
    estimated_total_egp NUMERIC(10, 2),
    status VARCHAR(50) DEFAULT 'pending',              -- 'pending' | 'confirmed' | 'cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.apartment_bookings ADD COLUMN IF NOT EXISTS nationality VARCHAR(50) DEFAULT 'egyptian';
ALTER TABLE public.apartment_bookings ADD COLUMN IF NOT EXISTS children_count INT DEFAULT 0;
ALTER TABLE public.apartment_bookings ADD COLUMN IF NOT EXISTS transportation_station VARCHAR(255);
ALTER TABLE public.apartment_bookings ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'wallet';

-- ==========================================================
-- 3. جدول حجوزات رحلات السفاري والديزرت (Safari Bookings)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.safari_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_name VARCHAR(255) NOT NULL,
    tour_id VARCHAR(100) NOT NULL,
    preferred_camp VARCHAR(100),
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    nationality VARCHAR(50) DEFAULT 'egyptian',
    tour_date DATE,
    travelers_count INT DEFAULT 2,
    children_count INT DEFAULT 0,
    transportation_station VARCHAR(255),
    payment_method VARCHAR(50) DEFAULT 'wallet',
    duration VARCHAR(50),
    estimated_price_usd NUMERIC(10, 2),
    estimated_price_egp NUMERIC(10, 2),
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.safari_bookings ADD COLUMN IF NOT EXISTS nationality VARCHAR(50) DEFAULT 'egyptian';
ALTER TABLE public.safari_bookings ADD COLUMN IF NOT EXISTS children_count INT DEFAULT 0;
ALTER TABLE public.safari_bookings ADD COLUMN IF NOT EXISTS transportation_station VARCHAR(255);
ALTER TABLE public.safari_bookings ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'wallet';

-- ==========================================================
-- 4. جدول حجوزات الباصات والانتقالات (Transfer Bookings)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.transfer_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_type VARCHAR(50) DEFAULT 'hiace_bus',
    pickup_location VARCHAR(255) NOT NULL,
    dropoff_location VARCHAR(255) NOT NULL,
    cairo_station VARCHAR(255),
    travel_date DATE,
    passengers_count INT DEFAULT 1,
    children_count INT DEFAULT 0,
    nationality VARCHAR(50) DEFAULT 'egyptian',
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    payment_method VARCHAR(50) DEFAULT 'wallet',
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.transfer_bookings ADD COLUMN IF NOT EXISTS cairo_station VARCHAR(255);
ALTER TABLE public.transfer_bookings ADD COLUMN IF NOT EXISTS children_count INT DEFAULT 0;
ALTER TABLE public.transfer_bookings ADD COLUMN IF NOT EXISTS nationality VARCHAR(50) DEFAULT 'egyptian';
ALTER TABLE public.transfer_bookings ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'wallet';

-- ==========================================================
-- 5. جدول المشتركين في النشرة البريدية (Newsletter Subscribers)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    source VARCHAR(50) DEFAULT 'website_footer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- 6. تفعيل الأمان (Row Level Security) والصلاحيات الكاملة
-- ==========================================================
ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apartment_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safari_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public read on apartments
DROP POLICY IF EXISTS "Allow public read apartments" ON public.apartments;
CREATE POLICY "Allow public read apartments"
ON public.apartments FOR SELECT TO anon, authenticated USING (true);

-- Allow full modifications on apartments
DROP POLICY IF EXISTS "Allow admin modify apartments" ON public.apartments;
CREATE POLICY "Allow admin modify apartments"
ON public.apartments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Allow public insert to bookings
DROP POLICY IF EXISTS "Allow public insert to apartment_bookings" ON public.apartment_bookings;
CREATE POLICY "Allow public insert to apartment_bookings"
ON public.apartment_bookings FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert to safari_bookings" ON public.safari_bookings;
CREATE POLICY "Allow public insert to safari_bookings"
ON public.safari_bookings FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert to transfer_bookings" ON public.transfer_bookings;
CREATE POLICY "Allow public insert to transfer_bookings"
ON public.transfer_bookings FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert to newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Allow public insert to newsletter_subscribers"
ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Allow admin full read, update, delete on bookings
DROP POLICY IF EXISTS "Allow admin full access to apartment_bookings" ON public.apartment_bookings;
CREATE POLICY "Allow admin full access to apartment_bookings"
ON public.apartment_bookings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access to safari_bookings" ON public.safari_bookings;
CREATE POLICY "Allow admin full access to safari_bookings"
ON public.safari_bookings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access to transfer_bookings" ON public.transfer_bookings;
CREATE POLICY "Allow admin full access to transfer_bookings"
ON public.transfer_bookings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access to newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Allow admin full access to newsletter_subscribers"
ON public.newsletter_subscribers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
