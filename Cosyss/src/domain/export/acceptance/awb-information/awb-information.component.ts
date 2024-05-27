import { request } from 'http';
import { log } from 'util';
import { Shipment, HouseInformationModel } from './../../export.sharedmodel';
import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, PageConfiguration, NgcUtility
} from 'ngc-framework';
import { FormsModule, Validators } from '@angular/forms';
import { AcceptanceService } from '../acceptance.service';
@Component({
  selector: 'app-awb-information',
  templateUrl: './awb-information.component.html',
  styleUrls: ['./awb-information.component.scss']
})
@PageConfiguration({
  trackInit: true
})
export class AwbInformationComponent extends NgcPage {
  sendData: any;
  dataGenerateFlag: any;
  awbInformationSave: any;
  dropdownData: any;
  flightType: any;
  earlyLodgeInTime: any;
  lateLodgeInTime: any;
  fightDateSTD: any;
  currentDateTime = new Date();
  awbNumberRequest: any;
  eAcceptanceData: any;
  agentCodeRequest: any;
  agentNameRequest: any;
  authorizationIdentificationNumberRequest: any;
  authorizationIdentificationNameRequest: any;
  resp: any;
  errors: any;
  record: any;
  arrayUser: any;
  xpsTagData: any;
  couGenerateTag: any;
  columnName: any;
  requestData: any;
  dataRetrieved: any;
  xpsTagFlag: boolean;
  permitValue: boolean;
  permitNumberFlag: boolean;
  inputPreLoadgeFlag: boolean;
  excemptionCodeFlag: boolean;
  permitToFollowFlag: boolean;
  displayPreLoadgeFlag: boolean;
  totaldryiceWeight = 0;
  totalExportGrossWeight = 0;
  couSHCFlag: boolean = false;
  xpsSHCFlag: boolean = false;
  dgnSHCFlag: boolean = false;
  eStartButtonFlag: boolean = false;
  // eStartButtonFlagOnSuccess: boolean = false;
  defaultShipmentType: string = 'AWB';
  awbInvalideIndicator: string = '';
  storageInvalideIndicator: string = '';
  cargoIndicator: string = '';
  remarksIndicator: string = '';
  addedShipmentList: string[] = [];
  handlingDefinition: any;
  private form: NgcFormGroup = new NgcFormGroup({
    eawb: new NgcFormControl(),
    house: new NgcFormArray([]),
    endTag: new NgcFormControl(),
    xpsFlag: new NgcFormControl(),
    dgnFlag: new NgcFormControl(),
    couFlag: new NgcFormControl(),
    startTag: new NgcFormControl(),
    generatedTags: new NgcFormControl(),
    fwbReceived: new NgcFormControl(),
    fhlReceived: new NgcFormControl(),
    rcarTypeCode: new NgcFormControl(),
    exemptionCode: new NgcFormControl(),
    weighingScale: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    shipmentNumberForSelection: new NgcFormControl(),
    totalTagPieces: new NgcFormControl(),
    remainingPieces: new NgcFormControl(),
    weighingDateTime: new NgcFormControl(),
    dgAcceptedWeight: new NgcFormControl(),
    waiveDryIceWeight: new NgcFormControl(),
    measurementUnitCode: new NgcFormControl(),
    shipmentFreightWayBillId: new NgcFormControl(),
    printerQueueName: new NgcFormControl(),
    acceptanceService: new NgcFormGroup({
      status: new NgcFormControl(),
      awbNumber: new NgcFormControl(),
      agentCode: new NgcFormControl(),
      agentName: new NgcFormControl(),
      shipmentDate: new NgcFormArray([]),
      serviceNumber: new NgcFormControl(),
      shipmentNumber: new NgcFormControl(),
      shipmentType: new NgcFormControl('AWB'),
      acceptanceType: new NgcFormControl(),
      totalDryIceWeight: new NgcFormControl(),
      cashHandlingAgent: new NgcFormControl(),
      serviceCreationDate: new NgcFormControl(),
      // segment: new NgcFormControl('ghghghg'),
      authorizationIdentificationName: new NgcFormControl(),
      authorizationIdentificationNumber: new NgcFormControl(),
      // addedShipmentNumber: new  NgcFormControl(),
      addedAwbNumber: new NgcFormArray([]),
    }),
    actionList: new NgcFormArray([]),
    ruleExecutionDetails: new NgcFormGroup({
      execInfoList: new NgcFormArray([]),
      execWarnList: new NgcFormArray([]),
      execErrorList: new NgcFormArray([]),
    }),


    shipment: new NgcFormGroup({
      console: new NgcFormControl(false),
      pieces: new NgcFormControl(),
      weight: new NgcFormControl(),
      origin: new NgcFormControl(NgcUtility.getTenantConfiguration().airportCode, [Validators.required, Validators.maxLength(3)]),
      carrier: new NgcFormControl(),
      truckType: new NgcFormControl(),
      chargeCode: new NgcFormControl(),
      destination: new NgcFormControl('', [Validators.required, Validators.maxLength(3)]),
      awbReceived: new NgcFormControl(),
      rcarTypeCode: new NgcFormControl(),
      customStatus: new NgcFormControl(),
      shipmentDate: new NgcFormControl(),
      firstOffPoint: new NgcFormControl('', [Validators.required, Validators.maxLength(3)]),
      natureOfGoods: new NgcFormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]),
      pouchReceived: new NgcFormControl(),
      shipmentNumber: new NgcFormControl(),
      dgAcceptedWeight: new NgcFormControl(),
      requestedTemperatureRange: new NgcFormControl(),
      flight: new NgcFormGroup({
        std: new NgcFormControl(),
        segment: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        flightType: new NgcFormControl(),
        flightNumber: new NgcFormControl(),
      }),
      shc: new NgcFormArray([]),
    }),
    storageCharge: new NgcFormArray([
      new NgcFormGroup({
        type: new NgcFormControl(),
        weight: new NgcFormControl(),
        required: new NgcFormControl()
      })
    ]),
    remarks: new NgcFormArray([
      new NgcFormGroup({
        type: new NgcFormControl(),
        detail: new NgcFormControl('', [Validators.maxLength(65)]),
      })
    ]),
    dryIceWeight: new NgcFormArray([
      new NgcFormGroup({
        pieces: new NgcFormControl(),
        weight: new NgcFormControl(),
      })
    ]),

    localAuthority: new NgcFormGroup({
      type: new NgcFormControl('PTF'),
      details: new NgcFormArray([
        new NgcFormGroup({
          remarks: new NgcFormControl(),
          license: new NgcFormControl(),
          permitNumbers: new NgcFormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]),
          exemptionCode: new NgcFormControl(),
          appointedAgent: new NgcFormControl(),
          customsAgentCode: new NgcFormControl('PTF'),
          hidePermitValue: new NgcFormControl()
        })
      ])
    }),
    fwbInfo: new NgcFormGroup({
      agent: new NgcFormControl(),
      destination: new NgcFormControl(),
      pieces: new NgcFormControl(),
      weight: new NgcFormControl(),
      natureOfGoods: new NgcFormControl(),
      rcarTypeCode: new NgcFormControl(),
      shcObj: new NgcFormControl(),
      chargeCode: new NgcFormControl(),
    }),
    //////////////////////////////////////////////////////////////////
    generateTag: new NgcFormArray([
      new NgcFormGroup({
        tagId: new NgcFormControl()
      })
    ]),
    xpsTag: new NgcFormArray([
      new NgcFormGroup({
        tagId: new NgcFormControl(),
        pieces: new NgcFormControl()
      })
    ])
    //////////////////////////////////////////////////////////////////
  });

  private form1: NgcFormGroup = new NgcFormGroup({
    totalExportGrossWeight: new NgcFormControl()
  });

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router,
    private _acceptanceService: AcceptanceService) {
    super(appZone, appElement, appContainerElement);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    super.ngOnInit();
    // if(this.form.get(['shipment', 'carrier']).value === null){
    // this.form.get(['shipment', 'flight', 'flightNumber']).valueChanges.subscribe(
    //   (newValue) => {
    //     if (newValue !== null || newValue !== '') {
    //       this.form.get(['shipment', 'carrier']).patchValue(newValue.substring(0, 2));
    //       return;
    //     }
    //   });
    // }
    this.form.get('shipment.shc').patchValue([{
      'code': '',
      'param2': '',
      'shipmentNumber': null
    }, {
      'code': '',
      'param2': '',
      'shipmentNumber': null
    }, {
      'code': '',
      'param2': '',
      'shipmentNumber': null
    }, {
      'code': '',
      'param2': '',
      'shipmentNumber': null
    }, {
      'code': '',
      'param2': '',
      'shipmentNumber': null
    }, {
      'code': '',
      'param2': '',
      'shipmentNumber': null
    }, {
      'code': '',
      'param2': '',
      'shipmentNumber': null
    }, {
      'code': '',
      'param2': '',
      'shipmentNumber': null
    }, {
      'code': '',
      'param2': '',
      'shipmentNumber': null
    }]);
    // this.form.get('localAuthority.type').setValue('PTF');
    this.permitValue = true;
    this.permitToFollowFlag = true;
    this.inputPreLoadgeFlag = true;
    this.displayPreLoadgeFlag = true;

    this.form.get('localAuthority.type').valueChanges.subscribe(
      (newValue) => {
        if (newValue) {
          if (newValue === 'EC') {
            this.permitNumberFlag = false;
            this.excemptionCodeFlag = true;
            this.permitToFollowFlag = false;
          }
          if (newValue === 'PN') {
            this.permitNumberFlag = true;
            this.excemptionCodeFlag = false;
            this.permitToFollowFlag = false;
          }
          if (newValue === 'PTF') {
            this.permitNumberFlag = false;
            this.permitToFollowFlag = true;
            this.excemptionCodeFlag = false;
          }
        }
      }
    );

    this.dataRetrieved = this._acceptanceService.dataFromShipmentSummaryToAwbInformation.data;
    // getting handling Definition 
    this.handlingDefinition = this._acceptanceService.dataFromShipmentSummaryToAwbInformation.handlingDefination;
    // Added AWB no in shipment Screen need to patch in DropDown.    
    this._acceptanceService.dataFromShipmentSummaryToAwbInformation.forEach(element => {
      this.addedShipmentList.push(element.acceptanceService.shipmentNumber);
    });
    // this.form.controls['acceptanceService'].get('addedAwbNumber').patchValue(this.addedShipmentList);
    this.agentCodeRequest = this.dataRetrieved.acceptanceService.agentCode;
    this.agentNameRequest = this.dataRetrieved.acceptanceService.agentName;
    this.defaultShipmentType = this.dataRetrieved.acceptanceService.shipmentType;
    this.authorizationIdentificationNameRequest =
      this.dataRetrieved.acceptanceService.authorizationIdentificationName;
    this.authorizationIdentificationNumberRequest =
      this.dataRetrieved.acceptanceService.authorizationIdentificationNumber;
    this.awbNumberRequest = this.dataRetrieved.acceptanceService.awbNumber;
    if (this.dataRetrieved.acceptanceService.acceptanceType === 'Pre_Lodge_Shipment') {
      this.displayPreLoadgeFlag = true;
      this.inputPreLoadgeFlag = false;
    } else {
      this.inputPreLoadgeFlag = true;
      this.displayPreLoadgeFlag = false;
    }
    // eStartButtonFlag
    if (this.dataRetrieved.acceptanceService.acceptanceType === 'TRUCKING_SERVICE_SURF'
      || this.dataRetrieved.acceptanceService.acceptanceType === 'TRUCKING_SERVICE_FLIGHT'
      || this.dataRetrieved.acceptanceService.acceptanceType === 'TERMINAL_TO_TERMINAL'
      || this.dataRetrieved.acceptanceService.acceptanceType === 'LOCAL_COURIER'
      || this.dataRetrieved.acceptanceService.acceptanceType === 'ECC_ACCEPTANCE') {
      this.eStartButtonFlag = true;
    }

    if (this.dataRetrieved.acceptanceService.acceptanceType === 'LOCAL_COURIER') {
      this.dataRetrieved.acceptanceService.shipmentType = 'UCB';
    }

    // Making 
    this._acceptanceService.onEditEAcceptance(this.dataRetrieved).subscribe(data => {
      this.resp = data;
      this.arrayUser = this.resp.data;
      this.showResponseErrorMessages(data);
      if (!data.messageList) {
        this.showSuccessStatus('g.completed.successfully');
        this.arrayUser.acceptanceService.acceptanceType = this.dataRetrieved.acceptanceService.acceptanceType;
        this.arrayUser.acceptanceService.serviceNumber = this.dataRetrieved.acceptanceService.serviceNumber;
        const shcList = new Array();
        for (let i = 0; i < 9; i++) {
          if (this.arrayUser.shipment.shc !== null && this.arrayUser.shipment.shc[i] != null
            && i < this.arrayUser.shipment.shc.length) {
            shcList.push({ code: this.arrayUser.shipment.shc[i].code });
          } else {
            shcList.push({ code: '' });
          }
        }

        this.arrayUser.shipment.shc = shcList;
        if (this.arrayUser.xpsFlag === true) {
          this.xpsTagData = true;
        }
        this.form.patchValue(this.arrayUser);
        if (this.arrayUser.shipment.shc) {
          for (const eachRow of this.arrayUser.shipment.shc) {
            if (eachRow.code === 'COU') {
              this.couSHCFlag = true;
            }
            if (eachRow.code === 'XPS' || eachRow.value === 'ECC') {
              this.xpsSHCFlag = true;
            }
            if (eachRow.code === 'DGN') {
              this.dgnSHCFlag = true;
            }
          }
        }
        //-----------------------------------------Handling Definition For Validation ------------------------------------//
        if (this.handlingDefinition) {
          // Charge is applicable or not 
          if (this.handlingDefinition[0].handlingDefinition[0].chargesapplicable !== '0') {
            this.form.get(['shipment', 'chargeCode']).setValidators([Validators.required]);
          } else {
            this.form.get(['shipment', 'chargeCode']).clearValidators();
          }
          // Local Authority is required or not
          // if (this.handlingDefinition[0].handlingDefinition[0].requiredlocalauthorityinfo !== null) {
          //   this.form.get(['localAuthority', 'type']).setValue(this.handlingDefinition[0].handlingDefinition[0].requiredlocalauthorityinfo);
          //   if (this.handlingDefinition[0].handlingDefinition[0].requiredlocalauthorityinfo = 'PF') {
          //     this.form.get(['localAuthority', 'details', 0, 'customsAgentCode']).setValue('PTF');
          //   }
          // }
        } else {
          // Mandatory for other which dont have HD
          this.form.get(['shipment', 'chargeCode']).setValidators([Validators.required]);
        }

        //-----------------------------------------Handling Definition For Validation ------------------------------------//
        /*  if ((<NgcFormArray>this.form.get(['localAuthority', 'details'])).length === 0) {
            this.form.get(['localAuthority', 'type']).patchValue('PTF');
            (<NgcFormArray>this.form.get(['localAuthority', 'details'])).addValue([
              {//this.agentCodeRequest
                customsAgentCode: 'PTF',
                appointedAgent: this.agentCodeRequest,
                permitNumbers: '',
                hidePermitValue: '',
                exemptionCode: '',
                license: '',
                remarks: '',
              }
            ]);
          }*/
        // else {
        //   this.form.get(['localAuthority', 'details', 0, 'customsAgentCode']).setValue('PTF');
        //   this.form.get(['localAuthority', 'details', 0, 'appointedAgent']).setValue(this.agentCodeRequest);
        // }
        const eventData = this.form.get(['dryIceWeight', 'weight']);
        this.totalDryIceWeightSubscription(eventData);
        this.form.get(['shipment', 'weight']).setValue(this.arrayUser.shipment.weight);
      } else {
        this.errors = this.resp.messageList;
        this.showErrorStatus(this.errors[0].message);
      }
    }, error => this.showErrorStatus('g.error'));
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngAfterViewInit() {
    // super.ngAfterViewInit();
    this.subscribeForSHCChanges();
    this.subscribeForDryIce();
    this.subscribeTotalGrossWeight();
    this.subscribeFlightNumber();
    this.subscribeAcceptanceType();
    this.subscribeLocalAuthority();
  }


  private subscribeLocalAuthority() {
    this.form.get(['localAuthority', 'type']).valueChanges.subscribe(
      (newValue) => {
        if (newValue === 'PTF') {
          this.form.get(['localAuthority', 'type']).patchValue('PTF');
          this.form.get(['localAuthority', 'details', 0, 'customsAgentCode']).patchValue('PTF');
          this.form.get(['localAuthority', 'details', 0, 'appointedAgent']).patchValue(this.agentCodeRequest);
        }
      });
  }

  private subscribeAcceptanceType() {
    this.form.get(['acceptanceService', 'acceptanceType']).valueChanges.subscribe(
      (newValue) => {
        if (newValue === 'PRE_LODGE_SHIPMENT'
          || newValue === 'E_READY_SHIPMENTS'
          || newValue === 'NAWB_SHIPMENT') {
          this.form.get(['shipment', 'flight', 'flightNumber']).setValidators([Validators.required]);
          this.form.get(['shipment', 'flight', 'flightDate']).setValidators([Validators.required]);
        } else {
          this.form.get(['shipment', 'flight', 'flightNumber']).clearValidators();
          this.form.get(['shipment', 'flight', 'flightDate']).clearValidators();
        }
      });
  }

  subscribeFlightNumber() {
    let flightkey = this.form.get(['shipment', 'flight', 'flightNumber']).value;
    if (flightkey !== null && flightkey !== '') {
      this.form.get(['shipment', 'carrier']).patchValue(flightkey.substring(0, 2));
    }
    this.form.get(['shipment', 'flight', 'flightNumber']).valueChanges.subscribe(
      (newValue) => {
        if (newValue !== null && newValue !== '') {
          this.form.get(['shipment', 'carrier']).patchValue(newValue.substring(0, 2));
        }
      });
  }


  private subscribeForDryIce() {
    const dryIceArray: NgcFormArray = this.form.get('dryIceWeight') as NgcFormArray;
    //
    if (dryIceArray) {
      dryIceArray.valueChanges.subscribe(() => {
        let totalDryIceWeight: number = 0;
        //
        dryIceArray.controls.forEach((formGroup: NgcFormGroup) => {
          const weightControl = formGroup.get('weight');
          //
          if (weightControl) {
            totalDryIceWeight += Number(isNaN(weightControl.value) ? 0 : weightControl.value);
          }
        });
        this.form.get(['acceptanceService', 'totalDryIceWeight']).setValue(totalDryIceWeight);
      });
    }
  }

  private subscribeTotalGrossWeight() {
    const totalGrossWeight: NgcFormArray = this.form.get('storageCharge') as NgcFormArray;
    //
    if (totalGrossWeight) {
      totalGrossWeight.valueChanges.subscribe(() => {
        let totalGW: number = 0;
        //
        totalGrossWeight.controls.forEach((formGroup: NgcFormGroup) => {
          const weightControl = formGroup.get('weight');
          //
          if (weightControl) {
            totalGW += Number(isNaN(weightControl.value) ? 0 : weightControl.value);
          }
        });
        this.form1.get(['totalExportGrossWeight']).setValue(totalGW);
        //-----------------        
        if (totalGW !== 0
          && totalGW > this.form.get(['shipment', 'weight']).value) {
          this.showErrorMessage('expaccpt.gross.weight.more.accepted.weight');
          return;
        } else {
          this.clearErrorList();
        }
      });
    }
  }

  /**
   *
   */
  private subscribeForSHCChanges() {
    const shcArray: NgcFormArray = this.form.get('shipment.shc') as NgcFormArray;
    if (shcArray) {
      shcArray.valueChanges.subscribe(() => {
        let isXPS: boolean = false;
        let isCOU: boolean = false;
        let isDGN: boolean = false;
        //
        shcArray.controls.forEach((formGroup: NgcFormGroup) => {
          const shcGroup = formGroup.get('shcGroup');
          //
          if (shcGroup) {
            if (shcGroup.value === 'XPS' || shcGroup.value === 'ECC') {
              isXPS = true;
            } else if (shcGroup.value === 'COU') {
              isCOU = true;
            } else if (shcGroup.value === 'DGN') {
              isDGN = true;
            }
          }
        });
        if (isXPS) {
          this.xpsSHCFlag = true;
        } else {
          this.xpsSHCFlag = false;
        }
        if (isCOU) {
          this.couSHCFlag = true;
        } else {
          this.couSHCFlag = false;
        }
        if (isDGN) {
          this.dgnSHCFlag = true;
        } else {
          this.dgnSHCFlag = false;
        }
      });
    }
  }

  onSave() {

    if (this.form.get('shipment').get('shc').invalid === true) {
      this.showErrorMessage('expaccpt.provide.valid.shc');
      return;
    }

    this.awbInvalideIndicator = '';
    if (this.form.get('shipment').invalid === true) {
      this.showErrorMessage('expaccpt.awb.details.missing');
      this.awbInvalideIndicator = 'error';
      return;
    }
    this.storageInvalideIndicator = '';
    if (this.form.get('storageCharge').value !== null
      && (<NgcFormArray>this.form.get('storageCharge')).length !== 0
      && this.form.get(['storageCharge', 0, 'type']).value !== null
      && this.form.get(['storageCharge', 0, 'weight']).value === 0) {
      this.showErrorMessage('expaccpt.storage.charges.details.missing');
      this.storageInvalideIndicator = 'error';
      return;
    }

    // Storage weight validation
    if (this.form1.get(['totalExportGrossWeight']).value > this.form.get(['shipment', 'weight']).value) {
      this.showErrorMessage('expaccpt.gross.weight.more.accepted.weight');
      return;
    }
    // -------------------------

    this.awbInformationSave = this.form.getRawValue();
    this.awbInformationSave.acceptanceService.shipmentType = this.defaultShipmentType !== null
      ? this.defaultShipmentType : 'AWB';
    this.awbInformationSave.acceptanceService.agentCode = this.agentCodeRequest;
    this.awbInformationSave.acceptanceService.agentName = this.agentNameRequest;
    this.awbInformationSave.acceptanceService.authorizationIdentificationName = this.authorizationIdentificationNameRequest;
    this.awbInformationSave.acceptanceService.authorizationIdentificationNumber = this.authorizationIdentificationNumberRequest;
    this.awbInformationSave.acceptanceService.awbNumber = this.form.get(['shipment', 'shipmentNumber']).value !== null ?
      this.form.get(['shipment', 'shipmentNumber']).value : this.awbNumberRequest;
    this.awbInformationSave.acceptanceService.shipmentNumber =
      this.form.get(['shipment', 'shipmentNumber']).value !== null ?
        this.form.get(['shipment', 'shipmentNumber']).value : this.awbNumberRequest;
    if (this.awbInformationSave.acceptanceService.acceptanceType === 'TRUCKING_SERVICE_SURF'
      || this.awbInformationSave.acceptanceService.acceptanceType === 'TRUCKING_SERVICE_FLIGHT'
      || this.awbInformationSave.acceptanceService.acceptanceType === 'TERMINAL_TO_TERMINAL'
      || this.awbInformationSave.acceptanceService.acceptanceType === 'LOCAL_COURIER'
      || this.dataRetrieved.acceptanceService.acceptanceType === 'ECC_ACCEPTANCE') {






      this._acceptanceService.isFlightExistInCurrentCosys(this.awbInformationSave).subscribe(response => {
        if (!response.messageList) {

          if (response.data.handledInCurrentCosys === true) {


            this.showConfirmMessage('g.flight.not.handled.confirmation').then(fulfilled => {


              this._acceptanceService.onSaveCargoDocumentForNoAwbValidation(this.awbInformationSave).subscribe(data => {
                this.arrayUser = data.data;
                this.showResponseErrorMessages(data);
                if (!data.messageList) {
                  this.showSuccessStatus('g.completed.successfully');
                } else {
                  this.errors = this.resp.messageList;
                  // this.showErrorStatus(this.errors[0].message);
                }
              }, error => this.showErrorStatus('g.error'));

            }
            ).catch(reason => {

              return;
            });


          } else {




            this._acceptanceService.onSaveCargoDocumentForNoAwbValidation(this.awbInformationSave).subscribe(data => {
              this.arrayUser = data.data;
              this.showResponseErrorMessages(data);
              if (!data.messageList) {
                this.showSuccessStatus('g.completed.successfully');
              } else {
                this.errors = this.resp.messageList;
                // this.showErrorStatus(this.errors[0].message);
              }
            }, error => this.showErrorStatus('g.error'));


          }
        } else {
          const errors = response.messageList;
          if (errors[0].code == null && errors[0].message != null) {
            this.showErrorStatus(errors[0].message);
          } else {
            this.showErrorStatus("data.invalid.dummy.entry");
          }
        }


      });




    } else {





      this._acceptanceService.isFlightExistInCurrentCosys(this.awbInformationSave).subscribe(response => {
        if (!response.messageList) {

          if (response.data.handledInCurrentCosys === true) {


            this.showConfirmMessage('g.flight.not.handled.confirmation').then(fulfilled => {

              this._acceptanceService.onSaveAwbInformation(this.awbInformationSave).subscribe(data => {
                this.arrayUser = data.data;
                this.showResponseErrorMessages(data);
                if (!data.messageList) {
                  this.showSuccessStatus('g.completed.successfully');
                } else {
                  this.errors = this.resp.messageList;
                  this.showErrorStatus(this.errors[0].message);
                }
              }, error => this.showErrorStatus('g.error'));
            }
            ).catch(reason => {

              return;
            });


          } else {

            this._acceptanceService.onSaveAwbInformation(this.awbInformationSave).subscribe(data => {
              this.arrayUser = data.data;
              this.showResponseErrorMessages(data);
              if (!data.messageList) {
                this.showSuccessStatus('g.completed.successfully');
              } else {
                this.errors = this.resp.messageList;
                this.showErrorStatus(this.errors[0].message);
              }
            }, error => this.showErrorStatus('g.error'));





          }
        } else {
          const errors = response.messageList;
          if (errors[0].message != null) {
            this.showErrorStatus(errors[0].message);
          } else {
            this.showErrorStatus("data.invalid.dummy.entry");
          }
        }


      });




    }
  }





  private startEacceptanceParent() {
    const eAcceptanceData = this.form.getRawValue();
    this.retrieveDropDownListRecords('Acceptance$LodgeInTime').subscribe(data => {

      this.dropdownData = data;

      this.dropdownData.forEach(element => {
        if (element.code === "EarlyLodgeIn") {
          this.earlyLodgeInTime = element.desc;
        } else if (eAcceptanceData.shipment.flight.flightType === 'P' && element.code === "LateLodgeIn_PAX") {
          this.lateLodgeInTime = element.desc;
        } else if (eAcceptanceData.shipment.flight.flightType === 'C' && element.code === "LateLoggeIn_CAO") {
          this.lateLodgeInTime = element.desc;
        }
      });


      if (eAcceptanceData.shipment != null && eAcceptanceData.shipment.flight != null) {
        if (eAcceptanceData.shipment.flight.flightNumber != null
          && eAcceptanceData.shipment.flight.flightDate != null) {
          this.currentDateTime = new Date();
          if (this.fightDateSTD != null ||
            (this.fightDateSTD != null && this.fightDateSTD != '')) {

            var differnceInTime = (this.fightDateSTD.getTime() -
            this.currentDateTime.getTime()) / 1000;
          differnceInTime /= (60 * 60);
          } else {
            differnceInTime = -1;
          }


        }
      }



      if (differnceInTime > 0 && NgcUtility.isTenantAirport(eAcceptanceData.shipment.origin)) {
        if (differnceInTime < this.lateLodgeInTime) {
          this.showConfirmMessage('exp.accpt.latelodgein').then(fulfilled => {
            this.onStartAcceptance();
          }
          ).catch(reason => {

            return;
          });
        }

        else if (Math.abs(differnceInTime) > this.earlyLodgeInTime) {
          this.showConfirmMessage('exp.accpt.earlylodgein').then(fulfilled => {
            this.onStartAcceptance();
          }
          ).catch(reason => {

            return;
          });
        } else {
          this.onStartAcceptance();
        }
      } else {
        this.onStartAcceptance();
      }



    });



  }

  onStartAcceptance() {
    if (this.form.get('shipment').get('shc').invalid === true) {
      this.showErrorMessage('expaccpt.provide.valid.shc');
      return;
    }

    this.awbInvalideIndicator = '';
    if (this.form.get('shipment').invalid === true) {
      this.showErrorMessage('expaccpt.awb.details.missing');
      this.awbInvalideIndicator = 'error';
      return;
    }
    this.storageInvalideIndicator = '';
    if (this.form.get('storageCharge').value !== null
      && (<NgcFormArray>this.form.get('storageCharge')).length !== 0
      && this.form.get(['storageCharge', 0, 'type']).value !== null
      && this.form.get(['storageCharge', 0, 'weight']).value === 0) {
      this.showErrorMessage('expaccpt.storage.charges.details.missing');
      this.storageInvalideIndicator = 'error';
      return;
    }

    // Storage weight validation
    if (this.form1.get(['totalExportGrossWeight']).value > this.form.get(['shipment', 'weight']).value) {
      this.showErrorMessage('expaccpt.gross.weight.more.accepted.weight');
      return;
    }
    // -------------------------
    this.eAcceptanceData = this.form.getRawValue();
    this.eAcceptanceData.acceptanceService.shipmentType = this.defaultShipmentType !== null
      ? this.defaultShipmentType : 'AWB';
    this.eAcceptanceData.acceptanceService.agentCode = this.agentCodeRequest;
    this.eAcceptanceData.acceptanceService.agentName = this.agentNameRequest;
    this.eAcceptanceData.acceptanceService.authorizationIdentificationName =
      this.authorizationIdentificationNameRequest;
    this.eAcceptanceData.acceptanceService.authorizationIdentificationNumber =
      this.authorizationIdentificationNumberRequest;
    this.eAcceptanceData.acceptanceService.awbNumber =
      this.form.get(['shipment', 'shipmentNumber']).value != null ?
        this.form.get(['shipment', 'shipmentNumber']).value
        : this.awbNumberRequest;
    this.eAcceptanceData.acceptanceService.shipmentNumber =
      this.form.get(['shipment', 'shipmentNumber']).value != null ?
        this.form.get(['shipment', 'shipmentNumber']).value
        : this.awbNumberRequest;
    this.eAcceptanceData.printerQueueName = this.form.get('printerQueueName').value;
    if (this.eAcceptanceData.acceptanceService.acceptanceType === 'TRUCKING_SERVICE_SURF'
      || this.eAcceptanceData.acceptanceService.acceptanceType === 'TRUCKING_SERVICE_FLIGHT'
      || this.eAcceptanceData.acceptanceService.acceptanceType === 'TERMINAL_TO_TERMINAL'
      || this.eAcceptanceData.acceptanceService.acceptanceType === 'LOCAL_COURIER'
      || this.dataRetrieved.acceptanceService.acceptanceType === 'ECC_ACCEPTANCE') {





      this._acceptanceService.isFlightExistInCurrentCosys(this.eAcceptanceData).subscribe(response => {
        if (!response.messageList) {

          if (response.data.handledInCurrentCosys === true) {


            this.showConfirmMessage('g.flight.not.handled.confirmation').then(fulfilled => {
              this._acceptanceService.onStartEAcceptanceForNoAwbValidation(this.eAcceptanceData).subscribe(data1 => {
                this.resp = data1;
                this.arrayUser = this.resp.data;
                this.showResponseErrorMessages(data1.data);
                if (!data1.messageList) {
                  this.showSuccessStatus('g.completed.successfully');
                } else {
                  this.errors = this.resp.messageList;
                  this.showErrorStatus(this.errors[0].message);
                }
              }, error => this.showErrorStatus('g.error'));
            }
            ).catch(reason => {

              return;
            });


          } else {



            this._acceptanceService.onStartEAcceptanceForNoAwbValidation(this.eAcceptanceData).subscribe(data1 => {
              this.resp = data1;
              this.arrayUser = this.resp.data;
              this.showResponseErrorMessages(data1.data);
              if (!data1.messageList) {
                this.showSuccessStatus('g.completed.successfully');
              } else {
                this.errors = this.resp.messageList;
                this.showErrorStatus(this.errors[0].message);
              }
            }, error => this.showErrorStatus('g.error'));


          }
        } else {
          const errors = response.messageList;
          if (errors[0].message != null) {
            this.showErrorStatus(errors[0].message);
          } else {
            this.showErrorStatus("data.invalid.dummy.entry");
          }
        }


      });









    } else {



      this._acceptanceService.isFlightExistInCurrentCosys(this.eAcceptanceData).subscribe(response => {
        if (!response.messageList) {

          if (response.data.handledInCurrentCosys === true) {


            this.showConfirmMessage('g.flight.not.handled.confirmation').then(fulfilled => {
              this._acceptanceService.onStartEAcceptance(this.eAcceptanceData).subscribe(data1 => {
                this.resp = data1;
                this.arrayUser = this.resp.data;
                this.showResponseErrorMessages(data1.data);
                if (!data1.messageList) {
                  this.showSuccessStatus('g.completed.successfully');
                } else {
                  this.errors = this.resp.messageList;
                  this.showErrorStatus(this.errors[0].message);
                }
              }, error => this.showErrorStatus('g.error'));
            }
            ).catch(reason => {

              return;
            });


          } else {



            this._acceptanceService.onStartEAcceptance(this.eAcceptanceData).subscribe(data1 => {
              this.resp = data1;
              this.arrayUser = this.resp.data;
              this.showResponseErrorMessages(data1.data);
              if (!data1.messageList) {
                this.showSuccessStatus('g.completed.successfully');
              } else {
                this.errors = this.resp.messageList;
                this.showErrorStatus(this.errors[0].message);
              }
            }, error => this.showErrorStatus('g.error'));


          }
        } else {
          const errors = response.messageList;
          if (errors[0].message != null) {
            this.showErrorStatus(errors[0].message);
          } else {
            this.showErrorStatus("data.invalid.dummy.entry");
          }
        }


      });





    }
  }

  genarateTag() {
    const generateTagRequest = this.form.getRawValue();
    this._acceptanceService.onGenerateTag(generateTagRequest).subscribe(data1 => {
      this.resp = data1;
      this.arrayUser = this.resp.data;
      this.showResponseErrorMessages(data1);
      // if (!data1.messageList) {
      this.showSuccessStatus('export.tag.generated.successfully');
      (this.form.get('generatedTags').setValue(this.arrayUser.generatedTags));
    }, error => this.showErrorStatus('g.servernotresponding.m'));
  }

  onAddxpsTag() {
    (<NgcFormArray>this.form.get('xpsTag')).addValue([
      {
        tagId: '',
        pieces: 0
      }
    ]);
  }

  onDeletexpsTag(index) {
    (<NgcFormArray>this.form.get('xpsTag')).deleteValueAt(index);

  }

  onAddStorage() {
    (<NgcFormArray>this.form.get('storageCharge')).addValue([
      {
        type: '1',
        weight: 0.0,
        required: false
      }
    ]);
  }

  onAddDryIce() {
    (<NgcFormArray>this.form.get('dryIceWeight')).addValue([
      {
        pieces: '',
        weight: 0.0
      }
    ]);
  }

  onAddPermitNumber(index) {
    (<NgcFormArray>this.form.get('localAuthority.details')).addValue([
      {
        permitNumbers: ''
      }
    ]);
    if (this.form.controls.localAuthority.get(['details', index, 'hidePermitValue'])) {
      this.permitValue = false;
    }
  }

  onAddRemarks() {
    (<NgcFormArray>this.form.get('remarks')).addValue([
      {
        type: '',
        detail: ''
      }
    ]);
  }

  onDeleteDryIce(index) {
    (<NgcFormArray>this.form.get('dryIceWeight')).deleteValueAt(index);

  }

  onDeleteGenerate(index) {
    (<NgcFormArray>this.form.get('generateTag')).deleteValueAt(index);
  }

  onDeleteStorage(index) {
    if (this.form.get(['storageCharge', index, 'required']).value != null
      && this.form.get(['storageCharge', index, 'required']).value == true) {
      this.showErrorMessage('exp.accpt.storagecharge.mandatory.cannot.delete');
      return
    }
    (<NgcFormArray>this.form.get('storageCharge')).deleteValueAt(index);
  }

  onDeleteRemarks(index) {
    (<NgcFormArray>this.form.get('remarks')).deleteValueAt(index);
  }

  onSelectSHCCOU(event, index) {
    let shcGroup: NgcFormGroup = <NgcFormGroup>this.form.get(['shipment', 'shc', index]);
    //

    if (shcGroup) {
      if (!shcGroup.get('shcGroup')) {
        shcGroup.addControl('shcGroup', new NgcFormControl());
      }
      let shcGroupControl: NgcFormControl = <NgcFormControl>shcGroup.get('shcGroup');
      //
      if (shcGroupControl) {
        shcGroupControl.setValue(event.param2);
      }
    }
  }
  onDeletePermitNumberRows(index) {
    (<NgcFormArray>this.form.get('localAuthority.details')).deleteValueAt(index);
  }

  totalDryIceWeightSubscription(event) {
    this.totaldryiceWeight = this.totaldryiceWeight + +event;
    this.form.get(['acceptanceService', 'totalDryIceWeight']).patchValue(this.totaldryiceWeight);
  }

  totalDryIceWeightSubscriptionOnDelete(event) {
    this.totaldryiceWeight = this.totaldryiceWeight - +event;
    this.form.get(['acceptanceService', 'totalDryIceWeight']).patchValue(this.totaldryiceWeight);
  }
  // >>>>>>>>>>>>>>>>>>>>>>>
  totalExportStorageGrossWeight(event) {
    this.totalExportGrossWeight = this.totalExportGrossWeight + +event;
  }

  totalExportStorageGrossWeightOnDelete(event) {
    this.totalExportGrossWeight = this.totalExportGrossWeight - +event;
  }

  routeToDG() {
    this.navigateTo(this.router, '/export/dangerousgoods/dgdradioactive',
      this.form.get('shipment').value);
  }
  public onClickOfFreightAcceptance(event) {
    const rowData = (<NgcFormControl>this.form.get(['shipment', 'shipmentNumber'])).value;
    this.navigateTo(this.router, '/export/acceptance/manageacceptanceweighing',
      this.form.get('shipment.shipmentNumber').value);
  }

  createHouseInfo(tagList: any[]): Array<HouseInformationModel> {
    const houseArray = new Array<HouseInformationModel>();
    if (this.couSHCFlag) {
      if (tagList !== null
        && tagList.length !== 0) {
        tagList.forEach(tag => {
          const house = new HouseInformationModel();
          house.type = 'COU';
          house.number = tag;
          houseArray.push(house);
        });
      }
    }
    if (this.xpsSHCFlag) {
      (<NgcFormArray>this.form.get('xpsTag')).controls.forEach((xps: NgcFormGroup) => {
        const house = new HouseInformationModel();
        house.type = 'XPS';
        house.number = xps.get('tagId').value;
        house.pieces = xps.get('pieces').value;
        houseArray.push(house);
      });
    }
    return houseArray;
  }


  onChangeFlightdetails() {
    const awbInformationSave = this.form.getRawValue();
    let flightkey = this.form.get(['shipment', 'flight', 'flightNumber']).value;
    let flighdate = this.form.get(['shipment', 'flight', 'flightDate']).value;
    if (flightkey != null && flightkey != undefined && flighdate != null && flighdate != undefined) {
      this._acceptanceService.getFlightDetail(awbInformationSave).subscribe(response => {
        if (response != null) {
          if (response.data.shipment.flight == null || response.data.shipment.flight == undefined) {
            this.form.get(['shipment', 'flight', 'segment']).patchValue(null);
            this.form.get(['shipment', 'flight', 'std']).patchValue(null);
            this.form.get(['shipment', 'flight', 'flightType']).patchValue(null);
            this.fightDateSTD = null;
            this.flightType = null;
          }
          if (response.data.shipment.flight != null || response.data.shipment.flight != undefined) {
            this.fightDateSTD = NgcUtility.toDateFromLocalDate(response.data.shipment.flight.dateSTD);
          this.form.get(['shipment', 'flight', 'segment']).patchValue(response.data.shipment.flight.segment);
          this.form.get(['shipment', 'flight', 'std']).patchValue(response.data.shipment.flight.std);
            this.form.get(['shipment', 'flight', 'flightType']).patchValue(response.data.shipment.flight.flightType);
            this.form.get(['shipment', 'flight', 'flightType']).patchValue(response.data.shipment.flight.flightType);
          }



        }
      }
      )
    };


  }

  onClickAwbDropDown(event) {

    this.form.get(['shipment', 'shipmentNumber']).setValue(event);
    this.dataRetrieved.acceptanceService.shipmentNumber = event;
    this._acceptanceService.onEditEAcceptance(this.dataRetrieved).subscribe(data => {
      this.resp = data;
      this.arrayUser = this.resp.data;
      this.showResponseErrorMessages(data);
      if (!data.messageList) {
        this.showSuccessStatus('g.completed.successfully');
        this.arrayUser.acceptanceService.acceptanceType = this.dataRetrieved.acceptanceService.acceptanceType;
        this.arrayUser.acceptanceService.serviceNumber = this.dataRetrieved.acceptanceService.serviceNumber;
        if ((this.arrayUser.shipment.customStatus !== null && this.arrayUser.shipment.customStatus === 'OPEN')
          || this.arrayUser.shipment.customStatus === null) {
          this.eStartButtonFlag = false;
        } else {
          this.eStartButtonFlag = true;
        }
        const shcList = new Array();
        for (let i = 0; i < 9; i++) {
          if (this.arrayUser.shipment.shc !== null && this.arrayUser.shipment.shc[i] != null
            && i < this.arrayUser.shipment.shc.length) {
            shcList.push({ code: this.arrayUser.shipment.shc[i].code });
          } else {
            shcList.push({ code: '' });
          }
        }
        this.arrayUser.shipment.shc = shcList;
        if (this.arrayUser.xpsFlag === true) {
          this.xpsTagData = true;
        }

        this.arrayUser.acceptanceService.agentCode = this.dataRetrieved.acceptanceService.agentCode;
        // this.agentCodeFilter = this.createSourceParameter(this.dataRetrieved.acceptanceService.agentCode);
        this.arrayUser.acceptanceService.agentName = this.dataRetrieved.acceptanceService.agentName;
        this.arrayUser.acceptanceService.awbNumber = this.dataRetrieved.acceptanceService.shipmentNumber;
        this.arrayUser.acceptanceService.shipmentType = this.dataRetrieved.acceptanceService.shipmentType;
        this.arrayUser.acceptanceService.serviceNumber = this.dataRetrieved.acceptanceService.serviceNumber;
        this.arrayUser.acceptanceService.shipmentNumber = this.dataRetrieved.acceptanceService.shipmentNumber;
        this.arrayUser.acceptanceService.acceptanceType = this.dataRetrieved.acceptanceService.acceptanceType;
        this.arrayUser.acceptanceService.authorizationIdentificationName = this.dataRetrieved.acceptanceService.authorizationIdentificationName;
        this.arrayUser.acceptanceService.authorizationIdentificationNumber = this.dataRetrieved.acceptanceService.authorizationIdentificationNumber;

        this.form.patchValue(this.arrayUser);
        const eventData = this.form.get(['dryIceWeight', 'weight']);
        this.totalDryIceWeightSubscription(eventData);
      } else {
        this.errors = this.resp.messageList;
        this.showErrorStatus(this.errors[0].message);
      }
    }, error => this.showErrorStatus('g.error'));
  }


  onCancel(event) {
    this._acceptanceService.dataToSearchOnShipmentSummary = this.form.controls.shipment.get('shipmentNumber').value;
    const pageFlag = true;
    this.navigateBack(pageFlag);
  }

  /**
  * On Destroy
  */
  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
