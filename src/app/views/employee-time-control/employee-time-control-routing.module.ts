import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EmployeeTimeControlComponent} from './employee-time-control.component'
const routes: Routes = [
  {
    path: '',
    component: EmployeeTimeControlComponent,
    data: {
      title: `EmployeeTimeControl`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeTimeControlRoutingModule { }
