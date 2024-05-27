
/**
 *  Tracing Routing Module
 *
 * @copyright SATS Singapore 2017-18
 */


// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonsModule } from '../common/common.module';


// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { AssignTeamToAirportGroupComponent } from './assign-team-to-airport-group/assign-team-to-airport-group.component';
import { MaintainTracingActivitiesComponent } from './maintain-tracing-activities/maintain-tracing-activities.component';


import { CargoSurveyComponent } from './cargo-survey/cargo-survey.component';
import { SurveySearchDetailsComponent } from './survey-search-details/survey-search-details.component';
import { DisplayTracingRecordsComponent } from './display-tracing-records/display-tracing-records.component';
import { DisplayAbandonedCargoComponent } from './display-abandoned-cargo/display-abandoned-cargo.component';
import { TracingService } from './tracing.service'
import { GenerateTracingReportComponent } from './generate-tracing-report/generate-tracing-report.component';
import { NetworkUldTrackingComponent } from './network-uld-tracking/network-uld-tracking.component';
import { NetworkAwbTrackingComponent } from './network-awb-tracking/network-awb-tracking.component';
import { ManageRfidComponent } from './manage-rfid/manage-rfid.component';

/**
 * Route
 */

const routes: Routes = [
      // Default
      { path: 'assignteamtoairportgroup', component: AssignTeamToAirportGroupComponent },

      { path: 'maintaintracingactivities', component: MaintainTracingActivitiesComponent },
      { path: 'networkAWBTracking', component: NetworkAwbTrackingComponent },
      { path: 'networkUldTracking', component: NetworkUldTrackingComponent },
      { path: 'conductcargosurvey', component: CargoSurveyComponent },


      { path: 'surveydetailscomponent', component: SurveySearchDetailsComponent },
      { path: 'tracingdisplay', component: DisplayTracingRecordsComponent },

      { path: 'displayabandonedcargo', component: DisplayAbandonedCargoComponent },
      { path: 'tracingreport', component: GenerateTracingReportComponent },
      { path: 'manage-rfid', component: ManageRfidComponent },
      { path: '**', redirectTo: '/' }
];

@NgModule({
      imports: [
            // Tracing Child Routes
            RouterModule.forChild(routes),
            CommonModule, ReactiveFormsModule, RouterModule,
            NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, CommonsModule
      ],
      exports: [
            MaintainTracingActivitiesComponent
      ],
      declarations: [
            ManageRfidComponent,
            AssignTeamToAirportGroupComponent,
            MaintainTracingActivitiesComponent,
            CargoSurveyComponent,
            SurveySearchDetailsComponent,
            DisplayTracingRecordsComponent,
            DisplayAbandonedCargoComponent,
            GenerateTracingReportComponent,
            NetworkUldTrackingComponent,
            NetworkAwbTrackingComponent
      ],

      bootstrap: [],
      providers: [TracingService]
})
export class TracingModule { }
