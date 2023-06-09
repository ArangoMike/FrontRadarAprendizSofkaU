import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { AverageComponent } from './pages/average/average.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RadarComponent } from './pages/radar/radar.component';
import { UserComponent } from './pages/user/user.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { RadarDetailComponent } from './pages/radar-detail/radar-detail.component';

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
        component: DashboardComponent
      },
      {
        path: 'user',
        component: UserComponent
      },
      {
        path: 'radar',
        component: RadarComponent
      },
      {
        path: 'average',
        component: AverageComponent
      },
      {
        path: 'create-user',
        component: CreateUserComponent
      },
      {
        path: 'radar-detail',
        component: RadarDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule { }
