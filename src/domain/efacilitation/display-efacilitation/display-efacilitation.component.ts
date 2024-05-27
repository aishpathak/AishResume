import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { EfacilitationService } from '../efacilitation.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NgcFormGroup, NgcFormControl, NgcFormArray, NgcPage, NgcUtility, PageConfiguration, NgcReportComponent
} from 'ngc-framework';

@Component({
  selector: 'app-display-efacilitation',
  templateUrl: './display-efacilitation.component.html',
  styleUrls: ['./display-efacilitation.component.scss']
})

@PageConfiguration({
  trackInit: true,
  focusToBlank: true,
  focusToMandatory: true,
  callNgOnInitOnClear: false,
})

export class DisplayEfacilitationComponent extends NgcPage implements OnInit {
  checkData: any;
  displayData: boolean = false;
  reportParameters: any;
  columnName: any;
  record: any;
  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    private router: Router,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private efacilitationService: EfacilitationService,
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private efacilitationForm: NgcFormGroup = new NgcFormGroup({
    status: new NgcFormControl(),
    agentName: new NgcFormControl(),
    serviceCode: new NgcFormControl(),
    serviceName: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    serviceRequestNo: new NgcFormControl(),
    customStatus: new NgcFormControl(),
    toDate: new NgcFormControl(NgcUtility.getCurrentDateOnly()),
    fromDate: new NgcFormControl(NgcUtility.getCurrentDateOnly()),
    flightInOrOutBound: new NgcFormControl(),
    satsStatus: new NgcFormControl(),
    flightfromDate: new NgcFormControl(),
    flighttoDate: new NgcFormControl()
  });

  private efaciitationDisplay: NgcFormGroup = new NgcFormGroup({
    eFacilitaionShipmentList: new NgcFormArray([
      new NgcFormGroup({
        approvalRejectionDate: new NgcFormControl(),
        mawb: new NgcFormControl(),

      })
    ])
  })

  ngOnInit() {
    super.ngOnInit();
    const forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData) {
      this.efacilitationForm.reset();
      this.efacilitationForm.get('toDate').setValue(forwardedData.toDate);
      this.efacilitationForm.get('fromDate').setValue(forwardedData.fromDate);
      // this.efacilitationForm.get('serviceRequestNo').setValue(forwardedData.serviceRequestNo);
      this.onClick();
    }
  }

  onClick() {

    if (!this.efacilitationForm.valid) {
      return;
    }
    else {
      let request = this.efacilitationForm.getRawValue();
      this.efacilitationService.getEFacilitationDetails(request).subscribe(response => {
        let data = response.data;
        this.displayData = false;
        if (!this.showResponseErrorMessages(response)) {

          if (data.length > 0) {
            let lineNum = 1;
            data.forEach(element => {
              if (element.flightInOrOutBound == 'In')
                element.mawb = "issue do";
              else
                element.mawb = "";
              if (element.approvedOn)
                element.approvalRejectionDate = element.approvedOn
              else
                element.approvalRejectionDate = element.rejectedOn
              element.lineNum = lineNum++;
            });
            this.efaciitationDisplay.get('eFacilitaionShipmentList').patchValue(data);
            this.displayData = true;
          }
          else {
            this.showInfoStatus("efacilitation.recordinfo");
          }
        }
      })
    }
  }


  onLinkClick(event) {
    console.log(event);
    if (event.type === 'link') {
      this.columnName = event.column;
      this.record = event.record;
      if (this.columnName == 'serviceRequestNo') {
        event.record.toDate = this.efacilitationForm.get('toDate').value;
        event.record.fromDate = this.efacilitationForm.get('fromDate').value;
        this.navigateTo(this.router, '/efacilitation/editefacilitation', event.record);
      }
      else if (this.columnName == 'shipmentNumber') {
        let navigateObj = {
          shipmentNumber: event.record.shipmentNumber
        }

        this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', navigateObj);
      }
      else if (this.columnName == 'mawb') {
        let navigateObj = {
          shipmentNumber: event.record.shipmentNumber
        }

        this.navigateTo(this.router, 'import/issuedo', navigateObj);
      }

    }

  }
  onDownload() {
    if (!this.efacilitationForm.valid) {
      return;
    }
    this.reportParameters = new Object();
    this.reportParameters.serviceName = this.efacilitationForm.get('serviceName').value;
    this.reportParameters.serviceRequestNo = this.efacilitationForm.get('serviceRequestNo').value;
    this.reportParameters.shipmentNumber = this.efacilitationForm.get('shipmentNumber').value;
    this.reportParameters.status = this.efacilitationForm.get('status').value;
    this.reportParameters.agentName = this.efacilitationForm.get('agentName').value;
    this.reportParameters.callFrom = 'INTERNAL';
    this.reportParameters.loggedInUser = this.getUserProfile().userLoginCode;
    this.reportParameters.fromDate = this.efacilitationForm.get('fromDate').value;
    this.reportParameters.toDate = this.efacilitationForm.get('toDate').value;
    this.reportWindow.downloadReport();

  }
  onClear() {
    this.displayData = false;
    this.efacilitationForm.reset();
    this.efacilitationForm.get('fromDate').setValue(NgcUtility.getCurrentDateOnly());
    this.efacilitationForm.get('toDate').setValue(NgcUtility.getCurrentDateOnly());
  }

  onCancel(){
    this.navigateHome();
  }
}

