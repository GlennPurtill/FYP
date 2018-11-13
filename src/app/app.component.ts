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

  //gets IPA by api call
  onClickEnglish(index = 0) {
    this.fresharr = []
    // // this.temp = ''
    // console.log(this.temp + " " + index)
    if(index == this.putWordsIntoArray(this.sentence).length) {
      this.updateCalls()
      this.splitArpabetCounter=0
      this.temp = ''
    } else {
      // console.log(index)
      this.freqWordsRef.child(this.putWordsIntoArray(this.sentence)[index]).once('value', (snapshot) => {
        if(snapshot.val() != null){
          this.splitArpabet(snapshot.val(), this.putWordsIntoArray(this.sentence).length)
          // console.log("in db " + snapshot.val())
          this.onClickEnglish(index + 1)
        }
        else {
          this.http.get("https://api.datamuse.com/words?sp=" + this.putWordsIntoArray(this.sentence)[index] + "&md=r&max=1&ipa=1", { headers: this.headers }).subscribe(response => {
            this.counter++
            if(response[0]==null){
              this.splitArpabet(this.putWordsIntoArray(this.sentence)[index], this.putWordsIntoArray(this.sentence).length)
              this.onClickEnglish(index + 1)
            }
            else{
              let val = response[0].tags[0].substring(5, response[0].tags[0].length-1)
              let ruledArp = ''
              for(let i = 0; i < val.length; i++){
                
                  if(this.arpabetRule.indexOf(val.charAt(i) + val.charAt(i+1)) >= 0){
                    ruledArp += this.arpabetRuleSound[this.arpabetRule.indexOf(val.charAt(i) + val.charAt(i+1))]
                    i++
                  }
                  else{
                    ruledArp += val.charAt(i)
                  }
                
              }
              this.freqWordsRef.update({ [this.putWordsIntoArray(this.sentence)[index].toLocaleLowerCase()] : ruledArp})
              this.splitArpabet(ruledArp, this.putWordsIntoArray(this.sentence).length)
              // console.log("api call " + response[0].tags[0].substring(5, response[0].tags[0].length-1))
              this.onClickEnglish(index + 1)
            }
          })
        }
      })
    }
  }

  splitArpabet(tempPronun, length){
    this.splitArpabetCounter++
    console.log(this.splitArpabetCounter)
    tempPronun = tempPronun.replace(/ /g,'')
    let arr = tempPronun.split('1')
    for(let i = 0; i < arr.length; i++) {
      if(arr[i] != ''){
        if(i > 0 && arr[arr.length] != ' '){
        arr[i] = '-' + arr[i]
      }
        for(let j = 0; j < arr[i].length; j++) {
          if(arr[i].charAt(j) == '0') {
            
            if(arr[i].charAt(j+3) == '' || arr[i].charAt(j+3) == 0){
      
              this.temp += arr[i].substring(0, j)
              arr[i] = arr[i].substring(j+1, arr[i].length)
              j = 0
        
            }
            else{

              // this.fresharr.push(arr[i].substring(0, j) + arr[i].substring(j+1, j+2)) 
              this.temp += arr[i].substring(0, j) + arr[i].substring(j+1, j+2)
              arr[i] = arr[i].substring(j+2, arr[i].length)
              j = 0
            
            }

            if(j != arr[i].length){
              this.temp += '-'  
            }
          
          }
          if(j == arr[i].length-1) {

          // this.fresharr.push(arr[i].substring(0, j+1))
          this.temp += arr[i].substring(0, j+1)

        }
      }
    }
    }

    this.temp += '(' + length + ') '
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

  /////////////////////////////////////////////
  //--------------SPANISH--------------------//
  /////////////////////////////////////////////
  // onClickSpanish(index = 0) {
  //   if(index == this.putWordsIntoArray(this.sentence).length) {
  //     this.updateCalls()
  //   } else {          
  //     this.http.get("https://api.datamuse.com/words?sp=" + this.putWordsIntoArray(this.sentence)[index] + "&md=r&max=1&v=es&ipa=1").subscribe(response => {
  //       if(response[0]==null){
  //         this.IPAArr.push(this.putWordsIntoArray(this.sentence)[index])
  //       }
  //       else{
  //         this.IPAArr.push(response[0].tags[1].substring(9, response[0].tags[1].length))
  //         console.log(("abandonado").match(this.syllableRegex))
  //       }
  //       console.log(this.IPAArr[index])
  //       this.counter++
  //       this.onClickIPA(index + 1)
  //     })
  //   }
  // }  
  
//   onClickSpanish(index = 0) {
//     this.fresharr = []
//     this.temp = ''
//     if(index == this.putWordsIntoArray(this.sentence).length) {
//       this.updateCalls()
//     } else {
//       console.log(this.putWordsIntoArray(this.sentence)[index])
//       if(this.putWordsIntoArray(this.sentence)[index]!=' '){
//       this.freqWordsSpanishRef.child(this.putWordsIntoArray(this.sentence)[index]).once('value', (snapshot) => {
//         if(snapshot.val() != null){
//           this.splitArpabet(snapshot.val(), this.putWordsIntoArray(this.sentence)[index])
//           console.log("in db")
//         }
//         else {
//           this.http.get("https://api.datamuse.com/words?sp=" + this.putWordsIntoArray(this.sentence)[index] + "&md=r&max=1&v=es&ipa=1", { headers: this.headers }).subscribe(response => {
//             this.counter++
//             if(response[0]==null){
//               this.fresharr.push(this.putWordsIntoArray(this.sentence)[index])
//             }
//             else{
//               console.log("api call")
//               this.freqWordsSpanishRef.update({ [this.putWordsIntoArray(this.sentence)[index].toLocaleLowerCase()] : response[0].tags[0].substring(5, response[0].tags[0].length-1)})
//               this.splitArpabet(response[0].tags[0].substring(5, response[0].tags[0].length-1), this.putWordsIntoArray(this.sentence)[index])
//             }
//           })
//         }
//       })
//     }
//       this.onClickSpanish(index + 1)
//     }
//   }
// }

onClickSpanish(index = 0) {
  this.fresharr = []
  // // this.temp = ''
  // console.log(this.temp + " " + index)
  if(index == this.putWordsIntoArray(this.sentence).length) {
    this.updateCalls()
    this.splitArpabetCounter=0
    this.temp = ''
  } else {
    // console.log(index)
    this.freqWordsSpanishRef.child(this.putWordsIntoArray(this.sentence)[index]).once('value', (snapshot) => {
      if(snapshot.val() != null){
        this.splitArpabet(snapshot.val(), this.putWordsIntoArray(this.sentence).length)
        console.log("in db " + snapshot.val())
        this.onClickSpanish(index + 1)
      }
      else {
        this.http.get("https://api.datamuse.com/words?sp=" + this.putWordsIntoArray(this.sentence)[index] + "&md=r&max=1&ipa=1", { headers: this.headers }).subscribe(response => {
          this.counter++
          if(response[0]==null){
            this.splitArpabet(this.putWordsIntoArray(this.sentence)[index], this.putWordsIntoArray(this.sentence).length)
            this.onClickSpanish(index + 1)
          }
          else{
            this.freqWordsSpanishRef.update({ [this.putWordsIntoArray(this.sentence)[index].toLocaleLowerCase()] : response[0].tags[0].substring(5, response[0].tags[0].length-1)})
            this.splitArpabet(response[0].tags[0].substring(5, response[0].tags[0].length-1), this.putWordsIntoArray(this.sentence).length)
            console.log("api call " + response[0].tags[0].substring(5, response[0].tags[0].length-1))
            this.onClickSpanish(index + 1)
          }
        })
      }
    })
  }
}
}