import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StorageService, STORAGE_CONFIG_TOKEN } from './storage.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: STORAGE_CONFIG_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        accountId: configService.get<string>('CLOUDFLARE_R2_ACCOUNT_ID'),
        accessKeyId: configService.get<string>('CLOUDFLARE_R2_ACCESS_KEY_ID'),
        secretAccessKey: configService.get<string>('CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
        bucketName: configService.get<string>('CLOUDFLARE_R2_BUCKET_NAME'),
        endpoint:
          configService.get<string>('CLOUDFLARE_R2_ENDPOINT') ??
          (configService.get<string>('CLOUDFLARE_R2_ACCOUNT_ID')
            ? `https://${configService.get<string>('CLOUDFLARE_R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`
            : undefined),
        publicBaseUrl: configService.get<string>('CLOUDFLARE_R2_PUBLIC_BASE_URL'),
      }),
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}