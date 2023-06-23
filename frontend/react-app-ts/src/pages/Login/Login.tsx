import { useState } from "react";
import { Login } from "../../../../../backend/src/controllers/auth";
import axios from "axios";
import { useGlobalContext } from "../../Context";
import { useNavigate, Link } from "react-router-dom";

import LoginStyles from "./LoginStyles.module.css";

const initialLoginInfo: Login = {
  email: "",
  password: "",
};

const LoginScreen = () => {
  const { setIsLoggedIn, setUsername } = useGlobalContext();
  const [loginInfo, setLoginInfo] = useState<Login>(initialLoginInfo);

  const navigate = useNavigate();

  const loginUser = async (): Promise<void> => {
    try {
      const resp = await axios.post("/api/v1/auth/login", {
        email: loginInfo.email,
        password: loginInfo.password,
      });
      const username = resp.data.user.name;
      setIsLoggedIn(true);
      setUsername(username);
      setLoginInfo(initialLoginInfo);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={LoginStyles.form}>
        <h3 className={LoginStyles.heading}>Login</h3>
        <label htmlFor="email" className={LoginStyles.form_label}>
          Email:
        </label>
        <input
          id="email"
          name="email"
          type="text"
          className={LoginStyles.form_input}
          value={loginInfo.email}
          onChange={handleChange}
        />
        <label htmlFor="password" className={LoginStyles.form_label}>
          Password:
        </label>
        <input
          id="password"
          name="password"
          type="text"
          className={LoginStyles.form_input}
          value={loginInfo.password}
          onChange={handleChange}
        />
        <button type="submit" className={LoginStyles.button}>
          Submit
        </button>
        <Link to="/register">Register</Link>
      </form>
    </>
  );
};

export { LoginScreen };
