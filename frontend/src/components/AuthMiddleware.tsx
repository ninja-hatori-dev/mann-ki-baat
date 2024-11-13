
import { Navigate, Outlet } from 'react-router-dom';

export const AuthMiddleware = ()=>{
   const jwt = localStorage.getItem('token');
   if(!jwt){
    return <Navigate to="/signin" replace />;
   }
   return <Outlet/>;
};
