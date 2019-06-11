import express from 'express';

const { validationResult } = require('express-validator/check');
import { helper } from '../utils/helper';
import { auth } from '../services/auth';
import {validation} from '../middlewares/validation'

export const router = express.Router();

router.post('/login', validation.validateLoginBody(), getLogin)
router.post('/', validation.validateRegistrationBody(), register)

const location = 'controllers.auth';


export async function getLogin(req, res, next) {
  const errors = validationResult(req);
  
  if(!errors.isEmpty()){
    //return res.status(422).json({ errors: errors.array() });
    let message = errors.array()[0].msg
    
    await helper.exception({message, next, location, func})
  }

  let func = 'getLogin'
  try {
    let { email, password } = req.body
    let data = await auth.getLogin({ email, password })
    helper.response({data, next, location, func})
  } catch (ex) {
    helper.exception({message: ex.message, next, location, func})
  }
}

export async function register(req, res, next) {
  const errors = validationResult(req);
  
  if(!errors.isEmpty()){
    //return res.status(422).json({ errors: errors.array() });
    let message = errors.array()[0].msg
    
    await helper.exception({message, next, location, func})
  }

  let func = 'createUser'
  try {
    let { email, password, name } = req.body
    let data = await auth.register({ name, email, password })
    helper.response({data, next, location, func})
  } catch (ex) {
    helper.exception({message: ex.message, next, location, func})
  }
}