const deletePostBusinessLogic = require('../../businessLogic/deletePost')

const
  { createLogger } = require('../../utils/logger'),
  { errorResponseBuilder } = require('./utils')

const logger = createLogger('deletePostLambdaHttpLogger')

module.exports = async event => {
  logger.info('deletePost lambda http invoked', { parameters: { event } })
  
  const id = event.pathParameters.id
  
  if (!id) {
    return errorResponseBuilder({
      statusCode: 400,
      message: 'Missing id'
    })
  }
    
  try {
    const deletePostBusinessLogicResult = await deletePostBusinessLogic(id)
    
    logger.info('deletePostBusinessLogicResult', { deletePostBusinessLogicResult })
    
    return { statusCode: 200 }
  } catch (error) {
    logger.error(error)
    
    return errorResponseBuilder(error)
  }
}
