const express = require('express');
const api = express.Router();
const cors = require('cors')
const translate = require('google-translate-api');
api.use(cors())

api.post('/transSpanish', (req, res, next) => {
    translate(req.query.data, {to: 'es'}).then(response => {
        res.status('200').json(response.text)
        //=> nl
     }).catch(err => {
        console.error(err);
     });
});

module.exports = api;