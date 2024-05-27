import { WarehouseService } from './../warehouse.service';
import { Validators } from '@angular/forms';
import { Component, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl } from 'ngc-framework';


@Component({
    selector: 'ngc-setup-devices',
    templateUrl: './setup-devices.component.html',
    styleUrls: ['./setup-devices.component.scss']
})

export class SetupDevicesComponent extends NgcPage {
    weighingScalesListRow = [{
        deviceName: '',
        ipAddress: '',
        calibration: 0.0,
        canConnectFlag: false,
        select: false,
        deviceType: 'WEIGHINGSCALE',
        flagCRUD: 'C'
    }];
    printersListRow = [{
        deviceName: '',
        ipAddress: '',
        printerType: '',
        canConnectFlag: false,
        select: false,
        deviceType: 'PRINTER',
        flagCRUD: 'C'
    }];
    volumetricScannersListRow = [{
        deviceName: '',
        scannerType: '',
        scannerId: '',
        endPointAddress: '',
        canConnectFlag: false,
        select: false,
        deviceType: 'VOLUMETRICSCANNER',
        flagCRUD: 'C'
    }];
    weighingScalesList = [];
    printersList = [];
    volumetricScannersList = [];
    form = new NgcFormGroup({
        weighingScalesList: new NgcFormArray([]),
        printersList: new NgcFormArray([]),
        volumetricScannersList: new NgcFormArray([])
    });
    rootTerminal;
    parentSectors;
    message;
    constructor(appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef, private warehouseService: WarehouseService) {
        super(appZone, appElement, appContainerElement);
    }


    ngOnInit() {
        let ancestors = this.warehouseService.getAllParentsNames().split(',');
        this.rootTerminal = ancestors[0];
        ancestors.shift();
        this.parentSectors = ancestors;
        this.patchDeviceLists();
    }

    patchDeviceLists() {
        let setUpDevices = this.warehouseService.getdataToSetUpDevices();
        // console.log(this.warehouseService.getdataToSetUpDevices());
        for (const device of setUpDevices.locationsList[0].whsLocationDeviceMappingList) {
            if (device.deviceType === 'WEIGHINGSCALE') { // repeat for all three
                this.weighingScalesList.push({
                    deviceName: device.deviceName,
                    ipAddress: device.ipAddress,
                    calibration: device.calibration,
                    canConnectFlag: device.canConnectFlag,
                    select: false,
                    deviceType: 'WEIGHINGSCALE',
                    flagCRUD: 'R',
                    whsLocationDeviceMappingId: device.whsLocationDeviceMappingId
                })
            } else if (device.deviceType === 'PRINTER') {
                this.printersList.push({
                    deviceName: device.deviceName,
                    ipAddress: device.ipAddress,
                    printerType: device.printerType,
                    canConnectFlag: device.canConnectFlag,
                    select: false,
                    deviceType: 'PRINTER',
                    flagCRUD: 'R',
                    whsLocationDeviceMappingId: device.whsLocationDeviceMappingId
                })
            } else {
                this.volumetricScannersList.push({
                    deviceName: device.deviceName,
                    endPointAddress: device.endPointAddress,
                    canConnectFlag: device.canConnectFlag,
                    select: false,
                    deviceType: 'VOLUMETRICSCANNER',
                    flagCRUD: 'R',
                    whsLocationDeviceMappingId: device.whsLocationDeviceMappingId,
                    scannerType: device.scannerType,
                    scannerId: device.scannerId
                })
            }
        }
        this.form.get('weighingScalesList').patchValue(this.weighingScalesList);
        this.form.get('printersList').patchValue(this.printersList);
        this.form.get('volumetricScannersList').patchValue(this.volumetricScannersList);
        this.setControlValidators();
    }

    setControlValidators() {
        let formRawValue = this.form.getRawValue();
        console.log(formRawValue);
        for (let i = 0; i < formRawValue.weighingScalesList.length; ++i) {
            (<NgcFormControl>this.form.get(['weighingScalesList', i, 'deviceName'])).setValidators([Validators.required, Validators.maxLength(35)]);
            (<NgcFormControl>this.form.get(['weighingScalesList', i, 'ipAddress'])).setValidators([Validators.required, Validators.maxLength(25)]);
        }
        for (let i = 0; i < formRawValue.printersList.length; ++i) {
            (<NgcFormControl>this.form.get(['printersList', i, 'deviceName'])).setValidators([Validators.required, Validators.maxLength(35)]);
            (<NgcFormControl>this.form.get(['printersList', i, 'ipAddress'])).setValidators([Validators.required, Validators.maxLength(25)]);
            (<NgcFormControl>this.form.get(['printersList', i, 'printerType'])).setValidators([Validators.required, Validators.maxLength(15)]);
        }
        for (let i = 0; i < formRawValue.volumetricScannersList.length; ++i) {
            (<NgcFormControl>this.form.get(['volumetricScannersList', i, 'deviceName'])).setValidators([Validators.required, Validators.maxLength(35)]);
            (<NgcFormControl>this.form.get(['volumetricScannersList', i, 'scannerType'])).setValidators([Validators.required, Validators.maxLength(200)]);
            (<NgcFormControl>this.form.get(['volumetricScannersList', i, 'scannerId'])).setValidators([Validators.required, Validators.maxLength(200)]);
            (<NgcFormControl>this.form.get(['volumetricScannersList', i, 'scannerId'])).setValidators([Validators.maxLength(200)]);
        }
    }

    onAddWeighingScale() {
        if (this.form.get('weighingScalesList').invalid) {
            this.showErrorStatus('warehouse.pleasefill.previousrow(s)');
        }
        (<NgcFormArray>this.form.get('weighingScalesList')).addValue(this.weighingScalesListRow);
        const len = (<NgcFormArray>this.form.get('weighingScalesList')).length;
        (<NgcFormControl>this.form.get(['weighingScalesList', len - 1, 'deviceName'])).setValidators([Validators.required, Validators.maxLength(35)]);
        (<NgcFormControl>this.form.get(['weighingScalesList', len - 1, 'ipAddress'])).setValidators([Validators.required, Validators.maxLength(25)]);
        // (<NgcFormControl>this.form.get(['weighingScalesList', len - 1, 'canConnectFlag'])).setValidators(Validators.required);
    }

    onAddPrinter() {
        if (this.form.get('printersList').invalid) {
            this.showErrorStatus('warehouse.pleasefill.previousrow(s)');
        }
        (<NgcFormArray>this.form.get('printersList')).addValue(this.printersListRow);
        const len = (<NgcFormArray>this.form.get('printersList')).length;
        (<NgcFormControl>this.form.get(['printersList', len - 1, 'deviceName'])).setValidators([Validators.required, Validators.maxLength(35)]);
        (<NgcFormControl>this.form.get(['printersList', len - 1, 'ipAddress'])).setValidators([Validators.required, Validators.maxLength(25)]);
        (<NgcFormControl>this.form.get(['printersList', len - 1, 'printerType'])).setValidators([Validators.required, Validators.maxLength(15)]);
        // (<NgcFormControl>this.form.get(['printersList', len - 1, 'canConnectFlag'])).setValidators(Validators.required);
    }

    onAddScanner() {
        if (this.form.get('volumetricScannersList').invalid) {
            this.showErrorStatus('warehouse.pleasefill.previousrow(s)');
        }
        (<NgcFormArray>this.form.get('volumetricScannersList')).addValue(this.volumetricScannersListRow);
        const len = (<NgcFormArray>this.form.get('volumetricScannersList')).length;
        (<NgcFormControl>this.form.get(['volumetricScannersList', len - 1, 'deviceName'])).setValidators([Validators.required, Validators.maxLength(35)]);
        (<NgcFormControl>this.form.get(['volumetricScannersList', len - 1, 'scannerType'])).setValidators([Validators.required, Validators.maxLength(200)]);
        (<NgcFormControl>this.form.get(['volumetricScannersList', len - 1, 'endPointAddress'])).setValidators([Validators.required, Validators.maxLength(200)]);
        (<NgcFormControl>this.form.get(['volumetricScannersList', len - 1, 'scannerId'])).setValidators(Validators.required);
    }

    addMoreDuplicateSectorCodes(sector, sectorsList, index) {
        for (let i = index + 1; i < sectorsList.length; ++i) {
            if (sector.sectorCode === sectorsList[i].sectorCode) {
                this.message.messageList.push({
                    code: 'Duplicate Sector Code',
                    referenceId: 'sectorsList[' + i + '].sectorCode'
                })
            }
        }
    }

    checkForAnyDuplicateDevices(deviceListName) {
        let hashMap = {};
        let devicesList = this.form.getRawValue()[deviceListName];
        this.message = {};
        let index = 0;
        for (let device of devicesList) {
            if (!hashMap[device.deviceName])
                hashMap[device.deviceName] = 1;
            else {
                this.message.messageList = [
                    {
                        code: 'Duplicate Device Name',
                        referenceId: deviceListName + '[' + index + '].deviceName'
                    }
                ];
                // this.addMoreDuplicateSectorCodes(device, devicesList, index);
                return false;
            }
            ++index;
        }
        // sectorsList
        return true;
    }

    checkForAnyDuplicateDevicesForEachType() {
        if (!this.checkForAnyDuplicateDevices('weighingScalesList')) {
            return false;
        }
        let individualMessageList = this.warehouseService.checkForAnyDuplicateEntries('printersList', ['deviceName', 'ipAddress', 'printerType'], 'Duplicate Row', this.form.getRawValue()['printersList']);
        this.message.messageList = [];
        this.message.messageList.push(...individualMessageList);
        if (individualMessageList.length) {
            return false;
        }
        if (!this.checkForAnyDuplicateDevices('volumetricScannersList')) {
            return false;
        }
        return true;
    }

    onSave() {
        this.form.validate();
        if (this.form.invalid) {
            this.showErrorStatus('warehouse.pleasefill.allthe.mandatoryfields');
            return;
        }
        if (!this.checkForAnyDuplicateDevicesForEachType()) {
            this.showResponseErrorMessages(this.message);
            return;
        }
        console.log(JSON.stringify(this.form.getRawValue()));
        console.log(JSON.stringify(this.warehouseService.getdataToSetUpDevices()));
        const formRawValue = this.form.getRawValue();
        const dataToSetUpDevices = this.warehouseService.getdataToSetUpDevices();
        let setUpDevices = {
            locationsList: dataToSetUpDevices.locationsList
        };
        for (let location of setUpDevices.locationsList) {
            location.whsLocationDeviceMappingList = [];
            location.whsLocationDeviceMappingList.push(...formRawValue.weighingScalesList);
            location.whsLocationDeviceMappingList.push(...formRawValue.printersList);
            location.whsLocationDeviceMappingList.push(...formRawValue.volumetricScannersList);
        }
        console.log(JSON.stringify(setUpDevices));
        this.warehouseService.modifyWhsLocationDeviceMapping(setUpDevices).subscribe((resp) => {
            if (resp.data) {
                this.showSuccessStatus('g.completed.successfully');
                this.setFlagToRead();
            } else {
                this.showErrorStatus('g.server.exception');
            }
        }, (err) => {
            this.showErrorStatus('g.unable.to.contact.server');
        })
    }

    weighingScalesListRowDelete(index) {
        (<NgcFormGroup>this.form.get(['weighingScalesList', index])).markAsDeleted();
    }

    weighingScalesListRowsDelete() {
        const len = (<NgcFormArray>this.form.get(['weighingScalesList'])).length;
        for (let i = 0; i < len; ++i) {
            if (this.form.get(['weighingScalesList', i, 'select']).value) {
                this.weighingScalesListRowDelete(i);
            }
        }
    }

    printersListRowDelete(index) {
        (<NgcFormGroup>this.form.get(['printersList', index])).markAsDeleted();
    }

    printersListRowsDelete() {
        const len = (<NgcFormArray>this.form.get(['printersList'])).length;
        for (let i = 0; i < len; ++i) {
            if (this.form.get(['printersList', i, 'select']).value) {
                this.printersListRowDelete(i);
            }
        }
    }

    volumetricScannersListRowDelete(index) {
        (<NgcFormGroup>this.form.get(['volumetricScannersList', index])).markAsDeleted();
    }

    volumetricScannersListRowsDelete() {
        const len = (<NgcFormArray>this.form.get(['volumetricScannersList'])).length;
        for (let i = 0; i < len; ++i) {
            if (this.form.get(['volumetricScannersList', i, 'select']).value) {
                this.volumetricScannersListRowDelete(i);
            }
        }
    }

    setFlagToRead() {
        let formRawValue = this.form.getRawValue();
        console.log(formRawValue);
        // Printers List
        let noOfDeletions = 0;
        for (let i = 0; i < formRawValue.printersList.length; ++i) {
            if (formRawValue.printersList[i].flagCRUD === 'C' || formRawValue.printersList[i].flagCRUD === 'U' || formRawValue.printersList[i].flagCRUD === 'R') {
                (<NgcFormControl>this.form.get(['printersList', i - noOfDeletions, 'flagCRUD'])).setValue('R');
                (<NgcFormControl>this.form.get(['printersList', i - noOfDeletions, 'deviceName'])).setValidators([Validators.required, Validators.maxLength(35)]);
                (<NgcFormControl>this.form.get(['printersList', i - noOfDeletions, 'ipAddress'])).setValidators([Validators.required, Validators.maxLength(25)]);
                (<NgcFormControl>this.form.get(['printersList', i - noOfDeletions, 'printerType'])).setValidators([Validators.required, Validators.maxLength(15)]);
            }
            else {
                (<NgcFormArray>this.form.get('printersList')).deleteValueAt(i - noOfDeletions);
                ++noOfDeletions;
            }

            // (<NgcFormControl>this.form.get(['printersList', i, 'canConnectFlag'])).setValidators(Validators.required);
        }
        // Scanners List
        for (let i = 0; i < formRawValue.volumetricScannersList.length; ++i) {
            if (formRawValue.volumetricScannersList[i].flagCRUD === 'C' || formRawValue.volumetricScannersList[i].flagCRUD === 'U' || formRawValue.volumetricScannersList[i].flagCRUD === 'R') {
                (<NgcFormControl>this.form.get(['volumetricScannersList', i - noOfDeletions, 'flagCRUD'])).setValue('R');
                (<NgcFormControl>this.form.get(['volumetricScannersList', i - noOfDeletions, 'deviceName'])).setValidators([Validators.required, Validators.maxLength(35)]);
                (<NgcFormControl>this.form.get(['volumetricScannersList', i - noOfDeletions, 'scannerId'])).setValidators([Validators.required, Validators.maxLength(200)]);
                (<NgcFormControl>this.form.get(['volumetricScannersList', i - noOfDeletions, 'scannerType'])).setValidators([Validators.required, Validators.maxLength(200)]);
                (<NgcFormControl>this.form.get(['volumetricScannersList', i - noOfDeletions, 'endPointAddress'])).setValidators([Validators.required, Validators.maxLength(200)]);
            }
            else {
                (<NgcFormArray>this.form.get('volumetricScannersList')).deleteValueAt(i - noOfDeletions);
            }

        }
        // Scales List
        for (let i = 0; i < formRawValue.weighingScalesList.length; ++i) {
            if (formRawValue.weighingScalesList[i].flagCRUD === 'C' || formRawValue.weighingScalesList[i].flagCRUD === 'R' || formRawValue.weighingScalesList[i].flagCRUD === 'U') {
                (<NgcFormControl>this.form.get(['weighingScalesList', i - noOfDeletions, 'flagCRUD'])).setValue('R');
                (<NgcFormControl>this.form.get(['weighingScalesList', i - noOfDeletions, 'deviceName'])).setValidators([Validators.required, Validators.maxLength(35)]);
                (<NgcFormControl>this.form.get(['weighingScalesList', i - noOfDeletions, 'ipAddress'])).setValidators([Validators.required, Validators.maxLength(25)]);
            }
            else {
                (<NgcFormArray>this.form.get('weighingScalesList')).deleteValueAt(i - noOfDeletions);
            }

        }
    }

    onCancel() {
        this.navigateBack(null);
    }
}
