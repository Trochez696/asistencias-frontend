import React, { useState, useEffect } from "react";
import { generarReporte, FiltrosReporte } from "../../services/reportesService";

const ReportesForm: React.FC = () => {
  const [filtros, setFiltros] = useState<FiltrosReporte>({
    tipoReporte: "",
    fechaInicio: "",
    fechaFin: "",
    docenteId: "",
    cursoId: "",
  });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // 🔥 Estado seguro para docentes
  const [docentes, setDocentes] = useState<any[]>([]);

  // 🔥 Cargar docentes (con protección total)
  useEffect(() => {
    const cargarDocentes = async () => {
      try {
        const resp = await fetch("http://localhost:3000/docentes");
        const data = await resp.json();

        // Asegurar que siempre sea un array
        if (Array.isArray(data)) {
          setDocentes(data);
        } else if (Array.isArray(data.docentes)) {
          setDocentes(data.docentes);
        } else {
          console.error("Formato inesperado en la API:", data);
          setDocentes([]);
        }
      } catch (error) {
        console.error("Error cargando docentes:", error);
        setDocentes([]); // evita caída del componente
      }
    };

    cargarDocentes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    try {
      await generarReporte(filtros);
      setMensaje("Reporte generado y descargado correctamente.");
    } catch (error) {
      console.error("Error generando reporte:", error);
      setMensaje("Error al generar el reporte. Verifique los datos.");
    } finally {
      setCargando(false);
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      tipoReporte: "",
      fechaInicio: "",
      fechaFin: "",
      docenteId: "",
      cursoId: "",
    });
    setMensaje("");
  };

  return (
    <div className="reportes-container">
      <div className="reportes-panel">
        <h2 className="panel-title">Generar Reportes de Asistencia</h2>

        {mensaje && (
          <div
            className={`alert ${
              mensaje.includes("correctamente") ? "alert-success" : "alert-error"
            }`}
          >
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          {/* Tipo de reporte */}
          <div className="form-field full">
            <label htmlFor="tipoReporte">Tipo de Reporte *</label>
            <select
              id="tipoReporte"
              name="tipoReporte"
              value={filtros.tipoReporte}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un tipo...</option>
              <option value="asistencias">🗓️ Reporte de Asistencias</option>
              <option value="horas-docentes">👩‍🏫 Horas por Docente</option>
              <option value="horas-cursos">🏫 Horas por Curso</option>
              <option value="incidencias">⚠️ Incidencias</option>
              <option value="general">📊 Reporte General</option>
            </select>
          </div>

          {/* Fechas */}
          <div className="form-field">
            <label htmlFor="fechaInicio">Fecha Inicio</label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={filtros.fechaInicio}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="fechaFin">Fecha Fin</label>
            <input
              type="date"
              id="fechaFin"
              name="fechaFin"
              value={filtros.fechaFin}
              onChange={handleChange}
            />
          </div>

          {/* Identificadores */}
          <div className="form-field">
            <label htmlFor="docenteId">ID Docente (opcional)</label>

            {/* 🔥 Select seguro */}
            <select
              id="docenteId"
              name="docenteId"
              value={filtros.docenteId}
              onChange={handleChange}
            >
              <option value="">Todos los docentes</option>

              {docentes.length > 0 &&
                docentes.map((doc: any) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.nombre} {doc.apellido}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="cursoId">ID Curso (opcional)</label>
            <input
              type="text"
              id="cursoId"
              name="cursoId"
              placeholder="Ej: 507f1f77bcf86cd799439012"
              value={filtros.cursoId}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions full">
            <button type="button" onClick={limpiarFiltros} className="btn secondary">
              Limpiar
            </button>
            <button
              type="submit"
              disabled={cargando || !filtros.tipoReporte}
              className="btn primary"
            >
              {cargando ? "Generando..." : "Descargar Excel"}
            </button>
          </div>
        </form>

        <div className="info-box">
          <h4>Tipos de Reporte</h4>
          <ul>
            <li><strong>Asistencias:</strong> Detalle de asistencias</li>
            <li><strong>Horas por Docente:</strong> Horas dictadas por docente</li>
            <li><strong>Horas por Curso:</strong> Horas impartidas por curso</li>
            <li><strong>Incidencias:</strong> Faltas y observaciones</li>
            <li><strong>General:</strong> Reporte completo (3 hojas)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportesForm;
