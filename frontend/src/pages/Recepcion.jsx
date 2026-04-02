import { useState } from 'react';
import { Search, CalendarDays, Baby, CreditCard, AlertTriangle, Clock, X, Edit, Trash2, CheckCircle2 } from 'lucide-react';

const Recepcion = () => {
    const [tabActiva, setTabActiva] = useState('reservas'); 
    const [modalLudoteca, setModalLudoteca] = useState(false);
    
    // --- ESTADOS PARA RESERVACIONES ---
    const [modalEditar, setModalEditar] = useState(false);
    // Estado para manejar los datos del formulario de edición en tiempo real
    const [reservaEditando, setReservaEditando] = useState(null);

    const [reservas, setReservas] = useState([
        { id: 'RES-001', socio: 'Adrián Pérez', espacio: 'Cancha de Futbol Rápido', fecha: '2026-04-02', horario: '18:00 - 19:00', estatus: 'Confirmada' },
        { id: 'RES-002', socio: 'Bryan Mendoza', espacio: 'Cancha Grande Super', fecha: '2026-04-02', horario: '19:00 - 20:30', estatus: 'Pendiente' },
        { id: 'RES-003', socio: 'Kevin Rosario', espacio: 'Cancha de Tenis 1', fecha: '2026-04-03', horario: '08:00 - 10:00', estatus: 'Confirmada' },
    ]);

    // Catálogo falso de instalaciones (Próximamente vendrá de Laravel)
    const catalogoInstalaciones = [
        "Cancha de Futbol Rápido", "Cancha Grande Super", "Cancha de Tenis 1", 
        "Cancha de Tenis 2", "Cancha de Basquetbol", "Alberca Olímpica", "Gimnasio Principal"
    ];

    // --- FUNCIONES DE LOS BOTONES ---
    const confirmarReserva = (id) => {
        setReservas(reservas.map(res => res.id === id ? { ...res, estatus: 'Confirmada' } : res));
    };

    const eliminarReserva = (id) => {
        if(window.confirm(`¿Estás seguro de cancelar la reserva ${id}?`)) {
            setReservas(reservas.filter(res => res.id !== id));
        }
    };

    const abrirModalEditar = (reserva) => {
        setReservaEditando({ ...reserva }); // Hacemos una copia para editar sin romper la tabla
        setModalEditar(true);
    };

    const guardarEdicion = (e) => {
        e.preventDefault();
        // Actualizamos la tabla principal con los datos modificados
        setReservas(reservas.map(res => res.id === reservaEditando.id ? reservaEditando : res));
        setModalEditar(false);
        alert(`✅ Reserva ${reservaEditando.id} actualizada con éxito.`);
    };

    return (
        <div className="space-y-6 text-gray-200">
            {/* ENCABEZADO */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">🛎️ Control de Recepción</h1>
                    <p className="text-gray-400 mt-2">Gestión de accesos, ludoteca y reservaciones</p>
                </div>
                <div className="flex items-center bg-[#1a1d23] border border-gray-800 rounded-xl px-4 py-3 w-96 focus-within:border-yellow-400 transition-colors shadow-lg">
                    <Search className="text-gray-500 mr-3" size={20} />
                    <input type="text" placeholder="Escanear o teclear ID..." className="bg-transparent border-none outline-none text-white w-full"/>
                </div>
            </div>

            {/* NAVEGACIÓN */}
            <div className="flex space-x-2 bg-[#14171c] p-1 rounded-xl border border-gray-800 w-max shadow-lg">
                <button onClick={() => setTabActiva('reservas')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${tabActiva === 'reservas' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}><CalendarDays size={18} /> Reservaciones</button>
                <button onClick={() => setTabActiva('ludoteca')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${tabActiva === 'ludoteca' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}><Baby size={18} /> Ludoteca Live</button>
                <button onClick={() => setTabActiva('membresias')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${tabActiva === 'membresias' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}><CreditCard size={18} /> Estatus Socios</button>
            </div>

            {/* ZONA DINÁMICA */}
            <div className="bg-[#14171c] border border-gray-800 rounded-2xl p-8 min-h-[500px] shadow-xl relative">
                
                {/* --- PESTAÑA RESERVAS --- */}
                {tabActiva === 'reservas' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Reservaciones de Hoy</h2>
                            <button className="bg-[#1a1d23] border border-gray-800 hover:border-yellow-400 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"><CalendarDays size={18} /> Filtrar Fechas</button>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-gray-800 shadow-lg">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-[#1a1d23] text-xs uppercase text-gray-500 font-bold">
                                    <tr>
                                        <th className="px-6 py-4">ID Reserva</th>
                                        <th className="px-6 py-4">Socio</th>
                                        <th className="px-6 py-4">Instalación</th>
                                        <th className="px-6 py-4">Horario</th>
                                        <th className="px-6 py-4">Estatus</th>
                                        <th className="px-6 py-4 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800 bg-[#0f1115]">
                                    {reservas.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center py-8">No hay reservaciones.</td></tr>
                                    ) : reservas.map((reserva) => (
                                        <tr key={reserva.id} className="hover:bg-[#1a1d23] transition-colors">
                                            <td className="px-6 py-4 font-bold text-white">{reserva.id}</td>
                                            <td className="px-6 py-4">{reserva.socio}</td>
                                            <td className="px-6 py-4 text-yellow-400">{reserva.espacio}</td>
                                            <td className="px-6 py-4"><div className="flex items-center gap-2"><Clock size={14} className="text-gray-500"/>{reserva.horario}</div></td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    reserva.estatus === 'Confirmada' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                                    reserva.estatus === 'Denegada' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                                    {reserva.estatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex justify-center gap-4">
                                                {reserva.estatus === 'Pendiente' && (
                                                    <button onClick={() => confirmarReserva(reserva.id)} className="text-green-400 hover:text-green-300 transition-colors" title="Confirmar Reserva"><CheckCircle2 size={18} /></button>
                                                )}
                                                <button onClick={() => abrirModalEditar(reserva)} className="text-blue-400 hover:text-blue-300 transition-colors" title="Modificar"><Edit size={18} /></button>
                                                <button onClick={() => eliminarReserva(reserva.id)} className="text-red-400 hover:text-red-300 transition-colors" title="Cancelar"><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- DEMÁS PESTAÑAS (Ludoteca y Membresías) --- */}
                {/* ... (Se mantiene igual, resumido para no estorbar aquí) ... */}
            </div>

            {/* MODAL DE EDITAR RESERVA MEJORADO */}
            {modalEditar && reservaEditando && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-[#1c1f26] border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Edit className="text-yellow-400"/> Modificar Reserva</h2>
                            <button onClick={() => setModalEditar(false)} className="text-gray-400 hover:text-white transition-colors"><X size={24}/></button>
                        </div>
                        
                        <form className="space-y-4" onSubmit={guardarEdicion}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ID Reserva</label>
                                    <input type="text" disabled value={reservaEditando.id} className="w-full bg-[#0f1115] border border-gray-700 rounded-lg p-3 text-gray-500 cursor-not-allowed" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Estatus</label>
                                    <select 
                                        value={reservaEditando.estatus} 
                                        onChange={(e) => setReservaEditando({...reservaEditando, estatus: e.target.value})}
                                        className="w-full bg-[#0f1115] border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 outline-none"
                                    >
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Confirmada">Confirmada</option>
                                        <option value="Denegada">Denegada</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Instalación</label>
                                <select 
                                    value={reservaEditando.espacio}
                                    onChange={(e) => setReservaEditando({...reservaEditando, espacio: e.target.value})}
                                    className="w-full bg-[#0f1115] border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 outline-none"
                                >
                                    {catalogoInstalaciones.map(inst => (
                                        <option key={inst} value={inst}>{inst}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Fecha</label>
                                    <input 
                                        type="date" 
                                        value={reservaEditando.fecha} 
                                        onChange={(e) => setReservaEditando({...reservaEditando, fecha: e.target.value})}
                                        className="w-full bg-[#0f1115] border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Horario</label>
                                    <input 
                                        type="text" 
                                        value={reservaEditando.horario} 
                                        onChange={(e) => setReservaEditando({...reservaEditando, horario: e.target.value})}
                                        className="w-full bg-[#0f1115] border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 outline-none" 
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-xs text-blue-400 mt-2 flex gap-3">
                                <span>ℹ️</span>
                                <p>La validación de disponibilidad de fechas se conectará en el siguiente Sprint con Laravel.</p>
                            </div>

                            <button type="submit" className="w-full font-bold text-lg py-4 rounded-xl mt-4 text-black bg-yellow-400 hover:bg-yellow-500 shadow-lg transition-all">
                                Guardar Cambios
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recepcion;