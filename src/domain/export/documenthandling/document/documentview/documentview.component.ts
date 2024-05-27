
import { DocumentService } from './../../document/document.service';
import { RestService, BaseRequest, NgcWindowComponent, NgcDropDownListComponent, BroadcastEvent } from 'ngc-framework';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, NgcInputComponent,
  NgcDateTimeInputComponent,
  PageConfiguration,
  UserProfile
} from 'ngc-framework';
import { DocumentViewRequestDTO } from './../../document/document.sharedmodel';
import { ActivatedRoute, Router } from '@angular/router';

import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, OnInit, ViewChild, OnDestroy
} from '@angular/core';

import { NgForm } from "@angular/forms/src/forms";

import { Subscription } from "rxjs";
import { DocumentviewService } from "./documentviewService";

@Component({
  selector: 'app-documentview',
  templateUrl: './documentview.component.html',
  styleUrls: ['./documentview.component.css']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class DocumentviewComponent extends NgcPage implements OnInit, OnDestroy {

  @ViewChild('editwindow') editwindow: NgcWindowComponent;
  // @ViewChild('dropdown') dropdown: NgcDropDownListComponent;
  // @ViewChild('locationDropDown') locationDropDown: NgcInputComponent;
  // @ViewChild('flightdate') flightdate: NgcDateTimeInputComponent;
  // @ViewChild('dateFrom') dateFrom: NgcDateTimeInputComponent;
  // @ViewChild('dateTo') dateTo: NgcDateTimeInputComponent;

  pigeonHoleLocLOV: any;
  dateToMin: Date;
  dateToMax: Date;
  showDocumentViewTable: boolean = false;
  documentViewResponseOnSearch: any;
  previousRoute: any;

  private documentViewForm: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    pigeonHoleLoc: new NgcFormControl(),
    lovLocId: new NgcFormControl(),
    documentStatus: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightOriginDate: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    docReceivedDate: new NgcFormControl(),
    docToDate: new NgcFormControl(),

    // pouchFlt: new NgcFormControl(),
    // ecc: new NgcFormControl(),
    // eawb: new NgcFormControl(),
    // tt: new NgcFormControl(),
    // notifyDate: new NgcFormControl(),
    // flightCar: new NgcFormControl(),
    // receiveDate: new NgcFormControl(),
    // dateFrom: new NgcFormControl(),
    // dateTo: new NgcFormControl(),
    // flightdate: new NgcFormControl(),
    // deletedrodown: new NgcFormControl(),
    // remarks: new NgcFormControl(),

    documentViewTableData: new NgcFormArray([]),
    //resultListPopup: new NgcFormArray([]),
  });

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private router: Router, private documentService: DocumentService, private documentviewService: DocumentviewService) {
    super(appZone, appElement, appContainerElement);

    this.previousRoute = sessionStorage.getItem('previousRoute');
    if (this.previousRoute != null) {
      if (this.previousRoute.includes('export/cdh/flightview') && this.documentService.flightViewReq.flightKeyInTable !== undefined) {
        console.log('This page is navigated from /flightview');

        this.documentViewForm.get('flightKey').setValue(this.documentService.flightViewReq.flightKeyInTable)
        this.documentViewForm.get('flightOriginDate').setValue(this.documentService.flightViewReq.flightDateInTable);
        this.onSearchDocumentView();
      }
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.pigeonHoleLocLOV = this.createSourceParameter(this.getOfficeId());

    // if (this.documentService.flightViewReq.flightCodeNo && this.documentService.flightViewReq.flightDate) {
    //   this.form.controls["flightNo"].setValue(this.documentService.flightViewReq.flightCodeNo);
    //   this.form.controls["flightdate"].setValue(this.documentService.flightViewReq.flightDate);
    //   this.onSearchDocumentView();
    // }
    // this.documentService.flightViewReq.flightCodeNo = null;
    // this.documentService.flightViewReq.flightDate = null;
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    this.documentViewForm.controls['docReceivedDate'].valueChanges.subscribe(data => {
      this.dateToMin = new Date(this.documentViewForm.get('docReceivedDate').value);
      this.dateToMin.setDate(this.dateToMin.getDate() + 1);
    });

    // if (this.previousRoute.includes('/export/cdh/documentupdate')) {
    //   this.documentviewService.getAwb().subscribe(response => {
    //     this.editwindow.open();
    //   });
    // }
  }

  public onSearchDocumentView() {
    this.resetFormMessages();
    if (this.clientSideValidation()) {
      let documentView: DocumentViewRequestDTO = new DocumentViewRequestDTO();
      // documentView.shipmentNumber = this.documentViewForm.get('shipmentNumber').value;
      // documentView.pigeonHoleLoc = this.documentViewForm.get('pigeonHoleLoc').value;
      // documentView.documentStatus = this.documentViewForm.get('documentStatus').value;
      // documentView.flightKey = this.documentViewForm.get('flightKey').value;
      // documentView.flightOriginDate = this.documentViewForm.get('flightOriginDate').value;
      // documentView.carrierCode = this.documentViewForm.get('carrierCode').value;
      // documentView.docReceivedDate = this.documentViewForm.get('docReceivedDate').value;
      // documentView.docReceivedDate = this.documentViewForm.get('docReceivedDate').value;
      // documentView.docToDate = this.documentViewForm.get('docToDate').value;
      documentView = this.documentViewForm.getRawValue();
      documentView.pigeonHoleLoc = this.documentViewForm.get('lovLocId').value;
      this.documentService.getDocumentViewDetails(documentView).subscribe(responseBean => {
        console.log((JSON.stringify(responseBean)));
        this.refreshFormMessages(responseBean);

        if (responseBean.data === null) {
          this.showDocumentViewTable = false;
          return;
        }
        if (responseBean.data.length === 0 && responseBean.messageList === null) {
          this.showErrorStatus("export.no.result.found.for.search.criteria");
          this.showDocumentViewTable = false;
          return;
        }
        this.documentViewResponseOnSearch = responseBean.data;
        this.editFunction();
        this.showDocumentViewTable = true;
        this.documentViewForm.controls['documentViewTableData'].patchValue(this.documentViewResponseOnSearch);
        if (this.updateFlag === undefined) {
          this.showSuccessStatus("g.operation.successful");
        }
      }, error => {
        this.showErrorStatus("export.no.result.found.for.search.criteria");
      }
      );
    }
  }


  clientSideValidation() {
    //**************** Sceanrio 1 - If All fields are empty or null ******************
    if (
      ((this.documentViewForm.get('shipmentNumber').value === '') || (this.documentViewForm.get('shipmentNumber').value === null)) &&
      (this.documentViewForm.get('pigeonHoleLoc').value === null || this.documentViewForm.get('lovLocId').value === null) &&
      (this.documentViewForm.get('documentStatus').value === null) &&
      (this.documentViewForm.get('flightKey').value === null) &&
      (this.documentViewForm.get('flightOriginDate').value === null) &&
      (this.documentViewForm.get('carrierCode').value === null) &&
      (this.documentViewForm.get('docReceivedDate').value === null) &&
      (this.documentViewForm.get('docToDate').value === null)
    ) {
      this.showErrorStatus('export.enter.any.search.criteria');
      this.showDocumentViewTable = false;
      return false;
    }

    //****************** Sceanrio 2 - Validations for FlightNo and Date *****************
    else if (this.documentViewForm.get('flightKey').value && !this.documentViewForm.get('flightOriginDate').value) {
      this.showErrorStatus('export.select.flight.date');
      this.showDocumentViewTable = false;
      return false;
    }
    else if ((this.documentViewForm.get('flightOriginDate').value !== null) && (this.documentViewForm.get('flightKey').value === null)) {
      this.showErrorStatus('export.select.flight.number');
      this.showDocumentViewTable = false;
      return false;
    }

    //******************* Sceanrio 3 - Validations for Flight-Carrier,DateFrom , DateTo ************
    // if ((this.form.get('flightCar').value !== null) && ((this.form.get('dateFrom').value === null) || (this.form.get('dateTo').value === null))) {
    //   this.showErrorStatus('Select Both "Receive Date-From" and "Receive Date-To"');
    //   return true;
    // }
    //******************* Sceanrio 4 - Validations for DateFrom , DateTo ************
    else if ((this.documentViewForm.get('docReceivedDate').value !== null) && (this.documentViewForm.get('docToDate').value === null)) {
      this.showErrorStatus('export.select.to.date');
      this.showDocumentViewTable = false;
      return false;
    }
    else if ((this.documentViewForm.get('docReceivedDate').value === null) && (this.documentViewForm.get('docToDate').value !== null)) {
      this.showErrorStatus('export.select.from.date');
      this.showDocumentViewTable = false;
      return false;
    }
   
    else {
      return true;
    }
  }

  // public cellsRenderer = (row: number, column: string, value: any, rowData: any): string => {
  //   if (column === 'awbNum') {
  //     return `
  //         <div>
  //            <ngc-awbdisplay value=${rowData.awbNum}></ngc-awbdisplay> 
  //         </div>
  //         `
  //   }
  // }

  public editFunction() {
    for (let index = 0; index < this.documentViewResponseOnSearch.length; index++) {
      this.documentViewResponseOnSearch[index]['edit'] = 'EDIT';
      this.documentViewResponseOnSearch[index]['sno'] = index + 1;
    }
  }

  public onEditClick(event) {
    if (event.record.docstatus === 'Not Received') {
      this.showErrorStatus('export.not.received');
      return false;
    }
    let documentView: DocumentViewRequestDTO = new DocumentViewRequestDTO();
    this.documentviewService.sendAwbToUpdateDocument(event.record.awbNum + "/" + event.record.copyNum + "/" + event.record.flightId);
  }

  getOfficeId() {
    let userInfo: UserProfile = this.getUserProfile();
    // alert(userInfo.terminalId);
    //Get PigeonHole Location Based on Office ID
    if (userInfo.terminalId === undefined || userInfo.terminalId.includes('T3')) {
      userInfo.terminalId = '1';
    } else if (userInfo.terminalId.includes('T5')) {
      userInfo.terminalId = '2';
    }
    return userInfo.terminalId;
  }

  onLocationLOVSelect(event) {
    if (event.code != null && event.desc != "")
      this.documentViewForm.get('lovLocId').setValue(event.code);
    else {
      this.documentViewForm.get('lovLocId').setValue(null);
    }
  }

  openWindow() {
    console.log('DocumnetView : Edit Window is opened')
    this.editwindow.open();
  }


  updateFlag: boolean;
  onEditWindowClose() {
    this.updateFlag = true
    this.onSearchDocumentView();
    //this.updateFlag = false;
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
    let maskedFltNum = this.documentService.fltMasking(this.documentViewForm.get("flightNo").value);
    this.documentViewForm.controls.flightNo.setValue(maskedFltNum);
  }

  protected handleBusinessEvent(event: BroadcastEvent): void {
    this.pigeonHoleLocLOV = this.createSourceParameter(this.getOfficeId());
  }

  ngOnDestroy() { }

}
