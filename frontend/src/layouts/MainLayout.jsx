import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";

const MainLayout = () => {
  return (
    <div className="flex h-screen w-full bg-[#0b0e14] text-white overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* Header */}
        <TopHeader />

        {/* Contenido dinámico */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#0b0e14]">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default MainLayout;