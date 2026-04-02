import { useState } from 'react';
import { Search, CalendarDays, Baby, CreditCard, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';

const Recepcion = () => {
    const [tabActiva, setTabActiva] = useState('ludoteca'); // <-- Ludoteca por defecto
    const [modalLudoteca, setModalLudoteca] = useState(false); // <-- Estado del modal

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
            <div className="bg-[#14171c] border border-gray-800 rounded-2xl p-8 min-h-[500px] shadow-xl relative">
                
                {/* --- PESTAÑA RESERVAS --- */}
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

                {/* --- PESTAÑA LUDOTECA --- */}
                {tabActiva === 'ludoteca' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Niños en Ludoteca</h2>
                            <button 
                                onClick={() => setModalLudoteca(true)} // <-- Abre el modal
                                className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-yellow-400/20"
                            >
                                + Registrar Ingreso
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Tarjeta de ejemplo por ahora */}
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

                {/* --- PESTAÑA MEMBRESÍAS --- */}
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

            {/* MODAL DE INGRESO A LUDOTECA */}
            {modalLudoteca && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-[#1c1f26] border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Baby className="text-yellow-400"/> Registrar Ingreso
                            </h2>
                            <button onClick={() => setModalLudoteca(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24}/>
                            </button>
                        </div>
                        
                        <form 
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const datos = {
                                    id_nino: formData.get('id_nino'),
                                    id_tutor: formData.get('id_tutor')
                                };

                                try {
                                    const res = await fetch('http://localhost:8000/api/ludoteca/ingreso', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                                        body: JSON.stringify(datos)
                                    });
                                    const data = await res.json();
                                    
                                    if (data.status === 'error') {
                                        alert("❌ " + data.message);
                                    } else {
                                        alert("✅ " + data.message);
                                        setModalLudoteca(false); // Cierra el modal si hubo éxito
                                        // Aquí luego recargaremos la lista de niños
                                    }
                                } catch (error) {
                                    alert("Error de conexión");
                                }
                            }}
                            className="space-y-5"
                        >
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ID del Niño (Socio Dependiente)</label>
                                <input 
                                    type="number" 
                                    name="id_nino"
                                    required
                                    placeholder="Ej. 1024" 
                                    className="w-full bg-[#0f1115] border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition-colors" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ID del Tutor Responsable</label>
                                <input 
                                    type="number" 
                                    name="id_tutor"
                                    required
                                    placeholder="Ej. 1023" 
                                    className="w-full bg-[#0f1115] border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition-colors" 
                                />
                            </div>
                            
                            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-sm text-blue-400 mt-4 flex gap-3">
                                <span>ℹ️</span>
                                <p>El sistema validará automáticamente que el menor tenga entre <strong>3 y 6 años</strong> de edad según el reglamento.</p>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full font-bold text-lg py-4 rounded-xl mt-4 text-black bg-yellow-400 hover:bg-yellow-500 shadow-lg shadow-yellow-400/20 transition-all"
                            >
                                Validar e Iniciar Estancia
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Recepcion;