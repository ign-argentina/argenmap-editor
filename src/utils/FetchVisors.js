import { getAllVisors } from '../api/configApi';

export const fetchVisores = async (setVisores) => {
  try {
    const data = await getAllVisors();
    setVisores(data);
  } catch (err) {
    console.error('Error al obtener visores:', err);
  }
};
