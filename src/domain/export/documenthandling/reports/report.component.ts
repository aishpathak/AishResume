import { DocumentService } from './../document/document.service';
import { ReportRequest } from './../document/document.sharedmodel';
import { Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormControl } from 'ngc-framework';
import { Component, OnInit, ViewContainerRef, NgZone, ElementRef, ViewChild } from '@angular/core';





@Component({
  selector: 'app-reports',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})

export class ReportComponent extends NgcPage implements OnInit {

  /**
   * Global Variables Declared
   */
  dateToMin: Date;
  dateToMax: Date;
  officeName: any;
  previousRoute: any;
  sessionDetails = null;

  @ViewChild('reportIFrame')
  private reportIFrame: ElementRef;

  
 
  /**
   * Search-Criteria-Form-Fields used
   */
  formReport: NgcFormGroup = new NgcFormGroup({
   // dateTime:  new NgcFormControl(), 
    dateFrom: new NgcFormControl(),
    dateTo: new NgcFormControl(),
   })


   /**
   * Injecting Required Dependencies
   */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
               private documentService: DocumentService, private router: Router) {
    super(appZone, appElement, appContainerElement);
      this.previousRoute = sessionStorage.getItem('previousRoute');
      sessionStorage.setItem('previousRoute', this.router.url);
  }


   ngOnInit() {
    super.ngOnInit();
     this.sessionDetails = JSON.parse(sessionStorage.getItem('sessionDetails'));
    if (this.sessionDetails == null) {
       this.router.navigate(['']);
      return;
    }
    this.officeName = this.sessionDetails.officeName;
  }


   ngAfterViewInit() {
    // this.formReport.controls['dateFrom'].valueChanges.subscribe(data => {
    //   this.dateToMin = new Date(this.formReport.get('dateFrom').value);
    //   this.dateToMax = new Date(this.formReport.get('dateFrom').value);
    //   this.dateToMin.setDate(this.dateToMin.getDate());
    //   this.dateToMax.setDate(this.dateToMax.getDate() + 100000);
    // });
  }



   exportDocumentReport(){
     let reportRequest: ReportRequest = new ReportRequest();
     reportRequest.dateFrom = this.datepipe(this.formReport.get("dateFrom").value);
     reportRequest.dateTo   = this.datepipe(this.formReport.get("dateTo").value);
     reportRequest.reportName = "Document Report"

      const  url  = 'http://localhost:8080/rfid-tracker-report-apis/download-report?reportName=' + reportRequest.reportName +'&from_Date='+reportRequest.dateFrom +'&to_Date='+reportRequest.dateTo
      console.log(`Report URL ${url}`);
      (<HTMLIFrameElement>this.reportIFrame.nativeElement).src = url;
  }


 exportPouchReport(){
  let reportRequest: ReportRequest = new ReportRequest();
      reportRequest.dateFrom = this.datepipe(this.formReport.get("dateFrom").value);
      reportRequest.dateTo   = this.datepipe(this.formReport.get("dateTo").value);
      reportRequest.reportName = "PouchReport"

      const  url  = 'http://localhost:8080/rfid-tracker-report-apis/download-report?reportName=' + reportRequest.reportName +'&from_Date='+reportRequest.dateFrom +'&to_Date='+reportRequest.dateTo
      console.log(`Report URL ${url}`);
      (<HTMLIFrameElement>this.reportIFrame.nativeElement).src = url;
 } 


   datepipe(inputDate) {
    if ((inputDate === '') || (inputDate === null)) {
      return inputDate;
    } else {
      const parseDate = new Date(inputDate);
      //return (parseDate.getDate() + this.getMonthName(parseDate.getMonth()) + parseDate.getFullYear());
      //return (parseDate.getDate() + this.getMonthName(parseDate.getMonth()) + parseDate.getFullYear()+ ' ' + ('0'+parseDate.getHours()).slice(-2) + ":" + ('0'+parseDate.getMinutes()).slice(-2));
      return ( ("0" + parseDate.getDate()).slice(-2) + this.getMonthName(parseDate.getMonth()) + parseDate.getFullYear()+ ' ' + ('0'+parseDate.getHours()).slice(-2) + ":" + ('0'+parseDate.getMinutes()).slice(-2));
    
    }
  }

    dateForDatepipe(inputDate) {
    if ((inputDate === '') || (inputDate === null)) {
      return inputDate;
    } else {
      const parseDate = new Date(inputDate);
      //  return (parseDate.getDate() + this.getMonthName(parseDate.getMonth()) + parseDate.getFullYear());
      //return (parseDate.getDate() + this.getMonthName(parseDate.getMonth()) + parseDate.getFullYear()+ ' ' + ('0'+parseDate.getHours()).slice(-2) + ":" + ('0'+parseDate.getMinutes()).slice(-2));
      return ( ("0" + parseDate.getDate()).slice(-2) + this.getMonthName(parseDate.getMonth()) + parseDate.getFullYear());
    
    }
  }

  getMonthName(number) {
    const monthNames = new Array('Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec');
    return monthNames[number];
  }





}