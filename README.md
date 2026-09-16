# PollApp

Umfragen erstellen, teilen und live Ergebnisse sehen.

## Struktur

- `pollApp/` – Angular-21-Frontend
- `server/` – Node.js/Express/TypeScript-Backend, spricht Supabase (Postgres) an

## Setup

1. Supabase-Projekt anlegen, `server/.env.example` nach `server/.env` kopieren und `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` eintragen.
2. Abhängigkeiten installieren:
   ```bash
   npm run install:all
   ```
3. Frontend + Backend gemeinsam starten:
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:4200
   - Backend: http://localhost:3000
