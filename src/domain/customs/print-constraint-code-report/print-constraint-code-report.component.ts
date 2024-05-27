import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, HostListener } from '@angular/core';
import { PageConfiguration, NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcReportComponent, NgcUtility, ReactiveModel, NgcWindowComponent } from 'ngc-framework';
import { CustomACESService } from '../customs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomsHouseModel, MaintainAccsInformation } from '../customs.sharedmodel';

@Component({
  selector: 'app-print-constraint-code-report',
  templateUrl: './print-constraint-code-report.component.html',
  styleUrls: ['./print-constraint-code-report.component.scss']
})
@PageConfiguration({
  trackInit: true, callNgOnInitOnClear: true, restorePageOnBack: true,
  dontRestoreOnBrowserBack: false
})
export class PrintConstraintCodeReportComponent extends NgcPage {
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;

  searchButtonClicked: boolean;
  flightTypeButtonClicked: boolean;
  ccSevereSelected: boolean;
  ctmCodeSelected: boolean;
  ifItfs: boolean = false;
  showItfs: boolean;
  showExportImport: boolean;
  response: any;
  historyResponse: any;
  reportParameters: any;
  ccList: any[];

  // data to be forwarded to window or next screen
  forwardedDataToHouse: CustomsHouseModel;
  forwardedDataToShipment: MaintainAccsInformation;

  screenHeight: any;
  screenWidth: any;

  ngOnInit() {
    super.ngOnInit();
    this.setScreenSize();
  }

  /**
  *
  * @param appZone
  * @param appElement
  * @param appContainerElement
  */

  windowOpenFlag: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private customsService: CustomACESService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  @ViewChild('historyFormWindow')
  private historyFormWindow: NgcWindowComponent;

  @ViewChild('houseInformationWindow')
  private houseInformationWindow: NgcWindowComponent;

  @ViewChild('awbInformationWindow')
  private awbInformationWindow: NgcWindowComponent;

  private printConstraintCodeForm: NgcFormGroup = new NgcFormGroup({
    cc_a: new NgcFormControl(),
    cc_b: new NgcFormControl(),
    cc_c: new NgcFormControl(),
    cc_d: new NgcFormControl(),
    cc_e: new NgcFormControl(),
    ccSevereThan: new NgcFormControl(),
    ccList: new NgcFormArray([]),
    flightType: new NgcFormControl(),
    from_Date: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    to_Date: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    itfsDate: new NgcFormControl(),
    itfsNo: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    flight_Key: new NgcFormControl(),
    awb_Number: new NgcFormControl(),
    awbPcsWgt: new NgcFormControl(),
    manifestPcsWgt: new NgcFormControl(),
    origin: new NgcFormControl(),
    finalDestination: new NgcFormControl(),
    cc: new NgcFormControl(),
    recvDateTime: new NgcFormControl(),
    retrievePrintConstraintCode: new NgcFormArray([
      new NgcFormGroup({
        cc_a: new NgcFormControl(),
        cc_b: new NgcFormControl(),
        cc_c: new NgcFormControl(),
        cc_d: new NgcFormControl(),
        cc_e: new NgcFormControl(),
        ccSevereThan: new NgcFormControl(),
        flightType: new NgcFormControl(),
        from_Date: new NgcFormControl(),
        to_Date: new NgcFormControl(),
        carrierCode: new NgcFormControl(),
        flight_Key: new NgcFormControl(),
        awb_Number: new NgcFormControl(),
        awbPcsWgt: new NgcFormControl(),
        manifestPcsWgt: new NgcFormControl(),
        origin: new NgcFormControl(),
        finalDestination: new NgcFormControl(),
        cc: new NgcFormControl(),
        recvDateTime: new NgcFormControl(),

      })
    ]),
    retrieveConstraintCodeHistoryList: new NgcFormArray([
      new NgcFormGroup({
        flightType: new NgcFormControl(),
        flight_Key: new NgcFormControl(),
        from_Date: new NgcFormControl(),
        awb_Number: new NgcFormControl(),
        datAta: new NgcFormControl(),
        datAtd: new NgcFormControl(),
        datEta: new NgcFormControl(),
        dateSTD: new NgcFormControl(),
        hawbNumber: new NgcFormControl(),
        cc: new NgcFormControl(),
        recvDateTime: new NgcFormControl(),
        flightTypee: new NgcFormControl(),
      })
    ]),
  });

  /**
   * Method to retrieve Data of Maintain Constraint Code Screen for print
   */
  onSearch() {
    let request = this.printConstraintCodeForm.getRawValue();

    if (request.flightType == null || request.flightType == '') {
      return this.showFormControlErrorMessage(<NgcFormControl>this.printConstraintCodeForm.get('flightType'), "Mandatory");
    }

    if (this.printConstraintCodeForm.get('flightType').value == 'ITFS') {
      this.ifItfs = true;
    } else {
      this.ifItfs = false;
    }

    request.ccList = this.ccListFun().ccList;
    request.mode = request.flightType;
    request.awbNumber = request.awb_Number;
    request.flightKey = request.flight_Key;
    request.fromDate = request.from_Date;
    request.toDate = request.to_Date;

    this.customsService.getPrintConstraintCode(request).subscribe((data) => {
      if (!this.showResponseErrorMessages(data)) {
        this.response = data.data;
        if (this.response.retrievePrintConstraintCode.length != 0) {
          this.refreshFormMessages(data);
          this.searchButtonClicked = true;

          this.printConstraintCodeForm.patchValue(this.response);
          this.showSuccessStatus('g.completed.successfully');
          console.log(this.printConstraintCodeForm.value);
        }
        else {
          this.searchButtonClicked = false;
          this.showErrorMessage("val.noRecordFound");
        }
      }
      else {
        this.searchButtonClicked = false;
      }
    });
  }

  /**
   * Method to open Constraint History Pop-up
   */
  openHistory(index: any) {
    let row = this.printConstraintCodeForm.get(['retrievePrintConstraintCode', index]).value;
    let type = <NgcFormControl>this.printConstraintCodeForm.get('flightType').value;
    let rqstData = {
      flightKey: row.flightKey, flightDate: row.flightDate, awbNumber: row.awbNumber,
      shipmentDate: row.shipmentDate, hawbNumber: row.hawbNumber, mode: type, clearanceType: row.clearanceType
    }
    console.log(rqstData);

    this.customsService.getPopUpConstraintCodeHistory(rqstData).subscribe((data) => {
      this.historyResponse = data.data;
      this.refreshFormMessages(data);

      if (this.historyResponse != null) {
        this.printConstraintCodeForm.patchValue(this.historyResponse);
        console.log(this.printConstraintCodeForm.value);
        this.windowOpenFlag = true;
        this.historyFormWindow.open();
      }
    });
  }

  /**
   * Method to make a list of selected ctm code
   */
  ccListFun() {
    let list = this.printConstraintCodeForm.getRawValue();
    this.reportParameters = new Object();

    let item = [];
    list.ccList = new Array;
    if (list.cc_a != null) {
      item.push(list.cc_a)
    }

    if (list.cc_b != null) {
      item.push(list.cc_b)
    }

    if (list.cc_c != null) {
      item.push(list.cc_c)
    }

    if (list.cc_d != null) {
      item.push(list.cc_d)
    }

    if (list.cc_e != null) {
      item.push(list.cc_e)
    }
    list.ccList = item;
    console.log(list);
    return list;
  }

  /**
   * Method to open report as per Flight Type selected
   */
  onreportcreation() {
    let parms = this.printConstraintCodeForm.getRawValue();
    this.reportParameters = new Object();
    console.log(this.ccListFun().ccList);
    parms.ccList = new Array;
    parms.ccList = this.ccListFun().ccList;

    if (this.printConstraintCodeForm.get('flightType').value == "ITFS") {
      this.reportParameters.tenantAirport = NgcUtility.getTenantConfiguration().airportCode;
      this.reportParameters.mode = this.printConstraintCodeForm.get('flightType').value;
      this.reportParameters.fromDate = this.printConstraintCodeForm.get('fromDate').value;
      this.reportParameters.toDate = this.printConstraintCodeForm.get('toDate').value;
      this.reportParameters.ItfsFlightKey = this.printConstraintCodeForm.get('itfsNo').value;
      this.reportParameters.cc = parms.ccList.toString();
      this.reportParameters.ccSevereThan = this.printConstraintCodeForm.get('ccSevereThan').value;
      this.reportParameters.ItfsFlightDate = this.printConstraintCodeForm.get('itfsDate').value;
      console.log(this.reportParameters);
      this.reportWindow1.open();
    }
    else {
      this.reportParameters.awbNumber = this.printConstraintCodeForm.get('awb_Number').value;
      this.reportParameters.tenantAirport = NgcUtility.getTenantConfiguration().airportCode;
      this.reportParameters.mode = this.printConstraintCodeForm.get('flightType').value;
      this.reportParameters.fromDate = this.printConstraintCodeForm.get('fromDate').value;
      this.reportParameters.toDate = this.printConstraintCodeForm.get('toDate').value;
      this.reportParameters.carrierCode = this.printConstraintCodeForm.get('carrierCode').value;
      this.reportParameters.flightKey = this.printConstraintCodeForm.get('flight_Key').value;
      this.reportParameters.ccSevereThan = this.printConstraintCodeForm.get('ccSevereThan').value;
      this.reportParameters.cc = parms.ccList.toString();
      console.log(this.reportParameters);
      this.reportWindow.open();
    }
  }

  /**
   * Method to close historyFormWindow
   */
  closeAddHouseWindow() {
    this.historyFormWindow.close();
    this.windowOpenFlag = false;

  }

  /**
   * Method to clear the screen
   */
  onClear() {
    this.searchButtonClicked = false;
    this.printConstraintCodeForm.reset();
    this.resetFormMessages();
  }

  /**
   * Method to generate page number
   */
  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  /**
   * Method to navigate previous screen.
   * This Method will be called on click on cancel button
   * @param event
   */
  onCancel($event) {
    this.navigateBack(this.printConstraintCodeForm.getRawValue());
  }

  /**
   * This method will be called on click Hawb Number and 
   * open Maintain House Manifest Information
   */
  openHouseInformation(index) {
    let row = this.printConstraintCodeForm.get(['retrievePrintConstraintCode', index]).value;
    this.forwardedDataToHouse = new CustomsHouseModel();
    this.forwardedDataToHouse.masterAwbId = row.customShipmentInfoId;
    this.forwardedDataToHouse.id = row.customShipmentHouseInfoId;
    console.log(this.forwardedDataToHouse);
    this.openHouseInformationWindow();
  }

  /**
   * Method to open houseInformationWindow
   */
  openHouseInformationWindow() {
    this.houseInformationWindow.open();
  }

  /**
   * Method to close houseInformationWindow
   */
  closeHouseInformationWindow() {
    this.houseInformationWindow.close();
  }

  /**
   * This method will be called on click Awb Number and 
   * open Maintain ACCS AWB Information
   */
  openShipmentInformation(index) {
    let row = this.printConstraintCodeForm.get(['retrievePrintConstraintCode', index]).value;
    this.forwardedDataToShipment = new MaintainAccsInformation();
    this.forwardedDataToShipment.shipmentNumber = row.awbNumber;
    this.forwardedDataToShipment.shipmentDate = row.shipmentDate;
    this.forwardedDataToShipment.customFlightId = row.customFlightID;
    this.forwardedDataToShipment.flightId = row.flightId;
    this.forwardedDataToShipment.origin = row.origin;
    this.forwardedDataToShipment.destination = row.finalDestination;
    this.forwardedDataToShipment.awbPieces = row.awbPieces;
    this.forwardedDataToShipment.awbWeight = row.awbWeight;
    this.forwardedDataToShipment.manifestPieces = (row.manifestPcsWgt).split('/')[0];
    this.forwardedDataToShipment.manifestWeight = (row.manifestPcsWgt).split('/')[1];
    this.forwardedDataToShipment.hawbPiecesWeight = row.hawbPiecesWeight;
    this.forwardedDataToShipment.natureOfGoods = row.natureOfGoods;
    this.forwardedDataToShipment.flightNumber = row.flightKey;
    this.forwardedDataToShipment.flightDate = row.flightDate;
    this.forwardedDataToShipment.handlingAgent = row.handlingAgent;
    this.forwardedDataToShipment.relIndicator = row.relIndicator;
    this.forwardedDataToShipment.flightATA = row.datAta;
    console.log(this.forwardedDataToShipment);
    this.openAwbInformationWindow();
  }

  /**
   * Method to open awbInformationWindow
   */
  openAwbInformationWindow() {
    this.awbInformationWindow.open();
  }

  /**
   * Method to close awbInformationWindow
   */
  closeAwbInformationWindow() {
    this.awbInformationWindow.close();
  }

  /**
   * Update screen size variable dynamically 
   * 
   * @param event 
   */
  @HostListener('window:resize', ['$event'])
  setScreenSize(event?) {
    this.screenHeight = (window.innerHeight * 0.85);
    this.screenWidth = window.innerWidth;
  }

  /**
   * This Method will open fields as per Flight Type selected
   */
  openFields() {
    console.log(this.printConstraintCodeForm.get('flightType').value);
    if (this.printConstraintCodeForm.get('flightType').value == "ITFS") {
      this.flightTypeButtonClicked = true;
      this.showItfs = true;
      this.showExportImport = false;
    } else {
      this.flightTypeButtonClicked = false;
      this.showItfs = false;
      this.showExportImport = true;
    }
  }

  /**
   * This Method will unable cc severe than if ctm code is select
   * @param event
   */
  onSelect(event) {
    console.log(event);
    if (event.code != null) {
      this.ctmCodeSelected = true;
    }
    else {
      this.ctmCodeSelected = false;
    }
  }

  /**
   * This Method will unable ctm code if cc severe than is select
   * @param event
   */
  onSelectFunction(event) {
    console.log(event);
    if (event != null) {
      this.ccSevereSelected = true;
    }
    else {
      this.ccSevereSelected = false;
    }
  }

}
