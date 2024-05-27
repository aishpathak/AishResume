import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { MaintainBanInformationComponent } from './maintain-ban-information.component';
import { TcsService } from '../tcs.service';
import { TcsModule } from '../tcs.module';
import { CreateBanModuleWithoutRoute } from '../create-ban/create-ban.module';
import { ReleaseBanModuleWithoutRoute } from '../release-ban/release-ban.module';
import { BanHistoryModuleWithoutRoute } from '../ban-history/ban-history.module';

const routes: Routes = [
  { path: '', component: MaintainBanInformationComponent },
  { path: '**', redirectTo: '/' }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgcCoreModule,
    NgcControlsModule,
    NgcDirectivesModule, NgcDomainModule, TcsModule,
    CreateBanModuleWithoutRoute, ReleaseBanModuleWithoutRoute,
    BanHistoryModuleWithoutRoute
  ],
  declarations: [MaintainBanInformationComponent],
  providers: [TcsService]
})
export class MaintainBanInformationModule { }
