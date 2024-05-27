import { FlightpouchService } from './../flightpouch.service';
import { FlightPouchRequest, FlightPouchBO, FlightPouchResponse, Discrepancy, CopyRequestDetails } from './../flightpouch.shared';
import { DocumentService } from '../../document/document.service';
import { DocumentviewService } from "../../document/documentview/documentviewService";

import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, NgcWindowComponent, NgcInputComponent, PageConfiguration, NgcUtility
} from 'ngc-framework';

import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, OnInit, ViewChild, HostListener
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { flightpouchCpyReqAndCancelButtonService } from "../flightpouchCpyReqAndCancelButtonService";

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  // restorePageOnBack: true
})

export class AdddocumentComponent extends NgcPage implements OnInit {
  @ViewChild('window') window: NgcWindowComponent;
  @ViewChild('pouchId') pouchId: NgcInputComponent;
  @ViewChild('discRemarks') discRemarks: NgcInputComponent;
  @ViewChild('windowAlert') windowAlert: NgcWindowComponent;
  @ViewChild('UpdateDocument') UpdateDocument: NgcWindowComponent;

  copyRequestDetails: CopyRequestDetails = new CopyRequestDetails(); // Added By Abhishek

  displayFlag = false;
  resp: any;
  // loggedInUser = null;
  previousRoute: any;
  currentPouch: any;

  addDocumentForm: NgcFormGroup = new NgcFormGroup({
    pouchId: new NgcFormControl(''),
    flightId: new NgcFormControl(''),
    flightNumber: new NgcFormControl(''),
    flightOriDate: new NgcFormControl(''),
    phlocId: new NgcFormControl(''),
    locationName: new NgcFormControl(''),
    tempStatus: new NgcFormControl(''),
    phSeg: new NgcFormControl(''),
    fltPouchId: new NgcFormControl(),
    tempPouchId: new NgcFormControl(),
    summary: new NgcFormGroup({}),
    pouchDetails: new NgcFormArray([])
  })

  popupDiscForm: NgcFormGroup = new NgcFormGroup({
    discId: new NgcFormControl(),
    shipmentId: new NgcFormControl(''),
    awbNum: new NgcFormControl(''),
    awbCopyNum: new NgcFormControl(''),
    flightNumber: new NgcFormControl(''),
    flightDateOri: new NgcFormControl(''),
    sector: new NgcFormControl(''),
    discRemark: new NgcFormControl(''),
    discrepencydropdown: new NgcFormControl(),
    remarks: new NgcFormControl(''),
  })

  // windowAlertForm: NgcFormGroup = new NgcFormGroup({
  //   windowAlertDisplay: new NgcFormControl()
  // })

  constructor(appZone: NgZone, appElement: ElementRef, private documentService: DocumentService,
    appContainerElement: ViewContainerRef, private router: Router, private flightpouchService: FlightpouchService, private documentviewService: DocumentviewService,
    private flightpouchCpyReqAndCancelButtonService: flightpouchCpyReqAndCancelButtonService, private el: ElementRef) {
    super(appZone, appElement, appContainerElement);
    this.previousRoute = sessionStorage.getItem('previousRoute');
    console.log('Previous URL : ' + this.previousRoute);
    // if (this.previousRoute != null) {
    //   if (this.previousRoute.includes('flightpouch/finalize')) {
    //     this.getPouchDetailsByLegs(this.flightpouchService.addDocumentRequest);
    //   }
    // }
    sessionStorage.setItem('previousRoute', this.router.url);
  }

  ngOnInit() {
    super.ngOnInit();
    // this.loggedInUser = ''; //sessionDetails.userId;

    //ii)Display AwB Details which is passed from DocumentView Screen
    // this.flightpouchCpyReqAndCancelButtonService.getcpyRqAndCancelButtonDetails().subscribe(response => {
    //   this.copyRequestDetails = response.cpyReqDetails;
    // });
  }

  ngAfterViewInit() {
    this.pouchId.focus();
    // this.subscription = this.flightpouchCpyReqAndCancelButtonService.getcpyRqAndCancelButtonDetails().subscribe(response => {
    //   this.addDocumentForm.get("pouchId").setValue(response.cpyReqDetails.pouchId);
    //   this.onBlur();
    // });
  }

  public onPopupDiscrepancy(controls) {
    // if (controls.shipmentId.value == null) {
    //   return;
    // }
    this.window.open();
    if (controls.disc.value != null || controls.disc.value != '') {
      this.popupDiscForm.controls["discrepencydropdown"].setValue(controls.disc.value);
    }
    this.popupDiscForm.controls["remarks"].setValue('');
    if (controls.remark.value === "PART SHIPMENT") {
      this.popupDiscForm.controls["remarks"].setValue("");
    } else {
      this.popupDiscForm.controls["remarks"].setValue(controls.remark.value);
    }
    this.popupDiscForm.controls["awbNum"].setValue(controls.awbNum.value);
    this.popupDiscForm.controls["flightNumber"].setValue(this.addDocumentForm.get("flightNumber").value);
    this.popupDiscForm.controls["flightDateOri"].setValue(this.addDocumentForm.get("flightOriDate").value);
    this.popupDiscForm.controls["sector"].setValue(controls.locationName.value);
    this.popupDiscForm.controls["shipmentId"].setValue(controls.shipmentId.value);
    this.popupDiscForm.controls["awbNum"].setValue(controls.awbNum.value);
    this.popupDiscForm.controls["awbCopyNum"].setValue(controls.copyNum.value);
    this.popupDiscForm.controls["discId"].setValue(controls.discId.value);
    this.onSetFocusOnRemarks();
  }

  onSetFocusOnRemarks() {
    // this.addDocumentForm.controls.pouchId.setValue('.');
    if (this.window.isOpen()) {
      this.discRemarks.focus();
      // setTimeout(() => {
      this.addDocumentForm.controls.pouchId.setValue('');
      // }, 1);
    }
  }

  saveDiscrepancy() {
    let resp: any;
    let request: Discrepancy = new Discrepancy();
    request.discId = (this.popupDiscForm.get("discId") == null ? null : this.popupDiscForm.get("discId").value);
    request.flightId = this.addDocumentForm.get("flightId").value;
    request.shipmentId = this.popupDiscForm.get("shipmentId").value;
    request.awbNum = this.popupDiscForm.get("awbNum").value;
    request.discRemark = this.popupDiscForm.get("discrepencydropdown").value;
    request.remarks = this.popupDiscForm.get("remarks").value;
    request.awbCopyNum = this.popupDiscForm.get("awbCopyNum").value == null ? '0' : this.popupDiscForm.get("awbCopyNum").value;
    request.flightNumber = this.popupDiscForm.get("flightNumber").value;
    // request.sector = this.popupDiscForm.get("sector").value;
    request.flightDateOri = this.popupDiscForm.get("flightDateOri").value;

    this.flightpouchService.saveDiscrepancy(request).subscribe(responseBean => {
      if (!this.refreshFormMessages(responseBean)) {
        resp = responseBean.data;
        this.showSuccessStatus("export.discrepancy.updated");
        this.getPouchDetailsByLegs(this.requestOperation());
        this.pouchId.focus();
        this.window.hide();
      }
    }, error => {
      this.showErrorStatus("export.unable.add.discrepancy");
    });
  }

  deleteDiscrepancy() {
    let resp: any;
    let request: Discrepancy = new Discrepancy();
    request.flightId = this.addDocumentForm.get("flightId").value;
    request.shipmentId = this.popupDiscForm.get("shipmentId").value;
    request.discRemark = this.popupDiscForm.get("discrepencydropdown").value;
    request.awbNum = this.popupDiscForm.get("awbNum").value;
    request.awbCopyNum = this.popupDiscForm.get("awbCopyNum").value == null ? '0' : this.popupDiscForm.get("awbCopyNum").value;
    request.flightNumber = this.popupDiscForm.get("flightNumber").value;
    // request.sector = this.popupDiscForm.get("sector").value;
    request.flightDateOri = this.popupDiscForm.get("flightDateOri").value;

    this.flightpouchService.deleteDiscrepancy(request).subscribe(responseBean => {
      if (!this.refreshFormMessages(responseBean)) {
        resp = responseBean.data;
        this.showSuccessStatus("export.discrepancy.removed");
        this.popupDiscForm.controls.discrepencydropdown.setValue(null);
        this.getPouchDetailsByLegs(this.requestOperation());
        this.pouchId.focus();
        this.window.hide();
      }
    }, error => {
      this.showErrorStatus("export.error.occured");
    });
  }

  deleteAwb(controls) { // awb, pouch, docStatus, copyNum
    if (controls.docStatus.value != "In Pouch") {
      this.pouchId.focus();
      return;
    }
    if ("Finalized" === this.resp.summary.status || "Ready" == this.resp.summary.status
      || "Checkout" == this.resp.summary.status || 'Confirmed' == this.resp.summary.status) {
      this.showErrorStatus("export.flight.finalized.unable.to.remove.from.pouch");
      return;
    }
    let request: FlightPouchRequest = new FlightPouchRequest();
    request.flightNumber = this.addDocumentForm.get("flightNumber").value;
    request.flightOriDate = this.addDocumentForm.get("flightOriDate").value;
    request.pouchId = controls.fltPouchId.value;
    request.shipmentId = controls.shipmentId.value;
    request.awbNum = controls.awbNum.value;
    request.copyNum = controls.copyNum.value;
    request.pouchCode = controls.pouchId.value;
    request.locationName = controls.locationName.value;
    request.docType = controls.docType.value;
    request.shc = controls.shc.value;
    request.status = "Stored";
    // request.modifiedBy = this.loggedInUser;
    // alert(JSON.stringify(request))
    this.flightpouchService.deleteDoc(request).subscribe(responseBean => {
      this.showSuccessStatus("g.deleted.successfully");
      this.getPouchDetailsByLegs(this.requestOperation());
      this.pouchId.focus();
    }, error => {
      this.showErrorStatus("export.error.while.deleting");
    });
  }

  saveDocument() {
    if (this.addDocumentForm.get("tempStatus").value == "Finalized" || "Ready" == this.addDocumentForm.get("tempStatus").value
      || "Checkout" == this.addDocumentForm.get("tempStatus").value || 'Confirmed' == this.addDocumentForm.get("tempStatus").value
      || "Delivered" == this.addDocumentForm.get("tempStatus").value) {
      this.showErrorStatus("export.pouch.finalized.cannot.add.documents");
      return;
    }

    let requestList: FlightPouchRequest[] = [];
    let request: FlightPouchRequest = null;
    for (let obj of this.addDocumentForm.controls.pouchDetails.value) {
      if (obj.sel) {
        request = new FlightPouchRequest();
        request.shipmentId = obj.shipmentId;
        request.flightNumber = this.addDocumentForm.get("flightNumber").value;
        request.flightOriDate = this.addDocumentForm.get("flightOriDate").value;
        request.fltPouchId = this.addDocumentForm.get("fltPouchId").value;
        request.phlocId = this.addDocumentForm.get('phlocId').value;
        request.docStatus = 'In Pouch';
        request.tempType = "adddoc";
        request.awbNum = obj.awbNum;
        request.copyNum = obj.copyNum;
        request.locationName = obj.locationName;
        request.pouchCode = this.addDocumentForm.get("tempPouchId").value;
        request.docType = obj.docType;
        request.shc = obj.shc;
        // request.modifiedBy = this.loggedInUser;
        requestList.push(request);
        // request.returnDocFlag = obj.returnDocFlag;
      }
    }

    if (requestList.length == 0) {
      this.showErrorStatus("export.scan.atleast.one.document");
      return;
    }


    this.flightpouchService.addDocument(requestList).subscribe(responseBean => {
      this.showSuccessStatus("export.document.added.successfully");
      this.getPouchDetailsByLegs(this.requestOperation());
      this.pouchId.focus();
    }, error => {
      this.showErrorStatus("export.unable.add.documents");
    });
  }

  reQuery() {
    this.addDocumentForm.controls.pouchId.setValue(this.currentPouch);
    this.onBlur();
  }

  onBlur() {
    //Condition which removes focus from PouchID;  and keeps on 'Remarks' field ; when Discrepancy-window is opened
    if (this.window.isOpen()) {
      this.discRemarks.focus();
      return;
    }

    //Condition which keeps focus on PouchID and returns : when pouchId = empty and onBlur() is called
    if (this.addDocumentForm.get("pouchId").value == null || this.addDocumentForm.get("pouchId").value == "" || this.addDocumentForm.get("pouchId").value == undefined) {
      this.pouchId.focus();
      return;
    }

    let request: FlightPouchRequest = new FlightPouchRequest();
    request.tempType = "adddoc";

    if (this.addDocumentForm.get("pouchId").value == null || this.addDocumentForm.get("pouchId").value == undefined || this.addDocumentForm.get("pouchId").value == '') {
      request.pouchId = this.addDocumentForm.get("tempPouchId").value == null ? "" : this.addDocumentForm.get("tempPouchId").value.toUpperCase();
    } else {
      this.currentPouch = this.addDocumentForm.get("pouchId").value == null ? "" : this.addDocumentForm.get("pouchId").value.toUpperCase();
      request.pouchId = this.currentPouch;
    }
    if (request.pouchId) {
      let scanvalue = request.pouchId;
      //If PouchId is entered in Field
      if (scanvalue.length > 13) {
        this.getPouchDetailsByLegs(request);
      }
      //If AWB number is entered in Field
      else {
        let awb = "";
        let awbCopy = "";

        if (request.pouchId.includes('/')) {
          awb = request.pouchId.split("/")[0];
          awbCopy = request.pouchId.split("/")[1];
        } else {
          awb = request.pouchId;
          awbCopy = "0";
        }
        this.blurOnAWb(awb, awbCopy);
      }
    }
  }

  getPouchDetailsByLegs(request: any) {
    this.flightpouchService.addDocAndFinalizeDetails(request).subscribe(responseBean => {
      this.resp = responseBean.data;
      // console.log("sss: " + JSON.stringify(this.resp));
      if (!this.refreshFormMessages(responseBean)) {
        this.addDocumentForm.patchValue(this.resp);
        this.displayFlag = true;
        this.addDocumentForm.controls.tempStatus.setValue(this.resp.summary.status);
        this.checkbBoxFix();
        // this.showSuccessStatus("g.operation.successful");
      }
      // else {
      //   this.displayFlag = false;
      // }
      this.addDocumentForm.controls.pouchId.reset();
      this.pouchId.focus();
    }, error => {
      this.showErrorStatus("export.unable.fetch.details");
    });
  }

  checkbBoxFix() {
    for (let awb of (<NgcFormArray>this.addDocumentForm.controls.pouchDetails).controls) {
      awb.get('sel').setValue(false);
      // awb.get('selDisable').setValue(true); as said by madan sir
      awb.get('selDisable').setValue(false);
    }
  }

  validateIfDocumentCanBeAdded(pouchDetails, awb) {
    if (pouchDetails === null) {

      this.clearAndFocusOnAWBScan();
      this.showErrorStatus("export.scan.valid.pouch");
      return false;
    }

    let awbDetails: any;
    for (let index = 0; index < pouchDetails.length; index++) {
      let item = pouchDetails[index];
      if (item.hasOwnProperty('awbNum') && item['awbNum'] === awb) {
        awbDetails = pouchDetails[index];
      }
    };

    if (awbDetails === undefined) {

      this.clearAndFocusOnAWBScan();
      this.showErrorStatus("export.scanned.document.not.in.list");
      return false;
    }

    if (awbDetails.docStatus === 'Not Received') {
      this.clearAndFocusOnAWBScan();
      this.showErrorStatus(NgcUtility.translateMessage("export.document.not.yet.received", [awb]));

      return false;
    }


    if ((awbDetails.docStatus === 'In Pouch')) {
      this.clearAndFocusOnAWBScan();
      this.showErrorMessage(NgcUtility.translateMessage("export.document.in.pouch", [awb]));

      return false;
    }
    return true;
  }

  blurOnAWb(scnAwb, awbCopy) {
    if (this.resp === undefined) {
      this.clearAndFocusOnAWBScan();
      this.showErrorStatus("export.scan.valid.pouch.first");

      return false;
    }
    if (this.validateIfDocumentCanBeAdded(this.resp.pouchDetails, scnAwb)) {
      let count = 0;
      let foundFlage = false;
      for (let awb of (<NgcFormArray>this.addDocumentForm.controls.pouchDetails).controls) {
        if (awb.get('awbNum').value == scnAwb && awb.get('copyNum').value === awbCopy) {
          if (awb.get('sel').value) {
            this.clearAndFocusOnAWBScan();
            this.showErrorStatus(NgcUtility.translateMessage("error.awb.already.scanned",[scnAwb]));

            return;
          }

          awb.get('sel').setValue(true);
          awb.get('selDisable').setValue(false);
          count++;
          foundFlage = true;
          this.clearErrorList();
          this.pouchId.focus();
          this.addDocumentForm.controls.pouchId.setValue('');
          this.showInfoStatus(NgcUtility.translateMessage("info.doc.successfully.seletced",[awb.get('awbNum').value]));

        }
      }
      if (!foundFlage) {
        this.clearAndFocusOnAWBScan();
        this.showErrorStatus("export.document.not.belongs.to.this.pouch");

      }
    }
  }

  requestOperation() {
    let request: FlightPouchRequest = new FlightPouchRequest();
    request.tempType = "adddoc";
    request.pouchId = this.addDocumentForm.get("tempPouchId").value == null ? "" : this.addDocumentForm.get("tempPouchId").value;
    return request;
  }

  navigateFlightPouch() {
    this.router.navigate(['export/cdh/flightpouch/creation']);
  }

  navigatePouchVerifyScreen() {
    // let request: FlightPouchRequest = new FlightPouchRequest();
    // request.tempType = "finalize";
    // request.pouchId = this.addDocumentForm.get("tempPouchId").value;
    // this.flightpouchService.addDocumentRequest = request;
    this.router.navigate(['export/cdh/flightpouch/finalize']);
  }

  public navigateUpdateDocument(awb) {
    if (awb.copyReq.value === 'Y') {
      // let request: CopyRequestDetails = new CopyRequestDetails();
      // request.pouchId = this.addDocumentForm.get("tempPouchId").value.toUpperCase();
      // request.routerUrl = this.router.url;
      // request.awbNo = awb.awbNum.value;
      // this.flightpouchCpyReqAndCancelButtonService.sendcpyRqAndCancelButtonDetails(request);
      // this.router.navigate(['updatedocument']);
      this.documentviewService.sendAwbToUpdateDocument(awb.awbNum.value + '/' + awb.copyNum.value + '/' + awb.flightId.value);
      this.UpdateDocument.open();
    }
  }

  closeWindow() {
    this.UpdateDocument.hide();
  }

  onDiscrepancyWindowClose(event) {
    this.pouchId.focus();
  }

  pouchTrimming() {
    let trimmedPouchId = this.documentService.trimPouch(this.addDocumentForm.get("pouchId").value);
    this.addDocumentForm.controls.pouchId.setValue(trimmedPouchId);
    this.onBlur();
  }

  clearAndFocusOnAWBScan() {
    this.clearErrorList();
    this.flightpouchService.beepSound();
    this.pouchId.focus();
    // setTimeout(() => {
    this.addDocumentForm.controls.pouchId.setValue('');
    // }, 1);
  }

  // keepFocusOnPouchId(event) {
  //   const tagName = event.target.tagName.toLowerCase();
  //   if (tagName === 'input') {
  //     return false;
  //   }
  // }

  // datepipe(inputDate) {
  //   if ((inputDate === '') || (inputDate === null)) {
  //     return inputDate;
  //   } else {
  //     const parseDate = new Date(inputDate);
  //     return (parseDate.getDate() + this.getMonthName(parseDate.getMonth()) + parseDate.getFullYear());
  //   }
  // }

  // getMonthName(number) {
  //   const monthNames = new Array('Jan', 'Feb', 'Mar',
  //     'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  //     'Oct', 'Nov', 'Dec');
  //   return monthNames[number];
  // }

  // closeWindowAlert() {
  //   this.windowAlert.close();
  //   this.pouchId.focus();
  // }

  // Close windowAlert : when 'Enter' or 'Escape' is clicked
  // @HostListener('window:keyup', ['$event'])
  // keyEvent(event: KeyboardEvent) {
  //   if (event.keyCode === 13 || event.keyCode === 27) {
  //     this.windowAlert.close();
  //     // this.addDocumentForm.controls.pouchId.setValue('');
  //     // this.pouchId.focus();
  //   }
  //   if (event.keyCode === 9) {
  //     this.pouchId.focus();
  //   }
  // }

  // count = 0;
  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   var elem = this.el.nativeElement.querySelector('.tableBody');
  //   if (event.keyCode === 40) {
  //     this.count += 100;
  //     elem.scrollTop = this.count;
  //   } else if (event.keyCode === 38) {
  //     this.count -= 100;
  //     elem.scrollTop = this.count;
  //   }
  // }


}
