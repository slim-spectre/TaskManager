const BASE_URL = "http://localhost:5208/";

export const authApi = {
    async LogIn(email:string,password:string){
        const response = await fetch(BASE_URL + 'auth/login',{
            method:"POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body:JSON.stringify({email,password})
        });
        return response;
    },
    async SignUp(email:string,password:string){
        const response = await fetch(BASE_URL + 'auth/register', {
            method:"POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body:JSON.stringify({email,password})
        });
        return response
    }
}