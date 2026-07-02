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
export declare function validateEnvironment(environment: EnvironmentVariables): EnvironmentVariables;
