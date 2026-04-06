import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Recepcion from './pages/Recepcion';
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Socios from "./pages/Socios";
import Instalaciones from "./pages/Instalaciones";
import Dependientes from "./pages/Dependientes";
import Instructores from "./pages/Instructores";
import Actividades from "./pages/Actividades";
import Sesiones from "./pages/Sesiones";

import Pagos from "./pages/Pagos";

import Torneos from "./pages/Torneos"; // <-- Aquí importamos tu pantalla

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/instalaciones" element={<Instalaciones />} />
          <Route path="/recepcion" element={<Recepcion />} />
          <Route path="/socios" element={<Socios />} />
          <Route path="/dependientes" element={<Dependientes />} />
          <Route path="/instructores" element={<Instructores />} />
          <Route path="/torneos" element={<Torneos />} /> {/* <-- Aquí agregamos la ruta */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/Actividades" element={<Actividades />} ></Route>
          <Route path="/sesiones" element={<Sesiones />} />
          <Route path="/pagos" element={<Pagos />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;