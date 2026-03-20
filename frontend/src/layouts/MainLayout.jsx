import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';

const MainLayout = () => {
  return (
    // h-screen hace que tome el 100% del alto, bg-[#0b0e14] es el fondo oscuro de tu diseño
    <div className="flex h-screen w-full bg-[#0b0e14] text-white font-sans overflow-hidden">
      
      {/* 1. Barra Lateral (Fija a la izquierda) */}
      <Sidebar />

      {/* 2. Contenedor Derecho (Ocupa el resto de la pantalla) */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* Encabezado Superior */}
        <TopHeader />

        {/* 3. Área Principal (Aquí van a ir Home.jsx, Socios.jsx, etc.) */}
        {/* overflow-y-auto permite hacer scroll solo en esta parte si el contenido es muy largo */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default MainLayout;
