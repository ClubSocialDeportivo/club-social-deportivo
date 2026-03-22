import { X, Calendar, Clock, Users, MapPin, Activity } from "lucide-react";
import InfoBox from "../components/InfoBox";

const FacilityDetailsModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1c1f26] border border-gray-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1c1f26] z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">{data.nombre_especifico}</h2>
            <p className="text-gray-400 text-sm">ID Espacio: #{data.id_espacio}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <X className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Grid de Información General */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoBox icon={<Users size={18}/>} label="Capacidad" value={`${data.capacidad_max} personas`} />
            <InfoBox icon={<MapPin size={18}/>} label="Ubicación" value={data.ubicacion || 'No especificada'} />
            <InfoBox icon={<Activity size={18}/>} label="Superficie" value={data.tipo_superficie || 'Estándar'} />
          </div>

          {/* Sección de Horarios */}
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            <h3 className="text-sm font-semibold uppercase text-gray-500 mb-3 flex items-center">
              <Clock size={16} className="mr-2"/> Horario de Operación
            </h3>
            <p className="text-white font-medium">
              {data.horario_apertura} - {data.horario_cierre}
            </p>
          </div>

          {/* Agendas y Reservas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Calendar size={20} className="mr-2 text-blue-400"/> Agendas Próximas
              </h3>
              <div className="space-y-2">
                {data.agendas?.length > 0 ? data.agendas.map(a => (
                  <div key={a.id_sesion} className="p-3 bg-gray-800/40 rounded-lg text-sm border-l-4 border-blue-500">
                    <p className="font-bold text-white">Sesión #{a.id_sesion}</p>
                    <p className="text-gray-400">{a.fecha} | {a.hora_inicio}</p>
                  </div>
                )) : <p className="text-gray-500 text-sm italic">No hay agendas programadas.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Activity size={20} className="mr-2 text-green-400"/> Reservas Activas
              </h3>
              <div className="space-y-2">
                {data.reservas?.length > 0 ? data.reservas.map(r => (
                  <div key={r.id_reserva} className="p-3 bg-gray-800/40 rounded-lg text-sm border-l-4 border-green-500">
                    <p className="font-bold text-white">Folio: {r.folio_reserva}</p>
                    <p className="text-gray-400">{r.fecha} | {r.hora_inicio}</p>
                    <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded uppercase">{r.estatus}</span>
                  </div>
                )) : <p className="text-gray-500 text-sm italic">No hay reservas para este espacio.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetailsModal;