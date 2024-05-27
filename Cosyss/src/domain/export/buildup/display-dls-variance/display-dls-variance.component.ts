import { ActivatedRoute, Router } from "@angular/router";
import { SearchDisplayDLSVariance, Segment } from "./../../export.sharedmodel";
import { BuildupService } from "./../buildup.service";
import { FormArray, FormGroup, Validator, Validators } from "@angular/forms";
import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild
} from "@angular/core";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcContainer,
  NgcWindowComponent,
  NgcButtonComponent,
  NgcUtility,
  NgcDropDownComponent,
  NgcInputComponent,
  PageConfiguration,
  NgcReportComponent,
  CellsRendererStyle
} from "ngc-framework";
import { CellsStyleClass } from "../../../../shared/shared.data";
import { ApplicationFeatures } from "../../../common/applicationfeatures";


@Component({
  selector: "app-display-dls-variance",
  templateUrl: "./display-dls-variance.component.html",
  styleUrls: ["./display-dls-variance.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  // callNgOnInitOnClear: true,
  //autoBackNavigation: true
})
export class DisplayDlsVarianceComponent extends NgcPage implements OnInit {
  loadFlightFlag = false;
  loadDetailsFlag = false;
  sourceIdSegmentDropdown: any;
  AdminAuthoriZationFlag: any = [];
  reportParameters: any;
  segmentId: any;
  responseForReport: any;
  reportPercentage: any = 0;
  dlsThreshold = false;

  @ViewChild("Report") Report: NgcReportComponent;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    appContainerElement: ViewContainerRef,
    private buildupService: BuildupService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    // getting the forwarded data
    let forwardedData = this.getNavigateData(this.activatedRoute);
    this.AdminAuthoriZationFlag = [
      { code: "YES", desc: "YES" },
      { code: "NO", desc: "NO" }
    ];
    // checking if the fetched data is not null
    if (forwardedData != null) {
      this.sortcutDls(forwardedData);
    }
  }

  private sortcutDls(forwardedData: any): void {
    this.displayDLSVarianceForm
      .get("flightNumber")
      .patchValue(forwardedData.flightKey);
    this.displayDLSVarianceForm
      .get("flightDate")
      .patchValue(forwardedData.flightOriginDate);
    this.onSearch();
  }

  private displayDLSVarianceForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    flightNumber: new NgcFormControl(),
    flightDate: new NgcFormControl(new Date()),
    // flightNumber: new NgcFormControl('SQ0008'),
    // flightDate: new NgcFormControl(new Date('24APR2018')),
    flightNum: new NgcFormControl(),
    flightOriDate: new NgcFormControl(),
    dateSTD: new NgcFormControl(),
    dateETD: new NgcFormControl(),
    status: new NgcFormControl(),
    segment: new NgcFormControl(),
    dlsVarianceResult: new NgcFormArray([]),
    dlsDiscrepancyResult: new NgcFormArray([])
  });

  onSearch() {
    this.loadFlightFlag = false;
    this.loadDetailsFlag = false;
    this.dlsThreshold = false;
    this.displayDLSVarianceForm.validate();
    if (this.displayDLSVarianceForm.invalid) {
      return;
    }
    this.loadTable(null);
    this.displayDLSVarianceForm.controls.segment.setValue(-1);
  }

  loadTable(segment) {
    const searchReq = new SearchDisplayDLSVariance();
    searchReq.flightNumber = this.displayDLSVarianceForm.get(
      "flightNumber"
    ).value;
    searchReq.flightDate = this.displayDLSVarianceForm.get("flightDate").value;
    searchReq.segmentId = segment;
    this.segmentId = segment;
    this.buildupService.getFlightInfo(searchReq).subscribe(response => {
      if (response.success) {
        this.responseForReport = response.data;
        console.log(JSON.stringify(response.data));
        this.displayDLSVarianceForm.patchValue(response.data);
        if (
          (<NgcFormArray>this.displayDLSVarianceForm.get("dlsVarianceResult"))
            .length != 0
        ) {
          this.calculateTotal();
        }
        if (response.data === null) {
          this.showErrorStatus("export.dls.not.created");
          this.loadFlightFlag = true;
          this.loadDetailsFlag = false;
          this.dlsThreshold = false;
          return;
        }

        this.resetFormMessages();
        this.sourceIdSegmentDropdown = this.createSourceParameter(
          this.displayDLSVarianceForm.get("flightKey").value
        );
        this.loadFlightFlag = true;
        this.loadDetailsFlag = true;
        this.dlsThreshold = true;
      } else {
        this.refreshFormMessages(response);
        //this.showErrorStatus("NO_RECORDS_EXIST");
      }
    });
  }

  calculateTotal() {
    let netWeight = 0;
    let manifestedWeight = 0;
    let difference = 0;
    let percentage = 0;
    (<NgcFormArray>this.displayDLSVarianceForm.get(
      "dlsVarianceResult"
    )).controls.forEach((item, i) => {
      // if (item.get('uld').value.includes(' BULK -')) {
      netWeight += (<NgcFormControl>this.displayDLSVarianceForm.get([
        "dlsVarianceResult",
        i,
        "netWeight"
      ])).value;
      manifestedWeight += (<NgcFormControl>this.displayDLSVarianceForm.get([
        "dlsVarianceResult",
        i,
        "manifestedWeight"
      ])).value;
      difference += (<NgcFormControl>this.displayDLSVarianceForm.get([
        "dlsVarianceResult",
        i,
        "difference"
      ])).value;
      percentage += (<NgcFormControl>this.displayDLSVarianceForm.get([
        "dlsVarianceResult",
        i,
        "percentage"
      ])).value;

      // }
    });

    const noOfRows = (<NgcFormArray>this.displayDLSVarianceForm.get(
      "dlsVarianceResult"
    )).length;
    const lastSegment = (<NgcFormControl>this.displayDLSVarianceForm.get([
      "dlsVarianceResult",
      noOfRows - 1,
      "segment"
    ])).value;
    (<NgcFormArray>this.displayDLSVarianceForm.get([
      "dlsVarianceResult"
    ])).addValue([
      {
        segment: lastSegment,
        uld: "Total",
        netWeight: Math.round(netWeight * 10) / 10,
        manifestedWeight: Math.round(manifestedWeight * 10) / 10,
        difference: Math.round(difference * 10) / 10,
        percentage: Math.round(
          difference == 0
            ? 0
            : (manifestedWeight == 0) ? 100 : (difference / manifestedWeight) * 100
        ),
        icsGrossWeight: "",
        uldTag: ""
      }
    ]);
    this.reportPercentage = Math.round(
      difference == 0
        ? 0
        : (manifestedWeight == 0) ? 100 : (difference / manifestedWeight) * 100
    );
  }

  onClear() {
    this.loadFlightFlag = false;
    this.loadDetailsFlag = false;
    this.dlsThreshold = false;
    this.resetFormMessages();
    this.displayDLSVarianceForm.reset();
    this.displayDLSVarianceForm.get("flightDate").setValue(new Date());
  }

  onCancel() {
    this.router.navigate([""]);
  }

  segmentOnChange(event) {
    if (event === null) {
      return;
    }
    this.loadTable(event == -1 ? null : event);
  }

  onPrint() {
    this.reportParameters = new Object();
    this.reportParameters.flightKey = this.displayDLSVarianceForm.get("flightNumber").value;
    this.reportParameters.flightDate = this.displayDLSVarianceForm.get("flightDate").value;
    this.reportParameters.loggedInUser = this.getUserProfile().userShortName;
    this.reportParameters.flightId = parseInt(this.responseForReport.flightKey);
    this.reportParameters.reportPercentage = this.reportPercentage;
    if (this.segmentId) {
      this.reportParameters.segmentId = this.segmentId;
    } else {
      this.reportParameters.segmentId = '';
    }
    if (!NgcUtility.hasFeatureAccess(ApplicationFeatures.MHS_Export_Container_AutoWeight)) {

      this.reportParameters.discrepancy_list_display = true;

    }
    this.Report.open();
  }

  navigatebackToDls() {
    // bug - 332 fix
    this.showConfirmMessage('cancel.records').then(fulfilled => {
      let transferData: any;
      transferData = { flightKey: this.displayDLSVarianceForm.get('flightNumber').value, flightOriginDate: this.displayDLSVarianceForm.get('flightDate').value }
      this.navigateBack(transferData);
      //this.navigateTo(this.router, '/export/buildup/update-dls', transferData)
      // bug - 332 fix END
    });
  }

  public cellsStyleRendererColorProcessed = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    return cellsStyle;
  };
}
