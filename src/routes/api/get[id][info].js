// src/routes/api/get[id][post].js
const Fragment = require('../../model/fragment');
//const logger = require('../../logger');

    module.exports = async (req, res) => {
        await Fragment.Fragment.byId(req.user, req.params.id)
        .then((fragment) => {
        res.status(200).json({
            status: 'ok',
            fragment,
        });
        })
        .catch((err) => {
        res.status(500).json({
            status: 'error',
            error: {
            message: err.message,
            code: 500,
            }
        });
        });
}