import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <h2>Page not found!</h2>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
    </>
  );
};

export { NotFound };
