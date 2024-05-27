import { DocumentService } from './../../document/document.service';
import { FlightPouchRequest, FlightPouchBO, Discrepancy, FlightPouchList, PrinterBO } from './../flightpouch.shared';
import { FlightpouchService } from './../flightpouch.service';
import { DocumentviewService } from "../../document/documentview/documentviewService";
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, NgcWindowComponent, NgcInputComponent, NgcDateTimeInputComponent, NgcDropDownListComponent, PageConfiguration, UserProfile, EventSubject, BroadcastEvent
} from 'ngc-framework';

import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, OnInit, ViewChild, HostListener, OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-flight-pouch-management',
  templateUrl: './flight-pouch-management.component.html',
  styleUrls: ['./flight-pouch-management.component.css']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  // restorePageOnBack: true
})

export class FlightpouchComponent extends NgcPage implements OnInit, OnDestroy {

  @ViewChild('window') window: NgcWindowComponent;
  @ViewChild('windowPouch') windowPouch: NgcWindowComponent;
  @ViewChild('pouchId') pouchId: NgcInputComponent;
  @ViewChild('windowPrinter2') windowPrinter2: NgcWindowComponent;
  @ViewChild('pouchRePrint') pouchRePrint: NgcWindowComponent;
  @ViewChild('flightOriDate') flightOriDate: NgcDateTimeInputComponent;
  @ViewChild('locInput') locInput: NgcDropDownListComponent;
  @ViewChild('UpdateDocument') UpdateDocument: NgcWindowComponent;

  locationLovParameters: any;
  displayFlag = false;
  baseRequest: FlightPouchRequest = new FlightPouchRequest();
  buttonCheck = true;
  leg = "";
  isPouchFinalized = false;
  currentFlightNo: any;
  currentDate: any;
  currentPouch: any;
  currentECC: boolean = false;
  previousRoute: any;
  windowPouchpop = false;
  windowPop = false;
  isPouchCheckout = false;
  isPouchFinalizedOnly = false;
  currentPopupPouchId: any;
  officeId = null;
  activeTabIndex = 0;
  // loggedInOffice = null;

  ngOnInit() {
    super.ngOnInit();
    this.resetSearchData();
    this.setOfficeId();
    this.flightPouch.controls.printerdropdown.setValue(sessionStorage.getItem('selectedPrinter'));
  }

  ngAfterViewInit() {
    // if (this.previousRoute == '/updatedocument' ){
    //   this.subscription = this.flightpouchCpyReqAndCancelButtonService.getcpyRqAndCancelButtonDetails().subscribe(response => {
    //     this.flightPouch.get("flightNumber").setValue(response.cpyReqDetails.flightNumber);
    //     this.flightPouch.get("flightOriDate").setValue(response.cpyReqDetails.flightOriDate);
    //     this.flightPouch.get("pouchId").setValue(response.cpyReqDetails.pouchId);
    //     this.onSearch()
    //   });
    // }

    // this.flightOriDateSub = this.flightPouch.controls['flightOriDate'].valueChanges.subscribe(data => {
    //   this.flightOriDate.focus();
    //   this.flightPouch.get("flightOriDate").setValue(data);
    // });
  }

  /**
   * Handle Component Event Raised by Another Component
   *
   * @param event Event
   */
  protected handleEvent(event: BroadcastEvent): void {
    switch (event.subject) {
      case EventSubject.BUSINESS:
        this.setOfficeId();
        break;
      default:
        super.handleEvent(event);
        break;
    }
  }

  constructor(appZone: NgZone, appElement: ElementRef, private router: Router,
    appContainerElement: ViewContainerRef, private flightpouchService: FlightpouchService,
    private documentService: DocumentService, private documentviewService: DocumentviewService,
    private el: ElementRef) {
    super(appZone, appElement, appContainerElement);
    this.previousRoute = sessionStorage.getItem('previousRoute');
    console.log('Previous URL : ' + this.previousRoute);

    if (this.previousRoute != null) {
      if (this.previousRoute.includes('flightpouch/adddocument')
        || this.previousRoute.includes('flightpouch/finalize')) {
        if (undefined !== this.flightpouchService.flightPouchRequest.flightNumber) {
          this.flightPouch.patchValue(this.flightpouchService.flightPouchRequest);
          this.flightPouch.get("ecc").setValue(this.flightpouchService.flightPouchRequest.isECCCheck);
          this.onSearch();
        }
      }
    }
    sessionStorage.setItem('previousRoute', this.router.url);
  }

  flightPouch: NgcFormGroup = new NgcFormGroup({

    pouchId: new NgcFormControl(''),
    locationName: new NgcFormControl(''),
    flightNumber: new NgcFormControl('', [Validators.required]),
    flightOriDate: new NgcFormControl('', [Validators.required]),
    ecc: new NgcFormControl(false),
    phlocId: new NgcFormControl(),
    phSeg: new NgcFormControl(),
    printerdropdown: new NgcFormControl(),
    legList: new NgcFormArray([]),

    flightInfo: new NgcFormGroup({
      flightId: new NgcFormControl(),
      flightKey: new NgcFormControl(),
      flightOriDate: new NgcFormControl(),
      dateSTD: new NgcFormControl(),
      dateETD: new NgcFormControl(),
      status: new NgcFormControl(),
      carrierCode: new NgcFormControl(),
    })
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

  popupPouchForm: NgcFormGroup = new NgcFormGroup({
    locationName: new NgcFormControl(''),
    flightNumber: new NgcFormControl(''),
    flightDateOri: new NgcFormControl(''),
    leg: new NgcFormControl(''),
    location: new NgcFormControl(''),
    userId: new NgcFormControl(),
    phlocId: new NgcFormControl(),
    lovUserId: new NgcFormControl(),
    lovLocId: new NgcFormControl(),
    pouchRePrint: new NgcFormControl(),
    popupPouchList: new NgcFormArray([]),
  })


  public setOfficeId() {
    if (this.getUserProfile() === null) {
      this.officeId = 2;
    } else if (this.getUserProfile().terminalId.includes('T3')) {
      this.officeId = 1;
    } else if (this.getUserProfile().terminalId.includes('T5')) {
      this.officeId = 2;
    }
    this.locationLovParameters = this.createSourceParameter(this.officeId);
  }

  public onUpdatePouchOpen(leg) {

    if (this.currentFlightNo != this.flightPouch.get("flightNumber").value) {
      this.showErrorStatus("export.input.flight.not.same.as.search.flight");
      return;
    }

    this.getPouchUpdatePopup(leg);
    this.windowPouch.open();
    this.windowPouchpop = true;
  }

  public onPopupDiscrepancy(awb, copyNum, awbDisc, remark, leg, shipmentId, discId) {
    // if (shipmentId == null) {
    //   return;
    // }
    this.window.open();
    this.windowPop = true;
    if (awbDisc === null || awbDisc == '') {
      this.popupDiscForm.controls["discrepencydropdown"].setValue("");
    }
    else {
      this.popupDiscForm.controls["discrepencydropdown"].setValue(awbDisc);
    }
    if (remark === "PART SHIPMENT") {
      this.popupDiscForm.controls["remarks"].setValue("");
    } else {
      this.popupDiscForm.controls["remarks"].setValue(remark);
    }
    this.popupDiscForm.controls["awbNum"].setValue(awb);
    this.popupDiscForm.controls["flightNumber"].setValue(this.currentFlightNo);
    this.popupDiscForm.controls["flightDateOri"].setValue(this.datepipe(this.flightPouch.get("flightOriDate").value));
    this.popupDiscForm.controls["sector"].setValue(leg);
    this.popupDiscForm.controls["awbCopyNum"].setValue(copyNum);
    this.popupDiscForm.controls["shipmentId"].setValue(shipmentId);
    this.popupDiscForm.controls["discId"].setValue(discId);
  }

  saveDiscrepancy() {
    if (this.window.isOpen()) {
      let resp: any;
      let request: Discrepancy = new Discrepancy();
      request.discId = this.popupDiscForm.get("discId").value;
      request.awbNum = this.popupDiscForm.get("awbNum").value;
      request.flightId = this.flightPouch.get("flightInfo").get("flightId").value;
      request.shipmentId = this.popupDiscForm.get("shipmentId").value == null ? '0' : this.popupDiscForm.get("shipmentId").value;
      request.awbNum = this.popupDiscForm.get("awbNum").value;
      request.awbCopyNum = this.popupDiscForm.get("awbCopyNum").value == null ? '0' : this.popupDiscForm.get("awbCopyNum").value;
      request.discRemark = this.popupDiscForm.get("discrepencydropdown").value;
      request.remarks = this.popupDiscForm.get("remarks").value;
      request.flightNumber = this.currentFlightNo;
      request.sector = this.popupDiscForm.get("sector").value;
      request.flightDateOri = this.currentDate;
      // request.modifiedBy = '';
      // alert(JSON.stringify(request));
      this.flightpouchService.saveDiscrepancy(request).subscribe(responseBean => {
        if (!this.refreshFormMessages(responseBean)) {
          resp = responseBean.data;
          this.showSuccessStatus("export.discrepancy.updated");
          this.getPouchDetailsByLegs(this.baseRequest);
          this.window.hide();
        }
      }, error => {
        this.showErrorStatus("export.unable.add.discrepancy");
      });
    }
  }

  deleteDiscrepancy() {
    let resp: any;
    let request: Discrepancy = new Discrepancy();
    request.flightId = this.flightPouch.get("flightInfo").get("flightId").value;
    request.shipmentId = this.popupDiscForm.get("shipmentId").value;
    request.discRemark = this.popupDiscForm.get("discrepencydropdown").value;
    request.awbNum = this.popupDiscForm.get("awbNum").value;
    request.awbCopyNum = this.popupDiscForm.get("awbCopyNum").value == null ? '0' : this.popupDiscForm.get("awbCopyNum").value;
    request.remarks = this.popupDiscForm.get("remarks").value;
    request.flightNumber = this.currentFlightNo;
    request.sector = this.popupDiscForm.get("sector").value;
    request.flightDateOri = this.currentDate;
    // alert(JSON.stringify(request));
    this.flightpouchService.deleteDiscrepancy(request).subscribe(responseBean => {
      if (!this.refreshFormMessages(responseBean)) {
        resp = responseBean.data;
        this.showSuccessStatus("export.discrepancy.removed");
        this.popupDiscForm.controls.discrepencydropdown.setValue(null);
        this.getPouchDetailsByLegs(this.baseRequest);
        this.window.hide();
      }
    }, error => {
      this.showErrorStatus("export.unable.delete.discrepancy");
    });
  }

  deleteAwb(control) { // awb, pouchId, docStatus, copyNum
    // alert(awb + " " + pouchId + " " + docStatus + " " + copyNum);
    if (control.docStatus.value != "In Pouch") {
      return;
    }
    if (this.isPouchFinalized) {
      this.showErrorStatus("export.flight.finalized.unable.to.remove.from.pouch");
      return;
    }
    let request: FlightPouchRequest = new FlightPouchRequest();
    request.flightNumber = this.currentFlightNo
    request.flightOriDate = this.currentDate;
    request.pouchId = control.fltPouchId.value;
    request.shipmentId = control.shipmentId.value;
    request.awbNum = control.awbNum.value;
    request.copyNum = control.copyNum.value;
    request.pouchCode = control.pouchId.value;
    request.locationName = control.locationName.value;
    request.docType = control.docType.value;
    request.shc = control.shc.value;
    request.impFltDate = control.impFltDate.value;
    request.status = "Stored";
    // request.modifiedBy = '';
    this.flightpouchService.deleteDoc(request).subscribe(responseBean => {
      this.showSuccessStatus("g.deleted.successfully");
      this.getPouchDetailsByLegs(this.baseRequest);
    }, error => {
      this.showErrorStatus("export.unable.to.delete.awb");
    });
  }

  public navigateAddDoc(legId) {

    if (!this.buttonCheck) {
      this.showErrorStatus("export.pouch.not.created");
      return;
    } else if (this.currentFlightNo != this.flightPouch.get("flightNumber").value) {
      this.showErrorStatus("export.input.flight.not.same.as.search.flight");
      return;
    }
    this.flightpouchService.flightPouchRequest = this.baseRequest;
    this.router.navigate(['export/cdh/flightpouch/adddocument']);
  }

  public navigateFinalize(legId) {

    if (!this.buttonCheck) {
      this.showErrorStatus("export.pouch.not.created");
      return;
    }
    else if (this.currentFlightNo != this.flightPouch.get("flightNumber").value) {
      this.showErrorStatus("export.input.flight.not.same.as.search.flight");
      return;
    }
    this.flightpouchService.flightPouchRequest = this.baseRequest;
    this.router.navigate(['export/cdh/flightpouch/finalize']);
  }

  public navigateUpdateDocument(awb) {
    if (awb.copyReq.value === 'Y') {
      if (awb.docStatus.value === 'Not Received') {
        this.showErrorStatus("export.accept.the.document.first.before.print");
      } else {
        this.documentviewService.sendAwbToUpdateDocument(awb.awbNum.value + "/" + awb.copyNum.value + "/" + awb.flightId.value);
        // this.documentviewService.sendAwbToUpdateDocument(awb.awbNum.value);
        this.UpdateDocument.open();
        // let request: CopyRequestDetails = new CopyRequestDetails();
        // request.flightNumber = this.currentFlightNo;
        // request.flightOriDate = this.datepipe(this.currentDate);
        // request.pouchId = this.currentPouch;
        // request.routerUrl = this.router.url;
        // request.awbNo = awb.awbNum.value;
        // this.flightpouchCpyReqAndCancelButtonService.sendcpyRqAndCancelButtonDetails(request);
        // this.router.navigate(['export/cdh/updatedocument']);
      }
    }
  }

  closeWindow() {
    this.UpdateDocument.hide();
  }

  openWindow() {
    this.UpdateDocument.open();
  }


  createPouch(legId, tabIndex) {
    if (this.isPouchFinalized && !this.currentECC) {
      this.showErrorStatus("export.flight.finalized.create.pouch");
      return;
    }
    if (this.currentFlightNo != this.flightPouch.get("flightNumber").value) {
      this.showErrorStatus("export.input.flight.not.same.as.search.flight");
      return;
    }

    let resp: any;
    let request: FlightPouchRequest = new FlightPouchRequest();
    request.flightNumber = this.currentFlightNo;  // Dont remove
    request.flightOriDate = this.currentDate; // Dont remove
    request.flightId = this.flightPouch.get("flightInfo").get("flightId").value;
    request.carrierCode = this.flightPouch.get("flightInfo").get("carrierCode").value;
    request.phSeg = legId;
    request.docStatus = "In Pouch";
    request.isECCCheck = this.currentECC;
    request.printer = this.flightPouch.get("printerdropdown").value;
    // request.officeId = this.loggedInOffice;
    // alert(JSON.stringify(request))
    this.flightpouchService.createPouch(request).subscribe(responseBean => {
      resp = responseBean.data;
      if (!this.refreshFormMessages(responseBean)) {
        // this.popupPrinterForm.controls["printPouchId"].setValue(resp.pouchId);
        // this.popupPrinterForm.controls["pouchLbl"].setValue(resp.pouchLbl);
        // this.popupPrinterInUpdateWindowForm.controls["printPouchId"].setValue(resp.pouchId);
        // this.popupPrinterInUpdateWindowForm.controls["pouchLbl"].setValue(resp.pouchLbl);
        this.activeTabIndex = tabIndex;
        this.showSuccessStatus("export.flight.pouch.created");
        // this.windowPrinter.hide();
        // this.onPrint();
        this.getPouchDetailsByLegs(this.baseRequest);
      }
    }, error => {
      this.showErrorStatus("export.unable.to.create.pouch");
    });
  }

  public onSearch() {
    let request: FlightPouchRequest = new FlightPouchRequest();
    request.flightNumber = this.flightPouch.get("flightNumber").value;
    request.flightOriDate = this.flightPouch.get("flightOriDate").value;
    request.pouchId = this.flightPouch.get("pouchId").value;
    request.isECCCheck = this.flightPouch.get("ecc").value;
    // request.officeId = this.loggedInOffice;

    this.currentFlightNo = request.flightNumber;
    this.currentDate = request.flightOriDate;
    this.currentPouch = request.pouchId;
    this.currentECC = request.isECCCheck;

    // alert("11: " + request.flightNumber + " " + request.flightOriDate + " " + request.pouchId);
    if (request.pouchId === null) {
      // this.showErrorStatus("export.search.either.flight.date.pouch");
      if (request.flightNumber === null) {
        this.showFormControlErrorMessage(<NgcFormControl>this.flightPouch.get('flightNumber'),
          'g.mandatory');
        this.displayFlag = false;
        return;
      }
      if (request.flightOriDate === null) {
        this.showFormControlErrorMessage(<NgcFormControl>this.flightPouch.get('flightOriDate'),
          'g.mandatory');
        this.displayFlag = false;
        return;
      }
    }

    if ((request.pouchId != null) && (request.flightNumber != null && request.flightOriDate == null) || (request.flightNumber == null && request.flightOriDate != null)) {
      // this.showErrorStatus("export.both.flight.date.mandatory");
      this.showFormControlErrorMessage(<NgcFormControl>this.flightPouch.get('flightOriDate'),
        'g.mandatory');
      this.displayFlag = false;
      return;
    }

    this.refreshFormMessages(null);
    this.baseRequest = request;
    this.getPouchDetailsByLegs(this.baseRequest);
  }

  getPouchDetailsByLegs(request: any) {
    let resp: any;
    this.flightpouchService.getPouchDetailsByLegs(request).subscribe(responseBean => {
      resp = responseBean.data;

      if (!this.refreshFormMessages(responseBean)) {
        this.flightPouch.patchValue(resp);
        this.displayFlag = true;
      } else {
        this.displayFlag = false;
      }

      if (resp.legList[0].pouches === undefined || resp.legList[0].pouches.length > 0) {
        this.buttonCheck = true;
      }
      this.flightPouch.controls["flightNumber"].setValue(request.flightNumber);
      this.flightPouch.controls["flightOriDate"].setValue(request.flightOriDate != null ? (new Date(request.flightOriDate)) : null);
      this.flightPouch.controls["pouchId"].setValue(request.pouchId);
      this.flightPouch.controls["locationName"].setValue(request.flightNumber);

      if ("Finalized" == resp.legList[0].summary.status || "Ready" == resp.legList[0].summary.status
        || "Checkout" == resp.legList[0].summary.status || 'Confirmed' == resp.legList[0].summary.status
        || "Delivered" == resp.legList[0].summary.status) {
        this.isPouchFinalized = true;
      } else {
        this.isPouchFinalized = false;
      }
      if ("Checkout" == resp.legList[0].summary.status) {
        this.isPouchCheckout = true;
      } else {
        this.isPouchCheckout = false;
      }
      if ("Finalized" == resp.legList[0].summary.status || "Ready" == resp.legList[0].summary.status
        || 'Confirmed' == resp.legList[0].summary.status || "Delivered" == resp.legList[0].summary.status) {
        this.isPouchFinalizedOnly = true;
      }
      // this.showSuccessStatus("g.operation.successful");
    }, error => {
      this.showErrorStatus("export.unable.to.fetch.flight.pouch.leg");
    });
  }

  getPouchUpdatePopup(legId) {
    this.leg = legId;
    let resp: any;
    let request: FlightPouchRequest = new FlightPouchRequest();
    request.flightId = this.flightPouch.get("flightInfo").get("flightId").value;
    request.phSeg = legId;
    this.flightpouchService.getPouchUpdatePopup(request).subscribe(responseBean => {
      resp = responseBean.data;
      this.popupPouchForm.patchValue(resp);
      // console.log(JSON.stringify(resp));
      // alert(resp.popupPouchList[0].latestUserId + " " + resp.popupPouchList[0].latestLocId + " " +
      // resp.popupPouchList[0].userId + " " + resp.popupPouchList[0].locationName)
      this.popupPouchForm.controls["flightNumber"].setValue(this.currentFlightNo);
      this.popupPouchForm.controls["flightDateOri"].setValue(this.datepipe(this.currentDate));
      this.popupPouchForm.controls["leg"].setValue(legId);

      this.popupPouchForm.controls.userId.setValue(resp.popupPouchList[0].userId);
      this.popupPouchForm.controls.phlocId.setValue(resp.popupPouchList[0].locationName);
      this.popupPouchForm.controls.lovUserId.setValue(resp.popupPouchList[0].latestUserId);
      this.popupPouchForm.controls.lovLocId.setValue(resp.popupPouchList[0].latestLocId);
    }, error => {
      this.showErrorStatus("export.unable.to.fetch.flight.pouches");
    });
    this.displayFlag = true;
  }

  updatePouch() {
    let requestList: FlightPouchRequest[] = [];
    let request: FlightPouchRequest = null;
    for (let obj of this.popupPouchForm.controls.popupPouchList.value) {
      request = new FlightPouchRequest();
      request.flightId = this.flightPouch.get("flightInfo").get("flightId").value;
      request.flightNumber = this.currentFlightNo;
      request.flightOriDate = this.currentDate;
      request.phSeg = this.popupPouchForm.get("leg").value;
      request.pouchId = obj.popPouchId;
      request.userId = this.popupPouchForm.get("lovUserId").value;
      request.phlocId = this.popupPouchForm.get("lovLocId").value;
      // request.officeId = this.loggedInOffice;
      // request.status = obj.status;
      // request.delReason = obj.delReason;
      // request.remark = obj.remark;
      requestList.push(request);
    }
    // alert(JSON.stringify(requestList))
    this.flightpouchService.updateflightpouch(requestList).subscribe(responseBean => {
      if (!this.refreshFormMessages(responseBean)) {
        this.showSuccessStatus("export.pouch.updated.successfully");
        this.getPouchUpdatePopup(this.leg);
        this.getPouchDetailsByLegs(this.baseRequest);
      }
    }, error => {
      this.showErrorStatus("export.unable.update.pouch");
    });
    this.displayFlag = true;
  }

  onUserLOVSelect(event) {
    if (event.code != null && event.desc != "")
      this.popupPouchForm.get('lovUserId').setValue(event.code);
    else {
      this.popupPouchForm.get('lovUserId').setValue(null);
    }
  }

  onLocationLOVSelect(event) {
    if (event.code != null && event.desc != "")
      this.popupPouchForm.get('lovLocId').setValue(event.code);
    else {
      this.popupPouchForm.get('lovLocId').setValue(null);
    }
  }

  deletePouch(pouch, fltPouchId, delReason, remarkUI, pouchLocationID, pouchType) {
    if (pouchType === null) {
      if (this.isPouchFinalized) {
        this.showErrorStatus("export.flight.finalized.cannot.delete.pouch");
        return;
      }
    }
    let request: FlightPouchRequest = new FlightPouchRequest();
    request.pouchId = pouch;
    request.fltPouchId = fltPouchId;
    // request.officeId = this.loggedInOffice;
    request.delReason = delReason;
    request.remark = remarkUI;
    request.phlocId = pouchLocationID;
    request.flightId = this.flightPouch.get("flightInfo").get("flightId").value;
    request.flightNumber = this.currentFlightNo;
    request.flightOriDate = this.currentDate;
    request.phSeg = this.popupPouchForm.get('leg').value;
    // alert(JSON.stringify(request));
    this.flightpouchService.deleteFlightPouch(request).subscribe(responseBean => {
      if (!this.refreshFormMessages(responseBean)) {
        this.getPouchUpdatePopup(this.leg);
        this.getPouchDetailsByLegs(this.baseRequest);
        this.showSuccessStatus("g.deleted.successfully");
      }
    }, error => {
      this.showErrorStatus("export.unable.delete.pouch");
    });
  }

  resetSearchData() {
    this.flightPouch.get('flightNumber').reset();
    this.flightPouch.get('flightOriDate').reset();
    this.flightPouch.get('pouchId').reset();
    this.displayFlag = false;
  }

  // onPrintPouchUpdate(popupPouchId, pouchLbl, locName) {
  //   this.currentPopupPouchId = popupPouchId;
  //   this.popupPrinterInUpdateWindowForm.controls["printPouchId"].setValue(popupPouchId);
  //   this.popupPrinterInUpdateWindowForm.controls["pouchLbl"].setValue(pouchLbl);
  //   this.popupPrinterInUpdateWindowForm.controls["locName"].setValue(locName);
  // this.windowPrinter2.open();
  // this.popupPrinterInUpdateWindowForm.controls.printerdropdown.setValue('Demo - PUCH');
  // }

  rePrintPouch(popupPouchId, locName) {
    if (this.popupPouchForm.get("pouchRePrint").value == null) {
      this.showErrorStatus("expaccpt.select.printer.and.proceed");
    }
    else {
      let request: PrinterBO = new PrinterBO();
      request.pouchId = popupPouchId;
      request.flightNo = this.currentFlightNo;
      request.flightDate = this.currentDate;
      request.offPoint = this.leg;
      request.locName = locName;
      request.printerName = this.popupPouchForm.get("pouchRePrint").value;
      // this.popupPrinterInUpdateWindowForm.get("pouchLbl").value;
      // alert(JSON.stringify(request));
      this.flightpouchService.printPouch(request).subscribe(responseBean => {
        this.showSuccessStatus("g.operation.successful");
        this.clearErrorList();
        // this.windowPrinter2.hide();
      }, error => {
        this.showErrorStatus("export.unable.reprint");
      });
    }
  }

  public onAWBClick(controls) {
    // alert(controls.awbNum.value + "/" + controls.copyNum.value + "/" + this.flightPouch.get("flightInfo").get("flightId").value);
    this.documentviewService.sendAwbToUpdateDocument(controls.awbNum.value + "/" + controls.copyNum.value + "/" + this.flightPouch.get("flightInfo").get("flightId").value);
  }

  fltMasking() {
    let maskedFltNum = this.documentService.fltMasking(this.flightPouch.get("flightNumber").value);
    if (maskedFltNum == "0000" || maskedFltNum == "000000") {
      this.flightPouch.controls.flightNumber.setValue('');
    }
    else {
      this.flightPouch.controls.flightNumber.setValue(maskedFltNum);
    }
  }

  pouchTrimming() {
    let trimmedPouchId = this.documentService.trimPouch(this.flightPouch.get("pouchId").value);
    this.flightPouch.controls.pouchId.setValue(trimmedPouchId);
  }

  getSelectedPrinter(event) {
    sessionStorage.setItem('selectedPrinter', event);
  }

  count = 0;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    var elem = this.el.nativeElement.querySelector('.tableBody');
    if (event.keyCode === 40) {
      this.count += 100;
      elem.scrollTop = this.count;
    } else if (event.keyCode === 38) {
      this.count -= 100;
      elem.scrollTop = this.count;
    }
  }

  datepipe(inputDate) {
    if ((inputDate === '') || (inputDate === null)) {
      return inputDate;
    } else {
      const parseDate = new Date(inputDate);
      //return (parseDate.getDate() + this.getMonthName(parseDate.getMonth()) + parseDate.getFullYear());
      return (("0" + parseDate.getDate()).slice(-2) + this.getMonthName(parseDate.getMonth()) + parseDate.getFullYear());
    }
  }

  getMonthName(number) {
    const monthNames = new Array('JAN', 'FEB', 'MAR',
      'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP',
      'OCT', 'NOV', 'DEC');
    return monthNames[number];
  }

  public onFlightSelect(event) {
    alert(event);
  }

  public ngOnDestroy() { }

}

