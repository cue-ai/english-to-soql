import {kv} from "@vercel/kv";
import {CachedQueryResult} from "@/shared/types/salesforceTypes";
import {v4 as uuidv4} from "uuid";

export const getCachedQuery=async(id:string)=>{
    return await kv.get(`${id}`) as CachedQueryResult | null;
}


export const setCachedQuery=async(salesforceId:string, queryResult:CachedQueryResult)=>{
    const queryId = uuidv4();
    const newId=`${salesforceId}-${queryId}`
    await kv.set(`${ newId}`,queryResult);
    return newId
}
