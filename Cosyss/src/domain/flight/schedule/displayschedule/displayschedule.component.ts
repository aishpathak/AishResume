// Angular
import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

// Application
import { RestService, BaseRequest, PageConfiguration } from "ngc-framework";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcButtonComponent,
  NgcUtility,
  NgcReportComponent,
  ReportFormat
} from "ngc-framework";
import { ApplicationEntities } from "../../../common/applicationentities";
import {
  FlightScheduleRequest,
  FlightScheduleResponseModel,
  FlightScheduleResponse
} from "../../flight.sharedmodel";
// Services
import { FlightService } from "./../../flight.service";

@Component({
  selector: "ngc-displayschedule",
  templateUrl: "./displayschedule.component.html",
  styleUrls: ["./displayschedule.component.scss"]
})
/**
 * Display Schedule Component on searchs on the carrier code and fromsector and toscetor and fromdate and todate retrive schedules .
 *
 * @param insertData
 * @param index
 */
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class DisplayscheduleComponent extends NgcPage {
  @ViewChild("reportWindow4")
  reportWindow4: NgcReportComponent;
  @ViewChild("reportWindow1")
  reportWindow1: NgcReportComponent;
  @ViewChild("reportWindow2")
  reportWindow2: NgcReportComponent;
  @ViewChild("reportWindow3")
  reportWindow3: NgcReportComponent;
  reportParameters: any;
  dataDisplay: any = false;
  source: any = {};
  resp: any;
  reqObj: any = {};
  reqParameter: any = {};
  displayService = false;
  responseArray: FlightScheduleResponseModel[];
  emptyColumn: any = 5;
  showStaffId: boolean = false;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private flightService: FlightService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    super(appZone, appElement, appContainerElement);
  }

  /**
   * Reactive form wrapper
   */

  private displayScheduleform: NgcFormGroup = new NgcFormGroup({
    carrierCode: new NgcFormControl(null, [Validators.minLength(2), Validators.maxLength(3), Validators.pattern('([0-9A-Za-z]{2,3})')]),
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    fromLocation: new NgcFormControl('', [Validators.maxLength(3), Validators.pattern('([A-Za-z]{2,3})')]),
    toLocation: new NgcFormControl('', [Validators.maxLength(3), Validators.pattern('([A-Za-z]{2,3})')]),
    flightNo: new NgcFormControl(null, [Validators.minLength(3), Validators.maxLength(5), Validators.pattern('([0-9]{0,4}|[A-Z0-9]{5})')]),
    aircraftType: new NgcFormControl(),
    flightType: new NgcFormControl(),
    resultList: new NgcFormArray([
      new NgcFormGroup({
        flight: new NgcFormControl(),
        aircraftType: new NgcFormControl(),
        boarding: new NgcFormControl(),
        offloading: new NgcFormControl(),
        departureTime: new NgcFormControl(),
        arrivalTime: new NgcFormControl(),
        dateFrom: new NgcFormControl(),
        dateTo: new NgcFormControl(),
        frequency: new NgcFormControl(),
        jointFrequency: new NgcFormControl(),
        svc: new NgcFormControl(),
        svcTenantSpecific: new NgcFormControl(),
        stops: new NgcFormControl(),
        dayChange: new NgcFormControl(),
        apron: new NgcFormControl(),
        staffId: new NgcFormControl(),
        portOfCall: new NgcFormControl()

      })
    ])
  });

  ngAfterViewInit() {
    this.dataDisplay = false;
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_AircraftType)) {
      this.emptyColumn = 3;
      this.displayService = true;
      this.displayScheduleform.get("fromDate").setValue(NgcUtility.getCurrentDateOnly());
      this.showStaffId = true;
    }
    const transferData = this.getNavigateData(this.activatedRoute);
    if (transferData != null) {
      this.displayScheduleform.patchValue(transferData.returnObj);
      this.onClick();
    }

    if (
      this.flightService.responseDisplayScheduleScreenOnSearch != undefined &&
      this.flightService.responseDisplayScheduleScreenOnSearch != null
    ) {
      const responseDisplaySchedule = JSON.parse(
        JSON.stringify(this.flightService.responseDisplayScheduleScreenOnSearch)
      );
      (<NgcFormArray>(
        this.displayScheduleform.controls["resultList"]
      )).patchValue(responseDisplaySchedule);
      this.dataDisplay = true;
    }
  }

  /**
   * posts search data and gets the response
   */
  onClick() {
    this.displayScheduleform.validate();
    if (this.displayScheduleform.invalid) {
      this.showErrorStatus("flight.no.record");
      this.dataDisplay = false;
      return;
    }
    const flightScheduleRequest: FlightScheduleRequest = new FlightScheduleRequest();
    if (this.displayScheduleform.get('carrierCode').value === null || this.displayScheduleform.get('carrierCode').value === '') {
      if (this.getUserProfile().userRestrictedAirlines !== null) {
        flightScheduleRequest.restrictedcarrier = this.getUserProfile().userRestrictedAirlines;
      }
    }
    flightScheduleRequest.carrierCode = this.displayScheduleform.get(
      "carrierCode"
    ).value;
    flightScheduleRequest.fromDate = this.displayScheduleform.get(
      "fromDate"
    ).value;

    flightScheduleRequest.toDate = this.displayScheduleform.get("toDate").value;
    flightScheduleRequest.fromLocation = this.displayScheduleform.get(
      "fromLocation"
    ).value;
    flightScheduleRequest.toLocation = this.displayScheduleform.get(
      "toLocation"
    ).value;
    flightScheduleRequest.aircraftType = this.displayScheduleform.get("aircraftType").value;
    const fromDate = this.displayScheduleform.get("fromDate").value;
    const toDate = this.displayScheduleform.get("toDate").value;
    flightScheduleRequest.flightType = this.displayScheduleform.get("flightType").value;
    flightScheduleRequest.flightNo = this.displayScheduleform.get("flightNo").value;
    this.resetFormMessages();
    this.reqParameter = flightScheduleRequest;
    this.flightService.getScheduleDetails(flightScheduleRequest).subscribe(
      data => {
        if (!this.showResponseErrorMessages(data)) {
          this.resp = data;
          this.flightService.responseDisplayScheduleScreenOnSearch = this.resp; // Setting Response in variable : Which is read when Cancel button is Clicked from OperativeFlight to redirect to This Page
          if (this.resp.data != null) {
            this.resp.data.forEach(enr => {
              enr.boarding = enr.flightBoardPoint;
              enr.offloading = enr.flightOffPoint;
              enr.flight = enr.carrierCode + enr.flightNumber;
              enr.dateFrom = enr.dateFrom;
              enr.dateTo = enr.dateTo;
              enr.departureTime = enr.departureTime;
              enr.arrivalTime = enr.arrivalTime;
              enr.svc = enr.svc;
              enr.svcTenantSpecific = enr.svc;
              if (enr.apron === true) {
                enr.apron = "Y";
              } else {
                enr.apron = "N";
              }
              enr.staffId = enr.staffId;
              enr.portOfCall = enr.portOfCall;
            });
            this.dataDisplay = true;
            this.setDataTable();
          }
        } else {
          this.dataDisplay = false;
          //this.showErrorStatus(this.resp.messageList[0].message);
        }
      },
      error => {
        this.showErrorStatus("Error:" + error);
      }
    );
  }
  /*
   *For the setting the ngc-datatable
   */
  setDataTable() {
    (<NgcFormArray>this.displayScheduleform.controls["resultList"]).patchValue(
      this.resp.data
    );
  }

  /**
   * Function that is called when Carrier Code lov in search form is used
   *
   * @param object
   */
  public onSelectCarrierCode(object) {
    this.displayScheduleform.get("carrierCode").setValue(object.code);
  }
  public onLinkClick(event) {
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_AircraftType)) {
      this.reqObj.carrierCode = event.record.carrierCode;
      this.reqObj.flightNumber = event.record.flightNumber;
      this.reqObj.returnObj = this.reqParameter;
      this.navigateTo(this.router, "/flight/maintainschedule", this.reqObj);
    }
    else {
      this.navigateTo(this.router, "/flight/displayoperatingflight", event);
    }
  }

  /**
   * clearing displayScheduleform form data screen
   *
   */
  public clearFormData() {
    this.displayScheduleform.get("carrier").reset();
    this.displayScheduleform.get("fromDate").reset();
    this.displayScheduleform.get("toDate").reset();
    this.displayScheduleform.get("origin").reset();
    this.displayScheduleform.get("destination").reset();
    this.dataDisplay = false;
  }
  printDisplayScheduleFlightReport(type) {
    var date1 = this.displayScheduleform.get("fromDate").value;
    const reportParameters: any = new Object();

    if (this.displayScheduleform.get("toDate").value != null) {
      let carrier = this.displayScheduleform.get("carrierCode").value;
      if (carrier !== null) {
        reportParameters.offpoint = this.displayScheduleform.get(
          "toLocation"
        ).value;
        reportParameters.boardingpoint = this.displayScheduleform.get(
          "fromLocation"
        ).value;
        reportParameters.fromdate = this.displayScheduleform.get(
          "fromDate"
        ).value;
        reportParameters.todate = this.displayScheduleform.get("toDate").value;
        reportParameters.Carrier = this.displayScheduleform.get(
          "carrierCode"
        ).value;
        reportParameters.userid = this.getUserProfile().userLoginCode;
        reportParameters.flightNumber = this.displayScheduleform.get("flightNo").value;
        reportParameters.aircraftModel = this.displayScheduleform.get("aircraftType").value;
        reportParameters.isTenantSpecificReport = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_PortOfCall);
        reportParameters.aircraftType = this.displayScheduleform.get("flightType").value;
        this.reportParameters = reportParameters;

        if (type == ReportFormat.XLS) {
          this.reportWindow3.format = ReportFormat.XLS;
          this.reportWindow3.downloadReport();

        }
        else {
          this.reportWindow3.format = ReportFormat.PDF;
          this.reportWindow3.open();
        }
      } else if (carrier == null) {
        reportParameters.offpoint = this.displayScheduleform.get(
          "toLocation"
        ).value;
        reportParameters.boardingpoint = this.displayScheduleform.get(
          "fromLocation"
        ).value;
        reportParameters.fromdate = this.displayScheduleform.get(
          "fromDate"
        ).value;
        reportParameters.todate = this.displayScheduleform.get("toDate").value;
        reportParameters.userid = this.getUserProfile().userLoginCode;
        reportParameters.flightNumber = this.displayScheduleform.get("flightNo").value;
        reportParameters.aircraftModel = this.displayScheduleform.get("aircraftType").value;
        reportParameters.isTenantSpecificReport = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_PortOfCall);
        reportParameters.aircraftType = this.displayScheduleform.get("flightType").value;
        this.reportParameters = reportParameters;

        if (type == ReportFormat.XLS) {
          this.reportWindow4.format = ReportFormat.XLS;
          this.reportWindow4.downloadReport();

        }
        else {
          this.reportWindow4.format = ReportFormat.PDF;
          this.reportWindow4.open();
        }
      }
    }
    if (this.displayScheduleform.get("toDate").value == null) {
      let valueCarrier = this.displayScheduleform.get("carrierCode").value;
      if (valueCarrier !== null) {
        reportParameters.offpoint = this.displayScheduleform.get(
          "toLocation"
        ).value;
        reportParameters.boardingpoint = this.displayScheduleform.get(
          "fromLocation"
        ).value;
        reportParameters.fromdate = this.displayScheduleform.get(
          "fromDate"
        ).value;
        reportParameters.carrier = this.displayScheduleform.get(
          "carrierCode"
        ).value;
        reportParameters.userid = this.getUserProfile().userLoginCode;
        reportParameters.flightNumber = this.displayScheduleform.get("flightNo").value;
        reportParameters.aircraftModel = this.displayScheduleform.get("aircraftType").value;
        reportParameters.isTenantSpecificReport = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_PortOfCall);
        reportParameters.aircraftType = this.displayScheduleform.get("flightType").value;
        this.reportParameters = reportParameters;

        if (type == ReportFormat.XLS) {
          this.reportWindow1.format = ReportFormat.XLS;
          this.reportWindow1.downloadReport();

        }
        else {
          this.reportWindow1.format = ReportFormat.PDF;
          this.reportWindow1.open();
        }

      } else if (valueCarrier == null || valueCarrier == "") {
        reportParameters.offpoint = this.displayScheduleform.get(
          "toLocation"
        ).value;
        reportParameters.boardingpoint = this.displayScheduleform.get(
          "fromLocation"
        ).value;
        reportParameters.fromdate = this.displayScheduleform.get(
          "fromDate"
        ).value;
        reportParameters.userid = this.getUserProfile().userLoginCode;
        reportParameters.flightNumber = this.displayScheduleform.get("flightNo").value;
        reportParameters.aircraftModel = this.displayScheduleform.get("aircraftType").value;
        reportParameters.isTenantSpecificReport = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_PortOfCall);
        reportParameters.aircraftType = this.displayScheduleform.get("flightType").value;
        this.reportParameters = reportParameters;

        if (type == ReportFormat.XLS) {
          this.reportWindow2.format = ReportFormat.XLS;
          this.reportWindow2.downloadReport();

        }
        else {
          this.reportWindow2.format = ReportFormat.PDF;
          this.reportWindow2.open();
        }
      }
    }
  }


  onCancel(event) {
    this.displayScheduleform.reset();
  }

}
