const postsBusinessLogic = require('../../businessLogic/posts')

const
  { createLogger } = require('../../utils/logger'),
  { errorResponseBuilder, getUserIdFromAuth } = require('./utils')

const logger = createLogger('getPostsLambdaHttpLogger')

module.exports = async event => {
  logger.info('getPosts lambda http invoked', { parameters: { event } })

  try {
    const
      userId = getUserIdFromAuth(event),
      postsGetBusinessLogicResult = await postsBusinessLogic.getAllByUser(userId)

    logger.info('postsGetBusinessLogicResult', { postsGetBusinessLogicResult })

    return {
      statusCode: 200,
      body: JSON.stringify({ response: postsGetBusinessLogicResult })
    }
  } catch (error) {
    logger.error(error)

    return errorResponseBuilder(error)
  }
}
