import { X, Calendar, Clock, Users, MapPin, Activity, Package, ToggleLeft, CheckCircle, XCircle, Hash, Trophy } from "lucide-react";
import InfoBox from "../components/InfoBox";

const FacilityDetailsModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1c1f26] border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1c1f26] z-10">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{data.nombre_especifico}</h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <Hash size={12}/> ID: {data.id_espacio}
                </p>
                <StatusBadge status={data.estatus} />
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <X className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Grid de Información General */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoBox icon={<Users size={18}/>} label="Capacidad" value={`${data.capacidad_max} personas`} />
            <InfoBox icon={<MapPin size={18}/>} label="Ubicación" value={data.ubicacion || 'No especificada'} />
            <InfoBox icon={<Activity size={18}/>} label="Superficie" value={data.tipo_superficie || 'Estándar'} />
          </div>

          {/* Horario + Permite Reserva */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
              <h3 className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
                <Clock size={14}/> Horario de Operación
              </h3>
              {data.horario_apertura && data.horario_cierre ? (
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-600 uppercase">Apertura</p>
                    <p className="text-white font-bold text-lg">{data.horario_apertura}</p>
                  </div>
                  <span className="text-gray-600 text-xl">→</span>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-600 uppercase">Cierre</p>
                    <p className="text-white font-bold text-lg">{data.horario_cierre}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">Horario no definido</p>
              )}
            </div>

            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
              <h3 className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
                <ToggleLeft size={14}/> Permite Reserva
              </h3>
              <div className="flex items-center gap-2">
                {data.permite_reserva ? (
                  <>
                    <CheckCircle size={20} className="text-green-400"/>
                    <span className="text-green-400 font-bold">Habilitado</span>
                    <span className="text-gray-500 text-xs ml-1">— acepta reservaciones</span>
                  </>
                ) : (
                  <>
                    <XCircle size={20} className="text-red-400"/>
                    <span className="text-red-400 font-bold">Deshabilitado</span>
                    <span className="text-gray-500 text-xs ml-1">— sin reservaciones</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Equipamiento */}
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            <h3 className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2">
              <Package size={14}/> Equipamiento
            </h3>
            <p className="text-white text-sm leading-relaxed">
              {data.equipamiento || <span className="text-gray-500 italic">Sin equipamiento registrado</span>}
            </p>
          </div>

          {/* Metadatos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetaField label="Fecha de Registro" value={formatDate(data.created_at)} />
            <MetaField label="Última Actualización" value={formatDate(data.updated_at)} />
          </div>

          {/* Agendas, Reservas y TORNEOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-800 pt-6 mt-6">
            
            {/* 1. Agendas Próximas */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Calendar size={20} className="mr-2 text-blue-400"/> Agendas
              </h3>
              <div className="space-y-2">
                {data.agendas?.length > 0 ? data.agendas.map(a => (
                  <div key={a.id_sesion} className="p-3 bg-gray-800/40 rounded-lg text-sm border-l-4 border-blue-500">
                    <p className="font-bold text-white">Sesión #{a.id_sesion}</p>
                    <p className="text-gray-400">{a.fecha} | {a.hora_inicio}</p>
                  </div>
                )) : <p className="text-gray-500 text-sm italic">Sin agendas.</p>}
              </div>
            </div>

            {/* 2. Reservas Activas */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Activity size={20} className="mr-2 text-green-400"/> Reservas
              </h3>
              <div className="space-y-2">
                {data.reservas?.length > 0 ? data.reservas.map(r => (
                  <div key={r.id_reserva} className="p-3 bg-gray-800/40 rounded-lg text-sm border-l-4 border-green-500">
                    <p className="font-bold text-white">Folio: {r.folio_reserva}</p>
                    <p className="text-gray-400">{r.fecha} | {r.hora_inicio}</p>
                    <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded uppercase">{r.estatus}</span>
                  </div>
                )) : <p className="text-gray-500 text-sm italic">Sin reservas.</p>}
              </div>
            </div>

            {/* 3. Torneos Activos */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Trophy size={20} className="mr-2 text-yellow-400"/> Torneos
              </h3>
              <div className="space-y-2">
                {data.torneos?.length > 0 ? data.torneos.map(t => (
                  <div key={t.id_torneo} className="p-3 bg-yellow-400/10 rounded-lg text-sm border-l-4 border-yellow-500 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-10"><Trophy size={48} /></div>
                    <p className="font-bold text-yellow-400">{t.nombre_torneo}</p>
                    <p className="text-gray-300 mt-1">🗓️ Inicia: {t.fecha_inicio}</p>
                    <p className="text-gray-300">🏁 Termina: {t.fecha_fin}</p>
                    <div className="mt-2">
                      <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded uppercase font-bold">
                        Bloqueo por Torneo
                      </span>
                    </div>
                  </div>
                )) : <p className="text-gray-500 text-sm italic">Cancha libre de torneos.</p>}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Disponible: "bg-green-500/10 text-green-500",
    Ocupado: "bg-blue-500/10 text-blue-500",
    Mantenimiento: "bg-red-500/10 text-red-500",
    Reservado: "bg-yellow-500/10 text-yellow-500",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${styles[status] || "bg-gray-700 text-gray-300"}`}>
      {status}
    </span>
  );
};

const MetaField = ({ label, value }) => (
  <div className="bg-gray-900/30 px-4 py-3 rounded-xl border border-gray-800/60">
    <p className="text-[10px] text-gray-600 uppercase font-bold mb-0.5">{label}</p>
    <p className="text-gray-400 text-sm">{value}</p>
  </div>
);

const formatDate = (isoString) => {
  if (!isoString) return "No disponible";
  return new Date(isoString).toLocaleString("es-MX", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

export default FacilityDetailsModal;