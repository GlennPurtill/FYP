import { Component, OnInit } from '@angular/core';
import { Http }  from "@angular/http";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { WebService } from '../services/webservice';
import { MatSnackBar } from '@angular/material';
declare var firebase: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sentence = ''
  counter = 0
  fresharr = []
  temp = ''
  data= ''
  pronunSentence = ''
  arpabetRule = ['AE','AH','AO','AY','EY','UW','HH']
  arpabetRuleSound = ['AH','AH','AW','IY','AY','EW','H']
  splitArpabetCounter = 0
  freqWordsRef = firebase.database().ref('/freqwords');
  freqWordsSpanishRef = firebase.database().ref('/freqwordsspanish');
  utc = String(new Date().toJSON().slice(0,10).replace(/-/g,''))
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient, private webService: WebService, private db : AngularFireDatabase, private snackBar: MatSnackBar) {
  }
  
  onKey(event: any) { 
    this.sentence = event.target.value;
    // this.sentence = 'the dog is relatively fat'
  }

  splitArpabet(tempPronun, length){
    this.splitArpabetCounter++
    tempPronun = tempPronun.replace(/ /g,'')
    let arr = tempPronun.split('1')
    

    for(let i = 0; i < arr.length; i++) {
      if(i>0 && arr[i] != ''){
        this.temp += '-'
      }
        for(let j = 0; j < arr[i].length; j++) {
          if(arr[i].charAt(j) == '0'){
            if(arr[i].charAt(j+3) == '0' || (arr[i].charAt(j+3) == '' && i < arr[i].length)){
              
              this.temp += arr[i].substring(0, j) + '-'
              arr[i] = arr[i].substring(j+1, arr[i].length)
              j = 0
              if(arr[i].length == 1){
                this.temp += arr[i].charAt(j)
                arr[i] = arr[i].substring(j+1, arr[i].length)
              }
            }
            else {
              this.temp += arr[i].substring(0, j) + arr[i].substring(j+1, j+2) + '-'
              arr[i] = arr[i].substring(j+2, arr[i].length)
              j=0
            }
          } 
          if(j == arr[i].length-1) {
            this.temp += arr[i].substring(0, j+1)
          }
        }
       
    }
    if(this.temp.charAt(this.temp.length-1) == '-'){
     this.temp = this.temp.substring(0,this.temp.length-1)
    }
    this.temp += " "
    console.log(this.temp)
  
  }

 //keeps track of daily api calls
  updateCalls(){
    let curCall = 0
    let freqWordsRef = firebase.database().ref('/apicalls');
    freqWordsRef.child(this.utc).once('value', (snapshot) => {
      if(snapshot.val() != null){
        freqWordsRef.update({[this.utc] : snapshot.val() + this.counter});
      }else{
        freqWordsRef.update({[this.utc] : this.counter});
      }
      this.counter = 0
    })
  }

  //checks how many words are in the inputted string
  checkWordAmount(sentence){  
    var numWords = sentence.replace(/^\s+|\s+$/g,"").split(/\s+/).length;
    return numWords;
  } 

  //puts words from input into an array
  putWordsIntoArray(sentence){
    var arr = this.sentence.split(' ');
    if(arr[0] == ''){
      arr = arr.splice(1,arr.length-1)
    }
    if(arr[arr.length-1] == ''){
      arr = arr.splice(0, arr.length-1)
    }
    return arr;
  }
}