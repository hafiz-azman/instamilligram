const getPhotoUploadUrlBusinessLogic = require('../../businessLogic/getPhotoUploadUrl')

const
  { createLogger } = require('../../utils/logger'),
  { errorResponseBuilder } = require('./utils')

const logger = createLogger('getPhotoUploadUrlLambdaHttpLogger')

module.exports = async event => {
  logger.info('getPhotoUploadUrl lambda http invoked', { parameters: { event } })

  const id = event.pathParameters.id

  if (!id) {
    return errorResponseBuilder({
      statusCode: 400,
      message: 'Missing id'
    })
  }

  try {
    const getPhotoUploadUrlBusinessLogicResult = await getPhotoUploadUrlBusinessLogic(id)

    logger.info('getPhotoUploadUrlBusinessLogicResult', { getPhotoUploadUrlBusinessLogicResult })

    return {
      statusCode: 200,
      body: JSON.stringify({ response: getPhotoUploadUrlBusinessLogicResult })
    }
  } catch (error) {
    logger.error(error)

    return errorResponseBuilder(error)
  }
}
