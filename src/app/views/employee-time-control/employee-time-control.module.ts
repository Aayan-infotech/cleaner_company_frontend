import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeTimeControlRoutingModule } from './employee-time-control-routing.module';
import {EmployeeTimeControlComponent} from'./employee-time-control.component'
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '@coreui/angular';
import { HttpClientModule,HttpClient  } from '@angular/common/http'
import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  NavModule,
  ProgressModule,
  TableModule,
  TabsModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';


import { WidgetsModule } from '../widgets/widgets.module';

@NgModule({
  
  imports: [
    CommonModule,
    EmployeeTimeControlRoutingModule,
    ModalModule,
    CardModule,
    NavModule,
    IconModule,
    TabsModule,
    CommonModule,
    GridModule,
    ProgressModule,
    ReactiveFormsModule,
    ButtonModule,
    FormModule,
    ButtonModule,
    ButtonGroupModule,
    ChartjsModule,
    AvatarModule,
    TableModule,
    WidgetsModule,
    HttpClientModule
  ],
  declarations: []
})
export class EmployeeTimeControlModule { }
