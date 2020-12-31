const jwt = require('jsonwebtoken')
const {AuthentificationError} = require('apollo-server')

const {SECRET_KEY} = require('../config')

module.exports = (context) => {
  // console.log(context)
  const authHeader = context.req.headers.authorization;

  if (authHeader){
    const token = authHeader.split('Bearer ')[1]
    if (token){
      try{
        const user = jwt.verify(token,SECRET_KEY)
        return user
      }
      catch(err){
        throw new AuthentificationError('Invalid/Expired token')
      }
    }
    throw new Error('Authentification token must be \' Bearer [token]')
  }
  throw new Error('Authorization header must be provided')

}
