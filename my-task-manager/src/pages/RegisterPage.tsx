import { useState } from "react";
import { validateEmail,validatePassword } from "../utils/validation";
import { authApi } from "../services/authApi";
import type { IRegisterProps } from "../interfaces/IRegisterProps";
import { useNavigate } from "react-router-dom";
import {Link} from 'react-router-dom'
import { toast } from "react-hot-toast";


function RegisterPage({t,onRegisterSuccess} : IRegisterProps){
    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [emailError,setEmailError] = useState<string>("");
    const [passwordError,setPasswordError] = useState<string>("");
    const [backendError,setBackendError] = useState<string>("");

    const navigate = useNavigate();


    const handleSubmit = async () => {
        try{
            const response = await authApi.SignUp(email,password);

            if(!response.ok){
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.message || "This account already exist");
                return;
            }
            const data = await response.json(); 
            localStorage.setItem('accessToken',data.access);
            localStorage.setItem('refreshToken',data.refresh);
            onRegisterSuccess(data.access);
            navigate("/tasks")
            toast.success("Signed up successfully");
            
            
        } catch(error){
            toast.error("Network error,please try again later");
            setBackendError(String(error));
        }
        
    }


    const handleEmail = (e :  React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        setEmail(email);
        const error = validateEmail(email,t.errors.emailError);
        setEmailError(error);
    }

    const handlePassword = (e : React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        setPassword(password);
        const error = validatePassword(password,t.errors.passwordError);
        setPasswordError(error);
    }

    const isInvalid = emailError.trim().length > 0 || passwordError.trim().length > 0;

    return (
        <div className="RegisterMain">
            <div className="registerBlock">
                <p>Nice to meet you!</p>
                <input type="email" value={email} placeholder="Enter your email" onChange={handleEmail}/>
                {emailError && <span className="error-text">{emailError}</span>}
                <input type="password" value={password} placeholder="Enter your password" onChange={handlePassword} />
                {passwordError && <span className="error-text">{passwordError}</span>}
                <button onClick={handleSubmit} disabled={isInvalid}>Sign up</button>
                {backendError && <span className="error-text">{backendError}</span>}
                <Link to='/login'>Already have an account?</Link>
            </div>
        </div>
    );
}

export default RegisterPage;