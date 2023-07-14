import { Link } from "react-router-dom";

import { useGlobalContext } from "../../Context";

import food1 from "../../images/food1.jpeg"
import food2 from "../../images/food2.jpeg"
import food3 from "../../images/food3.jpeg"
import Styles from "./HomeStyles.module.css";

const Home = () => {
  const { isLoggedIn, username } = useGlobalContext();
  return <>
  {isLoggedIn?(
    <>
    <h2>Welcome to the Food App {username}!</h2>
    <br/>
    <p>Use your food calendar: <Link to="/calendar" className={Styles.link}>Calendar</Link></p>
    </>
  ):(
    <>
    <h2>Welcome to the Food App!</h2>
    <br/>
    <p>Get started by creating an account: <Link to="/register" className={Styles.link}>Register</Link></p>
    <br/> 
    <p>Already have an account: <Link to="/login" className={Styles.link}>Login</Link></p>
    </>
  )}
  <div className={Styles.image_wrapper}> 
    <img src={food1} alt="food" className={Styles.image}/>
    <img src={food2} alt="food" className={Styles.image}/>
    <img src={food3} alt="food" className={Styles.image}/>
  </div>
  </>
};
export default Home;
