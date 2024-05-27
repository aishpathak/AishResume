import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcUtility, NgcFormArray, NgcWindowComponent, PageConfiguration, CellsRendererStyle, DateTimeKey } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { AwbManagementService } from '../awbManagement.service'
import { ActivatedRoute, Router } from '@angular/router';
import { MailbagOverviewReqModel } from '../awbManagement.shared';

@Component({
  selector: 'app-mailbag-overview-details',
  templateUrl: './mailbag-overview-details.component.html',
  styleUrls: ['./mailbag-overview-details.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class MailbagOverviewDetailsComponent extends NgcPage {
  @ViewChild('updateLocatioPopUp') updateLocatioPopUp: NgcWindowComponent;
  searchResponse: any;
  isMailbagData: boolean = false;
  updateLocFlag: boolean = false;
  sendDataToCaptureDamage: any;
  private forwardedData: any = null;
  placeHolders: any = [];
  /**
   * Initialize
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */
  @ViewChild('showPopUpWindow') showPopUpWindow: NgcWindowComponent;
  specialCharCheck: boolean;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private awbManagementService: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }

  private mailbagOverviewForm: NgcFormGroup = new NgcFormGroup({
    searchFormGroup: new NgcFormGroup({
      byDisptachMode: new NgcFormControl(''),
      byUldMode: new NgcFormControl(''),
      mailNumber: new NgcFormControl(''),
      dispatchNumber: new NgcFormControl(''),
      origin: new NgcFormControl(''),
      destination: new NgcFormControl(''),
      fromDate: new NgcFormControl(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 14, DateTimeKey.DAYS)),
      toDate: new NgcFormControl(NgcUtility.getCurrentDateOnly()),
      uldtrolley: new NgcFormControl(''),
      xrayresult: new NgcFormControl(''),
      dispatchSeries: new NgcFormControl('')
    }),
    allStatusFormGroup: new NgcFormGroup({
      mailbagNumber: new NgcFormControl(),
      breakdowndoneBy: new NgcFormControl(),
      breakdowndoneOn: new NgcFormControl(),
      acceptedBy: new NgcFormControl(),
      acceptedOn: new NgcFormControl(),
      transferredBy: new NgcFormControl(),
      transferredOn: new NgcFormControl(),
      locationassignedBy: new NgcFormControl(),
      locationassignedOn: new NgcFormControl(),
      bookingdoneBy: new NgcFormControl(),
      bookingdoneOn: new NgcFormControl(),
      loadedBy: new NgcFormControl(),
      loadedOn: new NgcFormControl(),
      manifestBy: new NgcFormControl(),
      manifestOn: new NgcFormControl(),
      offloadedBy: new NgcFormControl(),
      offloadedOn: new NgcFormControl(),
      dnataHandoverBy: new NgcFormControl(),
      dNataHandoverOn: new NgcFormControl(),
      deliveredBy: new NgcFormControl(),
      deliveredOn: new NgcFormControl(),
      returnedBy: new NgcFormControl(),
      returnedOn: new NgcFormControl(),
      returnReason: new NgcFormControl()
    }),

    updateLocationFormgroup: new NgcFormGroup({
      updateDeliveryDetails: new NgcFormControl(''),
      updateStorageDetails: new NgcFormControl('')
    }),

    mailbagDetailsForm: new NgcFormGroup({
      mailbagDetailsList: new NgcFormArray([
        new NgcFormGroup({
          dns: new NgcFormControl(''),
          originOE: new NgcFormControl(''),
          destinationOE: new NgcFormControl(''),
          nextDestination: new NgcFormControl(''),
          shpPieces: new NgcFormControl(''),
          shpWeight: new NgcFormControl(''),
          mailbagDetails: new NgcFormArray([
            new NgcFormGroup({
              selectCheckBox: new NgcFormControl(''),
              mailBagNumber: new NgcFormControl(''),
              rsn: new NgcFormControl(''),
              agentCode: new NgcFormControl(''),
              pieces: new NgcFormControl(''),
              weight: new NgcFormControl(''),
              incomingFlightKey: new NgcFormControl(''),
              incomingFlightDate: new NgcFormControl(''),
              bookedFlight: new NgcFormControl(''),
              bookedFlightDate: new NgcFormControl(''),
              manifestedFlight: new NgcFormControl(''),
              manifestedFlightDate: new NgcFormControl(''),
              storeLocation: new NgcFormControl(''),
              warehouseLocation: new NgcFormControl(''),
              manifestedUldTrolley: new NgcFormControl(''),
              damaged: new NgcFormControl(''),
              embargoFlag: new NgcFormControl(''),
              dsnRemark: new NgcFormControl(''),
              xrayResultFlag: new NgcFormControl(''),
              mssWeight: new NgcFormControl('')
            })
          ])
        })
      ])
    }),
    shpLoc: new NgcFormControl(),
    wareLoc: new NgcFormControl(),
    inventoryPopupArray: new NgcFormArray([])
  })

  screenModeFlag: boolean = true;
  processType: any;
  disableUpdateLocationButton: boolean = false;

  ngOnInit() {
    super.ngOnInit();
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    if (this.forwardedData) {
      if (this.forwardedData.dispatchseries) {
        let req: MailbagOverviewReqModel = new MailbagOverviewReqModel();
        req.dispatchSeries = this.forwardedData.dispatchseries;
        req.searchMode = 'OnInit';
        this.performSearch(req);
      } else {
        let req: MailbagOverviewReqModel = new MailbagOverviewReqModel();
        req.dispatchSeries = this.forwardedData.shipmentNumber;
        req.searchMode = 'OnInit';
        this.performSearch(req);
      }
    }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.mailbagOverviewForm.get(['searchFormGroup', 'byDisptachMode']).valueChanges.subscribe(disptachChangedValue => {
      if (disptachChangedValue == true) {
        this.screenModeFlag = true;
        this.isMailbagData = false;
        this.mailbagOverviewForm.get(['searchFormGroup', 'dispatchNumber']).reset();
        this.mailbagOverviewForm.get(['searchFormGroup', 'origin']).reset();
        this.mailbagOverviewForm.get(['searchFormGroup', 'destination']).reset();
      }
    });
    this.mailbagOverviewForm.get(['searchFormGroup', 'byUldMode']).valueChanges.subscribe(uldChangedValue => {
      if (uldChangedValue == true) {
        this.screenModeFlag = false;
        this.isMailbagData = false;
        this.mailbagOverviewForm.get(['searchFormGroup', 'uldtrolley']).reset();
      }
    });
  }

  onSearch() {
    this.isMailbagData = false;
    const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.mailbagOverviewForm.get('searchFormGroup'));
    const req: MailbagOverviewReqModel = new MailbagOverviewReqModel();
    if (this.screenModeFlag) {
      req.dispatchNumber = searchFormGroup.get('dispatchNumber').value;
      req.searchMode = 'ByDispatch';
    } else {
      req.uldtrolley = searchFormGroup.get('uldtrolley').value;
      req.searchMode = 'ByULD';
    }
    req.mailbagNumber = searchFormGroup.get('mailNumber').value;
    req.origin = searchFormGroup.get('origin').value;
    req.destination = searchFormGroup.get('destination').value;
    req.fromDate = searchFormGroup.get('fromDate').value;
    req.toDate = searchFormGroup.get('toDate').value;
    if (searchFormGroup.get('xrayresult').value) {
      req.xrayresult = searchFormGroup.get('xrayresult').value;
    } else {
      req.xrayresult = null;
    }
    this.performSearch(req);
  }

  performSearch(req): void {
    this.awbManagementService.getMailbagOverviewDetails(req).subscribe(response => {
      if (!this.showResponseErrorMessages(response, null, "searchFormGroup")) {
        this.searchResponse = response.data;
        if (response.data.length == 0) {
          this.showInfoStatus('export.no.records.available');
          this.updateLocFlag = false;
          this.isMailbagData = false;
        }
        else {
          this.updateLocFlag = true;
          this.isMailbagData = true;
        }
        if (this.searchResponse) {
          this.searchResponse.forEach(element => {
            element["check"] = false;
            let shpLocArray = [];
            let wareLOcArray = [];
            let manifestedUldArray = [];
            let totalPieces = 0;
            let totalWeight = 0;
            element.mailbagDetails.forEach(detailsEle => {
              totalPieces = totalPieces + detailsEle.pieces;
              totalWeight = totalWeight + detailsEle.weight;
              detailsEle.selectCheckBox = false;
              detailsEle.existingShipmentLocation = detailsEle.storeLocation;
              detailsEle.existingWarehouseLocation = detailsEle.warehouseLocation;
              if (detailsEle.storeLocation) {
                shpLocArray.push(detailsEle.storeLocation);
              }
              if (detailsEle.warehouseLocation) {
                wareLOcArray.push(detailsEle.warehouseLocation);
              }
              if (detailsEle.manifestedUldTrolley) {
                manifestedUldArray.push(detailsEle.manifestedUldTrolley);
              }
              if (detailsEle.incomingFlightKey) {
                detailsEle.incomingFlightDate = detailsEle.incomingFlightDate.toString().substring(0, 10);
                detailsEle.incomingFlightInfo = detailsEle.incomingFlightKey + "<br>" + detailsEle.incomingFlightDate;
              }
              if (detailsEle.bookedFlight) {
                detailsEle.bookedFlightDate = detailsEle.bookedFlightDate.toString().substring(0, 10);
                detailsEle.bookedFlightInfo = detailsEle.bookedFlight + "<br>" + detailsEle.bookedFlightDate;
              }
              if (detailsEle.manifestedFlight) {
                if (detailsEle.manifestedFlightDate) {
                  detailsEle.manifestedFlightDate = detailsEle.manifestedFlightDate.toString().substring(0, 10);
                  detailsEle.manifestedFlightInfo = detailsEle.manifestedFlight + "<br>" + detailsEle.manifestedFlightDate;
                }
                else {
                  detailsEle.manifestedFlightInfo = detailsEle.manifestedFlight;
                }

              }

            })
            element.shpPieces = totalPieces;
            element.shpWeight = totalWeight;
            shpLocArray = shpLocArray.filter((x, i, a) => a.indexOf(x) == i);
            wareLOcArray = wareLOcArray.filter((x, i, a) => a.indexOf(x) == i);
            manifestedUldArray = manifestedUldArray.filter((x, i, a) => a.indexOf(x) == i);
            element.uniqueShpLoc = shpLocArray.toString();
            element.uniqueWareLoc = wareLOcArray.toString();
            element.uniqueManUldLoc = manifestedUldArray.toString();
          });
          this.mailbagOverviewForm.get(['mailbagDetailsForm', 'mailbagDetailsList']).patchValue(this.searchResponse);
        }
      } else {
        this.isMailbagData = false;
        this.updateLocFlag = false;
      }
    });
  }

  openUpdateLocationPopUp() {
    this.mailbagOverviewForm.get('shpLoc').reset();
    this.mailbagOverviewForm.get('wareLoc').reset();
    let newArray = [];
    let childArray = [];
    let mailbagList: any = (<NgcFormArray>this.mailbagOverviewForm.get(['mailbagDetailsForm', 'mailbagDetailsList'])).getRawValue();
    mailbagList.forEach(elements => {
      if (elements.check) {
        newArray.push(elements);
      } else {
        elements.mailbagDetails.forEach(ele1 => {
          if (ele1.selectCheckBox) {
            childArray.push(ele1);
          }
        })
      }
    })
    if (!newArray.length && !childArray.length) {
      this.showErrorStatus('export.select.only.one.record');
      return;
    }
    let inventoryArray = [];
    this.resetFormMessages();
    for (const itr of newArray) {
      if (itr.status === 'DELIVERED') {
        this.showErrorStatus('mailbag.delivered');
        return;
      }
    }
    newArray.forEach(mailbagEle => {
      mailbagEle.mailbagDetails.forEach(inventoryEle => {
        inventoryArray.push(inventoryEle);
      });
    });
    if (!inventoryArray.length) {
      inventoryArray = childArray;
    }
    if (inventoryArray) this.mailbagOverviewForm.get('inventoryPopupArray').patchValue(inventoryArray);
    this.updateLocatioPopUp.open();
  }

  onSave() {

  }

  onSaveUpdateLocation(event) {
    let arrayInventories: any = (<NgcFormArray>this.mailbagOverviewForm.controls["inventoryPopupArray"]).getRawValue();
    if (this.specialCharCheck) {
      this.showErrorStatus('export.invalid.shipment.warehouse.location');
      return;
    }

    this.awbManagementService.checkForContentCode(arrayInventories).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.data[0].flightKey && data.data[0].flightDate) {
          this.placeHolders[0] = data.data[0].flightKey;
          this.placeHolders[1] = data.data[0].flightDate.substring(0, 10);
          this.showConfirmMessage(NgcUtility.translateMessage('uld.assigned.to.flight.confirmation', this.placeHolders)).then(fulfilled => {
            this.checkForShcsOtherThanMail(data.data);
          });
        } else {
          this.checkForShcsOtherThanMail(data.data);
        }
      }
    });
  }

  checkForShcsOtherThanMail(request) {
    this.awbManagementService.checkForShcsOtherThanMail(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.data[0].uldPopup) {
          this.showConfirmMessage('mailbag.uld.loaded.with.cargo').then(fulfilled => {
            this.checkForContainerDestination(data.data);
          });
        } else {
          this.checkForContainerDestination(data.data);
        }
      }
    });

  }

  checkForContainerDestination(request) {
    this.awbManagementService.checkForContainerDestination(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.data[0].containerDestination) {
          this.placeHolders[0] = data.data[0].containerDestination;
          this.showConfirmMessage(NgcUtility.translateMessage('uld.destination.different.confirmation', this.placeHolders)).then(fulfilled => {
            this.updatelocation(data.data);
          });
        } else {
          this.updatelocation(data.data);
        }

      }
    });
  }

  updatelocation(request) {

    this.awbManagementService.updateMailbagInvLocation(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.data) {
          this.onSearch();
          this.updateLocatioPopUp.close();
          this.showSuccessStatus("g.operation.successful");
        }
      }
    });

  }

  onClose(event) {
    this.updateLocatioPopUp.close();
  }

  getSelectedData(mailbagItem) {
    this.sendDataToCaptureDamage = mailbagItem.value;
  }

  onLinkClick(mailbagItem, index) {
    if (mailbagItem.column === 'damage') {
      var dataToSend = {
        entityKey: mailbagItem.record.mailBagNumber,
        entityType: "MBN"
      }
      this.navigateTo(this.router, 'common/capturedamageDesktop', dataToSend);
    }
    if (mailbagItem.column === 'history') {
      let requestParam = {
        shipmentId: mailbagItem.record.shipmentId,
        mailBagNumber: mailbagItem.record.mailBagNumber
      }
      this.awbManagementService.getAllStatusOfMailBag(requestParam).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.mailbagOverviewForm.get("allStatusFormGroup").reset();
          this.mailbagOverviewForm.get("allStatusFormGroup").patchValue(data.data);
          this.showPopUpWindow.open();
        }
      });

    }
  }

  appendZeroToDN(item) {
    let dn = this.mailbagOverviewForm.get('searchFormGroup.dispatchNumber').value;
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
    this.mailbagOverviewForm.get('searchFormGroup.dispatchNumber').patchValue(dn);
  }

  patchSameShpLocToMB(item) {
    let inventoryArray = this.mailbagOverviewForm.getRawValue().inventoryPopupArray;
    this.validateLocationWithNoSpecialCharacter(item);
    if (this.specialCharCheck) {
      this.showErrorStatus('export.invalid.shipment.warehouse.location');
      return;
    }
    let storeLocation: string = this.setShipmentLocation(item);
    inventoryArray.forEach(element => {
      element.flagCRUD = 'U';
      element.storeLocation = storeLocation;
    });
    this.mailbagOverviewForm.get('inventoryPopupArray').patchValue(inventoryArray);

  }

  patchSameWareLocToMB(item) {
    let inventoryArray = this.mailbagOverviewForm.getRawValue().inventoryPopupArray;
    if (this.specialCharCheck) {
      this.showErrorStatus('export.invalid.shipment.warehouse.location');
      return;
    }
    let storeLocation: string = this.setShipmentLocation(item);
    inventoryArray.forEach(element => {
      element.flagCRUD = 'U';
      element.warehouseLocation = storeLocation;
    });
    this.mailbagOverviewForm.get('inventoryPopupArray').patchValue(inventoryArray);
  }

  checkLoadedParent(index) {

    let allData: any = this.mailbagOverviewForm.getRawValue();
    let allShipments: any = allData.mailbagDetailsForm.mailbagDetailsList;
    if (allShipments[index].check) {
      let loaded: boolean = false;
      allShipments[index].mailbagDetails.map(element => {
        if (element.allStatus.loadedOn) {
          loaded = true;
        }
      })
      if (loaded) {
        this.disableUpdateLocationButton = true;
        return;
      } else {
        this.disableUpdateLocationButton = false;
      }
    }
    let i: number = 0;
    let loadedMailBag: boolean = false;
    allShipments.forEach(element => {
      if (element.check) {
        i++;
      }
    });
    if (i > 1) {
      allShipments.forEach(element => {
        element.mailbagDetails.forEach(element1 => {
          if (element.check && element1.allStatus.loadedOn) {
            loadedMailBag = true;
          }
        })
      });
      if (loadedMailBag) {
        this.disableUpdateLocationButton = true;
      } else {
        this.disableUpdateLocationButton = false;
      }
    }

  }

  checkLoadedChild(item, index) {
    if (item.column === 'selectCheckBox') {
      if (item.record.selectCheckBox) {
        if (item.record.allStatus.loadedOn) {
          this.disableUpdateLocationButton = true;
          return;
        } else {
          this.disableUpdateLocationButton = false;
        }
      }
    }
    let allData: any = this.mailbagOverviewForm.getRawValue();
    let allShipments: any = allData.mailbagDetailsForm.mailbagDetailsList;
    let i: number = 0;
    let loadedMailBag: boolean = false;
    allShipments.forEach(element => {
      element.mailbagDetails.forEach(element1 => {
        if (element1.selectCheckBox) {
          i++;
        }
      })
    });
    if (i > 1) {
      allShipments.forEach(element => {
        element.mailbagDetails.forEach(element1 => {
          if (element1.selectCheckBox && element1.allStatus.loadedOn) {
            loadedMailBag = true;
          }
        })
      });
      if (loadedMailBag) {
        this.disableUpdateLocationButton = true;
      } else {
        this.disableUpdateLocationButton = false;
      }
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
      this.showErrorStatus('export.invalid.shipment.warehouse.location');
      return;
    } else {
      this.specialCharCheck = false;
      this.refreshFormMessages(item);
    }
  }
}
