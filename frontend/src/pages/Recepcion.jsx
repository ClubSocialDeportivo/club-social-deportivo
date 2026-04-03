import { useState, useEffect } from 'react';
import { Search, CalendarDays, Baby, CreditCard, AlertTriangle, Clock, X, Edit, Trash2, CheckCircle2, UserCheck, Loader2 } from 'lucide-react';

const Recepcion = () => {
    const [tabActiva, setTabActiva] = useState('ludoteca');
    const [modalLudoteca, setModalLudoteca] = useState(false);
    
    // --- ESTADOS PARA RESERVACIONES ---
    const [modalEditar, setModalEditar] = useState(false);
    const [reservaEditando, setReservaEditando] = useState(null);

    const [reservas, setReservas] = useState([
        { id: 'RES-001', socio: 'Adrián Pérez', espacio: 'Cancha de Futbol Rápido', fecha: '2026-04-02', horario: '18:00 - 19:00', estatus: 'Confirmada' },
        { id: 'RES-002', socio: 'Bryan Mendoza', espacio: 'Cancha Grande Super', fecha: '2026-04-02', horario: '19:00 - 20:30', estatus: 'Pendiente' },
        { id: 'RES-003', socio: 'Kevin Rosario', espacio: 'Cancha de Tenis 1', fecha: '2026-04-03', horario: '08:00 - 10:00', estatus: 'Confirmada' },
    ]);

    const catalogoInstalaciones = ["Cancha de Futbol Rápido", "Cancha Grande Super", "Cancha de Tenis 1", "Cancha de Tenis 2", "Cancha de Basquetbol", "Alberca Olímpica", "Gimnasio Principal"];

    // --- ESTADOS PARA LUDOTECA (CRONÓMETROS CON MEMORIA) ---
    const [horaActual, setHoraActual] = useState(Date.now());

    const obtenerNinosGuardados = () => {
        const guardados = localStorage.getItem('ludoteca_ninos');
        if (guardados) return JSON.parse(guardados);
        return [
            { id_socio: 1024, nombre_nino: 'Juanito Pérez', tutor: 'Juan Pérez (1023)', tiempo_entrada: new Date(Date.now() - (10 * 60 * 1000)).toISOString() },
            { id_socio: 1045, nombre_nino: 'Lupita López', tutor: 'María López (1010)', tiempo_entrada: new Date(Date.now() - (108 * 60 * 1000)).toISOString() },
        ];
    };

    const [ninosLudoteca, setNinosLudoteca] = useState(obtenerNinosGuardados);

    useEffect(() => {
        localStorage.setItem('ludoteca_ninos', JSON.stringify(ninosLudoteca));
    }, [ninosLudoteca]);

    useEffect(() => {
        const intervalo = setInterval(() => setHoraActual(Date.now()), 1000);
        return () => clearInterval(intervalo);
    }, []);

    const calcularTiempoYColor = (entradaIso) => {
        const diff = Math.max(0, horaActual - new Date(entradaIso).getTime());
        const horas = Math.floor(diff / (1000 * 60 * 60));
        const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diff % (1000 * 60)) / 1000);

        const formato = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        const minutosTotales = (horas * 60) + minutos;
        
        let colorClass = "text-green-400 bg-green-500/10 border-green-500/20";
        let lineaLateral = "bg-green-500";

        if (minutosTotales >= 120) {
            colorClass = "text-red-400 bg-red-500/10 border-red-500/20 animate-pulse";
            lineaLateral = "bg-red-500 animate-pulse";
        } else if (minutosTotales >= 105) {
            colorClass = "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
            lineaLateral = "bg-yellow-400";
        }
        return { formato, colorClass, lineaLateral };
    };

    const darSalida = (id_socio) => {
        if(window.confirm(`¿Confirmar salida de la Ludoteca para el socio #${id_socio}?`)) {
            setNinosLudoteca(ninosLudoteca.filter(nino => nino.id_socio !== id_socio));
        }
    };

    // --- ESTADOS PARA EL BUSCADOR EN VIVO DEL MODAL ---
    const [buscandoNino, setBuscandoNino] = useState(false);
    const [nombreNino, setNombreNino] = useState('');
    const [buscandoTutor, setBuscandoTutor] = useState(false);
    const [nombreTutor, setNombreTutor] = useState('');

    // Simulador de búsqueda a la Base de Datos
    const simularBusqueda = (id, tipo) => {
        if (!id) {
            tipo === 'nino' ? setNombreNino('') : setNombreTutor('');
            return;
        }
        tipo === 'nino' ? setBuscandoNino(true) : setBuscandoTutor(true);
        
        setTimeout(() => {
            let nombreEncontrado = `Socio Encontrado #${id}`;
            // Nombres reales de tu BD para la DEMO
            if (id === '19') nombreEncontrado = 'Kali Rosario Berrospe';
            if (id === '18') nombreEncontrado = 'Kevin Manuel Rosario Berrospe';
            if (id === '17') nombreEncontrado = 'Javier Solares';
            if (id === '12') nombreEncontrado = 'José Manriquez';
            if (id === '08') nombreEncontrado = 'Niño de Prueba';

            if (tipo === 'nino') {
                setNombreNino(nombreEncontrado);
                setBuscandoNino(false);
            } else {
                setNombreTutor(nombreEncontrado);
                setBuscandoTutor(false);
            }
        }, 800);
    };


    // --- FUNCIONES BOTONES RESERVAS ---
    const confirmarReserva = (id) => setReservas(reservas.map(res => res.id === id ? { ...res, estatus: 'Confirmada' } : res));
    const eliminarReserva = (id) => { if(window.confirm(`¿Estás seguro de cancelar la reserva ${id}?`)) setReservas(reservas.filter(res => res.id !== id)); };
    const abrirModalEditar = (reserva) => { setReservaEditando({ ...reserva }); setModalEditar(true); };
    const guardarEdicion = (e) => { e.preventDefault(); setReservas(reservas.map(res => res.id === reservaEditando.id ? reservaEditando : res)); setModalEditar(false); };

    return (
        <div className="space-y-6 text-gray-200">
            {/* ENCABEZADO Y NAVEGACIÓN */}
            <div className="flex justify-between items-center mb-4">
                <div><h1 className="text-4xl font-extrabold text-white flex items-center gap-3">🛎️ Control de Recepción</h1><p className="text-gray-400 mt-2">Gestión de accesos, ludoteca y reservaciones</p></div>
                <div className="flex items-center bg-[#1a1d23] border border-gray-800 rounded-xl px-4 py-3 w-96 focus-within:border-yellow-400 transition-colors shadow-lg"><Search className="text-gray-500 mr-3" size={20} /><input type="text" placeholder="Escanear o teclear ID..." className="bg-transparent border-none outline-none text-white w-full"/></div>
            </div>
            <div className="flex space-x-2 bg-[#14171c] p-1 rounded-xl border border-gray-800 w-max shadow-lg">
                <button onClick={() => setTabActiva('reservas')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${tabActiva === 'reservas' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}><CalendarDays size={18} /> Reservaciones</button>
                <button onClick={() => setTabActiva('ludoteca')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${tabActiva === 'ludoteca' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}><Baby size={18} /> Ludoteca Live</button>
                <button onClick={() => setTabActiva('membresias')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${tabActiva === 'membresias' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}><CreditCard size={18} /> Estatus Socios</button>
            </div>

            {/* ZONA DINÁMICA */}
            <div className="bg-[#14171c] border border-gray-800 rounded-2xl p-8 min-h-[500px] shadow-xl relative">
                
                {tabActiva === 'reservas' && (
                    <div className="animate-in fade-in duration-300">
                        {/* TABLA DE RESERVAS IGUAL */}
                        <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-white">Reservaciones de Hoy</h2></div>
                        <div className="overflow-x-auto rounded-xl border border-gray-800 shadow-lg">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-[#1a1d23] text-xs uppercase text-gray-500 font-bold">
                                    <tr><th className="px-6 py-4">ID Reserva</th><th className="px-6 py-4">Socio</th><th className="px-6 py-4">Instalación</th><th className="px-6 py-4">Horario</th><th className="px-6 py-4">Estatus</th><th className="px-6 py-4 text-center">Acciones</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800 bg-[#0f1115]">
                                    {reservas.map((reserva) => (
                                        <tr key={reserva.id} className="hover:bg-[#1a1d23] transition-colors">
                                            <td className="px-6 py-4 font-bold text-white">{reserva.id}</td><td className="px-6 py-4">{reserva.socio}</td><td className="px-6 py-4 text-yellow-400">{reserva.espacio}</td>
                                            <td className="px-6 py-4"><div className="flex items-center gap-2"><Clock size={14} className="text-gray-500"/>{reserva.horario}</div></td>
                                            <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${reserva.estatus === 'Confirmada' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : reserva.estatus === 'Denegada' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>{reserva.estatus}</span></td>
                                            <td className="px-6 py-4 flex justify-center gap-4">
                                                {reserva.estatus === 'Pendiente' && (<button onClick={() => confirmarReserva(reserva.id)} className="text-green-400 hover:text-green-300 transition-colors" title="Confirmar Reserva"><CheckCircle2 size={18} /></button>)}
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

                {tabActiva === 'ludoteca' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">Niños en Ludoteca <span className="bg-yellow-400 text-black text-sm px-2 py-1 rounded-lg font-extrabold">{ninosLudoteca.length}</span></h2>
                            <button onClick={() => setModalLudoteca(true)} className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-yellow-400/20">+ Registrar Ingreso</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {ninosLudoteca.length === 0 ? (
                                <p className="text-gray-500 col-span-3 text-center py-10">No hay niños registrados en este momento.</p>
                            ) : (
                                ninosLudoteca.map((nino) => {
                                    const { formato, colorClass, lineaLateral } = calcularTiempoYColor(nino.tiempo_entrada);
                                    return (
                                        <div key={nino.id_socio} className="bg-[#1a1d23] border border-gray-800 rounded-xl p-5 relative overflow-hidden group hover:border-gray-600 transition-colors">
                                            <div className={`absolute top-0 left-0 w-1 h-full ${lineaLateral}`}></div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg text-white">#{nino.id_socio} - {nino.nombre_nino}</h3>
                                                    <p className="text-xs text-gray-400 mb-4">Tutor: {nino.tutor}</p>
                                                </div>
                                                <button onClick={() => darSalida(nino.id_socio)} className="text-gray-600 hover:text-red-400 transition-colors" title="Dar salida (Check-out)"><X size={20} /></button>
                                            </div>
                                            <div className={`flex items-center gap-2 font-mono font-bold text-2xl w-max px-3 py-1 rounded-lg border ${colorClass}`}><Clock size={20} /> {formato}</div>
                                            <div className="flex justify-between items-center mt-3">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Límite: 2 horas</p>
                                                {colorClass.includes("red") && <span className="text-[10px] text-red-400 font-bold bg-red-500/10 px-2 py-1 rounded">¡TIEMPO EXCEDIDO!</span>}
                                                {colorClass.includes("yellow") && <span className="text-[10px] text-yellow-400 font-bold bg-yellow-500/10 px-2 py-1 rounded">FALTAN &lt; 15 MIN</span>}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {tabActiva === 'membresias' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-white">Verificación de Accesos</h2></div>
                        <div className="border-2 border-dashed border-gray-800 p-10 rounded-2xl text-center text-gray-500"><AlertTriangle className="mx-auto mb-4 opacity-50" size={48} /><p>Aquí mostraremos las alertas si el socio escaneado debe pagos o su membresía venció (CM3-42).</p></div>
                    </div>
                )}
            </div>

            {/* MODAL DE REGISTRAR INGRESO CON BUSCADOR EN VIVO */}
            {modalLudoteca && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                   <div className="bg-[#1c1f26] border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Baby className="text-yellow-400"/> Registrar Ingreso</h2>
                            <button onClick={() => {setModalLudoteca(false); setNombreNino(''); setNombreTutor('');}} className="text-gray-400 hover:text-white transition-colors"><X size={24}/></button>
                        </div>
                        
                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-sm text-blue-400 mt-4 mb-4 flex gap-3">
                            <span>ℹ️</span>
                            <p>El sistema validará automáticamente que el menor tenga entre <strong>3 y 6 años</strong> de edad según el reglamento.</p>
                        </div>
                        
                        <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const datos = { id_nino: formData.get('id_nino'), id_tutor: formData.get('id_tutor') };
                                
                                try {
                                    // AQUÍ ESTÁ EL CAMBIO A LOCALHOST
                                    const res = await fetch('http://localhost:8000/api/ludoteca/ingreso', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                                        body: JSON.stringify(datos)
                                    });
                                    const data = await res.json();
                                    
                                    // Validamos que Laravel no nos mande error 404 disfrazado ni un error normal
                                    if (res.status !== 200 || data.status === 'error' || data.message?.includes('could not be found')) { 
                                        alert("❌ Error: " + (data.message || "Ruta no encontrada (Asegúrate de agregar la ruta en api.php)")); 
                                    } else { 
                                        alert("✅ " + data.message); 
                                        // AGREGAMOS AL NIÑO A LA PANTALLA CON SU NOMBRE
                                        const nuevoNino = {
                                            id_socio: datos.id_nino,
                                            nombre_nino: nombreNino || 'Niño Nuevo',
                                            tutor: `${nombreTutor || 'Tutor Nuevo'} (${datos.id_tutor})`,
                                            tiempo_entrada: new Date().toISOString()
                                        };
                                        setNinosLudoteca([...ninosLudoteca, nuevoNino]);
                                        setModalLudoteca(false);
                                        setNombreNino('');
                                        setNombreTutor('');
                                    }
                                } catch (error) { 
                                    alert("❌ Error crítico: ¿Está prendido el servidor de Laravel?"); 
                                }
                            }} className="space-y-5">
                            
                            {/* CAMPO ID NIÑO */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ID Niño (Socio Dependiente)</label>
                                <input 
                                    type="number" name="id_nino" required placeholder="Ej. 1024"
                                    onChange={(e) => simularBusqueda(e.target.value, 'nino')}
                                    className="w-full bg-[#0f1115] border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 outline-none" 
                                />
                                {/* Tarjeta dinámica que muestra el nombre encontrado */}
                                <div className="mt-2 h-8">
                                    {buscandoNino ? (
                                        <p className="text-sm text-yellow-500 flex items-center gap-2"><Loader2 size={14} className="animate-spin"/> Buscando en BD...</p>
                                    ) : nombreNino ? (
                                        <p className="text-sm text-green-400 font-bold flex items-center gap-2 bg-green-500/10 w-max px-2 py-1 rounded"><UserCheck size={14}/> {nombreNino}</p>
                                    ) : null}
                                </div>
                            </div>

                            {/* CAMPO ID TUTOR */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ID Tutor Responsable</label>
                                <input 
                                    type="number" name="id_tutor" required placeholder="Ej. 1023"
                                    onChange={(e) => simularBusqueda(e.target.value, 'tutor')}
                                    className="w-full bg-[#0f1115] border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-400 outline-none" 
                                />
                                <div className="mt-2 h-8">
                                    {buscandoTutor ? (
                                        <p className="text-sm text-yellow-500 flex items-center gap-2"><Loader2 size={14} className="animate-spin"/> Buscando en BD...</p>
                                    ) : nombreTutor ? (
                                        <p className="text-sm text-green-400 font-bold flex items-center gap-2 bg-green-500/10 w-max px-2 py-1 rounded"><UserCheck size={14}/> {nombreTutor}</p>
                                    ) : null}
                                </div>
                            </div>

                            <button type="submit" className="w-full font-bold text-lg py-4 rounded-xl mt-4 text-black bg-yellow-400 hover:bg-yellow-500 shadow-lg shadow-yellow-400/20 transition-all">Validar e Iniciar Estancia</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recepcion;