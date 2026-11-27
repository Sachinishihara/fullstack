import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  Alert,
  Box
} from '@mui/material';
import type { NewEntry, Diagnosis } from '../types';
import { getError } from '../utils';

interface Props {
  diagnoses: Diagnosis[];
  onSubmit: (entry: NewEntry) => Promise<void>;
}

const EntryForm = ({ diagnoses, onSubmit }: Props) => {
  const [type, setType] = useState<NewEntry['type']>('HealthCheck');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [codes, setCodes] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [employer, setEmployer] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [criteria, setCriteria] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const base = {
      description,
      date,
      specialist,
      diagnosisCodes: codes
    };

    let entry: NewEntry;

    switch (type) {
      case 'HealthCheck':
        entry = {
          ...base,
          type,
          healthCheckRating: rating
        };
        break;

      case 'Hospital':
        entry = {
          ...base,
          type,
          discharge: {
            date: dischargeDate,
            criteria
          }
        };
        break;

      case 'OccupationalHealthcare':
        if ((startDate && !endDate) || (!startDate && endDate)) {
          setError('Enter both sick leave dates');
          return;
        }

        entry = {
          ...base,
          type,
          employerName: employer,
          ...(startDate && endDate
            ? { sickLeave: { startDate, endDate } }
            : {})
        };
        break;
    }

    try {
      await onSubmit(entry);
      setDescription('');
      setDate('');
      setSpecialist('');
      setCodes([]);
      setRating(0);
      setEmployer('');
      setDischargeDate('');
      setCriteria('');
      setStartDate('');
      setEndDate('');
    } catch (error: unknown) {
      setError(getError(error));
    }
  };

  return (
    <Box sx={{ border: '1px solid gray', padding: 2, marginBottom: 2 }}>
      <h3>New entry</h3>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={submit}>
        <TextField
          select
          fullWidth
          margin="normal"
          label="Entry type"
          value={type}
          onChange={event => {
            const value = event.target.value;

            if (
              value === 'HealthCheck' ||
              value === 'Hospital' ||
              value === 'OccupationalHealthcare'
            ) {
              setType(value);
            }
          }}
        >
          <MenuItem value="HealthCheck">Health check</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">
            Occupational healthcare
          </MenuItem>
        </TextField>

        <TextField
          required
          fullWidth
          margin="normal"
          label="Description"
          value={description}
          onChange={event => setDescription(event.target.value)}
        />

        <p>Date</p>
        <TextField
          required
          fullWidth
          type="date"
          value={date}
          onChange={event => setDate(event.target.value)}
        />

        <TextField
          required
          fullWidth
          margin="normal"
          label="Specialist"
          value={specialist}
          onChange={event => setSpecialist(event.target.value)}
        />

        <p>Diagnosis codes</p>

        <Select
          multiple
          fullWidth
          value={codes}
          onChange={event => {
            const value = event.target.value;
            setCodes(typeof value === 'string' ? value.split(',') : value);
          }}
        >
          {diagnoses.map(diagnosis => (
            <MenuItem key={diagnosis.code} value={diagnosis.code}>
              {diagnosis.code} - {diagnosis.name}
            </MenuItem>
          ))}
        </Select>

        {type === 'HealthCheck' && (
          <TextField
            select
            fullWidth
            margin="normal"
            label="Health rating"
            value={rating}
            onChange={event => setRating(Number(event.target.value))}
          >
            <MenuItem value={0}>0 - Healthy</MenuItem>
            <MenuItem value={1}>1 - Low risk</MenuItem>
            <MenuItem value={2}>2 - High risk</MenuItem>
            <MenuItem value={3}>3 - Critical risk</MenuItem>
          </TextField>
        )}

        {type === 'Hospital' && (
          <div>
            <p>Discharge date</p>
            <TextField
              required
              fullWidth
              type="date"
              value={dischargeDate}
              onChange={event => setDischargeDate(event.target.value)}
            />

            <TextField
              required
              fullWidth
              margin="normal"
              label="Discharge criteria"
              value={criteria}
              onChange={event => setCriteria(event.target.value)}
            />
          </div>
        )}

        {type === 'OccupationalHealthcare' && (
          <div>
            <TextField
              required
              fullWidth
              margin="normal"
              label="Employer"
              value={employer}
              onChange={event => setEmployer(event.target.value)}
            />

            <p>Sick leave start</p>
            <TextField
              fullWidth
              type="date"
              value={startDate}
              onChange={event => setStartDate(event.target.value)}
            />

            <p>Sick leave end</p>
            <TextField
              fullWidth
              type="date"
              value={endDate}
              onChange={event => setEndDate(event.target.value)}
            />
          </div>
        )}

        <Button
          type="submit"
          variant="contained"
          sx={{ marginTop: 2 }}
        >
          Add entry
        </Button>
      </form>
    </Box>
  );
};

export default EntryForm;
