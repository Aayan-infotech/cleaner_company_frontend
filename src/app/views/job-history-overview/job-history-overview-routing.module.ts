import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JobHistoryOverviewComponent } from './job-history-overview.component'
const routes: Routes = [
  {
    path: '',
    component: JobHistoryOverviewComponent,
    data: {
      title: `JobHistoryOverview`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobHistoryOverviewRoutingModule { }
