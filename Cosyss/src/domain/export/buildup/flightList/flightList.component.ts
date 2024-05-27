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
  ViewChild,

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
  DateTimeKey,
  CellsRendererStyle,
  NgcReportComponent
} from "ngc-framework";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { BuildupService } from './../buildup.service';
import { SearchFlightList, FlightListResponse, FlightListModel, SearchMyFlightList } from './../buildup.sharedmodel';
import { EquipmentReleaseInfo } from "../../../equipment/equipmentsharedmodel";
@Component({
  selector: 'app-flightList',
  templateUrl: './flightList.component.html',
  styleUrls: ['./flightList.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class FlightListComponent extends NgcPage {
  requestDataForFlightlist: any;
  response: any;
  arr: any;
  reportParameters: any;
  temp: any;
  request: () => any;
  displaydata: boolean = false;
  resp: any;
  flag: boolean = false;
  @ViewChild('osi') osi: NgcWindowComponent;
  date: Date;
  dateFrom: Date;
  @ViewChild("report") report: NgcReportComponent;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private buildupService: BuildupService,
    private router: Router, private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private Form: NgcFormGroup = new NgcFormGroup({
    terminalPoint: new NgcFormControl(),
    dateFrom: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy HH'), 'ddMMMyy HH')),
    dateTo: new NgcFormControl(NgcUtility.addDate(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy HH'), 'ddMMMyy HH'), 8, DateTimeKey.HOURS)),
    userName: new NgcFormControl(),
    userId: new NgcFormControl(),
    flightList: new NgcFormArray([]),
    osi: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    carrierGroup: new NgcFormControl(),
    offPoint: new NgcFormControl(),
    flightType: new NgcFormControl()
  })
  osii: any;
  carrierGroupCodeParam: any;
  carrierFlg = false;
  ngOnInit() {
    let terminalId = this.getUserProfile().terminalId;
    this.Form.get('terminalPoint').setValue(terminalId);
    //getting navigated data
    let transferrdData = this.getNavigateData(this.activatedRoute);
    if (transferrdData != null) {
      if (transferrdData.flightListData) {
        this.Form.patchValue(transferrdData.flightListData);
      } else {

        this.Form.get('dateFrom').setValue(transferrdData.dateFrom);
        this.Form.get('dateTo').setValue(transferrdData.dateTo);
        this.Form.get('terminalPoint').setValue(transferrdData.terminalPoint);
      }
      this.onSearch();
    }
    // this.date = new DateTimeKey();
    // this.dateFrom = NgcUtility.getDateTime(this.date);
  }
  getCarrierCodeByCarrierGroup(event) {
    this.carrierFlg = false;
    if (event.desc != undefined) {
      this.carrierGroupCodeParam = this.createSourceParameter(this.Form.get('carrierGroup').value);
      this.carrierFlg = true;
    }

  }
  onSearch() {
    if (this.Form.get('terminalPoint').value == null || this.Form.get('dateFrom').value == null || this.Form.get('dateTo').value == null) {
      this.showErrorMessage("export.enter.all.mandatory.details");
      return;
    }
    const request: SearchFlightList = new SearchFlightList()
    const fromDate = this.Form.get('dateFrom').value;
    const toDate = this.Form.get('dateTo').value;
    request.dateFrom = this.Form.get('dateFrom').value;
    request.dateTo = this.Form.get('dateTo').value;
    request.terminalPoint = this.Form.get('terminalPoint').value;
    request.carrierGroup = this.Form.get('carrierGroup').value;
    request.carrierCode = this.Form.get('carrierCode').value;
    request.flightKey = this.Form.get('flightKey').value;
    request.offPoint = this.Form.get('offPoint').value;
    request.flightType = this.Form.get('flightType').value;

    this.requestDataForFlightlist = request;
    const dateDiffence = toDate - fromDate;
    if ((dateDiffence / (1000 * 3600 * 24)) > 3) {
      this.showErrorMessage('export.date.range.cannot.more.than.3.days');
      return;
    }
    this.buildupService.searchFlightList(request).subscribe(data => {
      console.log("response", data.data);
      this.resetFormMessages();
      this.response = data.data;
      this.showResponseErrorMessages(data);
      this.displaydata = false;
      console.log(this.response.flightList.length);
      if (this.response.flightList.length > 0) {
        this.displaydata = true;
        this.response.flightList.forEach(element => {
          // if (element.dls) {
          //   element.dls = "Y";
          // }
          // else {
          //   element.dls = " ";
          // }
        });
      } else {
        this.showErrorStatus('NO_RECORDS_EXIST');
      }
      if (this.response.flightList.length > 0) {

        this.Form.get(['flightList']).patchValue(this.response.flightList);
      }

    })

  }
  checkCode(item, index, sindex) {


    this.Form.get('userId').patchValue(item.desc);

  }

  onULD() {
    this.arr = this.Form.getRawValue().flightList;
    this.temp = this.arr.filter(temp => temp.select);
    if (this.temp.length == 0) {
      this.showErrorMessage('export.select.a.record');
    }
    else if (this.temp.length > 1) {
      this.showErrorMessage('export.select.1.record');
    }
    else {
      this.buildupService.requestUld = this.temp;
      console.log("Flight", this.requestDataForFlightlist);
      this.navigateTo(this.router, 'export/buildup/ulddetails', this.requestDataForFlightlist);
    }

  }
  onOsi() {

    this.arr = this.Form.getRawValue().flightList;
    this.temp = this.arr.filter(temp => temp.select);
    if (this.temp.length == 0) {
      this.showErrorMessage('export.select.a.record');
    }
    else if (this.temp.length > 1) {
      this.showErrorMessage('export.select.1.record');
    }
    else {
      const req: FlightListModel = new FlightListModel();
      // this.temp.forEach(element => {
      //   if (element.dls == "Y") {
      //     element.dls = true;
      //   }
      //   else {
      //     element.dls = false;
      //   }
      // });
      req.flightList = this.temp;

      this.buildupService.searchOsi(req).subscribe(data => {
        this.showResponseErrorMessages(data);
        if (data.data) {
          this.resp = data.data;
          this.resp.flightList.forEach(element => {
            if (element.osi == null) {
              this.showInfoStatus("export.no.osi.found");
            }
            else {
              this.osii = element.osi;
              this.osi.open();
              // console.log(element.osi[0]);
            }
          });

          // this.onSearch();
        }
      })

    }
  }
  onSave() {
    this.arr = this.Form.getRawValue().flightList;
    this.temp = this.arr.filter(temp => temp.select);
    const user = this.Form.get('userName').value;

    

    if (this.temp.length == 0) {
      this.showErrorMessage('export.select.a.record');
    }
    else {
      const request1: FlightListModel = new FlightListModel();
      request1.flightList = this.temp;
      request1.userId = this.getUserProfile().userLoginCode;
      // this.temp.forEach(element => {
      //   if (element.dls == "Y") {
      //     element.dls = true;
      //   }
      //   else {
      //     element.dls = false;
      //   }
      // });
      this.buildupService.saveFlightList(request1).subscribe(data => {
        this.showResponseErrorMessages(data);
        if (data.data) {
          this.showSuccessStatus("export.flight.saved.successfully");
          //this.onSearch();
          const request: SearchMyFlightList = new SearchMyFlightList();
          request.dateFrom = this.Form.get('dateFrom').value;
          request.value = '23';
          request.terminalPoint = this.Form.get('terminalPoint').value;
          request.flightListData = this.Form.getRawValue();

          request.userId = this.getUserProfile().userLoginCode;
          this.navigate('export/buildup/myflight', request);
        }
      })
    }
  }
  public openWindow() {

    this.osi.close();

  }

  /**
   * Cells Style Renderer
   *
   * @param value Value
   * @param rowData Row Data
   * @param level Level
   */
  public atdDateCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.showDateFlag == "false") {
      if (rowData.atd != null) {
        cellsStyle.data = NgcUtility.getTimeAsString(NgcUtility.getDateTime(rowData.atd));
      }
    }
    else {
      if (rowData.atd != null) {
        cellsStyle.data = NgcUtility.getDateTimeAsString(rowData.atd);
      }

    }
    //
    return cellsStyle;
  };
  /**
     * Cells Style Renderer
     *
     * @param value Value
     * @param rowData Row Data
     * @param level Level
     */
  public etdDateCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.showDateFlag == "false") {
      if (rowData.etd != null) {
        cellsStyle.data = NgcUtility.getTimeAsString(NgcUtility.getDateTime(rowData.etd))
      }
    }
    else {
      if (rowData.etd != null) {
        cellsStyle.data = NgcUtility.getDateTimeAsString(rowData.etd);
      }
    }

    return cellsStyle;
  };
  onPrint() {
    this.reportParameters = new Object();
    if (this.Form.get('dateFrom').value) {
      this.reportParameters.fromDate = this.Form.get('dateFrom').value;
    }
    else {
      this.reportParameters.fromDate = null;
    }
    if (this.Form.get('dateTo').value) {
      this.reportParameters.toDate = this.Form.get('dateTo').value;
    }
    else {
      this.reportParameters.toDate = null;
    }
    if (this.Form.get('terminalPoint').value) {
      this.reportParameters.terminalCode = this.Form.get('terminalPoint').value;
    } else {
      this.reportParameters.terminalCode = null;
    }
    if (this.Form.get('offPoint').value) {
      this.reportParameters.flightOffPoint = this.Form.get('offPoint').value;
    }
    else {
      this.reportParameters.flightOffPoint = null;
    }
    if (this.Form.get('carrierCode').value) {
      this.reportParameters.carrierCode = this.Form.get('carrierCode').value;
    }
    else {
      this.reportParameters.carrierCode = null;
    }
    this.reportParameters.printedBy = this.getUserProfile().userShortName;
    if (this.Form.get('flightType').value) {
      this.reportParameters.flightType = this.Form.get('flightType').value;
    }
    else {
      this.reportParameters.flightType = null;
    }
    if (this.Form.get('carrierGroup').value) {
      this.reportParameters.CarrierGroupId = this.Form.get('carrierGroup').value;
    }
    else {
      this.reportParameters.CarrierGroupId = null;
    }
    if (this.Form.get('flightKey').value) {
      this.reportParameters.flightNumber = this.Form.get('flightKey').value;
    }
    else {
      this.reportParameters.flightNumber = null;
    }
    this.report.open();
  }

}
