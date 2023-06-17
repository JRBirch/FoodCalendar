import { useGlobalContext } from "../Context";
import { Outlet } from "react-router-dom";
import NotAuthorised from "../pages/NotAuthorised/NotAuthorised";

const ProtectedRoute = () => {
  const { isLoggedIn } = useGlobalContext();
  return isLoggedIn ? <Outlet /> : <NotAuthorised />;
};

export default ProtectedRoute;
