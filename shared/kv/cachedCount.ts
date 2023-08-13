import {kv} from "@vercel/kv";


export const getCachedCount=async(salesforceId:string)=>{
    return await kv.get(`${salesforceId}/count`) as number
}


export const incrementCachedCount=async(salesforceId:string)=>{
    const count=await getCachedCount(salesforceId);
    return await kv.set(`${salesforceId}/count`,count+1);
}

export const initCachedCount=async(salesforceId:string)=>{
    const count=await getCachedCount(salesforceId);
    if (count)return
    return await kv.set(`${salesforceId}/count`,0);
}
