import axios from 'axios';
import type { Diagnosis } from '../types';

const getAll = async () => {
  const response = await axios.get<Diagnosis[]>(
    'http://localhost:3001/api/diagnoses'
  );
  return response.data;
};

export default { getAll };
