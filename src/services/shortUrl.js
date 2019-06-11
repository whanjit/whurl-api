import shortid from 'shortid';
import validUrl from 'valid-url';

import { di } from '../di'
import { helper } from '../utils/helper'
import { errorHandler } from '../utils/errorHandler'

const location = 'services.ShortUrl';

export class ShortUrl {
  async get({ urlCode }) {
    let db = di.get('db');
    let shortUrlDoc = await db.collection('shorturl').findOne({ urlCode });
    if(await helper.isNull(shortUrlDoc)){
      await errorHandler.error({ 
        errCode: "SHORT_URL_NOT_FOUND", 
        message: 'Short url not found',
        location: location,
        func: 'get',
        code: 500
      });
    }
    await db.collection('shorturl').updateOne({ urlCode }, { $inc: { numberOfAccessTime : 1 } });
    return shortUrlDoc;
  }

  async getAllUrl(){
    let db = di.get('db');
    
    return new Promise(function(resolve, reject) {
      db.collection("shorturl").find().toArray( function(err, docs) {
       if (err) {
         return reject(err)
       }
       return resolve(docs)
     })
   });
  }

  async create({ originalUrl, customAlias, userId }) {
    if (validUrl.isUri(originalUrl)) {
      let urlCode = customAlias; 
      if (customAlias === '')
        urlCode = shortid.generate();

      let db = di.get('db');

      let shortUrlDoc = await db.collection('shorturl').findOne({ urlCode });
      if (await helper.notNull(shortUrlDoc)) {
        await errorHandler.error({ 
          errCode: "CUSTOM_ALIAS_ALREADY_EXIST", 
          message: 'custom alias already exist',
          location: location,
          func: 'create',
          code: 401
        });
      }

      let newShortUrlDoc = {
        originalUrl,
        urlCode,
        numberOfAccessTime:0,
        userId
      };

      let res = await db.collection('shorturl').insertOne(newShortUrlDoc);
      if(res.insertedCount !== 1)
        await errorHandler.error({ 
          errCode: "CREATE_SHORT_URL_ERROR", 
          message: 'something went wrong, Please try again',
          location: location,
          func: 'create',
          code: 401
        });

      newShortUrlDoc._id = res.insertedId;
      return newShortUrlDoc;
    } else {
      await errorHandler.error({ 
        errCode: "INVALID_ORIGINAL_URL", 
        message: 'Invalid Original Url',
        location: location,
        func: 'create',
        code: 401
      });
    }
  }
}

export const shortUrl = new ShortUrl();
export default shortUrl;