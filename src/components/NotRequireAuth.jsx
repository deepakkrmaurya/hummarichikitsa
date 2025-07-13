import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const NotRequireAuth = () => {
  const { isLoggedIn }  = useSelector((state) => state.auth);
  //  alert(isLoggedIn)
  return isLoggedIn ? <Navigate to="/"  /> : <Outlet />;
};

export default NotRequireAuth;
