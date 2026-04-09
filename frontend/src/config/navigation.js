import {
  LayoutDashboard,
  Users,
  Building2,
  UserRound,
  NotebookPen,
  CalendarDays,
  Trophy,
  BellRing,
  BellPlus,
  Banknote,
} from "lucide-react";

// Fuente central de navegación
export const MenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
    roles: ["admin", "instructor"],
  },
  {
    title: "Instalaciones",
    icon: Building2,
    path: "/instalaciones",
    roles: ["admin"],
  },
  {
    id: "recepcion",
    title: "Recepción",
    path: "/recepcion",
    icon: BellRing,
    roles: ["admin"],
  },
  {
    title: "Socios",
    icon: Users,
    path: "/socios",
    roles: ["admin"],
  },
  {
    title: "Dependientes",
    icon: UserRound,
    path: "/dependientes",
    roles: ["admin"],
  },
  {
    title: "Instructores",
    path: "/instructores",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Agenda y Reservaciones",
    icon: NotebookPen,
    path: "/actividades", // 🔥 corregido a minúsculas
    roles: ["admin", "instructor"],
  },
  {
    title: "Sesiones",
    icon: CalendarDays,
    path: "/sesiones",
    roles: ["admin", "instructor"],
  },
  {
    title: "Torneos",
    icon: Trophy,
    path: "/torneos",
    roles: ["admin", "instructor"],
  },
  {
    title: "Check-in",
    icon: BellPlus,
    path: "/check-in",
    roles: ["admin"],
  },
  {
    title: "Pagos",
    icon: Banknote,
    path: "/pagos",
    roles: ["admin"],
  },
];