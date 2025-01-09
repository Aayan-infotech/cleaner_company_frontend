import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JobSchedulingManagementComponent} from './job-scheduling-management.component'
const routes: Routes = [
  {
    path: '',
    component: JobSchedulingManagementComponent,
    data: {
      title: `JobSchedulingManagement`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobSchedulingManagementRoutingModule { }
