import { LayoutDashboard, Users, CalendarDays, Dumbbell } from "lucide-react";
import { MenuItems } from "../config/navigation";
import { SidebarItem } from "./SideBarItem";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#14171c] border-r border-gray-800 flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center px-6 h-20 border-b border-gray-800">
        {/* 1. La caja amarilla con bordes redondeados */}
        <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 rounded-xl shrink-0">
          {/* SVG del logo*/}
          <Dumbbell className="w-5 h-5 text-black" />
        </div>

        {/* 3. El texto del logo */}
        <span className="ml-3 text-2xl font-bold text-white tracking-wide">
          ClubMaganer 360
        </span>
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
        {MenuItems.map((item) => (
          <SidebarItem key={item.title} item={item} />
        ))}

        {/* Puedes agregar los demás botones aquí */}
      </nav>
    </aside>
  );
};

export default Sidebar;
