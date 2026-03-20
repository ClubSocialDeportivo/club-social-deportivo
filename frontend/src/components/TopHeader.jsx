import { useLocation } from "react-router-dom";
import { headerActions } from "../config/header_actions";

const TopHeader = () => {
  const location = useLocation(); // Esto te da la ruta actual 
  
  // Buscamos si hay botones definidos para esta ruta específica
  const currentActions = headerActions[location.pathname] || [];

  return (
    <header className="h-20 bg-[#14171c] border-b border-gray-800 flex items-center justify-between px-8">
      {/* Lado izquierdo: Título dinámico */}
      <h1 className="text-xl font-bold capitalize">
        {location.pathname.replace("/", "") || "Dashboard"}
      </h1>

      {/* Lado derecho: Botones Especiales + Perfil */}
      <div className="flex items-center space-x-4">
        
        {/* Pintamos los botones de la página actual */}
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

        <div className="w-px h-8 bg-gray-800 mx-2" /> {/* Separador */}
        
        {/* Perfil del usuario (Esto siempre está) */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-bold">Usuario</p>
            <p className="text-xs text-yellow-400">Rol de usuario</p>
          </div>
          <div className="w-10 h-10 bg-gray-700 rounded-full border-2 border-yellow-400" />
        </div>
      </div>
    </header>
  );
};

export default TopHeader;