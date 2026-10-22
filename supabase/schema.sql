-- =========================================================================
-- EndoCare Companion - Supabase Database Schema & Security Rules
-- =========================================================================
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- 1. PROFILES TABLE (Health history and preferences)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    age INTEGER,
    age_at_first_period INTEGER,
    pregnancies INTEGER,
    trying_to_conceive BOOLEAN,
    months_trying_to_conceive INTEGER,
    family_history_endometriosis TEXT,
    known_conditions TEXT,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LOG ENTRIES TABLE (Daily symptom, pain, flow observations)
CREATE TABLE IF NOT EXISTS public.log_entries (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    flow VARCHAR(20) NOT NULL,
    period_start BOOLEAN DEFAULT FALSE,
    period_end BOOLEAN DEFAULT FALSE,
    pads_or_tampons_used INTEGER,
    soaked_within_hour BOOLEAN,
    large_clots BOOLEAN,
    pain_score INTEGER NOT NULL CHECK (pain_score >= 0 AND pain_score <= 10),
    pain_timing JSONB DEFAULT '[]'::jsonb,
    pain_contexts JSONB DEFAULT '[]'::jsonb,
    blood_in_stool BOOLEAN,
    blood_in_urine BOOLEAN,
    bleeding_between_periods BOOLEAN,
    mood_symptoms JSONB DEFAULT '[]'::jsonb,
    pain_locations JSONB DEFAULT '[]'::jsonb,
    pain_details JSONB DEFAULT '[]'::jsonb,
    daily_impact VARCHAR(30) NOT NULL,
    symptoms JSONB DEFAULT '[]'::jsonb,
    painkiller_taken BOOLEAN DEFAULT FALSE,
    painkiller_name TEXT,
    painkiller_effective VARCHAR(20),
    notes TEXT, -- Supports AES-GCM encrypted string 'enc:v1:...'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_date UNIQUE (user_id, date)
);

-- 3. CARE CONTACTS TABLE (User-saved care listings)
CREATE TABLE IF NOT EXISTS public.care_contacts (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    county_or_town TEXT NOT NULL,
    services TEXT NOT NULL,
    clinician_name TEXT,
    specialty TEXT,
    phone TEXT,
    hours TEXT,
    booking_link TEXT,
    map_link TEXT,
    cost_range TEXT,
    insurance TEXT,
    added_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CUSTOM SYMPTOMS TABLE (User-defined symptom tags)
CREATE TABLE IF NOT EXISTS public.custom_symptoms (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict isolation: users can ONLY access and modify their own records.
-- =========================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_symptoms ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert/update own profile" ON public.profiles;
CREATE POLICY "Users can insert/update own profile" 
ON public.profiles FOR ALL 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- Log Entries Policies
DROP POLICY IF EXISTS "Users can view own log entries" ON public.log_entries;
CREATE POLICY "Users can view own log entries" 
ON public.log_entries FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert/update/delete own log entries" ON public.log_entries;
CREATE POLICY "Users can insert/update/delete own log entries" 
ON public.log_entries FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Care Contacts Policies
DROP POLICY IF EXISTS "Users can manage own care contacts" ON public.care_contacts;
CREATE POLICY "Users can manage own care contacts" 
ON public.care_contacts FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Custom Symptoms Policies
DROP POLICY IF EXISTS "Users can manage own custom symptoms" ON public.custom_symptoms;
CREATE POLICY "Users can manage own custom symptoms" 
ON public.custom_symptoms FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Automatic Profile Creation Trigger on Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, language)
    VALUES (NEW.id, '', 'en')
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
