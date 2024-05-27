import { Component, ComponentFactoryResolver, ElementRef, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcApplication, NgcButtonComponent, NgcFormArray, NgcFormControl, NgcFormGroup, NgcReportComponent } from 'ngc-framework';
import { UldService } from './../uld.service';
import { templogRequest, UldTempratureRequest } from './../uld.shared';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-temp-log',
  templateUrl: './temp-log.component.html',
  styleUrls: ['./temp-log.component.scss']
})
export class TempLogComponent extends NgcApplication {
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  @ViewChild('searchButton') searchButton: NgcButtonComponent;
  @ViewChild('addButton') addButton: NgcButtonComponent;
  reportParameters: any;
  test: any;
  showTable: boolean;
  show: boolean = false;
  resp: any;
  fromDate: any;
  arr = [] as any;
  tmpLogList: any[];
  showDataTable = false;
  uldstempraturelogform: NgcFormGroup = new NgcFormGroup({
    uldKey: new NgcFormControl(), fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    tmpLogList: new NgcFormArray([
      new NgcFormGroup({
        uldTemperatureLogId: new NgcFormControl(),
        uldKey: new NgcFormControl(),
        temperatureType: new NgcFormControl(),
        temperatureTypeValue: new NgcFormControl(),
        uldevent: new NgcFormControl(),
        temperatureValue: new NgcFormControl(),
        temperatureCaptureDt: new NgcFormControl(),
        remarks: new NgcFormControl(),
        cancel: new NgcFormControl(),
        flagCRUD: new NgcFormControl()
      })
    ]),
  });
  constructor(appZone: NgZone
    , appElement: ElementRef
    , appContainerElement: ViewContainerRef
    , private uldService: UldService, private datePipe: DatePipe
    , appComponentResolver: ComponentFactoryResolver) {
    super(appZone, appElement, appContainerElement, appComponentResolver);
    this.showDataTable = false;
  }

  ngOnInit() {
  }

  public getUldList() {
    const uldInventoryrequest: UldTempratureRequest = new UldTempratureRequest();
    uldInventoryrequest.uldKey = this.uldstempraturelogform.get('uldKey').value;
    uldInventoryrequest.fromDate = this.uldstempraturelogform.get('fromDate').value;
    uldInventoryrequest.toDate = this.uldstempraturelogform.get('toDate').value;
    this.uldstempraturelogform.get('tmpLogList').patchValue(new Array());
    if (uldInventoryrequest.uldKey === null) {
      this.showErrorStatus('uld.details.required');
      return;
    }
    this.uldService.getUldTemperatureDetails(uldInventoryrequest).subscribe(data => {
      this.refreshFormMessages(data);
      this.resp = data;
      if (!this.showResponseErrorMessages(data)) {
        if (this.resp.data.length > 0) {
          this.showDataTable = true;
          this.arr = JSON.parse(JSON.stringify(this.resp.data));
          for (let i = 0; i < this.arr.length; i++) {
            this.arr[i].uldTemperatureLogId = (i + 1);
          }
          this.uldstempraturelogform.get(['tmpLogList']).patchValue(this.arr);
          this.arr = (this.uldstempraturelogform.get(['tmpLogList']) as NgcFormArray).getRawValue();
        } else {
          this.showErrorStatus('no.record.found');
          this.showDataTable = false;
        }
      }
    }, error => {
      this.showErrorStatus('uld.an.error.occured.please.try.again!!');
      this.searchButton.disabled = false;
      this.showDataTable = false;
    });
  }


  save(event) {

    let obj = new templogRequest();
    obj.arr = (this.uldstempraturelogform.get(['tmpLogList']) as NgcFormArray).getRawValue().filter(obj => obj.flagCRUD === 'C');
    obj.uldKey = 'AKE44783AI';
    let mandtCheck = true;
    if (obj.arr.length > 0) {
      obj.arr.forEach((value) => {
        if (!(value.uldKey && value.uldevent && value.temperatureValue && value.temperatureCaptureDt)) {
          mandtCheck = false;
        }
        let captDate = value.temperatureCaptureDt;
        value.temperatureCaptureDt = captDate;
      });
      if (mandtCheck == true) {
        this.uldService.addUldTemperatureDetails(obj).subscribe(data => {
          if (data.confirmMessage == true) {
            this.showSuccessStatus("status.Success");
            (this.uldstempraturelogform.get(['tmpLogList']) as NgcFormArray).disable();
          }
          else {
            this.showErrorStatus('uld.an.error.occured.please.try.again!!');
          }
        });
      }
    }
    else {
      this.showErrorStatus('USER_MGMT_INSERT_UPDATE_ERROR');
    }
  }

  deleteLooseShipment(event, index, segmentrow) {
    let obj = (this.uldstempraturelogform.get(['tmpLogList']) as NgcFormArray).getRawValue();
    if (obj[index].flagCRUD === 'C') {
      obj.splice(index, 1);
      this.uldstempraturelogform.get('tmpLogList').patchValue(obj);
    }
    else {
      this.showConfirmMessage('export.are.you.sure.to.delete').then(fulfilled => {
        obj[index].uldTemperatureLogId = this.resp.data[index].uldTemperatureLogId;
        this.uldService.deleteUldTemperatureDetails(obj[index]).subscribe(data => {
          if (data.confirmMessage == true) {
            this.showSuccessStatus('g.deleted.successfully');
            (this.uldstempraturelogform.get(['tmpLogList']) as NgcFormArray).removeAt(index);
          }
          else {
            this.showErrorStatus('uld.an.error.occured.please.try.again!!');
          }
        });
      });
    }
  }

  add() {
    (<NgcFormArray>this.uldstempraturelogform.get('tmpLogList')).addValue([
      {
        uldTemperatureLogId: '',
        uldKey: '',
        temperatureType: '',
        temperatureTypeValue: '',
        uldevent: '',
        temperatureValue: '',
        temperatureCaptureDt: this.formatDate(""),
        remarks: ''
      }
    ]);
  }

  private formatDate(dateStr) {
    let date = new Date(dateStr);
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  print() {
    this.reportParameters = new Object();
    this.reportParameters.uld = this.uldstempraturelogform.get('uldKey').value;
    this.reportParameters.toDate = this.datePipe.transform(this.uldstempraturelogform.get('toDate').value, 'yyyy-MM-dd');
    this.reportParameters.fromDate = this.datePipe.transform(this.uldstempraturelogform.get('fromDate').value, 'yyyy-MM-dd');
    this.reportParameters.valid = this.reportParameters.fromDate && this.reportParameters.toDate ? '1' : '0';
    this.reportWindow.reportParameters = this.reportParameters;
    this.reportWindow.open();
  }

}
