const { decode } = require('jsonwebtoken')

module.exports.getUserIdFromAuth = event => {
  const
    { headers } = event || {},
    { Authorization:authorization } = headers || {}
    
  if (!authorization) {
    throw 'Missing Authorization in header'
  }
  
  const 
    split = authorization.split(' '),
    jwtToken = split[1],
    decodedJwtToken = decode(jwtToken),
    { sub:userId } = decodedJwtToken || {}
  
  if (!userId) {
    throw 'No user id found in the token'
  }
  
  return userId
}

module.exports.errorResponseBuilder = error => {
  // if the error is a string, return it in the response body
  // with status code 500
  if (typeof error === 'string') {
    return {
      statusCode: 500,
      body: error
    }
  }
  
  const {
    statusCode,
    message
  } = error
  
  // if there's statusCode and/or message passed in the error object,
  // use those passed values in the response instead
  return {
    statusCode: statusCode || 500,
    body: message || JSON.stringify(error)
  }
}
