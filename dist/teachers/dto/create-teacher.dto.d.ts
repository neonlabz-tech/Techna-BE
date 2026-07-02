export declare class CreateTeacherDto {
    fullName: string;
    email: string;
    phone: string;
    subject?: string[];
    qualification?: string;
    experience: string;
    address: string;
    joinDate: string;
    status?: 'active' | 'inactive';
    password?: string;
    firstName?: string;
    lastName?: string;
    degree?: string[];
    specializations?: string[];
    awards?: string[];
    achievements?: string[];
    biography?: string;
}
