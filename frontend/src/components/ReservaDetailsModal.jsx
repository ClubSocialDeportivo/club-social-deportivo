import { X, Calendar, Clock, MapPin, User, Hash, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const ReservaDetailsModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1c1f26] border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1c1f26] z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-white font-mono">
                {data.folio_reserva}
              </h2>
              <EstatusBadge status={data.estatus}/>
            </div>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              <Hash size={12}/> Reserva #{data.id_reserva}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <X className="text-gray-400"/>
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Grid principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBox
              icon={<User size={18}/>}
              label="Socio"
              value={data.socio ? `${data.socio.nombre} ${data.socio.apellidos}` : `ID ${data.id_socio}`}
              sub={data.socio?.tipo_membresia}
            />
            <InfoBox
              icon={<MapPin size={18}/>}
              label="Instalación"
              value={data.espacio?.nombre_especifico ?? `ID ${data.id_espacio}`}
              sub={data.espacio?.ubicacion}
            />
          </div>

          {/* Fecha y Horario */}
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
              <Clock size={14}/> Fecha y Horario
            </h3>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] text-gray-600 uppercase font-bold">Fecha</p>
                <p className="text-white font-bold text-lg flex items-center gap-2">
                  <Calendar size={16} className="text-purple-400"/>
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

          {/* No Show */}
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
              <AlertTriangle size={14}/> Asistencia
            </h3>
            <div className="flex items-center gap-2">
              {data.estatus_noshow ? (
                <>
                  <XCircle size={20} className="text-red-400"/>
                  <span className="text-red-400 font-bold">No Show</span>
                  <span className="text-gray-500 text-xs ml-1">— el socio no se presentó</span>
                </>
              ) : (
                <>
                  <CheckCircle size={20} className="text-green-400"/>
                  <span className="text-green-400 font-bold">Presentó</span>
                  <span className="text-gray-500 text-xs ml-1">— sin registro de ausencia</span>
                </>
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

const EstatusBadge = ({ status }) => {
  const styles = {
    Activa:     "bg-green-500/10  text-green-400",
    Cancelada:  "bg-red-500/10    text-red-400",
    Liberada:   "bg-blue-500/10   text-blue-400",
    Completada: "bg-purple-500/10 text-purple-400",
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

export default ReservaDetailsModal;