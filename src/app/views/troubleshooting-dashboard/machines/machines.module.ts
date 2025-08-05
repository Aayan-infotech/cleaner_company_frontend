import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachinesComponent } from './machines.component';
import { MachinesRoutingModule } from './machines-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule } from '@angular/forms';
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
  PageItemDirective,
  PageLinkDirective,
  PaginationComponent,
} from '@coreui/angular';


@NgModule({
  declarations: [MachinesComponent],
  imports: [
    CommonModule,
    MachinesRoutingModule,
    PdfViewerModule,
    FormsModule,AvatarModule,
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
    PageItemDirective,
    PageLinkDirective,
    PaginationComponent,
    ReactiveFormsModule
  ]
})
export class MachinesModule { }
