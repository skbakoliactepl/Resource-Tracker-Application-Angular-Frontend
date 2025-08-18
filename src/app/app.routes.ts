import { Routes } from '@angular/router';
import { ResourceFormComponent } from './components/resource-form/resource-form.component';
import { ResourceGridComponent } from './components/resource-grid/resource-grid.component';
import { ResourceDetailComponent } from './components/resource-detail/resource-detail.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { RoutePaths } from './config/route-paths';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AdminUserManagementComponent } from './components/admin/admin-user-management/admin-user-management.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';

export const routes: Routes = [
    {
        path: RoutePaths.loginLayout,
        component: LoginLayoutComponent,
        children: [
            {
                path: RoutePaths.login,
                component: LoginComponent,
                title: 'Login'
            }
        ]
    },
    {
        path: RoutePaths.appBase,
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: RoutePaths.resourceGrid,
                component: ResourceGridComponent,
                title: 'Resource Page',
            },
            {
                path: RoutePaths.addNewResource,
                component: ResourceFormComponent,
                title: 'Add New Resource Page',
            },
            {
                path: RoutePaths.editResource,
                component: ResourceFormComponent,
                title: 'Update Resource',
            },
            {
                path: RoutePaths.resourceDetail,
                component: ResourceDetailComponent,
                title: 'Resource Detail',
            },
            {
                path: `${RoutePaths.admin}/${RoutePaths.adminUsers}`,
                component: AdminUserManagementComponent,
                title: 'Manage Users'
            }
        ]
    },
    {
        path: RoutePaths.myAccount,
        component: MyAccountComponent,
        canActivate: [AuthGuard],
        title: 'My Account'
    },
    {
        path: RoutePaths.wildcard,
        component: NotFoundComponent,
    }
];
