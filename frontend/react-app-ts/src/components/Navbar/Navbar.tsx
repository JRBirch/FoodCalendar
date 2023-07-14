import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";

import { useGlobalContext } from "../../Context";

import NavbarStyles from "./NavbarStyles.module.css";

const Navbar = () => {
  const { isLoggedIn, setAndClearIsLoggedIn, setAndClearUsername, username } = useGlobalContext();
  const [showLinks, setShowLinks] = useState(false);
  const linksContainerRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  

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

  useEffect(() => {
    if(!linksRef.current) return;
    if(!linksContainerRef.current) return;
    const linksHeight = linksRef.current.getBoundingClientRect().height;
    console.log(linksHeight);
    if (showLinks) {
      linksContainerRef.current.style.height = `${linksHeight}px`;
    } else {
      linksContainerRef.current.style.height = "0px";
    }
  }, [showLinks]);

  return (
    <nav className={NavbarStyles.nav}>
      <div className={NavbarStyles.main_headings}>
      {isLoggedIn ? <h1>{username}'s Food App</h1> : <h1>Food App</h1>}

      <button onClick={()=>setShowLinks(!showLinks)} className={NavbarStyles.button}><FaBars/></button>
      </div>
      <div ref={linksContainerRef} className={NavbarStyles.links_wrapper}>
        <div ref={linksRef} className={NavbarStyles.links}>
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
      </div>
    </nav>
  );
};
export default Navbar;
