import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Module as SchoolModule, ModuleSchema } from './schemas/module.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: SchoolModule.name, schema: ModuleSchema }])],
})
export class ModulesModule {}