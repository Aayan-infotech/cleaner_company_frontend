import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrderRequestSectionComponent} from './order-request-section.component'
const routes: Routes = [
  {
    path: '',
    component: OrderRequestSectionComponent,
    data: {
      title: `OrderRequestSection`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRequestSectionRoutingModule { }
