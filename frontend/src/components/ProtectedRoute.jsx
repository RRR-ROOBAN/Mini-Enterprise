import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children }) => {

  const token =
    localStorage.getItem("token");

  const refreshToken =
    localStorage.getItem("refresh_token");

  const role =
    localStorage.getItem("role");


  // ✅ Invalid Session
  if (

    !token
    || !refreshToken
    || !role
  ) {

    // ✅ Clear Broken Storage
    localStorage.clear();

    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;