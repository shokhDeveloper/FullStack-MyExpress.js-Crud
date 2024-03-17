const SERVER = "http://10.10.3.223:4000"
const simpleReuestMethods = ["GET", "DELETE"]
const request = async (path: string, reqMethod: string, reqBody?:GenericsType<object>):Promise<any> => {
    try{
        const req = await fetch(SERVER + path, !simpleReuestMethods.includes(reqMethod) ? {
            method: reqMethod,
            headers: {
                "Content-Type": "application/json"
            },
            body: reqBody ? JSON.stringify(reqBody): ""
        }: {method: reqMethod })
        if(req.ok){
            const res = await req.json();
            return res
        }
    }catch(error){
        console.log(error)
    }
}