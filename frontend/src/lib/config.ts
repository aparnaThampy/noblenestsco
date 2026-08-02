/**
 * Centralised application configuration.
 *
 * All environment variables are accessed exclusively through this module.
 * Consumers should never read process.env directly — this ensures:
 * - A single, auditable list of all configuration
 * - Type safety via explicit casts / defaults
 * - Easy swapability between environments
 */

export const AppConfig = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME ?? "Noble Nests Co",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  },
  storage: {
    provider: process.env.STORAGE_PROVIDER ?? "local",
    r2: {
      accountId: process.env.R2_ACCOUNT_ID ?? "",
      accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
      bucket: process.env.R2_BUCKET ?? "noblenests-prod-assets",
      region: process.env.R2_REGION ?? "auto",
      publicUrl: process.env.R2_PUBLIC_URL ?? "https://cdn.noblenests.co",
      endpoint: process.env.R2_ENDPOINT ?? "",
    },
  },
  security: {
    adminApiKey: process.env.ADMIN_API_KEY ?? "",
    allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "http://localhost:3000").split(","),
  },
  email: {
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    from: process.env.EMAIL_FROM ?? "noreply@noblenests.co",
    toAdvisor: process.env.EMAIL_TO_ADVISOR ?? "invest@noblenests.co",
  },
} as const;

export type AppConfigType = typeof AppConfig;
