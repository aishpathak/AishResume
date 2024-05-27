import { Component, OnInit } from '@angular/core';
import { NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, NgcReportComponent, DateTimeKey } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomACESService } from '../customs.service';

@Component({
  selector: 'app-list-print-examination-results',
  templateUrl: './list-print-examination-results.component.html',
  styleUrls: ['./list-print-examination-results.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ListPrintExaminationResultsComponent extends NgcPage {
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  reportParameters: any;
  response: any;
  searchButtonClicked: boolean;
  historyResponse: any;
  windowOpenFlag: boolean = false;
  codeTypeList: any[];

  ngOnInit() {
  }

  /**
  *
  * @param appZone
  * @param appElement
  * @param appContainerElement
  */

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private customsService: CustomACESService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  @ViewChild('historyFormWindow')
  private historyFormWindow: NgcWindowComponent;

  private printExaminationResultsForm: NgcFormGroup = new NgcFormGroup({
    codeType: new NgcFormControl(),
    flightType: new NgcFormControl(),
    flight_Key: new NgcFormControl(),
    flight_Date: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    awb_Number: new NgcFormControl(),
    amd: new NgcFormControl(),
    bd: new NgcFormControl(),
    cnsl: new NgcFormControl(),
    cc: new NgcFormControl(),
    exm: new NgcFormControl(),
    cerefNo: new NgcFormControl(),
    relPcsWgt: new NgcFormControl(),
    dtnPcsWgt: new NgcFormControl(),
    recvDateTime: new NgcFormControl(),
    remarks: new NgcFormControl(),
    codeTypeList: new NgcFormArray([]),
    retrievePrintExamintaionResults: new NgcFormArray([
      new NgcFormGroup({
        codeType: new NgcFormControl(),
        flightType: new NgcFormControl(),
        flight_Key: new NgcFormControl(),
        flight_Date: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
        awb_Number: new NgcFormControl(),
        amd: new NgcFormControl(),
        bd: new NgcFormControl(),
        cnsl: new NgcFormControl(),
        cc: new NgcFormControl(),
        exm: new NgcFormControl(),
        cerefNo: new NgcFormControl(),
        relPcsWgt: new NgcFormControl(),
        dtnPcsWgt: new NgcFormControl(),
        recvDateTime: new NgcFormControl(),
        remarks: new NgcFormControl(),
      })
    ]),
    retrieveConstraintCodeHistory: new NgcFormArray([
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
   * Method to retrieve Data of Enquire/Print Examination Results Screen for print
   */
  onSearch() {
    let request = this.printExaminationResultsForm.getRawValue();

    if (request.codeType == null || request.codeType == '') {
      return this.showFormControlErrorMessage(<NgcFormControl>this.printExaminationResultsForm.get('codeType'), "Mandatory");
    }

    if (request.flightType == null || request.flightType == '') {
      return this.showFormControlErrorMessage(<NgcFormControl>this.printExaminationResultsForm.get('flightType'), "Mandatory");
    }

    if (request.flight_Key == null || request.flight_Key == '') {
      return this.showFormControlErrorMessage(<NgcFormControl>this.printExaminationResultsForm.get('flight_Key'), "Mandatory");
    }

    if (request.flight_Date == null || request.flight_Date == '') {
      return this.showFormControlErrorMessage(<NgcFormControl>this.printExaminationResultsForm.get('flight_Date'), "Mandatory");
    }

    if (request.awb_Number == null || request.awb_Number == '') {
      return this.showFormControlErrorMessage(<NgcFormControl>this.printExaminationResultsForm.get('awb_Number'), "Mandatory");
    }

    request.codeTypeMode = request.codeType
    request.mode = request.flightType;
    request.awbNumber = request.awb_Number;
    request.flightKey = request.flight_Key;
    request.flightDate = request.flight_Date;

    this.customsService.getExaminationResults(request).subscribe((data) => {
      if (!this.showResponseErrorMessages(data)) {
        this.response = data.data;
        if (this.response.retrievePrintExamintaionResults.length != 0) {
          this.refreshFormMessages(data);
          this.searchButtonClicked = true;

          this.printExaminationResultsForm.patchValue(this.response);
          this.showSuccessStatus('g.completed.successfully');
          console.log(this.printExaminationResultsForm.value);
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
    let row = this.printExaminationResultsForm.get(['retrievePrintExamintaionResults', index]).value;
    let type = <NgcFormControl>this.printExaminationResultsForm.get('flightType').value;
    console.log(type);
    let rqstData = {
      flightKey: row.flightKey, flightDate: row.flightDate, awbNumber: row.awbNumber, shipmentDate: row.shipmentDate,
      hawbNumber: row.hawbNumber, mode: type, clearanceType: row.clearanceType
    }
    console.log(rqstData);

    this.customsService.fetchPopUpConstraintCodeHistory(rqstData).subscribe((data) => {
      this.historyResponse = data.data;
      this.refreshFormMessages(data);

      if (this.historyResponse != null) {
        this.printExaminationResultsForm.patchValue(this.historyResponse);
        console.log(this.printExaminationResultsForm.value);
        this.windowOpenFlag = true;
        this.historyFormWindow.open();
      }
    });
  }

  /**
   * Method to make a list of CodeType for Report
   */
  codeTypeListFun() {
    let list = this.printExaminationResultsForm.getRawValue();
    this.reportParameters = new Object();

    let item = [];
    list.codeTypeList = new Array;
    if (list.codeTypeMode == 'All') {
      item.push('C')
      item.push('E')
    }
    if (list.codeTypeMode == 'C') {
      item.push('C')
    }
    if (list.codeTypeMode == 'E') {
      item.push('E')
    }

    list.codeTypeList = item;
    console.log(list);
    return list;
  }

  /**
   * Method to open report
   */
  onreportcreation() {
    let parms = this.printExaminationResultsForm.getRawValue();
    parms.codeTypeList = new Array;
    parms.codeTypeList = this.codeTypeListFun().codeTypeList;

    this.reportParameters = new Object();
    this.reportParameters.flightKey = this.printExaminationResultsForm.get('flight_Key').value;
    this.reportParameters.awbNumber = this.printExaminationResultsForm.get('awb_Number').value;
    this.reportParameters.tenantId = NgcUtility.getTenantConfiguration().airportCode;
    this.reportParameters.mode = this.printExaminationResultsForm.get('flightType').value;
    this.reportParameters.flightDate = this.printExaminationResultsForm.get('flight_Date').value;
    this.reportParameters.shipmentDate = this.printExaminationResultsForm.get('shipmentDate').value;
    this.reportParameters.codeTypeMode = parms.codeTypeList.toString();
    console.log(this.reportParameters);
    this.reportWindow.open();
  }

  /**
  * Method to clear the screen
  */
  onClear() {
    this.searchButtonClicked = false;
    this.printExaminationResultsForm.reset();
    this.resetFormMessages();
  }

  /**
   * Method to generate page number
   */
  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  /**
   * Method to close historyFormWindow
   */
  closeAddHouseWindow() {
    this.historyFormWindow.close();
    this.windowOpenFlag = false;

  }

}
