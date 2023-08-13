import {useEffect, useState} from "react";


export const UseChangeButtonState = () => {
    const [alteredState, setAlteredSate] = useState(false);

    useEffect(() => {
        if (!alteredState) return;
        const timer = setTimeout(() => {
            setAlteredSate(false);
        }, 4000);

        return () => {
            clearTimeout(timer);
        };
    }, [alteredState]);
    return {alteredState,setAlteredSate}

};


