// src/routes/api/get[id].js
const Fragment = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
      try{
        await Fragment.Fragment.byId(req.user, req.params.id).then((fragment) => {
          fragment.getData().then((data) => {
            
            res.setHeader('Content-Type', fragment.type);
            res.setHeader('Content-Length', fragment.size);
            res.status(200).send(data);
          }).catch((err) => {
            res.status(500).json({
              status: 'error',
              error: {
                message: err.message,
                code: 500,
              }});
          });
        });
        }
        catch(err){
          res.status(404).json({ error: 'Fragment not found' });
          logger.error(err.message);
        }
    };