import { Router } from '@angular/router';
import { WarehouseService } from './../warehouse.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, PageConfiguration, NgcWindowComponent } from 'ngc-framework';

@Component({
    selector: 'app-whs-configuration',
    templateUrl: './whs-configuration.component.html',
    styleUrls: ['./whs-configuration.component.scss']
})
export class WhsConfigurationComponent extends NgcPage {
    // main object that will patch the entire warehouse screen
    listHandlingArea;
    // current terminal index
    currentSelectedIndex: number = 0;
    constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
        private warehouseService: WarehouseService, private router: Router) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        super.ngOnInit();
        this.fetchWareHouseLocations();
    }

    /**
     * Fetches all the terminals, sectors and locations to display on page load
     * 
     * @memberof WarehouseConfigurationComponent
     */
    fetchWareHouseLocations() {
        this.warehouseService.fetchWareHouseLocations({}).subscribe((resp) => {
            if (resp.data) {
                this.listHandlingArea = resp.data;
            } else {
                this.showErrorStatus('g.server.exception');
            }
        }, (err) => {
            this.showErrorStatus('g.unable.to.contact.server');
        });
    }

    onCancel() {
        this.navigateHome();
    }

    onTabChange(event) {
        // console.log(event);
        this.currentSelectedIndex = event.index;
    }

    getCurrentSector(event, sectorDepth, sector) {
        if (event.indices.length > sectorDepth) {
            return this.getCurrentSector(event, sectorDepth + 1, sector.sectorsList[event.indices[event.indices.length - sectorDepth - 1]]);
        }
        return sector;
    }

    // refresh warehouse sector and all its children
    setWareHouseSector(event, index) {
        let currentSector = this.getCurrentSector(event, 0, this.listHandlingArea[index]);
        this.warehouseService.fetchSector({ whsSectorId: currentSector.whsSectorId }).subscribe((resp) => {
            if (resp.data) {
                currentSector.sectorCode = resp.data.sectorCode;
                currentSector.whsSectorId = resp.data.whsSectorId;
                currentSector.whsAssociateHandlingConstraintWithAreaId = resp.data.whsAssociateHandlingConstraintWithAreaId;
                currentSector.whsHandlingConstraintsName = resp.data.whsHandlingConstraintsName;
                currentSector.whsHandlingConstraintsId = resp.data.whsHandlingConstraintsId;
                currentSector.locationList = resp.data.locationList;
                currentSector.sectorsList = resp.data.sectorsList;
                this.showSuccessStatus('g.completed.successfully');
            } else {
                this.showErrorStatus('g.server.exception');
            }
        }, (err) => {
            this.showErrorStatus('g.unable.to.contact.server');
        });
    }

    // refresh warehouse terminal/sector
    onCatchRequestRefresh(event, index) {
        console.log(event, index);
        if (event.type === "terminal") {
            this.warehouseService.fetchWareHouseTerminal({ whsTerminalId: event.id }).subscribe((resp) => {
                if (resp.data) {
                    this.listHandlingArea[index] = resp.data;
                    this.showSuccessStatus('g.completed.successfully');
                } else {
                    this.showErrorStatus('g.server.exception');
                }
            }, (err) => {
                this.showErrorStatus('g.unable.to.contact.server');
            });
        } else {
            this.setWareHouseSector(event, index);
        }
    }

}
