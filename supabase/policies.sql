-- Row Level Security
alter table surveys enable row level security;
alter table questions enable row level security;
alter table options enable row level security;
alter table responses enable row level security;
alter table response_answers enable row level security;

-- Read
create policy "Public read surveys" on surveys for select to anon using (true);
create policy "Public read questions" on questions for select to anon using (true);
create policy "Public read options" on options for select to anon using (true);
create policy "Public read responses" on responses for select to anon using (true);
create policy "Public read answers" on response_answers for select to anon using (true);

-- Create survey
create policy "Public insert surveys" on surveys for insert to anon with check (true);
create policy "Public insert questions" on questions for insert to anon with check (true);
create policy "Public insert options" on options for insert to anon with check (true);

-- Vote
create policy "Public insert responses" on responses for insert to anon with check (true);
create policy "Public insert answers" on response_answers for insert to anon with check (true);
