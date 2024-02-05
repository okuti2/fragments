// src/routes/api/post.js
const logger = require('../../logger');
const Fragment = require('../../model/fragment');

/**
 * Create a new fragment for the current user
 * Initial implementation of POST /v1/fragments
 */
module.exports = (req, res) => {
    try {
        logger.debug(req.originalUrl);
        logger.debug(req.url);

        // Check if the body was parsed as a Buffer
        if (!Buffer.isBuffer(req.body)) {
          return res.status(400).json({ error: 'Request body must be binary data' });
        }

        const type = req.headers['content-type'];

    
        // Check if the Content-Type is supported
        if (!Fragment.Fragment.isSupportedType(type)) {
          return res.status(415).json({ error: 'Unsupported Content-Type' });
        }
    
        // Create a new fragment
        const fragment = new Fragment.Fragment({
          ownerId: req.user, // assuming req.user contains the authenticated user
          type: type,
          size: req.body.length,
        });
    
        // Save the fragment and its data
        fragment.save();
        fragment.setData(req.body);
    
        // Send the response
        res.status(201)
          .set('Location', `${process.env.API_URL}${req.originalUrl}/${fragment.id}`)
          .json({
            status: 'ok',
            fragment: {
              id: fragment.id,
              ownerId: fragment.ownerId,
              created: fragment.created,
              updated: fragment.updated,
              type: fragment.type,
              size: fragment.size,
            },
          });
      } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'An error occurred' });
      }
}; 
// Support sending various Content-Types on the body up to 5M in size
