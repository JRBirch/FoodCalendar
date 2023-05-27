import Navbar from "../components/Navbar";
import {Outlet} from "react-router-dom";

const AppLayout = () => {
  return (
    <>
        <Navbar/>
        <section className="main-section">
            <Outlet/>    
        </section> 
    </>
  )
}
export default AppLayout