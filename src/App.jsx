import { BrowserRouter } from "react-router";
import Navbar from "./components/Navbar";
import NavbarBotom from "./components/NavbarBotom";
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-black min-h-screen text-white selection:bg-pink-500 selection:text-white">
        <Navbar />

        <AppRoutes />

        <NavbarBotom />
      </div>
    </BrowserRouter>
  );
}

export default App;