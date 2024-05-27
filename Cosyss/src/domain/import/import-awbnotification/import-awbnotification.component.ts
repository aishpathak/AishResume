import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  OnDestroy,
  ViewContainerRef,
  ViewChild
} from "@angular/core";
import { RouterModule, ActivatedRoute, Router } from "@angular/router";
import { Validators } from "@angular/forms";

// NGC framework imports
import {
  NgcUtility,
  NgcFormGroup,
  NgcFormArray,
  NgcApplication,
  NgcWindowComponent,
  NgcDropDownComponent,
  NgcButtonComponent,
  NgcPage,
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  PageConfiguration,
  NgcFormControl,
  BaseRequest,
  CellsRendererStyle,
  NgcReportComponent,
  ErrorMessage, DateTimeKey
} from "ngc-framework";
import { CellsStyleClass } from "../../../shared/shared.data";
import { ImportService } from "../import.service";
import { truncateSync } from "fs";
import { ImpAwbNotificationInfo, History } from "../import.shared";
@Component({
  selector: "app-import-awbnotification",
  templateUrl: "./import-awbnotification.component.html",
  styleUrls: ["./import-awbnotification.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class ImportAwbnotificationComponent extends NgcPage implements OnInit {
  telephone: any;
  awbNumber: any;
  fetchValue: any;
  flightKey: any;
  resendAwbDetails: any;
  responseData: any;
  @ViewChild("resendIvrsRqst") resendIvrsRqst;
  @ViewChild("showHistory") showHistory;
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  // testUi: any;
  contactModeList: string[] = ["YES", "NO", "ALL"];
  showTable = false;
  responseArray: any[];
  // tslint:disable-next-line:member-ordering
  public importAwbNotificationForm: NgcFormGroup = new NgcFormGroup({
    terminal: new NgcFormControl(Validators.required),
    carrierGroup: new NgcFormControl(),
    contactMode: new NgcFormControl(Validators.required),
    awbNumber: new NgcFormControl(),
    status: new NgcFormControl(),
    triggerTime: new NgcFormControl(),
    awbNotificationInfo: new NgcFormArray([
      new NgcFormGroup(
        {
          selectCheck: new NgcFormControl()
        })
    ]),
    ivrsHistoryList: new NgcFormArray([]),
    emailFlag: new NgcFormControl(),
    faxFlag: new NgcFormControl(),
    smsFlag: new NgcFormControl(),
    phoneFlag: new NgcFormControl(),
    flightNumber: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    requestedFrom: new NgcFormControl(),

    emailToSend: new NgcFormControl(),
    faxToSend: new NgcFormControl(),
    smsToSend: new NgcFormControl(),
    phoneToSend: new NgcFormControl(),



    requestedTo: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES)),

    history: new NgcFormArray([
      new NgcFormGroup({
        contactNumber: new NgcFormControl(),
        type: new NgcFormControl(),
        responseDateTime: new NgcFormControl(),
        responseMessage: new NgcFormControl(),
        contactType: new NgcFormControl()
      })
    ])



    //    searchAwbNotification: new NgcFormGroup({})
  });
  reportParameters: any;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    this.importAwbNotificationForm.get("contactMode").setValue("NO");
    this.importAwbNotificationForm.get("terminal").patchValue(this.getUserProfile().terminalId);
    let forwardedData = this.getNavigateData(this.route);
    if (forwardedData != null) {
      this.importAwbNotificationForm.get("terminal").setValue(forwardedData.terminal);
      this.importAwbNotificationForm.get("carrierGroup").setValue(forwardedData.carrierGroup);
      this.importAwbNotificationForm.get("contactMode").setValue(forwardedData.contactMode);
      this.importAwbNotificationForm.get("awbNumber").setValue(forwardedData.awbNumber);
      this.importAwbNotificationForm.get("flightNumber").setValue(forwardedData.flightNumber);
      this.importAwbNotificationForm.get("flightDate").setValue(forwardedData.flightDate);
      this.importAwbNotificationForm.get("status").setValue(forwardedData.status);
      this.importAwbNotificationForm.get("requestedFrom").setValue(forwardedData.requestedFrom);
      this.importAwbNotificationForm.get("requestedTo").setValue(forwardedData.requestedTo);
      //invoke search
      this.onSearch();
    }
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.fetchValue = this.getNavigateData(this.route);
    // this.awbNumber = this.fetchValue[0].shipmentNumber;
    if (this.fetchValue !== null) {
      this.importAwbNotificationForm
        .get("awbNumber")
        .setValue(this.fetchValue[0].shipmentNumber);
      this.onSearch();
    }
  }
  /**
     * open window
     *
     * @param {any} $event
     * @memberof ImportAwbNotification
     *
     */
  onLinkClick(event) {
    //console.log($event.record);
    this.awbNumber = event.record.awbNumber;
    if (event.column === "resend") {
      this.resendAwbDetails = null;
      this.importAwbNotificationForm.get('emailFlag').reset();
      this.importAwbNotificationForm.get('faxFlag').reset();
      this.importAwbNotificationForm.get('smsFlag').reset();
      this.importAwbNotificationForm.get('phoneFlag').reset();

      this.importAwbNotificationForm.get('emailToSend').patchValue(event.record.email)
      this.importAwbNotificationForm.get('faxToSend').patchValue(event.record.fax)
      this.importAwbNotificationForm.get('phoneToSend').patchValue(event.record.telephone)
      this.resendAwbDetails = event.record;

      const value: boolean =
        // event.column === "resend"
        //   ? (this.resendIvrsRqst.open(), true)
        this.resendIvrsRqst.open();
    }
    if (event.column === "history") {
      this.showHistory.open()


      const historyDetails = (<NgcFormGroup>this.importAwbNotificationForm.get(['awbNotificationInfo', event.record.NGC_ROW_ID])).getRawValue();
      this.importAwbNotificationForm.get('history').patchValue(historyDetails.history);

    }

  }

  /**
    * close window
    *
    * @param {any} $event
    * @memberof ImportAwbNotification
    *
    */
  closeWindow() {
    this.resendIvrsRqst.close();
  }
  sendIvrsRequest() {
    let formData = this.importAwbNotificationForm.getRawValue();
    this.resendAwbDetails.emailFlag = formData.emailFlag;
    this.resendAwbDetails.faxFlag = formData.faxFlag;
    this.resendAwbDetails.smsFlag = formData.smsFlag;
    this.resendAwbDetails.phoneFlag = formData.phoneFlag;
    this.resendAwbDetails.emailToSend = formData.emailToSend;
    this.resendAwbDetails.faxToSend = formData.faxToSend;
    this.resendAwbDetails.smsToSend = formData.smsToSend;
    this.resendAwbDetails.phoneToSend = formData.phoneToSend;

    this.importService.sendAwbNotificationDetails(this.resendAwbDetails).subscribe(
      data => {
        if (!this.showResponseErrorMessages(data)) {
          this.resendIvrsRqst.close();
        }
      },
      error => {
        this.showErrorStatus(error);
      }
    );

  }
  oncloseWindow() {
    this.showHistory.close();
  }
  onSearch() {
    // this.showTable = false;
    this.importAwbNotificationForm.validate();
    const newArray: any = new Array();
    const awbNotificationList = this.importAwbNotificationForm.getRawValue();
    if (awbNotificationList.flightDate === null && awbNotificationList.flightKey != null || awbNotificationList.flightDate === null && awbNotificationList.flightKey == null) {
      if (awbNotificationList.awbNumber === null && awbNotificationList.requestedFrom === null) {
        this.showErrorStatus('imp.err113');
        return;
      }
    }
    if (this.validateFields()) {
      this.resetFormMessages();
      this.importService.getAwbNotificationDetails(awbNotificationList).subscribe(
        data => {
          if (!this.showResponseErrorMessages(data)) {
            this.responseData = data.data
            this.importAwbNotificationForm.get('awbNotificationInfo').patchValue(data.data);

            this.showTable = true;
          } else {
            this.showErrorMessage("no.record.found");
            this.importAwbNotificationForm.get('awbNotificationInfo').reset();
          }
        },
        // tslint:disable-next-line:no-shadowed-variable
        error => {
          this.showErrorStatus("no.record.found");
        }
      );
      // }
    }
  }
  public eawdCellsRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): string => {
    let awbList: any;
    if (rowData.eawb === 0) {
      // tslint:disable-next-line:max-line-length
      awbList =
        '<span style="color:#fff;background:green; ">&nbsp;Y&nbsp;</i></span>';
    } else if (rowData.eawb === 1) {
      // tslint:disable-next-line:max-line-length
      awbList =
        '<span style="color:#fff;background:black;">&nbsp;N&nbsp;</i></span>';
    } else {
      awbList = "";
      // tslint:disable-next-line:max-line-length
      awbList = '<span style="black;">&nbsp;N&nbsp;</i></span>';
    }
    return awbList;
  };

  /**

     * Cells Style Renderer
     *
     * @param value Value
     * @param rowData Row Data
     * @param level Level
     */

  public flightCellsRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    const cellsStyle: CellsRendererStyle = new CellsRendererStyle();

    //
    //const flightKey: string = rowData.flightNumber;
    //  const flightDate: Date = NgcUtility.getDateAsString(rowData.flightDate);
    //  cellsStyle.data = `${flightKey}/${flightDate}`
    //NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(flightDate, 'ddMMyy'), 'ddMMyy')}`;
    //.setValue(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy'));
    if (cellsStyle.data === "null/null") {
      cellsStyle.data = null;
    }

    //
    return cellsStyle;
  };

  public phoneCellsRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    const cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    const rowId: number = Number(rowData.NGC_ROW_ID);

    if (rowData.primaryContact === "TE") {
      // const formGroup: NgcFormGroup = this.importAwbNotificationForm.get(['awbNotificationInfo', rowId]) as NgcFormGroup;
      cellsStyle.data = rowData.contactInfo;
    }
    //
    return cellsStyle;
  };
  public faxCellsRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    const cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    const rowId: number = Number(rowData.NGC_ROW_ID);

    if (rowData.primaryContact === "FX") {
      // const formGroup: NgcFormGroup = this.importAwbNotificationForm.get(['awbNotificationInfo', rowId]) as NgcFormGroup;
      cellsStyle.data = rowData.contactInfo;
    }
    //
    return cellsStyle;
  };
  /**
      * Cells Renderer
      * @param value Value
      * @param rowData Row Data
      * @param level Level
      */
  public cellsRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): string => {
    if (column === "delivery") {
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.delivery} " />
                </svg>
            </div>
            `;
    }
  };
  /**
     * Cells Style Renderer
     *
     * @param value Value
     * @param rowData Row Data
     * @param level Level
     */
  public contactCellsStyleRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    //  const contactInfo: NgcFormGroup = this.importAwbNotificationForm.get(['awbNotificationInfo', rowData.NGC_ROW_ID];) as; NgcFormGroup;
    // let cellValue: NgcFormControl;
    const cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    // Render Data
    // if (contactInfo) {
    // if ((cellValue = contactInfo.get(column) as NgcFormControl)) {
    //   cellsStyle.data = cellValue.value;
    // }
    // }
    return cellsStyle;
  };


  validateFields() {
    return this.importAwbNotificationForm.get("terminal").valid &&
      this.importAwbNotificationForm.get("contactMode").valid
      ? true : false;
  }
  openAwbDocumentPage() {
    let terminal = this.importAwbNotificationForm.get("terminal").value;
    let carrierGroup = this.importAwbNotificationForm.get("carrierGroup").value;
    let contactMode = this.importAwbNotificationForm.get("contactMode").value;
    let awbNumber = this.importAwbNotificationForm.get("awbNumber").value;
    let flightNumber = this.importAwbNotificationForm.get("flightNumber").value;
    let lFlightDate = this.importAwbNotificationForm.get("flightDate").value;
    let lStatus = this.importAwbNotificationForm.get("status").value;
    let lRrequestedFrom = this.importAwbNotificationForm.get("requestedFrom").value;
    let requestedTo = this.importAwbNotificationForm.get("requestedTo").value;


    let forward = {
      shipmentType: null, shipmentNumber: null, terminal: terminal
      , carrierGroup: carrierGroup, contactMode: contactMode
      , awbNumber: awbNumber, flightNumber: flightNumber
      , flightDate: lFlightDate, status: lStatus, requestedFrom: lRrequestedFrom
      , requestedTo: requestedTo
    };
    let shipmentNo;
    let shipmentType;
    let array = this.importAwbNotificationForm.getRawValue();
    let count = 0;
    console.log(array.flightDiscrepancyList);
    array.awbNotificationInfo.forEach(element => {
      if (element.selectCheck == true && count <= 1) {
        shipmentNo = element.awbNumber;
        shipmentType = element.shipmentType
        count++;
      }
    });

    forward["shipmentNumber"] = shipmentNo;
    forward["shipmentType"] = shipmentType;
    if (count == 1) {
      this.navigateTo(this.router, 'awbmgmt/awbdocument', forward);
    } else if (count > 1) {
      this.showErrorMessage("only.one.shipment");
      return;
    } else if (count == 0) {
      this.showInfoStatus("import.info103");
    }
  }

  openShipmentInfoPage() {
    let terminal = this.importAwbNotificationForm.get("terminal").value;
    let carrierGroup = this.importAwbNotificationForm.get("carrierGroup").value;
    let contactMode = this.importAwbNotificationForm.get("contactMode").value;
    let awbNumber = this.importAwbNotificationForm.get("awbNumber").value;
    let flightNumber = this.importAwbNotificationForm.get("flightNumber").value;
    let lFlightDate = this.importAwbNotificationForm.get("flightDate").value;
    let lStatus = this.importAwbNotificationForm.get("status").value;
    let lRrequestedFrom = this.importAwbNotificationForm.get("requestedFrom").value;
    let requestedTo = this.importAwbNotificationForm.get("requestedTo").value;


    let forward = {
      shipmentType: null, shipmentNumber: null, terminal: terminal
      , carrierGroup: carrierGroup, contactMode: contactMode
      , awbNumber: awbNumber, flightNumber: flightNumber
      , flightDate: lFlightDate, status: lStatus, requestedFrom: lRrequestedFrom
      , requestedTo: requestedTo
    };
    let shipmentNo;
    let shipmentType;
    let array = this.importAwbNotificationForm.getRawValue();
    let count = 0;
    console.log(array.flightDiscrepancyList);
    array.awbNotificationInfo.forEach(element => {
      if (element.selectCheck == true && count <= 1) {
        shipmentNo = element.awbNumber;
        shipmentType = element.shipmentType
        count++;
      }
    });

    forward["shipmentNumber"] = shipmentNo;
    forward["shipmentType"] = shipmentType;
    if (count == 1) {
      this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', forward);
    } else if (count > 1) {
      this.showErrorMessage("only.one.shipment");
      return;
    } else if (count == 0) {
      this.showInfoStatus("import.info103");
    }
  }
  reSendNotification() {
    let request = (<NgcFormGroup>this.importAwbNotificationForm.get(['awbNotificationInfo'])).getRawValue();
    this.importService.resendAWBNotification(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');

        this.showTable = false;

      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  onPrint() {

    this.reportParameters = new Object();
    if (this.importAwbNotificationForm.get('terminal').value) {
      this.reportParameters.terminalFlg = '1';
      this.reportParameters.terminal = this.importAwbNotificationForm.get('terminal').value;
    } else {
      this.reportParameters.terminalFlg = '0';
      this.reportParameters.terminal = null;
    }
    if (this.importAwbNotificationForm.get('contactMode').value) {
      this.reportParameters.contactModeFlg = '1';
      this.reportParameters.contactMode = this.importAwbNotificationForm.get('contactMode').value;
    } else {
      this.reportParameters.contactModeFlg = '0';
      this.reportParameters.contactMode = null;
    }
    if (this.importAwbNotificationForm.get('requestedFrom').value) {
      this.reportParameters.requestedFromFlg = '1';
      this.reportParameters.requestedFrom = this.importAwbNotificationForm.get('requestedFrom').value;
    } else {
      this.reportParameters.requestedFromFlg = '0';
      this.reportParameters.requestedFrom = null;
    }
    if (this.importAwbNotificationForm.get('requestedTo').value) {
      this.reportParameters.requestedToFlg = '1';
      this.reportParameters.requestedTo = this.importAwbNotificationForm.get('requestedTo').value;
    } else {
      this.reportParameters.requestedToFlg = '0';
      this.reportParameters.requestedTo = null;
    }
    if (this.importAwbNotificationForm.get('flightNumber').value) {
      this.reportParameters.flightNumberFlg = '1';
      this.reportParameters.flightNumber = this.importAwbNotificationForm.get('flightNumber').value;
    } else {
      this.reportParameters.flightNumberFlg = '0';
      this.reportParameters.flightNumber = null;
    }
    if (this.importAwbNotificationForm.get('flightDate').value) {
      this.reportParameters.flightDateFlg = '1';
      this.reportParameters.flightDate = this.importAwbNotificationForm.get('flightDate').value;
    } else {
      this.reportParameters.flightDateFlg = '0';
      this.reportParameters.flightDate = null;
    }

    if (this.importAwbNotificationForm.get('status').value) {
      this.reportParameters.statusFlg = '1';
      this.reportParameters.status = this.importAwbNotificationForm.get('status').value;
    } else {
      this.reportParameters.statusFlg = '0';
      this.reportParameters.status = null;
    }
    if (this.importAwbNotificationForm.get('awbNumber').value) {
      this.reportParameters.awbNumberFlg = '1';
      this.reportParameters.awbNumber = this.importAwbNotificationForm.get('awbNumber').value;
    } else {
      this.reportParameters.awbNumberFlg = '0';
      this.reportParameters.awbNumber = null;
    }
    if (this.importAwbNotificationForm.get('carrierGroup').value) {
      this.reportParameters.carrierGroupFlg = '1';
      this.reportParameters.carrierGroup = this.importAwbNotificationForm.get('carrierGroup').value;
    } else {
      this.reportParameters.carrierGroupFlg = '0';
      this.reportParameters.carrierGroup = null;
    }

    this.reportParameters.tenantAirportCode = NgcUtility.getTenantConfiguration().airportCode;


    this.reportWindow.open();


  }


}
