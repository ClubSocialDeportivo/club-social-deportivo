import { X, Save, Calendar, Clock, Users, MapPin, Activity, User, Edit3 } from "lucide-react";
import { useState, useEffect } from "react";

const EditAgendaModal = ({ isOpen, onClose, data, onUpdate }) => {
  const [formData,      setFormData]      = useState({});
  const [disciplinas,   setDisciplinas]   = useState([]);
  const [instructores,  setInstructores]  = useState([]);
  const [instalaciones, setInstalaciones] = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [errors,        setErrors]        = useState({});

  useEffect(() => {
    if (!isOpen || !data) return;
    setFormData({ ...data });
    setErrors({});
    fetchCatalogos();
  }, [isOpen, data]);

  const fetchCatalogos = async () => {
    try {
      const [d, i, e] = await Promise.all([
        fetch("http://localhost:8000/api/agenda/catalogo/disciplinas").then(r => r.json()),
        fetch("http://localhost:8000/api/agenda/catalogo/instructores").then(r => r.json()),
        fetch("http://localhost:8000/api/instalaciones").then(r => r.json()),
      ]);
      if (d.status === "success") setDisciplinas(d.data);
      if (i.status === "success") setInstructores(i.data);
      if (e.status === "success") setInstalaciones(e.data);
    } catch (err) {
      console.error("Error cargando catálogos:", err);
    }
  };

  const field = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!formData.id_disciplina) e.id_disciplina = "Requerido";
    if (!formData.id_instructor) e.id_instructor = "Requerido";
    if (!formData.id_espacio)    e.id_espacio    = "Requerido";
    if (!formData.fecha)         e.fecha         = "Requerido";
    if (!formData.hora_inicio)   e.hora_inicio   = "Requerido";
    if (!formData.hora_fin)      e.hora_fin      = "Requerido";
    if (formData.hora_inicio && formData.hora_fin && formData.hora_fin <= formData.hora_inicio)
      e.hora_fin = "Debe ser después de la hora de inicio";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/agenda/${data.id_sesion}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        onUpdate();
        onClose();
      } else {
        if (result.errors) setErrors(result.errors);
      }
    } catch (err) {
      console.error("Error al actualizar sesión:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1c1f26] border border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#23272f]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Edit3 size={20}/>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Editar Sesión</h2>
              <p className="text-gray-500 text-xs">ID #{data.id_sesion}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400">
            <X size={20}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

          {/* Disciplina */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
              <Activity size={12}/> Disciplina *
            </label>
            <select
              className={`w-full bg-gray-900 border rounded-lg p-2.5 text-white outline-none cursor-pointer transition-all ${errors.id_disciplina ? "border-red-500" : "border-gray-700 focus:border-blue-500"}`}
              value={formData.id_disciplina ?? ""}
              onChange={e => field("id_disciplina", e.target.value)}
            >
              <option value="">Selecciona una disciplina...</option>
              {disciplinas.map(d => (
                <option key={d.id_disciplina} value={d.id_disciplina}>
                  {d.nombre_disciplina} {d.categoria ? `— ${d.categoria}` : ""}
                </option>
              ))}
            </select>
            {errors.id_disciplina && <p className="text-red-400 text-xs">{errors.id_disciplina}</p>}
          </div>

          {/* Instructor e Instalación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
                <User size={12}/> Instructor *
              </label>
              <select
                className={`w-full bg-gray-900 border rounded-lg p-2.5 text-white outline-none cursor-pointer transition-all ${errors.id_instructor ? "border-red-500" : "border-gray-700 focus:border-blue-500"}`}
                value={formData.id_instructor ?? ""}
                onChange={e => field("id_instructor", e.target.value)}
              >
                <option value="">Selecciona...</option>
                {instructores.map(i => (
                  <option key={i.id_instructor} value={i.id_instructor}>
                    {i.nombre_completo}
                  </option>
                ))}
              </select>
              {errors.id_instructor && <p className="text-red-400 text-xs">{errors.id_instructor}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
                <MapPin size={12}/> Instalación *
              </label>
              <select
                className={`w-full bg-gray-900 border rounded-lg p-2.5 text-white outline-none cursor-pointer transition-all ${errors.id_espacio ? "border-red-500" : "border-gray-700 focus:border-blue-500"}`}
                value={formData.id_espacio ?? ""}
                onChange={e => field("id_espacio", e.target.value)}
              >
                <option value="">Selecciona...</option>
                {instalaciones.map(i => (
                  <option key={i.id_espacio} value={i.id_espacio}>
                    {i.nombre_especifico}
                  </option>
                ))}
              </select>
              {errors.id_espacio && <p className="text-red-400 text-xs">{errors.id_espacio}</p>}
            </div>
          </div>

          {/* Fecha y Cupo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
                <Calendar size={12}/> Fecha *
              </label>
              <input
                type="date"
                className={`w-full bg-gray-900 border rounded-lg p-2.5 text-white outline-none transition-all ${errors.fecha ? "border-red-500" : "border-gray-700 focus:border-blue-500"}`}
                value={formData.fecha ?? ""}
                onChange={e => field("fecha", e.target.value)}
              />
              {errors.fecha && <p className="text-red-400 text-xs">{errors.fecha}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
                <Users size={12}/> Cupo Máximo
              </label>
              <input
                type="number"
                min={1}
                className="w-full bg-gray-900 border border-gray-700 focus:border-blue-500 rounded-lg p-2.5 text-white outline-none transition-all"
                value={formData.cupo_maximo ?? ""}
                onChange={e => field("cupo_maximo", e.target.value)}
              />
            </div>
          </div>

          {/* Horarios y Estado */}
          <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              <Clock size={14}/> Horario y Estado
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase">Inicio *</label>
                <input
                  type="time"
                  className={`w-full bg-gray-900 border rounded-lg p-2 text-white outline-none transition-all ${errors.hora_inicio ? "border-red-500" : "border-gray-700 focus:border-blue-500"}`}
                  value={formData.hora_inicio ?? ""}
                  onChange={e => field("hora_inicio", e.target.value)}
                />
                {errors.hora_inicio && <p className="text-red-400 text-xs">{errors.hora_inicio}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase">Fin *</label>
                <input
                  type="time"
                  className={`w-full bg-gray-900 border rounded-lg p-2 text-white outline-none transition-all ${errors.hora_fin ? "border-red-500" : "border-gray-700 focus:border-blue-500"}`}
                  value={formData.hora_fin ?? ""}
                  onChange={e => field("hora_fin", e.target.value)}
                />
                {errors.hora_fin && <p className="text-red-400 text-xs">{errors.hora_fin}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 font-bold uppercase">Estado</label>
              <select
                className="w-full bg-gray-900 border border-gray-700 focus:border-blue-500 rounded-lg p-2 text-white outline-none cursor-pointer"
                value={formData.estado ?? ""}
                onChange={e => field("estado", e.target.value)}
              >
                <option value="Programada">Programada</option>
                <option value="Activa">Activa</option>
                <option value="Cancelada">Cancelada</option>
                <option value="Finalizada">Finalizada</option>
              </select>
            </div>
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
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-blue-900/20"
            >
              {loading ? (
                <span className="animate-pulse">Guardando...</span>
              ) : (
                <><Save size={18} className="mr-2"/> Guardar Cambios</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAgendaModal;