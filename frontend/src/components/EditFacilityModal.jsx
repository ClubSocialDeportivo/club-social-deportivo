import { X, Save, Clock, MapPin, Users, Activity, Edit3, Package, ToggleLeft } from "lucide-react";
import { useState } from "react";

const EditFacilityModal = ({ isOpen, onClose, data, onUpdate }) => {
  const [formData, setFormData] = useState(data || {});

  if (!isOpen || !data) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/instalaciones/${data.id_espacio}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const field = (key, value) => setFormData({ ...formData, [key]: value });

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1c1f26] border border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#23272f]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Edit3 size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Gestionar Instalación</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">

          {/* Nombre y Superficie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
                <MapPin size={12} /> Nombre Específico
              </label>
              <input
                type="text"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                value={formData.nombre_especifico || ""}
                onChange={(e) => field("nombre_especifico", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
                <Activity size={12} /> Tipo de Superficie
              </label>
              <input
                type="text"
                placeholder="Ej. Pasto Sintético, Duela..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none"
                value={formData.tipo_superficie || ""}
                onChange={(e) => field("tipo_superficie", e.target.value)}
              />
            </div>
          </div>

          {/* Ubicación — NUEVO */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
              <MapPin size={12} /> Ubicación
            </label>
            <input
              type="text"
              placeholder="Ej. Edificio A, Planta Baja..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none transition-all"
              value={formData.ubicacion || ""}
              onChange={(e) => field("ubicacion", e.target.value)}
            />
          </div>

          {/* Estatus y Capacidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
                <Activity size={12} /> Estatus Actual
              </label>
              <select
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none cursor-pointer"
                value={formData.estatus || ""}
                onChange={(e) => field("estatus", e.target.value)}
              >
                <option value="Disponible">Disponible</option>
                <option value="Ocupado">Ocupado</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Reservado">Reservado</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
                <Users size={12} /> Capacidad Máxima
              </label>
              <input
                type="number"
                min={1}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none"
                value={formData.capacidad_max || ""}
                onChange={(e) => field("capacidad_max", e.target.value)}
              />
            </div>
          </div>

          {/* Equipamiento — NUEVO */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
              <Package size={12} /> Equipamiento
            </label>
            <textarea
              rows={3}
              placeholder="Ej. Canastas, redes, marcadores, vestidores..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none resize-none transition-all"
              value={formData.equipamiento || ""}
              onChange={(e) => field("equipamiento", e.target.value)}
            />
          </div>

          {/* Horarios */}
          <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              <Clock size={14} /> Configuración de Horario
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase">Apertura</label>
                <input
                  type="time"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
                  value={formData.horario_apertura || ""}
                  onChange={(e) => field("horario_apertura", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase">Cierre</label>
                <input
                  type="time"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
                  value={formData.horario_cierre || ""}
                  onChange={(e) => field("horario_cierre", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Permite Reserva — NUEVO */}
          <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                <ToggleLeft size={14} /> Permite Reserva
              </p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Habilita que esta instalación pueda ser reservada
              </p>
            </div>
            <button
              type="button"
              onClick={() => field("permite_reserva", !formData.permite_reserva)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                formData.permite_reserva ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                formData.permite_reserva ? "left-7" : "left-1"
              }`} />
            </button>
          </div>

          {/* Footer */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3 rounded-xl transition-all border border-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-blue-900/20"
            >
              <Save size={18} className="mr-2" /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFacilityModal;