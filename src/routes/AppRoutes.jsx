import { Routes, Route } from "react-router";
import Home from "../pages/Home";
import Contacto from "../pages/Contacto";
import { Shop } from "../pages/Shop";
import { PCBuilder } from "../pages/PCBuilder";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";
import ProductDetail from "../pages/ProductDetail";
import Favoritos from "../pages/Favoritos";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import OrderFailure from "../pages/OrderFailure";
import OrderPending from "../pages/OrderPending";
import UserProfile from "../pages/UserProfile";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminUsers from "../pages/admin/AdminUsers";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound";
import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/arma-tu-pc" element={<PCBuilder />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/favoritos" element={<ProtectedRoute><Favoritos /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

        <Route path="/payment/success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="/payment/failure" element={<ProtectedRoute><OrderFailure /></ProtectedRoute>} />
        <Route path="/payment/pending" element={<ProtectedRoute><OrderPending /></ProtectedRoute>} />

        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute adminOnly={true}><AdminProducts /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute adminOnly={true}><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly={true}><AdminUsers /></ProtectedRoute>} />
      </Route>

      {/* Catch-all Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
