import {kv} from "@vercel/kv";

export const getCachedSalesforceData=async(refreshToken:string)=>{
    return await kv.get(`${refreshToken}/data`);
}


export const setCachedSalesforceData=async(refreshToken:string, salesforceDescriptions:string)=>{
    return await  kv.set(`${refreshToken}/data`,salesforceDescriptions);
}
