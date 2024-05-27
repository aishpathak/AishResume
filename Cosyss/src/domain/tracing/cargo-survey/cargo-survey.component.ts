import { Component, NgZone, OnInit, ElementRef, ViewContainerRef, ViewChild, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    NgcFormGroup, NgcFormControl, PageConfiguration, NgcPage,
    NgcFormArray, NgcWindowComponent, NgcDropDownListComponent, NgcUtility
} from 'ngc-framework';
import { TracingService } from '../tracing.service';
import { GeneratedCargoSurvey, Shipment, CargoSurvey, RefOfSurveyFor, Email, PackingDetails, PackingConditions, ConductSurveyReceiptInfo } from '../tracing.shared';
import { ArrayType } from '@angular/compiler/src/output/output_ast';
import { element } from 'protractor';
import { DuplicatenamepopupComponent } from '../../common/duplicatenamepopup/duplicatenamepopup.component';

@Component({
    selector: 'app-cargo-survey',
    providers: [TracingService],
    templateUrl: './cargo-survey.component.html',
    styleUrls: ['./cargo-survey.component.scss']
})
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true
})

export class CargoSurveyComponent extends NgcPage {
    @ViewChild('duplicateNamePopup') duplicateNamePopup: DuplicatenamepopupComponent;
    request: { receivingPartyIdentificationNumber: any; customerId: any; };
    savePopUpData: boolean = false;
    private forwardedSearchBy: any = null;
    private searchConsignee: any;
    private searchSurveyBy: any;
    @ViewChild('packingDetails')
    private packingDetails: NgcWindowComponent;

    @ViewChild('reportWindowFrame')
    private reportWindowFrame: ElementRef;
    @ViewChild('reportWindow')
    private reportWindow;

    @ViewChild('sendReport')
    private sendReportTo: NgcWindowComponent;

    @ViewChild('itemNameDropDown')
    private itemNameDropDown: NgcDropDownListComponent;
    private itemNameList = [];
    private lineindex: Number;
    private itemNameListHashMap = [];
    private checkReference: boolean = false;
    private buttonValue: string = "cargoSurvey.cancelSurvey";
    private disableOnFinalize: boolean = true;
    private disableBtn: boolean = false;
    private next: boolean = true;
    private labelValueNumber: string = ""
    private labelValuePieces: string = "";
    private labelValueWeight: string = "";
    private isValidating: boolean = false;
    private disableSave: boolean = false;
    private selectedAccordion: boolean = false;
    private checkUpdateStatus: boolean = false;
    private reportParam: any = {};
    private modelOpenFlag: boolean = false;
    arr = new Array();
    isSignature: boolean = false;
    showRemarks: boolean = false;



    //
    //
    iscreatenew: boolean = false;
    disableunfinafinalize: boolean = false;
    private refSurvey = new NgcFormGroup({
        referenceId: new NgcFormControl(),
        surveyForName: new NgcFormControl(""),
        noOfPieces: new NgcFormControl('', [Validators.required, Validators.min(1)]),
        refWeight: new NgcFormControl('', [Validators.required, Validators.min(0.1)]),
        hawb: new NgcFormGroup({
            weight: new NgcFormControl(),
            pieces: new NgcFormControl(),
            hawbNumber: new NgcFormControl('', Validators.maxLength(12)),
        }),
        impFlight: new NgcFormGroup({
            flightKey: new NgcFormControl(''),
            boardingPoint: new NgcFormControl('', Validators.maxLength(3)),
            offPoint: new NgcFormControl('', Validators.maxLength(3)),
            flightOriginDate: new NgcFormControl('')
        }),
        date: new NgcFormControl(''),
        originStation: new NgcFormControl(''),
        destinationStation: new NgcFormControl('')
    });
    private surveyDetails: NgcFormGroup = new NgcFormGroup({
        pieces: new NgcFormControl('', Validators.required),
        weight: new NgcFormControl('', Validators.required),
        diffPieces: new NgcFormControl('', Validators.required),
        diffWeight: new NgcFormControl(''),


    })
    private cargoOfficialReceiptInfo: NgcFormGroup = new NgcFormGroup({
        cargoOfficialReceipt: new NgcFormControl(),
        emails: new NgcFormArray([])
        // email: new NgcFormControl(""),
    })
    private signatureAndPayment: NgcFormGroup = new NgcFormGroup({
        consignee: new NgcFormGroup({
            icNo: new NgcFormControl('', [Validators.required]),
            name: new NgcFormControl('', [Validators.required, Validators.maxLength(35)]),
            designation: new NgcFormControl("", [Validators.maxLength(35)]),
            signature: new NgcFormControl(''),

        }),
        witnessBy: new NgcFormGroup({
            icNo: new NgcFormControl(''),
            name: new NgcFormControl('', [Validators.maxLength(35)]),
            designation: new NgcFormControl('', [Validators.maxLength(35)]),
            signature: new NgcFormControl(''),


        }),
        surveyBy: new NgcFormGroup({
            icNo: new NgcFormControl(this.getUserProfile() == null ? 'userid' : this.getUserProfile().userLoginCode, [Validators.required, Validators.maxLength(20)]),
            name: new NgcFormControl(this.getUserProfile() == null ? 'USERNAME' : this.getUserProfile().userShortName, [Validators.maxLength(35)]),
            designation: new NgcFormControl("", [Validators.maxLength(35)]),
            signature: new NgcFormControl(""),

        }),
    })
    private piecesAndweight: any = {
        surveyDetails: {
            pieces: "pieces",
            weight: "weight",
            diffPieces: "diffPieces",
            diffWeight: "diffWeight"
        },

        surveyFor: {
            hawb: {
                weight: "weight",
                pieces: "pieces"
            },
            refWeight: "refWeight",
            noOfPieces: "noOfPieces"
        }
    }
    private cargoSurvey: NgcFormGroup = new NgcFormGroup({
        airportPassValidation: new NgcFormControl(),
        surveyNo: new NgcFormControl(),
        status: new NgcFormControl(''),
        carrierGp: new NgcFormControl('', Validators.required),
        referenceNo: new NgcFormControl('', Validators.required),
        placeOfsurvey: new NgcFormControl('', Validators.required),
        surveyForName: new NgcFormControl('', Validators.required),
        comConductSurveyId: new NgcFormControl(),
        surveyFor: this.refSurvey,

        shipments: new NgcFormArray([
            new NgcFormGroup({
                invoiceNo: new NgcFormControl('', [Validators.maxLength(15)]),
                quantityDamagedLost: new NgcFormControl(null, [Validators.maxLength(5)]),
                natureOfGoods: new NgcFormControl('', [Validators.maxLength(25)]),
                description: new NgcFormControl(''),
                //isDiscrepancy: new NgcFormControl('N'
                // ),
                transactionSequenceNo: new NgcFormControl(1),


            })
        ]),
        surveyDetails: this.surveyDetails,
        signatureAndPayment: this.signatureAndPayment,
        cargoOfficialReceipt: new NgcFormControl(''),
        startedDateTime: new NgcFormControl(''),
        endDateTime: new NgcFormControl(''),
        questionnairList: new NgcFormArray([
        ]),

        cargoOfficialReceiptInfo: this.cargoOfficialReceiptInfo,
        // Packaging Details Window
        item: new NgcFormControl(''),
        itemList: new NgcFormArray([]),
        other: new NgcFormControl('', [Validators.maxLength(800)]),
        imagePreview: new NgcFormControl(''),
        imageRemark: new NgcFormControl(),
        imageUpload: new NgcFormArray([]),
    });
    temp: number;
    tempArray: NgcFormArray;
    forwardedData: any = null;
    remarksFlag: boolean = false;
    questionIndex: any;
    appointedAgentDetail: any;


    constructor(appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef,
        private activatedRoute: ActivatedRoute, private router: Router,
        public tracingService: TracingService) {
        super(appZone, appElement, appContainerElement);

    }

    /**
     * 
     * 
     * @memberof CargoSurveyComponent
     */
    ngOnInit() {
        super.ngOnInit();
        //
        this.forwardedData = this.getNavigateData(this.activatedRoute);
        let routeData: any = null;
        //
        if (this.forwardedData) {
            this.forwardedSearchBy = this.forwardedData.searchBy;
            routeData = this.forwardedData.data;
        }
        //
        if (routeData && routeData.surveyNo) {
            // Search
            routeData.endDateTime = null;
            routeData.startedDateTime = null;
            this.getSurveyBy(routeData);
        } else {
            this.tracingService.getAutoGeneratedNo().subscribe((res) => {
                let generatedSurvey: GeneratedCargoSurvey = <GeneratedCargoSurvey><any>res.data;
                this.cargoSurvey.get('surveyNo').setValue(generatedSurvey.surveyNo);
                this.cargoSurvey.get('startedDateTime').setValue(generatedSurvey.startedDateTime);
                this.cargoSurvey.get('status').setValue(generatedSurvey.status);
                //
                if (generatedSurvey.questionnairList && generatedSurvey.questionnairList.length > 0) {
                    generatedSurvey.questionnairList.forEach((question: any) => {
                        // question.responseFlag = 0;
                    });
                }
                this.cargoSurvey.get('questionnairList').patchValue(generatedSurvey.questionnairList);
                this.onValueChanges();
            });
            this.iscreatenew = true;

        }
        console.log(this.forwardedData);
    }




    private changeModifiedState() {

    }
    private isChanges: boolean = false;
    /**
     * 
     * 
     * @memberof CargoSurveyComponent
     */
    ngAfterViewInit() {
        let $this = this;
        super.ngAfterViewInit();
        $this = this;

        // document.onkeyup = function (this) {
        //     if (this.activeElement instanceof HTMLInputElement) {
        //         $this.checkUpdateStatus = true;
        //     }
        // };
    }
    /**
     * 
   * 
   * @param {*} routeData 
   * @memberof CargoSurveyComponent
   */
    getSurveyBy(routeData: any) {
        let generatedCargoSurvey: GeneratedCargoSurvey = new GeneratedCargoSurvey();
        generatedCargoSurvey.surveyNo = routeData.surveyNo;
        this.tracingService.getSurveyBy(generatedCargoSurvey).subscribe((response) => {
            if (response.success) {
                if (response.data) {
                    this.resetFormMessages();
                    let cargoSurvey: CargoSurvey = response.data
                    this.cargoSurvey.patchValue(cargoSurvey);
                    this.reportParam.surveynumber = "" + this.cargoSurvey.get('surveyNo').value;
                    this.initializeValue();
                    this.next = false;
                    this.checkReference = true;
                    this.enableDisable();
                    this.updateShipmentValidators();
                    //this.getDifferenceOfSighted();
                    this.updateOnHAWBChange();
                    this.onValueChanges();
                    // this.compareQuntityItem();
                    // this.getReport();
                    this.checkUpdateStatus = false;
                    this.savePopUpData = false;
                }
                //
            } else {
                this.refreshFormMessages(response.data);
            }
        })
    }

    /**
     * 
     * 
     * @memberof CargoSurveyComponent
     */
    onValueChanges() {
        let $this = this;
        let timeout = 300;
        // Survey For Name
        let formArr: NgcFormArray = this.cargoSurvey.get('surveyFor') as NgcFormArray;
        let formArray: NgcFormArray = formArr.get('hawb') as NgcFormArray;
        formArray.get('hawbNumber').valueChanges.subscribe(() => {
            if (formArray.get('hawbNumber').value) {
                formArray.get('pieces').setValidators([Validators.required, Validators.min(1)]);
                formArray.get('weight').setValidators([Validators.required, Validators.min(0.1)]);
            }
            else {
                formArray.get('pieces').clearValidators();
                formArray.get('pieces').reset();
                formArray.get('weight').clearValidators();
                formArray.get('weight').reset();
            }
        });
        this.cargoSurvey.get('surveyForName').valueChanges.subscribe(() => {
            this.enableDisableOnSurveyForNameChange();
        });
        // HAWB
        this.cargoSurvey.get('surveyFor').valueChanges.subscribe(() => {
            this.updateOnHAWBChange();
            // this.getDifferenceOfSighted();
        });
        // Sighted
        this.cargoSurvey.get('surveyDetails').valueChanges.subscribe(() => {
            //this.getDifferenceOfSighted();
        });
    }


    /*   This Function Handels the House Number functionality */
    onhawbSelect(object) {

    }
    /*   This Function Handels the Question Dropdown  functionality */
    questionnairListHandler(object, index) {

        if (object.code == 1) {
            this.remarksFlag = true;
            this.questionIndex = index;
        }
        else {
            this.remarksFlag = false;
            this.questionIndex = null;
            this.cargoSurvey.get(['questionnairList', index, 'remarks']).patchValue(null);
        }
    }


    getMaximumTransactionSequenceNo(arr) {
        let transactionSequenceNo = 0;
        for (let i = 0; i < arr.length; ++i) {
            if (arr[i].transactionSequenceNo > transactionSequenceNo) {
                transactionSequenceNo = arr[i].transactionSequenceNo;
            }
        }
        return transactionSequenceNo;
    }

    addRow() {
        let formArray: NgcFormArray = this.cargoSurvey.get('shipments') as NgcFormArray;
        let shipment: Shipment = new Shipment();
        shipment.quantityDamagedLost = null;
        shipment.transactionSequenceNo = this.getMaximumTransactionSequenceNo(formArray.getRawValue()) + 1;
        //
        formArray.addValue([shipment]);
        //
        let formGroup: NgcFormGroup = formArray.get([formArray.length - 1]) as NgcFormGroup;
        //
        this.updateShipmentValidators();
    }

    /**
     * Update Shipment Validators
     */
    private updateShipmentValidators() {

        let formArray: NgcFormArray = this.cargoSurvey.get('shipments') as NgcFormArray;
        if (formArray) {
            formArray.controls.forEach((formGroup: NgcFormGroup) => {
                if (formGroup) {
                    formGroup.get('invoiceNo').setValidators([Validators.maxLength(15)]);
                    formGroup.get('quantityDamagedLost').setValidators([Validators.maxLength(5)]);
                    formGroup.get('natureOfGoods').setValidators([Validators.maxLength(25)]);
                }
            });
        }
    }

    /**
     * 
     * 
     * @param {any} events 
     * @memberof CargoSurveyComponent
     */

    updateSurvey(cargoSurvey: CargoSurvey) {
        console.log(cargoSurvey);
        if (this.cargoSurvey.valid) {
            this.tracingService.updateCargoSurvey(cargoSurvey).subscribe((response) => {
                (response.success) ?
                    ((response.data.messageList.length > 0) ?
                        this.refreshFormMessages(response.data)
                        : (
                            this.resetFormMessages(),
                            // this.getSurvey(response.data),
                            // this.enableDisable(),
                            // this.redirectTo(),
                            this.getSurveyBy(this.setProperty()),
                            this.showSuccessStatus('g.completed.successfully'), true
                        )) : (
                        (response.messageList) ?
                            this.refreshFormMessages(response) :
                            (response.data.messageList.length > 0) ?
                                this.refreshFormMessages(response.data) : false
                        , false)
            }, (error) => {
            });
        } else {

        }
    }

    onCheckDuplicateValidations(cargoSurveyRawValue) {
        let message: any = {
            messageList: []
        };
        let individualMessageList = []; individualMessageList = this.tracingService.checkForAnyDuplicateEntries('cargoOfficialReceiptInfo.emails', 'email', 'Duplicate Email address', cargoSurveyRawValue.cargoOfficialReceiptInfo.emails);
        message.messageList.push(...individualMessageList);
        if (message.messageList.length) {
            this.showResponseErrorMessages(message);
            return false;
        }
        return true;
    }
    /**
     * 
     * 
     * @returns 
     * @memberof CargoSurveyComponent
     */
    onSave() {
        console.log("fera=====================");
        console.log(this.cargoSurvey);
        if (!this.cargoSurvey.get('signatureAndPayment').get('consignee').get('icNo').valid) {
            return;
        }
        if (this.cargoSurvey.get('signatureAndPayment').get('consignee').get('name').value.length < 4) {
            this.showFormControlErrorMessage(<NgcFormControl>this.cargoSurvey.get('signatureAndPayment').get('consignee').get('name'), 'ERROR_IC_NAME_CHR');
            return;
        }
        if (this.validatePackingDetails()) {
            return;
        }

        this.validateForm();
        //
        console.log(this.cargoSurvey);
        if (!this.cargoSurvey.valid) {

            return;
        }
        let cargoSurveyRawValue = this.cargoSurvey.getRawValue();
        if (!this.onCheckDuplicateValidations(cargoSurveyRawValue)) {
            return;
        }
        this.resetFormMessages();
        this.deleteBlankEmail();

        let cargoSurvey: CargoSurvey = this.cargoSurvey.getRawValue();
        if (this.cargoSurvey.get('signatureAndPayment').get('consignee').get('icNo').value != null
            && this.cargoSurvey.get('signatureAndPayment').get('consignee').get('name').value != null) {
            // this.tracingService.validateBlackListCustomer(cargoSurvey).subscribe(response => {
            //     if (response.success === false) {
            //         if (response.messageList.length > 0) {
            //             var icName: string[] = [];
            //             icName.push(cargoSurvey.signatureAndPayment.consignee.name);
            //             icName.push(cargoSurvey.signatureAndPayment.consignee.icNo);
            //             var error = NgcUtility.translateMessage(response.messageList[0].code, icName);
            //             this.showErrorStatus(error + " " + response.messageList[0].message);
            //             return;
            //         }
            //     }
            //     if (!this.showResponseErrorMessages(response)) {
            //         if (cargoSurvey.comConductSurveyId && cargoSurvey.comConductSurveyId != 0) {
            //             this.updateSurvey(cargoSurvey);
            //         } else {

            //             this.createSurvey(cargoSurvey);
            //             this.iscreatenew = false;
            //         }
            //         this.modelOpenFlag = false;
            //     }
            // });
        }

    }

    /**
     * 
     * 
     * @param {CargoSurvey} cargoSurvey 
     * @memberof CargoSurveyComponent
     */
    createSurvey(cargoSurvey: CargoSurvey) {
        if (this.cargoSurvey.get('signatureAndPayment').get('consignee').get('icNo').value != null
            && this.cargoSurvey.get('signatureAndPayment').get('consignee').get('name').value != null) {
            console.log("inside if:;");
            // this.tracingService.validateBlackListCustomer(cargoSurvey).subscribe(response => {
            //     if (response.success === false) {
            //         console.log("inside success");
            //         if (response.messageList.length > 0) {
            //             this.showErrorStatus(response.messageList[0].message);
            //             return;
            //         }
            //     }
            // });
        }
        //this.validateAirportPass(cargoSurvey);
        this.tracingService.createCargoSurvey(cargoSurvey).subscribe((response) => {
            (response.success) ?
                ((response.data.messageList.length > 0) ?
                    this.refreshFormMessages(response.data)
                    : (
                        this.resetFormMessages(),
                        //this.getSurvey(response.data),
                        //this.redirectTo(),
                        this.getSurveyBy(this.setProperty()),
                        this.showSuccessStatus('g.completed.successfully'), true
                    )) : (
                    (response.messageList) ?
                        this.refreshFormMessages(response) :
                        (response.data.messageList.length > 0) ?
                            this.refreshFormMessages(response.data) : false
                    , false)
        }, (error) => {

        });

    }
    /**
     * 
     * 
     * @memberof CargoSurveyComponent
    */
    getShipment() {
        this.validateForm();
        if (this.validateField()) {
            let generatedCS = this.setProperty();
            generatedCS.status = status;
            this.tracingService.getShipment(generatedCS).subscribe((res) => {
                if (res.success) {
                    let refOfSurveyFor: RefOfSurveyFor;
                    let refresh = (res.data.messageList && res.data.messageList.length > 0) ?
                        (this.refreshFormMessages(res.data), this.checkReference = false, false) :
                        (refOfSurveyFor = res.data,
                            this.resetFormMessages(),
                            this.cargoSurvey.get('surveyFor').patchValue(refOfSurveyFor),
                            // this.addRow(),
                            this.addEmail(),
                            this.cargoSurvey.get('carrierGp').disable(),
                            this.cargoSurvey.get('surveyForName').disable(),
                            this.cargoSurvey.get('referenceNo').disable(),
                            this.cargoSurvey.get('placeOfsurvey').disable(),
                            this.cargoSurvey.get('surveyFor').get('hawb').get('hawbNumber').disable(),
                            this.checkReference = true, true);
                } else {
                    this.addEmail();
                    this.refreshFormMessages(res.data)
                }
            })
        }
    }
    private enableBtn: boolean = true;
    getSurvey(cargoSurvey: CargoSurvey) {
        this.cargoSurvey.patchValue(cargoSurvey);
        this.enableBtn = false;
        this.disableOnFinalize = false;
        this.disableSave = false;
    }
    /**
     * 
     * 
     * @param {string} status 
     * @memberof CargoSurveyComponent
     */

    finalizeSurvey(status: string) {
        let generatedCS = this.setProperty();
        generatedCS.status = status;
        //
        if (this.savePopUpData) {
            this.showInfoStatus("tracing.save.record.info");
            return;
        }
        // if (this.isDiscrepancy()) {
        //     this.showErrorMessage("Packing Details is not update");
        //     return;
        // }
        let count = 0;
        (this.cargoSurvey.get('shipments') as NgcFormArray).controls.forEach((shipmentGp: NgcFormGroup) => {
            if (Number(shipmentGp.get('quantityDamagedLost').value) && (shipmentGp.get('packingItem') as NgcFormArray).length == 0) {
                count++;

            }
        });
        if (count > 0) {
            this.showConfirmMessage("tracing.damaged.packing.details.not.updated"
            ).then(fulfilled => {
                this.tracingService.finalizeConductSurvey(generatedCS).subscribe((res) => {
                    if (!this.showResponseErrorMessages(res, "cargoOfficialReceiptInfo")) {
                        if (res.data.messageList == 0) {
                            this.resetFormMessages();
                            let finalizeCargoSurvey: GeneratedCargoSurvey = res.data
                            this.cargoSurvey.get('status').setValue(finalizeCargoSurvey.status);
                            this.cargoSurvey.get('endDateTime').setValue(finalizeCargoSurvey.updateStatusDate);
                            this.enableDisable();
                            this.enableBtn = true;
                            this.disableBtn = true;
                            this.showSuccessStatus('tracing.survey.finalize.success');
                        } else {
                            this.showResponseErrorMessages(res.data);
                        }
                    }

                })
            })
        }
        else {
            let $this = this;
            this.tracingService.validatingItems(generatedCS).subscribe((res) => {
                if (!res.data.flagItem) {
                    this.showConfirmMessage("tracing.finalize.survey.confirm").then(fulfilled => {
                        this.tracingService.finalizeConductSurvey(generatedCS).subscribe((res) => {
                            if (!this.showResponseErrorMessages(res, "cargoOfficialReceiptInfo")) {
                                if (res.data.messageList == 0) {
                                    this.resetFormMessages();
                                    let finalizeCargoSurvey: GeneratedCargoSurvey = res.data
                                    this.cargoSurvey.get('status').setValue(finalizeCargoSurvey.status);
                                    this.cargoSurvey.get('endDateTime').setValue(finalizeCargoSurvey.updateStatusDate);
                                    this.enableDisable();
                                    this.enableBtn = true;
                                    this.disableBtn = true;
                                    this.showSuccessStatus('tracing.survey.finalize.success');
                                } else {
                                    this.showResponseErrorMessages(res.data);
                                }
                            }

                        })
                    }).catch(reason => {
                    });
                }
                else {
                    this.showConfirmMessage("tracing.packing.details.blank.will.removed").then(fulfilled => {
                        this.tracingService.finalizeConductSurvey(generatedCS).subscribe((res) => {
                            if (!this.showResponseErrorMessages(res, "cargoOfficialReceiptInfo")) {
                                if (res.data.messageList == 0) {
                                    this.resetFormMessages();
                                    let finalizeCargoSurvey: GeneratedCargoSurvey = res.data
                                    this.cargoSurvey.get('status').setValue(finalizeCargoSurvey.status);
                                    this.cargoSurvey.get('endDateTime').setValue(finalizeCargoSurvey.updateStatusDate);
                                    this.enableDisable();
                                    this.enableBtn = true;
                                    this.disableBtn = true;
                                    this.showSuccessStatus('tracing.survey.finalize.success');
                                } else {
                                    this.showResponseErrorMessages(res.data);
                                }
                            }

                        })
                    }).catch(reason => {
                    });
                }
            });


        }

    }
    /**
     * 
     * 
     * @param {string} status 
     * @memberof CargoSurveyComponent
     */
    cancelAndRestoreSurvey(status: string) {
        let cargoSurvey: CargoSurvey = this.cargoSurvey.getRawValue();
        let generatedCS = this.setProperty();
        //
        generatedCS.status = cargoSurvey.status == 'Open' ? 'Cancelled' : 'Open';
        let message = cargoSurvey.status == 'Open' ? "tracing.cancel.survey.warning" : "tracing.restore.survey.warning"
        //

        this.showConfirmMessage(message).then(fulfilled => {
            this.tracingService.cancelConductSurvey(generatedCS).subscribe((res) => {
                //  let cargoSurvey: CargoSurvey = res.data;
                let cancelSurvey: GeneratedCargoSurvey = res.data;
                let $this = this;
                if (res.success) {
                    if (res.data) {
                        if (res.data.messageList.length == 0) {
                            this.resetFormMessages();
                            this.buttonValue = cancelSurvey.status == 'cargosurvey.open' ? "cargoSurvey.cancelSurvey" : "cargoSurvey.restoreSurvey";
                            this.cargoSurvey.get('status').setValue(cancelSurvey.status);
                            //
                            this.enableDisable('Cancelled');
                        } else {
                            this.refreshFormMessages(res.data);
                        }
                    }
                } else {
                    this.refreshFormMessages(res);
                }
            })

        }).catch(reason => {
        });

    }
    /**
     * 
     * 
     * @returns 
     * @memberof CargoSurveyComponent
     */
    setProperty() {
        let cargoSurvey: CargoSurvey = this.cargoSurvey.getRawValue();
        let generatedCargoSurvey: GeneratedCargoSurvey = new GeneratedCargoSurvey();
        //
        for (let obj in generatedCargoSurvey) {
            generatedCargoSurvey[obj] = cargoSurvey[obj];
        }
        generatedCargoSurvey.hawbNumber = cargoSurvey['surveyFor'].hawb.hawbNumber;
        generatedCargoSurvey.carrierGp = this.cargoSurvey.get('carrierGp').value;
        generatedCargoSurvey.flightKey = this.cargoSurvey.get(['surveyFor', 'impFlight', 'flightKey']).value;
        generatedCargoSurvey.referenceNo = this.cargoSurvey.get('referenceNo').value;
        generatedCargoSurvey.cargoOfficialReceiptInfo = new ConductSurveyReceiptInfo();
        generatedCargoSurvey.cargoOfficialReceiptInfo = this.cargoSurvey.get('cargoOfficialReceiptInfo').value;
        return generatedCargoSurvey;

    }
    /**
     * 
     * 
     * @memberof CargoSurveyComponent
     */
    addEmail() {
        let email: Email = new Email();
        let emailsGp: NgcFormGroup = this.cargoSurvey.get('cargoOfficialReceiptInfo') as NgcFormGroup;
        (<NgcFormArray>emailsGp.get('emails')).addValue([email]);
    }

    /**
     * 
     * 
     * @memberof CargoSurveyComponent
     */
    deleteEmail(event, index) {
        let email: Email = new Email();
        let emailsGp: NgcFormGroup = this.cargoSurvey.get('cargoOfficialReceiptInfo') as NgcFormGroup;
        if ((emailsGp.get(['emails', index]) as NgcFormGroup).flagCRUD == 'C') {
            (emailsGp.get('emails') as NgcFormArray).deleteValueAt(index);
        } else {
            (emailsGp.get(['emails', index]) as NgcFormGroup).markAsDeleted();
        }
    }

    /**
     * 
     * 
     * @param {any} event 
     * @param {any} index 
     * @returns 
     * @memberof CargoSurveyComponent
     */
    public onModelOpen(event, index) {
        this.modelOpenFlag = true;
        this.lineindex = index;
        this.itemNameList = [];
        this.setIndex(index);
        let shipmentGroup: NgcFormGroup = this.cargoSurvey.get(['shipments', index]) as NgcFormGroup;

        shipmentGroup.validate();
        if (shipmentGroup.invalid) {
            return;
        }
        // KK I think itemList is the data that came from backend
        let itemList: NgcFormArray = shipmentGroup.get('packingItem') as NgcFormArray;

        // KK quantity is the new no of damaged packages
        let quantity: number = Number(shipmentGroup.get('quantityDamagedLost').value);
        //
        if (!itemList) {
            (this.cargoSurvey.get('itemList') as NgcFormArray).resetValue([]);
            itemList = this.cargoSurvey.get('itemList') as NgcFormArray;
        } else {
            this.cargoSurvey.get('itemList').patchValue(itemList.getRawValue());
            itemList = this.cargoSurvey.get('itemList') as NgcFormArray;
        }
        // KK itemList is the NgcFormArray that contains current backend data
        // Create Drop Down Source

        let hasAnyNewItems: boolean = false;
        //
        let itemListRawValue = itemList.getRawValue().filter(value => value.flagCRUD != 'D');
        let itemIndex = 0;
        let maxItem = 1;
        for (let i = 0; i < itemListRawValue.length; ++i) {
            if (maxItem < Number(itemListRawValue[i].item)) {
                maxItem = Number(itemListRawValue[i].item);
            }
        }

        for (let i: number = 0; i < itemListRawValue.length; i++) {
            let newObj = {
                code: itemListRawValue[itemIndex] ? itemListRawValue[itemIndex].item : maxItem + i + 1 - itemListRawValue.length,
                desc: (i + 1) + ""
            };
            if (i == 0) {
                this.cargoSurvey.get('item').setValue(newObj.code);
            }
            this.itemNameList.push(newObj);
            this.itemNameListHashMap[newObj.code] = i;
            ++itemIndex;
            // Add Item to Item List
            if (shipmentGroup.get('others'))
                this.cargoSurvey.get('other').setValue(shipmentGroup.get('others').value);
            console.log("teste itemList -0 -packingDetails=================");
        }
        if (itemList.length == 0) {
            this.addNewItem(index);
            this.packingDetails.open();
        }
        else {
            // Open TODO
            if (shipmentGroup.get('others'))
                this.cargoSurvey.get('other').setValue(shipmentGroup.get('others').value);
            this.packingDetails.open();
        }
        if (this.disableBtn) {
            this.cargoSurvey.get('itemList').disable();
            this.cargoSurvey.get('imageUpload').disable();
        } else {
            this.cargoSurvey.get('itemList').enable();
            this.cargoSurvey.get('imageUpload').enable();
        }

    }

    addNewItem(index) {
        let itemList: NgcFormArray = this.cargoSurvey.get('itemList') as NgcFormArray;
        let itemIndex = 0;
        let maxItem: any = 1;
        let hasNewValue: boolean = false;
        let itemListRawValue = itemList.getRawValue();
        for (let i = 0; i < itemListRawValue.length; ++i) {
            if (maxItem < Number(itemListRawValue[i].item)) {
                maxItem = Number(itemListRawValue[i].item);
            }
        }

        let newObj = {
            code: maxItem + 1,
            desc: (itemListRawValue.length + 1) + ""
        };

        this.itemNameList.push(newObj);
        this.itemNameListHashMap[maxItem + 1] = itemListRawValue.length;

        if (this.itemNameList.length == 1) {
            this.cargoSurvey.get('item').setValue(newObj.code);
        }

        // Fix! Angular is not Detecting the Changes
        if (this.itemNameDropDown) {
            this.itemNameDropDown.source = Object.assign([], this.itemNameList);
        }

        this.tracingService.getPackingDetails().subscribe((response) => {
            if (response.data)
                itemList.addValue([{ item: newObj.code, packingDetails: response.data.packingDetails, flagCRUD: 'C' }]);
        });


    }

    private itemIndex: number = 0;
    setIndex(index) {
        return (this.itemIndex = index);
    }
    /**
     * 
     * 
     * @memberof CargoSurveyComponent
     */
    storeShipmentItem() {

        let shipmentGroup: NgcFormGroup = this.cargoSurvey.get(['shipments', this.itemIndex]) as NgcFormGroup;
        //

        console.log(this.cargoSurvey.get(['shipments', this.itemIndex]).value)
        if (!shipmentGroup.get('uploadedDocument')) {
            shipmentGroup.addControl('uploadedDocument', (<NgcFormArray>this.cargoSurvey.get('imageUpload')));
        } else {
            shipmentGroup.get('uploadedDocument').patchValue((<NgcFormArray>this.cargoSurvey.get('imageUpload')).getRawValue());
        }
        // Update Item Index
        let itemListRawValue = (<NgcFormArray>this.cargoSurvey.get('itemList')).getRawValue();
        let maxItem = 1;
        for (let i = 0; i < itemListRawValue.length; ++i) {
            if (itemListRawValue[i].item && maxItem < Number(itemListRawValue[i].item)) {
                maxItem = Number(itemListRawValue[i].item);
            }
        }
        let cnt = 1;
        (<NgcFormArray>this.cargoSurvey.get('itemList')).controls.forEach((itemGroup: NgcFormGroup, index: number) => {

            if (itemGroup.get('flagCRUD').value === 'C') {
                console.log('Create : ' + " C  :");
                if (!itemGroup.get('item')) {
                    itemGroup.addControl('item', new NgcFormControl());
                }
                if (shipmentGroup.get('packingItem')) {
                    const itemLength = (shipmentGroup.get('packingItem') as NgcFormArray).length;
                    itemGroup.get('item').setValue(maxItem + cnt + '');
                    ++cnt;
                }
                console.log('Create : ' + " C  :" + itemGroup.get('item').value);
            }
            if (itemGroup.get('flagCRUD').value === 'U') { }

        });


        let formData: any = this.cargoSurvey.getRawValue();
        let count: boolean = false;
        let countArray: any = new Array();
        let ind: any = new Array();
        let proceedFlag: boolean = true;
        formData.itemList.forEach((element, index) => {
            element.packingDetails.forEach((elem) => {
                elem.packingConditions.forEach(ele => {
                    if (ele.packingConditionFlag)
                        count = true;
                });
            });

            if (count) {
                countArray.push(true);
            }
            else {
                ind.push(index + 1);
                countArray.push(false);
            }
            count = false;
        });
        countArray.forEach(element => {
            if (!element) {
                this.showErrorMessage("tracing.packing.details.not.updated" + ind + " .");
                proceedFlag = false;
                return;
            }
        });
        if (proceedFlag || this.cargoSurvey.get('other').value) {
            if (!shipmentGroup.get('packingItem')) {
                shipmentGroup.addControl('packingItem', (<NgcFormArray>this.cargoSurvey.get('itemList')));
            } else {
                shipmentGroup.get('packingItem').patchValue((<NgcFormArray>this.cargoSurvey.get('itemList')).getRawValue());
            }
            if (!shipmentGroup.get('others')) {
                shipmentGroup.addControl('others', (<NgcFormControl>this.cargoSurvey.get('other')));
            } else {
                shipmentGroup.get('others').patchValue((<NgcFormControl>this.cargoSurvey.get('other')).value);
            }

            let cargoSurvey: CargoSurvey = this.cargoSurvey.getRawValue();
            //
            cargoSurvey.shipments.forEach((shipment) => {
                shipment.packingItem.forEach((packingItem) => {
                    packingItem.item = this.cargoSurvey.get('item').value;
                })
            });
            this.packingDetails.close();
        }
        this.savePopUpData = true;
    }
    deleteShipmentItem() {
        let shipmentGroup: NgcFormGroup = this.cargoSurvey.get(['shipments', this.itemIndex]) as NgcFormGroup;
        let itemIndex = this.cargoSurvey.get('item').value;
        (<NgcFormArray>this.cargoSurvey.get('itemList')).deleteValueAt(itemIndex - 1);
        (<NgcFormArray>shipmentGroup.get('packingItem')).deleteValueAt(itemIndex - 1);
    }

    /**
     * 
     * 
     * @returns 
     * @memberof CargoSurveyComponent
     */
    validateField() {

        return (this.cargoSurvey.get('referenceNo').valid &&
            this.cargoSurvey.get('surveyForName').valid && this.cargoSurvey.get('carrierGp').valid && this.cargoSurvey.get('placeOfsurvey').valid) ? true : false;
    }

    getCustomer(approvedBy, $event) {
        let cs: NgcFormControl = this.cargoSurvey.get('signatureAndPayment').get(approvedBy).get('name') as NgcFormControl;
        cs.setValue($event.param1);
    }

    onDelete(index: any) {

        let shipment: NgcFormGroup = this.cargoSurvey.get(['shipments', index]) as NgcFormGroup;
        // 
        if (shipment.flagCRUD == 'C') {
            (this.cargoSurvey.get('shipments') as NgcFormArray).deleteValueAt(index);
        } else {
            shipment.markAsDeleted();
        }
    }

    /**
     * 
     * 
     * @param {any} event 
     * @memberof CargoSurveyComponent
     */
    public onImageSelect(event) {
        this.cargoSurvey.get('imagePreview').setValue(event.document);
    }

    /**
     * 
     */
    getDifferenceOfSighted() {
        if (this.isValidating) {
            return;
        }
        let diffPieces = 0;
        let diffWeight = 0;
        const surveyFor: any = (this.cargoSurvey.get('surveyFor') as NgcFormGroup).getRawValue();
        const surveyDetails: any = (this.cargoSurvey.get('surveyDetails') as NgcFormGroup).getRawValue();
        //
        if (surveyFor && surveyFor.hawb) {
            if (surveyFor.hawb.pieces) {
                if (surveyFor.hawb.pieces > 0) {
                    diffPieces = surveyFor.hawb.pieces - surveyDetails.pieces;
                }
                if (surveyFor.hawb.weight && surveyFor.hawb.weight > 0) {
                    diffWeight = surveyFor.hawb.weight - surveyDetails.weight;
                } else {
                    diffWeight = 0 - surveyDetails.weight;
                }
            } else {
                diffPieces = surveyFor.noOfPieces - surveyDetails.pieces;
                diffWeight = surveyFor.refWeight - surveyDetails.weight;
            }
        }

        if (diffWeight < 0) {
            diffWeight = 0;
        }
        if (this.cargoSurvey.get('surveyDetails').get('diffWeight').value != diffWeight) {
            this.cargoSurvey.get('surveyDetails').get('diffWeight').setValue(diffWeight, {
                onlySelf: true,
                emitEvent: false
            });
        }

        if (diffPieces < 0) {
            diffPieces = 0;
        }
        if (this.cargoSurvey.get('surveyDetails').get('diffPieces').value != diffPieces) {
            this.cargoSurvey.get('surveyDetails').get('diffPieces').setValue(diffPieces, {
                onlySelf: true,
                emitEvent: false
            });
        }
    }

    updateOnHAWBChange() {
        const hawb: NgcFormGroup = this.cargoSurvey.get('surveyFor.hawb') as NgcFormGroup;
        const pieces: number = hawb.get('pieces').value;
        const weight: number = hawb.get('weight').value;
        //
        if (pieces === undefined || pieces === null) {
            this.cargoSurvey.get('surveyFor.hawb.weight').setValue(null, { onlySelf: true, emitEvent: false });
        } else {
            if (weight <= 0) {
                this.cargoSurvey.get('surveyFor.hawb.weight').setValue(Number(0.0), { onlySelf: true, emitEvent: false });
            }
        }
    }

    private enableDisable(previousStatus?: string) {
        const status: string = this.cargoSurvey.get('status').value;
        let surveyForName: string = this.cargoSurvey.get('surveyForName').value;
        const comConductSurveyId: number = this.cargoSurvey.get('comConductSurveyId').value;
        //
        if (!surveyForName) {
            surveyForName = "Reference";
        }
        let value = surveyForName.replace(/NUMBER/gi, '');
        this.labelValuePieces = value + " Pieces";
        this.labelValueWeight = value + " Weight";
        this.labelValueNumber = value + " Number";
        this.buttonValue = status == 'Open' ? "cargoSurvey.cancelSurvey" : "cargoSurvey.restoreSurvey";
        //
        if (status == 'Open') {
            if (previousStatus === 'Cancelled' || previousStatus === 'Finalized') {
                this.cargoSurvey.get('shipments').enable();
                this.cargoSurvey.get('surveyFor').enable();
                this.cargoSurvey.get('signatureAndPayment').enable();
                this.cargoSurvey.get('surveyDetails').enable();
                this.cargoSurvey.get('questionnairList').enable();
                this.cargoSurvey.get('cargoOfficialReceiptInfo').enable();
                this.cargoSurvey.get('item').enable();
            }
            if (comConductSurveyId && comConductSurveyId > 0) {
                this.cargoSurvey.get('carrierGp').disable();
                this.cargoSurvey.get('surveyForName').disable();
                this.cargoSurvey.get('referenceNo').disable();
                this.cargoSurvey.get('placeOfsurvey').disable();
            } else {
                this.cargoSurvey.get('carrierGp').enable();
                this.cargoSurvey.get('surveyForName').enable();
                this.cargoSurvey.get('referenceNo').enable();
                this.cargoSurvey.get('placeOfsurvey').enable();
            }
            this.disableOnFinalize = false;
            this.disableBtn = false;
            this.enableBtn = false;
        }
        //
        if (status == 'Cancelled') {
            this.cargoSurvey.disable();
            this.disableOnFinalize = true;
            this.disableBtn = true;
            this.enableBtn = false;
        }

        if (status == 'Finalized') {
            this.cargoSurvey.disable();
            this.disableOnFinalize = true;
            this.disableSave = true;
            this.disableBtn = true;
            this.enableBtn = true;
        }
    }

    enableDisableOnSurveyForNameChange() {
        let surveyForName: string = this.cargoSurvey.get('surveyForName').value;
        //
        if (surveyForName && surveyForName.trim() == "AWB") {
            this.cargoSurvey.get('surveyFor').get('hawb').enable();
        } else {
            this.cargoSurvey.get('surveyFor').get('hawb').disable();
        }
        if (!surveyForName) {
            surveyForName = "Reference";
        }
        let value = surveyForName.replace(/NUMBER/gi, '');
        this.labelValuePieces = value + " Pieces";
        this.labelValueWeight = value + " Weight";
        this.labelValueNumber = value + " Number";
        //
    }
    clearDate() {
        this.cargoSurvey.get(['surveyFor', 'impFlight', 'flightOriginDate']).setValue(null);
    }

    /**
     * Validate Packing Details
     */
    private validatePackingDetails(): boolean {
        let selectedPackingCount: number = 0;
        let totalValidPackingItems: number = 0;
        const shipments: NgcFormArray = this.cargoSurvey.get('shipments') as NgcFormArray;
        //
        if (shipments && shipments.controls) {

            shipments.controls.forEach((shipment: NgcFormGroup) => {
                let reduceQuantity = 0;
                if (shipment.isSoftDeleted) {
                    return;
                }
                let count = 0;
                let packingConditionCount = 0;
                //
                const packingList: NgcFormArray = shipment.get('packingItem') as NgcFormArray;

                // Total Packing Items

                if (!packingList) {
                    return;
                }
                //
                packingList.controls.forEach((packingGroup: NgcFormGroup) => {
                    const packingDetails: NgcFormArray = packingGroup.get('packingDetails') as NgcFormArray;
                    let isSelected: boolean = false;
                    //
                    count = 0;
                    packingConditionCount = 0;
                    try {
                        packingDetails.controls.forEach((packingDtlGroup: NgcFormGroup) => {
                            count++;
                            const packingConditions: NgcFormArray = packingDtlGroup.get('packingConditions') as NgcFormArray;
                            packingConditionCount += packingConditions.length + 1;
                            //
                            packingConditions.controls.forEach((packCondtionGroup: NgcFormGroup) => {
                                if (packCondtionGroup.get('packingConditionFlag').value === true) {
                                    isSelected = true;
                                    this.selectedAccordion = true;
                                    throw new Error("Data Found");
                                } else {
                                    count++;
                                }

                            });
                        });
                    } catch (e) {
                        if (isSelected) {
                            selectedPackingCount++;
                        }
                    }

                });

            });

            if (selectedPackingCount !== totalValidPackingItems) {

                return false;
            }
        }
        return false;
    }
    showAccordion(pack: any, index, itemIndex) {
        let isSelected = false;
        const packingConditions: NgcFormArray = pack.get('packingConditions') as NgcFormArray;
        packingConditions.controls.forEach((packCondtionGroup: NgcFormGroup) => {
            if (packCondtionGroup.get('packingConditionFlag').value === true) {
                isSelected = true;
            }
        });
        return isSelected;
    }


    validateDifference() {
        if ((this.cargoSurvey.get('item').invalid || this.cargoSurvey.get('item').value == "")) {
            this.showErrorMessage('tracing.packing.details.mandatory');
            return;
        }
        if ((this.cargoSurvey.get('surveyDetails').get('pieces').invalid || this.cargoSurvey.get('surveyDetails').get('weight').invalid)) {
            this.showErrorMessage('tracing.packing.details.mandatory');
        }
        if ((this.cargoSurvey.get('shipments').get('weight').invalid || this.cargoSurvey.get('item').value == "")) {
            this.showErrorMessage('tracing.packing.details.mandatory');
            return;
        }

        if ((this.cargoSurvey.get('item').invalid || this.cargoSurvey.get('item').value == "")) {
            this.showErrorMessage('tracing.packing.details.mandatory');
            return;
        }
    }

    redirectTo() {
        this.navigateTo(this.router, '/tracing/surveydetailscomponent', this.forwardedSearchBy);
    }

    initializeValue() {
        this.itemNameList = [];

        let shipments = this.cargoSurvey.get('shipments') as NgcFormArray;
        if (!shipments.controls) {
            return;
        }

        let shipmentGroup = this.cargoSurvey.get(['shipments', 0]) as NgcFormGroup;
        if (!shipmentGroup) {
            return;
        }

        (shipmentGroup.get('packingItem') as NgcFormArray).controls.forEach((item: NgcFormGroup, index) => {
            this.itemNameList.push({
                code: (index + 1) + "",
                desc: (index + 1) + ""
            });
        });
        this.cargoSurvey.get('item').setValue("1");
    }

    /**
     * Validate Entire Form
     */
    private validateForm() {
        this.isValidating = true;
        // Validate
        this.cargoSurvey.validate();
        //
        this.isValidating = false;
    }

    private deleteBlankEmail() {
        const emailFormArray: NgcFormArray = this.cargoSurvey.get('cargoOfficialReceiptInfo.emails') as NgcFormArray;
        //
        if (emailFormArray && emailFormArray.controls) {
            emailFormArray.controls.forEach((emailGroup: NgcFormGroup) => {
                const emailControl: NgcFormControl = emailGroup.get('email') as NgcFormControl;
                //
                if (!emailControl || !emailControl.value) {
                    emailGroup.markAsDeleted();
                }
            });
        }
    }

    private setShipmentType($this: any) {
        if ($this && $this.shipmentType !== undefined) {
            this.cargoSurvey.get('surveyForName').setValue($this.shipmentType);
            this.enableDisableOnSurveyForNameChange();
        }
    }


    sendEmail() {
        let cargoSurvey: CargoSurvey = this.cargoSurvey.getRawValue();
        console.log(cargoSurvey);
        this.tracingService.sendReportMail(cargoSurvey).subscribe((response) => {
            (response.success) ?
                ((response.data.messageList.length > 0) ?
                    this.refreshFormMessages(response.data)
                    : (
                        this.resetFormMessages(),
                        this.showSuccessStatus('tracing.report.sent'), true
                    )) : (
                    (response.messageList) ?
                        this.refreshFormMessages(response) :
                        (response.data.messageList.length > 0) ?
                            this.refreshFormMessages(response.data) : false
                    , false)
        }, (error) => {

        });
    }

    compareQuntityItem() {
        let count = 0;
        (this.cargoSurvey.get('shipments') as NgcFormArray).controls.forEach((shipmentGp: NgcFormGroup) => {
            console.log(shipmentGp.get('quantityDamagedLost').value + "  :  " + (shipmentGp.get('packingItem') as NgcFormArray).length);
            if (Number(shipmentGp.get('quantityDamagedLost').value) === (shipmentGp.get('packingItem') as NgcFormArray).length) {
                shipmentGp.get('isDiscrepancy').setValue('N');

            } else if (shipmentGp.get('quantityDamagedLost').value > (shipmentGp.get('packingItem') as NgcFormArray).length) {
                shipmentGp.get('isDiscrepancy').setValue('Y');
            } else if (shipmentGp.get('quantityDamagedLost').value < (shipmentGp.get('packingItem') as NgcFormArray).length) {
                shipmentGp.get('isDiscrepancy').patchValue('Y');
            }
        });
    }
    deleteItem(index: number) {
        let itemList: NgcFormGroup = this.cargoSurvey.get(['itemList', index - 1]) as NgcFormGroup;
        let shipmentGroup: NgcFormGroup = this.cargoSurvey.get(['shipments', this.itemIndex]) as NgcFormGroup;
        if (itemList) {
            if (itemList.get('flagCRUD').value === 'C') {
                (this.cargoSurvey.get('itemList') as NgcFormArray).removeAt(index - 1);

                this.onModelOpen(event, this.lineindex);

            }
            if (itemList.get('flagCRUD').value === 'U') {
                itemList.markAsDeleted();
                let packingItem = shipmentGroup.get(['packingItem', index]) as NgcFormGroup;
                if (packingItem) {
                    packingItem.markAsDeleted();
                }


                this.onModelOpen(event, this.lineindex);

            }
        }
    }
    isDiscrepancy() {
        let isDiscrepancy = false;
        (this.cargoSurvey.get('shipments') as NgcFormArray).controls.forEach((shipmentGp: NgcFormGroup) => {
            shipmentGp.get('isDiscrepancy').value;
            if (shipmentGp.get('isDiscrepancy').value === 'Y') {
                isDiscrepancy = true;
            }
        })
        return isDiscrepancy;
    }

    onGenerateReport() {
        this.reportWindow.open();
    }

    unfinalizeSurvey() {

        let generatedCargoSurvey: GeneratedCargoSurvey = new GeneratedCargoSurvey();
        generatedCargoSurvey.surveyNo = this.cargoSurvey.get('surveyNo').value;
        generatedCargoSurvey.flightKey = this.cargoSurvey.get(['surveyFor', 'impFlight', 'flightKey']).value;
        generatedCargoSurvey.referenceNo = this.cargoSurvey.get('referenceNo').value;
        this.tracingService.unfinalizeSurvey(generatedCargoSurvey).subscribe((response) => {
            this.cargoSurvey.get('status').setValue("Open");
            this.cargoSurvey.get('endDateTime').setValue(null);
            this.enableDisable();
            this.enableBtn = false;
            this.disableBtn = false;
            this.cargoSurvey.get('shipments').enable();
            this.cargoSurvey.get('surveyFor').enable();
            this.cargoSurvey.get('signatureAndPayment').enable();
            this.cargoSurvey.get('surveyDetails').enable();
            this.cargoSurvey.get('questionnairList').enable();
            this.cargoSurvey.get('cargoOfficialReceiptInfo').enable();
            this.cargoSurvey.get('item').enable();
            this.showSuccessStatus('tracing.survey.unfinalized');
        }, (error) => {
        });
    }
    validateAirportPass($event) {

        if (!this.cargoSurvey.get('signatureAndPayment').get('consignee').get('icNo').valid) {
            return;
        }
        this.request = this.cargoSurvey.getRawValue();

        this.tracingService.validatePOAirportPass(this.request).subscribe(response => {
            const resp = response.data;

            if (resp.authorizedPersonDetailList == null || resp.authorizedPersonDetailList.length == 0) {
                this.showConfirmMessage('contractor.is.not.recognized'
                ).then(fulfilled => {
                    this.showRemarks = true;
                    (this.cargoSurvey.get('signatureAndPayment').get('consignee').get('name') as NgcFormControl).focus();
                    this.cargoSurvey.get('signatureAndPayment').get('consignee').get('name').setValue("");
                    this.cargoSurvey.get('airportPassValidation').setValue('Fail (N)');
                }
                ).catch(reason => {
                    (this.cargoSurvey.get('signatureAndPayment').get('consignee').get('icNo') as NgcFormControl).focus();
                });
            }
            else if (resp.authorizedPersonDetailList.length == 1) {
                this.cargoSurvey.get('signatureAndPayment').get('consignee').get('name').setValue(resp.authorizedPersonDetailList[0].authorizedPersonnelName);
                this.cargoSurvey.get('airportPassValidation').setValue('Pass (Y)');
                (this.cargoSurvey.get('signatureAndPayment').get('consignee').get('name') as NgcFormControl).focus();
                if (resp.authorizedPersonDetailList[0].authorizedSignature != null) {
                    this.isSignature = true;
                    this.cargoSurvey.get('signatureAndPayment').get('consignee').get('signature').setValue(resp.authorizedPersonDetailList[0].authorizedSignature);
                }
            }
            else {
                this.duplicateNamePopup.open(resp.authorizedPersonDetailList);
            }
        }, error => {
            this.showErrorStatus(error);
        });

    }


    validateWitnessAirportPass(event) {
        let request = this.cargoSurvey.getRawValue();
        if (this.cargoSurvey.get('flagCRUD').value !== 'R') {
            request.signatureAndPayment.consignee.name = null;
            request.signatureAndPayment.witnessBy.name = null;
            this.tracingService.validatePOAirportPass(request).subscribe(response => {
                const resp = response.data;
                if (this.showResponseErrorMessages(response)) {
                    if ((resp.signatureAndPayment.consignee.messageList != null && resp.signatureAndPayment.consignee.messageList.length > 0
                        && resp.signatureAndPayment.consignee.messageList[0].code === "AGTNOTRECOGNIZED")
                        || (resp.signatureAndPayment.witnessBy.messageList != null && resp.signatureAndPayment.witnessBy.messageList.length > 0
                            && resp.signatureAndPayment.witnessBy.messageList[0].code === "AGTNOTRECOGNIZED")) {
                        this.showConfirmMessage('tracing.agent.consignee.not.recognised'
                        ).then(fulfilled => {
                            // this.cargoSurvey.get('signatureAndPayment').get('consignee').get('name').patchValue(resp.signatureAndPayment.consignee.name);
                            this.cargoSurvey.get('signatureAndPayment').get('witnessBy').get('name').patchValue(resp.signatureAndPayment.witnessBy.name);
                            this.refreshFormMessages(resp);
                            this.resetFormMessages();
                        }
                        ).catch(reason => {
                        });
                    }
                    else if ((resp.signatureAndPayment.consignee.messageList != null && resp.signatureAndPayment.consignee.messageList.length > 0
                        && resp.signatureAndPayment.consignee.messageList[0].code === "AGTBLOCKLISTED")
                        || (resp.signatureAndPayment.witnessBy.messageList != null && resp.signatureAndPayment.witnessBy.messageList.length > 0
                            && resp.signatureAndPayment.witnessBy.messageList[0].code === "AGTBLOCKLISTED")) {
                        this.showConfirmMessage('tracing.agent.blacklisted'
                        ).then(fulfilled => {
                            // this.cargoSurvey.get('signatureAndPayment').get('consignee').get('name').patchValue(resp.signatureAndPayment.consignee.name);
                            this.cargoSurvey.get('signatureAndPayment').get('witnessBy').get('name').patchValue(resp.signatureAndPayment.witnessBy.name);
                            this.refreshFormMessages(resp);
                            this.resetFormMessages();
                        }
                        ).catch(reason => {

                        });
                    }
                }
                else {
                    // this.cargoSurvey.get('signatureAndPayment').get('consignee').get('name').patchValue(resp.signatureAndPayment.consignee.name);
                    this.cargoSurvey.get('signatureAndPayment').get('witnessBy').get('name').patchValue(resp.signatureAndPayment.witnessBy.name);
                }

            });
        }



    }

    onConfirmNewEntry() {
        this.cargoSurvey.get('signatureAndPayment').get('consignee').get('name').setValue("");
        this.cargoSurvey.get('signatureAndPayment').get('consignee').get('signature').setValue("");
        (this.cargoSurvey.get('signatureAndPayment').get('consignee').get('name') as NgcFormControl).focus();
    }

    onNameSelect(selectedName) {
        (this.cargoSurvey.get('signatureAndPayment').get('consignee').get('name') as NgcFormControl).focus();
        this.cargoSurvey.get('signatureAndPayment').get('consignee').get('name').setValue(selectedName.authorizedPersonnelName);
        if (selectedName.authorizedSignature != null) {
            this.isSignature = true;
            this.cargoSurvey.get('signatureAndPayment').get('consignee').get('signature').setValue(selectedName.authorizedSignature);
        }
        else {
            this.isSignature = false;
        }
    }

    onChangeIC(event) {
        this.cargoSurvey.get('signatureAndPayment').get('consignee').get('name').setValue("");
    }

}

