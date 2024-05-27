import { EventEmitter } from '@angular/core';
import { Validators } from '@angular/forms';
import { NgcFormControl } from 'ngc-framework/core/model/formcontrol.model';
import { NgcFormGroup, NgcPage, NgcFormArray } from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, OnDestroy, Output } from '@angular/core';
import { WarehouseService } from './../warehouse.service';

@Component({
    selector: 'ngc-add-sector',
    templateUrl: './add-sector.component.html',
    styleUrls: ['./add-sector.component.scss']
})
export class AddSectorComponent extends NgcPage {
    form = new NgcFormGroup({
        sectorsList: new NgcFormArray([])
    });
    sectorsList = [];
    rootTerminal;
    message;
    parentSectors;
    // remove this output emmitter once the master component controls everything
    @Output()
    modifySector = new EventEmitter;
    constructor(appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef, private service: WarehouseService) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        super.ngOnInit();
        console.log(this.service.getAllParentsNames());
        console.log(this.service.getAllParentsIds());
        let tableArray = [];
        let ancestors = this.service.getAllParentsNames().split(',');
        this.rootTerminal = ancestors[0];
        ancestors.shift();
        this.parentSectors = ancestors;
        if (this.service.getSectorModel()) {
            this.sectorsList = this.service.getSectorModel().sectorsList;
        } else {
            this.sectorsList = this.service.getTerminalModel().sectorsList;
        }
        console.log(this.sectorsList);

        this.setValuesToFormModel(this.sectorsList);
        console.log(this.form.getRawValue());
        console.log((this.form.getList('sectorsList')).length);
    }

    setValuesToFormModel(sectorsList) {
        let tableArray = this.getArrayToPatch(sectorsList);
        this.form.get('sectorsList').patchValue(tableArray);
        let i = 0;
        for (const eachRow of tableArray) {
            (<NgcFormControl>this.form.get(['sectorsList', i, 'sectorCode'])).setValidators([Validators.required, Validators.maxLength(15)]);
            ++i;
        }
    }

    getArrayToPatch(sectorsList) {
        const tableArray = [];
        for (const eachSector of sectorsList) {
            tableArray.push({
                select: false,
                sectorCode: eachSector.sectorCode,
                flagCRUD: 'R',
                whsSectorId: eachSector.whsSectorId,
                sectorsList: eachSector.sectorsList || [],
                locationList: eachSector.locationList || []
            });
        }
        return tableArray;
    }

    onAddSector() {
        if (this.form.invalid) {
            this.showErrorStatus('warehouse.pleasefill.allthe.sectorfirst');
            return;
        }
        (<NgcFormArray>this.form.get('sectorsList')).addValue([{
            select: false,
            sectorCode: '',
            flagCRUD: 'C',
            whsSectorId: null,
            sectorsList: [],
            locationList: []
        }]);
        const len = (<NgcFormArray>this.form.get('sectorsList')).length;
        (<NgcFormControl>this.form.get(['sectorsList', len - 1, 'sectorCode'])).setValidators([Validators.required, Validators.maxLength(15)]);
    }

    onDeleteSector(index) {
        // if (this.form.get(['sectorsList', index, 'flagCRUD']).value === 'C') {
        //     (<NgcFormArray>this.form.get('sectorsList')).deleteValueAt(index);
        // } else if (this.form.get(['sectorsList', index, 'flagCRUD']).value === 'R' ||
        //     this.form.get(['sectorsList', index, 'flagCRUD']).value === 'U') {
        //     this.form.get(['sectorsList', index, 'flagCRUD']).setValue('D');
        // }
        (<NgcFormGroup>this.form.get(['sectorsList', index])).markAsDeleted();
    }

    onDeleteSectors() {
        const len = (<NgcFormArray>this.form.get(['sectorsList'])).length;
        for (let i = 0; i < len; ++i) {
            if (this.form.get(['sectorsList', i, 'select']).value) {
                this.onDeleteSector(i);
            }
        }
    }

    addMoreDuplicateSectorCodes(sector, sectorsList, index) {
        for (let i = index + 1; i < sectorsList.length; ++i) {
            if (sector.sectorCode === sectorsList[i].sectorCode) {
                this.message.messageList.push({
                    code: 'warehouse.duplicate.sectorcode',
                    referenceId: 'sectorsList[' + i + '].sectorCode'
                })
            }
        }
    }

    checkForAnyDuplicateSectors() {
        let hashMap = {};
        let sectorsList = this.form.getRawValue().sectorsList;
        this.message = {};
        let index = 0;
        for (let sector of sectorsList) {
            if (!hashMap[sector.sectorCode])
                hashMap[sector.sectorCode] = 1;
            else {
                this.message.messageList = [
                    {
                        code: 'warehouse.duplicate.sectorcode',
                        referenceId: 'sectorsList[' + index + '].sectorCode'
                    }
                ];
                this.addMoreDuplicateSectorCodes(sector, sectorsList, index);
                return false;
            }
            ++index;
        }
        // sectorsList
        return true;
    }

    onSave() {
        if (!this.checkForAnyDuplicateSectors()) {
            this.showResponseErrorMessages(this.message);
            return;
        }
        if (this.form.invalid) {
            this.showErrorStatus('warehouse.pleasefill.allthe.sectorfirst');
            return;
        }
        console.log(this.service.getSectorModel());
        console.log(this.service.getTerminalModel());
        this.updateParentSectors();
        this.updateSectors();
    }

    updateParentSectors() {
        let addSectorRequest = this.service.getTerminalModel();
        if (!addSectorRequest) {
            return;
        }

        // for (let currentSector of addSectorRequest.sectorsList) {
        //   if (addSectorRequest.sectorsList.length || addSectorRequest.locationList.length) {
        //     if (this.deleteOperationPresent(addSectorRequest)) {
        //       this.showErrorStatus('Only sectors having no child sector and no locations can be deleted!');
        //       return;
        //     }
        //   }
        // }

        console.log(this.service.getAllParentsIds());
        addSectorRequest.sectorsList = this.form.getRawValue().sectorsList;
        console.log(JSON.stringify(addSectorRequest));
        this.service.updateParentSectors(addSectorRequest).subscribe((resp) => {
            if (resp.data) {
                this.showSuccessStatus('g.completed.successfully');
                console.log(resp);
                // this.setFlagToRead();
                this.setValuesToFormModel(resp.data.sectorsList);
                this.modifySector.emit(resp.data.sectorsList);
            } else {
                this.showErrorStatus('g.server.exception');
            }
        }, (err) => {
            this.showErrorStatus('g.unable.to.contact.server');
        });
    }

    updateSectors() {
        let addSectorRequest = this.service.getSectorModel();
        if (!addSectorRequest) {
            return;
        }

        let allParentIds = this.service.getAllParentsIds();
        let rootId = allParentIds.substring(0, allParentIds.indexOf(','));
        console.log(rootId);
        addSectorRequest.sectorsList = this.form.getRawValue().sectorsList;
        addSectorRequest.whsTerminalId = rootId;
        console.log(JSON.stringify(addSectorRequest));
        // if (this.service.getSectorModel().sectorsList.length || this.service.getSectorModel().locationList.length) {
        //   if (this.deleteOperationPresent(addSectorRequest)) {
        //     this.showErrorStatus('Only sectors having no child sector and no locations can be deleted!');
        //     return;
        //   }
        // }
        this.service.updateSectors(addSectorRequest).subscribe((resp) => {
            if (resp.data) {
                this.showSuccessStatus('g.completed.successfully');
                // this.setFlagToRead();
                this.setValuesToFormModel(resp.data.sectorsList);
                this.modifySector.emit(resp.data.sectorsList);
                console.log(resp);
            } else {
                this.showErrorStatus('g.server.exception');
            }
        }, (err) => {
            this.showErrorStatus('g.unable.to.contact.server');
        });
    }

    deleteOperationPresent(addSectorRequest) {
        // if (addSectorRequest);
        for (let eachSector of addSectorRequest.sectorsList) {
            if (eachSector.flagCRUD === 'D') {
                return true;
            }
        }
        return false;
    }

    ngOnDestroy() {
        // this.service.setSectorModel(null);
        // this.service.setTerminalModel(null);
    }

    setFlagToRead() {
        let sectorsList = this.form.getRawValue().sectorsList;
        let newSectorsList = [];
        for (let sector of sectorsList) {
            if (sector.flagCRUD === 'U' || sector.flagCRUD === 'C' || sector.flagCRUD === 'R') {
                sector.flagCRUD = 'R';
                newSectorsList.push(sector);
            }
        }
        this.form.get('sectorsList').patchValue(newSectorsList);
        for (let i = 0; i < newSectorsList.length; ++i) {
            (<NgcFormControl>this.form.get(['sectorsList', i, 'sectorCode'])).setValidators([Validators.required, Validators.maxLength(15)]);
        }
    }

    onCancel() {
        this.navigateBack(null);
    }
}


