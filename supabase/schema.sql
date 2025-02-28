-- schema.sql
-- Run this in both development and production databases

-- Create a sequence for patient IDs
CREATE SEQUENCE patient_id_seq START 1;

-- Function to generate formatted patient ID
CREATE OR REPLACE FUNCTION generate_patient_id()
RETURNS text AS $$
BEGIN
  RETURN 'P' || LPAD(nextval('patient_id_seq')::text, 7, '0');
END;
$$ LANGUAGE plpgsql;

-- Create patients table
create table patients (
  id uuid default uuid_generate_v4() primary key,
  patient_id text DEFAULT generate_patient_id() UNIQUE NOT NULL,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_visit timestamp with time zone,
  last_visit_type text check (last_visit_type in ('IPD', 'OPD')),
  name text not null,
  date_of_birth date NOT NULL,
  gender text not null check (gender in ('Male', 'Female', 'Other')),
  contact text not null,
  address text,
  attendant_name text,
  attendant_contact text,
  id_document text,
  id_number text
);

-- Enable RLS
alter table patients enable row level security;

-- Create policies
create policy "Enable all operations for all users" on patients
  for all using (true);

-- Add notifications table
create table notifications (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  message text not null,
  type text not null check (type in ('patient', 'appointment', 'admission')),
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  link text
);

-- Enable RLS
alter table notifications enable row level security;

-- Create policy
create policy "Enable all operations for all users" on notifications
  for all using (true);

-- Update the user_role enum with all roles
drop type if exists user_role cascade;
create type user_role as enum (
  'admin',
  'doctor',
  'manager',
  'accountant',
  'receptionist',
  'opd_attendant',
  'nurse'
);

-- Create users table
create table users (
  id uuid references auth.users on delete cascade,
  email text unique not null,
  full_name text,
  role user_role not null default 'receptionist',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Define role-based permissions
alter table users enable row level security;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Only admins and managers can manage users" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- Create a more permissive policy for development
CREATE POLICY "Enable read access to all users"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access to all users"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update access to all users"
  ON users FOR UPDATE
  USING (true);

-- Patient table policies
alter table patients enable row level security;

create policy "Medical staff can view patients"
  on patients for select
  using (auth.jwt() ->> 'role' in ('admin', 'doctor', 'nurse', 'opd_attendant', 'receptionist'));

create policy "Medical staff can create patients"
  on patients for insert
  using (auth.jwt() ->> 'role' in ('admin', 'doctor', 'nurse', 'opd_attendant', 'receptionist'));

create policy "Medical staff can update patients"
  on patients for update
  using (auth.jwt() ->> 'role' in ('admin', 'doctor', 'nurse', 'opd_attendant'));

create policy "Only admins and managers can delete patients"
  on patients for delete
  using (auth.jwt() ->> 'role' in ('admin', 'manager'));

-- Notification table policies
alter table notifications enable row level security;

create policy "All staff can view notifications"
  on notifications for select
  using (auth.jwt() ->> 'role' in ('admin', 'doctor', 'manager', 'accountant', 'receptionist', 'opd_attendant', 'nurse'));

create policy "Medical staff can create notifications"
  on notifications for insert
  using (auth.jwt() ->> 'role' in ('admin', 'doctor', 'nurse', 'opd_attendant'));

-- Add role for the admin user (replace UUID with the actual user ID from Supabase dashboard)
INSERT INTO public.users (
  id,  -- Replace with the actual UUID from Supabase dashboard
  email,
  full_name,
  role
) VALUES (
  '{{USER_ID}}',  -- Replace this with the actual UUID
  'admin@example.com',
  'Admin User',
  'admin'
);

-- Update RLS policies to be more permissive during development
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow public access during development
CREATE POLICY "Allow public access to users"
  ON public.users
  FOR ALL
  USING (true);

-- Allow users to update their own profile
create policy "Users can update their own profile."
  on users for update
  using (auth.uid() = id);

-- Update the check constraint for id_document column
ALTER TABLE patients 
DROP CONSTRAINT IF EXISTS patients_id_document_check;

ALTER TABLE patients 
ADD CONSTRAINT patients_id_document_check 
CHECK (
  id_document IS NULL OR 
  id_document IN ('Aadhaar', 'Driving Licence', 'Voter Id', 'PAN Card', 'Other')
);

-- Modify the patients table to make address optional
ALTER TABLE patients 
ALTER COLUMN address DROP NOT NULL;

-- Create a sequence for IPD numbers
CREATE SEQUENCE ipd_no_seq START 1;

-- Function to generate formatted IPD number
CREATE OR REPLACE FUNCTION generate_ipd_no()
RETURNS text AS $$
BEGIN
  RETURN '2025/' || LPAD(nextval('ipd_no_seq')::text, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Create doctors table
CREATE TABLE doctors (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  specialization text,
  active boolean default true
);

-- Create beds table
CREATE TABLE beds (
  id uuid default uuid_generate_v4() primary key,
  bed_number text not null unique,
  ward text not null,
  status text check (status in ('Available', 'Occupied', 'Maintenance')) default 'Available',
  current_admission_id uuid
);

-- Create IPD admissions table
CREATE TABLE ipd_admissions (
  id uuid default uuid_generate_v4() primary key,
  ipd_no text DEFAULT generate_ipd_no() UNIQUE NOT NULL,
  patient_id uuid references patients(id) not null,
  admission_time timestamp with time zone default timezone('utc'::text, now()) not null,
  discharge_time timestamp with time zone,
  status text check (status in ('Admitted', 'Discharged', 'Expired', 'LAMA')) default 'Admitted',
  bed_id uuid references beds(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create junction table for doctors and admissions (many-to-many)
CREATE TABLE admission_doctors (
  admission_id uuid references ipd_admissions(id),
  doctor_id uuid references doctors(id),
  primary key (admission_id, doctor_id)
);

-- Add RLS policies
ALTER TABLE ipd_admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Medical staff can view admissions"
  ON ipd_admissions FOR SELECT
  USING (auth.jwt() ->> 'role' in ('admin', 'doctor', 'nurse', 'opd_attendant'));

CREATE POLICY "Medical staff can create admissions"
  ON ipd_admissions FOR INSERT
  USING (auth.jwt() ->> 'role' in ('admin', 'doctor', 'nurse'));

CREATE POLICY "Medical staff can update admissions"
  ON ipd_admissions FOR UPDATE
  USING (auth.jwt() ->> 'role' in ('admin', 'doctor', 'nurse'));

-- Add triggers to handle bed status
CREATE OR REPLACE FUNCTION update_bed_status()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Mark bed as occupied for new admission
    UPDATE beds SET 
      status = 'Occupied',
      current_admission_id = NEW.id
    WHERE id = NEW.bed_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status != 'Admitted' THEN
    -- Free up bed when patient is discharged/expired/LAMA
    UPDATE beds SET 
      status = 'Available',
      current_admission_id = NULL
    WHERE id = NEW.bed_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admission_status_change
  AFTER INSERT OR UPDATE ON ipd_admissions
  FOR EACH ROW
  EXECUTE FUNCTION update_bed_status(); 