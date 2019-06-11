import { MongoClient } from 'mongodb';
import { config } from './config';

class MongoDB {
  async connect() {
    const uri = config.mongodb.uri;
    const dbname = config.mongodb.dbname;
    
    let promise = new Promise((resolve, reject) => {
      MongoClient.connect(uri, { useNewUrlParser: true }, (err, connection) => {
        if (err) reject(err);
        resolve(connection.db(dbname));
      });
    });

    return promise;
  }
}

export const mongodb = new MongoDB();