import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WebService {

    private baseURL = 'http://localhost:8080/api';
    private headers = new HttpHeaders().set('Content-Type', 'application/json');



    constructor(private http: HttpClient){ 
    }
    
    transSpanish(value) {
       return this.http.post(this.baseURL + '/transSpanish?data=' + value, null)
    }
    checkDB(value) {
        return this.http.post(this.baseURL + '/checkDB?data=' + value, null)
    }
    checkSpanDB(value){
        return this.http.post(this.baseURL + '/checkSpanDB?data=' + value, null)
    }
    apiCallSpan(value){
        return this.http.post(this.baseURL + '/apiCallSpan?data=' + value, null)
    }
    apiCallEng(value){
        return this.http.post(this.baseURL + '/apiCallEng?data=' + value, null)
    }
    splitToPronun(value){
        return this.http.post(this.baseURL + '/splitToPronun?data=' + value, null)
    }
    updateAPICalls(value){
        return this.http.post(this.baseURL + '/updateAPICalls?data=' + value, null)
    }   
}