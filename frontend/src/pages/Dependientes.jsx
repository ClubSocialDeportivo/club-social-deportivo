import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Users,
  UserRound,
  RefreshCcw,
  Link2,
  Filter,
  X,
  Eye,
} from "lucide-react";

const API_DEPENDIENTES = "http://localhost:8000/api/dependientes";
const API_TITULARES = "http://localhost:8000/api/titulares";

const Dependientes = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [dependientes, setDependientes] = useState([]);
  const [titulares, setTitulares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingDependiente, setViewingDependiente] = useState(null);

  const titularFiltro = searchParams.get("titular");

  const fetchDependientes = async () => {
    try {
      const res = await fetch(API_DEPENDIENTES, {
        headers: { Accept: "application/json" },
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "No se pudieron cargar los dependientes");
      }

      setDependientes(result.data || []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar dependientes.");
    }
  };

  const fetchTitulares = async () => {
    try {
      const res = await fetch(API_TITULARES, {
        headers: { Accept: "application/json" },
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "No se pudieron cargar los titulares");
      }

      setTitulares(result.data || []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar titulares.");
    }
  };

  const cargarTodo = async () => {
    try {
      setLoading(true);
      setError("");
      await Promise.all([fetchDependientes(), fetchTitulares()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  useEffect(() => {
    const handleRefreshDependientes = () => cargarTodo();

    window.addEventListener("refresh-dependientes", handleRefreshDependientes);

    return () => {
      window.removeEventListener(
        "refresh-dependientes",
        handleRefreshDependientes
      );
    };
  }, []);

  const getNombreTitular = (idTitular) => {
    const titular = titulares.find((t) => t.id_socio === Number(idTitular));
    return titular ? `${titular.nombre} ${titular.apellidos}` : "No encontrado";
  };

  const getTitularActual = () => {
    if (!titularFiltro) return null;
    return titulares.find((t) => t.id_socio === Number(titularFiltro)) || null;
  };

  const dependientesFiltrados = useMemo(() => {
    if (!titularFiltro) return dependientes;

    return dependientes.filter(
      (dep) => Number(dep.id_titular_fk) === Number(titularFiltro)
    );
  }, [dependientes, titularFiltro]);

  const stats = useMemo(() => {
    const totalDependientes = dependientesFiltrados.length;

    const titularesUnicos = new Set(
      dependientesFiltrados
        .map((dep) => dep.id_titular_fk)
        .filter((id) => id !== null && id !== undefined)
    ).size;

    const vigentes = dependientesFiltrados.filter(
      (dep) => (dep.estatus_financiero || "").toLowerCase() === "vigente"
    ).length;

    const sinDocumento = dependientesFiltrados.filter(
      (dep) => !dep.numero_documento || dep.numero_documento.trim() === ""
    ).length;

    return {
      totalDependientes,
      titularesUnicos,
      vigentes,
      sinDocumento,
    };
  }, [dependientesFiltrados]);

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

  const limpiarFiltroTitular = () => {
    setSearchParams({});
  };

  const abrirVistaDetalle = (dependiente) => {
    setViewingDependiente(dependiente);
    setShowViewModal(true);
  };

  const cerrarVistaDetalle = () => {
    setViewingDependiente(null);
    setShowViewModal(false);
  };

  const titularActual = getTitularActual();

  return (
    <div className="space-y-6">
      {titularFiltro && titularActual && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-3">
          <div className="flex items-center gap-3 text-violet-300">
            <Filter size={18} />
            <div>
              <p className="text-sm font-semibold">Filtro activo por titular</p>
              <p className="text-sm text-violet-200">
                {titularActual.nombre} {titularActual.apellidos} (ID:{" "}
                {titularActual.id_socio})
              </p>
            </div>
          </div>

          <button
            onClick={limpiarFiltroTitular}
            className="inline-flex items-center gap-2 rounded-lg border border-violet-400/20 bg-[#14171c] px-3 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/10"
          >
            <X size={15} />
            Ver todos
          </button>
        </div>
      )}

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
                Total dependientes
              </p>
              <p className="mt-1 text-3xl font-bold text-white">
                {stats.totalDependientes}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-[#14171c] p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Link2 size={24} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Titulares únicos
              </p>
              <p className="mt-1 text-3xl font-bold text-white">
                {stats.titularesUnicos}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-[#14171c] p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <UserRound size={24} />
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Sin documento
              </p>
              <p className="mt-1 text-3xl font-bold text-white">
                {stats.sinDocumento}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-800 bg-[#14171c]">
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
          <div>
            <h2 className="text-3xl font-bold text-white">
              {titularActual
                ? `Dependientes de ${titularActual.nombre}`
                : "Directorio de dependientes"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Consulta general de dependientes vinculados a socios titulares.
            </p>
          </div>

          <button
            onClick={cargarTodo}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700 bg-[#1b2130] text-gray-300 transition hover:border-gray-600 hover:text-white"
            title="Recargar dependientes"
          >
            <RefreshCcw size={18} />
          </button>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-gray-400">
            Cargando dependientes...
          </div>
        ) : dependientesFiltrados.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-500">
            {titularActual
              ? "Este titular no tiene dependientes registrados."
              : "No hay dependientes registrados."}
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
                    Titular
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
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {dependientesFiltrados.map((dep) => (
                  <tr
                    key={dep.id_socio}
                    className="transition hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {dep.id_socio}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">
                      {dep.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {dep.apellidos}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {getNombreTitular(dep.id_titular_fk)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {dep.tipo_membresia || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {dep.modalidad || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                          dep.estatus_financiero
                        )}`}
                      >
                        {dep.estatus_financiero || "Sin estatus"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => abrirVistaDetalle(dep)}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20"
                      >
                        <Eye size={15} />
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showViewModal && viewingDependiente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gray-800 bg-[#14171c] p-8 shadow-2xl">
            <div className="mb-8 flex items-center justify-between border-b border-gray-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Ficha del dependiente
                </h2>
                <p className="text-sm text-gray-400">
                  ID: {viewingDependiente.id_socio}
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
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 italic">
                    Nombre completo
                  </p>
                  <p className="font-medium text-white">
                    {viewingDependiente.nombre} {viewingDependiente.apellidos}
                  </p>

                  <p className="mt-3 text-[10px] uppercase tracking-widest text-gray-500 italic">
                    Género
                  </p>
                  <p className="text-gray-300">
                    {viewingDependiente.genero || "N/A"}
                  </p>

                  <p className="mt-3 text-[10px] uppercase tracking-widest text-gray-500 italic">
                    Fecha de nacimiento
                  </p>
                  <p className="text-gray-300">
                    {viewingDependiente.fecha_nacimiento?.slice(0, 10) || "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-gray-800 bg-[#0f131a] p-5">
                <h3 className="flex items-center gap-2 font-semibold text-violet-400">
                  <Link2 size={18} /> Relación con titular
                </h3>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 italic">
                    Titular asociado
                  </p>
                  <p className="text-white">
                    {getNombreTitular(viewingDependiente.id_titular_fk)}
                  </p>

                  <p className="mt-3 text-[10px] uppercase tracking-widest text-gray-500 italic">
                    Documento
                  </p>
                  <p className="text-gray-300">
                    {viewingDependiente.numero_documento || "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-gray-800 bg-[#0f131a] p-5">
                <h3 className="flex items-center gap-2 font-semibold text-emerald-400">
                  <UserRound size={18} /> Estado
                </h3>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 italic">
                    Membresía
                  </p>
                  <p className="text-white">
                    {viewingDependiente.tipo_membresia || "N/A"}
                  </p>

                  <p className="mt-3 text-[10px] uppercase tracking-widest text-gray-500 italic">
                    Modalidad
                  </p>
                  <p className="text-gray-300">
                    {viewingDependiente.modalidad || "N/A"}
                  </p>

                  <p className="mt-3 text-[10px] uppercase tracking-widest text-gray-500 italic">
                    Estatus financiero
                  </p>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusBadge(
                      viewingDependiente.estatus_financiero
                    )}`}
                  >
                    {viewingDependiente.estatus_financiero || "Sin estatus"}
                  </span>
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

export default Dependientes;