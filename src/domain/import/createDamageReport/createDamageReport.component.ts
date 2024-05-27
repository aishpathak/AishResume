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
  NgcPage,
  NgcFormArray,
  NgcUtility,
  PageConfiguration,
  NgcDropDownListComponent,
  NgcWindowComponent,
  NgcReportComponent
} from "ngc-framework";
import { ImportService } from "../import.service";
import { Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationEntities } from "../../common/applicationentities";
import { ApplicationFeatures } from "../../common/applicationfeatures";
import { NgcRegularReportComponent } from "../../billing/ngc-regular-report/ngc-regular-report.component";
import { Console } from "console";
//import { CapturedamageComponent } from '../../common/camera/capturedamage/capturedamage.component';

@Component({
  selector: "app-createDamageReport",
  templateUrl: "./createDamageReport.component.html",
  styleUrls: ["./createDamageReport.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class CreateDamageReportComponent extends NgcPage implements OnInit {
  showTable: any;
  resp: any;
  recordData: any;
  isShowFlag1: boolean = false;
  isShowFlag2: boolean = false;
  isShowFlag3: boolean = false;
  isShowFlag: boolean = false;
  FinalzeDamage: boolean = false;
  UnFinalzeDamage: boolean = false;
  hawbInfoFeatureEnabled: boolean = false;
  flightIdd: any;
  reportParameters: any = new Object();
  req: any;
  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    this.hawbInfoFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBInfo);
    const forwardedData: any = this.getNavigateData(this.activatedRoute);
    console.log("forwardedData", forwardedData);
    if (forwardedData) {
      this.createDamageReportForm
        .get("flight")
        .patchValue(forwardedData.flight);
      this.createDamageReportForm
        .get("flightDate")
        .patchValue(forwardedData.flightDate);
      this.createDamageReportForm
        .get("flightATA")
        .patchValue(forwardedData.flightATA);
      this.onSearch();
    }
  }

  private createDamageReportForm: NgcFormGroup = new NgcFormGroup({
    flight: new NgcFormControl(null, [
      Validators.required,
      Validators.maxLength(8)
    ]),
    flightDate: new NgcFormControl(null, [Validators.required]),
    flightATA: new NgcFormControl(),
    flightId: new NgcFormControl(),
    flightNumber: new NgcFormControl(),
    weatherCondition: new NgcFormControl(),
    preparedBy: new NgcFormControl(),
    listDamageReportAWBDetails: new NgcFormArray([]),
    listDamageReportULDDetails: new NgcFormArray([]),
    listDamageReportMailDetails: new NgcFormArray([])
  });

  //   onLinkClick(event) {
  //     this.recordData = this.createDamageReportForm.getRawValue();
  //  //this.navigate('common/capturedamageDesktop, this.recordData);
  //      this.navigateTo(this.router, 'common/capturedamageDesktop', this.recordData);
  //   }
  // onClear(event) {
  //   this.createDamageReportForm.reset();
  //   this.resetFormMessages();
  // }

  // onCancel() {
  //   this.navigateTo(this.router, "/", null);
  // }

  addDamage() {
    this.navigate("common/capturedamageDesktop", null);
  }

  onSearch() {
    this.isShowFlag = false;
    const request = this.createDamageReportForm.getRawValue();
    request.flightNumber = request.flight
    this.resetFormMessages();
    (this.createDamageReportForm.get(
      "listDamageReportAWBDetails"
    ) as NgcFormArray).resetValue([]);
    (this.createDamageReportForm.get(
      "listDamageReportULDDetails"
    ) as NgcFormArray).resetValue([]);
    (this.createDamageReportForm.get(
      "listDamageReportMailDetails"
    ) as NgcFormArray).resetValue([]);
    this.importService.getOnSearchDamage(request).subscribe(
      response => {
        this.refreshFormMessages(response);
        if (response.data) {
          this.isShowFlag = true;
          this.resp = response.data;
          this.flightIdd = response.data.flightId;
          this.createDamageReportForm.patchValue(this.resp);
          if (this.resp.damageCargoFinalizeAt) {
            this.UnFinalzeDamage = true;
            this.FinalzeDamage = false;
          } else {
            this.FinalzeDamage = true;
            this.UnFinalzeDamage = false;
            this.resp.finalizeflag = "unfinalize";
          }
          if (this.resp.listDamageReportAWBDetails !== null) {
            this.isShowFlag1 = true;
          } else {
            this.isShowFlag1 = false;
          }
          if (this.resp.listDamageReportAWBDetails) {
            this.createDamageReportForm
              .get("listDamageReportAWBDetails")
              .patchValue(this.resp.listDamageReportAWBDetails);
          } else {
            this.createDamageReportForm
              .get("listDamageReportAWBDetails")
              .patchValue(new Array());
          }

          if (this.resp.listDamageReportMailDetails !== null) {
            this.isShowFlag2 = true;
          } else {
            this.isShowFlag2 = false;
          }
          if (this.resp.listDamageReportMailDetails) {
            this.createDamageReportForm
              .get("listDamageReportMailDetails")
              .patchValue(this.resp.listDamageReportMailDetails);
          } else {
            this.createDamageReportForm
              .get("listDamageReportMailDetails")
              .patchValue(new Array());
          }

          if (this.resp.listDamageReportULDDetails !== null) {
            this.isShowFlag3 = true;
          } else {
            this.isShowFlag3 = false;
          }
          if (this.resp.listDamageReportULDDetails) {
            this.createDamageReportForm
              .get("listDamageReportULDDetails")
              .patchValue(this.resp.listDamageReportULDDetails);
          } else {
            this.createDamageReportForm
              .get("listDamageReportULDDetails")
              .patchValue(new Array());
          }

          this.createDamageReportForm
            .get("flight")
            .patchValue(this.resp.flight);
          this.createDamageReportForm
            .get("flightDate")
            .patchValue(this.resp.flightDate);
          this.createDamageReportForm
            .get("flightATA")
            .patchValue(this.resp.flightATA);
          this.createDamageReportForm
            .get("flightId")
            .patchValue(this.resp.flightId);

          // this.showTable = true;
          this.reportParameters.FlightKey = request.flight;
          this.reportParameters.FlightDate = request.flightDate;
          this.reportParameters.HAWBhandlingFlag = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling);

          this.createDamageReportForm
            .get("flightId")
            .patchValue(this.resp.flightId);
        }
      },
      error => {
        this.showErrorMessage(error);
      }
    );
  }
  onPrint() {
    const request = this.createDamageReportForm.getRawValue();
    this.reportParameters.FlightKey = request.flight;
    this.reportParameters.FlightDate = request.flightDate;
    this.reportParameters.HAWBhandlingFlag = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling);
    this.reportParameters.LoggedInUser = this.getUserProfile().userShortName;
    this.reportWindow.open();

  }

  transferData(item, entityType) {
    let data: any = {};
    //
    data.flight = this.createDamageReportForm.get("flight").value;
    data.flightDate = this.createDamageReportForm.get("flightDate").value;
    data.flightId = this.resp.flightId;
    data.entityType = entityType;
    data.entityKey = item.record.entityKey;
    data.subEntityKey = item.record.hawbnumber;
    this.navigateTo(this.router, "/common/capturedamageDesktop", data);
  }
  onCancel(item) {
    this.navigateBack(item ? item : {});
  }

  onSaveAddition() {
    let req = this.createDamageReportForm.getRawValue();
    req.flightId = this.flightIdd;
    console.log("REQ", req);
    this.importService.saveAddition(req).subscribe(
      data => {
        this.resp = data;
        if (data.data) {
          this.showSuccessStatus("g.completed.successfully");
        }
      },
      error => {
        this.showErrorStatus(error);
      }
    );
  }



  finalize() {
    // this.resp.finalizeflag = "finalize";
    let request = this.createDamageReportForm.getRawValue();
    request.flightId = this.flightIdd;
    console.log("REQ", request);
    if (this.UnFinalzeDamage) {
      request.finalizeflag = "finalize";
    }
    this.importService.finalizeDamage(request).subscribe(
      data => {
        this.resp = data;
        if (data.data) {
          this.onSearch();

        }
      },
      error => {
        this.showErrorStatus(error);
      }
    );
  }
}
