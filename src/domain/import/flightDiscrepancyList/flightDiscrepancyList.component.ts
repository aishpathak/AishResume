import { OnInit } from "@angular/core";
import {
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
import { Directive, ChangeDetectionStrategy, Component } from "@angular/core";


import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  NgcWindowComponent,
  NgcUtility,
  NgcTabsComponent,
  PageConfiguration,
  CellsRendererStyle,
  NgcFormControl,
  NgcReportComponent
} from "ngc-framework";
import { CellsStyleClass } from "./../../../shared/shared.data";
import { ImportService } from "../import.service";
import {
  FlightDiscrepancyListModel,
  FlightDiscrepancyListRequest
} from "../import.sharedmodel";
import { ApplicationFeatures } from "../../common/applicationfeatures";
import { date } from "../../awbManagement/awbManagement.shared";
@Component({
  selector: "app-flightDiscrepancyList",
  templateUrl: "./flightDiscrepancyList.component.html",
  styleUrls: ["./flightDiscrepancyList.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  focusToBlank: true,
  focusToMandatory: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  //restorePageOnBack: true
})
export class FlightDiscrepancyListComponent extends NgcPage {
  displayData: boolean;
  response: any;
  errors: any;
  flightId: any;
  move: any[];
  eventFlag: boolean = false;
  displayBySegmentData: boolean = false;
  segmentInformation: any[] = [];
  sourceIdSegmentDropdown: any;
  flightDiscrepancyList: any[] = [];
  flightDiscrepancyListbySegment: any[] = [];
  movewithShipmentDetails: boolean = false;
  completed: boolean;
  flightcomplete: boolean;
  reportParameters: any;
  enablediscrepancy: any = false;
  enable: any = true;
  @ViewChild('showPopUpWindow') maintainHouse: NgcWindowComponent;
  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;
  dataToMove: {};
  flightSegmentId: any;
  flightSegmentIdForReport: any = null;
  flightChange: any;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }


  ngOnInit() {
    super.ngOnInit();

    this.displayData = false;
    let forwardedData = this.getNavigateData(this.activatedRoute);

    // checking if the fetched data is not null
    if (forwardedData != null) {
      if (forwardedData.flight != null) {
        this.flightDiscrepancyListForm.get("flightKey").setValue(forwardedData.flight);
        this.flightDiscrepancyListForm.get("flightOriginDate").setValue(forwardedData.flightDate);
        this.flightDiscrepancyListForm.get("flightCompletedAt").patchValue("F");
        this.onSearchDiscrepancyList();
      } else {
        this.flightDiscrepancyListForm.get("flightKey").patchValue(null);
        this.flightDiscrepancyListForm.get("flightOriginDate").patchValue(null);
      }
    }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.displayData = false;
  }

  public groupsRenderer = (value: any, rowData: any, level: any): string => {
    console.log(rowData);
    console.log(value);
    console.log(level);
    return '&nbsp;&nbsp;<strong> ' + value + '</strong>';
  }

  private flightDiscrepancyListForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl("", [Validators.maxLength(8)]),
    flightOriginDate: new NgcFormControl(new Date()),
    flightCompletedAt: new NgcFormControl(),
    flightDiscrepncyListSentBy: new NgcFormControl(),
    flightDiscrepncyListSentAt: new NgcFormControl(),
    flightId: new NgcFormControl(),
    segment: new NgcFormControl(),
    flightDiscrepancyListbySegment: new NgcFormArray(
      [
      ]
    ),
    MaintainHouseList: new NgcFormArray([]),
    hawbNo: new NgcFormControl(),
    flightDiscrepancyList: new NgcFormArray([
      new NgcFormGroup({
        flightSegmentId: new NgcFormControl(),
        boardingPoint: new NgcFormControl(),
        select: new NgcFormControl(),
        segmentId: new NgcFormControl(),
        status: new NgcFormControl(),
        shipmentId: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        shipmentDate: new NgcFormArray([]),
        flightId: new NgcFormControl(),
        manifestPieces: new NgcFormControl(),
        manifestWeight: new NgcFormControl(),
        awbPieces: new NgcFormControl(),
        awbWeight: new NgcFormControl(),
        breakDownPieces: new NgcFormControl(),
        breakDownWeight: new NgcFormControl(),
        shcs: new NgcFormControl(),
        irregularity: new NgcFormControl(),
        irregularityTypeDescription: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        segment: new NgcFormControl(),
        shipmentType: new NgcFormControl(),
        sno: new NgcFormControl(),
        action: new NgcFormControl(),
        house: new NgcFormControl(),
        hawbNo: new NgcFormControl(),
        awbPcsWt: new NgcFormControl(),
        manifestPcsWt: new NgcFormControl(),
        breakDownPcsWt: new NgcFormControl(),
        uldnumber: new NgcFormControl()


      })
    ])
  });

  onSearchDiscrepancyList() {
    this.displayData = false;
    this.flightSegmentIdForReport = null;
    this.displayBySegmentData = false;
    if (this.flightDiscrepancyListForm.invalid) {
      this.flightDiscrepancyListForm.validate();
      this.showErrorMessage("enter.flight.details");
      return;
    }
    this.flightDiscrepancyListForm.get('segment').patchValue([]);
    const request: FlightDiscrepancyListRequest = new FlightDiscrepancyListRequest();
    const dataForm = this.flightDiscrepancyListForm;
    if (this.eventFlag === true) {
      request.sendEvent = true;
      request.flightId = this.flightDiscrepancyListForm.get("flightId").value;
    } else {
      request.sendEvent = false;
    }
    request.flightKey = this.flightDiscrepancyListForm.get("flightKey").value;
    request.flightOriginDate = this.flightDiscrepancyListForm.get("flightOriginDate").value;
    this.sourceIdSegmentDropdown = this.createSourceParameter(
      request.flightKey,
      request.flightOriginDate
    );
    this.resetFormMessages();
    this.importService.getFlightDiscrepancyList(request).subscribe(
      (data: any) => {
        if (!this.showResponseErrorMessages(data)) {
          this.flightId = data.data.flightId;
          this.displayData = true;
          //Patch the data to form
          data.data.flightDiscrepancyList.forEach(obj => {
            obj.awbPcsWt = (obj.awbPieces == null ? "0" : obj.awbPieces) + "/" + (obj.awbWeight == null ? "0.0" : obj.awbWeight);
            obj.breakDownPcsWt = (obj.breakDownPieces == null ? "0" : obj.breakDownPieces) + "/" + (obj.breakDownWeight == null ? "0.0" : obj.breakDownWeight);
            obj.manifestPcsWt = (obj.manifestPieces == null ? "0" : obj.manifestPieces) + "/" + (obj.manifestWeight == null ? "0.0" : obj.manifestWeight);
          })
          this.response = data.data;
          this.flightDiscrepancyListForm.patchValue(this.response);
          if (this.response.status > 0) {
            this.flightDiscrepancyListForm.get("status").patchValue("New irregularities FDL not sent");
          } else {
            this.flightDiscrepancyListForm.get("status").patchValue("");
          }
          if (this.flightDiscrepancyListForm.get("flightCompletedAt").value === true) {
            this.enablediscrepancy = true;
            this.flightDiscrepancyListForm.get("flightCompletedAt").patchValue("Y");
            this.completed = true;
          } else if (this.flightDiscrepancyListForm.get("flightCompletedAt").value === false) {
            this.flightDiscrepancyListForm.get("flightCompletedAt").patchValue("N");
            this.completed = false;
          }

        }
      },
      error => this.showErrorStatus("imp.err110")
    );
  }

  onSegmentChange(event) {
    this.flightSegmentIdForReport = event;
    this.displayBySegmentData = true;
    this.flightDiscrepancyListbySegment = [];
    this.flightDiscrepancyListForm.get('flightDiscrepancyListbySegment').patchValue([]);
    this.flightDiscrepancyList = (<NgcFormArray>this.flightDiscrepancyListForm.get('flightDiscrepancyList')).getRawValue();
    if (event != null && event != '') {
      for (let item of this.flightDiscrepancyList) {
        let segementId = item['flightSegmentId'] + "";
        // item.segOrign = item.segOrign + "   [ " + segment + " ]";
        if (segementId === event) {
          this.flightDiscrepancyListbySegment.push(item);
        }
      }
    } else {
      this.flightDiscrepancyListbySegment = [];
      this.displayBySegmentData = false;
      this.flightDiscrepancyListForm.get('flightDiscrepancyListbySegment').patchValue([]);
    }
    this.flightDiscrepancyListForm.get('flightDiscrepancyListbySegment').patchValue(this.flightDiscrepancyListbySegment);

  }

  onSendAdviceDiscrepancy() {
    this.eventFlag = true;
    const request: FlightDiscrepancyListRequest = new FlightDiscrepancyListRequest();
    request.flightId = this.flightDiscrepancyListForm.get("flightId").value;
    this.importService.getFDLMessageDefination(request).subscribe(definationData => {
      console.log(definationData);
      if (definationData.length <= 0) {
        this.showErrorMessage("no.message.setup.done");
        return;
      } else {
        this.onSearchDiscrepancyList();
        this.eventFlag = false;
        this.showSuccessStatus("advice.discrepancy.sent");
      }
    });

  }

  public onLinkClick(event: any) {

    console.log(event);

    if (event.type === 'link') {

      this.maintainHouse.open();
      this.onSearchMaintainHouse(event.record.shipmentIrregularityIds);

    }
  }

  public onClose(event: any) {
    console.log(event);

    this.maintainHouse.close();

  }

  onSearchMaintainHouse(shipmentIrregularityIds) {


    let request: any = {};
    const rawData = this.flightDiscrepancyListForm.getRawValue();
    request.shipmentIrregularityId = shipmentIrregularityIds;//this.flightDiscrepancyListForm.get("shipmentIrregularityIds").value[0];
    // this.importService.getmaintaincehouse(request).subscribe(
    //   data => {


    //     if (!this.showResponseErrorMessages(data)) {
    //       this.response = data.data;
    //       this.displayData = true;
    //       this.flightDiscrepancyListForm.get("MaintainHouseList").patchValue(data.data);
    //       console.log(this.flightDiscrepancyListForm.get("MaintainHouseList"));

    //     }
    //   });




  }

  filterHawbListdate() {

    let searchHawb = this.flightDiscrepancyListForm.get("hawbNo").value;

    if (searchHawb != undefined && searchHawb != "") {

      let filterdate = [];

      this.response.forEach(element => {

        if (element.houseNumber === searchHawb) {

          filterdate.push(element);

        }

      });

      this.flightDiscrepancyListForm.get("MaintainHouseList").patchValue(filterdate);

    } else {

      this.flightDiscrepancyListForm.get("MaintainHouseList").patchValue(this.response);

    }

  }


  //for Serial Number
  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  bindData(flightDiscrepancySegmentList: Array<any>) {
    this.segmentInformation = [];
    for (let segment of flightDiscrepancySegmentList) {
      if (
        segment.flightDiscrepancyList === null ||
        segment.flightDiscrepancyList.length === 0
      ) {
        let newShipment = {};
        newShipment["boardingPoint"] = segment["boardingPoint"];
        newShipment["select"] = false;
        newShipment["segmentId"] = null;
        newShipment["segment"] = null;
        newShipment["shipmentId"] = null;
        newShipment["shipmentNumber"] = null;
        newShipment["shipmentDate"] = null;
        newShipment["origin"] = null;
        newShipment["destination"] = null;
        newShipment["manifestPieces"] = " ";
        newShipment["manifestWeight"] = " ";
        newShipment["awbPieces"] = " ";
        newShipment["awbWeight"] = " ";
        newShipment["breakDownPieces"] = " ";
        newShipment["breakDownWeight"] = " ";
        newShipment["irregularity"] = null;
        newShipment["irregularityTypeDescription"] = null;
        newShipment["flightId"] = null;
        newShipment["shipmentType"] = null;
        newShipment["sno"] = "";
        newShipment["shcs"] = null;
        this.segmentInformation.push(newShipment);
      }
      for (let uld of segment.flightDiscrepancyList) {
        this.flightDiscrepancyListForm.get("flightId").patchValue(uld.flightId);
        let newShipment = Object.assign({}, uld);
        newShipment["boardingPoint"] = segment["boardingPoint"];
        this.segmentInformation.push(newShipment);
      }
    }
    let awbnumber: string;
    this.segmentInformation.forEach(element => {
      if (awbnumber == element.shipmentNumber) {
        element.manifestPieces = null;
        element.manifestWeight = null;
        element.awbPieces = null;
        element.awbWeight = null;
        element.breakDownPieces = null;
        element.breakDownWeight = null;
        awbnumber = element.shipmentNumber;
        element.shipmentNumber = null;
        element.select = null;
        element.origin = null;
        element.destination = null;
      } else {
        awbnumber = element.shipmentNumber;
      }
    });
    //console.log(this.segmentInformation);
    (<NgcFormArray>(this.flightDiscrepancyListForm.get("flightDiscrepancyList"))).patchValue(this.segmentInformation);
    //console.log(this.flightDiscrepancyListForm);
  }

  onIrregularity() {
    {
      this.move = new Array();
      let shipmentNumber;
      let formArray: NgcFormArray = this.flightDiscrepancyListForm.get(
        "flightDiscrepancyList"
      ) as NgcFormArray;
      formArray.controls.forEach((formGroup: NgcFormGroup) => {
        let selectItem: NgcFormControl = formGroup.get(
          "select"
        ) as NgcFormControl;
        if (selectItem && selectItem.value === true) {
          this.move.push(formGroup.get("shipmentNumber").value);
          this.move.push(formGroup.get("shipmentType").value);
          shipmentNumber = formGroup.get("shipmentNumber").value;
          this.dataToMove = {
            shipmentNumber: formGroup.get("shipmentNumber").value,
            shipmentType: formGroup.get("shipmentType").value,
          }
        }
      });

      if (this.move.length === 2) {
        this.navigateTo(this.router, "/awbmgmt/irregularity", this.dataToMove);
      } else if (this.move.length === 0) {
        this.showErrorStatus("imp.err111");
      } else {
        this.showErrorStatus("imp.err112");
      }
    }
  }

  /**
   * Cells Style Renderer
   *
   * @param value Value
   * @param rowData Row Data
   * @param level Level
   */
  public cellsStyleRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    //console.log(rowData);
    if (!value || value === " ") {
      cellsStyle.data = "NIL";
    } else {
      cellsStyle.data = value;
    }
    //
    return cellsStyle;
  };

  onClear() {
    this.flightDiscrepancyListForm.reset();
    this.flightDiscrepancyListForm.controls["flightKey"].patchValue("");
    this.displayData = false;
    this.flightDiscrepancyListForm.controls["flightKey"].setValue(new Date());
  }

  onCaptureDseign() {
    let forward = { flight: null, flightDate: null, entityType: null, entityKey: null };
    let shipmentNo;
    let array = this.flightDiscrepancyListForm.getRawValue();
    let count = 0;
    console.log(array.flightDiscrepancyList);
    array.flightDiscrepancyList.forEach(element => {
      if (element.select == true && count <= 1) {
        shipmentNo = element.shipmentNumber;
        count++;
      }
    });

    let flight = this.flightDiscrepancyListForm.get("flightKey").value;
    let flightDate = this.flightDiscrepancyListForm.get("flightOriginDate")
      .value;
    forward["flight"] = flight;
    forward["flightDate"] = flightDate;
    forward["entityKey"] = shipmentNo;
    forward["entityType"] = 'AWB';
    if (count == 1) {
      this.navigate("common/capturedamageDesktop", forward);
    } else if (count > 1) {
      this.showErrorMessage("only.one.shipment");
      return;
    } else if (count == 0) {
      this.showInfoStatus("import.info103");
    }
  }
  onCreateDamageReport() {
    let forward = { flight: null, flightDate: null, };

    let flight = this.flightDiscrepancyListForm.get("flightKey").value;
    let flightDate = this.flightDiscrepancyListForm.get("flightOriginDate")
      .value;

    forward["flight"] = flight;
    forward["flightDate"] = flightDate;
    this.navigate("import/createdamagereport", forward);
  }
  onPrint() {
    const reportParameters: any = {};
    /* this.flightChange = reportParameters.flightId;
     if (this.flightChange != this.response.flightId && this.flightChange != null) {
       this.flightSegmentIdForReport = null;
     }*/

    reportParameters.tenantCurrentDateTime = NgcUtility.getDateTimeOnly(new Date());
    reportParameters.flightId = this.flightId;
    reportParameters.offPoint = NgcUtility.getTenantConfiguration().airportCode;
    reportParameters.userId = this.getUserProfile().userLoginCode;
    reportParameters.HAWBhandlingFlag = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling);
    reportParameters.flightSegmentId = parseInt(this.flightSegmentIdForReport);
    console.log(reportParameters.flightSegmentId);
    this.reportParameters = reportParameters;


    this.reportWindow.open();

  }



  public cellsStyleRendererColorProcessed = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.fdlSentFlag === 0 || rowData.fdlSentFlag === '0') {
      cellsStyle.className = CellsStyleClass.CRITICALFONT_RED;
    }
    return cellsStyle;
  };
}
