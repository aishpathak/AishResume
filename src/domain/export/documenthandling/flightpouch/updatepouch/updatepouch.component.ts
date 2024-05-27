import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, NgcWindowComponent,
  NgcInputComponent,
  NgcDropDownListComponent,
  NgcDateTimeInputComponent,
  NgcUtility
} from 'ngc-framework';

import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, OnInit, ViewChild, OnDestroy
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FlightpouchService } from "../flightpouch.service";
import { FlightPouchRequest, PrinterBO } from "../flightpouch.shared";
import { DocumentService } from "../../document/document.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-updatepouch',
  templateUrl: './updatepouch.component.html',
  styleUrls: ['./updatepouch.component.scss']
})

export class UpdatepouchComponent extends NgcPage implements OnInit, OnDestroy {

  updatePouchResponse: any;
  sessionDetails = null;
  sector: any;
  showUpdatePouchTable = false;
  latestUserId = "";
  latestLocId = "";
  responseMessage: any;
  previousRoute: any;

  @ViewChild('windowPrinter') windowPrinter: NgcWindowComponent;
  @ViewChild('printerdropdown') printerdropdown: NgcDropDownListComponent;
  @ViewChild('flightOriDate') flightOriDate: NgcDateTimeInputComponent;
  @ViewChild('userInput') userInput: NgcInputComponent;
  @ViewChild('locInput') locInput: NgcDropDownListComponent;

  /**
   * Search-Criteria-Form-Fields used
   */
  getPouchUpdatePopup: Subscription = new Subscription();
  updatePouch1: Subscription = new Subscription();
  deletePouch1: Subscription = new Subscription();
  printPouch: Subscription = new Subscription();


  updateFlightPouch: NgcFormGroup = new NgcFormGroup({
    flightNo: new NgcFormControl(''),
    flightOriDate: new NgcFormControl(''),

    userId: new NgcFormControl(),
    phlocId: new NgcFormControl()
  })

  popupPouchForm: NgcFormGroup = new NgcFormGroup({
    popupPouchList: new NgcFormArray([]),
  })

  popupPrinterInUpdateWindowForm: NgcFormGroup = new NgcFormGroup({
    printPouchId: new NgcFormControl(),
    printerdropdown: new NgcFormControl(),
    pouchLbl: new NgcFormControl()
  })

  constructor(appZone: NgZone, appElement: ElementRef, private router: Router,
    appContainerElement: ViewContainerRef, private flightpouchService: FlightpouchService,
    private documentService: DocumentService, ) {
    super(appZone, appElement, appContainerElement);
    this.previousRoute = sessionStorage.getItem('previousRoute');
    console.log('UPDATE POUCH : ' + this.previousRoute);
    sessionStorage.setItem('previousRoute', this.router.url);
  }



  ngOnInit() {
    this.resetSearchData()
    super.ngOnInit();
    // this.showInfoStatus('');
    // this.sessionDetails = JSON.parse(sessionStorage.getItem('sessionDetails'));
    // if (this.sessionDetails == null) {
    //   this.router.navigate(['']);
    //   return;
    // }
    this.printerdropdown.sourceId = "PRINTER@" + 'T5' + '@P'   //this.sessionDetails.officeName + "@P";
    this.locInput.sourceId = "LOCATION@" + '1'; // this.sessionDetails.officeId;

  }

  ngAfterViewInit() {
    // this.updateFlightPouch.controls['flightOriDate'].valueChanges.subscribe(data => {
    //   this.flightOriDate.focus();
    //   this.updateFlightPouch.get("flightOriDate").setValue(data);
    // });
  }

  getFlightPouchDetails() {
    let request: FlightPouchRequest = new FlightPouchRequest();
    request.flightNumber = this.updateFlightPouch.get("flightNo").value;
    request.flightOriDate = this.datepipe(this.updateFlightPouch.get("flightOriDate").value);
    request.pouchId = '';
    request.phlocId = '%'

    if (request.pouchId == "") {
      if (request.flightNumber == "") {
        this.showErrorStatus("export.enter.flight.number");
        this.showUpdatePouchTable = false;
        return;
      } else if (request.flightNumber.length < 6) {
        this.showErrorStatus("export.enter.valid.flight.number");
        this.showUpdatePouchTable = false;
        return;
      } else if (request.flightOriDate == null) {
        this.showErrorStatus("export.select.date");
        this.showUpdatePouchTable = false;
        return;
      }
    }

    this.getPouchUpdatePopup = this.flightpouchService.getPouchUpdatePopup(request).subscribe(responseBean => {
      this.updatePouchResponse = responseBean.data;



      if (this.updatePouchResponse.popupPouchList.length === 0) {
        this.showErrorStatus("NO_RECORDS_EXIST");
        this.showUpdatePouchTable = false;
        return;
      }
      this.updateFlightPouch.controls.userId.setValue(this.updatePouchResponse.popupPouchList[0].latestUserId);
      this.updateFlightPouch.controls.phlocId.setValue(this.updatePouchResponse.popupPouchList[0].latestLocId);

      this.popupPouchForm.patchValue(this.updatePouchResponse);
      this.showUpdatePouchTable = true;
      this.showSuccessStatus("g.operation.successful");

    }, error => {
      this.showErrorStatus("export.error.while.fetch.flight.pouches");
    });

  }

  updatePouch() {
    let resp: any;
    let docMasterList: FlightPouchRequest[] = [];
    let docMaster: FlightPouchRequest = null;
    let i = 0;
    for (let obj of this.popupPouchForm.controls.popupPouchList.value) {
      if ("Finalized" === obj.status) {
        this.showErrorStatus("export.flight.finalised.cannot.change.user.location");
        return;
      }
      ++i;
      docMaster = new FlightPouchRequest();
      docMaster.pouchId = obj.popPouchId;
      docMaster.status = obj.status;
      if (obj.userId == null) {
        this.showErrorStatus(NgcUtility.translateMessage("error.select.user.line",[i.toString()]));
        return;
      }
      if (obj.phlocId == null) {
        this.showErrorStatus(NgcUtility.translateMessage("error.select.location.line",[i.toString()]));
        return;
      }
      docMaster.userId = this.updateFlightPouch.get("userId").value;
      docMaster.phlocId = this.updateFlightPouch.get("phlocId").value;
      docMaster.delReason = obj.delReason;
      docMaster.remark = obj.remark;
      docMaster.modifiedBy = this.sessionDetails.userId;

      docMasterList.push(docMaster);
    }
    this.updatePouch1 = this.flightpouchService.updateflightpouch(docMasterList).subscribe(responseBean => {
      resp = responseBean.data;
      this.responseMessage = responseBean.messageList;

      if (this.responseMessage != null) {
        var errorMessage = this.responseMessage.map((item) => item.message)[0];
        this.showErrorStatus(errorMessage);
        return;
      }
      else {
        if (resp[0].errType != null) {
          this.showErrorStatus(resp[0].errType);
        } else {
          this.showSuccessStatus("export.pouch.updated.successfully");
          this.getFlightPouchDetails();
        }
      }
    }, error => {
      this.showErrorStatus("export.error.while.fetching.pouches");
    });
    this.showUpdatePouchTable = true;
  }

  deletePouch(pouch, delReason, remarkUI, sector) {

    if (delReason === null) {
      this.showErrorStatus("export.select.delete.reason','");
      return;
    }
    this.showConfirmMessage('export.are.you.sure.to.delete').then(fulfilled => {
      let resp: any;
      let requests: FlightPouchRequest = new FlightPouchRequest();
      requests.pouchId = pouch;
      requests.userId = this.sessionDetails.userId;
      requests.officeId = this.sessionDetails.officeId;
      requests.delReason = delReason;
      requests.remark = remarkUI;

      var theYear = pouch.substring(6, 10);
      var theDay = pouch.substring(12, 14);
      if (pouch.substring(10, 11) == 0) {
        var theNewMonth = pouch.substring(11, 12);
      }
      else {
        var theNewMonth = pouch.substring(10, 12);
      }

      const pouchDate = (theDay + this.getMonthName(theNewMonth - 1) + theYear);
      requests.flightNumber = pouch.substring(0, 6);
      requests.flightOriDate = pouchDate;
      requests.phlocId = sector;
      requests.modifiedBy = this.sessionDetails.userId;


      this.deletePouch1 = this.flightpouchService.deleteFlightPouch(requests).subscribe(responseBean => {
        resp = responseBean.data;
        if (resp == null) {
          this.showErrorStatus("export.documents.present.in.pouch.cannot.delete");
          return;
        }
        this.showSuccessStatus("g.deleted.successfully");
        this.getFlightPouchDetails();
      }, error => {
        this.showErrorStatus("export.error.while.deleting");
      });
    }).catch(reason => {
      //If No Clicked : Clear Poch/Doc input field + Keep Focus on it
    });
  }

  onPrintPouchUpdate(popupPouchId, sector, pouchLbl) {
    this.popupPrinterInUpdateWindowForm.controls["printPouchId"].setValue(popupPouchId);
    this.popupPrinterInUpdateWindowForm.controls["pouchLbl"].setValue(pouchLbl);
    this.windowPrinter.open();
    this.popupPrinterInUpdateWindowForm.controls.printerdropdown.setValue(JSON.parse(sessionStorage.getItem('selectedPrinter')));
    this.sector = sector;
  }

  onPouchPrint() {
    var values = this.popupPrinterInUpdateWindowForm.get("printerdropdown").value.split("@");
    let request: PrinterBO = new PrinterBO();
    request.ipAddress = values[0];
    request.portNo = values[1];
    request.pouchId = this.popupPrinterInUpdateWindowForm.get("printPouchId").value;
    request.flightNo = this.updateFlightPouch.get("flightNo").value;
    request.flightDate = this.datepipe(this.updateFlightPouch.get("flightOriDate").value);
    request.offPoint = this.sector;
    request.pouchLbl = this.popupPrinterInUpdateWindowForm.get("pouchLbl").value;

    this.printPouch = this.flightpouchService.printPouch(request).subscribe(responseBean => {
      this.showSuccessStatus("g.operation.successful");
      this.windowPrinter.hide();
    }, error => {
      this.showErrorStatus("export.error.while.deleting");
    });
  }

  datepipe(inputDate) {
    if ((inputDate === '') || (inputDate === null)) {
      return inputDate;
    } else {
      const parseDate = new Date(inputDate);
      return (parseDate.getDate() + this.getMonthName(parseDate.getMonth()) + parseDate.getFullYear());
    }
  }

  getMonthName(number) {
    const monthNames = new Array('Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec');
    return monthNames[number];
  }

  fltMasking() {
    let maskedFltNum = this.documentService.fltMasking(this.updateFlightPouch.get("flightNo").value);
    if (maskedFltNum == "0000" || maskedFltNum == "000000") {
      this.updateFlightPouch.controls.flightNo.setValue(null);
    }
    else {
      this.updateFlightPouch.controls.flightNo.setValue(maskedFltNum);
    }
  }

  getSelectedPrinter(event) {
    sessionStorage.setItem('selectedPrinter', JSON.stringify(event));
  }


  resetSearchData() {
    this.updateFlightPouch.get('flightNo').reset();
    this.updateFlightPouch.get('flightOriDate').reset();
    this.updateFlightPouch.get('userId').reset();
    this.updateFlightPouch.get('phlocId').reset();
  }

  ngOnDestroy() {
    this.getPouchUpdatePopup.unsubscribe();
    this.updatePouch1.unsubscribe();
    this.deletePouch1.unsubscribe();
    this.printPouch.unsubscribe();
  }
}
