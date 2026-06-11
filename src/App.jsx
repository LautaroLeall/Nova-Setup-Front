import { BrowserRouter } from "react-router";
import Navbar from "./components/Navbar";
import NavbarBotom from "./components/NavbarBotom";
import AppRoutes from "./routes/AppRoutes.jsx";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";
import { Toaster } from "sileo";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <div>
              <Toaster
                position="bottom-left"
                offset="20px"
                options={{
                  duration: 3000,
                  fill: "#171717",
                  styles: { description: "text-white/75!" },
                }}
              />
              <Navbar />
              <CartDrawer />
              <AppRoutes />
              <NavbarBotom />
            </div>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;