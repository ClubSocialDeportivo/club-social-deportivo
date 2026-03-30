import { UserPlus, UserRoundMinus, PlusCircle, Users } from "lucide-react";

export const headerActions = {
  "/socios": [
    {
      label: "Añadir Socio",
      icon: UserPlus,
      action: () =>
        window.dispatchEvent(new CustomEvent("open-add-socio-modal")),
      color: "bg-yellow-400 text-black",
    },
    {
      label: "Eliminar Socio",
      icon: UserRoundMinus,
      action: () =>
        window.dispatchEvent(new CustomEvent("delete-selected-socios")),
      color: "bg-gray-800 text-white border border-gray-700",
    },
  ],
  "/dependientes": [
    {
      label: "Añadir dependiente",
      icon: Users,
      action: () =>
        window.dispatchEvent(new CustomEvent("open-add-dependiente-modal")),
      color: "bg-yellow-400 text-black",
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
};