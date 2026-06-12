import { Routes, Route } from "react-router";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductDetail from "../pages/ProductDetail";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import OrderFailure from "../pages/OrderFailure";
import OrderPending from "../pages/OrderPending";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment/success" element={<OrderSuccess />} />
      <Route path="/payment/failure" element={<OrderFailure />} />
      <Route path="/payment/pending" element={<OrderPending />} />
    </Routes>
  );
};

export default AppRoutes;
