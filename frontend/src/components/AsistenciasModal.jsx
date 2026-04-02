import { X, CheckCircle, Clock, Users, Plus, Save, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

const AsistenciasModal = ({ sesion, onClose }) => {
  const [asistencias, setAsistencias] = useState([]);
  const [socios,      setSocios]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showAdd,     setShowAdd]     = useState(false);
  const [socioId,     setSocioId]     = useState("");
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");

  useEffect(() => {
    fetchAsistencias();
    fetchSocios();
  }, []);

  const fetchAsistencias = async () => {
    setLoading(true);
    try {
      const res    = await fetch(`http://localhost:8000/api/asistencias/sesion/${sesion.id_sesion}`, {
        headers: { Accept: "application/json" }
      });
      const result = await res.json();
      if (result.status === "success") setAsistencias(result.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchSocios = async () => {
    try {
      const res    = await fetch("http://localhost:8000/api/socios", { headers: { Accept: "application/json" } });
      const result = await res.json();
      if (result.data) setSocios(result.data);
    } catch (err) { console.error(err); }
  };

  const handleRegistrar = async () => {
    if (!socioId) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/api/asistencias", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body:    JSON.stringify({ id_socio: socioId, id_sesion: sesion.id_sesion }),
      });
      const result = await response.json();
      if (response.ok) {
        setSocioId("");
        setShowAdd(false);
        fetchAsistencias();
      } else {
        setError(result.message ?? "Error al registrar");
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este registro?")) return;
    await fetch(`http://localhost:8000/api/asistencias/${id}`, {
      method: "DELETE", headers: { Accept: "application/json" }
    });
    fetchAsistencias();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1c1f26] border border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#23272f]">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-400"/>
              <h2 className="text-lg font-bold">Lista de Asistencia</h2>
            </div>
            <p className="text-gray-500 text-xs mt-0.5">
              {sesion.disciplina?.nombre_disciplina} · {sesion.fecha} · {sesion.hora_inicio}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400">
            <X size={18}/>
          </button>
        </div>

        {/* Stats rápidas */}
        <div className="px-5 py-3 border-b border-gray-800 flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-sm">
            <Users size={14} className="text-green-400"/>
            <span className="font-bold text-white">{asistencias.length}</span>
            <span className="text-gray-500">asistentes</span>
          </span>
          {sesion.cupo_maximo && (
            <span className="text-xs text-gray-500">
              de {sesion.cupo_maximo} cupo máximo
            </span>
          )}
          <button
            onClick={() => { setShowAdd(!showAdd); setError(""); }}
            className="ml-auto flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={13}/> Registrar
          </button>
        </div>

        {/* Form de registro rápido */}
        {showAdd && (
          <div className="px-5 py-3 border-b border-gray-800 bg-gray-900/40 space-y-2">
            {error && (
              <p className="text-red-400 text-xs bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
            )}
            <div className="flex gap-2">
              <select
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white outline-none focus:border-green-500 cursor-pointer"
                value={socioId}
                onChange={e => setSocioId(e.target.value)}
              >
                <option value="">Selecciona un socio...</option>
                {socios.map(s => (
                  <option key={s.id_socio} value={s.id_socio}>
                    {s.nombre} {s.apellidos}
                  </option>
                ))}
              </select>
              <button
                onClick={handleRegistrar}
                disabled={saving || !socioId}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5"
              >
                <Save size={14}/> {saving ? "..." : "Guardar"}
              </button>
            </div>
          </div>
        )}

        {/* Lista de asistentes */}
        <div className="max-h-96 overflow-y-auto divide-y divide-gray-800">
          {loading ? (
            <p className="text-center py-8 text-gray-500 text-sm">Cargando...</p>
          ) : asistencias.length === 0 ? (
            <p className="text-center py-8 text-gray-500 text-sm italic">Sin asistentes registrados</p>
          ) : asistencias.map((a, idx) => (
            <div key={a.id_asistencia} className="flex items-center justify-between px-5 py-3 hover:bg-gray-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-green-500/10 text-green-400 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {a.socio ? `${a.socio.nombre} ${a.socio.apellidos}` : `Socio #${a.id_socio}`}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Clock size={10}/>
                    {a.timestamp_registro
                      ? new Date(a.timestamp_registro).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
                      : "—"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(a.id_asistencia)}
                className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 size={14}/>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-2.5 rounded-xl transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsistenciasModal;