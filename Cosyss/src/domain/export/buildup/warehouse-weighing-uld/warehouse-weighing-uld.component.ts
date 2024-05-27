import {
  Component, OnInit, NgZone, ElementRef, ViewContainerRef,
  ViewChild
} from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcWindowComponent,
  NgcUtility, NgcButtonComponent, PageConfiguration, NgcReportComponent
} from 'ngc-framework';
import { AutoWeigh, UldWeighRecord, WeighingScaleRequest, PrintUldtagData } from './.././../../export/export.sharedmodel';
import { BuildupService } from '../buildup.service';
import { ExportService } from '../../export.service';
import { AcceptanceService } from '../../acceptance/acceptance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TracingService } from './../../../tracing/tracing.service';
import { ApplicationFeatures } from '../../../common/applicationfeatures';

@Component({
  selector: 'app-warehouse-weighing-uld',
  providers: [TracingService],
  templateUrl: './warehouse-weighing-uld.component.html',
  styleUrls: ['./warehouse-weighing-uld.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

export class WarehouseWeighingUldComponent extends NgcPage {
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  reportParameters: any = new Object();
  printUldtagData = new PrintUldtagData();
  autoWeighHeaderId: any;
  weighingScaleData: string;
  enableSaveButton = true;
  uldNumberData: any;
  insertDataFlag = true;
  enableWhenPdTrolleyEntered = true;
  disableGetWeighButton = true;
  showDataFlag = false;
  showReadOnlyWeight = false;
  addWeight = true;
  flightIdforDropdown: any;
  uldForContourCode: any;
  flagShowDgDetail = false;
  segmentValue: string;
  printerSwitch = true;
  nextResponse: any;
  EquipmentReturnRowData = {
    flagInsert: 'Y',
    pdNumber: '',
    collectionDateTime: '',
    flightKey: '',
    flightOriginDate: '',
    shipmentNumber: '',
    createdDateTime: '',
    typeOfCollection: '',
    returned: false
  };
  weighingscalename: String;
  allowGrossWeight: Boolean = false;
  addWeightbutton: Boolean = false;
  weighingScaleDropdown: Boolean = false;
  dgRowData = {
    classCode: '',
    specialHandlingCode: '',
    flagInsert: 'Y'
  };
  disableInput: Boolean = false;
  @ViewChild('windowPrinter') windowPrinter: NgcWindowComponent;
  @ViewChild('outboundButton') outboundButton: NgcButtonComponent;

  popupPrinterForm: NgcFormGroup = new NgcFormGroup({
    printerdropdown: new NgcFormControl(),
  });

  private WarehouseWeighingUldForm: NgcFormGroup = new NgcFormGroup({
    flightSegmentId: new NgcFormControl(),
    acceptanceBy: new NgcFormControl('WHW'),
    uldNumber: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    weightCapturedManually: new NgcFormControl(),
    date: new NgcFormControl(),
    flightOffPoint: new NgcFormControl(),
    contourCode: new NgcFormControl(),
    uldTagPrinted: new NgcFormControl(),
    weighingScaleId: new NgcFormControl(),
    totalWeight: new NgcFormControl(),
    pdTrolleyNumber: new NgcFormControl(),
    pdTrolleyWeight: new NgcFormControl(),
    grossWeight: new NgcFormControl(),
    dryIceWeight: new NgcFormControl(),
    xpsShipment: new NgcFormControl(),
    dgShipment: new NgcFormControl(true),
    cargo: new NgcFormControl(false),
    mail: new NgcFormControl(false),
    courier: new NgcFormControl(false),
    tagRemarks: new NgcFormControl(),
    equipmentReturn: new NgcFormArray([]),
    dgDetails: new NgcFormArray([]),
    concatSHC: new NgcFormControl(),
    rfidShipment: new NgcFormControl()
  });


  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private route: ActivatedRoute,
    private router: Router, private tracingService: TracingService,
    private buildUpService: BuildupService, private exportService: ExportService, private acceptanceService: AcceptanceService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    this.showReadOnlyWeight = false;
    this.addWeight = true;
    this.WarehouseWeighingUldForm.get('rfidShipment').valueChanges.subscribe(value => {
      if (value) {
        this.printerSwitch = false
      } else {
        this.printerSwitch = true
      }
    })
  }

  ngAfterViewInit() {

    super.ngAfterViewInit();
    this.WarehouseWeighingUldForm.get('xpsShipment').setValue(false);
    //
    this.WarehouseWeighingUldForm.get('dryIceWeight').valueChanges
      .subscribe(changedValue => {
        const pdtrolleyweight: number = this.WarehouseWeighingUldForm.get('pdTrolleyWeight').value;
        const totalweight: number = this.WarehouseWeighingUldForm.get('totalWeight').value;
        const weightCapturedManually: number = this.WarehouseWeighingUldForm.get('weightCapturedManually').value;

        const abacusValue = (Number(totalweight) || Number(weightCapturedManually))
          - (Number(pdtrolleyweight) + Number(changedValue));
        this.WarehouseWeighingUldForm.get('grossWeight').setValue(abacusValue);
      });

    this.WarehouseWeighingUldForm.get('pdTrolleyWeight').valueChanges
      .subscribe(changedValue => {
        const dryIceWeight: number = this.WarehouseWeighingUldForm.get('dryIceWeight').value;
        const totalweight: number = this.WarehouseWeighingUldForm.get('totalWeight').value;
        const weightCapturedManually: number = this.WarehouseWeighingUldForm.get('weightCapturedManually').value;

        const abacusValue = (Number(totalweight) || Number(weightCapturedManually))
          - (Number(dryIceWeight) + Number(changedValue));
        this.WarehouseWeighingUldForm.get('grossWeight').setValue(abacusValue);
      });


    this.WarehouseWeighingUldForm.get('weightCapturedManually').valueChanges
      .subscribe(changedValue => {
        const pdtrolleyweight: number = this.WarehouseWeighingUldForm.get('pdTrolleyWeight').value;
        const dryIceWeight: number = this.WarehouseWeighingUldForm.get('dryIceWeight').value;

        const abacusValue = Number(changedValue) - (Number(pdtrolleyweight) + Number(dryIceWeight));
        this.WarehouseWeighingUldForm.get('grossWeight').setValue(abacusValue);
      });


    this.WarehouseWeighingUldForm.get('date').valueChanges
      .subscribe(changedValue => {
        console.log(changedValue);
        this.flightIdforDropdown =
          this.createSourceParameter(this.WarehouseWeighingUldForm.get('flightKey').value,
            this.WarehouseWeighingUldForm.get('date').value);
      });

    this.WarehouseWeighingUldForm.get('flightKey').valueChanges
      .subscribe(changedValue => {
        console.log(changedValue);
        this.flightIdforDropdown =
          this.createSourceParameter(this.WarehouseWeighingUldForm.get('flightKey').value,
            this.WarehouseWeighingUldForm.get('date').value);
      });


    this.WarehouseWeighingUldForm.get('dgShipment').valueChanges
      .subscribe(changedValue => {
        console.log(`dgShipment ${changedValue}`);
        if (changedValue === true) {
          this.flagShowDgDetail = true;
          if ((<NgcFormArray>this.WarehouseWeighingUldForm.controls['dgDetails']).length === 0) {
            this.addDgRow();
          }
        } else {
          this.flagShowDgDetail = false;
        }
      });


    this.WarehouseWeighingUldForm.get('cargo').valueChanges
      .subscribe(changedValue => {
        console.log(`cargo ${changedValue}`);
        if (changedValue === true) {
          // this.flagShowDgDetail = true;
        }

      });

    this.WarehouseWeighingUldForm.get('mail').valueChanges
      .subscribe(changedValue => {
        console.log(`mail ${changedValue}`);
        if (changedValue === true) {
          // this.flagShowDgDetail = true;
        }
      });

    this.WarehouseWeighingUldForm.get('courier').valueChanges
      .subscribe(changedValue => {
        if (changedValue === true) {
          // this.flagShowDgDetail = true;
        }
      });
  }


  navigatebackToDls() {
    let transferData: any;
    transferData = {
      flightKey: this.WarehouseWeighingUldForm.get('flightKey').value, flightOriginDate:
        this.WarehouseWeighingUldForm.get('date').value
    }
    this.navigateTo(this.router, '/export/buildup/update-dls', transferData)
  }


  onSelectDGSHC(object: any, index) {
    this.WarehouseWeighingUldForm.get(['dgDetails', index, 'specialHandlingCode']).patchValue(object.code);
  }
  checkAssignedUldTrolleyToFight() {
    this.WarehouseWeighingUldForm.get('flightSegmentId').setValue(null);
    this.flightIdforDropdown = null;
    this.allowGrossWeight = false;
    this.addWeightbutton = false;
    this.weighingScaleDropdown = false;
    this.resetFormMessages();
    this.uldForContourCode =
      this.createSourceParameter(this.WarehouseWeighingUldForm.get('uldNumber').value);
    this.uldNumberData = this.WarehouseWeighingUldForm.controls.uldNumber.value;
    if (this.WarehouseWeighingUldForm.valid) {
      const checkUldAssignmentToFightRequest = new AutoWeigh();
      checkUldAssignmentToFightRequest.uldNumber = this.WarehouseWeighingUldForm.controls['uldNumber'].value;

      this.buildUpService.checkAssignedUldTrolleyToFight
        (checkUldAssignmentToFightRequest).subscribe(response => {
          this.refreshFormMessages(response);
          const flightDetails = response.data;
          this.nextResponse = response.data;
          this.showDataFlag = true;
          if (response.messageList) {
            this.showDataFlag = false;
          } else {
            this.enableSaveButton = false;
          }
          if (response.data.dgShipment == true) {
            this.flagShowDgDetail = true;
          }
          this.disableInput = false;
          if (flightDetails !== null) {
            this.disableInput = true;
            this.autoWeighHeaderId = flightDetails.autoWeighBupHeaderId;
            this.WarehouseWeighingUldForm.patchValue(flightDetails);
            if (flightDetails.flightOffPoint != null
              && flightDetails.flightOffPoint != '') {
              this.segmentValue = flightDetails.flightOffPoint;
            }
            this.showReadOnlyWeight = false;
            this.addWeight = true;
            //  this.clearValueofWeight();
            if (flightDetails.dgDetails !== null) {
              flightDetails.dgDetails.forEach(element => {
                element.flagUpdate = 'Y';
              });
            }
          } else {
            this.WarehouseWeighingUldForm.reset();
            this.WarehouseWeighingUldForm.controls.uldNumber.setValue(this.uldNumberData);
            this.refreshFormMessages(response);
          }
        });
    } else {
    }

  }

  clearValueofWeight() {
    this.WarehouseWeighingUldForm.get('weightCapturedManually').reset();
    // this.WarehouseWeighingUldForm.get('pdTrolleyNumber').reset();
    this.WarehouseWeighingUldForm.get('pdTrolleyWeight').reset();
    this.WarehouseWeighingUldForm.get('dryIceWeight').reset();
    this.WarehouseWeighingUldForm.get('grossWeight').reset();
  }


  addNewEquipmentReturnRow() {
    (<NgcFormArray>this.WarehouseWeighingUldForm.controls['equipmentReturn']).addValue([this.EquipmentReturnRowData]);

    (<NgcFormArray>this.WarehouseWeighingUldForm.get(['equipmentReturn',
      (<NgcFormArray>this.WarehouseWeighingUldForm.controls['equipmentReturn']).length - 1, 'pdNumber']))
      .valueChanges.subscribe(changedValue => {
        const requestForEquipmentReturn: any = { 'pdNumber': changedValue };
        console.log(changedValue);
        this.checkEquipmentReturn(requestForEquipmentReturn);
      });
  }

  checkEquipmentReturn(requestForEquipmentReturn): void {
    this.buildUpService.fetchEquipmentReturnRecord(requestForEquipmentReturn).subscribe(response => {
      this.refreshFormMessages(response);
      //  this.WarehouseWeighingUldForm.get('equipmentReturn').reset();
      const data = response.data;
      const equipmentReturnFormArray: NgcFormArray =
        <NgcFormArray>this.WarehouseWeighingUldForm.get('equipmentReturn');
      //
      if (equipmentReturnFormArray) {
        equipmentReturnFormArray.controls.forEach((control: any, index: number) => {
          const formGroup: NgcFormGroup = <NgcFormGroup>control;
          //
          if (formGroup.controls['pdNumber'].value === requestForEquipmentReturn.pdNumber) {
            delete data['pdNumber'];
            data['flagUpdate'] = 'Y';
            formGroup.patchValue(data);
          }

        });
      }
      //
      console.log(data);
    });
  }

  insertRecord() {


    if (this.WarehouseWeighingUldForm.get('flightSegmentId').value == null || this.WarehouseWeighingUldForm.get('flightSegmentId').value == '0') {
      this.showErrorStatus("export.select.flight.segment.before.proceeding");
      return;
    }
    if (this.WarehouseWeighingUldForm.get('flightKey').value == null || this.WarehouseWeighingUldForm.get('flightKey').value == '0') {
      this.showErrorStatus("export.select.flight.key.before.proceeding");
      return;
    }
    if (this.WarehouseWeighingUldForm.get('date').value == null || this.WarehouseWeighingUldForm.get('date').value == '0') {
      this.showErrorStatus("export.select.flight.date.before.proceeding");
      return;
    }
    if (this.WarehouseWeighingUldForm.get('grossWeight').value == null ||
      this.WarehouseWeighingUldForm.get('grossWeight').value == '0' ||
      this.WarehouseWeighingUldForm.get('grossWeight').value == ''
    ) {
      this.showErrorStatus("export.enter.gross.weight");
      return;
    }

    var uldNumber = this.WarehouseWeighingUldForm.value.uldNumber;
    var uldNumberLength = uldNumber ? uldNumber.length : 0;
    var isUld = false;
    if (uldNumberLength >= 9 && uldNumberLength <= 11) {
      isUld = true;
    } else {
      isUld = false;
    }
    if (isUld) {
      if (this.WarehouseWeighingUldForm.get('cargo').value == false &&
        this.WarehouseWeighingUldForm.get('mail').value == false &&
        this.WarehouseWeighingUldForm.get('courier').value == false &&
        this.WarehouseWeighingUldForm.get('dgShipment').value == false &&
        this.WarehouseWeighingUldForm.get('xpsShipment').value == false) {
        this.showErrorStatus("export.select.content.type");
        return;
        // if (this.WarehouseWeighingUldForm.get('contourCode').value === null) {
        //   this.showErrorStatus("export.select.content.type");
        //   return;
        // }
      }
    }
    if (this.WarehouseWeighingUldForm.get('weightCapturedManually').value == null ||
      this.WarehouseWeighingUldForm.get('weightCapturedManually').value == '0' ||
      this.WarehouseWeighingUldForm.get('weightCapturedManually').value == ''
    ) {
      this.showErrorStatus("export.enter.uld.trolley.weight");
      return;
    }
    this.insertDataFlag = true;
    if (((this.WarehouseWeighingUldForm.get('pdTrolleyNumber').value === null) ||
      (this.WarehouseWeighingUldForm.get('pdTrolleyNumber').value === '')) &&
      ((this.WarehouseWeighingUldForm.get('pdTrolleyWeight').value === null) ||
        (this.WarehouseWeighingUldForm.get('pdTrolleyWeight').value === ''))) {
      this.insertDataFlag = true;
      this.checkRecordExistsEquipmentReturn();
    } else {
      const validPd = this.checkPdDetails();
      if (!validPd) {
        return;
      }

    }
    if (this.insertDataFlag === true) {
      this.insertAutoWeighDetails();
    }

  }



  checkRecordExistsEquipmentReturn() {
    const equipmentReturnFormArray: NgcFormArray =
      <NgcFormArray>this.WarehouseWeighingUldForm.get('equipmentReturn');
    //
    if (equipmentReturnFormArray) {
      equipmentReturnFormArray.controls.forEach((control: any, index: number) => {
        const formGroup: NgcFormGroup = <NgcFormGroup>control;
        if ((formGroup.controls['pdNumber'].value === null) || (formGroup.controls['pdNumber'].value === '')) {
          this.showErrorStatus('export.add.record.in.equipment');
          this.insertDataFlag = false;
        } else {
          this.insertDataFlag = true;
        }
      });
    }
  }

  checkPdDetails(): boolean {

    if ((this.WarehouseWeighingUldForm.get('pdTrolleyNumber').value !== '' ||
      this.WarehouseWeighingUldForm.get('pdTrolleyNumber').value !== null) &&
      (this.WarehouseWeighingUldForm.get('pdTrolleyWeight').value === null ||
        this.WarehouseWeighingUldForm.get('pdTrolleyWeight').value === '')) {
      this.showErrorStatus('export.pd.trolley.weight.required');
      this.insertDataFlag = false;
      return false;
    }
    if ((this.WarehouseWeighingUldForm.get('pdTrolleyWeight').value !== null)
      && ((this.WarehouseWeighingUldForm.get('pdTrolleyNumber').value === null)
        || (this.WarehouseWeighingUldForm.get('pdTrolleyNumber').value === '')
      )) {
      this.showErrorStatus('export.pd.trolley.number.required');
      this.insertDataFlag = false;
      return false;
    }
    return true;
  }


  insertAutoWeighDetails() {

    let pageData = new UldWeighRecord();
    pageData = this.WarehouseWeighingUldForm.getRawValue();
    console.log(pageData);
    pageData.grossWeightMore = true;
    pageData.grossWeightLess = true;
    pageData.acceptanceBy = 'WHW';
    if (!pageData.dgShipment) {
      pageData.dgDetails = null;
    }
    this.buildUpService.insertUldWeighRecord
      (pageData).subscribe(response => {
        this.refreshFormMessages(response);
        if (response.data !== null) {

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
              pageData.acceptanceBy = 'WHW';
              if (!pageData.dgShipment) {
                pageData.dgDetails = null;
              }
              this.buildUpService.insertUldWeighRecord
                (pageData).subscribe(response => {
                  this.refreshFormMessages(response);
                  if (response.data !== null) {
                    this.showSuccessStatus('g.completed.successfully');
                  }
                });

            }
            ).catch(reason => {
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
              pageData.acceptanceBy = 'WHW';
              if (!pageData.dgShipment) {
                pageData.dgDetails = null;
              }
              this.buildUpService.insertUldWeighRecord
                (pageData).subscribe(response => {
                  this.refreshFormMessages(response);
                  if (response.data !== null) {
                    this.showSuccessStatus('g.completed.successfully');
                  }
                });

            }
            ).catch(reason => {
              return;
            });
          } else if (response.data && response.data.warnForForeignUld) {
            let confirmationMessage = null;
            if (response.data.warnigInfoAndErrorMessage.length > 6) {
              confirmationMessage = "maintain.foreign.uld.check.5";
            } else {
              confirmationMessage = "maintain.foreign.BT.check.5"
            }
            this.showConfirmMessage(NgcUtility.translateMessage(confirmationMessage, [response.data.warnigInfoAndErrorMessage])).then(fulfilled => {
              pageData.ackForeignUld = true;
              this.buildUpService.insertUldWeighRecord(pageData).subscribe(resp => {
                if (!this.showResponseErrorMessages(resp)) {
                  this.showSuccessStatus("g.completed.successfully");
                }
              });
            }
            ).catch(reason => {
            });
          }
          else if (response.data.grossWeightLess == true && response.data.grossWeightMore == true) {
            this.refreshFormMessages(response);
            if (response.data !== null) {
              this.showSuccessStatus('g.completed.successfully');
            }
          }
        }
      });
  }


  getWeight() {
    let request: WeighingScaleRequest = new WeighingScaleRequest();
    if (this.weighingScaleData) {
      const tempDetails = this.weighingScaleData.split(':');
      request.wscaleIP = tempDetails[0];

      request.wscalePort = tempDetails[1];;
      console.log(request);
      this.exportService.getWeightInformation(request).subscribe(response => {
        this.refreshFormMessages(response);
        if (!this.showResponseErrorMessages(response)) {
          this.weighingScaleDropdown = true;
        } else {
          this.weighingScaleDropdown = false;
        }
        if (response.data !== null && response.data !== "") {
          console.log(response.data);
          this.WarehouseWeighingUldForm.get('weightCapturedManually').setValue(response.data);
          this.showReadOnlyWeight = true;
          this.addWeight = false;

        } else {
          this.WarehouseWeighingUldForm.get('weightCapturedManually').setValue(0.0);
          this.showReadOnlyWeight = false;
          this.addWeight = true;
        }
      })
    } else {
      this.showErrorStatus("export.select.weighing.scale");
      return;
    }
  }

  addDgRow() {
    (<NgcFormArray>this.WarehouseWeighingUldForm.controls['dgDetails']).addValue([this.dgRowData]);
    console.log((<NgcFormArray>this.WarehouseWeighingUldForm.get(['dgDetails'])));
  }

  onDeleteRowDgDetail(event, index) {
    const deleteRec = (<NgcFormArray>this.WarehouseWeighingUldForm.controls['dgDetails']);
    deleteRec.removeAt(index);
    //deleteRec.markAsDeletedAt(index);
    console.log(index);
  }

  onDeleteRowEquipmentReturn(event, index) {
    const deleteRec = (<NgcFormArray>this.WarehouseWeighingUldForm.controls['equipmentReturn']);
    deleteRec.removeAt(index);
  }


  onSelect(event) {
    console.log(event);
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

  printUldTagRequest() {
    this.printUldtagData.cargo = this.WarehouseWeighingUldForm.get('cargo').value;
    this.printUldtagData.xpsShipment = this.WarehouseWeighingUldForm.get('xpsShipment').value;
    this.printUldtagData.courier = this.WarehouseWeighingUldForm.get('courier').value;
    this.printUldtagData.tagRemarks = this.WarehouseWeighingUldForm.get('tagRemarks').value;
    this.printUldtagData.mail = this.WarehouseWeighingUldForm.get('mail').value;
    this.printUldtagData.dgDetails = this.WarehouseWeighingUldForm.get('dgDetails').value;
    this.printUldtagData.dgShipment = this.WarehouseWeighingUldForm.get('dgShipment').value;
    this.printUldtagData.uldNumber = this.WarehouseWeighingUldForm.get('uldNumber').value;
    this.printUldtagData.weightCapturedManually = this.WarehouseWeighingUldForm.get('weightCapturedManually').value;
    this.printUldtagData.pdTrolleyWeight = this.WarehouseWeighingUldForm.get('pdTrolleyWeight').value;
    this.printUldtagData.grossWeight = this.WarehouseWeighingUldForm.get('grossWeight').value;
    this.printUldtagData.flightKey = this.WarehouseWeighingUldForm.get('flightKey').value;
    this.printUldtagData.date = this.WarehouseWeighingUldForm.get('date').value;
    this.printUldtagData.segment = this.segmentValue;
    this.printUldtagData.autoWeighBupHeaderId = this.autoWeighHeaderId;
    this.printUldtagData.flightSegmentId = this.WarehouseWeighingUldForm.get('flightSegmentId').value;
    this.printUldtagData.reprint = this.WarehouseWeighingUldForm.get('reprint').value;
    this.printUldDataValidation();
  }

  printUldDataValidation() {

    if (this.WarehouseWeighingUldForm.get('flightSegmentId').value == null ||
      this.WarehouseWeighingUldForm.get('flightSegmentId').value == '0'
      || this.WarehouseWeighingUldForm.get('flightSegmentId').value == '') {
      this.showErrorStatus("export.select.flight.segment.before.proceeding");
      return;
    }


    this.printUldtagData.printerName = this.popupPrinterForm.get("printerdropdown").value;
    if (this.WarehouseWeighingUldForm.get('flightSegmentId').value == null || this.WarehouseWeighingUldForm.get('flightSegmentId').value == '0') {
      this.showErrorStatus("export.select.flight.segment.before.proceeding");
      return;
    }
    if (this.WarehouseWeighingUldForm.get('flightKey').value == null || this.WarehouseWeighingUldForm.get('flightKey').value == '0') {
      this.showErrorStatus("export.select.flight.key.before.proceeding");
      return;
    }
    if (this.WarehouseWeighingUldForm.get('date').value == null || this.WarehouseWeighingUldForm.get('date').value == '0') {
      this.showErrorStatus("export.select.flight.date.before.proceeding");
      return;
    }
    if (this.WarehouseWeighingUldForm.get('grossWeight').value == null ||
      this.WarehouseWeighingUldForm.get('grossWeight').value == '0' ||
      this.WarehouseWeighingUldForm.get('grossWeight').value == ''
    ) {
      this.showErrorStatus("export.enter.gross.weight");
      return;
    }

    var uldNumber = this.WarehouseWeighingUldForm.value.uldNumber;
    var uldNumberLength = uldNumber ? uldNumber.length : 0;
    var isUld = false;
    if (uldNumberLength >= 9 && uldNumberLength <= 11) {
      isUld = true;
    } else {
      isUld = false;
    }
    if (isUld) {
      if (this.WarehouseWeighingUldForm.get('cargo').value == false &&
        this.WarehouseWeighingUldForm.get('mail').value == false &&
        this.WarehouseWeighingUldForm.get('courier').value == false &&
        this.WarehouseWeighingUldForm.get('dgShipment').value == false &&
        this.WarehouseWeighingUldForm.get('xpsShipment').value == false) {
        this.showErrorStatus("export.select.content.type");
        return;

      }
    }
    if (this.WarehouseWeighingUldForm.get('weightCapturedManually').value == null ||
      this.WarehouseWeighingUldForm.get('weightCapturedManually').value == '0' ||
      this.WarehouseWeighingUldForm.get('weightCapturedManually').value == ''
    ) {
      this.showErrorStatus("export.enter.uld.trolley.weight");
      return;
    }
    if (((this.WarehouseWeighingUldForm.get('pdTrolleyNumber').value === null) ||
      (this.WarehouseWeighingUldForm.get('pdTrolleyNumber').value === '')) &&
      ((this.WarehouseWeighingUldForm.get('pdTrolleyWeight').value === null) ||
        (this.WarehouseWeighingUldForm.get('pdTrolleyWeight').value === ''))) {
      this.insertDataFlag = true;
      this.checkRecordExistsEquipmentReturn();
    } else {
      const validPd = this.checkPdDetails();
      if (!validPd) {
        return;
      }

    }

    let pageData = new UldWeighRecord();
    pageData = this.WarehouseWeighingUldForm.getRawValue();
    console.log(pageData);
    pageData.grossWeightMore = true;
    pageData.grossWeightLess = true;
    pageData.acceptanceBy = 'WHW';
    if (!pageData.dgShipment) {
      pageData.dgDetails = null;
    }
    this.buildUpService.insertUldWeighRecord
      (pageData).subscribe(response => {
        this.refreshFormMessages(response);
        if (response.data !== null) {

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
              pageData.acceptanceBy = 'WHW';
              if (!pageData.dgShipment) {
                pageData.dgDetails = null;
              }
              this.buildUpService.insertUldWeighRecord
                (pageData).subscribe(response => {
                  this.refreshFormMessages(response);
                  if (response.data !== null) {
                    this.WarehouseWeighingUldForm.get('autoWeighBupHeaderId').patchValue(response.data.autoWeighBupHeaderId);
                    this.showSuccessStatus('g.completed.successfully');
                    //Bug 20431 - AISATS - ULD Tag Print issue
                    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Dlv_POClientPrint)) {
                      this.reportParameters.autoWeighBupHeaderId = this.WarehouseWeighingUldForm.get('autoWeighBupHeaderId').value
                      this.reportParameters.remarks = this.WarehouseWeighingUldForm.get('tagRemarks').value
                      this.reportParameters.uldNumber = this.WarehouseWeighingUldForm.get('uldNumber').value
                      this.reportWindow.open();
                    }
                    else {
                      this.windowPrinter.open();
                    }
                  }
                });

            }
            ).catch(reason => {
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
              pageData.acceptanceBy = 'WHW';
              if (!pageData.dgShipment) {
                pageData.dgDetails = null;
              }
              this.buildUpService.insertUldWeighRecord
                (pageData).subscribe(response => {
                  this.refreshFormMessages(response);
                  if (response.data !== null) {
                    this.WarehouseWeighingUldForm.get('autoWeighBupHeaderId').patchValue(response.data.autoWeighBupHeaderId);
                    this.showSuccessStatus('g.completed.successfully');
                    //Bug 20431 - AISATS - ULD Tag Print issue
                    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Dlv_POClientPrint)) {
                      this.reportParameters.autoWeighBupHeaderId = this.WarehouseWeighingUldForm.get('autoWeighBupHeaderId').value
                      this.reportParameters.remarks = this.WarehouseWeighingUldForm.get('tagRemarks').value
                      this.reportParameters.uldNumber = this.WarehouseWeighingUldForm.get('uldNumber').value
                      this.reportWindow.open();
                    }
                    else {
                      this.windowPrinter.open();
                    }
                  }
                });

            }
            ).catch(reason => {
              return;
            });
          }
          else if (response.data && response.data.warnForForeignUld) {
            let confirmationMessage = null;
            if (response.data.warnigInfoAndErrorMessage.length > 6) {
              confirmationMessage = "maintain.foreign.uld.check.5";
            } else {
              confirmationMessage = "maintain.foreign.BT.check.5"
            }
            this.showConfirmMessage(NgcUtility.translateMessage(confirmationMessage, [response.data.warnigInfoAndErrorMessage])).then(fulfilled => {
              pageData.ackForeignUld = true;
              this.buildUpService.insertUldWeighRecord(pageData).subscribe(resp => {
                if (!this.showResponseErrorMessages(resp)) {
                  this.WarehouseWeighingUldForm.get('autoWeighBupHeaderId').patchValue(resp.data.autoWeighBupHeaderId);
                  this.showSuccessStatus("g.completed.successfully");
                  if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Dlv_POClientPrint)) {
                    this.reportParameters.autoWeighBupHeaderId = this.WarehouseWeighingUldForm.get('autoWeighBupHeaderId').value
                    this.reportParameters.remarks = this.WarehouseWeighingUldForm.get('tagRemarks').value
                    this.reportParameters.uldNumber = this.WarehouseWeighingUldForm.get('uldNumber').value
                    this.reportWindow.open();
                  }
                  else {
                    this.windowPrinter.open();
                  }
                }
              });
            }
            ).catch(reason => {
            });
          }
          else if (response.data.grossWeightLess == true && response.data.grossWeightMore == true) {
            this.refreshFormMessages(response);
            if (response.data !== null) {
              this.WarehouseWeighingUldForm.get('autoWeighBupHeaderId').patchValue(response.data.autoWeighBupHeaderId);
              this.showSuccessStatus('g.completed.successfully');
              //Bug 20431 - AISATS - ULD Tag Print issue
              if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Dlv_POClientPrint)) {
                this.reportParameters.autoWeighBupHeaderId = this.WarehouseWeighingUldForm.get('autoWeighBupHeaderId').value
                this.reportParameters.remarks = this.WarehouseWeighingUldForm.get('tagRemarks').value
                this.reportParameters.uldNumber = this.WarehouseWeighingUldForm.get('uldNumber').value
                this.reportWindow.open();
              }
              else {
                this.windowPrinter.open();
              }
            }
          }



        }

      });

    //this.insertRecord();

  }

  printUld() {

    if (this.popupPrinterForm.get("printerdropdown").value == null) {
      this.showErrorStatus("expaccpt.select.printer.and.proceed");
      return;
    }

    this.printUldtagData.autoWeighBupHeaderId = this.WarehouseWeighingUldForm.get('autoWeighBupHeaderId').value;
    this.printUldtagData.printerName = this.popupPrinterForm.get("printerdropdown").value;
    this.printUldtagData.acceptanceBy = 'WHW';
    if (!this.printUldtagData.dgShipment) {
      this.printUldtagData.dgDetails = null;
    }
    this.acceptanceService.printAndUpdateUldTagDetails(this.printUldtagData).subscribe(response => {
      this.refreshFormMessages(response);
      this.windowPrinter.hide();
      if (response.success) {
        this.showSuccessStatus("export.request.to.print.successfully");
      }
    });

  }

  setSegmentValue(event) {
    console.log(event);
    this.segmentValue = event.desc;
  }

  printRfid() {
    let request = {
      uldKey: this.WarehouseWeighingUldForm.get('uldNumber').value,
      uldNumber: this.WarehouseWeighingUldForm.get('uldNumber').value,
      stage: 'PRINT',
      segment: this.WarehouseWeighingUldForm.get('segment').value,
      printerName: this.popupPrinterForm.get("printerdropdown").value,
      pieceNo: 1,
      pieces: 1,
      createdUserCode: this.getUserProfile().customerCode,
      loggedInUser: this.getUserProfile().userLoginCode,
      flightDate: this.WarehouseWeighingUldForm.get('date').value,
      flightId: null,
      flightKey: this.WarehouseWeighingUldForm.get('flightKey').value,
      flightSegmentId: this.WarehouseWeighingUldForm.get('flightSegmentId').value,
      dryIceWeight: this.WarehouseWeighingUldForm.get('dryIceWeight').value,
      grossWeight: this.WarehouseWeighingUldForm.get('grossWeight').value,
      contourCode: this.WarehouseWeighingUldForm.get('contourCode').value,
      carrierCode: this.WarehouseWeighingUldForm.get('carrierCode').value,
      printFlightDate: this.WarehouseWeighingUldForm.get('date').value,
      tagRemarks: this.WarehouseWeighingUldForm.get('tagRemarks').value,
      tagType: 'ULD',
      dgShipment: this.WarehouseWeighingUldForm.get('dgShipment').value,
      cargo: this.WarehouseWeighingUldForm.get('cargo').value,
      mail: this.WarehouseWeighingUldForm.get('mail').value,
      courier: this.WarehouseWeighingUldForm.get('courier').value,
      xpsShipment: this.WarehouseWeighingUldForm.get('xpsShipment').value,
      dgDetails: this.WarehouseWeighingUldForm.get('dgDetails').value
    }

    if (!request.printerName) {
      this.showErrorStatus(
        "expaccpt.select.printer.and.proceed"
      );
      return;
    }
    this.tracingService.onPrintRfid(request).subscribe(response => {
      if (response.data) {
        this.windowPrinter.hide();
        this.showSuccessStatus('g.completed.successfully');
      } else {
        this.refreshFormMessages(response);
      }
    });
  }

  onFlightdetailsChange() {
    this.retrieveDropDownListRecords('FLIGHTSEGMENT', 'query', this.flightIdforDropdown)
      .subscribe(response => {
        (<NgcFormArray>this.WarehouseWeighingUldForm.get('flightSegmentId')).setValue(response[0].code);
      })

  }
}
