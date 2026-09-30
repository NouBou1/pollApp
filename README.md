# PollApp

Umfragen erstellen, teilen und live Ergebnisse sehen.

## Funktionen

- **Startseite:** Umfragen, die bald enden, als Highlight-Karten, darunter alle Umfragen mit Filter nach Status (aktiv / beendet) und Kategorie
- **Umfrage erstellen:** Titel, Beschreibung, Kategorie, optionales Enddatum, beliebig viele Fragen mit 2–6 Antworten, Einfach- oder Mehrfachauswahl
- **Umfrage beantworten:** Antworten auswählen und absenden
- **Live-Ergebnisse:** Prozentwerte je Antwort, auf Mobilgeräten ein- und ausklappbar
- **Impressum:** unter `/impressum`, verlinkt im Footer jeder Seite
- **Responsives Layout:** Desktop- und Mobile-Design nach Figma (Mobile-Layout unter 1100 px Breite)

## Tech-Stack

| Bereich | Technik |
|---|---|
| Frontend (`pollApp/`) | Angular 21 (Standalone Components, Signals), SCSS, Vitest |
| Backend (`server/`) | Node.js, Express 4, TypeScript, Zod zur Validierung |
| Datenbank | Supabase (Postgres) |

## Struktur

```
pollApp/                  Angular-Frontend
  src/app/core/           Models und API-Service
  src/app/features/       Seiten: home, create-survey, survey-detail, imprint
  src/app/shared/         Wiederverwendbare Komponenten (Buttons, Karten, Dropdown, Icons …)
  src/styles/             Design-Tokens, Schriften, Breakpoints, Form-Mixins
  public/assets/          Logo, Illustrationen, Icons
  public/fonts/           Schriftdateien (Mulish, Nokora, Nerko One), lokal eingebunden
server/                   Express-Backend
  src/routes/             Routen
  src/controllers/        Request-Handling
  src/services/           Supabase-Zugriffe
  src/types/dto.ts        Zod-Schemas und API-Typen
```

## Setup

1. Supabase-Projekt anlegen und die Tabellen aus [Datenbank](#datenbank) erstellen.
2. `server/.env.example` nach `server/.env` kopieren und ausfüllen:

   | Variable | Bedeutung |
   |---|---|
   | `PORT` | Port des Backends (Standard `3000`) |
   | `SUPABASE_URL` | URL des Supabase-Projekts |
   | `SUPABASE_SERVICE_ROLE_KEY` | Service-Role-Key (nur im Backend verwenden, nie ins Frontend) |
   | `CORS_ORIGIN` | Erlaubte Frontend-Adresse (Standard `http://localhost:4200`) |

3. Abhängigkeiten installieren:
   ```bash
   npm run install:all
   ```
4. Frontend und Backend gemeinsam starten:
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:4200
   - Backend: http://localhost:3000

   Der Angular-Dev-Server leitet `/api` per `pollApp/proxy.conf.json` an das Backend weiter.

## Skripte

| Ort | Befehl | Wirkung |
|---|---|---|
| Root | `npm run dev` | Frontend und Backend parallel starten |
| Root | `npm run install:all` | Abhängigkeiten beider Projekte installieren |
| `pollApp/` | `npm run build` | Produktions-Build nach `pollApp/dist/` |
| `pollApp/` | `npm test` | Unit-Tests mit Vitest |
| `server/` | `npm run build` | TypeScript nach `server/dist/` kompilieren |
| `server/` | `npm start` | Kompiliertes Backend starten |

## API

Basis-URL: `/api/surveys`

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/` | Alle Umfragen (neueste zuerst) |
| `POST` | `/` | Umfrage anlegen |
| `GET` | `/:id` | Umfrage mit Fragen und Antworten |
| `DELETE` | `/:id` | Umfrage löschen |
| `GET` | `/:id/results` | Ergebnisse (Stimmen und Prozent je Antwort) |
| `POST` | `/:id/responses` | Teilnahme absenden |

Request-Bodies werden mit Zod geprüft (siehe `server/src/types/dto.ts`). Ungültige Anfragen liefern `400`, unbekannte Umfragen `404`.

## Datenbank

Das Backend erwartet diese Tabellen in Supabase:

| Tabelle | Spalten |
|---|---|
| `surveys` | `id` (uuid), `title`, `description`, `category`, `created_at`, `ends_at` |
| `questions` | `id` (uuid), `survey_id` → `surveys`, `text`, `position`, `allow_multiple` |
| `options` | `id` (uuid), `question_id` → `questions`, `text`, `position` |
| `responses` | `id` (uuid), `survey_id` → `surveys` |
| `response_answers` | `response_id` → `responses`, `question_id` → `questions`, `option_id` → `options` |

Die Fremdschlüssel brauchen `on delete cascade`, damit beim Löschen einer Umfrage auch Fragen, Antworten und Teilnahmen entfernt werden.

## Code-Konventionen

- Funktionen höchstens 14 Zeilen, Dateien höchstens 400 Zeilen
- Kommentare nur als kurze Wegweiser (z. B. `// Mobile`)
- Farben, Abstände und Radien über die Tokens in `pollApp/src/styles/_tokens.scss`
