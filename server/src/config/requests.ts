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
      expiresIn: 10,
    }
  );
  return `Bearer ${token}`;
};
