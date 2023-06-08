import { useGlobalContext } from "../../Context";

const Home = () => {
  const { username } = useGlobalContext();
  return <h2>Welcome to the Food App {username}!</h2>;
};
export default Home;
