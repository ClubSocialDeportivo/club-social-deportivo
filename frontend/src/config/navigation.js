import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  UserRound,
  NotebookPen, 
  CalendarDays, 
  Trophy,
  BellRing
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
    id: 'recepcion',
    title: 'Recepción',
    path: '/recepcion',
    icon: BellRing
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
    title: "Instructores",
    path: "/instructores",
    icon: Users, // Aquí usas el componente del icono
    title: "Agenda y Reservaciones",
    icon: NotebookPen,
    path: "/Actividades",
  },{
    title: "Sesiones",
    icon: CalendarDays,
    path: "/sesiones",
  },
  {
    title: "Torneos",       
    icon: Trophy,          
    path: "/torneos",       
  },
];