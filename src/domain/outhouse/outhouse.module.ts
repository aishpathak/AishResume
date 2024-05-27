/**
 *  Admin Routing Module
 *
 * @copyright SATS Singapore 2017-18
 */

// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { OuthouseHandoverDNATAComponent } from './OuthouseHandoverDNATA/OuthouseHandoverDNATA.component';
import { OuthouseService } from './outhouse.service';
import { MailOuthouseAcceptanceComponent } from './mail-outhouse-acceptance/mail-outhouse-acceptance.component';
//Moule specific import

/**
 * Route
 */
const routes: Routes = [
  { path: 'outhouseHandoverDnata', component: OuthouseHandoverDNATAComponent },
  { path: 'mailOuthouseAcceptance', component: MailOuthouseAcceptanceComponent }
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
  declarations: [
    OuthouseHandoverDNATAComponent,
    MailOuthouseAcceptanceComponent
],
 providers: [OuthouseService]
})
export class OuthouseModule { }
