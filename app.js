const express = require('express');
const http = require('http');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// var googleTTS = require('google-tts-api');

// googleTTS('Hello World i am an idiot', 'en', 1)   // speed normal = 1 (default), slow = 0.24
// .then(function (url) {
//  console.log(url); // https://translate.google.com/translate_tts?...
// })
// .catch(function (err) {
//  console.error(err.stack);
// });

  
// mongoose.connect('mongodb://user01:dpr6371@ds233323.mlab.com:33323/fyp');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const api = require('./server/api');
app.use('/api', api);

app.use(express.static(path.join(__dirname, 'dist/FinalProject')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/FinalProject/index.html')); 
});

const port = process.env.PORT || '8080';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));