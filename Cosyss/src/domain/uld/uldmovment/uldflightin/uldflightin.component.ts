import { UpdateUserComponent } from './../../../admin/user/update-user/update-user.component';
import { ULDIn } from './../../uld.shared';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcDropDownComponent, PageConfiguration } from 'ngc-framework';
import { UldService } from '../../uld.service';
import { ULD } from '../../uld.shared';
import { Validators } from '@angular/forms';

@Component({
  selector: 'ngc-uldflightin',
  templateUrl: './uldflightin.component.html',
  styleUrls: ['./uldflightin.component.scss']
})
@PageConfiguration({
  noAutoFocus: true
})
export class UldFlightInComponent extends NgcPage {
  // TODO Use JSDoc style comments for functions, interfaces, enums, and classes
  @Input('uldNumber') uldNumber: string;
  @Input('status') status: string;
  @Input('flaguldInout') flaguldInout: boolean;
  @ViewChild('arrdropdown') arrdropdown: NgcDropDownComponent;
  @ViewChild('desdropdown') desdropdown: NgcDropDownComponent;
  @Output('resetForms') resetForms = new EventEmitter<any>();

  @Input() uldFlightData: NgcFormGroup;
  resp: any;
  // TODO camelCase convention
  fltdtlresp: any;
  sucess: boolean;
  errors: any[];

  destAirportlist: any[] = [];
  originAirportlist: any[] = [];
  // TODO camelCase convention
  currentdate: any;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    // TODO avoid names beginning with _ for custom names
    private _uldService: UldService) {
    super(appZone, appElement, appContainerElement);
  }
  // TODO camelCase convention
  private uldFlightinform: NgcFormGroup = new NgcFormGroup
    ({
      flight: new NgcFormControl(),
      depDate: new NgcFormControl(new Date()),
      destAirport: new NgcFormControl(),
      originAirport: new NgcFormControl(),
      actualDepDate: new NgcFormControl(new Date()),
      actualDepTime: new NgcFormControl(),
      estimatedDepDate: new NgcFormControl(new Date()),
      estimatedDepTime: new NgcFormControl(),
      scheduledDepDate: new NgcFormControl(new Date()),
      scheduledDepTime: new NgcFormControl(),
      conditionType: new NgcFormControl(),
      date: new NgcFormControl(new Date()),
      contentsCode: new NgcFormControl(),
      time: new NgcFormControl(),
      airportPosition: new NgcFormControl(),
      remarks: new NgcFormControl('', [Validators.maxLength(65)])
    });

  ngOnInit() {
    this.resp = null;
    this.sucess = false;
  }

  /***
  * This function  will work for Confirm the uld movement followed by same movement.
  *
  */
  public onConfirm() {
    const self = this;
    this.showConfirmMessage('uld.action.will.cause.discrepancy').then(fulfilled => {
        this.flaguldInout = true;
        this.flightInUld();
      }).catch(reason => {
        this.flaguldInout = false;
        this.uldFlightinform.reset();
        this.resetForms.emit();
      });
  }

  /***
   * This function will create the in-flight for the ULD.
   *
   */
  public flightInUld() {
    if ((this.uldFlightinform.get('flight').value) && (this.uldFlightinform.get('originAirport').value)
      && (this.uldFlightinform.get('airportPosition').value)) {
      if (!this.uldNumber) {
        this.showErrorStatus('uld.enter.the.uld.no.please');
      }
      if (!this.flaguldInout) {
        this.onConfirm();
        return;
      }
      if (!this.uldFlightinform.get('conditionType').value) {
        this.uldFlightinform.get('conditionType').setValue('   ');
      }

      const reqObj: ULD = new ULD();
      const reqObject: ULDIn = new ULDIn();
      reqObj.flight = this.uldFlightinform.get('flight').value;
      reqObject.flightKey = this.uldFlightinform.get('flight').value;
      // reqObject.fltCarrier = (this.uldFlightinform.get('flight').value).substr(0, 2);
      // reqObject.fltNumber = (this.uldFlightinform.get('flight').value).substr(2, this.uldFlightinform.get('flight').value.length - 2);
      reqObject.depDate = JSON.stringify(this.uldFlightinform.get('depDate').value);
      reqObject.depDate = reqObject.depDate.substring(1, reqObject.depDate.length - 2);
      reqObject.depDate += '0';

      reqObject.aptOff = this.uldFlightinform.get('destAirport').value;
      reqObject.aptBrd = this.uldFlightinform.get('originAirport').value;
      reqObject.actualDepDate = JSON.stringify(this.uldFlightinform.get('actualDepDate').value);
      reqObject.actualDepDate = reqObject.actualDepDate.substring(1, reqObject.actualDepDate.length - 2);
      reqObject.actualDepDate += '0';
      reqObject.actualDepTime = '0';
      reqObject.estimatedDepDate = JSON.stringify(this.uldFlightinform.get('estimatedDepDate').value);
      reqObject.estimatedDepDate = reqObject.estimatedDepDate.substring(1, reqObject.estimatedDepDate.length - 2);
      reqObject.estimatedDepDate += '0';

      reqObject.estimatedDepTime = '0';
      reqObject.scheduledDepDate = JSON.stringify(this.uldFlightinform.get('scheduledDepDate').value);
      reqObject.scheduledDepDate = reqObject.scheduledDepDate.substring(1, reqObject.scheduledDepDate.length - 2);
      reqObject.scheduledDepDate += '0';
      reqObject.scheduledDepTime = '0';
      reqObj.conditionType = this.uldFlightinform.get('conditionType').value.substr(0, 3).toUpperCase();
      reqObj.contentsCode = this.uldFlightinform.get('contentsCode').value;
      reqObj.airportPosition = this.uldFlightinform.get('airportPosition').value.substr(0, 1).toUpperCase();
      reqObj.uldNumberConcat = this.uldNumber;
      reqObj.uldType = this.uldNumber.substr(0, 3);
      reqObj.uldNumber = this.uldNumber.substr(3, this.uldNumber.length - 5);
      reqObj.uldCarrier = this.uldNumber.substr(this.uldNumber.length - 2, this.uldNumber.length);
      reqObj.remarks = this.uldFlightinform.get('remarks').value;
      reqObj.uldDate = JSON.stringify(this.uldFlightinform.get('date').value);
      reqObj.uldDate = reqObj.uldDate.substring(1, reqObj.uldDate.length - 2);
      reqObj.uldDate += '0';
      reqObj.uldTime = '0';
      reqObj.uldIn = reqObject;
      if ((this.uldFlightinform.get('date').value)
        && (this.uldFlightinform.get('flight').value)
        && (this.uldFlightinform.get('originAirport').value)
        && (this.uldFlightinform.get('airportPosition').value)) {
        this._uldService.feedFlightInUld(reqObj).subscribe(data => {
          this.resp = data;
          this.refreshFormMessages(data);
          if (data.success) {
            this.showSuccessStatus('uld.uld.movement.sucessfully.saved');
            this.uldFlightinform.reset();
            this.resetForms.emit();
            return;
          } else {
            this.errors = this.resp.messageList;
            this.showErrorStatus(this.errors[0].message);
          }
        }); 
      } else {
        this.showWarningStatus('uld.flight.originairport.&.airportPosition.is.mandatory');
      }
    } else {
      this.showWarningStatus('uld.flight.originairport.&.airportPosition.is.mandatory');
    }
  }

  /***
  * This function is to reset the current form.
  */
  public cancel() {
    this.resetForms.emit('IFL');
  }

  /***
  * This function will get the flight details.
  */
  public onChange(event) {
    const reqObject: ULD = new ULD();
    const reqObj: ULDIn = new ULDIn();
    reqObj.flightKey = this.uldFlightinform.get('flight').value;
    reqObj.depDate = JSON.stringify(this.uldFlightinform.get('depDate').value);
    reqObj.depDate = reqObj.depDate.substring(1, reqObj.depDate.length - 2);
    reqObj.depDate += '0';
    reqObject.uldIn = reqObj;
    if (reqObj.flightKey !== null) {
      this._uldService.getflightdetails(reqObject).subscribe(data => {
        console.log(JSON.stringify(data));
        this.refreshFormMessages(data);
        if (data.data !== null) {
          this.fltdtlresp = data.data;
          console.log(this.fltdtlresp);
          this.fltdtlresp.forEach(element => {
            this.destAirportlist.push(
              element.aptBrd
            );
            this.originAirportlist.push(
              element.aptOff
            );
          });
          this.arrdropdown.source = this.destAirportlist;
          this.desdropdown.source = this.originAirportlist;
        } else {
          this.showInfoStatus('uld.no.flight');
        }
      });
    }
  }
}
