import { createContext } from "react";
import {SalesforceInfo} from "@/shared/types/salesforceTypes";


export type SalesforceContextType={
    salesforceId:string;
    refreshToken:string,
    setSalesforceInfo:(arg:SalesforceInfo)=>void
}

const defaultValue: SalesforceContextType = {
    salesforceId:"",
    refreshToken:"",
    setSalesforceInfo:()=>{}
};

export const SalesforceContext = createContext<SalesforceContextType>(defaultValue);
