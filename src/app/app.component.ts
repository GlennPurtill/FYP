import { Component, OnInit } from '@angular/core';
import { Http }  from "@angular/http";
import { HttpClient} from '@angular/common/http';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { WebService } from '../services/webservice';
declare var firebase: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sentence = ''
  IPAArr = []
  curWord = ''
  counter = 0
  utc = String(new Date().toJSON().slice(0,10).replace(/-/g,''))
  users: User[] = [];
  constructor(private http: HttpClient, private webService: WebService, private db : AngularFireDatabase) {
  }
  // ngOnIt(){
  //   console.log("onit")
  //   var x = this.db.list('users');
  //   x.snapshotChanges().subscribe(item => {
  //     item.forEach(element=>{
  //       var y = element.payload.toJSON();
  //       y["$key"] = element.key;
  //       this.users.push(y as User);
  //       console.log(y);
  //     });
  //   });
  // }

  onKey(event: any) { // without type info
    this.sentence = event.target.value;
  }

  //gets IPA by api call
  onClickIPA(index = 0) {
    if(index == this.putWordsIntoArray(this.sentence).length) {
      this.updateCalls()
      this.changeFromIPAToPronunciation(this.IPAArr)
    } else {          
      this.http.get("https://api.datamuse.com/words?sp=" + this.putWordsIntoArray(this.sentence)[index] + "&md=r&max=1&ipa=1").subscribe(response => {
      this.IPAArr.push(response[0].tags[1].substring(9, response[0].tags[1].length))
      // console.log(this.putWordsIntoArray(this.sentence)[index])
      // console.log(this.IPAArr[index]) 
      this.counter++
      this.onClickIPA(index + 1)
      })
    }
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

  // checkDBForWord(word){
  //   let freqWordsRef =  firebase.database().ref('/freqwords');
  //   freqWordsRef.child(word).once('value', (snapshot) => {
  //     if(snapshot.val() != null){
  //       console.log(snapshot.val())
  //       this.curWord = snapshot.val()
  //       return true
  //     }
  //   })
  //   return false
  // }

  //checks how many words are in the inputted string
  checkWordAmount(sentence){  
    var numWords = sentence.replace(/^\s+|\s+$/g,"").split(/\s+/).length;
    return numWords;
  } 

  //puts words from input into an array
  putWordsIntoArray(sentence){
    var arr =this.sentence.split(' ');
    return arr;
  }

  //takes in IPAArr and changes to pronunciation
  changeFromIPAToPronunciation(IPAArr){

    // Arrays for vowels; symbols and sounds
    let IPAVowelSymbolArr = ['i','y','ɪ','Y','u','e','o','a','ɨ','ʉ','ɯ','ʊ', 
    'ø','ɘ','ɵ','ɤ','ə','ɛ','œ','ɝ','ɞ','ʌ','ɔ','æ','ɐ','ɑ','ä','ɒ']
    let IPAVowelSoundArr = ['ee','ewy','ih','uw','uw','ey','o','a','TBC','uw','uw','uw',
    'uh','a','ow','uw','uh','ey','ehw','ur','TBX','uw','aw','ah','hu','ow','he','aw']

    // Arrays for Consonants; symbols and sounds
    let IPAConsonantsSymbolArr = ['ð','θ','ʃ','ʒ','ŋ','ɫ']
    let IPAConsonantsSoundArr = ['d','th','sh','j','ng','l']

    
    let IPADiSymbolArr = ['aɪ','eɪ','ɔɪ','oʊ','aʊ']
    let IPADiSoundArr = ['iy','ey','oi','ow','ow']
    let newSent = ''
    let newPronunArr = []

    for(let y = 0; y < IPAArr.length; y++){ //Indexing IPAArr value
      for(let i = 0; i < IPAArr[y].length; i++){ //Loops through each char
        if(IPADiSymbolArr.indexOf(IPAArr[y].charAt(i) + IPAArr[y].charAt(i+1)) >= 0){ //Checks two symbols together
          newSent = newSent + IPADiSoundArr[IPADiSymbolArr.indexOf(IPAArr[y].charAt(i) + IPAArr[y].charAt(i+1))]
          i++
        }
        else {
          if(IPAVowelSymbolArr.indexOf(IPAArr[y].charAt(i)) >= 0){ //Check if symbol is vowel
            newSent = newSent + IPAVowelSoundArr[IPAVowelSymbolArr.indexOf(IPAArr[y].charAt(i))]
          }
          else if(IPAArr[y].charAt(i) == "ˈ"){ //Keeps '
            newSent = newSent
          }
          else if(IPAConsonantsSymbolArr.indexOf(IPAArr[y].charAt(i)) >= 0){ //If constant
            newSent = newSent + IPAConsonantsSoundArr[IPAConsonantsSymbolArr.indexOf(IPAArr[y].charAt(i))] 
          }
          else{ //if normal consonant just add it
            newSent = newSent + IPAArr[y].charAt(i)
          }
        }
      }
      newPronunArr.push(newSent)
      newSent = " " //adds space after every work.
    }
    console.log(newPronunArr);
    this.splitIntoSounds(this.IPAArr, newPronunArr)
    this.IPAArr = []
  }
  
  splitIntoSounds(newIPAArr, pronunArr){
    // console.log(pronunArr)
    // console.log(newIPAArr)
    // for(let i = 0; i < newIPAArr; i++){
      
    // }
  }
    
}
 interface User {
   name: string;
   lastName: string;
   state: string;
 }