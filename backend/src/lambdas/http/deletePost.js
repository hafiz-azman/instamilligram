const postsBusinessLogic = require('../../businessLogic/posts')

const
  { createLogger } = require('../../utils/logger'),
  { errorResponseBuilder, getUserIdFromAuth } = require('./utils')

const logger = createLogger('deletePostLambdaHttpLogger')

module.exports = async event => {
  logger.info('deletePost lambda http invoked', { parameters: { event } })

  const
    { pathParameters } = event,
    { id } = pathParameters || {}

  if (!id) {
    return errorResponseBuilder({
      statusCode: 400,
      message: 'Invalid request parameters'
    })
  }

  try {
    const
      userId = getUserIdFromAuth(event),
      postsDeleteBusinessLogicResult = await postsBusinessLogic.delete(id, userId)

    logger.info('postsDeleteBusinessLogicResult', { postsDeleteBusinessLogicResult })

    return { statusCode: 200 }
  } catch (error) {
    logger.error(error)

    return errorResponseBuilder(error)
  }
}
