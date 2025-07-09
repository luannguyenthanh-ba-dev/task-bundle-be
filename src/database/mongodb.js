const mongoose = require('mongoose');
const { logger } = require('../utils');

const mongoDBConnect = async () => {
  try {
    const dbUri = process.env.MONGODB_URI;
    if (!dbUri || dbUri.length === 0) {
      throw new Error('MONGO_URI not defined in environment variables');
    }
    await mongoose.connect(dbUri);
    logger.info('MongoDB Connected');
  } catch (error) {
    logger.error(error.message || 'Cannot connect to MongoD');
    throw new Error(error.message || 'Cannot connect to MongoDB');
  }
};

module.exports = { mongoDBConnect };
