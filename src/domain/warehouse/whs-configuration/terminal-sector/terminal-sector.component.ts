import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { WarehouseService } from './../../warehouse.service';
import { NgcWindowComponent } from 'ngc-framework';

@Component({
    selector: 'ngc-terminal-sector',
    templateUrl: './terminal-sector.component.html',
    styleUrls: ['./terminal-sector.component.scss']
})
export class TerminalSectorComponent implements OnInit {
    @Input()
    sector;
    @Input()
    allParentsNames;
    @Input()
    allParentsIds;
    @Input()
    parentConstraintName;
    @Input()
    parentConstraintId;
    @ViewChild('windowAssociateConstraint')
    windowAssociateConstraint: NgcWindowComponent;
    @ViewChild('windowAddLocation')
    windowAddLocation: NgcWindowComponent;
    @ViewChild('windowAddSectors')
    windowAddSectors: NgcWindowComponent;
    // request refresh of this terminal
    @Output('requestRefresh')
    requestRefresh = new EventEmitter;
    constraintName;
    constraintId;
    newConstraintName;
    newConstraintId;
    // current selected index of sub-terminals
    currentSelectedIndex = 0;
    popUpWindowConfig = {
        associateHandlingConstraint: false,
        addLocation: false,
        addSectors: false
    };
    constructor(private service: WarehouseService, private router: Router) { }

    ngOnInit() {
        this.initializations();
        // if (this.constraintName || this.constraintId)
        //     return;
        // this.service.fetchHandlingConstraint({ referenceType: 'SECTOR', referenceId: this.sector.whsSectorId }).subscribe((resp) => {
        //     if (resp.data) {
        //         this.constraintName = resp.data.name;
        //         this.constraintId = resp.data.whsHandlingConstraintsId;
        //     }
        // })
    }

    initializations() {
        this.constraintName = this.sector.whsHandlingConstraintsName;
        this.constraintId = this.sector.whsHandlingConstraintsId;
    }

    // set handling constraint for terminal/sector
    onAddHandlingConstraints() {
        // set references to be able to make save operation in associate handling constraint
        this.service.setReferences(this.sector.whsSectorId, 'SECTOR');
        this.popUpWindowConfig.associateHandlingConstraint = true;
        this.windowAssociateConstraint.open();
    }

    onWindowCloseAssociateHandlingConstraint(event) {
        this.windowAssociateConstraint.close();
        this.newConstraintName = event.newHandlingConstraint;
        this.newConstraintId = event.newHandlingConstraintId;
        this.sector.whsAssociateHandlingConstraintWithAreaId = event.whsAssociateHandlingConstraintWithAreaId;
    }

    onAddLocation() {
        let allParentNames = this.allParentsNames + ',' + this.sector.sectorCode;
        let allParentsIds = this.allParentsIds + ',' + this.sector.whsSectorId;
        this.service.setAllParentsNames(allParentNames);
        this.service.setAllParentsIds(allParentsIds);
        this.service.setSectorModel(this.sector);
        this.popUpWindowConfig.addLocation = false;
        setTimeout(() => {
            this.popUpWindowConfig.addLocation = true;
            this.windowAddLocation.open();
        }, 0);
        // this.router.navigate(['warehouse', 'addlocation']);
    }

    onAddSector() {
        let allParentNames = this.allParentsNames + ',' + this.sector.sectorCode;
        let allParentsIds = this.allParentsIds + ',' + this.sector.whsSectorId;
        this.service.setAllParentsNames(allParentNames);
        this.service.setAllParentsIds(allParentsIds);
        this.service.setSectorModel(this.sector);
        this.service.setTerminalModel(null);
        this.popUpWindowConfig.addSectors = false;
        setTimeout(() => {
            this.popUpWindowConfig.addSectors = true;
            this.windowAddSectors.open();
        }, 0);
        // this.router.navigate(['warehouse', 'addsector']);
    }

    getCurrentConstraint() {
        if (this.newConstraintName) {
            return this.newConstraintName;
        }
        if (this.constraintName) {
            return this.constraintName;
        }
        return this.parentConstraintName;
    }

    getCurrentConstraintId() {
        if (this.newConstraintId) {
            return this.newConstraintId;
        }
        if (this.constraintId) {
            return this.constraintId;
        }
        return this.parentConstraintId;
    }

    // comment this function later once the master component controls everything
    onFetchNewLocationList(event) {
        this.sector.locationList = event;
    }

    alertUser(event) {
        this.currentSelectedIndex = event.index;
    }

    onRequestRefresh() {
        this.requestRefresh.emit({
            id: this.sector.whsSectorId,
            code: this.sector.sectorCode,
            constraintId: this.newConstraintId || this.constraintId,
            constraintName: this.newConstraintName || this.constraintName,
            type: 'sector',
            indices: []
        });
    }

    onCatchRequestRefresh(event, index) {
        event.indices.push(index);
        this.requestRefresh.emit(event);
    }
}
