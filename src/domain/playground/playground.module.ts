import { ChildComponent } from './component-communication/child/child.component';
import { ParentComponent } from './component-communication/parent/parent.component';
/**
 *  Playground Routing Module
 * 
 * @copyright SATS Singapore 2017-18
 */
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import {
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
} from 'ngc-framework';
// Cosys
import { PlaygroundPage } from './landing/playground.component';
import { DatatablePage } from './datatable/datatable.component';
import { DataGridPage } from './datagrid/datagrid.component';
import { GridPage } from './grid/grid.component';
import { TablePage } from './table/table.component';
import { ChartPage } from './chart/chart.component';

/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: PlaygroundPage },
    //
    { path: 'nextToDatatable', component: DatatablePage },
    { path: 'nextToDataGrid', component: DataGridPage },
    { path: 'nextToGrid', component: GridPage },
    { path: 'nextToTable', component: TablePage },
    { path: 'nextToChart', component: ChartPage },
    { path: 'componentCommunication', component: ParentComponent }
    // componentCommunication
];

/**
 * Playground Routing Module
 */
@NgModule({
    imports: [
        // Playground Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    exports: [
    ],
    declarations: [
        PlaygroundPage, DatatablePage, GridPage, TablePage, DataGridPage, ChartPage, ParentComponent,
        ChildComponent
    ],
    bootstrap: [],
    providers: []
})
export class PlaygroundRoutingModule {
}
