import { Routes } from '@angular/router';
import { ResourceFormComponent } from './components/resource-form/resource-form.component';
import { ResourceGridComponent } from './components/resource-grid/resource-grid.component';
import { ResourceDetailComponent } from './components/resource-detail/resource-detail.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
    {
        path: '',
        component: ResourceGridComponent,
        title: 'Resource Page'
    },
    {
        path: 'add-new-resource',
        component: ResourceFormComponent,
        title: 'Add New Resource Page'

    },
    {
        path: 'edit-resource/:id',
        component: ResourceFormComponent,
        title: 'Update Resource'
    },
    {
        path: 'resource-detail/:id',
        component: ResourceDetailComponent,
        title: 'Resource Detail'
    },
    {
        path: 'admin',
        component: AdminComponent,
        title: 'Admin Page'
    }
];
