import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Artistas from "./pages/artistas/Artistas";
import Galeria from "./pages/galeria/Galeria";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import Admin from "./pages/admin/Admin";
import Cartelera from "./pages/cartelera/Cartelera";
import Estudio from "./pages/estudio/Estudio"
import Citas from "./pages/appointments/Appointments"


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="artistas" element={<Artistas />} />
      <Route path="galeria" element={<Galeria />} />
      <Route path="register" element={<Register />} />
      <Route path="profile" element={<Profile />} />
      <Route path="admin" element={<Admin />} />
      <Route path="cartelera" element={<Cartelera />} />
      <Route path="estudio" element={<Estudio />} />
     <Route path="citas" element={<Citas />} />
    


    </Routes>
  );
}

export default App;
