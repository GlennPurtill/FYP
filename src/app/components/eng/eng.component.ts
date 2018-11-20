import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component'
import { Http }  from "@angular/http";
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'eng',
  templateUrl: './eng.component.html',
  styleUrls: ['./eng.component.css']
})
export class engComponent {
    
    constructor(private AppCom: AppComponent, private http: HttpClient){
    }
    
    onClickEnglish(index = 0){
        // // this.temp = ''
        if(index == this.AppCom.putWordsIntoArray(this.AppCom.sentence).length) {
          this.AppCom.updateCalls()
          this.AppCom.splitArpabetCounter=0
          this.AppCom.temp = ''
        } else {
          this.AppCom.freqWordsRef.child(this.AppCom.putWordsIntoArray(this.AppCom.sentence)[index]).once('value', (snapshot) => {
            if(snapshot.val() != null){
              this.AppCom.splitArpabet(snapshot.val(), this.AppCom.putWordsIntoArray(this.AppCom.sentence).length)
              console.log(snapshot.val())
              this.onClickEnglish(index + 1)
            }
            else {
              this.http.get("https://api.datamuse.com/words?sp=" + this.AppCom.putWordsIntoArray(this.AppCom.sentence)[index] + "&md=r&max=1&ipa=1", { headers: this.AppCom.headers }).subscribe(response => {
                this.AppCom.counter++
                if(response[0]==null){
                  this.AppCom.splitArpabet(this.AppCom.putWordsIntoArray(this.AppCom.sentence)[index], this.AppCom.putWordsIntoArray(this.AppCom.sentence).length)
                
                  this.onClickEnglish(index + 1)
                }
                else{
                  let val = response[0].tags[0].substring(5, response[0].tags[0].length-1)
                  let ruledArp = ''
                  for(let i = 0; i < val.length; i++){
                    
                      if(this.AppCom.arpabetRule.indexOf(val.charAt(i) + val.charAt(i+1)) >= 0){
                        ruledArp += this.AppCom.arpabetRuleSound[this.AppCom.arpabetRule.indexOf(val.charAt(i) + val.charAt(i+1))]
                        i++
                      }
                      else{
                        ruledArp += val.charAt(i)
                      }
                    
                  }
                  this.AppCom.freqWordsRef.update({ [this.AppCom.putWordsIntoArray(this.AppCom.sentence)[index].toLocaleLowerCase()] : ruledArp})
                  this.AppCom.splitArpabet(ruledArp, this.AppCom.putWordsIntoArray(this.AppCom.sentence).length)
                  this.onClickEnglish(index + 1)
                }
              })
            }
          })
        }
    }
    
}