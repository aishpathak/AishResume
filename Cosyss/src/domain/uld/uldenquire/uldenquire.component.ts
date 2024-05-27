import { filter } from 'rxjs/operators';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, TemplateRef, EventEmitter, Input, Output } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcButtonComponent, PageConfiguration, NgcUtility, DateTimeKey, NgcWindowComponent } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { UldService } from '../uld.service';
import { UldEnquire } from '../uld.shared';
import { EquipmentRequestByULD } from '../../equipment/equipmentsharedmodel';
import { CapturePhotoComponent } from '../../common/camera/capturephoto/capturephoto.component';
import { ApplicationFeatures } from '../../common/applicationfeatures';
@Component({
  selector: 'app-uldenquire',
  templateUrl: './uldenquire.component.html',
  styleUrls: ['./uldenquire.component.css']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  focusToMandatory: true,
  focusToBlank: true
})

export class UldenquireComponent extends NgcPage implements OnInit {
  @Input('uldEnquireObject') uldEnquireObject;
  @Output()
  responseObject = new EventEmitter();
  outBoundFlightInfo: any;

  popup: boolean = false;
  showData: boolean = false;
  showMovementData: boolean = false;
  trolleyFlag: boolean = false;
  uldFlag: boolean = true;
  uldAndTrolley: any = ['ULD Number', 'Trolley Number'];
  incomingData: any;
  firstTimeUldCreatonDate: any;
  allShc: string;
  transferShipmentLocation: boolean = false;
  transferAssignUld: boolean = false;
  releaseBtAfterFlightComplete = false;
  templateRef: TemplateRef<any>;
  popUpWidth: Number;
  popUpHeight: Number;
  photoCaptured: boolean = false;
  /*Object for ULD Movement History Pop up*/
  uldMovementHistoryObject: any;
  showWindow: boolean = false;
  /*Object for EIR Pop up*/
  editViewSplitWindowObject: any;
  inputData = null;

  @ViewChild('parentWindow') parentWindow: NgcWindowComponent;
  /**Capture photo window */
  @ViewChild('capturePhoto') capturePhoto: NgcWindowComponent;
  @ViewChild('openUploadPhotoPopup') openUploadPhotoPopup: NgcWindowComponent;
  /**ULD Movement History window*/
  @ViewChild('movementHistoryPopUp') movementHistoryPopUp: NgcWindowComponent;
  /**Miantain EIC window*/
  @ViewChild('mainatainEicPopUp') mainatainEicPopUp: NgcWindowComponent;
  /**EIR window */
  @ViewChild('eirWindow') eirWindow: NgcWindowComponent;

  private uldEnquireForm: NgcFormGroup = new NgcFormGroup
    ({
      equipmentRequestId: new NgcFormControl(),
      uldTrolleyNumber: new NgcFormControl(),
      uldTrolley: new NgcFormControl('Uld Number'),
      trolley: new NgcFormControl(),
      uldShcs: new NgcFormControl(),
      releaseBtButton: new NgcFormControl("Release BT"),
      assignedFlight: new NgcFormGroup({
        flightKey: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        segment: new NgcFormControl(),
        contactType: new NgcFormControl(),
        std: new NgcFormControl()
      }),
      loadedShipment: new NgcFormGroup({
        totalShipment: new NgcFormControl(),
        totalPieces: new NgcFormControl(),
        totalWeight: new NgcFormControl(),
        maximumWeight: new NgcFormControl(),
        availableWeight: new NgcFormControl()
      }),
      shipmentList: new NgcFormArray([]),
      storedShipmentList: new NgcFormArray([]),
      movements: new NgcFormArray([]),
      photo: new NgcFormControl(''),
      capturePhotoList: new NgcFormArray([]),
      uploadedDocId: new NgcFormControl()

    });
  responseUldNumber: any;
  responseTrolleyNumber: any;

  public imageViewForm: NgcFormGroup = new NgcFormGroup({
    locationForFileUpload: new NgcFormControl(),
    entityType: new NgcFormControl('ULD'),
    documentName: new NgcFormControl()
  });


  constructor(
    appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router,
    private activatedRoute: ActivatedRoute,
    private uldService: UldService) { super(appZone, appElement, appContainerElement); }



  ngOnInit() {

    if (!NgcUtility.isBlank(this.uldEnquireObject)) {
      this.popup = true;
      this.trolleyFlag = false;
      this.uldEnquireForm.get('uldTrolleyNumber').patchValue(this.uldEnquireObject.parameter1);
      this.onSearch();
    }
    this.incomingData = this.getNavigateData(this.activatedRoute);
    this.uldService.uldinventoryData = this.getNavigateData(this.activatedRoute);
    if (this.incomingData) {
      this.uldEnquireForm.get('uldTrolleyNumber').patchValue(this.incomingData.uldNumber);
      this.onSearch();
    }
  }

  onSearch() {
    let requestData: any = new UldEnquire();
    if (this.trolleyFlag) {
      requestData.trolley = this.uldEnquireForm.get('trolley').value;
      requestData.uldTrolleyFlag = false;
    } else {
      requestData.uldTrolleyNumber = this.uldEnquireForm.get('uldTrolleyNumber').value;
      requestData.uldTrolleyFlag = true;
    }

    this.uldService.getUldEnquire(requestData).subscribe(res => {
      if (res.data) {
        this.outBoundFlightInfo = res.data;
        this.firstTimeUldCreatonDate = res.data.firstTimeCreationDate;
        this.resetFormMessages();
        if (res.data.shc) {
          res.data.shc = res.data.shc.toString();
        }
        if (res.data.assignedFlight) {
          res.data.assignedFlight.flightDate = NgcUtility.toDateFromLocalDate(res.data.assignedFlight.flightDate);
        } else {
          this.uldEnquireForm.get('assignedFlight').reset();
        }
        if (res.data.loadedShipment) {
          res.data.loadedShipment.totalWeight = 0;
          res.data.loadedShipment.totalPieces = 0;
        }
        if (res.data.shipmentList && res.data.shipmentList.length > 0) {
          res.data.shipmentList = res.data.shipmentList.map(element => {
            element.check = false;
            element.date = NgcUtility.toDateFromLocalDate(element.date);
            if (res.data.loadedShipment) {
              res.data.loadedShipment.totalWeight = res.data.loadedShipment.totalWeight + element.weight;
              res.data.loadedShipment.totalPieces = res.data.loadedShipment.totalPieces + element.pieces;
            }
            return element;
          });

          this.releaseBtAfterFlightComplete = true;
          if (res.data.movableLocationType === 'BT' || res.data.movableLocationType === 'MT') {
            if (res.data.authorizedUser && res.data.outBoundFlightId) {
              this.uldEnquireForm.get('releaseBtButton').enable();
            } else {
              this.uldEnquireForm.get('releaseBtButton').disable();
            }
          }
        }
        if (res.data.storedShipmentList && res.data.storedShipmentList.length > 0) {
          res.data.storedShipmentList = res.data.storedShipmentList.map(element => {
            element.check = false;
            element.date = NgcUtility.toDateFromLocalDate(element.date);
            if (res.data.loadedShipment) {
              res.data.loadedShipment.totalWeight = res.data.loadedShipment.totalWeight + element.weight;
              res.data.loadedShipment.totalPieces = res.data.loadedShipment.totalPieces + element.pieces;
            }
            return element;
          });
        }
        if (res.data.loadedShipment)
          res.data.loadedShipment.totalShipment = (res.data.storedShipmentList ? res.data.storedShipmentList.length : 0) + (res.data.shipmentList ? res.data.shipmentList.length : 0);
        if (res.data.loadedShipment && res.data.loadedShipment.maximumWeight > 0) {
          res.data.loadedShipment.availableWeight = res.data.loadedShipment.maximumWeight - res.data.loadedShipment.totalWeight;
        } else {
          this.uldEnquireForm.get('loadedShipment').reset();
        }
        if (res.data.movements && res.data.movements.length) {
          res.data.movements.forEach(element => {
            element.movementDateTime = NgcUtility.toDateFromLocalDate(element.movementDateTime);
            element.flightDate = NgcUtility.toDateFromLocalDate(element.flightDate);
            if (element.conditionType === 'Ser') {
              element.conditionType = 'Serviceable';
            } else if (element.conditionType === 'Dam') {
              element.conditionType = 'Damaged';
            }
          });

        }

        this.showMovementData = true;
        //this.uldService.getUserType()
        if (this.getUserProfile()) {
          requestData.userType = this.getUserProfile().userLoginCode;
          this.uldService.getUserType(requestData).subscribe(data => {
            if (data.data.userType && data.data.userType === "E") {
              this.showMovementData = false;
            } else {
              this.showMovementData = true;
            }
          })
        }

        this.showData = true;
        this.transferShipmentLocation = true;
        this.transferAssignUld = true;
        //this.showMovementData = true;
        if (this.trolleyFlag) {
          res.data.trolley = res.data.uldTrolleyNumber;
          res.data.uldTrolleyNumber = null;
        }
        this.uldEnquireForm.patchValue(res.data);
        if (res.data.trolley && !res.data.uldTrolleyNumber) {
          this.uldEnquireForm.get('uldTrolleyNumber').patchValue(res.data.trolley);
        }
        this.responseUldNumber = res.data.uldTrolleyNumber;
        this.responseTrolleyNumber = res.data.trolley;

        if (res.data.capturePhotoList && res.data.capturePhotoList.length > 0) {
          this.photoCaptured = true;
          this.uldEnquireForm.get('photo').patchValue('Y');
          res.data.capturePhotoList = res.data.capturePhotoList.map(element => {
            res.data.capturePhotoList.eventOfPhoto = element.eventOfPhoto;
            res.data.capturePhotoList.createdUserOfPhoto = element.createdUserOfPhoto;
            res.data.capturePhotoList.dateOfPhoto = element.dateOfPhoto;
            res.data.capturePhotoList.flightKeyDate = element.flightKey;
            res.data.capturePhotoList.flightDate = element.flightDate;
            element.uldno = this.uldEnquireForm.get('uldTrolleyNumber').value;;
            return element;
          });
        }
        else {
          this.uldEnquireForm.get('photo').patchValue('N');
        }
      } else {
        this.refreshFormMessages(res);
        this.showData = false;
        this.showMovementData = false;
      }
    })
  }

  uldTrolleySelect(item) {
    let itemData: string = this.uldEnquireForm.get('uldTrolley').value;
    if (itemData === 'ULD Number') {
      this.uldFlag = true;
      this.trolleyFlag = false;
      this.uldEnquireForm.get('uldTrolleyNumber').patchValue(this.responseUldNumber);
    }
    if (itemData === 'Trolley Number') {
      this.uldFlag = false;
      this.trolleyFlag = true;
      this.uldEnquireForm.get('trolley').patchValue(this.responseTrolleyNumber);
    }
  }

  onCancel(event) {
    this.navigateTo(this.router, '/uld/RetrieveULDLSPfromMHS', this.incomingData);
    //this.navigateBack(this.incomingData);
  }

  goToAuditTrail(item) {
    let request = new Object();
    let firstTimeCreationDateForUld = NgcUtility.toDateFromLocalDate(this.firstTimeUldCreatonDate);
    let tenantIdDateTime: any;
    if (this.getUserProfile()) {
      tenantIdDateTime = this.getUserProfile().loginTime
    }
    tenantIdDateTime = NgcUtility.addDate(NgcUtility.getDateOnly(tenantIdDateTime), 1, DateTimeKey.DAYS);


    request = { entityValue: this.uldEnquireForm.get('uldTrolleyNumber').value, fromDate: firstTimeCreationDateForUld, toDate: tenantIdDateTime, entityType: 'ULD' }
    this.navigateTo(this.router, '/audit/audittrailbyuldtrolley', request);


  }


  transferToShipmentLocation() {
    let shipmentData: any = (<NgcFormArray>this.uldEnquireForm.get("shipmentList")).getRawValue();
    if (shipmentData.length > 0) {
      shipmentData = shipmentData.filter(element => {
        return element.check;
      });
      if (shipmentData.length > 0 && shipmentData.length < 2) {
        let request = new Object();
        request = {
          shipmentNumber: shipmentData[0].shipmentNumber,
          flightKey: this.uldEnquireForm.get('assignedFlight.flightKey').value,
          flightDate: this.uldEnquireForm.get('assignedFlight.flightDate').value,
          uldTrolleyNumber: this.uldEnquireForm.get('uldTrolleyNumber').value,
          shipmentType: shipmentData[0].shipmentType
        }
        this.navigateTo(this.router, 'awbmgmt/shipmentLocation', request);
      }
      else {
        this.showErrorMessage('uld.please.select.one.awb.number');
        return;
      }
    }

    let storedShipmentData: any = (<NgcFormArray>this.uldEnquireForm.get("storedShipmentList")).getRawValue();
    if (storedShipmentData.length > 0) {
      storedShipmentData = storedShipmentData.filter(element => {
        return element.check;
      });
      if (storedShipmentData.length > 0 && storedShipmentData.length < 2) {
        let request = new Object();
        request = {
          shipmentNumber: storedShipmentData[0].shipmentNumber,
          flightKey: this.uldEnquireForm.get('assignedFlight.flightKey').value,
          flightDate: this.uldEnquireForm.get('assignedFlight.flightDate').value,
          uldTrolleyNumber: this.uldEnquireForm.get('uldTrolleyNumber').value,
          shipmentType: storedShipmentData[0].shipmentType
        }
        this.navigateTo(this.router, 'awbmgmt/shipmentLocation', request);
      }
      else {
        this.showErrorMessage('uld.please.select.one.awb.number');
        return;
      }
    }

  }

  transferToAssignUld() {
    let request = new Object();
    request = {
      flightKey: this.uldEnquireForm.get('assignedFlight.flightKey').value,
      flightOriginDate: this.uldEnquireForm.get('assignedFlight.flightDate').value,
      uldTrolley: this.uldEnquireForm.get('uldTrolley').value,
      trolley: this.uldEnquireForm.get('trolley').value,
      uldNumber: this.uldEnquireForm.get('uldTrolleyNumber').value
    }
    this.navigateTo(this.router, 'export/buildup/assign-uld-flight', request);
  }

  transferToCaptureInOutMvmnt() {
    let request = new Object();
    request = {
      uldTrolley: this.uldEnquireForm.get('uldTrolley').value,
      trolley: this.uldEnquireForm.get('trolley').value,
      uldNumber: this.uldEnquireForm.get('uldTrolleyNumber').value,
      type: 'MovementCondition'

    }
    this.navigateTo(this.router, '/uld/uldmovement', request);
  }

  releaseBT() {
    if (this.outBoundFlightInfo.trolley) {
      this.uldService.releaseBT(this.outBoundFlightInfo.trolley).subscribe(data => {
        if (data.success) {
          this.showSuccessStatus("g.operation.successful");
          this.onSearch();
        }
      })
    }
  }

  autoAppendZeros(item) {
    let trolleyNumber = this.uldEnquireForm.get('trolley').value;
    if (trolleyNumber && trolleyNumber.length == 6) {
      return;
    }
    if (trolleyNumber && trolleyNumber.length === 2) {
      trolleyNumber = trolleyNumber.substring(0, 2) + "0000";
    } else if (trolleyNumber && trolleyNumber.length === 3) {
      trolleyNumber = trolleyNumber.substring(0, 2) + "000" + trolleyNumber.substring(2);
    } else if (trolleyNumber && trolleyNumber.length === 4) {
      trolleyNumber = trolleyNumber.substring(0, 2) + "00" + trolleyNumber.substring(2);
    } else {
      // for AAT Tenant Logic
      console.log(trolleyNumber.substring(0, 2));
      if (trolleyNumber && trolleyNumber.length === 5) {
        if ((trolleyNumber.substring(0, 2) == 'BT' || trolleyNumber.substring(0, 2) == 'MT'
          || trolleyNumber.substring(0, 2) == 'PD' || trolleyNumber.substring(0, 3) == 'HPD')) {
          trolleyNumber = trolleyNumber.substring(0, 2) + "0" + trolleyNumber.substring(2);
        } else if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Uld_DisplayUldBt_AppendZerosOnTrolley)) {
          trolleyNumber = trolleyNumber.substring(0, 2) + "0" + trolleyNumber.substring(2);
        }
      } else {
        trolleyNumber = trolleyNumber.substring(0, 2) + "0" + trolleyNumber.substring(2);
      }
    }
    this.uldEnquireForm.get('trolley').patchValue(trolleyNumber);
  }
  openParentWindow(width?: number, height?: number) {
    const WIDTH = 900;
    const HEIGHT = 400;
    if (width && height) {
      this.popUpWidth = width;
      this.popUpHeight = height;
    }
    else {
      this.popUpWidth = WIDTH;
      this.popUpHeight = HEIGHT;
    }
    this.parentWindow.open();
  }

  /**Photo capture pop up */
  openPhotoPopUp() {
    this.photoCaptured = true;
    this.capturePhoto.open();
  }

  onClickOfLink(docId) {
    // request.source = 'DESKTOP';
    let req = new UldEnquire();
    req.uploadedDocId = docId;
    this.uldService.fetchPhotoForDocId(req).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.imageViewForm.get('documentName').setValue(response.data.documentName);
        this.openUploadPhotoPopup.open();
      }
    });


  }

  /** This method is used to open movement history pop up and show the details */
  movementHistory() {
    this.showWindow = true;
    this.uldMovementHistoryObject = this.uldEnquireForm.get('uldTrolleyNumber').value;
    this.movementHistoryPopUp.open();
  }

  /** Closes the movement history pop up */
  closeWindow() {
    this.uldMovementHistoryObject = null;
    this.movementHistoryPopUp.close();
  }

  /** Opens the Maintain EIC Component as a pop up */
  maintainEic() {
    this.showWindow = true;
    this.mainatainEicPopUp.open();
  }

  /** Closes the Maintain EIC pop up */
  maintainEicResponse() {
    this.mainatainEicPopUp.close();
  }

  /**EIR Details */
  viewEir() {
    this.showWindow = true;
    this.editViewSplitWindowObject = "View";
    let request: any = new EquipmentRequestByULD();
    request.equipmentRequestId = this.uldEnquireForm.get('equipmentRequestId').value;
    this.uldService.fetchEquipmentRequestData(request).subscribe(res => {
      if (!this.showResponseErrorMessages(res)) {
        this.inputData = res.data;
      }
    })
    this.eirWindow.open();
  }

  /**Close EIR */
  autoSearchAccessoryInfo() {
    this.eirWindow.close();
  }
}
