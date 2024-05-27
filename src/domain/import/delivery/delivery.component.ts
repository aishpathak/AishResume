import { Component, OnInit, ViewChild, NgZone, ViewContainerRef, ElementRef } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcUtility, NgcFormArray, NgcDropDownListComponent, NgcWindowComponent, CellsRendererStyle, PageConfiguration, NgcReportComponent, DateTimeKey } from 'ngc-framework';
import { DeliverySummary } from '../import.sharedmodel'
import { ImportService } from '../import.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators } from '@angular/forms';
import { ApplicationFeatures } from '../../common/applicationfeatures';
import { ApplicationEntities } from '../../common/applicationentities';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class DeliveryComponent extends NgcPage implements OnInit {
  private handledByMasterHouse: boolean = false;
  private hawbSourceParameters: any;
  private isAwbDetailsPresent = false;
  shipmentDateData: any;
  deliveryIdData: any;
  showTable = false;
  customer: any;
  subMessageParameter: {}
  navigateData: any;
  requestData: any;
  viewReportId: String = "";
  cancelRowId: any
  handledbyHouseFlg: boolean = false;
  daysDiff: Number;
  @ViewChild('cancelDo') cancelDo: NgcWindowComponent;
  @ViewChild('windowPrinter') windowPrinter: NgcWindowComponent;
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  //@ViewChild('reportWindow2') reportWindow2: NgcReportComponent;
  popupPrinterForm: NgcFormGroup = new NgcFormGroup({
    printerdropdown: new NgcFormControl(),
  });


  public delivery: NgcFormGroup = new NgcFormGroup(
    {
      terminalDelivery: new NgcFormControl(),
      level: new NgcFormControl(),
      shipmentNumber: new NgcFormControl(),
      shipmentType: new NgcFormControl(),
      doNumber: new NgcFormControl(),
      customer: new NgcFormControl(),
      dateFrom: new NgcFormControl(),
      dateTo: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES)),
      hawbNumber: new NgcFormControl(),

      deliveryList: new NgcFormArray([]),
      cancelDo: new NgcFormGroup(
        {
          deliveryOrderNo: new NgcFormControl(),
          shipmentNumber: new NgcFormControl(),
          cancellationReason: new NgcFormControl(),
          hawbNumber: new NgcFormControl(),
          shipmentHouseId: new NgcFormControl(),
          shipmentid: new NgcFormControl(),
          pieces: new NgcFormControl(),
          weight: new NgcFormControl(),
          status: new NgcFormControl(),
          shipmentType: new NgcFormControl(),
          clearingAgent: new NgcFormControl()
        }
      )


    }
  )
  shipmentId: Promise<void>;
  terminalValue: any;
  deliveryrequestIdData: any;
  reportParameters: any;
  shipmentType1: any = "AWB";
  constructor(private importService: ImportService, appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.shipmentType1 = "AWB"
    this.navigateData = this.getNavigateData(this.activatedRoute)
    if (this.navigateData != null) {
      if (this.navigateData.shipmentNumber != null) {
        let request = new DeliverySummary()
        this.delivery.get("shipmentNumber").setValue(this.navigateData.shipmentNumber);
        this.onChangeSearchData();
        if (this.navigateData.hawbNumber != null) {
          this.delivery.get("hawbNumber").setValue(this.navigateData.hawbNumber);
        }
        this.getDeliveryDo();
      }

    }
  }
  getDeliveryDo() {
    this.resetFormMessages();
    this.showTable = false;
    if (this.delivery.controls.hawbNumber.invalid) {
      return;
    }

    let request = new DeliverySummary()
    let datefrom = this.delivery.controls.dateFrom.value
    request = this.delivery.getRawValue()
    request.terminalDelivery = this.terminalValue

    if (request.shipmentNumber == null && request.dateFrom == null) {
      this.showErrorStatus("imp.err113")
      this.showTable = false
      return
    }
    var dif = NgcUtility.dateDifference(request.dateTo, request.dateFrom);
    this.daysDiff = dif / (1000 * 60 * 60 * 24);

    if (this.daysDiff > 7) {
      this.showErrorStatus('delivery.date.range.cannot.more.than.7days');
      return;
    }
    this.importService.getDeliveryDo(request).subscribe(response => {
      const resp = response.data

      if (resp.deliveryList.length === 1000 || resp.deliveryList.length > 1000) {
        this.showErrorStatus('delivery.search.note')
      }

      console.log(resp)
      for (let eachrow of resp.deliveryList) {
        eachrow['awbPiecesWeight'] = eachrow.shipmentPieces + " / " + eachrow.shipmentWeight
        eachrow['PiecesWeight'] = eachrow.pieces + " / " + eachrow.weight
        eachrow['hawbPiecesWeight'] = eachrow['hawbPiecesWeight'] == ' / ' ? '' : eachrow['hawbPiecesWeight']
      }
      if (resp) {

        this.delivery.patchValue(resp)
        this.showTable = true
      }




    })


  }
  onLinkClick(event) {
    if (event.column == "cancel") {
      this.deliveryIdData = event.record.deliveryId;
      this.shipmentDateData = event.record.shipmentDate;
      this.customer = event.record.customerId;
      this.shipmentId = event.record.shipmentId;
      this.deliveryrequestIdData = event.record.deliveryRequestId
      this.handledbyHouseFlg = event.record.hm == "H" ? true : false;
      this.showConfirmMessage('cancel.records').then(fulfilled => {
        this.cancelDo.open()
        this.delivery.get("cancelDo.deliveryOrderNo").setValue(event.record.deliveryOrderNo);
        this.delivery.get("cancelDo.shipmentNumber").setValue(event.record.shipmentNumber);
        this.delivery.get("cancelDo.hawbNumber").setValue(event.record.hawbNumber);
        this.delivery.get("cancelDo.pieces").setValue(event.record.pieces);
        this.delivery.get("cancelDo.weight").setValue(event.record.weight);
        this.delivery.get("cancelDo.shipmentid").setValue(event.record.shipmentid);
        this.delivery.get("cancelDo.shipmentType").setValue(event.record.shipmentType);
        this.delivery.get("cancelDo.clearingAgent").setValue(event.record.clearingAgent);
        this.delivery.get("cancelDo.shipmentHouseId").setValue(event.record.shipmentHouseId);

      }
      ).catch(reason => {
      });
    }
    if (event.column == "print" && !NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Dlv_DOClientPrint)) {

      if (event.record.cancellationReason != null && event.record.cancellationReason != '') {
        this.showErrorMessage(NgcUtility.translateMessage("data.delivery.request.cancelled", [event.record.deliveryOrderNo]));

        return;
      }
      this.windowPrinter.open();
      let now = new Date();
      const format: string = 'ddmmmyyyy hh:MM TT"';
      const currentHourDate: Date = NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), format), format);


      this.requestData =
      {
        deliveryOrderNo: event.record.deliveryOrderNo,
        shipmentNumber: event.record.shipmentNumber,
        consignee: event.record.consignee,
        clearingAgent: event.record.clearingAgent,
        getAccountNumber: event.record.accountNumber,
        origin: event.record.origin,
        destination: event.record.destination,
        issuedToPersonnelName: event.record.issuedToPersonnelName,
        correspondenceAddress: event.record.correspondenceAddress,
        correspondencePostalCode: event.record.correspondencePostalCode,
        pieces: event.record.pieces,
        weight: event.record.weight,
        nog: event.record.nog,
        currentDatetime: currentHourDate,
        flightNo: event.record.flightNo,
        flightDate: event.record.flightDate,
        deliveryId: event.record.deliveryId,
        icNo: event.record.icNo,
        chargeCode: event.record.chargeCode,
        dlvyBy: this.getUserProfile().userLoginCode,
        regNo: event.record.regNo,
        awbPieces: event.record.awbPieces,
        awbWeight: event.record.awbWeight,
        shc: event.record.shc,
        issuedToPersonnelNumber: event.record.issuedToPersonnelNumber,
        appointedAgent: event.record.appointedAgent,
        issueDateTime: event.record.issueDateTime,
        customerName: event.record.customerName
      }


    }
    if (event.record.cancellationReason == null && event.column != "cancel" && (event.column == "view" || NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Dlv_DOClientPrint))) {

      this.reportParameters = new Object();
      if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Dlv_DOClientPrint)) {
        this.reportParameters.deliveryId = event.record.deliveryId;
        this.reportParameters.loggedInUser = this.getUserProfile().userLoginCode;
        this.reportParameters.Hawbflg = false;
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
          this.reportParameters.Hawbflg = true;
        }
        if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Gen_House_Enable)) {
          this.reportParameters.isHawbEnable = true;
        }
        this.reportParameters.airPortcode = NgcUtility.getTenantConfiguration().airportCode;
        this.reportWindow.open();

      } else {
        this.reportParameters.tenantId = NgcUtility.getTenantConfiguration().airportCode;
        this.reportParameters.DONumber = event.record.deliveryOrderNo
        this.reportParameters.shipmentnumber = event.record.shipmentNumber
        this.reportWindow.open()
      }

    }
  }

  printDo() {
    this.showSuccessStatus("requst.to.print.success");
    this.windowPrinter.hide();
    if (this.popupPrinterForm.get("printerdropdown").value == null) {
      this.showErrorStatus("error.import.select.printer.before.proceeding");
    }
    else {
      this.requestData.printerName = this.popupPrinterForm.get("printerdropdown").value;

      this.importService.printDO(this.requestData).subscribe(response => {
        const resp = response.data;
        if (!this.showResponseErrorMessages(response)) {
        }
      }, error => {
        this.showErrorStatus(error);
      });
    }
  }
  public svcCellsRenderer = (row: number, column: string, value: any, rowData: any): string => {
    let svc: any;
    if (rowData.svc === 'true') {
      svc = 'Y';
    } else {
      svc = 'N';
    }

    return svc;
  }
  public chargesPaidCellsRenderer = (row: number, column: string, value: any, rowData: any): string => {
    let chargesPaid: any;
    if (rowData.chargesPaid === 'true') {
      chargesPaid = 'Y';
    }
    else {
      chargesPaid = 'Y';
    }
    return chargesPaid;
  }
  public printedRenderer = (row: number, column: string, value: any, rowData: any): string => {
    let printed: any;
    if (!rowData.printed) {
      printed = 'Y';
    } else {
      printed = 'Y';
    }

    return printed;
  }

  public onCancel(event) {
    this.navigateBack(this.delivery.getRawValue());
  }
  cancelDelivery() {
    let request = (<NgcFormGroup>this.delivery.get(['cancelDo'])).getRawValue();
    console.log(request)
    request.deliveryId = this.deliveryIdData;
    request.shipmentDate = this.shipmentDateData;
    request.customerId = this.customer
    request.shipmentId = this.shipmentId;
    request.deliveryRequestId = this.deliveryrequestIdData
    request.status = 'CANCELLED'
    // this.onSearch()

    this.importService.cancelDelivery(request).subscribe(response => {
      const resp = response.data;
      this.refreshFormMessages(response);
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        //this.delivery.reset();
        this.showTable = false;
        this.cancelDo.close()
        this.getDeliveryDo();
      }
    }, error => {
      this.showErrorStatus(error);
    });
    // if (resp) {
    //   this.showSuccessStatus('g.completed.successfully');
    //   this.delivery.reset();
    //   this.cancelDo.close()
    //   this.getDeliveryDo();
    // } else {
    //   this.cancelDo.open();
    // }

  }
  onChangeSearchData() {
    this.isAwbDetailsPresent = false;
    this.handledByMasterHouse = false;
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
      this.hawbSourceParameters = this.createSourceParameter(this.delivery.get('shipmentNumber').value);
      this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
        if (data != null && data.length > 0) {
          this.handledByMasterHouse = true;
          this.delivery.get('hawbNumber');
        } else {
          this.handledByMasterHouse = false;
        }
      },
      );
    }
  }
  onChangeHawbNumber() {
    this.isAwbDetailsPresent = false;
  }
  onChange(event) {
    this.terminalValue = event.desc;
    this.subMessageParameter = this.createSourceParameter(this.delivery.get('terminalDelivery').value);
  }

  private onShipmentSelect(event) {
    if (event.shipmentType) {
      this.delivery.get('shipmentType').patchValue(event.shipmentType);
      this.delivery.get('hawbNumber').patchValue("");
    }
  }
  printreportdisplayDO() {
    this.reportParameters = new Object();
    if (this.delivery.get('terminalDelivery').value != null) {
      this.reportParameters.handlingareaflag = '1'
      this.reportParameters.handlingarea = this.delivery.get('terminalDelivery').value;
    }
    else {
      this.reportParameters.handlingareaflag = '0'
    }
    if (this.delivery.get('level').value != null) {
      this.reportParameters.deliverysectorflag = '1'
      this.reportParameters.deliverysector = this.delivery.get('level').value;
    }
    else {
      this.reportParameters.deliverysectorflag = '0'
    }
    if (this.delivery.get('shipmentNumber').value != null) {
      this.reportParameters.Shipmentnumberflag = '1'
      this.reportParameters.shipmentNumber = this.delivery.get('shipmentNumber').value;
    }
    else {
      this.reportParameters.Shipmentnumberflag = '0'
    }
    if (this.delivery.get('doNumber').value != null) {
      this.reportParameters.DOflag = '1'
      this.reportParameters.DO = this.delivery.get('doNumber').value;
    }
    else {
      this.reportParameters.DOflag = '0'
    }
    if (this.delivery.get('customer').value != null) {
      this.reportParameters.customercodeflag = '1'
      this.reportParameters.customercode = this.delivery.get('customer').value;
    }
    else {
      this.reportParameters.customercodeflag = '0'
    }
    if (this.delivery.get('dateFrom').value != null) {
      this.reportParameters.createdfromflag = '1'
      this.reportParameters.createdfromdate = this.delivery.get('dateFrom').value;
    }
    else {
      this.reportParameters.createdfromflag = '0'
    }

    if (this.delivery.get('dateTo').value != null) {
      this.reportParameters.createdtoflag = '1'
      this.reportParameters.createdtodate = this.delivery.get('dateTo').value;
    }
    else {
      this.reportParameters.createdtoflag = '0'
    }
    if (this.delivery.get('hawbNumber').value != null && this.delivery.get('hawbNumber').value != "") {
      this.reportParameters.hawbNumberflag = '1'
      this.reportParameters.hawbNumber = this.delivery.get('hawbNumber').value;
    }
    else {
      this.reportParameters.hawbNumberflag = '0'
    }
    this.reportParameters.hawbHandling = false;

    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
      this.reportParameters.hawbHandling = true;
    }
    this.reportWindow1.reportParameters = this.reportParameters;
    this.reportWindow1.downloadReport()
  }
}
