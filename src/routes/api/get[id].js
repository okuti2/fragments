// src/routes/api/get.js
const Fragment = require('../../model/fragment');



/**
 * Get a list of fragments for the current user
 * Initial implementation of GET /v1/fragments
 */
module.exports = (req, res) => {
  Fragment.Fragment.byId(req.user, req.params.id)
    .then((fragments) => {
      res.status(200).json({
        status: 'ok',
        fragments,
      });
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