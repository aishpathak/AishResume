import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranshipmentService } from './transhipment.service';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ImportService } from "../../import/import.service";
import { NgcCoreModule, NgcControlsModule, NgcDomainModule, NgcDirectivesModule } from 'ngc-framework';

import { SendThroughTransitAdvicetoApronComponent } from './SendThroughTransitAdvicetoApron/SendThroughTransitAdvicetoApron.component';

// import Page Component
import { TransshipmenthandlingandmonitoringComponent } from './transshipmenthandlingandmonitoring/transshipmenthandlingandmonitoring.component';
import { InboundtranshipmentworkinglistComponent } from './inboundtranshipmentworkinglist/inboundtranshipmentworkinglist.component';
import { OutboundtransshipmentworkinglistComponent } from './outboundtransshipmentworkinglist/outboundtransshipmentworkinglist.component';
import { ShortTransitDisplayComponent } from './shortTransitDisplay/shortTransitDisplay.component';
import { InboundFlightTranshipmentListComponent } from './inbound-flight-transhipment-list/inbound-flight-transhipment-list.component';
const routes: Routes = [

  { path: 'sendThroughTransitAdvicetoApron', component: SendThroughTransitAdvicetoApronComponent },
  { path: 'transshipment-monitoring-handling', component: TransshipmenthandlingandmonitoringComponent },
  { path: 'outbound-transshipment-workinglist', component: OutboundtransshipmentworkinglistComponent },
  { path: 'inbound-transshipment-workinglist', component: InboundtranshipmentworkinglistComponent },
  { path: 'short-transit-display', component: ShortTransitDisplayComponent },
  { path: 'inbound-flight-transhipment-list', component: InboundFlightTranshipmentListComponent }

];
@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  declarations: [
    SendThroughTransitAdvicetoApronComponent,
    TransshipmenthandlingandmonitoringComponent,
    InboundtranshipmentworkinglistComponent,
    OutboundtransshipmentworkinglistComponent,
    ShortTransitDisplayComponent,
    InboundFlightTranshipmentListComponent
  ],
  providers: [TranshipmentService, ImportService]
})
export class TranshipmentModule { }
