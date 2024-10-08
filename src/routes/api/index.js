// src/routes/api/index.js
const Fragment = require('../../model/fragment');
var contentType = require('content-type')


/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));
router.get('/fragments/:id.:ext?', require('./get-id'));
router.get('/fragments/:id/info', require('./get-id-info'));
router.delete('/fragments/:id', require('./delete'));

const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      const { type } = contentType.parse(req);
      return Fragment.Fragment.isSupportedType(type);
    },
  });
// Use a raw body parser for POST, which will give a `Buffer` Object or `{}` at `req.body`
// You can use Buffer.isBuffer(req.body) to test if it was parsed by the raw body parser.
//POST /v1/fragments
router.post('/fragments', rawBody(), require('./post'));
router.put('/fragments/:id', rawBody(), require('./put'));

module.exports = router;