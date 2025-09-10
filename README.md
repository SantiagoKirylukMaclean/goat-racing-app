# GOAT Racing app

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/santiagos-projects-11810274/v0-goat-racing-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/1bZZbvjWOkk)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/santiagos-projects-11810274/v0-goat-racing-app](https://vercel.com/santiagos-projects-11810274/v0-goat-racing-app)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/1bZZbvjWOkk](https://v0.app/chat/projects/1bZZbvjWOkk)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Stage

### Variables de entorno

- `NEXT_PUBLIC_RUNTIME_ENV=stage`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_PROJECT_REF_STAGE`
- `SUPABASE_URL_STAGE`
- `SUPABASE_ANON_KEY_STAGE`
- `SUPABASE_SERVICE_ROLE_STAGE`
- `SUPABASE_DB_URL_STAGE`
- `SUPABASE_JWT_SECRET_STAGE` *(opcional)*

### Ejecutar local

```bash
cp env/.env.stage.example .env.local
# Rellena las variables y luego
npm run dev:stage
```

### Pipeline

Cada push o merge a `stage` ejecuta:

1. `.github/workflows/db-migrate-stage.yml` para aplicar migraciones de Supabase.
2. `.github/workflows/deploy-stage.yml` para disparar un deploy en Vercel mediante hook.

### Secrets en GitHub

- `SUPABASE_DB_URL_STAGE`
- `SUPABASE_PROJECT_REF_STAGE`
- `VERCEL_DEPLOY_HOOK_URL_STAGE` *(opcional)*
- `SUPABASE_ACCESS_TOKEN_STAGE` *(si se usa login de CLI)*

Recordatorio: no exponer `SUPABASE_SERVICE_ROLE_STAGE` ni `SUPABASE_DB_URL_STAGE` en el código cliente.
