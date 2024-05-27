import { Injectable } from '@angular/core';
import { BaseResponse, BaseService, RestService, TrackRestCallProgress } from 'ngc-framework';
import { Observable } from 'rxjs';
import { WH_ENV } from '../../environments/environment';


@Injectable()
export class WarehouseService extends BaseService {
    // private sectorAncestors;
    // private currentSectors;
    // private sectorsList;
    private allParentsNames;
    private allParentsIds;
    private sectorModel;
    private terminalModel;
    private referenceId;
    private referenceType;
    private dataToSetUpDevices;

    constructor(private restService: RestService) {
        super();
    }

    /*-----------------------------------------------------------------------------------------------*/
    /*GETTER AND SETTERS*/
    /*-----------------------------------------------------------------------------------------------*/

    getAllParentsNames() {
        return this.allParentsNames;
    }

    getAllParentsIds() {
        return this.allParentsIds;
    }

    setAllParentsNames(allParentsNames) {
        this.allParentsNames = allParentsNames;
    }

    setAllParentsIds(allParentsIds) {
        this.allParentsIds = allParentsIds;
    }

    setSectorModel(sectorModel) {
        this.sectorModel = sectorModel;
    }

    getSectorModel() {
        return this.sectorModel;
    }

    setTerminalModel(terminalModel) {
        this.terminalModel = terminalModel;
    }

    getTerminalModel() {
        return this.terminalModel;
    }

    setReferences(referenceId, referenceType) {
        this.referenceId = referenceId;
        this.referenceType = referenceType;
    }

    getReferences() {
        return {
            referenceId: this.referenceId,
            referenceType: this.referenceType
        }
    }

    setdataToSetUpDevices(dataToSetUpDevices) {
        this.dataToSetUpDevices = dataToSetUpDevices;
    }

    getdataToSetUpDevices() {
        return this.dataToSetUpDevices;
    }

    checkForAnyDuplicateEntries(arrayName, controlNameList, errorCode, arrayValue) {
        if (typeof controlNameList === 'string') {
            controlNameList = [controlNameList];
        }
        let hashMap = {};
        let arrayNameList = arrayValue;
        let messageList = [];
        let index = 0;
        for (let arrayInstance of arrayNameList) {
            let hashKey = {
                // controlName: arrayInstance[controlName]
            };
            let i = 1;
            for (const eachControlName of controlNameList) {
                hashKey['controlName' + i] = arrayInstance[eachControlName];
                ++i;
            }
            if (!hashMap[JSON.stringify(hashKey)])
                hashMap[JSON.stringify(hashKey)] = 1;
            else {
                let j = 0;
                for (const controlName in hashKey) {
                    if (hashKey.hasOwnProperty(controlName)) {
                        let k = j;
                        messageList.push(
                            {
                                code: errorCode,
                                referenceId: arrayName + '[' + index + '].' + controlNameList[k]
                            }
                        );
                        ++j;
                    }
                }
            }
            ++index;
        }
        return messageList;
    }

    // dataToSetUpDevices
    // setSectorAncestors(sectorAncestors) {
    //   this.sectorAncestors = sectorAncestors;
    // }

    // getSectorAncestors() {
    //   return this.sectorAncestors;
    // }

    // setCurrentSectors(currentSectors) {
    //   this.currentSectors = currentSectors;
    // }

    // getCurrentSectors() {
    //   return this.currentSectors;
    // }

    // setSectorsList(sectorsList) {
    //   this.sectorsList = sectorsList;
    // }

    // getSectorsList() {
    //   return this.sectorsList;
    // }

    /*-----------------------------------------------------------------------------------------------*/
    /*READ*/
    /*-----------------------------------------------------------------------------------------------*/
    /**
     * Fetch all the terminals, sectors and locations to display on page load (for "Setup Warehouse Profile Configuration" screen)
     *
     * @param {any} request
     * @returns
     * @memberof WarehouseService
     */
    @TrackRestCallProgress()
    public fetchWareHouseLocations(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.fetchWareHouseLocations, request);
    }

    @TrackRestCallProgress()
    public fetchWareHouseTerminal(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.fetchWareHouseTerminal, request);
    }

    @TrackRestCallProgress()
    public fetchSector(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.fetchSector, request);
    }

    /**
     * Fetch all the handling constraints for associating with terminal or sector (for "Popup of Setup Warehouse Profile Configuration" screen)
     *
     * @param {any} request
     * @returns
     * @memberof WarehouseService
     */
    @TrackRestCallProgress()
    public fetchHandlingConstraints(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.fetchHandlingConstraints, request);
    }

    /**
     * Search locations for given sector Id and location type (for "Add Locations for a Sector" screen)
     *
     * @param {any} request
     * @returns
     * @memberof WarehouseService
     */
    @TrackRestCallProgress()
    public fetchSectorLocationsByType(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.fetchSectorLocationsByType, request);
    }

    @TrackRestCallProgress()
    public fetchTruckDocksSector(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.fetchTruckDocksSector, request);
    }
    //modifyTruckDocksSector

    @TrackRestCallProgress()
    public modifyTruckDocksSector(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.modifyTruckDocksSector, request);
    }

    /*-----------------------------------------------------------------------------------------------*/
    /*UPDATE*/
    /*-----------------------------------------------------------------------------------------------*/

    /**
     * Add, edit or delete sectors corresponding to a parent sector (for "Add Sector for Terminal" screen)
     *
     * @param {any} request
     * @returns
     * @memberof WarehouseService
     */
    @TrackRestCallProgress()
    public updateSectors(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.updateSectors, request);
    }

    /**
     *  Add, edit or delete sectors corresponding to a terminal (for "Add Sector for Terminal" screen)
     *
     * @param {any} request
     * @returns
     * @memberof WarehouseService
     */
    @TrackRestCallProgress()
    public updateParentSectors(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.updateParentSectors, request);
    }

    /**
     * Add, edit or delete locations corresponding to a sector (for "Add Locations for a Sector" screen)
     *
     * @param {any} request
     * @returns
     * @memberof WarehouseService
     */
    @TrackRestCallProgress()
    public addLocations(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.addLocations, request);
    }

    /**
     * Associate terminal/sector with one of the fetched handling constraints (for popup of "Setup Warehouse Profile Configuration" screen)
     *
     * @param {any} request
     * @returns
     * @memberof WarehouseService
     */
    @TrackRestCallProgress()
    public modifyHandlingConstraintsArea(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.modifyHandlingConstraintsArea, request);
    }

    public fetchHandlingConstraintDetails(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.fetchHandlingConstraintDetails, request);
    }

    public modifyHandlingConstraints(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.modifyHandlingConstraints, request);
    }

    public fetchWhsLocationDeviceMapping(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.fetchWhsLocationDeviceMapping, request);
    }

    public modifyWhsLocationDeviceMapping(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.modifyWhsLocationDeviceMapping, request);
    }

    public fetchHandlingConstraint(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.fetchHandlingConstraint, request);
    }

    public updateLocationFlags(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.updateLocationFlags, request);
    }

    public updateZoneCodes(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.updateZoneCodes, request);
    }

    public deleteHandlingConstraint(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.deleteHandlingConstraint, request);
    }

    public fetchShipmentListByLocation(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.fetchShipmentListByLocation, request);
    }

    public fetchWarehouseInventoryList(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.fetchWarehouseInventoryList, request);
    }

    public fetchWarehouseInventoryDetail(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.fetchWarehouseInventoryDetail, request);
    }

    public updateLocation(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.updateLocation, request);
    }

    public markAsUtl(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.markAsUtl, request);
    }

    public closeInventoryCheckStatus(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.closeInventoryCheckStatus, request);
    }

    // fetchWarehouseInventoryList

    // eventNotification 

    public getEventDetals(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.getEventDetails, request);
    }

    public onSave(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.getEventDetails, request);
    }

    public updateTemperatureRange(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.updateTemperatureRange, request);
    }

    public getAllocatedWorkStation(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.getAllocatedWorkStation, request);
    }

    public modifyAllocatedWorkStation(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.modifyAllocatedWorkStation, request);
    }



    // Query Bin Service 
    public fetchQueryBinDetails(request) {
        return <Observable<BaseResponse<any>>>this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.modifyAllocatedWorkStation, request);
    }

    public generateQueryBinPath(queryBinPath, queryBinList: any[]) {
        let queryParameters: string = '';
        if (queryBinList.length > 0) {
            for (let i = 0; i < queryBinList.length; i++) {
                queryParameters += '&BIN' + (i + 1) + '=' + queryBinList[i].queryBin
            }
            return queryBinPath + queryParameters;
        } else {
            return queryBinPath;
        }
    }

    // @TrackRestCallProgress()
    // public saveAccessory(request: any):
    //     Observable<BaseResponse<any>> {
    //     return <Observable<BaseResponse<any>>>
    //         this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.saveAccessory, request);
    // }

    // public searchAccessory(request: any):
    //     Observable<BaseResponse<any>> {
    //     return <Observable<BaseResponse<any>>>
    //         this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.getAccessory, request);
    // }

    // public deleteAccessory(request: any):
    //     Observable<BaseResponse<any>> {
    //     return <Observable<BaseResponse<any>>>
    //         this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.deleteAccessory, request);
    // }

}
