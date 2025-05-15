
import { MarketingRoutingModule } from './marketing-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingComponent } from './marketing.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  ModalModule,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  NavModule,
  ProgressModule,
  TableModule,
  TabsModule,
  CarouselComponent,
  CarouselControlComponent,
  CarouselInnerComponent,
  CarouselItemComponent
} from '@coreui/angular';
import { WidgetsModule } from '../widgets/widgets.module';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule } from '@angular/forms';
import { ChartjsModule } from '@coreui/angular-chartjs';


@NgModule({
  declarations: [MarketingComponent],
  imports: [
    CommonModule,
    MarketingRoutingModule,
    AvatarModule,
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    FormModule,
    GridModule,
    IconModule,
    ModalModule,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    NavModule,
    ProgressModule,
    ReactiveFormsModule,
    TableModule,
    TabsModule,
    WidgetsModule,
    FormsModule,
    CarouselComponent,
    CarouselControlComponent,
    CarouselInnerComponent,
    CarouselItemComponent,
    ChartjsModule
  ]
})
export class MarketingModule { }
