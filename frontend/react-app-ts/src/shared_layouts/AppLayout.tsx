import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";

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
