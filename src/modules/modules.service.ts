/// <reference types="multer" />
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Model } from 'mongoose';
<<<<<<< Updated upstream
=======
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
>>>>>>> Stashed changes

import { Module, SchoolModuleDocument } from './schemas/module.schema';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { AddResourceUrlDto } from './dto/add-resource-url.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '../common/exceptions';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module.name)
    private readonly moduleModel: Model<SchoolModuleDocument>,
  ) {}

  private readonly s3 = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
  });

  async create(createModuleDto: CreateModuleDto) {
    try {
      const newModule = new this.moduleModel(createModuleDto);
      return await newModule.save();
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        'Failed to create module: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findAll() {
    try {
      return await this.moduleModel.find().sort({ createdAt: -1 });
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        'Failed to fetch modules: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findOne(id: string) {
    try {
      const module = await this.moduleModel.findById(id);

      if (!module) {
        throw new NotFoundException('Module not found');
      }

      return module;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to fetch module: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async update(id: string, updateModuleDto: UpdateModuleDto) {
    try {
      const updatedModule = await this.moduleModel.findByIdAndUpdate(
        id,
        { $set: updateModuleDto },
        { new: true, runValidators: true },
      );

      if (!updatedModule) {
        throw new NotFoundException('Module not found');
      }

      return updatedModule;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to update module: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async remove(id: string) {
    try {
      const deletedModule = await this.moduleModel.findByIdAndDelete(id);

      if (!deletedModule) {
        throw new NotFoundException('Module not found');
      }

      return {
        message: 'Module deleted successfully',
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to delete module: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

<<<<<<< Updated upstream
  async uploadResource(
    id: string,
    file: Express.Multer.File,
    title: string,
  ) {
=======
  private readonly s3 = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
  });

  async uploadResource(id: string, file: Express.Multer.File, title: string) {
>>>>>>> Stashed changes
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

    const resource = (module.resources ?? []).find(
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

    module.resources = (module.resources ?? []).filter(
      (r: any) => r._id.toString() !== resourceId,
    );

    await module.save();

    return {
      message: 'Resource deleted successfully',
    };
  }

  async addResourceUrl(moduleId: string, dto: AddResourceUrlDto) {
    const module = await this.moduleModel.findById(moduleId);

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return this.moduleModel.findByIdAndUpdate(
      moduleId,
      {
        $push: {
          resources: {
            title: dto.title,
            url: dto.url,
            thumbnailUrl: dto.thumbnailUrl,
            fileType: dto.fileType ?? 'video',
            description: dto.description,
            uploadedAt: new Date(),
          },
        },
      },
      { new: true },
    );
  }

  async toggleResourcePublish(moduleId: string, resourceId: string): Promise<any> {
    const module = await this.moduleModel.findById(moduleId);
    if (!module) throw new NotFoundException('Module not found');

    const resource = (module.resources as any).id(resourceId);
    if (!resource) throw new NotFoundException('Resource not found');

    resource.isPublished = !resource.isPublished;
    await module.save();
    return {
      resourceId,
      isPublished: resource.isPublished,
      message: resource.isPublished ? 'Video published' : 'Video unpublished',
    };
  }

  async updateResource(moduleId: string, resourceId: string, title: string) {
    const module = await this.moduleModel.findById(moduleId);

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const resource = (module.resources ?? []).find(
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
