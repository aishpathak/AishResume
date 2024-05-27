import { Component, ElementRef, NgZone, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey, NgcFileUploadComponent } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { ActivatedRoute } from '@angular/router';
import { ExportService } from './../export.service';
import { AuditService } from "../.././audit/audit.service";
import { fchmod } from 'fs';
import { Subscription } from 'rxjs';






@Component({
  selector: 'app-e-awbmonitoring',
  templateUrl: './e-awbmonitoring.component.html',
  styleUrls: ['./e-awbmonitoring.component.scss']
})

@PageConfiguration({

  trackInit: true,
  callNgOnInitOnClear: true,
  focusToBlank: false,
  focusToMandatory: false,
  autoBackNavigation: true

})
export class EAWBMonitoringComponent extends NgcPage implements OnInit {

  constructor(appZone: NgZone, appElement: ElementRef, private activatedRoute: ActivatedRoute,
    appContainerElement: ViewContainerRef, private exportService: ExportService, private auditService: AuditService,) {
    super(appZone, appElement, appContainerElement);
  }
  data: any;
  @ViewChild('auditTrail') auditTrail: TemplateRef<any>;
  @ViewChild('windowFHL') windowFHL: TemplateRef<any>;
  @ViewChild('windowFWB') windowFWB: TemplateRef<any>;
  @ViewChild('parentWindow') parentWindow: NgcWindowComponent;
  @ViewChild('openUploadPhotoPopup') openUploadPhotoPopup: NgcWindowComponent;
  @ViewChild('uploadedfiles') uploadedfiles: NgcFileUploadComponent;
  templateRef: TemplateRef<any>;
  private dataRefreshSubscription: Subscription;
  private autoRefreshSubscription: Subscription;
  isClosePopupScreen: boolean = true;
  title: string;
  popUpWidth: Number;
  popUpHeight: Number;
  shipmentNumber: any;
  showPopUp: boolean = false;
  showDataOfListFlag: boolean = false;
  entityKey: any;



  private eawbsearchform: NgcFormGroup = new NgcFormGroup({

    shipmentNumber: new NgcFormControl(),
    carrier: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    fromDateTimeFlight: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), 0, DateTimeKey.MINUTES)),
    toDateTimeFlight: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES)),
    uldNumber: new NgcFormControl(),
    accType: new NgcFormControl(),
    fwbFromDateTime: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), 0, DateTimeKey.MINUTES)),
    fwbToDateTime: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES)),
    showBothAWB: new NgcFormControl(),
    seachWithFlightDate: new NgcFormControl(true),
    seachWithFWBRecv: new NgcFormControl(false),
    shc: new NgcFormControl(),
    autoRefresh: new NgcFormControl(false),
    rclOnly: new NgcFormControl(true),
    fwbStatus: new NgcFormControl(),


    eawbMonitoringList: new NgcFormArray([
      new NgcFormGroup({
        shipmentNumber: new NgcFormControl(),
        shipmentDate: new NgcFormControl(),
        flightKey: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        rclPieces: new NgcFormControl(),
        rclWeight: new NgcFormControl(),
        rclPiecesWeight: new NgcFormControl(),
        natureOfGoodsDescription: new NgcFormControl(),
        uldNumber: new NgcFormControl(),
        fwbPieces: new NgcFormControl(),
        fwbWeight: new NgcFormControl(),
        fwbPiecesWeight: new NgcFormControl(),
        totalhouses: new NgcFormControl(),
        fhlPieces: new NgcFormControl(),
        fhllWeight: new NgcFormControl(),
        fhlPiecesWeight: new NgcFormControl(),
        shcs: new NgcFormControl(),
        remainingTime: new NgcFormControl(),
        dateStd: new NgcFormControl(),
        dateEtd: new NgcFormControl(),
        dateAtd: new NgcFormControl(),
        fwbshc: new NgcFormControl(),
        rcs: new NgcFormControl(),
        cnsl: new NgcFormControl(),
        slacHAWB: new NgcFormControl(),
        slacAWB: new NgcFormControl(),
        slacCheck: new NgcFormControl(),
        messageProcessedDate: new NgcFormControl(),
        messageStatus: new NgcFormControl(),
        packagingType: new NgcFormControl(),
        fwbStatus: new NgcFormControl(),
        docReceived: new NgcFormControl(),
        tooltipData: new NgcFormControl(),
      })
    ]),
    inventoryListforaddphoto: new NgcFormArray([]),
    entityType: new NgcFormControl('AWB'),
  });


  ngOnInit() {
  }

  onQuery() {

    if (this.eawbsearchform.get('seachWithFlightDate').value == false &&
      this.eawbsearchform.get('seachWithFWBRecv').value == false) {
      this.showErrorMessage('select.flight.or.fwb.recv.date.from.to');
      return;
    }

    if (this.eawbsearchform.get('seachWithFlightDate').value == true
      && (this.eawbsearchform.get('fromDateTimeFlight').value == null
        || this.eawbsearchform.get('toDateTimeFlight').value == null)) {
      this.showErrorMessage('enter.flight.date.from.to');
      return;
    }
    if (this.eawbsearchform.get('seachWithFWBRecv').value == true
      && (this.eawbsearchform.get('fwbFromDateTime').value == null
        || this.eawbsearchform.get('fwbToDateTime').value == null)) {
      this.showErrorMessage('enter.fwb.recv.date.from.to');
      return;

    }

    let request = <NgcFormGroup>this.eawbsearchform.getRawValue();
    this.exportService.fetchEAWBMonitoring(request).subscribe(response => {
      this.showFormErrorMessages(response);
      this.data = response.data;

      if (response.messageList) {
        this.showDataOfListFlag = false;
        this.data = null;
      }
      let appendPiecesWeight = this.data;
      if (appendPiecesWeight != null) {
        appendPiecesWeight.forEach(element => {
          if (element.fhlPieces != null && element.fhlWeight != null) {
            element.fhlPiecesWeight = element.fhlPieces + "/" + element.fhlWeight;
          }
          if (element.fwbPieces != null && element.fwbWeight != null) {
            element.fwbPiecesWeight = element.fwbPieces + "/" + element.fwbWeight;
          }
          if (element.rclPieces != null && element.rclWeight != null) {
            element.rclPiecesWeight = element.rclPieces + "/" + element.rclWeight;
          }

          if (element.fwbStatus != null && element.fwbStatus == "FBL Only") {
            element.tooltipData = "Only FBL has been received";
          }
          if (element.fwbStatus != null && element.fwbStatus == "Waiting FWB") {
            element.tooltipData = "RCL completed and FWB not received";
          }
          if (element.fwbStatus != null && element.fwbStatus == "Waiting Cargo") {
            element.tooltipData = "FWB received, RCL not completed";
          }
          if (element.fwbStatus != null && element.fwbStatus == "Processing") {
            element.tooltipData = "The FWB is now processing by AAT and waiting for confirmation";
          }
          if (element.fwbStatus != null && element.fwbStatus == "Confirmed") {
            element.tooltipData = "The FWB has been verified and confirmed by AAT";
          }
          if (element.fwbStatus != null && element.fwbStatus == "Rejected") {
            element.tooltipData = "The FWB has been rejected by AAT";
          }
        });
      }
      this.eawbsearchform.get('eawbMonitoringList').patchValue(appendPiecesWeight);
      //this.tooltipData = "Test";
      if (this.data != null) {
        this.showDataOfListFlag = true;
      }
      console.log(this.eawbsearchform.value);

    }, error => {
      this.showErrorStatus(error);
    });



  }


  openAuditPage(index: any, event) {
    console.log(event);
    // this.shipmentNumber = null;
    this.shipmentNumber = this.eawbsearchform.get(['eawbMonitoringList', index, 'shipmentNumber']).value;
    console.log(this.eawbsearchform.get(['eawbMonitoringList', index, 'shipmentNumber']).value);
    console.log(index);
    console.log(this.eawbsearchform.get('eawbMonitoringList').value);
    this.templateRef = this.auditTrail;
    this.isClosePopupScreen = false;
    this.title = "audit.title.AWB";
    this.openParentWindow();
  }

  openParentWindow(width?: number, height?: number) {
    const WIDTH = 1600;
    const HEIGHT = 1000;
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

  autoSearchShipmentInfo($event) {
    this.onQuery();
  }

  closePopScreen() {
    this.isClosePopupScreen = true;
    this.parentWindow.close;
    // this.shipmentNumber = null;
  }


  onAddPhoto(index: any) {
    this.entityKey = this.eawbsearchform.get(['eawbMonitoringList', index, 'shipmentNumber']).value;
    console.log(this.eawbsearchform.get(['eawbMonitoringList', index, 'shipmentNumber']).value);

    this.openUploadPhotoPopup.open();


  }


  onChooseDocuments(uploadedfiles, event, entityKey) {
    let uploadePhotoList: Array<any> = uploadedfiles.getAllItems();
    const today = new Date();
    console.log(this.entityKey);


    //const day: string = NgcUtility.getDateTimeAsString(today);
    const day: string = NgcUtility.getDateTimeAsStringByFormat(today, 'DDMMM HH:mm');
    if (event && event.file)
      event.file.documentName = this.getUserProfile().userLoginCode + "_" + day + "_" + uploadePhotoList.length;
    event.file.entitykey = entityKey;

  }
  openFHL(index: any) {
    this.shipmentNumber = this.eawbsearchform.get(['eawbMonitoringList', index, 'shipmentNumber']).value;
    this.templateRef = this.windowFHL;
    this.isClosePopupScreen = false;
    this.title = "house.airway.bill.list";
    this.openParentWindow();
  }

  openFWB(index: any) {
    this.shipmentNumber = this.eawbsearchform.get(['eawbMonitoringList', index, 'shipmentNumber']).value;
    this.templateRef = this.windowFWB;
    this.isClosePopupScreen = false;
    this.title = "exp.acceptance.fwb";
    this.openParentWindow();
  }

  clickSearchWithFlight(active: any) {
    if (active) {
      this.eawbsearchform.get('seachWithFlightDate').patchValue(true);
      this.eawbsearchform.get('seachWithFWBRecv').patchValue(false);
      this.eawbsearchform.get('fwbFromDateTime').patchValue(null);
      this.eawbsearchform.get('fwbToDateTime').patchValue(null);
    }
  }

  clickSearchWithFWBDate(active: any) {
    if (active) {
      this.eawbsearchform.get('seachWithFlightDate').patchValue(false);
      this.eawbsearchform.get('seachWithFWBRecv').patchValue(true);
      this.eawbsearchform.get('fromDateTimeFlight').patchValue(null);
      this.eawbsearchform.get('toDateTimeFlight').patchValue(null);
    }
  }
  autoRefreshChange(event) {
    this.unsubscribeAutoRefresh();
    if (event == true) {
      this.dataRefreshSubscription = this.getTimer(30000).subscribe(data => {
        this.onQuery();
      });
    }

  }
  private unsubscribeAutoRefresh() {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = null;
    }
    if (this.dataRefreshSubscription) {
      this.dataRefreshSubscription.unsubscribe();
      this.dataRefreshSubscription = null;
    }
  }
  onClose() {
    this.openUploadPhotoPopup.close();
  }
}


