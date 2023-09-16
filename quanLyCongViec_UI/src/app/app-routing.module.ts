import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from 'app/roles/roles.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { JobManagementComponent } from './job-management/job-management.component';
import { ProjectDetailsComponent } from './job-management/project-details/project-details.component';
import { CreateProjectComponent } from './job-management/create-project/create-project.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                children: [
                    { path: 'home', component: HomeComponent,  canActivate: [AppRouteGuard] },
                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' }, canActivate: [AppRouteGuard] },
                    { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
                    { path: 'about', component: AboutComponent, canActivate: [AppRouteGuard] },
                    { path: 'update-password', component: ChangePasswordComponent, canActivate: [AppRouteGuard] },
                    { path: 'job-management', component: JobManagementComponent,
                        data: { permission: 'Pages.QuanLyCongViec' }, canActivate: [AppRouteGuard] },
                    { path: 'job-management/project-details/:id', component: ProjectDetailsComponent, canActivate: [AppRouteGuard] },
                    { path: 'job-management/create-project', component: CreateProjectComponent, canActivate: [AppRouteGuard]}
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
