import { ReactNode } from "react"; 
import { Navigate, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode; 
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
   
    return <Navigate to="/" state={{ from: location }} replace />;
  }

 
  return children;
};

export default ProtectedRoute;
