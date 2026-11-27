import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Container, Button, Alert } from '@mui/material';
import type { NonSensitivePatient, Diagnosis } from './types';
import patientService from './services/patients';
import diagnosisService from './services/diagnoses';
import PatientList from './components/PatientList';
import PatientPage from './components/PatientPage';
import { getError } from './utils';

const App = () => {
  const [patients, setPatients] = useState<NonSensitivePatient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    patientService.getAll()
      .then(setPatients)
      .catch(error => setError(getError(error)));

    diagnosisService.getAll()
      .then(setDiagnoses)
      .catch(error => setError(getError(error)));
  }, []);

  return (
    <BrowserRouter>
      <Container>
        <h1>Patientor</h1>

        <Button component={Link} to="/" variant="contained">
          Home
        </Button>

        {error && <Alert severity="error">{error}</Alert>}

        <Routes>
          <Route
            path="/"
            element={
              <PatientList
                patients={patients}
                onAdd={patient => setPatients(previous =>
                  previous.concat(patient)
                )}
              />
            }
          />

          <Route
            path="/patients/:id"
            element={<PatientPage diagnoses={diagnoses} />}
          />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;
