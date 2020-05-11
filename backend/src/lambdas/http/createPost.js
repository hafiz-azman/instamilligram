const postsBusinessLogic = require('../../businessLogic/posts')

const
  { createLogger } = require('../../utils/logger'),
  { errorResponseBuilder, getUserIdFromAuth } = require('./utils')

const logger = createLogger('createPostLambdaHttpLogger')

module.exports = async event => {
  logger.info('createPost lambda http invoked', { parameters: { event } })

  const
    reqBody = JSON.parse(event.body),
    { description } = reqBody

  if (!description) {
    return errorResponseBuilder({
      statusCode: 400,
      message: 'Invalid request body'
    })
  }

  try {
    const
      userId = getUserIdFromAuth(event),
      postsCreateBusinessLogicResult = await postsBusinessLogic.create(userId, description)

    logger.info('postsCreateBusinessLogicResult', { postsCreateBusinessLogicResult })

    return { statusCode: 201 }
  } catch (error) {
    logger.error(error)

    return errorResponseBuilder(error)
  }
}
