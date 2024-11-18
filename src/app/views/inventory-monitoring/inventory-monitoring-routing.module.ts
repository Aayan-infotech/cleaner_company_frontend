import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddInventoryComponent} from './add-inventory/add-inventory.component';
import {ManageInventoryComponent} from './manage-inventory/manage-inventory.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: `InventoryMonitoring`
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'badges'
      },
      {
        path: 'addInventory',
        component: AddInventoryComponent,
        data: {
          title: 'Add Inventory'
        }
      },
      {
        path: 'manageInventory',
        component: ManageInventoryComponent,
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
export class InventoryMonitoringRoutingModule { }
