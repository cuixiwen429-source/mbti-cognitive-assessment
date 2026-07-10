create table if not exists public.assessment_submissions (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique,
  session_id text not null,
  schema_version text not null,
  assessment_version jsonb not null,
  duration_seconds integer not null check (duration_seconds between 0 and 7200),
  responses jsonb not null,
  quality jsonb not null,
  submitted_at timestamptz not null,
  received_at timestamptz not null default now()
);

alter table public.assessment_submissions enable row level security;

revoke all on table public.assessment_submissions from anon, authenticated;
grant select, insert on table public.assessment_submissions to service_role;

comment on table public.assessment_submissions is
  'Opt-in, anonymous V2 assessment research data. Do not add IP, user-agent, email, name, or account identifiers.';

