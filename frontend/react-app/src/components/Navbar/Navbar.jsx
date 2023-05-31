import { Link } from "react-router-dom";
import NavbarStyles from "./NavbarStyles.module.css";


const Navbar = () => {
  return (
    <nav className={NavbarStyles.nav}>
      <h1>Food App</h1>
      <div className={NavbarStyles.links}>
        <Link to="/">Home</Link>
        <Link to="/foodlist">FoodList</Link>
      </div>
    </nav>
  );
};
export default Navbar;
