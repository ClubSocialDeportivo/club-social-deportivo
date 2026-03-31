import { useState } from 'react';
import { Search, CalendarDays, Baby, CreditCard, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const Recepcion = () => {
    const [tabActiva, setTabActiva] = useState('reservas');

    return (
        <div className="space-y-6 text-gray-200">
            {/* ENCABEZADO */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
                        🛎️ Control de Recepción
                    </h1>
                    <p className="text-gray-400 mt-2">Gestión de accesos, ludoteca y reservaciones</p>
                </div>
                
                {/* BUSCADOR DE MEMBRESÍAS */}
                <div className="flex items-center bg-[#1a1d23] border border-gray-800 rounded-xl px-4 py-3 w-96 focus-within:border-yellow-400 transition-colors shadow-lg">
                    <Search className="text-gray-500 mr-3" size={20} />
                    <input 
                        type="text" 
                        placeholder="Escanear o teclear ID de Socio..." 
                        className="bg-transparent border-none outline-none text-white w-full"
                    />
                </div>
            </div>

            {/* NAVEGACIÓN DE PESTAÑAS */}
            <div className="flex space-x-2 bg-[#14171c] p-1 rounded-xl border border-gray-800 w-max shadow-lg">
                <button 
                    onClick={() => setTabActiva('reservas')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${tabActiva === 'reservas' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                    <CalendarDays size={18} /> Reservaciones
                </button>
                <button 
                    onClick={() => setTabActiva('ludoteca')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${tabActiva === 'ludoteca' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                    <Baby size={18} /> Ludoteca Live
                </button>
                <button 
                    onClick={() => setTabActiva('membresias')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${tabActiva === 'membresias' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                    <CreditCard size={18} /> Estatus Socios
                </button>
            </div>

            {/* ZONA DINÁMICA */}
            <div className="bg-[#14171c] border border-gray-800 rounded-2xl p-8 min-h-[500px] shadow-xl">
                
                {tabActiva === 'reservas' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Reservaciones de Hoy</h2>
                        </div>
                        <div className="border-2 border-dashed border-gray-800 p-10 rounded-2xl text-center text-gray-500">
                            <CalendarDays className="mx-auto mb-4 opacity-50" size={48} />
                            <p>Aquí cargaremos la tabla de reservas para modificar o cancelar (CM3-39).</p>
                        </div>
                    </div>
                )}

                {tabActiva === 'ludoteca' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Niños en Ludoteca</h2>
                            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-yellow-400/20">
                                + Registrar Ingreso
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#1a1d23] border border-gray-800 rounded-xl p-5 relative overflow-hidden group hover:border-yellow-400 transition-colors">
                                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                                <h3 className="font-bold text-lg text-white">Socio #1024 (Hijo)</h3>
                                <p className="text-xs text-gray-400 mb-4">Tutor: Juan Pérez (Socio #1023)</p>
                                <div className="flex items-center gap-2 text-green-400 font-bold text-xl bg-green-500/10 w-max px-3 py-1 rounded-lg">
                                    <Clock size={20} /> 00:45:00
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2 uppercase font-bold">Límite: 2 horas</p>
                            </div>
                        </div>
                    </div>
                )}

                {tabActiva === 'membresias' && (
                    <div className="animate-in fade-in duration-300">
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Verificación de Accesos</h2>
                        </div>
                        <div className="border-2 border-dashed border-gray-800 p-10 rounded-2xl text-center text-gray-500">
                            <AlertTriangle className="mx-auto mb-4 opacity-50" size={48} />
                            <p>Aquí mostraremos las alertas si el socio escaneado debe pagos o su membresía venció (CM3-42).</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recepcion;