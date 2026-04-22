import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CircleCheckBig,
  CircleOff,
  RefreshCcw,
  BadgeCheck,
  UserRoundSearch,
  Eye,
} from "lucide-react";

const API_URL = "http://localhost:8000/api/socios";
const API_DEPENDIENTES = "http://localhost:8000/api/dependientes";

const Socios = () => {
  const navigate = useNavigate();

  const [socios, setSocios] = useState([]);
  const [dependientes, setDependientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterMembresia, setFilterMembresia] = useState("");
  const [filterModalidad, setFilterModalidad] = useState("");
  const [filterEstatus, setFilterEstatus] = useState("");

  const [activeMenu, setActiveMenu] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingSocio, setViewingSocio] = useState(null);

  const fetchSocios = async () => {
    const res = await fetch(API_URL, {
      headers: {
        Accept: "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "No se pudo obtener la lista de socios");
    }

    setSocios(result.data || []);
  };

  const fetchDependientes = async () => {
    const res = await fetch(API_DEPENDIENTES, {
      headers: {
        Accept: "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result.message || "No se pudo obtener la lista de dependientes"
      );
    }

    setDependientes(result.data || []);
  };

  const cargarTodo = async () => {
    try {
      setLoading(true);
      setError("");
      await Promise.all([fetchSocios(), fetchDependientes()]);
    } catch (err) {
      console.error("Error al cargar socios:", err);
      setError(err.message || "Error al cargar socios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  useEffect(() => {
    const handleRefreshSocios = () => cargarTodo();

    window.addEventListener("refresh-socios", handleRefreshSocios);

    return () => {
      window.removeEventListener("refresh-socios", handleRefreshSocios);
    };
  }, []);

  const sociosFiltrados = useMemo(() => {
    return socios.filter((s) => {
      const nombre = (s.nombre || "").toLowerCase();
      const apellidos = (s.apellidos || "").toLowerCase();
      const idSocio = String(s.id_socio || "");

      const matchesSearch =
        !searchTerm ||
        nombre.includes(searchTerm.toLowerCase()) ||
        apellidos.includes(searchTerm.toLowerCase()) ||
        idSocio.includes(searchTerm);

      const matchesMembresia =
        !filterMembresia || s.tipo_membresia === filterMembresia;
      const matchesModalidad =
        !filterModalidad || s.modalidad === filterModalidad;
      const matchesEstatus =
        !filterEstatus || s.estatus_financiero === filterEstatus;

      return (
        matchesSearch &&
        matchesMembresia &&
        matchesModalidad &&
        matchesEstatus
      );
    });
  }, [socios, searchTerm, filterMembresia, filterModalidad, filterEstatus]);

  const dependientesPorTitular = useMemo(() => {
    const mapa = {};

    dependientes.forEach((dep) => {
      const idTitular = dep.id_titular_fk;
      if (!idTitular) return;

      mapa[idTitular] = (mapa[idTitular] || 0) + 1;
    });

    return mapa;
  }, [dependientes]);

  const stats = useMemo(() => {
    const total = sociosFiltrados.length;
    const vigentes = sociosFiltrados.filter(
      (s) => (s.estatus_financiero || "").toLowerCase() === "vigente"
    ).length;

    const inactivos = sociosFiltrados.filter((s) =>
      ["inactivo", "suspendido", "adeudo"].includes(
        (s.estatus_financiero || "").toLowerCase()
      )
    ).length;

    const rentistas = sociosFiltrados.filter(
      (s) => (s.tipo_membresia || "").toLowerCase() === "rentista"
    ).length;

    return { total, vigentes, inactivos, rentistas };
  }, [sociosFiltrados]);

  const getStatusBadge = (status) => {
    const normalized = (status || "").toLowerCase();

    if (normalized === "vigente") {
      return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20";
    }

    if (normalized === "adeudo") {
      return "bg-amber-500/15 text-amber-400 border border-amber-500/20";
    }

    if (normalized === "suspendido" || normalized === "inactivo") {
      return "bg-red-500/15 text-red-400 border border-red-500/20";
    }

    return "bg-slate-500/15 text-slate-300 border border-slate-500/20";
  };

  const handleVerDependientes = (idTitular) => {
    navigate(`/dependientes?titular=${idTitular}`);
  };

  const abrirVistaDetalle = (socio) => {
    setViewingSocio(socio);
    setShowViewModal(true);
    setActiveMenu(null);
  };

  const cerrarVistaDetalle = () => {
    setShowViewModal(false);
    setViewingSocio(null);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-800 bg-[#14171c] p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Total socios
              </p>
              <p className="mt-1 text-3xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-[#14171c] p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <CircleCheckBig size={24} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Vigentes
              </p>
              <p className="mt-1 text-3xl font-bold text-white">
                {stats.vigentes}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-[#14171c] p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <CircleOff size={24} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Con incidencia
              </p>
              <p className="mt-1 text-3xl font-bold text-white">
                {stats.inactivos}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-[#14171c] p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
              <BadgeCheck size={24} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Rentistas
              </p>
              <p className="mt-1 text-3xl font-bold text-white">
                {stats.rentistas}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-800 bg-[#14171c]">
        <div className="border-b border-gray-800 px-6 py-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white">
                Directorio de socios
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Consulta general de socios registrada en el sistema externo.
              </p>
            </div>

            <button
              onClick={cargarTodo}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700 bg-[#1b2130] text-gray-300 transition hover:border-gray-600 hover:text-white"
              title="Recargar socios"
            >
              <RefreshCcw size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <UserRoundSearch size={18} />
              </div>
              <input
                type="text"
                placeholder="Nombre o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-[#0f131a] py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-yellow-400"
              />
            </div>

            <select
              value={filterMembresia}
              onChange={(e) => setFilterMembresia(e.target.value)}
              className="rounded-xl border border-gray-700 bg-[#0f131a] px-3 py-2 text-sm text-white outline-none focus:border-yellow-400"
            >
              <option value="">Todas las Membresías</option>
              <option value="Accionista">Accionista</option>
              <option value="Rentista">Rentista</option>
            </select>

            <select
              value={filterModalidad}
              onChange={(e) => setFilterModalidad(e.target.value)}
              className="rounded-xl border border-gray-700 bg-[#0f131a] px-3 py-2 text-sm text-white outline-none focus:border-yellow-400"
            >
              <option value="">Todas las Modalidades</option>
              <option value="Individual">Individual</option>
              <option value="Familiar">Familiar</option>
            </select>

            <select
              value={filterEstatus}
              onChange={(e) => setFilterEstatus(e.target.value)}
              className="rounded-xl border border-gray-700 bg-[#0f131a] px-3 py-2 text-sm text-white outline-none focus:border-yellow-400"
            >
              <option value="">Todos los Estatus</option>
              <option value="Vigente">Vigente</option>
              <option value="Adeudo">Adeudo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Suspendido">Suspendido</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-gray-400">
            Cargando socios...
          </div>
        ) : sociosFiltrados.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-500">
            No hay socios para mostrar con los filtros actuales.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#14171c]">
                <tr className="border-b border-gray-800 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    ID
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Apellidos
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Membresía
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Modalidad
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Estatus
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Dependientes
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {sociosFiltrados.map((socio) => {
                  const cantidadDependientes =
                    dependientesPorTitular[socio.id_socio] || 0;

                  return (
                    <tr
                      key={socio.id_socio}
                      className="transition hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {socio.id_socio}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        {socio.nombre}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-300">
                        {socio.apellidos}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-300">
                        {socio.tipo_membresia}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-300">
                        {socio.modalidad}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                            socio.estatus_financiero
                          )}`}
                        >
                          {socio.estatus_financiero}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-300">
                        {cantidadDependientes > 0 ? (
                          <button
                            onClick={() => handleVerDependientes(socio.id_socio)}
                            className="inline-flex items-center gap-2 rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20"
                          >
                            <UserRoundSearch size={15} />
                            Ver dependientes ({cantidadDependientes})
                          </button>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>

                      <td className="relative px-6 py-4">
                        <button
                          onClick={() =>
                            setActiveMenu(
                              activeMenu === socio.id_socio
                                ? null
                                : socio.id_socio
                            )
                          }
                          className="rounded-full p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
                        >
                          <svg
                            width="20"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                          </svg>
                        </button>

                        {activeMenu === socio.id_socio && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveMenu(null)}
                            />

                            <div className="absolute right-10 top-0 z-20 mt-2 w-56 origin-top-right rounded-xl border border-gray-700 bg-[#1b2130] shadow-xl outline-none">
                              <div className="py-2">
                                <button
                                  onClick={() => abrirVistaDetalle(socio)}
                                  className="flex w-full items-center px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/10"
                                >
                                  <Eye
                                    size={16}
                                    className="mr-3 text-blue-400"
                                  />
                                  Visualizar información
                                </button>

                                {cantidadDependientes > 0 && (
                                  <button
                                    onClick={() => {
                                      handleVerDependientes(socio.id_socio);
                                      setActiveMenu(null);
                                    }}
                                    className="flex w-full items-center px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/10"
                                  >
                                    <Users
                                      size={16}
                                      className="mr-3 text-violet-400"
                                    />
                                    Ver dependientes
                                  </button>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showViewModal && viewingSocio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gray-800 bg-[#14171c] p-8 shadow-2xl">
            <div className="mb-8 flex items-center justify-between border-b border-gray-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Ficha del socio
                </h2>
                <p className="text-sm text-gray-400">
                  ID: {viewingSocio.id_socio}
                </p>
              </div>

              <button
                onClick={cerrarVistaDetalle}
                className="text-3xl text-gray-400 transition hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-4 rounded-xl border border-gray-800 bg-[#0f131a] p-5">
                <h3 className="flex items-center gap-2 font-semibold text-blue-400">
                  <Users size={18} /> Datos personales
                </h3>

                <div className="space-y-2">
                  <p className="mt-3 text-[10px] uppercase tracking-widest text-gray-500 italic">
                    Nombre completo
                  </p>
                  <p className="font-medium text-white">
                    {viewingSocio.nombre} {viewingSocio.apellidos}
                  </p>

                  <p className="mt-3 text-[10px] uppercase tracking-widest text-gray-500 italic">
                    Género
                  </p>
                  <p className="text-gray-300">{viewingSocio.genero || "N/A"}</p>

                  <p className="mt-3 text-[10px] uppercase tracking-widest text-gray-500 italic">
                    Fecha de nacimiento
                  </p>
                  <p className="text-gray-300">
                    {viewingSocio.fecha_nacimiento?.slice(0, 10) || "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-gray-800 bg-[#0f131a] p-5">
                <h3 className="flex items-center gap-2 font-semibold text-yellow-400">
                  <BadgeCheck size={18} /> Membresía
                </h3>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 italic">
                    Tipo / Modalidad
                  </p>
                  <p className="text-white">
                    {viewingSocio.tipo_membresia || "N/A"} -{" "}
                    {viewingSocio.modalidad || "N/A"}
                  </p>

                  <p className="mt-3 text-[10px] uppercase tracking-widest text-gray-500 italic">
                    Estado financiero
                  </p>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusBadge(
                      viewingSocio.estatus_financiero
                    )}`}
                  >
                    {viewingSocio.estatus_financiero || "N/A"}
                  </span>

                  <p className="mt-3 text-[10px] uppercase tracking-widest text-gray-500 italic">
                    Vigencia
                  </p>
                  <p className="text-sm text-gray-300">
                    {viewingSocio.fecha_inicio_vigencia?.slice(0, 10) || "N/A"}{" "}
                    al{" "}
                    {viewingSocio.fecha_fin_vigencia?.slice(0, 10) || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col rounded-xl border border-gray-800 bg-[#0f131a] p-5">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-emerald-400">
                  <RefreshCcw size={18} /> Información complementaria
                </h3>

                <div className="flex flex-1 flex-col justify-center rounded-lg border border-dashed border-gray-700 p-4 text-center">
                  <p className="mb-2 text-xs font-medium italic text-gray-500">
                    Este módulo es de consulta.
                  </p>
                  <p className="text-sm text-gray-400">
                    Aquí puedes mostrar más adelante historial, asistencias o
                    datos traídos desde otro sistema sin editar al socio.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={cerrarVistaDetalle}
                className="rounded-lg bg-gray-800 px-8 py-2 font-semibold text-white transition hover:bg-gray-700"
              >
                Cerrar ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Socios;