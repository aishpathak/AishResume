import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcDomainModule, NgcDirectivesModule, NgcControlsModule, NgcCoreModule, NgcUtility } from 'ngc-framework';
import { HandellingRegulationsForLithiumBatteriesComponent } from './handelling-regulations-for-lithium-batteries/handelling-regulations-for-lithium-batteries.component';
import { RadioactiveComponent } from './radioactive/radioactive.component';
import { DgRegulationsComponent } from './dgRegulations/dgRegulations.component';
import { DangerousgoodsService } from './dangerousgoods.service';
import { PsnModule } from './psn-dtl/psn.module';

const routes: Routes = [
  { path: 'dgdradioactive', component: RadioactiveComponent },
  { path: 'dgregulations', component: DgRegulationsComponent },
  { path: 'handellingregulationforlithiumbatteries', component: HandellingRegulationsForLithiumBatteriesComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,PsnModule
  ],
  providers: [DangerousgoodsService],
  declarations: [
    RadioactiveComponent,
    DgRegulationsComponent,
    HandellingRegulationsForLithiumBatteriesComponent
  ]
})
export class DangerousgoodsModule { }
