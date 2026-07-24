import { BrowserRouter } from "react-router";
import AppRoutes from "./routes/AppRoutes.jsx";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { PCBuilderProvider } from "./context/PCBuilderContext";
import CartDrawer from "./components/cart/CartDrawer";
import GlobalLoader from "./components/layout/GlobalLoader";
import { Toaster } from "sileo";
import ScrollToTop from "./components/layout/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GlobalLoader>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <PCBuilderProvider>
                <div className="app-container">
                  <Toaster
                    position="bottom-left"
                    offset="20px"
                    options={{
                      duration: 3000,
                      fill: "#171717",
                      styles: { description: "text-white/75!" },
                    }}
                  />
                  <AppRoutes />
                  <CartDrawer />
                </div>
              </PCBuilderProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </GlobalLoader>
    </BrowserRouter>
  );
}

export default App;