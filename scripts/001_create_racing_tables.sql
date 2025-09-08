-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  team_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create drivers table
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  number INTEGER NOT NULL,
  team TEXT,
  nationality TEXT,
  points INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  podiums INTEGER DEFAULT 0,
  fastest_laps INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on drivers
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Drivers policies
CREATE POLICY "drivers_select_own" ON public.drivers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "drivers_insert_own" ON public.drivers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "drivers_update_own" ON public.drivers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "drivers_delete_own" ON public.drivers FOR DELETE USING (auth.uid() = user_id);

-- Create races table
CREATE TABLE IF NOT EXISTS public.races (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  circuit TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'practice', 'qualifying', 'race', 'completed')),
  weather TEXT,
  temperature INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on races
ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;

-- Races policies
CREATE POLICY "races_select_own" ON public.races FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "races_insert_own" ON public.races FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "races_update_own" ON public.races FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "races_delete_own" ON public.races FOR DELETE USING (auth.uid() = user_id);

-- Create race_results table
CREATE TABLE IF NOT EXISTS public.race_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  race_id UUID NOT NULL REFERENCES public.races(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  points INTEGER DEFAULT 0,
  fastest_lap BOOLEAN DEFAULT FALSE,
  dnf BOOLEAN DEFAULT FALSE,
  dnf_reason TEXT,
  lap_time INTERVAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on race_results
ALTER TABLE public.race_results ENABLE ROW LEVEL SECURITY;

-- Race results policies
CREATE POLICY "race_results_select_own" ON public.race_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "race_results_insert_own" ON public.race_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "race_results_update_own" ON public.race_results FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "race_results_delete_own" ON public.race_results FOR DELETE USING (auth.uid() = user_id);

-- Create timing_data table for microsector analysis
CREATE TABLE IF NOT EXISTS public.timing_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  race_id UUID NOT NULL REFERENCES public.races(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  sector INTEGER NOT NULL CHECK (sector IN (1, 2, 3)),
  microsector INTEGER NOT NULL,
  time_ms INTEGER NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('practice', 'qualifying', 'race')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on timing_data
ALTER TABLE public.timing_data ENABLE ROW LEVEL SECURITY;

-- Timing data policies
CREATE POLICY "timing_data_select_own" ON public.timing_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "timing_data_insert_own" ON public.timing_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "timing_data_update_own" ON public.timing_data FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "timing_data_delete_own" ON public.timing_data FOR DELETE USING (auth.uid() = user_id);

-- Create car_parts table
CREATE TABLE IF NOT EXISTS public.car_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('engine', 'aerodynamics', 'suspension', 'brakes', 'electronics', 'tires')),
  condition INTEGER DEFAULT 100 CHECK (condition >= 0 AND condition <= 100),
  wear_rate DECIMAL(3,2) DEFAULT 1.0,
  performance_impact DECIMAL(3,2) DEFAULT 0.0,
  cost DECIMAL(10,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on car_parts
ALTER TABLE public.car_parts ENABLE ROW LEVEL SECURITY;

-- Car parts policies
CREATE POLICY "car_parts_select_own" ON public.car_parts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "car_parts_insert_own" ON public.car_parts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "car_parts_update_own" ON public.car_parts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "car_parts_delete_own" ON public.car_parts FOR DELETE USING (auth.uid() = user_id);

-- Create test_configurations table
CREATE TABLE IF NOT EXISTS public.test_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  circuit TEXT NOT NULL,
  weather_conditions TEXT,
  temperature INTEGER,
  setup_data JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on test_configurations
ALTER TABLE public.test_configurations ENABLE ROW LEVEL SECURITY;

-- Test configurations policies
CREATE POLICY "test_configurations_select_own" ON public.test_configurations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "test_configurations_insert_own" ON public.test_configurations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "test_configurations_update_own" ON public.test_configurations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "test_configurations_delete_own" ON public.test_configurations FOR DELETE USING (auth.uid() = user_id);

-- Create notes table
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'setup', 'strategy', 'driver', 'technical')),
  race_id UUID REFERENCES public.races(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on notes
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Notes policies
CREATE POLICY "notes_select_own" ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notes_insert_own" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notes_update_own" ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notes_delete_own" ON public.notes FOR DELETE USING (auth.uid() = user_id);
