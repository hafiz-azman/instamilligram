const aws = require('aws-sdk')

const docClient = new aws.DynamoDB.DocumentClient()

const usersTable = process.env.USERS_TABLE

const { createLogger } = require('../../utils/logger')

const logger = createLogger('usersDataAccessLogger')

module.exports.create = async newUserDetails => {
  logger.info('users.create dataAccess invoked', { parameters: { newUserDetails } })

  if (!newUserDetails) {
    throw 'Invalid parameters'
  }

  try {
    const dynamoDbPutResult = await docClient.put({
      TableName: usersTable,
      Item: newUserDetails
    }).promise()

    logger.info('dynamoDbPutResult', { dynamoDbPutResult })

    return dynamoDbPutResult
  } catch (error) {
    logger.error(error)

    throw error
  }
}

module.exports.get = async id => {
  logger.info('users.get dataAccess invoked', { parameters: { id } })

  if (!id) {
    throw 'Invalid parameters'
  }

  try {
    let user

    const dynamoDbQueryResult = await docClient.query({
      TableName: usersTable,
      KeyConditionExpression: 'id=:id',
      ExpressionAttributeValues: { ':id': id }
    }).promise()

    logger.info('dynamoDbQueryResult', { dynamoDbQueryResult })

    const { Items } = dynamoDbQueryResult || {}

    if (Items && Items.length) {
      [ user ] = Items
    }

    return user
  } catch (error) {
    logger.error(error)

    throw error
  }
}

module.exports.update = async (id, createdAt, userDetails) => {
  logger.info('users.update dataAccess invoked', { parameters: {
    id,
    createdAt,
    userDetails
  } })

  if (!id || !createdAt || !userDetails) {
    throw 'Invalid parameters'
  }

  const {
    name,
    status,
    follows,
    followedBy
  } = userDetails

  try {
    const dynamoDbUpdateResult = await docClient.update({
      TableName: usersTable,
      Key: {
        id,
        createdAt
      },
      UpdateExpression: 'set name=:name, status=:status, follows=:follows, followedBy=:followedBy',
      ExpressionAttributeValues: {
        ':name': name,
        ':status': status,
        ':follows': follows,
        ':followedBy': followedBy
      }
    }).promise()

    logger.info('dynamoDbUpdateResult', { dynamoDbUpdateResult })

    return dynamoDbUpdateResult
  } catch (error) {
    logger.error(error)

    throw error
  }
}
