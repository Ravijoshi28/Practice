import toast from "react-hot-toast";
import axios from "axios";
import { AxiosInstance } from "../lib/axios";
import type { OriginalLink, PreviousLinksResponse } from "../types/userData";


export async function ShortApi(data:OriginalLink){
    console.log(data);
const res=await AxiosInstance.post("/shortner",data);
console.log(res);
}

export async function GetData(page = 1, limit = 10) {
  try {
    const response = await AxiosInstance.get<PreviousLinksResponse>(
      "/getData",
      { params: { page, limit } }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        toast.error(
          error.response.data?.message ?? "Too many requests"
        );
      }
    }

    throw error;
  }
}



