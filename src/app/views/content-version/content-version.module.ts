import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContentVersionComponent} from './content-version.component';
import { ContentVersionRoutingModule } from './content-version-routing.module';
import { ListGroupModule } from '@coreui/angular';
import { ReactiveFormsModule } from '@angular/forms';
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
import { ModalModule } from '@coreui/angular';
import { HttpClientModule, HttpClient  } from '@angular/common/http'

@NgModule({
  declarations: [ContentVersionComponent],
  imports: [
    CommonModule,
    ContentVersionRoutingModule,
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
    UtilitiesModule,
    ModalModule,
    HttpClientModule
  ]
})
export class ContentVersionModule { }
