export interface EnvironmentVariables {
  PORT?: string;
  MONGODB_URI?: string;
  CLOUDFLARE_R2_ACCOUNT_ID?: string;
  CLOUDFLARE_R2_ACCESS_KEY_ID?: string;
  CLOUDFLARE_R2_SECRET_ACCESS_KEY?: string;
  CLOUDFLARE_R2_TOKEN?: string;
  CLOUDFLARE_R2_BUCKET_NAME?: string;
  CLOUDFLARE_R2_ENDPOINT?: string;
  CLOUDFLARE_R2_PUBLIC_BASE_URL?: string;
}

export function validateEnvironment(environment: EnvironmentVariables): EnvironmentVariables {
  if (!environment.PORT) {
    environment.PORT = '4000';
  }

  if (!environment.MONGODB_URI) {
    throw new Error('MONGODB_URI is required');
  }

  return environment;
}