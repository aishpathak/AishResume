import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CargoProcessingEngineService } from './cargoprocessingengine.service';
import { SetupProcessAreaComponent } from './setup-process-area/setup-process-area.component';
import { SetupTriggerPointsComponent } from './setup-trigger-points/setup-trigger-points.component';
import { OperationalMessagesComponent } from './operational-messages/operational-messages.component';
import { AssociateProcessAreaComponent } from './associate-process-area/associate-process-area.component';
import {
    SetupCargoProcessPrecedentsComponent
} from './setup-cargo-process-precedents/setup-cargo-process-precedents.component';
import {
    ExecutionShipmentInfoComponent
} from './execution-shipment-info/execution-shipment-info.component';
import {
    NgcDomainModule, NgcDirectivesModule, NgcControlsModule, NgcCoreModule, NgcUtility
} from 'ngc-framework';

const routes: Routes = [
    { path: 'setupprocessarea', component: SetupProcessAreaComponent },
    { path: 'setuptriggerpoints', component: SetupTriggerPointsComponent },
    { path: 'operationalmessage', component: OperationalMessagesComponent },
    { path: 'precedents', component: SetupCargoProcessPrecedentsComponent },
    { path: 'associateprocessarea', component: AssociateProcessAreaComponent },
    { path: 'executionshipmentinfo', component: ExecutionShipmentInfoComponent }
];

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        NgcCoreModule,
        NgcDomainModule,
        NgcControlsModule,
        NgcDirectivesModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    providers: [
        CargoProcessingEngineService
    ],
    declarations: [
        SetupProcessAreaComponent,
        SetupTriggerPointsComponent,
        AssociateProcessAreaComponent,
        OperationalMessagesComponent,
        SetupCargoProcessPrecedentsComponent,
        ExecutionShipmentInfoComponent
    ]
})

export class CargoProcessingEngineModule {

}