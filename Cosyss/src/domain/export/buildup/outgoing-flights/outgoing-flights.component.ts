import { ActivatedRoute, Router } from '@angular/router';
import {
  Component, NgZone, ElementRef, ViewContainerRef, OnInit,
  ViewChild, ViewChildren, QueryList
} from '@angular/core';
import { NgcFormControl, NgcReportComponent } from 'ngc-framework';
import { Environment } from '../../../../environments/environment';
import {
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  NgcTabsComponent,
  CellsRendererStyle,
  NgcPage, NgcFormGroup, NgcWindowComponent, NgcFormArray, DateTimeKey
  , NgcDropDownComponent, NgcUtility, NgcButtonComponent, NgcDataTableComponent, PageConfiguration, ReportFormat
} from 'ngc-framework';
import { BuildupService } from './../buildup.service';
import { OutgoingFlightRequest, OutgoingFlights } from './../buildup.sharedmodel';
import { CellsStyleClass } from '../../../../shared/shared.data';
import { ApplicationEntities } from '../../../common/applicationentities';
import { date } from '../../../awbManagement/awbManagement.shared';

@Component({
  selector: 'app-outgoing-flights',
  templateUrl: './outgoing-flights.component.html',
  styleUrls: ['./outgoing-flights.component.css']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  noAutoFocus: true,
  focusToBlank: false,
  focusToMandatory: false
})
export class OutgoingFlightsComponent extends NgcPage {
  reportParameters: any;
  currentDate = new Date();
  private defaultToTime = new Date();
  private defaultFromTime = new Date();
  private response: any;
  private carrierGroupCodeParam: any;
  private searchFlg: boolean = false;
  private carrierFlg: boolean = false;
  aircrafttypeColumn: any = 0;
  dateColumn: any = 3;
  terminalColumn: any = 4.5;
  carrierColumn: any = 3.5;
  private outgoingFightsSearchFormGroup: NgcFormGroup = new NgcFormGroup({
    flightNumberTelex: new NgcFormControl(),
    flightDateTelex: new NgcFormControl(),

    requestTerminal: new NgcFormControl(),
    domIntl: new NgcFormControl(),
    dateTimeFrom: new NgcFormControl(),
    dateTimeTo: new NgcFormControl(),
    carrierGroup: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    requestFlight: new NgcFormControl(),
    flightType: new NgcFormControl(),
    offPoint: new NgcFormControl(),
    arrDepStatus: new NgcFormControl(),
    warehouseLevel: new NgcFormControl(),
    buBdOffice: new NgcFormControl(),
    aircraft: new NgcFormControl(),
    telexMessages: new NgcFormControl(),
    allFlag: new NgcFormControl(false),
    domFlag: new NgcFormControl(false),
    intFlag: new NgcFormControl(false),
    flights: new NgcFormArray([
      new NgcFormGroup({
        selectFlg: new NgcFormControl(),
        terminal: new NgcFormControl(),
        flight: new NgcFormControl(),
        std: new NgcFormControl(),
        etd: new NgcFormControl(),
        atd: new NgcFormControl(),
        customsFlightNumber: new NgcFormControl(),
        customsFlightDate: new NgcFormControl(),
        aircraft: new NgcFormControl(),
        aircraftRegistration: new NgcFormControl(),
        bay: new NgcFormControl(),
        routing: new NgcFormControl(),
        dls: new NgcFormControl(),
        dlsPrecisionTime: new NgcFormControl(),
        flightClosePrecisionTime: new NgcFormControl(),
        man: new NgcFormControl(),
        dep: new NgcFormControl(),
        ofld: new NgcFormControl(),
        remark: new NgcFormControl(),
        delayFlag: new NgcFormControl(),
        pinned: new NgcFormControl(),
        outwardServiceReportFinalized: new NgcFormControl(),
        showDateFlag: new NgcFormControl(),
        releaseDlsRemark: new NgcFormControl(),
        releaseManifestRemark: new NgcFormControl(),
        dlsDelayed: new NgcFormControl(),
        manDelayed: new NgcFormControl(),
        arrDepStatus: new NgcFormControl(),
        fblreceived: new NgcFormControl(),
        warehouseLevel: new NgcFormControl(),
        buBdOffice: new NgcFormControl(),
        gate: new NgcFormControl(),
        staffIDAndDate: new NgcFormControl(),
        flightType: new NgcFormControl(),
        etdDiff: new NgcFormControl(),
        carrierCode: new NgcFormControl(),
        flightNumber: new NgcFormControl()
      })
    ])
  });

  @ViewChild("Report") Report: NgcReportComponent;
  @ViewChild("ReportWithPrecision") ReportWithPrecision: NgcReportComponent;
  @ViewChild("ExportToXls") ExportToXls: NgcButtonComponent;
  @ViewChild("ReportEnquire") ReportEnquire: NgcReportComponent;
  @ViewChild("WorkingListButton") WorkingListButton: NgcButtonComponent;
  @ViewChild('telexWindow') telexWindow: NgcWindowComponent;

  constructor(private buildUpService: BuildupService, appZone: NgZone,
    appElement: ElementRef, appContainerElement: ViewContainerRef, private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.updateColumnLengthsDynamically();
    const transferData = this.getNavigateData(this.activatedRoute);
    if (transferData !== null && transferData !== undefined) {
      this.outgoingFightsSearchFormGroup.patchValue(transferData);
      this.onSearch();
    }
    else {
      this.getConfigurableTime();
    }
  }
  // Fix for Bug 20208 
  public onLinkClick(index) {
    let data = {
      // carrierCode: this.outgoingFightsSearchFormGroup.get(['flights', index, 'flight']).value.substring(0, 2),
      // flightNo: this.outgoingFightsSearchFormGroup.get(['flights', index, 'flight']).value.substring(2, 6),
      carrierCode: this.outgoingFightsSearchFormGroup.get(['flights', index, 'carrierCode']).value,
      flightNo: this.outgoingFightsSearchFormGroup.get(['flights', index, 'flightNumber']).value,
      flightdateforflight: NgcUtility.getDateOnly(this.outgoingFightsSearchFormGroup.get(['flights', index, 'std']).value)
    }
    this.navigateTo(this.router, "/flight/maintenanceoperativeflight", data);
  }

  getConfigurableTime() {
    let request = {
      "toDate": null,
      "fromDate": null
    }
    this.buildUpService.getConfigurableTime(request).subscribe(response => {
      console.log("response", response);
      this.defaultToTime.setHours(this.currentDate.getHours() + response.data.toDate);
      this.defaultFromTime.setHours(this.currentDate.getHours() - response.data.fromDate);

      this.outgoingFightsSearchFormGroup.get('dateTimeFrom').setValue(this.defaultFromTime);
      this.outgoingFightsSearchFormGroup.get('dateTimeTo').setValue(this.defaultToTime);
    });

  }
  getCarrierCodeByCarrierGroup(event) {
    this.carrierFlg = false;
    if (event.desc != undefined) {
      this.carrierGroupCodeParam = this.createSourceParameter(this.outgoingFightsSearchFormGroup.get('carrierGroup').value);
      this.carrierFlg = true;
    }

  }
  onClear() {
    this.outgoingFightsSearchFormGroup.reset();
    this.searchFlg = false;
  }
  onSearch() {
    this.searchFlg = false;
    this.resetFormMessages();
    this.outgoingFightsSearchFormGroup.get('allFlag').setValue(false);
    this.outgoingFightsSearchFormGroup.get('domFlag').setValue(false);
    this.outgoingFightsSearchFormGroup.get('intFlag').setValue(false);

    if (this.outgoingFightsSearchFormGroup.get('dateTimeFrom').value !== null && this.outgoingFightsSearchFormGroup.get('dateTimeTo').value !== null) {
      if (this.outgoingFightsSearchFormGroup.get('dateTimeTo').value < this.outgoingFightsSearchFormGroup.get('dateTimeFrom').value) {
        this.showErrorMessage('export.from.date.cannot.more.than.to.date');
        return;
      }
    }
    if (this.outgoingFightsSearchFormGroup.get('requestFlight').value === '') {
      this.outgoingFightsSearchFormGroup.controls['requestFlight'].setValue(null);
    }
    if (this.outgoingFightsSearchFormGroup.get('offPoint').value === '') {
      this.outgoingFightsSearchFormGroup.controls['offPoint'].setValue(null);
    }
    if (this.outgoingFightsSearchFormGroup.get('carrierCode').value === '') {
      this.outgoingFightsSearchFormGroup.controls['carrierCode'].setValue(null);
    }

    if (this.outgoingFightsSearchFormGroup.get('domIntl').value == 'All') {
      this.outgoingFightsSearchFormGroup.controls['allFlag'].setValue(true);
    }

    if (this.outgoingFightsSearchFormGroup.get('domIntl').value == 'DOM') {
      this.outgoingFightsSearchFormGroup.controls['domFlag'].setValue(true);
    }

    if (this.outgoingFightsSearchFormGroup.get('domIntl').value == 'INT') {
      this.outgoingFightsSearchFormGroup.controls['intFlag'].setValue(true);
    }
    let request = new OutgoingFlightRequest();
    request = this.outgoingFightsSearchFormGroup.getRawValue();
    this.buildUpService.getOutgoingFlights(request).subscribe((result) => {
      this.response = result.data;
      this.refreshFormMessages(result);
      if (result.data != null && this.response.length > 0) {
        let modifiedResponse = this.response.map((i) => {
          i.selectFlg = false;
          if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_RHO)) {
            if (i.routing.length <= 3) {
              i.routing = NgcUtility.getTenantConfiguration().airportCode + "-" + i.routing;
            }
          }
          return i;
        });
        this.outgoingFightsSearchFormGroup.get(["flights"]).patchValue(modifiedResponse);
        this.searchFlg = true;
      }
      else {
        if (result && result.messageList) {
          this.showErrorMessage(result.messageList[0].message);
        } else {
          this.showErrorMessage("NO_RECORDS_EXIST");
        }

        this.searchFlg = false;
      }

    })
  }
  navigateToOffloadUld() {
    if (this.outgoingFightsSearchFormGroup.get(["flights"]).value.filter((element) => element.selectFlg == true).length > 1 || this.outgoingFightsSearchFormGroup.get(["flights"]).value.filter((element) => element.selectFlg == true).length == 0) {
      this.showErrorMessage("export.select.atmost.one.flight");
    }
    else {
      let flightObj = this.outgoingFightsSearchFormGroup.get(["flights"]).value.find((element) => element.selectFlg == true);
      let navigateObj = {
        flightKey: flightObj.flight,
        flightOriginDate: new Date(flightObj.std),
        requestTerminal: this.outgoingFightsSearchFormGroup.get('requestTerminal').value,
        dateTimeFrom: this.outgoingFightsSearchFormGroup.get('dateTimeFrom').value,
        dateTimeTo: this.outgoingFightsSearchFormGroup.get('dateTimeTo').value,
        carrierGroup: this.outgoingFightsSearchFormGroup.get('carrierGroup').value,
        carrierCode: this.outgoingFightsSearchFormGroup.get('carrierCode').value,
        requestFlight: this.outgoingFightsSearchFormGroup.get('requestFlight').value,
        flightType: this.outgoingFightsSearchFormGroup.get('flightType').value,
        offPoint: this.outgoingFightsSearchFormGroup.get('offPoint').value,
        fromOutgoingFlight: true
      }
      this.navigateTo(this.router, '/export/buildup/offloaduld', navigateObj);
    }

  }
  navigateToAssignUldToTrolly() {
    if (this.outgoingFightsSearchFormGroup.get(["flights"]).value.filter((element) => element.selectFlg == true).length > 1 || this.outgoingFightsSearchFormGroup.get(["flights"]).value.filter((element) => element.selectFlg == true).length == 0) {
      this.showErrorMessage("export.select.atmost.one.flight");
    }
    else {
      let flightObj = this.outgoingFightsSearchFormGroup.get(["flights"]).value.find((element) => element.selectFlg == true);
      let navigateObj = {
        flightKey: flightObj.flight,
        flightOriginDate: new Date(flightObj.std),
        requestTerminal: this.outgoingFightsSearchFormGroup.get('requestTerminal').value,
        dateTimeFrom: this.outgoingFightsSearchFormGroup.get('dateTimeFrom').value,
        dateTimeTo: this.outgoingFightsSearchFormGroup.get('dateTimeTo').value,
        carrierGroup: this.outgoingFightsSearchFormGroup.get('carrierGroup').value,
        carrierCode: this.outgoingFightsSearchFormGroup.get('carrierCode').value,
        requestFlight: this.outgoingFightsSearchFormGroup.get('requestFlight').value,
        flightType: this.outgoingFightsSearchFormGroup.get('flightType').value,
        offPoint: this.outgoingFightsSearchFormGroup.get('offPoint').value,
        fromOutgoingFlight: true
      }
      this.navigateTo(this.router, '/export/buildup/assign-uld-flight', navigateObj);
    }

  }

  navigateToWorkingList() {
    if (this.outgoingFightsSearchFormGroup.get(["flights"]).value.filter((element) => element.selectFlg == true).length > 1 || this.outgoingFightsSearchFormGroup.get(["flights"]).value.filter((element) => element.selectFlg == true).length == 0) {
      this.showErrorMessage("export.select.atmost.one.flight");
    }
    else {
      let flightObj = this.outgoingFightsSearchFormGroup.get(["flights"]).value.find((element) => element.selectFlg == true);

      let navigateObj = {
        flightNo: flightObj.flight,
        flightDate: new Date(flightObj.std),
        requestTerminal: this.outgoingFightsSearchFormGroup.get('requestTerminal').value,
        dateTimeFrom: this.outgoingFightsSearchFormGroup.get('dateTimeFrom').value,
        dateTimeTo: this.outgoingFightsSearchFormGroup.get('dateTimeTo').value,
        carrierGroup: this.outgoingFightsSearchFormGroup.get('carrierGroup').value,
        carrierCode: this.outgoingFightsSearchFormGroup.get('carrierCode').value,
        requestFlight: this.outgoingFightsSearchFormGroup.get('requestFlight').value,
        flightType: this.outgoingFightsSearchFormGroup.get('flightType').value,
        offPoint: this.outgoingFightsSearchFormGroup.get('offPoint').value,
        fromOutgoingFlight: true
      }
      this.navigateTo(this.router, '/export/exportworkinglist', navigateObj);
    }

  }

  navigateToDisplayDls() {
    if (this.outgoingFightsSearchFormGroup.get(["flights"]).value.filter((element) => element.selectFlg == true).length > 1 || this.outgoingFightsSearchFormGroup.get(["flights"]).value.filter((element) => element.selectFlg == true).length == 0) {
      this.showErrorMessage("export.select.atmost.one.flight");
    }
    else {
      let flightObj = this.outgoingFightsSearchFormGroup.get(["flights"]).value.find((element) => element.selectFlg == true);
      let navigateObj = {
        flightKey: flightObj.flight,
        flightOriginDate: new Date(flightObj.std),
        requestTerminal: this.outgoingFightsSearchFormGroup.get('requestTerminal').value,
        dateTimeFrom: this.outgoingFightsSearchFormGroup.get('dateTimeFrom').value,
        dateTimeTo: this.outgoingFightsSearchFormGroup.get('dateTimeTo').value,
        carrierGroup: this.outgoingFightsSearchFormGroup.get('carrierGroup').value,
        carrierCode: this.outgoingFightsSearchFormGroup.get('carrierCode').value,
        requestFlight: this.outgoingFightsSearchFormGroup.get('requestFlight').value,
        flightType: this.outgoingFightsSearchFormGroup.get('flightType').value,
        offPoint: this.outgoingFightsSearchFormGroup.get('offPoint').value,
        fromOutgoingFlight: true
      }
      this.navigateTo(this.router, '/export/buildup/update-dls', navigateObj);
    }
  }

  navigateToDisplayManifest() {
    if (this.outgoingFightsSearchFormGroup.get(["flights"]).value.filter((element) => element.selectFlg == true).length > 1 || this.outgoingFightsSearchFormGroup.get(["flights"]).value.filter((element) => element.selectFlg == true).length == 0) {
      this.showErrorMessage("export.select.atmost.one.flight");
    }
    else {
      let flightObj = this.outgoingFightsSearchFormGroup.get(["flights"]).value.find((element) => element.selectFlg == true);
      let navigateObj = {
        flightKey: flightObj.flight,
        flightOriginDate: new Date(flightObj.std),
        requestTerminal: this.outgoingFightsSearchFormGroup.get('requestTerminal').value,
        dateTimeFrom: this.outgoingFightsSearchFormGroup.get('dateTimeFrom').value,
        dateTimeTo: this.outgoingFightsSearchFormGroup.get('dateTimeTo').value,
        carrierGroup: this.outgoingFightsSearchFormGroup.get('carrierGroup').value,
        carrierCode: this.outgoingFightsSearchFormGroup.get('carrierCode').value,
        requestFlight: this.outgoingFightsSearchFormGroup.get('requestFlight').value,
        flightType: this.outgoingFightsSearchFormGroup.get('flightType').value,
        offPoint: this.outgoingFightsSearchFormGroup.get('offPoint').value,
        fromOutgoingFlight: true
      }
      this.navigateTo(this.router, '/export/buildup/cargomanifest', navigateObj);
    }

  }

  navigateToFlightComplete() {
    if (this.outgoingFightsSearchFormGroup.get(["flights"]).value.filter((element) => element.selectFlg == true).length > 1 || this.outgoingFightsSearchFormGroup.get(["flights"]).value.filter((element) => element.selectFlg == true).length == 0) {
      this.showErrorMessage("export.select.atmost.one.flight");
    }
    else {
      let flightObj = this.outgoingFightsSearchFormGroup.get(["flights"]).value.find((element) => element.selectFlg == true);
      let navigateObj = {
        flightKey: flightObj.flight,
        flightOriginDate: new Date(flightObj.std),
        requestTerminal: this.outgoingFightsSearchFormGroup.get('requestTerminal').value,
        dateTimeFrom: this.outgoingFightsSearchFormGroup.get('dateTimeFrom').value,
        dateTimeTo: this.outgoingFightsSearchFormGroup.get('dateTimeTo').value,
        carrierGroup: this.outgoingFightsSearchFormGroup.get('carrierGroup').value,
        carrierCode: this.outgoingFightsSearchFormGroup.get('carrierCode').value,
        requestFlight: this.outgoingFightsSearchFormGroup.get('requestFlight').value,
        flightType: this.outgoingFightsSearchFormGroup.get('flightType').value,
        offPoint: this.outgoingFightsSearchFormGroup.get('offPoint').value,
        fromOutgoingFlight: true
      }
      this.navigateTo(this.router, '/export/buildup/flightComplete', navigateObj);
    }
  }

  /**
   * Cells Style Renderer
   *
   * @param value Value
   * @param rowData Row Data
   * @param level Level
   */
  public etdCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    console.log(rowData)
    //
    if (rowData.delayFlag == true) {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    }
    //
    return cellsStyle;
  };

  onPrint(type) {
    this.reportParameters = new Object();
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_AircraftType)) {
      this.reportParameters.isTenantSpecificReport = true;
    }

    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_CustomsExportFlightDate)) {
      this.reportParameters.isEGMSpecificReport = true;
    }
    if (this.outgoingFightsSearchFormGroup.get('requestTerminal').value) {
      this.reportParameters.terminalvalue = this.outgoingFightsSearchFormGroup.get('requestTerminal').value;
    }
    if (this.outgoingFightsSearchFormGroup.get('dateTimeFrom').value) {
      this.reportParameters.fromdate = this.outgoingFightsSearchFormGroup.get('dateTimeFrom').value;
    }
    if (this.outgoingFightsSearchFormGroup.get('dateTimeTo').value) {
      this.reportParameters.todate = this.outgoingFightsSearchFormGroup.get('dateTimeTo').value;
    }
    if (this.outgoingFightsSearchFormGroup.get('dateTimeFrom').value) {
      this.reportParameters.tenantFormatFromDate = NgcUtility.getDateTimeAsString(this.outgoingFightsSearchFormGroup.get('dateTimeFrom').value);
    }
    if (this.outgoingFightsSearchFormGroup.get('dateTimeTo').value) {
      this.reportParameters.tenantFormatToDate = NgcUtility.getDateTimeAsString(this.outgoingFightsSearchFormGroup.get('dateTimeTo').value);
    }
    if (this.outgoingFightsSearchFormGroup.get('carrierGroup').value) {
      this.reportParameters.carriergroup = this.outgoingFightsSearchFormGroup.get('carrierGroup').value;
    }
    if (this.outgoingFightsSearchFormGroup.get('carrierCode').value) {
      this.reportParameters.carrier = this.outgoingFightsSearchFormGroup.get('carrierCode').value;
    }
    if (this.outgoingFightsSearchFormGroup.get('requestFlight').value) {
      this.reportParameters.Flight = this.outgoingFightsSearchFormGroup.get('requestFlight').value;
    }
    if (this.outgoingFightsSearchFormGroup.get('flightType').value) {
      this.reportParameters.FlightType = this.outgoingFightsSearchFormGroup.get('flightType').value;
    }
    if (this.outgoingFightsSearchFormGroup.get('offPoint').value) {
      this.reportParameters.offpoint = this.outgoingFightsSearchFormGroup.get('offPoint').value;
    }
    if (this.outgoingFightsSearchFormGroup.get('arrDepStatus').value) {
      this.reportParameters.arrDepStatus = this.outgoingFightsSearchFormGroup.get('arrDepStatus').value;
    }
    if (this.outgoingFightsSearchFormGroup.get('warehouseLevel').value) {
      this.reportParameters.warehouseLevel = this.outgoingFightsSearchFormGroup.get('warehouseLevel').value;
    }
    if (this.outgoingFightsSearchFormGroup.get('buBdOffice').value) {
      this.reportParameters.buBdOffice = this.outgoingFightsSearchFormGroup.get('buBdOffice').value;
    }
    if (this.outgoingFightsSearchFormGroup.get('aircraft').value) {
      this.reportParameters.aircraftModel = this.outgoingFightsSearchFormGroup.get('aircraft').value;
    }
    if (this.outgoingFightsSearchFormGroup.get('domIntl').value) {
      this.reportParameters.domIntl = this.outgoingFightsSearchFormGroup.get('domIntl').value;
    }

    this.reportParameters.tenantID = NgcUtility.getTenantConfiguration().airportCode;
    this.reportParameters.loggedInUser = this.getUserProfile().userLoginCode;
    this.reportParameters.userLoginCode = this.getUserProfile().userLoginCode;
    this.reportParameters.usertype = (<any>Environment).applicationId;
    this.reportParameters.segmentWithBoardPoint = NgcUtility.isEntityAttributeRequired(ApplicationEntities.Flight_RHO)

    if (type == ReportFormat.XLS) {
      this.ReportWithPrecision.format = ReportFormat.XLS;
      this.ReportWithPrecision.downloadReport();
    } else {
      this.Report.format = ReportFormat.PDF;
      this.Report.open();
    }
  }
  onPrintEnquire(type) {
    this.reportParameters = new Object();

    if (this.outgoingFightsSearchFormGroup.get('dateTimeFrom').value) {
      this.reportParameters.fromdate = NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.MINUTES);
    }
    if (this.outgoingFightsSearchFormGroup.get('dateTimeTo').value) {
      this.reportParameters.todate = NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 1439, DateTimeKey.MINUTES);
    }
    if (this.outgoingFightsSearchFormGroup.get('flightType').value) {
      this.reportParameters.FlightType = this.outgoingFightsSearchFormGroup.get('flightType').value;
    }
    if (this.outgoingFightsSearchFormGroup.get('carrierCode').value) {
      this.reportParameters.carrier = this.outgoingFightsSearchFormGroup.get('carrierCode').value;
    }
    if (this.outgoingFightsSearchFormGroup.get('arrDepStatus').value) {
      this.reportParameters.arrDepStatus = this.outgoingFightsSearchFormGroup.get('arrDepStatus').value;
    }
    if (type == ReportFormat.XLS) {
      this.ReportEnquire.format = ReportFormat.XLS;
      this.ReportEnquire.downloadReport();
    } else {
      this.ReportEnquire.format = ReportFormat.PDF;
      this.ReportEnquire.open();
    }

  }


  setFocusCheckBox() {
    this.ExportToXls.focus();
  }
  getHeight() {
    return (document.body.clientHeight - 350) + 'px';
  }
  getWidth() {
    return (document.body.clientWidth - 50) + 'px';
  }
  updateColumnLengthsDynamically() {

    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_AircraftType)) {
      this.aircrafttypeColumn = 2.5;
      this.terminalColumn = 4;
      this.carrierColumn = 2.5;
      this.dateColumn = 2.5;
    }
  }
  sendFBR(event) {
    if (this.outgoingFightsSearchFormGroup.get(["flights"]).value.filter((element) => element.selectFlg == true).length > 1 || this.outgoingFightsSearchFormGroup.get(["flights"]).value.filter((element) => element.selectFlg == true).length == 0) {
      this.showErrorMessage("export.select.atmost.one.flight");
    }
    let flightObj = this.outgoingFightsSearchFormGroup.get(['flights']).value.find((element) => element.selectFlg == true);
    if (flightObj) {
      let senFBRObject = {
        flightKey: flightObj.flight,
        flightDate: new Date(flightObj.std),
        flightId: flightObj.flightId
      }
      this.buildUpService.sendFBR(senFBRObject).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus("g.completed.successfully")
        }
      })
    }

  }

  displayTelex() {
    let searchRequest = new OutgoingFlightRequest();
    if (this.outgoingFightsSearchFormGroup.get(["flights"]).value.filter((element) => element.selectFlg == true).length > 1 || this.outgoingFightsSearchFormGroup.get(["flights"]).value.filter((element) => element.selectFlg == true).length == 0) {
      this.showErrorMessage("export.select.atmost.one.flight");
    }
    else {
      let flightObj = this.outgoingFightsSearchFormGroup.get(["flights"]).value.find((element) => element.selectFlg == true);
      let navigateObj = {
        flightKey: flightObj.flight,
        //flightdate:NgcUtility.getDateOnly(flightObj.std),
        flightOriginDate: new Date(NgcUtility.getDateOnly(flightObj.std))
      }
      searchRequest.flightKey = navigateObj.flightKey;
      searchRequest.flightOriginDate = navigateObj.flightOriginDate;
      this.outgoingFightsSearchFormGroup.get('flightNumberTelex').patchValue(searchRequest.flightKey);
      this.outgoingFightsSearchFormGroup.get('flightDateTelex').patchValue(searchRequest.flightOriginDate);
      // searchRequest.flightOriginDate = new Date();

      this.buildUpService.getTelexMessages(searchRequest).subscribe((result) => {
        this.response = result.data;
        this.refreshFormMessages(result);
        if (result.data != null) {
          this.outgoingFightsSearchFormGroup.get('telexMessages').patchValue(this.response.telexMsg);
          console.log(this.outgoingFightsSearchFormGroup.get('telexMessages').value);

          if (result.success) {
            this.telexWindow.open();
          }


        }
        else {
          this.showErrorMessage("NO_RECORDS_EXIST");

        }

      })

    }

  }
  onClose() {
    this.telexWindow.close();
  }
}
