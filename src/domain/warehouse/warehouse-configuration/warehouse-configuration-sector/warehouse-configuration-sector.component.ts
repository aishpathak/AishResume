import { SectorLocationsService } from './sector-locations.service';
import { Router } from '@angular/router';
import { WarehouseService } from './../../warehouse.service';
import { Component, OnInit, NgZone, ElementRef, Input, ViewChild } from '@angular/core';
import { NgcContainer, NgcWindowComponent } from 'ngc-framework';

@Component({
    selector: 'ngc-warehouse-configuration-sector',
    providers: [SectorLocationsService],
    templateUrl: './warehouse-configuration-sector.component.html',
    styleUrls: ['./warehouse-configuration-sector.component.scss']
})
export class WarehouseConfigurationSectorComponent extends NgcContainer {
    @ViewChild('window')
    window: NgcWindowComponent;
    @Input()
    sectorModel;
    @Input()
    parentSectorModel;
    @Input()
    parentTerminalModel;
    @Input()
    ancestorSectorsSectorCode = "";
    @Input()
    ancestorSectorsWhsSectorId = "";
    allParentsNames;
    allParentsIds;
    windowIsOpen = false;
    constructor(containerZone: NgZone, containerElement: ElementRef,
        private service: WarehouseService, private router: Router, private sectorLocationsService: SectorLocationsService) {
        super(containerZone, containerElement, null);
        // console.log(this.service);
    }

    onClick() {
    }

    ngOnInit() {
        super.ngOnInit();
        this.addSectorAncestorsCodeAndId();
        this.setSectorLocationsService();
    }

    setSectorLocationsService() {
        this.sectorLocationsService.sectorModel = this.sectorModel;
        this.sectorLocationsService.parentSectorModel = this.parentSectorModel;
        this.sectorLocationsService.parentTerminalModel = this.parentTerminalModel;
        this.sectorLocationsService.ancestorSectorsSectorCode = this.ancestorSectorsSectorCode;
        this.sectorLocationsService.ancestorSectorsWhsSectorId = this.ancestorSectorsWhsSectorId;
    }

    /**
     * If ancestor is a sector, add code and id
     * 
     * @memberof WarehouseConfigurationSectorComponent
     */
    addSectorAncestorsCodeAndId() {
        if (this.parentSectorModel) {
            // this.sectorModel.parentSectorName = this.parentSectorModel.name;
            this.ancestorSectorsSectorCode += this.parentSectorModel.sectorCode + '?';
            this.ancestorSectorsWhsSectorId += this.parentSectorModel.whsSectorId + '?';
        }
    }

    setAllParentsNamesAndIds() {
        let ancestorSectorsSectorCode: any = this.ancestorSectorsSectorCode.split('?');
        ancestorSectorsSectorCode.pop();
        ancestorSectorsSectorCode = ancestorSectorsSectorCode.toString();
        let ancestorSectorsWhsSectorId: any = this.ancestorSectorsWhsSectorId.split('?');
        ancestorSectorsWhsSectorId.pop();
        ancestorSectorsWhsSectorId = ancestorSectorsWhsSectorId.toString();
        this.allParentsNames = this.parentTerminalModel.terminalCode + ',' + (ancestorSectorsSectorCode ?
            (ancestorSectorsSectorCode + ',') : '') + this.sectorModel.sectorCode;
        this.allParentsIds = this.parentTerminalModel.whsTerminalId + ',' + (ancestorSectorsWhsSectorId ?
            (ancestorSectorsWhsSectorId + ',') : '') + this.sectorModel.whsSectorId;
    }

    /**
     * Sets AllParentsNames, AllParentsIds and TerminalModel in service and navigates to
     * a new page to add/udpate/delete sectors
     * 
     * @memberof WarehouseConfigurationSectorComponent
     */
    onAddSector() {
        this.setAllParentsNamesAndIds();
        this.service.setAllParentsNames(this.allParentsNames);
        this.service.setAllParentsIds(this.allParentsIds);
        this.service.setSectorModel(this.sectorModel);
        this.router.navigate(['warehouse', 'addsector']);
    }

    onAddLocation() {
        this.setAllParentsNamesAndIds();
        this.service.setAllParentsNames(this.allParentsNames);
        this.service.setAllParentsIds(this.allParentsIds);
        this.service.setSectorModel(this.sectorModel);
        this.router.navigate(['warehouse', 'addlocation']);
    }

    onAllocateTruckDock() {
        this.setAllParentsNamesAndIds();
        this.service.setAllParentsNames(this.allParentsNames);
        this.service.setAllParentsIds(this.allParentsIds);
        this.service.setSectorModel(this.sectorModel);
        this.router.navigate(['warehouse', 'allocatetruckdock']);
    }

    onAddHandlingConstraints(sector, index) {
        console.log(sector);
        this.windowIsOpen = false;
        setTimeout(() => {
            this.service.setReferences(sector.whsSectorId, 'SECTOR');
            this.windowIsOpen = true;
            this.window.open();
        }, 0);
    }

}
