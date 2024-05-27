import { ApplicationFeatures } from './../../../common/applicationfeatures';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Component, NgZone, ElementRef, ViewContainerRef, OnInit,
  ViewChild, ViewChildren, QueryList, TemplateRef
} from '@angular/core';
import { NgcFormControl } from 'ngc-framework';
import {
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  NgcTabsComponent,
  CellsRendererStyle,
  NgcPage, NgcFormGroup, NgcWindowComponent, NgcFormArray
  , NgcDropDownComponent, NgcUtility, NgcButtonComponent, NgcDataTableComponent, PageConfiguration, DateTimeKey, NgcReportComponent
} from 'ngc-framework';
import { SpecialShipmentRequest, SpecialShipmentFlight } from './../buildup.sharedmodel'
import { BuildupService } from './../buildup.service';
import { ApplicationEntities } from '../../../common/applicationentities';
@Component({
  selector: 'app-special-shipment',
  templateUrl: './special-shipment.component.html',
  styleUrls: ['./special-shipment.component.css']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class SpecialShipmentComponent extends NgcPage {

  private response: any;
  reportParameters: any = new Object();
  private shipmentShcArray: any = [];
  date: any;
  dateFrom: any;
  dateto: any;
  templateRef: TemplateRef<any>;
  isClosePopupScreen: boolean = true;
  title: string;
  popUpWidth: Number;
  popUpHeight: Number;

  private searchFlag: boolean = false;
  private specialShipmentSearchFormGroup: NgcFormGroup = new NgcFormGroup({
    terminalPoint: new NgcFormControl(),
    from: new NgcFormControl(),
    to: new NgcFormControl(),
    carrier: new NgcFormControl(),
    carrierGroup: new NgcFormControl(),
    shipmentType: new NgcFormControl(),
    flight: new NgcFormControl(),
    segment: new NgcFormControl(),
    excludeShc: new NgcFormControl(),
    shc: new NgcFormControl(),
    shcGroup: new NgcFormControl(),
    departed: new NgcFormControl(),
    transferType: new NgcFormControl(),
    domIntl: new NgcFormControl(),
    shipment: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        type: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        awbWeight: new NgcFormControl(),
        awbPieces: new NgcFormControl(),
        segment: new NgcFormControl(),
        natureOfGoodsDescription: new NgcFormControl(),
        readyToLoad: new NgcFormControl(),
        transferType: new NgcFormControl(),
        dwellTime: new NgcFormControl(),
        rfid: new NgcFormControl(),
        incomingSegment: new NgcFormControl(),
        shipmentShc: new NgcFormControl(),
        partSuffix: new NgcFormControl(),
        incomming: new NgcFormArray([
          new NgcFormGroup({
            flight: new NgcFormControl(),
            sta: new NgcFormControl(),
            eta: new NgcFormControl(),
            ata: new NgcFormControl(),
            pieces: new NgcFormControl(),
            weight: new NgcFormControl(),
            incomingSegment: new NgcFormControl()
          })
        ]),
        outgoing: new NgcFormArray([
          new NgcFormGroup({
            outgoingFlight: new NgcFormControl(),
            std: new NgcFormControl(),
            etd: new NgcFormControl(),
            atd: new NgcFormControl(),
            outgoingPieces: new NgcFormControl(),
            outgoingWeight: new NgcFormControl(),
            outgoingSegment: new NgcFormControl()
          })
        ]),
      })
    ])
  });
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  @ViewChild("parentWindow") parentWindow: NgcWindowComponent;
  shipmentNumberData: any;
  @ViewChild('houseWayBillList') houseWayBillList: TemplateRef<any>;

  constructor(private buildUpService: BuildupService, appZone: NgZone,
    appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {

    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData) {
      this.specialShipmentSearchFormGroup.controls['from'].setValue(forwardedData.from);
      this.specialShipmentSearchFormGroup.controls['to'].setValue(forwardedData.to);
      this.specialShipmentSearchFormGroup.controls['flight'].setValue(forwardedData.flight);
      this.specialShipmentSearchFormGroup.controls['shipmentType'].setValue(forwardedData.shipmentType1);
      this.specialShipmentSearchFormGroup.controls['carrierGroup'].setValue(forwardedData.carrierGroup);
      this.specialShipmentSearchFormGroup.controls['carrier'].setValue(forwardedData.carrier);
      this.specialShipmentSearchFormGroup.controls['terminalPoint'].setValue(forwardedData.terminalPoint);
      this.specialShipmentSearchFormGroup.controls['shcGroup'].setValue(forwardedData.shcGroup);
      this.specialShipmentSearchFormGroup.controls['departed'].setValue(forwardedData.departed);
      this.specialShipmentSearchFormGroup.controls['carrierGroup'].setValue(forwardedData.carrierGroup);
      this.specialShipmentSearchFormGroup.controls['excludeShc'].setValue(forwardedData.excludeShc);
      this.specialShipmentSearchFormGroup.controls['segment'].setValue(forwardedData.segment);

      this.onSearch();
    } else {
      // Must Call
      super.ngOnInit();
      this.date = new Date();
      this.dateFrom = NgcUtility.getDateOnly(this.date);
      this.dateto = NgcUtility.addDate(new Date(), 1439, DateTimeKey.MINUTES);

      this.specialShipmentSearchFormGroup.get("from").patchValue(this.dateFrom);
      this.specialShipmentSearchFormGroup.get("to").patchValue(NgcUtility.addDate(this.dateFrom, 1439, DateTimeKey.MINUTES));
    }
  }

  onClear() {
    this.specialShipmentSearchFormGroup.reset();
    this.searchFlag = false;
  }


  onSearch() {
    this.searchFlag = false;
    if (this.specialShipmentSearchFormGroup.controls['flight'].value == '') {
      this.specialShipmentSearchFormGroup.controls['flight'].setValue(null);
    }
    if (this.specialShipmentSearchFormGroup.controls['shipmentType'].value == '') {
      this.specialShipmentSearchFormGroup.controls['shipmentType'].setValue(null);
    }
    if (this.specialShipmentSearchFormGroup.controls['carrierGroup'].value == '') {
      this.specialShipmentSearchFormGroup.controls['carrierGroup'].setValue(null);
    }
    if (this.specialShipmentSearchFormGroup.controls['carrier'].value == '') {
      this.specialShipmentSearchFormGroup.controls['carrier'].setValue(null);
    }
    if (this.specialShipmentSearchFormGroup.controls['terminalPoint'].value == '') {
      this.specialShipmentSearchFormGroup.controls['terminalPoint'].setValue(null);
    }
    if (this.specialShipmentSearchFormGroup.controls['shcGroup'].value == '') {
      this.specialShipmentSearchFormGroup.controls['shcGroup'].setValue(null);
    }
    if (this.specialShipmentSearchFormGroup.controls['departed'].value == '') {
      this.specialShipmentSearchFormGroup.controls['departed'].setValue(null);
    }

    let request = this.specialShipmentSearchFormGroup.getRawValue();
    this.buildUpService.searchSpecialShipment(request).subscribe(result => {
      this.refreshFormMessages(result);
      if (result.data !== null) {
        this.assignOutgoingIncomingData(result.data);
      }
      this.specialShipmentSearchFormGroup.get(['shipment']).patchValue(result.data);
      this.searchFlag = true;
    })
  }

  /* 
  * For assigning value coming in Group to Eachrow of the array
  * for incomming and outgoing
   */
  assignOutgoingIncomingData(request) {
    let index = 1;
    for (const eachRow of request) {
      eachRow.sno = index++;
      eachRow.readyToLoad = eachRow.readyToLoad === '1' ? 'Y' : ' ';
      eachRow.dwellTime = eachRow.dwellTime === '0' ? ' ' : eachRow.dwellTime;
      if (eachRow.outgoing && eachRow.outgoing.outgoingFlight) {
        eachRow.std = eachRow.outgoing.std + eachRow.outgoing.flightMode;
        eachRow.outgoingFlight = eachRow.outgoing.outgoingFlight;
        eachRow.outgoingPieces = eachRow.outgoing.outgoingPieces;
        eachRow.outgoingWeight = eachRow.outgoing.outgoingWeight;
        eachRow.outgoingSegment = eachRow.outgoing.outgoingSegment;
      }
      if (eachRow.outgoing && eachRow.outgoing.bookingStatusCode) {
        eachRow.bookingStatusCode = eachRow.outgoing.bookingStatusCode;
      }
      if (eachRow.incomming && eachRow.incomming.flight) {
        eachRow.sta = eachRow.incomming.sta + eachRow.incomming.flightMode;
        eachRow.flight = eachRow.incomming.flight;
        eachRow.pieces = eachRow.incomming.pieces;
        eachRow.weight = eachRow.incomming.weight;
        eachRow.incomingSegment = eachRow.incomming.incomingSegment;
      }
    }
  }

  public incomingCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    const cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    const rowId: string = rowData["NGC_ROW_ID"];
    const record: any = (this.specialShipmentSearchFormGroup.get(['shipment', rowId]) as NgcFormGroup).getRawValue();
    const rowValue: any = record['incomming'] ? record['incomming'][column] : null;
    //
    cellsStyle.data = rowValue ? rowValue : ' ';
    //
    return cellsStyle;
  };


  onPrint() {
    this.reportParameters.tenantID = NgcUtility.getTenantConfiguration().airportCode;
    this.reportParameters.terminalPoint = this.specialShipmentSearchFormGroup.get('terminalPoint').value;
    this.reportParameters.datefrom = this.specialShipmentSearchFormGroup.get("from").value;
    this.reportParameters.dateto = this.specialShipmentSearchFormGroup.get("to").value;
    this.reportParameters.carrierGroup = this.specialShipmentSearchFormGroup.controls['carrierGroup'].value;
    this.reportParameters.carrier = this.specialShipmentSearchFormGroup.controls['carrier'].value;
    this.reportParameters.flight = this.specialShipmentSearchFormGroup.get("flight").value;
    this.reportParameters.segment = this.specialShipmentSearchFormGroup.get("segment").value;
    this.reportParameters.domIntl = this.specialShipmentSearchFormGroup.get('domIntl').value;
    if (this.reportParameters.domIntl == 'All' || this.reportParameters.domIntl == '' || this.reportParameters.domIntl == null) {
      this.reportParameters.domIntl = 'All';
    }

    if (this.specialShipmentSearchFormGroup.get("shipmentType").value == 'ALL' || this.specialShipmentSearchFormGroup.get("shipmentType").value == '' || this.specialShipmentSearchFormGroup.get("shipmentType").value == null) {
      this.reportParameters.shipmentType = null;
    }
    if (this.specialShipmentSearchFormGroup.get("shipmentType").value != 'ALL' || this.specialShipmentSearchFormGroup.get("shipmentType").value != '' || this.specialShipmentSearchFormGroup.get("shipmentType").value != null) {
      let shipmentType = this.specialShipmentSearchFormGroup.get("shipmentType").value;
      if (shipmentType && shipmentType.length > 0) {
        this.reportParameters.shipmentType = shipmentType.join(',');
      }

    }
    if (this.specialShipmentSearchFormGroup.get("excludeShc").value != null) {
      this.reportParameters.excludeShc = this.specialShipmentSearchFormGroup.get("excludeShc").value.join(',');
    }
    if (this.specialShipmentSearchFormGroup.get("shc").value != null) {
      this.reportParameters.shc = this.specialShipmentSearchFormGroup.get("shc").value.join(',');
    }

    this.reportParameters.departed = this.specialShipmentSearchFormGroup.controls['departed'].value;
    let transferType = this.specialShipmentSearchFormGroup.get('transferType').value;
    if (transferType && transferType.length > 0) {
      this.reportParameters.transferType = transferType.join(',');
    }

    this.reportParameters.s = this.specialShipmentSearchFormGroup.get('shcGroup').value;

    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_PartSuffix)) {
      this.reportParameters.isPartSuffix = true;
    }
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
      this.reportParameters.isHAWBHandling = true;
    }
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_DomesticInternationalHandling)) {
      this.reportParameters.isDomIntHandling = true;
    }

    this.reportWindow.downloadReport();

  }

  openShipmentInfoPage(event) {
    let selectedRecord = [];
    let shipmentInfo = (<NgcFormArray>this.specialShipmentSearchFormGroup.controls['shipment']).getRawValue();

    shipmentInfo.forEach(record => {
      if (record['select'] === true) {
        selectedRecord.push(record);
      }
    });
    if (selectedRecord.length === 0) {
      this.showErrorStatus('export.select.atleast.one.record');
    } else if (selectedRecord.length > 1) {
      this.showErrorStatus('export.select.only.one.record');
    } else {
      var dataToSend = {
        shipmentType: selectedRecord[0].type,
        shipmentNumber: selectedRecord[0].shipmentNumber.replace("-", ""),
        terminalPoint: this.specialShipmentSearchFormGroup.controls['terminalPoint'].value,
        from: this.specialShipmentSearchFormGroup.get("from").value,
        to: this.specialShipmentSearchFormGroup.get("to").value,
        carrierGroup: this.specialShipmentSearchFormGroup.controls['carrierGroup'].value,
        carrier: this.specialShipmentSearchFormGroup.controls['carrier'].value,
        flight: this.specialShipmentSearchFormGroup.get("flight").value,
        segment: this.specialShipmentSearchFormGroup.get("segment").value,
        excludeShc: this.specialShipmentSearchFormGroup.get("excludeShc").value,
        shc: this.specialShipmentSearchFormGroup.get("shc").value,
        departed: this.specialShipmentSearchFormGroup.controls['departed'].value,
        shipmentType1: this.specialShipmentSearchFormGroup.controls['shipmentType'].value
      }
      this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', dataToSend);
    }
  }

  openMaintainHAWBList(event, template: TemplateRef<any>) {
    this.shipmentNumberData = event.shipmentNumber;
    if (event.handlingMode == 'H') {
      this.templateRef = template;
      this.isClosePopupScreen = false;
      this.title = "hawb.list";
      this.openParentWindow();
    }
  }


  autoSearchShipmentInfo($event) {
    this.onSearch();
  }
  closePopScreen() {
    this.isClosePopupScreen = true;
  }
  openParentWindow(width?: number, height?: number) {
    const WIDTH = 1500;
    const HEIGHT = 780;
    if (width && height) {
      this.popUpWidth = width;
      this.popUpHeight = height;
    }
    else {
      this.popUpWidth = WIDTH;
      this.popUpHeight = HEIGHT;
    }
    this.parentWindow.open();
  }
}