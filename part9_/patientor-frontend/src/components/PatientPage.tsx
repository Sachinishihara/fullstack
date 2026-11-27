import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button } from '@mui/material';
import type { Patient, Diagnosis, NewEntry } from '../types';
import patientService from '../services/patients';
import EntryDetails from './EntryDetails';
import EntryForm from './EntryForm';
import { getError } from '../utils';

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (id) {
      patientService.getById(id)
        .then(setPatient)
        .catch(error => setError(getError(error)));
    }
  }, [id]);

  const addEntry = async (entry: NewEntry) => {
    if (!patient) return;

    const addedEntry = await patientService.addEntry(patient.id, entry);

    setPatient(previous => previous
      ? { ...previous, entries: previous.entries.concat(addedEntry) }
      : previous
    );

    setShowForm(false);
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!patient) return <p>Loading...</p>;

  return (
    <div>
      <h2>{patient.name}</h2>
      <p>Gender: {patient.gender}</p>
      <p>Date of birth: {patient.dateOfBirth}</p>
      <p>SSN: {patient.ssn}</p>
      <p>Occupation: {patient.occupation}</p>

      <Button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add new entry'}
      </Button>

      {showForm && (
        <EntryForm diagnoses={diagnoses} onSubmit={addEntry} />
      )}

      <h3>Entries</h3>

      {patient.entries.map(entry => (
        <EntryDetails
          key={entry.id}
          entry={entry}
          diagnoses={diagnoses}
        />
      ))}
    </div>
  );
};

export default PatientPage;
