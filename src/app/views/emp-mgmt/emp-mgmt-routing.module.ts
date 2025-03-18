import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpMgmtComponent } from './emp-mgmt.component';
const routes: Routes = [
  {
    path: '',
    component: EmpMgmtComponent,
    data: {
      title: `Employee Management`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpMgmtRoutingModule { }
