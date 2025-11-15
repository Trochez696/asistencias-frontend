import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface FiltrosReporte {
  tipoReporte: string;
  fechaInicio?: string;
  fechaFin?: string;
  docenteId?: string;
  cursoId?: string;
}

export const generarReporte = async (filtros: FiltrosReporte): Promise<void> => {
  const { tipoReporte, fechaInicio, fechaFin, docenteId, cursoId } = filtros;

  const params = new URLSearchParams();
  if (fechaInicio) params.append('fechaInicio', fechaInicio);
  if (fechaFin) params.append('fechaFin', fechaFin);
  if (docenteId) params.append('docenteId', docenteId);
  if (cursoId) params.append('cursoId', cursoId);

  const url = `${API_BASE_URL}/reportes/${tipoReporte}?${params.toString()}`;

  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    const nombresArchivos: { [key: string]: string } = {
      'asistencias': 'reporte_asistencias.xlsx',
      'horas-docentes': 'reporte_horas_docentes.xlsx',
      'horas-cursos': 'reporte_horas_cursos.xlsx',
      'incidencias': 'reporte_incidencias.xlsx',
      'general': 'reporte_general.xlsx'
    };

    link.download = nombresArchivos[tipoReporte] || 'reporte.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

  } catch (error) {
    console.error('Error descargando reporte:', error);
    throw new Error('No se pudo generar el reporte. Verifique la conexión.');
  }
};