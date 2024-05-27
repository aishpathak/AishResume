import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild
} from "@angular/core";
import {
  NgcFormGroup,
  NgcFormControl,
  PageConfiguration,
  NgcPage,
  NgcFormArray,
  NgcWindowComponent,
  ReportFormat, NgcUtility
} from "ngc-framework";
import { TracingService } from "../tracing.service";
import { NgcReportComponent } from 'ngc-framework';
import {
  SurveySearch,
  AbandonedCargoSearch,
  ShimentLocation
} from "../tracing.shared";
import { Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { ApplicationEntities } from "../../common/applicationentities";
@Component({
  selector: "app-display-abandoned-cargo",
  templateUrl: "./display-abandoned-cargo.component.html",
  styleUrls: ["./display-abandoned-cargo.component.scss"],
  providers: [TracingService]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class DisplayAbandonedCargoComponent extends NgcPage implements OnInit {
  reportParameters: any;
  fetchValue: any;
  carrierGroupCodeParam: any;
  displaySearchContainer: boolean = false;
  private searchFlg: boolean = false;
  @ViewChild("lcoationInformation")
  private lcoationInformation: NgcWindowComponent;
  @ViewChild("tracingActivity") private tracingActivity: NgcWindowComponent;
  @ViewChild("Report") Report: NgcReportComponent;
  @ViewChild("XLSReport") XLSReport: NgcReportComponent;

  private locationInfo: string = "locationInfo";

  private details: string = "details";

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    public tracingService: TracingService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    this.fetchValue = this.getNavigateData(this.route);
    if (this.fetchValue !== null) {
      this.displayabandoncargodetails
        .get("fromDate")
        .setValue(this.fetchValue[0].dateTimeFrom);
      this.displayabandoncargodetails
        .get("toDate")
        .setValue(this.fetchValue[0].dateTimeTo);
      this.abandonedGetsearchValues();
    }
  }

  private displayabandoncargodetails: any = new NgcFormGroup({
    importExportIndicator: new NgcFormControl(""),
    carrierGp: new NgcFormControl(""),
    shcGroupCode: new NgcFormControl(""),
    carrierCode: new NgcFormControl(""),
    referenceNo: new NgcFormControl(""),
    fromDate: new NgcFormControl("", Validators.required),
    toDate: new NgcFormControl("", Validators.required),
    Select: new NgcFormControl(""),
    locationInfo: new NgcFormControl(""),
    details: new NgcFormControl(""),
    resultList: new NgcFormArray([]),
    locationresultList: new NgcFormArray([
      new NgcFormGroup({
        shimentLocation: new NgcFormControl(""),
        pieces: new NgcFormControl(),
        warehouselocation: new NgcFormControl(),
        handlingArea: new NgcFormControl()
      })
    ]),
    tracingAtivityList: new NgcFormArray([
      new NgcFormGroup({
        activity: new NgcFormControl(""),
        activityPerformedOn: new NgcFormControl(""),
        handleBy: new NgcFormControl("")
      })
    ])
  });

  getCarrierCodeByCarrierGroup(event) {
    this.carrierGroupCodeParam = this.createSourceParameter(
      this.displayabandoncargodetails.get(["carrierGp"]).value
    );
  }
  abandonedGetsearchValues() {
    this.searchFlg = false;
    this.displaySearchContainer = false;
    this.displayabandoncargodetails.validate();
    if (this.validateField()) {
      const requestParams: AbandonedCargoSearch = new AbandonedCargoSearch();
      if (
        this.displayabandoncargodetails.get("importExportIndicator").value ==
        "IMPORT"
      ) {
        requestParams.type = "I";
      } else if (
        this.displayabandoncargodetails.get("importExportIndicator").value ==
        "EXPORT"
      ) {
        requestParams.type = "E";
      }
      requestParams.shcGroupCode = this.displayabandoncargodetails.get(
        "shcGroupCode"
      ).value;
      requestParams.carrierCode = this.displayabandoncargodetails.get(
        "carrierCode"
      ).value;
      requestParams.referenceNo = this.displayabandoncargodetails.get(
        "referenceNo"
      ).value;
      requestParams.fromDate = this.displayabandoncargodetails.get(
        "fromDate"
      ).value;
      requestParams.toDate = this.displayabandoncargodetails.get(
        "toDate"
      ).value;
      requestParams.carrierGp = this.displayabandoncargodetails.get('carrierGp').value;
      console.log(requestParams);
      if (requestParams.fromDate > requestParams.toDate) {
        return this.showErrorMessage("tracing.date.from.greater.to");
      }
      this.resetFormMessages();
      this.tracingService.getAbandonedCargoRecords(requestParams).subscribe(
        res => {
          if (!this.showResponseErrorMessages(res)) {
            if (res.data != null && res.data.length > 0) {
              console.log(res.data);
              (<NgcFormArray>this.displayabandoncargodetails.get(
                "resultList"
              )).patchValue(res.data);
              this.displaySearchContainer = true;
              if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.AbandonedCargo_Report)) {
              this.searchFlg = true;
              }
            } else {
              this.showInfoStatus("tracing.no.record.found");
              this.searchFlg = false;
            }
          }
        },
        error => {
          this.showErrorStatus("Error:" + error);
        }
      );
    }
  }
  validateField() {
    return this.displayabandoncargodetails.get("fromDate").valid &&
      this.displayabandoncargodetails.get("toDate").valid
      ? true
      : false;
  }

  onLinkClick(rowData: any) {
    if (rowData.column == "details") {
      let requestParams: ShimentLocation = new ShimentLocation();
      requestParams.shimentInfoId = rowData.record.tracingShimentInfoId;
      console.log(rowData);
      console.log(requestParams);
      this.resetFormMessages();
      this.tracingService.getTracingActivity(requestParams).subscribe(
        res => {
          if (!this.showResponseErrorMessages(res)) {
            if (res.data != null && res.data.length > 0) {
              console.log(res.data);
              (<NgcFormArray>this.displayabandoncargodetails.get(
                "tracingAtivityList"
              )).patchValue(res.data);
              this.displaySearchContainer = true;
              this.tracingActivity.open();
            } else {
              this.showInfoStatus("tracing.no.record.found");
            }
          }
        },
        error => {
          this.showErrorStatus("Error:" + error);
        }
      );
    } else if (rowData.column == "locationInfo") {
      let requestParams: ShimentLocation = new ShimentLocation();
      requestParams.shimentInfoId = rowData.record.tracingShimentInfoId;
      console.log(requestParams);
      this.tracingService.getShimentLcoation(requestParams).subscribe(
        res => {
          if (res.data != null && res.data.length > 0) {
            console.log(res.data);
            (<NgcFormArray>this.displayabandoncargodetails.get(
              "locationresultList"
            )).patchValue(res.data);
            this.displaySearchContainer = true;
            this.lcoationInformation.open();
          } else {
            this.showInfoStatus("tracing.no.record.found");
          }
        },
        error => {
          this.showErrorStatus("Error:" + error);
        }
      );
    }
  }

  onconfirm(rowData: any) {
    console.log(rowData);
  }
  disposeAbandonCargo() {
    let shipmentIds = [];
    let shipmentIdslist: AbandonedCargoSearch = new AbandonedCargoSearch();
    shipmentIdslist.referenceNumbers = shipmentIds;
    let data = (<NgcFormArray>this.displayabandoncargodetails.get(
      "resultList"
    )).getRawValue();
    data.forEach(element => {
      if (element.select == true) {
        let id = element.shipmentId;
        shipmentIds.push(id);
      }
    });

    if (shipmentIds.length > 0) {
      this.resetFormMessages();
      this.tracingService.disposeAbandonCargo(shipmentIdslist).subscribe(
        res => {
          if (!this.showResponseErrorMessages(res)) {
            if (res.data == "sucess") {
              this.abandonedGetsearchValues();
            } else {
              this.showInfoStatus("tracing.something.went.wrong");
            }
          }
        },

        error => {
          this.showErrorStatus("Error:" + error);
        }
      );
    } else {
      this.showInfoStatus("tracing.atleast.one.record");
    }
  }

  movetoImport() {
    let shipmentIds = [];
    let shipmentIdslist: AbandonedCargoSearch = new AbandonedCargoSearch();
    shipmentIdslist.referenceNumbers = shipmentIds;
    let data = (<NgcFormArray>this.displayabandoncargodetails.get(
      "resultList"
    )).getRawValue();
    data.forEach(element => {
      if (element.select == true) {
        let id = element.shipmentId;
        shipmentIds.push(id);
      }
    });
    if (shipmentIds.length > 0) {
      this.resetFormMessages();
      this.tracingService.moveToImport(shipmentIdslist).subscribe(
        res => {
          if (!this.showResponseErrorMessages(res)) {
            if (res.data == "sucess") {
              this.abandonedGetsearchValues();
              this.showSuccessStatus("g.completed.successfully");
            } else {
              this.showInfoStatus("tracing.something.went.wrong");
            }
          }
        },
        error => {
          this.showErrorStatus("Error:" + error);
        }
      );
    } else {
      this.showInfoStatus("tracing.atleast.one.record");
    }
  }

  onCancel() {
    this.navigateTo(this.router, "**", {});
  }


  onPrint() {
    this.reportParameters = new Object();
    if (
      this.displayabandoncargodetails.get("importExportIndicator").value ==
      "IMPORT"
    ) {
      this.reportParameters.type = "I";
    } else if (
      this.displayabandoncargodetails.get("importExportIndicator").value ==
      "EXPORT"
    ) {
      this.reportParameters.type = "E";
    }
    this.reportParameters.shcGroupCode = this.displayabandoncargodetails.get(
      "shcGroupCode"
    ).value;
    if (this.reportParameters.shcGroupCode!=null){
      this.reportParameters.shcGroupCode = "%" + this.reportParameters.shcGroupCode+"%"
    }
    this.reportParameters.carrierCode = this.displayabandoncargodetails.get(
      "carrierCode"
    ).value;
    this.reportParameters.referenceNo = this.displayabandoncargodetails.get(
      "referenceNo"
    ).value;
    this.reportParameters.fromDate = this.displayabandoncargodetails.get(
      "fromDate"
    ).value;

    this.reportParameters.toDate = this.displayabandoncargodetails.get(
      "toDate"
    ).value;
    this.reportParameters.carrierGp = this.displayabandoncargodetails.get('carrierGp').value;
      this.XLSReport.downloadReport();
    
   

  }





}
