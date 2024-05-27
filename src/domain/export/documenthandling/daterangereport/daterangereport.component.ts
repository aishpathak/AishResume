import { DocumentService } from './../document/document.service';
import { DateRangeReportRequest } from './../document/document.sharedmodel';
import { Router } from '@angular/router';
import { Component, OnInit, ViewContainerRef, NgZone, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms/forms";
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcDropDownListComponent, PageConfiguration, BroadcastEvent } from 'ngc-framework';
import { EXPBU_ENV } from './../../../../environments/environment';

@Component({
  selector: 'app-daterangereport',
  templateUrl: './daterangereport.component.html',
  styleUrls: ['./daterangereport.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  // restorePageOnBack: true
})

export class DateRangeReportComponent extends NgcPage implements OnInit {
  previousRoute: any;
  show = false;
  responseArray: any[];

  formReport: NgcFormGroup = new NgcFormGroup({
    dateFrom: new NgcFormControl(),
    dateTo: new NgcFormControl(),
    pouchStatus: new NgcFormControl(),
    eccPouch: new NgcFormControl(),
    officeId: new NgcFormControl(),
    carrier: new NgcFormControl(),
    discrepancy: new NgcFormControl(),
    slaMet: new NgcFormControl(),
    resultList: new NgcFormArray([])
  })

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private documentService: DocumentService, private router: Router) {
    super(appZone, appElement, appContainerElement);
    this.previousRoute = sessionStorage.getItem('previousRoute');
    console.log('DATE RANGE REPORT : ' + this.previousRoute);
    sessionStorage.setItem('previousRoute', this.router.url);
  }

  ngOnInit() {
    super.ngOnInit();
    // this.showInfoStatus('');
    // this.sessionDetails = JSON.parse(sessionStorage.getItem('sessionDetails'));
    // if (this.sessionDetails == null) {
    //   this.router.navigate(['']);
    //   return;
    // }
    // this.officeName = this.sessionDetails.officeName;
    // this.officeIdValue = this.sessionDetails.officeId;
    if (this.getUserProfile() === null) {
      this.formReport.get('officeId').setValue(2);
    } else if (this.getUserProfile().terminalId.includes('T3')) {
      this.formReport.get('officeId').setValue(1);
    } else if (this.getUserProfile().terminalId.includes('T5')) {
      this.formReport.get('officeId').setValue(2);
    }
  }

  ngAfterViewInit() {
  }

  getReport() {
    let daterangereport: DateRangeReportRequest = new DateRangeReportRequest();
    daterangereport.dateFrom = this.datepipe(this.formReport.get("dateFrom").value);
    daterangereport.dateTo = this.datepipe(this.formReport.get("dateTo").value);
    daterangereport.pouchStatus = this.formReport.get('pouchStatus').value;
    // daterangereport.selectedType = this.SelectedType;
    // if (this.formReport.get("eccPouch").value == "select") {
    //   daterangereport.eccPouch = null;
    // } else {
    daterangereport.eccPouch = this.formReport.get("eccPouch").value;
    // }
    daterangereport.officeId = this.formReport.get('officeId').value;
    daterangereport.carrier = this.formReport.get('carrier').value;
    // if (this.formReport.get("discrepancy").value == "select") {
    //   daterangereport.discrepancy = null;
    // } else {
    daterangereport.discrepancy = this.formReport.get("discrepancy").value;
    // }
    // if (this.formReport.get("slaMet").value == "select") {
    //   daterangereport.slaMet = null;
    // } else {
    daterangereport.slaMet = this.formReport.get("slaMet").value;
    // }

    this.documentService.getDateRangeReport(daterangereport).subscribe(responseBean => {
      // alert(JSON.stringify(responseBean));
      if (!this.refreshFormMessages(responseBean)) {
        this.responseArray = responseBean.data.dateRangeReport;
        this.formReport.controls['resultList'].patchValue(this.responseArray);
        this.show = true;
        this.showSuccessStatus("g.operation.successful");
      }
    }, error => {
      this.showErrorStatus("NO_RECORDS_EXIST");
      this.show = false;
    }
    );
  }

  /**
* Handle Business Event
*/
  protected handleBusinessEvent(event: BroadcastEvent): void {
    // if (event.eventId == BusinessBroadcastEvents.WAREHOUSE_EVENT) {
    // alert(event.data.terminalId);
    if (this.getUserProfile() === null) {
      this.formReport.get('officeId').setValue(2);
    } else if (event.data.terminalId.includes('T3')) {
      this.formReport.get('officeId').setValue(1);
    } else if (event.data.terminalId.includes('T5')) {
      this.formReport.get('officeId').setValue(2);
    } else {
      this.formReport.get('officeId').setValue(null);
    }
    // }
  }

  datepipe(inputDate) {
    if ((inputDate === '') || (inputDate === null)) {
      return inputDate;
    } else {
      const parseDate = new Date(inputDate);
      return (("0" + parseDate.getDate()).slice(-2) + this.getMonthName(parseDate.getMonth()) + parseDate.getFullYear() + ' ' + ('0' + parseDate.getHours()).slice(-2) + ":" + ('0' + parseDate.getMinutes()).slice(-2));
    }
  }

  dateForTmrDatepipe(inputDate) {
    if ((inputDate === '') || (inputDate === null)) {
      return inputDate;
    } else {
      const parseDate = new Date(inputDate);
      parseDate.setDate(parseDate.getDate() + 1);
      return (("0" + parseDate.getDate()).slice(-2) + this.getMonthName(parseDate.getMonth()) + parseDate.getFullYear() + ' ' + "00:00");
    }
  }

  getMonthName(number) {
    const monthNames = new Array('Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec');
    return monthNames[number];
  }

}