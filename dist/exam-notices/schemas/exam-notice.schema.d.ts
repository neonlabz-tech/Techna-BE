import { HydratedDocument } from 'mongoose';
export type ExamNoticeDocument = HydratedDocument<ExamNotice>;
export declare class ExamNotice {
    title: string;
    moduleId: string;
    moduleName: string;
    batch: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: string;
    description?: string;
    isPublished: boolean;
    publishedAt?: Date;
}
export declare const ExamNoticeSchema: import("mongoose").Schema<ExamNotice, import("mongoose").Model<ExamNotice, any, any, any, any, any, ExamNotice>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ExamNotice, import("mongoose").Document<unknown, {}, ExamNotice, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ExamNotice & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    title?: import("mongoose").SchemaDefinitionProperty<string, ExamNotice, import("mongoose").Document<unknown, {}, ExamNotice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    moduleId?: import("mongoose").SchemaDefinitionProperty<string, ExamNotice, import("mongoose").Document<unknown, {}, ExamNotice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    moduleName?: import("mongoose").SchemaDefinitionProperty<string, ExamNotice, import("mongoose").Document<unknown, {}, ExamNotice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    batch?: import("mongoose").SchemaDefinitionProperty<string, ExamNotice, import("mongoose").Document<unknown, {}, ExamNotice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<string, ExamNotice, import("mongoose").Document<unknown, {}, ExamNotice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    startTime?: import("mongoose").SchemaDefinitionProperty<string, ExamNotice, import("mongoose").Document<unknown, {}, ExamNotice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endTime?: import("mongoose").SchemaDefinitionProperty<string, ExamNotice, import("mongoose").Document<unknown, {}, ExamNotice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    venue?: import("mongoose").SchemaDefinitionProperty<string, ExamNotice, import("mongoose").Document<unknown, {}, ExamNotice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, ExamNotice, import("mongoose").Document<unknown, {}, ExamNotice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isPublished?: import("mongoose").SchemaDefinitionProperty<boolean, ExamNotice, import("mongoose").Document<unknown, {}, ExamNotice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    publishedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, ExamNotice, import("mongoose").Document<unknown, {}, ExamNotice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ExamNotice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ExamNotice>;
