import { FlightpouchService } from './../flightpouch.service';
import { FlightPouchRequest, FlightPouchBO, FlightPouchResponse, Discrepancy, CheckDocumentRequest, CopyRequestDetails } from './../flightpouch.shared';
import { DocumentService } from '../../document/document.service';

import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, NgcWindowComponent, NgcButtonComponent, NgcInputComponent,NgcUtility, BaseRequest, PageConfiguration
} from 'ngc-framework';

import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, OnInit, ViewChild, HostListener, OnDestroy
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { flightpouchCpyReqAndCancelButtonService } from "../flightpouchCpyReqAndCancelButtonService";
import { Subscription } from "rxjs";
import { DocumentviewService } from "../../document/documentview/documentviewService";

@Component({
  selector: 'app-finalize',
  templateUrl: './finalize.component.html',
  styleUrls: ['./finalize.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})

export class FinalizeComponent extends NgcPage implements OnInit, OnDestroy {
  @ViewChild('window') window: NgcWindowComponent;
  @ViewChild('verifyDocButton') verifyDocButton: NgcButtonComponent;
  @ViewChild('pouchId') pouchId: NgcInputComponent;
  @ViewChild('discRemarks') discRemarks: NgcInputComponent;
  // @ViewChild('windowAlert') windowAlert: NgcWindowComponent;
  @ViewChild('UpdateDocument') UpdateDocument: NgcWindowComponent;

  // loggedInUser = null;
  displayFlag = false;
  searchStatus: boolean;
  summaryPouchStatus = "";
  pouchStatus = "";
  resendDiscDisabled = true;
  resp: any;
  previousRoute: any;
  currentPouch: any;

  copyRequestDetails: CopyRequestDetails = new CopyRequestDetails();

  ngOnInit() {
    super.ngOnInit();
    // this.loggedInUser = ''; //sessionDetails.userId
  }

  ngAfterViewInit() {
    this.pouchId.focus();
    // this.subscription = this.flightpouchCpyReqAndCancelButtonService.getcpyRqAndCancelButtonDetails().subscribe(response => {
    //   this.finalizeForm.get("pouchId").setValue(response.cpyReqDetails.pouchId);
    //   this.getPouchDetailsByLegs();
    // });
  }

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private documentService: DocumentService,
    private router: Router, private flightpouchService: FlightpouchService, private documentviewService: DocumentviewService,
    private flightpouchCpyReqAndCancelButtonService: flightpouchCpyReqAndCancelButtonService, private el: ElementRef) {
    super(appZone, appElement, appContainerElement);
    this.previousRoute = sessionStorage.getItem('previousRoute');
    console.log('VERIFY/FINALIZE : ' + this.previousRoute);
    sessionStorage.setItem('previousRoute', this.router.url);
  }

  finalizeForm: NgcFormGroup = new NgcFormGroup({
    pouchId: new NgcFormControl(''),
    flightId: new NgcFormControl(''),
    flightNumber: new NgcFormControl(''),
    flightOriDate: new NgcFormControl(''),
    phlocId: new NgcFormControl(''),
    locationName: new NgcFormControl(''),
    manifestStatus: new NgcFormControl(''),
    PouchStatus: new NgcFormControl(),
    fltPouchId: new NgcFormControl(),
    tempPouchId: new NgcFormControl(''),
    status: new NgcFormControl(),
    eccCheckY: new NgcFormControl(),
    summary: new NgcFormGroup({
      total: new NgcFormControl(),
      expected: new NgcFormControl(),
      inPouch: new NgcFormControl(),
      status: new NgcFormControl()
    }),
    pouchDetails: new NgcFormArray([])
  })

  popupDiscForm: NgcFormGroup = new NgcFormGroup({
    discId: new NgcFormControl(''),
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

  public onPopupDiscrepancy(controls) {
    this.window.open();
    if (controls.disc.value != null || controls.disc.value != '') {
      this.popupDiscForm.controls["discrepencydropdown"].setValue(controls.disc.value);
    }
    if (controls.remark.value === "PART SHIPMENT") {
      this.popupDiscForm.controls["remarks"].setValue("");
    } else {
      this.popupDiscForm.controls["remarks"].setValue(controls.remark.value);
    }
    this.popupDiscForm.controls["awbNum"].setValue(controls.awbNum.value);
    this.popupDiscForm.controls["flightNumber"].setValue(this.finalizeForm.get("flightNumber").value);
    this.popupDiscForm.controls["flightDateOri"].setValue(this.finalizeForm.get("flightOriDate").value);
    this.popupDiscForm.controls["sector"].setValue(controls.locationName.value);
    this.popupDiscForm.controls["shipmentId"].setValue(controls.shipmentId.value);
    this.popupDiscForm.controls["awbCopyNum"].setValue(controls.copyNum.value);
    this.popupDiscForm.controls["discId"].setValue(controls.discId.value);
    this.onSetFocusOnRemarks();
  }

  onSetFocusOnRemarks() {
    this.finalizeForm.controls.pouchId.setValue('.');
    if (this.window.isOpen()) {
      this.discRemarks.focus();
      // setTimeout(() => {
      this.finalizeForm.controls.pouchId.setValue('');
      // }, 1);
    }
  }

  saveDiscrepancy() {
    let resp: any;
    let request: Discrepancy = new Discrepancy();
    request.discId = (this.popupDiscForm.get("discId") == null ? null : this.popupDiscForm.get("discId").value);
    request.flightId = this.finalizeForm.get("flightId").value;
    request.shipmentId = this.popupDiscForm.get("shipmentId").value;
    request.awbNum = this.popupDiscForm.get("awbNum").value;
    request.discRemark = this.popupDiscForm.get("discrepencydropdown").value;
    request.remarks = this.popupDiscForm.get("remarks").value;
    request.awbCopyNum = this.popupDiscForm.get("awbCopyNum").value;
    request.flightNumber = this.popupDiscForm.get("flightNumber").value;
    // request.sector = this.popupDiscForm.get("sector").value;
    request.flightDateOri = this.popupDiscForm.get("flightDateOri").value;
    // request.modifiedBy = this.loggedInUser;

    this.flightpouchService.saveDiscrepancy(request).subscribe(responseBean => {
      if (!this.refreshFormMessages(responseBean)) {
        resp = responseBean.data;
        this.showSuccessStatus("export.discrepancy.updated");
        this.addDocAndFinalizeDetails(this.requestOperation());
        this.window.hide();
      }
    }, error => {
      this.showErrorStatus("export.unable.save.discrepancy");
    });
  }

  deleteDiscrepancy() {
    let resp: any;
    let request: Discrepancy = new Discrepancy();
    request.flightId = this.finalizeForm.get("flightId").value;
    request.shipmentId = this.popupDiscForm.get("shipmentId").value;
    request.discRemark = this.popupDiscForm.get("discrepencydropdown").value;
    request.awbCopyNum = this.popupDiscForm.get("awbCopyNum").value;
    request.awbNum = this.popupDiscForm.get("awbNum").value;
    request.flightNumber = this.popupDiscForm.get("flightNumber").value;
    // request.sector = this.popupDiscForm.get("sector").value;
    request.flightDateOri = this.popupDiscForm.get("flightDateOri").value;

    this.flightpouchService.deleteDiscrepancy(request).subscribe(responseBean => {
      if (!this.refreshFormMessages(responseBean)) {
        resp = responseBean.data;
        this.showSuccessStatus("export.discrepancy.removed");
        this.popupDiscForm.controls.discrepencydropdown.setValue(null);
        this.addDocAndFinalizeDetails(this.requestOperation());
        this.window.hide();
      }
    }, error => {
      this.showErrorStatus("export.unable.delete.discrepancy");
    });
  }

  deleteAwb(controls) { //awb, pouch, docStatus, copyNum
    if (controls.docStatus.value != "In Pouch") {
      return;
    }
    if (this.verifyDocButton.value === 'finalize.unfinalize') {
      this.showErrorStatus("export.flight.finalized.unable.to.remove.from.pouch");
      return;
    }
    let request: FlightPouchRequest = new FlightPouchRequest();
    request.flightNumber = this.finalizeForm.get("flightNumber").value;
    request.flightOriDate = this.finalizeForm.get("flightOriDate").value;
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

    this.flightpouchService.deleteDoc(request).subscribe(responseBean => {
      this.showSuccessStatus("g.deleted.successfully");
      this.addDocAndFinalizeDetails(this.requestOperation());
    }, error => {
      this.showErrorStatus("export.error.while.deleting");
    });
  }

  statusDoc() {
    if (this.verifyDocButton.value === 'finalize.verify') {
      this.verifyDoc();
    } else if (this.verifyDocButton.value === 'finalize.finalize') {
      this.finalizeDoc();
    } else if (this.verifyDocButton.value === 'finalize.unfinalize') {
      this.unFinalizeDoc();
    }
  }

  verifyDoc() {
    if (this.finalizeForm.get('status').value === 'Verified') {
      this.showErrorStatus("export.pouch.already.verified");
      return;
    }
    // If checkIfDocCanBeVerified() method RETURNS (Y -> then verifyDoc) (N -> Display Prompt)
    let checkDocumentRequest: CheckDocumentRequest = new CheckDocumentRequest();
    checkDocumentRequest.flightId = this.finalizeForm.get("flightId").value;

    this.flightpouchService.checkIfDocCanBeVerified(checkDocumentRequest).subscribe(responseBean => {

      //DO NOT VERIFY POUCH : If checkIfDocCanBeVerified returns "N"
      if (responseBean.data === 'Y') {
        this.showWarningStatus("export.verification.cannot.done.now");
      }
      // VERIFY POUCH : Added ">0" condition for Pouch in which there are documents : i.e NIL POUCH = N
      else if (responseBean.data === 'N' && this.finalizeForm.controls.pouchDetails.value.length > 0) {

        let requestList: FlightPouchRequest[] = [];
        let request: FlightPouchRequest = null;

        //Validations Added : As per discussion with Lingaraj Start : Dont Allow Verification , Till Documents with 'Doc-Type' null , are added in Pouch
        let docsWithDocTypeNullFlag = false;
        let docWithDisc = false;
        for (var i = 0; i < this.resp.pouchDetails.length; i++) {
          if ((this.resp.pouchDetails[i]['disc'] !== null)) {
            docWithDisc = true;
            break;
          }
        }
        if (!docWithDisc) {
          for (var i = 0; i < this.resp.pouchDetails.length; i++) {
            if (this.resp.pouchDetails[i]['docType'] === null && this.resp.pouchDetails[i]['docStatus'] != 'In Pouch') {
              docsWithDocTypeNullFlag = true;
              break;
            }
          }
        }

        if (docsWithDocTypeNullFlag) {
          this.showErrorStatus("export.pouch.documents.should.tally");
          return;
        }

        for (let obj of this.finalizeForm.controls.pouchDetails.value) {
          if (obj.returnDocFlag == 'Y') {
            this.showErrorStatus("export.remove.returned.documents");
            return;
          }
          if (obj.bookingCancelFlag == "Y") {
            this.showErrorStatus("export.remove.cancelled.booking.records");
            return;
          }
          if (obj.docStatus === "Received" && obj.docType != 'ECC' && obj.docType != 'EAW' && obj.docType != 'TCC') {
            this.showErrorStatus("export.before.verification.validation");
            return;
          }

          if (obj.sel == true) {

            if (obj.docStatus === "Finalized") {
              this.showErrorStatus("export.uncheck.finalized.documents");
              return;
            }

            request = new FlightPouchRequest();
            request.fltPouchId = this.finalizeForm.get("fltPouchId").value;
            request.docStatus = "In Pouch";
            request.shipmentId = obj.shipmentId;
            request.copyNum = obj.copyNum;

            request.flightNumber = this.finalizeForm.get("flightNumber").value;
            request.flightOriDate = this.finalizeForm.get("flightOriDate").value;
            request.phlocId = this.finalizeForm.get('phlocId').value;
            request.awbNum = obj.awbNum;
            request.locationName = obj.locationName;
            request.pouchCode = this.finalizeForm.get("tempPouchId").value;
            request.pouchId = this.finalizeForm.get("tempPouchId").value; // TO CHECK MANIFEST STATUS
            request.docType = obj.docType;
            request.shc = obj.shc;
            requestList.push(request);
          }
          else {
            if (!(obj.docStatus == 'Received')) {
              if (obj.docStatus === "In Pouch" && obj.pouchId == this.finalizeForm.controls.tempPouchId.value) {
                this.showErrorStatus("export.scan.required.documents.for.verfication");
                return;
              }
            }
            if (obj.docType === "ECC" && !(obj.docStatus === 'Not Received') && !(obj.disc)) {
              this.showErrorStatus("export.add.all.ecc.documents");
              return;
            }
          }
        }

        this.flightpouchService.verifyDoc(requestList).subscribe(responseBean => {
          if (responseBean.data == null) {
            this.showErrorStatus("export.document.should.be.in.pouch.for.verification");
            return;
          }
          if (!this.refreshFormMessages(responseBean)) {
            this.showSuccessStatus("export.verified.succesfully");
            this.addDocAndFinalizeDetails(this.requestOperation());
          }
        }, error => {
          this.showErrorStatus("export.error.while.verify");
        });

      }
      //VERIFY POUCH : Added "=== 0" condition for Pouch in which there are NO documents : i.e NIL POUCH = Y
      else if (responseBean.data === 'N' && this.finalizeForm.controls.pouchDetails.value.length == 0) {

        let checkDocumentRequest: CheckDocumentRequest = new CheckDocumentRequest();
        checkDocumentRequest.flightId = this.finalizeForm.get("flightId").value;

        this.flightpouchService.checkNilPouchRequired(checkDocumentRequest).subscribe(responseBean => {
          let requestList2: FlightPouchRequest[] = [];
          let request2: FlightPouchRequest = new FlightPouchRequest();
          request2.fltPouchId = this.finalizeForm.get("fltPouchId").value;
          request2.pouchId = this.finalizeForm.get("tempPouchId").value;
          // request2.modifiedBy = this.loggedInUser;
          requestList2.push(request2);

          this.flightpouchService.verifyDoc(requestList2).subscribe(responseBean => {
            if (!this.refreshFormMessages(responseBean)) {
              this.showSuccessStatus("export.verified.succesfully");
              this.addDocAndFinalizeDetails(this.requestOperation());
            }
          }, error => {
            this.showErrorStatus("export.unable.to.verify");
          });
        }, error => {
          this.showErrorStatus("export.error.while.nil.pouch");
        });
      }
    }, error => {
      this.showErrorStatus("export.unable.to.verify");
    });
  }

  finalizeDoc() {
    if (this.finalizeForm.get('status').value === 'Finalized') {
      this.showErrorStatus("export.pouch.finalized");
      return;
    }
    // Added as per discussion with Lingaraj Start : To Display Message to create DOC_Copy for the Documents in which Copy-Req Icon is displaying
    let copyCount = 0;
    let cancelCount = 0;
    (<NgcFormArray>this.finalizeForm.get("pouchDetails")).controls.forEach((item) => {
      if (item.get('copyReq').value == 'Y' && item.get('disc').value == null) {
        copyCount++;
      }
      if (item.get('bookingCancelFlag').value == "Y") {
        cancelCount++;
      }
    });

    if (copyCount > 0) {
      this.showErrorStatus("export.create.copy.for.documents.which.require");
      return;
    }

    if (cancelCount > 0) {
      this.showErrorStatus("export.remove.records.cancelled.booking");
      return;
    }

    this.resendDiscDisabled = false;
    let request: FlightPouchRequest = new FlightPouchRequest();
    request.flightId = this.finalizeForm.get("flightId").value;
    request.flightNumber = this.finalizeForm.get("flightNumber").value;
    request.flightOriDate = this.finalizeForm.get("flightOriDate").value;
    request.pouchId = this.finalizeForm.get("tempPouchId").value;
    request.fltPouchId = this.finalizeForm.get("fltPouchId").value;
    request.locationName = this.finalizeForm.get("locationName").value;
    request.isECCCheck = this.finalizeForm.get("eccCheckY").value == 'Y' ? true : false;
    request.pouchStatus = 'Finalized';
    // request.modifiedBy = this.loggedInUser;
    this.flightpouchService.finalizeDoc(request).subscribe(responseBean => {
      if (!this.refreshFormMessages(responseBean)) {
        this.showSuccessStatus("export.finalized.successfully");
        this.addDocAndFinalizeDetails(this.requestOperation());
      }
    }, error => {
      this.showErrorStatus("export.unable.to.finalize");
    });
  }

  unFinalizeDoc() {
    this.resendDiscDisabled = true;
    let request: FlightPouchRequest = new FlightPouchRequest();
    request.flightId = this.finalizeForm.get("flightId").value;
    request.flightNumber = this.finalizeForm.get("flightNumber").value;
    request.flightOriDate = this.finalizeForm.get("flightOriDate").value;
    request.fltPouchId = this.finalizeForm.get("fltPouchId").value;
    request.pouchId = this.finalizeForm.get("tempPouchId").value;
    request.locationName = this.finalizeForm.get("locationName").value;
    request.isECCCheck = this.finalizeForm.get("eccCheckY").value == 'Y' ? true : false;
    request.pouchStatus = 'In Progress';
    // request.modifiedBy = this.loggedInUser;
    this.flightpouchService.finalizeDoc(request).subscribe(responseBean => {
      if (responseBean.data == null) {
        this.showErrorStatus("export.not.finalized.yet");
        return;
      }
      this.showSuccessStatus("export.unfinalized.successfully");
      this.addDocAndFinalizeDetails(this.requestOperation());
    }, error => {
      this.showErrorStatus("export.unable.to.unfinalize");
    });
  }

  pouchTrimming() {
    let trimmedPouchId = this.documentService.trimPouch(this.finalizeForm.get("pouchId").value);
    this.finalizeForm.controls.pouchId.setValue(trimmedPouchId);
    this.getPouchDetailsByLegs();
  }

  getPouchDetailsByLegs() {

    // Condition which keeps focus on PouchID and returns : when pouchId = empty and onBlur() is called
    if (this.finalizeForm.get("pouchId").value == null || this.finalizeForm.get("pouchId").value == "" || this.finalizeForm.get("pouchId").value == undefined) {
      this.pouchId.focus();
      return;
    }

    // Condition : If AWB is Scanned , Before Scanning Pouch
    if (this.finalizeForm.get("pouchId").value.length === 11 && this.pouchStatus === '') {
      this.clearAndFocusOnAWBScan();
      this.showErrorStatus('export.scan.pouch');
     
      return;
    }

    // Condition which removes focus from PouchID;  and keeps on 'Remarks' field ; when Discrepancy-window is opened
    if (this.window.isOpen()) {
      this.discRemarks.focus();
      return;
    }

    let numbersOnly: RegExp = /^\d*$/;         // RegEx for AWB-Number validation
    let alphaNumeric: RegExp = /^[a-zA-Z0-9]+$/ // RegEx for PouchID validation
    let inputLength = this.finalizeForm.get("pouchId").value.length; //Length of characters entered in Input
    let request: FlightPouchRequest = new FlightPouchRequest();
    request.tempType = "finalize";

    if (this.finalizeForm.get("pouchId").value == null || this.finalizeForm.get("pouchId").value == "" || this.finalizeForm.get("pouchId").value == undefined) {
      request.pouchId = this.finalizeForm.get("tempPouchId").value == null ? "" : this.finalizeForm.get("tempPouchId").value;
    } else {
      this.currentPouch = this.finalizeForm.get("pouchId").value == null ? "" : this.finalizeForm.get("pouchId").value;
      request.pouchId = this.currentPouch;
    }

    //******************** Case 1 : If Input-Field = Invalid Pouch/Awb : After Response  **********************
    if (inputLength < 11 && this.finalizeForm.get("pouchId").value != '') {
      this.clearAndFocusOnAWBScan();
      this.showErrorStatus('export.scan.valid.pouch.document');
      
      return;
    }

    //***************** Case 2 : If Input-Field =  Valid PouchID ********************

    //Case 2-b  : When Pouch ID is entered 2nd- nth time , after the main screen loads
    if (inputLength > 13 && alphaNumeric.test(this.finalizeForm.get("pouchId").value) && this.searchStatus === false) {
      this.showConfirmMessage('export.rescan.pouch.confirmation').then(fulfilled => {
        this.searchStatus = true;
        this.getPouchDetailsByLegs();
      }).catch(reason => {
        //If No Clicked : Clear Poch/Doc input field + Keep Focus on it
        // setTimeout(() => {
        this.finalizeForm.controls.pouchId.setValue('');
        // }, 1);
        this.pouchId.focus();
      });
    }
    else if (inputLength > 13 && alphaNumeric.test(this.finalizeForm.get("pouchId").value)) {
      this.searchStatus = true;
    }
    //****************  Case 3 : If Input-Field =  Valid AWB number ******************
    else if (inputLength <= 13 || request.pouchId.includes('/')) {
      this.searchStatus = false;
    }
    else {
      return;
    }

    //**************** this.searchStatus = true; When Pouch ID is scanned ****************
    if (this.searchStatus) {
      this.addDocAndFinalizeDetails(request);
    }
    //*************** this.searchStatus = false ; When AWB Number is scanned after pouch scan *********************
    else {
      let count = 0;
      let awb = "";
      let awbCopy = "";

      if (request.pouchId.includes('/')) {
        awb = request.pouchId.split("/")[0];
        awbCopy = request.pouchId.split("/")[1];
      }
      else {
        awb = request.pouchId;
        awbCopy = "0";
      }

      for (let obj of (<NgcFormArray>this.finalizeForm.controls.pouchDetails).controls) {

        if (obj.get('awbNum').value === awb && obj.get('copyNum').value === awbCopy) {
          if (obj.get('pouchId').value !== this.finalizeForm.get("tempPouchId").value) {
            this.clearAndFocusOnAWBScan();
            this.showErrorMessage("export.awb.not.meant.for.this.pouch");
            
            return;
          } else if (obj.get('sel').value) {
            this.clearAndFocusOnAWBScan();
            this.showErrorMessage("export.document.already.scanned");
           
            return;
          }
          obj.get('sel').setValue(true);
          // obj.get('selDisable').setValue(false);
          this.clearErrorList();
          this.showInfoStatus(NgcUtility.translateMessage("info.doc.successfully.seletced",[obj.get('awbNum').value]));
          // setTimeout(() => {
          this.finalizeForm.controls.pouchId.setValue('');
          // }, 1);
          this.pouchId.focus();
          count++; //increment count ; If Entered AWB-Number is found in the list of AWB's Displayed in main screen
        }
      }

      //This condition will run if Entered AWB-Number is not found in the list of AWB's Displayed in main screen
      if (count == 0) {
        if (awb.length === 11) {
          this.clearAndFocusOnAWBScan();
          this.showErrorMessage("export.awb.not.meant.for.this.pouch");
          
          return;
        }
        else if (awb.length < 11) {
          this.clearAndFocusOnAWBScan();
          this.showErrorMessage("export.scan.valid.awb");
         
          return;
        }
      }
    }
    this.displayFlag = true;
  }

  addDocAndFinalizeDetails(request) {
    this.flightpouchService.addDocAndFinalizeDetails(request).subscribe(responseBean => {
      this.resp = responseBean.data;
      if (!this.refreshFormMessages(responseBean)) {
        this.searchStatus = false;
        // this.showSuccessStatus("g.operation.successful");
        if (this.resp.eccCheckY === "Y" && this.resp.status == "Finalized") {
          this.verifyDocButton.value = 'finalize.unfinalize'
        }
        else if (this.resp.eccCheckY === "Y" && this.resp.status === "Verified") {
          this.verifyDocButton.value = 'finalize.finalize'
        }
        else if (this.resp.summary.status === "In Progress") {
          this.verifyDocButton.value = 'finalize.verify'
        }
        else if (this.resp.summary.status === "Verified") {
          this.verifyDocButton.value = 'finalize.finalize'
        }
        else if (this.resp.summary.status === "Finalized") {
          this.verifyDocButton.value = 'finalize.unfinalize'
        }
        else if (this.resp.summary.status === "Ready" || this.resp.summary.status === "Delivered") {
          this.verifyDocButton.disabled = true;
        }
        this.summaryPouchStatus = this.resp.summary.status;

        for (let obj of this.resp.pouchDetails) {
          obj.sel = obj.sel == "true" ? true : false;
        }
        this.finalizeForm.patchValue(this.resp);
        this.pouchStatus = this.finalizeForm.get("status").value;
      } else {
        this.displayFlag = false;
      }
      // setTimeout(() => {
      this.finalizeForm.controls.pouchId.setValue('');
      // }, 1);
      this.pouchId.focus();
    }, error => {
      this.showErrorStatus("export.error.while.fetching.details");
      this.displayFlag = false;
    });
  }

  onDiscrepancyWindowClose(event) {
    //Condition which removes focus from 'Remarks' field in Discrepancy Window, when window is closed and
    //keep focus on PouchID
    this.pouchId.focus();
  }

  public navigateFlightPouch() {
    this.router.navigate(['flightpouch', 'creation']);
  }

  public navigateAddDocumentScreen() {
    // let request: FlightPouchRequest = new FlightPouchRequest();
    // request.tempType = "adddoc";
    // request.pouchId = this.finalizeForm.get("tempPouchId").value;
    // this.flightpouchService.addDocumentRequest = request;
    this.router.navigate(['export/cdh/flightpouch/adddocument']);
  }

  public navigateUpdateDocument(awb) {
    if (awb.copyReq.value === 'Y') {
      this.documentviewService.sendAwbToUpdateDocument(awb.awbNum.value + '/' + awb.copyNum.value + '/' + awb.flightId.value);
      this.UpdateDocument.open();
      // let request: CopyRequestDetails = new CopyRequestDetails();
      // request.pouchId = this.finalizeForm.get("tempPouchId").value.toUpperCase();
      // request.routerUrl = this.router.url;
      // request.awbNo = awb.awbNum.value;
      // this.flightpouchCpyReqAndCancelButtonService.sendcpyRqAndCancelButtonDetails(request);
      // this.router.navigate(['updatedocument']);
    }
  }

  closeWindow() {
    this.UpdateDocument.hide();
  }

  reQuery() {
    this.finalizeForm.controls.pouchId.setValue(this.currentPouch);
    this.getPouchDetailsByLegs();
  }

  requestOperation() {
    let request: FlightPouchRequest = new FlightPouchRequest();
    request.pouchId = this.finalizeForm.get("tempPouchId").value == null ? "" : this.finalizeForm.get("tempPouchId").value.toUpperCase();
    request.tempType = "finalize";
    return request;
  }

  clearAndFocusOnAWBScan() {
    this.clearErrorList();
    this.flightpouchService.beepSound();
    this.pouchId.focus();
    // setTimeout(() => {
    this.finalizeForm.controls.pouchId.setValue('');
    // }, 1);
  }


}
