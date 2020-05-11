const aws = require('aws-sdk')

const docClient = new aws.DynamoDB.DocumentClient()

const
  postsTable = process.env.POSTS_TABLE,
  postsIdIndex = process.env.POSTS_ID_INDEX

const { createLogger } = require('../../utils/logger')

const logger = createLogger('postsDataAccessLogger')

module.exports.create = async newPostDetails => {
  logger.info('posts.create dataAccess invoked', { parameters: { newPostDetails } })

  if (!newPostDetails) {
    throw 'Invalid parameters'
  }

  try {
    const dynamoDbPutResult = await docClient.put({
      TableName: postsTable,
      Item: newPostDetails
    }).promise()

    logger.info('dynamoDbPutResult', { dynamoDbPutResult })

    return dynamoDbPutResult
  } catch (error) {
    logger.error(error)

    throw error
  }
}

module.exports.get = async (id, userId) => {
  logger.info('posts.get dataAccess invoked', { parameters: { id, userId } })

  if (!id || !userId) {
    throw 'Invalid parameters'
  }

  try {
    let post

    const dynamoDbQueryResult = await docClient.query({
      TableName: postsTable,
      IndexName: postsIdIndex,
      KeyConditionExpression: 'id=:id AND userId=:userId',
      ExpressionAttributeValues: {
        ':id': id,
        ':id': userId
      },
      ScanIndexForward: false
    }).promise()

    logger.info('dynamoDbQueryResult', { dynamoDbQueryResult })

    const { Items } = dynamoDbQueryResult || {}

    if (Items && Items.length) {
      [ post ] = Items
    }

    return post
  } catch (error) {
    logger.error(error)

    throw error
  }
}

module.exports.getAllByUser = async userId => {
  logger.info('posts.getAllByUser dataAccess invoked', { parameters: { userId } })

  if (!userId) {
    throw 'Invalid parameters'
  }

  try {
    let posts = []

    const dynamoDbQueryResult = await docClient.query({
      TableName: postsTable,
      IndexName: postsIdIndex,
      KeyConditionExpression: 'userId=:userId',
      ExpressionAttributeValues: { ':userId': userId },
      ScanIndexForward: false
    }).promise()

    logger.info('dynamoDbQueryResult', { dynamoDbQueryResult })

    const { Items } = dynamoDbQueryResult || {}

    if (Items && Items.length) {
      posts = Items
    }

    return posts
  } catch (error) {
    logger.error(error)

    throw error
  }
}

module.exports.update = async (id, userId, createdAt, postDetails) => {
  logger.info('posts.update dataAccess invoked', { parameters: {
    id,
    userId,
    createdAt,
    postDetails
  } })

  if (!id || !userId || !createdAt || !postDetails) {
    throw 'Invalid parameters'
  }

  const {
    description,
    comments,
    likes
  } = postDetails

  try {
    const dynamoDbUpdateResult = await docClient.update({
      TableName: postsTable,
      Key: {
        userId,
        createdAt
      },
      UpdateExpression: 'set description=:description, comments=:comments, likes=:likes',
      ExpressionAttributeValues: {
        ':description': description,
        ':comments': comments,
        ':likes': likes
      }
    }).promise()

    logger.info('dynamoDbUpdateResult', { dynamoDbUpdateResult })

    return dynamoDbUpdateResult
  } catch (error) {
    logger.error(error)

    throw error
  }
}

module.exports.delete = async (userId, createdAt) => {
  logger.info('posts.delete dataAccess invoked', { parameters: { userId, createdAt } })

  if (!userId || !createdAt) {
    throw 'Invalid parameters'
  }

  try {
    const dynamoDbDeleteResult = await docClient.delete({
      TableName: postsTable,
      Key: {
        userId,
        createdAt
      }
    }).promise()

    logger.info('dynamoDbDeleteResult', { dynamoDbDeleteResult })

    return dynamoDbDeleteResult
  } catch (error) {
    logger.error(error)

    throw error
  }
}