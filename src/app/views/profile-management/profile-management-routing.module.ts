import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfileManagementComponent} from './profile-management.component'

const routes: Routes = [
  {
    path: '',
    component: ProfileManagementComponent,
    data: {
      title: `ProfileManagement`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileManagementRoutingModule { }
