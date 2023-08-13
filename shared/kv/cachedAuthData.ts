import {SalesforceAuthCache} from "@/shared/types/salesforceTypes";
import {kv} from "@vercel/kv";

export const getCachedAuthData=async(refreshToken:string)=>{
    return await kv.get(refreshToken) as SalesforceAuthCache
}


export const setCachedAuthData=async(refreshToken:string, authCache:SalesforceAuthCache)=>{
    return await  kv.set(refreshToken,authCache);
}


