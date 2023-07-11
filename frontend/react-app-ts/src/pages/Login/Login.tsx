import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import { Login } from "../../../../../backend/src/controllers/types";
import { useGlobalContext } from "../../Context";

import LoginStyles from "./LoginStyles.module.css";

const initialLoginInfo: Login = {
  email: "",
  password: "",
};

const LoginScreen = () => {
  const { setIsLoggedIn, setUsername } = useGlobalContext();
  const [loginInfo, setLoginInfo] = useState<Login>(initialLoginInfo);
  const [error, setError] = useState("")

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
      navigate("/calendar");
    } catch (error) {
      console.log(error)
      setError("Wrong login infomation! Please try again");
      setTimeout(() => {
        setError("");
      }, 3000);
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
      {error && <h2 className={LoginStyles.error}>{error}</h2>}
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
          type="password"
          className={LoginStyles.form_input}
          value={loginInfo.password}
          onChange={handleChange}
        />
        <button type="submit" className={LoginStyles.button}>
          Submit
        </button>
        <Link to="/register" className={LoginStyles.link}>Register</Link>
      </form>
    </>
  );
};

export { LoginScreen };
