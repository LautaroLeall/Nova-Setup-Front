import { useEffect } from "react";
import { BrowserRouter } from "react-router";
import Navbar from "./components/Navbar";
import NavbarBotom from "./components/NavbarBotom";
import AppRoutes from "./routes/AppRoutes.jsx";
import { AuthProvider } from "./context/AuthContext";
import { Toaster, sileo } from "sileo";

function App() {
  // Desaparecer notificaciones al hacer scroll o click
  useEffect(() => {
    const dismissToasts = () => {
      sileo.clear();
    };

    window.addEventListener("scroll", dismissToasts, { passive: true });
    window.addEventListener("mousedown", dismissToasts, { passive: true });
    window.addEventListener("touchstart", dismissToasts, { passive: true });

    return () => {
      window.removeEventListener("scroll", dismissToasts);
      window.removeEventListener("mousedown", dismissToasts);
      window.removeEventListener("touchstart", dismissToasts);
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <div>
          <Toaster
            position="top-center"
            options={{
              duration: 3500,
              styles: {
                title: "sileo-toast-title",
                description: "sileo-toast-desc"
              }
            }}
          />
          <Navbar />
          <AppRoutes />
          <NavbarBotom />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;