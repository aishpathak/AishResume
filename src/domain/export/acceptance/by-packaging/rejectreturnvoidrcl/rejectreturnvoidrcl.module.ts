import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RejectreturnvoidrclComponent } from './rejectreturnvoidrcl/rejectreturnvoidrcl.component';
import { RouterModule, Routes } from '@angular/router';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { ReactiveFormsModule } from '@angular/forms';
import { ReturncargolistComponent } from './returncargolist/returncargolist.component';
import { ReturncargolistService } from './returncargolist/returncargolist.service';


const routes: Routes = [
  // Default
  { path: '', component: RejectreturnvoidrclComponent },
  { path: 'returncargolist', component: ReturncargolistComponent },
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
    RejectreturnvoidrclComponent,
    ReturncargolistComponent
  ],
  providers: [ReturncargolistService],
  declarations: [
    RejectreturnvoidrclComponent,
    ReturncargolistComponent
  ],
  bootstrap: []

})
export class RejectreturnvoidrclModule { }
