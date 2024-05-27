import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, NgcFileUploadComponent, NgcButtonComponent, NgcCapturePhotoComponent, NgcUtility, PageConfiguration, NgcReportComponent } from 'ngc-framework';

import { BuildupService } from './../buildup.service';
import { SearchSpecialCargoShipmentForHO, SpecialCargoHandover } from './../../export.sharedmodel';
import { uploadPhotodata, UploadedFiles } from './../../../../domain/common/common.sharedmodel'

//import { timeStamp } from 'console';

@Component({
  selector: 'app-special-cargo-handover',
  templateUrl: './special-cargo-handover.component.html',
  styleUrls: ['./special-cargo-handover.component.scss']
})

export class SpecialCargoHandoverComponent extends NgcPage {



  private response;
  flightKeyforDropdown: any;
  showFlag1 = true;
  navigateBackData: any;
  isPhotoSetupExists: boolean = false;
  hasReadPermission: boolean = false;
  @ViewChild('openUploadPhotoPopup') openUploadPhotoPopup: NgcWindowComponent;
  @ViewChild('uploadedfiles') uploadedfiles: NgcFileUploadComponent;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private buildupService: BuildupService, private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute, private router: Router, private _buildService: BuildupService) {
    super(appZone, appElement, appContainerElement);
  }

  private SpecialCargoHandoverForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    segmentId: new NgcFormControl(),
    atdetdstd: new NgcFormControl(),
    whLocation: new NgcFormControl(),
    select: new NgcFormControl(),
    uldBtNumber: new NgcFormControl(),
    shcGroup: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    partSuffix: new NgcFormControl(),
    bookingStatusCode: new NgcFormControl(),
    segment: new NgcFormControl(),
    currentSeg: new NgcFormControl(),
    origin: new NgcFormControl(),
    flightBookedPieces: new NgcFormControl(),
    shipmentInventoryShipmentLocation: new NgcFormControl(),
    requestPieces: new NgcFormControl(),
    shipmentInventoryPieces: new NgcFormControl(),
    rquestSummary: new NgcFormControl(),
    shipmentInventoryShipmentShc: new NgcFormControl(),
    requestSummary: new NgcFormControl(),
    readyShipment: new NgcFormArray([]),
    inventoryList: new NgcFormArray([]),
    requestList: new NgcFormArray([]),
    handoverFlag: new NgcFormControl(),
    handoverExpDateTime: new NgcFormControl(),
    handOverToCCStaffId: new NgcFormControl(),
    handoverToLoginId: new NgcFormControl(),
    staffName: new NgcFormControl(),
    sqCarrier: new NgcFormControl(),    
    handoverInventoryList: new NgcFormArray([
      new NgcFormGroup({
        handoverPieces: new NgcFormControl(),
        handoverWight: new NgcFormControl(),
        requestedWHLocation: new NgcFormControl(),
        requestedShipmentLocation: new NgcFormControl(),
        requstedShcList: new NgcFormArray([]),
      })
    ]),
    shipmentId: new NgcFormControl(),
    shipmentListFromWorkingList: new NgcFormArray([]),
    inventoryListforaddphoto: new NgcFormArray([]),
    entityType: new NgcFormControl('ULD')
  });

  ngOnInit() {
    this.navigateBackData = this.getNavigateData(this.activatedRoute);
    if (this.navigateBackData) {
      if (this.navigateBackData.flightKey) {
        this.SpecialCargoHandoverForm.get('flightKey').patchValue(this.navigateBackData.flightKey);
      }
      if (this.navigateBackData.flightDate) {
        this.SpecialCargoHandoverForm.get('flightDate').patchValue(this.navigateBackData.flightDate);
      }
      if (this.navigateBackData.shipmentListFromWorkingList) {
        this.SpecialCargoHandoverForm.get('shipmentListFromWorkingList').patchValue(this.navigateBackData.shipmentListFromWorkingList);
      }
      if (this.navigateBackData.shcGroup) {
        this.SpecialCargoHandoverForm.get('shcGroup').patchValue(this.navigateBackData.shcGroup);
      }
      this.flightForSegment();
      this.retrieveDropDownListRecords('FLIGHTSEGMENT', 'query', this.flightKeyforDropdown)
        .subscribe(value => {
          console.log("DropDownvalue", value);
          if (value.length > 0) {
            //   this.SpecialCargoHandoverForm.get('segmentId').patchValue(value[0].code);
            this.SpecialCargoHandoverForm.get('segmentId').patchValue(this.navigateBackData.segment);
            this.onSearch();
          }

        });

      // this.onSearch();
    }
  }
  dateFrom: any = NgcUtility.getCurrentDateOnly();

  onSearch() {
    this.hasReadPermission = NgcUtility.hasReadPermission('HANDOVER_CONFIRM');
    // console.log(this.SpecialCargoHandoverForm.get('flightKey').value + '-' + this.SpecialCargoHandoverForm.get('flightDate').value + '-' + this.SpecialCargoHandoverForm.get('segmentId').value + '-' + this.SpecialCargoHandoverForm.get('shcGroup').value)
    if (!this.SpecialCargoHandoverForm.get('flightKey').value || !this.SpecialCargoHandoverForm.get('flightDate').value
      || !this.SpecialCargoHandoverForm.get('segmentId').value || !this.SpecialCargoHandoverForm.get('shcGroup').value) {
      this.showErrorMessage('expaccpt.input.all.mandatory.details');
      return;
    }
    const searchReq = new SearchSpecialCargoShipmentForHO();
    searchReq.flightKey = this.SpecialCargoHandoverForm.get('flightKey').value;
    searchReq.flightDate = this.SpecialCargoHandoverForm.get('flightDate').value;
    searchReq.segmentId = this.SpecialCargoHandoverForm.get('segmentId').value;
    // searchReq.whLocation = this.SpecialCargoHandoverForm.get('whLocation').value;
    // searchReq.uldBtNumber = this.SpecialCargoHandoverForm.get('uldBtNumber').value;
    searchReq.shcGroup = this.SpecialCargoHandoverForm.get('shcGroup').value;
    searchReq.shipmentListFromWorkingList = this.SpecialCargoHandoverForm.get('shipmentListFromWorkingList').value;
    this.buildupService.specialCargoHandoverSearch(searchReq).subscribe((resp) => {
      this.resetFormMessages();
      // this.SpecialCargoHandoverForm.get('shipmentListFromWorkingList').patchValue(new Array());
      this.response = resp;
      if (this.response.success) {
        this.fetchHOPhotoSetup();
        this.SpecialCargoHandoverForm.get('sqCarrier').patchValue(this.response.data.sqCarrier);
        this.SpecialCargoHandoverForm.get('atdetdstd').patchValue(this.response.data.atdetdstd);
        this.SpecialCargoHandoverForm.get('handoverExpDateTime').setValue(new Date());
        this.SpecialCargoHandoverForm.get('readyShipment').patchValue(this.response.data.readyShipment);
        if (this.response.data.readyShipment == null || this.response.data.readyShipment.length === 0) {
          return this.showErrorMessage("NO_RECORDS_EXIST");
        }
        let shipmentLenght = (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment'])).length
        for (let i = 0; i < shipmentLenght; i++) {
          let inventoryLength = (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', i, 'inventoryList'])).length;

          for (let j = 0; j < inventoryLength; j++) {
            let inventoryShc = this.SpecialCargoHandoverForm.get(['readyShipment', i, 'inventoryList', j, 'inventoryShcForDisplay']).value;
            let requestedShcList = inventoryShc.split(',');
            let shclist: any = [];
            for (let shc of requestedShcList) {
              shclist.push({
                code: shc
              });
            }
            (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', i, 'inventoryList', j, 'handoverInventoryList'])).addValue([
              {
                requestedWHLocation: '',
                requestedShipmentLocation: '',
                requstedShcList: shclist,
                handoverPieces: '0',
                handoverWight: '0.0'
              }
            ]);
          }
        }
        if (this.SpecialCargoHandoverForm.get('handOverToCCStaffId')) { this.SpecialCargoHandoverForm.get('handOverToCCStaffId').reset(); }
        if (this.SpecialCargoHandoverForm.get('handoverToLoginId')) { this.SpecialCargoHandoverForm.get('handoverToLoginId').reset(); }
        if (this.SpecialCargoHandoverForm.get('staffName')) { this.SpecialCargoHandoverForm.get('staffName').reset(); }

      } else {
        this.showResponseErrorMessages(resp);
        this.refreshFormMessages(this.response);
      }
    });
  }

  /**
  * This function is responsible for adding new record to request Location
  */
  onAddLocation(index: any, subIndex: any) {
    (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', index, 'inventoryList', subIndex, 'handoverInventoryList'])).addValue([
      {
        requestedWHLocation: '',
        requestedShipmentLocation: '',
        requstedShcList: this.SpecialCargoHandoverForm.get(['readyShipment', index, 'inventoryList', subIndex, 'handoverInventoryList', 0, 'requstedShcList']).value,
        handoverPieces: '0',
        handoverWight: '0.0'
      }
    ]);
  }







  selectAll(value: any) {
    for (let i = 0; i < (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment'])).length; i++) {
      if (value) {
        this.SpecialCargoHandoverForm.get(['readyShipment', i, 'select']).patchValue(true);
      } else {
        this.SpecialCargoHandoverForm.get(['readyShipment', i, 'select']).patchValue(false);
        let inventoryLength = (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', i, 'inventoryList'])).length;
        for (let j = 0; j < inventoryLength; j++) {

          let data = (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', i, 'inventoryList', j, 'handoverInventoryList'])).getRawValue();
          data.forEach(element => {
            element.requestedShipmentLocation = null;
            element.requestedWHLocation = null;
          });
          (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', i, 'inventoryList', j, 'handoverInventoryList'])).patchValue(data);
        }
      }
    }
  }


  flightForSegment() {
    this.SpecialCargoHandoverForm.get('segmentId').reset();
    this.resetFormMessages();
    const searchReq = new SearchSpecialCargoShipmentForHO();
    searchReq.flightKey = this.SpecialCargoHandoverForm.get('flightKey').value;
    searchReq.flightDate = this.SpecialCargoHandoverForm.get('flightDate').value;
    if (searchReq.flightKey != null && searchReq.flightDate != null) {
      this.buildupService.validateFlight(searchReq).subscribe(response => {
        if (!response.data) {
          return this.showErrorMessage("invalid.flight");
        }
      });
    }
    if (this.SpecialCargoHandoverForm.get('flightDate').value) {
      this.flightKeyforDropdown = this.createSourceParameter(this.SpecialCargoHandoverForm.get('flightKey').value,
        this.SpecialCargoHandoverForm.get('flightDate').value);
    }
  }


  onDeleteRow(index: any, sindex: any, subIndex: any) {
    if (this.SpecialCargoHandoverForm.get(['readyShipment', index, 'inventoryList', sindex, 'handoverFlag']).value) {
      this.showConfirmMessage('export.wish.to.delete.confirmation').then(fulfilled => {
        let req = new SearchSpecialCargoShipmentForHO();
        let reqForShipmentNumber = this.SpecialCargoHandoverForm.get(['readyShipment', index]).value;
        req.shipmentNumber = reqForShipmentNumber.shipmentNumber;
        req.flightKey = this.SpecialCargoHandoverForm.get('flightKey').value;
        req.flightDate = this.SpecialCargoHandoverForm.get('flightDate').value;
        req.shipmentInventoryId = (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', index, 'inventoryList', sindex, 'shipmentInventoryId'])).value;
        req.whLocation = (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', index, 'inventoryList', sindex, 'shipmentInventoryShipmentLocation'])).value;
        this.buildupService.deleteHandover(req).subscribe(response => {
          if (response.data) {
            this.showSuccessStatus("g.completed.successfully");
            this.onSearch();
          }
        });


      });
    }
    else {
      /* //if (sindex === 0 && subIndex === 0) {
       let inventoryShc = this.SpecialCargoHandoverForm.get(['readyShipment', index, 'inventoryList', sindex, 'inventoryShcForDisplay']).value;
       let requestedShcList = inventoryShc.split(',');
       let shclist: any = [];
       for (let shc of requestedShcList) {
         shclist.push({
           code: shc
         });
       }
       (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', index, 'inventoryList', sindex, 'handoverInventoryList'])).addValue([
         {
           requestedShipmentLocation: '',
           requstedShcList: shclist,
           handoverPieces: '0',
           handoverWight: '0.0'
         }
       ]);
       //}*/
      (<NgcFormGroup>this.SpecialCargoHandoverForm.get(['readyShipment', index, 'inventoryList', sindex, 'handoverInventoryList', subIndex])).markAsDeleted();
    }

  }


  onHandover() {
    if (this.SpecialCargoHandoverForm.invalid) {
      return;
    }
    let searchForm: any = (<NgcFormArray>this.SpecialCargoHandoverForm.getRawValue());
    let formvalue: any = (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment'])).getRawValue();
    let request: any = [];
    this.SpecialCargoHandoverForm.get('handoverExpDateTime').setValue(new Date());
    formvalue.forEach(element => {
      if (element.select) {
        element.whLocation = this.SpecialCargoHandoverForm.get('whLocation').value;
        element.handOverToCCStaffId = this.SpecialCargoHandoverForm.get('handOverToCCStaffId').value;
        element.handoverToLoginId = this.SpecialCargoHandoverForm.get('handoverToLoginId').value;
        element.staffName = this.SpecialCargoHandoverForm.get('staffName').value;
        element.handoverExpDateTime = this.SpecialCargoHandoverForm.get('handoverExpDateTime').value;
        element.shcGroup = this.SpecialCargoHandoverForm.get('shcGroup').value;
        element.flightKey = this.SpecialCargoHandoverForm.get('flightKey').value;
        element.flightDate = this.SpecialCargoHandoverForm.get('flightDate').value;
        //for audit trail
        element.timeStamp = new Date();
        request.push(element);
      }
    });
    if (request.length === 0) {
      return this.showErrorMessage("ERR_SPECIALCARGO_15");
    }

    if (!this.SpecialCargoHandoverForm.get('handoverToLoginId').value && !this.SpecialCargoHandoverForm.get('handOverToCCStaffId').value) {
      this.showErrorMessage('ERR_SPECIALCARGO_16');
      return;
    }

    searchForm.readyShipment = request;
    this.buildupService.saveSpecialCargoHandover(searchForm).subscribe(response => {
      // console.log(response);
      // console.log(response.data[0].shipmentsWithoutPhoto);
      //if (response.data) {

      if (response.success) {
        let placeHolders: any = [];
        placeHolders[0] = response.data.shipmentsWithoutPhoto;
        if (response.data.shipmentsWithoutPhoto) {
          this.showConfirmMessage(NgcUtility.translateMessage("handover.photos.not.uploaded", placeHolders)).then(fulfilled => {
            searchForm.skipPromptFlag = true;
            // this.skipPromptFlag = true;
            this.buildupService.saveSpecialCargoHandover(searchForm).subscribe(response => {
              // console.log(response.data);
              if (response.data) {
                this.onSearch();
                this.showSuccessStatus("g.operation.successful");
              } else {
                this.showResponseErrorMessages(response);
              }
            });
          });

        } else {
          this.onSearch();
          this.showSuccessStatus("g.operation.successful");
        }
      } else {

        this.showResponseErrorMessages(response);
      }
    });
  }

  onVerify() {
    if (!this.SpecialCargoHandoverForm.get('handoverToLoginId').value) {
      this.showErrorMessage('export.enter.login.id');
      return;
    }
    const searchReq = new SearchSpecialCargoShipmentForHO();
    searchReq.handoverToLoginId = this.SpecialCargoHandoverForm.get('handoverToLoginId').value;
    this.buildupService.specialCargoHandoverUserProfileFetch(searchReq).subscribe((resp) => {
      this.response = resp;
      if (this.response.success) {
        if (this.response.data.staffName) {
          this.SpecialCargoHandoverForm.get('staffName').patchValue(this.response.data.staffName);
        } else {
          this.showErrorStatus('export.invalid.login.id');
          return;
        }

      } else {
        this.showResponseErrorMessages(resp);
        this.refreshFormMessages(this.response);
      }
    });
  }
  onClear(event) {
    if (this.navigateBackData == null) {
      this.reloadPage();
    }
    else {
      this.SpecialCargoHandoverForm.reset();
      this.resetFormMessages();
      this.SpecialCargoHandoverForm.get('flightDate').setValue(new Date());
      this.navigateBackData = null
      this.navigateTo(this.router, '/export/buildup/specialCargoHandover', null);
    }
  }
  onCancel() {
    this.navigateBack(this.navigateBackData);
  }

  onAdd() {
    if ((this.SpecialCargoHandoverForm.get('whLocation').value && this.SpecialCargoHandoverForm.get('uldBtNumber').value) ||
      (!this.SpecialCargoHandoverForm.get('whLocation').value && !this.SpecialCargoHandoverForm.get('uldBtNumber').value)) {
      this.showErrorMessage('ERR_SPECIALCARGO_11');
      return;
    }
    if (this.SpecialCargoHandoverForm.get('whLocation').invalid || this.SpecialCargoHandoverForm.get('uldBtNumber').invalid) {
      return;
    }
    let shipmentLenght = (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment'])).length
    for (let i = 0; i < shipmentLenght; i++) {
      if (this.SpecialCargoHandoverForm.get(['readyShipment', i, 'select']).value == true) {
        let inventoryLength = (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', i, 'inventoryList'])).length;
        for (let j = 0; j < inventoryLength; j++) {

          let data = (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', i, 'inventoryList', j, 'handoverInventoryList'])).getRawValue();
          data.forEach(element => {
            if (this.SpecialCargoHandoverForm.get('whLocation').value != null) {
              element.requestedWHLocation = this.SpecialCargoHandoverForm.get('whLocation').value;
            }
            else if (this.SpecialCargoHandoverForm.get('uldBtNumber').value != null) {
              element.requestedShipmentLocation = this.SpecialCargoHandoverForm.get('uldBtNumber').value;
            }
          });
          (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', i, 'inventoryList', j, 'handoverInventoryList'])).patchValue(data);
        }
      }
    }
    this.SpecialCargoHandoverForm.get('whLocation').reset();
    this.SpecialCargoHandoverForm.get('uldBtNumber').reset();
  }

  select(value: any, shipmentIndex: any) {
    if (!value) {
      let inventoryLength = (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', shipmentIndex, 'inventoryList'])).length;
      for (let j = 0; j < inventoryLength; j++) {

        let data = (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', shipmentIndex, 'inventoryList', j, 'handoverInventoryList'])).getRawValue();
        data.forEach(element => {
          element.requestedShipmentLocation = null;
          element.requestedWHLocation = null;
        });
        (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', shipmentIndex, 'inventoryList', j, 'handoverInventoryList'])).patchValue(data);
      }
    }
  }

  onRequest() {
    let formData = this.SpecialCargoHandoverForm.getRawValue();
    if (!formData.shcGroup) {
      this.showErrorMessage("ERR_SPECIALCARGO_17");
      return;
    }

    let navigateObj = {
      flightKey: formData.flightKey,
      flightDate: formData.flightDate,
      shcGroup: formData.shcGroup,
      segment: formData.segmentId
    }
    this.navigateTo(this.router, '/export/buildup/specialcargorequestbyhandover', navigateObj);


  }


  onAddPhoto() {
    let newinventorylist: any = [];
    let anyAwbSelected = false;
    let shipmentlist = (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment'])).getRawValue();
    //if any shipment is selected
    shipmentlist.forEach(item => {
      if (item.select) {
        anyAwbSelected = true;
        item.inventoryList.forEach(inventory => {
          inventory.handoverInventoryList.forEach(handoverLoc => {
            if (handoverLoc.requestedShipmentLocation && !handoverLoc.requestedWHLocation) {
              if (inventory.shipmentInventoryPartSuffix) {
                handoverLoc.identityKeyForImage = item.shipmentNumber + inventory.shipmentInventoryPartSuffix + handoverLoc.requestedShipmentLocation;
                handoverLoc.partsuffix = inventory.shipmentInventoryPartSuffix;
              }
              else {
                handoverLoc.identityKeyForImage = item.shipmentNumber + handoverLoc.requestedShipmentLocation;
              }

              handoverLoc.shipmentInventoryShipmentLocation = handoverLoc.requestedShipmentLocation;
              handoverLoc.handoverShipmentId = item.shipmentId;
              handoverLoc.flightId = item.flightId;
              newinventorylist.push(handoverLoc);
            }
            if (handoverLoc.requestedWHLocation && !handoverLoc.requestedShipmentLocation) {
              if (inventory.shipmentInventoryPartSuffix) {
                handoverLoc.identityKeyForImage = item.shipmentNumber + inventory.shipmentInventoryPartSuffix + handoverLoc.requestedWHLocation;
                handoverLoc.partsuffix = inventory.shipmentInventoryPartSuffix;
              }
              else {
                handoverLoc.identityKeyForImage = item.shipmentNumber + handoverLoc.requestedWHLocation;
              }

              handoverLoc.shipmentInventoryShipmentLocation = handoverLoc.requestedWHLocation;
              handoverLoc.handoverShipmentId = item.shipmentId;
              handoverLoc.flightId = item.flightId;
              newinventorylist.push(handoverLoc);
            }
          });
        });
      }
    });
    //if No shipment is selected
    if (newinventorylist.length === 0 && !anyAwbSelected) {
      shipmentlist.forEach(item => {
        if (!item.select) {
          item.inventoryList.forEach(inventory => {
            if (inventory.handoverFlag) {
              if (inventory.shipmentInventoryPartSuffix) {
                inventory.identityKeyForImage = item.shipmentNumber + inventory.shipmentInventoryPartSuffix + inventory.shipmentInventoryShipmentLocation;
                inventory.partsuffix = inventory.shipmentInventoryPartSuffix;
              } else {
                inventory.identityKeyForImage = item.shipmentNumber + inventory.shipmentInventoryShipmentLocation;
              }

              inventory.shipmentInventoryShipmentLocation = inventory.shipmentInventoryShipmentLocation;
              inventory.handoverShipmentId = item.shipmentId;
              inventory.flightId = item.flightId;
              newinventorylist.push(inventory);
            }
          });
        }
      });
    }

    if (newinventorylist.length === 0 && anyAwbSelected) {
      return this.showErrorMessage("SHPORWAREHOUSELOCATION");
    }
    if (newinventorylist.length === 0 && !anyAwbSelected) {
      return this.showErrorMessage("ERR_SPECIALCARGO_18");
    }
    this.SpecialCargoHandoverForm.get('inventoryListforaddphoto').patchValue(newinventorylist);
    this.openUploadPhotoPopup.open();
  }

  calculatePropotionalWeightforHandover(index: any, sindex: any, subIndex: any) {
    if (this.SpecialCargoHandoverForm.invalid) {
      return;
    }

    let request = (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', index, 'inventoryList', sindex])).value;
    request.requestingPieces = (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', index, 'inventoryList', sindex, 'handoverInventoryList', subIndex, 'handoverPieces'])).value;
    //(<NgcFormGroup>this.SpecialCargoHandoverForm.get(['readyShipment', index, 'inventoryList', sindex, 'handoverInventoryList', subIndex]))
    console.log(request);
    this.buildupService.calculatePropotionalWeightforHandover(request).subscribe(response => {
      if (this.showResponseErrorMessages(response)) {
        this.showResponseErrorMessages(response);
        return;
      } else {
        (<NgcFormArray>this.SpecialCargoHandoverForm.get(['readyShipment', index, 'inventoryList', sindex, 'handoverInventoryList', subIndex, 'handoverWight'])).patchValue(response.data.handoverWight)
      }
    })

  }
  fetchHOPhotoSetup() {
    const request = new SearchSpecialCargoShipmentForHO();
    request.shcGroup = this.SpecialCargoHandoverForm.get('shcGroup').value;
    this.buildupService.fetchHOPhotoSetup(request).subscribe(response => {
      if (response.data) {
        this.isPhotoSetupExists = true;

      }
    });
  }

  onChooseDocuments(uploadedfiles, event, loc, entityKey) {
    let uploadePhotoList: Array<any> = uploadedfiles.getAllItems();
    const today = new Date();

    //const day: string = NgcUtility.getDateTimeAsString(today);
    const day: string = NgcUtility.getDateTimeAsStringByFormat(today, 'DDMMM HH:mm');
    if (event && event.file)
      event.file.documentName = this.SpecialCargoHandoverForm.get('shcGroup').value + "_" + loc + "_" + this.getUserProfile().userLoginCode + "_" + day + "_" + uploadePhotoList.length;
    event.file.entitykey = entityKey;
  }

  onClickOk() {
    let inventoryList = (<NgcFormArray>this.SpecialCargoHandoverForm.get(['inventoryListforaddphoto'])).getRawValue();
    let handoverFlag = false;
    //call backened
    let requestList: any = [];

    inventoryList.forEach(inventory => {
      if (inventory.handoverFlag) {
        handoverFlag = true;
        const request = new SpecialCargoHandover();
        request.identityKeyForImage = inventory.identityKeyForImage;
        request.shipmentInventoryShipmentLocation = inventory.shipmentInventoryShipmentLocation;
        request.handoverLocation = inventory.shipmentInventoryShipmentLocation;
        request.handoverShipmentId = inventory.handoverShipmentId;
        request.flightId = inventory.flightId;
        request.partsuffix = inventory.partsuffix;
        requestList.push(request);
      }
    });

    if (handoverFlag) {
      this.buildupService.updatePhotoForHandoverLoc(requestList).subscribe(response => {
        if (response.data) {
        }
      });
      this.openUploadPhotoPopup.close();
    } else {
      this.openUploadPhotoPopup.close();
    }

  }


  getSegmentValue(event) {
    if (event) {
      this.retrieveDropDownListRecords('FLIGHTSEGMENT', 'query', this.flightKeyforDropdown)
        .subscribe(value => {
          if (value.length > 0) {
            for (let i = 0; i < value.length; i++) {
              if (value[i].code == event)
                this.SpecialCargoHandoverForm.get('currentSeg').patchValue(value[i].desc);
              this.SpecialCargoHandoverForm.get('origin').patchValue(NgcUtility.getTenantConfiguration().airportCode);
            }
          }
        });
    }
  }
}