import { DocumentService } from './../document/document.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Input, ViewChild, OnDestroy } from '@angular/core';
import { RestService, BaseRequest, BaseResponse, BroadcastEvent, BusinessBroadcastEvents } from 'ngc-framework';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcWindowComponent, NgcDateTimeInputComponent, NgcDataTableComponent, NgcInputComponent, NgcDropDownListComponent, PageConfiguration, UserProfile } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from "@angular/forms/forms";
//import { GpsComponent } from "../gps/gps.component";
import { Observable, Subscription } from "rxjs";
import { Location } from '@angular/common';
import { FlightViewRequestObject } from "../document/document.sharedmodel";
import { FlightPouchRequest } from "../flightpouch/flightpouch.shared";


@Component({
  selector: 'app-flightview',
  templateUrl: './flightview.component.html',
  styleUrls: ['./flightview.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})

export class FlightviewComponent extends NgcPage implements OnInit, OnDestroy {

  @ViewChild('gpsWindow') gpsWindow: NgcWindowComponent;
  // @ViewChild('windowLocation') windowLocation: NgcWindowComponent;
  @ViewChild('dateFrom') dateFrom: NgcDateTimeInputComponent;
  @ViewChild('dateTo') dateTo: NgcDateTimeInputComponent;
  @ViewChild('flightDate') flightDate: NgcDateTimeInputComponent;
  //@ViewChild('gps') gps: GpsComponent;
  @ViewChild('FlightViewTable') FlightViewTable: NgcDataTableComponent;
  @ViewChild('pouchStatusDD') pouchStatusDD: NgcDropDownListComponent;

  dateFromSub: Subscription = new Subscription();
  dateToSub: Subscription = new Subscription();
  flightDateSub: Subscription = new Subscription();
  getFlightViewDetails1: Subscription = new Subscription();
  flightViewSub2: Subscription = new Subscription();

  show = false;
  responseArray: any[];
  dateToMin: Date;
  dateToMax: Date;
  gps_latitude: number;
  gps_longitude: number;
  currentPageIndex = 0;
  recordsPerPage = 20;
  responseMessage: any[];
  previousRoute: any;

  /**
   * Search-Criteria-Form-Fields used
   */
  formFlightView: NgcFormGroup = new NgcFormGroup({
    dateTime: new NgcFormControl(),
    dateFrom: new NgcFormControl(),
    dateTo: new NgcFormControl(),
    officeDropDown: new NgcFormControl(),
    carrierGroup: new NgcFormControl(),
    carrier: new NgcFormControl(),
    pouchStatus: new NgcFormControl(),
    flightId: new NgcFormControl(),
    flightNo: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    discrepancy: new NgcFormControl(),
    pouchId: new NgcFormControl(),
    tempLocId: new NgcFormControl(),
    phlocId: new NgcFormControl(),
    flightViewFlightList: new NgcFormArray([]),
  })

  /**
   * Injecting Required Dependencies
   */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private documentService: DocumentService, private router: Router, private location: Location) {
    super(appZone, appElement, appContainerElement);
    this.previousRoute = sessionStorage.getItem('previousRoute');
    console.log('FLIGHT VIEW : ' + this.previousRoute);
    sessionStorage.setItem('previousRoute', this.router.url);

    if (this.previousRoute != null) {
      if (this.previousRoute.includes('export/cdh/documentview') && this.documentService.flightViewReq.flightKeyInTable !== undefined) {
        console.log('This page is navigated from /documentview');

        this.formFlightView.get("dateFrom").setValue(this.documentService.flightViewReq.dateFromInForm);
        this.formFlightView.get("dateTo").setValue(this.documentService.flightViewReq.dateToInForm);
        this.formFlightView.get('carrier').setValue(this.documentService.flightViewReq.carrierInForm);
        this.formFlightView.get('pouchStatus').setValue(this.documentService.flightViewReq.pouchStatusInForm);

        this.formFlightView.get('flightNo').setValue(this.documentService.flightViewReq.flightNoInForm);
        this.formFlightView.get("flightDate").setValue(this.documentService.flightViewReq.flightDateInForm);
        this.formFlightView.get("discrepancy").setValue(this.documentService.flightViewReq.discrepancyInForm);
        this.formFlightView.get('pouchId').setValue(this.documentService.flightViewReq.pouchIdInForm);

        this.getFlightViewDetails();
      }
    }
  }

  ngOnInit() {
    super.ngOnInit();
    // this.showInfoStatus('');
    // this.sessionDetails = JSON.parse(sessionStorage.getItem('sessionDetails'));
    // if (this.sessionDetails == null) {
    //   this.router.navigate(['']);
    //   return;
    // }
    this.setSystemDateAndTime();
    if (this.getUserProfile() === null) {
      this.formFlightView.get('officeDropDown').setValue(2);
    } else if (this.getUserProfile().terminalId.includes('T3')) {
      this.formFlightView.get('officeDropDown').setValue(1);
    } else if (this.getUserProfile().terminalId.includes('T5')) {
      this.formFlightView.get('officeDropDown').setValue(2);
    }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.formFlightView.controls['dateFrom'].valueChanges.subscribe(data => {
      this.dateToMin = new Date(this.formFlightView.get('dateFrom').value);
      this.dateToMax = new Date(this.formFlightView.get('dateFrom').value);
      this.dateToMin.setDate(this.dateToMin.getDate());
      this.dateToMax.setDate(this.dateToMax.getDate() + 30);
    });

    // this.dateFromSub = this.formFlightView.controls['dateFrom'].valueChanges.subscribe(data => {
    //   this.dateFrom.focus();
    //   if(this.formFlightView.get("dateFrom").value != null || this.formFlightView.get("dateFrom").value == null) {
    //     this.formFlightView.get("dateFrom").setValue(data);
    //   }
    // });

    // this.dateToSub = this.formFlightView.controls['dateTo'].valueChanges.subscribe(data => {
    //   this.dateTo.focus();
    //   if(this.formFlightView.get("dateTo").value != null || this.formFlightView.get("dateTo").value == null) {
    //     this.formFlightView.get("dateTo").setValue(data);
    //   }
    // });

    // this.flightDateSub = this.formFlightView.controls['flightDate'].valueChanges.subscribe(data => {
    //   this.flightDate.focus();
    //   if(this.formFlightView.get("flightDate").value != null || this.formFlightView.get("flightDate").value == null) {
    //     this.formFlightView.get("flightDate").setValue(data);
    //   }
    // });
  }

  /**
   * Set System date and Time at top right side corner of the dashboard
   */
  setSystemDateAndTime() {
    var objDate = new Date();
    this.formFlightView.get('dateTime').setValue(("0" + objDate.getDate()).slice(-2) + "-" +
      objDate.toLocaleString("en-us", { month: "short" }) + "-" +
      objDate.getFullYear().toString().substr(2) + " " +
      ('0' + objDate.getHours()).slice(-2) + ":" + ('0' + objDate.getMinutes()).slice(-2)
    );
  }

  pouchTrimming() {
    let trimmedPouchId = this.documentService.trimPouch(this.formFlightView.get("pouchId").value);
    this.formFlightView.controls.pouchId.setValue(trimmedPouchId);
  }

  /**
   * Get Flight-View-Detail-List + Set Color codes based on Condition
   * on clikcing 'Search' button
   */
  getFlightViewDetails() {
    if (this.clientSideSearchCriteriaValidation()) {
    }
    else {
      let flightView: FlightViewRequestObject = new FlightViewRequestObject();
      flightView.dateFrom = this.datepipe(this.formFlightView.get("dateFrom").value);
      flightView.dateTo = this.datepipe(this.formFlightView.get("dateTo").value);
      flightView.carrier = this.formFlightView.get('carrier').value;
      flightView.pouchStatus = this.formFlightView.get('pouchStatus').value;
      flightView.flightNo = this.formFlightView.get('flightNo').value
      flightView.flightDate = this.datepipe(this.formFlightView.get("flightDate").value);
      if (this.formFlightView.get("discrepancy").value == "select") {
        flightView.discrepancy = '';
      } else {
        flightView.discrepancy = this.formFlightView.get("discrepancy").value;
      }
      flightView.pouchId = this.formFlightView.get('pouchId').value;
      flightView.officeId = this.formFlightView.get("officeDropDown").value;
      flightView.office = (this.formFlightView.get("officeDropDown").value == 1 ? 'T3' : 'T5');

      //ii)Calling Service to get Flight-View-Detail-List
      this.getFlightViewDetails1 = this.documentService.getFlightViewDetails(flightView).subscribe(responseBean => {
        // console.log("FlightViewResponse ->" + JSON.stringify(responseBean));
        this.show = false;
        this.refreshFormMessages(responseBean);
        this.responseArray = responseBean.data;
        this.responseMessage = responseBean.messageList;

        if (this.responseMessage != null) {
          var errorMessage = this.responseMessage.map((item) => item.message)[0];
          this.showErrorStatus(errorMessage);
          return;
        }
        else {
          if (this.responseArray.length === 0) {
            this.showErrorStatus("export.no.result.found.for.search.criteria");
            this.formFlightView.controls['flightViewFlightList'].patchValue(this.responseArray);
          }
          else if (this.responseArray.length > 0) { // && this.router.url === '/flightview'

            //---------------------Get Data from server and Patch : On First Time Search----------------
            // console.log("FlightViewResponse ->" + JSON.stringify(this.responseArray));
            this.formFlightView.controls['flightViewFlightList'].patchValue(this.responseArray);
            // this.bayChangeFlag = this.responseArray.map((item) => item.bayChangeFlag);
            this.show = true;
            this.showSuccessStatus("export.operation.successful.for.flight.view");
            // get record - Karmen ( Flightview no need auto paginate)

            // this.flightViewSub2 = this.documentService.getFlightViewDetails(flightView).subscribe(responseBean => {
            //   this.responseArray = responseBean.data;
            //   this.formFlightView.controls['flightViewFlightList'].patchValue(this.responseArray);
            //   this.bayChangeFlag = this.responseArray.map((item) => item.bayChangeFlag);
            // });

            /*

          //---------Get Fresh Data From DB on every 1 Min : (Not showing 'Successfull Message')----------
          Observable.interval(1000 * 60).subscribe(x => {
            this.documentService.getFlightViewDetails(flightView).subscribe(responseBean => {
              this.responseArray = responseBean.data;
              this.formFlightView.controls['flightViewFlightList'].patchValue(this.responseArray);
              this.bayChangeFlag = this.responseArray.map((item) => item.bayChangeFlag);
            });
          });

          //-------------------------------- AutoPaginate on every 10 seconds--------------------------------
          this.currentPageIndex = 0;
          Observable.interval(1000 * 10).subscribe(x => {
            this.currentPageIndex++;
            if (this.currentPageIndex >= (
              (this.responseArray.length + (this.recordsPerPage - (this.responseArray.length % this.recordsPerPage)
              )) / this.recordsPerPage)) {
              this.currentPageIndex = 0;
            }
            this.FlightViewTable.goToPage(this.currentPageIndex);
          });
          */

          }
        }
      }, error => {
        this.showErrorStatus("NO_RECORDS_EXIST");
      }
      );
    }
  }

  /**
   * Validations Required at client side
   */
  clientSideSearchCriteriaValidation() {

    this.formFlightView.get('discrepancy').setValue(this.formFlightView.get('discrepancy').value == 'select' ? null : this.formFlightView.get('discrepancy').value);

    //1- Search Case I : If all Fileds are empty
    if (((this.formFlightView.get('flightNo').value) === null) &&
      ((this.formFlightView.get('flightDate').value) === null) &&
      ((this.formFlightView.get('dateFrom').value) === null) &&
      ((this.formFlightView.get('dateTo').value) === null) &&
      ((this.formFlightView.get('carrier').value) === null) &&
      ((this.formFlightView.get('pouchStatus').value) === null || (this.formFlightView.get('pouchStatus').value) === '') &&
      ((this.formFlightView.get('discrepancy').value) === null) &&
      ((this.formFlightView.get('pouchId').value) === null)
    ) {
      this.showErrorStatus('export.enter.search.criteria');
      return true;
    }

    if (this.formFlightView.get('dateFrom').value != null && this.formFlightView.get('flightNo').value != null) {
      this.showErrorStatus('export.select.by.date.range.flight.date');
      return true;
    }

    //2- Search Case II : Flight Number and Flight Date Combination Validation
    if (((this.formFlightView.get('flightNo').value) != null) && ((this.formFlightView.get('flightDate').value) === null)) {
      this.showErrorStatus('export.select.flight.date')
      return true;
    }
    else if (((this.formFlightView.get('flightDate').value) != null) && ((this.formFlightView.get('flightNo').value) === null)) {
      this.showErrorStatus('export.select.flight.number')
      return true;
    }

    //3- Search Case III : Date From and Date Combination
    else if (((this.formFlightView.get('dateFrom').value) != null) && ((this.formFlightView.get('dateTo').value) === null)) {
      this.showErrorStatus('export.select.to.date')
      return true;
    }
    else if (((this.formFlightView.get('dateTo').value) != null) && ((this.formFlightView.get('dateFrom').value) === null)) {
      this.showErrorStatus('export.select.from.date')
      return true;
    }

    //5 Search Case V: Date From and Date To(Doc Office is mandatory), Limit search range to 31 days
    else if ((this.formFlightView.get('dateFrom').value != null) && (this.formFlightView.get('dateTo').value != null)) {
      if (this.formFlightView.get('officeDropDown').value == null) {
        this.showErrorStatus('export.select.doc.office');
        return true;
      }
    }

    // 6 Search Case VI: If Carrier / Pouch Status / Discrepancy are selected, then Date range and Doc Office are  mandatory
    if (this.formFlightView.get('pouchId').value === null || this.formFlightView.get('flightNo').value === null || this.formFlightView.get('flightDate').value === null) {
      if ((this.formFlightView.get('carrier').value != null || (this.formFlightView.get('pouchStatus').value != null) ||
        (this.formFlightView.get('discrepancy').value != null))

      ) {
        if (((this.formFlightView.get('dateFrom').value) != null) && ((this.formFlightView.get('dateTo').value) === null)) {
          this.showErrorStatus('export.select.to.date')
          return true;
        }
        else if (((this.formFlightView.get('dateTo').value) != null) && ((this.formFlightView.get('dateFrom').value) === null)) {
          this.showErrorStatus('export.select.from.date')
          return true;
        }
        else if ((this.formFlightView.get('dateTo').value === null) && (this.formFlightView.get('dateFrom').value === null)) {
          this.showErrorStatus('export.select.from.date.to.date')
          return true;
        }

        if (this.formFlightView.get('officeDropDown').value == null) {
          this.showErrorStatus('export.select.doc.office');
          return true;
        }

      }
    }
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

  getMonthName(number) {
    const monthNames = new Array('Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec');
    return monthNames[number];
  }

  /**
      * Cells Renderer
      * @param value Value
      * @param rowData Row Data
      * @param level Level
      */
  public cellsRenderer = (row: number, column: string, value: any, rowData: any): string => {
    if (column === 'labelPrint') {
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.labelPrint} " />
                </svg>
            </div>
            `
    }
    else if (column === 'docReceived') {
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.docReceived} " />
                </svg>
            </div>
            `
    }
    else if (column === 'manFinal') {
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.manFinal} " />
                </svg>
            </div>
            `
    }
    else if (column === 'dlsFinal') {
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.dlsFinal} " />
                </svg>
            </div>
            `
    }
    else if (column === 'pouchStart') {
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.pouchStart} " />
                </svg>
            </div>
            `
    }
    else if (column === 'pouchComplete') {
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.pouchComplete} " />
                </svg>
            </div>
            `
    }
    else if (column === 'pochReady') {
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.pochReady} " />
                </svg>
            </div>
            `
    }
    else if (column === 'pouchCheckout') {
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.pouchCheckout} " />
                </svg>
            </div>
            `
    }
    else if (column === 'pouchDelvdToAC') {
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.pouchDelvdToAC} " />
                </svg>
            </div>
            `
    }
    else if (column === 'changedBayLocation') {
      if (rowData.changedBayLocation === null || rowData.changedBayLocation === undefined) {
        return `<div></div>`
      }
      else if ((rowData.changedBayLocation).includes("_")) {
        //   row='${row} data-column='${column} '
        return `
                <div>
                  <i class="fa fa-map-marker" style="color: red" aria-hidden="true" data-type='link'></i>
                    ${rowData.changedBayLocation.split("_")[0]}
                </div>
                `
      } else {
        return `
                  <div>
                      ${rowData.changedBayLocation}
                  </div>
                `
      }
    }
    else if (column === 'bay') {
      if (rowData.bay == '' || rowData.bay == null) {
        return `
            <div> </div>
            `
      }
      else if (rowData.bayChangeFlag == 'Y') {
        return `
            <div style="color:red; font-weight:bold"> ${rowData.bay} </div>
            `
      }
      else {
        return `
            <div> ${rowData.bay} </div>
            `
      }
    }
  };

  onLinkClick(event) {
    //If Flight-Carrier Link is clicked
    if (event.column === 'flightKey') {

      //Get and set Values Entered in Search Criteria
      this.documentService.flightViewReq.dateFromInForm = this.datepipe(this.formFlightView.get("dateFrom").value);
      this.documentService.flightViewReq.dateToInForm = this.datepipe(this.formFlightView.get("dateTo").value);
      this.documentService.flightViewReq.carrierInForm = this.formFlightView.get('carrier').value;
      this.documentService.flightViewReq.pouchStatusInForm = this.formFlightView.get('pouchStatus').value;
      this.documentService.flightViewReq.flightNoInForm = this.formFlightView.get('flightNo').value
      this.documentService.flightViewReq.flightDateInForm = this.datepipe(this.formFlightView.get("flightDate").value);
      this.documentService.flightViewReq.discrepancyInForm = this.formFlightView.get("discrepancy").value;
      this.documentService.flightViewReq.pouchIdInForm = this.formFlightView.get('pouchId').value;

      //Get and set FlightNo and FlightDate on the clicked row
      this.documentService.flightViewReq.flightKeyInTable = event.record.flightKey;
      this.documentService.flightViewReq.flightDateInTable = event.record.deptDate;
      this.router.navigate(['export/cdh/documentview']);
    }
    // else if (event.column === 'changedBayLocation') {
    // alert(event.record.phLocId + " " + event.record.flightId + " " + event.record.changedBayLocation);
    // this.formFlightView.get("flightId").setValue(event.record.flightId);
    // this.formFlightView.get("phlocId").setValue(event.record.changedBayLocation);
    // this.formFlightView.get("tempLocId").setValue(event.record.phlocId);
    // this.windowLocation.open();
    // }
    //If GPS-Icon  is clicked
    else if (event.column === undefined) {
      // let apiKey = 'AIzaSyCkKajUvAvb0U-laE-o82gNbWzC8KgoPG8'
      // lat: number = 12.914089;
      // lng: number = 77.624640;
      // alert(Number(event.record.changedBayLocation.split(",")[1]) + " " + Number(event.record.changedBayLocation.split(",")[2]))
      this.gps_latitude = Number(event.record.changedBayLocation.split("_")[1]);   // 12.917311;
      this.gps_longitude = Number(event.record.changedBayLocation.split("_")[2]);  // 77.619099;
      // window.open("https://www.google.com/maps/dir/?api=" + apiKey + "&map_action=map&destination=" + this.gps_latitude + "," + this.gps_longitude);
      // this.gps.refresh();
      this.gpsWindow.open();
    }
  }

  updateLocation() {
    let request: FlightViewRequestObject = new FlightViewRequestObject();
    request.flightId = this.formFlightView.get("flightId").value;
    request.phLocId = this.formFlightView.get("tempLocId").value;
    this.documentService.updatePHLocation(request).subscribe(responseBean => {
      if (!this.refreshFormMessages(responseBean)) {
        this.showSuccessStatus("export.location.updated.successfully");
        // this.windowLocation.hide();
        this.getFlightViewDetails();
      }
    }, error => {
      this.showErrorStatus("export.unable.update.location");
    });
  }

  onLocationLOVSelect(event) {
    if (event.code != null && event.desc != "")
      this.formFlightView.get('tempLocId').setValue(event.code);
    else {
      this.formFlightView.get('tempLocId').setValue(null);
    }
  }

  fltMasking() {
    //   let maskedFltNum = this.documentService.fltMasking(this.formFlightView.get("flightNo").value);
    //   this.formFlightView.controls.flightNo.setValue(maskedFltNum);
  }

  /**
  * Handle Business Event
  */
  protected handleBusinessEvent(event: BroadcastEvent): void {
    // if (event.eventId == BusinessBroadcastEvents.WAREHOUSE_EVENT) {
    // alert(event.data.terminalId);
    if (this.getUserProfile() === null) {
      this.formFlightView.get('officeDropDown').setValue(2);
    } else if (event.data.terminalId.includes('T3')) {
      this.formFlightView.get('officeDropDown').setValue(1);
    } else if (event.data.terminalId.includes('T5')) {
      this.formFlightView.get('officeDropDown').setValue(2);
    } else {
      this.formFlightView.get('officeDropDown').setValue(null);
    }
    // }
  }

  ngOnDestroy() {
    this.dateFromSub.unsubscribe();
    this.dateToSub.unsubscribe();
    this.flightDateSub.unsubscribe();
    this.getFlightViewDetails1.unsubscribe();
    this.flightViewSub2.unsubscribe();
  }

}
