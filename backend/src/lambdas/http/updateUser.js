const usersBusinessLogic = require('../../businessLogic/users')

const
  { createLogger } = require('../../utils/logger'),
  { errorResponseBuilder, getUserIdFromAuth } = require('./utils')

const logger = createLogger('updateUserLambdaHttpLogger')

module.exports = async event => {
  logger.info('updateUser lambda http invoked', { parameters: { event } })

  const
    reqBody = JSON.parse(event.body),
    {
      name,
      status,
      follows,
      followedBy
    } = reqBody

  if (!name && !status && !follows && !followedBy) {
    return errorResponseBuilder({
      statusCode: 400,
      message: 'Invalid request body'
    })
  }

  try {
    const
      userId = getUserIdFromAuth(event),
      usersUpdateBusinessLogicResult = await usersBusinessLogic.update(
        userId,
        name,
        status,
        follows,
        followedBy
      )

    logger.info('usersUpdateBusinessLogicResult', { usersUpdateBusinessLogicResult })

    return { statusCode: 200 }
  } catch (error) {
    logger.error(error)

    return errorResponseBuilder(error)
  }
}
