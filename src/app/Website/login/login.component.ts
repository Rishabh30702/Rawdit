import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  LoginCredential:any = {
    username:'',
    password:''
  }
  selectedOption: string = ''; // This will store the selected option
  options = [
    { value: 'mgmt', label: 'Management' },
    { value: 'admin', label: 'Admin' },
  ];

  constructor (private _route:Router){ }
  login(){
    if(this.LoginCredential.username == "mgmt" && this.LoginCredential.password == "mgmt1234" && this.selectedOption === 'mgmt'){
      Swal.fire({title:'Success',text:'Login Suucess',icon:'success'})
      this._route.navigateByUrl('/dashboard')
    }else if(this.LoginCredential.username == "admin" && this.LoginCredential.password == "admin1234" && this.selectedOption === 'admin'){
      Swal.fire({title:'Success',text:'Login Suucess',icon:'success'})
      this._route.navigateByUrl('/dashboard')
    }
    else{
      Swal.fire({title:'Failed',text:'Login Failed',icon:'error'})
    }

  }
}
