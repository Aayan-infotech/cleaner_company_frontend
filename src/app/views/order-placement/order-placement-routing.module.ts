import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddOrderComponent } from './add-order/add-order.component';
import { ManageOrderComponent } from './manage-order/manage-order.component'
const routes: Routes = [
  {
    path: '',
    data: {
      title: `OrderPlacement`
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'badges'
      },
      {
        path: 'addOrder',
        component: AddOrderComponent,
        data: {
          title: 'Add Inventory'
        }
      },
      {
        path: 'manageOrder',
        component: ManageOrderComponent,
        data: {
          title: 'Manage Inventory'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderPlacementRoutingModule { }
