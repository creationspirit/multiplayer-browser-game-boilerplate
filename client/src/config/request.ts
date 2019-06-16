import axios from 'axios';

import { GAME_API_BASE_URL } from './index';

export const gameAPI = axios.create({
  baseURL: GAME_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
