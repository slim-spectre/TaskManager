import { Navigate } from "react-router-dom";
import type { ProtectedRoutesProps } from "../interfaces/ProtectedRoutesProps";


function ProtectedRoutes({children} : ProtectedRoutesProps){
    const token = localStorage.getItem("accessToken");
    
    if(!token){
        return <Navigate to="/login" replace />
    }

    return <>{children}</>;
}

export default ProtectedRoutes;