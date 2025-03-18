import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/pages/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';
import { ForgetPasswordComponent } from './views/pages/forget-password/forget-password.component'
import { ResetPasswordComponent } from './views/pages/reset-password/reset-password.component';
import { ToolsComponent } from './views/troubleshooting-dashboard/tools/tools.component'
import { CleanTechComponent } from './views/troubleshooting-dashboard/clean-tech/clean-tech.component'
import { ManualsComponent } from './views/troubleshooting-dashboard/manuals/manuals.component'
import { MachinesComponent } from './views/troubleshooting-dashboard/machines/machines.component'
import {ProfileAccountComponent} from './views/pages/profile-account/profile-account.component';
import { DesignThemesComponent } from './views/design-themes/design-themes.component';
import { CreateComponent } from './views/design-templates/create/create.component';
import { ViewComponent } from './views/design-templates/view/view.component';
import { ManageInventoryComponent } from './views/inventory-monitoring/manage-inventory/manage-inventory.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      // title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'inventoryMonitoring',
        loadChildren: () =>
          import('./views/inventory-monitoring/inventory-monitoring.module').then((m) => m.InventoryMonitoringModule)
      },
      {
        path: 'orderPlacement',
        loadChildren: () =>
          import('./views/order-placement/order-placement.module').then((m) => m.OrderPlacementModule)
      },


      {
        path: 'manageInventory',
        loadChildren: () =>
          import('./views/inventory-monitoring/manage-inventory/manage-inventory.module').then((m) => m.ManageInventoryModule),
      },

      {
        path: 'employeeManagement',
        loadChildren: () =>
          import('./views/emp-mgmt/emp-mgmt.module').then((m) => m.EmpMgmtModule)
      },



      {
        path: 'troubleshootingDashboard',
        loadChildren: () =>
          import('./views/troubleshooting-dashboard/troubleshooting-dashboard.module').then((m) => m.TroubleshootingDashboardModule),
      },
      {
        path: 'jobSchedulingManagement',
        loadChildren: () =>
          import('./views/job-scheduling-management/job-scheduling-management.module').then((m) => m.JobSchedulingManagementModule)
      },
      {
        path: 'vehicleGpsTrack',
        loadChildren: () =>
          import('./views/vehicle-gps-track/vehicle-gps-track.module').then((m) => m.VehicleGpsTrackModule)
      },
      {
        path: 'employeeTimeControl',
        loadChildren: () =>
          import('./views/employee-time-control/employee-time-control.module').then((m) => m.EmployeeTimeControlModule)
      },
      {
        path: 'jobEstimate',
        loadChildren: () =>
          import('./views/job-estimation-contracts/job-estimation-contracts.module').then((m) => m.JobEstimationContractsModule)
      },
      {
        path: 'profileManagement',
        loadChildren: () =>
          import('./views/profile-management/profile-management.module').then((m) => m.ProfileManagementModule)
      },
      {
        path: 'notificationAlert',
        loadChildren: () =>
          import('./views/notification-alert/notification-alert.module').then((m) => m.NotificationAlertModule)
      },
      {
        path: 'jobHistory',
        loadChildren: () =>
          import('./views/job-history-overview/job-history-overview.module').then((m) => m.JobHistoryOverviewModule)
      },
      {
        path: 'orderRequest',
        loadChildren: () =>
          import('./views/order-request-section/order-request-section.module').then((m) => m.OrderRequestSectionModule)
      },
      {
        path: 'template-library',
        loadChildren: () =>
          import('./views/content-library/content-library.module').then((m) => m.ContentLibraryModule)
      },
      {
        path: 'jobEvent',
        loadChildren: () =>
          import('./views/job-event-overview/job-event-overview.module').then((m) => m.JobEventOverviewModule)
      },
      {
        path: 'content-version',
        loadChildren: () =>
          import('./views/content-version/content-version.module').then((m) => m.ContentVersionModule)
      },
      {
        path: 'designTheme',
        loadChildren: () =>
          import('./views/design-themes/design-themes.module').then((m) => m.DesignThemesModule)
      },
      {
        path: 'createTemplate',
        loadChildren: () =>
          import('./views/design-templates/create/create.module').then((m) => m.CreateModule)
      },
      {
        path: 'viewTemplate',
        loadChildren: () =>
          import('./views/design-templates/view/view.module').then((m) => m.ViewModule)
      },
      {
        path: 'theme',
        loadChildren: () =>
          import('./views/theme/theme.module').then((m) => m.ThemeModule)
      },
      {
        path: 'base',
        loadChildren: () =>
          import('./views/base/base.module').then((m) => m.BaseModule)
      },
      {
        path: 'buttons',
        loadChildren: () =>
          import('./views/buttons/buttons.module').then((m) => m.ButtonsModule)
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./views/forms/forms.module').then((m) => m.CoreUIFormsModule)
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./views/charts/charts.module').then((m) => m.ChartsModule)
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./views/icons/icons.module').then((m) => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./views/notifications/notifications.module').then((m) => m.NotificationsModule)
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/widgets.module').then((m) => m.WidgetsModule)
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule)
      },
      
    ]
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'forgetPassword',
    component: ForgetPasswordComponent,
    data: {
      title: 'Forget Password Page'
    }
  },
  {
    path: 'reset/:token',
    component: ResetPasswordComponent,
    data: {
      title: 'Reset Password Page'
    }
  },
  {
    path: 'profile-account',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        component: ProfileAccountComponent,
        data: {
          title: 'Profile Account Page'
        }
      },
    ]
  },

  {
    path: 'troubleshootingDashboard',
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'tools',
        component: ToolsComponent,
        data: {
          title: 'Tools'
        }
      },
      {
        path: 'clean-tech',
        component: CleanTechComponent,
        data: {
          title: 'Clean-Tech'
        }
      },
      {
        path: 'manuals',
        component: ManualsComponent,
        data: {
          title: 'Manuals'
        }
      },
      {
        path: 'items/:categoryId',
        component: MachinesComponent,
        data: {
          title: 'Items'
        }
      },
    ]
  },
  // {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
