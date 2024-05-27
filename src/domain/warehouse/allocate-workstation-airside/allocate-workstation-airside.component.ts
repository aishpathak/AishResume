import { NgcPage, NgcFormGroup, NgcFormArray } from 'ngc-framework';
import { Component, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import { WarehouseService } from './../warehouse.service';

@Component({
    selector: 'ngc-allocate-workstation-airside',
    templateUrl: './allocate-workstation-airside.component.html',
    styleUrls: ['./allocate-workstation-airside.component.scss']
})
export class AllocateWorkstationAirsideComponent extends NgcPage {
    form: NgcFormGroup;
    rootTerminal;
    allocateWorkStationToAirsideList;
    parentSectors;
    sectorId;
    dropDownListId;
    constructor(appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef, private warehouseService: WarehouseService) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        let ancestors = this.warehouseService.getAllParentsNames().split(',');
        this.rootTerminal = ancestors[0];
        ancestors.shift();
        this.parentSectors = ancestors;
        this.sectorId = this.warehouseService.getAllParentsIds().split(',').pop();
        this.dropDownListId = this.createSourceParameter(this.sectorId);
        this.initailizeValues();
        this.onSearch();
    }

    initailizeValues() {
        this.allocateWorkStationToAirsideList = [{
            select: false,
            whsLocationId: '',
            whsSectorId: this.sectorId,
            workStationId: '',
            flagCRUD: 'C'
        }];
        this.form = new NgcFormGroup({
            // locationType: new NgcFormControl('STORAGE'),
            allocateWorkStationToAirsideList: new NgcFormArray([])
        });
    }

    checkValidations(request) {
        let message: any = {
            messageList: []
        };
        let individualMessageList = []; individualMessageList = this.warehouseService.checkForAnyDuplicateEntries('allocateWorkStationToAirsideList', ['whsLocationId', 'workStationId'], 'Duplicate Name', request.allocateWorkStationToAirsideList);
        message.messageList.push(...individualMessageList);
        if (message.messageList.length) {
            this.showResponseErrorMessages(message);
            return false;
        }
        return true;
    }

    onSave() {
        this.form.validate();
        if (this.form.invalid) {
            return;
        }
        let request: any[] = this.form.getRawValue();
        for (let element of request) {
            element.whsLocationId = Number(element.whsLocationId);
            element.workStationId = element.workStationId;
        }
        if (!this.checkValidations(request)) {
            return;
        }
        this.warehouseService.modifyAllocatedWorkStation(this.form.getRawValue()).subscribe((resp) => {
            if (resp.data) {
                this.showSuccessStatus('g.completed.successfully');
                this.form.get('allocateWorkStationToAirsideList').patchValue(resp.data);
            } else {
                this.showErrorStatus('g.server.exception');
            }
        }, (err) => {
            this.showErrorStatus('g.unable.to.contact.server');
        }, () => {
        })
    }

    onDelete(index) {
        (<NgcFormGroup>this.form.get(['allocateWorkStationToAirsideList', index])).markAsDeleted();
    }

    onAdd() {
        (<NgcFormArray>this.form.get('allocateWorkStationToAirsideList')).addValue(this.allocateWorkStationToAirsideList);
    }

    onSearch() {
        this.warehouseService.getAllocatedWorkStation({ whsSectorId: this.sectorId }).subscribe((resp) => {
            if (resp.data) {
                this.form.get('allocateWorkStationToAirsideList').patchValue(resp.data);
            } else {
                this.showErrorStatus('g.server.exception');
            }
        }, (err) => {
            this.showErrorStatus('g.unable.to.contact.server');
        }, () => {
        })
    }
}
