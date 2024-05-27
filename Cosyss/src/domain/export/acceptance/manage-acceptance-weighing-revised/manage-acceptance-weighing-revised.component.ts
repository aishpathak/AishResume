import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcFormGroup, NgcFormControl, NgcPage, NgcUtility, NgcFormArray, NgcReportComponent,
  NgcDataTableComponent,
  PageConfiguration
} from 'ngc-framework';
import { TracingService } from './../../../tracing/tracing.service';
import { AcceptanceService } from '../acceptance.service';
import {
  VolumetricRequest, CargoWeighingRevisedServiceModelRevised, ShipmentModel, weighingTimeModel, WeighingScaleRequest, WeighingScaleWeighingRequest, Dimention
  , ScannerResponseModel
} from './../../export.sharedmodel';
import { ExportService } from './../../export.service';
import { ConfirmSightedUldRequest } from '../../../uld/uld.shared';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, Observable, interval } from 'rxjs';
import { EventEmitter } from 'protractor';
import { METHODS } from 'http';





@Component({
  selector: 'app-manage-acceptance-weighing-revised',
  templateUrl: './manage-acceptance-weighing-revised.component.html',
  styleUrls: ['./manage-acceptance-weighing-revised.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

// @PageConfiguration({
//   trackInit: true,
//   callNgOnInitOnClear: true
// })
export class ManageAcceptanceWeighingRevisedComponent extends NgcPage implements OnInit {

  constructor(private router: Router, appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private exportService: ExportService, private _acceptanceService: AcceptanceService, private activatedRoute: ActivatedRoute, private tracingService: TracingService) {
    super(appZone, appElement, appContainerElement);
  }
  @ViewChild('releasedtable') releasetable: NgcDataTableComponent;


  ngOnInit() {
    super.ngOnInit();
    this.transferData = this.getNavigateData(this.activatedRoute);


    if (this.transferData != null && this.transferData !== undefined && !this.transferData.fromDate) {


      this.weighingForm.get('shipmentNumber').setValue(this.transferData);

      this.onSearch();

    } else if (this.transferData != null && this.transferData !== undefined && this.transferData.fromDate) {
      this.weighingForm.get('shipmentNumber').setValue(this.transferData.shipmentNumber);

      this.onSearch();
    }
  }
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  valueUpdateFlag: Boolean = false;
  valueUpdateIndex: number;
  autoFocusEnum: string;
  finalizeButtonDisableFlag: Boolean = false;

  //
  weighingscalename: String;
  volumetricScannerName: String;
  saveDimensionMandatoryFlag: Boolean = true;
  partDimensionMandatoryFlag: Boolean = true;
  finalizeDimensionMandatoryFlag: Boolean = true;
  volumetricScannerId: String;
  volumetricScannerType: String;
  volumetricScannerIP: String;
  couflag: Boolean = false;
  delayAcceptanceFlag: Boolean = false;
  partenableflag: Boolean = true;
  volumetricButtonEnableFlag = false;
  displayFlag: Boolean = false;
  svcFlag: Boolean = false;
  reportParameters: any;
  previousDocumentAcceptedPieces: any;
  volumetricWeightEnableFlag: Boolean = false;
  preveiousWeighingAcceptedPieces: any;
  resp: any;
  awbDropdown: string[];
  getDimensionMandatoryFlag: any;
  totalDimensionPieces: number;
  totalWeight: any;
  totalPieces: any;
  totalDimensionWeight: number;
  transferData: any;
  weighingScaleData: any;
  onStartWeighingSelect: Boolean = false;
  startweighingflag: Boolean = false;
  totalVolPieces: any = 0;
  shipmentVolumetricWeight: any = 0;
  finalize: Boolean = false;
  volumetricweight: number;
  enableEcc: Boolean = false;
  allowGrossWeight: Boolean = true;
  eccfinalized: Boolean = false;
  shipmentlocationerrorflag: Boolean = false;
  startWeighingButton: Boolean = false;
  showReadOnlyWeight: Boolean = false;
  addWeight: Boolean = false;
  enableVolScannerButton: Boolean = false;
  actionlistindicator: any;
  private cargoIndicator: string = '';
  private totalCargoPieces: any = 0;
  private totalCargoWeight: any = 0;
  shclist: string[];

  private volmetricWeightSubscription: Subscription;
  private form: NgcFormGroup = new NgcFormGroup({
    rfidList: new NgcFormArray([])
  });
  private weighingForm: NgcFormGroup = new NgcFormGroup({
    totalAcceptedWeightSum: new NgcFormControl(0.0),
    totalAcceptedPiecesSum: new NgcFormControl(0),
    shipmentNumber: new NgcFormControl(),
    shipmentModel: new NgcFormGroup({
      flight: new NgcFormGroup({})
    }),

    awbList: new NgcFormControl(),
    printerQueueName: new NgcFormControl(),
    weigingstartdate: new NgcFormControl(),
    weighingScaleId: new NgcFormControl(),
    weighingstarttime: new NgcFormControl(),
    latestLoggedInTime: new NgcFormControl(),
    totalVolWeight: new NgcFormControl('0'),
    cmtButton: new NgcFormControl(),
    inhButton: new NgcFormControl(),
    mcButton: new NgcFormControl(),
    dryIceWeight: new NgcFormControl(),
    densityCode: new NgcFormControl(),
    cfButton: new NgcFormControl(),
    svcFlag: new NgcFormControl(),
    differenceWeight: new NgcFormControl(0.0),
    differencePieces: new NgcFormControl(0),

    differenceWeightPercent: new NgcFormControl(0),
    cargoWeighingDetailModel: new NgcFormArray([
    ]),
    remarks: new NgcFormArray([
    ]),
    fwbDimension: new NgcFormArray([
    ]),

    dimension: new NgcFormArray([
      new NgcFormGroup({
        length: new NgcFormControl('0'),
        width: new NgcFormControl('0'),
        height: new NgcFormControl('0'),
        volume: new NgcFormControl('0'),
        pcs: new NgcFormControl('0'),
        manualScanReason: new NgcFormControl(),
        manualScanReasonValue: new NgcFormControl(),
        measurementUnitCode: new NgcFormControl(),
        volumeCode: new NgcFormControl(),
        weightCode: new NgcFormControl(),
        voulmetricEnableFlag: new NgcFormControl(false),
        volumetricWeight: new NgcFormControl(),
        dimensionCapturedManually: new NgcFormControl(),
        volumetricScannerName: new NgcFormControl(),
        messageId: new NgcFormControl(),
        texture: new NgcFormControl(),
        errorFlag: new NgcFormControl(),
        errorCode: new NgcFormControl(),
        errorDescription: new NgcFormControl(),
        multiplier: new NgcFormControl(),
        totalPieces: new NgcFormControl(),
        totalVolumetricWeight: new NgcFormControl(),
        weighingId: new NgcFormControl()
      })
    ]),
    ruleShipmentExecutionDetails: new NgcFormGroup({
      execInfoList: new NgcFormArray([]),
      execWarnList: new NgcFormArray([]),
      execErrorList: new NgcFormArray([]),
    }),
  })


  // method for routing to flight planner screen called on click of Flight Planner List button
  onClickFlightPlanner() {
    this.navigateTo(this.router, '/export/planning-list', this.transferData);
  }



  onSearch() {

    const cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();
    const shipmentObj: ShipmentModel = new ShipmentModel();
    shipmentObj.shipmentNumber = this.weighingForm.get('shipmentNumber').value;
    this.finalizeButtonDisableFlag = false;
    this.delayAcceptanceFlag = false;
    //validation for checking whether shipment number is there or not
    if (shipmentObj.shipmentNumber) {
      cargo.shipmentModel = shipmentObj;
    } else {
      this.showErrorMessage("export.enter.shipment.number");
      return;
    }

    this.saveDimensionMandatoryFlag = true;
    this.partDimensionMandatoryFlag = true;
    this.finalizeDimensionMandatoryFlag = true;
    cargo.messageList = [];
    this.exportService.onSearchAWBRevised(cargo).subscribe(data => {

      if (data.messageList != null && data.messageList.length > 0) {
        var message = data.messageList[0];
        if (message.code === 'DG_DETAILS_REQ_VALIDATION') {
          if (message.type === 'E') {
            this.showErrorStatus(message.code);
            return;
          } else {
            this.showConfirmMessage(message.code).then(fulfilled => {
              this.onSucessResponse(data, cargo);
            }).catch(reason => {

            })
          }
        }
      } else {
        this.onSucessResponse(data, cargo);
      }
    });

  }

  onSucessResponse(data, cargo) {
    if (data.data != null) {
      this.preveiousWeighingAcceptedPieces = data.data.weighingAcceptedPieces;
      this.previousDocumentAcceptedPieces = data.data.acceptedDocumentPieces;

      if (data.data.status === 'SERVICING' || data.data.status === 'ACCEPTED') {
        this.resp = data.data;
        //  this.weighingForm.get('dryIceWeight').patchValue(this.resp.totalDryIceWeight);
        this.volumetricWeightEnableFlag = this.resp.volumetricWeightEnableFlag;
        this.enableEcc = this.resp.physicalEcc;
        this.displayFlag = true;
        if (this.resp.svc == 1) {
          this.weighingForm.get('svcFlag').patchValue(true);
        } else {
          this.weighingForm.get('svcFlag').patchValue(false);
        }
        this.resetFormMessages();
        this.weighingForm.patchValue(this.resp);
        this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstarttime));
        this.weighingForm.get('shipmentNumber').patchValue(this.resp.shipmentModel.shipmentNumber);
        this.weighingForm.get('dimensionActualArray').patchValue(this.resp.dimension)
        this.eccfinalized = this.resp.eccFinalized;
        this.partenableflag = this.resp.partEnableFlag;

        if (this.resp.weighingstarttime != null) {
          this.startweighingflag = true;
        } else {
          this.startweighingflag = false;
        }

        this.awbDropdown = this.resp.shipmentNumberList;
        this.shclist = this.resp.shclist;
        const lenflag = (<NgcFormArray>this.weighingForm.get('cargoWeighingDetailModel')).length;

        //logic for default row addition 
        if (!this.resp.finalize && lenflag == 0) {
          this.onAddRow()
        }
        if (this.resp.finalize == 1) {

          this.disableOnFinalize();
        } else {
          this.finalize = false;
        }
        let errorMessage: string = null;
        if (data.messageList != null && data.messageList.length > 0) {

          errorMessage = data.messageList[0].code;
          if (errorMessage === 'DG_DETAILS_REQ_VALIDATION') {
            errorMessage = null;
          }
        }
        this.fetchRuleExecutionList(cargo, errorMessage);
      } else {
        this.showErrorMessage("expaccpt.eacceptnace.not.done");
      }

      if (data.data.delayAcceptanceFlag === true) {
        this.delayAcceptanceFlag = data.data.delayAcceptanceFlag;
        this.weighingForm.get('cargoWeighingDetailModel').disable();
      }

    } else if (data.messageList != null && data.messageList.length > 0) {
      let error: string = data.messageList[0].code;
      if (error !== 'DG_DETAILS_REQ_VALIDATION') {
        this.showErrorMessage(error);
      }

    } else {
      this.showErrorMessage("export.no.data.found");
    }
  }

  onBackToSummary() {
    const awbNumber = this.weighingForm.get('shipmentNumber').value;
    this.navigateTo(this.router, 'export/acceptance/managecargoacceptance', awbNumber);
  }


  releaseEvent(event) {
    if (event.index == 2) {
      this.releasetable.render();
    }

  }
  disableOnFinalize() {

    this.finalize = true
    this.weighingForm.disable();
    this.weighingForm.get('shipmentNumber').enable();
    this.finalizeButtonDisableFlag = true;
    //  this.weighingForm.get('awbList').enable();
  }
  enableOnUnfinalize() {
    this.weighingForm.enable();
    this.weighingForm.get('shipmentNumber').enable();
    this.finalizeButtonDisableFlag = false;
    this.finalize = false;
  }
  onSelectAWB() {
    const shipmentObj: ShipmentModel = new ShipmentModel();
    shipmentObj.shipmentNumber = this.weighingForm.get('shipmentNumber').value;
    this.weighingForm.get('shipmentNumber').patchValue(this.weighingForm.get('shipmentNumber').value);
    // this.weighingForm.get('shipmentNumber').patchValue(event);
  }

  onSelectScale(event) {

    this.weighingScaleData = event.parameter1;
    this.addWeight = false;
    if (event.desc != null || event.desc != undefined) {
      this.weighingscalename = event.desc;
    } else {
      this.addWeight = false;
      this.allowGrossWeight = true;

    }

    if (event.parameter2 == '1') {
      this.addWeight = false;
      this.allowGrossWeight = true;
    } else {
      this.addWeight = true;
      this.allowGrossWeight = false;
    }

  }

  onSelectVolumetricScanner(event) {
    if (event.desc != null || event.desc != undefined) {
      this.volumetricScannerName = event.desc;
      if (event.parameter2 != null || event.parameter2 != undefined) {
        this.volumetricScannerId = event.parameter2;
      }
      if (event.parameter3 != null || event.parameter3 != undefined) {
        this.volumetricScannerType = event.parameter3;
      }
      if (event.parameter6 != null || event.parameter6 != undefined) {
        this.volumetricScannerIP = event.parameter6;
      }
    } else {
      this.enableVolScannerButton = false;
    }
    if (event.parameter1 == '1') {
      this.enableVolScannerButton = true;
    } else if (event.parameter1 == '0') {
      this.enableVolScannerButton = false;
    }
  }
  onGetWeight(event, index) {

    let request: WeighingScaleRequest = new WeighingScaleRequest();
    if (this.weighingForm.get('weighingScaleId').value == null) {
      this.showErrorMessage("export.select.weighing.scale");
      return;
    }
    if (this.weighingScaleData != undefined && this.weighingScaleData != null) {
      if (this.weighingForm.get('weighingScaleId').value != null) {
        this.weighingscalename = event.desc;
        this.weighingForm.get(['cargoWeighingDetailModel', index, 'weighingScaleId']).setValue(event.desc);
      }
      const tempDetails = this.weighingScaleData.split(':');
      request.wscaleIP = tempDetails[0];
      request.wscalePort = tempDetails[1];
      this.exportService.getWeightInformation(request).subscribe(response => {
        this.refreshFormMessages(response);
        if (response.data !== null && response.data !== "") {
          this.weighingForm.get(['cargoWeighingDetailModel', index, 'grossWeight']).setValue(response.data);

        } else {
          this.weighingForm.get(['cargoWeighingDetailModel', index, 'grossWeight']).patchValue(0.0);

        }
      })
    }


  }

  onCancel(event) {
    const awbNumber = this.weighingForm.get('shipmentNumber').value;
    this.navigateTo(this.router, 'export/acceptance/managecargoacceptance', awbNumber);
  }
  onClickRfid() {
    if (this.weighingForm.get('printerQueueName').value == null || this.weighingForm.get('printerQueueName').value == undefined) {
      this.showErrorMessage("expaccpt.select.printer");
      return
    }
    this.showConfirmMessage('export.print.tag.per.piece.confirmation').then(fulfilled => {


      let pieces: any = this.weighingForm.get('weighingAcceptedPieces').value;
      let i = 1;
      for (let i = 0; i < pieces; i++) {


        (<NgcFormArray>this.form.controls['rfidList']).addValue([
          {
            tagId: null,
            select: false,
            pieceNo: i + 1,
            pieces: 1,
            stage: 'PRINT',
            uldNo: null,
            shipmentNo: this.weighingForm.get('shipmentNumber').value,
            printerName: this.weighingForm.get('printerQueueName').value,
            tagType: 'AWB'
          }
        ]);

      }
      const reprint = (<NgcFormArray>this.form.get(['rfidList'])).getRawValue();
      let obj = {
        shipmentId: null,
        desktop: 'D',
        shipmentNo: this.weighingForm.get('shipmentNumber').value,
        tagList: reprint
      }
      this.tracingService.onPrint(obj).subscribe(response => {
        if (response.data) {
          this.showSuccessStatus('g.completed.successfully');
          //this.onSearchRfid();
        } else {
          this.refreshFormMessages(response);
        }
      });


    }).catch(reason => {
      const shipmentNo = this.weighingForm.get('shipmentNumber').value;
      this.navigateTo(this.router, 'tracing/manage-rfid', shipmentNo);
    });

  }




  onFinalizeWeight() {

    let cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();
    cargo = this.weighingForm.getRawValue();
    cargo.isFinalizeSuffix = true;
    if (this.shipmentlocationerrorflag == true) {
      this.showErrorMessage("expaccpt.input.valid.shipment.warehouse.location");
      return;
    }
    cargo.messageList = [];
    this.exportService.getExcludedSHCFlagForVolumetric(cargo).subscribe(data => {
      if (data.success == true) {
        this.getDimensionMandatoryFlag = data.data;

        for (const entry of (<NgcFormGroup>this.weighingForm.get(['dimension'])).getRawValue()) {
          if ((entry.manualScanReason == "" || entry.manualScanReason == null) && (entry.dimensionCapturedManually == true)) {
            this.showErrorMessage("export.select.manual.scan.reason");
            return;
          }
          if (entry.length == null || entry.length == "" || entry.width == null || entry.width == ""
            || entry.height == null || entry.height == "" || entry.pcs == null || entry.pcs == "") {
            if (this.finalizeDimensionMandatoryFlag == true) {
              this.showErrorMessage("export.carrier.required.volumetric.dimensions");
              this.finalizeDimensionMandatoryFlag = false;
              return;
            }

          }
        }

        if (this.weighingForm.get('volumetricWeightEnableFlag').value == true && this.getDimensionMandatoryFlag == true) {


          const lineItem = (<NgcFormGroup>this.weighingForm.get(['dimension'])).getRawValue();
          if (lineItem.length > 0) {
            let totaldimpieces = 0;
            for (const entry of (<NgcFormGroup>this.weighingForm.get(['dimension'])).getRawValue()) {
              if ((entry.manualScanReason == "" || entry.manualScanReason == null) && (entry.dimensionCapturedManually == true)) {
                this.showErrorMessage("export.select.manual.scan.reason");
                return;
              }
              if (entry.length == null || entry.length == "" || entry.width == null || entry.width == ""
                || entry.height == null || entry.height == "" || entry.pcs == null || entry.pcs == "") {
                if (this.finalizeDimensionMandatoryFlag == true) {
                  this.showErrorMessage("export.carrier.required.volumetric.dimensions");
                  this.finalizeDimensionMandatoryFlag = false;
                  return;
                }
              }
              totaldimpieces = totaldimpieces + entry.totalPieces;
            }

            let weighingpiecessum = 0;
            this.weighingForm.get('cargoWeighingDetailModel').value.forEach(element => {
              weighingpiecessum = weighingpiecessum + element.piece;
            });

            if (this.weighingForm.get('volumetricWeightEnableFlag').value == true && totaldimpieces != weighingpiecessum) {
              this.showErrorMessage("export.total.dimension.pieces.not.equal.weighing.pieces");
              return;
            }

          } else {
            this.weighingForm.get('cargoWeighingDetailModel').value.forEach(element => {
              element.intentory.forEach(element => {
                if (element.shc != null) {


                  if (element.shc == 'COU') {
                    this.couflag = true;
                  }
                }
              });
            });
            if (this.couflag == false) {
              if (this.finalizeDimensionMandatoryFlag == true) {
                this.showErrorMessage("export.carrier.required.volumetric.dimensions");
                this.finalizeDimensionMandatoryFlag = false;
                return;
              }
            }

          }
        }

        cargo.greaterAcceptedPiecesFlag = false;
        cargo.greaterAcceptedWeightFlag = false;
        cargo.volumetricWeight = this.weighingForm.get('totalVolWeight').value;
        if (this.weighingForm.invalid == true || this.shipmentlocationerrorflag == true) {
          this.shipmentlocationerrorflag = true;
        } else {
          this.shipmentlocationerrorflag = false;
        }

        if (this.shipmentlocationerrorflag == true) {
          this.showErrorMessage("expaccpt.input.valid.shipment.warehouse.location");
          return;
        }
        cargo.preveiousWeighingAcceptedPieces = this.preveiousWeighingAcceptedPieces;
        cargo.previousDocumentAcceptedPieces = this.previousDocumentAcceptedPieces;
        cargo.ackWarnForeignUldCheck = true;
        cargo.saveAgainFlag = 0;
        cargo.messageList = [];
        this.exportService.onFinalizeRevised(cargo).subscribe(data => {
          if (data != null && data.data != null) {
            if (data.data.cargoWeighingDetailModel != null && data.data.cargoWeighingDetailModel.length > 0) {
              data.data.cargoWeighingDetailModel.forEach(element => {
                element.flagCRUD = 'R';

                element.intentory.forEach(element => {
                  element.flagCRUD = 'R';
                });

              });
            }
            cargo = data.data;
            if (data.data.greaterAcceptedPiecesFlag == true) {


              this.showConfirmMessage('total.pieces.match.document.pieces.validation').then(fulfilled => {

                cargo.greaterAcceptedPiecesFlag = true;
                cargo.messageList = [];
                cargo.saveAgainFlag = data.data.saveAgainFlag;
                this.exportService.onFinalizeRevised(cargo).subscribe(data => {
                  // this.refreshFormMessages(data);

                  if (data != null && data.success == true && data.data && data.data.finalize == 1) {

                    if (data.data.cargoWeighingDetailModel != null && data.data.cargoWeighingDetailModel.length > 0) {
                      data.data.cargoWeighingDetailModel.forEach(element => {
                        element.flagCRUD = 'R';
                        element.intentory.forEach(element => {
                          element.flagCRUD = 'R';
                        });

                      });
                    }
                    this.resp = data.data;

                    this.weighingForm.patchValue(data.data);

                    this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstarttime));
                    let errorMessage: string = null;
                    if (data.messageList != null && data.messageList.length > 0) {

                      errorMessage = data.messageList[0].code;
                    }
                    this.fetchRuleExecutionList(cargo, errorMessage);
                    this.disableOnFinalize();
                    this.showSuccessStatus("g.operation.successful");
                  } else {
                    if (data.messageList[0] != null) {
                      if (data.messageList[0].code && data.messageList[0].code == 'maintain.foreign.uld.check.4') {
                        this.showErrorMessage(NgcUtility.translateMessage("maintain.foreign.uld.check.4", data.messageList[0].placeHolder));
                        return;
                      } else {
                        this.showErrorMessage(data.messageList[0].code);
                      }
                    }
                    this.resp = data.data;
                    this.weighingForm.patchValue(data.data);
                    this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstarttime));
                    let errorMessage: string = null;
                    if (data.messageList != null && data.messageList.length > 0) {

                      errorMessage = data.messageList[0].code;
                    }
                    this.fetchRuleExecutionList(cargo, errorMessage);
                  }
                });



              }
              ).catch(reason => {
                this.weighingForm.patchValue(data.data);
              });

            } else if (data.data && data.data.foreignUldCheck == true) {
              this.showConfirmMessage(NgcUtility.translateMessage("maintain.foreign.uld.check.5", [data.data.foreignUld])).then(fulfilled => {
                cargo.foreignUldCheck = false;
                cargo.ackWarnForeignUldCheck = false;
                cargo.saveAgainFlag = data.data.saveAgainFlag;
                this.exportService.onFinalizeRevised(cargo).subscribe(data => {
                  // this.refreshFormMessages(data);

                  if (data != null && data.success == true && data.data && data.data.finalize == 1) {

                    if (data.data.cargoWeighingDetailModel != null && data.data.cargoWeighingDetailModel.length > 0) {
                      data.data.cargoWeighingDetailModel.forEach(element => {
                        element.flagCRUD = 'R';
                        element.intentory.forEach(element => {
                          element.flagCRUD = 'R';
                        });

                      });
                    }
                    this.resp = data.data;

                    this.weighingForm.patchValue(data.data);

                    this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstarttime));
                    let errorMessage: string = null;
                    if (data.messageList != null && data.messageList.length > 0) {

                      errorMessage = data.messageList[0].code;
                    }
                    this.fetchRuleExecutionList(cargo, errorMessage);
                    this.disableOnFinalize();
                    this.showSuccessStatus("g.operation.successful");
                  } else {
                    if (data.messageList[0] != null) {
                      this.showErrorMessage(data.messageList[0].code);
                    }
                    this.resp = data.data;
                    this.weighingForm.patchValue(data.data);
                    this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstarttime));
                    let errorMessage: string = null;
                    if (data.messageList != null && data.messageList.length > 0) {

                      errorMessage = data.messageList[0].code;
                    }
                    this.fetchRuleExecutionList(cargo, errorMessage);
                  }
                });
              }

              ).catch(reason => { });
            } else {



              cargo.saveAgainFlag = 1;
              cargo.messageList = [];
              //   this.exportService.onFinalizeRevised(cargo).subscribe(data => {
              // this.refreshFormMessages(data);
              if (data != null && data.success == true && data.data && data.data.finalize == 1) {
                if (data.data.cargoWeighingDetailModel != null && data.data.cargoWeighingDetailModel.length > 0) {
                  data.data.cargoWeighingDetailModel.forEach(element => {
                    element.flagCRUD = 'R';
                    element.intentory.forEach(element => {
                      element.flagCRUD = 'R';
                    });

                  });
                }
                this.resp = data.data;


                this.weighingForm.patchValue(data.data);
                this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstarttime));
                let errorMessage: string = null;
                if (data.messageList != null && data.messageList.length > 0) {

                  errorMessage = data.messageList[0].code;
                }
                this.fetchRuleExecutionList(cargo, errorMessage);
                this.disableOnFinalize();
                this.showSuccessStatus("g.operation.successful");
              } else {
                this.resp = data.data;
                this.weighingForm.patchValue(data.data);
                this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstarttime));
                let errorMessage: string = null;
                if (data.messageList != null && data.messageList.length > 0) {
                  if (data.messageList[0].code && data.messageList[0].code == 'maintain.foreign.uld.check.4') {
                    this.showErrorMessage(NgcUtility.translateMessage("maintain.foreign.uld.check.4", data.messageList[0].placeHolder));
                    return;
                  } else {
                    this.showErrorMessage(data.messageList[0].code);
                    return;
                  }
                }
                this.fetchRuleExecutionList(cargo, errorMessage);

              }
              //    });



            }
          } else {
            this.showErrorMessage(data.messageList[0].message ? data.messageList[0].message : data.messageList[0].code);
          }


        });
      } else {
        this.showErrorMessage("export.cpe.error.configured.carrier");
      }
    });

  }





  onStartWeighing(event) {
    if (this.weighingScaleData == null) {
      this.showErrorMessage("export.select.weighing.scale.proceed");
      return;
    }
    this.onStartWeighingSelect = true;
    const cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();
    const shipmentObj: ShipmentModel = new ShipmentModel();
    shipmentObj.shipmentNumber = this.weighingForm.get('shipmentNumber').value;
    if (shipmentObj.shipmentNumber) {
      cargo.shipmentModel = shipmentObj;
    }

    cargo.messageList = [];
    this.exportService.onSaveWeighingStartTimeRevised(cargo).subscribe(data => {
      if (data.success == true && data.messageList == null) {
        this.startweighingflag = true;
        this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(data.data.weighingstartdatetime));
        this.showSuccessStatus("g.operation.successful");

        this.delayAcceptanceFlag = false;
        this.autoFocusEnum = "piece";
        this.valueUpdateFlag = true;
        this.valueUpdateIndex = 0;
        this.onSearch();
      } else {
        if (data.messageList[0] != null) {
          this.showErrorMessage(data.messageList[0].code);
        }

      }
    });

  }

  onClickVolumetricWeight(index) {
    if (this.weighingForm.get(['cargoWeighingDetailModel', index, 'piece']).value == null ||
      this.weighingForm.get(['cargoWeighingDetailModel', index, 'piece']).value == "0" ||
      this.weighingForm.get(['cargoWeighingDetailModel', index, 'grossWeight']).value == null ||
      this.weighingForm.get(['cargoWeighingDetailModel', index, 'grossWeight']).value == "0.0") {
      this.showErrorMessage("export.provide.gross.weight.pieces.volumetric.weight.calculation");
      return
    }
    let messageid = null;
    if (this.weighingForm.get(['cargoWeighingDetailModel', index, 'messageId']) != null && this.weighingForm.get(['cargoWeighingDetailModel', index, 'messageId']).value != "") {
      messageid = this.weighingForm.get(['cargoWeighingDetailModel', index, 'messageId']).value
    }
    let messageidindex = null;
    let iterationindex = 0;
    const dimensionList = (<NgcFormArray>this.weighingForm.get('dimension')).getRawValue();
    dimensionList.forEach(ele => {
      if (ele.messageId === messageid && ele.messageId != null ||
        ele.weighingId != null && ele.weighingId != "" && this.weighingForm.get(['cargoWeighingDetailModel', index, 'weighingId']) != null
        && (ele.weighingId === this.weighingForm.get(['cargoWeighingDetailModel', index, 'weighingId']).value)
      ) {
        messageidindex = iterationindex;
      }
      iterationindex = iterationindex + 1;
    })
    if (messageidindex != null) {
      (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'pcs'])).patchValue(
        this.weighingForm.get(['cargoWeighingDetailModel', index, 'piece']).value
      );
      (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'dimensionCapturedManually'])).patchValue(
        true
      );

      const dimension: Dimention = new Dimention();
      const messageidreq: VolumetricRequest = new VolumetricRequest();
      messageidreq.shipmentNumber = this.weighingForm.controls.shipmentNumber.value;
      messageidreq.oddSize = this.weighingForm.get(['cargoWeighingDetailModel', index, 'oddsize']).value;
      messageidreq.scannerId = this.volumetricScannerId;
      messageidreq.scannerType = this.volumetricScannerType;

      messageidreq.scannerIP = this.volumetricScannerIP;
      messageidreq.measuredPieces = this.weighingForm.get(['cargoWeighingDetailModel', index, 'piece']).value;
      messageidreq.skidHeight = this.weighingForm.get(['cargoWeighingDetailModel', index, 'skidHeight']).value;
      // ------------------ CALLING THE SERVICE TO MAKE A CALL TO VOLUMETRIC SCANNER ---------------- 

      let messageId: any;
      let response: any;
      this.exportService.getMessageId(messageidreq).subscribe(data => {
        this.volumetricButtonEnableFlag = true;
        response = data;
        if (response != null) {
          messageId = response.messageId;
          if (messageId != null) {

            // ------------------ CALLING THE SERVICE TO FETCH THE RESPONSE OF SCANNER STORED IN DATABASE ---------------- 

            const scannerrequest: ScannerResponseModel = new ScannerResponseModel();
            scannerrequest.messageId = messageId;
            // let count = 0;
            //   this.volmetricWeightSubscription = this.getTimer(15000).subscribe((data) => {

            this.exportService.getDimensionsFromScanner(scannerrequest).subscribe((data) => {

              //  count = count + 1;
              if (data.data != null) { // || count > 3
                this.volumetricButtonEnableFlag = false;
                //  this.volmetricWeightSubscription.unsubscribe();
                //     if (count > 3) {


                //    }
                if (data.data != null) {
                  if (data.data.measuredVolWeight != null) {



                    this.volumetricButtonEnableFlag = false;
                    this.weighingForm.get(['cargoWeighingDetailModel', index, 'volumetricWeight']).patchValue(data.data.measuredVolWeight);
                    this.weighingForm.get(['cargoWeighingDetailModel', index, 'messageId']).patchValue(scannerrequest.messageId);
                    this.showInfoStatus("export.got.response.populate.dimensions.tab");
                    // this.weighingForm.get(['cargoWeighingDetailModel', index, 'volumetricWeight']).setValue(data.data.measuredVolWeight);
                  }

                  (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'volume'])).patchValue((data.data.measuredVolume));
                  (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'length'])).patchValue((data.data.measuredLength));
                  (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'width'])).patchValue((data.data.measuredWidth));
                  (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'height'])).patchValue((data.data.measuredHeight));
                  (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'volumetricWeight'])).patchValue((data.data.measuredVolWeight));
                  (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'dimensionCapturedManually'])).patchValue((data.data.dimensionCapturedManually));
                  (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'manualScanReason'])).patchValue(0);
                  (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'manualScanReasonValue'])).patchValue('System');
                  (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'volumetricScannerName'])).patchValue(this.volumetricScannerName);
                  (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'texture'])).patchValue(data.data.texture);
                  (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'messageId'])).patchValue(scannerrequest.messageId);
                  (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'multiplier'])).patchValue(1);
                  // (<NgcFormControl>this.weighingForm.get(['dimension', index, 'multiplier'])).disable();
                  // (<NgcFormControl>this.weighingForm.get(['dimension', index, 'pcs'])).disable();
                  (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'totalPieces'])).patchValue(
                    this.weighingForm.get(['dimension', messageidindex, 'pcs']).value * (
                      this.weighingForm.get(['dimension', messageidindex, 'multiplier'])).value
                  );
                  (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'totalVolumetricWeight'])).patchValue(
                    data.data.measuredVolWeight * (
                      this.weighingForm.get(['dimension', messageidindex, 'multiplier'])).value
                  );
                  const dimensionList = (<NgcFormArray>this.weighingForm.get('dimension')).getRawValue();
                  this.shipmentVolumetricWeight = 0;
                  dimensionList.forEach(ele => {

                    this.shipmentVolumetricWeight = this.shipmentVolumetricWeight + ele.volumetricWeight * ele.multiplier;

                  })
                  this.weighingForm.get('totalVolWeight').patchValue(this.shipmentVolumetricWeight);
                }
                (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'pcs'])).patchValue(
                  this.weighingForm.get(['cargoWeighingDetailModel', index, 'piece']).value
                );

              } else {
                (<NgcFormControl>this.weighingForm.get(['dimension', messageidindex, 'pcs'])).patchValue(
                  this.weighingForm.get(['cargoWeighingDetailModel', index, 'piece']).value
                );
                this.volumetricButtonEnableFlag = false;
                this.showErrorMessage(data.messageList[0].code);
              }
            });




            // ------------------------------------------------- XXXXXXXXXX ----------------------------------------------
          }




        }

      });

    } else {

      if (messageidindex == null) {
        (<NgcFormArray>this.weighingForm.get('dimension')).addValue([
          {
            length: '',
            width: '',
            height: '',
            pcs: '',
            volume: '',
            manualScanReason: '',
            manualScanReasonValue: '',
            measurementUnitCode: '',
            volumeCode: '',
            weightCode: '',
            voulmetricEnableFlag: '',
            volumetricWeight: '',
            dimensionCapturedManually: '',
            volumetricScannerName: '',
            messageId: '',
            texture: '',
            errorFlag: '',
            errorCode: '',
            errorDescription: '',
            multiplier: '',
            totalPieces: '',
            totalVolumetricWeight: '',
            weighingId: ''
          }
        ]);

      }
      let dimindex = null;

      dimindex = (<NgcFormArray>this.weighingForm.get('dimension')).length - 1;
      //dimindex = index;


      (<NgcFormControl>this.weighingForm.get(['dimension', dimindex, 'pcs'])).patchValue(
        this.weighingForm.get(['cargoWeighingDetailModel', index, 'piece']).value
      );
      (<NgcFormControl>this.weighingForm.get(['dimension', dimindex, 'dimensionCapturedManually'])).patchValue(
        true
      );

      const dimension: Dimention = new Dimention();
      const messageidreq: VolumetricRequest = new VolumetricRequest();

      messageidreq.shipmentNumber = this.weighingForm.controls.shipmentNumber.value;
      messageidreq.oddSize = this.weighingForm.get(['cargoWeighingDetailModel', index, 'oddsize']).value;
      messageidreq.scannerId = this.volumetricScannerId;
      messageidreq.scannerType = this.volumetricScannerType;
      messageidreq.scannerIP = this.volumetricScannerIP;
      messageidreq.measuredPieces = this.weighingForm.get(['cargoWeighingDetailModel', index, 'piece']).value;
      messageidreq.skidHeight = this.weighingForm.get(['cargoWeighingDetailModel', index, 'skidHeight']).value;
      // ------------------ CALLING THE SERVICE TO MAKE A CALL TO VOLUMETRIC SCANNER ---------------- 
      let messageId: any;
      let response: any;
      this.exportService.getMessageId(messageidreq).subscribe(data => {
        this.volumetricButtonEnableFlag = true;
        response = data;
        if (response != null) {
          messageId = response.messageId;
          if (messageId != null) {

            // ------------------ CALLING THE SERVICE TO FETCH THE RESPONSE OF SCANNER STORED IN DATABASE ---------------- 

            const scannerrequest: ScannerResponseModel = new ScannerResponseModel();
            scannerrequest.messageId = messageId;
            // let count = 0;
            //   this.volmetricWeightSubscription = this.getTimer(15000).subscribe((data) => {

            this.exportService.getDimensionsFromScanner(scannerrequest).subscribe((data) => {

              //  count = count + 1;
              if (data.data != null) { // || count > 3
                this.volumetricButtonEnableFlag = false;
                //  this.volmetricWeightSubscription.unsubscribe();
                //     if (count > 3) {


                //    }
                if (data.data != null) {
                  if (data.data.measuredVolWeight != null) {



                    this.volumetricButtonEnableFlag = false;
                    this.weighingForm.get(['cargoWeighingDetailModel', index, 'volumetricWeight']).patchValue(data.data.measuredVolWeight);
                    this.weighingForm.get(['cargoWeighingDetailModel', index, 'messageId']).patchValue(scannerrequest.messageId);
                    this.showInfoStatus("export.got.response.populate.dimensions.tab");
                    // this.weighingForm.get(['cargoWeighingDetailModel', index, 'volumetricWeight']).setValue(data.data.measuredVolWeight);
                  }

                  (<NgcFormControl>this.weighingForm.get(['dimension', dimindex, 'volume'])).patchValue((data.data.measuredVolume));
                  (<NgcFormControl>this.weighingForm.get(['dimension', dimindex, 'length'])).patchValue((data.data.measuredLength));
                  (<NgcFormControl>this.weighingForm.get(['dimension', dimindex, 'width'])).patchValue((data.data.measuredWidth));
                  (<NgcFormControl>this.weighingForm.get(['dimension', dimindex, 'height'])).patchValue((data.data.measuredHeight));
                  (<NgcFormControl>this.weighingForm.get(['dimension', dimindex, 'volumetricWeight'])).patchValue((data.data.measuredVolWeight));
                  (<NgcFormControl>this.weighingForm.get(['dimension', dimindex, 'dimensionCapturedManually'])).patchValue((data.data.dimensionCapturedManually));
                  (<NgcFormControl>this.weighingForm.get(['dimension', dimindex, 'manualScanReason'])).patchValue(0);
                  (<NgcFormControl>this.weighingForm.get(['dimension', dimindex, 'volumetricScannerName'])).patchValue(this.volumetricScannerName);
                  (<NgcFormControl>this.weighingForm.get(['dimension', dimindex, 'texture'])).patchValue(data.data.texture);
                  (<NgcFormControl>this.weighingForm.get(['dimension', dimindex, 'messageId'])).patchValue(scannerrequest.messageId);
                  (<NgcFormControl>this.weighingForm.get(['dimension', dimindex, 'multiplier'])).patchValue(1);
                  // (<NgcFormControl>this.weighingForm.get(['dimension', index, 'multiplier'])).disable();
                  // (<NgcFormControl>this.weighingForm.get(['dimension', index, 'pcs'])).disable();
                  (<NgcFormControl>this.weighingForm.get(['dimension', dimindex, 'totalPieces'])).patchValue(
                    this.weighingForm.get(['dimension', dimindex, 'pcs']).value * (
                      this.weighingForm.get(['dimension', dimindex, 'multiplier'])).value
                  );
                  (<NgcFormControl>this.weighingForm.get(['dimension', dimindex, 'totalVolumetricWeight'])).patchValue(
                    data.data.measuredVolWeight * (
                      this.weighingForm.get(['dimension', dimindex, 'multiplier'])).value
                  );
                  const dimensionList = (<NgcFormArray>this.weighingForm.get('dimension')).getRawValue();
                  this.shipmentVolumetricWeight = 0;
                  dimensionList.forEach(ele => {

                    this.shipmentVolumetricWeight = this.shipmentVolumetricWeight + ele.volumetricWeight * ele.multiplier;

                  })
                  this.weighingForm.get('totalVolWeight').patchValue(this.shipmentVolumetricWeight);
                }
                (<NgcFormControl>this.weighingForm.get(['dimension', dimindex, 'pcs'])).patchValue(
                  this.weighingForm.get(['cargoWeighingDetailModel', index, 'piece']).value
                );

              } else {
                (<NgcFormControl>this.weighingForm.get(['dimension', dimindex, 'pcs'])).patchValue(
                  this.weighingForm.get(['cargoWeighingDetailModel', index, 'piece']).value
                );
                this.volumetricButtonEnableFlag = false;
                this.showErrorMessage(data.messageList[0].code);
              }
            });




            // ------------------------------------------------- XXXXXXXXXX ----------------------------------------------
          }




        }

      });

      // ------------------------------------- XXXXXXXXXX ---------------------------------------
    }

  }
  onSaveDelayTime() {

    if (this.weighingForm.invalid == true || this.shipmentlocationerrorflag == true) {
      this.shipmentlocationerrorflag = true;
    } else {
      this.shipmentlocationerrorflag = false;
    }
    // this.getExcludedSHCFlagForVolumetric();
    if (this.shipmentlocationerrorflag == true) {
      this.showErrorMessage("expaccpt.input.valid.shipment.warehouse.location");
      return;
    }

    let cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();
    cargo = this.weighingForm.getRawValue();
    cargo.messageList = [];
    cargo.isFinalizeSuffix = false;
    this.exportService.getExcludedSHCFlagForVolumetric(cargo).subscribe(data => {
      if (data.success == true) {



        this.getDimensionMandatoryFlag = data.data;




        for (const entry of (<NgcFormGroup>this.weighingForm.get(['dimension'])).getRawValue()) {
          if ((entry.manualScanReason == "" || entry.manualScanReason == null) && (entry.dimensionCapturedManually == true)) {
            this.showErrorMessage("export.select.manual.scan.reason");
            return;
          }
          if (entry.length == null || entry.length == "" || entry.width == null || entry.width == ""
            || entry.height == null || entry.height == "" || entry.pcs == null || entry.pcs == "") {
            this.showErrorMessage("export.carrier.required.volumetric.dimensions");
            return
          }
        }
        const lineItem = (<NgcFormGroup>this.weighingForm.get(['dimension'])).getRawValue();
        if (this.weighingForm.get('volumetricWeightEnableFlag').value == true && this.getDimensionMandatoryFlag == true) {
          if (lineItem.length > 0) {
            let totaldimpieces = 0;
            for (const entry of (<NgcFormGroup>this.weighingForm.get(['dimension'])).getRawValue()) {
              if ((entry.manualScanReason == "" || entry.manualScanReason == null) && (entry.dimensionCapturedManually == true)) {
                this.showErrorMessage("export.select.manual.scan.reason");
                return;
              }
              if (entry.length == null || entry.length == "" || entry.width == null || entry.width == ""
                || entry.height == null || entry.height == "" || entry.pcs == null || entry.pcs == "") {
                this.showErrorMessage("export.carrier.required.volumetric.dimensions");
                return
              }
              if (entry.flagCRUD !== "D") {
                totaldimpieces = totaldimpieces + entry.totalPieces;
              }

            }

            let weighingpiecessum = 0;
            this.weighingForm.get('cargoWeighingDetailModel').value.forEach(element => {
              weighingpiecessum = weighingpiecessum + element.piece;
            });

            if (this.weighingForm.get('volumetricWeightEnableFlag').value == true && totaldimpieces > weighingpiecessum) {
              this.showErrorMessage("export.total.dimensions.cannot.greater.than.weighing.pieces");
              return;
            }

          } else {
            this.showErrorMessage("export.carrier.required.volumetric.dimensions");
            return
          }
        }


        // let cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();
        // cargo = this.weighingForm.getRawValue();


        // flag for checking whether accepted pieces is greater than document pieces
        // flag for checking whether accepted weight is greater than document weight
        cargo.greaterAcceptedPiecesFlag = false;
        cargo.greaterAcceptedWeightFlag = false;
        cargo.messageList = [];
        cargo.isFinalizeSuffix = false;
        this.exportService.onSaveWeighingRevised(cargo).subscribe(data => {
          this.refreshFormMessages(data);
          if (!data.success && data.data.greaterAcceptedPiecesFlag == true) {

            if (data.data.greaterAcceptedPiecesFlag == true) {

              this.showConfirmMessage('total.pieces.match.document.pieces.validation').then(fulfilled => {

                cargo.greaterAcceptedPiecesFlag = true;
                cargo.messageList = [];
                this.exportService.onSaveWeighingRevised(cargo).subscribe(data => {
                  this.resp = data.data;
                  if (data.success) {
                    this.weighingForm.patchValue(data.data);
                    this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstartdatetime));

                    this.showSuccessStatus("g.operation.successful");
                    cargo.messageList = [];
                    cargo = this.weighingForm.getRawValue();
                    cargo.isFinalizeSuffix = false;
                    this.exportService.onSaveWeighingDelayTimeRevised(cargo).subscribe(data => {
                      if (data.success == true && data.messageList == null) {
                        this.showSuccessStatus("g.operation.successful");
                        this.delayAcceptanceFlag = true;
                        this.weighingForm.get('cargoWeighingDetailModel').disable();
                      } else {
                        if (data.messageList[0]! = null) {
                          this.showErrorMessage(data.messageList[0].code);
                        }

                      }
                    });
                    this.onSearch();
                  } else {
                    if (data.messageList[0] != null) {
                      this.showErrorMessage(data.messageList[0].code);
                    }

                  }
                });

              }
              ).catch(reason => { });


            } else {
              this.weighingForm.patchValue(data.data);
              this.resp = data.data;
              this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstarttime));
              this.showSuccessStatus("g.operation.successful");
              cargo.messageList = [];
              this.exportService.onSaveWeighingDelayTimeRevised(cargo).subscribe(data => {
                if (data.success == true && data.messageList == null) {
                  this.showSuccessStatus("g.operation.successful");
                  this.delayAcceptanceFlag = true;
                  this.weighingForm.get('cargoWeighingDetailModel').disable();
                } else {
                  if (data.messageList[0]! = null) {
                    this.showErrorMessage(data.messageList[0].code);
                  }

                }
              });
              this.onSearch();

            };
          } else if (!data.success) {
            if (data.messageList[0] != null) {
              this.showErrorMessage(data.messageList[0].code);
            }

          } else {
            this.weighingForm.patchValue(data.data);
            this.resp = data.data;
            this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstarttime));
            this.showSuccessStatus("g.operation.successful");
            cargo.messageList = [];
            this.exportService.onSaveWeighingDelayTimeRevised(cargo).subscribe(data => {
              if (data.success == true && data.messageList == null) {
                this.showSuccessStatus("g.operation.successful");
                this.delayAcceptanceFlag = true;
                this.weighingForm.get('cargoWeighingDetailModel').disable();
              } else {
                if (data.messageList[0]! = null) {
                  this.showErrorMessage(data.messageList[0].code);
                }

              }
            });
            this.onSearch();

          }



        });



      } else {
        this.showErrorMessage("export.cpe.error.configured.carrier");
      }

    });


  }
  onResumeDelayTime() {
    let cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();
    cargo = this.weighingForm.value;
    cargo.messageList = [];
    this.exportService.onResumeWeighingDelayTimeRevised(cargo).subscribe(data => {
      if (data.success == true && data.messageList == null) {
        this.showSuccessStatus("g.operation.successful");
        this.delayAcceptanceFlag = false;
        this.weighingForm.get('cargoWeighingDetailModel').enable();
      } else {
        if (data.messageList[0]! = null) {
          this.showErrorMessage(data.messageList[0].code);
        }

      }
    });
  }
  onAddRow() {
    (<NgcFormArray>this.weighingForm.get('cargoWeighingDetailModel')).addValue([
      {

        grossWeight: '0.0',
        piece: '0',
        netWeight: '0.0',
        uldNumber: '',
        tareWeight: 0.0,
        skids: '0',
        volumetricWeight: '0',
        dryIceWeight: '0.0',
        skidHeight: '',
        manuallyScanned: false,
        partrowdisableflag: false,
        weighingScaleId: null,
        oddsize: this.volumetricWeightEnableFlag,
        messageId: '',
        intentory: [
          {
            shipmentLocation: '',
            piece: '0',
            weight: '0.0',
            warehouseLocation: null,
            dryIceWeight: 0.0,
            shc: this.shclist,
            actualWeight: '0.0'
          }
        ]
      }
    ]);
    this.autoFocusEnum = "piece";
    this.valueUpdateFlag = true;
    this.valueUpdateIndex = (<NgcFormArray>this.weighingForm.get('cargoWeighingDetailModel')).length - 1;
  }

  onAddLocation(index: any) {
    (<NgcFormArray>this.weighingForm.get(['cargoWeighingDetailModel', index, 'intentory'])).addValue([
      {
        shipmentLocation: '',
        piece: '0',
        weight: '0.0',
        warehouseLocation: null,
        dryIceWeight: '0.0',
        shc: this.shclist,
        actualWeight: '0.0'
      }
    ]);
  }





  onDeleteRow(index) {

    let iterationindexindex = 0;
    let dimensionindex = 0;
    let messageIdIndex = 0;
    let wighingObject = this.weighingForm.getRawValue();
    if (wighingObject.dimension && wighingObject.dimension.length > 0) {
      wighingObject.dimension.forEach(element => {
        if (element.weighingId != null && element.weighingId != "" && this.weighingForm.get(['cargoWeighingDetailModel', index, 'weighingId']) != null
          && (element.weighingId === this.weighingForm.get(['cargoWeighingDetailModel', index, 'weighingId']).value)) {
          dimensionindex = iterationindexindex;
        }

        if (element.messageId != null && element.messageId != "" && this.weighingForm.get(['cargoWeighingDetailModel', index, 'messageId']) != null
          && (element.messageId === this.weighingForm.get(['cargoWeighingDetailModel', index, 'messageId']).value)) {
          messageIdIndex = iterationindexindex;
        }

        iterationindexindex = iterationindexindex + 1;
      });
    }

    if (this.weighingForm.get(['cargoWeighingDetailModel', index, 'weighingId']) != null && this.weighingForm.get(['cargoWeighingDetailModel', index, 'weighingId']).value != "") {


      if (
        (this.weighingForm.get(['dimension', dimensionindex]) != null)
        &&
        (this.weighingForm.get(['dimension', dimensionindex, 'messageId']) != null &&
          this.weighingForm.get(['dimension', dimensionindex, 'messageId']).value != null &&
          this.weighingForm.get(['dimension', dimensionindex, 'weighingId']) != null &&
          this.weighingForm.get(['dimension', dimensionindex, 'weighingId']).value ==
          this.weighingForm.get(['cargoWeighingDetailModel', index, 'weighingId']).value)

      ) {
        this.weighingForm.get('totalVolWeight').patchValue(this.weighingForm.get('totalVolWeight').value - this.weighingForm.get(['dimension', dimensionindex, 'volumetricWeight']).value);
        (<NgcFormArray>this.weighingForm.get(['dimension'])).markAsDeletedAt(dimensionindex);
      }
    } else {

      if (

        (this.weighingForm.get(['cargoWeighingDetailModel', index, 'messageId']).value != null && this.weighingForm.get(['cargoWeighingDetailModel', index, 'messageId']).value != "")

      ) {
        this.weighingForm.get('totalVolWeight').patchValue(this.weighingForm.get('totalVolWeight').value - this.weighingForm.get(['dimension', messageIdIndex, 'volumetricWeight']).value);
        (<NgcFormArray>this.weighingForm.get(['dimension'])).markAsDeletedAt(messageIdIndex);
      }
    }

    (<NgcFormArray>this.weighingForm.get(['cargoWeighingDetailModel'])).markAsDeletedAt(index);

  }

  onDeleteLocation(index, subIndex) {

    (<NgcFormArray>this.weighingForm.get(['cargoWeighingDetailModel', index, 'intentory'])).markAsDeletedAt(subIndex);
    this.weighingForm.get(['cargoWeighingDetailModel', index, 'intentory', subIndex, 'actualWeight']).setValue(0.0);
    this.weighingForm.get(['cargoWeighingDetailModel', index, 'intentory', subIndex, 'piece']).setValue(0);


  }

  onSave() {




    if (this.weighingForm.invalid == true || this.shipmentlocationerrorflag == true) {
      this.shipmentlocationerrorflag = true;
    } else {
      this.shipmentlocationerrorflag = false;
    }
    // this.getExcludedSHCFlagForVolumetric();
    if (this.shipmentlocationerrorflag == true) {
      this.showErrorMessage("expaccpt.input.valid.shipment.warehouse.location");
      return;
    }

    let cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();
    cargo = this.weighingForm.getRawValue();
    cargo.messageList = [];
    cargo.isFinalizeSuffix = false;
    this.exportService.getExcludedSHCFlagForVolumetric(cargo).subscribe(data => {
      if (data.success == true) {



        this.getDimensionMandatoryFlag = data.data;




        for (const entry of (<NgcFormGroup>this.weighingForm.get(['dimension'])).getRawValue()) {
          if ((entry.manualScanReason == "" || entry.manualScanReason == null) && (entry.dimensionCapturedManually == true)) {
            this.showErrorMessage("export.select.manual.scan.reason");
            return;
          }
          if (entry.length == null || entry.length == "" || entry.width == null || entry.width == ""
            || entry.height == null || entry.height == "" || entry.pcs == null || entry.pcs == "") {
            if (this.saveDimensionMandatoryFlag == true) {
              this.showErrorMessage("export.carrier.required.volumetric.dimensions");
              this.saveDimensionMandatoryFlag = false;
              return
            }
          }
        }
        const lineItem = (<NgcFormGroup>this.weighingForm.get(['dimension'])).getRawValue();
        if (this.weighingForm.get('volumetricWeightEnableFlag').value == true && this.getDimensionMandatoryFlag == true) {
          if (lineItem.length > 0) {
            let totaldimpieces = 0;
            for (const entry of (<NgcFormGroup>this.weighingForm.get(['dimension'])).getRawValue()) {
              if ((entry.manualScanReason == "" || entry.manualScanReason == null) && (entry.dimensionCapturedManually == true)) {
                this.showErrorMessage("export.select.manual.scan.reason");
                return;
              }
              if (entry.length == null || entry.length == "" || entry.width == null || entry.width == ""
                || entry.height == null || entry.height == "" || entry.pcs == null || entry.pcs == "") {
                if (this.saveDimensionMandatoryFlag == true) {
                  this.showErrorMessage("export.carrier.required.volumetric.dimensions");
                  this.saveDimensionMandatoryFlag = false;
                  return;
                }
              }
              if (entry.flagCRUD !== "D") {
                totaldimpieces = totaldimpieces + entry.totalPieces;
              }

            }

            let weighingpiecessum = 0;
            this.weighingForm.get('cargoWeighingDetailModel').value.forEach(element => {
              weighingpiecessum = weighingpiecessum + element.piece;
            });

            if (this.weighingForm.get('volumetricWeightEnableFlag').value == true && totaldimpieces > weighingpiecessum) {
              this.showErrorMessage("export.total.dimension.cannot.greater.weighing.line.item.pieces");
              return;
            }

          } else {
            if (this.saveDimensionMandatoryFlag == true) {
              this.showErrorMessage("export.carrier.required.volumetric.dimensions");
              this.saveDimensionMandatoryFlag = false;
              return;
            }
          }
        }


        // let cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();
        // cargo = this.weighingForm.getRawValue();


        // flag for checking whether accepted pieces is greater than document pieces
        // flag for checking whether accepted weight is greater than document weight
        cargo.greaterAcceptedPiecesFlag = false;
        cargo.greaterAcceptedWeightFlag = false;
        cargo.ackWarnForeignUldCheck = true;
        cargo.messageList = [];
        this.exportService.onSaveWeighingRevised(cargo).subscribe(data => {

          if (!data.success && data.data && data.data.greaterAcceptedPiecesFlag == true) {

            if (data.data.greaterAcceptedPiecesFlag == true) {

              this.showConfirmMessage('total.pieces.match.document.pieces.validation').then(fulfilled => {

                cargo.greaterAcceptedPiecesFlag = true;
                cargo.messageList = [];
                this.exportService.onSaveWeighingRevised(cargo).subscribe(data => {
                  this.resp = data.data;
                  if (data.success) {
                    if (data.data && data.data.foreignUldCheck == true) {
                      this.showConfirmMessage(NgcUtility.translateMessage("maintain.foreign.uld.check.5", [data.data.foreignUld])).then(fulfilled => {
                        cargo.foreignUldCheck = false;
                        cargo.ackWarnForeignUldCheck = false;
                        this.exportService.onSaveWeighingRevised(cargo).subscribe(data => {
                          this.resp = data.data;
                          if (data.success) {
                            this.weighingForm.patchValue(data.data);
                            this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstartdatetime));
                            this.showSuccessStatus("g.operation.successful");
                            this.onSearch();
                          } else {
                            if (data.messageList[0] != null) {
                              this.showErrorMessage(data.messageList[0].code);
                            }

                          }
                        });
                      }
                      ).catch(reason => { });
                    } else {
                      this.weighingForm.patchValue(data.data);
                      this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstartdatetime));

                      this.showSuccessStatus("g.operation.successful");

                      this.onSearch();
                    }
                  } else {
                    if (data.messageList[0] != null) {
                      if (data.messageList[0].code && data.messageList[0].code == 'maintain.foreign.uld.check.4') {
                        this.showErrorMessage(NgcUtility.translateMessage("maintain.foreign.uld.check.4", data.messageList[0].placeHolder));
                        return;
                      } else {
                        this.showErrorMessage(data.messageList[0].code);
                      }
                    }

                  }
                });

              }
              ).catch(reason => { });


            } else {
              this.weighingForm.patchValue(data.data);
              this.resp = data.data;
              this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstarttime));
              this.showSuccessStatus("g.operation.successful");

              this.onSearch();

            };
          } else if (!data.success) {
            if (data.messageList[0] != null) {
              if (data.messageList[0].code && data.messageList[0].code == 'maintain.foreign.uld.check.4') {
                this.showErrorMessage(NgcUtility.translateMessage("maintain.foreign.uld.check.4", data.messageList[0].placeHolder));
              } else {
                this.showErrorMessage(data.messageList[0].message ? data.messageList[0].message : data.messageList[0].code);
              }
            }

          } else {
            if (data.data && data.data.foreignUldCheck == true) {
              this.showConfirmMessage(NgcUtility.translateMessage("maintain.foreign.uld.check.5", [data.data.foreignUld])).then(fulfilled => {
                cargo.foreignUldCheck = false;
                cargo.ackWarnForeignUldCheck = false;
                this.exportService.onSaveWeighingRevised(cargo).subscribe(data => {
                  this.resp = data.data;
                  if (data.success) {
                    this.weighingForm.patchValue(data.data);
                    this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstartdatetime));
                    this.showSuccessStatus("g.operation.successful");
                    this.onSearch();
                  } else {
                    if (data.messageList[0] != null) {
                      this.showErrorMessage(data.messageList[0].code);
                    }

                  }
                });
              }
              ).catch(reason => { });
            }
            else {
              this.weighingForm.patchValue(data.data);
              this.resp = data.data;
              this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstarttime));
              this.showSuccessStatus("g.operation.successful");

              this.onSearch();
            }
          }
        });



      } else {
        this.showErrorMessage("export.cpe.error.configured.carrier");
      }

    });




  }

  getExcludedSHCFlagForVolumetric() {
    let cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();
    cargo = this.weighingForm.value;
    cargo.messageList = [];
    this.exportService.getExcludedSHCFlagForVolumetric(cargo).subscribe(data => {
      if (data.success == true) {
        this.getDimensionMandatoryFlag = data.data;
      }

    });
  }
  onChangeWeightAllForGross() {

    this.resetFormMessages();
    let cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();
    cargo = this.weighingForm.value;
    cargo.messageList = [];
    this.exportService.getProportionalWeightRevisedForGross(cargo).subscribe(data => {
      if (data.data != null && (data.messageList == null || data.messageList.length <= 0)) {
        this.weighingForm.get('cargoWeighingDetailModel').patchValue(data.data.cargoWeighingDetailModel);
        this.weighingForm.get('totalAcceptedPiecesSum').patchValue(data.data.totalAcceptedPiecesSum);
        this.weighingForm.get('totalAcceptedWeightSum').patchValue(data.data.totalAcceptedWeightSum);
        this.weighingForm.get('differencePieces').patchValue(data.data.differencePieces);
        this.weighingForm.get('differenceWeight').patchValue(data.data.differenceWeight);
        this.weighingForm.get('differenceWeightPercent').patchValue(data.data.differenceWeightPercent);

        this.valueUpdateFlag = true;
      } else {
        if (data.messageList[0] != null) {
          this.showErrorMessage(data.messageList[0].code);
        }

      }

    });

  }


  onChangeWeight() {
    let index = 0;
    let totalInventoryWeight = 0;
    let weightDifference = 0;
    let weightDifferencePercent = 0;
    for (const entry of (<NgcFormGroup>this.weighingForm.get(['cargoWeighingDetailModel'])).getRawValue()) {

      for (const inv of (<NgcFormGroup>this.weighingForm.get(['cargoWeighingDetailModel', index, 'intentory'])).getRawValue()) {
        totalInventoryWeight = totalInventoryWeight + inv.actualWeight;
      }

      index = index + 1;

    }
    weightDifference = totalInventoryWeight - this.weighingForm.get('acceptedDocumentWeight').value;
    weightDifferencePercent = Math.abs(((this.weighingForm.get('acceptedDocumentWeight').value - totalInventoryWeight) / (this.weighingForm.get('acceptedDocumentWeight').value)
      * 100));


    this.weighingForm.get('totalAcceptedWeightSum').patchValue(Number.parseFloat(NgcUtility.getDisplayWeight(totalInventoryWeight)));
    this.weighingForm.get('differenceWeight').patchValue(Number.parseFloat(NgcUtility.getDisplayWeight(weightDifference)));
    this.weighingForm.get('differenceWeightPercent').patchValue(Number.parseFloat(NgcUtility.getDisplayWeight(weightDifferencePercent)));
  }
  onChangeWeightPieces(index, subindex, event) {



    if (this.weighingForm.get(['cargoWeighingDetailModel', index, 'intentory']).invalid) {
      this.showFormControlErrorMessage(<NgcFormControl>this.weighingForm.get(['cargoWeighingDetailModel', index, 'intentory', subindex, 'warehouseLocation']),
        'export.invalid.warehouse.location');
      return;
    }
    if (this.weighingForm.invalid == true) {
      this.shipmentlocationerrorflag = true;
    } else {
      this.shipmentlocationerrorflag = false;
    }
    if (event == null) {
      return
    }
    this.resetFormMessages();
    let cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();
    cargo = this.weighingForm.getRawValue();
    cargo.detailrowindex = index;
    cargo.inventorysubindex = subindex;
    cargo.messageList = [];
    this.exportService.getProportionalWeightRevised(cargo).subscribe(data => {
      if (data.data != null && (data.messageList == null || data.messageList.length <= 0)) {
        //  this.weighingForm.get('cargoWeighingDetailModel').clearValidators();
        let i = 0;
        data.data.cargoWeighingDetailModel.forEach(item => {

          this.weighingForm.get(['cargoWeighingDetailModel', i, 'piece']).patchValue(item.piece);
          this.weighingForm.get(['cargoWeighingDetailModel', i, 'grossWeight']).patchValue(item.grossWeight);
          this.weighingForm.get(['cargoWeighingDetailModel', i, 'netWeight']).patchValue(item.netWeight);

          let j = 0;
          for (const inv of item.intentory) {

            //this.weighingForm.get(['cargoWeighingDetailModel', i, 'intentory', j, 'piece']).patchValue(inv.piece);
            this.weighingForm.get(['cargoWeighingDetailModel', i, 'intentory', j, 'actualWeight']).patchValue(inv.actualWeight);
            j = j + 1;

          }
          i = i + 1;
        })
        //this.weighingForm.get('cargoWeighingDetailModel').patchValue(data.data.cargoWeighingDetailModel);
        this.weighingForm.get('totalAcceptedPiecesSum').patchValue(data.data.totalAcceptedPiecesSum);
        this.weighingForm.get('totalAcceptedWeightSum').patchValue(Number.parseFloat(NgcUtility.getDisplayWeight(data.data.totalAcceptedWeightSum)));
        this.weighingForm.get('differenceWeight').patchValue(Number.parseFloat(NgcUtility.getDisplayWeight(data.data.differenceWeight)));
        this.weighingForm.get('differencePieces').patchValue(data.data.differencePieces);
        this.weighingForm.get('differenceWeightPercent').patchValue(Number.parseFloat(NgcUtility.getDisplayWeight(data.data.differenceWeightPercent)));
      } else {
        if (data.messageList[0] != null) {
          this.showErrorMessage(data.messageList[0].code);
        }

      }

    });
  }
  onChangeDimePieces(index, event) {
    this.weighingForm.get(['dimension', index, 'totalPieces']).patchValue(this.weighingForm.get(['dimension', index, 'pcs']).value * this.weighingForm.get(['dimension', index, 'multiplier']).value);
  }
  onChangeGrossWeight(grossweight, index, item) {
    this.valueUpdateIndex = index;
    if (grossweight != undefined && grossweight > 0) {
      if (this.weighingscalename != null || this.weighingscalename != undefined) {
        this.weighingForm.get(['cargoWeighingDetailModel', index, 'weighingScaleId']).setValue(this.weighingscalename);
      } else {
        this.weighingForm.get(['cargoWeighingDetailModel', index, 'weighingScaleId']).setValue(null);
      }
      if (item.value.skids != undefined && item.value.skids > 0) {
        this.weighingForm.get(['cargoWeighingDetailModel', index, 'netWeight']).patchValue(grossweight - (item.value.tareWeight * item.value.skids));
      } else {
        this.weighingForm.get(['cargoWeighingDetailModel', index, 'netWeight']).patchValue(grossweight - (item.value.tareWeight));
      }

    } else {
      this.weighingForm.get(['cargoWeighingDetailModel', index, 'netWeight']).setValue(0.0);
    }
    this.autoFocusEnum = "tarewweight";

  }


  onChangeTare(event, index) {
    this.valueUpdateIndex = index;
    let skids = this.weighingForm.get(['cargoWeighingDetailModel', index, 'skids']).value;
    let gross = this.weighingForm.get(['cargoWeighingDetailModel', index, 'grossWeight']).value;
    if (skids != undefined && skids > 0) {
      this.weighingForm.get(['cargoWeighingDetailModel', index, 'netWeight']).patchValue(gross - (skids * event));
    } else {
      this.weighingForm.get(['cargoWeighingDetailModel', index, 'netWeight']).patchValue(gross - (event));
    }
    this.autoFocusEnum = "skids";

  }


  onChangeSkid(event, index) {
    this.valueUpdateIndex = index;
    let tare = this.weighingForm.get(['cargoWeighingDetailModel', index, 'tareWeight']).value;
    let gross = this.weighingForm.get(['cargoWeighingDetailModel', index, 'grossWeight']).value;
    if (event != undefined && event > 0) {
      this.weighingForm.get(['cargoWeighingDetailModel', index, 'netWeight']).patchValue(gross - (tare * event));
    } else {
      this.weighingForm.get(['cargoWeighingDetailModel', index, 'netWeight']).patchValue(gross - tare);
    }
    this.autoFocusEnum = "shipmentlocation";

  }

  fetchRuleExecutionList(cargo, errormessage) {
    //Research the data
    cargo.messageList = [];
    this.exportService.fetchRuleShipmentExecutionList(cargo).subscribe(response => {
      let ruleShipmentExecutionDetails: any;
      if (response.success == true || response.messageList == null) {


        this.showSuccessStatus('g.completed.successfully');
        ruleShipmentExecutionDetails = response.data.ruleShipmentExecutionDetails;
        this.weighingForm.get('ruleShipmentExecutionDetails').patchValue(response.data.ruleShipmentExecutionDetails);
        if (response.data.acknowledgeindicatornotclose == false) {
          this.actionlistindicator = "error"
        } else {

          this.actionlistindicator = "";
        }

        if (errormessage != null) {
          if ((ruleShipmentExecutionDetails.execWarnList.length > 0 && ruleShipmentExecutionDetails.execWarnList[0].status != "CLOSED")
            || (ruleShipmentExecutionDetails.execInfoList.length > 0 && ruleShipmentExecutionDetails.execInfoList[0].status != "CLOSED")
            || (ruleShipmentExecutionDetails.execErrorList > 0 && ruleShipmentExecutionDetails.execErrorList[0].status != "CLOSED")) {
            this.showErrorMessage(errormessage + NgcUtility.translateMessage("export.checklist.close.failures.message", []));
          } else {
            this.showErrorMessage(errormessage);
          }
        } else {
          if ((ruleShipmentExecutionDetails.execWarnList.length > 0 && ruleShipmentExecutionDetails.execWarnList[0].status != "CLOSED")
            || (ruleShipmentExecutionDetails.execInfoList.length > 0 && ruleShipmentExecutionDetails.execInfoList[0].status != "CLOSED")
            || (ruleShipmentExecutionDetails.execErrorList > 0 && ruleShipmentExecutionDetails.execErrorList[0].status != "CLOSED")) {
            this.showErrorMessage("export.close.failure.action.list.before.weighing.finalize");
          }
        }


      }
    });
  }
  onCloseFailureData() {
    let cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();
    cargo = this.weighingForm.value;
    const requestCloseFailure = (<NgcFormGroup>this.weighingForm.get('ruleShipmentExecutionDetails')).getRawValue();

    if (requestCloseFailure.execInfoList != null && requestCloseFailure.execInfoList.length > 0) {
      requestCloseFailure.execInfoList.forEach(element => {
        element.issueClosedBy = this.getUserProfile().userShortName;
      });
    }
    if (requestCloseFailure.execErrorList != null && requestCloseFailure.execErrorList.length > 0) {
      requestCloseFailure.execErrorList.forEach(element => {
        element.issueClosedBy = this.getUserProfile().userShortName;
      });
    }
    if (requestCloseFailure.execWarnList != null && requestCloseFailure.execWarnList.length > 0) {
      requestCloseFailure.execWarnList.forEach(element => {
        element.issueClosedBy = this.getUserProfile().userShortName;
      });
    }

    this._acceptanceService.onCloseFailureData(requestCloseFailure).subscribe(response => {
      this.showResponseErrorMessages(response);


      let errorMessage: string = null;
      if (response.messageList != null && response.messageList.length > 0) {

        errorMessage = response.messageList[0].code;
      }

      this.fetchRuleExecutionList(cargo, errorMessage);

    });

  }

  onChangeShipmentLocation(index, sindex, $event) {
    this.shipmentlocationerrorflag = false;
  }
  unfinalizeShipment() {
    this.preveiousWeighingAcceptedPieces = this.weighingForm.get('weighingAcceptedPieces').value;
    if (this.shipmentlocationerrorflag == true) {
      this.showErrorMessage("expaccpt.input.valid.shipment.warehouse.location");
      return;
    }
    const cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();
    const shipmentObj: ShipmentModel = new ShipmentModel();
    shipmentObj.shipmentNumber = this.weighingForm.get('shipmentNumber').value;
    cargo.shipmentModel = shipmentObj;
    cargo.partEnableFlag = this.partenableflag;
    cargo.messageList = [];
    this.exportService.unfinalizeShipmentRevised(cargo).subscribe(data => {
      if (data.success == true && data.messageList == null) {
        this.enableOnUnfinalize();

        this.weighingForm.get('latestLoggedInTime').patchValue(data.data.latestLoggedInTime);
        this.showSuccessStatus("g.operation.successful");

      } else {
        if (data.messageList[0] != null) {
          this.showErrorMessage(data.messageList[0].code);
        }

      }
    });
  }

  onAddRemark() {
    (<NgcFormArray>this.weighingForm.get('remarks')).addValue([
      {
        type: '',
        detail: '',
        deleteRemark: ''
      }
    ]);
  }

  onDelete(event, index) {

    (<NgcFormArray>this.weighingForm.get(['remarks'])).markAsDeletedAt(index);
  }

  onChangeGrossPieces(pieces, index, item) {

    this.valueUpdateIndex = index;
    this.autoFocusEnum = "grossweight";
    let multipliedpieces = 0;
    if (this.weighingForm.get(['dimension', index, 'multiplier']).value > 0) {
      multipliedpieces = pieces * this.weighingForm.get(['dimension', index, 'multiplier']).value
    } else {
      multipliedpieces = pieces;
    }
    if (this.weighingForm.get(['dimension', index]) != null) {
      if (this.weighingForm.get(['dimension', index, 'messageId']) != null && this.weighingForm.get(['dimension', index, 'messageId']).value != "" &&
        this.weighingForm.get(['cargoWeighingDetailModel', index, 'messageId']) != null && this.weighingForm.get(['cargoWeighingDetailModel', index, 'messageId']).value != null
        && (this.weighingForm.get(['dimension', index, 'messageId']).value
          == this.weighingForm.get(['cargoWeighingDetailModel', index, 'messageId']).value
        )) {
        (<NgcFormControl>this.weighingForm.get(['dimension', index, 'totalPieces'])).patchValue(
          multipliedpieces
        );
        (<NgcFormControl>this.weighingForm.get(['dimension', index, 'pcs'])).patchValue(
          pieces
        );
      }


    }

  }

  // overriden the framework afterfocus method to customize it
  protected afterFocus() {
    if (this.valueUpdateFlag) {
      this.async(() => {
        try {
          if (this.autoFocusEnum == "tarewweight") {
            (this.weighingForm.get(['cargoWeighingDetailModel', this.valueUpdateIndex, 'tareWeight']) as NgcFormControl).focus();
          } else if (this.autoFocusEnum == "skids") {
            (this.weighingForm.get(['cargoWeighingDetailModel', this.valueUpdateIndex, 'skids']) as NgcFormControl).focus();
          } else if (this.autoFocusEnum == "shipmentlocation") {
            (this.weighingForm.get(['cargoWeighingDetailModel', this.valueUpdateIndex, 'intentory', 0, 'shipmentLocation']) as NgcFormControl).focus();
          } else if (this.autoFocusEnum == "grossweight") {
            (this.weighingForm.get(['cargoWeighingDetailModel', this.valueUpdateIndex, 'grossWeight']) as NgcFormControl).focus();
          } else if (this.autoFocusEnum == "piece") {
            (this.weighingForm.get(['cargoWeighingDetailModel', this.valueUpdateIndex, 'piece']) as NgcFormControl).focus();
          }
        } catch (e) { }

        this.valueUpdateFlag = false;
      }, 100);
    }
  }

  onPartClick() {
    let cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();
    cargo = this.weighingForm.getRawValue();
    cargo.greaterAcceptedPiecesFlag = false;
    cargo.greaterAcceptedWeightFlag = false;

    const lineItem = (<NgcFormGroup>this.weighingForm.get(['dimension'])).getRawValue();
    if (this.weighingForm.get('volumetricWeightEnableFlag').value == true) {
      if (lineItem.length > 0) {
        let totaldimpieces = 0;
        for (const entry of (<NgcFormGroup>this.weighingForm.get(['dimension'])).getRawValue()) {
          if ((entry.manualScanReason == "" || entry.manualScanReason == null) && (entry.dimensionCapturedManually == true)) {
            this.showErrorMessage("export.select.manual.scan.reason");
            return;
          }
          if (entry.length == null || entry.length == "" || entry.width == null || entry.width == ""
            || entry.height == null || entry.height == "" || entry.pcs == null || entry.pcs == "") {
            if (this.partDimensionMandatoryFlag == true) {
              this.showErrorMessage("export.carrier.required.volumetric.dimensions");
              this.partDimensionMandatoryFlag = false;
              return
            }
          }
          totaldimpieces = totaldimpieces + entry.totalPieces;
        }
        if (this.shipmentlocationerrorflag == true) {
          this.showErrorMessage("expaccpt.input.valid.shipment.warehouse.location");
          return;
        }

        let weighingpiecessum = 0;
        this.weighingForm.get('cargoWeighingDetailModel').value.forEach(element => {
          weighingpiecessum = weighingpiecessum + element.piece;
        });

        if (this.weighingForm.get('volumetricWeightEnableFlag').value == true && totaldimpieces != weighingpiecessum) {
          this.showErrorMessage("export.total.dimension.pieces.not.equal.weighing.pieces");
          return;
        }

      } else {
        this.showErrorMessage("export.carrier.required.volumetric.dimensions");
        return
      }
    }

    if (this.weighingForm.invalid) {
      this.showErrorMessage("export.enter.valid.data");
      return;
    }
    cargo.messageList = [];
    cargo.isFinalizeSuffix = false;
    cargo.ackWarnForeignUldCheck = true;
    this.exportService.setPartAccepted(cargo).subscribe(response => {
      if (response.data != null && (response.messageList == null || response.messageList.length == 0)) {
        if (response.data && response.data.foreignUldCheck == true) {
          this.showConfirmMessage(NgcUtility.translateMessage("maintain.foreign.uld.check.5", [response.data.foreignUld])).then(fulfilled => {
            cargo.foreignUldCheck = false;
            cargo.ackWarnForeignUldCheck = false;
            this.exportService.onSaveWeighingRevised(cargo).subscribe(data => {
              this.resp = data.data;
              if (data.success) {
                this.weighingForm.patchValue(response.data);
                this.resp = response.data;
                this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstarttime));
                this.showSuccessStatus("g.operation.successful");
              } else {
                if (data.messageList[0] != null) {
                  this.showErrorMessage(data.messageList[0].code);
                }

              }
            });
          }
          ).catch(reason => { });
        } else {
          this.weighingForm.patchValue(response.data);
          this.resp = response.data;
          this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstarttime));
          this.showSuccessStatus("g.operation.successful");
        }
      } else {
        this.weighingForm.patchValue(response.data);
        this.resp = response.data;
        this.weighingForm.get('weighingstarttime').patchValue(NgcUtility.toDateFromLocalDate(this.resp.weighingstarttime));
        this.showErrorMessage(response.messageList[0].code);
      }
    });
  }

  onReturnDocument() {
    this.navigateTo(this.router, '/export/acceptance/rejectshipment',
      this.weighingForm.get('shipmentNumber').value);
  }

  // Report method for print weighing slip should be enabled on;y after finalize
  onPrintViewingSlip() {
    this.reportParameters = new Object();
    this.reportParameters.shipmentNumber = this.weighingForm.get('shipmentModel').get('shipmentNumber').value
    this.reportParameters.shipmentdate = this.weighingForm.get('shipmentModel').get('shipmentDate').value
    this.reportParameters.loginuser = this.getUserProfile().userShortName;
    this.reportWindow.open();
  }

  onECC() {
    let cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();
    cargo = this.weighingForm.getRawValue();
    cargo.messageList = [];
    this.exportService.eccFinalizeRevised(cargo).subscribe(data => {
      this.showFormErrorMessages(data);
      if (!data.messageList) {
        // this.eccfinalized = data.data.eccfinalized;
        this.eccfinalized = data.data.eccFinalized;

        this.showSuccessStatus('g.operation.successful');
      }


    });


  }
  onSelectManualScanReason(index, value) {
    this.weighingForm.get(['dimension', index, 'manualScanReasonValue']).setValue(value.desc);
    if (value.desc == "SYSTEM") {
      this.showErrorMessage("export.system.cannot.be.selected");
      this.weighingForm.get(['dimension', index, 'manualScanReason']).reset();
      this.weighingForm.get(['dimension', index, 'manualScanReasonValue']).reset();
    }

    const weighingLineItem = (<NgcFormArray>this.weighingForm.get('cargoWeighingDetailModel')).getRawValue();

    let lineitemindex = 0;
    let linemessageidindex = null;
    weighingLineItem.forEach(element => {
      if (element.messageId === this.weighingForm.get(['dimension', index, 'messageId']).value) {
        linemessageidindex = lineitemindex;
      }
      lineitemindex = lineitemindex + 1;
    })
    if (linemessageidindex != null) {
      this.weighingForm.get(['cargoWeighingDetailModel', linemessageidindex, 'messageId']).patchValue(null);
    }
    this.weighingForm.get(['dimension', index, 'messageId']).patchValue(null);
  }
  onChangeMultiplier(index) {
    this.shipmentVolumetricWeight = this.weighingForm.get('totalVolWeight').value;
    this.shipmentVolumetricWeight = this.shipmentVolumetricWeight - this.weighingForm.get(['dimension', index, 'totalVolumetricWeight']).value;
    (<NgcFormControl>this.weighingForm.get(['dimension', index, 'totalPieces'])).patchValue(
      this.weighingForm.get(['dimension', index, 'pcs']).value * (
        this.weighingForm.get(['dimension', index, 'multiplier'])).value
    );
    (<NgcFormControl>this.weighingForm.get(['dimension', index, 'totalVolumetricWeight'])).patchValue(
      this.weighingForm.get(['dimension', index, 'volumetricWeight']).value * (
        this.weighingForm.get(['dimension', index, 'multiplier'])).value
    );
    this.shipmentVolumetricWeight = this.shipmentVolumetricWeight + (this.weighingForm.get(['dimension', index, 'volumetricWeight']).value * (
      this.weighingForm.get(['dimension', index, 'multiplier'])).value)
    this.weighingForm.get('totalVolWeight').patchValue(this.shipmentVolumetricWeight);

  }
  onGetDimension(index) {
    const lineItem = (<NgcFormGroup>this.weighingForm.get(['dimension', index])).getRawValue();
    if (this.weighingForm.get('volumetricWeightEnableFlag').value == true && ((lineItem.length == 0 || lineItem.length == '') || (lineItem.width == 0 || lineItem.width == '') ||
      (lineItem.height == 0 || lineItem.height == ''))) {
      this.weighingForm.get('totalVolWeight').patchValue(this.weighingForm.get('totalVolWeight').value - this.weighingForm.get(['dimension', index, 'volumetricWeight']).value);
      this.weighingForm.get(['cargoWeighingDetailModel', index, 'volumetricWeight']).patchValue(0.0);
      this.weighingForm.get(['dimension', index, 'volumetricWeight']).patchValue(0.0);
    } else {


      if (this.weighingForm.get(['dimension', index]) != null) {
        const lineItem = (<NgcFormGroup>this.weighingForm.get(['dimension', index])).getRawValue();

        if (lineItem.length !== 0 && lineItem.length !== '' && lineItem.width !== 0 && lineItem.width !== '' &&
          lineItem.height !== 0 && lineItem.height !== '') {
          this.totalDimensionPieces = 0;
          this.totalDimensionWeight = 0;
          if (
            this.weighingForm.get(['cargoWeighingDetailModel', index]) != null
          ) {
            const volume = (+(lineItem.length)) * (+(lineItem.width)) * (+(lineItem.height - this.weighingForm.get(['cargoWeighingDetailModel', index, 'skidHeight']).value));
            this.weighingForm.get(['dimension', index, 'volume']).setValue((volume));
          } else {
            const volume = (+(lineItem.length)) * (+(lineItem.width)) * (+(lineItem.height));
            this.weighingForm.get(['dimension', index, 'volume']).setValue((volume));
          }



          //backend call to calculate volumetric weight

          const dimension: Dimention = new Dimention();
          dimension.shipmentNumber = this.weighingForm.get('shipmentNumber').value;


          dimension.weightCode = 'K';

          dimension.unitCode = 'CMT';

          dimension.volumeCode = 'MC';

          dimension.shipmentPcs = this.weighingForm.get('weighingAcceptedPieces').value;
          dimension.shipmentWeight = this.weighingForm.get('weighingAcceptedWeight').value;

          const dimensionList = (<NgcFormArray>this.weighingForm.get('dimension')).getRawValue();
          dimensionList.forEach(ele => {
            ele.pcs = 1;
            ele.Pieces = 1;
            ele.piece = 1;
            if (this.weighingForm.get(['cargoWeighingDetailModel', index]) != null) {
              ele.height = ele.height - this.weighingForm.get(['cargoWeighingDetailModel', index, 'skidHeight']).value;
            } else {
              ele.pcs = 1;
              ele.Pieces = 1;
              ele.piece = 1;
              ele.height = ele.height;
            }


          })
          dimension.dimensionDetails = dimensionList;


          this.exportService.getVolumetricWeightRevised(dimension).subscribe((data) => {

            let volumetricdata: any = data;
            let counter = 0;
            if (data != null) {


              const lenflag = (<NgcFormArray>this.weighingForm.get('cargoWeighingDetailModel')).length;
              if (lenflag >= index + 1) {
                this.weighingForm.get(['cargoWeighingDetailModel', index, 'volumetricWeight']).patchValue(volumetricdata.dimensionDetails[index].convertedVolume);
              }

              this.weighingForm.get(['dimension', index, 'volumetricWeight']).patchValue(volumetricdata.dimensionDetails[index].convertedVolume);


              this.weighingForm.get(['dimension', index, 'totalPieces']).patchValue(
                this.weighingForm.get(['dimension', index, 'pcs']).value * (
                  this.weighingForm.get(['dimension', index, 'multiplier'])).value
              );


              counter = counter + 1;
              this.shipmentVolumetricWeight = this.weighingForm.get('totalVolWeight').value;
              this.shipmentVolumetricWeight = this.shipmentVolumetricWeight - this.weighingForm.get(['dimension', index, 'totalVolumetricWeight']).value;
              this.weighingForm.get(['dimension', index, 'totalVolumetricWeight']).patchValue(
                volumetricdata.dimensionDetails[index].convertedVolume * (
                  this.weighingForm.get(['dimension', index, 'multiplier'])).value
              );
              this.weighingForm.get('totalVolWeight').patchValue(this.shipmentVolumetricWeight + (volumetricdata.dimensionDetails[index].convertedVolume *
                this.weighingForm.get(['dimension', index, 'multiplier']).value));
            }
          });



        }
      }
    }

  }

  reSum() {
    this.totalVolPieces = 0;
    this.shipmentVolumetricWeight = 0;

    for (const entry of (<NgcFormGroup>this.weighingForm.get(['dimension'])).getRawValue()) {
      this.totalVolPieces += entry.pcs;

      this.shipmentVolumetricWeight += entry.volume;


    }
    if (this.weighingForm.get('chargeableWeight').value != null &&
      this.weighingForm.get('chargeableWeight').value < this.weighingForm.get('totalVolWeight').value) {

      this.showWarningMessage("expaccpt.volumetric.weight.more.chargeable.weight");
    } else if (this.weighingForm.get('chargeableWeight').value == null) {
      if (this.weighingForm.get('totalVolWeight').value > this.weighingForm.get('acceptedDocumentWeight').value) {
        this.showWarningMessage("expaccpt.volumetric.weight.more.chargeable.weight");
      }
    }




  }


  onEnableManualScan(index) {

  }
  onDetailsAddRow() {
    let index = this.weighingForm.get(['dimension']).value.length;
    (<NgcFormArray>this.weighingForm.get('dimension')).addValue([
      {
        length: '',
        width: '',
        height: '',
        pcs: '',
        volume: '',
        manualScanReason: '',
        manualScanReasonValue: '',
        measurementUnitCode: '',
        volumeCode: '',
        weightCode: '',
        voulmetricEnableFlag: '',
        volumetricWeight: '',
        dimensionCapturedManually: true,
        multiplier: '',
        texture: '',
        errorFlag: '',
        errorCode: '',
        errorDescription: '',
        totalPieces: '',
        totalVolumetricWeight: '',
        messageId: null

      }
    ]);
    //let index = this.weighingForm.get(['cargoWeighingDetailModel']).value.length;
    if (
      index + 1 <= (<NgcFormArray>this.weighingForm.get('cargoWeighingDetailModel')).value.length
    ) {
      this.weighingForm.get(['dimension', index, 'pcs']).patchValue(this.weighingForm.get(['cargoWeighingDetailModel', index, 'piece']).value);
    } else {
      this.weighingForm.get(['dimension', index, 'pcs']).patchValue(1);
    }

    this.weighingForm.get(['dimension', index, 'dimensionCapturedManually']).patchValue(
      true
    );
    this.weighingForm.get(['dimension', index, 'multiplier']).patchValue(
      1
    );
  }
  onDeleteDimension(index) {

    //(<NgcFormArray>this.weighingForm.get(['dimension'])).markAsDeletedAt(index);

    this.weighingForm.get('totalVolWeight').patchValue(this.weighingForm.get('totalVolWeight').value - this.weighingForm.get(['dimension', index, 'volumetricWeight']).value);
    if (this.weighingForm.get(['cargoWeighingDetailModel']).value.length >= index + 1) {
      this.weighingForm.get(['cargoWeighingDetailModel', index, 'volumetricWeight']).patchValue(0.0);
      this.weighingForm.get(['dimension', index, 'volumetricWeight']).patchValue(0.0);
    }


    // if (this.weighingForm.get(['dimension', index, 'messageId']).value != null) {
    //   (<NgcFormArray>this.weighingForm.get(['cargoWeighingDetailModel'])).markAsDeletedAt(index);
    // }
    (<NgcFormArray>this.weighingForm.get(['dimension'])).markAsDeletedAt(index);
    this.totalDimensionPieces = 0;
    this.totalDimensionWeight = 0;

  }

  onChangeDimensions(index, item) {
    this.onGetDimension(index);
  }
  onChecklist() {
    const data = {
      shipmentNumber: this.weighingForm.get('shipmentNumber').value
    }
    this.navigateTo(this.router, '/export/checklist/setupcheckliststatus', data);
  }

}