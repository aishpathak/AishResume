import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditEfacilitationComponent } from './edit-efacilitation/edit-efacilitation.component';
import { DisplayEfacilitationComponent } from './display-efacilitation/display-efacilitation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { EfacilitationService } from './efacilitation.service';

/**
 * Route
 */
const routes: Routes = [
  { path: 'editefacilitation', component: EditEfacilitationComponent },
  { path: 'displayefacilitation', component: DisplayEfacilitationComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgcCoreModule,
    NgcControlsModule,
    NgcDirectivesModule,
    NgcDomainModule
  ],
  declarations: [DisplayEfacilitationComponent, EditEfacilitationComponent],
  providers: [EfacilitationService]
})
export class EfacilitationModule { }
