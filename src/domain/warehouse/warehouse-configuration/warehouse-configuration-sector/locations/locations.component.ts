import { request } from 'http';
import { SectorLocationsService } from './../sector-locations.service';
import { NgcFormArray } from 'ngc-framework';
import { WarehouseService } from './../../../warehouse.service';
import { Router } from '@angular/router';
import { Component, OnInit, NgZone, ElementRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcPage, NgcContainer, NgcFormGroup } from 'ngc-framework';


@Component({
    selector: 'ngc-locations',
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss']
})
export class LocationsComponent extends NgcPage {
    form = new NgcFormGroup({
        finalLocationsList: new NgcFormArray([])
    });
    fetchWhsLocationDeviceMappingRequest = {
        locationsList: []
    };
    @Input()
    locationList;
    totalOfLocations;
    noOfRows;
    noOfColumns;
    finalLocationsList = [];

    sectorModel;
    parentSectorModel;
    parentTerminalModel;
    ancestorSectorsSectorCode;
    ancestorSectorsWhsSectorId;

    allParentsNames;
    allParentsIds;
    // insideList = {
    //   innerList: []
    // };
    constructor(containerZone: NgZone, containerElement: ElementRef, appContainerElement: ViewContainerRef,
        private service: WarehouseService, private router: Router, private sectorLocationsService: SectorLocationsService) {
        super(containerZone, containerElement, appContainerElement);
    }

    ngOnInit() {
        this.setAllDataFromSectorLocations();
        this.totalOfLocations = this.locationList.length;
        if (this.totalOfLocations <= 16) {
            this.noOfColumns = this.totalOfLocations;
        } else {
            this.noOfColumns = 16;
        }
        this.noOfRows = (this.totalOfLocations % this.noOfColumns === 0) ? this.totalOfLocations / this.noOfColumns :
            this.totalOfLocations / this.noOfColumns + 1;
        this.noOfRows = Math.floor(this.noOfRows);
        let trackLocationList = 0;
        for (let i = 0; i < this.noOfRows; ++i) {
            let insideList = {
                innerList: []
            };
            this.finalLocationsList.push(insideList);
            for (let j = 0; j < this.noOfColumns; ++j) {
                if (trackLocationList < this.totalOfLocations) {
                    this.finalLocationsList[i].innerList.push(this.locationList[trackLocationList++]);
                } else {
                    break;
                }
            }
            this.form.get(['finalLocationsList']).patchValue(this.finalLocationsList);
        }
    }

    setAllDataFromSectorLocations() {
        this.sectorModel = this.sectorLocationsService.sectorModel;
        this.parentSectorModel = this.sectorLocationsService.parentSectorModel;
        this.parentTerminalModel = this.sectorLocationsService.parentTerminalModel;
        this.ancestorSectorsSectorCode = this.sectorLocationsService.ancestorSectorsSectorCode;
        this.ancestorSectorsWhsSectorId = this.sectorLocationsService.ancestorSectorsWhsSectorId;
    }

    arrayOne(n) {
        return Array(n + 1);
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

    onAllocateAgentToTruckDock() {
        this.setAllParentsNamesAndIds();
        this.service.setAllParentsNames(this.allParentsNames);
        this.service.setAllParentsIds(this.allParentsIds);
        this.service.setSectorModel(this.sectorModel);
        this.router.navigate(['warehouse', 'allocatetruckdock']);
    }

    retrieveCharacter(charVal, index) {
        return String.fromCharCode(charVal.charCodeAt(0) + index);
    }

    onAddDevices() {
        this.setAllParentsNamesAndIds();
        this.service.setAllParentsNames(this.allParentsNames);
        this.service.setAllParentsIds(this.allParentsIds);
        this.service.setSectorModel(this.sectorModel);
        let formArrayRawValue = this.form.getRawValue().finalLocationsList;
        this.fetchWhsLocationDeviceMappingRequest.locationsList = [];
        for (let eachRow of formArrayRawValue) {
            for (let location of eachRow.innerList) {
                if (location.select) {
                    this.fetchWhsLocationDeviceMappingRequest.locationsList.push(location);
                }
            }
        }

        this.service.fetchWhsLocationDeviceMapping(this.fetchWhsLocationDeviceMappingRequest).subscribe((resp) => {
            if (resp.data) {
                const locationsList = [];
                let noOfDeviceSets = 0;
                let hashTable = {};
                for (const location of resp.data.locationsList) {
                    const devicesList = [];
                    for (const device of location.whsLocationDeviceMappingList) {
                        devicesList.push({
                            whsLocationDeviceMappingId: device.whsLocationDeviceMappingId
                        });
                    }
                    locationsList.push({
                        whsLocationDeviceMappingList: devicesList
                    });
                }
                for (let location of locationsList) {
                    if (!hashTable[JSON.stringify(location.whsLocationDeviceMappingList)]) {
                        ++noOfDeviceSets;
                        hashTable[JSON.stringify(location.whsLocationDeviceMappingList)] = true;
                    }
                }
                // alert(noOfDeviceSets);
                if (noOfDeviceSets === 1) {
                    this.service.setdataToSetUpDevices(resp.data);
                    this.router.navigate(['warehouse', 'setupdevices']);
                } else {
                    this.showErrorStatus('warehouse.location.samesetofdevice');
                }
            } else {
                this.showErrorStatus('g.server.exception');
            }
        }, (err) => {
            this.showErrorStatus('g.unable.to.contact.server');
        }
        )
    }

    returnIconTypeOccupied(locationFormGroup) {
        var location = locationFormGroup.getRawValue();
        // console.log(location);
        return 'storage';
    }

    returnIconTypeAvailable(locationFormGroup) {
        var location = locationFormGroup.getRawValue();
        // console.log(location);
        if (location.availableToUseFlag) {
            return 'yesno';
            // return 'ban';
        } else {
            return 'close';
        }
    }

    returnIconTypeLock(locationFormGroup) {
        var location = locationFormGroup.getRawValue();
        // console.log(location);
        // lockedFlag
        if (location.lockedFlag) {
            return 'lock';
        } else {
            return 'unlock';
        }
    }

    onFormRequest(param1) {
        let formArrayRawValue = this.form.getRawValue().finalLocationsList;
        // console.log(formArrayRawValue);
        let response: any = {};
        response.locationsList = [];
        let i = 0;
        for (let eachRow of formArrayRawValue) {
            let j = 0;
            for (let location of eachRow.innerList) {
                if (location.select) {
                    response.locationsList.push(location);
                    if (param1 === 'lock') {
                        this.form.get(['finalLocationsList', i, 'innerList', j, 'lockedFlag']).setValue(true);
                    } else if (param1 === 'unlock') {
                        this.form.get(['finalLocationsList', i, 'innerList', j, 'lockedFlag']).setValue(false);
                    } else if (param1 === 'markAvailable') {
                        this.form.get(['finalLocationsList', i, 'innerList', j, 'availableToUseFlag']).setValue(true);
                    } else if (param1 === 'markUnavailable') {
                        this.form.get(['finalLocationsList', i, 'innerList', j, 'availableToUseFlag']).setValue(false);
                    }
                    this.form.get(['finalLocationsList', i, 'innerList', j, 'select']).setValue(false);
                }
                ++j;
            }
            ++i;
        }
        return response;
    }

    onChangeFlagsService(request) {
        this.service.updateLocationFlags(request).subscribe((resp) => {
            // console.log(resp);

        })
    }

    onLock() {
        let request = this.onFormRequest('lock');
        // console.log(request);
        for (let location of request.locationsList) {
            location.columnName = 'LockedFlag';
            location.columnValue = 1;
        }
        this.onChangeFlagsService(request);
    }

    onUnlock() {
        let request = this.onFormRequest('unlock');
        // console.log(request);
        for (let location of request.locationsList) {
            location.columnName = 'LockedFlag';
            location.columnValue = 0;
        }
        this.onChangeFlagsService(request);

    }

    onMarkAvailable() {
        let request = this.onFormRequest('markAvailable');
        // console.log(request);
        for (let location of request.locationsList) {
            location.columnName = 'AvaibleToUseFlag';
            location.columnValue = 1;
        }
        this.onChangeFlagsService(request);

    }

    onMarkUnavailable() {
        let request = this.onFormRequest('markUnavailable');
        // console.log(request);
        for (let location of request.locationsList) {
            location.columnName = 'AvaibleToUseFlag';
            location.columnValue = 0;
        }
        this.onChangeFlagsService(request);
    }
}
