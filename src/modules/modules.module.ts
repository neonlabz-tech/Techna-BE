import { Module as NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Module as SchoolModule, ModuleSchema } from './schemas/module.schema';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';

@NestModule({
  imports: [MongooseModule.forFeature([{ name: SchoolModule.name, schema: ModuleSchema }])],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}