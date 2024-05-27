import { AdminService } from './admin.service';
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
import { CreateTeamComponent } from './resource/team/create-team/create-team.component';
import { MaintainTeamComponent } from './resource/team/maintain-team/maintain-team.component';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';

/**
 * Route
 */
const routes: Routes = [
      // Default
      // { path: 'maintainteam', component: MaintainTeamComponent },
      // { path: 'createteam', component: CreateTeamComponent },
      // { path: '**', redirectTo: '/' }
];

@NgModule({
      imports: [
            // Admin Child Routes
            RouterModule.forChild(routes),
            CommonModule, ReactiveFormsModule, RouterModule,
            NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
      ],
      exports: [
            MaintainTeamComponent,
            CreateTeamComponent,
      ],
      declarations: [
            MaintainTeamComponent,
            CreateTeamComponent,
      ],
      bootstrap: [],
      providers: [AdminService]
})
export class AdminModule { }
