// import { useEffect, useState } from "react";

// const Socios = () => {
//   const [socios, setSocios] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchSocios = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await fetch("http://localhost:8000/api/socios");

//       if (!res.ok) {
//         throw new Error("No se pudo obtener la lista de socios");
//       }

//       const result = await res.json();

//       setSocios(result.data || []);
//     } catch (err) {
//       console.error("Error al obtener socios:", err);
//       setError("Hubo un problema al cargar los socios.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSocios();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Socios</h1>

//       <div className="bg-white text-black rounded-lg p-4">
//         {loading && <p>Cargando socios...</p>}

//         {error && <p className="text-red-600">{error}</p>}

//         {!loading && !error && socios.length > 0 && (
//           <table className="w-full border border-gray-300">
//             <thead>
//               <tr className="bg-gray-200 text-left">
//                 <th className="p-2 border">ID</th>
//                 <th className="p-2 border">Nombre</th>
//                 <th className="p-2 border">Apellidos</th>
//                 <th className="p-2 border">Membresía</th>
//                 <th className="p-2 border">Modalidad</th>
//                 <th className="p-2 border">Estatus</th>
//                 <th className="p-2 border">Acciones</th>
//               </tr>
//             </thead>

//             <tbody>
//               {socios.map((socio) => (
//                 <tr key={socio.id_socio}>
//                   <td className="p-2 border">{socio.id_socio}</td>
//                   <td className="p-2 border">{socio.nombre}</td>
//                   <td className="p-2 border">{socio.apellidos}</td>
//                   <td className="p-2 border">{socio.tipo_membresia}</td>
//                   <td className="p-2 border">{socio.modalidad}</td>
//                   <td className="p-2 border">{socio.estatus_financiero}</td>
//                   <td className="p-2 border">
//                     <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
//                       Editar
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}

//         {!loading && !error && socios.length === 0 && (
//           <p className="text-gray-500">No hay socios registrados.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Socios;


import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api/socios";

const initialForm = {
  nombre: "",
  apellidos: "",
  fecha_nacimiento: "",
  genero: "",
  tipo_membresia: "",
  modalidad: "",
  estatus_financiero: "",
};

const Socios = () => {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const fetchSocios = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error("No se pudo obtener la lista de socios");
      }

      const result = await res.json();
      setSocios(result.data || []);
    } catch (err) {
      console.error("Error al obtener socios:", err);
      setError("Hubo un problema al cargar los socios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocios();
  }, []);

  const openEditModal = (socio) => {
    setEditingId(socio.id_socio);
    setFormData({
      nombre: socio.nombre || "",
      apellidos: socio.apellidos || "",
      fecha_nacimiento: socio.fecha_nacimiento
        ? socio.fecha_nacimiento.slice(0, 10)
        : "",
      genero: socio.genero || "",
      tipo_membresia: socio.tipo_membresia || "",
      modalidad: socio.modalidad || "",
      estatus_financiero: socio.estatus_financiero || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Respuesta de error:", result);
        throw new Error(result.message || "No se pudo actualizar el socio");
      }

      await fetchSocios();
      closeModal();
    } catch (err) {
      console.error("Error al actualizar socio:", err);
      setError("Hubo un problema al actualizar el socio.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-white">Socios</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white text-black rounded-lg p-4">
        {loading && <p>Cargando socios...</p>}

        {!loading && socios.length > 0 && (
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
                    <button
                      onClick={() => openEditModal(socio)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && socios.length === 0 && (
          <p className="text-gray-500">No hay socios registrados.</p>
        )}
      </div>

          {showModal && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
        <div className="bg-white text-black w-full max-w-2xl rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-black">Editar socio</h2>

          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
            <div>
              <label className="block font-semibold mb-1 text-black">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-black">Apellidos</label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-black">Fecha de nacimiento</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-black">Género</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-black">Tipo de membresía</label>
              <select
                name="tipo_membresia"
                value={formData.tipo_membresia}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="Accionista">Accionista</option>
                <option value="No Accionista">No Accionista</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-black">Modalidad</label>
              <select
                name="modalidad"
                value={formData.modalidad}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="Individual">Individual</option>
                <option value="Familiar">Familiar</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold mb-1 text-black">Estatus financiero</label>
              <select
                name="estatus_financiero"
                value={formData.estatus_financiero}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="Vigente">Vigente</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Vencido">Vencido</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
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