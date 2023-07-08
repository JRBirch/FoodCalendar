import { Link } from "react-router-dom";

import { useGlobalContext } from "../../Context";

import Styles from "./HomeStyles.module.css";

const Home = () => {
  const { isLoggedIn, username } = useGlobalContext();
  return <>
  {isLoggedIn?(
    <>
    <h2>Welcome to the Food App {username}!</h2>
    <p>Use your food calendar: <Link to="/calendar" className={Styles.link}>Calendar</Link></p>
    </>
  ):(
    <>
    <h2>Welcome to the Food App!</h2>
    <p>Get started by creating an account: <Link to="/register" className={Styles.link}>Register</Link></p>
    <p>Already have an account: <Link to="/login" className={Styles.link}>Login</Link></p>
    </>
  )}
    
  </>
};
export default Home;
