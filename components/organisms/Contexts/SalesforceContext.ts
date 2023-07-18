import { createContext } from "react";
import {SalesforceInfo} from "@/shared/types/salesforceTypes";



export const SalesforceContext = createContext({
    salesforceId:"",
    refreshToken:"",
    setSalesforceInfo:(arg:SalesforceInfo)=>{console.log("setting id",arg)}
});
