import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { AddResourceUrlDto } from './dto/add-resource-url.dto';
export declare class ModulesController {
    private readonly modulesService;
    constructor(modulesService: ModulesService);
    create(createModuleDto: CreateModuleDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/module.schema").Module, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/module.schema").Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/module.schema").Module, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/module.schema").Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(status?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/module.schema").Module, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/module.schema").Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/module.schema").Module, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/module.schema").Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findPublished(): Promise<{
        resources: {
            title: string;
            fileType: string;
            fileUrl: string;
            fileKey: string;
            url?: string;
            thumbnailUrl?: string;
            description?: string;
            uploadedAt?: Date;
            isPublished?: boolean;
        }[];
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        name: string;
        teacherId: string;
        teacherName: string;
        description: string;
        duration: string;
        fee: number;
        batch: string;
        status: "active" | "inactive";
        term?: string;
        unit?: number;
        subjectCategory?: "main" | "basket" | "none";
        __v: number;
        id: string;
    }[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/module.schema").Module, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/module.schema").Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/module.schema").Module, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/module.schema").Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updateModuleDto: UpdateModuleDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/module.schema").Module, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/module.schema").Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/module.schema").Module, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/module.schema").Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string): Promise<{
        message: string;
    }>;
    uploadResource(id: string, file: Express.Multer.File, title: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/module.schema").Module, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/module.schema").Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/module.schema").Module, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/module.schema").Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    addResourceUrl(id: string, addResourceUrlDto: AddResourceUrlDto): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/module.schema").Module, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/module.schema").Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/module.schema").Module, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/module.schema").Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    deleteResource(moduleId: string, resourceId: string): Promise<{
        message: string;
    }>;
    updateResource(moduleId: string, resourceId: string, title: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/module.schema").Module, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/module.schema").Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/module.schema").Module, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/module.schema").Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    togglePublish(moduleId: string, resourceId: string): Promise<any>;
}
