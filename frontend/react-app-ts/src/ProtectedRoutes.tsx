import { useGlobalContext } from "./Context";
import { Outlet, Navigate } from "react-router-dom";
import NotAuthorised from "./pages/NotAuthorised/NotAuthorised";

// How to create protected routes
const ProtectedRoute = () => {
  const { isLoggedIn } = useGlobalContext();
  return isLoggedIn ? <Outlet /> : <NotAuthorised />;
};

export default ProtectedRoute;
