/**
 *  Admin Routing Module
 *
 * @copyright SATS Singapore 2017-18
 */
import { CargoIQService } from './cargoIQ.service';
import { SlaConfigurationComponent } from './sla-configuration/sla-configuration.component';
import { EmailConfigurationComponent } from './email-configuration/email-configuration.component';
// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { CargoIQReportComponent } from './cargoIQReport/cargoIQReport.component';

/**
 * Route
 */
const routes: Routes = [
      { path: 'cargoiqreport', component: CargoIQReportComponent },
      { path: 'slaconfiguration', component: SlaConfigurationComponent },
      { path: 'emailconfiguration', component: EmailConfigurationComponent }
];

@NgModule({
      imports: [
            RouterModule.forChild(routes),
            CommonModule, ReactiveFormsModule, RouterModule,
            NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
      ],
      exports: [],
      declarations: [
            SlaConfigurationComponent,
            EmailConfigurationComponent,
            CargoIQReportComponent
      ],
      bootstrap: [],
      providers: [CargoIQService]
})
export class CargoIQModule { }
