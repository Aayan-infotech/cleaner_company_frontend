import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ContentVersionComponent} from './content-version.component'
const routes: Routes = [
  {
    path: '',
    component: ContentVersionComponent,
    data: {
      title: `ContentVersion`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentVersionRoutingModule { }
