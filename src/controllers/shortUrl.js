import express from 'express';
import * as jwt from 'jsonwebtoken'
import { config } from '../config'
import { helper } from '../utils/helper';
import { shortUrl } from '../services/shortUrl';
import { authGaurd } from '../middlewares/authgaurd';

export const router = express.Router();

router.get('/:shurl', redirectTo);
router.get('/', authGaurd.authClientToken, getAllUrls);
router.post('/', createShortUrl);

const location = 'controllers.urlShorten';


export async function getAllUrls (req, res, next) {
  let func = 'getAllUrls';
  try {
    let shurlUrls = await shortUrl.getAllUrl();
    helper.response({data: shurlUrls, next, location, func});
  } catch (ex) {
    helper.exception({message: ex.message, next, location, func});
  }
}

export async function redirectTo(req, res, next) {
  let func = 'redirectTo';
  try {
    let { shurl } = req.params;

    let shurlData = await shortUrl.get({ urlCode: shurl });

    //helper.response({shurlData, next, location, func});
    res.redirect(shurlData.originalUrl);
  } catch (ex) {
    helper.exception({message: ex.message, next, location, func});
  }
}


export async function createShortUrl(req, res, next) {
  let func = 'createShortUrl';
  try {
    const { originalUrl, customAlias='' } = req.body;
    
    let userId = ''

    let token = req.headers['x-access-token'] || '';
    
    if(token !== '') {
      let decoded = jwt.verify(token, config.server.secret);
      userId = decoded.id
    }
    
    let data = await shortUrl.create({ originalUrl, customAlias, userId });
    
    helper.response({data, next, location, func});
  } catch (ex) {
    helper.exception({message: ex.message, next, location, func});
  }
}
