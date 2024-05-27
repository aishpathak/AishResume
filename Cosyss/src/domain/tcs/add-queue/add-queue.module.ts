import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
// Core
import {
  NgcCoreModule,
  NgcControlsModule,
  NgcDirectivesModule,
  NgcDomainModule
} from "ngc-framework";
import { AddQueueComponent } from "./add-queue.component";
import { TcsService } from "../tcs.service";

const routes: Routes = [
  { path: '', component: AddQueueComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgcCoreModule,
    NgcControlsModule,
    NgcDirectivesModule,
    NgcDomainModule
  ],
  exports: [AddQueueComponent],
  declarations: [AddQueueComponent],
  providers: [TcsService]
})
export class AddQueueModuleWithoutRoute { }

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgcCoreModule,
    NgcControlsModule,
    NgcDirectivesModule,
    NgcDomainModule,
    AddQueueModuleWithoutRoute
  ],
  exports: [AddQueueComponent],
  providers: [TcsService]
})
export class AddQueueModule { }
