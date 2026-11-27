import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();

app.use(express.json());

const isNumeric = (value: unknown): boolean => {
  return (
    (typeof value === 'number' ||
      (typeof value === 'string' && value.trim() !== '')) &&
    Number.isFinite(Number(value))
  );
};

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (
    !isNumeric(req.query.height) ||
    !isNumeric(req.query.weight) ||
    height <= 0 ||
    weight <= 0
  ) {
    return res.status(400).json({
      error: 'malformatted parameters'
    });
  }

  return res.json({
    weight,
    height,
    bmi: calculateBmi(height, weight)
  });
});

app.post('/exercises', (req, res) => {
  const body: unknown = req.body;

  if (
    typeof body !== 'object' ||
    body === null ||
    !('daily_exercises' in body) ||
    !('target' in body)
  ) {
    return res.status(400).json({
      error: 'parameters missing'
    });
  }

  const dailyExercises = body.daily_exercises;
  const target = body.target;

  if (
    !Array.isArray(dailyExercises) ||
    dailyExercises.length === 0 ||
    !isNumeric(target) ||
    Number(target) <= 0 ||
    dailyExercises.some(
      (hour: unknown) => !isNumeric(hour) || Number(hour) < 0
    )
  ) {
    return res.status(400).json({
      error: 'malformatted parameters'
    });
  }

  const hours = dailyExercises.map(Number);

  return res.json(calculateExercises(hours, Number(target)));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
