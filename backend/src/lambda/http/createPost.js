const createPostBusinessLogic = require('../../businessLogic/createPost')

const
  { createLogger } = require('../../utils/logger'),
  { errorResponseBuilder } = require('./utils')

const logger = createLogger('createPostLambdaHttpLogger')

module.exports = async event => {
  logger.info('createPost lambda http invoked', { parameters: { event } })
  
  const 
    reqBody = JSON.parse(event.body),
    {
      userId,
      photoUrl,
      description
    } = reqBody
  
  if (!userId || !photoUrl || !description) {
    return errorResponseBuilder({
      statusCode: 400,
      message: 'Invalid request body'
    })
  }
    
  try {
    const createPostBusinessLogicResult = await createPostBusinessLogic({
      userId,
      photoUrl,
      description
    })
    
    logger.info('createPostBusinessLogicResult', { createPostBusinessLogicResult })
    
    return { statusCode: 201 }
  } catch (error) {
    logger.error(error)
    
    return errorResponseBuilder(error)
  }
}
