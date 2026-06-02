import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationComponent } from './components/organization.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    OrganizationComponent
  ]
})
export class OrganizationModule { }
