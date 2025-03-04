
import { JobSchedulingManagementRoutingModule } from './job-scheduling-management-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from '@coreui/angular';
import { FullCalendarModule } from '@fullcalendar/angular';
import{JobSchedulingManagementComponent} from './job-scheduling-management.component'
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
  TabsModule,
} from '@coreui/angular';
import { WidgetsModule } from '../widgets/widgets.module';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NavbarModule } from '@coreui/angular';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientModule,HttpClient  } from '@angular/common/http'



@NgModule({
  declarations: [JobSchedulingManagementComponent],
  imports: [
    CommonModule,
    JobSchedulingManagementRoutingModule,
    FormsModule,
    NavbarModule,
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
    NgMultiSelectDropDownModule,
    HttpClientModule,
    FullCalendarModule,

  ]
})
export class JobSchedulingManagementModule { }
