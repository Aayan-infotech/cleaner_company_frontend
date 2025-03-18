import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VehicleGpsTrackComponent} from './vehicle-gps-track.component'
const routes: Routes = [
  {
    path: '',
    component: VehicleGpsTrackComponent,
    data: {
      title: `GPS Tracking`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleGpsTrackRoutingModule { }
