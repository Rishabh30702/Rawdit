import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransServiceService {

  baseUrl:string = "http://localhost:8081/trans/v1/"
  constructor(private _http:HttpClient) { }

   saveDate(data:any){
    return this._http.post(this.baseUrl+"save",data)
  }
  getAll(){
    return this._http.get(this.baseUrl+"getAll")
  }
  getTransactions(): Observable<any[]> {
    return this._http.get<any[]>(this.baseUrl + 'getAll'); // Adjust API route as needed
  }
}
