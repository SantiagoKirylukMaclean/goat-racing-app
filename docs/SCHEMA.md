# Base de datos

- Las migraciones viven en `supabase/migrations/**.sql` siguiendo la convención `YYYYMMDDHHMMSS_descripcion.sql`.
- Para crear una migración: `npx supabase migration new <cambio>` y commitearla.
- Para probar local (opcional): `supabase start`, `supabase db reset`.
- Para regenerar tipos manualmente: `pnpm run db:types` (o `npm run db:types`).
