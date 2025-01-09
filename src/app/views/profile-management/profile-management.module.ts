import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from '@coreui/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
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
import {ProfileManagementComponent} from './profile-management.component';
import{ProfileManagementRoutingModule} from './profile-management-routing.module';



@NgModule({
  declarations: [ProfileManagementComponent],
  imports: [
    CommonModule,
    ProfileManagementRoutingModule,
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
    HttpClientModule
  ]
})


export class ProfileManagementModule { 
  
}
