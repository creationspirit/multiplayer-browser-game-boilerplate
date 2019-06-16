// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Establish database connection
import './config/db';

import { Server } from 'colyseus';
import { createServer } from 'http';
import { monitor } from '@colyseus/monitor';
import errorHandler from 'errorhandler';

import app from './app';
import { GameRoom } from './rooms/GameRoom';

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */

const gameServer = new Server({
  server: createServer(app),
});

gameServer.register('game', GameRoom);
// Register colyseus monitor AFTER registering your room handlers
app.use('/colyseus', monitor(gameServer));

const server = gameServer.listen(app.get('port'), undefined, undefined, () => {
  console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
  console.log('Game server is running at ws://localhost:%d', app.get('port'));
  console.log('Press CTRL-C to stop\n');
});

export default server;
