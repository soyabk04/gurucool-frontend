import { genAccessToken } from "@/services/auth.service";
import { Navigate } from "react-router-dom";

export const generateAccessToken=async ()=>{
    const response=await genAccessToken();
    if(!response.success){
         <Navigate to="/" replace />
    }
}