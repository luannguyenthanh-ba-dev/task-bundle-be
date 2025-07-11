const jwt = require('jsonwebtoken');

const { logger } = require('../../utils');

const jwtSecret = process.env.JWT_SECRET || 'default-secret';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
const jwtRefreshSecret =
  process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '14d';
const jwtAlgorithm = 'HS256';

const generateJWT = (payload = {}) => {
  if (typeof payload !== 'object' || Object.keys(payload).length === 0) {
    logger.error('Not have payload, can not sign token!!!');
    throw new Error('Not have payload, can not sign token!!!');
  }

  const userInfo = {
    _id: payload._id,
    email: payload.email,
    name: payload.name,
    phone: payload.phone,
    job: payload.job,
    position: payload.position,
    address: payload.address,
    university: payload.university,
    is_verified: payload.is_verified,
    created_at: payload.created_at,
    updated_at: payload.updated_at,
  };

  const token = jwt.sign(userInfo, jwtSecret, {
    expiresIn: jwtExpiresIn,
    algorithm: jwtAlgorithm,
  });
  const refreshToken = jwt.sign({ email: userInfo.email }, jwtRefreshSecret, {
    expiresIn: jwtRefreshExpiresIn,
    algorithm: jwtAlgorithm,
  });
  return { token, refresh_token: refreshToken };
};

const verifyJWT = (token = '') => {
  if (!token || !token.length) {
    logger.error('Not have token, can not verify!!!');
    throw new Error('Not have token, can not verify!!!');
  }

  const userInfo = jwt.verify(token, jwtSecret, { algorithms: jwtAlgorithm });
  return {
    _id: userInfo._id,
    email: userInfo.email,
    name: userInfo.name,
    phone: userInfo.phone,
    job: userInfo.job,
    position: userInfo.position,
    address: userInfo.address,
    university: userInfo.university,
    is_verified: userInfo.is_verified,
    created_at: userInfo.created_at,
    updated_at: userInfo.updated_at,
  };
};

const verifyRefreshJWT = (refreshToken = '') => {
  if (!refreshToken || !refreshToken.length) {
    logger.error('Not have refresh token, can not verify!!!');
    throw new Error('Not have refresh token, can not verify!!!');
  }

  const userInfo = jwt.verify(refreshToken, jwtRefreshSecret, {
    algorithms: jwtAlgorithm,
  });
  return {
    email: userInfo.email,
  };
};

module.exports = { generateJWT, verifyJWT, verifyRefreshJWT };
