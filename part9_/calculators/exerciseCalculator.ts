interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  hours: number[],
  target: number
): Result => {
  const average = hours.reduce((sum, hour) => sum + hour, 0) / hours.length;

  let rating = 1;
  let ratingDescription = 'bad';

  if (average >= target) {
    rating = 3;
    ratingDescription = 'good';
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  }

  return {
    periodLength: hours.length,
    trainingDays: hours.filter(hour => hour > 0).length,
    success: average >= target,
    rating,
    ratingDescription,
    target,
    average
  };
};

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
  } else {
    const target = Number(args[0]);
    const hours = args.slice(1).map(Number);

    if (
      hours.length === 0 ||
      !Number.isFinite(target) ||
      target <= 0 ||
      hours.some(hour => !Number.isFinite(hour) || hour < 0)
    ) {
      console.log('Invalid arguments');
    } else {
      console.log(calculateExercises(hours, target));
    }
  }
}
