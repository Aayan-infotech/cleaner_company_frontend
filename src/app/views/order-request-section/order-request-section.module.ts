
import { OrderRequestSectionRoutingModule } from './order-request-section-routing.module';
import { OrderRequestSectionComponent } from './order-request-section.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
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
  declarations: [OrderRequestSectionComponent],
  imports: [
    CommonModule,
    OrderRequestSectionRoutingModule,
    ModalModule,
    FormsModule,
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
export class OrderRequestSectionModule { }
