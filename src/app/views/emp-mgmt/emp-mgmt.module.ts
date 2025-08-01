import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpMgmtComponent } from './emp-mgmt.component';
import { EmpMgmtRoutingModule } from './emp-mgmt-routing.module';
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
import { WidgetsModule } from '../widgets/widgets.module';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [EmpMgmtComponent],
  imports: [
    CommonModule,
    EmpMgmtRoutingModule,
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
    PageItemDirective,
    PageLinkDirective,
    PaginationComponent,
  ]
})
export class EmpMgmtModule { }
