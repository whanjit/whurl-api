import local from './local'
import develop from './develop'
import production from './production'
import _ from 'lodash'


const env = process.env.NODE_ENV || 'local'
const envConfig = require('./' + env);
/*const envConfig = (env) => {
  switch (env) {
    case 'production':
      return production
    case 'develop':
      return develop
    default:
      return local
  }
}//*/
let defaultConfig = {
  env: env
};

export const config = _.merge(defaultConfig, envConfig);