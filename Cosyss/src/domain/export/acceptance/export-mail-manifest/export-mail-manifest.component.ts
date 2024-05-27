import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcUtility, NgcReportComponent, NgcFormArray, NgcWindowComponent, PageConfiguration } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { AcceptanceService } from '../acceptance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
import { element } from 'protractor';

@Component({
  selector: 'app-export-mail-manifest',
  templateUrl: './export-mail-manifest.component.html',
  styleUrls: ['./export-mail-manifest.component.css']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class ExportMailManifestComponent extends NgcPage {
  resp: any;
  flightKeyforDropdown: any;
  segmentId: any;
  routing: any;
  showTable: boolean = false;
  newArray: any = [];
  arrayFlight: any = [];
  filghtKeyDisplay: any;
  flightSegmentDisplay: any;
  nextDestinationDisplay: any;
  finalDestinationDisplay: any;
  reportParameters: any;
  arr: any = [];
  wholeUld: any = 0;
  manifestCompleteFlag: boolean = false;
  manifestReopenFlag: boolean = false;
  disableDelete: boolean = true;
  finalTotalPieces = 0;
  finalTotalWeight = 0;

  private exportMailManifestForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    segment: new NgcFormControl(),
    nextDestination: new NgcFormControl(),
    finalDestination: new NgcFormControl(),
    displaySegment: new NgcFormControl(),
    timeSTD: new NgcFormControl(),
    segmentDisplay: new NgcFormControl(),
    flightCompleteDisplay: new NgcFormControl(),
    dlsCompletedDisplay: new NgcFormControl(),
    manifestCompleteDisplay: new NgcFormControl(),
    delete: new NgcFormControl(),
    manifestCompleteButton: new NgcFormControl('5.Manifest Complete'),
    uldTrolleyArray: new NgcFormArray([
      new NgcFormGroup({
        uldTrolley: new NgcFormControl(),
        locationType: new NgcFormControl(),
        fightKey: new NgcFormControl(),
        fightId: new NgcFormControl(),
        totalPieces: new NgcFormControl(),
        manifestedWeight: new NgcFormControl(),
        dateSTD: new NgcFormControl(),
        manifestId: new NgcFormControl(),
        manifestCompleted: new NgcFormControl(),
        dlsCompleted: new NgcFormControl(),
        flightCompleted: new NgcFormControl(),
        nestedId: new NgcFormControl(),
        flightBoardPoint: new NgcFormControl(),
        flightOffPoint: new NgcFormControl(),
        mailBagInfo: new NgcFormArray([
          new NgcFormGroup({
            uldWholeDeleteFlag: new NgcFormControl(),
            dispatchNumber: new NgcFormControl(),
            dispatchNumberDisplay: new NgcFormControl(),
            mailBagNumber: new NgcFormControl(),
            pieces: new NgcFormControl(),
            manifestedWeight: new NgcFormControl(),
            mailType: new NgcFormControl(),
            origin: new NgcFormControl(),
            destination: new NgcFormControl(),
            nextDestination: new NgcFormControl(),
            agentCode: new NgcFormControl(),
            rcarStatus: new NgcFormControl(),
            remarks: new NgcFormControl(),
            storeLocation: new NgcFormControl(),
            warehouseLocation: new NgcFormControl(),
            houseNumber: new NgcFormControl(),
          })
        ])
      })
    ]),
    uldTrolley: new NgcFormControl(),
    nestedId: new NgcFormControl(),
    storeLocation: new NgcFormControl(),
    warehouseLocation: new NgcFormControl(),
    UpdateLocationArray: new NgcFormArray([]),
  });


  @ViewChild('showPopUpWindowUpdateLocation') showPopUpWindowUpdateLocation: NgcWindowComponent;
  @ViewChild('showPopUpWindowStoreLocation') showPopUpWindowStoreLocation: NgcWindowComponent;
  @ViewChild('showPopUpWindowNestedInformation') showPopUpWindowNestedInformation: NgcWindowComponent;
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('reportWindowCN46') reportWindowCN46: NgcReportComponent;
  @ViewChild('reportDetailWindow') reportDetailWindow: NgcReportComponent;
  carrierCode: any;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private acceptanceService: AcceptanceService, private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {

  }

  onAddBUPMailbag() {
    this.showPopUpWindowUpdateLocation.open();
  }

  onFlightComplete() {
    let allMailBags = [];
    this.resp.forEach(obj => {
      if (allMailBags.length == 0) {
        allMailBags = obj.allMailBag
      } else {
        allMailBags.concat(obj.allMailBag);
      }
    });
    this.arrayFlight = [];
    this.arrayFlight = (<NgcFormArray>this.exportMailManifestForm.controls["uldTrolleyArray"]).getRawValue();
    this.arrayFlight[0].allMailBag = allMailBags;
    if (this.arrayFlight.length != null) {
      this.acceptanceService.exportFlightComplete(this.arrayFlight[0]).subscribe(data => {
        if (data.data.messageList.length == 0) {
          this.onSearch();
          this.showSuccessStatus('export.flight.completed');
        }
        else {
          this.showResponseErrorMessages(data)
        }
      })
    }
  }

  onManifestComplete() {
    let allMailBags = [];
    this.resp.forEach(obj => {
      if (allMailBags.length == 0) {
        allMailBags = obj.allMailBag
      } else {
        allMailBags.concat(obj.allMailBag);
      }
    });
    this.arrayFlight = [];
    this.arrayFlight = (<NgcFormArray>this.exportMailManifestForm.controls["uldTrolleyArray"]).getRawValue();
    this.arrayFlight[0].allMailBag = allMailBags;
    if (this.arrayFlight.length != null) {
      this.acceptanceService.exportManifestComplete(this.arrayFlight).subscribe(data => {
        if (data.data && data.data.messageList.length == 0) {
          this.onSearch();
          this.showSuccessStatus('expaccpt.manifest.completed');
        }
        else {
          this.showResponseErrorMessages(data)
        }
      }, error => {
        this.showErrorMessage(error);
      })
    }
  }
  onAddNestedInformation() {
    this.newArray = [];
    let arrayNested: any = (<NgcFormArray>this.exportMailManifestForm.controls["uldTrolleyArray"]).getRawValue();
    for (let elements of arrayNested) {
      if (elements.check) {
        this.newArray.push(elements);
      }
    }
    if (!this.newArray.length) {
      this.showErrorStatus("expaccpt.select.row.first");
      return;
    }
    if (this.newArray.length > 1) {
      this.showErrorStatus("expaccpt.select.one.row.only");
      return;
    }
    else {
      this.exportMailManifestForm.get('nestedId').patchValue(this.newArray[0].nestedId);
      this.exportMailManifestForm.get('uldTrolley').patchValue(this.newArray[0].uldTrolley);
      this.showPopUpWindowNestedInformation.open();
    }
  }
  onDelete(index, childIndex) {
    if ((this.exportMailManifestForm.get('manifestCompleteDisplay').value == "true") && (this.exportMailManifestForm.get('dlsCompletedDisplay').value == "true")) {
      this.showErrorStatus("expaccpt.mailbag.manifest.flight.completed");
      return;
    }
    else if (this.exportMailManifestForm.get('manifestCompleteDisplay').value == "true") {
      this.showErrorStatus("expaccpt.mailbag.manifest.completed");
      return;
    }
    else if (this.exportMailManifestForm.get('dlsCompletedDisplay').value == "true") {
      this.showErrorStatus("expaccpt.mailbag.dls.finalized");
      return;
    }
    else {
      if ((<NgcFormArray>this.exportMailManifestForm.get(['uldTrolleyArray', index, 'mailBagInfo'])).length == 1) {
        this.showErrorStatus('expaccpt.container.last.mailbag.validation');
        return;
      }
      (<NgcFormArray>this.exportMailManifestForm.get(['uldTrolleyArray', index, 'mailBagInfo'])).markAsDeletedAt(childIndex);
      this.showPopUpWindowStoreLocation.open();
    }
  }
  onClick(event) {
    let response = this.exportMailManifestForm.getRawValue();

    response.uldTrolleyArray.forEach(element => {
      element.uldWholeDeleteFlag = false;
      element.mailBagInfo.forEach(ele => {
        if (ele.flagCRUD == "D") {
          ele.storeLocation = this.exportMailManifestForm.get('storeLocation').value;
          ele.warehouseLocation = this.exportMailManifestForm.get('warehouseLocation').value;
          ele.mailBagNumber = ele.houseNumber;
        }
      });
    });


    this.wholeUld = 0;
    this.onDeleteRecord(response);
  }
  onDeleteWhole(event) {
    if ((this.exportMailManifestForm.get('manifestCompleteDisplay').value == "true") && (this.exportMailManifestForm.get('dlsCompletedDisplay').value == "true")) {
      this.showErrorStatus("expaccpt.mailbag.manifest.flight.completed");
      return;
    }
    else if (this.exportMailManifestForm.get('manifestCompleteDisplay').value == "true") {
      this.showErrorStatus("expaccpt.mailbag.manifest.completed");
      return;
    }
    else if (this.exportMailManifestForm.get('dlsCompletedDisplay').value == "true") {
      this.showErrorStatus("expaccpt.mailbag.dls.finalized");
      return;
    }
    else {
      let request: any;
      this.showConfirmMessage(
        'confirm.shipment.load'
      ).then(fulfilled => {
        (<NgcFormArray>this.exportMailManifestForm.get(['uldTrolleyArray'])).markAsDeletedAt(event);
        request = this.exportMailManifestForm.getRawValue();
        let response = request.uldTrolleyArray[event];

        response.mailBagInfo.forEach(ele => {
          ele.storeLocation = response.uldTrolley;
        });


        this.wholeUld = 1;
        this.onDeleteRecord(request);
      });
    }
  }
  onDeleteRecord(response) {
    let request = response.uldTrolleyArray;
    if (this.wholeUld === 1) {
      request.forEach(element => {
        element.carrierCode = this.carrierCode;
        element.uldWholeDeleteFlag = true;
      })
    } else {
      request.forEach(element => {
        element.carrierCode = this.carrierCode;
        element.uldWholeDeleteFlag = false;
      })
    }
    if ((this.exportMailManifestForm.get('storeLocation').value == null) && (this.exportMailManifestForm.get('warehouseLocation').value == null) && this.wholeUld == 0) {
      this.showErrorStatus("exp.buildup.unload.location.required");
    } else {
      this.acceptanceService.deleteRecord(request).subscribe(data => {
        if (data.messageList == null) {
          this.onSearch();
          this.showSuccessStatus('g.completed.successfully');
          this.exportMailManifestForm.get('storeLocation').patchValue(null);
          this.exportMailManifestForm.get('warehouseLocation').patchValue(null);
          this.showPopUpWindowStoreLocation.close();
        }
        else {
          this.showResponseErrorMessages(data)
        }
      })
    }
  }
  onExportServiceReport() {
    let array = new Array();
    let uldArray = new Array();
    let isChild: any;
    let dataToTransfer: any = (<NgcFormArray>this.exportMailManifestForm.get(['uldTrolleyArray'])).getRawValue();
    dataToTransfer.forEach(element => {

      element.mailBagInfo.forEach(child => {
        if (child.childCheckBox) {
          array.push(child);
          uldArray.push(element);
        }
      })

    })

    this.reportParameters = new Object();
    let dnNumber = array.map(element => element.dispatchNumber).join(",");

    let uldNumber = uldArray.map(element => element.uldTrolley).join(",");
    this.reportParameters.uldNumber = uldNumber;
    this.reportParameters.FltKey = this.exportMailManifestForm.get('flightKey').value;
    this.reportParameters.FltDate = this.exportMailManifestForm.get('flightDate').value;
    this.reportParameters.dispatchNumber = dnNumber;
    this.reportParameters.customerId = this.getUserProfile().userShortName;
    this.reportParameters.nextDestination = this.exportMailManifestForm.get('nextDestination').value;
    this.reportParameters.finalDestination = this.exportMailManifestForm.get('finalDestination').value;
    this.reportWindow.open();
  }
  onPrintCN46() {
    this.reportParameters = new Object();
    this.reportParameters.flightkey = this.exportMailManifestForm.get('flightKey').value;
    this.reportParameters.flightdate = this.exportMailManifestForm.get('flightDate').value;
    if (this.exportMailManifestForm.get('segment').value != null) {
      this.reportParameters.flightSegment = this.exportMailManifestForm.get('segment').value;
      this.reportParameters.flightSegment = parseInt(this.reportParameters.flightSegment);
      this.reportParameters.checkCondition = 1;
    }
    else {
      this.reportParameters.flightSegment = 0;
      this.reportParameters.checkCondition = 0;
    }
    this.reportWindowCN46.open();
  }
  onExportManifestDetail() {
    let dn: any = [];
    let arrayShipmentsDN: any = [];
    let i = 0;
    let arrayShipments: any = this.exportMailManifestForm.getRawValue();
    arrayShipments.uldTrolleyArray.forEach(element => {
      element.mailBagInfo.forEach(element => {
        arrayShipmentsDN[i] = element;
        i++;
      })
    })
    this.reportParameters = new Object();
    this.reportParameters.flightkey = this.exportMailManifestForm.get('flightKey').value;
    this.reportParameters.flightdate = this.exportMailManifestForm.get('flightDate').value;
    this.reportParameters.customerId = this.getUserProfile().userShortName;
    let a = arrayShipmentsDN.filter(element => element.childCheckBox).map(element => element.dispatchNumberDisplay).join(",");
    this.reportParameters.dn = a;
    this.reportParameters.nextDestination = this.exportMailManifestForm.get('nextDestination').value;
    this.reportParameters.finalDestination = this.exportMailManifestForm.get('finalDestination').value;

    this.reportDetailWindow.open();
  }

  //addNestedId updates nested id
  addNestedId() {
    this.newArray[0].nestedId = this.exportMailManifestForm.get('nestedId').value
    if (this.newArray[0].nestedId != null && this.newArray[0].nestedId != "") {
      this.acceptanceService.updateNestedIdMailManifest(this.newArray).subscribe(data => {
        if (data.data) {
          this.onSearch();
          this.showPopUpWindowNestedInformation.hide();
          this.showSuccessStatus('g.operation.successful');
        }
      })
    }
    else {
      this.showErrorStatus("export.insert.nested.id.to.update");
    }
  }

  //onBack method to return back to welcome page
  onBack(event) {
    this.navigateTo(this.router, "/", null);
  }

  onSelectDate() {
    this.flightKeyforDropdown = this.createSourceParameter(this.exportMailManifestForm.get('flightKey').value,
      this.exportMailManifestForm.get('flightDate').value);
  }

  getSegmentId(item) {
    this.segmentId = item.code;
    this.routing = item.desc;
  }

  onSearch() {
    this.disableDelete = true;
    const req = this.exportMailManifestForm.getRawValue();
    this.filghtKeyDisplay = this.exportMailManifestForm.get('flightKey').value;
    this.flightSegmentDisplay = this.exportMailManifestForm.get('segment').value;
    this.nextDestinationDisplay = this.exportMailManifestForm.get('nextDestination').value;
    this.finalDestinationDisplay = this.exportMailManifestForm.get('finalDestination').value;

    this.acceptanceService.fetchExportMailManifest(req).subscribe(res => {
      this.resp = res.data;
      this.finalTotalPieces = 0;
      this.finalTotalWeight = 0;
      if (!res.messageList) {
        if (this.resp && this.resp.length != 0) {

          this.carrierCode = this.resp[0].carrierCode;
          for (var element of this.resp) {
            element.check = false;
            let sum = 0;
            let weightSum = 0;


            if (element.mailBagInfo) {
              for (var ele of element.mailBagInfo) {
                if(ele.dispatchNumber != null){
                  ele.childCheckBox = false;
                  sum += ele.pieces;
                  weightSum += ele.manifestedWeight;
                  if (ele.dispatchNumber.toString().length < 4) {
                    if (ele.dispatchNumber.toString().length === 1) {
                      ele.dispatchNumberDisplay = "000" + ele.dispatchNumber
                    }
                    else if (ele.dispatchNumber.toString().length === 2) {
                      ele.dispatchNumberDisplay = "00" + ele.dispatchNumber
                    }
                    else if (ele.dispatchNumber.toString().length === 3) {
                      ele.dispatchNumberDisplay = "0" + ele.dispatchNumber
                    }
                  }
                  else {
                    ele.dispatchNumberDisplay = ele.dispatchNumber;
                  }
                  ele.mailType = ele.mailBagNumber.substring(13, 15);
                  ele.rsn = ele.mailBagNumber.substring(20, 23);
                }
              }
              element.totalPieces = sum;
              element.manifestedWeight = weightSum;
              this.finalTotalPieces += sum;
              this.finalTotalWeight += weightSum;
              this.finalTotalWeight = Number.parseFloat(NgcUtility.getDisplayWeight(this.finalTotalWeight));
            } else {
              element.totalPieces = sum;
              element.manifestedWeight = weightSum;
              this.finalTotalPieces += sum;
              this.finalTotalWeight += weightSum;
              this.finalTotalWeight = Number.parseFloat(NgcUtility.getDisplayWeight(this.finalTotalWeight));
            }



          }
          (<NgcFormArray>this.exportMailManifestForm.controls['uldTrolleyArray']).patchValue(this.resp);
          let temp = this.exportMailManifestForm.get(['uldTrolleyArray', 0, 'fullSegment']).value;
          let flightOff = this.exportMailManifestForm.get(['uldTrolleyArray', 0, 'flightOffPoint']).value;
          let flightBoard = '';
          if( NgcUtility.getTenantConfiguration()) {
            flightBoard = NgcUtility.getTenantConfiguration().airportCode;
          }
          let flightSeg = flightBoard + '-' + flightOff;
          let timeStd = this.exportMailManifestForm.get('flightDate').value;
          let currentTime = new Date();
          let diffInMs: number = Date.parse(currentTime.toString()) - Date.parse(timeStd);
          let diffInHours: number = diffInMs / 1000 / 60;
          let diffInMins: number = Math.floor(diffInHours);
          let diffInMints: any = diffInMins + ' MIN';
          let flightCompleteDisplayAt = this.exportMailManifestForm.get(['uldTrolleyArray', 0, 'flightCompleted']).value;
          let dlsCompletedDisplayAt = this.exportMailManifestForm.get(['uldTrolleyArray', 0, 'dlsCompleted']).value;
          let manifestCompleteDisplayAt = this.exportMailManifestForm.get(['uldTrolleyArray', 0, 'manifestCompleted']).value;
          if (manifestCompleteDisplayAt && manifestCompleteDisplayAt === 'true') {
            this.manifestCompleteFlag = false;
            this.manifestReopenFlag = true;
          } else {
            this.manifestReopenFlag = false;
            this.manifestCompleteFlag = true;
          }
          this.exportMailManifestForm.get('dlsCompletedDisplay').setValue(dlsCompletedDisplayAt);
          this.exportMailManifestForm.get('manifestCompleteDisplay').setValue(manifestCompleteDisplayAt);
          this.exportMailManifestForm.get('flightCompleteDisplay').setValue(flightCompleteDisplayAt);
          this.exportMailManifestForm.get('displaySegment').setValue(temp);
          if (this.exportMailManifestForm.get('segment').value != null) {
            this.exportMailManifestForm.get('segmentDisplay').setValue(flightSeg);
          }
          this.exportMailManifestForm.get('timeSTD').setValue(diffInMints);

          this.showTable = true;
          this.resetFormMessages();
        }
        else {
          this.showTable = false;
          let diffInMints: any = null;
          this.exportMailManifestForm.get('timeSTD').setValue(diffInMints);
          this.showInfoStatus("no.record");
        }


      } else {
        this.refreshFormMessages(res);
      }
    });

  }

  onTransferToCN46() {
    let dataToTransfer: any = (<NgcFormArray>this.exportMailManifestForm.get(['uldTrolleyArray'])).getRawValue();
    let selectedDataForTransfer = new Array();
    dataToTransfer.forEach(element => {
      if (element.check) {
        element.mailBagInfo.forEach(element1 => {
          selectedDataForTransfer.push(element1);
        });
      } else {
        element.mailBagInfo.forEach(element1 => {
          if (element1.childCheckBox) {
            selectedDataForTransfer.push(element1);
          }
        })
      }

    })
    if (selectedDataForTransfer.length < 1) {
      this.showErrorMessage("expaccpt.select.row");
      return;
    }
    this.acceptanceService.exportMailTransferToCN46(selectedDataForTransfer).subscribe(resp => {
      if (resp.data) {
        this.showSuccessStatus('g.operation.successful');
        let event = { flightKey: this.exportMailManifestForm.get('flightKey').value, flightDate: this.exportMailManifestForm.get('flightDate').value, segments: dataToTransfer[0].segment };
        this.navigateTo(this.router, '/awbmgmt/createcn46', event);
      }
    })
  }
  onSave() {
    let uppdateRemarks = [];
    let request = this.exportMailManifestForm.getRawValue();
    this.acceptanceService.updateRemarks(request.uldTrolleyArray).subscribe(resp => {
      if (resp.data) {
        this.showSuccessStatus('g.operation.successful');
        this.onSearch();
      }
    })
  }

  onselectMailBag(index, childIndex) {

    var mailbagCheck = this.exportMailManifestForm.get(['uldTrolleyArray', index, 'mailBagInfo', childIndex, 'childCheckBox']).value;
    let parentSelected = this.exportMailManifestForm.getRawValue().uldTrolleyArray;
    let count = 0;
    let countParent = 0;
    let parentCheckBox: any = (<NgcFormArray>this.exportMailManifestForm.get(['uldTrolleyArray'])).getRawValue();
    parentCheckBox.forEach(element => {
      if (element.check) {
        countParent = countParent + 1;
      }
    });

    // if (mailbagCheck && !parentSelected[index].check) {
    //   this.disableDelete = false;
    // }
    parentSelected[index].mailBagInfo.forEach(element1 => {
      if (element1.childCheckBox) {
        count = count + 1;
      }
    })


    if (parentSelected[index].mailBagInfo.length == count) {
      this.disableDelete = true;
      this.exportMailManifestForm.get(['uldTrolleyArray', index, 'check']).setValue(true);
      countParent = countParent + 1;
      return;
    }
    if (parentSelected[index].mailBagInfo.length != count && count != 0) {
      if (parentSelected[index].check) {
        this.exportMailManifestForm.get(['uldTrolleyArray', index, 'check']).setValue(false);
        countParent = countParent - 1;
      }
      if (countParent == 0) {
        this.disableDelete = false;
      }
      return;
    }
    if (!mailbagCheck && count > 0 && count < parentSelected[index].mailBagInfo.length && countParent == 0) {
      this.disableDelete = false;
    }

    if (countParent > 0 && !parentSelected[index].check) {
      this.disableDelete = true;
      return;
    }

  }

  onDeleteMailBags() {
    if ((this.exportMailManifestForm.get('manifestCompleteDisplay').value == "true") && (this.exportMailManifestForm.get('dlsCompletedDisplay').value == "true")) {
      this.showErrorStatus("expaccpt.mailbag.manifest.flight.completed");
      return;
    }
    else if (this.exportMailManifestForm.get('manifestCompleteDisplay').value == "true") {
      this.showErrorStatus("expaccpt.mailbag.manifest.completed");
      return;
    }
    else if (this.exportMailManifestForm.get('dlsCompletedDisplay').value == "true") {
      this.showErrorStatus("expaccpt.mailbag.dls.finalized");
      return;
    }
    else {
      let array = new Array();
      let childArray = [];
      let allmailbags = [];
      let dataToTransfer: any = (<NgcFormArray>this.exportMailManifestForm.get(['uldTrolleyArray'])).getRawValue();
      dataToTransfer.forEach(element => {
        if (element.check) {
          array.push(element);
        }
        element.mailBagInfo.forEach(child => {
          allmailbags.push(child);
          if (child.childCheckBox) {
            child.flagCRUD = 'D';
            childArray.push(child);
          }
        })

      });

      if (array.length) {
        this.showErrorStatus("expaccpt.mailbag.select.only.mailbags");
        return;
      }
      if (!childArray.length) {
        this.showErrorStatus("expaccpt.select.row.first");
        return;
      }
      if (allmailbags.length === childArray.length) {
        this.showErrorStatus("expaccpt.unload.complete.uld");
        return;
      }
      let inventoryArray = [];
      if (childArray.length) {
        childArray.forEach(element => {
          element.existingShipmentLocation = element.storeLocation;
          element.existingWarehouseLocation = element.warehouseLocation;
          inventoryArray.push(element);

        })
      }
      this.exportMailManifestForm.get('UpdateLocationArray').patchValue(inventoryArray);
      (<NgcFormArray>this.exportMailManifestForm.get(['uldTrolleyArray'])).patchValue(dataToTransfer);
      this.showPopUpWindowStoreLocation.open();
    }
  }
  parentCheck(index) {

    let parentSelected = this.exportMailManifestForm.getRawValue().uldTrolleyArray;
    let countParent = 0;
    let isSelected: any;
    if (!parentSelected[index].check) {
      this.disableDelete = true;
      parentSelected[index].mailBagInfo.forEach(element1 => {
        element1.childCheckBox = false;
      })
      this.exportMailManifestForm.get(['uldTrolleyArray', index, 'mailBagInfo']).setValue(parentSelected[index].mailBagInfo)

    }
    if (parentSelected[index].check) {
      this.disableDelete = true;
      parentSelected[index].mailBagInfo.forEach(element1 => {
        element1.childCheckBox = true;
      })
      this.exportMailManifestForm.get(['uldTrolleyArray', index, 'mailBagInfo']).setValue(parentSelected[index].mailBagInfo)
    }
    let dataToTransfer: any = (<NgcFormArray>this.exportMailManifestForm.get(['uldTrolleyArray'])).getRawValue();
    dataToTransfer.forEach(element => {
      if (element.check) {
        countParent = countParent + 1;
      }
    });

    dataToTransfer.forEach(element => {
      element.mailBagInfo.forEach(element1 => {
        if (element1.childCheckBox) {
          isSelected = true;
        }
      });
    }
    )
    if (countParent == 0 && isSelected) {
      this.disableDelete = false;
    }
  }


}
