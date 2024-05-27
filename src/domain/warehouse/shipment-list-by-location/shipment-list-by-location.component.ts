import { Component, ElementRef, NgZone, ViewContainerRef, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { NgcUtility, NgcFormArray, NgcFormGroup, NgcPage, NgcReportComponent, NgcWindowComponent, CellsRendererStyle } from 'ngc-framework';
import { NgcFormControl } from 'ngc-framework/core/model/formcontrol.model';
import { WarehouseService } from './../warehouse.service';
import { Router } from '@angular/router';

@Component({
  // selector: 'app-shipment-list-by-location',
  templateUrl: './shipment-list-by-location.component.html',
  styleUrls: ['./shipment-list-by-location.component.scss']
})
export class ShipmentListByLocationComponent extends NgcPage {
  form: NgcFormGroup;
  displayTable: boolean;
  pieceWeight: any;
  locationPieceWeight: any;
  reportParameters: any;
  displayLocation: boolean;
  displayLocationType: boolean;
  displayUld: boolean;
  displayBtPd: boolean;
  dataRadio: string;

  @ViewChild("Report") Report: NgcReportComponent;
  @ViewChild("ReportExcel") ReportExcel: NgcReportComponent;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private service: WarehouseService, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.initializeValues();
    const data: any = this.retrievePageState("ShipmentListByLocation");
    if (data) {
      this.displayLocation = data.byLocation;
      //this.dataRadio = "Location";
      this.displayLocationType = data.byLocationType;
      this.displayUld = data.byUld;
      this.displayBtPd = data.byBTPD;
    } else {
      this.displayLocation = true;
      this.dataRadio = "Location";
      this.displayLocationType = false;
      this.displayUld = false;
      this.displayBtPd = false;
    }
    this.form.patchValue(data);
    this.onSearch();

  }

  initializeValues() {
    this.form = new NgcFormGroup({
      terminalCode: new NgcFormControl(),
      locationType: new NgcFormControl(),
      pieces: new NgcFormControl(),
      locationCodeFrom: new NgcFormControl(),
      locationCodeTo: new NgcFormControl(),
      //  pieceWeight: new NgcFormControl(),
      // locationPieceWeight: new NgcFormControl(),
      //  shipmentNumber: new NgcFormControl(),
      shipmentType: new NgcFormControl(),
      //  shipmentDate: new NgcFormControl(),
      customerCode: new NgcFormControl(),
      carrierCode: new NgcFormControl(),

      // flightId: new NgcFormControl(),
      flightKey: new NgcFormControl(),
      flightDate: new NgcFormControl(),
      uldNumber: new NgcFormControl(),
      domIntl: new NgcFormControl(),
      shc: new NgcFormControl(),
      shcGroup: new NgcFormControl(),
      uldType: new NgcFormControl(),
      whslocationType: new NgcFormControl(),
      shipmentList: new NgcFormArray([
        new NgcFormGroup({
          location: new NgcFormControl(),
          recordChecked: new NgcFormControl(),
          shipmentNumber: new NgcFormControl(),
          pieces: new NgcFormControl(),
          weight: new NgcFormControl(),
          origin: new NgcFormControl(),
          destination: new NgcFormControl(),
          shipmentLocation: new NgcFormControl(),
          warehouseLocation: new NgcFormControl(),
          locationPieces: new NgcFormControl(),
          locationWeight: new NgcFormControl(),
          pdNumber: new NgcFormControl(),
          holdRemarks: new NgcFormControl(),
          shc: new NgcFormControl(),
          natureOfGoodsDescription: new NgcFormControl(),
          customerCode: new NgcFormControl(),
          customerName: new NgcFormControl(),
          flightKey: new NgcFormControl(),
          bookingInfo: new NgcFormControl(),
          serialNumber: new NgcFormControl(),
          hawbno: new NgcFormControl(),
        })


      ]),
      byLocation: new NgcFormControl(true),
      byLocationType: new NgcFormControl(),
      byUld: new NgcFormControl(),
      byBTPD: new NgcFormControl(),
      byType: new NgcFormControl(),
      //   BTPDCodeFrom: new NgcFormControl(),
      //   BTCodeTo: new NgcFormControl()

    });
    this.displayTable = false;
  }

  isFilledAtLeastOneField() {
    const formRawValue = this.form.getRawValue();
    console.log(formRawValue);
    for (let attribute in formRawValue) {
      if (formRawValue.hasOwnProperty(attribute) && formRawValue[attribute] && attribute !== 'flagCRUD'
        && formRawValue[attribute].constructor !== Array) {
        return true;
      }
    }
    return false;
  }

  onSearch() {

    if (this.dataRadio == "Location" || this.dataRadio == "BT") {
      if (this.form.controls["locationCodeFrom"].value == null || this.form.controls["locationCodeTo"].value == null) {
        this.showErrorMessage("warehouse.enter.searchcriteria");
        return;
      }
      if (this.dataRadio == "Location") {
        if (!this.form.controls["locationCodeFrom"].valid || !this.form.controls["locationCodeTo"].valid) {
          this.showErrorMessage("warehouse.enter.correctlocationdetails");
          return
        }
      }

    } else if (this.dataRadio == "LocationType") {
      if ((this.form.controls["whslocationType"].value == null || this.form.controls["terminalCode"].value == null)) {
        this.showErrorMessage("warehouse.enter.searchcriteria");

        return
      }
    }
    else if (this.dataRadio == "ULD") {
      if (this.form.controls["uldType"].value == null || this.form.controls["carrierCode"].value == null) {
        this.showErrorMessage("warehouse.enter.searchcriteria");

        return
      }
    }










    /* this.form.validate();
     if (this.form.invalid) {
       return;
     }
     */
    if (!this.isFilledAtLeastOneField()) {
      this.showErrorStatus('warehouse.fillateleast.onefield');
      return;
    }
    this.resetFormMessages();
    this.service.fetchShipmentListByLocation(this.form.getRawValue()).subscribe((resp) => {
      if (!resp.messageList) {
        if (resp.data.length !== 0) {
          this.displayTable = true;
          this.form.get('shipmentList').patchValue(resp.data);

        } else {
          this.displayTable = false;
          this.showErrorMessage("warehouse.norecordfound");
        }
      } else {
        this.displayTable = false;
        this.showErrorStatus(resp.messageList[0].code);
      }
    });
  }

  onCancel() {
    this.navigateHome();

  }
  savePageValue() {
    this.savePageState("ShipmentListByLocation", this.form.getRawValue());
  }
  onClear() {
    this.initializeValues();
    // this.form.reset();
    //this.resetFormMessages();
    this.form.get('flightId').reset();
  }

  locationChanged() {
    if (this.form.get('locationCodeFrom').value || this.form.get('locationCodeTo').value) {
      this.form.get('locationCodeFrom').setValidators([Validators.required, Validators.maxLength(12)]);
      this.form.get('locationCodeTo').setValidators([Validators.required, Validators.maxLength(12)]);
    } else {
      this.form.get('locationCodeFrom').clearValidators();
      this.form.get('locationCodeTo').clearValidators();
    }
  }

  cellsRendererSNo(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  cellsRendererFlightInfo(row: number, column: string, value: any, rowData: any) {
    if (rowData.flightKey) {
      return (rowData.flightKey ? rowData.flightKey : '') + '/' + NgcUtility.getDateAsString(rowData.flightDATE ? rowData.flightDATE : '');
    } else {
      return '';
    }
  }

  /**
   * Redirects To Shipment Location
   */
  redirectToShipmentLocationBasedOnShipment() {
    this.savePageValue();
    let selectedRecord = [];
    let shipmentList = (<NgcFormArray>this.form.controls['shipmentList']).getRawValue();

    shipmentList.forEach(record => {
      if (record['recordChecked'] === true) {
        selectedRecord.push(record);
      }
    });
    if (selectedRecord.length === 0) {
      this.showErrorStatus('warehouse.select.oneshipment');
    } else if (selectedRecord.length > 1) {
      this.showErrorStatus('warehouse.select.oneshipment');
    } else {
      var dataToSend = {
        shipmentNumber: selectedRecord[0].shipmentNumber,
        shipmentType: selectedRecord[0].shipmentType
      }
      this.navigateTo(this.router, '/awbmgmt/shipmentLocation', dataToSend);
    }
  }

  onLinkClick(event) {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: event.record.shipmentNumber,
      shipmentType: event.record.shipmentType
    }
    this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', dataToSend);
  }
  onPrint() {
    this.reportParameters = new Object();
    this.reportParameters.locationTypeFlag = '0';
    this.reportParameters.locationCodeFlag = '1';
    this.reportParameters.shcFlag = '0';
    this.reportParameters.flightDateFlag = '0';
    this.reportParameters.flightKeyFlag = '0';
    this.reportParameters.carrierCodeFlag = '0';
    this.reportParameters.terminalCodeFlag = '0';
    this.reportParameters.customerCodeFlag = '0';
    this.reportParameters.shcGroupCode = '0';
    this.reportParameters.shipmentTypeExport = '0';
    this.reportParameters.shipmentTypeImport = '0';
    this.reportParameters.udtypeflag = '0';
    this.reportParameters.uldNumberFlag = '0';
    this.reportParameters.locationFrom = null;
    this.reportParameters.locationTo = null;
    this.reportParameters.uldNumber = null;
    this.reportParameters.locationType = null;
    this.reportParameters.shc = null;
    this.reportParameters.carrierCode = null;
    this.reportParameters.terminalCode = null;
    this.reportParameters.flightKey = null;
    this.reportParameters.flightDate = null;
    this.reportParameters.shcGroup = null;
    this.reportParameters.customerCode = null;
    this.reportParameters.udtype = null;
    this.reportParameters.uldlocationCodeFlag = '0';
    this.reportParameters.Domestic = '0';
    this.reportParameters.International = '0';

    if (this.form.get('locationCodeFrom').value != null && this.form.get('locationCodeTo').value != null) {
      this.reportParameters.uldlocationCodeFlag = '1'
      this.reportParameters.locationFrom = this.form.get('locationCodeFrom').value;
      this.reportParameters.locationTo = this.form.get('locationCodeTo').value;
    }
    this.reportParameters.loggedInUser = this.getUserProfile().userShortName;
    if (this.form.get('uldNumber').value != null) {
      this.reportParameters.uldNumberFlag = '1'
      this.reportParameters.uldNumber = this.form.get('uldNumber').value;
    }

    if (this.form.get('locationType').value != null) {
      this.reportParameters.locationTypeFlag = '1'
      this.reportParameters.locationType = this.form.get('locationType').value;
    }
    if (this.form.get('shc').value != null) {
      let shcValue: string = this.form.get('shc').value;
      if (shcValue.length > 0) {
        this.reportParameters.shc = this.form.get('shc').value.join(',');
        this.reportParameters.shcFlag = '1'
      }
    }
    if (this.form.get('carrierCode').value != null) {
      this.reportParameters.carrierCodeFlag = '1'
      this.reportParameters.carrierCode = this.form.get('carrierCode').value;
    }

    if (this.form.get('terminalCode').value != null) {
      this.reportParameters.terminalCodeFlag = '0'
      this.reportParameters.terminalCode = this.form.get('terminalCode').value;
    }
    if (this.form.get('flightKey').value != null) {
      this.reportParameters.flightKeyFlag = '1'
      this.reportParameters.flightKey = this.form.get('flightKey').value;
    }
    if (this.form.get('flightDate').value != null) {
      this.reportParameters.flightDateFlag = '1'
      this.reportParameters.flightDate = this.form.get('flightDate').value;

    }
    if (this.form.get('shcGroup').value != null) {
      this.reportParameters.shcGroup = this.form.get('shcGroup').value;
      this.reportParameters.shcGroupCode = '1'
    }
    if (this.form.get('domIntl').value != null) {
      if (this.form.get('domIntl').value == 'DOM') {
        this.reportParameters.domIntl = this.form.get('domIntl').value;
        this.reportParameters.Domestic = '1';
      } else if (this.form.get('domIntl').value == 'INT') {
        this.reportParameters.domIntl = this.form.get('domIntl').value;
        this.reportParameters.International = '1'
      }
    }
    if (this.form.get('domIntl').value == null || this.form.get('domIntl').value == 'All') {
      this.reportParameters.domIntl = 'All';
    }
    if (this.form.get('shipmentType').value != null) {
      if (this.form.get('shipmentType').value == 'EXPORT') {
        this.reportParameters.shipmentTypeExport = '1'
      } else if (this.form.get('shipmentType').value == 'IMPORT') {
        this.reportParameters.shipmentTypeImport = '1'
      }
    }
    if (this.form.get('customerCode').value != null) {
      this.reportParameters.customerCodeFlag = '1'
      this.reportParameters.customerCode = this.form.get('customerCode').value;
    }
    if (this.form.get('uldType').value != null) {
      this.reportParameters.udtypeflag = '1'
      this.reportParameters.udtype = this.form.get('uldType').value;
    }
    this.Report.open();
  }
  onPrintExcel() {
    this.reportParameters = new Object();
    this.reportParameters.locationTypeFlag = '0';
    this.reportParameters.locationCodeFlag = '1';
    this.reportParameters.shcFlag = '0';
    this.reportParameters.flightDateFlag = '0';
    this.reportParameters.flightKeyFlag = '0';
    this.reportParameters.carrierCodeFlag = '0';
    this.reportParameters.terminalCodeFlag = '0';
    this.reportParameters.customerCodeFlag = '0';
    this.reportParameters.shcGroupCode = '0';
    this.reportParameters.shipmentTypeExport = '0';
    this.reportParameters.shipmentTypeImport = '0';
    this.reportParameters.udtypeflag = '0';
    this.reportParameters.uldNumberFlag = '0';
    this.reportParameters.locationFrom = null;
    this.reportParameters.locationTo = null;
    this.reportParameters.uldNumber = null;
    this.reportParameters.locationType = null;
    this.reportParameters.shc = null;
    this.reportParameters.carrierCode = null;
    this.reportParameters.terminalCode = null;
    this.reportParameters.flightKey = null;
    this.reportParameters.flightDate = null;
    this.reportParameters.shcGroup = null;
    this.reportParameters.customerCode = null;
    this.reportParameters.udtype = null;
    this.reportParameters.uldlocationCodeFlag = '0';
    this.reportParameters.domIntl = null;
    this.reportParameters.Domestic = '0';
    this.reportParameters.International = '0'



    if (this.form.get('locationCodeFrom').value != null && this.form.get('locationCodeTo').value != null) {
      this.reportParameters.uldlocationCodeFlag = '1'
      this.reportParameters.locationFrom = this.form.get('locationCodeFrom').value;
      this.reportParameters.locationTo = this.form.get('locationCodeTo').value;
    }
    this.reportParameters.loggedInUser = this.getUserProfile().userShortName;
    if (this.form.get('uldNumber').value != null) {
      this.reportParameters.uldNumberFlag = '1'
      this.reportParameters.uldNumber = this.form.get('uldNumber').value;
    }

    if (this.form.get('locationType').value != null) {
      this.reportParameters.locationTypeFlag = '1'
      this.reportParameters.locationType = this.form.get('locationType').value;
    }
    if (this.form.get('shc').value != null) {
      let shcValue: string = this.form.get('shc').value;
      if (shcValue.length > 0) {
        this.reportParameters.shc = this.form.get('shc').value.join(',');
        this.reportParameters.shcFlag = '1'
      }
    }
    if (this.form.get('carrierCode').value != null) {
      this.reportParameters.carrierCodeFlag = '1'
      this.reportParameters.carrierCode = this.form.get('carrierCode').value;
    }

    if (this.form.get('terminalCode').value != null) {
      this.reportParameters.terminalCodeFlag = '0'
      this.reportParameters.terminalCode = this.form.get('terminalCode').value;
    }
    if (this.form.get('flightKey').value != null) {
      this.reportParameters.flightKeyFlag = '1'
      this.reportParameters.flightKey = this.form.get('flightKey').value;
    }
    if (this.form.get('flightDate').value != null) {
      this.reportParameters.flightDateFlag = '1'
      this.reportParameters.flightDate = this.form.get('flightDate').value;

    }
    if (this.form.get('shcGroup').value != null) {
      this.reportParameters.shcGroup = this.form.get('shcGroup').value;
      this.reportParameters.shcGroupCode = '1'
    }
    if (this.form.get('domIntl').value != null) {
      if (this.form.get('domIntl').value == 'DOM') {
        this.reportParameters.domIntl = this.form.get('domIntl').value;
        this.reportParameters.Domestic = '1';
      } else if (this.form.get('domIntl').value == 'INT') {
        this.reportParameters.domIntl = this.form.get('domIntl').value;
        this.reportParameters.International = '1'
      }
    }

    if (this.form.get('domIntl').value == null || this.form.get('domIntl').value == 'All') {
      this.reportParameters.domIntl = 'All';
    }
    if (this.form.get('shipmentType').value != null) {
      if (this.form.get('shipmentType').value == 'EXPORT') {
        this.reportParameters.shipmentTypeExport = '1'
      } else if (this.form.get('shipmentType').value == 'IMPORT') {
        this.reportParameters.shipmentTypeImport = '1'
      }
    }
    if (this.form.get('customerCode').value != null) {
      this.reportParameters.customerCodeFlag = '1'
      this.reportParameters.customerCode = this.form.get('customerCode').value;
    }
    if (this.form.get('uldType').value != null) {
      this.reportParameters.udtypeflag = '1'
      this.reportParameters.udtype = this.form.get('uldType').value;
    }

    this.ReportExcel.downloadReport();
  }

  selectType() {

    if (this.form.get("byLocation").value) {
      this.resetForRadioButton();
      this.dataRadio = "Location";
      // this.form.get("byLocation").setValue(true, { emitEvent: false, onlySelf: true });
      this.displayLocation = true;
      this.displayLocationType = false;
      this.displayUld = false;
      this.displayBtPd = false;
    } else if (this.form.get("byLocationType").value) {
      this.resetForRadioButton();
      this.dataRadio = "LocationType";
      //  this.form.get("byLocationType").setValue(true, { emitEvent: false, onlySelf: true });
      this.displayLocation = false;
      this.displayLocationType = true;
      this.displayUld = false;
      this.displayBtPd = false;
    } else if (this.form.get("byUld").value) {
      this.resetForRadioButton();
      this.dataRadio = "ULD";
      //  this.form.get("byUld").setValue(true, { emitEvent: false, onlySelf: true });
      this.displayLocation = false;
      this.displayLocationType = false;
      this.displayUld = true;
      this.displayBtPd = false;

    } else if (this.form.get("byBTPD").value) {
      this.resetForRadioButton();
      this.dataRadio = "BT";
      //  this.form.get("byBTPD").setValue(true, { emitEvent: false, onlySelf: true });
      this.displayLocation = false;
      this.displayLocationType = false;
      this.displayUld = false;
      this.displayBtPd = true;

    }
  }
  /*
      displayElement(index) {
   
        if (this.form.get('shipmentList')[index].get('pieces') == null)
          return false;
        else
          return true;
      }
   
  */
  resetForRadioButton() {
    this.form.get('locationCodeFrom').setValue(null);
    this.form.get('terminalCode').setValue(null);
    this.form.get('whslocationType').setValue(null);
    this.form.get('locationCodeTo').setValue(null);
    this.form.get('carrierCode').setValue(null);
    this.form.get('uldNumber').setValue(null);
    this.form.get('uldType').setValue(null);

  }

  public checkBoxCellStyleRender = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    const cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.serialNo === null) {
      cellsStyle.data = ' ';
      cellsStyle.allowEdit = false;
    }
    return cellsStyle;
  }

}
