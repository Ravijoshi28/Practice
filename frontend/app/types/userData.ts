export interface UserData {
    name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface User{
    id:number,
    name:string | null
}

export interface ShorLinkType{
    id:number,
    originalLink:string,
    shortLink:string,
    createdBy:User,
    createdById:number,
    click:number,
    createdAt:string
}

export interface OriginalLink{
    link?:string,
    alias?:string | null
}

export interface PreviousLinksResponse {
    data: ShorLinkType[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export interface SignupData{
    name?:string,
    email?:string,
    password?:string
}

export interface optData{
    email:string,
    otp:number
}

export interface LoginType{
    email?:string,
    password?:string
}

