import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuditService } from '../../audit/audit.service';
import { AwbManagementService } from '../../awbManagement/awbManagement.service'
import { ImportService } from '../../import/import.service'

import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';


import { EAWBMonitoringComponent } from './e-awbmonitoring.component';
import { ExportService } from './../export.service';
import { AuditTrailByAWBModule } from './../../audit/audit-trail-by-awb/audit-trail-by-awb.module';
import { MaintainHouseModule } from './../../awbManagement/maintain-house/maintain-house.module';
import { MaintainfwbModule } from './../../import/maintainfwb/maintainfwb.module'

const routes: Routes = [
    // Default
    { path: '', component: EAWBMonitoringComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, AuditTrailByAWBModule,
        MaintainHouseModule, MaintainfwbModule
    ],
    exports: [EAWBMonitoringComponent],
    providers: [ExportService, AuditService, AwbManagementService, ImportService],
    declarations: [EAWBMonitoringComponent]
})
export class EAWBMonitoringModule { }
