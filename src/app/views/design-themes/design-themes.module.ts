import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignThemesComponent } from './design-themes.component';
import { DesignThemesRoutingModule } from './design-themes-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
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
  TabsModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';



@NgModule({
  declarations: [DesignThemesComponent],
  
  imports: [
    CommonModule,
    DesignThemesRoutingModule,
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
    HttpClientModule
  ]
})
export class DesignThemesModule { }
