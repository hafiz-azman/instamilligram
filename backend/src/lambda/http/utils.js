const errorResponseBuilder = error => {
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

module.exports = { errorResponseBuilder }