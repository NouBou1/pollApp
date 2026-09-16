# PollApp

Umfragen erstellen, teilen und live Ergebnisse sehen.

## Struktur

- `pollApp/` – Angular-21-Frontend
- `server/` – Node.js/Express/TypeScript-Backend, spricht Supabase (Postgres) an

## Setup

1. Supabase-Projekt anlegen, `server/.env.example` nach `server/.env` kopieren und `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` eintragen.
2. Das SQL aus `server/supabase/schema.sql` im Supabase SQL-Editor ausführen.
3. Abhängigkeiten installieren:
   ```bash
   npm run install:all
   ```
4. Frontend + Backend gemeinsam starten:
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:4200
   - Backend: http://localhost:3000
