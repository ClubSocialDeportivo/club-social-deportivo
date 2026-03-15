import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/socios";

function App() {
  const [socios, setSocios] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    fecha_nacimiento: "",
    sexo: "",
    telefono: "",
    correo: "",
    direccion: "",
    tipo_membresia: "",
    fecha_inscripcion: "",
    estado: "activo",
  });

  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const obtenerSocios = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();
      setSocios(data.data || []);
    } catch (error) {
      console.error("Error al obtener socios:", error);
      setMensaje("Error al obtener socios");
    }
  };

  useEffect(() => {
    obtenerSocios();
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const limpiarFormulario = () => {
    setFormulario({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      fecha_nacimiento: "",
      sexo: "",
      telefono: "",
      correo: "",
      direccion: "",
      tipo_membresia: "",
      fecha_inscripcion: "",
      estado: "activo",
    });
    setEditandoId(null);
  };

  const guardarSocio = async (e) => {
    e.preventDefault();

    const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;
    const metodo = editandoId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formulario),
      });

      const data = await response.json();

      if (!response.ok) {
      console.error(data);

        if (data.errors) {
          const errores = Object.values(data.errors).flat();
          setMensaje(errores.join(", "));
        } else if (data.message) {
          setMensaje(data.message);
        } else {
          setMensaje("Ocurrió un error al guardar el socio");
        }

        return;
      }

      setMensaje(editandoId ? "Socio actualizado correctamente" : "Socio registrado correctamente");
      limpiarFormulario();
      obtenerSocios();
    } catch (error) {
      console.error("Error al guardar socio:", error);
      setMensaje("Error de conexión con el servidor");
    }
  };

  const cargarSocioParaEditar = (socio) => {
    setFormulario({
      nombre: socio.nombre || "",
      apellido_paterno: socio.apellido_paterno || "",
      apellido_materno: socio.apellido_materno || "",
      fecha_nacimiento: socio.fecha_nacimiento || "",
      sexo: socio.sexo || "",
      telefono: socio.telefono || "",
      correo: socio.correo || "",
      direccion: socio.direccion || "",
      tipo_membresia: socio.tipo_membresia || "",
      fecha_inscripcion: socio.fecha_inscripcion || "",
      estado: socio.estado || "activo",
    });

    setEditandoId(socio.id);
    setMensaje(`Editando socio ID ${socio.id}`);
  };

  const eliminarSocio = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este socio?");
    if (!confirmar) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        setMensaje("No se pudo eliminar el socio");
        return;
      }

      setMensaje("Socio eliminado correctamente");
      if (editandoId === id) {
        limpiarFormulario();
      }
      obtenerSocios();
    } catch (error) {
      console.error("Error al eliminar socio:", error);
      setMensaje("Error al eliminar socio");
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Módulo de Socios</h1>
      <p>Registro, edición, listado y eliminación de socios.</p>

      {mensaje && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f5f5f5",
          }}
        >
          {mensaje}
        </div>
      )}

      <form onSubmit={guardarSocio} style={{ display: "grid", gap: "10px", marginBottom: "30px" }}>
        <input name="nombre" placeholder="Nombre" value={formulario.nombre} onChange={manejarCambio} required />
        <input
          name="apellido_paterno"
          placeholder="Apellido paterno"
          value={formulario.apellido_paterno}
          onChange={manejarCambio}
          required
        />
        <input
          name="apellido_materno"
          placeholder="Apellido materno"
          value={formulario.apellido_materno}
          onChange={manejarCambio}
        />
        <input
          name="fecha_nacimiento"
          type="date"
          value={formulario.fecha_nacimiento}
          onChange={manejarCambio}
        />
        <input name="sexo" placeholder="Sexo" value={formulario.sexo} onChange={manejarCambio} />
        <input name="telefono" placeholder="Teléfono" value={formulario.telefono} onChange={manejarCambio} required />
        <input name="correo" type="email" placeholder="Correo" value={formulario.correo} onChange={manejarCambio} required />
        <input name="direccion" placeholder="Dirección" value={formulario.direccion} onChange={manejarCambio} />
        <input
          name="tipo_membresia"
          placeholder="Tipo de membresía"
          value={formulario.tipo_membresia}
          onChange={manejarCambio}
          required
        />
        <input
          name="fecha_inscripcion"
          type="date"
          value={formulario.fecha_inscripcion}
          onChange={manejarCambio}
          required
        />
        <select name="estado" value={formulario.estado} onChange={manejarCambio} required>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit">{editandoId ? "Actualizar socio" : "Registrar socio"}</button>
          <button type="button" onClick={limpiarFormulario}>
            Limpiar
          </button>
        </div>
      </form>

      <h2>Lista de socios</h2>

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Membresía</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {socios.length > 0 ? (
            socios.map((socio) => (
              <tr key={socio.id}>
                <td>{socio.id}</td>
                <td>{`${socio.nombre} ${socio.apellido_paterno} ${socio.apellido_materno ?? ""}`}</td>
                <td>{socio.telefono}</td>
                <td>{socio.correo}</td>
                <td>{socio.tipo_membresia}</td>
                <td>{socio.estado}</td>
                <td>
                  <button onClick={() => cargarSocioParaEditar(socio)} style={{ marginRight: "8px" }}>
                    Editar
                  </button>
                  <button onClick={() => eliminarSocio(socio.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay socios registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;