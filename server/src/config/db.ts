import { createConnection, Connection } from 'typeorm';
createConnection()
  .then((connection: Connection) => {
    console.log('Connection to database server established');
  })
  .catch((error: any) => {
    console.log('Database server cennection error', error);
  });
