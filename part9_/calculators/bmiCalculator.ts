export const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / ((height / 100) ** 2);

  if (bmi < 18.5) {
    return 'Underweight';
  }

  if (bmi < 25) {
    return 'Normal range';
  }

  if (bmi < 30) {
    return 'Overweight';
  }

  return 'Obese';
};

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(calculateBmi(180, 74));
  } else {
    const height = Number(args[0]);
    const weight = Number(args[1]);

    if (
      args.length !== 2 ||
      !Number.isFinite(height) ||
      !Number.isFinite(weight) ||
      height <= 0 ||
      weight <= 0
    ) {
      console.log('Invalid arguments');
    } else {
      console.log(calculateBmi(height, weight));
    }
  }
}
