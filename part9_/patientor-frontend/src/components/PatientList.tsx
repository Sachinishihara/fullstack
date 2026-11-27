import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem,
  Alert
} from '@mui/material';
import { Gender } from '../types';
import type { NonSensitivePatient, NewPatient } from '../types';
import patientService from '../services/patients';
import { getError } from '../utils';

interface Props {
  patients: NonSensitivePatient[];
  onAdd: (patient: NonSensitivePatient) => void;
}

const PatientList = ({ patients, onAdd }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<NewPatient>({
    name: '',
    ssn: '',
    dateOfBirth: '',
    occupation: '',
    gender: Gender.Other
  });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const patient = await patientService.create(form);
      onAdd(patient);
      setShowForm(false);
      setError('');
      setForm({
        name: '',
        ssn: '',
        dateOfBirth: '',
        occupation: '',
        gender: Gender.Other
      });
    } catch (error: unknown) {
      setError(getError(error));
    }
  };

  return (
    <div>
      <h2>Patient list</h2>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Occupation</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {patients.map(patient => (
            <TableRow key={patient.id}>
              <TableCell>
                <Link to={`/patients/${patient.id}`}>
                  {patient.name}
                </Link>
              </TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.occupation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add new patient'}
      </Button>

      {error && <Alert severity="error">{error}</Alert>}

      {showForm && (
        <form onSubmit={submit}>
          {(['name', 'ssn', 'occupation'] as const).map(field => (
            <TextField
              key={field}
              required
              fullWidth
              margin="normal"
              label={field}
              value={form[field]}
              onChange={event => setForm({
                ...form,
                [field]: event.target.value
              })}
            />
          ))}

          <p>Date of birth</p>

          <TextField
            required
            fullWidth
            type="date"
            value={form.dateOfBirth}
            onChange={event => setForm({
              ...form,
              dateOfBirth: event.target.value
            })}
          />

          <TextField
            select
            fullWidth
            margin="normal"
            label="Gender"
            value={form.gender}
            onChange={event => {
              const gender = Object.values(Gender).find(
                value => value === event.target.value
              );

              if (gender) setForm({ ...form, gender });
            }}
          >
            {Object.values(Gender).map(gender => (
              <MenuItem key={gender} value={gender}>
                {gender}
              </MenuItem>
            ))}
          </TextField>

          <Button type="submit" variant="contained">
            Add patient
          </Button>
        </form>
      )}
    </div>
  );
};

export default PatientList;
