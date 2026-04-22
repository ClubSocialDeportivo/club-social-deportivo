import { X, CheckCircle, Clock, Users, Search } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const AsistenciasModal = ({ sesion, onClose }) => {
  const [asistencias, setAsistencias] = useState([]);
  const [socios,      setSocios]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [searchTerm,  setSearchTerm]  = useState("");

  const fetchAsistencias = useCallback(async () => {
    setLoading(true);
    try {
      const res    = await fetch(`http://localhost:8000/api/asistencias/sesion/${sesion.id_sesion}`, {
        headers: { Accept: "application/json" }
      });
      const result = await res.json();
      if (result.status === "success") setAsistencias(result.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [sesion.id_sesion]);

  const fetchSocios = useCallback(async () => {
    try {
      const res    = await fetch("http://localhost:8000/api/socios", { headers: { Accept: "application/json" } });
      const result = await res.json();
      if (result.data) setSocios(result.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    fetchAsistencias();
    fetchSocios();
  }, [fetchAsistencias, fetchSocios]);

  // Lógica central del Switch Manual
  const handleToggleAsistencia = async (socioId, isPresent, asistenciaId) => {
    if (saving) return;
    setSaving(true);
    try {
      if (isPresent) {
        // Si el switch estaba prendido y lo apagan, quitamos la asistencia (DELETE)
        if (!confirm("¿Quitar la asistencia a este alumno?")) {
            setSaving(false);
            return;
        }
        await fetch(`http://localhost:8000/api/asistencias/${asistenciaId}`, {
          method: "DELETE", headers: { Accept: "application/json" }
        });
      } else {
        // Si el switch estaba apagado y lo prenden, marcamos asistencia (POST)
        await fetch("http://localhost:8000/api/asistencias", {
          method:  "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body:    JSON.stringify({ id_socio: socioId, id_sesion: sesion.id_sesion }),
        });
      }
      await fetchAsistencias(); // Refrescamos la vista
    } catch (err) {
        console.error(err);
    } finally {
        setSaving(false);
    }
  };

  // Buscador en tiempo real
  const filteredSocios = socios.filter(s =>
    `${s.nombre} ${s.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1c1f26] border border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#23272f] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-400"/>
              <h2 className="text-lg font-bold text-white">Pase de Lista Manual</h2>
            </div>
            <p className="text-gray-500 text-xs mt-0.5">
              {sesion.disciplina?.nombre_disciplina} · {sesion.fecha} · {sesion.hora_inicio}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400">
            <X size={18}/>
          </button>
        </div>

        {/* Stats rápidas & Buscador */}
        <div className="px-5 py-4 border-b border-gray-800 bg-gray-900/40 shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm">
              <Users size={15} className="text-green-400"/>
              <span className="font-bold text-white">{asistencias.length}</span>
              <span className="text-gray-400">asistentes confirmados</span>
            </span>
            {sesion.cupo_maximo && (
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-md">
                Cupo: {sesion.cupo_maximo}
              </span>
            )}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por nombre o apellido..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-green-500 outline-none transition-colors"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de Alumnos con Toggle Switch */}
        <div className="overflow-y-auto flex-1 divide-y divide-gray-800/50">
          {loading ? (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
            </div>
          ) : filteredSocios.length === 0 ? (
            <p className="text-center py-8 text-gray-500 text-sm italic">No se encontraron alumnos</p>
          ) : (
            filteredSocios.map((socio) => {
              // Verificar si el socio está en la lista de asistencias
              const asistencia = asistencias.find(a =>
                a.id_socio === socio.id_socio || (a.socio && a.socio.id_socio === socio.id_socio)
              );
              const isPresent = !!asistencia;

              return (
                <div key={socio.id_socio} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isPresent ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                      {socio.nombre.charAt(0)}{socio.apellidos.charAt(0)}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold transition-colors ${isPresent ? 'text-white' : 'text-gray-300'}`}>
                        {socio.nombre} {socio.apellidos}
                      </p>
                      {isPresent ? (
                        <p className="text-xs text-green-500 flex items-center gap-1 mt-0.5">
                          <Clock size={11}/>
                          Registrado a las {new Date(asistencia.timestamp_registro || Date.now()).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 mt-0.5">Ausente</p>
                      )}
                    </div>
                  </div>

                  {/* El famoso Switch Manual */}
                  <button
                    onClick={() => handleToggleAsistencia(socio.id_socio, isPresent, asistencia?.id_asistencia)}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-[#1c1f26] disabled:opacity-50 ${
                      isPresent ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <span className="sr-only">Marcar asistencia</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isPresent ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-[#2a2e37] hover:bg-[#323741] text-white font-bold py-2.5 rounded-xl transition-all"
          >
            Cerrar Lista
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsistenciasModal;