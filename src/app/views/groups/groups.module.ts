
import { GroupsRoutingModule } from './groups-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsComponent } from './groups.component';
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
  TabsModule
} from '@coreui/angular';
import { WidgetsModule } from '../widgets/widgets.module';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [GroupsComponent],
  imports: [
    CommonModule,
    GroupsRoutingModule,
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
    FormsModule
  ]
})
export class GroupsModule { }
