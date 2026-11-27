import { z } from 'zod';
import { Gender, HealthCheckRating, NewPatient, NewEntry } from './types';

const isGender = (value: unknown): value is Gender => {
  return (
    value === Gender.Male ||
    value === Gender.Female ||
    value === Gender.Other
  );
};

export const NewPatientSchema = z.object({
  name: z.string().min(1),
  dateOfBirth: z.string().date(),
  ssn: z.string().min(1),
  gender: z.custom<Gender>(isGender, 'Incorrect gender'),
  occupation: z.string().min(1)
});

const baseEntry = z.object({
  description: z.string().min(1),
  date: z.string().date(),
  specialist: z.string().min(1),
  diagnosisCodes: z.array(z.string()).optional()
});

const healthCheck = baseEntry.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.nativeEnum(HealthCheckRating)
});

const hospital = baseEntry.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.string().date(),
    criteria: z.string().min(1)
  })
});

const occupational = baseEntry.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string().min(1),
  sickLeave: z.object({
    startDate: z.string().date(),
    endDate: z.string().date()
  }).optional()
});

export const NewEntrySchema = z.discriminatedUnion('type', [
  healthCheck,
  hospital,
  occupational
]);

export const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

export const toNewEntry = (object: unknown): NewEntry => {
  return NewEntrySchema.parse(object);
};
