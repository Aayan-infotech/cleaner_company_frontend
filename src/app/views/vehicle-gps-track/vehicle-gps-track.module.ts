import { VehicleGpsTrackRoutingModule } from './vehicle-gps-track-routing.module';
import { NavModule } from '@coreui/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import {VehicleGpsTrackComponent} from './vehicle-gps-track.component'
import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  ProgressModule,
  TableModule,
  TabsModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { WidgetsModule } from '../widgets/widgets.module';
import { NavbarModule } from '@coreui/angular';

@NgModule({
  declarations: [VehicleGpsTrackComponent],
  imports: [
    CommonModule,
    VehicleGpsTrackRoutingModule,
    CommonModule,
    NavbarModule,
    NavModule,
    CardModule,
    IconModule,
    TabsModule,
    CommonModule,
    GridModule,
    ProgressModule,
    ReactiveFormsModule,
    ButtonModule,
    FormModule,
    FormsModule,
    ButtonModule,
    ButtonGroupModule,
    ChartjsModule,
    AvatarModule,
    TableModule,
    WidgetsModule
  ]
})
export class VehicleGpsTrackModule { }
