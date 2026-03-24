import { useEffect, useState } from "react";

const API_DEPENDIENTES = "http://localhost:8000/api/dependientes";
const API_TITULARES = "http://localhost:8000/api/titulares";
const API_SOCIOS = "http://localhost:8000/api/socios";

const initialForm = {
  nombre: "",
  apellidos: "",
  fecha_nacimiento: "",
  genero: "",
  numero_documento: "",
  id_titular_fk: "",
};

const Dependientes = () => {
  const [dependientes, setDependientes] = useState([]);
  const [titulares, setTitulares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [createFormData, setCreateFormData] = useState(initialForm);
  const [editFormData, setEditFormData] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);
  const [savingCreate, setSavingCreate] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

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

  const getNombreTitular = (idTitular) => {
    const titular = titulares.find((t) => t.id_socio === idTitular);
    return titular ? `${titular.nombre} ${titular.apellidos}` : "No encontrado";
  };

  const openCreateModal = () => {
    setCreateFormData(initialForm);
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateFormData(initialForm);
  };

  const openEditModal = (dependiente) => {
    setEditingId(dependiente.id_socio);
    setEditFormData({
      nombre: dependiente.nombre || "",
      apellidos: dependiente.apellidos || "",
      fecha_nacimiento: dependiente.fecha_nacimiento
        ? dependiente.fecha_nacimiento.slice(0, 10)
        : "",
      genero: dependiente.genero || "",
      numero_documento: dependiente.numero_documento || "",
      id_titular_fk: dependiente.id_titular_fk || "",
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingId(null);
    setEditFormData(initialForm);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateDependiente = async (e) => {
    e.preventDefault();

    try {
      setSavingCreate(true);
      setError("");

      const payload = {
        nombre: createFormData.nombre,
        apellidos: createFormData.apellidos,
        fecha_nacimiento: createFormData.fecha_nacimiento,
        genero: createFormData.genero,
        numero_documento: createFormData.numero_documento || null,
        id_usuario: null,
        es_titular: false,
        id_titular_fk: Number(createFormData.id_titular_fk),
      };

      const res = await fetch(API_SOCIOS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(result);
        throw new Error(result.message || "No se pudo registrar el dependiente");
      }

      await fetchDependientes();
      closeCreateModal();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al registrar dependiente.");
    } finally {
      setSavingCreate(false);
    }
  };

  const handleUpdateDependiente = async (e) => {
    e.preventDefault();

    try {
      setSavingEdit(true);
      setError("");

      const payload = {
        nombre: editFormData.nombre,
        apellidos: editFormData.apellidos,
        fecha_nacimiento: editFormData.fecha_nacimiento,
        genero: editFormData.genero,
        numero_documento: editFormData.numero_documento || null,
        es_titular: false,
        id_titular_fk: Number(editFormData.id_titular_fk),
      };

      const res = await fetch(`${API_SOCIOS}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(result);
        throw new Error(result.message || "No se pudo actualizar el dependiente");
      }

      await fetchDependientes();
      closeEditModal();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al actualizar dependiente.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleEliminarDependiente = async (id, nombre) => {
    const confirmado = window.confirm(
      `¿Seguro que deseas eliminar al dependiente "${nombre}"?`
    );

    if (!confirmado) return;

    try {
      setError("");

      const res = await fetch(`${API_SOCIOS}/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(result);
        throw new Error(result.message || "No se pudo eliminar el dependiente");
      }

      await fetchDependientes();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al eliminar dependiente.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Dependientes</h1>

        <button
          onClick={openCreateModal}
          className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300"
        >
          Añadir dependiente
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white text-black rounded-lg p-4">
        {loading ? (
          <p>Cargando dependientes...</p>
        ) : dependientes.length === 0 ? (
          <p className="text-gray-500">No hay dependientes registrados.</p>
        ) : (
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Apellidos</th>
                <th className="p-2 border">Titular</th>
                <th className="p-2 border">Membresía</th>
                <th className="p-2 border">Modalidad</th>
                <th className="p-2 border">Estatus</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {dependientes.map((dep) => (
                <tr key={dep.id_socio}>
                  <td className="p-2 border">{dep.id_socio}</td>
                  <td className="p-2 border">{dep.nombre}</td>
                  <td className="p-2 border">{dep.apellidos}</td>
                  <td className="p-2 border">{getNombreTitular(dep.id_titular_fk)}</td>
                  <td className="p-2 border">{dep.tipo_membresia}</td>
                  <td className="p-2 border">{dep.modalidad}</td>
                  <td className="p-2 border">{dep.estatus_financiero}</td>
                  <td className="p-2 border">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => openEditModal(dep)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() =>
                          handleEliminarDependiente(dep.id_socio, dep.nombre)
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white text-black w-full max-w-3xl rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Registrar dependiente</h2>

            <form
              onSubmit={handleCreateDependiente}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="md:col-span-2">
                <label className="block font-semibold mb-1">Titular</label>
                <select
                  name="id_titular_fk"
                  value={createFormData.id_titular_fk}
                  onChange={handleCreateChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                  required
                >
                  <option value="">Selecciona un titular</option>
                  {titulares.map((titular) => (
                    <option key={titular.id_socio} value={titular.id_socio}>
                      {titular.nombre} {titular.apellidos} (ID: {titular.id_socio})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={createFormData.nombre}
                  onChange={handleCreateChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Apellidos</label>
                <input
                  type="text"
                  name="apellidos"
                  value={createFormData.apellidos}
                  onChange={handleCreateChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Fecha de nacimiento</label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={createFormData.fecha_nacimiento}
                  onChange={handleCreateChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Género</label>
                <select
                  name="genero"
                  value={createFormData.genero}
                  onChange={handleCreateChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                  <option value="No especifica">No especifica</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-1">Número de documento</label>
                <input
                  type="text"
                  name="numero_documento"
                  value={createFormData.numero_documento}
                  onChange={handleCreateChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={savingCreate}
                  className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 disabled:opacity-60"
                >
                  {savingCreate ? "Guardando..." : "Registrar dependiente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white text-black w-full max-w-3xl rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Editar dependiente</h2>

            <form
              onSubmit={handleUpdateDependiente}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="md:col-span-2">
                <label className="block font-semibold mb-1">Titular</label>
                <select
                  name="id_titular_fk"
                  value={editFormData.id_titular_fk}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                  required
                >
                  <option value="">Selecciona un titular</option>
                  {titulares.map((titular) => (
                    <option key={titular.id_socio} value={titular.id_socio}>
                      {titular.nombre} {titular.apellidos} (ID: {titular.id_socio})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={editFormData.nombre}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Apellidos</label>
                <input
                  type="text"
                  name="apellidos"
                  value={editFormData.apellidos}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Fecha de nacimiento</label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={editFormData.fecha_nacimiento}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Género</label>
                <select
                  name="genero"
                  value={editFormData.genero}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                  <option value="No especifica">No especifica</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-1">Número de documento</label>
                <input
                  type="text"
                  name="numero_documento"
                  value={editFormData.numero_documento}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={savingEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                >
                  {savingEdit ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dependientes;