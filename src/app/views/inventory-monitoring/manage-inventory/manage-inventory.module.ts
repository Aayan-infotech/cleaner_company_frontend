import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageInventoryRoutingModule } from './manage-inventory-routing.module';
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
  declarations: [],
  imports: [
    CommonModule,
    ManageInventoryRoutingModule,
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
  ]
})
export class ManageInventoryModule { }
