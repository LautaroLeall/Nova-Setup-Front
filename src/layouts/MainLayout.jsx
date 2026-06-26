import { Outlet, useLocation } from "react-router";
import Navbar from "../components/layout/Navbar";
import NavbarBotom from "../components/layout/NavbarBotom";

const MainLayout = () => {
  const location = useLocation();
  const hideFooter = location.pathname === "/contacto";

  return (
    <>
      <Navbar />
      <Outlet />
      {!hideFooter && <NavbarBotom />}
    </>
  );
};

export default MainLayout;
