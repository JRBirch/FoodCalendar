import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import NavbarStyles from "./NavbarStyles.module.css";
import { useGlobalContext } from "../../Context";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, setUsername } = useGlobalContext();

  const navigate = useNavigate();

  const logoutUser = async (): Promise<void> => {
    try {
      await axios.post("/api/v1/auth/logout", {});
      setIsLoggedIn(false);
      setUsername("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    console.log("Log user out!");
    logoutUser();
  };

  return (
    <nav className={NavbarStyles.nav}>
      <h1>Food App</h1>
      <div className={NavbarStyles.links}>
        <Link to="/">Home</Link>
        <Link to="/foodlist">FoodList</Link>
      </div>

      {/* Conditionally render login / log out button */}
      {isLoggedIn ? (
        <div className="logout-button">
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="login-button">
          <button onClick={() => navigate("/login")}>Log In</button>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
