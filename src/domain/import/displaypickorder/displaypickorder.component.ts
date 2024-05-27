import {
  Component, OnInit, NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild
} from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcFormArray, NgcUtility, NgcDropDownListComponent, NgcWindowComponent, PageConfiguration, NgcReportComponent, DateTimeKey } from 'ngc-framework';
import { ImportService } from '../import.service';
import {
  DisplayPoSummary,
  DisplayPoList
} from '../import.sharedmodel';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationFeatures } from '../../common/applicationfeatures';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-displaypickorder',
  templateUrl: './displaypickorder.component.html',
  styleUrls: ['./displaypickorder.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class DisplaypickorderComponent extends NgcPage implements OnInit {
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('terminalDropDown') terminalDropDown: NgcDropDownListComponent;
  @ViewChild('cancelDo') cancelDo: NgcWindowComponent;
  @ViewChild('windowPrinter') windowPrinter: NgcWindowComponent;


  //@ViewChild('printerdropdown') printerdropdown: NgcDropDownListComponent;
  daysDiff: Number;
  showTable = false;
  terminal: any;
  subMessageParameter: {}
  requestData: any;
  popupPrinterForm: NgcFormGroup = new NgcFormGroup({
    printerdropdown: new NgcFormControl(),
  });

  public displaypickorder: NgcFormGroup = new NgcFormGroup(
    {


      terminalDisplay: new NgcFormControl(),
      core: new NgcFormControl(),
      awbNumber: new NgcFormControl(),
      poNumber: new NgcFormControl(),
      poStatus: new NgcFormControl(),
      agentName: new NgcFormControl(),
      dateFrom: new NgcFormControl(),
      dateTo: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES)),
      shipmentType: new NgcFormControl(),
      displayPoList: new NgcFormArray([]),
      deliveryRequestOrderNo: new NgcFormControl(),

      issuePoForm: new NgcFormGroup({
        chargeCode: new NgcFormControl(),
        deliveryRequestOrderNo: new NgcFormControl(),
        authroizedPerson: new NgcFormControl(),
        authorizedSignature: new NgcFormControl(),
        receivingPartyIdentificationNumber: new NgcFormControl(),
        receivingPartyName: new NgcFormControl(),
        receivingPartyCompanyName: new NgcFormControl(),
        bankEndorsementCollected: new NgcFormControl(),
        type: new NgcFormControl(),
        inventory: new NgcFormArray([])

      }),
      hawbNumber: new NgcFormControl(),

    });
  terminalValue: any;
  reportParameters: any;
  request: any;
  shipmentType1: any = "AWB";
  hawbSourceParameters: {};
  handledByMasterHouse: boolean;
  hawbHandling: boolean;



  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService, private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {

    this.shipmentType1 = "AWB"

  }


  getDisplayPoList() {

    this.resetFormMessages();

    let request1: string
    let resArray: any = new DisplayPoList();
    let request: any = new DisplayPoSummary();
    // this.onClear();
    request = this.displaypickorder.getRawValue();
    request1 = this.displaypickorder.get('terminalDisplay').value
    if (request.poStatus == 'ALL') {
      request.poStatus = ''
    }
    request.terminalDisplay = this.terminalValue
    if (request.awbNumber == null && request.dateFrom == null) {
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

    this.importService.getDisplayPoList(request).subscribe(data => {
      this.resetFormMessages
      const resp: any = data;
      console.log(resp);
      if (resp.data.displayPoList.length === 1000 || resp.data.displayPoList.length > 1000) {
        this.showErrorStatus('delivery.search.note')
      }
      for (let eachRow of resp.data.displayPoList) {
        console.log(eachRow.awbPieces, eachRow.awbWeight)
        eachRow['awbPiecesWeight'] = eachRow.awbPieces + " / " + eachRow.awbWeight
        eachRow['poPiecesWeight'] = eachRow.poPieces + " / " + eachRow.poWeight
      }

      if (resp.data) {


        console.log(resp.data.awbPieces)
        this.displaypickorder.patchValue(resp.data)

        this.showTable = true;
      }
    });
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

  public onCancel(event) {
    this.navigateBack(this.displaypickorder.getRawValue());
  }
  // onEditAddLink(event) {


  //   this.navigateTo(this.router, '/import/pomonitoring', event);
  // }
  onEditAddLink(event) {

    //calling print function 

    if (event.record.poStatus != 'CANCELLED') {
      this.print(event);
    }

    let now = new Date();
    const format: string = 'ddmmmyyyy hh:MM TT"';
    const currentHourDate: Date = NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), format), format);

    this.requestData =
    {
      poNumber: event.record.poNumber,
      awbNumber: event.record.awbNumber,
      consignee: event.record.consignee,
      clearingAgent: event.record.clearingAgent,
      poDateTime: event.record.poDateTime,
      poWeight: event.record.poPiecesWeight,
      icNo: event.record.icNo,
      personCollect: event.record.personCollect,
      nog: event.record.nog,
      uldDetails: event.record.uldDetails,
      currentDatetime: currentHourDate,
      truckDock: event.record.truckDock,
      flightNo: event.record.flightNo,
      flightDate: event.record.flightDate,
      awbPieces: event.record.awbPieces,
      awbWeight: event.record.awbWeight,
      shc: event.record.shc,
      poStatus: event.record.poStatus
    }
  }

  print(event) {
    this.reportParameters = new Object();

    if (!NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Dlv_POClientPrint)) {
      this.windowPrinter.open();

    }

    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Dlv_POClientPrint)) {

      //  this.importService.printPO(this.requestData).subscribe(response => {
      // const resp = response.data;
      const reportParameters: any = {};
      console.log(event.record);
      reportParameters.ImpDeliveryRequestId = event.record.impDeliveryRequestId;
      reportParameters.airPortcode = NgcUtility.getTenantConfiguration().airportCode;


      // reportParameters.Hawbflg = false;

      if (this.handledByMasterHouse) {

        reportParameters.Hawbflg = true;

      }
      this.reportParameters = reportParameters;
      this.reportWindow.open();

    }
  }

  printPO() {
    this.windowPrinter.hide();
    if (this.popupPrinterForm.get("printerdropdown").value == null) {
      this.showErrorStatus("error.import.select.printer.before.proceeding");
    }
    else {
      this.windowPrinter.hide();
      if (this.popupPrinterForm.get("printerdropdown").value == null) {
        this.showErrorStatus("error.import.select.printer.before.proceeding");
      }
      else {
        this.requestData.printerName = this.popupPrinterForm.get("printerdropdown").value;
        this.importService.printPO(this.requestData).subscribe(response => {
          const resp = response.data;
          console.log(response.data)
          if (!this.showResponseErrorMessages(response)) {
            this.showSuccessStatus("requst.to.print.success");
          }
        }, error => {
          this.showErrorStatus(error);
        });
      }
    }
  }
  onChange(event) {
    this.terminalValue = event.desc;
    this.subMessageParameter = this.createSourceParameter(this.displaypickorder.get('terminalDisplay').value);
  }


  private onShipmentSelect(event) {
    if (event.shipmentType) {
      this.displaypickorder.get('shipmentType').patchValue(event.shipmentType);
    }
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {

      this.hawbSourceParameters = this.createSourceParameter(this.displaypickorder.get('awbNumber').value);
      console.log(this.hawbSourceParameters)
      this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
        if (data != null && data.length > 0) {
          this.handledByMasterHouse = true;
          this.retrieveLOVRecords("HWBNUMBER", this.hawbSourceParameters).subscribe(data => {

            if (data != null && data.length == 1) {

              this.displaypickorder.get('hawbNumber').setValue(data[0].code);

            }

          })
          console.log(this.handledByMasterHouse)
          //  this.displaypickorder.get('hawbnumber').setValidators([Validators.required, Validators.maxLength(16)]);
        } else {
          this.handledByMasterHouse = false;
        }
      },
      );
    }
  }



}