import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageCategoriesComponent } from './manage-categories.component';
import { ManageCategoriesRoutingModule } from './manage-categories-routing.module';
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
import { IconModule } from '@coreui/icons-angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ManageCategoriesComponent],
  imports: [
    CommonModule,
    ManageCategoriesRoutingModule,
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
    FormsModule,
    PageItemDirective,
    PageLinkDirective,
    PaginationComponent,
  ],
})
export class ManageCategoriesModule {}
