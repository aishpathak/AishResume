import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportService } from './support.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { BatchJobMonitoringComponent } from './batch-job-monitoring/batch-job-monitoring.component';

/**
* Route
*/
const routes: Routes = [
      { path: 'batchmonitoring', component: BatchJobMonitoringComponent }
];

@NgModule({
      imports: [
            RouterModule.forChild(routes),
            CommonModule, ReactiveFormsModule, RouterModule,
            NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
      ],
      exports: [],
      declarations: [
            BatchJobMonitoringComponent
      ],
      bootstrap: [],
      providers: [SupportService]
})
export class SupportModule { }
