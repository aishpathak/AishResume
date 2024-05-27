import { ApplicationEntities } from './../../common/applicationentities';
import { log } from "util";
import {
  Component,
  NgZone,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
  ErrorMessage,
  NgcReportComponent,
  ReactiveModel
} from "ngc-framework";
import { CellsStyleClass } from "../../../shared/shared.data";
import { ImportService } from "../import.service";
import { FlightsResponse, FlightRequest, Flight } from "../import.sharedmodel";
import { CollectPaymentService } from '../../billing/collectPayment/collectPayment.service';
import { SearchHouseWayBillListform } from '../../awbManagement/awbManagement.shared';
import { ApplicationFeatures } from "../../common/applicationfeatures";
@Component({
  selector: "app-undeliveredshipment",
  templateUrl: "./undeliveredshipment.component.html",
  styleUrls: ["./undeliveredshipment.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  restorePageOnBack: true,
  autoBackNavigation: true
})
export class UndeliveredshipmentComponent extends NgcPage implements OnInit {
  @ReactiveModel(SearchHouseWayBillListform)
  public searchForm: NgcFormGroup;
  reportParameters: any = new Object();
  //reportParameters: any = new Object();
  errors: any[];
  response: BaseResponse<any>;
  isUndeliveredShipment: boolean;
  resp: any;
  responseArray: any[];
  notifyAll: string[] = ["ALL", "Y", "N"];
  dewllTime: string[] = ["ALL", '3', '7'];
  dgNonDgShip: string[] = ["ALL", "Y", "N"];
  dgOnHold: string[] = ["ALL", "Y", "N"];
  ncCode: string[] = ["ALL", "NC", "Non NC"];
  readyNotReadyDropDown: string[] = ["Select", "Ready", "Not Ready"];
  queryList: any;
  showTable = false;
  awbNumber;
  flightKey;
  flightDate;
  shipPieces;
  shipWeight;
  dateTimefrom;
  dateTimeTo;
  notifyAlldata;
  groupCarrier;
  consigneeName;
  dwellTimeOn;
  shcType;
  terminal;
  dateValue;
  private undeliveredShipmentform: NgcFormGroup = new NgcFormGroup({
    terminalCode: new NgcFormControl(),
    shcs: new NgcFormControl(),
    dateFrom: new NgcFormControl(),
    timeFrom: new NgcFormControl(),
    dateTo: new NgcFormControl(),
    timeTo: new NgcFormControl(),
    notify: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    flightNumber: new NgcFormControl(),
    date: new NgcFormControl(""),
    shipmentNumber: new NgcFormControl(),
    carrierGroup: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    consigneeDetails: new NgcFormControl(),
    dwellTime: new NgcFormControl(),
    createdOn: new NgcFormControl(),
    modifiedOn: new NgcFormControl(),
    dateTimeFrom: new NgcFormControl(),
    dateTimeTo: new NgcFormControl(),
    unShipmentList: new NgcFormArray([]),
    unShipmentListAll: new NgcFormArray([]),
    readyNotReady: new NgcFormControl(),
    domesticInterFlight: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    iataAgentCode: new NgcFormControl(),
    daysBeforeATA: new NgcFormControl(),
    dgFlag: new NgcFormControl(),
    dgOnHold: new NgcFormControl(),
    ncCode: new NgcFormControl(),
    ata: new NgcFormControl(),

    unShipmantData: new NgcFormGroup({
      awbNumber: new NgcFormControl()
    })
  });

  billTotal: any;
  collectTotal: any;
  chargeWindowData: any;
  @ViewChild("reportWindowExcel") reportWindowExcel: NgcReportComponent;
  @ViewChild('enquiryWindow') enquiryWindow: NgcWindowComponent;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private route: ActivatedRoute,
    private router: Router,
    private collectPaymentService: CollectPaymentService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();

    this.undeliveredShipmentform
      .get("dateTimeFrom")
      .valueChanges.subscribe(changeValue => {
        if (changeValue) {
          this.undeliveredShipmentform
            .get("dateTimeTo")
            .setValidators([Validators.required]);
        } else {
          this.undeliveredShipmentform.get("dateTimeTo").setValidators([]);
        }
      });
    this.undeliveredShipmentform
      .get("flightNumber")
      .valueChanges.subscribe(changeValueto => {
        if (changeValueto) {
          this.undeliveredShipmentform
            .get("date")
            .setValidators([Validators.required]);
        } else {
          this.undeliveredShipmentform.get("date").setValidators([]);
        }
      });
    this.undeliveredShipmentform
      .get("date")
      .valueChanges.subscribe(newValue => {
        if (newValue) {
          this.undeliveredShipmentform.get("flightDate").setValue(newValue);
        } else {
          this.undeliveredShipmentform.get("flightDate").setValue(null);
        }
      });
    this.undeliveredShipmentform
      .get("dateTimeFrom")
      .valueChanges.subscribe(newValues => {
        if (newValues) {
          this.undeliveredShipmentform.get("dateFrom").setValue(newValues);
        } else {
          this.undeliveredShipmentform.get("dateFrom").setValue(null);
        }
      });
    this.undeliveredShipmentform
      .get("dateTimeTo")
      .valueChanges.subscribe(newValuess => {
        if (newValuess) {
          this.undeliveredShipmentform.get("dateTo").setValue(newValuess);
        } else {
          this.undeliveredShipmentform.get("dateTo").setValue(null);
        }
      });
    this.undeliveredShipmentform.get("notify").setValue("ALL");
    this.undeliveredShipmentform.get("dgOnHold").setValue("ALL");
    this.undeliveredShipmentform.get("dgFlag").setValue("ALL");
    this.undeliveredShipmentform.get("ncCode").setValue("ALL");
    this.undeliveredShipmentform.get("ata").setValue(new Date());
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    super.ngAfterViewInit();
  }
  // tslint:disable-next-line:cyclomatic-complexity
  searchUndeliveredShipment() {
    this.showTable = false;
    if (this.undeliveredShipmentform.controls.hawbNumber.invalid) {
      return;
    }
    const unShipmentDataList = this.undeliveredShipmentform.getRawValue();
    this.awbNumber = this.undeliveredShipmentform.get("shipmentNumber").value;
    this.notifyAlldata = this.undeliveredShipmentform.get("notify").value;
    this.flightKey = this.undeliveredShipmentform.get("flightNumber").value;
    this.flightDate = this.undeliveredShipmentform.get("date").value;
    this.groupCarrier = this.undeliveredShipmentform.get("carrierGroup").value;
    this.consigneeName = this.undeliveredShipmentform.get(
      "consigneeDetails"
    ).value;
    //this.domesticFlag = this.undeliveredShipmentform.get("domesticFlag").value;
    if (this.undeliveredShipmentform.get("dwellTime").value == 'ALL') {
      unShipmentDataList.dwellTime = null;
      this.dwellTimeOn = null;
    } else {
      unShipmentDataList.dwellTime = this.undeliveredShipmentform.get("dwellTime").value;
      this.dwellTimeOn = this.undeliveredShipmentform.get("dwellTime").value;
    }
    this.shcType = this.undeliveredShipmentform.get("shcs").value;
    this.terminal = this.undeliveredShipmentform.get("terminalCode").value;
    if (unShipmentDataList.notify === "Y") {
      unShipmentDataList.notify = 1;
    } else {
      unShipmentDataList.notify = 0;
    }
    if (
      unShipmentDataList.dateTimeFrom !== null &&
      unShipmentDataList.dateTimeTo === null
    ) {
      this.showErrorStatus("imp.err137");
      return;
    }

    if (
      unShipmentDataList.dateTimeTo !== null &&
      unShipmentDataList.dateTimeFrom === null
    ) {
      this.showErrorStatus("imp.err136");
      return;
    }
    if (unShipmentDataList.flightNumber === "") {
      unShipmentDataList.flightNumber = null;
    }
    if (
      unShipmentDataList.flightNumber !== null &&
      unShipmentDataList.date === null
    ) {
      this.showErrorStatus("imp.err138");
      return;
    }
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Import_Dlv_CAR)) {
      if ((unShipmentDataList.dateTimeTo !== null || unShipmentDataList.dateTimeFrom !== null) &&
        unShipmentDataList.daysBeforeATA !== null) {
        this.showErrorStatus("import.date.from.to.days.before.error");
        return;
      }
    }
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Import_Dlv_ATA)) {
      if (this.undeliveredShipmentform.get("ata").value == null || this.undeliveredShipmentform.get("ata").value == "") {
        this.showErrorStatus("export.fill.in.mandatory.details");
        return;
      }
    }

    unShipmentDataList.ataFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Import_Dlv_ATA);
    unShipmentDataList.dgOnHoldFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Import_Dlv_DGNonDG_Shipment);
    unShipmentDataList.dgFlagFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Import_Dlv_DGNonDG_Shipment);
    unShipmentDataList.iataAgentCodeFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Import_Dlv_IATAAgentCode);
    unShipmentDataList.ncCodeFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Import_Dlv_NCCode);
    unShipmentDataList.daysBeforeATAFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Import_Dlv_ATA);
    unShipmentDataList.customsConstraintCodeFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Import_Dlv_CustomConstraintCode);
    unShipmentDataList.carFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Import_Dlv_CAR);
    unShipmentDataList.requiredRelocationFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Import_Dlv_RequiredRelocation);

    // if (
    //   unShipmentDataList.date !== null &&
    //   unShipmentDataList.flightNumber === null
    // ) {
    //   this.showErrorStatus("Please enter the  flightNumber");
    //   return;
    // }
    console.log(unShipmentDataList);
    this.importService.getAllUndeliveredShipment(unShipmentDataList).subscribe(
      data => {
        this.resp = data;
        this.responseArray = this.resp.data;
        this.refreshFormMessages(data);
        (<NgcFormArray>this.undeliveredShipmentform.controls["unShipmentList"]).resetValue([]);
        if (this.resp.data.lenght !== 0) {
          let i = 0;
          for (const eachRow of this.resp.data) {
            if (eachRow.awb == false) {
              this.resp.data[i].awb = null;
            }
            if (eachRow.nfd == false) {
              this.resp.data[i].nfd = null;
            }
            if (eachRow.storageCharges == "0.000") {
              this.resp.data[i].storageCharges = null;
              this.resp.data[i].chargesAsOn = null;
            }
            ++i;
          }
          (<NgcFormArray>this.undeliveredShipmentform.controls["unShipmentList"
          ]).patchValue(this.resp.data);
          this.showTable = true;
        } else {
          this.showTable = false;
          this.showErrorMessage("no.record.found");
        }
      },
      // tslint:disable-next-line:no-shadowed-variable
      error => {
        this.showTable = false;
        this.showErrorStatus("no.record.found");
      }
    );
    // }
  }
  onExportToExcel(event) {
    if (this.undeliveredShipmentform.get("shipmentNumber").value) {
      this.reportParameters.shpNmb = this.undeliveredShipmentform.get("shipmentNumber").value;
    }
    else {
      this.reportParameters.shpNmb = null;
    }
    if (this.undeliveredShipmentform.get("shcs").value) {
      this.reportParameters.shc = this.undeliveredShipmentform.get("shcs").value;
    }
    else {
      this.reportParameters.shc = null;
    }
    if (this.undeliveredShipmentform.get("dwellTime").value) {
      if (this.undeliveredShipmentform.get("dwellTime").value == 'ALL') {
        this.reportParameters.dwel = null;
      } else {
        this.reportParameters.dwel = this.undeliveredShipmentform.get("dwellTime").value;
      }
    }
    else {
      this.reportParameters.dwel = null;
    }
    if (this.undeliveredShipmentform.get("flightNumber").value) {
      this.reportParameters.fltKey = this.undeliveredShipmentform.get("flightNumber").value;
    }
    else {
      this.reportParameters.fltKey = null;
    }
    if (this.undeliveredShipmentform.get("date").value) {
      this.reportParameters.fltDte = this.undeliveredShipmentform.get("date").value;
    }
    else {
      this.reportParameters.fltDte = null;
    }
    if (this.undeliveredShipmentform.get("dateTimeFrom").value) {
      this.reportParameters.frmDteFlg = '1';
      this.reportParameters.frmDte = this.undeliveredShipmentform.get("dateTimeFrom").value;
      const dt = new Date(this.undeliveredShipmentform.get("dateTimeFrom").value);
      let date, month, year;

      date = dt.getDate();
      month = dt.toLocaleString('en-us', { month: 'short' }).toUpperCase();
      year = dt.getFullYear().toString().substring(2);
      date = date.toString().padStart(2, '0');
      this.reportParameters.frmDateOnly = date + month + year;
    }
    else {
      this.reportParameters.frmDteFlg = '0';
      this.reportParameters.frmDte = null;
      this.reportParameters.frmDateOnly = null;
    }
    if (this.undeliveredShipmentform.get("dateTimeTo").value) {
      this.reportParameters.toDteFlg = '1';
      this.reportParameters.toDte = this.undeliveredShipmentform.get("dateTimeTo").value;
      const dt = new Date(this.undeliveredShipmentform.get("dateTimeTo").value);
      let date, month, year;

      date = dt.getDate();
      month = dt.toLocaleString('en-us', { month: 'short' }).toUpperCase();
      year = dt.getFullYear().toString().substring(2);
      date = date.toString().padStart(2, '0');
      this.reportParameters.toDateOnly = date + month + year;
    }
    else {
      this.reportParameters.toDteFlg = '0';
      this.reportParameters.toDte = null;
      this.reportParameters.toDateOnly = null;
    }
    if (this.undeliveredShipmentform.get("terminalCode").value) {
      this.reportParameters.trmnlFlg = '1';
      this.reportParameters.trmnl = this.undeliveredShipmentform.get("terminalCode").value;
    }
    else {
      this.reportParameters.trmnlFlg = '0';
      this.reportParameters.trmnl = null;
    }
    if (this.undeliveredShipmentform.get("carrierGroup").value) {
      this.reportParameters.carrierGroupFlg = '1';
      this.reportParameters.carrierGrp = this.undeliveredShipmentform.get("carrierGroup").value;
    }
    else {
      this.reportParameters.carrierGroupFlg = '0';
      this.reportParameters.carrierGrp = null;
    }
    if (this.undeliveredShipmentform.get(
      "consigneeDetails"
    ).value) {
      this.reportParameters.cstmNam = this.undeliveredShipmentform.get(
        "consigneeDetails"
      ).value;
    }
    else {
      this.reportParameters.cstmNam = null;
    }
    if (this.undeliveredShipmentform.get("notify").value != 'ALL') {
      if (this.undeliveredShipmentform.get("notify").value == 1) {
        this.reportParameters.awdFlg = '1';
        this.reportParameters.nwdFlg = '0';
      }
      else {
        this.reportParameters.awdFlg = '0';
        this.reportParameters.nwdFlg = '1';
      }
    }
    else {
      this.reportParameters.nwdFlg = '0';
      this.reportParameters.awdFlg = '0';
    }

    if (this.undeliveredShipmentform.get("readyNotReady").value) {
      if (this.undeliveredShipmentform.get("readyNotReady").value == 'Ready') {
        this.reportParameters.rdyFlg = '1';
        this.reportParameters.ntRdyFlg = '0';
      }

      else {
        this.reportParameters.rdyFlg = '0';
        this.reportParameters.ntRdyFlg = '1';
      }
    } else {
      this.reportParameters.rdyFlg = '0';
      this.reportParameters.ntRdyFlg = '0';
    }
    if (this.undeliveredShipmentform.get("carrierCode").value) {
      this.reportParameters.carrierCodeFlag = '1';
      this.reportParameters.carrierCode = this.undeliveredShipmentform.get("carrierCode").value;
    }
    else {
      this.reportParameters.carrierCodeFlag = '0';
      this.reportParameters.carrierCode = null;
    }
    if (this.undeliveredShipmentform.get("hawbNumber").value) {
      this.reportParameters.hawbNumberFlg = '1';
      this.reportParameters.hawbNumber = this.undeliveredShipmentform.get("hawbNumber").value;
    }
    else {
      this.reportParameters.hawbNumberFlg = '0';
      this.reportParameters.hawbNumber = null;
    }
    if (this.undeliveredShipmentform.get("domesticInterFlight").value) {
      this.reportParameters.domesticInterFlightFlg = '1';
      this.reportParameters.domesticInterFlight = (String)(this.undeliveredShipmentform.
        get("domesticInterFlight").value).substring(0, 3).toUpperCase();
    }
    else {
      this.reportParameters.domesticInterFlightFlg = '0';
      this.reportParameters.domesticInterFlight = null;
    }
    if (this.undeliveredShipmentform.get("ncCode").value == 'All' || this.undeliveredShipmentform.get("ncCode").value == null) {
      this.reportParameters.ncCode = null;
    }
    else {
      this.reportParameters.ncCode = this.undeliveredShipmentform.get("ncCode").value;
    }
    if (this.undeliveredShipmentform.get("dgOnHold").value == 'All' || this.undeliveredShipmentform.get("dgOnHold").value == null) {
      this.reportParameters.dgOnHold = null;
    }
    else {
      this.reportParameters.dgOnHold = this.undeliveredShipmentform.get("dgOnHold").value;
    }
    if (this.undeliveredShipmentform.get("dgFlag").value == 'All' || this.undeliveredShipmentform.get("dgFlag").value == null) {
      this.reportParameters.dgFlag = null;
    }
    else {
      this.reportParameters.dgFlag = this.undeliveredShipmentform.get("dgFlag").value;
    }
    if (this.undeliveredShipmentform.get("iataAgentCode").value) {
      //this.reportParameters.carrierGroupFlg = '1';
      this.reportParameters.iataAgentCode = this.undeliveredShipmentform.get("iataAgentCode").value;
    }
    else {
      // this.reportParameters.carrierGroupFlg = '0';
      this.reportParameters.iataAgentCode = null;
    }
    if (this.undeliveredShipmentform.get("ata").value) {
      //this.reportParameters.carrierGroupFlg = '1';
      this.reportParameters.ata = this.undeliveredShipmentform.get("ata").value;
      const dt = new Date(this.undeliveredShipmentform.get("ata").value);
      let date, month, year, hours, minutes;

      date = dt.getDate();
      month = dt.toLocaleString('en-us', { month: 'short' }).toUpperCase();
      year = dt.getFullYear().toString().substring(2);
      date = date.toString().padStart(2, '0');
      this.reportParameters.ataDateOnly = date + month + year;
      hours = dt.getHours();
      hours = hours.toString().padStart(2, '0');
      minutes = dt.getMinutes();
      minutes = minutes.toString().padStart(2, '0');
      this.reportParameters.ataTimeOnly = hours + ":" + minutes;

    }
    else {
      // this.reportParameters.carrierGroupFlg = '0';
      this.reportParameters.ata = null;
      this.reportParameters.ataDateOnly = null;
      this.reportParameters.ataTimeOnly = null;
    }
    this.reportParameters.userLoginCode = NgcUtility.getUserProfile().userLoginCode;
    if (this.undeliveredShipmentform.get("daysBeforeATA").value) {
      //this.reportParameters.carrierGroupFlg = '1';
      this.reportParameters.daysBeforeATA = Number.parseInt(this.undeliveredShipmentform.get("daysBeforeATA").value);
    }
    else {
      // this.reportParameters.carrierGroupFlg = '0';
      this.reportParameters.daysBeforeATA = null;
    }
    this.reportParameters.hawbFlg = false;

    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
      this.reportParameters.hawbFlg = true;
    }
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Import_Dlv_ATA)) {
      this.reportParameters.tenantFlag = true;
    }
    else {
      this.reportParameters.tenantFlag = false;
    }
    this.reportWindowExcel.reportParameters = this.reportParameters;
    this.reportWindowExcel.downloadReport();
  }


  public unshipmentCellsRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): string => {
    let payment: any;
    if (rowData.paymentRequired == 1) {
      // tslint:disable-next-line:max-line-length
      payment =
        '<span style="color:#fff;background:green; ">&nbsp;Y&nbsp;</i></span>';
    } else if (rowData.paymentRequired == 0) {
      // tslint:disable-next-line:max-line-length
      payment =
        '<span style="color:#fff;background:black;">&nbsp;N&nbsp;</i></span>';
    } else {
      payment = "";
      // tslint:disable-next-line:max-line-length
      payment = '<span style="black;">&nbsp;N&nbsp;</i></span>';
    }
    return payment;
  };
  public awdCellsRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): string => {
    let awbList: any;
    if (rowData.awb == 0) {
      // tslint:disable-next-line:max-line-length
      awbList =
        '<span style="color:#fff;background:green; ">&nbsp;N&nbsp;</i></span>';
    } else if (rowData.awb == 1) {
      // tslint:disable-next-line:max-line-length
      awbList =
        '<span style="color:#fff;background:black;">&nbsp;Y&nbsp;</i></span>';
    } else {
      awbList = "";
      // tslint:disable-next-line:max-line-length
      awbList = '<span style="black;">&nbsp;N&nbsp;</i></span>';
    }
    return awbList;
  };
  public nfdCellsRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): string => {
    let nfdList: any;
    if (rowData.nfd == 0) {
      // tslint:disable-next-line:max-line-length
      nfdList =
        '<span style="color:#fff;background:green; ">&nbsp;N&nbsp;</i></span>';
    } else if (rowData.nfd == 1) {
      // tslint:disable-next-line:max-line-length
      nfdList =
        '<span style="color:#fff;background:black;">&nbsp;Y&nbsp;</i></span>';
    } else {
      nfdList = "";
      // tslint:disable-next-line:max-line-length
      nfdList = '<span style="black;">&nbsp;N&nbsp;</i></span>';
    }
    return nfdList;
  };
  onHyperLinkClick(event): void {
    const record = event.record;
    if (event.column && event.column == 'storageCharges') {
      this.onChargePopup(event.record);
    } else {
      this.navigateTo(this.router, "awbmgmt/awbdocument", record.shipmentNumber);
    }
  }
  /**
    * On Next (nextPage)
    *
    * @param event Event
    */
  public onCustomer(event) {
    const indices: any = [];
    for (let index = this.responseArray.length - 1; index >= 0; index--) {
      const item = (<NgcFormArray>this.undeliveredShipmentform.get(
        "unShipmentList"
      ))["controls"][index]["value"];
      if (item.scInd) {
        indices.push(item);
      }
    }
    if (!indices[0]) {
      this.showErrorStatus("imp.err139");
      return;
    }
    this.navigateTo(this.router, "import/import-awbnotification", indices);
  }
  /**
    * On Next (nextPage)
    *
    * @param event Event
    */
  public onAwbRelease(event) {
    const indices: any = [];
    for (let index = this.responseArray.length - 1; index >= 0; index--) {
      const item = (<NgcFormArray>this.undeliveredShipmentform.get(
        "unShipmentList"
      ))["controls"][index]["value"];
      if (item.scInd) {
        indices.push(item);
      }
    }
    if (!indices[0]) {
      this.showErrorStatus("imp.err139");
      return;
    }
    this.navigateTo(this.router, "import/awbreleaseform", indices);
  }
  /**
    * On Next (nextPage)
    *
    * @param event Event
    */
  public onAwbDocument(event) {
    const indices: any = [];
    for (let index = this.responseArray.length - 1; index >= 0; index--) {
      const item = (<NgcFormArray>this.undeliveredShipmentform.get(
        "unShipmentList"
      ))["controls"][index]["value"];
      if (item.scInd) {
        indices.push(item);
      }
    }
    if (!indices[0]) {
      this.showErrorStatus("imp.err139");
      return;
    }
    const data = indices[0].shipmentNumber;
    this.navigateTo(this.router, "awbmgmt/awbdocument", { "shipmentNumber": data });
  }
  /**
    * On Next (nextPage)
    *
    * @param event Event
    */
  public onAbandoned(event) {
    const indices: any = [];
    for (let index = this.responseArray.length - 1; index >= 0; index--) {
      const item = (<NgcFormArray>this.undeliveredShipmentform.get(
        "unShipmentList"
      ))["controls"][index]["value"];
      if (item.scInd) {
        indices.push(item);
      }
    }
    if (!indices[0]) {
      this.showErrorStatus("imp.err139");
      return;
    }
    this.navigateTo(this.router, "tracing/displayabandonedcargo", indices);
  }
  public cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.hold === true) {
      console.log(rowData);
      console.log(cellsStyle.className);
      const rowId: number = rowData.NGC_ROW_ID;
      cellsStyle.data = ` ${value}
       <a href="javascript:void(0)" data-row="${rowId}" data-column="${column}">
        <i class="fa fa-lock"  style="color:red" data-row="${rowId}" data-column="${column}"></i>
       </a>`;

    }
    return cellsStyle;
  }
  setAWBNumber(object) {
    if (object.code) {
      (<NgcFormControl>this.searchForm.get(["hawbNumber"])).setErrors(null);
    } else {
      this.showFormControlErrorMessage(<NgcFormControl>this.searchForm.get(["hawbNumber"]), 'invalid');
    }
  }
  onChargePopup(record) {
    this.billTotal = 0;
    this.collectTotal = 0;
    let billingReq: any = new Object();
    billingReq.shipment = record.shipmentNumber;
    billingReq.shipmentType = 'Shipment Number';
    this.collectPaymentService.enquireCharges(billingReq).subscribe(billingRes => {
      this.chargeWindowData = new Array();
      if (billingRes && billingRes.data) {
        let billingServiceRes = billingRes.data;
        if (billingServiceRes.length) {
          billingServiceRes.forEach(advice => {
            advice.chargeAdvice.forEach(element => {
              this.chargeWindowData.push(element);
              this.billTotal += element.toBill;
              this.collectTotal += element.toCollect;
              if (element.receiptNumber && element.receiptNumber.length) {
                element.receiptNumber = element.receiptNumber.toString();
              }
            });
          });
          this.enquiryWindow.open();
        }
      }
    });
  }
  onEcanStatus() {
    this.navigateTo(this.router, 'import/ecanStatusEnquiry', null);
  }
  onClickShipmentInformation() {
    const unShipmentDataList = this.undeliveredShipmentform.getRawValue();
    let unshipmentArray = unShipmentDataList.unShipmentList;
    let count = 0;
    let shipmentNumber = "";
    unshipmentArray.forEach(element => {
      if (element.scInd == true) {
        count++;
        shipmentNumber = element.shipmentNumber;
      }
    });
    if (count == 0) {
      this.showErrorStatus('warehouse.select.oneshipment');
      return;
    }
    if (count > 1) {
      this.showErrorStatus("transhipment.select.ship");
      return;
    }
    let navigateObj = {
      shipmentNumber: shipmentNumber
    }
    this.navigateTo(this.router, '/awbmgmt/shipmentinfoCR', navigateObj);

  }

}
