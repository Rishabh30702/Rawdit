import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { TransServiceService } from "../dashboard/Services/trans-service.service"

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  description:string = ''
  amount:number = 0
  type:string=''
  date:string=''
  transaction:any = [{
    date:'Date',
    desc:"Desc",
    amount:"Amt",
    type:"Type",
  }]
  constructor (private _transService:TransServiceService) { }
  ngOnInit(): void {
    this.GetAllData()
  }

  TransactionComplete(){
    let data = {
      trans_id:Math.floor(Math.random() * 10000+10),
      trans_date:this.date,
      trans_amount:this.amount,
      trans_desc:this.description,
      trans_type:this.type
    } 
    this._transService.saveDate(data).subscribe((res:any)=>{
      if(res){
      this.date = ""
      this.amount = 0
      this.description = ""
      this.type = ""
      this.addTransaction(data);
        Swal.fire({
          title:'success',
          text:'Transaction saved success.',
          icon:'success'
        })
      }else {
        Swal.fire({
          title:'Failed',
          text:'Transaction Failed.',
          icon:'error'
        })
      }
    })
   

  }
  GetAllData(){
    this._transService.getAll().subscribe((res: any) => {
      if (res) {
        this.transaction = res.map((item: any) => ({
          date: item.trans_date,
          desc: item.trans_desc,
          amount: item.trans_amount,
          type: item.trans_type,
        }));
      }
    });
    this.transaction.reverse();
  }
  addTransaction(newTransaction: any) {
    this.transaction.unshift({
      date: newTransaction.trans_date,
      desc: newTransaction.trans_desc,
      amount: newTransaction.trans_amount,
      type: newTransaction.trans_type,
    });
  }
}
