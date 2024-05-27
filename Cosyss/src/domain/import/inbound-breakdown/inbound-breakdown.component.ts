
// Angular
import {
    Component, NgZone, ElementRef, ViewContainerRef, ChangeDetectorRef,
    QueryList, Pipe, ViewChild, AfterViewInit, OnInit, TemplateRef
} from '@angular/core';
import 'rxjs';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    InboundBreakdownModel, InboundBreakdownShipmentModel,
    InboundBreakdownShipmentInventoryModel, InboundBreakdownShipmentShcModel,
    InboundBreakdownShipmentHouseModel
} from '../import.shared';


// Application
import {
    NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NotificationMessage, StatusMessage, CellsRendererStyle,
    DropDownListRequest, MessageType, NgcCheckBoxComponent, NgcInputComponent, NgcUtility, PageConfiguration, NgcWindowComponent, UserProfile
} from 'ngc-framework';
import { ImportService } from '../import.service';
import { ApplicationFeatures } from '../../common/applicationfeatures';


/**
 *
 * Breakdown Working List of Flight
 *
 */
@Component({
    templateUrl: './inbound-breakdown.component.html',
})
//@PageConfiguration({ trackInit: true })


@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true,
    autoBackNavigation: true,
    focusToBlank: true,
    focusToMandatory: true,
})
export class InboundBreakdownComponent extends NgcPage {

    @ViewChild('courierwindow') couWindow: NgcWindowComponent;
    @ViewChild('addMaintainHouseWindow') addMaintainHouseWindow: NgcWindowComponent;
    @ViewChild('addTagWindow') addTagWindow: NgcWindowComponent;
    @ViewChild('xpsWindow') xpsWindow: NgcWindowComponent;
    @ViewChild('shipmentLocation') focusFirstField: NgcInputComponent;
    @ViewChild('parentWindow') parentWindow: NgcWindowComponent;
    @ViewChild('accessoryPopUp') accessoryPopUp: NgcWindowComponent;

    //update booking component integration.
    updateBookingObject: any;
    @ViewChild('updateBookingWindow') updateBookingWindow: NgcWindowComponent;

    private breakDownWorkList: any;
    private isAwbDetailsPresent = false;
    private inboundBreakDowndata: any;
    private inboundBreakDownHAWBdata: any;
    private shipment: any;
    private breakDownAwbSourceParameter;
    private breakDownUldSourceParameter;
    templateRef: TemplateRef<any>;
    private isAwbOriginPresent = false;
    private ishawbInfoExist = false;
    private isManifestWeightPresent = false;
    private flightId: Number;
    private lastUpdatedLocationTime: any;
    private isHousingInformationPresent = false;
    private inventoryPieceCount: Number = 0;
    private FlightId: string;
    private carrierCode: string;
    private isFoundCargo: boolean = false;
    private editAwbWeight: boolean = false;
    private isSQGroupCarrier: boolean = false;
    private enableBookingInfo: boolean = false;
    private isBreakDownCompleted: boolean = false;
    private breakDownServiceProvider;
    private isPreBookedPieces = false;
    private pieceDetail: string;
    private totalPieceCount: number = 0;
    private perPieceBreakdownWeight: number = 0;
    private totalWeightCount: number = 0;
    private breakFlag = false;
    private serviceProviderLength = false;
    private loadedthroughNavigation = false;
    private shcList = [];
    private hawbShcList = [];
    private boardingPoint = null;
    private totalHousePcs: number = 0;
    private totalHouseWgt: number = 0;
    private totalInventoryBreakdownPcs: number = 0;
    private totalInventoryBreakdownWgt: number = 0;
    private suffixValuesExist: boolean = false;
    private closingWindowCountnumber: number = 0;
    private dataSyncSearch: number = 0;
    private hawbSourceParameters: any;
    private totalInvPieces: number = 0;
    private totalInvWeight: number = 0.0;
    private totalInvChargeableWeight: number = 0.0;
    private handledByMasterHouse: boolean = false;
    private hawbHandling: boolean = false;
    private hawbInfoFeatureEnabled: boolean = false;
    private actualLocationFeatureEnabled: boolean = false;
    private shipmentTerminalAwareLocation: boolean = false;
    private maintainAddHouseIndex: any = 0;
    private inboundBreakdownStorageInfoId: any = 0;
    private shipmentInventoryId: any = 0;
    private shipmentId: any = 0;
    private sectorId: any = '';
    private inventoryPieces = 0;
    private inventoryWeight = 0;
    terminalRequired: boolean = true;
    popUpWidth: Number;
    popUpHeight: Number;
    isClosePopupScreen: boolean = true;
    uldNumber: any;
    modeType: string = '';
    inputData: any;
    natureOfGoodsFlag: boolean = false;
    mailAwbObcFlag: boolean = false;




    private inboundBreakdownFormGroup: NgcFormGroup = new NgcFormGroup({
        flightNumber: new NgcFormControl('', Validators.required),
        flightDate: new NgcFormControl(new Date(), Validators.required),
        awbNumber: new NgcFormControl('', Validators.required),
        uldNumber: new NgcFormControl(),
        shipmentType: new NgcFormControl(),
        hawbNumbers: new NgcFormControl(),
    });

    private maintainBreakdownHouseInfoFormGroup: NgcFormGroup = new NgcFormGroup({
        houseNum: new NgcFormControl(),
        breakdownHouseInfo: new NgcFormArray([
            new NgcFormGroup({
                houseNumber: new NgcFormControl(),
                housePicecWeight: new NgcFormControl(),
                hawbPieces: new NgcFormControl(),
                hawbWeight: new NgcFormControl(),
                hawbBDPcs: new NgcFormControl(),
                hawbBDWt: new NgcFormControl(),
                hawwbRemarks: new NgcFormControl()
            })
        ]),
    });
    private addTagInfoFormGroup: NgcFormGroup = new NgcFormGroup({
        breakdownHouseInfo: new NgcFormArray([
            new NgcFormGroup({
                houseNumber: new NgcFormControl(),
                housePicecWeight: new NgcFormControl(),
                hawbPieces: new NgcFormControl(),
                hawbBDPcs: new NgcFormControl(),
            })
        ]),
    });
    private awbDetailsFormGroup: NgcFormGroup = new NgcFormGroup({
        flightId: new NgcFormControl(),
        flightNumber: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        ata: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        shipmentId: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        shipmentDate: new NgcFormControl(),
        manifestPieces: new NgcFormControl(),
        manifestWeight: new NgcFormControl(),
        breakDownPieces: new NgcFormControl(),
        breakDownWeight: new NgcFormControl(),
        piece: new NgcFormControl(),
        weight: new NgcFormControl(),
        awbChargeableWeight: new NgcFormControl(),
        shcs: new NgcFormControl(),
        handlingMode: new NgcFormControl(),
        handlingArea: new NgcFormControl(),
        transferType: new NgcFormControl(),
        uld: new NgcFormArray([]),
        uldNumbers: new NgcFormControl(),
        bdstartdate: new NgcFormControl(new Date()),
        bdstarttime: new NgcFormControl(new Date()),
        handCarry: new NgcFormControl(false),
        uldDamage: new NgcFormControl(),
        bdstaffGroups: new NgcFormControl(),
        bdinstruction: new NgcFormControl(),
        wareHouseInstruction: new NgcFormControl(),
        natureOfGoodsDescription: new NgcFormControl('', [Validators.maxLength(20)]),
        awbs: new NgcFormArray([]),
        totalPieceCount: new NgcFormControl(),
        totalUtilisedPieces: new NgcFormControl(),
        totalUtilisedWeight: new NgcFormControl(),
        bookingPieces: new NgcFormControl(),
        bookingWeight: new NgcFormControl(),
        //hawb controls
        hawbId: new NgcFormControl(),
        hawbNumber: new NgcFormControl(),
        hawbPieces: new NgcFormControl(),
        hawbWeight: new NgcFormControl(),
        hawbOrigin: new NgcFormControl(),
        hawbDestination: new NgcFormControl(),
        hawbNatureOfGoods: new NgcFormControl(),
        hawbChargebleWeight: new NgcFormControl(),
        hawbShcs: new NgcFormControl(),
        handledByDOMINT: new NgcFormControl(),
        handledByMasterHouse: new NgcFormControl(),

        //end

        carCreated: new NgcFormControl(),
        packing: new NgcFormControl(),
        damagedShipment: new NgcFormControl(),

        inventory: new NgcFormArray([
            new NgcFormGroup({
                inventoryId: new NgcFormControl(),
                deliveryRequestOrderNo: new NgcFormControl(),
                deliveryOrderNo: new NgcFormControl(),
                isTrmintiated: new NgcFormControl(),
                hold: new NgcFormControl(),
                inboundFlightId: new NgcFormControl(),
                throughTransit: new NgcFormControl(),
                assignedUldTrolley: new NgcFormControl(),
                loaded: new NgcFormControl(),
                shipmentLocation: new NgcFormControl(),
                pieces: new NgcFormControl([Validators.required]),
                weight: new NgcFormControl(0.00, [Validators.required]),
                chargeableWeight: new NgcFormControl(0.00),
                warehouseLocation: new NgcFormControl(),
                damagePieces: new NgcFormControl(),
                shc: new NgcFormArray([]),
                shc1: new NgcFormControl(),
                shc2: new NgcFormControl(),
                shc3: new NgcFormControl(),
                flag: new NgcFormControl(),
                house: new NgcFormArray([]),
                housewayBillInformation: new NgcFormArray([]),
                uldNumber: new NgcFormControl(),
                partSuffix: new NgcFormControl(),
                warehouseHandlingInstruction: new NgcFormControl(),
                transferType: new NgcFormControl(),
                handlingMode: new NgcFormControl(),
                handlingArea: new NgcFormControl(),
                impArrivalManifestULDId: new NgcFormControl(),
                manifestPieces: new NgcFormControl(),
                manifestWeight: new NgcFormControl(),
                uldDamage: new NgcFormControl(),
                flagCRUD: new NgcFormControl(),
                disbleHouseAdd: new NgcFormControl(),
                disbleDelete: new NgcFormControl(),
                maintainHouseAdd: new NgcFormControl(),
                accessLocation: new NgcFormControl(),
                sector: new NgcFormControl(),
                accessoryType: new NgcFormControl(),
                actualLoction: new NgcFormControl()
            })

        ]),
        shipmentType: new NgcFormControl(),
        courierTags: new NgcFormArray([
        ]),
        bookingDetails: new NgcFormArray([]),
        xpsShipment: new NgcFormArray([
        ]),
        ctag: new NgcFormControl()
    })
    public ngOnInit(): void {
        super.ngOnInit();
        let userInfo: UserProfile = this.getUserProfile();
        this.inboundBreakdownFormGroup.get('shipmentType').setValue('AWB');
        this.inboundBreakdownFormGroup.get('awbNumber').setValidators([Validators.required, Validators.maxLength(11)])
        let forwardedData = this.getNavigateData(this.activatedRoute);
        //this hawbInfoFeatureEnabled &  actualLocationFeatureEnabled & shipmentTerminalAwareLocation enabled for AAT
        this.hawbInfoFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBInfo);
        this.actualLocationFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_Shipment_ActualLocation);
        this.shipmentTerminalAwareLocation = NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_Shipment_TerminalAware_Location);
        if (this.shipmentTerminalAwareLocation) {
            this.terminalRequired = false;
        } else {
            this.terminalRequired = true;
        }
        this.dataSyncSearch = 0;
        // checking if the fetched data is not null
        if (forwardedData != null) {
            console.log(forwardedData);
            this.inboundBreakdownFormGroup.get('flightNumber').setValue(forwardedData.flightNumber);
            this.inboundBreakdownFormGroup.get('awbNumber').setValue(forwardedData.shipmentNumber);
            if (forwardedData.shipmentType != null) {
                this.inboundBreakdownFormGroup.get('shipmentType').setValue(forwardedData.shipmentType);
            } else {
                this.inboundBreakdownFormGroup.get('shipmentType').setValue('AWB');
            }
            this.inboundBreakdownFormGroup.get('flightDate').setValue(forwardedData.flightDate);

            this.dataSyncSearch = forwardedData.dataSyncSearch;
            let handledByMasterOrHouse = forwardedData.handledByMasterHouse;
            this.loadedthroughNavigation = true;

            this.onChangeOfShipmentNumber();

            if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling) && handledByMasterOrHouse == 'H') {
                this.isAwbDetailsPresent = false;
            } else {
                this.inboundBreakdownFormGroup.get('hawbNumbers').clearValidators();
                this.onSearch();
            }
        }
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.awbDetailsFormGroup.get('uldNumbers').valueChanges.subscribe((response) => {
            let uldData = new InboundBreakdownShipmentModel();
            uldData.uldNumber = this.awbDetailsFormGroup.get('uldNumbers').value;
            uldData.shipmentNumber = this.awbDetailsFormGroup.get('shipmentNumber').value;
        });

    }



    constructor(appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef, private activatedRoute: ActivatedRoute, private router: Router, private importService: ImportService) {
        super(appZone, appElement, appContainerElement);
    }

    onFlightOrUldChange(val, ofType) {
        this.dataSyncSearch = 0;
        this.isAwbDetailsPresent = false;
        this.breakDownAwbSourceParameter = this.createSourceParameter(this.inboundBreakdownFormGroup.get('uldNumber').value, this.inboundBreakdownFormGroup.get('flightNumber').value,
            this.inboundBreakdownFormGroup.get('flightDate').value, this.inboundBreakdownFormGroup.get('awbNumber').value);
    }

    onShipmentTypeChange(value) {
        if (value == 'OBC' || value == 'IMAIL') {
            this.inboundBreakdownFormGroup.get('awbNumber').setValidators([Validators.required, Validators.maxLength(20)])
        } else {
            this.inboundBreakdownFormGroup.get('awbNumber').setValidators([Validators.required, Validators.maxLength(11)])
        }
    }


    onChangeOfShipmentNumber() {
        this.isAwbDetailsPresent = false;
        this.handledByMasterHouse = false;
        this.awbDetailsFormGroup.get('inventory').patchValue([]);
        this.inboundBreakdownFormGroup.get('hawbNumbers').setValue(null);
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
            this.inboundBreakdownFormGroup.get('hawbNumbers').clearValidators();
            this.awbDetailsFormGroup.get('hawbOrigin').clearValidators();
            this.awbDetailsFormGroup.get('hawbDestination').clearValidators();
            this.awbDetailsFormGroup.get('hawbNatureOfGoods').clearValidators();
            this.hawbSourceParameters = this.createSourceParameter(this.inboundBreakdownFormGroup.get('awbNumber').value);

            this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
                if (data != null && data.length > 0) {
                    this.handledByMasterHouse = true;
                    this.inboundBreakdownFormGroup.get('hawbNumbers').setValidators([Validators.required, Validators.maxLength(16)]);
                } else {
                    this.handledByMasterHouse = false;
                }
            },
            );

        }
    }

    onChangeHawbNumber() {
        this.isAwbDetailsPresent = false;
    }

    onSearch() {
        this.sectorId = 0;
        this.editAwbWeight = false;
        this.natureOfGoodsFlag = false;
        this.inboundBreakdownFormGroup.validate();
        if (this.inboundBreakdownFormGroup.invalid) {
            this.showErrorStatus('error.import.enter.mandatory.fields');
            return;
        }

        if (this.inboundBreakdownFormGroup.get('shipmentType').value == 'OBC'
            || this.inboundBreakdownFormGroup.get('shipmentType').value == 'Mail') {
            this.natureOfGoodsFlag = true;
        }

        this.suffixValuesExist = false;
        this.isSQGroupCarrier = false;
        this.enableBookingInfo = false;
        this.closingWindowCountnumber = 0;
        this.awbDetailsFormGroup.get('inventory').patchValue([]);
        this.awbDetailsFormGroup.get('bookingDetails').patchValue([]);
        this.awbDetailsFormGroup.get('bookingPieces').patchValue(null);
        this.awbDetailsFormGroup.get('bookingWeight').patchValue(null);
        let breakDownModel = new InboundBreakdownModel();

        breakDownModel.flightNumber = this.inboundBreakdownFormGroup.get('flightNumber').value;
        breakDownModel.flightDate = this.inboundBreakdownFormGroup.get('flightDate').value;
        if (this.inboundBreakdownFormGroup.get('hawbNumbers').value != null && this.inboundBreakdownFormGroup.get('hawbNumbers').value != '') {
            breakDownModel.hawbNumber = this.inboundBreakdownFormGroup.get('hawbNumbers').value;
        } else {
            breakDownModel.hawbNumber = null;
        }
        breakDownModel.shipment.flagCRUD = 'N';
        breakDownModel.shipment.shipmentNumber = this.inboundBreakdownFormGroup.get('awbNumber').value;
        breakDownModel.shipment.uldNumber = this.inboundBreakdownFormGroup.get('uldNumber').value;
        breakDownModel.shipment.shipmentType = this.inboundBreakdownFormGroup.get('shipmentType').value;
        let userInfo: UserProfile = this.getUserProfile();
        breakDownModel.loggedInUser = userInfo.userLoginCode;
        if (breakDownModel.shipment.shipmentNumber != null && breakDownModel.shipment.shipmentNumber != '') {
            this.importService.getInboundBreakDownData(breakDownModel).subscribe((response) => {
                if (this.showResponseErrorMessages(response)) {
                    return;
                }
                if (response.messageList) {
                    if (response.messageList[0].type == "W") {
                        this.showConfirmMessage(this.getI18NValue(response.messageList[0].code)).then(() => {
                            breakDownModel.shipment.flagCRUD = 'Y';
                            this.importService.getInboundBreakDownData(breakDownModel).subscribe((response) => {

                                if (!this.showResponseErrorMessages(response)) {
                                    this.totalPieceCount = 0;
                                    this.awbDetailsFormGroup.get('totalPieceCount').setValue(this.totalPieceCount);
                                    if (response.data.handlinginSystem) {
                                        this.showConfirmMessage('entered.flight.not.handled.in.cosys').then(reason => {
                                            this.successResponse(response, breakDownModel);
                                        }).catch(reason => {
                                            this.isAwbDetailsPresent = false;
                                        });
                                    } else {
                                        this.successResponse(response, breakDownModel);
                                    }
                                } else {
                                    this.successResponse(response, breakDownModel);
                                }

                            });

                        }).catch();
                        return;
                    }

                }

                if (!this.showResponseErrorMessages(response)) {
                    this.totalPieceCount = 0;
                    this.awbDetailsFormGroup.get('totalPieceCount').setValue(this.totalPieceCount);
                    if (response.data.handlinginSystem && this.dataSyncSearch == 0) {
                        this.showConfirmMessage('entered.flight.not.handled.in.cosys').then(reason => {
                            this.successResponse(response, breakDownModel);
                            this.dataSyncSearch++;
                        }).catch(reason => {
                            this.isAwbDetailsPresent = false;
                        });
                    } else {
                        this.successResponse(response, breakDownModel);
                    }
                } else {
                    this.isAwbDetailsPresent = false;
                }
            });


        } else {
            this.showErrorStatus("error.import.enter.mandatory.fields");
        }
    }

    successResponse(response, breakDownModel) {
        this.editAwbWeight = false;
        this.hawbHandling = false;
        this.flightId = response.data.flightId;
        this.FlightId = response.data.flightId;
        this.carrierCode = response.data.carrierCode;
        this.boardingPoint = response.data.boardingPoint;
        this.inboundBreakDowndata = response.data.shipment;
        this.inboundBreakDownHAWBdata = response.data.hawbInfo;
        //part sufiix drop down will enable only for transhipments
        if (!(NgcUtility.isTenantCityOrAirport(response.data.shipment.destination))) {
            this.isSQGroupCarrier = response.data.checkForSQGroupCarrier;
        }

        //disable for AAT
        if (!this.hawbInfoFeatureEnabled) {
            this.enableBookingInfo = response.data.checkForSQGroupCarrier;
        }
        if (response.data.breakdownCompleted != null) {
            this.isBreakDownCompleted = true;
        } else {
            this.isBreakDownCompleted = false;
        }
        this.isManifestWeightPresent = false;
        if (this.inboundBreakDowndata != null) {
            this.isFoundCargo = false;
            this.isAwbDetailsPresent = true;
            if (!response.data.shipment.manifestPieces) {
                this.isFoundCargo = true;
                if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
                    this.handledByMasterHouse = true;
                }
                this.awbDetailsFormGroup.controls['bdstaffGroups'].clearValidators();
                this.showErrorMessage("no.manifest.available.shipment");
                this.natureOfGoodsFlag = true;
            }
            if (response.data.shipment.piece !== 0 && response.data.shipment.weight === 0) {
                this.editAwbWeight = true;
            }
            this.isAwbOriginPresent = false;
            this.getULDTrolleyInfo(breakDownModel.shipment.shipmentNumber, this.FlightId);
            this.getBDServiceProvider(response.data.flightNo, this.inboundBreakdownFormGroup.get('flightDate').value, this.FlightId);
            this.awbDetailsFormGroup.get('bdstartdate').setValue(new Date());
            this.awbDetailsFormGroup.get('bdstarttime').setValue(new Date());
            this.awbDetailsFormGroup.get('bdinstruction').setValue(this.inboundBreakDowndata.breakdownInstruction);
            this.totalHousePcs = this.inboundBreakDowndata.totalHousePieces;
            this.totalHouseWgt = this.inboundBreakDowndata.totalHouseWeight;
            this.totalInventoryBreakdownPcs = this.inboundBreakDowndata.totalBreakDownPieces;
            this.totalInventoryBreakdownWgt = this.inboundBreakDowndata.totalBreakDownWeight;
            this.awbDetailsFormGroup.get('totalUtilisedPieces').setValue(this.inboundBreakDowndata.totalUtilisedPieces);
            this.awbDetailsFormGroup.get('totalUtilisedWeight').setValue(this.inboundBreakDowndata.totalUtilisedWeight);
            this.awbDetailsFormGroup.controls['flightNumber'].patchValue(breakDownModel.flightNumber);
            this.awbDetailsFormGroup.controls['flightDate'].patchValue(breakDownModel.flightDate);
            this.awbDetailsFormGroup.get('ata').patchValue(response.data.ata);
            this.awbDetailsFormGroup.get('bookingPieces').patchValue(this.inboundBreakDowndata.bookingPieces);
            this.awbDetailsFormGroup.get('bookingWeight').patchValue(this.inboundBreakDowndata.bookingWeight);
            this.hawbHandling = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling);
            if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
                //set HAWB info
                if (this.inboundBreakDownHAWBdata != null) {
                    this.ishawbInfoExist = true;
                    this.awbDetailsFormGroup.get('awbChargeableWeight').patchValue(this.inboundBreakDowndata.awbChargeableWeight);
                    this.awbDetailsFormGroup.get('hawbId').patchValue(this.inboundBreakDownHAWBdata.shipmentHouseId);
                    this.awbDetailsFormGroup.get('hawbNumber').patchValue(this.inboundBreakdownFormGroup.get('hawbNumbers').value);
                    this.awbDetailsFormGroup.get('hawbOrigin').patchValue(this.inboundBreakDownHAWBdata.hawbOrigin);
                    this.awbDetailsFormGroup.get('hawbDestination').patchValue(this.inboundBreakDownHAWBdata.hawbDestination);
                    this.awbDetailsFormGroup.get('hawbPieces').patchValue(this.inboundBreakDownHAWBdata.hawbPieces);
                    this.awbDetailsFormGroup.get('hawbWeight').patchValue(this.inboundBreakDownHAWBdata.hawbWeight);
                    this.awbDetailsFormGroup.get('hawbChargebleWeight').patchValue(this.inboundBreakDownHAWBdata.hawbChargebleWeight);
                    this.awbDetailsFormGroup.get('hawbNatureOfGoods').patchValue(this.inboundBreakDownHAWBdata.hawbNatureOfGoods);

                    if (this.inboundBreakDownHAWBdata.hawbShcs != null) {
                        let hawbShcs = null;
                        this.hawbShcList = this.inboundBreakDownHAWBdata.hawbShcs;
                        for (let i = 0; i < this.inboundBreakDownHAWBdata.hawbShcs.length; i++) {
                            let hawbShc = this.inboundBreakDownHAWBdata.hawbShcs[i].specialHandlingCode;
                            if (hawbShcs != null) {
                                hawbShcs = hawbShcs + "  " + hawbShc;
                            } else {
                                hawbShcs = hawbShc;
                            }
                        }
                        this.awbDetailsFormGroup.get('hawbShcs').patchValue(hawbShcs);
                    }
                } else {
                    this.ishawbInfoExist = false;
                    this.awbDetailsFormGroup.get('hawbId').patchValue(null);
                    this.awbDetailsFormGroup.get('hawbNumber').patchValue(null);
                    this.awbDetailsFormGroup.get('hawbOrigin').patchValue(null);
                    this.awbDetailsFormGroup.get('hawbDestination').patchValue(null);
                    this.awbDetailsFormGroup.get('hawbPieces').patchValue(null);
                    this.awbDetailsFormGroup.get('hawbWeight').patchValue(null);
                    this.awbDetailsFormGroup.get('hawbChargebleWeight').patchValue(null);
                    this.awbDetailsFormGroup.get('hawbNatureOfGoods').patchValue(null);
                    this.awbDetailsFormGroup.get('hawbShcs').patchValue(null);
                    this.awbDetailsFormGroup.get('hawbNumber').patchValue(this.inboundBreakdownFormGroup.get('hawbNumbers').value);
                    if (this.inboundBreakdownFormGroup.get('hawbNumbers').value != null) {
                        this.awbDetailsFormGroup.get('hawbOrigin').setValue(this.inboundBreakDowndata.origin);
                        this.awbDetailsFormGroup.get('hawbDestination').setValue(this.inboundBreakDowndata.destination);
                        this.awbDetailsFormGroup.get('hawbOrigin').setValidators([Validators.required]);
                        this.awbDetailsFormGroup.get('hawbDestination').setValidators([Validators.required]);
                        this.awbDetailsFormGroup.get('hawbNatureOfGoods').setValidators([Validators.required]);
                    }

                }
                if (this.inboundBreakdownFormGroup.get('hawbNumbers') != null) {
                    this.awbDetailsFormGroup.get('hawbNumber').patchValue(this.inboundBreakdownFormGroup.get('hawbNumbers').value);
                }
            }
            //patch breakdown data
            this.awbDetailsFormGroup.patchValue(this.inboundBreakDowndata);

            if (this.awbDetailsFormGroup.getRawValue().inventory.length > 1) {
                const item = this.awbDetailsFormGroup.getRawValue().inventory;
                for (let index = 0; index < item.length; index++) {
                    item.splice(index, 1);
                }
                this.awbDetailsFormGroup.get('inventory').patchValue(item);
            }

            this.awbDetailsFormGroup.get('inventory').reset();
            if (this.inboundBreakDowndata.origin != null) {
                this.isAwbOriginPresent = true;
            }
            if (this.inboundBreakDowndata.manifestWeight != null) {
                this.isManifestWeightPresent = true;

            }
            if (this.inboundBreakDowndata.shcs != null) {
                let shcs = "";
                this.shcList = this.inboundBreakDowndata.shcs;
                for (let i = 0; i < this.inboundBreakDowndata.shcs.length; i++) {
                    let shc = this.inboundBreakDowndata.shcs[i];
                    if (shc) {
                        shcs = shcs + "  " + shc.specialHandlingCode;
                    }

                }
                this.awbDetailsFormGroup.controls['shcs'].patchValue(shcs);
            }

        }

        if (response.data.shipment.expressFlag) {
            this.createNewRow(null, 0);
        } else {
            if ((this.awbDetailsFormGroup.get(["inventory", 0, "house", 0, "flagCRUD"]) as NgcFormControl)) {
                this.deletehouse(null, 0, 0);
            }
        }

        if (response.data.shipment.preBookedPieces) {
            this.isPreBookedPieces = true;
            this.pieceDetail = 'PreBooked Pieces / Weight';
        } else {
            this.isPreBookedPieces = false;
            this.pieceDetail = 'AWB Pieces / Weight';
        }
        if (response.data.shipment.inventory != null && response.data.shipment.inventory.length > 0) {
            for (let data of response.data.shipment.inventory) {
                data['disbleHouseAdd'] = '';
                data['disbleDelete'] = '';
                data['maintainHouseAdd'] = '';

            }
        }

        if (response.data.shipment.inventory != null && response.data.shipment.inventory.length > 0) {
            this.awbDetailsFormGroup.get('inventory').patchValue(response.data.shipment.inventory);
        }

        if (response.data.shipment.inventory != null && response.data.shipment.inventory.length > 0) {
            for (let index = 0; index < response.data.shipment.inventory.length; index++) {
                if (response.data.shipment.inventory[index].partSuffix != null && response.data.shipment.inventory[index].partSuffix != ''
                    && !NgcUtility.isTenantCityOrAirport(this.awbDetailsFormGroup.get('destination').value)) {
                    this.suffixValuesExist = true;
                }
                if (response.data.shipment.inventory[index].deliveryOrderNo || response.data.shipment.inventory[index].deliveryRequestOrderNo ||
                    response.data.shipment.inventory[index].throughTransit || response.data.shipment.inventory[index].assignedUldTrolley ||
                    response.data.shipment.inventory[index].loaded == 1 || response.data.shipment.inventory[index].hold
                    || response.data.shipment.inventory[index].isTrmintiated) {
                    (this.awbDetailsFormGroup.get(["inventory", index]) as NgcFormGroup).disable();
                }
            }
        }
        // if inventory null set default line
        if (response.data.shipment.inventory == null || response.data.shipment.inventory.length == 0) {
            this.addRow();
        }

        if ((response.data.shipment.breakDownPieces) && (response.data.shipment.breakDownWeight)) {
            this.perPieceBreakdownWeight = response.data.shipment.breakDownWeight / response.data.shipment.breakDownPieces;
        }

        this.retrieveDropDownListRecords("INBOUND_ULDNO", "query", this.breakDownUldSourceParameter).subscribe(data => {
            let terminal = this.getUserProfile().terminalId;
            if (!NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_ServiceProviderEntryRequired)) {
                this.breakFlag = false;
                for (let index = 0; index < data.length; index++) {
                    if (data[index].parameter1 == "BREAK" && terminal != 'ECC') {
                        this.breakFlag = true;
                        this.awbDetailsFormGroup.controls['bdstaffGroups'].setValidators([Validators.required]);
                        break;
                    } else if (data[index].desc == 'Bulk' && response.data.bulk) {
                        this.breakFlag = true;
                        this.awbDetailsFormGroup.controls['bdstaffGroups'].setValidators([Validators.required]);
                        break;
                    }
                }
            } else {
                this.breakFlag = false;
            }


        },
            err => console.error(err));

        this.retrieveDropDownListRecords("BDSUMMARY_SERVICEPROVIDER", "query", this.breakDownServiceProvider).subscribe(data => {
            if (data.length == 1) {
                this.serviceProviderLength = true;
            } else {
                this.serviceProviderLength = false;
            }
        },
            err => console.error(err));

    }

    addRow() {
        let inventorys: NgcFormArray = (this.awbDetailsFormGroup.get('inventory') as NgcFormArray);
        //
        this.createRow();
    }
    createRow() {
        let userInfo: UserProfile = this.getUserProfile();
        console.log(this.awbDetailsFormGroup.get('inventory'));
        (<NgcFormArray>this.awbDetailsFormGroup.get('inventory')).addValue([
            {
                inventoryId: null,
                deliveryOrderNo: null,
                isTrmintiated: null,
                hold: null,
                deliveryRequestOrderNo: null,
                inboundFlightId: null,
                throughTransit: null,
                assignedUldTrolley: null,
                loaded: null,
                shipmentLocation: null,
                pieces: 0,
                weight: 0.0,
                chargeableWeight: 0.00,
                warehouseLocation: null,
                shc1: '',
                shc2: '',
                shc3: '',
                damagePieces: 0,
                handlingMode: '',
                handlingArea: userInfo.terminalId,
                transferType: '',
                warehouseHandlingInstruction: '',
                shc: [],
                uldNumber: '',
                partSuffix: '',
                impArrivalManifestULDId: '',
                house: [],
                housewayBillInformation: null,
                uldDamage: false,
                manifestPieces: 0,
                manifestWeight: 0.0,
                disbleHouseAdd: '',
                disbleDelete: '',
                accessLocation: false,
                sector: null,
                maintainHouseAdd: '',
                accessoryType: null,
                actualLoction: ''
            }
        ]);

        let index = (<NgcFormArray>this.awbDetailsFormGroup.get('inventory')).length;

        if (this.isSQGroupCarrier) {
            this.retrieveDropDownListRecords("BOOKING_PART_SUFFIX", "query", { 'parameter1': this.inboundBreakdownFormGroup.get('awbNumber').value }).subscribe(data => {
                if (data.length > 0 && !NgcUtility.isTenantCityOrAirport(this.awbDetailsFormGroup.get('destination').value)) {
                    this.suffixValuesExist = true;
                }
                if (data.length == 1) {
                    this.awbDetailsFormGroup.get(['inventory', index - 1, 'partSuffix']).setValue(data[0].code);
                }
            });

            if (this.inboundBreakDowndata != null && this.inboundBreakDowndata.bookingDetails != null && this.inboundBreakDowndata.bookingDetails.length > 0) {
                this.inboundBreakDowndata.bookingDetails.forEach(element => {
                    if (element.flightId == this.flightId) {
                        this.awbDetailsFormGroup.get(['inventory', index - 1, 'partSuffix']).setValue(element.partSuffix);
                    }
                });
            }
        }
    }

    updateBookingPcsWt() {
        this.updateBookingObject = {
            shipmentNumber: this.inboundBreakDowndata.shipmentNumber,
            shipmentDate: this.inboundBreakDowndata.shipmentdate
        }
        this.closingWindowCountnumber = 0;
        this.updateBookingWindow.open();

    }
    closeUpdateBooking() {
        this.updateBookingWindow.close();
    }


    onSave() {
        this.awbDetailsFormGroup.validate();
        if (this.awbDetailsFormGroup.invalid) {
            return;
        }
        if (!this.isAwbDetailsPresent) {
            return;
        }
        if (this.awbDetailsFormGroup.get('origin').value == null
            || this.awbDetailsFormGroup.get('destination').value == null || this.awbDetailsFormGroup.get('natureOfGoodsDescription').value == null) {
            this.showErrorStatus('error.import.enter.mandatory.fields');
            return;
        }
        if (!this.validateFieldServiceProvider()) {
            this.showErrorStatus('error.import.enter.mandatory.fields');
            return;
        }
        if (this.awbDetailsFormGroup.get('piece').value != 0 && this.awbDetailsFormGroup.get('weight').value == 0) {
            this.showErrorStatus('imp.err114');
            return;
        }

        const inventoryDetails = (<NgcFormArray>this.awbDetailsFormGroup.get('inventory')).getRawValue();
        for (let index = 0; index < inventoryDetails.length; index++) {
            if (this.awbDetailsFormGroup.get(['inventory', index, 'shipmentLocation']).invalid) {
                return;
            }
        }

        let breakDownModel = new InboundBreakdownModel();

        this.inventoryPieceCount = 0;
        breakDownModel.shipment.shipmentNumber = this.inboundBreakdownFormGroup.get('awbNumber').value;
        breakDownModel.shipment.shipmentType = this.inboundBreakdownFormGroup.get('shipmentType').value;
        breakDownModel.flightId = this.flightId;
        breakDownModel.boardingPoint = this.boardingPoint;
        breakDownModel.shipment.flightId = this.flightId;
        breakDownModel.shipment.lastUpdatedTime = this.inboundBreakDowndata.lastUpdatedTime;
        breakDownModel.flightNumber = this.inboundBreakdownFormGroup.get('flightNumber').value;
        breakDownModel.flightDate = this.inboundBreakdownFormGroup.get('flightDate').value;
        breakDownModel.hawbNumber = this.inboundBreakdownFormGroup.get('hawbNumbers').value;
        breakDownModel.carrierCode = this.carrierCode;
        breakDownModel.shipment.handCarry = this.awbDetailsFormGroup.get('handCarry').value;
        breakDownModel.shipment.breakdownStaffGroup = this.awbDetailsFormGroup.get('bdstaffGroups').value;
        breakDownModel.shipment.uldDamage = this.awbDetailsFormGroup.get('uldDamage').value;
        breakDownModel.shipment.origin = this.awbDetailsFormGroup.get('origin').value;
        breakDownModel.shipment.destination = this.awbDetailsFormGroup.get('destination').value;
        breakDownModel.shipment.piece = this.awbDetailsFormGroup.get('piece').value ? this.awbDetailsFormGroup.get('piece').value : 0;
        breakDownModel.shipment.weight = this.awbDetailsFormGroup.get('weight').value ? this.awbDetailsFormGroup.get('weight').value : 0;
        breakDownModel.shipment.manifestPieces = this.awbDetailsFormGroup.get('manifestPieces').value ? this.awbDetailsFormGroup.get('manifestPieces').value : 0;
        breakDownModel.shipment.manifestWeight = this.awbDetailsFormGroup.get('manifestWeight').value ? this.awbDetailsFormGroup.get('manifestWeight').value : 0;
        breakDownModel.shipment.breakDownPieces = this.awbDetailsFormGroup.get('breakDownPieces').value ? this.awbDetailsFormGroup.get('breakDownPieces').value : 0;
        breakDownModel.shipment.breakDownWeight = this.awbDetailsFormGroup.get('breakDownWeight').value ? this.awbDetailsFormGroup.get('breakDownWeight').value : 0;
        breakDownModel.shipment.flagCRUD = 'N';
        breakDownModel.shipment.preBookedPieces = this.isPreBookedPieces;
        breakDownModel.shipment.shcs = this.shcList;
        breakDownModel.shipment.irregularityPiecesFound = this.inboundBreakDowndata.irregularityPiecesFound;
        breakDownModel.shipment.irregularityPiecesMissing = this.inboundBreakDowndata.irregularityPiecesMissing;

        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
            breakDownModel.hawbInfo.shipmentHouseId = this.awbDetailsFormGroup.get('hawbId').value;
            breakDownModel.hawbInfo.shipmentType = this.inboundBreakdownFormGroup.get('shipmentType').value;
            breakDownModel.hawbInfo.hawbNumber = this.inboundBreakdownFormGroup.get('hawbNumbers').value;
            breakDownModel.hawbInfo.hawbOrigin = this.awbDetailsFormGroup.get('hawbOrigin').value;
            breakDownModel.hawbInfo.hawbDestination = this.awbDetailsFormGroup.get('hawbDestination').value;
            breakDownModel.hawbInfo.hawbNatureOfGoods = this.awbDetailsFormGroup.get('hawbNatureOfGoods').value;
            breakDownModel.hawbInfo.hawbPieces = this.awbDetailsFormGroup.get('hawbPieces').value;
            breakDownModel.hawbInfo.hawbWeight = this.awbDetailsFormGroup.get('hawbWeight').value;
            breakDownModel.hawbInfo.hawbChargebleWeight = this.awbDetailsFormGroup.get('hawbChargebleWeight').value;
        }

        try {

            if (this.awbDetailsFormGroup.get('natureOfGoodsDescription').value.trim().length - 1 > 20) {
                this.showErrorStatus('imp.err115');
                return;
            }
            breakDownModel.shipment.natureOfGoodsDescription = this.awbDetailsFormGroup.get('natureOfGoodsDescription').value.trim();

        }
        catch (e) {
            console.error(e);
        }
        this.totalInvPieces = 0;
        this.totalInvWeight = 0.0;
        this.totalInvChargeableWeight = 0.0;
        for (let item = 0; item < inventoryDetails.length; item++) {

            let inventoryData = new InboundBreakdownShipmentInventoryModel();
            inventoryData.shipmentLocation = inventoryDetails[item].shipmentLocation;
            inventoryData.deliveryOrderNo = inventoryDetails[item].deliveryOrderNo;
            inventoryData.inboundFlightId = inventoryDetails[item].inboundFlightId;
            inventoryData.throughTransit = inventoryDetails[item].throughTransit;
            inventoryData.assignedUldTrolley = inventoryDetails[item].assignedUldTrolley;
            inventoryData.loaded = inventoryDetails[item].loaded;
            inventoryData.deliveryRequestOrderNo = inventoryDetails[item].deliveryRequestOrderNo;
            inventoryData.pieces = inventoryDetails[item].pieces;
            inventoryData.weight = inventoryDetails[item].weight;
            inventoryData.warehouseLocation = inventoryDetails[item].warehouseLocation;
            inventoryData.uldNumber = inventoryDetails[item].uldNumber ? inventoryDetails[item].uldNumber : 'Bulk';
            inventoryData.uldNumber = inventoryData.uldNumber == 'Select' ? 'Bulk' : inventoryData.uldNumber;
            inventoryData.partSuffix = inventoryDetails[item].partSuffix
            inventoryData.warehouseHandlingInstruction = inventoryDetails[item].wareHouseInstruction;
            inventoryData.handlingMode = inventoryDetails[item].handlingMode;
            inventoryData.handlingArea = inventoryDetails[item].handlingArea;
            inventoryData.transferType = inventoryDetails[item].transferType;
            inventoryData.uldDamage = inventoryDetails[item].uldDamage;
            inventoryData.impArrivalManifestULDId = inventoryDetails[item].impArrivalManifestULDId;
            inventoryData.flightId = this.flightId;
            inventoryData.flagCRUD = inventoryDetails[item].flagCRUD ? inventoryDetails[item].flagCRUD : 'C';
            inventoryData.inboundBreakdownShipmentId = inventoryDetails[item].inboundBreakdownShipmentId;
            inventoryData.inventoryId = inventoryDetails[item].inventoryId;
            inventoryData.isDeliveryInitiated = inventoryDetails[item].isDeliveryInitiated;
            inventoryData.shc = inventoryDetails[item].shc;
            inventoryData.manifestPieces = inventoryDetails[item].manifestPieces ? inventoryDetails[item].manifestPieces : 0;
            inventoryData.manifestWeight = inventoryDetails[item].manifestWeight ? inventoryDetails[item].manifestWeight : 0.0;

            //HAWB Info
            inventoryData.chargeableWeight = inventoryDetails[item].chargeableWeight;
            inventoryData.shipmentHouseAWBId = this.awbDetailsFormGroup.get('hawbId').value;


            inventoryData.actualLoction = inventoryDetails[item].actualLoction;

            //Toatl Inventory Pieces and Weight
            this.totalInvPieces = this.totalInvPieces + Number(inventoryDetails[item].pieces);
            this.totalInvWeight = this.totalInvWeight + Number(inventoryDetails[item].weight);
            this.totalInvChargeableWeight = this.totalInvChargeableWeight + Number(inventoryDetails[item].chargeableWeight);
            //Tag Info
            if (!this.hawbInfoFeatureEnabled && inventoryDetails[item].house) {
                for (let index = 0; index < inventoryDetails[item].house.length; index++) {
                    if (inventoryDetails[item].house[index].number != null && inventoryDetails[item].house[index].number != '') {
                        let houseData = new InboundBreakdownShipmentHouseModel();
                        houseData.number = inventoryDetails[item].house[index].number;
                        houseData.pieces = inventoryDetails[item].house[index].pieces;
                        houseData.type = breakDownModel.shipment.shipmentType;
                        this.inventoryPieceCount = +this.inventoryPieceCount + +houseData.pieces;
                        inventoryData.house.push(houseData);
                    }
                }

            }

            //for AAT implemented
            if (this.hawbInfoFeatureEnabled && inventoryDetails[item].housewayBillInformation) {
                for (let index = 0; index < inventoryDetails[item].housewayBillInformation.length; index++) {
                    if (inventoryDetails[item].housewayBillInformation[index].houseNumber != null && inventoryDetails[item].housewayBillInformation[index].houseNumber != '') {
                        inventoryData.housewayBillInformation.push(inventoryDetails[item].housewayBillInformation[index]);
                    }
                }

            }

            breakDownModel.shipment.inventory.push(inventoryData);

        }

        this.totalInvWeight = Math.floor(this.totalInvWeight * 10) / 10
        //Service call to create ShipmentInventory based on Handling
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
            this.totalInvChargeableWeight = Number((this.totalInvChargeableWeight).toFixed(2));
            if (this.handledByMasterHouse) {
                if ((breakDownModel.hawbInfo.hawbPieces != null && breakDownModel.hawbInfo.hawbPieces != 0)
                    && (this.totalInvPieces > breakDownModel.hawbInfo.hawbPieces)) {

                    if ((breakDownModel.hawbInfo.hawbWeight != null && breakDownModel.hawbInfo.hawbWeight != 0) &&
                        this.totalInvWeight != breakDownModel.hawbInfo.hawbWeight) {
                        this.showErrorMessage("imp.bd.Invweight.not matching.houseWeight");
                        return;
                    }

                    if (Number((breakDownModel.hawbInfo.hawbChargebleWeight != null && breakDownModel.hawbInfo.hawbChargebleWeight != 0) &&
                        this.totalInvChargeableWeight != breakDownModel.hawbInfo.hawbChargebleWeight)) {
                        this.showErrorMessage("imp.bd.InvChargeableweight.not matching.househargeableWeight");
                        return;
                    }

                    this.showConfirmMessage('imp.bd.InvPieces.greaterThan.housePieces').then(reason => {
                        this.createShipmentInvemtory(breakDownModel);
                    }).catch(reason => {
                        return;
                    });
                } else {
                    if ((breakDownModel.hawbInfo.hawbWeight != null && breakDownModel.hawbInfo.hawbWeight != 0) &&
                        this.totalInvPieces == breakDownModel.hawbInfo.hawbPieces && this.totalInvWeight != breakDownModel.hawbInfo.hawbWeight) {
                        this.showErrorMessage("imp.bd.Invweight.not matching.houseWeight");
                        return;
                    }

                    if ((breakDownModel.hawbInfo.hawbChargebleWeight != null && breakDownModel.hawbInfo.hawbChargebleWeight != 0) &&
                        this.totalInvPieces == breakDownModel.hawbInfo.hawbPieces && this.totalInvChargeableWeight != breakDownModel.hawbInfo.hawbChargebleWeight) {
                        this.showErrorMessage("imp.bd.InvChargeableweight.not matching.househargeableWeight");
                        return;
                    }
                    this.createShipmentInvemtory(breakDownModel);
                }
            } else {
                if (breakDownModel.shipment.piece != null && breakDownModel.shipment.piece != 0
                    && this.totalInvPieces >= breakDownModel.shipment.piece) {
                    let awbChargeableWeight = this.awbDetailsFormGroup.get('awbChargeableWeight').value;
                    if ((awbChargeableWeight != null && awbChargeableWeight != 0) && this.totalInvChargeableWeight != awbChargeableWeight) {
                        this.showErrorMessage("imp.bd.InvChargeableweight.not matchingAWBhargeableWeight");
                        return;
                    }
                }
                this.createShipmentInvemtory(breakDownModel);
            }
        } else {
            this.createShipmentInvemtory(breakDownModel);
        }

        let inventorys = this.awbDetailsFormGroup.get('inventory').value;
        if (inventorys != null && inventorys.length > 0) {
            inventorys.forEach(inventory => {
                if (inventory.flag) {
                    inventory.shc = [];
                    inventory.shc.push(inventory.shc1);
                    inventory.shc.push(inventory.shc2);
                    inventory.shc.push(inventory.shc3);
                    console.log(inventorys)
                }
            });
        }
    }

    // onSave method this function will be calling
    private createShipmentInvemtory(breakDownModel: InboundBreakdownModel) {

        this.importService.createData(breakDownModel).subscribe((response) => {

            if (this.showResponseErrorMessages(response)) {
                return;
            }

            if (response.data.messageList[0]) {
                if (response.data.messageList[0].type == "W") {
                    this.showConfirmMessage(this.getI18NValue(response.data.messageList[0].code)).then(() => {
                        breakDownModel.shipment.flagCRUD = 'Y';
                        this.importService.createData(breakDownModel).subscribe((response) => {

                            if (response.messageList) {
                                this.refreshFormMessages(response);
                            }

                            if (this.showResponseErrorMessages(response)) {
                                return;
                            }
                            if (response.data) {
                                if (response.data.isShipmentTargetted) {
                                    this.showInfoStatus('import.info112');
                                }
                                response.data = response.data.shipment;
                                if (!this.showResponseErrorMessages(response)) {
                                    this.showSuccessStatus('shipment.added.successfully');
                                    this.isAwbDetailsPresent = false;
                                    this.inboundBreakdownFormGroup.get('shipmentType').setValue('AWB');
                                    if (this.loadedthroughNavigation) {
                                        let shipmentData: any = null;
                                        shipmentData = {
                                            flight: this.inboundBreakdownFormGroup.get('flightNumber').value,
                                            entityType: this.inboundBreakdownFormGroup.get('shipmentType').value,
                                            entityKey: this.inboundBreakdownFormGroup.get('awbNumber').value,
                                            shipmentNumber: this.inboundBreakdownFormGroup.get(['awbNumber']).value,
                                            awbNumber: this.inboundBreakdownFormGroup.get(['awbNumber']).value,
                                            flightNumber: this.inboundBreakdownFormGroup.get(['flightNumber']).value,
                                            flightDate: this.inboundBreakdownFormGroup.get(['flightDate']).value,
                                            shipmentType: this.inboundBreakdownFormGroup.get(['shipmentType']).value,
                                            dataSyncSearch: this.dataSyncSearch
                                        };
                                        //this.navigateBack(shipmentData);
                                        this.navigateTo(this.router, '/import/breakdownworkinglist', { 'shipmentData': shipmentData });
                                    }
                                    return;
                                }
                            }
                        });

                    }).catch();
                    return;
                } else {
                    console.log(this.getI18NValue(response.data.messageList[0].code));
                    if (this.showResponseErrorMessages(response)) {
                        return;
                    }
                }
            }
            if (response.data) {
                if (response.data.isShipmentTargetted) {
                    this.showInfoStatus('import.info112');
                }
                response.data = response.data.shipment;
                if (!this.showResponseErrorMessages(response)) {
                    this.showSuccessStatus('shipment.added.successfully');
                    this.isAwbDetailsPresent = false;
                    this.inboundBreakdownFormGroup.get('shipmentType').setValue('AWB');
                    if (this.loadedthroughNavigation) {
                        let shipmentData: any = null;
                        shipmentData = {
                            flight: this.inboundBreakdownFormGroup.get('flightNumber').value,
                            entityType: this.inboundBreakdownFormGroup.get('shipmentType').value,
                            entityKey: this.inboundBreakdownFormGroup.get('awbNumber').value,
                            shipmentNumber: this.inboundBreakdownFormGroup.get(['awbNumber']).value,
                            awbNumber: this.inboundBreakdownFormGroup.get(['awbNumber']).value,
                            flightNumber: this.inboundBreakdownFormGroup.get(['flightNumber']).value,
                            flightDate: this.inboundBreakdownFormGroup.get(['flightDate']).value,
                            shipmentType: this.inboundBreakdownFormGroup.get(['shipmentType']).value,
                            dataSyncSearch: this.dataSyncSearch
                        };
                        //this.navigateBack(shipmentData);
                        this.navigateTo(this.router, '/import/breakdownworkinglist', { 'shipmentData': shipmentData });
                    }
                    this.onSearch();
                    return;
                }
            }
        });
    }

    validateFieldServiceProvider() {
        return this.awbDetailsFormGroup.get("bdstaffGroups").valid
            ? true : false;
    }

    getUlds(val) {
        //console.log('-------------')
        //console.log(val)
        let awbNumber = val.desc;
        let flightNumber = this.inboundBreakdownFormGroup.get('flightNumber').value;
        let flightDate = this.inboundBreakdownFormGroup.get('flightDate').value;
        if (flightNumber != null && flightDate != null) {
            if (awbNumber != undefined && awbNumber != "" && awbNumber != null) {
                this.breakDownUldSourceParameter = this.createSourceParameter(awbNumber, this.FlightId, flightDate);
            }
        }
    }

    getULDTrolleyInfo(awbNumber, flightId) {
        if (awbNumber != undefined && awbNumber != "" && awbNumber != null) {
            this.breakDownUldSourceParameter = this.createSourceParameter(awbNumber, flightId);
            //console.log("BD data is coming");
            //console.log(this.breakDownUldSourceParameter);
        }
    }

    getBDServiceProvider(flightkey, flightDate, flightId) {
        if (flightkey && flightDate && flightId) {
            this.breakDownServiceProvider = this.createSourceParameter(flightkey, this.inboundBreakdownFormGroup.get('flightNumber').value, 'BREAKDOWN', flightId, null, null);
        }
    }



    addCourierTag() {
        let couTag = this.awbDetailsFormGroup.get('ctag').value;
        let courTags = this.awbDetailsFormGroup.get('courierTags').value;
        if (couTag != null && couTag != undefined && couTag != "") {
            courTags.push({ "tagId": couTag });
        }
        this.awbDetailsFormGroup.get('courierTags').patchValue(courTags);
        this.awbDetailsFormGroup.get('ctag').patchValue('');
    }
    saveCourierTag() {
        this.couWindow.close();
    }

    openCourierTagWindow() {
        this.couWindow.open();
    }

    openXpsTagWindow() {
        this.xpsWindow.open();
    }

    onULDChange(val, index) {
        //console.log("this " + val);
        (this.awbDetailsFormGroup.get(["inventory", index, "shc"]) as NgcFormArray).patchValue([]);
        if (val) {
            let uldData = new InboundBreakdownShipmentModel();
            uldData.uldNumber = val.desc;
            uldData.shipmentNumber = this.awbDetailsFormGroup.get('shipmentNumber').value;
            (this.awbDetailsFormGroup.get(["inventory", index, "impArrivalManifestULDId"]) as NgcFormGroup).setValue(val.code);
            (this.awbDetailsFormGroup.get(["inventory", index, "transferType"]) as NgcFormGroup).setValue(val.parameter2);
            (this.awbDetailsFormGroup.get(["inventory", index, "handlingMode"]) as NgcFormGroup).setValue(val.parameter1);
            (this.awbDetailsFormGroup.get(["inventory", index, "warehouseHandlingInstruction"]) as NgcFormGroup).setValue(val.parameter3);
            (this.awbDetailsFormGroup.get(["inventory", index, "uldNumber"]) as NgcFormGroup).setValue(val.desc);
            (this.awbDetailsFormGroup.get(["inventory", index, "manifestPieces"]) as NgcFormGroup).setValue(val.parameter4);
            (this.awbDetailsFormGroup.get(["inventory", index, "manifestWeight"]) as NgcFormGroup).setValue(val.parameter5);
            if (val.parameter6) {
                let tempSHC = val.parameter6.split(',');
                let shcInfo = [];
                for (let index = 0; index < tempSHC.length; index++) {
                    let tempdata = {};
                    tempdata['specialHandlingCode'] = tempSHC[index];
                    shcInfo.push(tempdata);
                }
                (this.awbDetailsFormGroup.get(["inventory", index, "shc"]) as NgcFormArray).patchValue(shcInfo);
            }

        }

        if ((this.awbDetailsFormGroup.get(["inventory", index, "uldNumber"]) as NgcFormGroup).value == null) {
            this.awbDetailsFormGroup.get('handCarry').setValue(true);
        } else {
            this.awbDetailsFormGroup.get('handCarry').setValue(false);

        }

    }

    public createNewRow(event, index) {
        this.isHousingInformationPresent = true;
        if (this.awbDetailsFormGroup.get(["inventory", index])) {
            (<NgcFormArray>this.awbDetailsFormGroup.get(["inventory", index, "house"])).addValue([
                {
                    number: "",
                    pieces: 0,
                }
            ]);
        }
    }

    public createMaintainBDHouse(data, index) {
        if (this.inboundBreakdownFormGroup.get('shipmentType').value == 'MAILAWB'
            || this.inboundBreakdownFormGroup.get('shipmentType').value == 'OBC') {
            this.mailAwbObcFlag = true;
        } else {
            this.mailAwbObcFlag = false;
        }
        this.maintainBreakdownHouseInfoFormGroup.get('houseNum').setValue('');
        this.maintainBreakdownHouseInfoFormGroup.get('breakdownHouseInfo').patchValue([]);
        this.addTagInfoFormGroup.get('breakdownHouseInfo').patchValue([]);
        this.inboundBreakdownStorageInfoId = data.value.inboundBreakdownShipmentId;
        this.shipmentInventoryId = data.value.inventoryId;
        this.shipmentId = data.value.shipmentId;
        this.maintainAddHouseIndex = index;
        this.inventoryPieces = data.value.pieces;
        this.inventoryWeight = data.value.weight;
        let houseModel = new InboundBreakdownShipmentHouseModel();
        houseModel.inboundBreakdownStorageInfoId = this.inboundBreakdownStorageInfoId;
        this.importService.getMaintainHouseBDData(houseModel).subscribe((response) => {
            if (this.showResponseErrorMessages(response)) {
                return;
            }

            if (response.data != null) {
                if (this.mailAwbObcFlag) {
                    this.addTagInfoFormGroup.get('breakdownHouseInfo').patchValue(response.data);
                } else {
                    this.maintainBreakdownHouseInfoFormGroup.get('breakdownHouseInfo').patchValue(response.data);
                }
            }

        })
        if (this.mailAwbObcFlag) {
            this.addTagWindow.open();
        } else {
            this.addMaintainHouseWindow.open();
        }
    }

    maintainHouseSearch() {
        let searchHouseNum = this.maintainBreakdownHouseInfoFormGroup.get('houseNum').value;
        let houseModel = new InboundBreakdownShipmentHouseModel();
        houseModel.inboundBreakdownStorageInfoId = this.inboundBreakdownStorageInfoId;
        houseModel.houseNumber = searchHouseNum;
        this.importService.getMaintainHouseBDData(houseModel).subscribe((response) => {
            if (this.showResponseErrorMessages(response)) {
                return;
            }

            if (response.data != null) {
                this.maintainBreakdownHouseInfoFormGroup.get('breakdownHouseInfo').patchValue(response.data);
            }

        })

    }

    maintainAddNewHouse() {
        (<NgcFormArray>this.maintainBreakdownHouseInfoFormGroup.get('breakdownHouseInfo')).addValue([
            {
                inboundBreakdownStorageInfoId: this.inboundBreakdownStorageInfoId,
                shipmentInventoryId: this.shipmentInventoryId,
                shipmentId: this.shipmentId,
                shipmentHouseId: null,
                type: this.inboundBreakdownFormGroup.get('shipmentType').value,
                houseNumber: null,
                hawbPieces: null,
                hawbWeight: null,
                hawbOrigin: null,
                hawbDestination: null,
                hawbNatureOfGoods: null,
                housePicecWeight: null,
                hawbBDPcs: null,
                hawbBDWt: null,
                hawbRemarks: null,
                flagCRUD: 'C'
            }
        ]);
    }

    addNewTagInfo() {
        (<NgcFormArray>this.addTagInfoFormGroup.get('breakdownHouseInfo')).addValue([
            {
                inboundBreakdownStorageInfoId: this.inboundBreakdownStorageInfoId,
                shipmentInventoryId: this.shipmentInventoryId,
                shipmentId: this.shipmentId,
                shipmentHouseId: null,
                type: this.inboundBreakdownFormGroup.get('shipmentType').value,
                houseNumber: null,
                hawbPieces: null,
                hawbBDPcs: null,
                flagCRUD: 'C'
            }
        ]);
    }

    setHouseInfo(data: any, index: any) {
        if (data.code != null) {
            (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "housePicecWeight"]) as NgcFormControl).setValue(data.param2 + "/" + data.param3);
            (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "shipmentHouseId"]) as NgcFormControl).setValue(Number(data.param1));
            (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbPieces"]) as NgcFormControl).setValue(Number(data.param2));
            (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbPieces"]) as NgcFormGroup).disable();
            (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbWeight"]) as NgcFormControl).setValue(Number(data.param3));
            (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbWeight"]) as NgcFormGroup).disable();
            (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbOrigin"]) as NgcFormControl).setValue(data.param4);
            (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbDestination"]) as NgcFormControl).setValue(data.param5);
            (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbNatureOfGoods"]) as NgcFormControl).setValue(data.param6);
        } else {
            (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbOrigin"]) as NgcFormControl).setValue(this.awbDetailsFormGroup.get('origin').value);
            (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbDestination"]) as NgcFormControl).setValue(this.awbDetailsFormGroup.get('destination').value);
            (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbNatureOfGoods"]) as NgcFormControl).setValue(this.awbDetailsFormGroup.get('natureOfGoodsDescription').value);
        }
    }

    onHouseWayBillPieceChange(event: any, index: any) {
        let hawbLineInfo = this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index]).value;
        hawbLineInfo.hawbBDWt = hawbLineInfo.hawbBDPcs * (hawbLineInfo.hawbWeight / hawbLineInfo.hawbPieces);
        (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index, "hawbBDWt"]) as NgcFormControl).setValue(hawbLineInfo.hawbBDWt)
    }

    saveMaintainHouseInfo(data: any, index: any) {
        let invalid = (<NgcFormArray>this.maintainBreakdownHouseInfoFormGroup.get("breakdownHouseInfo")).invalid;
        if (invalid) {
            this.showErrorMessage("import.please.enter.all.mandatory.fileds");
            return;
        }
        let controlData = (<NgcFormArray>this.maintainBreakdownHouseInfoFormGroup.get("breakdownHouseInfo")).value;
        if (controlData == null || controlData.length == 0) {
            this.showErrorMessage("export.add.atleast.one.record");
            return;
        }
        controlData.forEach(element => {
            element.inboundBreakdownStorageInfoId = this.inboundBreakdownStorageInfoId;
            element.shipmentInventoryId = Number(this.shipmentInventoryId);
            element.shipmentId = Number(this.shipmentId);
            element.shipmentNumber = this.inboundBreakdownFormGroup.get('awbNumber').value;
            element.flightKey = this.inboundBreakdownFormGroup.get('flightNumber').value;
            element.flightOriginDate = this.inboundBreakdownFormGroup.get('flightDate').value;
            element.inventoryPieces = this.inventoryPieces;
            element.inventoryWeight = this.inventoryWeight;

        });
        this.importService.createMaintainHouseBDData(controlData).subscribe((response) => {
            if (this.showResponseErrorMessages(response)) {
                return;
            }
            this.showSuccessStatus('g.completed.successfully');
            this.addMaintainHouseWindow.close();
            this.onSearch();
        })
    }

    saveMaintainTagInfo(data: any, index: any) {
        let invalid = (<NgcFormArray>this.addTagInfoFormGroup.get("breakdownHouseInfo")).invalid;
        if (invalid) {
            this.showErrorMessage("import.please.enter.all.mandatory.fileds");
            return;
        }
        let controlData = (<NgcFormArray>this.addTagInfoFormGroup.get("breakdownHouseInfo")).value;
        if (controlData == null || controlData.length == 0) {
            this.showErrorMessage("export.add.atleast.one.record");
            return;
        }
        controlData.forEach(element => {
            element.inboundBreakdownStorageInfoId = this.inboundBreakdownStorageInfoId;
            element.shipmentInventoryId = Number(this.shipmentInventoryId);
            element.shipmentId = Number(this.shipmentId);
            element.shipmentNumber = this.inboundBreakdownFormGroup.get('awbNumber').value;
            element.flightKey = this.inboundBreakdownFormGroup.get('flightNumber').value;
            element.flightOriginDate = this.inboundBreakdownFormGroup.get('flightDate').value;
            element.inventoryPieces = this.inventoryPieces;
            element.inventoryWeight = this.inventoryWeight;
            element.hawbPieces = element.hawbBDPcs;
            element.hawbWeight = 0;
        });
        this.importService.createMaintainHouseBDData(controlData).subscribe((response) => {
            if (this.showResponseErrorMessages(response)) {
                return;
            }
            this.showSuccessStatus('g.completed.successfully');
            this.addTagWindow.close();
            this.onSearch();
        })
    }

    deleteBDHouse(data: any, index: any) {
        (this.maintainBreakdownHouseInfoFormGroup.get(["breakdownHouseInfo", index]) as NgcFormControl).markAsDeleted();
    }

    deleteTagInfo(data: any, index: any) {
        (this.addTagInfoFormGroup.get(["breakdownHouseInfo", index]) as NgcFormControl).markAsDeleted();
    }


    public deleteInventory(event, index) {
        const inventoryDetails = (<NgcFormArray>this.awbDetailsFormGroup.get('inventory')).getRawValue();

        (<NgcFormGroup>this.awbDetailsFormGroup.get(["inventory", index])).markAsDeleted();

        this.awbDetailsFormGroup.get('totalUtilisedPieces').setValue(this.awbDetailsFormGroup.get('totalUtilisedPieces').value + inventoryDetails[index].pieces);
        this.awbDetailsFormGroup.get('totalUtilisedWeight').setValue(this.awbDetailsFormGroup.get('totalUtilisedWeight').value + inventoryDetails[index].weight);

        this.awbDetailsFormGroup.get('breakDownPieces').setValue(this.awbDetailsFormGroup.get('breakDownPieces').value - inventoryDetails[index].pieces);
        this.awbDetailsFormGroup.get('breakDownWeight').setValue(this.awbDetailsFormGroup.get('breakDownWeight').value - inventoryDetails[index].weight);

    }

    public deletehouse(event, index, subIndex) {
        (this.awbDetailsFormGroup.get(["inventory", index, "house", subIndex, "flagCRUD"]) as NgcFormControl).setValue('C');
        (<NgcFormGroup>this.awbDetailsFormGroup.get(["inventory", index, "house", subIndex])).markAsDeleted();
    }

    public navigateToDamage(): void {
        let url = "/common/capturedamageDesktop";
        let shipmentData: any = null;
        shipmentData = {
            flight: this.inboundBreakdownFormGroup.get('flightNumber').value,
            entityType: this.inboundBreakdownFormGroup.get('shipmentType').value,
            entityKey: this.inboundBreakdownFormGroup.get('awbNumber').value,
            shipmentNumber: this.inboundBreakdownFormGroup.get(['awbNumber']).value,
            awbNumber: this.inboundBreakdownFormGroup.get(['awbNumber']).value,
            flightNumber: this.inboundBreakdownFormGroup.get(['flightNumber']).value,
            flightDate: this.inboundBreakdownFormGroup.get(['flightDate']).value,
            shipmentType: this.inboundBreakdownFormGroup.get(['shipmentType']).value
        };
        this.navigateTo(this.router, url, shipmentData);
    }

    public navigateToUploadPhoto(): void {
        let url = "/common/capturephoto";
        let shipmentData: any = null;
        shipmentData = {
            entityType: this.inboundBreakdownFormGroup.get('shipmentType').value,
            entityKey: this.inboundBreakdownFormGroup.get('awbNumber').value,
            entityKey2: this.inboundBreakdownFormGroup.get(['hawbNumbers']).value,
            associatedTo: "Shipment",
            stage: "Break_Down"
        };
        this.navigateTo(this.router, url, shipmentData);
    }

    public navigateToServiceProvider(): void {
        let url = "/import/maintainserviceprovider";
        this.navigateTo(this.router, url, null);
    }

    public onShipmentNumberChange(event): void {
        this.retrieveDropDownListRecords("INBOUND_AWBNUMBERKEY", "query", this.breakDownAwbSourceParameter).subscribe(data => {
            console.log(data);

            for (let index = 0; index < data.length; index++) {
                if (event == data[index].desc) {
                    this.inboundBreakdownFormGroup.get('shipmentType').setValue(data[index].parameter3);
                }
            }

        });

    }
    onPieceChangeRevised(rowIndex) {
        // For Total Pieces count weight Count
        let totalInventoryPieces = 0;
        let totalInventoryWeight = 0;
        let totalInventoryPiecesNotIndex = 0;
        let totalInventoryWeightNotIndex = 0;
        let totalChargeableWeightNotIndex = 0;
        // For Total Pieces count weight Count as per ULD
        let piecesCountForUld = 0;
        let weightCountForUld = 0;
        let piecesCountForUldNotIndex = 0;
        let weightCountForUldNotIndex = 0;
        let remainingPieceWithoutCalculation = 0;
        let remainingWeightWithoutCalculation = 0;
        let remainingAwbPieceWithoutCalculation = 0;
        let remainingAwbWeightWithoutCalculation = 0;
        let remainingManifestPieceWithoutCalculation = 0;
        let remainingManifestWeightWithoutCalculation = 0;
        let remainingAwbChargeableWeightWithoutCalculation = 0;
        let remainingHawbChargeableWeightWithoutCalculation = 0;
        let awbPieces = this.awbDetailsFormGroup.get('piece').value;
        let awbWeight = this.awbDetailsFormGroup.get('weight').value;
        let manifestPieces = this.awbDetailsFormGroup.get('manifestPieces').value;
        let manifestWeight = this.awbDetailsFormGroup.get('manifestWeight').value;
        let hawbPieces = this.awbDetailsFormGroup.get('hawbPieces').value;
        let hawbWeight = this.awbDetailsFormGroup.get('hawbWeight').value;
        let awbChargeableWeight = this.awbDetailsFormGroup.get('awbChargeableWeight').value;
        let hawbChargebleWeight = this.awbDetailsFormGroup.get('hawbChargebleWeight').value;
        let rowManifestedPieces = this.awbDetailsFormGroup.get(['inventory', rowIndex, 'manifestPieces']).value;
        let rowManifestedWeight = this.awbDetailsFormGroup.get(['inventory', rowIndex, 'manifestWeight']).value;
        remainingManifestPieceWithoutCalculation = this.awbDetailsFormGroup.get(['inventory', rowIndex, 'manifestPieces']).value;
        remainingManifestWeightWithoutCalculation = this.awbDetailsFormGroup.get(['inventory', rowIndex, 'manifestWeight']).value;
        remainingAwbChargeableWeightWithoutCalculation = this.awbDetailsFormGroup.get('awbChargeableWeight').value;
        let totalBreakDownPieces = this.awbDetailsFormGroup.get('breakDownPieces').value;
        let totalBreakDownWeight = this.awbDetailsFormGroup.get('breakDownWeight').value;
        // If pieces for uldNumber is greater than Pieces
        let inventoryDetails = (<NgcFormArray>this.awbDetailsFormGroup.get('inventory')).getRawValue();
        let manifestedWeightCount = inventoryDetails[rowIndex].manifestWeight;
        for (let index = 0; index < inventoryDetails.length; index++) {
            totalInventoryPieces = totalInventoryPieces + inventoryDetails[index].pieces;
            totalInventoryWeight = totalInventoryWeight + inventoryDetails[index].weight;
            if (index !== rowIndex) {
                totalInventoryPiecesNotIndex = totalInventoryPiecesNotIndex + inventoryDetails[index].pieces;
                totalInventoryWeightNotIndex = totalInventoryWeightNotIndex + inventoryDetails[index].weight;
                totalChargeableWeightNotIndex = totalChargeableWeightNotIndex + inventoryDetails[index].chargeableWeight;
            }
            if (inventoryDetails[index].uldNumber === inventoryDetails[rowIndex].uldNumber) {
                piecesCountForUld = piecesCountForUld + inventoryDetails[index].pieces;
                weightCountForUld = weightCountForUld + inventoryDetails[index].weight;
                if (index !== rowIndex) {
                    piecesCountForUldNotIndex = piecesCountForUldNotIndex + inventoryDetails[index].pieces;
                    weightCountForUldNotIndex = weightCountForUldNotIndex + inventoryDetails[index].weight;
                    remainingAwbPieceWithoutCalculation = awbWeight - inventoryDetails[index].pieces;
                    remainingAwbWeightWithoutCalculation = awbWeight - inventoryDetails[index].weight;
                    remainingPieceWithoutCalculation = manifestPieces - inventoryDetails[index].pieces;
                    remainingWeightWithoutCalculation = manifestWeight - inventoryDetails[index].weight;
                    remainingManifestPieceWithoutCalculation = remainingManifestPieceWithoutCalculation - inventoryDetails[index].pieces;
                    remainingManifestWeightWithoutCalculation = remainingManifestWeightWithoutCalculation - inventoryDetails[index].weight;
                    remainingAwbChargeableWeightWithoutCalculation = remainingAwbChargeableWeightWithoutCalculation - inventoryDetails[index].chargeableWeight;
                    remainingHawbChargeableWeightWithoutCalculation = remainingHawbChargeableWeightWithoutCalculation - inventoryDetails[index].chargeableWeight;
                }
            }
        }
        const requestToCalculated = {
            isUld: true,
            rowIndex: rowIndex,
            awbWeight: awbWeight,
            awbPieces: awbPieces,
            manifestPieces: manifestPieces,
            manifestWeight: manifestWeight,
            hawbPieces: hawbPieces,
            hawbWeight: hawbWeight,
            awbChargeableWeight: awbChargeableWeight,
            hawbChargebleWeight: hawbChargebleWeight,
            totalBreakDownPieces: totalBreakDownPieces,
            totalBreakDownWeight: totalBreakDownWeight,
            inventoryDetails: inventoryDetails,
            piecesCountForUld: piecesCountForUld,
            weightCountForUld: weightCountForUld,
            rowManifestedPieces: rowManifestedPieces,
            rowManifestedWeight: rowManifestedWeight,
            totalInventoryPieces: totalInventoryPieces,
            totalInventoryWeight: totalInventoryWeight,
            manifestedWeightCount: manifestedWeightCount,
            piecesCountForUldNotIndex: piecesCountForUldNotIndex,
            weightCountForUldNotIndex: weightCountForUldNotIndex,
            totalInventoryPiecesNotIndex: totalInventoryPiecesNotIndex,
            totalInventoryWeightNotIndex: totalInventoryWeightNotIndex,
            totalChargeableWeightNotIndex: totalChargeableWeightNotIndex,
            remainingPieceWithoutCalculation: remainingPieceWithoutCalculation,
            remainingWeightWithoutCalculation: remainingWeightWithoutCalculation,
            remainingAwbPieceWithoutCalculation: remainingAwbPieceWithoutCalculation,
            remainingManifestPieceWithoutCalculation: remainingManifestPieceWithoutCalculation,
            remainingManifestWeightWithoutCalculation: remainingManifestWeightWithoutCalculation,
            remainingAwbChargeableWeightWithoutCalculation: remainingAwbChargeableWeightWithoutCalculation,
            remainingHawbChargeableWeightWithoutCalculation: remainingHawbChargeableWeightWithoutCalculation
        }
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling) && this.handledByMasterHouse) {
            //calculation based on HAWB Pieces and weight
            this.calculateHawbHandling(requestToCalculated);
        } else {
            //Added check of uldNumber as BULK
            if ((piecesCountForUld > inventoryDetails[rowIndex].manifestPieces) && (inventoryDetails[rowIndex].uldNumber)) {
                this.showConfirmMessage("pieces.greater.than.mainfested.peices").then(fulfilled => {
                    // Break
                    this.calculateMasterHandling(requestToCalculated);
                }).catch(reason => {
                    // Do nothing;
                });
            } else {
                this.calculateMasterHandling(requestToCalculated);
            }
        }
    }

    calculateMasterHandling(event) {
        console.log(event)
        let totalUtilisedPiecesCalculated = 0;
        let totalUtilisedWeightCalculated = 0;
        let weightManifestedAfterCalculation = 0;
        if (event.inventoryDetails && event.awbPieces && event.awbPieces > 0) {
            // Added to know the actual weight when records are already available.
            if (this.checkForExistingInventoryRowData(event)) {
                if (event.manifestWeight != 0) {
                    // =============================== //

                    event.inventoryDetails[event.rowIndex].weight = (event.inventoryDetails[event.rowIndex].pieces * (event.inventoryDetails[event.rowIndex].manifestWeight / event.inventoryDetails[event.rowIndex].manifestPieces));
                    //chargeable weight calculation
                    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
                        if (event.awbPieces > event.inventoryDetails[event.rowIndex].manifestPieces) {
                            event.inventoryDetails[event.rowIndex].chargeableWeight = (event.inventoryDetails[event.rowIndex].pieces * (event.awbChargeableWeight / event.awbPieces));
                        } else {
                            event.inventoryDetails[event.rowIndex].chargeableWeight = (event.inventoryDetails[event.rowIndex].pieces * (event.awbChargeableWeight / event.inventoryDetails[event.rowIndex].manifestPieces));
                        }
                    }
                    weightManifestedAfterCalculation = event.inventoryDetails[event.rowIndex].weight + event.weightCountForUldNotIndex;
                    //if only one invnetory line item setting rowIndex pieces to remaing piece weight
                    if (event.inventoryDetails.length == 1) {
                        if (event.totalInventoryPieces >= event.manifestPieces) {
                            event.inventoryDetails[event.rowIndex].weight = event.manifestWeight;
                            if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
                                if (event.awbPieces > event.inventoryDetails[event.rowIndex].manifestPieces) {
                                    event.inventoryDetails[event.rowIndex].chargeableWeight = (event.inventoryDetails[event.rowIndex].pieces * (event.awbChargeableWeight / event.awbPieces));
                                } else {
                                    event.inventoryDetails[event.rowIndex].chargeableWeight = event.awbChargeableWeight;
                                }
                            }
                        } else if (event.piecesCountForUld >= event.rowManifestedPieces) {
                            event.inventoryDetails[event.rowIndex].weight = event.rowManifestedWeight;
                        }
                    } else if (event.inventoryDetails.length > 1) {
                        if (event.totalInventoryPieces >= event.manifestPieces) {
                            event.inventoryDetails[event.rowIndex].weight = event.manifestWeight - event.totalInventoryWeightNotIndex;
                        } else if (event.piecesCountForUld >= event.rowManifestedPieces) {
                            event.inventoryDetails[event.rowIndex].weight = event.rowManifestedWeight - event.weightCountForUldNotIndex;
                        } else {
                            if (event.remainingManifestWeightWithoutCalculation > 0) {
                                event.inventoryDetails[event.rowIndex].weight = (event.inventoryDetails[event.rowIndex].pieces * (event.remainingManifestWeightWithoutCalculation / event.remainingManifestPieceWithoutCalculation));
                                if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
                                    event.inventoryDetails[event.rowIndex].chargeableWeight = (event.inventoryDetails[event.rowIndex].pieces * (event.remainingAwbChargeableWeightWithoutCalculation / event.remainingManifestPieceWithoutCalculation));
                                }
                            }
                        }
                    }
                    this.awbDetailsFormGroup.get(['inventory', event.rowIndex, 'weight']).setValue(Number(NgcUtility.getDisplayWeight(event.inventoryDetails[event.rowIndex].weight)));
                    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
                        this.awbDetailsFormGroup.get(['inventory', event.rowIndex, 'chargeableWeight']).setValue(Number(event.inventoryDetails[event.rowIndex].chargeableWeight).toFixed(2));
                    }


                } else {
                    // ==== will add check if pieces are greater and awb is available but not manifested
                    // if no manifest calcuate based in AWB level  
                    // event.inventoryDetails[event.rowIndex].weight = (event.inventoryDetails[event.rowIndex].pieces * (event.awbWeight / event.awbPieces));
                    event.inventoryDetails[event.rowIndex].weight = 0.0;
                    this.awbDetailsFormGroup.get(['inventory', event.rowIndex, 'weight']).setValue(Number(NgcUtility.getDisplayWeight(event.inventoryDetails[event.rowIndex].weight)));
                    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
                        event.inventoryDetails[event.rowIndex].chargeableWeight = 0.0;
                        this.awbDetailsFormGroup.get(['inventory', event.rowIndex, 'chargeableWeight']).setValue(Number(event.inventoryDetails[event.rowIndex].chargeableWeight).toFixed(2));
                    }
                }
            }
        }
        this.awbDetailsFormGroup.get('breakDownPieces').setValue(event.totalInventoryPieces);
        this.awbDetailsFormGroup.get('breakDownWeight').setValue(event.totalInventoryWeightNotIndex + event.inventoryDetails[event.rowIndex].weight);
        if (event.manifestPieces) {
            if ((event.manifestPieces - event.totalInventoryPieces) < 0) {
                this.awbDetailsFormGroup.get('totalUtilisedPieces').setValue(0);
            } else {
                this.awbDetailsFormGroup.get('totalUtilisedPieces').setValue(event.manifestPieces - event.totalInventoryPieces);
            }
            if ((event.manifestWeight - (event.totalInventoryWeightNotIndex + event.inventoryDetails[event.rowIndex].weight)) < 0) {
                this.awbDetailsFormGroup.get('totalUtilisedWeight').setValue(0.0);
            } else {
                this.awbDetailsFormGroup.get('totalUtilisedWeight').setValue(event.manifestWeight - (event.totalInventoryWeightNotIndex + event.inventoryDetails[event.rowIndex].weight));
            }
        } else if (event.awbPieces) {
            if ((event.awbPieces - event.totalInventoryPieces) < 0) {
                this.awbDetailsFormGroup.get('totalUtilisedPieces').setValue(0);
            } else {
                this.awbDetailsFormGroup.get('totalUtilisedPieces').setValue(event.awbPieces - event.totalInventoryPieces);
            }
            if ((event.awbWeight - (event.totalInventoryWeightNotIndex + event.inventoryDetails[event.rowIndex].weight)) < 0) {
                this.awbDetailsFormGroup.get('totalUtilisedWeight').setValue(0.0);
            } else {
                this.awbDetailsFormGroup.get('totalUtilisedWeight').setValue(event.awbWeight - (event.totalInventoryWeightNotIndex + event.inventoryDetails[event.rowIndex].weight));
            }
        } else {
            this.awbDetailsFormGroup.get('totalUtilisedPieces').setValue(0);
            this.awbDetailsFormGroup.get('totalUtilisedWeight').setValue(0.0);

        }
    }

    calculateHawbHandling(event) {
        console.log(event)
        let totalUtilisedPiecesCalculated = 0;
        let totalUtilisedWeightCalculated = 0;
        let weightManifestedAfterCalculation = 0;
        if (event.inventoryDetails && event.awbPieces && event.awbPieces > 0) {
            // Added to know the actual weight when records are already available.
            if (this.checkForExistingInventoryRowData(event)) {
                if (event.hawbWeight != null && event.hawbWeight != 0) {
                    // =============================== //
                    event.inventoryDetails[event.rowIndex].weight = (event.inventoryDetails[event.rowIndex].pieces * (event.hawbWeight / event.hawbPieces));
                    //chargeable weight calcluation
                    event.inventoryDetails[event.rowIndex].chargeableWeight = (event.inventoryDetails[event.rowIndex].pieces * (event.hawbChargebleWeight / event.hawbPieces));
                    weightManifestedAfterCalculation = event.inventoryDetails[event.rowIndex].weight + event.weightCountForUldNotIndex;
                    //if only one invnetory line item setting rowIndex pieces to remaing piece weight
                    if (event.inventoryDetails.length == 1) {
                        if (event.totalInventoryPieces >= event.hawbPieces) {
                            event.inventoryDetails[event.rowIndex].weight = event.hawbWeight;

                            //chargeable weight
                            event.inventoryDetails[event.rowIndex].chargeableWeight = event.hawbChargebleWeight;
                        }
                    } else if (event.inventoryDetails.length > 1) {
                        if (event.totalInventoryPieces >= event.hawbPieces) {
                            event.inventoryDetails[event.rowIndex].weight = event.hawbWeight - event.totalInventoryWeightNotIndex;

                            //chargeable weight
                            event.inventoryDetails[event.rowIndex].chargeableWeight = event.hawbChargebleWeight - event.totalChargeableWeightNotIndex;
                        }
                    }
                    this.awbDetailsFormGroup.get(['inventory', event.rowIndex, 'weight']).setValue(Number(NgcUtility.getDisplayWeight(event.inventoryDetails[event.rowIndex].weight)));
                    this.awbDetailsFormGroup.get(['inventory', event.rowIndex, 'chargeableWeight']).setValue(Number(event.inventoryDetails[event.rowIndex].chargeableWeight).toFixed(2));


                } else if (event.awbPieces > 0) {
                    // =============================== //
                    event.inventoryDetails[event.rowIndex].weight = (event.inventoryDetails[event.rowIndex].pieces * (event.awbWeight / event.awbPieces));
                    //chargeable weight calcluation
                    event.inventoryDetails[event.rowIndex].chargeableWeight = (event.inventoryDetails[event.rowIndex].pieces * (event.awbChargebleWeight / event.awbPieces));
                    weightManifestedAfterCalculation = event.inventoryDetails[event.rowIndex].weight + event.weightCountForUldNotIndex;
                    //if only one invnetory line item setting rowIndex pieces to remaing piece weight
                    if (event.inventoryDetails.length == 1) {
                        if (event.totalInventoryPieces >= event.awbPieces) {
                            event.inventoryDetails[event.rowIndex].weight = event.awbWeight;

                            //chargeable weight
                            event.inventoryDetails[event.rowIndex].chargeableWeight = event.awbChargebleWeight;
                        }
                    } else if (event.inventoryDetails.length > 1) {
                        if (event.totalInventoryPieces >= event.awbPieces) {
                            event.inventoryDetails[event.rowIndex].weight = event.awbWeight - event.totalInventoryWeightNotIndex;

                            //chargeable weight
                            event.inventoryDetails[event.rowIndex].chargeableWeight = event.awbChargebleWeight - event.totalChargeableWeightNotIndex;
                        }
                    }

                    this.awbDetailsFormGroup.get(['inventory', event.rowIndex, 'weight']).setValue(Number(NgcUtility.getDisplayWeight(event.inventoryDetails[event.rowIndex].weight)));
                    this.awbDetailsFormGroup.get(['inventory', event.rowIndex, 'chargeableWeight']).setValue(Number(event.inventoryDetails[event.rowIndex].chargeableWeight).toFixed(2));

                } else {
                    event.inventoryDetails[event.rowIndex].weight = 0.0;
                    event.inventoryDetails[event.rowIndex].chargeableWeight = 0.0;
                    this.awbDetailsFormGroup.get(['inventory', event.rowIndex, 'weight']).setValue(Number(NgcUtility.getDisplayWeight(event.inventoryDetails[event.rowIndex].weight)));
                    this.awbDetailsFormGroup.get(['inventory', event.rowIndex, 'chargeableWeight']).setValue(Number(event.inventoryDetails[event.rowIndex].chargeableWeight).toFixed(2));
                }
            }
        }
        event.totalBreakDownPieces += event.inventoryDetails[event.rowIndex].pieces;
        event.totalBreakDownWeight += event.inventoryDetails[event.rowIndex].weight;
        this.awbDetailsFormGroup.get('breakDownPieces').setValue(event.totalBreakDownPieces);
        this.awbDetailsFormGroup.get('breakDownWeight').setValue(event.totalBreakDownWeight);
        if (event.awbPieces) {
            // event.totalBreakDownPieces += event.totalInventoryPieces;
            if ((event.awbPieces - event.totalBreakDownPieces) < 0) {
                this.awbDetailsFormGroup.get('totalUtilisedPieces').setValue(0);
            } else {
                this.awbDetailsFormGroup.get('totalUtilisedPieces').setValue(event.awbPieces - event.totalBreakDownPieces);
            }
            if ((event.awbWeight - (event.totalInventoryWeightNotIndex + event.totalBreakDownWeight)) < 0) {
                this.awbDetailsFormGroup.get('totalUtilisedWeight').setValue(0.0);
            } else {
                this.awbDetailsFormGroup.get('totalUtilisedWeight').setValue(event.awbWeight - event.totalBreakDownWeight);
            }
        } else {
            this.awbDetailsFormGroup.get('totalUtilisedPieces').setValue(0);
            this.awbDetailsFormGroup.get('totalUtilisedWeight').setValue(0.0);

        }
    }


    private checkForExistingInventoryRowData(event: any) {
        return (event.inventoryDetails[event.rowIndex].deliveryOrderNo == null || event.inventoryDetails[event.rowIndex].deliveryOrderNo == 0) &&
            (event.inventoryDetails[event.rowIndex].deliveryRequestOrderNo == null || event.inventoryDetails[event.rowIndex].deliveryRequestOrderNo == 0)
            && event.inventoryDetails[event.rowIndex].assignedUldTrolley == null && (event.inventoryDetails[event.rowIndex].throughTransit == null ||
                !event.inventoryDetails[event.rowIndex].throughTransit) && (event.inventoryDetails[event.rowIndex].loaded == null || !event.inventoryDetails[event.rowIndex].loaded || event.inventoryDetails[event.rowIndex].loaded == 0);
    }


    calculate(inventoryDetails, isPieces, rowIndex, weightCountForManifest, totalCount) {
        let remainingawbPcs = 0;
        let remainingawbWgt = 0;
        // Actual Weight count for knowing remaining weight
        let remainingPieceWithoutCalculation = 0;
        let remainingAwbPieceWithoutCalculation = 0;
        this.totalPieceCount = 0;
        this.perPieceBreakdownWeight = 0;
        let manifestedWeightCount = inventoryDetails[rowIndex].manifestWeight;
        let awbPieces = this.awbDetailsFormGroup.get('piece').value;
        let awbWeight = this.awbDetailsFormGroup.get('weight').value;
        let manifestPieces = this.awbDetailsFormGroup.get('manifestPieces').value
        let manifestWeight = this.awbDetailsFormGroup.get('manifestWeight').value;
        if (inventoryDetails && awbPieces != null && awbPieces > 0) {
            for (let index = 0; index < inventoryDetails.length; index++) {
                this.totalPieceCount += inventoryDetails[index].pieces;
                // Added to know the actual weight when records are already available.
                if (rowIndex !== index) {
                    remainingPieceWithoutCalculation = manifestWeight - inventoryDetails[index].weight;
                    remainingAwbPieceWithoutCalculation = awbWeight - inventoryDetails[index].weight;
                }
                // When sum of inventory Pieces are equals to or greater than Manifested pieces
                if (rowIndex == index && (this.totalPieceCount > manifestPieces)) {
                    this.awbDetailsFormGroup.get(['inventory', index, 'weight']).setValue(Number(NgcUtility.getDisplayWeight(remainingAwbPieceWithoutCalculation)));
                    remainingawbPcs = 0;
                } else if (inventoryDetails[index].deliveryOrderNo == null && inventoryDetails[index].deliveryRequestOrderNo == null
                    && inventoryDetails[index].assignedUldTrolley == null && (inventoryDetails[index].throughTransit == null ||
                        !inventoryDetails[index].throughTransit) && (inventoryDetails[index].loaded == null || !inventoryDetails[index].loaded)) {
                    //if Manifest Exist caculate invetory weight based on Manifest.       
                    if (manifestWeight != 0) {
                        inventoryDetails[index].weight = (inventoryDetails[index].pieces * (inventoryDetails[index].manifestWeight / inventoryDetails[index].manifestPieces));
                        this.perPieceBreakdownWeight += inventoryDetails[index].weight;
                        remainingawbPcs = manifestPieces - this.totalPieceCount;
                        //if only one invnetory line item setting manifest pieces to remaing piece weight
                        if (inventoryDetails.length == 1 && (manifestPieces == this.totalPieceCount)) {
                            remainingawbWgt = manifestWeight;
                        } else if (inventoryDetails.length > 1 && (manifestPieces == this.totalPieceCount)) {
                            remainingawbWgt = remainingPieceWithoutCalculation;
                        }
                        // Calculation As per ULD Starts Here
                        if (isPieces && totalCount !== 0) {
                            if (totalCount === 1) {
                                inventoryDetails[index].weight = manifestedWeightCount;
                            } else {
                                if (weightCountForManifest >= manifestedWeightCount) {
                                    // Do Nothing
                                } else {
                                    if ((inventoryDetails[index].uldNumber === inventoryDetails[rowIndex].uldNumber)) {
                                        if (manifestedWeightCount > inventoryDetails[index].weight) {
                                            manifestedWeightCount = manifestedWeightCount - inventoryDetails[index].weight;
                                            if (manifestedWeightCount === 0) {
                                                totalCount = 0;
                                            }
                                        } else {
                                            totalCount = 0;
                                        }
                                        if (index === rowIndex)
                                            inventoryDetails[index].weight = manifestedWeightCount;
                                    }
                                }
                            }
                        }
                        // when more than 1 record
                        if ((manifestPieces === this.totalPieceCount)) {
                            //for Weight apportinating (2 pieces /237.5 w) it gives apportinate weight when diveded by 2 pieces
                            if (this.perPieceBreakdownWeight != manifestWeight) {
                                if (remainingawbWgt > 0) {
                                    inventoryDetails[index].weight = Number(remainingawbWgt);
                                }
                            }
                        }
                        this.awbDetailsFormGroup.get(['inventory', index, 'weight']).setValue(Number(NgcUtility.getDisplayWeight(inventoryDetails[index].weight)));
                        if (inventoryDetails.length > 1) {
                            remainingawbWgt = manifestWeight - this.perPieceBreakdownWeight;
                        }
                    } else {
                        // if no manifest calcuate based in AWB level  
                        inventoryDetails[index].weight = (inventoryDetails[index].pieces * (awbWeight / awbPieces));
                        this.perPieceBreakdownWeight += inventoryDetails[index].weight;
                        remainingawbPcs = awbPieces - this.totalPieceCount;
                        if (inventoryDetails.length == 1 && (awbPieces == this.totalPieceCount)) {
                            remainingawbWgt = awbWeight;
                        } else {
                            remainingawbWgt = awbWeight - this.perPieceBreakdownWeight;
                        }
                        this.awbDetailsFormGroup.get(['inventory', index, 'weight']).setValue(Number(NgcUtility.getDisplayWeight(inventoryDetails[index].weight)));
                    }
                }
            }
            if (remainingawbPcs >= 0) {
                this.awbDetailsFormGroup.get('totalUtilisedPieces').setValue(remainingawbPcs);
            } else {
                // added if FDCA Case won't show negitive values
                this.awbDetailsFormGroup.get('totalUtilisedPieces').setValue(0);
            }
            this.awbDetailsFormGroup.get('breakDownPieces').setValue(this.totalPieceCount);
        }
    }

    public onPieceChange(rowIndex): void {
        // For Pieces count weightCount
        let piecesCount = 0;
        let totalCount = 11;
        let weightCountForManifest = 0;
        // If pieces for uldNumber is greater than Pieces
        const inventoryDetails = (<NgcFormArray>this.awbDetailsFormGroup.get('inventory')).getRawValue();
        if (inventoryDetails[rowIndex].impArrivalManifestULDId) {
            for (let index = 0; index < inventoryDetails.length; index++) {
                if (inventoryDetails[index].uldNumber === inventoryDetails[rowIndex].uldNumber) {
                    totalCount = totalCount + 1;
                    piecesCount = piecesCount + inventoryDetails[index].pieces;
                    if (index !== rowIndex) {
                        weightCountForManifest = weightCountForManifest + inventoryDetails[index].weight;
                    }
                }
            }
        }
        /* Added check of uldNumber as BULK
         */
        if ((piecesCount > inventoryDetails[rowIndex].manifestPieces) && (inventoryDetails[rowIndex].uldNumber !== 'Bulk') && (inventoryDetails[rowIndex].uldNumber)) {
            this.showConfirmMessage("pieces.greater.than.mainfested.peices").then(fulfilled => {
                // Break
                this.calculate(inventoryDetails, true, rowIndex, weightCountForManifest, totalCount);
            }).catch(reason => {
                // Do nothing;
            });
        } else {
            this.calculate(inventoryDetails, false, rowIndex, weightCountForManifest, totalCount);
        }
    }

    public onWeightChange() {
        this.perPieceBreakdownWeight = 0.0;
        let remainingawbWgt = 0;
        let awbWeight = this.awbDetailsFormGroup.get('weight').value;
        let manifestWeight = this.awbDetailsFormGroup.get('manifestWeight').value;
        const inventoryDetails = (<NgcFormArray>this.awbDetailsFormGroup.get('inventory')).getRawValue();
        inventoryDetails.forEach(element => {
            this.perPieceBreakdownWeight += Number(element.weight);
            if (manifestWeight != 0) {
                remainingawbWgt = manifestWeight - Number(this.perPieceBreakdownWeight);
            } else {
                remainingawbWgt = awbWeight - Number(this.perPieceBreakdownWeight);
            }
        });
        if (!NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
            if (remainingawbWgt >= 0) {
                this.awbDetailsFormGroup.get('totalUtilisedWeight').setValue(remainingawbWgt);
            } else {
                // added if FDCA Case won't show negitive values
                this.awbDetailsFormGroup.get('totalUtilisedWeight').setValue(0.0);
            }
            this.awbDetailsFormGroup.get('breakDownWeight').setValue(Number(this.perPieceBreakdownWeight));
        }

    }

    public navigateToWorkingList(): void {
        let url = "/import/breakdownworkinglist";
        let shipmentData: any = null;
        shipmentData = {
            flightNumber: this.inboundBreakdownFormGroup.get('flightNumber').value,
            flightDate: this.inboundBreakdownFormGroup.get('flightDate').value,
            shipmentNumber: this.inboundBreakdownFormGroup.get(['awbNumber']).value,
            awbNumber: this.inboundBreakdownFormGroup.get(['awbNumber']).value,
            shipmentType: this.inboundBreakdownFormGroup.get(['shipmentType']).value
        };
        this.navigateTo(this.router, url, { 'shipmentData': shipmentData });
    }

    public onPieceInput(pieceValue, index): void {
        if (pieceValue) {
            (this.awbDetailsFormGroup.get(["inventory", index, "pieces"]) as NgcFormGroup).setValue(pieceValue);
        }
    }
    shipmentFunction(task) {
        let shipmentData, url;
        shipmentData = {
            shipmentNumber: this.inboundBreakdownFormGroup.get(['awbNumber']).value,
            awbNumber: this.inboundBreakdownFormGroup.get(['awbNumber']).value,
            flightNumber: this.inboundBreakdownFormGroup.get(['flightNumber']).value,
            flightDate: this.inboundBreakdownFormGroup.get(['flightDate']).value,
            shipmentType: this.inboundBreakdownFormGroup.get(['shipmentType']).value
        };
        switch (task) {
            case "REMARK":
                url = "/awbmgmt/maintainremarks";
                break;
            case "IRREGULARITY":
                url = "/awbmgmt/irregularity";
                break;
        }
        this.navigateTo(this.router, url, shipmentData);
    }

    onLocationChange(data, index) {
        this.sectorId = data.parameter2;
        this.awbDetailsFormGroup.get(['inventory', index, 'sector']).setValue(data.parameter2);
    }

    autoSearchAccessoryInfo($event) {
        this.accessoryPopUp.close();
        this.onSearch();
    }

    closeWindow() {
        this.accessoryPopUp.close();
    }

    openAddAccessory(lineItem, index) {
        this.inputData = {
            flightKey: this.inboundBreakdownFormGroup.get('flightNumber').value,
            flightDate: this.inboundBreakdownFormGroup.get(['flightDate']).value,
            uldNumber: lineItem.value.uldNumber,
            modeType: 'IMPORT'
        };
        this.accessoryPopUp.open();
    }

}