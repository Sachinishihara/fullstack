import { randomUUID } from 'node:crypto';
import patientData from '../data/patients';
import {
  Patient,
  NewPatient,
  NonSensitivePatient,
  Entry,
  NewEntry
} from '../types';
import { toNewPatient, toNewEntry } from '../utils';

const patients: Patient[] = patientData.map(patient => ({
  ...toNewPatient(patient),
  id: patient.id,
  entries: patient.entries.map((entry: Entry) => ({
    ...toNewEntry(entry),
    id: entry.id
  }))
}));

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(patient => ({
    id: patient.id,
    name: patient.name,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender,
    occupation: patient.occupation
  }));
};

const findById = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient: Patient = {
    id: randomUUID(),
    ...patient,
    entries: []
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: NewEntry): Entry | undefined => {
  const patient = findById(id);

  if (!patient) {
    return undefined;
  }

  const newEntry: Entry = {
    ...entry,
    id: randomUUID()
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getNonSensitivePatients,
  findById,
  addPatient,
  addEntry
};

