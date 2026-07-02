import { HydratedDocument } from 'mongoose';
export type AttendanceDocument = HydratedDocument<Attendance>;
export declare class Attendance {
    studentId: string;
    moduleId: string;
    moduleName: string;
    date: string;
    status: 'present' | 'absent';
    markedAt: string;
    sessionDate?: string;
}
export declare const AttendanceSchema: import("mongoose").Schema<Attendance, import("mongoose").Model<Attendance, any, any, any, any, any, Attendance>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Attendance, import("mongoose").Document<unknown, {}, Attendance, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Attendance & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    studentId?: import("mongoose").SchemaDefinitionProperty<string, Attendance, import("mongoose").Document<unknown, {}, Attendance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    moduleId?: import("mongoose").SchemaDefinitionProperty<string, Attendance, import("mongoose").Document<unknown, {}, Attendance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    moduleName?: import("mongoose").SchemaDefinitionProperty<string, Attendance, import("mongoose").Document<unknown, {}, Attendance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<string, Attendance, import("mongoose").Document<unknown, {}, Attendance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"present" | "absent", Attendance, import("mongoose").Document<unknown, {}, Attendance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    markedAt?: import("mongoose").SchemaDefinitionProperty<string, Attendance, import("mongoose").Document<unknown, {}, Attendance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sessionDate?: import("mongoose").SchemaDefinitionProperty<string | undefined, Attendance, import("mongoose").Document<unknown, {}, Attendance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Attendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Attendance>;
