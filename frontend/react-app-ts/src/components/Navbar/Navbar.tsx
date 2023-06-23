import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../Context";

import NavbarStyles from "./NavbarStyles.module.css";

const Navbar = () => {
  const { isLoggedIn, setAndClearIsLoggedIn, setAndClearUsername } = useGlobalContext();

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
      <h1>Food App</h1>
      <div className={NavbarStyles.links}>
        <Link to="/">Home</Link>
        <Link to="/calendar">Calendar</Link>
      </div>

      {/* Conditionally render login / log out button */}
      {isLoggedIn ? (
        <div>
          <button onClick={handleLogout} className={NavbarStyles.button}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={() => navigate("/login")} className={NavbarStyles.button}>Log In</button>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
