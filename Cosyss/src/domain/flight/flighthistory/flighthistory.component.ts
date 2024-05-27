import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcUtility, NgcFormArray, NgcWindowComponent, PageConfiguration, NgcFileUploadComponent, NgcReportComponent } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../flight.service';
// import { FlightHistoryReqModel } from '../flight.sharedmodel';

@Component({
  selector: 'app-flighthistory',
  templateUrl: './flighthistory.component.html',
  styleUrls: ['./flighthistory.component.css']
})
@PageConfiguration({
  trackInit: true,
  //callNgOnInitOnClear: true,
  //autoBackNavigation: true
})
export class FlighthistoryComponent extends NgcPage {

  eventData = [];
  flagToDisplayData: boolean = false;
  forwardedData: any;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private flightService: FlightService, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  private historyInfoForm: NgcFormGroup = new NgcFormGroup({

    flightEntityValue: new NgcFormControl(''),
    flightOriginDate: new NgcFormControl(''),
    auditList: new NgcFormArray([])
  });

  ngOnInit() {
    let forwardedData = this.getNavigateData(this.activatedRoute);
    this.forwardedData = forwardedData;
    console.log("forwardedData", forwardedData);
    if (forwardedData) {
      this.historyInfoForm.get('flightEntityValue').patchValue(forwardedData.flightEntityValue);
      this.historyInfoForm.get('flightOriginDate').patchValue(forwardedData.flightOriginDate);
      this.onSearch();
    }

  }

  onSearch() {
    // const req: FlightHistoryReqModel = new FlightHistoryReqModel();
    const req: any = new Object();
    req.flightEntityValue = this.historyInfoForm.get('flightEntityValue').value;
    req.flightOriginDate = this.historyInfoForm.get('flightOriginDate').value;

    this.flightService.getFlightHistoryDetails(req).subscribe(response => {
      this.refreshFormMessages(response);
      console.log("response", response.data);
      if (response.data) {
        let auditListData = response.data;
        let index = 1;
        this.eventData = [];
        response.data.forEach(element => {
          element.sno = index++;
          element.flightEntityValue = JSON.parse(element.flightEntityValue).eventValue;
          this.eventData.push(element.flightEntityValue);
          console.log("eventData", element.flightEntityValue);
          console.log("eventData 1", this.eventData);
        });
        console.log("eventData 1", this.eventData);
        this.flagToDisplayData = true;
        this.historyInfoForm.get('auditList').patchValue(response.data);
      } else if (response.data.messageList) {
        this.flagToDisplayData = false;
      }
    });

  }
  // for the fix of 11213
  onCancel(event) {

    var carrierCode = this.historyInfoForm.get('flightEntityValue').value.substring(0, 2);
    var flightNo = this.historyInfoForm.get('flightEntityValue').value.substring(2, 6);
    var flightDate = this.historyInfoForm.get('flightOriginDate').value
    var dataToSend = {
      carrierCode: carrierCode,
      flightNo: flightNo,
      flightDate: this.forwardedData.flightDate
    }
    console.log("dataToSend", dataToSend);
    this.navigateTo(this.router, 'flight/maintenanceoperativeflight', dataToSend);

  }
}



