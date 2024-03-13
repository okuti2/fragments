// src/routes/api/get.js
const Fragment = require('../../model/fragment');
//const logger = require('../../logger');
const response = require('../../../src/response');

/**
 * Get a list of fragments for the current user
 * Initial implementation of GET /v1/fragments
 */
module.exports = async (req, res) => {
  
    Fragment.Fragment.byUser(req.user, req.query.expand)
    .then((fragments) => {
      res.status(200).json(
      // {
      //   status: 'ok',
      //   fragments,
      // }

      response.createSuccessResponse({fragments})
      );
    })
    .catch((err) => {
      res.status(500).json({
        status: 'error',
        error: {
          message: err.message,
          code: 500,
        },
      });
    });
  
};