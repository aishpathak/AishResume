import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcFormControl, ReactiveModel, PageConfiguration, NgcReportComponent, NgcUtility } from 'ngc-framework';
import { BreakDownSummaryModel, BreakDownSummary, BreakDownSummaryUldModel, BreakDownSummaryTonnageHandledModel, ArrivalManifestFlight } from '../import.sharedmodel';
import { ImportService } from './../import.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationEntities } from '../../common/applicationentities';


@Component({
  selector: 'app-breakdownsummary',
  templateUrl: './breakdownsummary.component.html',
  styleUrls: ['./breakdownsummary.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true

})
export class BreakdownsummaryComponent extends NgcPage {
  delaystatus: any;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private importService: ImportService, private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }
  disableSaveFlag: boolean = false;
  saveFlag: boolean = false;
  printFlag: boolean = false;
  isFlightInformation: boolean = false;
  sourceIdSegmentDropdown: any;
  flightId: number = 0;
  reportParameters: any = new Object();
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;

  ngOnInit() {
    super.ngOnInit();
    console.log('this.searchForm');
    this.searchForm.get('flightDate').setValue(new Date());
    let workingListData = this.getNavigateData(this.activatedRoute);
    this.delaystatus = workingListData.screen;
    if (workingListData != null) {
      if (workingListData.flightNumber != null && workingListData.flightNumber != "" && workingListData.flightDate != null && workingListData.flightDate != "") {
        this.searchForm.get('flightNumber').setValue(workingListData.flightNumber);
        this.searchForm.get('flightDate').setValue(workingListData.flightDate);
        this.onSearch();
      }
    }
    (this.searchForm.get(["uldInfo"]) as NgcFormArray).addValue([
      new BreakDownSummaryUldModel()
    ]);
    (this.searchForm.get(["tonnageHandlingInfo"]) as NgcFormArray).addValue([
      new BreakDownSummaryTonnageHandledModel()
    ]);


    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData != null) {
      if (forwardedData.flightNumber != null && forwardedData.flightNumber != "" && forwardedData.flightDate != null && forwardedData.flightDate != "") {
        this.searchForm.get('flightNumber').setValue(forwardedData.flightNumber);
        this.searchForm.get('flightDate').setValue(forwardedData.flightDate);
        this.onSearch();
      }
    }
  }

  @ReactiveModel(BreakDownSummaryModel)
  public searchForm: NgcFormGroup;

  @ReactiveModel(BreakDownSummary)
  public breakDownSummary: NgcFormGroup;

  public onBack(event) {
    this.navigateBack(this.searchForm.getRawValue());
  }
  public onSearch(): void {
    let searchBreakDownSummary: ArrivalManifestFlight = new ArrivalManifestFlight();
    searchBreakDownSummary.flightNumber = this.searchForm.get('flightNumber').value;
    searchBreakDownSummary.flightDate = this.searchForm.get('flightDate').value;
    searchBreakDownSummary.uldNumber = this.searchForm.get('uldNumber').value;
    let uldInfoData: BreakDownSummaryModel = new BreakDownSummaryModel();
    this.importService.fetchBreakDownSummary(searchBreakDownSummary).subscribe(data => {
      console.log(data);
      if (data.messageList) {
        if (data.messageList.length > 0) {
          for (let index = 0; index < data.messageList.length; index++) {
            if (data.messageList[index].code == "") {
              delete data.messageList[index];
            }
          }
        }
      }
      this.isFlightInformation = false;
      this.refreshFormMessages(data);
      if (data.data) {
        this.isFlightInformation = true;
        this.saveFlag = true;
        this.printFlag = true;
        this.flightId = data.data.flightId;
        data.data.flightDate = data.data.flightDate;
        this.sourceIdSegmentDropdown = this.createSourceParameter(data.data.flightNo, this.searchForm.get('flightNumber').value, 'BREAKDOWN', data.data.flightId.toString(), null, null);
        this.searchForm.patchValue(data.data);
        this.breakDownSummary.get('liquIdatedDamageApplicable').patchValue(data.data.liquIdatedDamageApplicable);
        this.breakDownSummary.get('liquIdatedDamagesWaived').patchValue(data.data.liquIdatedDamagesWaived)
        this.searchForm.get("uldInfo").patchValue(data.data.uldInfo);
        this.searchForm.get("tonnageHandlingInfo").patchValue(data.data.tonnageHandlingInfo);
        this.searchForm.get("uldInfo").enable();
        this.searchForm.get("tonnageHandlingInfo").enable();
        this.breakDownSummary.enable();
        if (data.data.flightClosedFlag) {
          this.searchForm.get("uldInfo").disable();
          this.searchForm.get("tonnageHandlingInfo").disable();
          this.breakDownSummary.disable();
        }
        if (data.data.uldInfo.length == 0) {
          this.searchForm.get('tonnageULDWeight').setValue('0.0');
          this.searchForm.get('tonnageBulkWeight').setValue('0.0');
        }
        this.breakDownSummary.get('reasonForDelay').patchValue(data.data.reasonForDelay);
        this.breakDownSummary.get('reasonForWaive').patchValue(data.data.reasonForWaive)
        if (data.data.flightClosedFlag) {
          this.disableSaveFlag = true
        }
        else {
          this.disableSaveFlag = false
        }
      }
    });

  }

  public onSave(): void {
    let breakdownSummaryData: BreakDownSummary = new BreakDownSummary();
    let breakdownSummaryDatas: BreakDownSummaryModel = new BreakDownSummaryModel();
    breakdownSummaryData = this.constructRequest();
    breakdownSummaryDatas.tonnageInfo = (this.searchForm.get(["tonnageInfo"]) as NgcFormGroup).getRawValue();
    if (breakdownSummaryDatas.tonnageInfo.cargoType) {
      breakdownSummaryData.tonnageHandlingInfo.push(breakdownSummaryDatas.tonnageInfo);
    }
    breakdownSummaryData.uldInfo = (this.searchForm.get(["uldInfo"]) as NgcFormArray).getRawValue();
    this.importService.saveBreakdownSummary(breakdownSummaryData).subscribe(data => {

      if (!this.showResponseErrorMessages(data)) {
        this.showSuccessStatus('summary.details.saved.successfully');
        this.searchForm.get("tonnageHandlingInfo").patchValue(data.data.tonnageHandlingInfo);
        this.searchForm.get(["tonnageInfo"]).reset();




        if (this.delaystatus === 'Delay Status') {
          this.loadDelayStatus();
        }

        this.onSearch();
        // this.onPrint();
      }

    });

  }

  public subtractTonnage(event): void {
    let breakdownSummaryData: BreakDownSummary = new BreakDownSummary();
    let breakdownSummaryDatas: BreakDownSummaryModel = new BreakDownSummaryModel();
    breakdownSummaryData = this.constructRequest();
    breakdownSummaryDatas.tonnageInfo = (this.searchForm.get(["tonnageInfo"]) as NgcFormGroup).getRawValue();
    breakdownSummaryDatas.tonnageInfo.addTonnage = 'sub';
    breakdownSummaryData.tonnageHandlingInfo.push(breakdownSummaryDatas.tonnageInfo);
    this.importService.saveBreakdownSummary(breakdownSummaryData).subscribe(data => {
      this.showResponseErrorMessages(data);
      if (data.messageList == null) {
        this.showSuccessStatus('summary.details.saved.successfully');
        this.searchForm.get("tonnageHandlingInfo").patchValue(data.data.tonnageHandlingInfo);
        this.searchForm.get(["tonnageInfo"]).reset();
      }

    });
  }

  public addTonnage(): void {
    let breakdownSummaryData: BreakDownSummary = new BreakDownSummary();
    let breakdownSummaryDatas: BreakDownSummaryModel = new BreakDownSummaryModel();
    breakdownSummaryData = this.constructRequest();
    breakdownSummaryDatas.tonnageInfo = this.searchForm.get('tonnageInfo').value;
    breakdownSummaryDatas.tonnageInfo = (this.searchForm.get(["tonnageInfo"]) as NgcFormGroup).getRawValue();
    breakdownSummaryDatas.tonnageInfo.addTonnage = 'add';
    breakdownSummaryData.tonnageHandlingInfo.push(breakdownSummaryDatas.tonnageInfo);


    this.importService.saveBreakdownSummary(breakdownSummaryData).subscribe(data => {
      this.refreshFormMessages(data);
      if (data.messageList == null) {
        this.showSuccessStatus('summary.details.saved.successfully');
        this.searchForm.get("tonnageHandlingInfo").patchValue(data.data.tonnageHandlingInfo);
        this.searchForm.get(["tonnageInfo"]).reset();
      }

    });
  }

  public constructRequest(): BreakDownSummary {
    let breakdownSummaryData: BreakDownSummary = new BreakDownSummary();
    const searchData = this.searchForm.getRawValue();
    const summaryData = this.breakDownSummary.getRawValue();
    breakdownSummaryData.flightId = searchData.flightId;
    breakdownSummaryData.reasonForWaive = summaryData.reasonForWaive;
    breakdownSummaryData.reasonForDelay = summaryData.reasonForDelay;
    breakdownSummaryData.liquIdatedDamageApplicable = summaryData.liquIdatedDamageApplicable;
    breakdownSummaryData.liquIdatedDamagesWaived = summaryData.liquIdatedDamagesWaived;
    breakdownSummaryData.flightNumber = searchData.flightNumber;
    breakdownSummaryData.flightDate = searchData.flightDate;
    breakdownSummaryData.breakDownStaffGroup = 'AeroLog';
    //breakdownSummaryData.feedbackForStaff=summaroncancelyData.
    breakdownSummaryData.delayInMinutes = summaryData.delayInMinutes;
    breakdownSummaryData.tonnageHandlingInfo = (this.searchForm.get(["tonnageHandlingInfo"]) as NgcFormArray).getRawValue();
    return breakdownSummaryData;

  }

  public loadDelayStatus(): void {
    let shipmentData = {};
    shipmentData = {
      flightNumber: this.searchForm.get('flightNumber').value,
      flightDate: this.searchForm.get('flightDate').value
    };
    let url = "/import/delaystatus";
    this.navigateTo(this.router, url, shipmentData);
  }

  public onRating(): void {
    let breakdownSummaryData: BreakDownSummary = new BreakDownSummary();
    breakdownSummaryData.feedbackForStaff = this.breakDownSummary.get('feedbackForStaff').value;
    breakdownSummaryData.flightId = this.flightId;
    this.importService.updateFeddBack(breakdownSummaryData).subscribe(data => {
    });
  }

  public addEmail(): void {
    let breakdownSummaryData: BreakDownSummary = new BreakDownSummary();
    breakdownSummaryData = this.breakDownSummary.getRawValue();
    breakdownSummaryData.flightNumber = this.searchForm.get('flightNumber').value;
    breakdownSummaryData.flightDate = this.searchForm.get('flightDate').value;
    // for (let index = 0; index < breakdownSummaryData.emails.length; index++) {
    //  breakdownSummaryData.emails[index].flightkey = this.searchForm.get('flightNumber').value;
    // breakdownSummaryData.emails[index].flightDate = this.searchForm.get('flightDate').value;

    console.log(breakdownSummaryData);
    this.importService.sendEmail(breakdownSummaryData).subscribe(data => {

      if (!this.showResponseErrorMessages(data)) {
        this.showSuccessStatus('g.email.sent');

      }
      error => {
        this.showErrorStatus("Error:" + error);
      }

    });

  }

  // public onSATSChange(): void {
  //   const items = (this.searchForm.get(["uldInfo"]) as NgcFormArray).getRawValue();
  //   for (let index = 0; index < items.length; index++) {
  //     if (items[index].sats == "YES") {
  //       (this.searchForm.get(["uldInfo", index, "serviceContrator"]) as NgcFormGroup).disable();
  //     } else if (items[index].sats == "NO") {
  //       (this.searchForm.get(["uldInfo", index, "serviceContrator"]) as NgcFormGroup).enable();
  //     }
  //   }
  // }

  onPrint() {
    this.reportParameters.userId = this.getUserProfile().userShortName;
    this.reportParameters.bdSummaryId = this.searchForm.get("id").value;
    this.reportParameters.FlightId = this.searchForm.get("flightId").value;
    this.reportParameters.FlightKey = this.searchForm.get('flightNumber').value;
    this.reportParameters.flightDate = this.searchForm.get('flightDate').value;
    this.reportParameters.tonnageFlight = this.searchForm.get('totalTonnageByFlight').value + "";
    this.reportParameters.tonnageBySp = this.searchForm.get('tonnageBreakDownBySp').value + "";
    this.reportParameters.tonnageSats = this.searchForm.get('tonnageBreakDownBySats').value + "";
    this.reportParameters.delayInMinutes = this.searchForm.get('delayInMinutes').value + "";
    this.reportParameters.impBdBySats = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Imp_BdSummary_BySats);
    // alert(JSON.stringify(this.reportParameters));
    this.reportWindow.open();
  }
  onDeleteParameters(index) {
    (<NgcFormArray>this.searchForm.get(['tonnageHandlingInfo'])).markAsDeletedAt(index);
  }
  onAddParameters(index) {
    (<NgcFormArray>this.searchForm.get(["tonnageHandlingInfo"])).addValue([
      {
        rowNumber: "",
        cargoType: "",
        tonnage: "",
        additionalTonnage: "",
        subtractTonnage: "",
        remark: "",
        serviceContractor: ""
      }
    ]);
  }
}


