import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { AverageComponent } from './pages/average/average.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RadarComponent } from './pages/radar/radar.component';
import { UserComponent } from './pages/user/user.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { RadarDetailComponent } from './pages/radar-detail/radar-detail.component';
import { AdminguardGuard } from '../guards/adminguard.guard';
import { LoginUserGuard } from '../guards/login-user.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [LoginUserGuard]
      },
      {
        path: 'user',
        component: UserComponent,
        canActivate: [AdminguardGuard]
      },
      {
        path: 'radar',
        component: RadarComponent,
        canActivate: [AdminguardGuard]
      },
      {
        path: 'average',
        component: AverageComponent,
        canActivate: [LoginUserGuard]

      },
      {
        path: 'create-user',
        component: CreateUserComponent,
        canActivate: [AdminguardGuard]
      },
      {
        path: 'radar-detail',
        component: RadarDetailComponent,
        canActivate: [AdminguardGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule { }
