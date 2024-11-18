
import { TroubleshootingDashboardRoutingModule } from './troubleshooting-dashboard-routing.module';
import { ListGroupModule } from '@coreui/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TroubleshootingDashboardComponent } from './troubleshooting-dashboard.component'
import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  CarouselComponent,
  CarouselControlComponent,
  CarouselIndicatorsComponent,
  CarouselInnerComponent,
  CarouselItemComponent,
  FormModule,
  GridModule,
  NavModule,
  ProgressModule,
  TableModule,
  TabsModule,
  WidgetModule,
  NavbarModule,
  ModalComponent,
  ModalBodyComponent,
  ModalFooterComponent,
  ModalHeaderComponent,

} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { DropdownModule, SharedModule, } from '@coreui/angular';
import { WidgetsModule } from '../widgets/widgets.module';
import { ToolsComponent } from './tools/tools.component'
import { CleanTechComponent } from './clean-tech/clean-tech.component'
import { ManualsComponent } from './manuals/manuals.component'
import { MachinesComponent } from './machines/machines.component'

@NgModule({
  declarations: [TroubleshootingDashboardComponent, ToolsComponent, CleanTechComponent, ManualsComponent, MachinesComponent],
  imports: [
    DropdownModule,
    SharedModule,
    CommonModule,
    TroubleshootingDashboardRoutingModule,
    ListGroupModule,
    CardModule,
    CarouselComponent,
    CarouselControlComponent,
    CarouselIndicatorsComponent,
    CarouselInnerComponent,
    CarouselItemComponent,
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
    WidgetModule,
    NavbarModule,
    ModalComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
  ]
})
export class TroubleshootingDashboardModule { }
