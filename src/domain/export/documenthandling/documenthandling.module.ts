
import { DocumentService } from './document/document.service';
import { FlightpouchService } from './flightpouch/flightpouch.service';

import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { FlightpouchComponent } from './flightpouch/flight-pouch-management/flight-pouch-management.component';
import { UpdatepouchComponent } from "./flightpouch/updatepouch/updatepouch.component";
import { DocumentviewComponent } from './document/documentview/documentview.component';
import { DocumenthandlingmasterComponent } from './documenthandlingmaster/documenthandlingmaster.component';
import { AdminconsoleComponent } from './adminconsole/adminconsole.component';
import { PresortingComponent } from './presorting/presorting/presorting.component';
import { AdddocumentComponent } from './flightpouch/add-document/add-document.component';
import { FinalizeComponent } from './flightpouch/finalize/finalize.component';
import { LocationconfigurationComponent } from './location/locationconfiguration/locationconfiguration.component';
import { CheckoutComponent } from './flightpouch/checkout/checkout.component';
import { UpdatedocumentComponent } from './document/updatedocument/updatedocument.component';
import { FlightviewComponent } from './flightview/flightview.component';
import { DashboardtvComponent } from './dashboardtv/dashboardtv.component';
import { ReportComponent } from './reports/report.component';
import { DocumentviewService } from "./document/documentview/documentviewService";
import { flightpouchCpyReqAndCancelButtonService } from "./flightpouch/flightpouchCpyReqAndCancelButtonService";
import { DateRangeReportComponent } from "./daterangereport/daterangereport.component";
import { FlightReportComponent } from "./flightreport/flightreport.component";
//import { GpsComponent } from './gps/gps.component';

const documenthandalingRoutes: Routes = [
  { path: 'presorting', component: PresortingComponent },
  { path: 'documentview', component: DocumentviewComponent },
  { path: 'updatedocument', component: UpdatedocumentComponent },
  { path: 'flightpouch/creation', component: FlightpouchComponent },
  { path: 'flightpouch/updatepouch', component: UpdatepouchComponent },
  { path: 'flightpouch/adddocument', component: AdddocumentComponent },
  { path: 'flightpouch/finalize', component: FinalizeComponent },
  { path: 'flightpouch/checkout', component: CheckoutComponent },
  { path: 'flightview', component: FlightviewComponent },
  { path: 'masters/pigeonholelocation', component: LocationconfigurationComponent },
  { path: 'documenthandlingmaster', component: DocumenthandlingmasterComponent },
  { path: 'adminconsole', component: AdminconsoleComponent },
  { path: 'dashboardtv', component: DashboardtvComponent },
  { path: 'dashboardtv/:id', component: DashboardtvComponent },
  { path: 'daterangereport', component: DateRangeReportComponent },
  { path: 'flightreport', component: FlightReportComponent },
  // { path: 'dashboardtv/:officeId/:officeName', component: DashboardtvComponent },
  { path: 'report', component: ReportComponent },
  // { path: '', component: LoginComponent },
  // { path: '', redirectTo: '/login', pathMatch: 'full' } // To Remove
  // { path: '', component: AppComponent }
];

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
    RouterModule.forChild(documenthandalingRoutes),
    //  AgmCoreModule.forRoot({
    //    apiKey: 'AIzaSyCkKajUvAvb0U-laE-o82gNbWzC8KgoPG8'
    // })
  ],


  declarations: [
    PresortingComponent,
    FlightpouchComponent,
    FinalizeComponent,
    CheckoutComponent,
    DocumentviewComponent,
    DocumenthandlingmasterComponent,
    //LoginComponent,
    AdminconsoleComponent,
    LocationconfigurationComponent,
    AdddocumentComponent,
    UpdatedocumentComponent,
    FlightviewComponent,
    DashboardtvComponent,
    ReportComponent,
    UpdatepouchComponent,
    DateRangeReportComponent,
    FlightReportComponent
    // GpsComponent
  ],

  providers: [
    FlightpouchService,
    DocumentService, DocumentviewService, flightpouchCpyReqAndCancelButtonService
  ],

  bootstrap: [], // GpsComponent
  entryComponents: [],
})

export class DocumenthandlingModule { }
