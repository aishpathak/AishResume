import { ScheduleService } from './schedule/schedule.service';
import { FlightService } from './flight.service';
import { DisplayscheduleComponent } from '../flight/schedule/displayschedule/displayschedule.component';
import { DetailsscheduleComponent } from '../flight/schedule/detailsschedule/detailsschedule.component';
import { MaintainscheduleComponent } from '../flight/schedule/maintainschedule/maintainschedule.component';
import { DisplayOperativeFlightComponent } from '../flight/displayoperativeflight/displayoperativeflight.component';
import { MaintenanceoperativeflightComponent } from '../flight/operative/maintenanceoperativeflight/maintenanceoperativeflight.component';
import { DisplayoutgoingenroutementComponent } from '../flight/displayoutgoingenroutement/displayoutgoingenroutement.component';
import { SpecialenroutementComponent } from '../flight/specialenroutement/specialenroutement.component';
import { CodeShareFlightComponent } from './codeShareFlight/codeShareFlight.component';
import { ModifyscheduleComponent } from '../flight/schedule/modifyschedule/modifyschedule.component';
import { ScheduledetailsComponent } from '../flight/schedule/reusablecomponent/scheduledetails/scheduledetails.component';
import { UfisFlightComponent } from '../flight/ufisflight/ufisFlight.component';
import { ScheduledetailseditableComponent } from '../flight/schedule/reusablecomponent/scheduledetailseditable/scheduledetailseditable.component';
import { MaintainweatherComponent } from '../flight/schedule/maintainweather/maintainweather.component';

// ScheduledetailseditableComponent
/**
 *  Flight Routing Module
 *
 * @copyright SATS Singapore 2017-18
 */
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, NgcUtility } from 'ngc-framework';
import { SendCANReportComponent } from './sendCANReport/sendCANReport.component';
import { CreateCANReportComponent } from './createCANReport/createCANReport.component';
import { FlighthistoryComponent } from './flighthistory/flighthistory.component';

/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: 'maintainschedule', component: MaintainscheduleComponent },
    { path: 'maintainschedule/:id', component: MaintainscheduleComponent },
    { path: 'displayschedule', component: DisplayscheduleComponent },
    { path: 'displayoperatingflight', component: DisplayOperativeFlightComponent },
    { path: 'displayoutgoingenroutement', component: DisplayoutgoingenroutementComponent },
    { path: 'maintenanceoperativeflight', component: MaintenanceoperativeflightComponent },
    { path: 'specialenroutement', component: SpecialenroutementComponent },
    { path: 'detailsschedule', component: DetailsscheduleComponent },
    { path: 'codeshareflight', component: CodeShareFlightComponent },
    { path: 'modifyschedule', component: ModifyscheduleComponent },
    { path: 'modifyschedule/:id', component: ModifyscheduleComponent },
    { path: 'ufisflight', component: UfisFlightComponent },
    { path: 'sendCANReport', component: SendCANReportComponent },
    { path: 'createCANReport', component: CreateCANReportComponent },
    { path: 'history', component: FlighthistoryComponent },
    { path: 'maintainweather', component: MaintainweatherComponent },
    { path: '**', redirectTo: '/' }

];

/**
 * Flight Routing Module
 */
@NgModule({
    imports: [
        // Flight Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    exports: [
        MaintainscheduleComponent,
        DisplayscheduleComponent,
        MaintenanceoperativeflightComponent,
        SpecialenroutementComponent,
        DisplayOperativeFlightComponent,
        MaintenanceoperativeflightComponent,
        DetailsscheduleComponent,
        CodeShareFlightComponent,
        ModifyscheduleComponent,
        ScheduledetailsComponent,
        ScheduledetailseditableComponent,
        UfisFlightComponent,
        MaintainweatherComponent
    ],
    declarations: [
        MaintainscheduleComponent,
        DisplayscheduleComponent,
        DisplayOperativeFlightComponent,
        MaintenanceoperativeflightComponent,
        SpecialenroutementComponent,
        DisplayoutgoingenroutementComponent,
        DetailsscheduleComponent,
        CodeShareFlightComponent,
        ModifyscheduleComponent,
        ScheduledetailsComponent,
        ScheduledetailseditableComponent,
        UfisFlightComponent,
        SendCANReportComponent,
        CreateCANReportComponent,
        FlighthistoryComponent,
        MaintainweatherComponent
    ],
    bootstrap: [],
    providers: [FlightService, ScheduleService]
})
export class FlightModule { }
