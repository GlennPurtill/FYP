const express = require('express');
const api = express.Router();
const cors = require('cors')
const translate = require('@vitalets/google-translate-api');
const firebase = require('firebase');
const http = require('http');
const axios = require('axios');
const say = require('say');



var config = {
    apiKey: "AIzaSyBRpk0u-ZtYgPxJi_Fw0i1MVyTQgDRJUjg",
    authDomain: "finalyearproject-33dd1.firebaseapp.com",
    databaseURL: "https://finalyearproject-33dd1.firebaseio.com",
    projectId: "finalyearproject-33dd1",
    storageBucket: "finalyearproject-33dd1.appspot.com",
    messagingSenderId: "74338432648"
};

firebase.initializeApp(config);
var database = firebase.database();

api.use(cors())

api.post('/transSpanish', (req, res, next) => {
    translate(req.query.data, {to: 'es'}).then(response => {
        res.status('200').json(response.text)
        //=> nl
     }).catch(err => {
        console.error(err);
     });
});

api.post('/checkDB', (req, res, next) => {
    firebase.database().ref('freqwords/'+ req.query.data).once('value').then(function(snapshot){
        res.status('200').json(snapshot.val());
    });
});

api.post('/checkSpanDB', (req, res, next) => {
    firebase.database().ref('freqwordsspanish/'+ req.query.data).once('value').then(function(snapshot){
        res.status('200').json(snapshot.val());
    });
});

api.post('/speakEn', (req, res, next) => {
     speakEn()
    async function speakEn(){
        await say.speak(req.query.data, 'Samantha', 0.6)
        res.status('200').json("done");
    }

   
});

api.post('/speakEs', (req, res, next) => {
    async function speakEs(){
        await say.speak(req.query.data, 'Monica', 0.6)
        res.status('200').json(null);
    }
    speakEs()
});

api.post('/apiCallEng', (req, res, next) => {
    axios.get('https://api.datamuse.com/words?sp='+req.query.data+'&md=r&max=1&ipa=1').then(function (response) {
        if(response.data[0] == undefined){
            res.status('200').json(null);
        }
        else{
            res.status('200').json(response.data[0].tags[0].substring(5, response.data[0].tags[0].length-1)); 
        }
    });
});

api.post('/apiCallSpan', (req, res, next) => {
    axios.get('https://api.datamuse.com/words?sp='+req.query.data+'&md=r&v=es&max=1&ipa=1').then(function (response) {
        if(response.data[0] == undefined){
            res.status('200').json(null);
        }
        else{
            res.status('200').json(response.data[0].tags[0].substring(5, response.data[0].tags[0].length-1)); 
        }
      })
});


api.post('/splitToPronun', (req, res, next) => {
    var tempArr = req.query.data.split(',');
    var temp = '';
    for(let x = 0; x < tempArr.length; x++){
        tempPronun = tempArr[x].replace(/ /g,'');
        let arr = tempPronun.split('0');
        for(let i = 0; i < arr.length; i++) {
          if(i>0 && arr[i] != ''){
            temp += '-'
          }
            for(let j = 0; j < arr[i].length; j++) {
              if(arr[i].charAt(j) == '1'){
                if(arr[i].charAt(j+3) == '1' || (arr[i].charAt(j+3) == '' && i < arr[i].length)){
                  temp += arr[i].substring(0, j) + '-'
                  arr[i] = arr[i].substring(j+1, arr[i].length)
                  j = 0
                  if(arr[i].length == 1){
                    temp += arr[i].charAt(j)
                    arr[i] = arr[i].substring(j+1, arr[i].length)
                  }
                }
                else {
                  temp += arr[i].substring(0, j) + arr[i].substring(j+1, j+2) + '-'
                  arr[i] = arr[i].substring(j+2, arr[i].length)
                  j=0
                }
              } 
              if(j == arr[i].length-1) {
                temp += arr[i].substring(0, j+1)
              }
            }  
        }
        if(temp.charAt(temp.length-1) == '-'){
         temp = temp.substring(0,temp.length-1)
        }
        temp += " "
    }
    res.status('200').json(temp); 
});

api.post('/updateAPICalls', (req, res, next) => {
    utc = String(new Date().toJSON().slice(0,10).replace(/-/g,''))
    firebase.database().ref('apicalls/'+ utc).once('value').then(function(snapshot){
      if(snapshot.val() != null){
        firebase.database().ref('apicalls').update({[utc] : parseInt(snapshot.val()) + parseInt(req.query.data)});
      }else{
        firebase.database().ref('apicalls').update({[utc] : req.query.data});
      }
      this.counter = 0
    console.log(snapshot.val())
    })
});

module.exports = api;