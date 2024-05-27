import { request } from 'http';
import { log } from 'util';
import { Shipment, HouseInformationModel, CargoWeighingRevisedServiceModelRevised, ShipmentModel } from './../../export.sharedmodel';
import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, PageConfiguration, NgcUtility
} from 'ngc-framework';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, Validators } from '@angular/forms';
import { AcceptanceService } from '../acceptance.service';

@Component({
  selector: 'ngc-manage-cargo-transhipment-courier',
  templateUrl: './manage-cargo-transhipment-courier.component.html',
  styleUrls: ['./manage-cargo-transhipment-courier.component.scss']
})

export class ManageCargoTranshipmentCourierComponent extends NgcPage {
  disableSaveFlag = false;
  arrayUser: any;
  xpsTagData: any;
  permitValue: boolean;
  totaldryiceWeight = 0;
  dataRetrievedRequest: any;
  fightDateSTD: any;
  permitNumberFlag: boolean;
  exemptionCode: any;
  totalExportGrossWeight = 0;
  excemptionCodeFlag: boolean;
  permitToFollowFlag: boolean;
  shcsFromService: any;
  actionListIndicator: string = '';
  remarksIndicator: string = '';
  couSHCFlag: boolean = false;
  xpsSHCFlag: boolean = false;
  dgnSHCFlag: boolean = false;
  isPerishableShipment: boolean = false;
  awbInvalideIndicator: string = '';
  storageInvalideIndicator: string = '';
  dataRetrievedFromManageCargoAcceptance: any;
  private form: NgcFormGroup = new NgcFormGroup({
    eawb: new NgcFormControl(),
    house: new NgcFormArray([]),
    endTag: new NgcFormControl(),
    xpsFlag: new NgcFormControl(),
    dgnFlag: new NgcFormControl(),
    couFlag: new NgcFormControl(),
    startTag: new NgcFormControl(),
    xpsHouse: new NgcFormArray([]),
    couHouse: new NgcFormArray([]),
    fwbReceived: new NgcFormControl(),
    fhlReceived: new NgcFormControl(),
    rcarTypeCode: new NgcFormControl(),
    generatedTags: new NgcFormControl(),
    exemptionCode: new NgcFormControl(),
    weighingScale: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    totalTagPieces: new NgcFormControl(),
    remainingPieces: new NgcFormControl(),
    weighingDateTime: new NgcFormControl(),
    dgAcceptedWeight: new NgcFormControl(),
    waiveDryIceWeight: new NgcFormControl(),
    measurementUnitCode: new NgcFormControl(),
    shipmentFreightWayBillId: new NgcFormControl(),
    shipmentNumberForSelection: new NgcFormControl(),
    acceptanceService: new NgcFormGroup({
      status: new NgcFormControl(),
      awbNumber: new NgcFormControl(),
      agentCode: new NgcFormControl(),
      agentName: new NgcFormControl(),
      shipmentDate: new NgcFormArray([]),
      serviceNumber: new NgcFormControl(),
      shipmentNumber: new NgcFormControl(),
      acceptanceType: new NgcFormControl(),
      totalDryIceWeight: new NgcFormControl(),
      cashHandlingAgent: new NgcFormControl(),
      shipmentType: new NgcFormControl('AWB'),
      serviceCreationDate: new NgcFormControl(),
      authorizationIdentificationName: new NgcFormControl(),
      authorizationIdentificationNumber: new NgcFormControl(),
      customerId: new NgcFormControl(),
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
      natureOfGoods: new NgcFormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      pouchReceived: new NgcFormControl(),
      shipmentNumber: new NgcFormControl(),
      dgAcceptedWeight: new NgcFormControl(),
      requestedTemperatureRange: new NgcFormControl(),
      flight: new NgcFormGroup({
        std: new NgcFormControl(),
        segment: new NgcFormControl(),
        flightType: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        flightNumber: new NgcFormControl('', [Validators.minLength(6), Validators.maxLength(8)]),
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
          hidePermitValue: new NgcFormControl(),
          tsredocFlightKey: new NgcFormControl('', [Validators.minLength(6), Validators.maxLength(8)]),
          tsredocFlightDate: new NgcFormControl()
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
      shc: new NgcFormControl()
    }),
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
  });
  private form1: NgcFormGroup = new NgcFormGroup({
    totalExportGrossWeight: new NgcFormControl()
  });

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router,
    private activatedRoute: ActivatedRoute, private _acceptanceService: AcceptanceService) {
    super(appZone, appElement, appContainerElement);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    super.ngOnInit();
    this.dataRetrievedRequest = {};
    this.dataRetrievedFromManageCargoAcceptance = this.getNavigateData(this.activatedRoute);
    this.dataRetrievedRequest.acceptanceService = this.dataRetrievedFromManageCargoAcceptance;
    this.manageawbinformation();
    this._acceptanceService.onEditEAcceptance(this.dataRetrievedRequest).subscribe(response => {
      if ((response.data.ruleExecutionDetails.execWarnList.length > 0 && response.data.ruleExecutionDetails.execWarnList[0].status != "CLOSED")
        || (response.data.ruleExecutionDetails.execInfoList.length > 0 && response.data.ruleExecutionDetails.execInfoList[0].status != "CLOSED")
        || (response.data.ruleExecutionDetails.execErrorList.length > 0 && response.data.ruleExecutionDetails.execErrorList[0].status != "CLOSED")) {
        this.actionListIndicator = 'error';
      }
      this.arrayUser = response.data;
      if (this.arrayUser.shipment.shc) {
        this.shcsFromService = this.arrayUser.shipment.shc.map(shc => shc.code);
        this.setSHCs();
      }
      this.arrayUser.xpsHouse = [];
      this.arrayUser.couHouse = [];
      if (this.arrayUser.house) {
        for (const eachRow of this.arrayUser.house) {
          if (eachRow.type === 'XPS') {
            this.arrayUser.xpsHouse.push(eachRow);
          }
          if (eachRow.type === 'COU') {
            this.arrayUser.couHouse.push(eachRow);
          }
        }
      }
      this.arrayUser.acceptanceService.agentCode = this.dataRetrievedFromManageCargoAcceptance.agentCode;
      this.arrayUser.acceptanceService.agentName = this.dataRetrievedFromManageCargoAcceptance.agentName;
      this.arrayUser.acceptanceService.awbNumber = this.dataRetrievedFromManageCargoAcceptance.shipmentNumber;
      this.arrayUser.acceptanceService.shipmentType = this.dataRetrievedFromManageCargoAcceptance.shipmentType;
      this.arrayUser.acceptanceService.serviceNumber = this.dataRetrievedFromManageCargoAcceptance.serviceNumber;
      this.arrayUser.acceptanceService.shipmentNumber = this.dataRetrievedFromManageCargoAcceptance.shipmentNumber;
      this.arrayUser.acceptanceService.acceptanceType = this.dataRetrievedFromManageCargoAcceptance.acceptanceType;
      this.arrayUser.acceptanceService.authorizationIdentificationName = this.dataRetrievedFromManageCargoAcceptance.authorizationIdentificationName;
      this.arrayUser.acceptanceService.authorizationIdentificationNumber = this.dataRetrievedFromManageCargoAcceptance.authorizationIdentificationNumber;

      this.arrayUser.acceptanceService.serviceCreationDate = this.dataRetrievedFromManageCargoAcceptance.servicecreationdate;
      this.arrayUser.acceptanceService.printerNameForAT = this.dataRetrievedFromManageCargoAcceptance.printerNameForAT;
      this.arrayUser.shipment.pouchReceived = this.dataRetrievedFromManageCargoAcceptance.pouchReceived;
      this.arrayUser.shipment.rcarTypeCode = this.dataRetrievedFromManageCargoAcceptance.rcarTypeCode;
      this.arrayUser.shipment.awbReceived = this.dataRetrievedFromManageCargoAcceptance.awbReceived;
      this.exemptionCode = this.dataRetrievedFromManageCargoAcceptance.exemptionCode;
      this.form.get(['shipment', 'flight', 'flightNumber']).setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(8)]);
      this.form.get(['shipment', 'flight', 'flightDate']).setValidators([Validators.required]);

      this.showResponseErrorMessages(response);
      if (!response.messageList) {
        this.showSuccessStatus('g.completed.successfully');
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
        this.restrictUpdateAfterShipmentNumberAccepted(this.arrayUser);
        this.form.patchValue(this.arrayUser);
        this.form.get(['localAuthority', 'details', 0, 'appointedAgent']).setValue(this.dataRetrievedFromManageCargoAcceptance.agentCode);
        this.form.get(['shipment', 'dgAcceptedWeight']).setValue(this.form.get(['shipment', 'weight']).value);
        //-- Handling Definition For Validation --//
        if (this.dataRetrievedFromManageCargoAcceptance.handlingDefination) {
          // Charge is applicable or not 
          if (this.dataRetrievedFromManageCargoAcceptance.handlingDefination[0].handlingDefinition[0].chargesapplicable !== '0') {
            this.form.get(['shipment', 'chargeCode']).setValidators([Validators.required]);
          } else {
            this.form.get(['shipment', 'chargeCode']).clearValidators();
          }
        } else {
          this.form.get(['shipment', 'chargeCode']).setValidators([Validators.required]);
        }
        const eventData = this.form.get(['dryIceWeight', 'weight']);
        this.totalDryIceWeightSubscription(eventData);
        this.form.get(['shipment', 'weight']).setValue(this.arrayUser.shipment.weight);
      } else {
        const errors = response.messageList;
        if (errors[0].message != null) {
          this.showErrorStatus(errors[0].message);
        } else if (errors[0].code != null) {
          this.showResponseErrorMessages(response);
        } else {
          this.showErrorStatus("data.invalid.dummy.entry");
        }
      }
      this.subscribeForSHCChanges();
      this.subscribeForDryIce();
      this.subscribeTotalGrossWeight();
      this.subscribeFlightNumber();
      this.subscribeLocalAuthority();
      if (this.dataRetrievedFromManageCargoAcceptance.origin != null && this.dataRetrievedFromManageCargoAcceptance.origin != undefined) {
        this.getOrigin(this.dataRetrievedFromManageCargoAcceptance.origin);
      }
    }, error => this.showErrorStatus('g.error'));
  }

  // tslint:disable-next-line:use-life-cycle-interface
  // public ngAfterViewInit() {
  //   // super.ngAfterViewInit();

  // }
  private getOrigin(value) {
    if (NgcUtility.isTenantCityOrAirport(value)) {

      if (this.exemptionCode != null && this.exemptionCode != undefined) {
        this.form.get('localAuthority.type').setValue('EC');
        this.form.get(['localAuthority', 'details', 0, 'exemptionCode']).setValue(this.exemptionCode);

      } else {
        this.form.get('localAuthority.type').setValue('PTF');
        this.form.get(['localAuthority', 'details', 0, 'customsAgentCode']).patchValue('PTF');
        this.form.get(['localAuthority', 'details', 0, 'appointedAgent']).patchValue(this.dataRetrievedFromManageCargoAcceptance.agentCode);
      }
    } else {
      this.form.get('localAuthority.type').setValue('EC');
      if (this.exemptionCode != null && this.exemptionCode != undefined) {
        this.form.get(['localAuthority', 'details', 0, 'exemptionCode']).setValue(this.exemptionCode);
      } else {
        this.form.get(['localAuthority', 'details', 0, 'exemptionCode']).setValue('TS');
      }

    }
  }
  setSHCs() {
    this.retrieveLOVRecords('SHC_WITH_GROUP').subscribe(data => {
      const shcs = data.filter(shc => this.shcsFromService.includes(shc.code));
      let i = 0;
      shcs.filter(e => {
        if (e.param2 === 'DGN') {
          this.dgnSHCFlag = true;
        } else if (e.param2 === 'XPS' || e.param2 === 'ECC') {
          this.xpsSHCFlag = true;
        } else if (e.param2 === 'COU') {
          this.couSHCFlag = true;
        } else if (e.param2 === 'BEP') {
          this.isPerishableShipment = true;
        }
        this.onSelectSHCCOU(e.param2, i);
        i++;
      });
    });
  }

  private subscribeLocalAuthority() {
    this.form.get(['localAuthority', 'type']).valueChanges.subscribe(
      (newValue) => {
        if (newValue === 'PTF') {
          // this.form.get(['localAuthority', 'type']).patchValue('PTF');
          this.form.get(['localAuthority', 'details', 0, 'customsAgentCode']).patchValue('PTF');
          this.form.get(['localAuthority', 'details', 0, 'appointedAgent']).patchValue(this.dataRetrievedFromManageCargoAcceptance.agentCode);
        }
      });
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
          }
          if (response.data.shipment.flight != null || response.data.shipment.flight != undefined) {
            this.fightDateSTD = NgcUtility.toDateFromLocalDate(response.data.shipment.flight.dateSTD);
            this.form.get(['shipment', 'flight', 'segment']).patchValue(response.data.shipment.flight.segment);
            this.form.get(['shipment', 'flight', 'std']).patchValue(response.data.shipment.flight.std);
            this.form.get(['shipment', 'flight', 'flightType']).patchValue(response.data.shipment.flight.flightType);
          }



        }
      }
      )
    };


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
    if (totalGrossWeight) {
      totalGrossWeight.valueChanges.subscribe(() => {
        let totalGW: number = 0;
        totalGrossWeight.controls.forEach((formGroup: NgcFormGroup) => {
          const weightControl = formGroup.get('weight');
          if (weightControl) {
            totalGW += Number(isNaN(weightControl.value) ? 0 : weightControl.value);
          }
        });
        this.form1.get(['totalExportGrossWeight']).setValue(totalGW);
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
    /* for billing */
    this.callExportChargeMandatory(shcArray);
    if (shcArray) {
      shcArray.valueChanges.subscribe(() => {
        let isXPS: boolean = false;
        let isCOU: boolean = false;
        let isDGN: boolean = false;
        //
        shcArray.controls.forEach((formGroup: NgcFormGroup) => {
          const shcGroup = formGroup.get('shcGroup');
          /* for billing */
          this.callExportChargeMandatory(shcGroup.value);
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
    this.awbInvalideIndicator = '';

    if (this.form.get('shipment').get('shc').invalid === true) {
      this.showErrorMessage('expaccpt.provide.valid.shc');
      return;
    }

    if (this.form.get('shipment').invalid === true) {
      this.showErrorMessage('expaccpt.awb.details.missing');
      this.awbInvalideIndicator = 'error';
      return;
    }
    this.storageInvalideIndicator = '';
    const storageChargeList: NgcFormArray = (<NgcFormArray>this.form.get('storageCharge'));
    let shcs: Array<any> = new Array();
    let flag = 0;
    storageChargeList.controls.forEach(storage => {
      if (
        (storage.get('required').value != null && storage.get('required').value != undefined &&
          storage.get('required').value == true) && (
          (storage.get('type').value == null || storage.get('type').value == undefined)

        )
      ) {
        flag = 1;
      }
    });


    if (flag == 1) {
      this.showErrorMessage('expaccpt.storage.charges.details.missing');
      this.storageInvalideIndicator = 'error';
      return;
    }

    /* this.storageInvalideIndicator = '';
    if (this.form.get('storageCharge').value !== null
      && (<NgcFormArray>this.form.get('storageCharge')).length !== 0
      && (this.form.get(['storageCharge', 0, 'type']).value === null
        || this.form.get(['storageCharge', 0, 'weight']).value === 0
        || this.form.get(['storageCharge', 0, 'weight']).value === null)) {
  
      this.showErrorMessage('Storage Charges mandatory information is missing..');
      this.storageInvalideIndicator = 'error';
      return;
    } */
    if (this.form1.get(['totalExportGrossWeight']).value > this.form.get(['shipment', 'weight']).value) {
      this.showErrorMessage('expaccpt.gross.weight.more.accepted.weight');
      return;
    }
    const awbInformationSave = this.form.getRawValue();
    if (awbInformationSave.xpsHouse) {
      awbInformationSave.house.push(...awbInformationSave.xpsHouse);
    }
    if (awbInformationSave.couHouse) {
      awbInformationSave.house.push(...awbInformationSave.couHouse);
    }
    awbInformationSave.acceptanceService.shipmentType = this.dataRetrievedFromManageCargoAcceptance.shipmentType;




    this._acceptanceService.isFlightExistInCurrentCosys(awbInformationSave).subscribe(response => {
      if (!response.messageList) {

        if (response.data.handledInCurrentCosys === true) {


          this.showConfirmMessage('g.flight.not.handled.confirmation').then(fulfilled => {

            this._acceptanceService.onSaveAwbInformation(awbInformationSave).subscribe(response => {
              this.showResponseErrorMessages(response);
              if (!response.messageList) {
                this.showSuccessStatus('g.completed.successfully');
                this.remarksIndicator = '';
              } else {
                const errors = response.messageList;
                if (errors[0].message != null) {
                  this.showErrorStatus(errors[0].message);
                } else if (errors[0].code != null) {
                  this.showErrorStatus(errors[0].code);
                } else {
                  this.showErrorStatus("data.invalid.dummy.entry");
                }
                let remarksinvalidcount: any = 0;
                let remarkerror: any = null;
                errors.forEach(errormessage => {
                  if (errormessage.referenceId.includes('remarks')) {
                    this.remarksIndicator = 'error';
                    remarksinvalidcount = remarksinvalidcount + 1;
                    remarkerror = errormessage.code;
                  }
                });
                if (remarksinvalidcount > 0) {
                  this.remarksIndicator = 'error';
                  this.showErrorStatus(remarkerror);
                } else if (remarksinvalidcount == 0) {
                  this.remarksIndicator = '';
                }
              }
            });
          }
          ).catch(reason => {

            return;
          });


        } else {




          this._acceptanceService.onSaveAwbInformation(awbInformationSave).subscribe(response => {
            this.showResponseErrorMessages(response);
            if (!response.messageList) {
              this.showSuccessStatus('g.completed.successfully');
              this.remarksIndicator = '';
            } else {
              const errors = response.messageList;
              if (errors[0].message != null) {
                this.showErrorStatus(errors[0].message);
              } else if (errors[0].code != null) {
                this.showErrorStatus(errors[0].code);
              } else {
                this.showErrorStatus("data.invalid.dummy.entry");
              }
              let remarksinvalidcount: any = 0;
              let remarkerror: any = null;
              errors.forEach(errormessage => {
                if (errormessage.referenceId.includes('remarks')) {
                  this.remarksIndicator = 'error';
                  remarksinvalidcount = remarksinvalidcount + 1;
                  remarkerror = errormessage.code;
                }
              });
              if (remarksinvalidcount > 0) {
                this.remarksIndicator = 'error';
                this.showErrorStatus(remarkerror);
              } else if (remarksinvalidcount == 0) {
                this.remarksIndicator = '';
              }
            }
          });


        }
      } else {
        const errors = response.messageList;
        if (errors[0].message != null) {
          this.showErrorStatus(errors[0].message);
        } else if (errors[0].code != null) {
          this.showResponseErrorMessages(response);
        } else {
          this.showErrorStatus("data.invalid.dummy.entry");
        }
      }


    });





  }

  genarateTag() {
    (<NgcFormArray>this.form.get('couHouse')).addValue([
      {
        type: 'COU',
        number: '',
        weight: 0
      }
    ]);
  }

  onAddxpsTag() {
    (<NgcFormArray>this.form.get('xpsHouse')).addValue([
      {
        number: '',
        type: 'XPS',
        pieces: 0
      }
    ]);
  }

  onDeletexpsTag(index) {
    (<NgcFormArray>this.form.get('xpsHouse')).deleteValueAt(index);

  }

  onDeleteCourierTag(index) {
    (<NgcFormArray>this.form.get('couHouse')).deleteValueAt(index);

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
    // ----------------------------
    this.isPerishableShipment = false;
    setTimeout(() => {
      this.retrieveLOVRecords('SHC_WITH_GROUP').subscribe(data => {
        const shcs = data.filter(shc => shc.code.includes(event.code));
        shcs.filter(e => {
          if (e.param2 === 'BEP') {
            this.isPerishableShipment = true;
          }
        })
        this.callExportChargeMandatory(shcs);
      });
    }, 2000);
    // ------------------------------
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



    const eAcceptanceData = this.form.getRawValue();
    this._acceptanceService.fetchStartFreightRuleExecutionList(eAcceptanceData).subscribe(response => {
      if (response.messageList != null && response.messageList.length > 0) {
        var message = response.messageList[0];

        if (message.code === 'CPE.DYN.ERRORS') {
          if (message.type === 'E') {
            if (message.code === 'CPE.DYN.ERRORS' && message.placeHolder != null) {

              this.showErrorStatus(message.placeHolder[0]);
            }

            return;


          }

        }

        if (message.code === 'DG_DETAILS_REQ_VALIDATION') {
          if (message.type === 'E') {
            this.showErrorStatus(message.code);
            return;
          } else {
            this.showConfirmMessage(message.code).then(fulfilled => {
              this.onSucessResponse(response);
            }).catch(reason => {

            })
          }
        }



      } else {
        this.onSucessResponse(response);
      }

    })


  }

  onSucessResponse(response) {
    if (response.success == true || response.messageList == null) {
      this.showInfoStatus("expaccpt.rules.create.sucess");


      let cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();

      const shipmentObj: ShipmentModel = new ShipmentModel();

      shipmentObj.shipmentNumber = this.form.get('shipment.shipmentNumber').value;
      cargo.shipmentModel = shipmentObj;

      this._acceptanceService.fetchRuleShipmentExecutionListAcceptance(cargo).subscribe(response => {
        let ruleShipmentExecutionDetails: any;
        if (response.success == true || response.messageList == null) {


          // this.showSuccessStatus('g.completed.successfully');
          ruleShipmentExecutionDetails = response.data.ruleShipmentExecutionDetails;
          this.form.get('ruleExecutionDetails').patchValue(ruleShipmentExecutionDetails);

          let actionlistValidation: any = response.data.ruleShipmentExecutionDetails;
          if (actionlistValidation.execInfoList.length > 0) {
            if (this.check_acknowledge_Flag(actionlistValidation.execInfoList)) {
              this.showErrorMessage('exp.accpt.actionlist.pendingitems');
              this.actionListIndicator = 'error';
              return;
            }
          }


          if (actionlistValidation.execWarnList.length > 0) {
            if (this.check_acknowledge_Flag(actionlistValidation.execWarnList)) {
              this.showErrorMessage('exp.accpt.actionlist.pendingitems');
              this.actionListIndicator = 'error';
              return;
            }
          }
          if (actionlistValidation.execErrorList.length > 0) {
            if (this.check_acknowledge_Flag(actionlistValidation.execErrorList)) {
              this.showErrorMessage('exp.accpt.actionlist.pendingitems');
              this.actionListIndicator = 'error';
              return;
            }
          }
          const shipmentDetails = this.form.getRawValue();
          //this._acceptanceService.updateBooking(shipmentDetails);
          const rowData = (<NgcFormControl>this.form.get(['shipment', 'shipmentNumber'])).value;
          if (shipmentDetails.shipment.customStatus === 'SERVICING' || shipmentDetails.shipment.customStatus === 'ACCEPTED') {
            this.navigateTo(this.router, '/export/acceptance/manageacceptanceweighingrevised', this.form.get('shipment.shipmentNumber').value);
          } else {
            this.showErrorMessage("expaccpt.eacceptnace.not.done");
            return;
          }

        }
      })





    }
  }

  onCancel(event) {
    this.dataRetrievedFromManageCargoAcceptance.fromDate = new Date();
    this.navigateTo(this.router, '/export/acceptance/managecargoacceptance', this.dataRetrievedFromManageCargoAcceptance);
  }

  private manageawbinformation() {
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
    this.permitValue = true;
    this.permitToFollowFlag = true;
    this.form.get('localAuthority.type').valueChanges.subscribe(
      (newValue) => {
        if (newValue) {
          if (newValue === 'EC') {
            this.permitNumberFlag = false;
            this.excemptionCodeFlag = true;
            this.permitToFollowFlag = false;
            this.onAutoDeletePermitNumberRows();
          }
          if (newValue === 'PN') {
            this.permitNumberFlag = true;
            this.excemptionCodeFlag = false;
            this.permitToFollowFlag = false;
            this.onAutoDeletePermitNumberRows();
          }
          if (newValue === 'PTF') {
            this.permitNumberFlag = false;
            this.permitToFollowFlag = true;
            this.excemptionCodeFlag = false;
            this.onAutoDeletePermitNumberRows();
          }
        }
      }
    );
  }

  onCloseFailureData() {
    const requestCloseFailure = (<NgcFormGroup>this.form.get('ruleExecutionDetails')).getRawValue();
    this._acceptanceService.onCloseFailureData(requestCloseFailure).subscribe(response => {
      this.showResponseErrorMessages(response);
      if (!response.messageList) {
        let cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();

        const shipmentObj: ShipmentModel = new ShipmentModel();

        shipmentObj.shipmentNumber = this.form.get('shipment.shipmentNumber').value;
        cargo.shipmentModel = shipmentObj;
        this._acceptanceService.fetchRuleShipmentExecutionListAcceptance(cargo).subscribe(response => {
          let ruleShipmentExecutionDetails: any;
          if (response.success == true || response.messageList == null) {


            // this.showSuccessStatus('g.completed.successfully');
            ruleShipmentExecutionDetails = response.data.ruleShipmentExecutionDetails;
            this.form.get('ruleExecutionDetails').patchValue(ruleShipmentExecutionDetails);
            this.showSuccessStatus('g.completed.successfully');
          }
        })
      } else {
        const errors = response.messageList;
        if (errors[0].message != null) {
          this.showErrorStatus(errors[0].message);
        } else if (errors[0].code != null) {
          this.showResponseErrorMessages(response);
        } else {
          this.showErrorStatus("data.invalid.dummy.entry");
        }
      }
      if ((response.data.ruleExecutionDetails.execWarnList.length > 0 && response.data.ruleExecutionDetails.execWarnList[0].status != "CLOSED")
        || (response.data.ruleExecutionDetails.execInfoList.length > 0 && response.data.ruleExecutionDetails.execInfoList[0].status != "CLOSED")
        || (response.data.ruleExecutionDetails.execErrorList.length > 0 && response.data.ruleExecutionDetails.execErrorList[0].status != "CLOSED")) {
        this.actionListIndicator = 'error';
      } else {
        this.actionListIndicator = "";
      }
    });
  }


  onClickOfActionListInfo(index) {
    const processAreaCodeData = (<NgcFormArray>this.form.get(['ruleExecutionDetails', 'execInfoList', index])).value;
    if (processAreaCodeData.processAreaCode === 'ACAS') {
      this.navigateTo(this.router, '/export/acceptance/acasquery', processAreaCodeData);
    }
    else if (processAreaCodeData.processAreaCode === 'CHECKLIST') {
      const processAreaCodeDataToChecklist = {
        shipmentNumber: processAreaCodeData.shipmentNumber
      }
      this.navigateTo(this.router, '/export/checklist/setupcheckliststatus', this.dataRetrievedFromManageCargoAcceptance);
    }
    else if (processAreaCodeData.processAreaCode === 'DRY_ICE_WEIGHT') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'EAWB') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'EMBARGO') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'FHL_REQUIRED') {
      this.navigateTo(this.router, '/awbmgmt/maintainhouse', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'FWB_REQUIRED') {
      this.navigateTo(this.router, '/import/maintainfwb', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'SCREENING_AIRLINE') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'SCREENING_CUSTOMS') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'SCREENING_RCAR') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'WEIGHT_TOLERANCE') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
  }

  onClickOfActionListWarn(index) {
    const processAreaCodeData = (<NgcFormArray>this.form.get(['ruleExecutionDetails', 'execWarnList', index])).value;
    if (processAreaCodeData.processAreaCode === 'ACAS') {
      this.navigateTo(this.router, '/export/acceptance/acasquery', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'CHECKLIST') {
      const processAreaCodeDataToChecklist = {
        shipmentNumber: processAreaCodeData.shipmentNumber
      }
      this.navigateTo(this.router, '/export/checklist/setupcheckliststatus', this.dataRetrievedFromManageCargoAcceptance);
    }
    else if (processAreaCodeData.processAreaCode === 'DRY_ICE_WEIGHT') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'EAWB') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'EMBARGO') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'FHL_REQUIRED') {
      this.navigateTo(this.router, '/awbmgmt/maintainhouse', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'FWB_REQUIRED') {
      this.navigateTo(this.router, '/import/maintainfwb', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'SCREENING_AIRLINE') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'SCREENING_CUSTOMS') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'SCREENING_RCAR') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'WEIGHT_TOLERANCE') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
  }

  onClickOfActionListError(index) {
    const processAreaCodeData = (<NgcFormArray>this.form.get(['ruleExecutionDetails', 'execErrorList', index])).value;
    if (processAreaCodeData.processAreaCode === 'ACAS') {
      this.navigateTo(this.router, '/export/acceptance/acasquery', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'CHECKLIST') {
      const processAreaCodeDataToChecklist = {
        shipmentNumber: processAreaCodeData.shipmentNumber
      }
      this.navigateTo(this.router, '/export/checklist/setupcheckliststatus', this.dataRetrievedFromManageCargoAcceptance);
    }
    else if (processAreaCodeData.processAreaCode === 'DRY_ICE_WEIGHT') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'EAWB') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'EMBARGO') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'FHL_REQUIRED') {
      this.navigateTo(this.router, '/awbmgmt/maintainhouse', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'FWB_REQUIRED') {
      this.navigateTo(this.router, '/import/maintainfwb', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'SCREENING_AIRLINE') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'SCREENING_CUSTOMS') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'SCREENING_RCAR') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
    else if (processAreaCodeData.processAreaCode === 'WEIGHT_TOLERANCE') {
      this.navigateTo(this.router, '/', processAreaCodeData.shipmentNumber);
    }
  }

  callExportChargeMandatory(schGroup: any) {
    let validateFlag = true;
    setTimeout(() => {
      this.retrieveDropDownListRecords('SHC_CODE_WH').subscribe(data => {
        const billingShc = data;
        billingShc.forEach(element => {
          schGroup.forEach(group => {
            if (validateFlag) {
              if (element.desc.search(group.param2) > 0) {
                this.form.get(['storageCharge', 0, 'weight']).setValidators([Validators.required]);
                this.form.get(['storageCharge', 0, 'weight']).setValue(null);
                validateFlag = false;
              } else {
                this.form.get(['storageCharge', 0, 'weight']).clearValidators();
              }
            }
          });
        });
      });
    }, 2000);
  }

  onAutoDeletePermitNumberRows() {
    const length = (<NgcFormArray>this.form.get('localAuthority.details')).length - 1;
    if (length !== 0) {
      for (let index = length; index > 0; index--) {
        (<NgcFormArray>this.form.get('localAuthority.details')).deleteValueAt(index);
      }
    }
  }

  onClickOfCreateAdditionalServices(event) {
    let Obj = this.dataRetrievedFromManageCargoAcceptance;
    this.navigateTo(this.router, '/billing/createServiceRequest',
      Obj);
  }

  restrictUpdateAfterShipmentNumberAccepted(obj: any) {
    if (obj !== null
      && obj.shipment.customStatus === 'ACCEPTED') {
      // make all the flag false 
      this.disableSaveFlag = true;
    }
  }


  check_acknowledge_Flag(obj: any): boolean {
    let acknowledgeFlag = false;
    if (obj !== null) {
      obj.forEach(e => {
        if (e.acknowledge === null || e.acknowledge === false) {
          acknowledgeFlag = true;
        }
      });
    }
    return acknowledgeFlag;
  }
}