import { useState } from "react";
import { Login } from "../../../../../backend/src/controllers/auth";
import axios from "axios";
import { useGlobalContext } from "../../Context";
import { useNavigate } from "react-router-dom";

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
    console.log("Submit login");
    loginUser();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div>Login</div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="text"
          value={loginInfo.email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="text"
          value={loginInfo.password}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export { LoginScreen };
