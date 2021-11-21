import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CONNECTION } from '../global';

@Injectable({
  providedIn: 'root'
})
export class RestProductService {

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

  getProducts(type: any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.get<any>(`${this.uri}getProducts/${type}`, {headers: headers}).pipe(map(this.extractData))
  }

  addProduct(user: any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    let params = JSON.stringify(user);
    return this.http.put<any>(`${this.uri}addProduct`, params, {headers: headers}).pipe(map(this.extractData))
  }

  updateProduct(user: any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    let params:any = JSON.stringify(user);
    return this.http.put<any>(`${this.uri}updateProduct/${user._id}`, params, {headers: headers}).pipe(map(this.extractData))
  }

  removeProduct(data:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    let params:any = JSON.stringify(data);
    return this.http.put<any>(`${this.uri}removeProduct/${data._id}`, params, {headers: headers}).pipe(map(this.extractData))
  }

  buyProduct(stock: any, id: string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    let params = JSON.stringify(stock);
    return this.http.put<any>(`${this.uri}buyProduct/${id}`, {stock: stock}, {headers: headers}).pipe(map(this.extractData))
  }

  sendOffice(data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    let params = JSON.stringify(data);
    return this.http.put<any>(`${this.uri}sendProduct/${data.product}`, {data: data}, {headers: headers}).pipe(map(this.extractData))
  }

  sellProduct(data: any) {
    console.log('data: ', data);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken(),
      'ID': data.idCompany
    });
    let params = JSON.stringify(data);
    return this.http.put<any>(`${this.uri}sellProduct/${data.data._id}`, {data: data.data}, {headers: headers}).pipe(map(this.extractData))
  }

  getProductsMoreSelled(type: any) {
    let user:any = localStorage.getItem('user');
    user = JSON.parse(user);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken(),
      'ID': user._id
    });
    return this.http.get<any>(`${this.uri}getProductsMoreSelled/${type}`, {headers: headers}).pipe(map(this.extractData))
  }
}
