import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InterfaceService } from "./interface.service";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import {
  NgcCoreModule,
  NgcControlsModule,
  NgcDirectivesModule,
  NgcDomainModule
} from "ngc-framework";
import { IncomingmessagelogdetailsComponent } from "./incomingmessagelogdetails/incomingmessagelogdetails.component";
import { OutgoingmessagelogdetailsComponent } from "./outgoingmessagelogdetails/outgoingmessagelogdetails.component";
import { TsmmessagepushComponent } from "./tsmmessagepush/tsmmessagepush.component";
import { ExternalsystemmonitoringComponent } from "./externalsystemmonitoring/externalsystemmonitoring.component";
import { InboundedimessageprocessComponent } from "./inboundedimessageprocess/inboundedimessageprocess.component";
import { AttachedtelexmessagesComponent } from "./attachedtelexmessages/attachedtelexmessages.component";
import { SetupmessagedefinationbyairlineComponent } from "./setupmessagedefinationbyairline/setupmessagedefinationbyairline.component";
import { SendtelexmessagesComponent } from './sendtelexmessages/sendtelexmessages.component';
import { ResendmessagesComponent } from './resendmessages/resendmessages.component';
import { MonitoringmessagesComponent } from './monitoringmessages/monitoringmessages.component';
import { EditsetupmessagedefinitionComponent } from './editsetupmessagedefinition/editsetupmessagedefinition.component';
import { AddmessagedefinitionComponent } from './addmessagedefinition/addmessagedefinition.component';
import { EdiInterfaceSetUpComponent } from './edi-interface-set-up/edi-interface-set-up.component';
import { InterfacingSystemTelexaddressSetupComponent } from './interfacing-system-telexaddress-setup/interfacing-system-telexaddress-setup.component';
import { EdiMessageEventSetupComponent } from './edi-message-event-setup/edi-message-event-setup.component';
import { AddNewMessageHandlingDefinitionComponent } from './add-new-message-handling-definition/add-new-message-handling-definition.component';
import { SetUpGroupedMessageHandlingDefinitionComponent } from './set-up-grouped-message-handling-definition/set-up-grouped-message-handling-definition.component';
import { EditGroupedMessageHandlingDefinitionComponent } from './edit-grouped-message-handling-definition/edit-grouped-message-handling-definition.component';
import { ProcessInboundMessageFileComponent } from './process-inbound-message-file/process-inbound-message-file.component';
import { IcmsBookingPublishComponent } from "./icms-booking-publish/icms-booking-publish.component";
import { ShipmentfsusetupComponent } from "./shipmentfsusetup/shipmentfsusetup.component";
import { ResendfwbfhlComponent } from "./resendfwbfhl/resendfwbfhl.component";
const routes: Routes = [
  // interface Page Component
  { path: "incomingmessage", component: IncomingmessagelogdetailsComponent },
  { path: "outgoingmessage", component: OutgoingmessagelogdetailsComponent },
  { path: "externalsystemmonitoringinterface", component: ExternalsystemmonitoringComponent },
  { path: "incomingmessageprocess", component: InboundedimessageprocessComponent },
  { path: "telexmessages", component: AttachedtelexmessagesComponent },
  { path: "setupmessagedefination", component: SetupmessagedefinationbyairlineComponent },
  { path: "sendtelexmessages", component: SendtelexmessagesComponent },
  { path: "resendmessages", component: ResendmessagesComponent },
  { path: "editmessagedefination", component: EditsetupmessagedefinitionComponent },
  { path: "addmessagedefination", component: AddmessagedefinitionComponent },
  { path: "monitoringMessages", component: MonitoringmessagesComponent },
  { path: "editinterfacesetup", component: EdiInterfaceSetUpComponent },
  { path: "interfacingSystemTelexAddress", component: InterfacingSystemTelexaddressSetupComponent },
  { path: "edimessageEventSetup", component: EdiMessageEventSetupComponent },
  { path: "addNewMessageHandlingDefinition", component: AddNewMessageHandlingDefinitionComponent },
  { path: "setupGroupedMessageHandlingDefinition", component: SetUpGroupedMessageHandlingDefinitionComponent },
  { path: "editGroupedMessagehandlingDefinition", component: EditGroupedMessageHandlingDefinitionComponent },
  { path: "tsmmessagemanualpush", component: TsmmessagepushComponent },
  { path: "processinboundmessagefile", component: ProcessInboundMessageFileComponent },
  { path: 'icmsbookingpublish', component: IcmsBookingPublishComponent },
  { path: "shipmentfsusetup", component: ShipmentfsusetupComponent },
  { path: 'resendfwbfhl', component: ResendfwbfhlComponent }
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
    NgcDomainModule,
  ],
  exports: [
    IcmsBookingPublishComponent
  ],
  declarations: [
    IncomingmessagelogdetailsComponent,
    OutgoingmessagelogdetailsComponent,
    ExternalsystemmonitoringComponent,
    InboundedimessageprocessComponent,
    AttachedtelexmessagesComponent,
    SetupmessagedefinationbyairlineComponent,
    SendtelexmessagesComponent,
    ResendmessagesComponent,
    EditsetupmessagedefinitionComponent,
    AddmessagedefinitionComponent,
    MonitoringmessagesComponent,
    EdiInterfaceSetUpComponent,
    InterfacingSystemTelexaddressSetupComponent,
    EdiMessageEventSetupComponent,
    AddNewMessageHandlingDefinitionComponent,
    SetUpGroupedMessageHandlingDefinitionComponent,
    EditGroupedMessageHandlingDefinitionComponent,
    TsmmessagepushComponent,
    ProcessInboundMessageFileComponent,
    IcmsBookingPublishComponent,
    ShipmentfsusetupComponent,
    ResendfwbfhlComponent
  ],
  providers: [InterfaceService]
})
export class InterfaceModule { }
