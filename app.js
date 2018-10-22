const express = require('express');
const http = require('http');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

mongoose.connect('mongodb://user01:dpr6371@ds233323.mlab.com:33323/fyp');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const api = require('./server/api');
app.use('/api', api);

// app.use(express.static(path.join(__dirname, 'dist')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist/FinalProject/index.html')); 
// });

const port = process.env.PORT || '8080';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));