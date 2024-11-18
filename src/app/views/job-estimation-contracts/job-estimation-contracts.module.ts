import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobEstimationContractsComponent } from './job-estimation-contracts.component';
import { JobEstimationContractsRoutingModule } from './job-estimation-contracts-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '@coreui/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownComponent,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  FormModule,
  GridModule,
  NavModule,
  ProgressModule,
  TableModule,
  TabsModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';

@NgModule({
  declarations: [JobEstimationContractsComponent],
  imports: [
    CommonModule,
    JobEstimationContractsRoutingModule,
    ModalModule,
    CardModule,
    NavModule,
    IconModule,
    TabsModule,
    GridModule,
    ProgressModule,
    ReactiveFormsModule,
    FormModule,
    ButtonModule,
    ButtonGroupModule,
    ChartjsModule,
    AvatarModule,
    TableModule,
    HttpClientModule,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
  ]
})
export class JobEstimationContractsModule { }
