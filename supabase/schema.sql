-- ==========================================================
-- Sinai Booking (سيناء بوكينج) - Supabase Database Schema
-- Run this script in your Supabase SQL Editor (SQL Editor -> New Query)
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================
-- 2. Bookings & Reservation Requests Table (حجوزات الإقامة والرحلات)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_type VARCHAR(50) NOT NULL, -- 'apartment' | 'excursion' | 'custom'
    item_id VARCHAR(100) NOT NULL,     -- e.g. 'mashraba-duplex', 'arada-canyon', 'overnight'
    item_title VARCHAR(255) NOT NULL,  -- e.g. 'Mashraba duplex (Studio 1)'
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    check_in_date DATE,
    check_out_date DATE,
    guests_count INT DEFAULT 2,
    stay_type VARCHAR(20) DEFAULT 'daily', -- 'daily' | 'monthly'
    preferred_camp VARCHAR(100),           -- 'zigzag' | 'stargazer' for 2-day desert trip
    estimated_total_usd NUMERIC(10, 2),
    estimated_total_egp NUMERIC(10, 2),
    estimated_total_eur NUMERIC(10, 2),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending',  -- 'pending' | 'confirmed' | 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- 3. Transfer & Transportation Requests Table (طلبات الانتقالات والمواصلات)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.transfer_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pickup_location VARCHAR(255) NOT NULL,
    dropoff_location VARCHAR(255) NOT NULL,
    travel_date DATE,
    passengers_count INT DEFAULT 1,
    vehicle_type VARCHAR(50) DEFAULT 'hiace', -- 'hiace' | 'private'
    customer_phone VARCHAR(50),
    customer_name VARCHAR(255),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending',     -- 'pending' | 'quoted' | 'confirmed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- 4. Newsletter Subscribers Table (المشتركون في النشرة البريدية)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    source VARCHAR(50) DEFAULT 'website_footer', -- 'footer' | 'blog'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- 5. Row Level Security (RLS) & Policies
-- ==========================================================

-- Enable RLS on all tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous users to insert bookings
CREATE POLICY "Allow public insert to bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow public anonymous users to insert transfer requests
CREATE POLICY "Allow public insert to transfer_requests"
ON public.transfer_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow public anonymous users to insert newsletter subscriptions
CREATE POLICY "Allow public insert to newsletter_subscribers"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow admins/authenticated users to view all records
CREATE POLICY "Allow authenticated read bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated read transfer_requests"
ON public.transfer_requests
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated read newsletter_subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (true);

-- ==========================================================
-- Done! Your Sinai Booking Supabase database is ready.
-- ==========================================================
