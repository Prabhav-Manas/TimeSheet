import { NgModule } from '@angular/core';
import { EmpDashboardComponent } from './emp-dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@NgModule({
  declarations: [HeaderComponent, EmpDashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
  ],
})
export class EmpDashboardModule {}
