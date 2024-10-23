import { Component, OnInit } from '@angular/core';
import { SalesService } from '../dashboard/Sales_Service/sales.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  bill_no:string = ""
  item_name:string = ""
  desc:string = ""
  amount:number = 0
  bill:any = [{
    bill_no:'Bill No',
    item_name:"Item Name",
    desc:"Description",
    amount:"Amount",
  }]

  constructor (private _sales_service:SalesService){}
  ngOnInit(): void {
    this.GetAllData()
  }
  SaveBill() {
    // Get the current date
    const currentDate = new Date();
    
    // Format the date to yyyy-mm-dd
    const formattedDate = currentDate.toISOString().split('T')[0]; // Gets the date in yyyy-mm-dd format
  
    // Prepare the data object
    let data = {
      bill_No: this.bill_no,
      item_Name: this.item_name,
      item_Desc: this.desc,
      amount: this.amount,
      bill_date: formattedDate // Include the formatted date
    };
  
    // Save the bill to the backend
    this._sales_service.saveBill(data).subscribe((res: any) => {
      if (res) {
        // Reset form fields
        this.bill_no = "";
        this.desc = "";
        this.item_name = "";
        this.amount = 0;
  
        // Optionally add a transaction here, if applicable
        this.addTransaction(data);
        
        // Show success message
        Swal.fire({ text: 'Bill Saved.', title: 'Success', icon: 'success' });
      } else {
        // Show error message
        Swal.fire({ text: 'Saving Failed.', title: 'Failed.', icon: 'error' });
      }
    });
  }
  
  GetAllData(){
    this._sales_service.getAll().subscribe((res: any) => {
      if (res) {
        this.bill = res.map((item: any) => ({
          bill_no: item.bill_No,
          desc: item.item_Desc,
          amount: item.amount,
          item_name: item.item_Name,
        }));
      }
    });
    this.bill.reverse();
  }

  addTransaction(newTransaction: any) {
    this.bill.unshift({
    bill_no: newTransaction.bill_No,
    item_name: newTransaction.item_Name,
    desc: newTransaction.item_Desc,
    amount: newTransaction.amount,
    });
  }
}
