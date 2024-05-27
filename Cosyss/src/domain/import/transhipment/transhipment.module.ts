import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranshipmentService } from './transhipment.service';
import { TransferByCarrierComponent } from './transfer-by-carrier/transfer-by-carrier.component' 
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDomainModule, NgcDirectivesModule } from 'ngc-framework';
import { CreateTrmbyAwbComponent } from './create-trmby-awb/create-trmby-awb.component';
import { MaintainTrmbyAwbComponent } from './maintain-trmby-awb/maintain-trmby-awb.component';


const routes: Routes = [

  //import Page Component
{ path: 'byCarrier', component: TransferByCarrierComponent },
{ path: 'createTRMByAWB', component: CreateTrmbyAwbComponent },
{ path: 'maintainTRMByAWB', component: MaintainTrmbyAwbComponent }

];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  declarations: [TransferByCarrierComponent, CreateTrmbyAwbComponent, MaintainTrmbyAwbComponent],
  providers: [TranshipmentService]
})
export class TranshipmentModule { }
