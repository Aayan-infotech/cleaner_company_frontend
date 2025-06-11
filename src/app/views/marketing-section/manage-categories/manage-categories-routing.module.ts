import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageCategoriesComponent } from './manage-categories.component'; 

const routes: Routes = [
  {
    path: '',
    component: ManageCategoriesComponent,
    data: {
      title: `Categories`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ManageCategoriesRoutingModule { }
