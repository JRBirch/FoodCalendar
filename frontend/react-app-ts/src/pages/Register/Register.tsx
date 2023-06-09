import { useState } from "react";
import axios from "axios";
import { Register } from "../../../../../backend/src/controllers/auth";
import { useNavigate } from "react-router-dom";

import Styles from "./RegisterStyles.module.css";

const initialRegisterInfo: Register = {
  name: "",
  email: "",
  password: "",
};

const RegisterScreen = () => {
  const [registerInfo, setLoginInfo] = useState<Register>(initialRegisterInfo);

  const navigate = useNavigate();

  const registerUser = async (): Promise<void> => {
    try {
      await axios.post("/api/v1/auth/register", {
        name: registerInfo.name,
        email: registerInfo.email,
        password: registerInfo.password,
      });
      setLoginInfo(initialRegisterInfo);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Register login");
    registerUser();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({ ...registerInfo, [e.target.name]: e.target.value });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h3 className={Styles.heading}>Register</h3>
        <label htmlFor="name" className={Styles.form_label}>Name:</label>
        <input
          id="name"
          name="name"
          type="text"
          className={Styles.form_input}
          value={registerInfo.name}
          onChange={handleChange}
        />
        <label htmlFor="email" className={Styles.form_label}>Email:</label>
        <input
          id="email"
          name="email"
          type="text"
          className={Styles.form_input}
          value={registerInfo.email}
          onChange={handleChange}
        />
        <label htmlFor="password" className={Styles.form_label}>Password:</label>
        <input
          id="password"
          name="password"
          type="text"
          className={Styles.form_input}
          value={registerInfo.password}
          onChange={handleChange}
        />
        <button type="submit" className={Styles.button}>Submit</button>
      </form>
    </>
  );
};
export default RegisterScreen;
