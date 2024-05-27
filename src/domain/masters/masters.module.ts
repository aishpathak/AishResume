import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import {
  NgcCoreModule,
  NgcControlsModule,
  NgcDirectivesModule,
  NgcDomainModule
} from "ngc-framework";
import { MasterspageComponent } from "./maintainmasters/masterspage/masterspage.component";
import { MaintainSHCMasterComponent } from "./maintainshcmaster/maintainshcmaster.component";
import { MaintainmastersComponent } from "./maintainmasters/maintainmasters.component";
import { CodeadministrationComponent } from "./codeadministration/codeadministration.component";
import { MaintainSystemParameterComponent } from "./maintainsystemparameter/maintainsystemparameter.component";
import { MastersService } from "./masters.service";
import { AirlineWeightToleranceLimitComponent } from "./airline-weight-tolerance-limit/airline-weight-tolerance-limit.component";
import { MaintainairlinemasterComponent } from "./maintainairlinemaster/maintainairlinemaster.component";
import { MaintainairlineuldComponent } from "./maintainairlineuld/maintainairlineuld.component";
import { MaintainCarrierCodeComponent } from "./maintain-carrier-code/maintain-carrier-code.component";
import { MaintainTermsComponent } from "./maintaintermscondition/maintainterms.component";
import { MasterPipe } from "./maintainmasters/masterspage/masterspage.component";
import { AirlineplasticsheetsComponent } from "./airlineplasticsheets/airlineplasticsheets.component";
import { BroadcastnotificationmessageComponent } from './broadcastnotificationmessage/broadcastnotificationmessage.component';
import { CodeadministrationcodeComponent } from './codeadministrationcode/codeadministrationcode.component';
import { CodeadministrationdetailsComponent } from './codeadministrationdetails/codeadministrationdetails.component';
import { BlacklistairwaybillComponent } from "./blacklistairwaybill/blacklistairwaybill.component";
const routes: Routes = [
  // Default
  //MasterspageComponent

  { path: "codeadministrationcode", component: CodeadministrationcodeComponent },
  { path: "codeadministrationdetails", component: CodeadministrationdetailsComponent },

  { path: "maintainmasters", component: MaintainmastersComponent },
  { path: "maintainshcmaster", component: MaintainSHCMasterComponent },
  {
    path: "maintainsystemparameter",
    component: MaintainSystemParameterComponent
  },
  { path: "codeadministration", component: CodeadministrationComponent },
  { path: "maintainairlinemaster", component: MaintainairlinemasterComponent },
  { path: "maintaincarriercode", component: MaintainCarrierCodeComponent },
  { path: "masterspage/:id", component: MasterspageComponent },
  { path: "maintaintermsandcondition", component: MaintainTermsComponent },
  { path: "maintainairlineuld", component: MaintainairlineuldComponent },
  {
    path: "airlineweighttolerancelimit",
    component: AirlineWeightToleranceLimitComponent
  },
  {
    path: "airlineplasticsheets",
    component: AirlineplasticsheetsComponent
  },
  { path: "blacklistairwaybill", component: BlacklistairwaybillComponent },
  { path: 'broadcastnotificationmessage', component: BroadcastnotificationmessageComponent },
  { path: "**", redirectTo: "/" }


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

  exports: [
    MaintainmastersComponent,
    MasterspageComponent,
    MaintainTermsComponent,
    MaintainSystemParameterComponent,
    MaintainSHCMasterComponent,
    MaintainairlinemasterComponent,
    MaintainairlineuldComponent,
    CodeadministrationComponent,
    MaintainCarrierCodeComponent,
    AirlineplasticsheetsComponent,
    BroadcastnotificationmessageComponent,
    BlacklistairwaybillComponent
  ],
  declarations: [
    MaintainmastersComponent,
    MasterspageComponent,
    MaintainTermsComponent,
    MaintainSystemParameterComponent,
    AirlineWeightToleranceLimitComponent,
    CodeadministrationComponent,
    MaintainSHCMasterComponent,
    MaintainairlinemasterComponent,
    MaintainairlineuldComponent,
    MaintainCarrierCodeComponent,
    MasterPipe,
    AirlineplasticsheetsComponent,
    BroadcastnotificationmessageComponent,
    CodeadministrationcodeComponent,
    CodeadministrationdetailsComponent,
    BlacklistairwaybillComponent
  ],
  providers: [MastersService]
})
export class MastersModule { }
