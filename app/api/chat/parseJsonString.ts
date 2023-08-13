// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseJsonString=(arg: string | Record<string, any>)=>{
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
