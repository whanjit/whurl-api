import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { di } from '../di'
import { helper } from '../utils/helper'
import { errorHandler } from '../utils/errorHandler'
import { config } from '../config'

const location = 'services.Auth';

export class Auth {
  async register({name, email, password}) {

    let db = di.get('db')
    let userDoc = await db.collection('user').findOne({ email })
    
    if (await helper.notNull(userDoc)) {
      await errorHandler.error({ 
        errCode: "EMAIL_ALREADY_REGISTERED", 
        message: 'email already registered',
        location: location,
        func: 'register',
        code: 401
      });
    }

    let hashedPassword = await bcrypt.hash(password, 8);

    userDoc = {
      name,
      email,
      password: hashedPassword,
    }

    let res = await db.collection('user').insertOne(userDoc)
    if(res.insertedCount !== 1) {
      await errorHandler.error({ 
        errCode: "REGISTER_EMAIL_ERROR", 
        message: 'Register email error',
        location: location,
        func: 'register',
        code: 401
      });
    }
    
    userDoc._id = res.insertedId
    userDoc.password = undefined
    return userDoc
  }

  async getLogin({ email, password }) {
    
    let db = di.get('db')
    let doc = await db.collection('user').findOne({ email })
    if(await helper.isNull(doc)){
      await errorHandler.error({ 
        errCode: "EMAIL_PASSWORD_IS_WRONG", 
        message: 'email/password is wrong',
        location: location,
        func: 'getLogin',
        code: 401
      });
    }
    
    if((await bcrypt.compare(password, doc.password)===false)){
      await errorHandler.error({ 
        errCode: "EMAIL_PASSWORD_IS_WRONG", 
        message: 'email/password is wrong',
        location: location,
        func: 'getLogin',
        code: 401
      });
    }
    
    let token = jwt.sign({ id: doc._id }, config.server.secret, { expiresIn: 86400 });

    doc.token = token;
    doc.password = undefined
    return doc
  }
}


export const auth = new Auth();
export default auth;