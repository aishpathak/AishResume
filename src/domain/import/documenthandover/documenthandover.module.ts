import { ImportService } from '../import.service';


// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { DocumenthandoverComponent } from './documenthandover.component';



/**
 * Route
 */
const routes: Routes = [
  // Default
  { path: '', component: DocumenthandoverComponent },
  { path: '**', redirectTo: '/' }
];


@NgModule({
  imports: [
    // Admin Child Routes
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [
    DocumenthandoverComponent
  ],
  providers: [ImportService],
  declarations: [DocumenthandoverComponent],
  bootstrap: []
})
export class DocumentHandOverModule { }


