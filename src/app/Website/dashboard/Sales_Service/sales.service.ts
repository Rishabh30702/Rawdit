import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

 baseUrl:string = "http://localhost:8081/sales/v1/"
  constructor(private _http:HttpClient) { }
  saveBill(data:any){
    return this._http.post(this.baseUrl+"save",data);
  }
  getAll(){
    return this._http.get(this.baseUrl+"getAll");
  }
}
