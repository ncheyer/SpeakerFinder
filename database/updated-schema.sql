-- Updated Database schema for SpeakerFinder with authentication and projects

-- First, run the existing schema, then add these updates

-- Create projects table for event management
create table if not exists public.projects (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    name text not null,
    description text,
    event_date date,
    location text,
    budget integer check (budget >= 10000),
    audience_size text,
    event_type text,
    industry text,
    status text default 'planning' check (status in ('planning', 'active', 'completed', 'cancelled')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create speaker_wishlists table for managing speaker preferences per project
create table if not exists public.speaker_wishlists (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references public.projects(id) on delete cascade,
    speaker_id uuid references public.speakers(id) on delete cascade,
    status text default 'interested' check (status in ('interested', 'contacted', 'proposed', 'confirmed', 'declined')),
    notes text,
    priority text default 'medium' check (priority in ('high', 'medium', 'low')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(project_id, speaker_id)
);

-- Create user_profiles table for additional user information
create table if not exists public.user_profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    email text,
    full_name text,
    company text,
    title text,
    phone text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Update qualification_requests to link to users and projects
alter table public.qualification_requests add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.qualification_requests add column if not exists project_id uuid references public.projects(id) on delete cascade;

-- Create indexes for better performance
create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_status_idx on public.projects(status);
create index if not exists speaker_wishlists_project_id_idx on public.speaker_wishlists(project_id);
create index if not exists speaker_wishlists_speaker_id_idx on public.speaker_wishlists(speaker_id);
create index if not exists speaker_wishlists_status_idx on public.speaker_wishlists(status);
create index if not exists user_profiles_email_idx on public.user_profiles(email);

-- Add updated_at triggers
create trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

create trigger speaker_wishlists_updated_at
  before update on public.speaker_wishlists
  for each row execute procedure public.handle_updated_at();

create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute procedure public.handle_updated_at();

-- Enable RLS
alter table public.projects enable row level security;
alter table public.speaker_wishlists enable row level security;
alter table public.user_profiles enable row level security;

-- Create RLS policies

-- Projects policies
create policy "Users can view their own projects" on public.projects
  for select using (auth.uid() = user_id);

create policy "Users can create their own projects" on public.projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own projects" on public.projects
  for update using (auth.uid() = user_id);

create policy "Users can delete their own projects" on public.projects
  for delete using (auth.uid() = user_id);

-- Speaker wishlists policies
create policy "Users can view wishlists for their projects" on public.speaker_wishlists
  for select using (
    exists (
      select 1 from public.projects 
      where projects.id = speaker_wishlists.project_id 
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can create wishlists for their projects" on public.speaker_wishlists
  for insert with check (
    exists (
      select 1 from public.projects 
      where projects.id = speaker_wishlists.project_id 
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can update wishlists for their projects" on public.speaker_wishlists
  for update using (
    exists (
      select 1 from public.projects 
      where projects.id = speaker_wishlists.project_id 
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can delete wishlists for their projects" on public.speaker_wishlists
  for delete using (
    exists (
      select 1 from public.projects 
      where projects.id = speaker_wishlists.project_id 
      and projects.user_id = auth.uid()
    )
  );

-- User profiles policies
create policy "Users can view their own profile" on public.user_profiles
  for select using (auth.uid() = id);

create policy "Users can create their own profile" on public.user_profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.user_profiles
  for update using (auth.uid() = id);

-- Update qualification_requests policies
drop policy if exists "Anyone can submit qualification requests" on public.qualification_requests;

create policy "Users can view their own qualification requests" on public.qualification_requests
  for select using (auth.uid() = user_id);

create policy "Users can create their own qualification requests" on public.qualification_requests
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own qualification requests" on public.qualification_requests
  for update using (auth.uid() = user_id);

-- Function to automatically create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create user profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Sample data for testing
-- Note: You'll need to create actual users through the auth system first

-- Add some sample projects (these will need real user IDs)
-- insert into public.projects (user_id, name, description, event_date, location, budget, audience_size, event_type, industry)
-- values 
-- (
--     'user-uuid-here',
--     'Annual Tech Conference 2024',
--     'Our flagship technology conference focusing on AI and innovation',
--     '2024-06-15',
--     'San Francisco, CA',
--     25000,
--     '500-1000',
--     'conference',
--     'technology'
-- );