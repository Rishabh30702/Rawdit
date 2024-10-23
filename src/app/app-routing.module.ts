import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Website/login/login.component';
import { DashboardComponent } from './Website/dashboard/dashboard.component';
import { TransactionsComponent } from './Website/transactions/transactions.component';
import { DashboardLayoutComponent } from './Website/dashboard-layout/dashboard-layout.component';
import { SalesComponent } from './Website/sales/sales.component';
import { AdminComponent } from './Website/admin/admin.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'login',
    pathMatch:'full'
  },
  {
    path:'login',
    component:LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
      },
      {
        path:'sales',
        component:SalesComponent
      },
      {
        path:'admin',
        component:AdminComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
