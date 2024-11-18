import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TroubleshootingDashboardComponent} from './troubleshooting-dashboard.component'
const routes: Routes = [
  {
    path: '',
    component: TroubleshootingDashboardComponent,
    data: {
      title: `TroubleshootingDashboard`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TroubleshootingDashboardRoutingModule { }
