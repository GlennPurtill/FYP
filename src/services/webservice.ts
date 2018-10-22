import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WebService {

    private baseURL = 'http://localhost:8080/api';
    private headers = new HttpHeaders().set('Content-Type', 'application/json');


    constructor(private http: HttpClient){ }
    
    test(value) {
       console.log("posting " + value)
       return this.http.post(this.baseURL + '/test', value, {headers: this.headers}).subscribe(response =>{
           console.log(response)
        })
    }
}