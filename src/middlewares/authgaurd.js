import * as jwt from 'jsonwebtoken';
import { config } from '../config';


const authClientToken = async (req,res,next) => {
  let token = req.headers['x-access-token'];
  //console.log(token);
  if (!token){
    return res.status(401).json({
        "errors" : [{
        "msg" : " No token provided"
      }]
    });
  } 
  
  jwt.verify(token, config.server.secret, (err, decoded) => {
    if(err) {
      return res.status(401).json({
        "errors" : [{
              "msg" : "Invalid Token"
            }]
      });
    }
      
    return next();
  });
}

export const authGaurd = {
    authClientToken : authClientToken
}