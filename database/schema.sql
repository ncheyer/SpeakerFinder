-- Database schema for SpeakerFinder application

-- Enable RLS (Row Level Security)
alter database postgres set "app.jwt_secret" to 'your-jwt-secret';

-- Create speakers table
create table if not exists public.speakers (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    title text not null,
    bio text not null,
    expertise text[] not null default '{}',
    speaking_topics text[] not null default '{}',
    fee integer not null check (fee >= 10000),
    location text not null,
    availability text[] default '{}',
    profile_image text,
    video_url text,
    years_experience integer not null check (years_experience >= 0),
    languages text[] not null default '{"English"}',
    website text,
    linkedin text,
    twitter text,
    instagram text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create testimonials table
create table if not exists public.testimonials (
    id uuid default gen_random_uuid() primary key,
    speaker_id uuid references public.speakers(id) on delete cascade,
    client_name text not null,
    client_company text not null,
    content text not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    event_type text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create qualification_requests table
create table if not exists public.qualification_requests (
    id uuid default gen_random_uuid() primary key,
    organization_name text not null,
    contact_email text not null,
    contact_phone text,
    event_type text not null,
    industry text not null,
    audience_size text not null,
    budget integer not null check (budget >= 10000),
    event_date date not null,
    location text not null,
    topic_areas text[] not null default '{}',
    additional_requirements text,
    status text default 'pending' check (status in ('pending', 'in_progress', 'matched', 'completed', 'cancelled')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index if not exists speakers_expertise_idx on public.speakers using gin(expertise);
create index if not exists speakers_speaking_topics_idx on public.speakers using gin(speaking_topics);
create index if not exists speakers_fee_idx on public.speakers(fee);
create index if not exists speakers_location_idx on public.speakers(location);
create index if not exists testimonials_speaker_id_idx on public.testimonials(speaker_id);
create index if not exists qualification_requests_status_idx on public.qualification_requests(status);
create index if not exists qualification_requests_topic_areas_idx on public.qualification_requests using gin(topic_areas);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger speakers_updated_at
  before update on public.speakers
  for each row execute procedure public.handle_updated_at();

create trigger qualification_requests_updated_at
  before update on public.qualification_requests
  for each row execute procedure public.handle_updated_at();

-- Enable RLS
alter table public.speakers enable row level security;
alter table public.testimonials enable row level security;
alter table public.qualification_requests enable row level security;

-- Create policies for public read access to speakers and testimonials
create policy "Speakers are viewable by everyone" on public.speakers
  for select using (true);

create policy "Testimonials are viewable by everyone" on public.testimonials
  for select using (true);

-- Create policy for qualification requests (only allow inserts for now)
create policy "Anyone can submit qualification requests" on public.qualification_requests
  for insert with check (true);

-- Sample data insertion
insert into public.speakers (
    name,
    title,
    bio,
    expertise,
    speaking_topics,
    fee,
    location,
    years_experience,
    languages,
    website,
    linkedin,
    profile_image,
    video_url
) values 
(
    'Dr. Sarah Chen',
    'Technology Futurist & Innovation Expert',
    'Dr. Sarah Chen is a leading expert in emerging technologies with over 15 years of experience in digital transformation. She has helped Fortune 500 companies navigate the complex landscape of technological change and has been featured as a keynote speaker at major tech conferences worldwide.',
    array['Technology', 'Innovation', 'Digital Transformation', 'AI', 'Future of Work'],
    array['The Future of Artificial Intelligence', 'Digital Transformation Strategies', 'Innovation in the Post-Pandemic World', 'Building Tech-Savvy Organizations', 'Ethical Technology Implementation'],
    15000,
    'San Francisco, CA',
    15,
    array['English', 'Mandarin'],
    'https://sarahchen.tech',
    'https://linkedin.com/in/sarahchen',
    '/api/placeholder/200/200',
    'https://example.com/video1'
),
(
    'Marcus Johnson',
    'Leadership Expert & Executive Coach',
    'Marcus Johnson is a Fortune 500 leadership consultant and bestselling author with over 20 years of experience in executive coaching and organizational development. He has worked with CEOs and senior executives at companies like Microsoft, Google, and Amazon.',
    array['Leadership', 'Management', 'Team Building', 'Executive Coaching', 'Organizational Development'],
    array['Transformational Leadership', 'Building High-Performance Teams', 'Executive Presence', 'Leading Through Change', 'The Future of Leadership'],
    12000,
    'New York, NY',
    20,
    array['English', 'Spanish'],
    'https://marcusjohnson.com',
    'https://linkedin.com/in/marcusjohnson',
    '/api/placeholder/200/200',
    null
),
(
    'Dr. Emily Rodriguez',
    'Wellness & Performance Coach',
    'Dr. Emily Rodriguez is an Olympic performance psychologist and wellness advocate who has worked with elite athletes and Fortune 500 executives. She specializes in mental health, peak performance, and sustainable wellness practices.',
    array['Wellness', 'Mental Health', 'Performance', 'Psychology', 'Mindfulness'],
    array['Mental Health in the Workplace', 'Peak Performance Strategies', 'Building Resilience', 'The Science of Well-being', 'Mindful Leadership'],
    18000,
    'Los Angeles, CA',
    12,
    array['English'],
    'https://emilyrodriguez.wellness',
    'https://linkedin.com/in/emilyrodriguez',
    '/api/placeholder/200/200',
    'https://example.com/video3'
);

-- Insert sample testimonials
insert into public.testimonials (
    speaker_id,
    client_name,
    client_company,
    content,
    rating,
    event_type
) values 
(
    (select id from public.speakers where name = 'Dr. Sarah Chen'),
    'John Smith',
    'TechCorp',
    'Dr. Chen delivered an outstanding keynote that perfectly captured our vision for digital transformation. Our audience was completely engaged.',
    5,
    'Corporate Conference'
),
(
    (select id from public.speakers where name = 'Dr. Sarah Chen'),
    'Maria Garcia',
    'Innovation Summit',
    'Exceptional speaker with deep knowledge and the ability to make complex topics accessible to everyone.',
    5,
    'Industry Summit'
),
(
    (select id from public.speakers where name = 'Marcus Johnson'),
    'David Wilson',
    'Leadership Forum',
    'Marcus transformed our understanding of leadership. His practical insights have made a lasting impact on our organization.',
    5,
    'Executive Workshop'
);
