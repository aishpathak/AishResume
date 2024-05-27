import { Router } from '@angular/router';
import { WarehouseService } from './../../warehouse.service';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgcWindowComponent } from 'ngc-framework';


@Component({
    selector: 'ngc-wh-terminal',
    templateUrl: './terminal.component.html',
    styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit {
    @Input()
    terminal;
    @ViewChild('windowAssociateHandlingConstraint')
    windowAssociateHandlingConstraint: NgcWindowComponent;
    @ViewChild('windowAddSectors')
    windowAddSectors: NgcWindowComponent;
    popUpWindowConfig = {
        associateHandlingConstraint: false,
        addSectors: false
    };
    @Output('requestRefresh')
    requestRefresh = new EventEmitter;
    constraintName;
    // if user modifies constraint, it will be present in this
    newConstraintName;
    constraintId;
    newConstraintId;
    currentSelectedIndex = 0;
    constructor(private service: WarehouseService, private router: Router) { }

    ngOnInit() {
        this.initializations();
    }

    initializations() {
        this.constraintName = this.terminal.whsHandlingConstraintsName;
        this.constraintId = this.terminal.whsHandlingConstraintsId;
    }

    onAddHandlingConstraints() {
        // set references to be able to make save operation in associate handling constraint
        this.service.setReferences(this.terminal.whsTerminalId, 'TERMINAL');
        this.popUpWindowConfig.associateHandlingConstraint = true;
        this.windowAssociateHandlingConstraint.open();
    }

    windowCloseAssociateHandlingConstraint(event) {
        this.windowAssociateHandlingConstraint.close();
        this.newConstraintName = event.newHandlingConstraint;
        this.newConstraintId = event.newHandlingConstraintId;
        this.terminal.whsAssociateHandlingConstraintWithAreaId = event.whsAssociateHandlingConstraintWithAreaId;
    }

    onAddSector() {
        let allParentNames = this.terminal.terminalCode;
        let allParentsIds = this.terminal.whsTerminalId;
        this.service.setAllParentsNames(allParentNames);
        this.service.setAllParentsIds(allParentsIds);
        this.service.setTerminalModel(this.terminal);
        this.service.setSectorModel(null);
        this.popUpWindowConfig.addSectors = false;
        setTimeout(() => {
            this.popUpWindowConfig.addSectors = true;
            this.windowAddSectors.open();
        }, 0);

        // this.router.navigate(['warehouse', 'addsector']);
    }

    // comment this function later once the master component controls everything
    onModifySector(event) {
        this.terminal.sectorsList = event;
    }

    onTabSelect(event) {
        this.currentSelectedIndex = event.index;
    }

    onRequestRefresh() {
        this.requestRefresh.emit({
            id: this.terminal.whsTerminalId,
            code: this.terminal.terminalCode,
            constraintId: this.newConstraintId || this.constraintId,
            constraintName: this.newConstraintName || this.constraintName,
            type: 'terminal',
            indices: []
        });
    }

    onCatchRequestRefresh(event, index) {
        event.indices.push(index);
        this.requestRefresh.emit(event);
    }
}
