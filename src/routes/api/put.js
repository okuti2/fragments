// src/routes/api/put.js
const Fragment = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
    logger.info('v1/fragments PUT route works');
    try{
        const headers = req.headers;
        await Fragment.Fragment.byId(req.user, req.params.id).then((fragment) => {
            logger.debug("HELLO", headers['content-type'], fragment.type);
            logger.debug(headers['content-type'], fragment.type);
          if(fragment.type == headers['content-type']){
                fragment.size = req.body.length;
                fragment.save();
                fragment.setData(req.body)
                .then(() => {
                    logger.info("Fragment updated");
                    res.status(200).json( 
                        createSuccessResponse({
                            fragment: {
                                id: fragment.id,
                                ownerId: fragment.ownerId,
                                created: fragment.created,
                                updated: fragment.updated,
                                type: fragment.type,
                                size: fragment.size,
                                formats: fragment.formats,
                            },
                        }));
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
                            }
                        });
                    }
                });
            }else{
                res.status(404).json(createErrorResponse(404, 'fragments type cannot be changed'));
            }});
    }
        catch(err){
          res.status(404).json({ error: 'Fragment not found' });
          logger.error(err.message);
        }
};
