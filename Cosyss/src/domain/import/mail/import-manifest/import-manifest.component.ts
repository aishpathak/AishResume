import { element } from 'protractor';
import {
  Component,
  NgZone,
  ElementRef,
  ViewContainerRef,
  OnInit,
  OnChanges,
  ViewChild,
  ViewChildren,
  QueryList,
} from "@angular/core";
import {
  NgcPage,
  NgcFormGroup,
  NgcWindowComponent,
  NgcFormArray,
  NgcDropDownComponent,
  NgcUtility,
  NgcButtonComponent,
  NgcDataTableComponent,
  PageConfiguration,
  CellsRendererStyle,
  NgcReportComponent
} from 'ngc-framework';
import { NgcFormControl } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportService } from './../../import.service';
import { request } from 'http';

import { RequestImportMailManifest } from './../../import.sharedmodel';

@Component({
  selector: 'app-import-manifest',
  templateUrl: './import-manifest.component.html',
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class ImportManifestComponent extends NgcPage implements OnInit {

  showTable: boolean = false;
  showTableButtons: boolean = false;
  breakDownCompleteButtonFlag: boolean = false;
  reopenBreakdownButtonFlag: boolean = false;
  hideContextualButtonsFlag: boolean = false;
  documentCompleteButtonFlag: boolean = false;
  reOpenDocumentButtonFlag: boolean = false;
  documentFlag: boolean = false;
  breakDownFlag: boolean = false;
  flightId: any;
  response: any;
  reportParameters: any;
  patchSameValueArray = [];
  commonStorageLoc: Boolean = false;
  commonBreakDownLoc: Boolean = false;
  totalPieces: any = 0;
  totalWeight: any = 0;
  hasReadPermission: boolean = false;

  @ViewChild('showPopUpWindowUpdateLocation') showPopUpWindowUpdateLocation: NgcWindowComponent;
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('reportDetailWindow') reportDetailWindow: NgcReportComponent;
  specialCharCheck: boolean;
  constructor(private importService: ImportService, private router: Router, private activatedRoute: ActivatedRoute,
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    let serviceReportData = this.getNavigateData(this.activatedRoute);
    if (serviceReportData) {
      this.importmanifestForm.get('flightKey').patchValue(serviceReportData.flightKey);
      this.importmanifestForm.get('flightDate').patchValue(serviceReportData.flightDate);
      this.OnSearch();
    }
  }

  private importmanifestForm: NgcFormGroup = new NgcFormGroup({
    id: new NgcFormControl(),
    breakDownUld: new NgcFormControl(),
    breakDownPieces: new NgcFormControl(),
    breakDownWeight: new NgcFormControl(),
    segmentId: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(new Date()),
    flightId: new NgcFormControl(),
    destination: new NgcFormControl(),
    nextDestination: new NgcFormControl(),
    breakDownLocation: new NgcFormControl(),
    shipmentLocation: new NgcFormControl(),
    mailFirstTimeBreakDownCompletedBy: new NgcFormControl(),
    mailFirstTimeDocumentVerificationCompletedBy: new NgcFormControl(),
    shipments: new NgcFormArray([]),
    mailBagNumber: new NgcFormControl('USMIAAUSJFKAAEN90178001900220 USMIAAUSJFKAAEN90178001900220'),
    currentLocation: new NgcFormControl('MT026'),
    currentWareHouseLocation: new NgcFormControl('ASD02'),
    delivery: new NgcFormControl(),
    storage: new NgcFormControl(),
    newLocation: new NgcFormControl(),
    newWareHouseLocation: new NgcFormControl(),
    popUpArray: new NgcFormArray([]),
    commonStorageLocation: new NgcFormControl(),
    commonBreakLocation: new NgcFormControl()

  })

  OpenUpdateLocationPop() {
    let newArray = [];
    let childArray = [];
    let arrayShipments: any = (<NgcFormArray>this.importmanifestForm.controls["shipments"]).getRawValue();
    arrayShipments.forEach(elements => {
      if (elements.check) {
        newArray.push(elements);
      }
      else {
        elements.inventory.forEach(child => {
          if (child.checkChild) {
            childArray.push(child);
          }
        })
      }
    })

    if (childArray.length >= 1) {
      this.commonStorageLoc = true;
      this.commonBreakDownLoc = true;
    }
    if (newArray.length >= 1) {
      this.commonStorageLoc = true;
      this.commonBreakDownLoc = true;
    }

    if (!newArray.length && !childArray.length) {
      this.showErrorStatus("expaccpt.select.row.first");
      return;
    }
    // if (newArray.length > 1) {
    //   this.showErrorStatus("expaccpt.select.one.row.only");
    // } else {
    let inventoryArray = [];
    this.resetFormMessages();
    if (newArray.length) {
      if (newArray[0].delivered) {
        this.showErrorStatus("mailbag.delivered");
        return;
      }
      newArray.forEach(elements => {
        elements.inventory.forEach(element1 => {
          element1.shipmentId = elements.shipmentId;
          element1.flightId = this.response.flightId;
          element1.existingShipmentLocation = element1.storageLocation
          element1.existingWarehouseLocation = element1.breakDownLocation;
          inventoryArray.push(element1);
        })
      })
    } else {
      childArray.forEach(elements => {
        elements.existingShipmentLocation = elements.storageLocation;
        elements.existingWarehouseLocation = elements.breakDownLocation;
        elements.flightId = this.response.flightId;
        inventoryArray.push(elements);

      })
    }


    this.importmanifestForm.get(['popUpArray']).patchValue(inventoryArray);
    this.importmanifestForm.get('commonStorageLocation').reset();
    this.importmanifestForm.get('commonBreakLocation').reset();
    this.showPopUpWindowUpdateLocation.open();

    //}

  }

  OnUpdateLocation() {
    let arrayInventories: any = (<NgcFormArray>this.importmanifestForm.controls["popUpArray"]).getRawValue();
    if (!this.importmanifestForm.get('commonStorageLocation').value &&
      !this.importmanifestForm.get('commonBreakLocation').value) {
      this.showErrorStatus('exp.buildup.unload.location.required');
      return;
    }
    if (this.specialCharCheck) {
      this.showErrorStatus("export.invalid.shipment.warehouse.location");
      return;
    }
    if (this.importmanifestForm.get('commonStorageLocation').value.length < 8 && this.importmanifestForm.get('commonStorageLocation').invalid) {
      this.showErrorStatus("data.invalid.storage.location");
      return;
    }
    this.importService.checkContainerDestination(arrayInventories).subscribe(data => {
      if (data.data) {
        if (data.data[0].releaseDest) {
          this.showConfirmMessage(NgcUtility.translateMessage("import.confirm105", [data.data[0].containerDestination])).then(fulfilled => {
            this.UpdateStorageWareHouseLoc(data.data);
          });
        } else {
          this.UpdateStorageWareHouseLoc(data.data);
        }
      } else {
        this.refreshFormMessages(data);
      }
    })


  }

  UpdateStorageWareHouseLoc(arrayInventories) {
    this.importService.updateLocation(arrayInventories).subscribe(data => {
      if (data.data) {
        this.OnSearch();
        this.showPopUpWindowUpdateLocation.hide();
        this.showSuccessStatus("g.completed.successfully");
        this.importmanifestForm.get('commonStorageLocation').patchValue(null);
        this.importmanifestForm.get('commonBreakLocation').patchValue(null);

      }
      else {
        this.showErrorStatus('error.not.updated');
      }
    });
  }

  CheckStorage(item) {
    if (item)
      this.importmanifestForm.get('delivery').patchValue(false);
  }
  CheckDelivery(item) {
    if (item)
      this.importmanifestForm.get('storage').patchValue(false)
  }

  OnSearch() {
    this.hasReadPermission = NgcUtility.hasReadPermission('IMPORT_MAIL_MANIFEST');
    let breakDownLocationArray: any = [];
    let request: any = new RequestImportMailManifest();
    request.flightKey = this.importmanifestForm.get('flightKey').value;
    request.flightNumber = request.flightKey; 
    request.flightDate = this.importmanifestForm.get('flightDate').value;
    request.destination = this.importmanifestForm.get('destination').value;
    request.nextDestination = this.importmanifestForm.get('nextDestination').value;
    request.breakDownUld = this.importmanifestForm.get('breakDownLocation').value;
    request.shipmentLocation = this.importmanifestForm.get('shipmentLocation').value;
    this.importService.searchImportMailManifest(request).subscribe(data => {
      this.response = data.data;
      this.totalPieces = 0;
      this.totalWeight = 0;
      if (this.response) {
        this.showTableButtons = true;
        this.breakDownFlag = true;
        this.documentFlag = true;
        this.flightId = data.data.flightId;
        if (this.response.mailFirstTimeBreakDownCompletedBy) {
          this.reopenBreakdownButtonFlag = true;
          this.breakDownCompleteButtonFlag = false;
          this.hideContextualButtonsFlag = false;
        } else {
          this.breakDownCompleteButtonFlag = true;
          this.reopenBreakdownButtonFlag = false;
        }
        if (this.response.mailFirstTimeDocumentVerificationCompletedBy) {
          this.reOpenDocumentButtonFlag = true;
          this.documentCompleteButtonFlag = false;
          this.hideContextualButtonsFlag = false;
        } else {
          this.reOpenDocumentButtonFlag = false;
          this.documentCompleteButtonFlag = true;
        }
        this.importmanifestForm.get('mailFirstTimeBreakDownCompletedBy').setValue(this.response.mailFirstTimeBreakDownCompletedBy);
        this.importmanifestForm.get('mailFirstTimeDocumentVerificationCompletedBy').setValue(this.response.mailFirstTimeDocumentVerificationCompletedBy);
      } else {
        this.showTableButtons = false;
        this.refreshFormMessages(data);
        this.showTable = false;
        this.breakDownFlag = false;
        this.documentFlag = false;
      }
      if (this.response.shipments) {
        this.resetFormMessages();
        this.showTable = true;
        this.showTableButtons = true;
        this.hideContextualButtonsFlag = true;
        this.flightId = data.data.flightId;
        data.data.shipments.forEach(element => {
          element["check"] = false;
          // element.forEach(ele => {
          //   ele["checkChild"] = false;
          // })
        });
        this.response.shipments.forEach(element => {
          this.totalPieces += element.breakDownPieces;
          this.totalWeight += element.breakDownWeight;
          this.totalWeight = Number.parseFloat(NgcUtility.getDisplayWeight(this.totalWeight));

          if (!element.dispatchNumber) {
            element.dispatchNumber = element.shipmentNumber.substring(16, 20);
          }
          element.checkDelivery = 0;
          element.inventory.forEach(element1 => {
            if (element1.closedTransit) {
              element.checkDelivery = 1;
            }
            element1.filteredDataForStoreLocation.push(element1.storageLocation);

            element1.filteredDataForBreakDownLocation.push(element1.breakDownLocation);

            element1.filteredDataForNextDestination.push(element1.nextDestination);
            element.nextDestination = element1.filteredDataForNextDestination.filter((v, i, a) => a.indexOf(v) === i).toString();
            if (element1.transferCarrierFrom === "**") {
              element1.transferCarrierFrom = "All";
            }
            element1.filteredDataForTransferCarrier.push(element1.transferCarrierFrom);
            element.transferCarrierFrom = element1.filteredDataForTransferCarrier.filter((v, i, a) => a.indexOf(v) === i).toString();

            element1.filteredDataForEmbargo.push(element1.embargoFlag);
            element.embargo = element1.filteredDataForEmbargo.filter((v, i, a) => a.indexOf(v) === i).toString();
          });
          console.log(element);
          if (!NgcUtility.isTenantCityOrAirport(element.destination) && element.checkDelivery === 0) {
            element.delivered = null;
          }
        })
        this.importmanifestForm.get(['shipments']).patchValue(this.response.shipments);
        this.importmanifestForm.get('mailFirstTimeBreakDownCompletedBy').setValue(this.response.mailFirstTimeBreakDownCompletedBy);
        this.importmanifestForm.get('mailFirstTimeDocumentVerificationCompletedBy').setValue(this.response.mailFirstTimeDocumentVerificationCompletedBy);

      } else {
        this.refreshFormMessages(data);
        this.showTable = false;
      }
    }, error => {
      this.showErrorStatus('imp.err121');
    })

  }

  Transfer() {
    let request: any = new RequestImportMailManifest();
    request.flightId = this.response.flightId;
    request.destination = this.importmanifestForm.get('destination').value;
    let arrayShipments: any = (<NgcFormArray>this.importmanifestForm.controls["shipments"]).getRawValue();
    request.shipments = [];
    arrayShipments.forEach(element => {
      if (element.check) {
        request.shipments.push(element);
      }
    })
    if (!request.shipments.length) {
      this.showInfoStatus("import.info119");
    }
    else {
      let req: any = this.importmanifestForm.getRawValue();
      req.flightId = this.response.flightId;
      req.segmentId = this.response.segmentId;
      let arrayShipments: any = (<NgcFormArray>this.importmanifestForm.controls["shipments"]).getRawValue();
      let shipments = [];
      arrayShipments.forEach(element => {
        if (element.check) {
          shipments.push(element);
        }
      })
      req.shipments = shipments;
      this.importService.transfer(req).subscribe(data => {
        if (data.data) {
          this.resetFormMessages();
          this.showSuccessStatus("g.completed.successfully");
          request.flightKey = this.importmanifestForm.get('flightKey').value;
          request.flightDate = this.importmanifestForm.get('flightDate').value;
          request.segments = this.response.segmentId;
          let event = request;
          this.navigateTo(this.router, '/awbmgmt/createcn46', event);

        } else {
          this.refreshFormMessages(data);
        }
      })
    }
  }

  TransferToServiceReport() {
    let request: any = new RequestImportMailManifest();
    request.flightKey = this.importmanifestForm.get('flightKey').value;
    request.flightDate = this.importmanifestForm.get('flightDate').value;
    let event = request;
    this.navigateTo(this.router, '/import/servicereportmail', event);
  }

  OnBreakDownComplete() {
    let request: any = new RequestImportMailManifest();
    request.flightId = this.flightId;
    request.flightKey = this.importmanifestForm.get('flightKey').value;
    request.flightDate = this.importmanifestForm.get('flightDate').value;
    request.segmentId = this.response.segmentId;
    request.carrierCode = this.response.carrierCode;
    if (this.reopenBreakdownButtonFlag) {
      request.checkData = true;
    } else if (this.breakDownCompleteButtonFlag) {
      request.checkData = false;
    }
    request.inboundShipments = this.response.shipments;
    request.mailBagInfo = this.response.mailBagInfo;
    let transferredMB = new Array();
    let withoutShpLocArray = new Array();
    if (!request.checkData) {
      for (let ele of request.inboundShipments) {
        if (ele.inventory && ele.inventory.length > 0) {
          for (let ele1 of ele.inventory) {
            if (!ele.bup && !ele1.delivered) {
              if (!ele1.storageLocation && !ele1.loadedHouse && ele1.mailBagNumber) {
                withoutShpLocArray.push(ele1.mailBagNumber);
              }
            }
          }
        }
      }
      if (withoutShpLocArray.length > 0) {
        this.showErrorMessage("mailbag.shipment.location", "", [[withoutShpLocArray.toString()]]);
        return;
      }
    }
    this.importService.breakDownComplete(request).subscribe(data => {
      if (data.data) {
        this.resetFormMessages();
        this.showSuccessStatus("g.completed.successfully");
        this.OnSearch();
      } else {
        this.refreshFormMessages(data);
      }
    })

  }

  OnDocumentComplete() {
    let request: any = new RequestImportMailManifest();
    request.flightId = this.flightId;
    request.flightKey = this.importmanifestForm.get('flightKey').value;
    request.flightDate = this.importmanifestForm.get('flightDate').value;
    request.segmentId = this.response.segmentId;
    request.carrierCode = this.response.carrierCode;
    if (this.reOpenDocumentButtonFlag) {
      request.checkData = true;
    } else if (this.documentCompleteButtonFlag) {
      request.checkData = false;
    }
    request.inboundShipments = this.response.shipments;
    request.mailBagInfo = this.response.mailBagInfo;
    let transferredMB = new Array();
    if (!request.checkData) {
      for (let ele of request.inboundShipments) {
        if (ele.inventory && ele.inventory.length > 0) {
          if (ele.transferCarrierGroup && ele.shipmentCarrierGroup) {
            let transferGroups = ele.transferCarrierGroup.split(",");
            let shipmentGroup = ele.shipmentCarrierGroup.split(",");
            let carrierGroupMatch = transferGroups.some(item => shipmentGroup.includes(item));
            for (let ele1 of ele.inventory) {
              if (!ele1.loadedHouse) {
                if (!carrierGroupMatch && !ele1.transferred && ele1.mailBagNumber) {
                  transferredMB.push(ele1.mailBagNumber);
                }
              }
            }
          }
        }
      }
      if (transferredMB.length > 0) {
        this.showErrorMessage("mailbag.not.transferred", "", [[transferredMB.toString()]]);
        return;
      }
    }
    this.importService.documentComplete(request).subscribe(data => {
      if (data.data) {
        this.resetFormMessages();
        this.showSuccessStatus("g.completed.successfully");
        this.OnSearch();
      } else {
        this.refreshFormMessages(data);
      }
    })
  }

  OnClear() {
    this.resetFormMessages();
    this.importmanifestForm.reset();
    this.showTable = false;
  }

  public breakdownlocationRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    const formGroup: NgcFormGroup = this.importmanifestForm.get(["shipments", rowData['NGC_ROW_ID']]) as NgcFormGroup;
    let breakDownLocation: string = null;
    // checking if data exists in the parent array
    if (formGroup) {
      let formArray: NgcFormArray = formGroup.get('inventory') as NgcFormArray;
      // checking if the data exists in the child array
      if (formArray) {
        formArray.controls.forEach((nameGroup: NgcFormGroup) => {
          if (nameGroup.get('breakDownLocation').value) {
            if (breakDownLocation === null) {
              breakDownLocation = nameGroup.get('breakDownLocation').value;
            } else {
              breakDownLocation += ', ' + nameGroup.get('breakDownLocation').value;
            }
          }
        });
      }
    }
    cellsStyle.data = breakDownLocation ? breakDownLocation : '';
    // will return child array value with comma seperated
    return cellsStyle;
  };

  public storelocationRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    const formGroup: NgcFormGroup = this.importmanifestForm.get(["shipments", rowData['NGC_ROW_ID']]) as NgcFormGroup;
    let storeLocation: string = null;
    // checking if data exists in the parent array
    if (formGroup) {
      let formArray: NgcFormArray = formGroup.get('inventory') as NgcFormArray;
      // checking if the data exist in the child array
      if (formArray) {
        formArray.controls.forEach((nameGroup: NgcFormGroup) => {
          if (nameGroup.get('storageLocation').value) {
            if (storeLocation === null) {
              storeLocation = nameGroup.get('storageLocation').value;
            } else {
              storeLocation += ', ' + nameGroup.get('storageLocation').value;
            }
          }
        });
      }
    }
    cellsStyle.data = storeLocation ? storeLocation : '';
    // will return child array value with comma seperated
    return cellsStyle;
  };

  public onBack(event) {
    this.navigateBack(this.importmanifestForm.getRawValue());
  }

  onimportmanifestReport() {
    this.reportParameters = new Object();
    let arrayShipments: any = (<NgcFormArray>this.importmanifestForm.controls["shipments"]).getRawValue();
    const allShipmentids = [];
    let allSeperatedShpIds: string;
    let i: number = 0;
    arrayShipments.forEach(obj => {
      if (i == 0) {
        allSeperatedShpIds = "'" + obj.shipmentId + "'" + ","
      }
      else if (i == arrayShipments.length - 1) {
        allSeperatedShpIds = allSeperatedShpIds + "'" + obj.shipmentId + "'";
      } else {
        allSeperatedShpIds = allSeperatedShpIds + "'" + obj.shipmentId + "'" + ","
      }

      i++;
    })

    console.log(allShipmentids);
    let seperatedShpIdsdetails = allShipmentids.join(',');
    this.reportParameters.date = this.importmanifestForm.get('flightDate').value;
    this.reportParameters.flightkey = this.importmanifestForm.get('flightKey').value;
    this.reportParameters.flightId = this.response.flightId;
    this.reportParameters.printBy = this.getUserProfile().userShortName;
    this.reportParameters.shipmentID = allSeperatedShpIds;

    this.reportWindow.open();
  }
  onImportManifestDetailReport() {
    this.reportParameters = new Object();
    let dn: any = [];
    let arrayShipments: any = (<NgcFormArray>this.importmanifestForm.controls["shipments"]).getRawValue();
    let i = 0;
    // this.reportParameters.date = this.importmanifestForm.get('flightDate').value;
    // this.reportParameters.flightkey = this.importmanifestForm.get('flightKey').value;
    this.reportParameters.flightid = this.response.flightId;
    this.reportParameters.printBy = this.getUserProfile().userShortName;
    let a = arrayShipments.filter(element => element.check).map(element => element.dispatchNumber).join(",");
    let b = arrayShipments.filter(element => element.check).map(element => element.shipmentId).join(",");
    let c = arrayShipments.filter(element => element.check).map(element => element.uldTrollyNo).join(",");
    this.reportParameters.dn = (a == '' ? null : a);
    this.reportParameters.shipmentId = (b.toString() == '' ? null : b.toString());
    this.reportParameters.uldTrollyNo = (c.toString() == '' ? null : c.toString());
    this.reportDetailWindow.open();
  }

  patchSameValueForShipmentLocation(item) {
    if(null != item) {
      let arrayShipments: any = (<NgcFormArray>this.importmanifestForm.controls["popUpArray"]).getRawValue();
      //this.validateLocationWithNoSpecialCharacter(item);
      if (this.specialCharCheck) {
        this.showErrorStatus("imp.err122");
        return;
      }
      //let storeLocation: string = this.setShipmentLocation(item);
  
      arrayShipments.forEach(element => {
        element.flagCRUD = 'U';
        element.storageLocation = item;
      });
      arrayShipments.forEach(element => {
        element.flagCRUD = 'U';
        element.breakDownLocation = this.importmanifestForm.get('commonBreakLocation').value;
      });
  
      this.importmanifestForm.get("popUpArray").patchValue(arrayShipments);
    }
    
  }

  patchSameValueForWareHouseLocation(item) {
    if(null != item) {
      let arrayShipments: any = (<NgcFormArray>this.importmanifestForm.controls["popUpArray"]).getRawValue();
      if (this.specialCharCheck) {
        this.showErrorStatus("imp.err122");
        return;
      }
      arrayShipments.forEach(element => {
        element.flagCRUD = 'U';
        element.breakDownLocation = item;
      });
      arrayShipments.forEach(element => {
        element.flagCRUD = 'U';
        element.storageLocation = this.importmanifestForm.get('commonStorageLocation').value;;
      });
      this.importmanifestForm.get("popUpArray").patchValue(arrayShipments);
    }
  }

  setShipmentLocation(item): string {
    let locationType: string;
    let locationnumber: string;
    if (item) {
      locationType = item.substring(0, 2).toUpperCase();
      if ("BT" === locationType || "MT" === locationType) {
        locationnumber = item.substring(2);
        if (locationnumber.length === 1) {
          locationnumber = "000" + locationnumber;
        } else if (locationnumber.length === 2) {
          locationnumber = "00" + locationnumber;
        } else if (locationnumber.length === 3) {
          locationnumber = "0" + locationnumber;
        } else {
          locationnumber = locationnumber;
        }
        item = locationType + locationnumber;
      }
    }
    return item;
  }

  validateLocationWithNoSpecialCharacter(item) {
    let format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (format.test(item)) {
      this.specialCharCheck = true;
      this.showErrorStatus("imp.err122");
      return;
    } else {
      this.specialCharCheck = false;
      this.refreshFormMessages(item);
    }
  }

}
