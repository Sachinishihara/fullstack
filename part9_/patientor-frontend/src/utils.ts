import axios from 'axios';

export const getError = (error: unknown): string => {
  if (axios.isAxiosError<{ error?: string }>(error)) {
    return error.response?.data?.error || error.message;
  }

  return 'Something went wrong';
};
