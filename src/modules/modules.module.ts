import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { Module as SchoolModule, ModuleSchema } from './schemas/module.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SchoolModule.name,
        schema: ModuleSchema,
      },
    ]),
  ],
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulesModule {}