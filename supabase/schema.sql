-- ==========================================================
-- Sinai Booking (سيناء بوكينج) - Dedicated Tables Schema
-- Run this script in your Supabase SQL Editor (SQL Editor -> New Query)
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================
-- 1. جدول حجوزات الشقق والإقامة (Apartment Bookings)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.apartment_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    apartment_name VARCHAR(255) NOT NULL,            -- e.g. 'Mashraba duplex (Studio 1)'
    apartment_code VARCHAR(100) DEFAULT 'Studio 1',  -- Unit / Studio code
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    check_in_date DATE,
    check_out_date DATE,
    nights_count INT DEFAULT 1,
    guests_count INT DEFAULT 2,
    stay_type VARCHAR(20) DEFAULT 'daily',           -- 'daily' | 'monthly'
    estimated_total_usd NUMERIC(10, 2),
    estimated_total_egp NUMERIC(10, 2),
    estimated_total_eur NUMERIC(10, 2),
    status VARCHAR(50) DEFAULT 'pending',            -- 'pending' | 'confirmed' | 'cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- 2. جدول حجوزات رحلات السفاري والديزرت (Safari & Tours Bookings)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.safari_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_name VARCHAR(255) NOT NULL,                 -- e.g. 'Arada Canyon Safari', 'Overnight Camp'
    tour_id VARCHAR(100) NOT NULL,                   -- e.g. 'arada-canyon', 'sandboarding', 'overnight'
    preferred_camp VARCHAR(100),                     -- 'Zigzag Camp' | 'Stargazer Camp'
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    tour_date DATE,
    travelers_count INT DEFAULT 2,
    duration VARCHAR(50),                            -- e.g. 'Full Day', '2 Days / 1 Night'
    estimated_price_usd NUMERIC(10, 2),
    estimated_price_egp NUMERIC(10, 2),
    status VARCHAR(50) DEFAULT 'pending',            -- 'pending' | 'confirmed' | 'cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- 3. جدول حجوزات الباصات والانتقالات (Bus & Transfer Bookings)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.transfer_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_type VARCHAR(50) DEFAULT 'hiace_bus',    -- 'hiace_bus' | 'private_car'
    pickup_location VARCHAR(255) NOT NULL,           -- e.g. 'Cairo Airport', 'Sharm Airport'
    dropoff_location VARCHAR(255) NOT NULL,          -- e.g. 'Dahab', 'Nirvana Camp'
    travel_date DATE,
    passengers_count INT DEFAULT 1,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',            -- 'pending' | 'quoted' | 'confirmed'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- 4. جدول المشتركين في النشرة البريدية (Newsletter Subscribers)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    source VARCHAR(50) DEFAULT 'website_footer',     -- 'footer' | 'blog'
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
CREATE POLICY "Allow authenticated read apartment_bookings"
ON public.apartment_bookings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read safari_bookings"
ON public.safari_bookings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read transfer_bookings"
ON public.transfer_bookings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read newsletter_subscribers"
ON public.newsletter_subscribers FOR SELECT TO authenticated USING (true);
