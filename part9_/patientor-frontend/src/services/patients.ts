import axios from 'axios';
import type {
  Patient,
  NewPatient,
  NonSensitivePatient,
  NewEntry,
  Entry
} from '../types';

const baseUrl = 'http://localhost:3001/api/patients';

const getAll = async () => {
  const response = await axios.get<NonSensitivePatient[]>(baseUrl);
  return response.data;
};

const getById = async (id: string) => {
  const response = await axios.get<Patient>(`${baseUrl}/${id}`);
  return response.data;
};

const create = async (patient: NewPatient) => {
  const response = await axios.post<Patient>(baseUrl, patient);
  return response.data;
};

const addEntry = async (id: string, entry: NewEntry) => {
  const response = await axios.post<Entry>(
    `${baseUrl}/${id}/entries`, entry
  );
  return response.data;
};

export default { getAll, getById, create, addEntry };
