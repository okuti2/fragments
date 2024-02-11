// src/auth/index.js

const logger = require('../logger');

// Prefer Amazon Cognito
if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
    logger.info('Using Amazon Cognito for authorization');
    module.exports = require('./cognito');
  }
  // Also allow for an .htpasswd file to be used, but not in production
  else if (process.env.HTPASSWD_FILE && process.NODE_ENV !== 'production') {
    logger.warn('Using HTTP Basic Auth for authorization');
    module.exports = require('./basic-auth');
  }
  // In all other cases, we need to stop now and fix our config
  else {
    throw new Error('missing env vars: no authorization configuration found');
  }