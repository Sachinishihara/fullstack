import type { CoursePart } from '../types';

interface PartProps {
  part: CoursePart;
}

const assertNever = (value: never): never => {
  throw new Error(`Unexpected part: ${JSON.stringify(value)}`);
};

const Part = ({ part }: PartProps) => {
  const heading = (
    <strong>{part.name} {part.exerciseCount}</strong>
  );

  switch (part.kind) {
    case 'basic':
      return (
        <p>
          {heading}<br />
          <i>{part.description}</i>
        </p>
      );

    case 'group':
      return (
        <p>
          {heading}<br />
          Group projects: {part.groupProjectCount}
        </p>
      );

    case 'background':
      return (
        <p>
          {heading}<br />
          <i>{part.description}</i><br />
          Background material: {part.backgroundMaterial}
        </p>
      );

    case 'special':
      return (
        <p>
          {heading}<br />
          <i>{part.description}</i><br />
          Required skills: {part.requirements.join(', ')}
        </p>
      );

    default:
      return assertNever(part);
  }
};

export default Part;
