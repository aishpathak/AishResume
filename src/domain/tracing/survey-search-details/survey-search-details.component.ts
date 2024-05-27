import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import {
  NgcFormGroup,
  NgcFormControl,
  PageConfiguration,
  NgcPage,
  NgcFormArray,
  NgcWindowComponent,
  NgcReportComponent
} from "ngc-framework";
import { TracingService } from "../tracing.service";
import { SurveySearch, Email, CargoSurvey } from "../tracing.shared";
import { Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "app-survey-search-details",
  templateUrl: "./survey-search-details.component.html",
  styleUrls: ["./survey-search-details.component.scss"],
  providers: [TracingService]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class SurveySearchDetailsComponent extends NgcPage implements OnInit {
  /**
   * Initialize
   *
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */

  searchParams: SurveySearch = new SurveySearch(
    "",
    "",
    new Date(),
    new Date(),
    ""
  );
  displaySearchContainer: boolean = false;
  resp: any;
  reportParameters: any;
  emaildata: any;
  emails: any = [];

  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;
  @ViewChild("reportWindow1") reportWindow1: NgcReportComponent;
  @ViewChild("sendemailwindow") sendemailwindow: NgcWindowComponent;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    public tracingService: TracingService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    this.surveySearchdetails.get("surveyStatus").patchValue("Open");
    const forwardedData: any = this.getNavigateData(this.activatedRoute);
    //
    console.log(forwardedData);
    if (
      forwardedData != null &&
      ((forwardedData.referenceNo != null && forwardedData.referenceNo != "") ||
        (forwardedData.fromDate != "" && forwardedData.toDate != ""))
    ) {
      this.surveySearchdetails.patchValue(forwardedData);
      this.getsearchValues();
    }
  }

  private surveySearchdetails: any = new NgcFormGroup({
    referenceNo: new NgcFormControl(""),
    carrierGp: new NgcFormControl(""),
    fromDate: new NgcFormControl(""),
    toDate: new NgcFormControl(""),
    surveyStatus: new NgcFormControl(""),
    resultList: new NgcFormArray([]),
    emails: new NgcFormArray([]),
    cargoOfficialReceiptInfo: new NgcFormGroup({
      cargoOfficialReceipt: new NgcFormControl(),
      emails: new NgcFormArray([])
      // email: new NgcFormControl(""),
    })

  });
  private cargoOfficialReceiptInfo: NgcFormGroup = new NgcFormGroup({
    cargoOfficialReceipt: new NgcFormControl(),
    emails: new NgcFormArray([])
    // email: new NgcFormControl(""),
  })

  getsearchValues() {
    //this.surveySearchdetails.validate();
    this.displaySearchContainer = false;
    // if (this.validateField()) {
    this.searchParams = new SurveySearch(
      this.surveySearchdetails.get("referenceNo").value,
      this.surveySearchdetails.get("carrierGp").value,
      this.surveySearchdetails.get("fromDate").value,
      this.surveySearchdetails.get("toDate").value,
      this.surveySearchdetails.get("surveyStatus").value
    );
    console.log(this.searchParams);

    this.tracingService.getSurveyDetailsList(this.searchParams).subscribe(
      res => {
        this.refreshFormMessages(res);
        if (res.data != null && res.data.length > 0) {
          console.log(res.data);
          console.log("=================testOne=====================");
          //console.log(JSON.stringify(res.data))
          this.displaySearchContainer = true;
          // console.log(res.data);
          (<NgcFormArray>this.surveySearchdetails.get("resultList")).patchValue(
            res.data
          );
        } else {
          this.showInfoStatus("tracing.no.record.found");
        }
      },
      error => {
        this.showErrorStatus("Error:" + error);
      }
    );
  }

  reDirect() {
    this.navigateTo(this.router, "/tracing/conductcargosurvey", {
      searchBy: this.surveySearchdetails.getRawValue()
    });
  }

  validateField() {
    return this.surveySearchdetails.get("fromDate").valid &&
      this.surveySearchdetails.get("toDate").valid
      ? true
      : false;
  }

  onLinkClick(event) {
    if (event.type === 'link') {
      if (event.column === 'EDIT') {
        this.navigateTo(this.router, "/tracing/conductcargosurvey", {
          searchBy: this.surveySearchdetails.getRawValue(),
          data: event.record
        });
      }

      if (event.column === 'PRINT') {
        this.reportParameters = new Object();
        this.reportParameters.surveynumber = "" + event.record.surveyNo;
        this.reportWindow1.open();
      }

      if (event.column === 'SEND') {
        this.emaildata = event.record;
        console.log(this.emaildata);
        (<NgcFormArray>this.surveySearchdetails.get("emails")).patchValue(
          this.emails
        );
        if (this.surveySearchdetails.get("emails").length === 0) {
          this.addEmail();
        }
        this.sendemailwindow.open();
      }

    }

  }

  onClear(event) {
    this.surveySearchdetails.reset();
    this.displaySearchContainer = false;
    this.surveySearchdetails.get("surveyStatus").patchValue("Open");
  }
  onPrint() {
    this.reportParameters = new Object();

    this.reportParameters.status = this.surveySearchdetails.get(
      "surveyStatus"
    ).value;

    this.reportParameters.fromdate = this.surveySearchdetails.get(
      "fromDate"
    ).value;
    this.reportParameters.todate = this.surveySearchdetails.get("toDate").value;

    this.reportParameters.reference = this.surveySearchdetails.get(
      "referenceNo"
    ).value;
    this.reportParameters.carrier = this.surveySearchdetails.get(
      "carrierGp"
    ).value;
    this.reportWindow.open();
  }

  addEmail() {
    (<NgcFormArray>this.surveySearchdetails.get(["emails"])).addValue([
      {

        email: null,
        flagCRUD: 'C'
      }
    ])
  }

  deleteEmail(event, index) {
    (<NgcFormArray>this.surveySearchdetails.get(["emails"])).markAsDeletedAt(index);
    if (this.surveySearchdetails.get("emails").length === 0) {
      this.addEmail();
    }

  }

  sendEmail(event, index) {
    let request = this.surveySearchdetails.getRawValue();

    let emails = this.surveySearchdetails.get('emails').getRawValue();
    request.cargoOfficialReceiptInfo.emails = emails;
    request.referenceNo = this.emaildata.referenceNo;
    request.surveyNo = this.emaildata.surveyNo;
    console.log(request);
    this.tracingService.sendReportMailMain(request).subscribe((response) => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('tracing.report.sent');
        this.sendemailwindow.close();
      }

    }, error => {
      this.showErrorStatus(error);
    });
  }



}
