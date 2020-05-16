const postsBusinessLogic = require('../../businessLogic/posts')

const
  { createLogger } = require('../../utils/logger'),
  { errorResponseBuilder, getUserIdFromAuth } = require('./utils')

const logger = createLogger('updatePostLambdaHttpLogger')

module.exports = async event => {
  logger.info('updatePost lambda http invoked', { parameters: { event } })

  const
    reqBody = JSON.parse(event.body),
    {
      id,
      description,
      comment,
      likedBy,
      unlikedBy
    } = reqBody

  if (!id || !description || !comment || !likedBy || !unlikedBy) {
    return errorResponseBuilder({
      statusCode: 400,
      message: 'Invalid request body'
    })
  }

  try {
    const
      userId = getUserIdFromAuth(event),
      postsUpdateBusinessLogicResult = await postsBusinessLogic.update(
        id,
        userId,
        description,
        comment,
        likedBy,
        unlikedBy
      )

    logger.info('postsUpdateBusinessLogicResult', { postsUpdateBusinessLogicResult })

    return { statusCode: 200 }
  } catch (error) {
    logger.error(error)

    return errorResponseBuilder(error)
  }
}
