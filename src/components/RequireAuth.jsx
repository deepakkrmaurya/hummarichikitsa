// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import axiosInstance from "../Helper/axiosInstance";

// const RequireAuth = ({ allowedRoles }) => {
//   const location = useLocation();
//   const [role, setRole] = useState(null);
//   const isLoggedIn = localStorage.getItem('isLoggedIn');
  

//   useEffect(() => {
   
//     async function fetchData() {
//       try {
        
//         const response = await axiosInstance.get('/user/me');
//         // alert(data.role)
//         console.log(response.data. role);
//         setRole(response.data.role)
//       } catch (error) {
//         // Handle errors
//         console.error("Error fetching data:", error);
//       }
//     }
//     fetchData();
//   }, [role]);
//   alert(role);
//   return isLoggedIn && allowedRoles.find((myRole) => myRole === role) ? (
//     <Outlet />
//   ) : isLoggedIn ? (
//     <Navigate to="/denied" state={{ from: location }} replace />
//   ) : (
//     <Navigate to="/login" state={{ from: location }} replace />
//   );
// };

// export default RequireAuth;


import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axiosInstance from "../Helper/axiosInstance";

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  const [role, setRole] = useState(null);
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get("/user/me");
        // console.log(response.data.role);
        setRole(response.data.user.role);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  // Still loading role
  if (isLoggedIn && role === null) {
    return <div>Loading...</div>;
  }

  return isLoggedIn && allowedRoles.includes(role) ? (
    <Outlet />
  ) : isLoggedIn ? (
    <Navigate to="/denied" state={{ from: location }} replace />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RequireAuth;

