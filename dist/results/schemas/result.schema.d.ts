import { HydratedDocument } from 'mongoose';
export type ResultDocument = HydratedDocument<Result>;
export declare class ModuleResult {
    moduleName: string;
    examType: 'Mid exam' | 'Final exam';
    marks: number;
    grade: 'A' | 'B' | 'C' | 'F';
}
export declare const ModuleResultSchema: import("mongoose").Schema<ModuleResult, import("mongoose").Model<ModuleResult, any, any, any, any, any, ModuleResult>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ModuleResult, import("mongoose").Document<unknown, {}, ModuleResult, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ModuleResult & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    moduleName?: import("mongoose").SchemaDefinitionProperty<string, ModuleResult, import("mongoose").Document<unknown, {}, ModuleResult, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ModuleResult & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    examType?: import("mongoose").SchemaDefinitionProperty<"Mid exam" | "Final exam", ModuleResult, import("mongoose").Document<unknown, {}, ModuleResult, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ModuleResult & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    marks?: import("mongoose").SchemaDefinitionProperty<number, ModuleResult, import("mongoose").Document<unknown, {}, ModuleResult, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ModuleResult & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    grade?: import("mongoose").SchemaDefinitionProperty<"A" | "B" | "C" | "F", ModuleResult, import("mongoose").Document<unknown, {}, ModuleResult, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ModuleResult & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ModuleResult>;
export declare class Result {
    studentId: string;
    studentName: string;
    batch: string;
    modules: ModuleResult[];
}
export declare const ResultSchema: import("mongoose").Schema<Result, import("mongoose").Model<Result, any, any, any, any, any, Result>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Result, import("mongoose").Document<unknown, {}, Result, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Result & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    studentId?: import("mongoose").SchemaDefinitionProperty<string, Result, import("mongoose").Document<unknown, {}, Result, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Result & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    studentName?: import("mongoose").SchemaDefinitionProperty<string, Result, import("mongoose").Document<unknown, {}, Result, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Result & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    batch?: import("mongoose").SchemaDefinitionProperty<string, Result, import("mongoose").Document<unknown, {}, Result, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Result & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    modules?: import("mongoose").SchemaDefinitionProperty<ModuleResult[], Result, import("mongoose").Document<unknown, {}, Result, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Result & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Result>;
