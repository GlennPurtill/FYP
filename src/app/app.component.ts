import { Component, OnInit } from '@angular/core';
import { Http }  from "@angular/http";
import { HttpClient} from '@angular/common/http';
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
  IPAArr = []
  IPADiSymbolArr = ['aɪ','eɪ','ɔɪ','oʊ','aʊ','ti']
  curWord = ''
  counter = 0
  IPASentence = ''
  splitArr = []
  utc = String(new Date().toJSON().slice(0,10).replace(/-/g,''))
  constructor(private http: HttpClient, private webService: WebService, private db : AngularFireDatabase, private snackBar: MatSnackBar) {
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
        if(response[0]==null){
          this.IPAArr.push(this.putWordsIntoArray(this.sentence)[index])
        }
        else{
          let tempPronun = response[0].tags[0].substring(5, response[0].tags[0].length-1)
          let tempIPA = response[0].tags[1].substring(9, response[0].tags[1].length).replace("ˈ","")
          let tempSplitIPA = ''
          let counter = 0

          console.log(tempPronun)
          console.log(tempIPA)
          for(let i = 0; i < tempPronun.length; i++){
            if(tempPronun.charAt(i)==' '){
              if(tempPronun.charAt(i-1) == 1 || tempPronun.charAt(i-1) == 0){
                  if(this.IPADiSymbolArr.indexOf(tempIPA.charAt(counter) + tempIPA.charAt(counter+1)) >= 0){
                    tempSplitIPA = tempSplitIPA + tempIPA.charAt(counter) + tempIPA.charAt(counter+1)
                    console.log("Is a DI" + tempIPA.charAt(counter) + tempIPA.charAt(counter+1))
                    if(counter != 0){
                      tempSplitIPA = tempSplitIPA + tempIPA.charAt(counter) + "-"
                    }
                    counter = counter + 2
                  }
                  else{
                    tempSplitIPA = tempSplitIPA + tempIPA.charAt(counter)
                    console.log("has a 1|0  in i-1" + tempIPA.charAt(counter))
                    if(counter != 0){
                      tempSplitIPA = tempSplitIPA + tempIPA.charAt(counter) + "-"
                    }
                    counter++
                  } 
              }
              else{
                tempSplitIPA = tempSplitIPA + tempIPA.charAt(counter)
                console.log("is a normal letter" + tempIPA.charAt(counter))
                counter++
                
              }
            }
            if(i == tempPronun.length-1){
              console.log("in the last letter " + tempIPA.charAt(counter))
              tempSplitIPA = tempSplitIPA + tempIPA.charAt(counter)
            }
            console.log(counter + " " + i)
          }
          console.log(tempSplitIPA)
          this.IPAArr.push(tempSplitIPA)
          // this.splitArr.push(response[0].tags[0].substring(5, response[0].tags[0].length-1))
        }
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
    let IPAVowelSoundArr = ['ee','ewy','é','uw','uw','ey','o','a','TBC','uw','uw','uw',
    'uh','a','ow','uw','uh','eh','ehw','ur','TBX','uw','aw','ah','hu','ow','he','aw']

    // Arrays for Consonants; symbols and sounds
    let IPAConsonantsSymbolArr = ['ð','θ','ʃ','ʒ','ŋ','ɫ']
    let IPAConsonantsSoundArr = ['d','th','sh','j','ng','l']
    

    let IPADiSoundArr = ['(i)','(a)','oi','ó','ow','t']
    let newSent = ''
    let newPronunArr = []
    let tempSplitArr = []

    for(let y = 0; y < IPAArr.length; y++){ //Indexing IPAArr value
      for(let i = 0; i < IPAArr[y].length; i++){ //Loops through each char
        if(this.IPADiSymbolArr.indexOf(IPAArr[y].charAt(i) + IPAArr[y].charAt(i+1)) >= 0){ //Checks two symbols together
          newSent = newSent + IPADiSoundArr[this.IPADiSymbolArr.indexOf(IPAArr[y].charAt(i) + IPAArr[y].charAt(i+1))] 
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
      newSent = " "
    }
    // console.log(newPronunArr);
    this.IPASentence = newPronunArr.join(" ")
    this.IPAArr = []
    this.splitArr = []
    // console.log(newSent)
  }

  /////////////////////////////////////////////
  //--------------SPANISH--------------------//
  /////////////////////////////////////////////
  onClickSpanishIPA(index = 0) {
    if(index == this.putWordsIntoArray(this.sentence).length) {
      this.updateCalls()
      this.changeFromIPAToPronunciation(this.IPAArr)
    } else {          
      this.http.get("https://api.datamuse.com/words?sp=" + this.putWordsIntoArray(this.sentence)[index] + "&md=r&max=1&v=es&ipa=1").subscribe(response => {
        if(response[0]==null){
          this.IPAArr.push(this.putWordsIntoArray(this.sentence)[index])
          // this.snackBar.open('Form sent', 'close', {duration: 5000});
        }
        else{
          this.IPAArr.push(response[0].tags[1].substring(9, response[0].tags[1].length))
        }
        console.log(this.IPAArr[index])
        this.counter++
        this.onClickIPA(index + 1)
      })
    }
  }   
}