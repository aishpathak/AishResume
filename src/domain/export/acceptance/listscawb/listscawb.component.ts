import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, PageConfiguration } from 'ngc-framework';
import { SCRequest, SCShipment } from '../../export.sharedmodel'
import { AcceptanceService } from '../acceptance.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'ngc-listscawb',
  templateUrl: './listscawb.component.html',
  styleUrls: ['./listscawb.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ListscawbComponent extends NgcPage {
  @ViewChild('updateWindow') updateWindow: NgcWindowComponent;
  dataDisplay: boolean = true;
  data: any = null;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private acceptanceService: AcceptanceService) {
    super(appZone, appElement, appContainerElement);
  }

  private scAwbForm: NgcFormGroup = new NgcFormGroup({
    terminal: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    dateFrom: new NgcFormControl(),
    dateTo: new NgcFormControl(),
    scAwbList: new NgcFormArray([
    ]),
    scOfficerName: new NgcFormControl('', [Validators.maxLength(35)]),
    scOfficerAirportPass: new NgcFormControl(),
    scCheckDateTime: new NgcFormControl(new Date()),
    scRemarks: new NgcFormControl('', [Validators.maxLength(250)]),
    inspectionRemarks: new NgcFormArray([
    ])
  });

  onSearch() {
    let request: SCRequest = new SCRequest();
    request = this.scAwbForm.getRawValue();
    this.acceptanceService.fetchSCShipments(request).subscribe(data => {
      this.showFormErrorMessages(data);
      this.data = data.data === null ? [] : data.data;
      this.data.forEach(element => {
        element.selectFlag = false;
        element.remark = '';
        element.scCheckDateTime = this.datepipe(element.scCheckDateTime);
      });
      this.scAwbForm.get('scAwbList').patchValue(this.data);
    }, error => {
      this.showErrorStatus(error);
    });
  }


  datepipe(inputDate) {
    if ((inputDate === '') || (inputDate === null)) {
      return inputDate;
    } else {
      const parseDate = new Date(inputDate);
      return (("0" + parseDate.getDate()).slice(-2) + this.getMonthName(parseDate.getMonth()) + parseDate.getFullYear() + ' ' + ('0' + parseDate.getHours()).slice(-2) + "." + ('0' + parseDate.getMinutes()).slice(-2) + "." + ('0' + parseDate.getSeconds()).slice(-2));
    }
  }

  getMonthName(number) {
    const monthNames = new Array('Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec');
    return monthNames[number];
  }

  onRemark(event, dataField, groupIndex, columnIndex) {
    this.scAwbForm.get('inspectionRemarks').patchValue(this.scAwbForm.getRawValue()['scAwbList'][groupIndex]['inspectionRemarks']);
    this.updateWindow.open();
  }

  onSave() {
    const formValue = this.scAwbForm.getRawValue();
    let selected = (<NgcFormArray>this.scAwbForm.get(['scAwbList'])).
      getRawValue().filter((element) => element.selectFlag == true);
    if (selected.length == 0) {
      this.showErrorMessage("export.select.atleast.one.shipment");
    }
    else if ((this.scAwbForm.get("scOfficerName").value && this.scAwbForm.get("scOfficerName").invalid) ||
      (this.scAwbForm.get("scOfficerAirportPass").value && this.scAwbForm.get("scOfficerAirportPass").invalid)) {
      return;
    }
    else {
      console.log(formValue);
      this.acceptanceService.captureSCShipments(formValue).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus('g.operation.successful');
          // this.scAwbForm.get('scOfficerName').reset();
          // this.scAwbForm.get('scOfficerAirportPass').reset();
          //  this.scAwbForm.get('scCheckDateTime').setValue(new Date());
          //  this.scAwbForm.get('scRemarks').reset();
          this.onSearch();
        }
      }, error => {
        this.showErrorStatus(error);
      });
    }
  }

  cellsRenderer(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  ngOnInit() {
  }

}
