const usersBusinessLogic = require('../../businessLogic/users')

const
  { createLogger } = require('../../utils/logger'),
  { errorResponseBuilder, getUserIdFromAuth } = require('./utils')

const logger = createLogger('createUserLambdaHttpLogger')

module.exports = async event => {
  logger.info('createUser lambda http invoked', { parameters: { event } })

  const
    reqBody = JSON.parse(event.body),
    { name } = reqBody

  if (!name) {
    return errorResponseBuilder({
      statusCode: 400,
      message: 'Invalid request body'
    })
  }

  try {
    const
      userId = getUserIdFromAuth(event),
      usersCreateBusinessLogicResult = await usersBusinessLogic.create({
        userId,
        name
      })

    logger.info('usersCreateBusinessLogicResult', { usersCreateBusinessLogicResult })

    return { statusCode: 200 }
  } catch (error) {
    logger.error(error)

    return errorResponseBuilder(error)
  }
}
