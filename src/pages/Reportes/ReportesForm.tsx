import React, { useState } from "react";
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
      setMensaje("✅ Reporte generado y descargado correctamente");
    } catch (error) {
      console.error("Error generando reporte:", error);
      setMensaje("❌ Error al generar el reporte. Verifique los datos.");
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
    <div className="reportes-wrapper">
      <div className="reportes-card">
        <h2 className="titulo">📊 Generar Reportes de Asistencia</h2>

        {mensaje && (
          <div
            className={`mensaje ${
              mensaje.includes("✅") ? "mensaje-exito" : "mensaje-error"
            }`}
          >
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="formulario">
          {/* Tipo de reporte */}
          <div className="form-group full">
            <label htmlFor="tipoReporte">Tipo de Reporte *</label>
            <select
              id="tipoReporte"
              name="tipoReporte"
              value={filtros.tipoReporte}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar tipo de reporte...</option>
              <option value="asistencias">📋 Reporte de Asistencias</option>
              <option value="horas-docentes">⏱️ Horas por Docente</option>
              <option value="horas-cursos">📚 Horas por Curso</option>
              <option value="incidencias">⚠️ Reporte de Incidencias</option>
              <option value="general">🧾 Reporte General</option>
            </select>
          </div>

          {/* Fechas */}
          <div className="form-group">
            <label htmlFor="fechaInicio">Fecha Inicio</label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={filtros.fechaInicio}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
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
          <div className="form-group">
            <label htmlFor="docenteId">ID Docente (opcional)</label>
            <input
              type="text"
              id="docenteId"
              name="docenteId"
              placeholder="Ej: 507f1f77bcf86cd799439011"
              value={filtros.docenteId}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
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

          {/* Botones */}
          <div className="form-buttons">
            <button type="button" onClick={limpiarFiltros} className="btn secondary">
              🗑️ Limpiar
            </button>
            <button
              type="submit"
              disabled={cargando || !filtros.tipoReporte}
              className="btn primary"
            >
              {cargando ? "⏳ Generando..." : "📥 Descargar Excel"}
            </button>
          </div>
        </form>

        <div className="help-info">
          <h4>💡 Tipos de Reporte:</h4>
          <ul>
            <li><strong>Asistencias:</strong> Listado detallado de todas las asistencias</li>
            <li><strong>Horas por Docente:</strong> Total de horas dictadas por cada docente</li>
            <li><strong>Horas por Curso:</strong> Total de horas impartidas por curso</li>
            <li><strong>Incidencias:</strong> Faltas, retardos y observaciones</li>
            <li><strong>General:</strong> Reporte completo con 3 hojas Excel</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportesForm;
