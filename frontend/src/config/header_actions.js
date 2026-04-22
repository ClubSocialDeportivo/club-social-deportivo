import {
  RefreshCcw,
  PlusCircle,
  UserPlus,
} from "lucide-react";

export const headerActions = {
  "/socios": [
    {
      label: "Recargar socios",
      icon: RefreshCcw,
      action: () => window.dispatchEvent(new CustomEvent("refresh-socios")),
      color: "bg-gray-800 text-white border border-gray-700",
    },
  ],

  "/dependientes": [
    {
      label: "Recargar dependientes",
      icon: RefreshCcw,
      action: () =>
        window.dispatchEvent(new CustomEvent("refresh-dependientes")),
      color: "bg-gray-800 text-white border border-gray-700",
    },
  ],

  "/instalaciones": [
    {
      label: "Nuevo Recurso",
      icon: PlusCircle,
      action: () =>
        window.dispatchEvent(new CustomEvent("open-add-facility-modal")),
      color: "bg-yellow-400 text-black",
    },
  ],

  "/instructores": [
    {
      label: "Nuevo Instructor",
      icon: UserPlus,
      action: () => {
        const evento = new CustomEvent("abrir-modal-instructor");
        window.dispatchEvent(evento);
      },
      color: "bg-[#FACC15] text-black",
    },
  ],
};