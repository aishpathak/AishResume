import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { SlaDashboardComponent } from './slaDashboard/slaDashboard.component';
import { FlightBarComponentModule } from './common/flight-bar/flight-bar.component';
import { TimeLineComponentModule } from './common/time-line/time-line.component';
import { DashboardService } from './dashboard.service';
import { MssDashboardComponent } from './mss-dashboard/mss-dashboard.component';
import { MssDashboardVideoWallComponent } from './mss-dashboard-videoWall/mss-dashboard-videoWall.component';
import { MailperformancereportComponent } from './mailperformancereport/mailperformancereport.component';
import { ExportFlightDashboardComponent } from './export-flight-dashboard/export-flight-dashboard.component';
import { DetailsFightDashboardComponent } from './details-fight-dashboard/details-fight-dashboard.component';
import { ImportFlightDashboardComponent } from './import-flight-dashboard/import-flight-dashboard.component';

const routes: Routes = [
  { path: 'slaDashboard/:id', component: SlaDashboardComponent },

  { path: 'mssDashboard', component: MssDashboardComponent },
  { path: 'mssDashboardVideoWall', component: MssDashboardVideoWallComponent },
  { path: 'mailPerformanceReport', component: MailperformancereportComponent },
  { path: 'slaExportDashBoard', component: ExportFlightDashboardComponent },
  { path: 'slaImportDashBoard', component: ImportFlightDashboardComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
    FlightBarComponentModule, TimeLineComponentModule
  ],
  exports: [SlaDashboardComponent],
  declarations: [
    SlaDashboardComponent,
    MssDashboardComponent,
    MssDashboardVideoWallComponent,
    MailperformancereportComponent,
    ExportFlightDashboardComponent,
    DetailsFightDashboardComponent,
    ImportFlightDashboardComponent
  ],
  providers: [DashboardService]
})
export class DashboardModule { }