import { UserPlus, PlusCircle, Download, UserRoundMinus } from "lucide-react";

export const headerActions = {
  "/socios": [
    { 
      label: "Añadir Socio", 
      icon: UserPlus, 
      action: () => console.log("Abriendo modal de socio..."),
      color: "bg-yellow-400 text-black" 
    },
    { 
      label: "Eliminiar Socio", 
      icon: UserRoundMinus, 
      action: () => console.log("Abriendo modal de socio..."),
      color: "bg-gray-800 text-white border border-gray-700" 
    }
  ],
  "/instalaciones": [
    { 
      label: "Nuevo Recurso", 
      icon: PlusCircle, 
      action: () => console.log("Nuevo recurso..."),
      color: "bg-yellow-400 text-black" 
    },
    { 
      label: "Exportar PDF", 
      icon: Download, 
      action: () => console.log("Descargando..."),
      color: "bg-gray-800 text-white border border-gray-700" 
    }
  ],
  "/instructores": [
  {
    label: "Nuevo Instructor",
    icon: UserPlus,
    action: () => {
      // Disparamos el evento que Instructores.jsx está escuchando
      const evento = new CustomEvent('abrir-modal-instructor');
      window.dispatchEvent(evento);
    },
    color: "bg-[#FACC15] text-black" // Usando el amarillo de tu diseño
  },
],
  // Si una ruta no está aquí, no aparecerán botones extra.
};