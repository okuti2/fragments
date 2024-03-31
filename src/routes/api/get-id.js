// src/routes/api/get-id.js
const Fragment = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
      try{
        const extension = req.params.ext;
        await Fragment.Fragment.byId(req.user, req.params.id).then((fragment) => {
          res.setHeader('Content-Type', fragment.type);
          (extension ? fragment.convertFragment(extension) : fragment.getData())
          .then((data) => {
            logger.debug(fragment.mimeType, 'Fragment type');
            res.setHeader('Content-Type', fragment.type); // Keeps saving with the charset=utf-8 encoded
            res.setHeader('Content-Length', fragment.size);
            res.status(200).send(data);
            
          }).catch((err) => {
            if (err.message === 'unable to read fragment data') {
              // Handle specific error from readFragmentData as 404
              res.status(404).json({ error: 'Fragment not found' });
            }else{
              res.status(500).json({
                status: 'error',
                error: {
                  message: err.message,
                  code: 500,
                }});
            }
          });
        });
        }
        catch(err){
          res.status(404).json({ error: 'Fragment not found' });
          logger.error(err.message);
        }
    };
