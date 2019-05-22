import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';

import logger from './utils/logger';

import * as apiController from './controllers/api';

// Create Express server
const app = express();

app.set('port', process.env.PORT || 4000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('combined'));

app.get('/api', apiController.getApi);

export default app;
