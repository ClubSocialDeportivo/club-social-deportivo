import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api/socios";

const initialEditForm = {
  nombre: "",
  apellidos: "",
  fecha_nacimiento: "",
  genero: "",
  tipo_membresia: "",
  modalidad: "",
  estatus_financiero: "",
  numero_documento: "",
  fecha_inicio_vigencia: "",
  fecha_fin_vigencia: "",
};

const initialCreateForm = {
  nombre: "",
  apellidos: "",
  fecha_nacimiento: "",
  genero: "",
  tipo_membresia: "",
  modalidad: "",
  estatus_financiero: "",
  numero_documento: "",
  fecha_inicio_vigencia: "",
  fecha_fin_vigencia: "",
};

const Socios = () => {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(initialEditForm);
  const [savingEdit, setSavingEdit] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState(initialCreateForm);
  const [savingCreate, setSavingCreate] = useState(false);

  const fetchSocios = async () => {
    try {
      setLoading(true);
      setError("");

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
    } catch (err) {
      console.error("Error al cargar socios:", err);
      setError("Error al cargar socios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocios();
  }, []);

  const openCreateModal = () => {
    setCreateFormData(initialCreateForm);
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateFormData(initialCreateForm);
  };

  const openEditModal = (socio) => {
    setEditingId(socio.id_socio);
    setEditFormData({
      nombre: socio.nombre || "",
      apellidos: socio.apellidos || "",
      fecha_nacimiento: socio.fecha_nacimiento
        ? socio.fecha_nacimiento.slice(0, 10)
        : "",
      genero: socio.genero || "",
      tipo_membresia: socio.tipo_membresia || "",
      modalidad: socio.modalidad || "",
      estatus_financiero: socio.estatus_financiero || "",
      numero_documento: socio.numero_documento || "",
      fecha_inicio_vigencia: socio.fecha_inicio_vigencia
        ? socio.fecha_inicio_vigencia.slice(0, 10)
        : "",
      fecha_fin_vigencia: socio.fecha_fin_vigencia
        ? socio.fecha_fin_vigencia.slice(0, 10)
        : "",
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingId(null);
    setEditFormData(initialEditForm);
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

  const handleCreateSocio = async (e) => {
    e.preventDefault();

    try {
      setSavingCreate(true);
      setError("");

      const payload = {
        ...createFormData,
        id_usuario: null,
        numero_documento: createFormData.numero_documento || null,
        fecha_inicio_vigencia: createFormData.fecha_inicio_vigencia || null,
        fecha_fin_vigencia: createFormData.fecha_fin_vigencia || null,
        es_titular: true,
        id_titular_fk: null,
        activo: createFormData.estatus_financiero === "Vigente",
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Error al registrar socio:", result);
        throw new Error(result.message || "No se pudo registrar el socio");
      }

      await fetchSocios();
      closeCreateModal();
    } catch (err) {
      console.error("Error al registrar socio:", err);
      setError(err.message || "Error al registrar socio.");
    } finally {
      setSavingCreate(false);
    }
  };

  const handleUpdateSocio = async (e) => {
    e.preventDefault();

    try {
      setSavingEdit(true);
      setError("");

      const payload = {
        ...editFormData,
        numero_documento: editFormData.numero_documento || null,
        fecha_inicio_vigencia: editFormData.fecha_inicio_vigencia || null,
        fecha_fin_vigencia: editFormData.fecha_fin_vigencia || null,
      };

      const res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Error al actualizar socio:", result);
        throw new Error(result.message || "No se pudo actualizar el socio");
      }

      await fetchSocios();
      closeEditModal();
    } catch (err) {
      console.error("Error al actualizar socio:", err);
      setError(err.message || "Error al actualizar socio.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleActivarMembresia = async (id) => {
    try {
      setError("");

      const res = await fetch(`${API_URL}/${id}/activar`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Error al activar membresía:", result);
        throw new Error(result.message || "No se pudo activar la membresía");
      }

      await fetchSocios();
    } catch (err) {
      console.error("Error al activar membresía:", err);
      setError("Error al activar membresía.");
    }
  };

  const handleEliminarSocio = async (id, nombre) => {
    const confirmado = window.confirm(
      `¿Seguro que deseas eliminar al socio "${nombre}"?`
    );

    if (!confirmado) return;

    try {
      setError("");

      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Error al eliminar socio:", result);
        throw new Error(result.message || "No se pudo eliminar el socio");
      }

      await fetchSocios();
    } catch (err) {
      console.error("Error al eliminar socio:", err);
      setError("Error al eliminar socio.");
    }
  };

  const showCreateVigencia =
    createFormData.tipo_membresia === "Rentista";

  const showEditVigencia =
    editFormData.tipo_membresia === "Rentista";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Socios</h1>

        <button
          onClick={openCreateModal}
          className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300"
        >
          Añadir Socio
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white text-black rounded-lg p-4">
        {loading ? (
          <p>Cargando socios...</p>
        ) : socios.length === 0 ? (
          <p className="text-gray-500">No hay socios registrados.</p>
        ) : (
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Apellidos</th>
                <th className="p-2 border">Membresía</th>
                <th className="p-2 border">Modalidad</th>
                <th className="p-2 border">Estatus</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {socios.map((socio) => (
                <tr key={socio.id_socio}>
                  <td className="p-2 border">{socio.id_socio}</td>
                  <td className="p-2 border">{socio.nombre}</td>
                  <td className="p-2 border">{socio.apellidos}</td>
                  <td className="p-2 border">{socio.tipo_membresia}</td>
                  <td className="p-2 border">{socio.modalidad}</td>
                  <td className="p-2 border">{socio.estatus_financiero}</td>
                  <td className="p-2 border">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => openEditModal(socio)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Editar
                      </button>

                      {socio.estatus_financiero !== "Vigente" && (
                        <button
                          onClick={() => handleActivarMembresia(socio.id_socio)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Activar
                        </button>
                      )}

                      <button
                        onClick={() =>
                          handleEliminarSocio(socio.id_socio, socio.nombre)
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
          <div className="bg-white text-black w-full max-w-2xl rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Registrar socio</h2>

            <form
              onSubmit={handleCreateSocio}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
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
                <label className="block font-semibold mb-1">
                  Fecha de nacimiento
                </label>
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

              <div>
                <label className="block font-semibold mb-1">
                  Tipo de membresía
                </label>
                <select
                  name="tipo_membresia"
                  value={createFormData.tipo_membresia}
                  onChange={handleCreateChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Accionista">Accionista</option>
                  <option value="Rentista">Rentista</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Modalidad</label>
                <select
                  name="modalidad"
                  value={createFormData.modalidad}
                  onChange={handleCreateChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Individual">Individual</option>
                  <option value="Familiar">Familiar</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Estatus financiero
                </label>
                <select
                  name="estatus_financiero"
                  value={createFormData.estatus_financiero}
                  onChange={handleCreateChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Vigente">Vigente</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Adeudo">Adeudo</option>
                  <option value="Suspendido">Suspendido</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Número de documento
                </label>
                <input
                  type="text"
                  name="numero_documento"
                  value={createFormData.numero_documento}
                  onChange={handleCreateChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                />
              </div>

              {showCreateVigencia && (
                <>
                  <div>
                    <label className="block font-semibold mb-1">
                      Fecha inicio vigencia
                    </label>
                    <input
                      type="date"
                      name="fecha_inicio_vigencia"
                      value={createFormData.fecha_inicio_vigencia}
                      onChange={handleCreateChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Fecha fin vigencia
                    </label>
                    <input
                      type="date"
                      name="fecha_fin_vigencia"
                      value={createFormData.fecha_fin_vigencia}
                      onChange={handleCreateChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                    />
                  </div>
                </>
              )}

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
                  {savingCreate ? "Guardando..." : "Registrar socio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white text-black w-full max-w-2xl rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Editar socio</h2>

            <form
              onSubmit={handleUpdateSocio}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
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
                <label className="block font-semibold mb-1">
                  Fecha de nacimiento
                </label>
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

              <div>
                <label className="block font-semibold mb-1">
                  Tipo de membresía
                </label>
                <select
                  name="tipo_membresia"
                  value={editFormData.tipo_membresia}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Accionista">Accionista</option>
                  <option value="Rentista">Rentista</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Modalidad</label>
                <select
                  name="modalidad"
                  value={editFormData.modalidad}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Individual">Individual</option>
                  <option value="Familiar">Familiar</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Estatus financiero
                </label>
                <select
                  name="estatus_financiero"
                  value={editFormData.estatus_financiero}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Vigente">Vigente</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Adeudo">Adeudo</option>
                  <option value="Suspendido">Suspendido</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Número de documento
                </label>
                <input
                  type="text"
                  name="numero_documento"
                  value={editFormData.numero_documento}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                />
              </div>

              {showEditVigencia && (
                <>
                  <div>
                    <label className="block font-semibold mb-1">
                      Fecha inicio vigencia
                    </label>
                    <input
                      type="date"
                      name="fecha_inicio_vigencia"
                      value={editFormData.fecha_inicio_vigencia}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Fecha fin vigencia
                    </label>
                    <input
                      type="date"
                      name="fecha_fin_vigencia"
                      value={editFormData.fecha_fin_vigencia}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                    />
                  </div>
                </>
              )}

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

export default Socios;