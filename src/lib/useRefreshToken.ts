'use client'
import axios from "axios";
import { useSession } from "next-auth/react"
import { getSession} from "next-auth/react";
export const useRefreshToken  = async() => {
    const session =await getSession();
    

const refreshToken =async ()=>{
    const res = await axios.post("/auth/refresh",{
        refresh : session?.user.refreshToken
    })

if (session) session.user.accessToken = res.data.accessToken

}

return refreshToken;
}