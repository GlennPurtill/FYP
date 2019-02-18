import { Component, OnInit, Inject} from '@angular/core'
import { Http }  from "@angular/http"
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { WebService } from '../services/webservice'
import { MatSnackBar } from '@angular/material'
import { MatSnackBarModule } from '@angular/material'

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
declare var firebase: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {


  //Particles start
  myStyle: object = {};
  myParams: object = {};
  width: number = 100;
  height: number = 100;

  ngOnInit() {
      this.myStyle = {
          'position': 'fixed',
          'width': '100%',
          'height': '100%',
          'z-index': -1,
          'top': 0,
          'left': 0,
          'right': 0,
          'bottom': 0,
          'background-color': '#b61924'
      };

    this.myParams = {
            particles: {
                number: {
                    value: 50,
                },
                color: {
                    value: '#ffffff'
                },
                shape: {
                    type: 'triangle',
                },
        }
    };
  }
  //Particles end

  sentence = ''
  counter = 0
  fresharr = []
  temp = ''
  data= ''
  TAMode = 'Pick a mode above'
  mode = ''
  pronunSentence = ''
  arraypron = []
  arraynor = []
  translatedSpanishArr = []
  arpabetRule = ['AE','AO','AY','EY','UW','HH','HAH','EH','AA','DH','OW','TH','ER','IH','AH','AW']
  arpabetRuleSound = ['AH','AW','IY','AY','EW','H','HA','AY','AW','D','(O)','T','UR','I','A', 'OWE']
  pronunColors = ['rgb(118, 45, 215)','rgb(50, 215, 45)','rgb(45, 50, 215)','#78A182','#C3E3CB','#E3E1C3','#5A583E','#9D2F2F','#9D9D2F','#2F959D','#A9C0C1','#B23C9A','#2DA4D7']
  splitArpabetCounter = 0
  translatedSpanish = ''
  freqWordsRef = firebase.database().ref('/freqwords');
  freqWordsSpanishRef = firebase.database().ref('/freqwordsspanish');
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient, private webService: WebService, private db : AngularFireDatabase, private snackBar: MatSnackBar) {
  }
  onKey(event: any) { 
    this.sentence = event.target.value;
  }
  
  ranNum(){
    return Math.floor(Math.random() * this.pronunColors.length-1)
  }

  speakFullSentence(){
    this.webService.speakEn(this.sentence).subscribe(res => {
      console.log("done");
    })
  }

  getColor(i) {
    return this.pronunColors[i%this.pronunColors.length]
  }

  divClicked(i){
    if(this.mode == "span" || this.mode == "engspan"){

      this.webService.speakEs(this.arraynor[i]).subscribe(res => {
        console.log("done");
     })

    }
    else {

       this.webService.speakEn(this.arraynor[i]).subscribe(res => {
          console.log("done");
       })
       
    }
   
  }
  submit(){
    this.translatedSpanish = ''
    this.temp = ''
    this.fresharr = []
    switch (this.mode){
      case 'eng': 
        this.onClickEnglish()
        document.getElementById("overlay").style.display = "block";
        break;
      case 'span':
        this.onClickSpanish()
        document.getElementById("overlay").style.display = "block";
        break;
      case 'engspan':
        this.onClicktranslateSpan()
        document.getElementById("overlay").style.display = "block";
        break;
      case '':
      let snackBarRef = this.snackBar.open('Please pick a mode!', 'Close', {
        duration: 3000
      });
        break;
    }
  }

  RBchange(val){
    this.mode = val
    switch (val){
      case 'eng':
        this.TAMode = 'Enter English'
        break;
      case 'span':
        this.TAMode = 'Enter Spanish'
        break;
      case 'engspan':
        this.TAMode = 'Enter English to translate to Spanish'
        break;
    }
    console.log(this.mode)
  }

  // updateCalls(){
  //   this.webService.updateAPICalls(this.counter).subscribe(res => {
  //     this.counter = 0
  //   })
  // }

  checkWordAmount(sentence){  
    var numWords = sentence.replace(/^\s+|\s+$/g,"").split(/\s+/).length;
    return numWords;
  } 

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

  splitToPronun(){
    this.webService.splitToPronun(this.fresharr.toString()).subscribe(res => {
      console.log(res)
      let temparray = res.toString().toLowerCase()
      this.arraypron = temparray.split(" ")
      this.arraynor = this.sentence.split(" ")
      this.arraypron.pop()
      console.log(this.arraypron)
      document.getElementById("modalOpenButton").click();
      document.getElementById("overlay").style.display = "none";  
      document.getElementById("overlay").style.animation = "fadeOut 1s";
    })
  }
  onClickEnglish(index = 0) {
      if(index == this.putWordsIntoArray(this.sentence).length) {
        this.splitArpabetCounter=0
        this.splitToPronun()
        this.temp = ''
        this.fresharr = []
      } else {
        this.freqWordsRef.child(this.putWordsIntoArray(this.sentence)[index]).once('value', (snapshot) => {
          if(snapshot.val() != null){
            this.fresharr.push(snapshot.val())
            console.log(snapshot.val())
            this.onClickEnglish(index + 1)
          }
          else {
            this.http.get("https://api.datamuse.com/words?sp=" + this.putWordsIntoArray(this.sentence)[index] + "&md=r&max=1&ipa=1", { headers: this.headers }).subscribe(response => {
              this.counter++
              if(response[0]==null){
                this.fresharr.push(this.putWordsIntoArray(this.sentence)[index])
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
                this.fresharr.push(ruledArp);
                this.onClickEnglish(index + 1)
              }
            })
          }
        })
      }
    }
  

  // onClickEnglish(index = 0) {     
  //     if(index == this.putWordsIntoArray(this.sentence).length) {
  //       this.splitToPronun()
  //       // this.updateCalls()
  //       this.splitArpabetCounter=0
  //       this.temp = ''
  //       this.fresharr = []
  //     } else {
  //       this.webService.checkDB(this.putWordsIntoArray(this.sentence)[index]).subscribe(res => {
  //         if(res != null){
  //           // this.splitArpabet(res, this.putWordsIntoArray(this.sentence).length)
  //           this.fresharr.push(res);
  //           console.log(res)
  //           this.onClickEnglish(index + 1)
  //         }
  //         else {
  //           this.webService.apiCallEng(this.putWordsIntoArray(this.sentence)[index]).subscribe(res => {
  //             this.counter++
  //             if(res==null){
  //               // this.splitArpabet(this.putWordsIntoArray(this.sentence)[index], this.putWordsIntoArray(this.sentence).length)
  //               this.fresharr.push(this.putWordsIntoArray(this.sentence)[index]);
  //               this.onClickEnglish(index + 1)
  //             }
  //             else{
  //               let val = res.toString()
  //               let ruledArp = ''
  //               for(let i = 0; i < val.length; i++){
                  
  //                   if(this.arpabetRule.indexOf(val.charAt(i) + val.charAt(i+1)) >= 0){
  //                     ruledArp += this.arpabetRuleSound[this.arpabetRule.indexOf(val.charAt(i) + val.charAt(i+1))]
  //                     i++
  //                   }
  //                   else{
  //                     ruledArp += val.charAt(i)
  //                   }
                  
  //               }
  //               this.freqWordsRef.update({ [this.putWordsIntoArray(this.sentence)[index].toLocaleLowerCase()] : ruledArp})
  //               // this.splitArpabet(ruledArp, this.putWordsIntoArray(this.sentence).length)
  //               this.fresharr.push(ruledArp);
  //               this.onClickEnglish(index + 1)
  //             }
  //           })
  //         }
  //       })
  //     }
  //   }
  

    onClickSpanish(index = 0) {
      if(index == this.putWordsIntoArray(this.sentence).length) {
        // this.updateCalls()
        this.splitToPronun()
        this.splitArpabetCounter = 0
        this.temp = ''
      } else {
        this.freqWordsSpanishRef.child(this.putWordsIntoArray(this.sentence)[index]).once('value', (snapshot) => {
          if(snapshot.val() != null){
            this.fresharr.push(snapshot.val());
            this.onClickSpanish(index + 1)
          }
          else {
            this.http.get("https://api.datamuse.com/words?sp=" + this.putWordsIntoArray(this.sentence)[index] + "&md=r&v=es&max=1&ipa=1", { headers: this.headers }).subscribe(response => {
              this.counter++
              if(response[0]==null){
                this.fresharr.push(this.putWordsIntoArray(this.sentence)[index]);
                this.onClickSpanish(index + 1)
              }
              else{
                this.freqWordsSpanishRef.update({ [this.putWordsIntoArray(this.sentence)[index].toLocaleLowerCase()] : response[0].tags[0].substring(5, response[0].tags[0].length-1)})
                this.fresharr.push(response[0].tags[0].substring(5, response[0].tags[0].length-1));
                this.onClickSpanish(index + 1)
              }
            })
          }
        })
      }
    }
    
    
    onClicktranslateSpan(){
      this.webService.transSpanish(this.sentence).subscribe(res => {
      this.sentence = JSON.stringify(res).replace('"','')
      this.sentence = this.sentence.replace('"','')
      this.translatedSpanish = this.sentence
      console.log(this.translatedSpanishArr)
      // document.getElementById("pronunSpan").style.visibility = "visible"
      this.onClickSpanish()
      })
     }
}

