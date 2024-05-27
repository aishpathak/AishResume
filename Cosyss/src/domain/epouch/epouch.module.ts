import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { EpouchComponent } from './epouch.component';
import { EpouchService } from './epouch.service';
import { ReactiveFormsModule } from "@angular/forms";
import {
  NgcCoreModule,
  NgcControlsModule,
  NgcDirectivesModule,
  NgcDomainModule
} from "ngc-framework";

const routes: Routes = [
  // Default
  { path: "summaryofepouch", component: EpouchComponent }
  // , { path: "pop-over", component: OverlayPanel }
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
  declarations: [EpouchComponent],
  providers: [EpouchService]
})
export class EpouchModule { }
