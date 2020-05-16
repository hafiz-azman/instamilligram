const { v4: uuidv4 } = require('uuid')

const
  photosS3Bucket = process.env.PHOTOS_S3_BUCKET,
  awsRegion = process.env.REGION

const postsDataAccess = require('../../dataAccesses/posts')

const { createLogger } = require('../../utils/logger')

const logger = createLogger('postsBusinessLogicLogger')

module.exports.create = async (userId, description) => {
  logger.info('posts.create businessLogic invoked', { parameters: {
    userId,
    description
  } })

  if (!userId || !description) {
    throw 'Invalid parameters'
  }

  const
    id = uuidv4(),
    createdAt = (new Date()).toISOString(),
    newPostDetails = {
      id,
      userId,
      photoUrl: `https://${ photosS3Bucket }.s3${ awsRegion ? `.${ awsRegion }` : '' }.amazonaws.com/${ id }`,
      description,
      comments: [],
      likes: [],
      createdAt
    }

  try {
    const postsDataAccessResult = await postsDataAccess.create(newPostDetails)

    logger.info('postsDataAccessResult', { postsDataAccessResult })

    // return the new post object
    return postsDataAccessResult
  } catch (error) {
    logger.error(error)

    throw error
  }
}

module.exports.getAllByUser = async userId => {
  logger.info('posts.get businessLogic invoked', { parameters: { userId } })

  if (!userId) {
    throw 'Invalid parameters'
  }

  try {
    const postsDataAccessResult = await postsDataAccess.getAllByUser(userId)

    logger.info('postsDataAccessResult', { postsDataAccessResult })

    return postsDataAccessResult
  } catch (error) {
    logger.error(error)

    throw error
  }
}

module.exports.update = async (id, userId, description, comment, likedBy, unlikedBy) => {
  logger.info('posts.update businessLogic invoked', { parameters: {
    id,
    userId,
    description,
    comment,
    likedBy,
    unlikedBy
  } })

  if (!id || !userId || (!description && !comment && !likedBy && !unlikedBy)) {
    throw 'Invalid parameters'
  }

  try {
    const post = await postsDataAccess.get(id, userId)

    if (!post) {
      throw {
        statusCode: 404,
        message: 'Post not found'
      }
    }

    const {
        createdAt,
        description: currentDescription,
        comments,
      } = post,
      updatedPostDetails = {
        description: description || currentDescription,
        comments: comment ? comments.push(comment) : comments
      }

    let { likes } = post

    if (likedBy) {
      likes.push(likedBy)
    }

    if (unlikedBy) {
      likes = likes.filter(like => like !== unlikedBy)
    }

    updatedPostDetails.likes = likes

    const postsDataAccessResult = await postsDataAccess.update(id, userId, createdAt, updatedPostDetails)

    logger.info('postsDataAccessResult', { postsDataAccessResult })

    return postsDataAccessResult
  } catch (error) {
    logger.error(error)

    throw error
  }
}

module.exports.delete = async (id, userId) => {
  logger.info('posts.delete businessLogic invoked', { parameters: {
    id,
    userId,
  } })

  if (!id || !userId) {
    throw 'Invalid parameters'
  }

  try {
    const post = await postsDataAccess.get(id, userId)

    if (!post) {
      throw {
        statusCode: 404,
        message: 'Post not found'
      }
    }

    const
      { createdAt } = post,
      postsDataAccessResult = await postsDataAccess.delete(userId, createdAt)

    logger.info('postsDataAccessResult', { postsDataAccessResult })

    return postsDataAccessResult
  } catch (error) {
    logger.error(error)

    throw error
  }
}
