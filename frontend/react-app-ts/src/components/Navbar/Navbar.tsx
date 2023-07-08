import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { useGlobalContext } from "../../Context";

import NavbarStyles from "./NavbarStyles.module.css";

const Navbar = () => {
  const { isLoggedIn, setAndClearIsLoggedIn, setAndClearUsername, username } = useGlobalContext();

  const navigate = useNavigate();

  const logoutUser = async (): Promise<void> => {
    try {
      await axios.post("/api/v1/auth/logout", {});
      setAndClearIsLoggedIn(false);
      setAndClearUsername("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <nav className={NavbarStyles.nav}>
      {isLoggedIn ? <h1>{username}'s Food App</h1> : <h1>Food App</h1>}
      <div className={NavbarStyles.links}>
      {/* Conditionally render login / log out button */}
      <Link to="/" className={NavbarStyles.link}>Home</Link>
      {isLoggedIn ? (
          <>
            <Link to="/calendar" className={NavbarStyles.link}>Calendar</Link>
            <button onClick={handleLogout} className={NavbarStyles.link}>Logout</button>
          </>
      ) : (
          <button onClick={() => navigate("/login")} className={NavbarStyles.link}>Log In</button>
      )}
      </div>
    </nav>
  );
};
export default Navbar;
