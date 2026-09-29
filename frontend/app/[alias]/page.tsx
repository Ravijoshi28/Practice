
import { redirect } from "next/navigation";
import { AxiosInstance } from "../lib/axios";

export default async function Redirected({params}:{params: Promise<{ alias: string }>}){
    const {alias}=await params;
    redirect(AxiosInstance.getUri({ url: `/${encodeURIComponent(alias)}` }));
}
