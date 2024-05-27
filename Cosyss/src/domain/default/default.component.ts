/**
 * @copyright SATS Singapore 2017-18
 */
// Angular
import { Component, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Application
import { NgcPage, StatusMessage, PageConfiguration } from 'ngc-framework';

/**
 * Default Page
 */
@Component({
    selector: 'default-page',
    templateUrl: './default.html'
})
@PageConfiguration({ trackInit: true })
export class DefaultPage extends NgcPage {

    /**
     * Initialize
     * 
     * @param appZone Ng Zone
     * @param appElement Element Ref
     * @param appContainerElement View Container Ref
     */
    constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
        private activatedRoute: ActivatedRoute, private router: Router) {
        //
        super(appZone, appElement, appContainerElement);
    }

    /**
     * On Initialization
     */
    public ngOnInit(): void {
        super.ngOnInit();
        // Update Status
        this.showStatus(new StatusMessage(null, "Hello, Welcome to Cosys NG!"));
    }
    public onBan() {
        this.navigate('tcs/maintainBanInfo', {});
    }
    onTruckDocMaintenance() {
        this.navigate('tcs/truck-dock-maintenance', {});
    }
    onTruckDocMonitoring() {
        this.navigate('tcs/truck-dock-monitoring', {});
    }
    onTruckTemplate() {
        this.navigate('tcs/truck-dock-template', {});
    }
    onMaintainTruckDock() {
        this.navigate('tcs/maintain-truck-dock', {});
    }
}
