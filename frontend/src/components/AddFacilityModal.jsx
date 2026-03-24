import {
  X,
  PlusCircle,
  MapPin,
  Clock,
  Activity,
  Info,
  Dumbbell,
} from "lucide-react";
import { useState, useEffect } from "react";

const initialState = {
  id_categoria: "",
  nombre_especifico: "",
  ubicacion: "",
  tipo_superficie: "",
  capacidad_max: 10,
  horario_apertura: "08:00",
  horario_cierre: "22:00",
  equipamiento: "",
  estatus: "Disponible",
  permite_reserva: true,
};

const AddFacilityModal = ({ isOpen, onClose, onRefresh }) => {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState(initialState);

  // Estado inicial completo. NUNCA lo dejes sin inicializar (usa cadenas vacías, no null)

  // Función maestra para limpiar la memoria y cerrar
  const handleCloseAndReset = () => {
    setFormData(initialState); // Resetea todos los inputs a blanco
    onClose(); // Cierra el modal
  };

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:8000/api/categorias")
        .then((res) => res.json())
        .then((data) => setCategories(data));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TRUCO PRO: Convertimos el true/false de React a 1/0 para la base de datos
    const payloadParaLaravel = {
      ...formData,
      permite_reserva: formData.permite_reserva ? 1 : 0,
    };

    try {
      const response = await fetch("http://localhost:8000/api/instalaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // OJO AQUÍ: Enviamos el nuevo 'payloadParaLaravel', no el 'formData' directo
        body: JSON.stringify(payloadParaLaravel),
      });

      if (response.ok) {
        onRefresh();
        handleCloseAndReset();
      } else {
        // Si Laravel rechaza los datos (por ej. validación fallida), lo vemos en consola
        const errorData = await response.json();
        console.error("Error de validación en Laravel:", errorData);
      }
    } catch (error) {
      console.error("Error de red o el servidor está apagado:", error);
    }
  };

  // Clase de utilidad para los inputs
  const inputClass =
    "w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-gray-100 placeholder-gray-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition-all";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1c1f26] border border-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
        {/* Header fijo */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1c1f26] z-10">
          <h2 className="text-xl font-bold flex items-center text-yellow-400">
            <PlusCircle className="mr-2" size={24} /> Nueva Instalación
          </h2>
          <button
            onClick={handleCloseAndReset}
            className="hover:bg-gray-800 p-2 rounded-full text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup
              label="Nombre del Espacio"
              icon={<Activity size={14} />}
            >
              {/* CORRECCIÓN: Se agregó value={formData.nombre_especifico || ""} */}
              <input
                required
                className={inputClass}
                placeholder="Ej. Cancha de Tenis 3"
                value={formData.nombre_especifico || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nombre_especifico: e.target.value,
                  })
                }
              />
            </InputGroup>

            <InputGroup label="Categoría" icon={<Info size={14} />}>
              {/* CORRECCIÓN: Se agregó value={formData.id_categoria || ""} */}
              <select
                required
                className={`${inputClass} appearance-none`}
                value={formData.id_categoria || ""}
                onChange={(e) =>
                  setFormData({ ...formData, id_categoria: e.target.value })
                }
              >
                <option value="" className="bg-gray-800">
                  Selecciona una categoría...
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat.id_categoria}
                    value={cat.id_categoria}
                    className="bg-gray-800 text-white"
                  >
                    {cat.nombre_categoria}
                  </option>
                ))}
              </select>
            </InputGroup>

            <InputGroup label="Ubicación" icon={<MapPin size={14} />}>
              {/* CORRECCIÓN: Se agregó value={formData.ubicacion || ""} */}
              <input
                className={inputClass}
                placeholder="Ej. Ala Norte, Nivel 2"
                value={formData.ubicacion || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ubicacion: e.target.value })
                }
              />
            </InputGroup>

            <InputGroup label="Tipo de Superficie">
              {/* CORRECCIÓN: Se agregó value={formData.tipo_superficie || ""} */}
              <input
                className={inputClass}
                placeholder="Ej. Pasto Sintético, Duela"
                value={formData.tipo_superficie || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tipo_superficie: e.target.value })
                }
              />
            </InputGroup>
          </div>

          {/* Sección de Horarios con fondo sutil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-yellow-400/5 rounded-xl border border-yellow-400/10">
            <InputGroup label="Hora Apertura" icon={<Clock size={14} />}>
              {/* Este ya tenía value, pero lo dejamos asegurado */}
              <input
                type="time"
                className={inputClass}
                value={formData.horario_apertura || ""}
                onChange={(e) =>
                  setFormData({ ...formData, horario_apertura: e.target.value })
                }
              />
            </InputGroup>
            <InputGroup label="Hora Cierre" icon={<Clock size={14} />}>
              {/* Este ya tenía value, pero lo dejamos asegurado */}
              <input
                type="time"
                className={inputClass}
                value={formData.horario_cierre || ""}
                onChange={(e) =>
                  setFormData({ ...formData, horario_cierre: e.target.value })
                }
              />
            </InputGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <InputGroup label="Capacidad Pax">
              {/* Este ya tenía value, pero lo dejamos asegurado */}
              <input
                type="number"
                className={inputClass}
                value={formData.capacidad_max || ""}
                onChange={(e) =>
                  setFormData({ ...formData, capacidad_max: e.target.value })
                }
              />
            </InputGroup>

            <InputGroup label="Estatus Inicial">
              {/* CORRECCIÓN: Se agregó value={formData.estatus || ""} */}
              <select
                className={inputClass}
                value={formData.estatus || "Disponible"}
                onChange={(e) =>
                  setFormData({ ...formData, estatus: e.target.value })
                }
              >
                <option value="Disponible" className="bg-gray-800">
                  Disponible
                </option>
                <option value="Mantenimiento" className="bg-gray-800">
                  Mantenimiento
                </option>
                
                
              </select>
            </InputGroup>

            <div className="flex items-center space-x-3 pb-3">
              <input
                type="checkbox"
                id="reservable"
                checked={formData.permite_reserva}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    permite_reserva: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-yellow-400 cursor-pointer"
              />
              <label
                htmlFor="reservable"
                className="text-xs font-bold text-gray-400 uppercase cursor-pointer select-none"
              >
                Permitir Reservas:{" "}
                <span
                  className={
                    formData.permite_reserva
                      ? "text-green-400 ml-1"
                      : "text-red-400 ml-1"
                  }
                >
                  {formData.permite_reserva ? "SÍ" : "NO"}
                </span>
              </label>
            </div>
          </div>

          {/* EQUIPAMIENTO: FUERA DEL GRID PARA ANCHO TOTAL */}
          <InputGroup
            label="Equipamiento y Notas"
            icon={<Dumbbell size={14} />}
          >
            {/* CORRECCIÓN: Se agregó value={formData.equipamiento || ""} y corregí el error de Tailwind de la altura */}
            <textarea
              className={`${inputClass} min-h-120px resize-none`}
              placeholder="Describe raquetas, redes, tipo de iluminación, etc."
              value={formData.equipamiento || ""}
              onChange={(e) =>
                setFormData({ ...formData, equipamiento: e.target.value })
              }
            />
          </InputGroup>

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-yellow-900/20 text-lg uppercase tracking-tight"
          >
            Registrar Instalación
          </button>
        </form>
      </div>
    </div>
  );
};

const InputGroup = ({ label, icon, children }) => (
  <div className="flex flex-col space-y-1.5">
    <label className="flex items-center text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
      {icon && <span className="mr-1.5 text-yellow-400/60">{icon}</span>}{" "}
      {label}
    </label>
    {children}
  </div>
);

export default AddFacilityModal;
