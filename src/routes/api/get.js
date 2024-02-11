// src/routes/api/get.js
const Fragment = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 * Initial implementation of GET /v1/fragments
 */
module.exports = (req, res) => {
  if(req.params.id){

    try{
      Fragment.Fragment.byId(req.user, req.params.id).then((fragment) => {
        fragment.getData().then((data) => {
          res.status(200).send(data);
        }).catch((err) => {
          res.status(500).send('Server error');
          logger.error(err);
        });

      })}
      catch(err){
        res.status(404).send('Fragment not found');
        logger.error(err);
      }
  }
  else{
    Fragment.Fragment.byUser(req.user, req.query.expand)
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
  }
  
};