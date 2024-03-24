// src/routes/api/post.js
const logger = require('../../logger');
const Fragment = require('../../model/fragment');
const response = require('../../../src/response');

/**
 * Create a new fragment for the current user
 * Initial implementation of POST /v1/fragments
 */
module.exports = async (req, res) => {
    try {

        // Check if the body was parsed as a Buffer
        if (!Buffer.isBuffer(req.body)) {
          // Check if the Content-Type is supported
          return res.status(415).json({ error: 'Request body must be binary data' });
        }

        const type = req.headers['content-type'];
    
        // Create a new fragment
        const fragment = new Fragment.Fragment({
          ownerId: req.user, // assuming req.user contains the authenticated user
          type: type,
          size: req.body.length,
        });

        logger.debug(req.body.toString(), 'Fragment data should be unbuffered');
    
        // Save the fragment and its data
        await fragment.save();
        await fragment.setData(req.body);

        const URL = process.env.API_URL|| req.headers.host;
        // Send the response
        res.status(201)
          .location(`${URL.toString()}/v1/fragments/${fragment.id}`)
          .json(
            response.createSuccessResponse({
              fragment: {
                id: fragment.id,
                ownerId: fragment.ownerId,
                created: fragment.created,
                updated: fragment.updated,
                type: fragment.type,
                size: fragment.size,
              },
          }));
      } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'An error occurred' });
      }
}; 
// Support sending various Content-Types on the body up to 5M in size
