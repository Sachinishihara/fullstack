import express from 'express';
import { z } from 'zod';
import patientService from '../services/patientService';
import { toNewPatient, toNewEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(patientService.getNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  const patient = patientService.findById(req.params.id);

  if (!patient) {
    res.status(404).json({ error: 'Patient not found' });
    return;
  }

  res.json(patient);
});

router.post('/', (req, res) => {
  try {
    const patient = toNewPatient(req.body);
    res.status(201).json(patientService.addPatient(patient));
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: error.issues.map(issue => issue.message).join(', ')
      });
    } else {
      res.status(400).json({ error: 'Incorrect data' });
    }
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const entry = toNewEntry(req.body);
    const addedEntry = patientService.addEntry(req.params.id, entry);

    if (!addedEntry) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    res.status(201).json(addedEntry);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: error.issues.map(issue =>
          `${issue.path.join('.')}: ${issue.message}`
        ).join(', ')
      });
    } else {
      res.status(400).json({ error: 'Incorrect entry' });
    }
  }
});

export default router;
