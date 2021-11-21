import { Injectable } from '@angular/core';
import { CONNECTION } from '../global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestUserService {

  public uri:string;
  public user:any;
  public token:any;
  public role:any;
  public username:any;

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  public httpOptionsAuth = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    })
  };

  private extractData(res: Response){
    let body = res;
    return body || [] || {};
  }

  constructor(private http: HttpClient) { 
    this.uri = CONNECTION.URI;
  }

  getToken(){
    let token = localStorage.getItem('token')!;
    this.token = token;
    
    return token;
  }

  login(user: any){
    user.gettoken = "true";
    let params = JSON.stringify(user);
    return this.http.post<any>(`${this.uri}login`, params, this.httpOptions).pipe(map(this.extractData))
  }

  createCompany(user: any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    let params = JSON.stringify(user);
    return this.http.post<any>(`${this.uri}createCompany`, params, {headers: headers}).pipe(map(this.extractData))
  }

  getCompanys(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.get<any>(`${this.uri}getCompanys`, {headers: headers}).pipe(map(this.extractData))
  }

  getCompanyById(id:any){
    let user: any = localStorage.getItem('user');
    user = JSON.parse(user);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken(),
      'ID': id,
    });
    return this.http.get<any>(`${this.uri}getCompanyById`, {headers: headers}).pipe(map(this.extractData))
  }

  updateCompany(user: any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    let params = JSON.stringify(user);
    return this.http.put<any>(`${this.uri}updateCompany/${user._id}`, params, {headers: headers}).pipe(map(this.extractData))
  }

  deleteCompany(user: any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.delete<any>(`${this.uri}removeCompany/${user._id}`, {headers: headers}).pipe(map(this.extractData))
  }
}
