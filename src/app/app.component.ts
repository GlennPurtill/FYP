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

declare function speakEnglish(content) : any;
declare function speakSpanish(content) : any;
declare function speakFullSpanish(content) : any;
declare function speakFullEnglish(content) : any;
declare function start() : any;
declare function end(db,api,n) : any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger("zoomIcon", [
      state('original', style({
        transform: "scale(1)"
      })),
      state('zoomed', style({
        transform: "scale(1.1)"
      })),

      transition('original => zoomed', animate("200ms")),
      transition('zoomed => original', animate("200ms ease-in"))
    ])
  ]
})
export class AppComponent {

  zoomState1 = "original"
  zoomState2 = "original"
  zoomState3 = "original"


  language = "English"
  sentence = ''
  initialSentence
  counter = 0
  fresharr = []
  temp = ''
  trig = ''
  data= ''
  TAMode = 'Pick a mode above'
  mode = ''
  pronunSentence = ''
  arraypron = []
  arraynor = []
  placeholder = 'Enter English'
  translatedSpanishArr = []
  arpabetRule = ['AE','AO','AY','EY','UW','HH','HAH','EH','AA','DH','OW','TH','ER','IH','AH','AW']
  arpabetRuleSound = ['AH','AW','IY','AY','EW','H','HA','AY','AW','D','(O)','T','UR','I','A', 'OWE']
  arpabetRuleSpan = ['EH','TH','AA','RH']
  arpabetRuleSoundSpan = ['AY','T','A','R']
  pronunColors = ['#EEEEEE','#A7CECB','#9FB4C7','#759EB8','#C3E3CB','#EEEEFF','#A7CECB','#9FB4C7','#759EB8','#28587B','#D9D9E8','#89A9A7','#748391','#567386','#1E415A']
  splitArpabetCounter = 0
  translatedSpanish = ''
  freqWordsRef = firebase.database().ref('/freqwords');
  freqWordsSpanishRef = firebase.database().ref('/freqwordsspanish');
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  areinDB = 0
  apiCALL = 0

  constructor(private http: HttpClient, private webService: WebService, private db : AngularFireDatabase, private snackBar: MatSnackBar) {
  }

  ngOnInit(){
    if(document.cookie){
      document.cookie = 'visted'
      console.log("here " + document.cookie)
      document.getElementById('modalOpenButton3').click()
    }

    
  }

  toggleZoomState(x) {
    switch(x) {
      case 1: this.zoomState1 = this.zoomState1 == "original" ? "zoomed" : "original"; break;
      case 2: this.zoomState2 = this.zoomState2 == "original" ? "zoomed" : "original"; break;
      case 3: this.zoomState3 = this.zoomState3 == "original" ? "zoomed" : "original"; break;
    }
    
  }

  onLangToggle() {
    switch(this.language) {
      case "English": this.language = "Spanish"; this.placeholder = "Enter Spanish" ; break; 
      case "Spanish": this.language = "English" ; this.placeholder = "Enter English";  break;
    }
  }
  
  ranNum(){
    return Math.floor(Math.random() * this.pronunColors.length-1)
  }
  checkDisabledSpan(){
    this.checkTriggered()
    if(this.language == "Spanish"){
      document.getElementById('engBut').style.opacity= '0.3';
      document.getElementById('engSpanBut').style.opacity= '0.3';
      document.getElementById('spanBut').style.opacity= '1';
      return "yes";
    }
  }
  checkDisabledEng(){
    this.checkTriggered()
    if(this.language == "English"){
      document.getElementById('spanBut').style.opacity= '0.3';
      document.getElementById('engBut').style.opacity= '1';
      document.getElementById('engSpanBut').style.opacity= '1';
      return "yes";
    }
  }

  speakFullSentence(){
    if(this.mode == "engspan" || this.mode == "span"){
      speakFullSpanish(this.sentence)
    }
    else {
      speakFullEnglish(this.sentence)
    }
  }

  getColor(i) {
    return this.pronunColors[i%this.pronunColors.length]
  }

  divClicked(i){
    if(this.mode == "span" || this.mode == "engspan"){
      speakSpanish(this.arraynor[i])
    }
    else {
       speakEnglish(this.arraynor[i])
    }
   
  }

  undo() {
    if(this.initialSentence != undefined){
      this.trig = ""
      document.getElementById("ta")['value'] = this.initialSentence
    }
    
  }

  checkTriggered(){
    if(this.trig == "triggered"){
      document.getElementById('undoBut').style.opacity= '1';
      document.getElementById('downBut').style.opacity= '1';
      document.getElementById('speakBut').style.opacity= '1';
    }
    else {
      document.getElementById('undoBut').style.opacity= '0.2';
      document.getElementById('downBut').style.opacity= '.2';
      document.getElementById('speakBut').style.opacity= '.2';
    }
  }

  fixSentence(t){
    this.trig = "triggered"
    this.initialSentence = this.sentence
    //1
    this.sentence = this.sentence.replace(/[^\w\s]/gi, '').replace(/  +/g, ' ')
    //2
    this.mode = t
    if(this.sentence.charAt(0)==" "){
      this.sentence = this.sentence.substring(1, this.sentence.length)
    }
    //3
    if(!(/^[a-zA-Z]+$/.test(this.sentence.charAt(this.sentence.length-1)))){
      this.sentence = this.sentence.substring(0, this.sentence.length-1)
    }
    //4
    this.submit()
  }


  submit(){
    this.translatedSpanish = ''
    this.temp = ''
    this.fresharr = []

    // speakEnglish()
    // console.log(('this .  is great').replace(/  +/g, ' ').replace(/[^\w\s]/gi, ''))

    switch (this.mode){
      case 'eng': 
        this.onClickEnglish()
        // document.getElementById("overlay").style.display = "block";
        break;
      case 'span':
        this.onClickSpanish()
        // document.getElementById("overlay").style.display = "block";
        break;
      case 'engspan':
        this.onClicktranslateSpan()
        // document.getElementById("overlay").style.display = "block";
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
    // console.log(this.mode)
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
        document.getElementById("ta")['value'] = res.toString().toLowerCase()
      })
    }
  

  onClickEnglish(index = 0) {
    // console.log(this.sentence.replace(/[^\w\s]/gi, '').replace(/  +/g, ' '))
      if(index == this.putWordsIntoArray(this.sentence).length) {
        this.splitArpabetCounter=0
        this.splitToPronun()
        this.temp = ''
        this.fresharr = []
      } else {
        // console.log(this.sentence[index])
        this.freqWordsRef.child(this.putWordsIntoArray(this.sentence)[index]).once('value', (snapshot) => {
          if(snapshot.val() != null){
            this.areinDB++
            this.fresharr.push(snapshot.val())
            // console.log(snapshot.val())
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
                this.apiCALL++
                this.onClickEnglish(index + 1)
              }
            })
          }
        })
      }
    }
  


  

    onClickSpanish(index = 0) {
      if(index == this.putWordsIntoArray(this.sentence).length) {
        // this.updateCalls()
        this.splitToPronun()
        this.splitArpabetCounter = 0
        this.temp = ''
      } else {
        // console.log("in else")
        this.freqWordsSpanishRef.child(this.putWordsIntoArray(this.sentence)[index].toLowerCase()).once('value', (snapshot) => {
          // console.log(snapshot.val())

          if(snapshot.val() != null){
            this.areinDB++
            this.fresharr.push(snapshot.val());
            this.onClickSpanish(index + 1)
          }
          else {
            // console.log('api call')
            this.http.get("https://api.datamuse.com/words?sp=" + this.putWordsIntoArray(this.sentence)[index] + "&md=r&v=es&max=1&ipa=1", { headers: this.headers }).subscribe(response => {
              this.counter++
              if(response[0]==null){
                this.fresharr.push(this.putWordsIntoArray(this.sentence)[index]);
                this.onClickSpanish(index + 1)
              }
              else{
                let val = response[0].tags[0].substring(5, response[0].tags[0].length-1)
                let ruledArp = ''
                for(let i = 0; i < val.length; i++){
                  
                    if(this.arpabetRuleSpan.indexOf(val.charAt(i) + val.charAt(i+1)) >= 0){
                      ruledArp += this.arpabetRuleSoundSpan[this.arpabetRuleSpan.indexOf(val.charAt(i) + val.charAt(i+1))]
                      i++
                    }
                    else{
                      ruledArp += val.charAt(i)
                    }
                  // console.log(ruledArp)
                }
                this.freqWordsSpanishRef.update({ [this.putWordsIntoArray(this.sentence)[index].toLocaleLowerCase()] : ruledArp})
                this.fresharr.push(ruledArp);
                this.apiCALL++
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
      // document.getElementById("pronunSpan").style.visibility = "visible"
      this.onClickSpanish()
      })
     }

     download() {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.pronunSentence));
        element.setAttribute('download', 'pronunciations');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
     }
}

