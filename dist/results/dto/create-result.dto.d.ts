export declare class CreateModuleResultDto {
    moduleName: string;
    examType: 'Mid exam' | 'Final exam';
    marks: number;
}
export declare class CreateResultDto {
    studentId: string;
    modules: CreateModuleResultDto[];
}
