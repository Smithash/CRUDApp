import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

export const environment = {
  production: false,
  server: "localhost"
};

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  dataUrl = 'http://' + environment.server + ':8080'
  constructor(private http: HttpClient) {

  }
  //http://localhost:8080/api/driver/api/driver
  getUsers(): Observable<any> {
    return this.http.get(`${this.dataUrl}/api/driver`);
  }

  updateUser(form: any): Observable<any>{
    let headers: HttpHeaders = new HttpHeaders({
      'Authorization': 'Basic RG9yaW5hMTIzOk9sbHkxODEy'
    });
    return this.http.put(`${this.dataUrl}/api/driver`,form,{headers:headers});
  }

  createUser(form: any): Observable<any>{
    return this.http.post(`${this.dataUrl}/api/driver`,form);
  }

}
