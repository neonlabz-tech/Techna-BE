import { Module as NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { Module as SchoolModule, ModuleSchema } from './schemas/module.schema';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';

<<<<<<< HEAD
@NestModule({
  imports: [MongooseModule.forFeature([{ name: SchoolModule.name, schema: ModuleSchema }])],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
=======
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
>>>>>>> 4865900d3a2737a902004f0d5bf511c165efc7ee
})
export class ModulesModule {}