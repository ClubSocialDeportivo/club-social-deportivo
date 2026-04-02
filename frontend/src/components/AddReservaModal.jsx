import {
  X,
  Save,
  Calendar,
  Clock,
  MapPin,
  User,
  Hash,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";

const AddReservaModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({});
  const [socios, setSocios] = useState([]);
  const [instalaciones, setInstalaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    setFormData({
      id_socio: "",
      id_espacio: "",
      fecha: "",
      hora_inicio: "",
      hora_fin: "",
      folio_reserva: "",
      estatus: "Activa",
      estatus_noshow: false,
    });
    setErrors({});
    fetchCatalogos();
  }, [isOpen]);

  const fetchCatalogos = async () => {
    try {
      const [s, e] = await Promise.all([
        fetch("http://localhost:8000/api/socios").then((r) => r.json()),
        fetch("http://localhost:8000/api/instalaciones").then((r) => r.json()),
      ]);
      if (s.data) setSocios(s.data);
      if (e.status === "success") setInstalaciones(e.data);
    } catch (err) {
      console.error("Error cargando catálogos:", err);
    }
  };

  const field = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!formData.id_socio) e.id_socio = "Requerido";
    if (!formData.id_espacio) e.id_espacio = "Requerido";
    if (!formData.folio_reserva) e.folio_reserva = "Requerido";
    if (!formData.hora_inicio) e.hora_inicio = "Requerido";
    if (!formData.hora_fin) e.hora_fin = "Requerido";

    // ── Validación de fecha ──────────────────────────────────────────
    if (!formData.fecha) {
      e.fecha = "Requerido";
    } else {
      const hoy = new Date().toISOString().split("T")[0]; // "2026-03-29"
      if (formData.fecha !== hoy) {
        e.fecha = `Solo se permiten reservaciones para hoy (${hoy})`;
      }
    }
    // ────────────────────────────────────────────────────────────────

    if (
      formData.hora_inicio &&
      formData.hora_fin &&
      formData.hora_fin <= formData.hora_inicio
    )
      e.hora_fin = "Debe ser después de la hora de inicio";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        onRefresh();
        onClose();
      } else {
        if (result.errors) setErrors(result.errors);
      }
    } catch (err) {
      console.error("Error al crear reserva:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1c1f26] border border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#23272f]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Calendar size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Nueva Reserva</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
        >
          {/* Folio */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
              <Hash size={12} /> Folio de Reserva *
            </label>
            <input
              type="text"
              placeholder="Ej. RES-2026-001"
              className={`w-full bg-gray-900 border rounded-lg p-2.5 text-white outline-none transition-all font-mono ${errors.folio_reserva ? "border-red-500" : "border-gray-700 focus:border-purple-500"}`}
              value={formData.folio_reserva || ""}
              onChange={(e) => field("folio_reserva", e.target.value)}
            />
            {errors.folio_reserva && (
              <p className="text-red-400 text-xs">{errors.folio_reserva}</p>
            )}
          </div>

          {/* Socio e Instalación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
                <User size={12} /> Socio *
              </label>
              <select
                className={`w-full bg-gray-900 border rounded-lg p-2.5 text-white outline-none cursor-pointer transition-all ${errors.id_socio ? "border-red-500" : "border-gray-700 focus:border-purple-500"}`}
                value={formData.id_socio || ""}
                onChange={(e) => field("id_socio", e.target.value)}
              >
                <option value="">Selecciona un socio...</option>
                {socios.map((s) => (
                  <option key={s.id_socio} value={s.id_socio}>
                    {s.nombre} {s.apellidos}
                  </option>
                ))}
              </select>
              {errors.id_socio && (
                <p className="text-red-400 text-xs">{errors.id_socio}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
                <MapPin size={12} /> Instalación *
              </label>
              <select
                className={`w-full bg-gray-900 border rounded-lg p-2.5 text-white outline-none cursor-pointer transition-all ${errors.id_espacio ? "border-red-500" : "border-gray-700 focus:border-purple-500"}`}
                value={formData.id_espacio || ""}
                onChange={(e) => field("id_espacio", e.target.value)}
              >
                <option value="">Selecciona...</option>
                {instalaciones
                  .filter((i) => i.permite_reserva)
                  .map((i) => (
                    <option key={i.id_espacio} value={i.id_espacio}>
                      {i.nombre_especifico}
                    </option>
                  ))}
              </select>
              {errors.id_espacio && (
                <p className="text-red-400 text-xs">{errors.id_espacio}</p>
              )}
            </div>
          </div>

          {/* Fecha */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
              <Calendar size={12} /> Fecha *
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              max={new Date().toISOString().split("T")[0]}
              className={`w-full bg-gray-900 border rounded-lg p-2.5 text-white outline-none transition-all ${errors.fecha ? "border-red-500" : "border-gray-700 focus:border-purple-500"}`}
              value={formData.fecha || ""}
              onChange={(e) => field("fecha", e.target.value)}
            />
            {errors.fecha && (
              <p className="text-red-400 text-xs">{errors.fecha}</p>
            )}
          </div>

          {/* Horario y Estatus */}
          <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              <Clock size={14} /> Horario y Estatus
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase">
                  Inicio *
                </label>
                <input
                  type="time"
                  className={`w-full bg-gray-900 border rounded-lg p-2 text-white outline-none transition-all ${errors.hora_inicio ? "border-red-500" : "border-gray-700 focus:border-purple-500"}`}
                  value={formData.hora_inicio || ""}
                  onChange={(e) => field("hora_inicio", e.target.value)}
                />
                {errors.hora_inicio && (
                  <p className="text-red-400 text-xs">{errors.hora_inicio}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase">
                  Fin *
                </label>
                <input
                  type="time"
                  className={`w-full bg-gray-900 border rounded-lg p-2 text-white outline-none transition-all ${errors.hora_fin ? "border-red-500" : "border-gray-700 focus:border-purple-500"}`}
                  value={formData.hora_fin || ""}
                  onChange={(e) => field("hora_fin", e.target.value)}
                />
                {errors.hora_fin && (
                  <p className="text-red-400 text-xs">{errors.hora_fin}</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold uppercase">
                Estatus inicial
              </label>
              <select
                className="w-full bg-gray-900 border border-gray-700 focus:border-purple-500 rounded-lg p-2 text-white outline-none cursor-pointer"
                value={formData.estatus || "Activa"}
                onChange={(e) => field("estatus", e.target.value)}
              >
                <option value="Activa">Activa</option>
                <option value="Cancelada">Cancelada</option>
                <option value="Liberada">Liberada</option>
                <option value="Completada">Completada</option>
              </select>
            </div>
          </div>

          {/* No Show toggle */}
          <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                <FileText size={14} /> Marcar como No Show
              </p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                El socio no se presentó a la reserva
              </p>
            </div>
            <button
              type="button"
              onClick={() => field("estatus_noshow", !formData.estatus_noshow)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${formData.estatus_noshow ? "bg-red-600" : "bg-gray-700"}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${formData.estatus_noshow ? "left-7" : "left-1"}`}
              />
            </button>
          </div>

          {/* Footer */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3 rounded-xl transition-all border border-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-purple-900/20"
            >
              {loading ? (
                <span className="animate-pulse">Guardando...</span>
              ) : (
                <>
                  <Save size={18} className="mr-2" /> Crear Reserva
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReservaModal;
