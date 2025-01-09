import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesignThemesComponent } from './design-themes.component';

const routes: Routes = [
  {
    path: '',
    component: DesignThemesComponent,
    data: {
      title: `DesignThemes`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignThemesRoutingModule { }
