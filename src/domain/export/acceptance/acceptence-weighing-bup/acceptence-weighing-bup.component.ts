import { Validator, Validators } from '@angular/forms';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcUtility,
  NgcButtonComponent, PageConfiguration, NgcWindowComponent
} from 'ngc-framework';
import { AcceptanceService } from '../acceptance.service';
import { BuildupService } from './../../buildup/buildup.service';
import { EquipmentReturnRowData, DgRowData, AutoWeigh, UldWeighRecord, WeighingScaleRequest, PrintUldtagData } from '../../export.sharedmodel';
import { ExportService } from '../../export.service';
import { ResponseOptions } from '@angular/http';
@Component({
  selector: 'app-acceptence-weighing-bup',
  templateUrl: './acceptence-weighing-bup.component.html',
  styleUrls: ['./acceptence-weighing-bup.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class AcceptenceWeighingBupComponent extends NgcPage {
  testAcceptanceType = false;
  equipmentReturnFlag = true;
  showReadOnlyWeight = false;
  addWeight = true;
  flightIdforDropdown: any;
  flagShowDgDetail = false;
  showDataFlag = false;
  enableSaveButton = false;
  insertDataFlag = true;
  sendRequestFlag = true;
  uldForContourCode: any;
  weighingScaleData: string;
  // created a dummy flight to avoid recursion issue whilwe calling value change
  dummyFlightNumber: string;
  autoWeighHeaderId: number;
  segmentValue: string;
  printUldtagData: any;
  @ViewChild('windowPrinter') windowPrinter: NgcWindowComponent;
  equipmentListNormalReturn = new NgcFormArray([]);
  equipmentListForceReturn = new NgcFormArray([]);
  weighingScaleDropdown: Boolean = false;
  allowGrossWeight: Boolean = false;
  addWeightbutton: Boolean = false;
  weighingscalename: String;
  disableInput: Boolean = false;
  popupPrinterForm: NgcFormGroup = new NgcFormGroup({
    printerdropdown: new NgcFormControl(),
  });


  private AcceptenceWeighingBupForm: NgcFormGroup = null;
  pdNumberFlag = false;
  equipNumber: any = null;
  valueForPdTrolleyNumber: any;


  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private acceptanceService: AcceptanceService, private buildUpService: BuildupService, private exportService: ExportService) {
    super(appZone, appElement, appContainerElement);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.initialize();
  }

  public initialize() {
    this.equipNumber = null;
    super.ngOnInit();
    this.AcceptenceWeighingBupForm = new NgcFormGroup({
      acceptedBy: new NgcFormControl(),
      prelodgeServiceId: new NgcFormControl(),
      shipmentNumber: new NgcFormControl(),
      shipmentNumberList: new NgcFormControl(),
      customerCode: new NgcFormControl(),
      carrierCode: new NgcFormControl(),
      flightSegmentId: new NgcFormControl(),
      acceptanceBy: new NgcFormControl('ACP'),
      uldNumber: new NgcFormControl(),
      flightKey: new NgcFormControl(''),
      date: new NgcFormControl(),
      flightOffPoint: new NgcFormControl(),
      contourCode: new NgcFormControl(),
      requestedTemperatureRange: new NgcFormControl(),
      rcarTypeCode: new NgcFormControl(),
      concatSHC: new NgcFormControl(),
      uldTagPrinted: new NgcFormControl(),
      weighingScaleId: new NgcFormControl(),
      totalWeight: new NgcFormControl(),
      weightCapturedManually: new NgcFormControl(),
      pdTrolleyNumber: new NgcFormControl(),
      pdTrolleyWeight: new NgcFormControl(),
      grossWeight: new NgcFormControl(),
      uldTareWeight: new NgcFormControl(),
      dryIceWeight: new NgcFormControl(),
      xpsShipment: new NgcFormControl(),
      dgShipment: new NgcFormControl(),
      bup: new NgcFormControl(),
      cargo: new NgcFormControl(),
      mail: new NgcFormControl(),
      courier: new NgcFormControl(),
      tagRemarks: new NgcFormControl('', [Validators.maxLength(27)]),
      equipmentReturn: new NgcFormArray([]),
      dgDetails: new NgcFormArray([]),
      requestedTemperatureRangeValue: new NgcFormControl()
    });
    this.flagShowDgDetail = false;

  }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    // this.addNewEquipmentReturnRow();
    //this.AcceptenceWeighingBupForm.get('weighingScaleId').disable();
    this.AcceptenceWeighingBupForm.get('dgShipment').setValue(false);
    this.AcceptenceWeighingBupForm.get('cargo').setValue(false);
    this.AcceptenceWeighingBupForm.get('mail').setValue(false);
    this.AcceptenceWeighingBupForm.get('courier').setValue(false);
    this.AcceptenceWeighingBupForm.get('xpsShipment').setValue(false);
    //
    this.AcceptenceWeighingBupForm.get('dryIceWeight').valueChanges
      .subscribe(changedValue => {
        const pdtrolleyweight: number = this.AcceptenceWeighingBupForm.get('pdTrolleyWeight').value;
        const totalweight: number = this.AcceptenceWeighingBupForm.get('totalWeight').value;
        const weightCapturedManually: number = this.AcceptenceWeighingBupForm.get('weightCapturedManually').value;

        const abacusValue = (Number(totalweight) || Number(weightCapturedManually))
          - (Number(pdtrolleyweight) + Number(changedValue));
        this.AcceptenceWeighingBupForm.get('grossWeight').setValue(abacusValue);
      });

    this.AcceptenceWeighingBupForm.get('pdTrolleyWeight').valueChanges
      .subscribe(changedValue => {
        const dryIceWeight: number = this.AcceptenceWeighingBupForm.get('dryIceWeight').value;
        const totalweight: number = this.AcceptenceWeighingBupForm.get('totalWeight').value;
        const weightCapturedManually: number = this.AcceptenceWeighingBupForm.get('weightCapturedManually').value;

        const abacusValue = (Number(totalweight) || Number(weightCapturedManually))
          - (Number(dryIceWeight) + Number(changedValue));
        this.AcceptenceWeighingBupForm.get('grossWeight').setValue(abacusValue);
      });


    this.AcceptenceWeighingBupForm.get('weightCapturedManually').valueChanges
      .subscribe(changedValue => {
        const pdtrolleyweight: number = this.AcceptenceWeighingBupForm.get('pdTrolleyWeight').value;
        const dryIceWeight: number = this.AcceptenceWeighingBupForm.get('dryIceWeight').value;

        const abacusValue = Number(changedValue) - (Number(pdtrolleyweight) + Number(dryIceWeight));
        this.AcceptenceWeighingBupForm.get('grossWeight').setValue(abacusValue);
      });


    this.AcceptenceWeighingBupForm.get('date').valueChanges
      .subscribe(changedValue => {
        // concat of carrier and flight
        // get carrier code value
        const code = this.AcceptenceWeighingBupForm.get('carrierCode').value;
        // get value of flightkey
        const flightValue = this.AcceptenceWeighingBupForm.get('flightKey').value;
        if (flightValue !== null && flightValue !== '' && flightValue !== 0) {
          const flightKeyValue = code.concat(flightValue);
          //  this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightKeyValue);
          if (this.flightIdforDropdown && this.flightIdforDropdown.parameter2 === changedValue) {
            return;
          } else {
            this.flightIdforDropdown =
              this.createSourceParameter(flightKeyValue,
                this.AcceptenceWeighingBupForm.get('date').value);
          }
        }
      });

    this.AcceptenceWeighingBupForm.get('flightKey').valueChanges
      .subscribe(changedValue => {
        // concat of carrier and flight
        // get carrier code value

        const code = this.AcceptenceWeighingBupForm.get('carrierCode').value;
        // get value of flightkey
        const flightValue = this.AcceptenceWeighingBupForm.get('flightKey').value;
        if (flightValue !== null && flightValue !== '' && flightValue !== 0) {


          const flightKeyValue = code.concat(flightValue);
          //  this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightKeyValue);
          if (this.flightIdforDropdown && this.flightIdforDropdown.parameter1 === flightKeyValue) {
            return;
          } else {
            this.flightIdforDropdown =
              this.createSourceParameter(flightKeyValue,
                this.AcceptenceWeighingBupForm.get('date').value);
          }
        }
      });


    this.AcceptenceWeighingBupForm.get('dgShipment').valueChanges
      .subscribe(changedValue => {
        if (changedValue === true) {
          this.flagShowDgDetail = true;
        }
        else {
          this.flagShowDgDetail = false;
        }
      });


    this.AcceptenceWeighingBupForm.get('cargo').valueChanges
      .subscribe(changedValue => {
        if (changedValue === true) {
          // this.flagShowDgDetail = false;
        }
      });

    this.AcceptenceWeighingBupForm.get('mail').valueChanges
      .subscribe(changedValue => {
        if (changedValue === true) {
          //this.flagShowDgDetail = false;
        }
      });

    this.AcceptenceWeighingBupForm.get('courier').valueChanges
      .subscribe(changedValue => {
        if (changedValue === true) {
          // this.flagShowDgDetail = false;
        }
      });


    this.AcceptenceWeighingBupForm.get('pdTrolleyNumber').valueChanges.subscribe(changedValue => {
      if (changedValue) {
        var res = changedValue.toUpperCase();
        if (res === changedValue && (changedValue !== this.equipNumber)) {
          this.addNewEquipmentReturnRow();
          let length = (<NgcFormArray>this.AcceptenceWeighingBupForm.controls['equipmentReturn']).length;
          (<NgcFormArray>this.AcceptenceWeighingBupForm.get(['equipmentReturn', length - 1, 'equipmentNumber'])).setValue(res);
        }
        this.checkEquipment(changedValue);
      }

    });
  }
  checkConentType() {
    if (this.AcceptenceWeighingBupForm.get('xpsShipment').value === false &&
      this.AcceptenceWeighingBupForm.get('dgShipment').value == false &&
      this.AcceptenceWeighingBupForm.get('courier').value == false &&
      this.AcceptenceWeighingBupForm.get('cargo').value == false &&

      this.AcceptenceWeighingBupForm.get('mail').value == false) {
      this.showErrorStatus('expaccpt.contenttype.required');
      this.insertDataFlag = false;
    }

  }





  fetchPrelodgeDetails() {
    this.AcceptenceWeighingBupForm.get('flightSegmentId').setValue(null);
    this.flightIdforDropdown = null;
    this.allowGrossWeight = false;
    this.addWeightbutton = false;
    this.weighingScaleDropdown = false;
    if (this.AcceptenceWeighingBupForm.get('acceptedBy').value === null) {
      this.showErrorStatus('expaccpt.select.acceptance.by');
    } else {
      this.sendRequestFlag = true;
      this.checkOneFieldMandatory();
      if (this.sendRequestFlag) {
        const tempValueOfAcceptanceBy = this.AcceptenceWeighingBupForm.get('acceptedBy').value;
        if (this.AcceptenceWeighingBupForm.get('acceptedBy').value === 'WPD') {
          this.AcceptenceWeighingBupForm.get('pdTrolleyNumber').disable();
          this.AcceptenceWeighingBupForm.get('pdTrolleyWeight').disable();
          this.testAcceptanceType = false;
        } else {
          this.AcceptenceWeighingBupForm.get('pdTrolleyNumber').enable();
          this.testAcceptanceType = true;
          this.AcceptenceWeighingBupForm.get('pdTrolleyWeight').enable();
        }
        this.uldForContourCode =
          this.createSourceParameter(this.AcceptenceWeighingBupForm.get('uldNumber').value);
        const checkPrelodgeDetailsRequest = new AutoWeigh();
        checkPrelodgeDetailsRequest.uldNumber = this.AcceptenceWeighingBupForm.get('uldNumber').value;
        checkPrelodgeDetailsRequest.shipmentNumber = this.AcceptenceWeighingBupForm.get('shipmentNumber').value;
        this.acceptanceService.fetchPrelodgeDetails
          (checkPrelodgeDetailsRequest).subscribe(response => {
            (<NgcFormArray>this.AcceptenceWeighingBupForm.controls['equipmentReturn']).resetValue([]);
            this.refreshFormMessages(response);

            const flightDetails = response.data;


            if (flightDetails.pdTrolleyNumber) {
              this.pdNumberFlag = false;
            } else {
              this.pdNumberFlag = true;
            }
            if (flightDetails === null && response.messageList === null) {
              this.setDefaultValuesOfForm(checkPrelodgeDetailsRequest, tempValueOfAcceptanceBy);
            } else {
              if (response.messageList) {
                this.showDataFlag = false;
              } else {
                this.enableSaveButton = false;
              }
              this.disableInput = false;
              if (flightDetails !== null && response.messageList === null) {
                this.disableInput = true;
                // extraction of flight number from flight key
                if (flightDetails.carrierCode !== null) {
                  let carrierCodeLength = flightDetails.carrierCode.length;
                  if (flightDetails.flightKey) {
                    const fightNum = flightDetails.flightKey.substring(carrierCodeLength);
                    flightDetails.flightKey = fightNum;
                  }
                }
                this.checkRcarStatus(flightDetails);
                if (flightDetails.flightKey !== null
                  && flightDetails.date !== null
                  && flightDetails.flightSegmentId !== null) {
                }
                this.autoWeighHeaderId = flightDetails.autoWeighBupHeaderId;
                if (flightDetails.dgDetails !== null) {
                  flightDetails.dgDetails.forEach(element => {
                    element.flagUpdate = 'Y';
                  });
                }
                this.valueForPdTrolleyNumber = flightDetails.pdTrolleyNumber;
                //   flightDetails.pdTrolleyNumber = null;
                this.AcceptenceWeighingBupForm.patchValue(flightDetails);
                let tempuldvalue = flightDetails.uldNumber;
                // if ((<NgcFormArray>this.AcceptenceWeighingBupForm.controls['equipmentReturn']).length === 0) {
                this.addNewEquipmentReturnRow();
                //   this.AcceptenceWeighingBupForm.get(['equipmentReturn', 0, 'equipmentNumber'])
                //     .setValue(tempuldvalue);
                // }
                let length = (<NgcFormArray>this.AcceptenceWeighingBupForm.controls['equipmentReturn']).length;
                (<NgcFormArray>this.AcceptenceWeighingBupForm.get(['equipmentReturn', length - 1, 'equipmentNumber'])).setValue(tempuldvalue);
                for (const eachRow of this.AcceptenceWeighingBupForm.get(['equipmentReturn']).value) {
                  this.checkEquipment(eachRow.equipmentNumber);
                }

                this.AcceptenceWeighingBupForm.get('acceptedBy').patchValue(tempValueOfAcceptanceBy);

                if (flightDetails.shipmentNumberList === null
                  // && (this.AcceptenceWeighingBupForm.get('shipmentNumber').value !== null
                  //   && this.AcceptenceWeighingBupForm.get('shipmentNumber').value !== '')
                  && checkPrelodgeDetailsRequest.shipmentNumber) {
                  this.AcceptenceWeighingBupForm.get('shipmentNumber')
                    .setValue(checkPrelodgeDetailsRequest.shipmentNumber);
                  this.AcceptenceWeighingBupForm.get('shipmentNumberList')
                    .setValue([checkPrelodgeDetailsRequest.shipmentNumber]);
                }
                this.showDataFlag = true;
                // this.AcceptenceWeighingBupForm.get(['equipmentReturn', 0, 'equipmentNumber'])
                // .setValue(this.AcceptenceWeighingBupForm.get('uldNumber').value);
                // if (flightDetails.pdTrolleyNumber) {
                //   this.AcceptenceWeighingBupForm.get('pdTrolleyNumber').patchValue(this.valueForPdTrolleyNumber);
                // }
              }
            }

          });

      } else {
        this.showErrorStatus('expaccpt.fill.any.one.field');
      }
    }
  }


  checkRcarStatus(flightDetails) {
    if (flightDetails.rcarTypeCode !== null && flightDetails.rcarTypeCode === 'UC') {
      this.showWarningStatus('expaccpt.bup.send.screening');
    }
  }

  onSelectDGSHC(object: any, index) {
    this.AcceptenceWeighingBupForm.get(['dgDetails', index, 'specialHandlingCode']).patchValue(object.code);
  }



  checkOneFieldMandatory() {
    const uldNumber = this.AcceptenceWeighingBupForm.get('uldNumber').value;
    const shipmentNumber = this.AcceptenceWeighingBupForm.get('shipmentNumber').value;
    if (((uldNumber === null || uldNumber.trim().length === 0) &&
      (shipmentNumber === null || shipmentNumber.trim().length === 0))) {
      this.sendRequestFlag = false;
    }
  }

  setDefaultValuesOfForm(checkPrelodgeDetailsRequest, tempValueOfAcceptanceBy) {
    this.AcceptenceWeighingBupForm.reset();
    this.AcceptenceWeighingBupForm.get('uldNumber').patchValue(checkPrelodgeDetailsRequest.uldNumber);
    if (checkPrelodgeDetailsRequest.shipmentNumber !== null
      && checkPrelodgeDetailsRequest.shipmentNumber !== '') {
      this.AcceptenceWeighingBupForm.get('shipmentNumber').patchValue(checkPrelodgeDetailsRequest.shipmentNumber);
      this.AcceptenceWeighingBupForm.get('shipmentNumberList')
        .patchValue([checkPrelodgeDetailsRequest.shipmentNumber]);
    }
    this.AcceptenceWeighingBupForm.get('acceptedBy').patchValue(tempValueOfAcceptanceBy);
    this.showDataFlag = true;
  }

  clearValueofWeight() {
    this.AcceptenceWeighingBupForm.get('weightCapturedManually').reset();
    this.AcceptenceWeighingBupForm.get('pdTrolleyNumber').reset();
    this.AcceptenceWeighingBupForm.get('pdTrolleyWeight').reset();
    this.AcceptenceWeighingBupForm.get('dryIceWeight').reset();
    this.AcceptenceWeighingBupForm.get('grossWeight').reset();
  }

  addNewEquipmentReturnRow() {
    (<NgcFormArray>this.AcceptenceWeighingBupForm.controls['equipmentReturn']).addValue([new EquipmentReturnRowData()]);

  }

  checkEquipment(value) {

    const requestForEquipmentReturn: any =
      { 'equipmentNumber': value.toUpperCase() };
    this.checkEquipmentReturn(requestForEquipmentReturn);

  }

  checkEquipmentReturn(requestForEquipmentReturn): void {
    this.acceptanceService.fetchEquipmentReturnRecord(requestForEquipmentReturn).subscribe(response => {
      const dataArray = response.data ? response.data : null;
      let data = null;
      const error: String = response.messageList !== null ? response.messageList[0].code : null;
      const equipmentReturnFormArray: NgcFormArray =
        <NgcFormArray>this.AcceptenceWeighingBupForm.get('equipmentReturn');
      //
      if (dataArray) {
        dataArray.forEach(element => {
          if (element.status != "RETURNED" && element.status != "PREPARED") {
            data = element;
          }
        });
      }

      if (equipmentReturnFormArray) {
        equipmentReturnFormArray.controls.forEach((control: any, index: number) => {
          const formGroup: NgcFormGroup = <NgcFormGroup>control;
          if (data && formGroup.controls['equipmentNumber'].value === requestForEquipmentReturn.equipmentNumber && data.status !== 'RETURNED' && data.status !== 'PREPARED') {
            delete data['equipmentNumber'];

            data['eqpNum'] = requestForEquipmentReturn.equipmentNumber;
            data['loggedInUser'] = this.getUserProfile.toString();
            formGroup.patchValue(data);
            this.equipNumber = data.equipmentNumber;
          }

          if ((data == null || error) && formGroup.controls['equipmentNumber'].value === requestForEquipmentReturn.equipmentNumber) {
            let length = (<NgcFormArray>this.AcceptenceWeighingBupForm.controls['equipmentReturn']).length;
            this.onDeleteRowEquipmentReturn(requestForEquipmentReturn.equipmentNumber);
          }
        });
      }
      //
    });
  }

  insertRecord() {
    this.insertDataFlag = true;
    this.equipmentReturnFlag = true;
    if (((this.AcceptenceWeighingBupForm.get('pdTrolleyNumber').value === null) ||
      (this.AcceptenceWeighingBupForm.get('pdTrolleyNumber').value === '')) &&
      ((this.AcceptenceWeighingBupForm.get('pdTrolleyWeight').value === null) ||
        (this.AcceptenceWeighingBupForm.get('pdTrolleyWeight').value === ''))) {
      this.insertDataFlag = true;
    }


    this.checkCarrierCode();
    this.checkRecordExistsEquipmentReturn();

    if (this.insertDataFlag === true && this.equipmentReturnFlag === true) {
      const flightKeyValue = this.AcceptenceWeighingBupForm.get('carrierCode').value + this.AcceptenceWeighingBupForm.get('flightKey').value
      this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightKeyValue);
      let length = (<NgcFormArray>this.AcceptenceWeighingBupForm.controls['equipmentReturn']).length;
      this.insertAutoWeighDetails();
    }
  }

  checkCarrierCode() {
    if (this.AcceptenceWeighingBupForm.get('carrierCode').value === '' ||
      this.AcceptenceWeighingBupForm.get('carrierCode').value === null) {
      this.showErrorStatus('expaccpt.carrier.code.required');
      this.insertDataFlag = false;
    }
  }

  checkRecordExistsEquipmentReturn() {
    const equipmentReturnFormArray: NgcFormArray =
      <NgcFormArray>this.AcceptenceWeighingBupForm.get('equipmentReturn');
    //
    if (equipmentReturnFormArray) {
      equipmentReturnFormArray.controls.forEach((control: any, index: number) => {
        const formGroup: NgcFormGroup = <NgcFormGroup>control;
        if ((formGroup.controls['equipmentNumber'].value === null) || (formGroup.controls['equipmentNumber'].value === '')) {
          this.showErrorStatus('expaccpt.add.delete.equipment.return');
          this.insertDataFlag = false;
        } else {
          this.insertDataFlag = true;
        }
      });
    }
  }


  insertAutoWeighDetails() {
    let pageData = new UldWeighRecord();
    pageData = this.AcceptenceWeighingBupForm.getRawValue();
    pageData['bupIndicator'] = true;
    pageData['acceptanceBy'] = 'ACP';
    // pageData['equipmentReturn'] = null;
    pageData.grossWeightMore = true;
    pageData.grossWeightLess = true;
    if (!pageData.dgShipment) {
      pageData.dgDetails = null;
    }
    this.acceptanceService.insertBupAutoWeighDetails
      (pageData).subscribe(response => {

        if (response.data !== null) {

          if (response.data.foreignUldCheck == true) {
            this.showConfirmMessage(NgcUtility.translateMessage("maintain.foreign.uld.check.3", [null, null])).then(fulfilled => {

              pageData.foreignUldCheck = false;
              pageData.ackWarn = false;

              this.acceptanceService.insertBupAutoWeighDetails
                (pageData).subscribe(response => {
                  this.refreshFormMessages(response);
                  if (response.data !== null) {
                    let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
                    let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
                    this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
                    this.showSuccessStatus('g.completed.successfully');
                  }
                  if (response.messageList) {
                    let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
                    let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
                    this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
                  }
                  if (response.data.grossWeightMore == true && response.data.grossWeightLess == false) {
                    let loadedWeight;
                    let tareWeight;
                    if (response.data.loadedWeight == null) {
                      loadedWeight = 0;
                    } else {
                      loadedWeight = response.data.loadedWeight;
                    }
                    if (response.data.uldTareWeight == null) {
                      tareWeight = 0;
                    } else {
                      tareWeight = response.data.uldTareWeight;
                    }

                    this.showConfirmMessage(NgcUtility.translateMessage("export.gross.weight.more.than.actual", [loadedWeight, tareWeight])).then(fulfilled => {

                      pageData.grossWeightMore = false;
                      pageData.acceptanceBy = 'ACP';
                      if (!pageData.dgShipment) {
                        pageData.dgDetails = null;
                      }
                      this.acceptanceService.insertBupAutoWeighDetails
                        (pageData).subscribe(response => {
                          this.refreshFormMessages(response);
                          if (response.data !== null) {
                            let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
                            let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
                            this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
                            this.showSuccessStatus('g.completed.successfully');
                          }
                          if (response.messageList) {
                            let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
                            let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
                            this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
                          }
                        });

                    }
                    ).catch(reason => {
                      let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
                      let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
                      this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
                      return;
                    });
                  } else if (response.data.grossWeightLess == true && response.data.grossWeightMore == false) {
                    let loadedWeight;
                    let tareWeight;
                    if (response.data.loadedWeight == null) {
                      loadedWeight = 0;
                    } else {
                      loadedWeight = response.data.loadedWeight;
                    }
                    if (response.data.uldTareWeight == null) {
                      tareWeight = 0;
                    } else {
                      tareWeight = response.data.uldTareWeight;
                    }

                    this.showConfirmMessage(NgcUtility.translateMessage("export.gross.weight.less.than.actual", [loadedWeight, tareWeight])).then(fulfilled => {

                      pageData.grossWeightLess = false;
                      pageData.acceptanceBy = 'ACP';
                      if (!pageData.dgShipment) {
                        pageData.dgDetails = null;
                      }
                      this.acceptanceService.insertBupAutoWeighDetails
                        (pageData).subscribe(response => {
                          this.refreshFormMessages(response);
                          if (response.data !== null) {
                            let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
                            let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
                            this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
                            this.showSuccessStatus('g.completed.successfully');
                          }
                          if (response.messageList) {
                            let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
                            let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
                            this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
                          }
                        });

                    }
                    ).catch(reason => {
                      let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
                      let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
                      this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
                      return;
                    });
                  }
                });

            }
            ).catch(reason => {
              let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
              let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
              this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
              return;
            });
          }



          else if (response.data.grossWeightMore == true && response.data.grossWeightLess == false) {
            let loadedWeight;
            let tareWeight;
            if (response.data.loadedWeight == null) {
              loadedWeight = 0;
            } else {
              loadedWeight = response.data.loadedWeight;
            }
            if (response.data.uldTareWeight == null) {
              tareWeight = 0;
            } else {
              tareWeight = response.data.uldTareWeight;
            }

            this.showConfirmMessage(NgcUtility.translateMessage("export.gross.weight.more.than.actual", [loadedWeight, tareWeight])).then(fulfilled => {

              pageData.grossWeightMore = false;
              pageData.acceptanceBy = 'ACP';
              if (!pageData.dgShipment) {
                pageData.dgDetails = null;
              }
              this.acceptanceService.insertBupAutoWeighDetails
                (pageData).subscribe(response => {
                  this.refreshFormMessages(response);
                  if (response.data !== null) {
                    let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
                    let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
                    this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
                    this.showSuccessStatus('g.completed.successfully');
                  }
                  if (response.messageList) {
                    let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
                    let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
                    this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
                  }
                });

            }
            ).catch(reason => {
              let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
              let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
              this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
              return;
            });
          } else if (response.data.grossWeightLess == true && response.data.grossWeightMore == false) {
            let loadedWeight;
            let tareWeight;
            if (response.data.loadedWeight == null) {
              loadedWeight = 0;
            } else {
              loadedWeight = response.data.loadedWeight;
            }
            if (response.data.uldTareWeight == null) {
              tareWeight = 0;
            } else {
              tareWeight = response.data.uldTareWeight;
            }

            this.showConfirmMessage(NgcUtility.translateMessage("export.gross.weight.less.than.actual", [loadedWeight, tareWeight])).then(fulfilled => {

              pageData.grossWeightLess = false;
              pageData.acceptanceBy = 'ACP';
              if (!pageData.dgShipment) {
                pageData.dgDetails = null;
              }
              this.acceptanceService.insertBupAutoWeighDetails
                (pageData).subscribe(response => {
                  this.refreshFormMessages(response);
                  if (response.data !== null) {
                    let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
                    let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
                    this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
                    this.showSuccessStatus('g.completed.successfully');
                  }
                  if (response.messageList) {
                    let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
                    let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
                    this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
                  }
                });

            }
            ).catch(reason => {
              let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
              let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
              this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
              return;
            });
          } else if (response.data.grossWeightLess == true && response.data.grossWeightMore == true) {
            this.refreshFormMessages(response);
            if (response.data !== null) {
              let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
              let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
              this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
              this.showSuccessStatus('g.completed.successfully');
            }
            if (response.messageList) {
              let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
              let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
              this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
            }
          }



        }

        if (this.showResponseErrorMessages(response)) {
          let carrierCodeLength = this.AcceptenceWeighingBupForm.get('carrierCode').value.length;
          let flightNum = this.AcceptenceWeighingBupForm.get('flightKey').value.substring(carrierCodeLength);
          this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNum);
        }

      });
  }

  getWeight() {
    let request: WeighingScaleRequest = new WeighingScaleRequest();
    const tempDetails = this.weighingScaleData.split(':');
    request.wscaleIP = tempDetails[0];

    request.wscalePort = tempDetails[1];;
    this.exportService.getWeightInformation(request).subscribe(response => {
      this.refreshFormMessages(response);
      if (!this.showResponseErrorMessages(response)) {
        this.weighingScaleDropdown = true;
      } else {
        this.weighingScaleDropdown = false;
      }
      if (response.data !== null && response.data !== "") {
        this.AcceptenceWeighingBupForm.get('weightCapturedManually').setValue(response.data);
        this.showReadOnlyWeight = true;
        this.addWeight = false;
      } else {
        this.AcceptenceWeighingBupForm.get('weightCapturedManually').setValue(0.0);
        this.showReadOnlyWeight = false;
        this.addWeight = true;
      }
    })
  }

  addDgRow() {
    (<NgcFormArray>this.AcceptenceWeighingBupForm.controls['dgDetails']).addValue([new DgRowData()]);
  }

  onDeleteRowDgDetail(event, index) {
    const deleteRec = (<NgcFormArray>this.AcceptenceWeighingBupForm.controls['dgDetails']);
    deleteRec.removeAt(index);
  }

  onDeleteRowEquipmentReturn(requestForEquipmentReturn) {

    const equipmentReturnFormArray: NgcFormArray =
      <NgcFormArray>this.AcceptenceWeighingBupForm.get('equipmentReturn');
    //
    if (equipmentReturnFormArray) {
      equipmentReturnFormArray.controls.forEach((control: any, index: number) => {
        const formGroup: NgcFormGroup = <NgcFormGroup>control;
        if (formGroup.controls['equipmentNumber'].value === requestForEquipmentReturn) {
          equipmentReturnFormArray.removeAt(index);
        }
      });
    }
  }

  onDeleteEquipment(index) {
    const deleteRec = (<NgcFormArray>this.AcceptenceWeighingBupForm.controls['equipmentReturn']);
    deleteRec.removeAt(index);
  }

  resetScreen() {
    this.showDataFlag = false;
    this.AcceptenceWeighingBupForm.reset();
    this.resetFormMessages();

  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public cellsRenderer = (row: number, column: string, value: any, rowData: any): string => {

    return `
            <div>
                <p style="color:#66CC66"> ${value} </p>
            </div>
            `;

  };


  onSelect(event) {
    this.weighingScaleData = event.parameter1;
    this.addWeightbutton = false;
    if (event.desc != null || event.desc != undefined) {
      this.weighingscalename = event.desc;
      this.allowGrossWeight = false;
    } else {
      this.addWeightbutton = false;
      this.allowGrossWeight = true;

    }

    if (event.parameter2 == '1') {
      this.addWeightbutton = false;
      this.allowGrossWeight = true;
    } else {
      this.addWeightbutton = true;
      this.allowGrossWeight = false;
    }
  }

  /**
   * Used to make a call to print uld tag function
   *
   * @param {any} printData
   * @memberof AcceptenceWeighingBupComponent
   */
  printUldTagRequest() {
    this.printUldtagData = new PrintUldtagData();
    this.printUldtagData.cargo = this.AcceptenceWeighingBupForm.get('cargo').value;
    this.printUldtagData.xpsShipment = this.AcceptenceWeighingBupForm.get('xpsShipment').value;
    this.printUldtagData.courier = this.AcceptenceWeighingBupForm.get('courier').value;
    this.printUldtagData.tagRemarks = this.AcceptenceWeighingBupForm.get('tagRemarks').value;
    this.printUldtagData.mail = this.AcceptenceWeighingBupForm.get('mail').value;
    this.printUldtagData.dgDetails = this.AcceptenceWeighingBupForm.get('dgDetails').value;
    this.printUldtagData.dgShipment = this.AcceptenceWeighingBupForm.get('dgShipment').value;
    this.printUldtagData.mail = this.AcceptenceWeighingBupForm.get('mail').value;
    this.printUldtagData.uldNumber = this.AcceptenceWeighingBupForm.get('uldNumber').value;
    this.printUldtagData.weightCapturedManually = this.AcceptenceWeighingBupForm.get('weightCapturedManually').value;
    this.printUldtagData.pdTrolleyWeight = this.AcceptenceWeighingBupForm.get('pdTrolleyWeight').value;
    this.printUldtagData.grossWeight = this.AcceptenceWeighingBupForm.get('grossWeight').value;
    this.printUldtagData.flightKey = this.AcceptenceWeighingBupForm.get('carrierCode').value + this.AcceptenceWeighingBupForm.get('flightKey').value;
    this.printUldtagData.date = this.AcceptenceWeighingBupForm.get('date').value;
    this.printUldtagData.contourCode = this.AcceptenceWeighingBupForm.get('contourCode').value;
    this.printUldtagData.uldTareWeight = this.AcceptenceWeighingBupForm.get('uldTareWeight').value;
    this.printUldtagData.reprint = this.AcceptenceWeighingBupForm.get('reprint').value;
    if (this.segmentValue == null || this.segmentValue == "") {
      this.printUldtagData.segment = this.AcceptenceWeighingBupForm.get('flightSegmentId').value;
    }
    else {
      this.printUldtagData.segment = this.segmentValue;
    }
    this.printUldtagData.autoWeighBupHeaderId = this.autoWeighHeaderId;
    this.printUldtagData.flightSegmentId = this.AcceptenceWeighingBupForm.get('flightSegmentId').value;
    this.printULDDataValidation();
  }

  printULDDataValidation() {

    this.insertDataFlag = true;
    this.equipmentReturnFlag = true;
    if (((this.AcceptenceWeighingBupForm.get('pdTrolleyNumber').value === null) ||
      (this.AcceptenceWeighingBupForm.get('pdTrolleyNumber').value === '')) &&
      ((this.AcceptenceWeighingBupForm.get('pdTrolleyWeight').value === null) ||
        (this.AcceptenceWeighingBupForm.get('pdTrolleyWeight').value === ''))) {
      this.insertDataFlag = true;
    }


    this.checkCarrierCode();
    this.checkRecordExistsEquipmentReturn();
    this.checkConentType();
    if (this.insertDataFlag === true && this.equipmentReturnFlag === true) {
      const flightNumber = this.AcceptenceWeighingBupForm.get('flightKey').value;
      const flightKeyValue = this.AcceptenceWeighingBupForm.get('carrierCode').value + this.AcceptenceWeighingBupForm.get('flightKey').value
      this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightKeyValue);
      let length = (<NgcFormArray>this.AcceptenceWeighingBupForm.controls['equipmentReturn']).length;

      let pageData = new UldWeighRecord();
      pageData = this.AcceptenceWeighingBupForm.getRawValue();
      this.AcceptenceWeighingBupForm.get('flightKey').setValue(flightNumber);
      pageData['bupIndicator'] = true;
      pageData['acceptanceBy'] = 'ACP';
      if (!pageData.dgShipment) {
        pageData.dgDetails = null;
      }
      pageData['segment'] = this.segmentValue;
      this.acceptanceService.insertBupAutoWeighDetails
        (pageData).subscribe(response => {
          this.refreshFormMessages(response);
          if (response.messageList != null) {
            response.messageList.forEach(message => {
              if (message.code != null && message.code != '') {
                this.showErrorMessage(response.messageList[0].code);
                return;
              }
            });

          }
          if (response.data.foreignUldCheck == true) {
            this.showConfirmMessage('maintain.foreign.uld.check.3').then(fulfilled => {

              pageData.foreignUldCheck = false;
              pageData.ackWarn = false;

              this.acceptanceService.insertBupAutoWeighDetails
                (pageData).subscribe(response => {
                  this.refreshFormMessages(response);
                  if (response.messageList != null) {
                    response.messageList.forEach(message => {
                      if (message.code != null && message.code != '') {
                        this.showErrorMessage(response.messageList[0].code);
                        return;
                      }
                    });
                  }
                  if (response.data !== null) {
                    this.showDataFlag = true;
                    this.windowPrinter.open();
                    this.AcceptenceWeighingBupForm.get('autoWeighBupHeaderId').patchValue(response.data.autoWeighBupHeaderId);
                  }
                });

            }
            ).catch(reason => {
              return;
            });
          }
          else if (response.data !== null) {
            this.showDataFlag = true;
            this.windowPrinter.open();
            this.AcceptenceWeighingBupForm.get('autoWeighBupHeaderId').patchValue(response.data.autoWeighBupHeaderId);
          }
        });


    }

  }

  printULD() {

    if (this.popupPrinterForm.get("printerdropdown").value == null) {
      this.showErrorMessage("expaccpt.select.printer.and.proceed");
      return;
    }

    this.printUldtagData.printerName = this.popupPrinterForm.get("printerdropdown").value;
    this.printUldtagData.carrierCode = this.AcceptenceWeighingBupForm.get('carrierCode').value;
    this.printUldtagData.autoWeighBupHeaderId = this.AcceptenceWeighingBupForm.get('autoWeighBupHeaderId').value;
    this.printUldtagData.acceptanceBy = 'ACP';
    if (!this.printUldtagData.dgShipment) {
      this.printUldtagData.dgDetails = null;
    }
    this.acceptanceService.printAndUpdateUldTagDetails(this.printUldtagData).subscribe(response => {
      this.refreshFormMessages(response);
      if (response.success == true) {
        this.windowPrinter.hide();
        this.showSuccessStatus('g.completed.successfully');
      }
    });

  }

  setSegmentValue(event) {
    this.segmentValue = event.desc;
  }

  getTemperatureRange(event) {
    this.AcceptenceWeighingBupForm.get('requestedTemperatureRangeValue').setValue(event.desc);
  }

  onFlightdetailsChange() {

    if (this.flightIdforDropdown && (this.flightIdforDropdown.parameter1 === this.AcceptenceWeighingBupForm.get('flightKey').value && this.flightIdforDropdown.parameter2 === this.AcceptenceWeighingBupForm.get('date').value)) {
      return;
    } else {
      this.retrieveDropDownListRecords('FLIGHTSEGMENT', 'query', this.flightIdforDropdown)
        .subscribe(response => {
          this.AcceptenceWeighingBupForm.get('flightSegmentId').setValue(response[0] ? response[0].code : null);
        })
    }

  }

}
