
-- This is for reference only - run this in Supabase SQL editor

-- Create some sample companies in the database
INSERT INTO public.companies (name, industry, location, website, description, logo_url)
VALUES 
  ('TechNova', 'Technology', 'San Francisco, CA', 'https://technova.example.com', 'A leading technology company specializing in AI solutions.', 'https://placehold.co/400x400/4f46e5/ffffff?text=TN'),
  ('EcoSolutions', 'Green Energy', 'Portland, OR', 'https://ecosolutions.example.com', 'Pioneering sustainable energy solutions for a greener future.', 'https://placehold.co/400x400/10b981/ffffff?text=ES'),
  ('FinanceWave', 'Financial Services', 'New York, NY', 'https://financewave.example.com', 'Innovative financial services for individuals and businesses.', 'https://placehold.co/400x400/f59e0b/ffffff?text=FW');

-- After creating the companies, note their IDs and use them in the next step
-- Replace the UUIDs below with the actual UUIDs from your database

-- First sign up the users through the Supabase Auth API or dashboard
-- Then update their metadata with:

UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
  'full_name', 'TechNova Admin',
  'user_type', 'company',
  'company_name', 'TechNova'
)
WHERE email = 'technova@example.com';

UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
  'full_name', 'EcoSolutions Admin',
  'user_type', 'company',
  'company_name', 'EcoSolutions'
)
WHERE email = 'ecosolutions@example.com';

UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
  'full_name', 'FinanceWave Admin',
  'user_type', 'company',
  'company_name', 'FinanceWave'
)
WHERE email = 'financewave@example.com';

-- Then link the users to their companies
-- Replace the company_id values with the actual UUIDs
INSERT INTO public.company_accounts (id, company_id, email)
SELECT 
  id,
  (SELECT id FROM public.companies WHERE name = 'TechNova'),
  email
FROM auth.users
WHERE email = 'technova@example.com';

INSERT INTO public.company_accounts (id, company_id, email)
SELECT 
  id,
  (SELECT id FROM public.companies WHERE name = 'EcoSolutions'),
  email
FROM auth.users
WHERE email = 'ecosolutions@example.com';

INSERT INTO public.company_accounts (id, company_id, email)
SELECT 
  id,
  (SELECT id FROM public.companies WHERE name = 'FinanceWave'),
  email
FROM auth.users
WHERE email = 'financewave@example.com';
