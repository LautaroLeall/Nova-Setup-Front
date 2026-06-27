import { Routes, Route } from "react-router";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

// ── Lazy imports: cada página se carga solo cuando se necesita ──
const Home = lazy(() => import("../pages/Home"));
const Shop = lazy(() => import("../pages/Shop").then(m => ({ default: m.Shop })));
const PCBuilder = lazy(() => import("../pages/PCBuilder").then(m => ({ default: m.PCBuilder })));
const Contacto = lazy(() => import("../pages/Contacto"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const VerifyEmail = lazy(() => import("../pages/VerifyEmail"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const Favoritos = lazy(() => import("../pages/Favoritos"));
const Checkout = lazy(() => import("../pages/Checkout"));
const UserProfile = lazy(() => import("../pages/UserProfile"));
const OrderSuccess = lazy(() => import("../pages/OrderSuccess"));
const OrderFailure = lazy(() => import("../pages/OrderFailure"));
const OrderPending = lazy(() => import("../pages/OrderPending"));
const NotFound = lazy(() => import("../pages/NotFound"));

// ── Admin (carga muy pesada, totalmente diferida) ──
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("../pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("../pages/admin/AdminOrders"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));

// Fallback de carga mínimo y sin layout para evitar flashes
const PageLoader = () => (
  <div style={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#101018",
  }}>
    <div style={{
      width: 40,
      height: 40,
      border: "3px solid rgba(58,219,241,0.2)",
      borderTopColor: "#3adbf1",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
