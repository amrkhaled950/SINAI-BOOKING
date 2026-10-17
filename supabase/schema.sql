-- ==========================================================
-- Sinai Booking (سيناء بوكينج) - Full Detailed Booking Schema
-- Run this script in your Supabase SQL Editor (SQL Editor -> New Query)
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================
-- 1. جدول حجوزات الشقق والإقامة (Apartment Bookings)
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
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Alter existing columns if table already created
ALTER TABLE public.apartment_bookings ADD COLUMN IF NOT EXISTS nationality VARCHAR(50) DEFAULT 'egyptian';
ALTER TABLE public.apartment_bookings ADD COLUMN IF NOT EXISTS children_count INT DEFAULT 0;
ALTER TABLE public.apartment_bookings ADD COLUMN IF NOT EXISTS transportation_station VARCHAR(255);
ALTER TABLE public.apartment_bookings ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'wallet';

-- ==========================================================
-- 2. جدول حجوزات رحلات السفاري والديزرت (Safari Bookings)
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
-- 3. جدول حجوزات الباصات والانتقالات (Transfer Bookings)
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
-- 4. جدول المشتركين في النشرة البريدية (Newsletter Subscribers)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    source VARCHAR(50) DEFAULT 'website_footer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- 5. تفعيل الأمان (Row Level Security) والصلاحيات العامة
-- ==========================================================
ALTER TABLE public.apartment_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safari_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop old policies to avoid duplicate conflicts
DROP POLICY IF EXISTS "Allow public insert to apartment_bookings" ON public.apartment_bookings;
DROP POLICY IF EXISTS "Allow public insert to safari_bookings" ON public.safari_bookings;
DROP POLICY IF EXISTS "Allow public insert to transfer_bookings" ON public.transfer_bookings;
DROP POLICY IF EXISTS "Allow public insert to newsletter_subscribers" ON public.newsletter_subscribers;

-- السماح للزوار بإرسال الطلبات (Insert)
CREATE POLICY "Allow public insert to apartment_bookings"
ON public.apartment_bookings FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public insert to safari_bookings"
ON public.safari_bookings FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public insert to transfer_bookings"
ON public.transfer_bookings FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public insert to newsletter_subscribers"
ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);

-- السماح للإدارة بقراءة السجلات (Select)
DROP POLICY IF EXISTS "Allow authenticated read apartment_bookings" ON public.apartment_bookings;
DROP POLICY IF EXISTS "Allow authenticated read safari_bookings" ON public.safari_bookings;
DROP POLICY IF EXISTS "Allow authenticated read transfer_bookings" ON public.transfer_bookings;
DROP POLICY IF EXISTS "Allow authenticated read newsletter_subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Allow authenticated read apartment_bookings"
ON public.apartment_bookings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read safari_bookings"
ON public.safari_bookings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read transfer_bookings"
ON public.transfer_bookings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read newsletter_subscribers"
ON public.newsletter_subscribers FOR SELECT TO authenticated USING (true);
