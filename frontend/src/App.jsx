import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Socios from "./pages/Socios";
import Instalaciones from "./pages/Instalaciones";
import Dependientes from "./pages/Dependientes";
import Actividades from "./pages/Actividades";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/instalaciones" element={<Instalaciones />} />
          <Route path="/socios" element={<Socios />} />
          <Route path="/dependientes" element={<Dependientes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/Actividades" element={<Actividades />} ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;