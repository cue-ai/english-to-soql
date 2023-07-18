import {useEffect, useState} from "react";
import {SalesforceInfo} from "@/shared/types/salesforceTypes";

export const useGetSalesforceInfo = () => {

    const [salesforceInfo, setSalesforceInfoLocal] = useState<SalesforceInfo>({
        salesforceId:"",
        refreshToken:""
    });

    useEffect(() => {
        const tempSalesforceInfo = localStorage.getItem("salesforceInfo");
        if (tempSalesforceInfo) {
            setSalesforceInfoLocal?.(JSON.parse(tempSalesforceInfo));
        }
    }, [localStorage.getItem("salesforceInfo")]);


    const setSalesforceInfo = (value:SalesforceInfo) => {
        localStorage.setItem("salesforceInfo",JSON.stringify(value))
        setSalesforceInfoLocal(value)
    };

    return {salesforceInfo, setSalesforceInfo}
};


