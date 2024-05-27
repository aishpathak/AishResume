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
  CellsRendererStyle
} from "ngc-framework";
import {
  FormGroupDirective,
  FormArray,
  FormGroup,
  FormControl,
  FormControlName,
  Validators
} from "@angular/forms";
// Environment/Configuration
import { Environment } from "../../../environments/environment";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { SearchOutboundShipment } from "./../val.sharemodel";
import { ValSharedService } from "./../val-shared.service";
import { AbstractControl } from "@angular/forms";
import { BaseRequest } from "ngc-framework";
import { Subscription } from "rxjs";

@Component({
  selector: "app-OutboundShipment",
  templateUrl: "./OutboundShipment.component.html",
  styleUrls: ["./OutboundShipment.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class OutboundShipmentComponent extends NgcPage {
  autoRefresh: Subscription;
  response: any;
  resp: any;
  requestParameter: any;
  arrayUser: any[];
  isTableFlg: boolean = false;
  depatureDiffParam: number;
  private searchForm: NgcFormGroup = new NgcFormGroup({
    auto: new NgcFormControl(false),
    dateFrom: new NgcFormControl(),
    dateTo: new NgcFormControl(),
    carrierGroupCode: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    flightNo: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    flightType: new NgcFormControl(),
    valShipmentMonitoring: new NgcFormArray([
      new NgcFormGroup({
        shipmentNumber: new NgcFormControl(),
        uldnumber: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        pieces: new NgcFormControl(),
        weight: new NgcFormControl(),
        checkoutFlag: new NgcFormControl(),
        checkoutDate: new NgcFormControl(),
        checkoutUser: new NgcFormControl(),
        checkInDate: new NgcFormControl(),
        checkInUser: new NgcFormControl(),
        flightNumber: new NgcFormControl(),
        flightOriginDate: new NgcFormControl(),
        std: new NgcFormControl(),
        etd: new NgcFormControl(),
        atd: new NgcFormControl(),
        flightDelay: new NgcFormControl(),
        parkingBay: new NgcFormControl(),
        transfer: new NgcFormControl(),
        incflightNumber: new NgcFormControl(),
        incflightOriginDate: new NgcFormControl(),
        sta: new NgcFormControl(),
        eta: new NgcFormControl(),
        ata: new NgcFormControl(),
        arrparkingBay: new NgcFormControl(),
        manifested: new NgcFormControl(),
        manifestDate: new NgcFormControl(),
        status: new NgcFormControl(),
        natureOfGoodsDescription: new NgcFormControl(),
        displayPieces: new NgcFormControl()


      })
    ])
  });
  carrier: any;
  carrierGroupCodeParam: any;
  carrierCode: any;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private valsharedService: ValSharedService,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
    //Fixme pick from Application Parameter table
    this.depatureDiffParam = 24;
  }

  ngOnInit() {
    this.valsharedService.onDateSearch().subscribe(data => {
      this.resp = data.data;
      this.searchForm.patchValue(this.resp);
      this.initialize();

    });
    const request: any = new SearchOutboundShipment
    this.valsharedService.fetchSystemParam(request).subscribe(data => {
      this.response = data.data[0].value;
    });
  }
  initialize() {
    //this.isTableFlg = true;
    console.log(this.searchForm.get(['valShipmentMonitoring']));
    if (this.searchForm.valid) {
      this.isTableFlg = true;
      const req: SearchOutboundShipment = new SearchOutboundShipment();
      req.dateFrom = this.searchForm.get("dateFrom").value;
      req.dateTo = this.searchForm.get("dateTo").value;

      //----code added------- 
      req.carrierGroupCode = this.searchForm.get("carrierGroupCode").value;
      req.carrierCode = this.searchForm.get("carrierCode").value;
      req.flightNo = this.searchForm.get("flightNo").value;

      req.flightDate = this.searchForm.get("flightDate").value;
      req.flightType = this.searchForm.get("flightType").value;
      console.log(req);
      this.valsharedService.searchOutboundResult(req).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.resetFormMessages();
          this.resp = data;
          this.arrayUser = this.resp.data;
          if (this.arrayUser != null && this.arrayUser.length > 0) {
            this.searchForm.controls["valShipmentMonitoring"].patchValue(this.arrayUser);
          } else {
            this.isTableFlg = false;
            this.resetFormMessages();

          }
        }
      }, error => {
        this.showErrorStatus(error);
      }
      );

    }
  }
  onSelectOfCarierGroup(event) {

    this.carrierGroupCodeParam = this.createSourceParameter(this.searchForm.get('carrierGroupCode').value, Math.random().toString());

  }


  onSearch(event) {
    //Reset the search result
    (<NgcFormArray>this.searchForm.controls['valShipmentMonitoring']).resetValue([]);

    this.resetFormMessages();

 

    if (this.searchForm.valid) {
      const search = this.searchForm.getRawValue();
     
      this.searchForm.patchValue(search);
      this.valsharedService.searchOutboundResult(search).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.resetFormMessages();
          this.resp = data;
          this.arrayUser = this.resp.data;
          if (this.arrayUser) {
            this.resp.data.forEach(element => {
              if (element.outboundFlight) {
                element.outboundFlight.dayDiff = NgcUtility.dateDifference(element.outboundFlight.etd, element.outboundFlight.std) / 1000 / 60;
                if (element.outboundFlight.dayDiff > this.depatureDiffParam &&
                  NgcUtility.getDateAsString(element.outboundFlight.etd) != NgcUtility.getDateAsString(element.outboundFlight.std)) {
                  element.outboundFlight.etdDisplay = NgcUtility.getTimeAsString(element.outboundFlight.etd) + '/' + NgcUtility.getDateAsString(element.outboundFlight.etd);
                } else {
                  element.outboundFlight.etdDisplay = NgcUtility.getTimeAsString(element.outboundFlight.etd);
                }
              }

            });

            this.isTableFlg = true;
            //this.searchForm.controls["valShipmentMonitoring"].patchValue(this.arrayUser);
            this.searchForm.get(['valShipmentMonitoring']).patchValue(this.arrayUser);
          } else {
            this.isTableFlg = false;
            this.resetFormMessages();
            this.searchForm.reset();

          }
        }
      }
        , error => {
          this.showErrorStatus(error);
          this.isTableFlg = false;
          this.searchForm.reset();

        });
    }
  }
  /**
     * Cells Style Renderer
     *
     * @param value Value
     * @param rowData Row Data
     * @param level Level
     */
  public outboundCellsStyleRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    const resultList: NgcFormArray = <NgcFormArray>this.searchForm.get(
      "valShipmentMonitoring"
    );

    if (resultList && resultList.length > 0) {
      const formControl: NgcFormControl = <NgcFormControl>resultList.get([
        row,
        "outboundFlight",
        column
      ]);
      let value: string = "";
      //
      switch (column) {
        case "flightOriginDate":
          value = NgcUtility.getDateAsString(
            formControl ? formControl.value : null
          );
          break;
        default:
          value = formControl ? formControl.value : "";
          break;
      }
      cellsStyle.data = value;
    } else {
      cellsStyle.data = value;
    }
    return cellsStyle;
  };

  public inboundCellsStyleRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    const resultList: NgcFormArray = <NgcFormArray>this.searchForm.get(
      "valShipmentMonitoring"
    );

    if (resultList && resultList.length > 0) {
      const formControl: NgcFormControl = <NgcFormControl>resultList.get([
        row,
        "incomingFlights",
        column
      ]);
      let value: string = "";
      //
      switch (column) {
        case "incflightOriginDate":
          value = NgcUtility.getDateAsString(
            formControl ? formControl.value : null
          );
          break;
        default:
          value = formControl ? formControl.value : "";
          break;
      }
      cellsStyle.data = value;
    } else {
      cellsStyle.data = value;
    }
    return cellsStyle;
  };

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
}
