import { useLocation, useNavigate } from "react-router-dom";
import { Repeat } from "lucide-react";
import { headerActions } from "../config/header_actions";
import { useRoleSimulator } from "../context/RoleSimulatorContext";

const TopHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fakeRole, toggleRole, isAdmin } = useRoleSimulator();

  // Botones especiales según la ruta actual
  const currentActions = headerActions[location.pathname] || [];

  // Título dinámico básico
  const pageTitle = location.pathname.replace("/", "") || "Dashboard";

  const handleRoleChange = () => {
    const nextRoute = isAdmin ? "/calendario-instructor" : "/dashboard";
    toggleRole();
    navigate(nextRoute);
  };

  return (
    <header className="h-20 bg-[#14171c] border-b border-gray-800 flex items-center justify-between px-8">
      {/* Lado izquierdo: Título dinámico */}
      <h1 className="text-xl font-bold capitalize">{pageTitle}</h1>

      {/* Lado derecho: Botones Especiales + Simulador + Perfil */}
      <div className="flex items-center space-x-4">
        {/* Botones de la página actual */}
        {currentActions.map((btn, index) => (
          <button
            key={index}
            onClick={btn.action}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 ${btn.color}`}
          >
            <btn.icon size={18} className="mr-2" />
            {btn.label}
          </button>
        ))}

        {/* Botón para cambiar vista */}
        <button
          onClick={handleRoleChange}
          className="flex items-center px-4 py-2 rounded-lg text-sm font-bold bg-gray-800 text-white border border-gray-700 transition-all hover:scale-105"
          title="Cambiar vista temporal"
        >
          <Repeat size={18} className="mr-2" />
          {isAdmin ? "Cambiar a Instructor" : "Cambiar a Admin"}
        </button>

        <div className="w-px h-8 bg-gray-800 mx-2" />

        {/* Perfil del usuario */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-bold">Usuario</p>
            <p className="text-xs text-yellow-400 capitalize">{fakeRole}</p>
          </div>
          <div className="w-10 h-10 bg-gray-700 rounded-full border-2 border-yellow-400" />
        </div>
      </div>
    </header>
  );
};

export default TopHeader;