
import { JobHistoryOverviewRoutingModule } from './job-history-overview-routing.module';

import { NavModule } from '@coreui/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {JobHistoryOverviewComponent} from './job-history-overview.component'
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
  declarations: [JobHistoryOverviewComponent],
  imports: [
    CommonModule,
    NavbarModule,
    JobHistoryOverviewRoutingModule,
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
    ButtonModule,
    ButtonGroupModule,
    ChartjsModule,
    AvatarModule,
    TableModule,
    WidgetsModule
  ]
})
export class JobHistoryOverviewModule { }
