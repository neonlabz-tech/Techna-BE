export declare class OlResultRowDto {
    year: string;
    indexNumber: string;
    english?: string;
    mathematics?: string;
    science?: string;
    sinhala?: string;
    tamil?: string;
}
export declare class AccountSectionDto {
    email: string;
    password: string;
}
export declare class PersonalSectionDto {
    fullNameTamil?: string;
    fullNameEnglish: string;
    dateOfBirth?: string;
    dobDay?: number;
    dobMonth?: number;
    dobYear?: number;
    nicNo: string;
    school?: string;
    whatsappNo: string;
    parentsNo?: string;
    permanentAddress: string;
    administrativeDistrict: string;
    fixedTelephone?: string;
    residingSince?: string;
    race?: string;
    religion?: string;
    citizenByDescent?: string;
    contactAddress?: string;
    postalCode?: string;
}
export declare class ParentSectionDto {
    fatherName?: string;
    motherName?: string;
    guardianName?: string;
    contactPerson?: string;
    guardianAddress?: string;
    guardianFixedTel?: string;
    guardianMobile?: string;
}
export declare class OlRecordsSectionDto {
    olCategory?: string;
    olYear?: string;
    olIndexNumber?: string;
    olNameUsed?: string;
    olAccept?: string;
    olResults?: OlResultRowDto[];
}
export declare class SubjectSectionDto {
    subjects: string[];
    agreed: boolean;
}
export declare class RegisterStudentDto {
    account: AccountSectionDto;
    personal: PersonalSectionDto;
    parent?: ParentSectionDto;
    olRecords?: OlRecordsSectionDto;
    subjectSelection: SubjectSectionDto;
    batch?: string;
}
