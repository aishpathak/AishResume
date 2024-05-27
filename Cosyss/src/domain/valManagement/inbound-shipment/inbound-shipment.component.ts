import {
  Component,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ReflectiveInjector,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  Pipe,
  PipeTransform,
  ContentChildren,
  forwardRef,
  ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormGroupDirective,
  FormArray,
  FormGroup,
  FormControl,
  FormControlName,
  Validators
} from "@angular/forms";
// Application
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  NgcWindowComponent,
  NgcUtility,
  NgcTabsComponent,
  PageConfiguration,
  NgcReportComponent,
  DateTimeKey
} from "ngc-framework";

// Environment/Configuration
import { Environment } from "../../../environments/environment";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { SearchShipment } from "./../val.sharemodel";
import { ValSharedService } from "./../val-shared.service";
import { Subscription } from "rxjs";
const Constants = {
  DEFAULT_FORM_NAME: "form",
  VOLATILE_FORM_CONTROL_ID: "volatileFormControlId"
};
@Component({
  selector: "app-inbound-shipment",
  templateUrl: "./inbound-shipment.component.html",
  styleUrls: ["./inbound-shipment.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class InboundShipmentComponent extends NgcPage {
  response: any;
  autoRefresh: Subscription;
  resp: any;
  arrayUser: any[];
  reportParameters: any;
  isTableFlg: boolean;
  private searchForm: NgcFormGroup = new NgcFormGroup({
    auto: new NgcFormControl(false),
    // changes done as per the Bug: 2263
    dateFrom: new NgcFormControl(NgcUtility.subtractDate(new Date(), 12, DateTimeKey.HOURS)),
    dateTo: new NgcFormControl(new Date()),
    carrierGroupCode: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    flightNo: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    flightType: new NgcFormControl(),
    valShipmentMonitoring: new NgcFormArray([
      new NgcFormGroup({
        shipmentNumber: new NgcFormControl(),
        hawbNumber: new NgcFormControl(),
        uLDNumber: new NgcFormControl(),
        inbFlightDate: new NgcFormControl(),
        date: new NgcFormControl(),
        sta: new NgcFormControl(),
        eta: new NgcFormControl(),
        bay: new NgcFormControl(),
        flightStatus: new NgcFormControl(),
        originAirport: new NgcFormControl(),
        destinationAirport: new NgcFormControl(),
        pieces: new NgcFormControl(),
        weight: new NgcFormControl(),
        transferType: new NgcFormControl(),
        outboundFlight: new NgcFormControl(),
        consignee: new NgcFormControl(),
        inbFlightKey: new NgcFormControl(),
        oubFlightKey: new NgcFormControl(),
        natureOfGoods: new NgcFormControl()
      })
    ])
  });
  /**
  * Initialize
  * @param appZone Ng Zone
  * @param appElement Element Ref
  * @param appContainerElement View Container Ref
  */

  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  carrier: any;
  carrierGroupCodeParam: {};
  carrierCode: any;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private valsharedService: ValSharedService,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    // changes done as per the Bug: 2263
    // this.valsharedService.onDateSearchInbound().subscribe(data => {
    //   this.resp = data.data;
    //   this.searchForm.patchValue(this.resp);
    //   //   this.onSearch(event);
    // });

    const request: any = new SearchShipment();
    this.valsharedService.fetchSystemParam(request).subscribe(data => {
      this.response = data.data[0].value;
    });
  }

  onSearch(event) {
    this.isTableFlg = false;
    this.searchForm.validate();
    // changes done as per the Bug: 2263
    let dateFromval = this.searchForm.get("dateFrom").value;
    let dateToval = this.searchForm.get("dateTo").value;
    let daysDiff: any;

    var dif = NgcUtility.dateDifference(dateToval, dateFromval);
    daysDiff = dif / (1000 * 60 * 60 * 24);

    if (daysDiff > 90) {
      this.showErrorMessage('gen.daterangeerror');
      return;
    }

    if (this.searchForm.valid) {
      const req: SearchShipment = new SearchShipment();
      req.dateFrom = this.searchForm.get("dateFrom").value;
      req.dateTo = this.searchForm.get("dateTo").value;
      req.carrierGroupCode = this.searchForm.get("carrierGroupCode").value;
      req.carrierCode = this.searchForm.get("carrierCode").value;
      req.flightNo = this.searchForm.get("flightNo").value;
      req.flightDate = this.searchForm.get("flightDate").value;
      req.flightType = this.searchForm.get("flightType").value;
      this.valsharedService.searchResult(req).subscribe(data => {
        this.refreshFormMessages(data);
        this.resp = data;
        this.arrayUser = this.resp.data;
        if (this.arrayUser.length > 0 && this.arrayUser.length != null) {
          this.formatFlight();
          this.searchForm.controls["valShipmentMonitoring"].patchValue(
            this.arrayUser
          );
          this.isTableFlg = true;
        } else {
          this.isTableFlg = false;
        }
      });
    }
  }
  // TODO: Remove inline css once framework updated
  public throughTransitCellsRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): string => {
    let shcs: any;
    if (rowData.flightStatus === "DELAYED") {
      // tslint:disable-next-line:max-line-length
      shcs = '<span style="color:red;">DELAYED</i></span>';
    } else if (rowData.flightStatus === "RESTORED") {
      shcs = "";
      // tslint:disable-next-line:max-line-length
      shcs = '<span style="color:green;">RESTORED</i></span>';
    } else if (rowData.flightStatus === "CANCELLED") {
      shcs = "";
      // tslint:disable-next-line:max-line-length
      shcs = '<span style="color:grey;">CANCELLED</i></span>';
    } else {
      shcs = "";
      // tslint:disable-next-line:max-line-length
      shcs = "<span>ON TIME</i></span>";
    }
    return shcs;
  };
  public CellsRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): string => {
    let shcs: any;
    let str: string;
    let date = new Date();
    let day =
      NgcUtility.dateDifference(rowData.eta, rowData.sta) / 1000 / 60 / 1440;
    console.log(day);
    if (day > 1) {
      date = rowData.eta;
      str = date.toString().slice(3, 21);
      shcs = "<span>" + str + "</span>";
    } else {
      date = rowData.eta;
      str = date.toString().slice(16, 21);
      shcs = "<span>" + str + "</span>";
    }
    return shcs;
  };
  formatFlight() {
    for (let index = 0; index < this.arrayUser.length; index++) {
      this.arrayUser[index]["sta"] = NgcUtility.toDateFromLocalDate(
        this.arrayUser[index]["sta"]
      );
      this.arrayUser[index]["eta"] = NgcUtility.toDateFromLocalDate(
        this.arrayUser[index]["eta"]
      );
      // this.arrayUser[index]['inbFlightDate'] =
      //   NgcUtility.toDateFromLocalDate(this.arrayUser[index]['inbFlightDate']);
    }
  }

  public onBack(event) {
    this.navigateBack(this.searchForm.getRawValue());
  }

  onSelectCarrierGroup(event) {
    this.carrier = event.desc;
    this.carrierGroupCodeParam = this.createSourceParameter(this.searchForm.get('carrierGroupCode').value, Math.random().toString());

  }

  onAutoRefresh(event) {
    if (this.autoRefresh) {
      this.autoRefresh.unsubscribe();
      this.autoRefresh = null;
    }
    if (event === true) {
      this.autoRefresh = this.getTimer(this.response).subscribe(data => {
        this.onSearch(event);
      });
    }
  }

  oninboundServiceReport() {
    this.reportParameters = new Object();
    this.reportParameters.from = this.searchForm.get('dateFrom').value;
    this.reportParameters.to = this.searchForm.get('dateTo').value;
    this.reportParameters.flightoffboardpoint = NgcUtility.getTenantConfiguration().airportCode;
    this.reportWindow.open();
  }

  OnchangeFlightNumber() {
    let flightNoVal: any;
    flightNoVal = this.searchForm.get("flightNo").value;
    if (flightNoVal != null) {
      this.searchForm.get(['flightDate']).setValidators([Validators.required]);
    }
    else {
      this.searchForm.get(['flightDate']).setValidators([]);
    }
  }
}
