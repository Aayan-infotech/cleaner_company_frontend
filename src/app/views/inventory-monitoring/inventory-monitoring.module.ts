import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from '@coreui/angular';
import {FilterPipe} from 'src/app/filter.pipe'
import { InventoryMonitoringRoutingModule } from './inventory-monitoring-routing.module';
import {AddInventoryComponent} from './add-inventory/add-inventory.component';
import { ManageInventoryComponent } from './manage-inventory/manage-inventory.component';
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
  BadgeModule,
  ButtonDirective,
  DropdownComponent,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
} from '@coreui/angular';

import { WidgetsModule } from '../widgets/widgets.module';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NavbarModule } from '@coreui/angular';
@NgModule({
  declarations: [
    ManageInventoryComponent,
    AddInventoryComponent,
    FilterPipe
  ],
  imports: [
    NavModule,
    TabsModule,
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
    InventoryMonitoringRoutingModule,
    BadgeModule,
    DropdownComponent, ButtonDirective, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective
  ]
})
export class InventoryMonitoringModule { }
