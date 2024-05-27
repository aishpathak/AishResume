import { Validators } from '@angular/forms';
import { WarehouseService } from './../warehouse.service';
import { Component, NgZone, ElementRef, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl } from 'ngc-framework';


@Component({
    selector: 'ngc-add-location',
    templateUrl: './add-location.component.html',
    styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent extends NgcPage {
    form: NgcFormGroup;
    locationRows;
    checkBoxDisable;
    searchDone;
    rootTerminal;
    parentSectors;
    @Output()
    fetchNewLocationList = new EventEmitter;
    constructor(appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef, private warehouseService: WarehouseService) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        super.ngOnInit();
        let ancestors = this.warehouseService.getAllParentsNames().split(',');
        this.rootTerminal = ancestors[0];
        ancestors.shift();
        this.parentSectors = ancestors;
        this.initailizeValues();
        this.subscribeToLocationType();
    }

    onClear() {
        this.initailizeValues();
        this.subscribeToLocationType();
    }

    initailizeValues() {
        this.locationRows = [{
            select: false,
            whColumn: '',
            whRow: '',
            locationDescription: '',
            virtualFlag: '',
            dummyLocationDefinedFor: '',
            airsideFlag: false,
            entryPointFlag: false,
            exitPointFlag: false,
            whZone: null,
            flagCRUD: 'C'
        }];
        this.checkBoxDisable = false;
        this.searchDone = false;
        this.form = new NgcFormGroup({
            locationType: new NgcFormControl('STORAGE'),
            locationsList: new NgcFormArray([])
        });
    }

    subscribeToLocationType() {
        this.form.get('locationType').valueChanges.subscribe((data) => {
            if (data === 'ICSExitPoint') {
                this.checkBoxDisable = true;
            } else {
                this.checkBoxDisable = false;
            }
        })
    }

    onSearch(redirect) {
        let searchRequest = {
            whsSectorId: this.warehouseService.getSectorModel().whsSectorId,
            locationType: this.form.get('locationType').value
        }

        this.warehouseService.fetchSectorLocationsByType(searchRequest).subscribe((resp) => {
            if (resp.data) {
                if (!redirect)
                    this.showSuccessStatus('g.completed.successfully');
                let valueToPatch = resp.data;
                for (let location of valueToPatch) {
                    location.virtualFlag = (location.virtualFlag) ? "1" : "0";
                }
                (<NgcFormArray>this.form.get('locationsList')).patchValue(resp.data);
                let len = (<NgcFormArray>this.form.get('locationsList')).length;
                for (let i = 0; i < len; ++i) {
                    // this.form.get(['locationsList', i, 'whColumn']).setValidators([Validators.required, Validators.maxLength(4)]);
                    this.form.get(['locationsList', i, 'whRow']).setValidators([Validators.required, Validators.maxLength(8)]);
                    if (this.form.get(['locationsList', i, 'virtualFlag']).value === '1') {
                        this.form.get(['locationsList', i, 'dummyLocationDefinedFor']).setValidators([Validators.required]);
                    }
                }
                this.searchDone = true;
            } else {
                this.showErrorStatus('g.server.exception');
            }
        }, (err) => {
            this.showErrorStatus('g.unable.to.contact.server');
        });
    }

    onSave() {
        this.form.validate();
        if (this.form.invalid) {
            this.showErrorStatus('warehouse.pleasefill.allthe.mandatoryfields');
            return;
        }
        // form.getRawValue().locationsList send as request, it also contains sectorId and locationType on top level
        const saveRequest = {
            locationsList: this.form.getRawValue().locationsList,
            whsSectorId: this.warehouseService.getSectorModel().whsSectorId,
            locationType: this.form.get('locationType').value
        }
        for (let location of saveRequest.locationsList) {
            location.virtualFlag = location.virtualFlag === '1' ? true : false;
        }
        console.log(JSON.stringify(saveRequest));
        this.warehouseService.addLocations(saveRequest).subscribe((resp) => {
            if (resp.data) {
                if (resp.data.messageList.length) {
                    let message: any = {};
                    message.messageList = [];
                    let currentLocationsList = this.form.getRawValue().locationsList;
                    for (let duplicatelocation of resp.data.messageList) {
                        // locationsList
                        let index = 0;
                        for (let location of currentLocationsList) {
                            if (location.flagCRUD === 'C' && location.whColumn === duplicatelocation.whColumn &&
                                location.whRow === duplicatelocation.whRow) {
                                message.messageList.push({
                                    code: 'warehouse.locationcode',
                                    referenceId: 'locationsList[' + index + '].whColumn'
                                });
                                message.messageList.push({
                                    code: 'warehouse.locationcode',
                                    referenceId: 'locationsList[' + index + '].whRow'
                                });
                            }
                            ++index;
                        }
                    }
                    this.showResponseErrorMessages(message);
                    return;
                }
                this.showSuccessStatus('g.completed.successfully');
                this.fetchNewLocationList.emit(resp.data.locationsList);
                this.onSearch(true);
            } else {
                this.showErrorStatus('g.server.exception');
            }
        }, (err) => {
            this.showErrorStatus('g.unable.to.contact.server');
        });
    }

    onAddLocation(inactivateFormValidation, presetLocationRows) {
        this.form.validate();
        if (!inactivateFormValidation && this.form.invalid) {
            this.showErrorStatus('warehouse.pleasefill.allthe.mandatoryfields');
            return;
        }
        if (presetLocationRows) {
            (<NgcFormArray>this.form.get('locationsList')).addValue(presetLocationRows);
        } else {
            (<NgcFormArray>this.form.get('locationsList')).addValue(this.locationRows);
        }
    }

    onDeleteLocation(index) {
        (<NgcFormGroup>this.form.get(['locationsList', index])).markAsDeleted();
    }

    onDeleteLocations() {
        const len = (<NgcFormArray>this.form.get(['locationsList'])).length;
        for (let i = 0; i < len; ++i) {
            if (this.form.get(['locationsList', i, 'select']).value) {
                this.onDeleteLocation(i);
            }
        }
    }

    onGenerateLocations(noOfRows) {
        console.log(noOfRows.value);
        let count = Number(noOfRows.value);
        while (count--) {
            this.onAddLocation(true, null);
        }
    }

    onGenerateMultipleLocations(locationFrom, locationTo) {
        locationTo = Number(locationTo.value);
        locationFrom = Number(locationFrom.value);
        let presetLocationRows = []
        for (let i = locationFrom; i <= locationTo; ++i) {
            let location = {
                select: false,
                whColumn: '',
                locationDescription: '',
                whRow: i,
                virtualFlag: '',
                dummyLocationDefinedFor: '',
                airsideFlag: false,
                entryPointFlag: false,
                exitPointFlag: false,
                whZone: null,
                flagCRUD: 'C'
            };
            presetLocationRows.push(location)
        }
        this.onAddLocation(true, presetLocationRows);
    }
    onChangeVirtualFlag(event, index) {
        if (event === "1") { // "Yes" selected
            this.form.get(['locationsList', index, 'dummyLocationDefinedFor']).setValidators([Validators.required]);
        } else {
            this.form.get(['locationsList', index, 'dummyLocationDefinedFor']).clearValidators();
        }
        console.log(event);
        console.log(index);
    }

    onCancel() {
        this.navigateBack(null);
    }
}
