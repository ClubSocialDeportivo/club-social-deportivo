import { X, Calendar, Users, MapPin, Trophy, Swords, Hash, Activity } from "lucide-react";

const TorneoDetailsModal = ({ isOpen, onClose, torneo }) => {
  if (!isOpen || !torneo) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1c1f26] border border-gray-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">

        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1c1f26] z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-400/10 rounded-xl border border-yellow-400/20">
                <Trophy className="text-yellow-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{torneo.nombre_torneo}</h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <Hash size={12}/> ID: {torneo.id_torneo}
                </p>
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-yellow-500/10 text-yellow-500 uppercase">
                  {torneo.categoria}
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-blue-500/10 text-blue-500 uppercase">
                  {torneo.tipo}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <X className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800 flex items-center gap-4">
                <MapPin className="text-gray-500" size={24} />
                <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Sede Asignada</p>
                    {/* AQUI ESTA LA MAGIA: Ahora muestra el nombre exacto de la cancha */}
                    <p className="text-white font-medium">{torneo.sede?.nombre_especifico || torneo.sede?.nombre_sede || 'Sede por asignar'}</p>
                </div>
            </div>
            <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800 flex items-center gap-4">
                <Swords className="text-gray-500" size={24} />
                <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Formato de Juego</p>
                    <p className="text-white font-medium">{torneo.tipo_bracket || 'Eliminatoria'}</p>
                </div>
            </div>
            <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800 flex items-center gap-4">
                <Users className="text-gray-500" size={24} />
                <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Inscritos</p>
                    <p className="text-white font-medium">{torneo.participantes?.length || 0} Jugadores</p>
                </div>
            </div>
          </div>

          <div className="bg-[#1a1d23] p-6 rounded-xl border border-gray-800">
            <h3 className="text-sm font-bold uppercase text-gray-500 mb-4 flex items-center gap-2">
              <Calendar size={16}/> Cronograma Oficial
            </h3>
            <div className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg">
                <div className="text-center w-1/3">
                    <p className="text-xs text-yellow-400 mb-1">DÍA DE INAUGURACIÓN</p>
                    <p className="text-xl font-bold text-white">{torneo.fecha_inicio || 'Por definir'}</p>
                </div>
                <div className="w-1/3 flex justify-center">
                    <div className="h-px bg-gray-700 w-full relative flex items-center justify-center">
                        <Activity className="absolute text-gray-600 bg-[#1a1d23] px-2" size={32} />
                    </div>
                </div>
                <div className="text-center w-1/3">
                    <p className="text-xs text-yellow-400 mb-1">GRAN FINAL</p>
                    <p className="text-xl font-bold text-white">{torneo.fecha_fin || 'Por definir'}</p>
                </div>
            </div>
            <p className="text-center text-gray-500 text-xs mt-4 italic">
                Durante este periodo, la cancha designada quedará bloqueada en el módulo de Instalaciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TorneoDetailsModal;