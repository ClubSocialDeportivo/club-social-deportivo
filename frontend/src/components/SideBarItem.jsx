export const SidebarItem = ({ item, isActive }) => {
  const { title, icon: Icon, path } = item;
  
  return (
    <a
      href={path}
      className={`flex items-center px-3 py-2.5 rounded-lg font-medium transition-colors ${
        isActive 
          ? "bg-yellow-400 text-black font-semibold" // Estilo Activo
          : "text-gray-400 hover:bg-gray-800 hover:text-white" // Estilo Inactivo
      }`}
    >
      <Icon size={20} className="mr-3" />
      <span>{title}</span>
    </a>
  );
};