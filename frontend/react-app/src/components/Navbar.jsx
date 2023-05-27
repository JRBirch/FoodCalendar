import { Link } from "react-router-dom"
import "./Navbar.css"

const Navbar = () => {
  return (
    <nav>
        <h1>Food App</h1>
        <div className="links">
            <Link to="/">Home</Link>
            <Link to="/foodlist">FoodList</Link>
        </div>
        
    </nav>
    
  )
}
export default Navbar