import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ContentLibraryComponent} from './content-library.component'
const routes: Routes = [
  {
    path: '',
    component: ContentLibraryComponent,
    data: {
      title: `TemplateLibrary`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentLibraryRoutingModule { }
