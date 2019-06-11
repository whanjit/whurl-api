
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { di } from './di';
import { mongodb } from './mongodb';
import { config } from './config';
import { routes } from './routers';



const start = async () => {
  try {

    let db = await mongodb.connect();
    di.set('db', db);

    const app = express();
    app.use(cors(config.cors));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: false
    }));

    // set all the server things
    app.set('env', config.env);
    app.set('port', config.server.port);
    app.set('hostname', config.server.hostname);

    app.get('/api/health', (req, res) => {
      res.json({ message: 'api application is ready' });
    });

    // Set up routes
    routes.init(app);
    
    app.use(([body, status, src, func], req, res, next) => {
      res.status(status).json(body);
      next();
    });

    app.listen(config.server.port);

    const hostname = app.get('hostname');
    const port = app.get('port');
    console.log('Express server listening on - http://:' + hostname + ':' + port);
  } catch (ex) {
    console.error(ex.message);
  }
};

start();