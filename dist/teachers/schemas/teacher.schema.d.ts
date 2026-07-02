import { HydratedDocument } from 'mongoose';
export type TeacherDocument = HydratedDocument<Teacher>;
export declare class Teacher {
    fullName: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    phone: string;
    subject: string[];
    qualification?: string;
    experience: string;
    address: string;
    joinDate: string;
    status: 'active' | 'inactive';
    photoUrl?: string;
    photoKey?: string;
    degree?: string[];
    specializations?: string[];
    awards?: string[];
    achievements?: string[];
    biography?: string;
}
export declare const TeacherSchema: import("mongoose").Schema<Teacher, import("mongoose").Model<Teacher, any, any, any, any, any, Teacher>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    fullName?: import("mongoose").SchemaDefinitionProperty<string, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    firstName?: import("mongoose").SchemaDefinitionProperty<string | undefined, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastName?: import("mongoose").SchemaDefinitionProperty<string | undefined, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    password?: import("mongoose").SchemaDefinitionProperty<string, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subject?: import("mongoose").SchemaDefinitionProperty<string[], Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qualification?: import("mongoose").SchemaDefinitionProperty<string | undefined, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    experience?: import("mongoose").SchemaDefinitionProperty<string, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    joinDate?: import("mongoose").SchemaDefinitionProperty<string, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"active" | "inactive", Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    photoUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    photoKey?: import("mongoose").SchemaDefinitionProperty<string | undefined, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    degree?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    specializations?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    awards?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    achievements?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    biography?: import("mongoose").SchemaDefinitionProperty<string | undefined, Teacher, import("mongoose").Document<unknown, {}, Teacher, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Teacher & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Teacher>;
