import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";


const RequireAuth = () => {

    const { auth } = useAuth();
    const location = useLocation();
    console.log('in client auth '+JSON.stringify(auth));
    return (
        auth?.user && auth?.accessToken
            ? <Outlet />
            : auth?.user
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;