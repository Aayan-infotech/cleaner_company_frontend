import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import  { ManageInventoryComponent } from './manage-inventory.component';

const routes: Routes = [
  {
    path: '',
    component: ManageInventoryComponent,
    data: {
      title: `Manage Inventory`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageInventoryRoutingModule { }
