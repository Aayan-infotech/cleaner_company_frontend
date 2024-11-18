import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderPlacementRoutingModule } from './order-placement-routing.module';
import {AddOrderComponent} from './add-order/add-order.component';
import {ManageOrderComponent} from './manage-order/manage-order.component'

@NgModule({
  declarations: [
    AddOrderComponent,
    ManageOrderComponent
  ],
  imports: [
    CommonModule,
    OrderPlacementRoutingModule
  ]
})
export class OrderPlacementModule { }
