import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NotificationAlertComponent} from './notification-alert.component'
const routes: Routes = [
  {
    path: '',
    component: NotificationAlertComponent,
    data: {
      title: `NotificationAlert`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationAlertRoutingModule { }
