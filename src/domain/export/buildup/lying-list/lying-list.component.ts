import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcReportComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration, NgcContainerComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchForLyingList } from './../buildup.sharedmodel';
import { BuildupService } from './../buildup.service';

@Component({
  selector: 'app-lying-list',
  templateUrl: './lying-list.component.html',
  styleUrls: ['./lying-list.component.css']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class LyingListComponent extends NgcPage implements OnInit {

  @ViewChild("updateStorageLocationWindow") updateStorageLocationWindow: NgcWindowComponent;
  @ViewChild("BookShipmentWindow") BookShipmentWindow: NgcWindowComponent;
  @ViewChild("manualFreightOutPopUp") manualFreightOutPopUp: NgcWindowComponent;

  totalPieces: any = 0;
  totalWeight: any = 0;
  resp: any;
  lyinglist: any;
  lyinglistFiltered: any;
  isTableFlg = false;
  isSelectedMailbag = false;
  reportParameters: any;
  flightKeyforDropdown: any;
  commonStorageLoc: boolean = false;
  commonBreakDownLoc: boolean = false;
  disableBookingButton: boolean = false;
  disableLocationButton: boolean = false;
  private lyingListForm: NgcFormGroup = new NgcFormGroup({
    carriercode: new NgcFormControl(),
    destination: new NgcFormControl(),
    nextDestination: new NgcFormControl(),
    uldOrTrolley: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    dnCompSearch: new NgcFormControl(),
    dnNumber: new NgcFormControl(),

  })
  private lyingListFormResponse: NgcFormGroup = new NgcFormGroup({

    shipmenttype: new NgcFormControl(),
    bookingFlightPopUpData: new NgcFormControl(),
    flightDatePopUpData: new NgcFormControl(),
    flightSegment: new NgcFormControl(),
    lyingListContainerFormArray: new NgcFormArray([

    ]),
    UpdateLocationArray: new NgcFormArray([]),
    BookShipmentContainerArray: new NgcFormArray([]),
    ManualFreightOutArray: new NgcFormArray([]),
    commonStorageLocation: new NgcFormControl(),
    commonBreakLocation: new NgcFormControl()
  })



  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  specialCharCheck: boolean;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private buildupService: BuildupService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public onSearch() {
    this.resetFormMessages();
    let search: SearchForLyingList = new SearchForLyingList();
    search = this.lyingListForm.getRawValue();
    if (!search.dnNumber && !search.carriercode && !search.destination &&
      !search.nextDestination && !search.uldOrTrolley && !search.flightKey &&
      !search.flightDate && !search.dnCompSearch) {
      this.showErrorStatus('export.fill.atleast.one.field.to.search');
      return;
    }
    this.buildupService.searchForLyingList(search).subscribe(data => {
      this.totalPieces = 0;
      this.totalWeight = 0;
      this.isTableFlg = false;
      if (!this.showResponseErrorMessages(data)) {
        this.disableLocationButton = false;
        this.isTableFlg = true;
        this.resp = data.data;
        this.lyinglist = this.resp;

        if (search.dnCompSearch != null) {
          if (search.dnCompSearch == 'true') {

            this.lyinglist = this.lyinglist.filter(ele => ele.dnCompflag);

          } else {

            this.lyinglist = this.lyinglist.filter(ele => !ele.dnCompflag);

          }
          this.lyinglist = this.lyinglist.filter(ele => ele.lyingListShipment.length);
        }

        this.lyinglist.forEach(element => {
          if (element.allStoreLocations && element.allStoreLocations.length)
            element.storeLocation = element.allStoreLocations.toString();
        });

        this.lyinglist.forEach(element => {
          this.totalPieces += element.pieces;
          this.totalWeight += element.weights;
          this.totalWeight = Number.parseFloat(NgcUtility.getDisplayWeight(this.totalWeight));

          element.selectParent = false;
          element.lyingListShipment.forEach(ele => {
            var inventoryPieces = ele.piecesInv;
            var totalMasterPieces = element.pieces;
            ele.dnComp = inventoryPieces + " / " + totalMasterPieces;
            ele.selectChild = false;
          })
        });


        (<NgcFormArray>this.lyingListFormResponse.controls['lyingListContainerFormArray']).patchValue(this.lyinglist);
      }
    }, error => {
      this.showErrorMessage(error);
    });
  }

  private onClick(event) {
    this.lyingListFormResponse.get('commonStorageLocation').reset();
    this.lyingListFormResponse.get('commonBreakLocation').reset();
    let updateLocation = this.lyingListFormResponse.getRawValue();
    let array = new Array();
    let childArray = [];
    updateLocation.lyingListContainerFormArray.forEach(element => {
      if (element.selectParent) {
        array.push(element);
      } else {
        element.lyingListShipment.forEach(child => {
          if (child.selectChild) {
            childArray.push(child);
          }
        })
      }
    });

    if (childArray.length >= 1) {
      this.commonStorageLoc = true;
      this.commonBreakDownLoc = true;
    }
    if (array.length >= 1) {
      this.commonStorageLoc = true;
      this.commonBreakDownLoc = true;
    }

    if (!array.length && !childArray.length) {
      this.showErrorStatus("expaccpt.select.row.first");
      return;
    }


    let inventoryArray = [];
    this.resetFormMessages();
    if (array.length) {
      array.forEach(elements => {
        elements.lyingListShipment.forEach(element1 => {
          element1.existingShipmentLocation = element1.storeLocation
          element1.existingWarehouseLocation = element1.warehouseLocation;
          inventoryArray.push(element1);
        })
      })
    } else {
      childArray.forEach(elements => {
        elements.existingShipmentLocation = elements.storeLocation;
        elements.existingWarehouseLocation = elements.warehouseLocation;
        inventoryArray.push(elements);

      })
    }
    let loadedmailbagsarray = new Array();
    for (let item of inventoryArray) {
      if (item.loadedBag) {
        loadedmailbagsarray.push(item.mailBagNumber);
      }
    }
    if (loadedmailbagsarray.length > 0) {
      this.showErrorMessage(NgcUtility.translateMessage('error.loaded.mailbag.selected', [loadedmailbagsarray.toString()]));
      return;
    }

    this.lyingListFormResponse.get('UpdateLocationArray').patchValue(inventoryArray);
    this.updateStorageLocationWindow.open();


    // }


  }

  OnUpdateLocationSave() {
    let arrayInventories: any = (<NgcFormArray>this.lyingListFormResponse.controls["UpdateLocationArray"]).getRawValue();
    if (this.specialCharCheck) {
      this.showErrorStatus("export.invalid.shipment.warehouse.location");
      return;
    }
    arrayInventories.forEach(obj => {
      obj.assignmentCheck = true;
      obj.destinationCheck = true;
    });

    this.buildupService.checkFlightAssignment(arrayInventories).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        // if (data.data[0].uldPopup) {
        //   this.showConfirmMessage('ULD loaded with Shipment : <br/>' + data.data[0].storeLocation + '<br/>Do you wish to continue?').then(fulfilled => {
        //if click on yes - continue next process
        if (data.data[0].assignedFlightKey && data.data[0].assignedFlightDate) {
          this.showConfirmMessage(NgcUtility.translateMessage('error.uld.already.assigned.confirmation', [data.data[0].assignedFlightKey, data.data[0].assignedFlightDate.substring(0, 10)])).then(fulfilled => {
            arrayInventories.forEach(obj => {
              obj.assignmentCheck = false;
            });
            this.checkContainerDestination();
          });
        } else {
          this.checkContainerDestination();
        }
        //   });
        // }
      }
    }, error => {
      this.showErrorMessage(error);
    });


  }

  updatelocation() {
    let arrayInventories: any = (<NgcFormArray>this.lyingListFormResponse.controls["UpdateLocationArray"]).getRawValue();
    arrayInventories.forEach(obj => {
      obj.assignmentCheck = true;
      obj.destinationCheck = true;
    });

    this.buildupService.updateLocation(arrayInventories).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.onSearch();
        this.updateStorageLocationWindow.hide();
        this.showSuccessStatus("g.operation.successful");
      }
    }, error => {
      this.showErrorMessage(error);
    });

  }

  checkContainerDestination() {

    let arrayInventories: any = (<NgcFormArray>this.lyingListFormResponse.controls["UpdateLocationArray"]).getRawValue();
    arrayInventories.forEach(obj => {
      obj.assignmentCheck = true;
      obj.destinationCheck = true;
    });

    this.buildupService.checkContainerDestination(arrayInventories).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.data[0].containerDestination) {
          this.showConfirmMessage(NgcUtility.translateMessage('confirmation.container.dest', [data.data[0].containerDestination])).then(fulfilled => {
            arrayInventories.forEach(obj => {
              obj.destinationCheck = false;
              obj.containerDestination = data.data[0].containerDestination;
            });
            this.updatelocation();
          });
        } else {
          this.updatelocation();
        }
      }
    },
      error => {
        this.showErrorMessage(error);
      });

  }

  private onLoadShipment(event) {
    let loadShipment = this.lyingListFormResponse.getRawValue();
    let array = new Array();
    loadShipment.lyingListContainerFormArray.forEach(element => {

      if (element.selectParent) {
        array.push(element);
      }
    });

    const requestObject = {
      screen: String("LyingList"),
      lyingListContainerFormArray: array
    }



    if (!array.length) {
      this.showErrorStatus("expaccpt.select.row.first");
      return;
    } else {
      this.navigateTo(this.router, '/export/buildup/mailloadshipment', requestObject);
    }
  }

  public onLinkClick(event, index, subIndex) {
    let dispatchseriesvariable = this.lyingListFormResponse.getRawValue().lyingListContainerFormArray[index].lyingListShipment[subIndex].mailBagNumber;
    //dispatchseriesvariable = this.lyingListForm.get(['lyingListContainerFormArray', index, 'lyingListShipment', subIndex]).value.mailBagNumber;
    const dispatchSeries = {
      dispatchseries: dispatchseriesvariable.substring(0, 20)
    }
    this.navigateTo(this.router, '/awbmgmt/mailbagoverview', dispatchSeries);
  }

  public onBookShipment(event) {
    this.lyingListFormResponse.get('bookingFlightPopUpData').reset();
    this.lyingListFormResponse.get('flightDatePopUpData').reset();
    this.lyingListFormResponse.get('flightSegment').reset();
    let bookingShipment = this.lyingListFormResponse.getRawValue();
    let array = new Array();
    bookingShipment.lyingListContainerFormArray.forEach(element => {
      if (element.selectParent) {
        array.push(element);
      }
    });
    if (!array.length) {
      this.showErrorStatus("expaccpt.select.row.first");
      return;
    } else {
      let inventoryArray = [];
      this.resetFormMessages();
      array.forEach(element1 => {
        inventoryArray.push(element1);
        // element1.lyingListShipment.forEach(inventoryEle => {
        //   inventoryArray.push(inventoryEle);
        // });
      });
      (<NgcFormArray>this.lyingListFormResponse.controls['BookShipmentContainerArray']).patchValue(inventoryArray);

      this.BookShipmentWindow.open();
    }
  }

  checkForDifferentCarrierAssignment() {
    let arrayInventories: any = (<NgcFormArray>this.lyingListFormResponse.controls["BookShipmentContainerArray"]).getRawValue();
    let flightSeg = this.lyingListFormResponse.get('flightSegment').value;
    if (!flightSeg) {
      this.showErrorStatus("export.invalid.flight.segment");
      return;
    }
    arrayInventories.forEach(element => {
      element.bookingFlightPopUpData = this.lyingListFormResponse.get('bookingFlightPopUpData').value;
      element.flightDatePopUpData = this.lyingListFormResponse.get('flightDatePopUpData').value;
      element.flightSegment = this.lyingListFormResponse.get('flightSegment').value;
    });
    this.buildupService.checkForDifferentCarrierAssignment(arrayInventories).subscribe(data => {
      this.refreshFormMessages(data);
      if (data.data) {
        if (data.data.diffCarrierAssignment) {
          this.showConfirmMessage(data.data.diffCarrierAssignment).then(fulfilled => {
            this.OnBookShipmentInfo();
          });
        } else {
          this.OnBookShipmentInfo();
        }
      }
    });

  }

  OnBookShipmentInfo() {

    let arrayInventories: any = (<NgcFormArray>this.lyingListFormResponse.controls["BookShipmentContainerArray"]).getRawValue();

    arrayInventories.forEach(element => {
      element.bookingFlightPopUpData = this.lyingListFormResponse.get('bookingFlightPopUpData').value;
      element.flightDatePopUpData = this.lyingListFormResponse.get('flightDatePopUpData').value;
      element.flightSegment = this.lyingListFormResponse.get('flightSegment').value;
    });
    this.buildupService.bookShipmentInfo(arrayInventories).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.onSearch();
        this.BookShipmentWindow.hide();
        this.showSuccessStatus("g.operation.successful");

      }
    }, error => {
      this.showErrorMessage(error);
    })
  }


  onlyingistServiceReport() {
    this.reportParameters = new Object();
    this.reportParameters.dispatchNumber = this.lyingListForm.get('dnNumber').value;
    this.reportParameters.carriercode = this.lyingListForm.get('carriercode').value;
    this.reportParameters.destination = this.lyingListForm.get('destination').value;
    this.reportParameters.nextDestination = this.lyingListForm.get('nextDestination').value;
    if (this.lyingListForm.get('uldOrTrolley').value == null) {
      this.reportParameters.flag = '0';
    }
    else {
      this.reportParameters.uldOrTrolley = this.lyingListForm.get('uldOrTrolley').value;
      this.reportParameters.flag = '1';
    }

    this.reportParameters.flightDate = this.lyingListForm.get('flightDate').value;
    this.reportParameters.flightKey = this.lyingListForm.get('flightKey').value;
    this.reportParameters.dnCompFlag = this.lyingListForm.get('dnCompSearch').value;
    this.reportParameters.shipmenttype = 'MAIL';
    this.reportWindow.open();
  }

  public onFreightOutPopUp() {
    let freightOut = this.lyingListFormResponse.getRawValue();
    let array = new Array();
    freightOut.lyingListContainerFormArray.forEach(element => {
      if (element.selectParent) {
        array.push(element);
      }
    });
    if (!array.length) {
      this.showErrorStatus("expaccpt.select.row.first");
      return;
    } else {
      let inventoryArray = [];
      this.resetFormMessages();
      array.forEach(element1 => {
        inventoryArray.push(element1);
      });
      (<NgcFormArray>this.lyingListFormResponse.controls['ManualFreightOutArray']).patchValue(inventoryArray);
      this.manualFreightOutPopUp.open();
    }
  }

  public onFreightOut() {
    let arrayInventories: any = (<NgcFormArray>this.lyingListFormResponse.controls["ManualFreightOutArray"]).getRawValue();
    this.buildupService.freightOut(arrayInventories).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.onSearch();
        this.showSuccessStatus("g.operation.successful");
        this.manualFreightOutPopUp.close();
      }
    },
      error => {
        this.showErrorMessage(error);
      })

  }

  onSelectofDate(event) {
    this.flightKeyforDropdown = this.createSourceParameter(this.lyingListFormResponse.get('bookingFlightPopUpData').value,
      this.lyingListFormResponse.get('flightDatePopUpData').value);
  }


  patchSameValueForShipmentLocation(item) {
    let arrayShipments: any = (<NgcFormArray>this.lyingListFormResponse.controls["UpdateLocationArray"]).getRawValue();
    this.validateLocationWithNoSpecialCharacter(item);
    if (this.specialCharCheck) {
      this.showErrorStatus("export.invalid.shipment.warehouse.location");
      return;
    }
    let storeLocation: string = this.setShipmentLocation(item);
    if (storeLocation) {
      arrayShipments.forEach(element => {
        element.flagCRUD = 'U';
        element.storeLocation = storeLocation;
      })
    }
    this.lyingListFormResponse.get("UpdateLocationArray").patchValue(arrayShipments);
  }

  patchSameValueForWareHouseLocation(item) {
    let arrayShipments: any = (<NgcFormArray>this.lyingListFormResponse.controls["UpdateLocationArray"]).getRawValue();
    this.validateLocationWithNoSpecialCharacter(item);
    if (this.specialCharCheck) {
      this.showErrorStatus("export.invalid.shipment.warehouse.location");
      return;
    }
    if (item) {
      arrayShipments.forEach(element => {
        element.flagCRUD = 'U';
        element.warehouseLocation = item;
      })
    }
    this.lyingListFormResponse.get("UpdateLocationArray").patchValue(arrayShipments);
  }

  checkLoaded(index) {
    let responseShipments = this.lyingListFormResponse.getRawValue().lyingListContainerFormArray;
    if (responseShipments[index].selectParent) {
      let loaded: boolean = false;
      responseShipments[index].lyingListShipment.map(element => {
        if (element.loadedBag) {
          loaded = true;
        }
      })
      if (loaded) {
        this.disableLocationButton = true;
      } else {
        this.disableLocationButton = false;
      }
    }
  }

  checkMailBagsLoaded(item, parentIndex, childIndex) {
    if (item.controls.selectChild.value) {
      if (item.controls.loadedBag.value) {
        this.disableLocationButton = true;
      } else {
        this.disableLocationButton = false;
      }
    } else {
      this.disableLocationButton = false;

      let arr = this.lyingListFormResponse.getRawValue().lyingListContainerFormArray;
      arr[parentIndex].selectParent = false;
      this.lyingListFormResponse.get(['lyingListContainerFormArray']).setValue(arr);
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
      this.showErrorStatus("export.invalid.shipment.warehouse.location");
      return;
    } else {
      this.specialCharCheck = false;
      this.refreshFormMessages(item);
    }
  }
  onDNATATransfer() {
    this.resetFormMessages();
    let updateLocation = this.lyingListFormResponse.getRawValue();
    let selectedDispatch = new Array();
    updateLocation.lyingListContainerFormArray.forEach(element => {
      if (element.selectParent) {
        selectedDispatch.push(element);

      }
      element.lyingListShipment.forEach(child => {
        if (child.selectChild) {
          this.isSelectedMailbag = true;
        }
      })
    });

    if ((selectedDispatch.length < 1)) {
      if (this.isSelectedMailbag) {
        this.showErrorStatus("exp.airmail.dnatahandover");
      } else {
        this.showErrorStatus("flight.select.atleast.one.checkbox");
      }
      this.isSelectedMailbag = false;
      return;
    }


    this.showConfirmMessage('exp.airmail.dnatahandover.confirm').then(fulfilled => {
      this.buildupService.handoverToDNATA(selectedDispatch).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus("g.operation.successful");
          this.onSearch();
        }
      }, error => {
        this.showErrorMessage(error);
      });
    });

  }
  parentCheck(index) {

    let parentSelected = this.lyingListFormResponse.getRawValue().lyingListContainerFormArray;
    let select = parentSelected[index].selectParent;

    if (select) {
      parentSelected[index].lyingListShipment.forEach(element1 => {
        element1.selectChild = true;
      })
      this.lyingListFormResponse.get(['lyingListContainerFormArray', index, 'lyingListShipment']).setValue(parentSelected[index].lyingListShipment)

    }
    else {
      parentSelected[index].lyingListShipment.forEach(element1 => {
        element1.selectChild = false;
      })
      this.lyingListFormResponse.get(['lyingListContainerFormArray', index, 'lyingListShipment']).setValue(parentSelected[index].lyingListShipment)
    }





  }

  appendZeroToDN(item) {
    let dn = this.lyingListForm.get('dnNumber').value;
    if (dn.length == 4) {
      return;
    }
    if (dn.length === 1) {
      dn = "000" + dn;
    } else if (dn.length === 2) {
      dn = "00" + dn;
    } else {
      dn = "0" + dn;
    }
    this.lyingListForm.get('dnNumber').patchValue(dn);
  }

}
