# SchoolTopManager Implementation Plan - Supabase Transition

Transition from mock data to a real Supabase backend, implementing multi-establishment architecture, authentication, and the core "Settings" (Paramètres) module.

## Scope Summary
- **Database Schema**: Design and implement the core PostgreSQL schema for multi-tenancy.
- **Authentication**: Connect the existing login UI to Supabase Auth.
- **Settings Module**: Build the "Paramètres" (Settings) page for establishment identity and academic configuration.
- **Data Migration**: Move from `mock-data.ts` and `localStorage` to real Supabase tables.

## Auth & RLS model
**Auth in scope:** yes
**Model:** supabase_auth
**RLS strategy:** 
- `establishments`: Read/write for `SUPER_ADMIN`; Read for establishment members.
- `users`: Profile data filtered by `auth.uid()`.
- `academic_data` (classes, subjects): Filtered by `establishment_id`.
**Frontend implication:** Replace local `useApp` login logic with `supabase.auth.signInWithPassword`.

## Migration baseline
**Local migrations in project:** none
**User confirmed proceed on connected DB:** yes (explicitly stated "Ma connexion à la base de données est configurée")

## Affected Areas
- `src/integrations/supabase/`: Client and types (to be created).
- `src/context/AppContext.tsx`: Transition from mock state to Supabase hooks.
- `src/pages/Settings.tsx`: New page for establishment configuration.
- `src/pages/Schools.tsx`: Update to fetch from Supabase.

## Phases

### Phase 1: Database Schema (supabase_engineer)
- Create `establishments` table (multi-tenant root).
- Create `profiles` table (linked to `auth.users`) with `role` and `establishment_id`.
- Create `academic_years`, `levels`, `classes`, and `subjects` tables.
- Implement RLS policies for multi-tenancy isolation.

### Phase 2: Supabase Integration & Auth (frontend_engineer)
- Install `@supabase/supabase-js`.
- Create `src/integrations/supabase/client.ts`.
- Update `AppContext.tsx` to handle Supabase sessions and profile fetching.
- Connect `LoginPage` in `App.tsx` to real Supabase Auth.

### Phase 3: Settings & Configuration UI (frontend_engineer)
- Create `src/pages/Settings.tsx` (Paramètres).
- Implement "Identité de l'établissement" forms (name, logo, national header).
- Implement "Configuration Académique" (managing years, levels, subjects).
- Ensure settings are saved to Supabase and reactive across the app.

### Phase 4: Data Flow Update (quick_fix_engineer)
- Refactor `SchoolsPage`, `StudentsPage`, and `FinancePage` to use Supabase hooks instead of mock data.
- Remove `src/lib/mock-data.ts` dependencies.

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. supabase_engineer — Setup schema and RLS for multi-tenancy.
2. frontend_engineer — Initialize Supabase client, hook up auth, and build the Settings UI.
3. quick_fix_engineer — Redirect existing pages to the new data source.

**Per-agent instructions:**

### 1. supabase_engineer
- **Phases:** Phase 1
- **Scope:** Define the relational schema. `establishments` (id, name, logo, settings_json). `profiles` (id references auth.users, role, establishment_id). `classes`, `subjects`, `academic_years`.
- **Files:** Create new migration file.
- **Depends on:** none
- **Acceptance criteria:** Tables exist in Supabase; RLS prevents users from establishment A seeing data from establishment B.

### 2. frontend_engineer
- **Phases:** Phase 2, Phase 3
- **Scope:** Setup `@supabase/supabase-js`. Implement `src/pages/Settings.tsx` with tabs for Identity and Academic config. Update `AppContext` to provide `supabase` client and current establishment data.
- **Files:** `src/integrations/supabase/client.ts`, `src/context/AppContext.tsx`, `src/App.tsx`, `src/pages/Settings.tsx`.
- **Depends on:** Phase 1
- **Acceptance criteria:** Login works with Supabase credentials; Settings page saves establishment details (name, logo) to the DB.

### 3. quick_fix_engineer
- **Phases:** Phase 4
- **Scope:** Replace mock data fetches in `Schools.tsx`, `Students.tsx`, and `Finance.tsx` with Supabase queries.
- **Files:** `src/pages/Schools.tsx`, `src/pages/Students.tsx`, `src/pages/Finance.tsx`.
- **Depends on:** Phase 2
- **Acceptance criteria:** Pages display data from the Supabase DB instead of mock-data.ts.

IS_SUPABASE_REQUIRED: true
