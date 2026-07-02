import { Model } from 'mongoose';
import { Announcement, AnnouncementDocument } from './schemas/announcement.schema';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
export declare class AnnouncementsService {
    private readonly announcementModel;
    constructor(announcementModel: Model<AnnouncementDocument>);
    create(dto: CreateAnnouncementDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Announcement, {}, import("mongoose").DefaultSchemaOptions> & Announcement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Announcement, {}, import("mongoose").DefaultSchemaOptions> & Announcement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Announcement, {}, import("mongoose").DefaultSchemaOptions> & Announcement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Announcement, {}, import("mongoose").DefaultSchemaOptions> & Announcement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    update(id: string, dto: UpdateAnnouncementDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Announcement, {}, import("mongoose").DefaultSchemaOptions> & Announcement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Announcement, {}, import("mongoose").DefaultSchemaOptions> & Announcement & {
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
}
