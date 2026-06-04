import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeacherModule } from './teachers/teacher.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),

            MongooseModule.forRoot(process.env.MONGODB_URI!),

            TeacherModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
