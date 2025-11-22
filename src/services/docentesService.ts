// services/docentesService.ts
import axios from "axios";

export const obtenerDocentes = async () => {
  const { data } = await axios.get("http://localhost:3000/api/docentes");
  return data; // Debe regresar un array de docentes
};
