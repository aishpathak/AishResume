import { filter } from 'rxjs/operators';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, ReactiveModel, PageConfiguration, NgcUtility, NgcWindowComponent, CellsRendererStyle, NgcReportComponent, NgcPrinterComponent } from 'ngc-framework';
import { TranshipmentHandlingSummaryModel, TranshipmentWorkingListModel, UldInformation, GetOutgoingTransshipmentFlightsRequest, FinalizeAndUnfinalizeTranshipmentRequest, AwbPrintRequestList } from '../transhipment.sharedmodel.ts';
import { Flight, UnloadShipmentSearch, SendAdvice } from '../../export.sharedmodel';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { TranshipmentService } from '../transhipment.service';
import { ImportService } from '../../../import/import.service';
import { jsonpCallbackContext } from '@angular/common/http/src/module';


@Component({
  selector: 'app-inboundtransshipmentworkinglist',
  templateUrl: './inboundtranshipmentworkinglist.component.html',
  styleUrls: ['./inboundtranshipmentworkinglist.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,

})
export class InboundtranshipmentworkinglistComponent extends NgcPage {
  tempformData: any;
  flightId: any;
  filterdata: any;
  private uldGroupSelectState: any = {};
  flagClickAtUldLevel = false;
  flagClickAtShipmentLevel = false;
  selectCheckBox: any = false;
  uldSelectCheckBox = false;
  finalizeFag: boolean;
  bulkFlag = false;
  isST = false;
  record: any;
  checkEventData: NgcFormArray = new NgcFormArray([]);
  checkForAlreadyLoadedFlag = true;
  shipmentDataLoadedUnloaded: any[] = [];
  flightPartSuffixDropdown: any;
  ackInfo = false;
  hasReadPermission: boolean = false;

  @ViewChild('uldUpdateWindow') uldUpdateWindow: NgcWindowComponent;
  @ReactiveModel(TranshipmentWorkingListModel)
  @ReactiveModel(TranshipmentWorkingListModel)
  @ViewChild('windowPrinter') windowPrinter: NgcWindowComponent;
  @ViewChild('showloadedUld') showloadedUld: NgcWindowComponent;
  reportParameters: any = new Object();
  @ViewChild('inboundReportWindow') inboundReportWindow: NgcReportComponent;
  @ViewChild('inboundReportWindow1') inboundReportWindow1: NgcReportComponent;
  @ViewChild('printerName') printerName: NgcPrinterComponent

  popupPrinterForm: NgcFormGroup = new NgcFormGroup({
    printerdropdown: new NgcFormControl(),
  });


  showloadedUldForm: NgcFormGroup = new NgcFormGroup({
    showloadedUldP: new NgcFormControl(),
  });
  awbPrintRequestList: any;

  @ReactiveModel(TranshipmentWorkingListModel)
  uldForm: NgcFormGroup = new NgcFormGroup({
    flightList: new NgcFormArray([])
  });
  inboundTransshipmentWorkingListForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    date: new NgcFormControl(),
    sta: new NgcFormControl(),
    eta: new NgcFormControl(),
    segment: new NgcFormControl(),
    acRegistration: new NgcFormControl(),
    transferType: new NgcFormControl(),
    loadingInstruction: new NgcFormControl(),
    flightList: new NgcFormArray([
      new NgcFormGroup({
        flightKey: new NgcFormControl(),
        airport: new NgcFormControl(),
        standardEstimatedDateTime: new NgcFormControl(),
        dls: new NgcFormControl(),
        timeDifference: new NgcFormControl(),
        uldInformationList: new NgcFormArray([
          new NgcFormGroup({
            select: new NgcFormControl(),
            contourCode: new NgcFormControl(),
            weightUld: new NgcFormControl(),
            weightUnitCode: new NgcFormControl(),
            assigned: new NgcFormControl(),
            mixLoad: new NgcFormControl(),
            uldKey: new NgcFormControl(),
            shipmentList: new NgcFormArray([
              new NgcFormGroup({
                select: new NgcFormControl(),
                shipmentNumber: new NgcFormControl(),
                partSuffix: new NgcFormControl(),
                finalizedShipment: new NgcFormControl(),
                origin: new NgcFormControl(),
                destination: new NgcFormControl(),
                concatSHC: new NgcFormControl(),
                natureOfGoods: new NgcFormControl(),
                pieces: new NgcFormControl(),
                weight: new NgcFormControl(),
                totalPieces: new NgcFormControl(),
                transferType: new NgcFormControl(),
                fwb: new NgcFormControl(),
                ready: new NgcFormControl(),
                fhl: new NgcFormControl(),
                rct: new NgcFormControl(),
                throughServiceShipment: new NgcFormControl()
              })
            ])
          })
        ])
      })
    ])

  })
  public formData: any;
  public previousPageData: any;
  shipementDetailList: any[] = [];
  awbSelectedList: any[] = [];
  allData: any;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private transhipmentService: TranshipmentService,
    private importService: ImportService, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }
  ngOnInit() {
    this.initialise();
    document.addEventListener('change', event => event.preventDefault());
  }
  initialise() {
    this.hasReadPermission = NgcUtility.hasReadPermission('TRAN_HAND_MONITORING');
    this.checkEventData.reset();
    this.previousPageData = this.getNavigateData(this.activatedRoute);
    if (this.previousPageData) {
      const request = new GetOutgoingTransshipmentFlightsRequest();
      this.flightId = this.previousPageData.item;
      request.flightId = this.previousPageData.item;
      request.transferTypeList = this.previousPageData.transferType;
      this.transhipmentService.getIncomingFlightListDetails(request).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.inboundTransshipmentWorkingListForm.patchValue(response.data);
          this.formData = response.data;
          this.inboundTransshipmentWorkingListForm.get("segment").patchValue(this.formData.segment);
          if (this.formData.finalized) {
            this.finalizeFag = true;
          } else {
            this.finalizeFag = false;
          }
          this.setShipmentListData();
        }
      }, error => {
        this.showErrorStatus(error);
      });
    }

  }
  setShipmentListData() {
    this.uldSelectCheckBox = false;
    const list = [];
    const flightList = this.formData.flightList;
    this.isST = false;
    const transferTypes = new Set();
    flightList.forEach(valueOfFlight => {
      const uldList = valueOfFlight.uldInformationList;
      uldList.forEach(uldValue => {
        const shipmentList = uldValue.shipmentList;
        shipmentList.forEach(shipmentValues => {
          shipmentValues['finalised'] = (shipmentValues.finalizedShipment == 1) ? 'F' : this.getMunualLoadStatus(shipmentValues);
          shipmentValues['shipmentByFinalized'] = shipmentValues.shipmentNumber.concat(' ').
            concat((shipmentValues.finalizedShipment == 1) ? 'F' : this.getMunualLoadStatus(shipmentValues)).concat("\n").concat(shipmentValues.loadedUld != null ? " Loaded " + "(" + shipmentValues.loadedUld + ")" : '');
        });
      });
    });
    this.isST = transferTypes.has('ST') && transferTypes.size === 1;
    this.inboundTransshipmentWorkingListForm.get('shipmentList').patchValue(list);

    //this.inboundTransshipmentWorkingListForm.get('shipmentList')

    let index = 0;
    list.forEach(element => {

      if (!element.transferType
        || element.transferType === 'ST'
        || element.transferType === 'TRANSHIPMENT'
        || element.transferType === 'TRANSIT'
        || element.transferType === 'QT'
        || element.finalised === 'F') {
        this.inboundTransshipmentWorkingListForm.get(['shipmentList', index, 'select']).disable();

      }
      index++;
    });

  }

  getMunualLoadStatus(shipmentValues) {
    if (!shipmentValues.transferType
      || shipmentValues.transferType === 'ST'
      || shipmentValues.transferType === 'TRANSHIPMENT'
      || shipmentValues.transferType === 'TRANSIT'
      || shipmentValues.transferType === 'QT'
    ) {
      return (shipmentValues.loadedShipmentInfoId != null) ? 'M' : '';
    } else
      return '';

  }


  onClickHandler(event) {
    const temp = event.key.split(' ');
    if (event.checked) {
      const sizeOfList = this.checkEventData.length;
      if (sizeOfList >= 1) {
        let flagForSameRowUld: boolean;
        this.checkEventData.controls.forEach((formGroup: NgcFormGroup) => {
          const rowValue: number = formGroup.get('key').value;
          if (temp[0] === rowValue) {
            flagForSameRowUld = true;
          } else {
            flagForSameRowUld = false;
          }
        });
        if (!flagForSameRowUld) {
          this.checkEventData.addValue([{ 'key': temp[0], 'flight': temp[1], 'shipment': null }]);

        }
      } else {
        this.checkEventData.addValue([{ 'key': temp[0], 'flight': temp[1], 'shipment': null }]);
      }
      this.uldGroupSelectState[event.key] = true;
      let alldata = [];
      //  check all shipments internally
      this.inboundTransshipmentWorkingListForm.getRawValue().flightList.forEach((flight, indexFlight: number) => {
        if (flight.flightIdAndSegementId === temp[1]) {
          flight.uldInformationList.forEach((uld, indexUld: number) => {
            if (uld.uldKey === temp[0]) {
              uld.shipmentList.forEach((shipment, indexShipment: number) => {
                if (shipment.select === false && (shipment.transferType != null
                  && shipment.finalizedShipment !== 1)) {
                  shipment.select = true;
                  this.inboundTransshipmentWorkingListForm.get(['flightList', indexFlight, 'uldInformationList', indexUld, 'shipmentList', indexShipment, 'select']).patchValue(true);
                }
              });
            }
          })
        }
        alldata.push(flight);
      });
      let formValue: any = this.inboundTransshipmentWorkingListForm.getRawValue();
      formValue.flightList = alldata;
      this.formData = formValue;
    } else {
      this.inboundTransshipmentWorkingListForm.getRawValue().flightList.forEach((flight, indexFlight: number) => {
        if (flight.flightIdAndSegementId === temp[1]) {
          flight.uldInformationList.forEach((uld, indexUld: number) => {
            if (uld.uldKey === temp[0]) {
              uld.shipmentList.forEach((shipment, indexShipment: number) => {
                shipment.select = true;
                this.checkEventData.deleteValue([{ 'key': temp[0], 'flight': temp[1], 'shipment': shipment.shipmentNumber }]);
                this.inboundTransshipmentWorkingListForm.get(['flightList', indexFlight, 'uldInformationList', indexUld, 'shipmentList', indexShipment, 'select']).setValue(false);
              });
            }
          })
        }
      });
      this.formData = this.inboundTransshipmentWorkingListForm.getRawValue();
      this.checkEventData.deleteValue([{ 'key': temp[0], 'flight': temp[1], 'shipment': null }]);
      this.uldGroupSelectState[event.key] = false;
    }
  }

  setData() {
    this.tempformData = this.inboundTransshipmentWorkingListForm.getRawValue();
    const tempFlightList: any = [];
    let selectedULDFlight = this.checkEventData.getRawValue();
    const selectedShipmentList: any = [];
    this.tempformData.flightList.forEach(element => {

      element.flightBoardPoint = NgcUtility.getTenantConfiguration().airportCode;
      element.flightOffPoint = element.airport;
      element.uldInformationList.forEach(element1 => {
        element1.shipmentList.forEach(element2 => {
          if (element2.select) {
            element2.flightId = element.flightId
            element2.flightSegmentId = element.flightSegmentId;
            element2.flightKey = element.flightKey;
            element2.dateSTA = this.tempformData.standardEstimatedDateTime;
            if (element1.uldKey) {
              element2.uldKey = element1.uldKey;
              element2.weightUld = element1.weightUld;
            }
            selectedShipmentList.push(element2);
          }
        })
      })
    })
    // selectedShipmentList.forEach(element => {
    //   if (!selectedULDFlight.find((value) => {
    //     return element.uldKey === value.key && element.flightIdAndSegementId === value.flight;
    //   })) {
    //     element.uldKey = "";
    //   }
    // });
    this.tempformData.shipmentList = selectedShipmentList;
  }

  loadShipment() {
    this.setData();
    this.tempformData.sta = null;
    this.tempformData.eta = null;
    let requestLoadShipment = new TranshipmentWorkingListModel();
    requestLoadShipment = this.tempformData;
    this.transhipmentService.loadShipmentTranshipment(requestLoadShipment).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        response.data.flightList.forEach((fltElement, index) => {
          this.flightPartSuffixDropdown = this.createSourceParameter(fltElement.flightId.toString());
          fltElement.uldInformationList.forEach((uldElement, uldIndex) => {
            if (uldElement.shipmentList[0].weightUld) {
              uldElement.weightUld = uldElement.shipmentList[0].weightUld
            }
          })
        })
        this.uldForm.patchValue(response.data);
        this.uldUpdateWindow.open();
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  unloadflag = false;
  unloadshipmentToFlight() {
    this.unloadflag = true;
    this.setData();
    this.tempformData.sta = null;
    this.tempformData.eta = null;
    let requestLoadShipment = new TranshipmentWorkingListModel();
    requestLoadShipment = this.tempformData;
    const selectedShipmentList = this.tempformData.
      shipmentList.
      filter((element) => element.select == true
        && (element.loadedShipmentInfoId == null && element.loadedUld == null));
    if (selectedShipmentList.length > 0) {
    }
    if (selectedShipmentList.length == 0) {
      let errorMessage = "";
      requestLoadShipment.flightList.forEach(valueOfFlight => {
        const uldList = valueOfFlight.uldInformationList;

        uldList.forEach(uldValue => {
          const shipmentList = uldValue.shipmentList;
          shipmentList.forEach(shipmentValues => {
            if (shipmentValues.select) {
              if (shipmentValues.uldKey == "BULK" && shipmentValues.loadedUld) {
                if (shipmentValues.loadedUld.split(",").length == 1
                  && shipmentValues.loadedUld.split("/").length > 0) {
                  shipmentValues.loadedUld = shipmentValues.loadedUld.split("/")[0];
                  shipmentValues.uldKey = shipmentValues.loadedUld;
                  if (valueOfFlight.sqCarrier && !shipmentValues.partSuffix) {
                    shipmentValues.partSuffix = "P";
                  }
                }
                else {
                  errorMessage = "error.uld.loaded.multiple.times";
                  return;
                }
              } else if (shipmentValues.uldKey == null) {
                shipmentValues.uldKey = "BULK";
                if (valueOfFlight.sqCarrier && !shipmentValues.partSuffix) {
                  shipmentValues.partSuffix = "P";
                }
              }
              else if (shipmentValues.loadedShipmentInfoId == null && shipmentValues.loadedUld) {
                let loadedArr = shipmentValues.loadedUld.split("/");
                if (loadedArr.length > 0) {
                  shipmentValues.uldKey = loadedArr[0];
                  shipmentValues.partSuffix = loadedArr[loadedArr.length - 1];
                }
              }
            }
          });
        });
      });
      if (errorMessage) {
        this.showErrorMessage(errorMessage);
        return;
      }

      this.transhipmentService.unloadShipmentToFlights(requestLoadShipment).subscribe(response => {
        this.unloadflag = true;
        if (!this.showResponseErrorMessages(response)) {
          //this.uldUpdateWindow.close();
          this.initialise();
          this.showSuccessStatus('g.completed.successfully');
        }
      }, error => {
        this.unloadflag = true;
        this.showErrorStatus(error);
      });
    } else {
      this.showErrorStatus('export.select.loaded.shipment');
    }
  }

  shipmentByfinalized() {
    this.setData();
    this.tempformData.sta = null;
    this.tempformData.eta = null;
    let requestLoadShipment = new TranshipmentWorkingListModel();
    requestLoadShipment = this.tempformData;
    const selectedShipmentList: any = [];
    this.inboundTransshipmentWorkingListForm.getRawValue().flightList.forEach(element => {
      element.uldInformationList.forEach(element1 => {
        element1.shipmentList.forEach(element2 => {
          if (element2.select) {
            selectedShipmentList.push(element2);
          }
        })
      })
    })
    if (selectedShipmentList.length == 0) {
      this.showErrorStatus('export.select.unfinalized.shipments.to.finalize');
      return;
    } else {
      this.transhipmentService.shipmentByfinalized(requestLoadShipment).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          //this.uldUpdateWindow.close();
          this.initialise();
          this.showSuccessStatus('g.completed.successfully');
          if (!this.printerName['value']) {
            this.showErrorStatus('export.auto.print.not.done.select.printer');
            return;
          } else {
            this.onPrintAwb();
          }
        }
      }, error => {
        this.showErrorStatus(error);
      });
    }
  }

  loadshipmentToFlight() {
    this.uldForm.validate();
    let isInvalid = false;
    (<NgcFormArray>this.uldForm.controls['flightList']).controls.forEach((flight) => {
      isInvalid = flight.invalid;
    });

    if (isInvalid) {
      this.showErrorMessage("expaccpt.fill.all.mandatory.details");
      return;
    }
    let uldlist: any[] = [];
    let uldlstconcat: string = '';
    let requestLoadShipment = new TranshipmentWorkingListModel();
    requestLoadShipment = this.uldForm.getRawValue();
    requestLoadShipment.ackInfo = this.ackInfo;
    requestLoadShipment.flightList.forEach(element => {
      element.uldInformationList.forEach(uld => {
        uld.sqCarrier = element.sqCarrier;
      });
    });
    this.transhipmentService.loadShipmentToFlights(requestLoadShipment).subscribe(response => {
      if (response.messageList && response.messageList[0].referenceId == "Rule Engine" &&
        (response.messageList[0].type == 'W' || response.messageList[0].type == 'N')) {
        this.showConfirmMessage(response.messageList[0].code).then(fulfilled => {
          this.ackInfo = true;
          this.loadshipmentToFlight();
        }
        ).catch(reason => {
        });
      }
      else if (!this.showResponseErrorMessages(response)) {
        this.uldUpdateWindow.close();
        this.initialise();
        this.ackInfo = false;
        this.showSuccessStatus('g.completed.successfully');
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  unloadShipment() {
    const selectedShipmentList = this.inboundTransshipmentWorkingListForm.getRawValue()
      .shipmentList.filter((element) => element.select == true);
    let selectedULDFlight = this.checkEventData.getRawValue();
    if ((selectedShipmentList.length > 1 && selectedULDFlight.length == 0)
      || selectedShipmentList.length == 0 || selectedULDFlight.length > 1) {
      this.showErrorStatus('export.select.only.one.uld.with.shipment');
    } else if ([new Set(selectedShipmentList.map(shipment => shipment.UldKey))].length > 1) {
      this.showErrorStatus('export.select.shipments.one.uld');
    } else {
      this.callUnload(selectedULDFlight, selectedShipmentList);
    }
  }

  callUnload(selectedULDFlight, selectedShipmentList) {
    const unloadRequest = {};
    if (selectedShipmentList.length == 1) {
      unloadRequest['flightKey'] = selectedShipmentList[0]['flightKey'];
      unloadRequest['flightOriginDate'] = selectedShipmentList[0]['date'];
      unloadRequest['shipmentNumber'] = selectedShipmentList[0]['shipmentNumber'];
    } else {
      unloadRequest['flightKey'] = selectedULDFlight[0].flight;
      unloadRequest['flightOriginDate'] = selectedShipmentList.filter((value) => {
        return value.flightKey === selectedULDFlight[0].flight;
      })[0]['date'];
      unloadRequest['uldNumber'] = selectedULDFlight[0].key;
      unloadRequest['shipmentNumbers'] = selectedShipmentList.map(shipment => shipment.shipmentNumber);
    }
    this.navigateTo(this.router, '/export/buildup/unloadshipmentDesktop', unloadRequest);
  }

  navigateToPreviousPage() {
    this.navigate('/export/transhipment/transshipment-monitoring-handling', this.previousPageData);
  }

  finalizeTransshipment() {
    const requestForFinalize = new FinalizeAndUnfinalizeTranshipmentRequest();
    requestForFinalize.flightId = this.previousPageData.item;
    this.transhipmentService.finalizeTransshipment(requestForFinalize).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.initialise();
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  unfinalizeTransshipment() {
    const requestForUnfinalize = new FinalizeAndUnfinalizeTranshipmentRequest();
    requestForUnfinalize.flightId = this.previousPageData.item;
    this.transhipmentService.unfinalizeTransshipment(requestForUnfinalize).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.initialise();
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  public cellsCheckListStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    const cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.transferType === 'ST') {
      cellsStyle.data = ' ';
      cellsStyle.allowEdit = false;
    } else {
      cellsStyle.allowEdit = true;
    }
    return cellsStyle;
  }


  onBulkPiecesChange(index, bulkIndex, inventoryIndex) {
    const inventory = (<NgcFormArray>this.uldForm
      .get(['flightList', index, 'bulkShipmentList', bulkIndex, 'inventoryList', inventoryIndex]));
    inventory.get('moveWeight').setValue(inventory.get('movePiecs').value * (inventory.get('locationWeight').value / inventory.get('locationPiecs').value));
  }
  onPiecesChange(index, uldIndex, shipmentIndex, inventoryIndex) {
    const inventory = (<NgcFormArray>this.uldForm
      .get(['flightList', index, 'uldInformationList', uldIndex, 'shipmentList', shipmentIndex, 'inventoryList', inventoryIndex]));
    inventory.get('moveWeight').setValue(inventory.get('movePiecs').value * (inventory.get('locationWeight').value / inventory.get('locationPiecs').value));
  }

  onChangeUldToBulk(index, uldIndex, uldItem, uldListName) {
    const uld = (<NgcFormArray>this.uldForm
      .get(['flightList', index, 'uldInformationList', uldIndex]));

    if (uld.get("uldKey").value == "" || uld.get("uldKey").value == null) {
      uld.get('weightUld').setValue(0.0);
      uld.get('contourCode').setValue("");
    }
    else {
      this.patchUldDetails(index, uldIndex, uldItem, uldListName);
    }
  }
  onChangeBulkToULD(index, uldIndex, uldItem, uldList) {
    const uld = (<NgcFormArray>this.uldForm
      .get(['flightList', index, 'bulkShipmentList', uldIndex]));

    if (uld.get("uldKey").value != "" && uld.get("uldKey").value != null) {
      uld.get('weightUld').setValue(0.0);
      this.patchUldDetails(index, uldIndex, uldItem, uldList);
    } else {
      uld.get('contourCode').setValue("");
    }
  }

  printAWB() {
    this.showSuccessStatus("export.request.to.print.successfully");
    this.windowPrinter.hide();
    if (this.popupPrinterForm.get("printerdropdown").value == null) {
      this.showErrorStatus("expaccpt.select.printer.and.proceed");
    }
    else {
      this.awbPrintRequestList.printerName = this.popupPrinterForm.get("printerdropdown").value;

      this.importService.printMultiAWBBarcode(this.awbPrintRequestList).subscribe(data => {
        this.refreshFormMessages(data);
        if (data.messageList === null) {
          this.showSuccessStatus('g.completed.successfully');
        }
      });
    }
  }

  printReport() {
    this.reportParameters.loggedInUser = this.getUserProfile().userLoginCode;
    this.reportParameters.flightKey = this.inboundTransshipmentWorkingListForm.get('flightKey').value;
    this.reportParameters.flightDate = this.inboundTransshipmentWorkingListForm.get('date').value;
    //this.reportParameters.transferType = this.inboundTransshipmentWorkingListForm.get('transferType').value;

    if (NgcUtility.hasFeatureAccess("Transhipment.ThroughService.FlightsWithoutConnectingPair")) {
      this.inboundReportWindow1.open();
    }
    else {
      this.inboundReportWindow.open();
    }



  }





  public onLinkClick(event) {

    this.record = event.getRawValue();
    if (this.record.loadedUld != null) {
      this.showloadedUldForm.get('showloadedUldP').patchValue(this.record.loadedUld);
      this.showloadedUld.open();
    }


  }




  //public onPrintAwb() {
  //  this.setData();
  //  this.tempformData.sta = null;
  //  this.tempformData.eta = null;
  //   this.awbSelectedList = [];
  //   this.awbPrintRequestList = new AwbPrintRequestList();
  //   this.awbPrintRequestList.awbNumbers = new Array<string>();
  //   for (let i = 0; i < this.tempformData.shipmentList.length; i++) {
  //    this.awbPrintRequestList.awbNumbers.push(this.tempformData.shipmentList[i].shipmentNumber);
  //  }
  //   this.windowPrinter.open();
  // }

  public onPrintAwb() {
    this.setData();
    let awbList: AwbPrintRequestList[] = [];
    let awb: AwbPrintRequestList = null;
    // const selectedShipmentList = this.inboundTransshipmentWorkingListForm.getRawValue()
    //   .shipmentList.filter((element) => element.select == true);
    if (this.tempformData.shipmentList.length > 0) {
      this.tempformData.shipmentList.forEach(element => {
        awb = new AwbPrintRequestList();
        awb.awbNumber = element.shipmentNumber;
        awb.flightOffPoint = element.origin;
        awb.destination = element.destination;
        awb.carrierCode = element.carrierCode;
        awb.shipmentId = element.shipmentId;
        awb.printerName = this.printerName['value'];
        awbList.push(awb);
      });
    }
    if (awbList.length > 0) {
      this.importService.printMultiAWBBarcode(awbList).subscribe(data => {
        this.refreshFormMessages(data);
        if (data.messageList === null) {
          this.initialise();
          this.showSuccessStatus('g.completed.successfully');
        }
      });
    } else {
      this.showInfoStatus("export.select.record")
    }
  }

  sendAdvice() {

    const request = new SendAdvice();
    request.flightId = this.previousPageData.item;
    request.flightSegmentId = this.inboundTransshipmentWorkingListForm.get('inboundFlightSegmentId').value;
    request.airport = this.inboundTransshipmentWorkingListForm.get('airport').value;
    request.flightKey = this.inboundTransshipmentWorkingListForm.get('flightKey').value;
    request.date = this.inboundTransshipmentWorkingListForm.get('date').value;
    let shpLst = this.inboundTransshipmentWorkingListForm.getRawValue();
    const selectedShipmentList: any = [];
    const existingAdviceShipments: any = [];

    shpLst.flightList.forEach(element => {
      element.uldInformationList.forEach(element1 => {
        element1.shipmentList.forEach(element2 => {
          if (element2.select) {
            if (element2.transTTWAConnectingFlightShipmentId) {
              existingAdviceShipments.push(element2.shipmentNumber);
            }
            element2.flightId = element.flightId
            element2.flightSegmentId = element.flightSegmentId;
            element2.flightKey = element.flightKey;
            element2.dateSTA = shpLst.standardEstimatedDateTime;
            if (element1.uldKey) {
              element2.uldKey = element1.uldKey;
              element2.weightUld = element1.weightUld;
            }
            selectedShipmentList.push(element2);
          }
        })
      })
    });

    if (existingAdviceShipments.length > 0) {
      this.showErrorStatus(NgcUtility.translateMessage("export.advice.exists", [existingAdviceShipments.toString()]));
      return;
    }


    request.shipmentList = selectedShipmentList;


    if (request.shipmentList.length > 0) {
      this.transhipmentService.sendAdvice(request).subscribe(data => {
        data.data;
        this.refreshFormMessages(data);
        if (data.messageList === null) {
          this.showSuccessStatus('g.completed.successfully');
        }
      })
    } else {
      this.showErrorMessage('export.select.shipments.send.advice');
    }

  }

  innerCheckBoxClick(item) {
  }

  onSelectCheckBox(event, index, sindex) {
    // this.checkEventData.addValue([{ 'key': temp[0], 'flight': temp[1], 'shipment': null }]);
    let i = 0;
    for (const eachRow of (<NgcFormArray>this.inboundTransshipmentWorkingListForm.get(['flightList', index, 'uldInformationList', sindex, 'shipmentList'])).getRawValue()) {
      if (event && this.inboundTransshipmentWorkingListForm.get(['flightList', index, 'uldInformationList', sindex, 'shipmentList', i, 'throughServiceShipment']).value) {
        this.inboundTransshipmentWorkingListForm.get(['flightList', index, 'uldInformationList', sindex, 'shipmentList', i, 'select']).setValue(true);
      } else {
        this.inboundTransshipmentWorkingListForm.get(['flightList', index, 'uldInformationList', sindex, 'shipmentList', i, 'select']).setValue(false);
      }
      i++;
    }
  }

  patchUldDetails(index, uldIndex, uldItem, uldListName) {
    let data;
    if (uldItem.uldKey) {
      this.transhipmentService.getUldDetails(uldItem).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          data = response.data;
          this.uldForm.get(['flightList', index, uldListName, uldIndex, 'contourCode']).patchValue(data.contourCode);
        }
      }, error => {
        this.showErrorStatus(error);
      });
    }
  }


}
