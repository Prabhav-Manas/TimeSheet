import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpDashboardComponent } from './emp-dashboard/emp-dashboard.component';
import { SignInComponent } from './athentication/sign-in/sign-in.component';
import { SignUpComponent } from './athentication/sign-up/sign-up.component';
import { AuthGuard } from './athentication/auth.guard';
import { LogInGuard } from './athentication/logIn.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full',
  },
  { path: 'signin', component: SignInComponent, canActivate: [LogInGuard] },
  { path: 'signup', component: SignUpComponent, canActivate: [LogInGuard] },
  {
    path: 'dashboard',
    component: EmpDashboardComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, LogInGuard],
})
export class AppRoutingModule {}
