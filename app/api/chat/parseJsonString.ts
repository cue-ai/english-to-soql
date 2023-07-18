
export const parseJsonString=(arg: any)=>{
    if (typeof arg === 'string') {
        try {
            return JSON.parse(arg);
        } catch (e) {
            return arg;
        }
    } else {
        return arg;
    }
}
