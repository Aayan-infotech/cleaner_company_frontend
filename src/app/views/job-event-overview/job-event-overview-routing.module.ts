import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JobEventOverviewComponent } from './job-event-overview.component';
const routes: Routes = [
    {
      path: '',
      component: JobEventOverviewComponent,
      data: {
        title: `Job Events`
      }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobEventOverviewRoutingModule { }
