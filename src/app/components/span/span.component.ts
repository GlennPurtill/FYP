import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component'
import { Http }  from "@angular/http";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { WebService } from '../../../services/webservice'

@Component({
  selector: 'spanish',
  templateUrl: './span.component.html',
  styleUrls: ['./span.component.css']
})
export class spanComponent {
    constructor(private AppCom: AppComponent, private http: HttpClient, private ws: WebService){
    }

    onClickSpanish(index = 0) {
        if(index == this.AppCom.putWordsIntoArray(this.AppCom.sentence).length) {
          this.AppCom.updateCalls()
          this.AppCom.splitArpabetCounter = 0
          this.AppCom.temp = ''
        } else {
          this.AppCom.freqWordsSpanishRef.child(this.AppCom.putWordsIntoArray(this.AppCom.sentence)[index]).once('value', (snapshot) => {
            if(snapshot.val() != null){
              this.AppCom.splitArpabet(snapshot.val(), this.AppCom.putWordsIntoArray(this.AppCom.sentence).length)
              console.log("in db " + snapshot.val())
              this.onClickSpanish(index + 1)
            }
            else {
              this.http.get("https://api.datamuse.com/words?sp=" + this.AppCom.putWordsIntoArray(this.AppCom.sentence)[index] + "&md=r&max=1&ipa=1", { headers: this.AppCom.headers }).subscribe(response => {
                this.AppCom.counter++
                if(response[0]==null){
                  this.AppCom.splitArpabet(this.AppCom.putWordsIntoArray(this.AppCom.sentence)[index], this.AppCom.putWordsIntoArray(this.AppCom.sentence).length)
                  this.onClickSpanish(index + 1)
                }
                else{
                  this.AppCom.freqWordsSpanishRef.update({ [this.AppCom.putWordsIntoArray(this.AppCom.sentence)[index].toLocaleLowerCase()] : response[0].tags[0].substring(5, response[0].tags[0].length-1)})
                  this.AppCom.splitArpabet(response[0].tags[0].substring(5, response[0].tags[0].length-1), this.AppCom.putWordsIntoArray(this.AppCom.sentence).length)
                  this.onClickSpanish(index + 1)
                }
              })
            }
          })
        }
      }
      
      
      onClicktranslateSpan(){
       this.ws.transSpanish(this.AppCom.sentence).subscribe(res => {
        this.AppCom.sentence = JSON.stringify(res).replace('"','')
        this.AppCom.sentence = this.AppCom.sentence.replace('"','')
        this.onClickSpanish()
        })
       }
}