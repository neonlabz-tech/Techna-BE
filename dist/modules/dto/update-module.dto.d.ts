export declare class UpdateModuleDto {
    name?: string;
    teacherId?: string;
    teacherName?: string;
    description?: string;
    duration?: string;
    fee?: number;
    batch?: string;
    status?: 'active' | 'inactive';
    term?: string;
    unit?: number;
    subjectCategory?: 'main' | 'basket' | 'none';
}
