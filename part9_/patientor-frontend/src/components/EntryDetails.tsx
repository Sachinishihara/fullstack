import { Card, CardContent } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import type { Entry, Diagnosis } from '../types';

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const assertNever = (value: never): never => {
  throw new Error(`Unknown entry: ${JSON.stringify(value)}`);
};

const EntryDetails = ({ entry, diagnoses }: Props) => {
  const details = () => {
    switch (entry.type) {
      case 'HealthCheck':
        return (
          <div>
            <MedicalServicesIcon />
            <p>Health rating: {entry.healthCheckRating}</p>
          </div>
        );

      case 'Hospital':
        return (
          <div>
            <LocalHospitalIcon />
            <p>Discharge: {entry.discharge.date}</p>
            <p>Criteria: {entry.discharge.criteria}</p>
          </div>
        );

      case 'OccupationalHealthcare':
        return (
          <div>
            <WorkIcon />
            <p>Employer: {entry.employerName}</p>
            {entry.sickLeave && (
              <p>
                Sick leave: {entry.sickLeave.startDate}
                {' - '}{entry.sickLeave.endDate}
              </p>
            )}
          </div>
        );

      default:
        return assertNever(entry);
    }
  };

  return (
    <Card variant="outlined" sx={{ marginBottom: 2 }}>
      <CardContent>
        <strong>{entry.date} - {entry.type}</strong>
        <p><i>{entry.description}</i></p>

        {details()}

        <ul>
          {entry.diagnosisCodes?.map(code => (
            <li key={code}>
              {code} {diagnoses.find(d => d.code === code)?.name}
            </li>
          ))}
        </ul>

        <p>Diagnosed by {entry.specialist}</p>
      </CardContent>
    </Card>
  );
};

export default EntryDetails;
