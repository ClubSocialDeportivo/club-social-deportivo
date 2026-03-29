import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  UserRound,
  NotebookPen 
} from "lucide-react";

// Fuente central de navegación
export const MenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Instalaciones",
    icon: Building2,
    path: "/instalaciones",
  },
  {
    title: "Socios",
    icon: Users,
    path: "/socios",
  },
  {
    title: "Dependientes",
    icon: UserRound,
    path: "/dependientes",
  },
  {
    title: "Agenda y Reservaciones",
    icon: NotebookPen,
    path: "/Actividades",
  }
];