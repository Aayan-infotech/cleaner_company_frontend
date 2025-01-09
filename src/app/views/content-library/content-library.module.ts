import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentLibraryRoutingModule } from './content-library-routing.module';
import { ListGroupModule } from '@coreui/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ContentLibraryComponent } from './content-library.component'
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
  WidgetModule,
  NavbarModule,
  UtilitiesModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { DropdownModule, SharedModule, } from '@coreui/angular';
import { WidgetsModule } from '../widgets/widgets.module';


@NgModule({
  declarations: [ContentLibraryComponent],
  imports: [
    CommonModule,
    ContentLibraryRoutingModule,
    DropdownModule,
    SharedModule,
    ListGroupModule,
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
    WidgetModule,
    NavbarModule,
    UtilitiesModule
  ]
})
export class ContentLibraryModule { }
