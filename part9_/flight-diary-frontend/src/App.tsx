import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import type { DiaryEntry, Weather, Visibility } from './types';
import { getAllDiaries, createDiary } from './services/diaries';

const weatherOptions: Weather[] = [
  'sunny', 'rainy', 'cloudy', 'stormy', 'windy'
];

const visibilityOptions: Visibility[] = [
  'great', 'good', 'ok', 'poor'
];

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [visibility, setVisibility] = useState<Visibility>('good');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAllDiaries()
      .then(setDiaries)
      .catch(() => setError('Could not fetch diaries'));
  }, []);

  const addDiary = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const diary = await createDiary({
        date,
        weather,
        visibility,
        comment
      });

      setDiaries(previous => previous.concat(diary));
      setDate('');
      setComment('');
    } catch (error: unknown) {
      if (axios.isAxiosError<unknown>(error)) {
        const data = error.response?.data;

        if (typeof data === 'string') {
          setError(data);
        } else if (data) {
          setError(JSON.stringify(data));
        } else {
          setError(error.message);
        }
      } else {
        setError('Could not add diary');
      }
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={addDiary}>
        <div>
          Date:
          <input
            type="date"
            value={date}
            onChange={event => setDate(event.target.value)}
            required
          />
        </div>

        <div>
          Visibility:
          {visibilityOptions.map(option => (
            <label key={option}>
              <input
                type="radio"
                name="visibility"
                checked={visibility === option}
                onChange={() => setVisibility(option)}
              />
              {option}
            </label>
          ))}
        </div>

        <div>
          Weather:
          {weatherOptions.map(option => (
            <label key={option}>
              <input
                type="radio"
                name="weather"
                checked={weather === option}
                onChange={() => setWeather(option)}
              />
              {option}
            </label>
          ))}
        </div>

        <div>
          Comment:
          <input
            value={comment}
            onChange={event => setComment(event.target.value)}
          />
        </div>

        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>

      {diaries.map(diary => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <div>Visibility: {diary.visibility}</div>
          <div>Weather: {diary.weather}</div>
          {diary.comment && <div>Comment: {diary.comment}</div>}
        </div>
      ))}
    </div>
  );
};

export default App;
