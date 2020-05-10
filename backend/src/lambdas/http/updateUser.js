const updateUserBusinessLogic = require('../../businessLogic/updateUser')

const
  { createLogger } = require('../../utils/logger'),
  { errorResponseBuilder } = require('./utils')

const logger = createLogger('updateUserLambdaHttpLogger')

module.exports = async event => {
  logger.info('updateUser lambda http invoked', { parameters: { event } })

  const
    reqBody = JSON.parse(event.body),
    {
      id,
      name,
      status,
      follows,
      followedBy
    } = reqBody

  if (!id || !name || !status || !follows || !followedBy) {
    return errorResponseBuilder({
      statusCode: 400,
      message: 'Invalid request body'
    })
  }

  try {
    const updateUserBusinessLogicResult = await updateUserBusinessLogic({
      id,
      name,
      status,
      follows,
      followedBy
    })

    logger.info('updateUserBusinessLogicResult', { updateUserBusinessLogicResult })

    return { statusCode: 200 }
  } catch (error) {
    logger.error(error)

    return errorResponseBuilder(error)
  }
}