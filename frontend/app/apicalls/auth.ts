import { AxiosInstance } from "../lib/axios"
import { SignupData ,LoginType} from "../types/userData"




export async function Signup(data:SignupData){
    const res=await AxiosInstance.post("/auth/signup",data);
    return res;
}

export async function sendOtp(){
    const res=await AxiosInstance.get("/auth/requestOtp");
    return res;
}

export async function Request_Otp(data:string){
    const res=await AxiosInstance.post("/auth/otp",{data});
    return res;
}

export async function Verify_otp({
  email,
  otp,
}: {
  email: string;
  otp: string;
}){
    const res=await AxiosInstance.post(`/auth/verify`, {otp},{params:{email}});
    return res;
}

export async function LoginCall(data:LoginType) {
    const res=await AxiosInstance.post(`/auth/login`, data);
    return res;
}