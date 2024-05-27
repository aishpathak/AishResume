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
  CellsRendererStyle,
  PageConfiguration,
  NgcReportComponent,
  DateTimeKey
} from "ngc-framework";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { BuildupService } from './../buildup.service';
import { SearchMyFlightList, FlightListResponse, FlightListModel } from './../buildup.sharedmodel';
import { IfStmt } from "@angular/compiler";

@Component({
  selector: 'app-my-flight',
  templateUrl: './my-flight.component.html',
  styleUrls: ['./my-flight.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  // autoBackNavigation: true
})
export class MyFlightComponent extends NgcPage {
  transferData: any;
  response: any;
  displaydata: boolean;
  arr: any;
  temp: any;
  @ViewChild('osi') osi: NgcWindowComponent;
  resp: any;
  osii: any;
  reportParameters: any;
  @ViewChild("report") report: NgcReportComponent;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private buildupService: BuildupService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }
  private Form: NgcFormGroup = new NgcFormGroup({
    terminalPoint: new NgcFormControl(),
    value: new NgcFormControl(),
    dateFrom: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy HH'), 'ddMMMyy HH')),
    flight: new NgcFormControl(),
    userName: new NgcFormControl(),
    userId: new NgcFormControl(),
    flightList: new NgcFormArray([]),
  })
  ngOnInit() {
    let terminalId = this.getUserProfile().terminalId;
    this.Form.get('terminalPoint').setValue(terminalId);
    this.transferData = this.getNavigateData(this.activatedRoute);
    console.log("transferData", this.transferData);
    if (this.transferData) {
      this.Form.get('terminalPoint').setValue(this.transferData.terminalPoint);
      this.Form.get('dateFrom').setValue(this.transferData.dateFrom);
      this.Form.get('userId').setValue(this.transferData.userId);
      this.Form.get('value').setValue(this.transferData.value);
      this.Form.get('flight').setValue(this.transferData.flight);
      this.onSearch();
    }
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
      this.temp.searchData = this.Form.getRawValue();
      this.temp.fromMyFlight = true;
      if (this.transferData && this.transferData.flightListData) {
        this.temp.flightListData = this.transferData.flightListData;
      }

      this.navigateTo(this.router, 'export/buildup/ulddetails', this.temp);
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
  onSearch() {
    const request: SearchMyFlightList = new SearchMyFlightList();

    request.dateFrom = this.Form.get('dateFrom').value;
    request.value = this.Form.get('value').value;
    request.terminalPoint = this.Form.get('terminalPoint').value;
    request.flight = this.Form.get('flight').value;
    request.userId = this.getUserProfile().userLoginCode;
    this.buildupService.searchMyFlight(request).subscribe(data => {
      console.log("Response", this.response);
      this.response = data.data;
      this.displaydata = false;
      this.showResponseErrorMessages(data);
      if (data.data) {
        this.displaydata = true;
        // this.response.flightList.forEach(element => {
        //   if (element.dls) {
        //     element.dls = "Y";
        //   }
        //   else {
        //     element.dls = " ";
        //   }
        // });
        this.Form.get(['flightList']).patchValue(this.response.flightList);
      }

    })

  }
  closeWindow() {
    this.osi.close();
  }

  onDelete() {
    this.arr = this.Form.getRawValue().flightList;
    this.temp = this.arr.filter(temp => temp.select);
    if (this.temp.length == 0) {
      this.showErrorMessage('export.select.a.record');
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
      //   element.sta = null;
      //   element.date = null;
      //   element.atd = null;
      //   element.etd = null;
      //   element.routing=null;
      // });

      req.flightList = this.temp;
      console.log("deleteRequest", req);
      this.buildupService.onDelete(req).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus("g.completed.successfully");
          this.onSearch();
        }
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
  public atdDateCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.showDateFlag === 'false') {
      cellsStyle.data = NgcUtility.getTimeAsString(NgcUtility.getDateTime(rowData.atd));
    }
    else {
      cellsStyle.data = NgcUtility.getDateTimeAsString(rowData.atd);
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
    if (rowData.showDateFlag === 'false') {
      cellsStyle.data = NgcUtility.getTimeAsString(NgcUtility.getDateTime(rowData.etd));
    }
    else {
      cellsStyle.data = NgcUtility.getDateTimeAsString(rowData.etd);
    }
    //
    return cellsStyle;
  };
  onPrint() {
    this.reportParameters = new Object();
    this.reportParameters.fromDate = this.Form.get('dateFrom').value;
    this.reportParameters.toDate = NgcUtility.addDate(this.Form.get('dateFrom').value, this.Form.get('value').value, DateTimeKey.HOURS)
    this.reportParameters.terminalCode = this.Form.get('terminalPoint').value;
    this.reportParameters.printBy = this.getUserProfile().userShortName;
    this.reportParameters.staffId = this.getUserProfile().userLoginCode;
    if (this.reportParameters.flightKey) {
      this.reportParameters.flightKey = this.Form.get('flight').value;
    }
    else {
      this.reportParameters.flightKey = null;
    }
    this.report.open();
  }
  onCancel() {
    if (this.transferData.flightListData) {
      this.navigateTo(this.router, 'export/buildup/flightlist', this.transferData.flightListData);
    }
    else {
      this.navigateTo(this.router, '**', {});
    }
  }
}
