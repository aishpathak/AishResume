import { EventsService } from './events.service';
import { UserConfigurationComponent } from './userConfiguration/userConfiguration.component';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventNotificationComponent } from './event-notification/event-notification.component';
import { SearchTemplateComponent } from './search-template/search-template.component';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { ExportFlightEVMComponent } from './export-FlightEVM/export-FlightEVM.component';
import { ImportFlightEVMComponent } from './import-FlightEVM/import-FlightEVM.component';
import { ExportFlightEVMDashboardTVComponent } from './export-FlightEVM-DashboardTV/export-FlightEVM-DashboardTV.component';
import { ImportFlightEVMDashboardTVComponent } from './import-FlightEVM-DashboardTV/import-FlightEVM-DashboardTV.component';
import { ExportFlightEVMSlaTVComponent } from './export-FlightEVM-SlaTV/export-FlightEVM-SlaTV.component';
import { ImportFlightEVMSlaTVComponent } from './import-FlightEVM-SlaTV/import-FlightEVM-SlaTV.component';


const routes: Routes = [
  // Default
  { path: 'userConfiguration', component: UserConfigurationComponent },
  { path: 'eventNotification', component: EventNotificationComponent },
  { path: 'searchTemplate', component: SearchTemplateComponent },
  { path: 'createTemplate', component: CreateTemplateComponent },
  { path: 'exportFlightEVM', component: ExportFlightEVMComponent },
  { path: 'importFlightEVM', component: ImportFlightEVMComponent },
  { path: 'exportFlightEVMDashboardTV', component: ExportFlightEVMDashboardTVComponent },
  { path: 'importFlightEVMDashboardTV', component: ImportFlightEVMDashboardTVComponent },
  { path: 'exportFlightEVMSlaTV', component: ExportFlightEVMSlaTVComponent },
  { path: 'importFlightEVMSlaTV', component: ImportFlightEVMSlaTVComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [UserConfigurationComponent, EventNotificationComponent, SearchTemplateComponent, CreateTemplateComponent
  ],
  declarations: [UserConfigurationComponent,
    EventNotificationComponent,
    SearchTemplateComponent,
    CreateTemplateComponent,
    ExportFlightEVMComponent,
    ImportFlightEVMComponent,
    ExportFlightEVMDashboardTVComponent,
    ImportFlightEVMDashboardTVComponent,
    ExportFlightEVMSlaTVComponent,
    ImportFlightEVMSlaTVComponent
  ],
  providers: [EventsService]
})
export class EventsModule { }
