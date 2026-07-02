import { HydratedDocument } from 'mongoose';
export type CounterDocument = HydratedDocument<Counter>;
export declare class Counter {
    name: string;
    seq: number;
}
export declare const CounterSchema: import("mongoose").Schema<Counter, import("mongoose").Model<Counter, any, any, any, any, any, Counter>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Counter, import("mongoose").Document<unknown, {}, Counter, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Counter & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Counter, import("mongoose").Document<unknown, {}, Counter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Counter & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    seq?: import("mongoose").SchemaDefinitionProperty<number, Counter, import("mongoose").Document<unknown, {}, Counter, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Counter & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Counter>;
