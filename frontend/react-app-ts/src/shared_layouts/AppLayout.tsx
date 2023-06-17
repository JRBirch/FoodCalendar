import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

import AppLayoutStyles from "./AppLayoutStyles.module.css";

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <section className={AppLayoutStyles.main_section}>
        <Outlet />
      </section>
    </>
  );
};
export default AppLayout;
