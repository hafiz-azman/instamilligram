const getPostsBusinessLogic = require('../../businessLogic/getPosts')

const
  { createLogger } = require('../../utils/logger'),
  { errorResponseBuilder, getUserIdFromAuth } = require('./utils')

const logger = createLogger('getPostsLambdaHttpLogger')

module.exports = async event => {
  logger.info('getPosts lambda http invoked', { parameters: { event } })

  try {
    const
      userId = getUserIdFromAuth(event),
      getPostsBusinessLogicResult = await getPostsBusinessLogic(userId)

    logger.info('getPostsBusinessLogic', { getPostsBusinessLogic })

    return {
      statusCode: 200,
      body: JSON.stringify({ response: getPostsBusinessLogicResult })
    }
  } catch (error) {
    logger.error(error)

    return errorResponseBuilder(error)
  }
}