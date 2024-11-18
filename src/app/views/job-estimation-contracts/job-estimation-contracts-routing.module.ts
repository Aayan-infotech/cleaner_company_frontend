import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JobEstimationContractsComponent } from './job-estimation-contracts.component';
const routes: Routes = [
  {
    path: '',
    component: JobEstimationContractsComponent,
    data: {
      title: `JobEstimationContracts`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobEstimationContractsRoutingModule { }
