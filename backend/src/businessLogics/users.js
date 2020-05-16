const usersDataAccess = require('../../dataAccesses/users')

const { createLogger } = require('../../utils/logger')

const logger = createLogger('usersBusinessLogicLogger')

module.exports.create = async (id, name) => {
  logger.info('users.create businessLogic invoked', { parameters: {
    id,
    name
  } })

  if (!id) {
    throw 'Invalid parameters'
  }

  const
    createdAt = (new Date()).toISOString(),
    newUserDetails = {
      id,
      name,
      createdAt
    }

  try {
    const usersDataAccessResult = await usersDataAccess.create(newUserDetails)

    logger.info('usersDataAccessResult', { usersDataAccessResult })

    // return the new user object
    return usersDataAccessResult
  } catch (error) {
    logger.error(error)

    throw error
  }
}

module.exports.update = async (id, name, status, follows, followedBy) => {
  logger.info('users.update businessLogic invoked', { parameters: {
    id,
    name,
    status,
    follows,
    followedBy
  } })

  if (!id || (!name && !status && !follows && !followedBy)) {
    throw 'Invalid parameters'
  }

  try {
    // add code to get user first to get createdDate range key

    const usersDataAccessResult = await usersDataAccess.update(id, {
      name,
      status,
      follows,
      followedBy
    })

    logger.info('usersDataAccessResult', { usersDataAccessResult })

    return usersDataAccessResult
  } catch (error) {
    logger.error(error)

    throw error
  }
}
