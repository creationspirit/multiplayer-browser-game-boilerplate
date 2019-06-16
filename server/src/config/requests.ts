import axios from 'axios';
import jwt from 'jsonwebtoken';

export const questionAPI = axios.create({
  baseURL: process.env.EDGAR_GAME_API_BASE_URL,
});

export const generateJWT = () => {
  const token = jwt.sign(
    { aud: process.env.PROVIDER, iss: process.env.CONSUMER },
    process.env.TASK_API_SECRET as jwt.Secret,
    {
      // Every token will expire in 10 sec
      expiresIn: 10,
    }
  );
  return `Bearer ${token}`;
};

export const fetchUser = async (token: string) => {
  const response = await questionAPI.get('/student/gameserverpassword', {
    headers: {
      'Game-Server-PWD': token,
      Authorization: generateJWT(),
    },
  });
  return response.data.student;
};

export const fetchExercises = async () => {
  const response = await questionAPI.get('/exercise', {
    headers: {
      Authorization: generateJWT(),
    },
  });
  return response.data.exercises;
};
