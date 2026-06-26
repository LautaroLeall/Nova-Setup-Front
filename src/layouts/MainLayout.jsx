import { Outlet } from "react-router";
import Navbar from "../components/layout/Navbar";
import NavbarBotom from "../components/layout/NavbarBotom";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <NavbarBotom />
    </>
  );
};

export default MainLayout;
