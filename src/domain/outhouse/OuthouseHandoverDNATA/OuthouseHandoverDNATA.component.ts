import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';

// NGC framework imports
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, NotificationMessage, PageConfiguration, NgcReportComponent
} from 'ngc-framework';

import { OuthouseService } from '../outhouse.service';
import { OuthouseAcceptance, AcceptedMailDispatch, AcceptedMailDispatchDetails } from '../outhouse.sharedmodel';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-OuthouseHandoverDNATA',
  templateUrl: './OuthouseHandoverDNATA.component.html',
  styleUrls: ['./OuthouseHandoverDNATA.component.scss']
})
export class OuthouseHandoverDNATAComponent extends NgcPage implements OnInit {

  response: any;
  dataToPatch: any;
  showList: boolean = false;
  showHandover: boolean = false;
  showTabs: boolean = false;
  trans: any;
  x = new Array();
  reportParameters: any;

  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  @ViewChild('reportWindow2') reportWindow2: NgcReportComponent;
  arr: any;
  arr1: any;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private activatedRoute: ActivatedRoute, private router: Router,
    private outhouseService: OuthouseService) {
    super(appZone, appElement, appContainerElement);
  }

  private outhouseHandoverForm: NgcFormGroup = new NgcFormGroup
    ({
      flight: new NgcFormControl(),
      carrierCode: new NgcFormControl(),
      fromDate: new NgcFormControl(),
      toDate: new NgcFormControl(),
      dispatchNumber: new NgcFormControl(),
      outhouseAcceptance: new NgcFormArray([]),
      outhouseHandover: new NgcFormArray([]),
      tempArray: new NgcFormArray([]),
      mailId: new NgcFormControl()
    })
  temp: any = [];
  ngOnInit() {
  }

  onTransferMailbag($event) {
    this.arr = this.outhouseHandoverForm.getRawValue().tempArray;
    this.arr1 = this.outhouseHandoverForm.getRawValue().outhouseAcceptance;
    this.temp = [];

    this.arr1.forEach(value => {
      if (value.select) {
        value.select = false;
        value.flagCRUD = "C";
        this.arr.push(value);
        value.acceptedMailDispatchDetails.forEach(element => {
          element.flagCRUD = "C";
        });
      }

      else {
        this.temp.push(value);
      }
    });

    this.outhouseHandoverForm.get('tempArray').patchValue(this.arr);
    this.outhouseHandoverForm.get('outhouseAcceptance').patchValue(this.temp);

  }
  onTransferBackMailbag($event) {
    this.arr = this.outhouseHandoverForm.getRawValue().tempArray;
    this.arr1 = this.outhouseHandoverForm.getRawValue().outhouseAcceptance;
    this.temp = [];

    this.arr.forEach(value => {
      if (value.select) {
        value.select = false;
        value.flagCRUD = "C";
        this.arr1.push(value);
        value.acceptedMailDispatchDetails.forEach(element => {
          element.flagCRUD = "C";
        });
      }

      else {
        this.temp.push(value);
      }
    });

    this.outhouseHandoverForm.get('tempArray').patchValue(this.temp);
    this.outhouseHandoverForm.get('outhouseAcceptance').patchValue(this.arr1);

  }
  onSearch() {
    const request: OuthouseAcceptance = new OuthouseAcceptance();
    request.flight = this.outhouseHandoverForm.get('flight').value;
    request.fromDate = this.outhouseHandoverForm.get('fromDate').value;
    request.toDate = this.outhouseHandoverForm.get('toDate').value;
    request.carrierCode = this.outhouseHandoverForm.get('carrierCode').value;
    request.dispatchNumber = this.outhouseHandoverForm.get('dispatchNumber').value;
    if (request.flight === "") {
      request.flight = null;
    }

    if (request.dispatchNumber === "") {
      request.dispatchNumber = null;
    }

    if ((request.fromDate === null) || (request.toDate === null)) {
      this.showErrorStatus("error.enter.mandatory.to.continue");
    }
    else {
      this.outhouseService.fetchOuthouseAcceptanceDetails(request).subscribe(data => {
        if (!data.messageList) {
          if (data.data.length != 0) {
            this.showTabs = true;
            this.showList = true;
            this.showHandover = true;
            this.response = data.data;
            let arrayAcceptance = new Array();
            let arrayAcceptanceFiltered = new Array();
            let arrayHandover = new Array();

            this.response.forEach((element, index) => {
              let objArrAccp = element.acceptedMailDispatchDetails.filter(a => { return a.status === "ACCEPTED" });
              let objArrDlv = element.acceptedMailDispatchDetails.filter(a => { return a.status === "DELIVERED" });
              if (objArrAccp.length > 0) {
                element.acceptedMailDispatchDetails = objArrAccp;
                arrayAcceptance.push(element);
              }
              if (objArrDlv.length > 0) {
                element.acceptedMailDispatchDetails = objArrDlv;
                arrayHandover.push(element);
              }
            });
            arrayAcceptance.forEach(element => {
              if (this.temp.length != 0) {
                this.arr.forEach(tempelement => {
                  if (element.dnNumber == tempelement.dnNumber) {
                    element.duplicate = true;
                  }
                });
              }
            });
            arrayAcceptance.forEach(element => {
              element.select = false;
              if (element.duplicate == false) {
                arrayAcceptanceFiltered.push(element);
              }
            });
            (<NgcFormArray>this.outhouseHandoverForm.controls['outhouseAcceptance']).patchValue(arrayAcceptanceFiltered);
            (<NgcFormArray>this.outhouseHandoverForm.controls['outhouseHandover']).patchValue(arrayHandover);

            this.resetFormMessages();
          }
          else {
            this.showTabs = false;
            this.showList = false;
            this.showErrorStatus("no.record");
          }
        }
        else {
          this.showTabs = false;
          this.showList = false;
          this.refreshFormMessages(data);
        }
      });
    }
  }

  handover() {
    this.trans = new Array();
    let index = 0;
    let req = (<NgcFormArray>this.outhouseHandoverForm.get(['tempArray'])).getRawValue();
    const handoverArray: any = req;
    handoverArray.forEach(element => {
      element.fromDate = this.outhouseHandoverForm.get('fromDate').value;
      element.toDate = this.outhouseHandoverForm.get('toDate').value;
    });
    // req.forEach(e => {
    //   if (e.select) {
    //     handoverArray.push(e);
    //     this.trans.push(index);
    //   }
    //   index++;
    // });
    // if (handoverArray.length === 0) {
    //   this.showErrorStatus("Please Select Mailbag To Handover");
    // } else {
    this.outhouseService.handoverOuthouseMailbag(handoverArray).subscribe(data => {
      if (!data.data) {
        this.refreshFormMessages(data);
      }
      else {
        this.resetFormMessages();
        const request: OuthouseAcceptance = new OuthouseAcceptance();
        request.flight = this.outhouseHandoverForm.get('flight').value;
        request.fromDate = this.outhouseHandoverForm.get('fromDate').value;
        request.toDate = this.outhouseHandoverForm.get('toDate').value;
        request.dispatchNumber = this.outhouseHandoverForm.get('dispatchNumber').value;
        request.carrierCode = this.outhouseHandoverForm.get('carrierCode').value;
        if (request.flight === "") {
          request.flight = null;
        }
        if (request.dispatchNumber === "") {
          request.dispatchNumber = null;
        }
        this.outhouseService.fetchOuthouseAcceptanceDetails(request).subscribe(data => {
          if (data.data) {
            this.showList = true;
            this.response = data.data;
            this.showTabs = true;
            this.showHandover = true;

            for (let index = 0; index < this.response.length; index++) {
              this.response[index]['acceptedMailDispatchDetails'] = this.response[index]['acceptedMailDispatchDetails']
                .filter(a => a.status === "DELIVERED");
            }
            this.response = this.response.filter(a => a.acceptedMailDispatchDetails.length);

            (<NgcFormArray>this.outhouseHandoverForm.controls['outhouseHandover']).patchValue(this.response);
            this.showSuccessStatus("g.completed.successfully");
            this.onSearch();
            (<NgcFormArray>this.outhouseHandoverForm.controls['tempArray']).resetValue([]);
          }
        });
      }
    });

  }

  validateLastBag(item) {
    this.resetFormMessages();
    let index = item.record.NGC_ROW_ID;
    let handOverData = this.outhouseHandoverForm.getRawValue().outhouseAcceptance[index];
    if (handOverData.select) {
      let totalPieces = 0;
      let i = 0;
      handOverData.acceptedMailDispatchDetails.forEach(obj => {
        totalPieces = totalPieces + obj.pieces;
        if (obj.lastBagIndicator) {
          i = 1;
        }
        if (i === 1 && Number(obj.receptacleNumber) !== totalPieces) {
          i = 2;
        }
      });
      if (i === 0) {
        this.outhouseHandoverForm.get(['outhouseAcceptance', index, 'select']).patchValue(false);
        this.showErrorMessage("error.some.mailbags.incomplete");
        return;
      }
      if (i === 2) {
        this.outhouseHandoverForm.get(['outhouseAcceptance', index, 'select']).patchValue(false);
        this.showErrorMessage("error.some.mailbags.incomplete");
        return;
      }
    }

  }

  onClear() {
    this.outhouseHandoverForm.reset();
    (<NgcFormArray>this.outhouseHandoverForm.controls['outhouseAcceptance']).resetValue([]);
    (<NgcFormArray>this.outhouseHandoverForm.controls['tempArray']).resetValue([]);
    (<NgcFormArray>this.outhouseHandoverForm.controls['outhouseHandover']).resetValue([]);
    this.showList = false;
    this.showHandover = false;
    this.showTabs = false;
    this.arr = [];
    this.arr1 = [];
    this.resetFormMessages();
  }

  exportToExcelhandover() {

    this.reportParameters = new Object();
    this.reportParameters.carriercode = this.outhouseHandoverForm.get('carrierCode').value;
    this.reportParameters.fromdate = NgcUtility.getDateAsString(this.outhouseHandoverForm.get('fromDate').value);
    this.reportParameters.todate = NgcUtility.getDateAsString(this.outhouseHandoverForm.get('toDate').value);
    if (this.outhouseHandoverForm.get('dispatchNumber').value != null) {
      this.reportParameters.flag = '1'
      this.reportParameters.dispatchnumber = this.outhouseHandoverForm.get('dispatchNumber').value;
    }
    else {
      this.reportParameters.flag = '0'
    }
    this.reportWindow1.reportParameters = this.reportParameters;
    this.reportWindow1.downloadReport();

  }
  exportToExcelhandoverhistory() {

    this.reportParameters = new Object();
    this.reportParameters.carriercode = this.outhouseHandoverForm.get('carrierCode').value;
    this.reportParameters.fromdate = NgcUtility.getDateAsString(this.outhouseHandoverForm.get('fromDate').value);
    this.reportParameters.todate = NgcUtility.getDateAsString(this.outhouseHandoverForm.get('toDate').value);
    if (this.outhouseHandoverForm.get('dispatchNumber').value != null) {
      this.reportParameters.flag = '1'
      this.reportParameters.dispatchnumber = this.outhouseHandoverForm.get('dispatchNumber').value;
    }
    else {
      this.reportParameters.flag = '0'
    }
    this.reportWindow2.reportParameters = this.reportParameters;
    this.reportWindow2.downloadReport();
  }
  appendDsn() {
    let dispatchNumber = this.outhouseHandoverForm.get("dispatchNumber").value
    if (dispatchNumber.length === 1) {
      this.outhouseHandoverForm.get("dispatchNumber").patchValue('000' + dispatchNumber);
    } else if (dispatchNumber.length === 2) {
      this.outhouseHandoverForm.get("dispatchNumber").patchValue('00' + dispatchNumber);
    } else if (dispatchNumber.length === 3) {
      this.outhouseHandoverForm.get("dispatchNumber").patchValue('0' + dispatchNumber);
    }
  }
  emailTrigger() {
    const request: any = new OuthouseAcceptance();
    request.emailId = [];
    request.fromDate = this.outhouseHandoverForm.get('fromDate').value;
    request.toDate = this.outhouseHandoverForm.get('toDate').value;
    request.carrierCode = this.outhouseHandoverForm.get('carrierCode').value;
    request.emailId = this.outhouseHandoverForm.get('mailId').value;
    this.outhouseService.sendEmail(request).subscribe(data => {

    })
  }

  public onBack(event) {
    this.router.navigate(['']);
  }

}
