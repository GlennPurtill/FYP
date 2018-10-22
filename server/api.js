const express = require('express');
const api = express.Router();
var mongoose = require('mongoose');

api.post('/test', (req, res, next) => {
    var val = new mongoose.Schema({
        name: "string"
    })
    console.log("called")
    val.save((err, form) => {
        if(err){
            console.log("in api")
            // res.status(500).json({ errmsg: err });
        }
    });  
});

module.exports = api;