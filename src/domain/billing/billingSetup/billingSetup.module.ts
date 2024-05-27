/**
 * Billing Setup Route Module
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
import { ChargeCodeComponent } from './maintainChargeCode/chargeCode.component';
import { MaintainServiceMasterComponent } from './maintainServiceMaster/maintainServiceMaster.component';
import { ServiceSetupComponent } from './serviceSetup/serviceSetup.component';
import { FactorSetupComponent } from './factorSetup/factorSetup.component';
import { ChargeModelComponent } from './chargeModel/chargeModel.component';
import { ChargeCodeMasterComponent } from './chargeCodeMaster/chargeCodeMaster.component';
import { CustomerbillingSetupComponent } from './customerbilling-setup/customerbilling-setup.component';
import { ChargepostingConfigurationComponent } from './chargeposting-configuration/chargeposting-configuration.component';
import { CurrencyExchangeMasterComponent } from './currencyExchangeMaster/currencyExchangeMaster.component'
import { BillingService } from '../billing.service';

const routes: Routes = [
  { path: 'showChargeCodes', component: ChargeCodeMasterComponent },
  { path: 'maintainChargeCode', component: ChargeCodeComponent },
  { path: 'maintainServiceMaster', component: MaintainServiceMasterComponent },
  { path: 'serviceSetup', component: ServiceSetupComponent },
  { path: 'maintainChargeCode', component: ChargeCodeComponent },
  { path: 'factorSetup', component: FactorSetupComponent },
  { path: 'chargeModel', component: ChargeModelComponent },
  { path: 'customerbillingsetup', component: CustomerbillingSetupComponent },
  { path: 'chargepostingconfiguration', component: ChargepostingConfigurationComponent },
  { path: 'currencyExchangeMaster', component: CurrencyExchangeMasterComponent }
];

/**
 * Billing Setup Module
 */
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  declarations: [
    ChargeCodeComponent,
    MaintainServiceMasterComponent,
    ServiceSetupComponent,
    FactorSetupComponent,
    ChargeModelComponent,
    ChargeCodeMasterComponent,
    CustomerbillingSetupComponent,
    ChargepostingConfigurationComponent,
    CurrencyExchangeMasterComponent
  ],
  providers: [BillingService]
})
export class BillingSetupModule { }
