// validation.js file   (server/middlewares/validation.js)

//const { body } = require('express-validator/check')
import { body } from 'express-validator/check';

const validateRegistrationBody = () => {
    return [ 
        body('name')
        .exists()
        .withMessage('name field is required')
        .isLength({min:3})
        .withMessage('name must be greater than 3 letters'),
        body('email').exists()
        .withMessage('email field is required')
        .isEmail()
        .withMessage('Email is invalid'),
        body('password')
        .exists()
        .withMessage('password field is required')
        .isLength({min : 4,max: 8})
        .withMessage('password must be in between 4 to 8 characters long')
       ] 
} 

const validateLoginBody = () => {
    return [ 
        body('email').exists()
        .withMessage('email field is required')
        .isEmail()
        .withMessage('Email is invalid'),
        body('password')
        .exists()
        .withMessage('password field is required')
        .isLength({min : 4,max: 8})
        .withMessage('password must be in between 4 to 8 characters long')
       ] 
} 

export const validation = {
    validateRegistrationBody : validateRegistrationBody,
    validateLoginBody : validateLoginBody
}