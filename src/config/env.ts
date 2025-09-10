const RUNTIME = process.env.NEXT_PUBLIC_RUNTIME_ENV ?? 'prod';

type EnvSet = { supabaseUrl: string; supabaseAnonKey: string };

const sets: Record<string, EnvSet> = {
  dev: {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  },
  stage: {
    supabaseUrl:
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL_STAGE ?? '',
    supabaseAnonKey:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY_STAGE ?? '',
  },
  prod: {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '',
    supabaseAnonKey:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? '',
  },
};

export const ENV = {
  RUNTIME,
  SUPABASE_URL: sets[RUNTIME]?.supabaseUrl || '',
  SUPABASE_ANON_KEY: sets[RUNTIME]?.supabaseAnonKey || '',
  // Solo server-side
  SERVER: {
    PROJECT_REF:
      process.env.SUPABASE_PROJECT_REF_STAGE ?? process.env.SUPABASE_PROJECT_REF ?? '',
    SERVICE_ROLE:
      process.env.SUPABASE_SERVICE_ROLE_STAGE ?? process.env.SUPABASE_SERVICE_ROLE ?? '',
    DB_URL: process.env.SUPABASE_DB_URL_STAGE ?? process.env.SUPABASE_DB_URL ?? '',
  },
};
