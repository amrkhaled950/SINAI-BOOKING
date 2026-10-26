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
) ON CONFLICT (code) DO NOTHING;

-- Seed Boho Stone Studio (Studio 2)
INSERT INTO public.apartments (
    title, title_ar, code, location, location_ar, badge, badge_ar,
    price_usd, price_egp, monthly_usd, monthly_egp, max_guests,
    description, description_ar, images, amenities, amenities_ar, is_available
) VALUES (
    '2BR Boho Stone House & Private Roof (Lighthouse & Assala)',
    'بيت واستوديو بوهو غرفتين وروف خاص (بين اللايت هاوس والعصلة)',
    'studio-2',
    'Dahab - Between Lighthouse & Assala',
    'دهب - بين اللايت هاوس والعصلة',
    '2BR HOUSE & PRIVATE ROOF',
    'بيت غرفتين وروف وحديقة خاصة',
    60, 3000, 1300, 65000, 5,
    'Authentic 2BR boho stone house & private roof between Lighthouse and Assala. Accommodates up to 5 guests with 2 AC bedrooms (one featuring an architecturally stunning vaulted brick dome ceiling with skylight), private garden & summer house, fire pit & BBQ lounge, spiral staircase to private rooftop terrace with mountain views, full kitchen, modern bathroom, and fast Wi-Fi.',
    'بيت واستوديو بوهو حجري مميز بين اللايت هاوس والعصلة يسع حتى 5 أفراد. يضم غرفتين نوم مكيفتين (غرفة بسقف قبة طوب حراري مميز مع فتحة سماوية وغرفة بأسرة خشبية مريحة)، حديقة خاصة وسلاية سمر هاوس، كانون شواء وفاير بيت (BBQ & Fire Pit)، سلم حلزوني لروف وتراس خاص بإطلالة جبلية، مطبخ متكامل وحمام مودرن وواي فاي سريع.',
    ARRAY[
        '/images/studio-assala-courtyard-day.jpg',
        '/images/studio-assala-dome-bedroom.jpg',
        '/images/studio-assala-dome-skylight-wide.jpg',
        '/images/studio-assala-dome-bedroom-full.jpg',
        '/images/studio-assala-dome-bedroom-center.jpg',
        '/images/studio-assala-dome-bed-front.jpg',
        '/images/studio-assala-dome-desk.jpg',
        '/images/studio-assala-dome-arch-view.jpg',
        '/images/studio-assala-dome-warm-light.jpg',
        '/images/studio-assala-bedroom.jpg',
        '/images/studio-assala-bedroom-wood-mashrabiya.jpg',
        '/images/studio-assala-bedroom-wood-bed.jpg',
        '/images/studio-assala-bed-detail.jpg',
        '/images/studio-assala-rooftop-majlis.jpg',
        '/images/studio-assala-rooftop-pergola.jpg',
        '/images/studio-assala-rooftop-view.jpg',
        '/images/studio-assala-patio-aerial-day.jpg',
        '/images/studio-assala-patio.jpg',
        '/images/studio-assala-facade-night.jpg',
        '/images/studio-assala-patio-night.jpg',
        '/images/studio-assala-courtyard-night-aerial.jpg',
        '/images/studio-assala-firepit.jpg',
        '/images/studio-assala-majlis-night.jpg',
        '/images/studio-assala-kitchen-full.jpg',
        '/images/studio-assala-kitchen.jpg',
        '/images/studio-assala-fruit-basket.jpg',
        '/images/studio-assala-corridor.jpg',
        '/images/studio-assala-stairs.jpg',
        '/images/studio-assala-bougainvillea-stairs.jpg',
        '/images/studio-assala-spiral-stairs-night.jpg',
        '/images/studio-assala-aerial-patio.jpg',
        '/images/studio-assala-entrance.jpg',
        '/images/studio-assala-bathroom-1.jpg',
        '/images/studio-assala-bathroom-2.jpg',
        '/images/studio-assala-bathroom-wide.jpg'
    ],
    ARRAY['Up to 5 Guests', '2 AC Bedrooms (Vaulted Dome & Wood Ceiling)', 'Private Garden & Summer House', 'Private Rooftop Terrace with Mountain View', 'Campfire / Fire Pit & BBQ Lounge', 'Equipped Kitchen & Refrigerator', 'Modern Bathroom & Heated Shower', 'High-Speed Wi-Fi', 'Rustic Boho Stone Architecture'],
    ARRAY['يسع حتى 5 أفراد', 'غرفتين نوم مكيفتين (منهم غرفة بقبة طوب حراري وسقف مقوس)', 'حديقة خاصة وسلاية سمر هاوس (Summer House)', 'روف وتراس خاص بإطلالة بانورامية على الجبال', 'كانون نار وفاير بيت ومنطقة شواء (BBQ & Fire Pit)', 'مطبخ متكامل بثلاجة وبوتاجاز وميكروويف وأواني طهي', 'حمام خاص مودرن وسخان مياه', 'واي فاي سريع ومجاني', 'طراز معماري بوهيمي حجري فاخر'],
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
ALTER TABLE public.apartment_bookings ADD COLUMN IF NOT EXISTS paytabs_tran_ref VARCHAR(100);
ALTER TABLE public.apartment_bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'unpaid';
ALTER TABLE public.apartment_bookings ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(10, 2);
ALTER TABLE public.apartment_bookings ADD COLUMN IF NOT EXISTS paid_currency VARCHAR(10);

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
ALTER TABLE public.safari_bookings ADD COLUMN IF NOT EXISTS paytabs_tran_ref VARCHAR(100);
ALTER TABLE public.safari_bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'unpaid';
ALTER TABLE public.safari_bookings ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(10, 2);
ALTER TABLE public.safari_bookings ADD COLUMN IF NOT EXISTS paid_currency VARCHAR(10);

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
ALTER TABLE public.transfer_bookings ADD COLUMN IF NOT EXISTS paytabs_tran_ref VARCHAR(100);
ALTER TABLE public.transfer_bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'unpaid';
ALTER TABLE public.transfer_bookings ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(10, 2);
ALTER TABLE public.transfer_bookings ADD COLUMN IF NOT EXISTS paid_currency VARCHAR(10);

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
-- 6. الصلاحيات الكاملة وضمان ظهور الحجوزات في لوحة التحكم
-- ==========================================================
-- الحل المباشر والموصى به: إلغاء RLS لمنع أي تعليق للحجوزات والسماح للوحة التحكم بالقراءة والتعديل الفوري
ALTER TABLE public.apartments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.apartment_bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.safari_bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers DISABLE ROW LEVEL SECURITY;

