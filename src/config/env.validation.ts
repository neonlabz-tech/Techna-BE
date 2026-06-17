export interface EnvironmentVariables {
  PORT?: string;
  MONGO_URI?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  CLOUDFLARE_R2_ACCOUNT_ID?: string;
  CLOUDFLARE_R2_ACCESS_KEY_ID?: string;
  CLOUDFLARE_R2_SECRET_ACCESS_KEY?: string;
  CLOUDFLARE_R2_TOKEN?: string;
  CLOUDFLARE_R2_BUCKET_NAME?: string;
  CLOUDFLARE_R2_ENDPOINT?: string;
  CLOUDFLARE_R2_PUBLIC_BASE_URL?: string;
  GMAIL_USER?: string;
  GMAIL_APP_PASSWORD?: string;
  ADMIN_EMAIL?: string;
}

export function validateEnvironment(
  environment: EnvironmentVariables,
): EnvironmentVariables {
  if (!environment.PORT) {
    environment.PORT = '4000';
  }

  if (!environment.MONGO_URI) {
    throw new Error('MONGO_URI is required');
  }

  if (!environment.GMAIL_USER) {
    throw new Error('GMAIL_USER is required');
  }

  if (!environment.GMAIL_APP_PASSWORD) {
    throw new Error('GMAIL_APP_PASSWORD is required');
  }

  return environment;
}
