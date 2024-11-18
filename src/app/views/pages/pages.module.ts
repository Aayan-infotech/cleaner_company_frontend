import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import { ProfileAccountComponent } from './profile-account/profile-account.component';
import { ModalModule } from '@coreui/angular';
import { HttpClientModule,HttpClient  } from '@angular/common/http'
import {
  AvatarModule,
  ButtonGroupModule,

  NavModule,
  ProgressModule,
  TableModule,
  TabsModule
} from '@coreui/angular';

import { ChartjsModule } from '@coreui/angular-chartjs';

import { WidgetsModule } from '../widgets/widgets.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    Page404Component,
    Page500Component,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    ProfileAccountComponent
  ],
  imports: [
    HttpClientModule,
    ModalModule,
    ReactiveFormsModule,
    CommonModule,
    PagesRoutingModule,
    CardModule,
    ButtonModule,
    GridModule,
    IconModule,
    FormModule,
    AvatarModule,
    FormsModule,
    ButtonGroupModule,
    ChartjsModule,
    WidgetsModule,
    NavModule,
    ProgressModule,
    TableModule,
    TabsModule
  ]
})
export class PagesModule {
}
