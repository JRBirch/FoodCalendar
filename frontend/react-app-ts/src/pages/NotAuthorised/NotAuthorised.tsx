import { Link } from "react-router-dom";

const NotAuthorised = () => {
  return (
    <>
      <h2>You are not authorised to access this information!</h2>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
    </>
  );
};
export default NotAuthorised;
