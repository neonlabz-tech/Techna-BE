import { HydratedDocument } from 'mongoose';
export type SchoolModuleDocument = HydratedDocument<Module>;
export declare class Module {
    name: string;
    teacherId: string;
    teacherName: string;
    description: string;
    duration: string;
    fee: number;
    batch: string;
    status: 'active' | 'inactive';
    term?: string;
    unit?: number;
    subjectCategory?: 'main' | 'basket' | 'none';
    resources?: {
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
}
export declare const ModuleSchema: import("mongoose").Schema<Module, import("mongoose").Model<Module, any, any, any, any, any, Module>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Module, import("mongoose").Document<unknown, {}, Module, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Module & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Module, import("mongoose").Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    teacherId?: import("mongoose").SchemaDefinitionProperty<string, Module, import("mongoose").Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    teacherName?: import("mongoose").SchemaDefinitionProperty<string, Module, import("mongoose").Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Module, import("mongoose").Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    duration?: import("mongoose").SchemaDefinitionProperty<string, Module, import("mongoose").Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    fee?: import("mongoose").SchemaDefinitionProperty<number, Module, import("mongoose").Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    batch?: import("mongoose").SchemaDefinitionProperty<string, Module, import("mongoose").Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"active" | "inactive", Module, import("mongoose").Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    term?: import("mongoose").SchemaDefinitionProperty<string | undefined, Module, import("mongoose").Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    unit?: import("mongoose").SchemaDefinitionProperty<number | undefined, Module, import("mongoose").Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subjectCategory?: import("mongoose").SchemaDefinitionProperty<"main" | "basket" | "none" | undefined, Module, import("mongoose").Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    resources?: import("mongoose").SchemaDefinitionProperty<{
        title: string;
        fileType: string;
        fileUrl: string;
        fileKey: string;
        url?: string;
        thumbnailUrl?: string;
        description?: string;
        uploadedAt?: Date;
        isPublished?: boolean;
    }[] | undefined, Module, import("mongoose").Document<unknown, {}, Module, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Module & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Module>;
