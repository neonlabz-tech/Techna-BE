export declare class CreateExamNoticeDto {
    title: string;
    moduleId: string;
    moduleName: string;
    batch: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: string;
    description?: string;
    totalMarks?: number;
    status?: 'upcoming' | 'ongoing' | 'completed';
    isPublished?: boolean;
}
