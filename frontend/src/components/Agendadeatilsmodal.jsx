import { X, Calendar, Clock, Users, MapPin, Activity, User, Hash, CheckCircle, XCircle } from "lucide-react";

const AgendaDetailsModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1c1f26] border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1c1f26] z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-white">
                {data.disciplina?.nombre_disciplina ?? "Sesión"}
              </h2>
              <EstadoBadge status={data.estado}/>
            </div>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              <Hash size={12}/> Sesión #{data.id_sesion}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <X className="text-gray-400"/>
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Grid principal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoBox
              icon={<User size={18}/>}
              label="Instructor"
              value={data.instructor?.nombre_completo ?? `ID ${data.id_instructor}`}
              sub={data.instructor?.especialidad}
            />
            <InfoBox
              icon={<MapPin size={18}/>}
              label="Instalación"
              value={data.espacio?.nombre_especifico ?? `ID ${data.id_espacio}`}
              sub={data.espacio?.ubicacion}
            />
            <InfoBox
              icon={<Users size={18}/>}
              label="Cupo Máximo"
              value={data.cupo_maximo ? `${data.cupo_maximo} personas` : "Sin límite"}
            />
          </div>

          {/* Disciplina detalle */}
          {data.disciplina && (
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                <Activity size={14}/> Disciplina
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Nombre</p>
                  <p className="text-white font-semibold">{data.disciplina.nombre_disciplina}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Categoría</p>
                  <p className="text-white">{data.disciplina.categoria ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Equipo necesario</p>
                  <p className="text-gray-400 text-sm">{data.disciplina.equipo_necesario ?? "—"}</p>
                </div>
              </div>
              {data.disciplina.descripcion && (
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                  {data.disciplina.descripcion}
                </p>
              )}
            </div>
          )}

          {/* Fecha y Horario */}
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
              <Clock size={14}/> Fecha y Horario
            </h3>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] text-gray-600 uppercase font-bold">Fecha</p>
                <p className="text-white font-bold text-lg flex items-center gap-2">
                  <Calendar size={16} className="text-blue-400"/>
                  {data.fecha}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-[10px] text-gray-600 uppercase">Inicio</p>
                  <p className="text-white font-bold text-lg">{data.hora_inicio}</p>
                </div>
                <span className="text-gray-600 text-xl">→</span>
                <div className="text-center">
                  <p className="text-[10px] text-gray-600 uppercase">Fin</p>
                  <p className="text-white font-bold text-lg">{data.hora_fin}</p>
                </div>
              </div>
            </div>
          </div>

        {/* --- INICIO CAMBIO CM3-168: LISTA DE ASISTENTES --- */}
        <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              <Users size={14} /> Lista de Asistentes
            </h3>
            <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-1 rounded-full border border-blue-500/20">
              {data.asistencias?.length || 0} / {data.cupo_maximo || "∞"} LUGARES
            </span>
          </div>

          <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
            {data.asistencias && data.asistencias.length > 0 ? (
              data.asistencias.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-[#1c1f26] p-3 rounded-lg border border-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                      {item.socio?.nombre?.charAt(0) || "S"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        {item.socio?.nombre} {item.socio?.apellido_paterno}
                      </p>
                      <p className="text-[10px] text-gray-500">Socio #{item.id_socio}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    item.socio?.estatus_financiero === "Activo"
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {item.socio?.estatus_financiero || "S/E"}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-800 rounded-xl">
                <Users className="mx-auto text-gray-700 mb-2" size={24} />
                <p className="text-gray-500 text-sm italic">Clase Vacía</p>
                <p className="text-gray-600 text-[10px] uppercase mt-1">Nadie se ha inscrito aún</p>
              </div>
            )}
          </div>
        </div>

          {/* Metadatos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetaField label="Fecha de Registro"    value={formatDate(data.created_at)}/>
            <MetaField label="Última Actualización" value={formatDate(data.updated_at)}/>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Sub-componentes ───────────────────────────────────────────────────────────

const EstadoBadge = ({ status }) => {
  const styles = {
    Programada: "bg-yellow-500/10 text-yellow-400",
    Activa:     "bg-green-500/10  text-green-400",
    Cancelada:  "bg-red-500/10    text-red-400",
    Finalizada: "bg-gray-500/10   text-gray-400",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${styles[status] ?? "bg-gray-700 text-gray-300"}`}>
      {status}
    </span>
  );
};

const InfoBox = ({ icon, label, value, sub }) => (
  <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
    <div className="flex items-center gap-2 mb-2 text-gray-400">
      {icon}
      <p className="text-xs font-bold uppercase text-gray-500">{label}</p>
    </div>
    <p className="text-white font-semibold">{value}</p>
    {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
  </div>
);

const MetaField = ({ label, value }) => (
  <div className="bg-gray-900/30 px-4 py-3 rounded-xl border border-gray-800/60">
    <p className="text-[10px] text-gray-600 uppercase font-bold mb-0.5">{label}</p>
    <p className="text-gray-400 text-sm">{value}</p>
  </div>
);

const formatDate = (iso) => {
  if (!iso) return "No disponible";
  return new Date(iso).toLocaleString("es-MX", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

export default AgendaDetailsModal;