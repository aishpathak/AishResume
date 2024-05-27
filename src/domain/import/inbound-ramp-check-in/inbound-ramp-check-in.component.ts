import { element } from 'protractor';
import { forEach } from '@angular/router/src/utils/collection';
import { ApplicationEntities } from './../../common/applicationentities';
import { Component, NgZone, ElementRef, OnInit, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';

interface CountUlds {
    checkInPending: number;
    pendingVerification: number;
    verified: number;
}
// NGC framework imports
import {
    NgcFormGroup, NgcUtility, NgcFormArray, NgcApplication, NgcWindowComponent, NgcDropDownComponent, NgcButtonComponent,
    NgcPage, NotificationMessage, StatusMessage, MessageType, DropDownListRequest,
    BaseResponse, PageConfiguration, NgcFormControl, BaseRequest, CellsRendererStyle, NgcReportComponent
} from 'ngc-framework';
import { CellsStyleClass } from '../../../shared/shared.data';
import { ImportService } from '../import.service';
import { AddUldComponent } from './add-uld/add-uld.component'
import { SendTelexComponent } from './send-telex/send-telex.component'
import { RampCheckInFlight, RampCheckInModel, RampCheckAddUld, RampCheckInQuery, RampCheckInUld, SelectedUld, PiggybackUld, ShcUld, BulkUpdate } from '../import.sharedmodel';
import { ApplicationFeatures } from '../../common/applicationfeatures';

@Component({
    selector: 'app-inbound-ramp-check-in',
    templateUrl: './inbound-ramp-check-in.component.html',
    styleUrls: ['./inbound-ramp-check-in.component.scss']
})
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true,
    autoBackNavigation: true,
    restorePageOnBack: true,
    focusToBlank: true,
    focusToMandatory: true
})
export class InboundRampCheckInComponent extends NgcPage {
    @ViewChild('reportWindow') reportWindow: NgcWindowComponent;
    @ViewChild('telexWindow') telexWindow: NgcWindowComponent;
    @ViewChild('driverIDWindow') driverIDWindow: NgcWindowComponent;
    @ViewChild('tempLogWindow') tempLogWindow: NgcWindowComponent;
    @ViewChild('uploadPhotoWindow') uploadPhotoWindow: NgcWindowComponent;
    @ViewChild('addULDWindow') addULDWindow: NgcWindowComponent;
    @ViewChild('piggybackWindow') piggybackWindow: NgcWindowComponent;
    @ViewChild('editShcWindow') editShcWindow: NgcWindowComponent;
    @ViewChild('addULDRef') addULDRef: AddUldComponent;
    @ViewChild('driverIDRef') driverIDRef: AddUldComponent;
    @ViewChild('tempLogWindowRef') tempLogWindowRef: AddUldComponent;
    @ViewChild('telexWindowRef') telexWindowRef: SendTelexComponent;
    @ViewChild('accessoryPopUp') accessoryPopUp: NgcWindowComponent;
    defaultDate = NgcUtility.getCurrentDateOnly();
    reportParameters: any;
    isBulk: boolean;
    checkInStatus: boolean;
    response: any;
    myCount: number = 10;
    currentFlightId: any;
    transferTypeValues: any[] = [];
    arrayList: RampCheckInUld[] = [];
    arrayListSendTelex: RampCheckInUld[] = [];
    arrayListforUpload: RampCheckInUld;
    addUldDetails: RampCheckAddUld = new RampCheckAddUld();
    selectedItem: any;
    showAddNew: boolean;
    checkInPending: number;
    nilCargo: boolean;
    checkInStatusMessage: any;
    checkInUser: any;
    checkInDateTime: any;
    showEditSHC: any;
    showDriverIdScreen: boolean;
    showTempLogPopup: boolean;
    driverIdLabel = "import.ramp.check.add.driver";
    showPiggyback: boolean;
    newUldEntry: boolean;
    piggybackId: any;
    selectedPiggybackUld: any;
    selectedImpRampCheckInId: any;
    piggyflightId: any;
    piggycontentCode: any;
    remarks: any;
    pendingVerification: number;
    trollyreceived: number;
    verified: number;
    expandorcollapse: any = true;
    searchResults: boolean;
    enableWindow: boolean = false;
    switchCheckInTab: boolean = true;
    tenantName: boolean = true;
    switchReopenCheckInTab: boolean = false;
    uldList: string[] = [];
    origin: string;
    transferData: any;
    terminal: any;
    list1Undamaged: any = [];
    list2Undamaged: any = [];
    list3Undamaged: any = [];
    private form: NgcFormGroup = new NgcFormGroup({
        search: new NgcFormGroup({
            flight: new NgcFormControl('', Validators.required),
            flightDate: new NgcFormControl('', Validators.required),
            checkInDateTime: new NgcFormControl(),
            checkInUser: new NgcFormControl()
        }),
        information: new NgcFormGroup({
            flightId: new NgcFormControl(),
            impRampCheckInId: new NgcFormControl(),
            flight: new NgcFormControl(),
            flightDate: new NgcFormControl(),
            sta: new NgcFormControl(),
            eta: new NgcFormControl(),
            uldReceived: new NgcFormControl(8),
            uldManifested: new NgcFormControl(16),
            trollyReceived: new NgcFormControl(),
            ata: new NgcFormControl(),
            checkInStatus: new NgcFormControl(),
            segment: new NgcFormControl(),
            bulk: new NgcFormControl(),
            nilCargo: new NgcFormControl(),
            weather: new NgcFormControl(),
            bulkCount: new NgcFormControl(),
        }),
        resultList: new NgcFormArray([
        ]),
        checkInPendingList: new NgcFormArray([]),
        verifiedList: new NgcFormArray([]),
        pendingVerfication: new NgcFormArray([]),
        piggybackUldList: new NgcFormArray([]),
        tempList: new NgcFormArray([])
    });
    count: any;
    countError: any = 0;
    checkInPendingArray: any = [];
    verificationPending: any = [];
    verifiedArray: any = [];
    temperatureValueFlag: any = 0;
    uldEventFlag: any = 0;
    temperatureCaptureDtFlag: any = 0;
    piggyBackLinkFlag: boolean = true;
    sectorId: any;
    inputData: { flightKey: any; flightDate: any; uldNumber: any; modeType: string; };
    onDamageEvent: boolean = false;
    shipmentTerminalAwareLocation: boolean;
    terminalRequired: boolean;


    constructor(
        appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef, private importService: ImportService, private router: Router, private activatedRoute: ActivatedRoute) {
        super(appZone, appElement, appContainerElement);

        this.form.controls.resultList.valueChanges.subscribe(data => {
        });
        this.form.controls.piggybackUldList.valueChanges.subscribe(element => {
            this.newUldEntry = true;
        });
    }

    ngOnInit() {
        super.ngOnInit();

        this.transferData = this.getNavigateData(this.activatedRoute);
        if (this.transferData != null) {
            this.form.get(['search', 'flight']).setValue(this.transferData.flight);
            this.form.get(['search', 'flightDate']).setValue(this.transferData.flightDate);
            this.searchFlight();
        } else {
            this.form.get('search').get('flightDate').setValue(this.defaultDate);
        }
        this.terminal = this.getUserProfile().terminalId;

        this.shipmentTerminalAwareLocation = NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_Shipment_TerminalAware_Location);
        if (this.shipmentTerminalAwareLocation) {
            this.terminalRequired = false;
        } else {
            this.terminalRequired = true;
        }

        this.searchResults = false;
        this.checkInPending = this.pendingVerification = this.verified = this.trollyreceived = 0;
        this.showDriverIdScreen = false;
        this.showTempLogPopup = false;
        this.showEditSHC = -1;
        this.newUldEntry = true;
        this.nilCargo = false;
        this.showAddNew = false;
        this.isBulk = false;
        this.arrayListforUpload = new RampCheckInUld;
        //this.validateSubscription();
        if (!NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_DriverId)) {
            this.tenantName = false;
            this.driverIdLabel = "mb.checkin";
        }
        if (NgcUtility.hasFeatureAccess('Imp.Ramp.EicUldHandling')) {
            this.piggyBackLinkFlag = false;
        }

    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.resetFormMessages();
    }

    getLengths(data) {
        this.verified = this.pendingVerification = this.checkInPending = this.trollyreceived = 0;
        let ulddata: any[] = [];
        data.data.ulds.forEach((value: any, index: number) => {
            ulddata.push(value.uldNumber);
            if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_DriverId)) {

                if (value.checkedinBy && value.driverId) {
                    this.verified++;
                }
            }
            if (!NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_DriverId)) {
                if (value.checkedinBy) {
                    this.verified++;
                }
            }
            if (value.usedAsTrolley) {
                ++this.trollyreceived;
                // value.usedAsTrolley = true;
            }
            if (value.driverId && value.checkedinBy == null) {
                this.pendingVerification++;
            }
            if (!value.checkedinBy && !value.driverId) {
                this.checkInPending++;
            }

        });
        this.addUldDetails.uldlist = ulddata;
    }

    searchFlight() {
        this.checkInPendingArray = [];
        this.verificationPending = [];
        this.verifiedArray = [];
        this.form.get('search').get('checkInDateTime').reset();
        const request: RampCheckInQuery = new RampCheckInQuery();
        const dataForm = this.form.get('search');
        request.flightNumber = dataForm.get('flight').value;
        request.flight = dataForm.get('flight').value;
        request.flightDate = dataForm.get('flightDate').value;
        this.resetFormMessages();
        this.importService.getIRampCheckInData(request).subscribe(data => {
            if (!this.showResponseErrorMessages(data)) {
                this.response = data;
                if (this.response.data != null) {
                    this.getLengths(this.response);
                    this.searchResults = true;
                    this.origin = this.response.data.origin;
                    if (this.response.data.checkInStatus == 0 || this.response.data.checkInStatus == 1) {
                        this.checkInStatus = false;
                        this.switchReopenCheckInTab = false;
                        this.switchCheckInTab = true;
                        this.checkInStatusMessage = 'Ramp check In Pending';
                    }
                    else {
                        this.checkInStatus = true;
                        this.switchReopenCheckInTab = true;
                        this.switchCheckInTab = false;
                        // this.showInfoStatus('Ramp check-in already Completed');
                        this.checkInStatusMessage = "Ramp check In Completed";
                        this.form.get('search').get('checkInUser').setValue("'" + this.response.data.checkInCompletedBy + "' ");
                        this.form.get('search').get('checkInDateTime').setValue(this.response.data.checkindateTime);
                    }
                    this.addUldDetails.flightId = this.response.data.flightId;
                    this.addUldDetails.flight = dataForm.get('flight').value;
                    this.addUldDetails.flightDate = dataForm.get('flightDate').value;
                    let cFlightId = this.response.data.flightId;
                    this.form.get('information').patchValue(this.response.data);
                    this.response.data.ulds.forEach(element => {
                        element.flightId = cFlightId;
                        element.flight = dataForm.get('flight').value;
                        element.flightDate = dataForm.get('flightDate').value;
                        element.sno = false;
                        element.shc = '';
                        element.shc1 = '';
                        element.shc2 = '';
                        element.shc3 = '';
                        element.shc4 = '';
                        element.shc5 = '';
                        element.shc6 = '';
                        element.shc7 = '';
                        element.shc8 = '';
                        element.shc9 = '';
                        element.usedAsTrolley ? this.isBulk = true : null;
                    });
                    this.form.get('resultList').patchValue(this.response.data.ulds);
                    this.form.getRawValue().resultList.forEach(element => {
                        if (element.damaged) {
                            element.damageRemarksFlag = true;
                        }
                        else {
                            element.damageRemarksFlag = false;
                        }
                    });
                    this.form.getRawValue().resultList.forEach(element => {
                        if (element.driverId == null && !element.checkedinBy) {
                            this.checkInPendingArray.push(element);
                        }
                        else if (element.driverId != null && !element.checkedinBy) {
                            this.verificationPending.push(element);
                        }
                        else if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_DriverId)) {
                            if (element.driverId != null && element.checkedinBy) {
                                this.verifiedArray.push(element);
                            }
                        }
                        else if (!NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_DriverId)) {
                            if (element.checkedinBy) {
                                this.verifiedArray.push(element);
                            }
                        }

                    });
                    this.form.get('checkInPendingList').patchValue(this.checkInPendingArray);
                    this.form.get('verifiedList').patchValue(this.verifiedArray);
                    this.form.get('pendingVerfication').patchValue(this.verificationPending);
                    this.form.get('information').get('bulk').setValue(this.response.data.bulk);
                    this.form.get('information').get('uldReceived').setValue(this.verified);
                    this.form.get('information').get('trollyReceived').setValue(this.trollyreceived);
                    if ((<NgcFormArray>this.form.get('resultList')).length == 0) {
                        this.nilCargo = true;
                        this.form.get('information').get('bulk').setValue(false);

                    }
                    else {
                        this.nilCargo = false;
                        let results = (<NgcFormArray>this.form.get('resultList')).getRawValue();
                    }
                    if (NgcUtility.hasFeatureAccess('Imp.Ramp.DamageRemarks')) {
                        this.list1Undamaged = [];
                        this.list2Undamaged = [];
                        this.list3Undamaged = [];
                        this.onDamageCheck(this.onDamageEvent);
                    }

                } else {
                    this.searchResults = false;

                }
            } else {
                this.searchResults = false;
            }
        }, error => {
            this.searchResults = false;

        });
    }

    showAllSHC(index) {
        this.showEditSHC = index;
    }
    hideAllSHC(index) {
        this.showEditSHC = -1;
    }
    public sendTelex(event) {
        if (this.form.get('checkInPendingList').dirty || this.form.get('verifiedList').dirty || this.form.get('pendingVerfication').dirty) {
            this.showErrorMessage('save.details.before.performing.operation')
            return;
        }
        this.arrayListSendTelex = [];
        let data: Array<any> = [];
        let list1 = this.form.getRawValue().checkInPendingList;
        let list2 = this.form.getRawValue().verifiedList;
        let list3 = this.form.getRawValue().pendingVerfication;
        let dataList = data.concat(list1, list2, list3);
        dataList.forEach(element => {
            if (element.damaged == true) {
                let uld: RampCheckInUld = new RampCheckInUld();
                uld.uldNumber = element.uldNumber;
                uld.flightId = element.flightId;
                uld.impRampCheckInId = element.impRampCheckInId;
                uld.flight = this.form.get('search').get('flight').value;
                uld.flightDate = this.form.get('search').get('flightDate').value;
                this.arrayListSendTelex.push(uld);
            }
        });
        if (this.arrayListSendTelex.length > 0) {
            this.telexWindow.open();
            this.telexWindowRef.resetForm();
        } else {
            this.showInfoStatus("import.info113")
        }
    }
    public uploadPhoto(event) {
        let data: Array<any> = [];
        let list1 = this.form.getRawValue().checkInPendingList;
        let list2 = this.form.getRawValue().verifiedList;
        let list3 = this.form.getRawValue().pendingVerfication;
        data = data.concat(list1, list2, list3);
        this.arrayListforUpload = new RampCheckInUld;
        let count = 0;
        data.forEach(element => {
            if (element.sno == true) {
                let uld: RampCheckInUld = new RampCheckInUld();
                uld.uldNumber = element.uldNumber;
                uld.flightId = element.flightId;
                uld.impRampCheckInId = element.impRampCheckInId;
                if (element.origin != null) {
                    uld.origin = element.origin;
                } else {
                    uld.origin = this.origin;
                }
                element.flight = this.form.get('search').get('flight').value;
                element.flightDate = this.form.get('search').get('flightDate').value;
                this.arrayListforUpload = element;
                count++;
            }
        });
        if (count == 1) {
            this.uploadPhotoWindow.open();
        } else {
            this.showInfoStatus("import.info114")
        }
    }
    public addULD(event) {
        if (this.getCheckInStatus()) {
            this.showErrorMessage('checkin.already.completed');
            return;
        }
        this.showAddNew = false;
        //this.showAddNew = true;
        this.addULDRef.resetForm();
        this.addULDWindow.open();
        this.uldList;
        this.showAddNew = true;
    }

    public driverID(event) {
        this.showDriverIdScreen = false;
        this.countError = 0;
        let data: Array<any> = [];
        let list1 = this.form.getRawValue().checkInPendingList;
        let list2 = this.form.getRawValue().verifiedList;
        let list3 = this.form.getRawValue().pendingVerfication;
        data = data.concat(list1, list2, list3);

        let WHSEDestCounter = 0;
        data.forEach(element => {
            if (element.sno) {
                if (element.warehouseDest == null || element.warehouseDest == '') {
                    WHSEDestCounter++;
                }
            }
        })

        if (NgcUtility.hasFeatureAccess('Imp.Ramp.WhDestination')) {
            if (WHSEDestCounter > 0) {
                this.showErrorMessage("import.warehouse.destination.mandatory");
                return;
            }
        }
        this.arrayList = [];
        data.forEach(element => {

            if (element.sno && !element.driverId) {
                let uld: RampCheckInUld = new RampCheckInUld();
                uld.uldNumber = element.uldNumber;
                uld.flightId = element.flightId;
                uld.impRampCheckInId = element.impRampCheckInId;
                if (element.origin != null) {
                    uld.origin = element.origin;
                } else {
                    uld.origin = this.origin;
                }
                element.flight = this.form.get('search').get('flight').value;
                element.flightDate = this.form.get('search').get('flightDate').value;
                this.arrayList.push(element);
                this.showDriverIdScreen = true;
            }
            else if (element.sno && element.checkedinBy == null && element.checkedinAt == null && element.handOverId != null) {
                this.countError++;
            }
        });
        if (this.countError > 0) {
            this.showErrorMessage('driverid.already.associated.uld');
            return;
        }
        if (this.showDriverIdScreen) {
            this.driverIDRef.resetForm();
            this.driverIDWindow.open();
        }
        else {
            this.showInfoStatus('valid.uld.driver.info');
        }

    }
    public tempLogDetailsSave(event) {
        this.showTempLogPopup = false;
        this.countError = 0;
        let data: Array<any> = [];
        let list1 = this.form.getRawValue().checkInPendingList;
        let list2 = this.form.getRawValue().verifiedList;
        let list3 = this.form.getRawValue().pendingVerfication;
        data = data.concat(list1, list2, list3);
        this.arrayList = [];
        data.forEach(element => {

            if (element.sno) {
                let uld: RampCheckInUld = new RampCheckInUld();
                uld.uldNumber = element.uldNumber;
                uld.flightId = element.flightId;
                uld.impRampCheckInId = element.impRampCheckInId;
                if (element.origin != null) {
                    uld.origin = element.origin;
                } else {
                    uld.origin = this.origin;
                }
                element.flight = this.form.get('search').get('flight').value;
                element.flightDate = this.form.get('search').get('flightDate').value;
                this.arrayList.push(element);
                this.showTempLogPopup = true;
            }
            else if (element.sno && element.checkedinBy == null && element.checkedinAt == null && element.handOverId != null) {
                this.countError++;
            }
        });
        this.form.get('tempList').patchValue(this.arrayList);
        if (this.countError > 0) {
            this.showErrorMessage('driverid.already.associated.uld');
            return;
        }
        if (this.showTempLogPopup) {

            this.tempLogWindow.open();

        }
        else {
            this.showInfoStatus('valid.uld.temp.info');
        }

    }


    onSaveTempLog() {

        this.temperatureValueFlag = 0;
        this.uldEventFlag = 0;
        this.temperatureCaptureDtFlag = 0;
        let requests: any = (<NgcFormArray>this.form.get("tempList")).getRawValue();
        let request: Array<RampCheckInUld> = new Array<RampCheckInUld>();
        let tempLogRequestList = this.form.get('tempList').value;
        requests.forEach((element, index) => {
            console.log(element);
            if (!element.temperatureValue) {
                this.temperatureValueFlag++;
            }
            if (!element.uldEvent) {
                this.uldEventFlag++;
            }
            if (!element.temperatureCaptureDt) {
                this.temperatureCaptureDtFlag++;
            }

            let tempArray: RampCheckInUld = new RampCheckInUld();
            tempArray.checkedinBy = this.getUserProfile().userLoginCode;
            tempArray.uldNumber = element.uldNumber;
            tempArray.impRampCheckInId;
            tempArray.origin = element.origin;
            tempArray.flight = element.flight;
            tempArray.flightId = element.flightId;
            tempArray.flightDate = element.flightDate;
            tempArray.temperatureType = element.temperatureType;
            tempArray.temperatureTypeValue = element.temperatureTypeValue;
            tempArray.uldEvent = element.uldEvent;
            tempArray.temperatureValue = element.temperatureValue;
            tempArray.tempRemarks = element.tempRemarks;
            tempArray.temperatureCaptureDt = element.temperatureCaptureDt;
            request.push(tempArray);
        });
        if (this.temperatureValueFlag != 0 || this.uldEventFlag != 0 || this.temperatureCaptureDtFlag) {
            this.showErrorStatus("export.fill.in.mandatory.details");
            return;
        }
        const request1: RampCheckInModel = new RampCheckInModel();
        request1.uldList = request;
        this.resetFormMessages();
        this.importService.saveUldTemperatureLog(request1).subscribe(data => {
            console.log(data);
            if (!this.showResponseErrorMessages(data)) {
                this.response = data.data;
                this.showSuccessStatus('g.completed.successfully');
                this.searchFlight();
            }

        },
            error => {
                this.showErrorStatus('Error:' + error);
            }
        );
    }

    piggiBackInfo(uld, event, index, section) {
        if (!event) {
            this.showPiggyback = true;
            const request: PiggybackUld = new PiggybackUld();
            const dataForm = this.form.get('search');
            request.impRampCheckInId = uld.impRampCheckInId;
            this.importService.getPiggyback(request).subscribe(data => {
                this.response = data;
                if (this.response.data != null && this.response.data.length > 0) {
                    if (section == 'C') {
                        this.form.get(['checkInPendingList', index, 'piggyback']).setValue(true);
                    } else if (section == 'P') {
                        this.form.get(['pendingVerfication', index, 'piggyback']).setValue(true);
                    } else if (section == 'V') {
                        this.form.get(['verifiedList', index, 'piggyback']).setValue(true);
                    }
                    this.showErrorMessage("delete.all.piggyback.ulds");
                }
            }, error => {
            });
        } else {
            if (section == 'C') {
                this.form.get(['checkInPendingList', index, 'piggyback']).setValue(false);
            } else if (section == 'P') {
                this.form.get(['pendingVerfication', index, 'piggyback']).setValue(false);
            } else if (section == 'V') {
                this.form.get(['verifiedList', index, 'piggyback']).setValue(false);
            }
            this.showErrorMessage("add.piggyback.ulds");
        }
    }

    managePiggyback(uld, event) {
        this.piggycontentCode = null;
        this.form.get('piggybackUldList').validator;
        if (this.form.get('piggybackUldList').invalid) {
            this.showErrorMessage('invalid.data');
            return;
        }
        this.piggybackId = uld.piggybackId;
        this.selectedPiggybackUld = uld.uldNumber;
        this.selectedImpRampCheckInId = uld.impRampCheckInId;
        this.piggyflightId = uld.flightId;
        this.piggycontentCode = uld.contentCode;
        this.remarks = uld.remarks;
        if (event) {
            this.showPiggyback = true;
            const request: PiggybackUld = new PiggybackUld();
            const dataForm = this.form.get('search');
            request.impRampCheckInId = uld.impRampCheckInId;
            this.importService.getPiggyback(request).subscribe(data => {
                this.response = data;
                if (!this.showResponseErrorMessages(data)) {
                    if (this.response.data != null) {
                        this.piggybackWindow.open();
                        if (!this.response.data.length) {
                            this.addMorePiggybackUld();
                        }
                        this.response.data.forEach(element => {
                            element.sno = false;
                        });
                        this.form.get('piggybackUldList').patchValue(this.response.data);
                    }
                }
            }, error => {
            });
        }
    }
    addOnePiggybackUld() {

        let piggybacks = (<NgcFormArray>this.form.get('piggybackUldList'));
        piggybacks.addValue(
            [{
                sno: false,
                uldNumber: '',
                flagCRUD: "C"
            }]
        );

    }

    addMorePiggybackUld() {

        let piggybacks = (<NgcFormArray>this.form.get('piggybackUldList'));
        let piggybacksValues = (<NgcFormArray>this.form.get('piggybackUldList')).value;
        let count = 0;
        piggybacksValues.forEach(element => {
            if (element.uldNumber) {
                // this.showErrorMessage('200', 'Fill all ULD Number to add more');
                // return;
            }
            else {
                count++;
            }
        });

        if (count) {
            this.showErrorMessage('fill.uld.number');
            return;
        }
        piggybacks.addValue(
            [{
                sno: false,
                uldNumber: '',
                flagCRUD: "C"
            }]
        );
        this.newUldEntry = false;
    }

    deletePiggybackUld() {

        let deletedOne = false;
        if (this.getCheckInStatus()) {
            this.showErrorMessage('checkin.already.completed');
            return;
        }
        let request: Array<PiggybackUld> = new Array<PiggybackUld>();
        let piggybacks = (<NgcFormArray>this.form.get('piggybackUldList')).controls;
        piggybacks.forEach((element: any, index: number) => {
            if (element.get('sno').value && (element.get('flagCRUD').value !== 'C')) {
                let req: PiggybackUld = new PiggybackUld();
                req = element.value;
                req.flagCRUD = 'D';
                request.push(req);
            } else if (element.get('sno').value && (element.get('flagCRUD').value === 'C')) {
                piggybacks.splice(index, 1);
                deletedOne = true;
            }
        });
        if (request.length != 0) {
            this.piggyCRUD(request);
        }
        else if (deletedOne) {

        } else {
            this.showErrorMessage('select.valid.uld.to.delete');
            return;
        }
    }

    piggyCRUD(request: any) {
        if (this.getCheckInStatus()) {
            this.showErrorMessage('checkin.already.completed');
            return;
        }
        this.resetFormMessages();
        this.importService.updatePiggyback(request).subscribe(data => {
            if (!this.showResponseErrorMessages(data)) {
                this.response = data;
                if (this.response.data != null) {
                    this.response.data.forEach(element => {
                        element.sno = false;
                    });
                    this.form.get('piggybackUldList').patchValue(this.response.data);
                }
                this.searchFlight();
                this.piggybackWindow.close();
            }
        }, error => {
        });

    }

    updatePiggybackUld() {
        if (this.getCheckInStatus()) {
            this.showErrorMessage('checkin.already.completed');
            return;
        }

        if (this.form.get('piggybackUldList').invalid) {
            this.showErrorMessage('checkin.already.completed');
            return;
        }
        let request: Array<PiggybackUld> = new Array<PiggybackUld>();
        let piggybacks = (<NgcFormArray>this.form.get('piggybackUldList')).controls;
        piggybacks.forEach(element => {

            let req: PiggybackUld = new PiggybackUld();
            if ((element.get('flagCRUD').value === 'C') && (element.get('uldNumber').value != null)) {
                req = element.value;
                req.impRampCheckInId = this.selectedImpRampCheckInId;
                req.flightId = this.piggyflightId;
                req.origin = this.origin;
                req.contentCode = this.piggycontentCode;
                req.flight = this.form.get('search').get('flight').value;
                req.flightDate = this.form.get('search').get('flightDate').value;
                req.remarks = this.remarks;
                request.push(req);
            }
            else if (element.get('uldNumber').dirty) {
                req = element.value;
                req.flagCRUD = 'U';
                req.impRampCheckInId = this.selectedImpRampCheckInId;
                req.flightId = this.piggyflightId;
                req.origin = this.origin;
                req.contentCode = this.piggycontentCode
                req.flight = this.form.get('search').get('flight').value;
                req.flightDate = this.form.get('search').get('flightDate').value;
                req.remarks = this.remarks;
                request.push(req);
            }
        });
        if (request.length != 0) {
            this.piggyCRUD(request);
        }
        else {
            this.showErrorMessage('nothing.to.update');
        }
    }

    closeSendTelex(event) {
        this.arrayListSendTelex = [];
        this.telexWindow.close();
    }

    getShcData(req: any, impRampCheckInId): any {
        let shc: ShcUld = new ShcUld();
        shc.shc = req;
        shc.impRampCheckInId = impRampCheckInId;
        return shc;
    }

    onSave(event) {
        if (!this.searchResults) {
            this.showErrorMessage('search.for.flight');
            return;
        }
        // this.nilCargo
        if (this.nilCargo) {
            this.showErrorMessage('add.uld.to.save.data');
            return;
        }

        if (this.getCheckInStatus()) {
            this.showErrorMessage('checkin.already.completed');
            return;
        }

        let checkData = (Object)(<NgcFormArray>this.form.controls['resultList']).getRawValue();
        let data: Array<any> = [];
        let list1 = this.form.getRawValue().checkInPendingList;
        let list2 = this.form.getRawValue().verifiedList;
        let list3 = this.form.getRawValue().pendingVerfication;
        data = data.concat(list1, list2, list3);
        this.arrayList = [];

        let damagedRemarksNullCounter = 0;
        let WHSEDestCounter = 0;
        data.forEach(element => {
            if (element.sno) {
                if (element.damaged && (element.damagedRemarks == '' || element.damagedRemarks == null)) {
                    damagedRemarksNullCounter++;
                }
                if (element.warehouseDest == null || element.warehouseDest == '') {
                    WHSEDestCounter++;
                }
            }
        })
        if (NgcUtility.hasFeatureAccess('Imp.Ramp.DamageRemarks')) {
            if (damagedRemarksNullCounter > 0) {
                this.showErrorMessage("import.damage.remark.mandatory");
                return;
            }
        }
        if (NgcUtility.hasFeatureAccess('Imp.Ramp.WhDestination')) {
            if (WHSEDestCounter > 0) {
                this.showErrorMessage("import.warehouse.destination.mandatory");
                return;
            }
        }




        let request: Array<RampCheckInUld> = new Array<RampCheckInUld>();
        let formData = this.form.controls['resultList'].value;
        const userId = this.getUserProfile().userLoginCode;
        data.forEach(element => {
            if (element.sno) {
                let shcCode: Array<ShcUld> = new Array<ShcUld>();
                let uld: RampCheckInUld = new RampCheckInUld();
                uld = element;
                if (element.origin != null) {
                    uld.origin = element.origin;
                } else {
                    uld.origin = this.origin;
                }
                uld.flight = this.form.get('search').get('flight').value;
                uld.flightDate = this.form.get('search').get('flightDate').value;

                if (element.sno) {
                    uld.checkedinBy = userId;
                }
                request.push(uld);
            }
        });
        const request1: RampCheckInModel = new RampCheckInModel();
        request1.uldList = request;
        this.resetFormMessages();
        if (request1.uldList.length > 0) {
            this.importService.rampCheckInUpdate(request1).subscribe(data => {
                if (!this.showResponseErrorMessages(data)) {
                    this.response = data.data.uldList;
                    if (data.data != null) {
                        this.searchFlight();
                        this.showSuccessStatus('data.updated.successfully');
                    }
                }
            }, error => {
            });
        } else {
            this.showInfoStatus("import.info115")
        }
    }

    unCheckIn() {
        let data: Array<any> = [];
        let list1 = this.form.getRawValue().checkInPendingList;
        let list2 = this.form.getRawValue().verifiedList;
        let list3 = this.form.getRawValue().pendingVerfication;
        data = data.concat(list1, list2, list3);
        this.arrayList = [];
        let request: Array<RampCheckInUld> = new Array<RampCheckInUld>();
        let formData = this.form.controls['resultList'].value;
        const userId = this.getUserProfile().userLoginCode;
        data.forEach(element => {
            if (element.sno) {
                let shcCode: Array<ShcUld> = new Array<ShcUld>();
                let uld: RampCheckInUld = new RampCheckInUld();
                uld = element;
                request.push(uld);
            }
        });
        const request1: RampCheckInModel = new RampCheckInModel();
        request1.uldList = request;
        this.resetFormMessages();
        if (request1.uldList.length > 0) {
            this.importService.rampUnCheckUlds(request1).subscribe(data => {
                if (!this.showResponseErrorMessages(data)) {
                    this.response = data.data.uldList;
                    if (data.data != null) {
                        this.searchFlight();
                        this.showSuccessStatus('data.updated.successfully');
                    }
                }
            }, error => {
            });
        } else {
            this.showInfoStatus("import.info115")
        }
    }
    deleteUlds() {
        let errorMessage;
        if (this.getCheckInStatus()) {
            this.showErrorMessage('checkin.already.completed');
            return;
        }
        let checkData = (Object)(<NgcFormArray>this.form.controls['resultList']).getRawValue();
        let data: Array<any> = [];
        let list1 = this.form.getRawValue().checkInPendingList;
        let list2 = this.form.getRawValue().verifiedList;
        let list3 = this.form.getRawValue().pendingVerfication;
        data = data.concat(list1, list2, list3);
        this.arrayList = [];
        let request: Array<RampCheckInUld> = new Array<RampCheckInUld>();

        data.forEach(element => {
            if (element.sno && element.driverId == null) {
                let uld: RampCheckInUld = new RampCheckInUld();
                uld = element;
                uld.flightId = this.form.get('information').get('flightId').value;
                request.push(uld);
            }
            if (element.sno && element.driverId != null) {
                this.showErrorMessage('error.uld.checkin.verified.delete');
                request = [];
                return;
            }
        });
        const request1: RampCheckInModel = new RampCheckInModel();
        request1.uldList = request;
        if (request1.uldList.length > 0) {
            this.resetFormMessages();
            this.importService.rampCheckInDelete(request1).subscribe(data => {
                if (!this.showResponseErrorMessages(data)) {
                    this.response = data.data;
                    if (data.data != null) {
                        this.searchFlight();
                        this.showSuccessStatus('uld.deleted.successfully');
                    }
                }
            }, error => {
            });
        }
        else {
            this.showInfoStatus("import.info115")
        }
    }

    onCheckIn() {
        let data: Array<any> = [];
        // if (this.form.get('checkInPendingList').dirty || this.form.get('verifiedList').dirty || this.form.get('pendingVerfication').dirty) {
        //     this.showErrorMessage('save.details.before.completing.ramp.checkin')
        //     return;
        // }
        let list = this.form.getRawValue().information;
        let list1 = this.form.getRawValue().checkInPendingList;
        let list2 = this.form.getRawValue().verifiedList;
        let list3 = this.form.getRawValue().pendingVerfication;
        data = data.concat(list1, list2, list3);

        let WHSEDestCounter = 0;
        data.forEach(element => {
            if (element.sno) {
                if (element.warehouseDest == null || element.warehouseDest == '') {
                    WHSEDestCounter++;
                }
            }
        })
        if (NgcUtility.hasFeatureAccess('Imp.Ramp.WhDestination')) {
            if (WHSEDestCounter > 0) {
                this.showErrorMessage("import.warehouse.destination.mandatory");
                return;
            }
        }

        let request: Array<RampCheckInUld> = new Array<RampCheckInUld>();
        if (data.length > 0) {
            data.forEach(element => {
                let uld: RampCheckInUld = new RampCheckInUld();
                uld = element;
                uld.nilCargo = 'NONNIL';
                if (element.origin != null) {
                    uld.origin = element.origin;
                } else {
                    uld.origin = this.origin;
                }
                uld.flight = this.form.get('search').get('flight').value;
                uld.flightDate = this.form.get('search').get('flightDate').value;
                uld.flightId = this.form.get('information').get('flightId').value;
                request.push(uld);
            });
        } else {
            let uld: RampCheckInUld = new RampCheckInUld();
            uld.flightId = this.form.get('information').get('flightId').value;
            uld.flight = this.form.get('search').get('flight').value;
            uld.flightDate = this.form.get('search').get('flightDate').value;
            uld.origin = this.origin;
            uld.nilCargo = 'NIL';
            request.push(uld);
        }

        const request1: RampCheckInModel = new RampCheckInModel();
        request1.uldManifested = list.uldManifested;
        request1.uldReceived = list.uldReceived;
        request1.trollyReceived = list.trollyReceived;
        request1.uldList = request;
        this.importService.rampCheckIn(request1).subscribe(data => {
            if (!this.showResponseErrorMessages(data)) {
                this.response = data.data;
                if (data.data != null) {
                    this.searchFlight();
                    this.switchReopenCheckInTab = true;
                    this.switchCheckInTab = false;
                    this.showSuccessStatus('checkin.completed.successfully');
                }
            }
        }, error => {
        });
    }

    onReopen() {
        this.form.get('search').get('checkInDateTime').reset();
        let data: Array<any> = [];
        let list = this.form.getRawValue().information;
        let list1 = this.form.getRawValue().checkInPendingList;
        let list2 = this.form.getRawValue().verifiedList;
        let list3 = this.form.getRawValue().pendingVerfication;
        data = data.concat(list1, list2, list3);
        let request: Array<RampCheckInUld> = new Array<RampCheckInUld>();
        if (data.length > 0) {
            data.forEach(element => {
                let uld: RampCheckInUld = new RampCheckInUld();
                uld = element;
                uld.flightId = this.form.get('information').get('flightId').value;
                uld.flight = this.form.get('search').get('flight').value;
                uld.flightDate = this.form.get('search').get('flightDate').value;
                request.push(uld);
            });
        } else {
            let uld: RampCheckInUld = new RampCheckInUld();
            uld.flightId = this.form.get('information').get('flightId').value;
            request.push(uld);
        }
        const request1: RampCheckInModel = new RampCheckInModel();
        request1.uldManifested = list.uldManifested;
        request1.uldReceived = list.uldReceived;
        request1.trollyReceived = list.trollyReceived;
        request1.uldList = request;
        this.importService.rampCheckInReopen(request1).subscribe(data => {
            if (!this.showResponseErrorMessages(data)) {
                this.response = data.data;
                if (data.data != null) {
                    this.searchFlight();
                    this.switchReopenCheckInTab = false;
                    this.switchCheckInTab = true;
                    this.showSuccessStatus('reopen.checkin.successfully');
                }
            }
        }, error => {
        });
    }
    closeUldWindowEvent(event) {
        this.searchFlight();
        this.driverIDWindow.close();
    }

    closeTempUldWindowEvent(event) {
        this.searchFlight();
        this.tempLogWindow.close();
    }

    // closeAddNewUldWindowEvent
    closeAddNewUldWindowEvent(event) {
        this.searchFlight();
        this.addULDWindow.close();
        this.showAddNew = false;
    }

    closeUploadPhotoWindow(event) {
        this.uploadPhotoWindow.close();
    }

    getCheckInStatus(): boolean {
        let valid = true;
        return (this.checkInStatus ? true : false);
    }

    checkInPreCondition(): boolean {
        let valid = true;
        let erroeMessage = '';
        let data: Array<any> = [];
        let list1 = this.form.getRawValue().checkInPendingList;
        let list2 = this.form.getRawValue().verifiedList;
        let list3 = this.form.getRawValue().pendingVerfication;
        data = data.concat(list1, list2, list3);
        let formData = data;
        //const userId = this.getUserProfile().userId;

        for (let i = 0; i < formData.length; i++) {
            // First 2 section
            if (!formData[i].checkedinBy) {
                if ((formData[i].contentCode == 'C' || formData[i].contentCode == 'M')) {
                    if (!(formData[i].offloadReason)) {
                        valid = false;
                        erroeMessage = 'Full list of ULDs are not checkedin & Verfied';
                    }
                }
            } else {
                // Last section
                if ((formData[i].offloadReason)) {
                    if ((formData[i].contentCode == 'C' || formData[i].contentCode == 'M')) {
                        valid = false;
                        erroeMessage = 'Cargo or ULDs are not Verified, Please Complete Verification !';
                    }
                }
            }
        }
        if (!valid) {
            this.showErrorMessage(erroeMessage);
        }
        return valid;

    }

    updatePreCondition(): boolean {
        let valid = true;
        let erroeMessage = '';
        let data: Array<any> = [];
        let list1 = this.form.getRawValue().checkInPendingList;
        let list2 = this.form.getRawValue().verifiedList;
        let list3 = this.form.getRawValue().pendingVerfication;
        data = data.concat(list1, list2, list3);
        let formData = data;
        //const userId = this.getUserProfile().userId;

        for (let i = 0; i < formData.length; i++) {
            // First 2 section

            if ((formData[i].offloadReason == 'OTHER') && formData[i].remarks == null) {
                valid = false;
                erroeMessage = 'Remarks is missing at ' + formData[i].uldNumber + 'ULD number';
            }
        }
        return valid;
    }

    shcPreCondition(shc: ShcUld[]): boolean {
        let duplicate = false;
        for (let i = 0; i < shc.length; i++) {
            for (let j = i + 1; j < shc.length; j++) {
                if (shc[i] = shc[j]) {
                    duplicate = true;
                }
            }
        }
        return (duplicate ? false : true);
    }

    checkValidULD() {

    }
    onUpdateBulkFlag(event) {
        let request: BulkUpdate = new BulkUpdate();
        request.bulk = this.form.get(['information', 'bulk']).value;
        request.flightId = this.form.get('information').get('flightId').value;
        this.importService.updateBulkFlag(request).subscribe(data => {
            if (!this.showResponseErrorMessages(data)) {
                this.response = data;
                if (this.response.data != null) {
                    this.showSuccessStatus('bulk.updated.successfully');
                }
            }
        }, error => {
        });
    }
    onCancel() {
        this.navigateTo(this.router, '**', {});
    }
    expandall() {
        this.expandorcollapse = true;
    }
    collapseall() {
        this.expandorcollapse = false;
    }

    private onOpen(event) {
        this.enableWindow = true;
    }

    private onClose(event) {
        this.enableWindow = false;
    }

    onClosePhotoWindow() {
        this.searchFlight()
    }

    onChange(event) {
        if (event == 'TTH') {
            this.showConfirmMessage('selected.tth.uld').then(reason => {
            }).catch(reason => {
                let formData = <NgcFormArray>this.form.controls['resultList'].value;
            });
        }
    }

    validateSubscription() {
        this.form.get('checkInPendingList').valueChanges.subscribe(data => {
            (this.form.get('checkInPendingList') as NgcFormArray).controls.forEach((formGroup: NgcFormGroup) => {
                //this.valueChangeForShc(formGroup);
            });
        });
        this.form.get('verifiedList').valueChanges.subscribe(data => {
            (this.form.get('verifiedList') as NgcFormArray).controls.forEach((formGroup: NgcFormGroup) => {
                //this.valueChangeForShc(formGroup);
            });
        });
        this.form.get('pendingVerfication').valueChanges.subscribe(data => {
            (this.form.get('pendingVerfication') as NgcFormArray).controls.forEach((formGroup: NgcFormGroup) => {
                //this.valueChangeForShc(formGroup);
            });
        });
    }


    valueChangeForShc(formGroup) {

        formGroup.get('shc').valueChanges.subscribe(data => {
            data.forEach(element => {
                let request: RampCheckInUld = new RampCheckInUld();
                request.carrierCode = element;
                this.importService.checkCarrierCodeGroup(request).subscribe(resp => {
                    if (resp.data == 1) {
                        formGroup.get('phc').setValue(true);
                        //formGroup.get('sno').setValue(true);
                    } else if (resp.data == 2) {
                        formGroup.get('val').setValue(true);
                        //formGroup.get('sno').setValue(true);
                    } else if (resp.data == 3) {
                        formGroup.get('val').setValue(true);
                        formGroup.get('phc').setValue(true);
                        //formGroup.get('sno').setValue(true);
                    }

                });
            });
        });
    }

    onDamageCheck(event) {

        let list1 = this.form.getRawValue().checkInPendingList;
        let list2 = this.form.getRawValue().pendingVerfication;
        let list3 = this.form.getRawValue().verifiedList;
        this.onDamageEvent = event;
        if (event) {
            let list1Damaged: any = [];
            let list2Damaged: any = [];
            let list3Damaged: any = [];
            list1.forEach(element => {
                if (element.damaged == true) {
                    list1Damaged.push(element);
                }
                else {
                    this.list1Undamaged.push(element);
                }
            });
            list2.forEach(element => {
                if (element.damaged == true) {
                    list2Damaged.push(element);
                }
                else {
                    this.list2Undamaged.push(element);
                }
            });
            list3.forEach(element => {
                if (element.damaged == true) {
                    list3Damaged.push(element);
                }
                else {
                    this.list3Undamaged.push(element);
                }
            });
            this.form.get('checkInPendingList').patchValue(list1Damaged);
            this.form.get('pendingVerfication').patchValue(list2Damaged);
            this.form.get('verifiedList').patchValue(list3Damaged);

        }
        if (event == false) {
            this.list1Undamaged.forEach(element => {
                list1.push(element)

            });
            this.list2Undamaged.forEach(element => {
                list2.push(element)

            });
            this.list3Undamaged.forEach(element => {
                list3.push(element)

            });
            this.form.get('checkInPendingList').patchValue(list1);
            this.form.get('pendingVerfication').patchValue(list2);
            this.form.get('verifiedList').patchValue(list3);
            this.list1Undamaged = [];
            this.list2Undamaged = [];
            this.list3Undamaged = [];

        }

    }
    onLocationChange(data, index, type) {

        this.sectorId = data.parameter2;
        if (type == 'CP') {
            this.form.get(['checkInPendingList', index, 'sector']).setValue(data.parameter2);
        } else if (type == 'PV') {
            this.form.get(['pendingVerfication', index, 'sector']).setValue(data.parameter2);
        } else if (type == 'V') {
            this.form.get(['verifiedList', index, 'sector']).setValue(data.parameter2);
        }


    }
    autoSearchAccessoryInfo($event) {

        this.accessoryPopUp.close();

        this.searchFlight();

    }



    closeWindow() {

        this.accessoryPopUp.close();

    }



    openAddAccessory(lineItem, index) {
        console.log(lineItem);

        const dataForm = this.form.get('search');
        this.inputData = {

            flightKey: dataForm.get('flight').value,

            flightDate: dataForm.get('flightDate').value,

            uldNumber: lineItem.uldNumber,

            modeType: 'IMPORT'

        };

        this.accessoryPopUp.open();

    }

    print() {
        this.reportParameters = new Object();
        this.reportParameters.flightId = (this.response.data.flightId).toString();
        this.reportWindow.open();
    }
}