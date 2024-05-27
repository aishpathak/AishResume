import { DocumentService } from './../document/document.service';
import { FlightReportRequest } from './../document/document.sharedmodel';
import { Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, PageConfiguration } from 'ngc-framework';
import { Component, OnInit, ViewContainerRef, NgZone, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms/forms";
import { EXPBU_ENV } from './../../../../environments/environment';

@Component({
  selector: 'app-flightreport',
  templateUrl: './flightreport.component.html',
  styleUrls: ['./flightreport.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})

export class FlightReportComponent extends NgcPage implements OnInit {

  /**
   * Global Variables Declared
   */
  previousRoute: any;
  show = false;
  responseArray: any[];

  /**
   * Search-Criteria-Form-Fields used
   */
  formReport: NgcFormGroup = new NgcFormGroup({
    dateFrom: new NgcFormControl(),
    dateTo: new NgcFormControl(),
    locTrans: new NgcFormControl(),
    eccHandled: new NgcFormControl(),
    flightNo: new NgcFormControl(),
    carrier: new NgcFormControl(),
    discrepancy: new NgcFormControl(),
    uplifted: new NgcFormControl(),
    date: new NgcFormControl(),
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
    // this.officeName = this.sessionDetails.officeName;
  }

  ngAfterViewInit() {
  }

  getReport() {
    let flightreport: FlightReportRequest = new FlightReportRequest();
    flightreport.dateFrom = this.datepipe(this.formReport.get("dateFrom").value);
    flightreport.dateTo = this.datepipe(this.formReport.get("dateTo").value);
    flightreport.carrier = this.formReport.get("carrier").value;
    flightreport.flightNo = this.formReport.get("flightNo").value;
    flightreport.date = this.dateForDatepipe(this.formReport.get("date").value);

    // if (this.formReport.get("locTrans").value == "select") {
    //   flightreport.locTrans = null;
    // } else {
    flightreport.locTrans = this.formReport.get("locTrans").value;
    // }
    // if (this.formReport.get("discrepancy").value == "select") {
    //   flightreport.discrepancy = null;
    // } else {
    flightreport.discrepancy = this.formReport.get("discrepancy").value;
    // }
    // if (this.formReport.get("eccHandled").value == "select") {
    //   flightreport.eccHandled = null;
    // } else {
    flightreport.eccHandled = this.formReport.get("eccHandled").value;
    // }
    // if (this.formReport.get("uplifted").value == "select") {
    //   flightreport.uplifted = null;
    // } else {
    flightreport.uplifted = this.formReport.get("uplifted").value;
    // }

    this.documentService.getFlightReport(flightreport).subscribe(responseBean => {
      // alert(JSON.stringify(responseBean));
      if (!this.refreshFormMessages(responseBean)) {
        this.responseArray = responseBean.data.flightReport;
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

  datepipe(inputDate) {
    if ((inputDate === '') || (inputDate === null)) {
      return inputDate;
    } else {
      const parseDate = new Date(inputDate);
      return (("0" + parseDate.getDate()).slice(-2) + this.getMonthName(parseDate.getMonth()) + parseDate.getFullYear() + ' ' + ('0' + parseDate.getHours()).slice(-2) + ":" + ('0' + parseDate.getMinutes()).slice(-2));
    }
  }

  dateForDatepipe(inputDate) {
    if ((inputDate === '') || (inputDate === null)) {
      return inputDate;
    } else {
      const parseDate = new Date(inputDate);
      return (("0" + parseDate.getDate()).slice(-2) + this.getMonthName(parseDate.getMonth()) + parseDate.getFullYear());
    }
  }

  dateForTmrDatepipe(inputDate) {
    if ((inputDate === '') || (inputDate === null)) {
      return inputDate;
    } else {
      const parseDate = new Date(inputDate);
      parseDate.setDate(parseDate.getDate() + 1);
      return (("0" + parseDate.getDate()).slice(-2) + this.getMonthName(parseDate.getMonth() - 1) + parseDate.getFullYear() + ' ' + "00:00");
    }
  }

  getMonthName(number) {
    const monthNames = new Array('Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec');
    return monthNames[number];
  }

}
