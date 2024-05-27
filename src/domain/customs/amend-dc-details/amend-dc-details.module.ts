import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { CustomACESService } from './../customs.service';
import { AmendDcDetailsComponent } from './amend-dc-details.component';

const routes: Routes = [

    { path: '', component: AmendDcDetailsComponent },
    { path: '**', redirectTo: '/' }

];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule

    ],

    exports: [AmendDcDetailsComponent],

    providers: [CustomACESService],

    declarations: [AmendDcDetailsComponent]

})
export class AmendDcDetailsModule { }
