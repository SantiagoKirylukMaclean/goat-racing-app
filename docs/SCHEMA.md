# Base de datos

- Las migraciones viven en `supabase/migrations/**.sql` siguiendo la convención `YYYYMMDDHHMMSS_descripcion.sql`.
- Para crear una migración: `npx supabase migration new <cambio>` y commitearla.
- Para probar local (opcional): `supabase start`, `supabase db reset`.
- Para regenerar tipos manualmente: `pnpm run db:types` (o `npm run db:types`).

## test
Tabla temporal para validar el pipeline de migraciones.
- id (uuid, pk)
- label (text, 1–120 chars)
- meta (jsonb, default {})
- created_at (timestamptz, default now)
RLS: desactivado (solo para smoke test). Borrar esta tabla cuando no se use.
