import { Component, OnInit } from '@angular/core';
import { TransServiceService } from './Services/trans-service.service';
import { Chart } from 'chart.js';
import { SalesService } from './Sales_Service/sales.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  expense:string=''
  income:string=''
  myChart: Chart | undefined;
  myExChart: Chart<'pie', number[], string> | undefined;
  mySalesChart: Chart | undefined;
  currentSalesDate: string = new Date().toISOString().split('T')[0];
  currentDateSales: string = '';
  transaction:any = [{
    date:'Date',
    desc:"Desc",
    amount:0,
    type:"Type",
  }]
  bill:any = [{
    bill_no:'Bill No',
    item_name:"Item Name",
    desc:"Description",
    amount:"Amount",
  }]
  transactions: any[] = []; // Define transactions as an array
  totalIncome: number = 0;
  currentDate: string;
  currentExDate: string;
  monthlyIncome: number[] = new Array(12).fill(0);
  monthlyExpense: number[] = new Array(12).fill(0);
  constructor(private _transService: TransServiceService, private _sales_service:SalesService){
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = today.getDate().toString().padStart(2, '0');
    
    // Format the date as 'YYYY-MM-DD' and set it as the default value
    this.currentDate = `${year}-${month}-${day}`;
    this.currentExDate = `${year}-${month}-${day}`;
   }
  ngOnInit(): void {
    this.GetAllData()
    if (this.currentSalesDate) { // Ensure a date is selected before calling
      this.GetAllBillData(this.currentSalesDate);
    }
    this.getTransactions();
    this.GetAllBillData(this.currentDateSales || new Date().toISOString().split('T')[0]);
  }
  GetAllData() {
    this._transService.getAll().subscribe((res: any) => {
      if (res) {
        this.transaction = res.map((item: any) => {
          const dateObj = new Date(item.trans_date);
          const formattedDate = `${('0' + dateObj.getDate()).slice(-2)}-${('0' + (dateObj.getMonth() + 1)).slice(-2)}-${dateObj.getFullYear()}`;

          return {
            date: formattedDate, // Formatted for display
            rawDate: dateObj,    // Raw date for calculations
            desc: item.trans_desc,
            amount: item.trans_amount,
            type: item.trans_type,
          };
        });

        this.transaction.reverse();  // Reverse if needed
        this.updateIncomeChart();    // Initialize chart with default year
        this.updateExpenseChart();
      }
    });
  }
  
  addTransaction(newTransaction: any) {
    this.transaction.unshift({
      date: newTransaction.trans_date,
      desc: newTransaction.trans_desc,
      amount: newTransaction.trans_amount,
      type: newTransaction.trans_type,
    });
  }
  
  updateIncomeChart() {
    console.log("Updating income chart for year:", this.currentDate); // Debugging line
    if (!this.currentDate) return;
    const selectedYear = new Date(this.currentDate).getFullYear();
    const filteredTransactions = this.transaction.filter(
      (trans: { rawDate: { getFullYear: () => number } }) => trans.rawDate.getFullYear() === selectedYear
    );
  
    // Reset monthly income data
    this.monthlyIncome = new Array(12).fill(0);
  
    // Calculate income for each month in the selected year
    filteredTransactions.forEach((trans: { amount: number; type: string; rawDate: Date }) => {
      if (trans.type === 'income') {
        const month = trans.rawDate.getMonth(); // 0 = Jan, 11 = Dec
        this.monthlyIncome[month] += trans.amount;
      }
    });
  
    // Reinitialize the chart with updated data
    this.initializeIncomeChart(this.monthlyIncome);
  }

  updateExpenseChart() {
    console.log("Updating expense chart for year:", this.currentDate); // Debugging line
    if (!this.currentExDate) return;
    const selectedYear = new Date(this.currentExDate).getFullYear();
    const filteredTransactions = this.transaction.filter(
      (trans: { rawDate: { getFullYear: () => number } }) => trans.rawDate.getFullYear() === selectedYear
    );
  
    // Reset monthly income data
    this.monthlyExpense = new Array(12).fill(0);
  
    // Calculate income for each month in the selected year
    filteredTransactions.forEach((trans: { amount: number; type: string; rawDate: Date }) => {

      if(trans.type === 'expense'){
        const exmonth = trans.rawDate.getMonth();
        this.monthlyExpense[exmonth] += trans.amount;
      }
    });
  
    // Reinitialize the chart with updated data
    this.initializeExpenseChart(this.monthlyExpense);
  }

  getTransactions(): void {
    this._transService.getTransactions().subscribe((data: any[]) => {
      this.transactions = data;

      // Calculate total income from the transactions result
      this.totalIncome = this.transactions
        .filter(transaction => transaction.type === 'income') // Filter only income transactions
        .reduce((sum, transaction) => sum + transaction.amount, 0); // Sum up the income amounts
    });
  }

  initializeIncomeChart(monthlyIncome: number[]) {
    const ctx = document.getElementById('initializeIncomeChart') as HTMLCanvasElement;

    // Destroy existing chart instance if it exists
    if (this.myChart) {
      this.myChart.destroy();
    }

    // Create a new chart instance
    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Income',
          data: monthlyIncome, // Dynamic data for chart
          borderColor: 'lightgreen',
          borderWidth: 1,
          backgroundColor: 'lightgreen',
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true, // Ensure Y-axis starts at 0
          },
        },
      },
    });
  }


initializeExpenseChart(monthlyExpense: number[]) {
  const ctx = document.getElementById('initializeExpenseChart') as HTMLCanvasElement;

  // Destroy existing chart instance if it exists
  if (this.myExChart) {
    this.myExChart.destroy();
  }

  // Create a new chart instance
  this.myExChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Expense',
        data: monthlyExpense, // Dynamic data for chart
        borderWidth: 1,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // Example colors for each slice
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true, // Show legend
        },
        tooltip: {
          enabled: true, // Show tooltips on hover
        }
      },
    },
  });
}
onDateChange(selectedDate: string) {
  // Call the method to get the bill data when the date changes
  this.GetAllBillData(selectedDate);
}

GetAllBillData(selectedDate: string) {
  this._sales_service.getAll().subscribe((res: any) => {
    if (res) {
      const selectedYear = new Date(selectedDate).getFullYear();
      const selectedMonth = new Date(selectedDate).getMonth(); // 0 = Jan, 11 = Dec
      const selectedDay = new Date(selectedDate).getDate();

      this.bill = res.filter((item: any) => {
        const billDate = new Date(item.bill_date); // Adjust this to match the date field in your data
        return (
          billDate.getFullYear() === selectedYear && 
          billDate.getMonth() === selectedMonth &&
          billDate.getDate() === selectedDay // Match the day as well
        );
      }).map((item: any) => ({
        bill_no: item.bill_No,
        desc: item.item_Desc,
        amount: item.amount,
        item_name: item.item_Name,
      }));
      
      this.bill.reverse();
      this.updateSalesChart(); // Call to update the chart with filtered data
    }
  });
}

updateSalesChart() {
  const salesData = this.bill.map((item: { amount: any; }) => item.amount);
  const salesLabels = this.bill.map((item: { item_name: any; }) => item.item_name); // Assuming you want to use item names as labels

  this.initializeSalesChart(salesData, salesLabels);
}
addBillTransaction(newTransaction: any) {
  this.bill.unshift({
  bill_no: newTransaction.bill_No,
  item_name: newTransaction.item_Name,
  desc: newTransaction.item_Desc,
  amount: newTransaction.amount,
  });
}

initializeSalesChart(salesData: number[], salesLabels: string[]) {
  const ctx = document.getElementById('initializeSalesChart') as HTMLCanvasElement;

  // If chart already exists, destroy it to avoid stacking multiple instances
  if (this.mySalesChart) {
    this.mySalesChart.destroy();
  }

  this.mySalesChart = new Chart(ctx, {
    type: 'bar', // or 'line', 'pie', etc.
    data: {
      labels: salesLabels, // Labels for the x-axis
      datasets: [{
        label: 'Sales Amount',
        data: salesData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

}

