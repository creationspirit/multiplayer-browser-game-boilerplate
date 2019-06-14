import path from 'path';

import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';

import userController from './controllers/user';

// Create Express server
const app = express();

app.set('port', process.env.PORT || 4000);
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('combined'));

app.use('/users', userController);

export default app;
