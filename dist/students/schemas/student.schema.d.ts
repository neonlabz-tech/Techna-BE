import { HydratedDocument } from 'mongoose';
export type StudentDocument = HydratedDocument<Student>;
export declare enum OlGrade {
    A_PLUS = "A+",
    A = "A",
    A_MINUS = "A-",
    B_PLUS = "B+",
    B = "B",
    B_MINUS = "B-",
    C_PLUS = "C+",
    C = "C",
    C_MINUS = "C-",
    S = "S",
    F = "F",
    AB = "AB"
}
export declare class OlResultRow {
    year: string;
    indexNumber: string;
    english?: string;
    mathematics?: string;
    science?: string;
    sinhala?: string;
    tamil?: string;
}
export declare const OlResultRowSchema: import("mongoose").Schema<OlResultRow, import("mongoose").Model<OlResultRow, any, any, any, any, any, OlResultRow>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OlResultRow, import("mongoose").Document<unknown, {}, OlResultRow, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<OlResultRow & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    year?: import("mongoose").SchemaDefinitionProperty<string, OlResultRow, import("mongoose").Document<unknown, {}, OlResultRow, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OlResultRow & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    indexNumber?: import("mongoose").SchemaDefinitionProperty<string, OlResultRow, import("mongoose").Document<unknown, {}, OlResultRow, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OlResultRow & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    english?: import("mongoose").SchemaDefinitionProperty<string | undefined, OlResultRow, import("mongoose").Document<unknown, {}, OlResultRow, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OlResultRow & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    mathematics?: import("mongoose").SchemaDefinitionProperty<string | undefined, OlResultRow, import("mongoose").Document<unknown, {}, OlResultRow, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OlResultRow & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    science?: import("mongoose").SchemaDefinitionProperty<string | undefined, OlResultRow, import("mongoose").Document<unknown, {}, OlResultRow, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OlResultRow & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sinhala?: import("mongoose").SchemaDefinitionProperty<string | undefined, OlResultRow, import("mongoose").Document<unknown, {}, OlResultRow, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OlResultRow & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tamil?: import("mongoose").SchemaDefinitionProperty<string | undefined, OlResultRow, import("mongoose").Document<unknown, {}, OlResultRow, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OlResultRow & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, OlResultRow>;
export declare enum AlSubject {
    ENGINEERING_TECHNOLOGY = "Engineering Technology",
    BIO_SYSTEMS_TECHNOLOGY = "Bio Systems Technology",
    SCIENCE_FOR_TECHNOLOGY = "Science For Technology",
    ICT = "Information Communication Technology",
    AGRICULTURAL_SCIENCE = "Agricultural Science",
    MATHEMATICS = "Mathematics",
    GEOGRAPHY = "Geography"
}
export declare enum District {
    COLOMBO = "Colombo",
    GAMPAHA = "Gampaha",
    KALUTARA = "Kalutara",
    KANDY = "Kandy",
    MATALE = "Matale",
    NUWARA_ELIYA = "Nuwara Eliya",
    GALLE = "Galle",
    MATARA = "Matara",
    HAMBANTOTA = "Hambantota",
    JAFFNA = "Jaffna",
    KILINOCHCHI = "Kilinochchi",
    MANNAR = "Mannar",
    MULLAITIVU = "Mullaitivu",
    VAVUNIYA = "Vavuniya",
    PUTTALAM = "Puttalam",
    KURUNEGALA = "Kurunegala",
    ANURADHAPURA = "Anuradhapura",
    POLONNARUWA = "Polonnaruwa",
    BADULLA = "Badulla",
    MONARAGALA = "Monaragala",
    RATNAPURA = "Ratnapura",
    KEGALLE = "Kegalle",
    AMPARA = "Ampara",
    BATTICALOA = "Batticaloa",
    TRINCOMALEE = "Trincomalee"
}
export declare class Student {
    studentId: string;
    qrToken: string;
    qrCode?: string;
    qrImageKey?: string;
    qrCodeUrl?: string;
    email: string;
    password: string;
    phone: string;
    batch?: string;
    modules: string[];
    status: 'pending' | 'approved' | 'rejected';
    enrolledAt: string;
    approvedAt?: string;
    rejectionReason?: string;
    avatar?: string;
    profilePhoto?: string;
    profilePhotoKey?: string;
    parentName?: string;
    parentPhone?: string;
    address?: string;
    dob?: string;
    admissionNumber?: string;
    serialNumber?: string;
    applicationReference?: string;
    fullNameTamil?: string;
    fullNameEnglish?: string;
    dateOfBirth?: Date;
    nicNo?: string;
    school?: string;
    whatsappNo?: string;
    parentsNo?: string;
    permanentAddress?: string;
    administrativeDistrict?: string;
    fixedTelephone?: string;
    residingSince?: string;
    race?: string;
    religion?: string;
    citizenByDescent?: string;
    contactAddress?: string;
    postalCode?: string;
    fatherName?: string;
    motherName?: string;
    guardianName?: string;
    contactPerson?: string;
    guardianAddress?: string;
    guardianFixedTel?: string;
    guardianMobile?: string;
    olCategory?: string;
    olYear?: string;
    olIndexNumber?: string;
    olNameUsed?: string;
    olAccept?: string;
    olResults?: OlResultRow[];
    subjects?: string[];
    agreed?: boolean;
    resetToken?: string;
    resetTokenExpiry?: Date;
}
export declare const StudentSchema: import("mongoose").Schema<Student, import("mongoose").Model<Student, any, any, any, any, any, Student>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Student, import("mongoose").Document<unknown, {}, Student, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    studentId?: import("mongoose").SchemaDefinitionProperty<string, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qrToken?: import("mongoose").SchemaDefinitionProperty<string, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qrCode?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qrImageKey?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qrCodeUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    password?: import("mongoose").SchemaDefinitionProperty<string, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    batch?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    modules?: import("mongoose").SchemaDefinitionProperty<string[], Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"pending" | "approved" | "rejected", Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    enrolledAt?: import("mongoose").SchemaDefinitionProperty<string, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    approvedAt?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rejectionReason?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    avatar?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    profilePhoto?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    profilePhotoKey?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    parentName?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    parentPhone?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dob?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    admissionNumber?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    serialNumber?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    applicationReference?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    fullNameTamil?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    fullNameEnglish?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dateOfBirth?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    nicNo?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    school?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    whatsappNo?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    parentsNo?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    permanentAddress?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    administrativeDistrict?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    fixedTelephone?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    residingSince?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    race?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    religion?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    citizenByDescent?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    contactAddress?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    postalCode?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    fatherName?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    motherName?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    guardianName?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    contactPerson?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    guardianAddress?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    guardianFixedTel?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    guardianMobile?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    olCategory?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    olYear?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    olIndexNumber?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    olNameUsed?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    olAccept?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    olResults?: import("mongoose").SchemaDefinitionProperty<OlResultRow[] | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subjects?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    agreed?: import("mongoose").SchemaDefinitionProperty<boolean | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    resetToken?: import("mongoose").SchemaDefinitionProperty<string | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    resetTokenExpiry?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Student, import("mongoose").Document<unknown, {}, Student, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Student & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Student>;
