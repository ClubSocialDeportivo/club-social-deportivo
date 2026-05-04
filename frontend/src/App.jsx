import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardInstructor from './pages/DashboardInstructor';
import Recepcion from "./pages/Recepcion";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Socios from "./pages/Socios";
import CheckIn from "./pages/Checkin";
import Instalaciones from "./pages/Instalaciones";
import Dependientes from "./pages/Dependientes";
import Instructores from "./pages/Instructores";
import Actividades from "./pages/Actividades";
import Sesiones from "./pages/Sesiones";
import Pagos from "./pages/Pagos";
import Torneos from "./pages/Torneos";
import CalendarioInstructor from "./pages/CalendarioInstructor";
import RedirectByRole from "./components/RedirectByRole";
import SetPassword from "./pages/SetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/set-password" element={<SetPassword />} />
        <Route element={<MainLayout />}>
          <Route index element={<RedirectByRole />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard-instructor" element={<DashboardInstructor />} />
          <Route path="/instalaciones" element={<Instalaciones />} />
          <Route path="/recepcion" element={<Recepcion />} />
          <Route path="/socios" element={<Socios />} />
          <Route path="/dependientes" element={<Dependientes />} />
          <Route path="/instructores" element={<Instructores />} />
          <Route path="/torneos" element={<Torneos />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route path="/actividades" element={<Actividades />} />
          <Route path="/sesiones" element={<Sesiones />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route
            path="/calendario-instructor"
            element={<CalendarioInstructor />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;