import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Module,
  SchoolModuleDocument,
} from './schemas/module.schema';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module.name)
    private readonly moduleModel: Model<SchoolModuleDocument>,
  ) {}

  // CREATE
  async create(createModuleDto: CreateModuleDto) {
    const newModule = new this.moduleModel(createModuleDto);
    return newModule.save();
  }

  // FIND ALL
  async findAll() {
    return this.moduleModel.find().sort({ createdAt: -1 });
  }

  // FIND ONE
  async findOne(id: string) {
    const module = await this.moduleModel.findById(id);

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return module;
  }

  // UPDATE
async update(id: string, updateModuleDto: UpdateModuleDto) {
  console.log('Update ID:', id);
  console.log('Update Body:', updateModuleDto);

  const updatedModule = await this.moduleModel.findByIdAndUpdate(
    id,
    { $set: updateModuleDto },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedModule) {
    throw new NotFoundException('Module not found');
  }

  return updatedModule;
}

  // DELETE
  async remove(id: string) {
    const deletedModule = await this.moduleModel.findByIdAndDelete(id);

    if (!deletedModule) {
      throw new NotFoundException('Module not found');
    }

    return {
      message: 'Module deleted successfully',
    };
  }

  private readonly s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});
async uploadResource(
  id: string,
  file: Express.Multer.File,
  title: string,
) {
  let folder = 'others';
  let fileType = 'file';

  if (file.mimetype.startsWith('video/')) {
    folder = 'videos';
    fileType = 'video';
  } else if (file.mimetype.startsWith('image/')) {
    folder = 'images';
    fileType = 'image';
  } else if (file.mimetype === 'application/pdf') {
    folder = 'pdfs';
    fileType = 'pdf';
  }

  const key = `modules/${folder}/${Date.now()}-${file.originalname}`;

  await this.s3.send(
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  const fileUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL}/${key}`;

  return this.moduleModel.findByIdAndUpdate(
    id,
    {
      $push: {
        resources: {
          title,
          fileType,
          fileUrl,
          fileKey: key,
        },
      },
    },
    { new: true },
  );
}

async deleteResource(moduleId: string, resourceId: string) {
  const module = await this.moduleModel.findById(moduleId);

  if (!module) {
    throw new NotFoundException('Module not found');
  }

  const resource = module.resources.find(
    (r: any) => r._id.toString() === resourceId,
  );

  if (!resource) {
    throw new NotFoundException('Resource not found');
  }

  await this.s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: resource.fileKey,
    }),
  );

  module.resources = module.resources.filter(
    (r: any) => r._id.toString() !== resourceId,
  );

  await module.save();

  return {
    message: 'Resource deleted successfully',
  };
}

async updateResource(
  moduleId: string,
  resourceId: string,
  title: string,
) {
  const module = await this.moduleModel.findById(moduleId);

  if (!module) {
    throw new NotFoundException('Module not found');
  }

  const resource = module.resources.find(
    (r: any) => r._id.toString() === resourceId,
  );

  if (!resource) {
    throw new NotFoundException('Resource not found');
  }

  resource.title = title;

  await module.save();

  return module;
}
}