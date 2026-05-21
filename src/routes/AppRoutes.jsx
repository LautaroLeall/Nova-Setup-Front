import { Routes, Route } from "react-router";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Login from "../pages/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
