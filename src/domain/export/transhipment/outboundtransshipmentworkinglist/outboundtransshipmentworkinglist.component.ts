import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, ReactiveModel, PageConfiguration, NgcUtility, NgcReportComponent, NgcWindowComponent, NgcPrinterComponent } from 'ngc-framework';
import { TranshipmentWorkingListModel, GetOutgoingTransshipmentFlightsRequest } from '../transhipment.sharedmodel.ts';
import { ActivatedRoute } from '@angular/router';
import { TranshipmentService } from '../transhipment.service';
import { AwbPrintRequestList } from '../../../awbManagement/awbManagement.shared';
import { ImportService } from '../../../import/import.service';
import { SendAdvice } from '../../export.sharedmodel';

@Component({
  selector: 'app-outboundtransshipmentworkinglist',
  templateUrl: './outboundtransshipmentworkinglist.component.html',
  styleUrls: ['./outboundtransshipmentworkinglist.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,

})
export class OutboundtransshipmentworkinglistComponent extends NgcPage {

  record: any;
  ackInfo = false;
  isST = false;
  uldSelectCheckBox = false;
  tempformData: any;
  checkEventData: NgcFormArray = new NgcFormArray([]);
  flightPartSuffixDropdown: any;
  hasReadPermission: boolean = false;

  @ReactiveModel(TranshipmentWorkingListModel)
  public outboundTransshipmentWorkingListForm: NgcFormGroup;
  @ReactiveModel(TranshipmentWorkingListModel)
  uldForm: NgcFormGroup = new NgcFormGroup({
    flightList: new NgcFormArray([new NgcFormGroup({
      flightKey: new NgcFormControl(),
      airport: new NgcFormControl(),
      standardEstimatedDateTime: new NgcFormControl(),
      dls: new NgcFormControl(),
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
  });
  @ViewChild('uldUpdateWindow') uldUpdateWindow: NgcWindowComponent;
  @ViewChild('windowPrinter') windowPrinter: NgcWindowComponent;
  @ViewChild('showloadedUld') showloadedUld: NgcWindowComponent;
  popupPrinterForm: NgcFormGroup = new NgcFormGroup({
    printerdropdown: new NgcFormControl(),
  });

  showloadedUldForm: NgcFormGroup = new NgcFormGroup({
    showloadedUldP: new NgcFormControl(),
  });

  public formData: any;
  public forwardedData: any;
  flightId: any;
  reportParameters: any = new Object();

  flightDetails: any;
  @ViewChild('outboundReportWindow') outboundReportWindow: NgcReportComponent;
  @ViewChild('outboundReportWindow1') outboundReportWindow1: NgcReportComponent;
  @ViewChild('printerName') printerName: NgcPrinterComponent
  awbPrintRequestList: any;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private transhipmentService: TranshipmentService,
    private importService: ImportService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.initialise();
  }
  initialise() {
    this.hasReadPermission = NgcUtility.hasReadPermission('TRAN_HAND_MONITORING');
    this.forwardedData = this.getNavigateData(this.activatedRoute);

    const request = new GetOutgoingTransshipmentFlightsRequest();
    request.flightId = this.forwardedData.item;
    request.transferTypeList = this.forwardedData.transferType;
    this.flightId = this.forwardedData.item;

    this.transhipmentService.getOutgoingFlightListDetails(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.outboundTransshipmentWorkingListForm.patchValue(response.data);
        this.formData = response.data;
        this.flightDetails = this.outboundTransshipmentWorkingListForm.get("flightKey").value
          + " - " + (NgcUtility.getDateAsString(this.outboundTransshipmentWorkingListForm.get("standardEstimatedDateTime").value)).toLocaleUpperCase()
          + " " + NgcUtility.getTimeAsString(this.outboundTransshipmentWorkingListForm.get("standardEstimatedDateTime").value)
          + " - " + this.outboundTransshipmentWorkingListForm.get("airport").value;
        //this.setShipmentListData();
        //   this.navigateTo(this.router, '/export/transhipment/outbound-transshipment-workinglist', response.data);
        // this.transshipmentHandlingSummaryForm.patchValue(response.data);
      }
      this.setShipmentListData();
    }, error => {
      this.showErrorStatus(error);
    });


    //  this.formData = this.getNavigateData(this.activatedRoute);
    //   this.outboundTransshipmentWorkingListForm.patchValue(this.formData);


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
    this.outboundTransshipmentWorkingListForm.get('shipmentList').patchValue(list);

    let index = 0;
    list.forEach(element => {

      if (!element.transferType
        || element.transferType === 'ST'
        || element.transferType === 'TRANSHIPMENT'
        || element.transferType === 'TRANSIT'
        || element.transferType === 'QT'
        || element.finalised === 'F') {
        this.outboundTransshipmentWorkingListForm.get(['shipmentList', index, 'select']).disable();

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


  protected mainGroupsRenderer = (value: string | number, rowData: any, level: any): string => {
    if (level === 0) {
      let diffInMs: number = Date.parse(rowData.data.timeDifference) - Date.parse('1900-01-01T00:00:00.0');
      var diffHrs = Math.floor(diffInMs / 3600000); // hours
      var diffMins = Math.round((diffInMs % 3600000) / 60000); // minutes
      const flightValue = rowData.data.flightKey + ' - ' + NgcUtility.getDateAsString(rowData.data.date) + ' - ' + rowData.data.destination + ' - ' + NgcUtility.getTimeAsString(rowData.data.date) + ' - ' + ((diffHrs != null) ? diffHrs + 'Hr' : '') + '' + ((diffMins != null) ? ' ' + diffMins + 'min' : '') + '';


      return `<b>${flightValue}</b>`
    }
    if (level === 1) {

      if (rowData.data.uldKey !== 'BULK') {
        const rowValue = rowData.data.uldKey + ((rowData.data.contourCode != null) ? ' / ' + rowData.data.contourCode : '') + ((rowData.data.weightUld != null) ? ' / ' + rowData.data.weightUld : '') + ' ' + rowData.data.weightUnitCode + ((rowData.data.SHC != null) ? ' / ' + rowData.data.SHC : '') + ' ' + ' - ' + (rowData.data.assigned ? 'ASSIGNED' : 'NOT ASSIGNED');

        if (rowData.data.intact != 1) {
          return `<b>${rowValue}</b>`
        }
        else {
          return `<div style = "display: inline-block;">
<b>${rowValue}</b>
<div style = "display: inline-block;text-align:left;background: #ffbf00;">
<b>IMP</b>
</div>
</div>`
        }
      } else {
        const rowValue = rowData.data.uldKey;
        return `<b>${rowValue}</b>`
      }
    }

  };


  navigateToPreviousPage() {
    this.navigate('/export/transhipment/transshipment-monitoring-handling', this.forwardedData);
    // this.navigateBack(this.forwardedData);
  }

  printReport() {
    this.reportParameters.loggedInUser = this.getUserProfile().userLoginCode;
    this.reportParameters.flightKey = this.outboundTransshipmentWorkingListForm.get('flightKey').value;
    this.reportParameters.flightDate = this.outboundTransshipmentWorkingListForm.get('date').value;
    //this.reportParameters.transferType = this.outboundTransshipmentWorkingListForm.get('transferType').value;

    if (NgcUtility.hasFeatureAccess("Transhipment.ThroughService.FlightsWithoutConnectingPair")) {
      this.outboundReportWindow1.open();
    }
    else {
      this.outboundReportWindow.open();
    }

  }

  onSelectCheckBox(event, index, sindex) {
    // this.checkEventData.addValue([{ 'key': temp[0], 'flight': temp[1], 'shipment': null }]);
    let i = 0;
    for (const eachRow of (<NgcFormArray>this.outboundTransshipmentWorkingListForm.get(['flightList', index, 'uldInformationList', sindex, 'shipmentList'])).getRawValue()) {
      if (event && this.outboundTransshipmentWorkingListForm.get(['flightList', index, 'uldInformationList', sindex, 'shipmentList', i, 'throughServiceShipment']).value) {
        this.outboundTransshipmentWorkingListForm.get(['flightList', index, 'uldInformationList', sindex, 'shipmentList', i, 'select']).setValue(true);
      } else {
        this.outboundTransshipmentWorkingListForm.get(['flightList', index, 'uldInformationList', sindex, 'shipmentList', i, 'select']).setValue(false);
      }
      i++;
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
    requestLoadShipment = this.swapFlightDetails(requestLoadShipment);
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
  onBulkPiecesChange(index, bulkIndex, inventoryIndex) {
    const inventory = (<NgcFormArray>this.uldForm
      .get(['flightList', index, 'bulkShipmentList', bulkIndex, 'inventoryList', inventoryIndex]));
    inventory.get('moveWeight').setValue(inventory.get('movePiecs').value * (inventory.get('locationWeight').value / inventory.get('locationPiecs').value));
  }

  setData() {
    this.tempformData = this.outboundTransshipmentWorkingListForm.getRawValue();
    const tempFlightList: any = [];
    let selectedULDFlight = this.checkEventData.getRawValue();
    const selectedShipmentList: any = [];
    this.tempformData.flightList.forEach(element => {
      const inboundFlightSegmentId = element.inboundFlightSegmentId;
      const inboundFlightId = element.inboundFlightId;
      const inboundFlightKey = element.flightKey

      element.uldInformationList.forEach(element1 => {
        element1.shipmentList.forEach(element2 => {
          if (element2.select) {
            element2.flightId = element.flightId
            element2.flightSegmentId = element.flightSegmentId;
            element2.flightKey = element.flightKey;
            element2.dateSTA = this.tempformData.standardEstimatedDateTime;
            element2.inboundFlightSegmentId = inboundFlightSegmentId;
            element2.inboundFlightId = inboundFlightId;
            element2.inboundFlightKey = inboundFlightKey;
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
    requestLoadShipment.sta = null;
    requestLoadShipment.std = null;
    requestLoadShipment = this.swapFlightDetails(requestLoadShipment);
    this.transhipmentService.loadShipmentTranshipment(requestLoadShipment).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        response.data.flightList.forEach(fltElement => {
          this.flightPartSuffixDropdown = this.createSourceParameter(fltElement.flightId.toString());
          fltElement.uldInformationList.forEach(uldElement => {
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
  swapFlightDetails(obj) {
    const flightSegmentId = obj.flightSegmentId;
    obj.outbound = true;
    obj.flightList.forEach(flightElm => {
      //flightElm.flightSegmentId = flightSegmentId;
      const inboundFlightSegmentId = flightElm.inboundFlightSegmentId;
      const inboundFlightId = flightElm.inboundFlightId;
      const inboundFlightKey = flightElm.flightKey;
      flightElm.uldInformationList.forEach(uldInformationElm => {
        uldInformationElm.shipmentList.forEach(shipmentElm => {
          if (shipmentElm.select) {
            shipmentElm.inboundFlightSegmentId = inboundFlightSegmentId;
            shipmentElm.inboundFlightId = inboundFlightId;
            shipmentElm.inboundFlightKey = inboundFlightKey;
          }
        });
      });
    });
    return obj;
  }

  unloadflag = false;
  unloadshipmentToFlight() {
    this.unloadflag = true;
    this.setData();
    this.tempformData.sta = null;
    this.tempformData.eta = null;
    let requestLoadShipment = new TranshipmentWorkingListModel();
    requestLoadShipment = this.tempformData;
    requestLoadShipment = this.swapFlightDetails(requestLoadShipment);
    requestLoadShipment.sta = null;
    requestLoadShipment.std = null;
    const selectedShipmentList = this.tempformData.
      shipmentList.
      filter((element) => element.select == true
        && element.loadedShipmentInfoId == null);

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
    requestLoadShipment.sta = null;
    requestLoadShipment.std = null;
    requestLoadShipment = this.swapFlightDetails(requestLoadShipment);
    this.outboundTransshipmentWorkingListForm.getRawValue().flightList.forEach(element => {
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

  public onPrintAwb() {
    let awbList: AwbPrintRequestList[] = [];
    let awb: AwbPrintRequestList = null;
    this.setData();
    const selectedShipmentList = this.tempformData.shipmentList
      .filter((element) => element.select == true);
    if (selectedShipmentList.length > 0) {
      selectedShipmentList.forEach(element => {
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
    request.flightId = this.forwardedData.item;
    // request.flightSegmentId = this.outboundTransshipmentWorkingListForm.get('inboundFlightSegmentId').value;
    // request.airport = this.outboundTransshipmentWorkingListForm.get('airport').value;
    // request.flightKey = this.outboundTransshipmentWorkingListForm.get('flightKey').value;
    // request.date = this.outboundTransshipmentWorkingListForm.get('date').value;
    request.flightSegmentId = this.outboundTransshipmentWorkingListForm.get('flightSegmentId').value;
    request.airport = this.outboundTransshipmentWorkingListForm.get('airport').value;
    request.flightKey = this.outboundTransshipmentWorkingListForm.get('flightKey').value;
    request.date = this.outboundTransshipmentWorkingListForm.get('date').value;
    request.outbound = true;
    let shpLst = this.outboundTransshipmentWorkingListForm.getRawValue();
    const selectedShipmentList: any = [];
    const existingAdviceShipments: any = [];

    shpLst.flightList.forEach(element => {
      element.uldInformationList.forEach(element1 => {
        element1.shipmentList.forEach(element2 => {
          if (element2.select) {
            if (element2.transTTWAConnectingFlightShipmentId) {
              existingAdviceShipments.push(element2.shipmentNumber);
            }
            // element2.flightId = element.flightId
            // element2.flightSegmentId = element.flightSegmentId;
            // element2.flightKey = element.flightKey;
            // element2.dateSTA = shpLst.standardEstimatedDateTime;
            element2.flightId = element.inboundFlightId;
            element2.flightSegmentId = element.inboundFlightSegmentId;
            element2.airport = element.airport;
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

  onChangeBulkToULD(index, uldIndex, uldItem, uldListName) {
    const uld = (<NgcFormArray>this.uldForm
      .get(['flightList', index, 'bulkShipmentList', uldIndex]));

    if (uld.get("uldKey").value != "" || uld.get("uldKey").value != null) {
      uld.get('weightUld').setValue(0.0);
      this.patchUldDetails(index, uldIndex, uldItem, uldListName);
    }
    else {
      uld.get('contourCode').setValue("");
    }
  }

  public onLinkClick(event) {

    this.record = event.getRawValue();
    if (this.record.loadedUld != null) {
      this.showloadedUldForm.get('showloadedUldP').patchValue(this.record.loadedUld);
      this.showloadedUld.open();
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
