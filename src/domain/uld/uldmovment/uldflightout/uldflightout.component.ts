import { ULDIn } from './../../uld.shared';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcDropDownComponent, PageConfiguration } from 'ngc-framework';
import { UldService } from '../../uld.service';
import { ULD } from '../../uld.shared';
import { Validators } from '@angular/forms';

@Component({
  selector: 'ngc-uldflightout',
  templateUrl: './uldflightout.component.html',
  styleUrls: ['./uldflightout.component.scss']
})

@PageConfiguration({
  noAutoFocus: true
})

export class UldflightoutComponent extends NgcPage {
  // TODO Use JSDoc style comments for functions, interfaces, enums, and classes
  @Input('uldNumber') uldNumber: string;
  @Input('status') status: string;
  // TODO camelCase convention
  @Input('flaguldInout') flaguldInout: boolean;
  @Output('resetForms') resetForms = new EventEmitter<any>();
  @ViewChild('arrdropdown') arrdropdown: NgcDropDownComponent;
  @ViewChild('desdropdown') desdropdown: NgcDropDownComponent;
  @Input() newUldFlightOutForm: NgcFormGroup;
  resp: any;
  sucess: boolean;
  errors: any[];
  // conditionTypelist: string[] = ['Serviceable', 'Damaged'];
  // airportpositiponlist: string[] = ['Apron', 'Cargo', 'Agent'];
  destAirportlist: any[] = [];
  originAirportlist: any[] = [];
  fltdtlresp: any;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    // TODO avoid names beginning with _ for custom names
    private _uldService: UldService) {
    super(appZone, appElement, appContainerElement);
  }
  // TODO camelCase convention
  private uldFlightoutform: NgcFormGroup = new NgcFormGroup
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
    this.showConfirmMessage('uld.uld.is.in.out.warn').then(fulfilled => {
      this.flaguldInout = true;
      this.flightOutUld();
    }).catch(reason => {
      this.uldFlightoutform.reset();
      this.resetForms.emit();
    });
  }

  /***
   * This function will create the out-flight for the ULD.
   *
   */
  public flightOutUld() {
    if ((this.uldFlightoutform.get('date').value) &&
      (this.uldFlightoutform.get('airportPosition').value) && (this.uldFlightoutform.get('destAirport').value)
      && (this.uldFlightoutform.get('depDate').value) && (this.uldFlightoutform.get('flight').value)) {
      if (!this.uldNumber) {
        this.showErrorStatus('uld.enter.the.uld.no.please');
      }
      if (!this.flaguldInout) {
        this.onConfirm();
        return;
      }
      if (!this.uldFlightoutform.get('conditionType').value) {
        // TODO instead use .setValue(' '), i.e. single space
        this.uldFlightoutform.get('conditionType').setValue('   ');
      }

      const reqObj: ULD = new ULD();
      const reqObject: ULDIn = new ULDIn();
      reqObj.flight = this.uldFlightoutform.get('flight').value;
      reqObject.flightKey = this.uldFlightoutform.get('flight').value;
      // reqObject.fltCarrier = (this.uldFlightoutform.get('flight').value).substr(0, 2);
      // reqObject.fltNumber = (this.uldFlightoutform.get('flight').value).substr(2, this.uldFlightoutform.get('flight').value.length - 2);
      reqObject.depDate = JSON.stringify(this.uldFlightoutform.get('depDate').value);
      reqObject.depDate = reqObject.depDate.substring(1, reqObject.depDate.length - 2);
      reqObject.depDate += '0';
      reqObject.aptOff = this.uldFlightoutform.get('destAirport').value;
      reqObject.aptBrd = this.uldFlightoutform.get('originAirport').value;
      reqObject.actualDepDate = JSON.stringify(this.uldFlightoutform.get('actualDepDate').value);
      reqObject.actualDepDate = reqObject.actualDepDate.substring(1, reqObject.actualDepDate.length - 2);
      reqObject.actualDepDate += '0';
      reqObject.actualDepTime = '0';
      reqObject.estimatedDepDate = JSON.stringify(this.uldFlightoutform.get('estimatedDepDate').value);
      reqObject.estimatedDepDate = reqObject.estimatedDepDate.substring(1, reqObject.estimatedDepDate.length - 2);
      reqObject.estimatedDepDate += '0';
      reqObject.estimatedDepTime = '0';
      reqObject.estimatedDepDate = JSON.stringify(this.uldFlightoutform.get('scheduledDepDate').value);
      reqObject.estimatedDepDate = reqObject.estimatedDepDate.substring(1, reqObject.estimatedDepDate.length - 2);
      reqObject.estimatedDepDate += '0';
      reqObject.scheduledDepTime = '0';
      reqObj.conditionType = this.uldFlightoutform.get('conditionType').value.substr(0, 3).toUpperCase();
      reqObj.contentsCode = this.uldFlightoutform.get('contentsCode').value;
      reqObj.airportPosition = this.uldFlightoutform.get('airportPosition').value.substr(0, 1).toUpperCase();
      reqObj.uldNumberConcat = this.uldNumber;
      reqObj.uldType = this.uldNumber.substr(0, 3);
      reqObj.uldNumber = this.uldNumber.substr(3, this.uldNumber.length - 5);
      reqObj.uldCarrier = this.uldNumber.substr(this.uldNumber.length - 2, this.uldNumber.length);
      reqObj.remarks = this.uldFlightoutform.get('remarks').value;
      reqObj.uldDate = JSON.stringify(this.uldFlightoutform.get('date').value);
      reqObj.uldDate = reqObj.uldDate.substring(1, reqObj.uldDate.length - 2);
      reqObj.uldDate += '0';
      reqObj.uldTime = '';
      reqObj.uldIn = reqObject;
      reqObj.uldIn = reqObject;

      this._uldService.feedFlightOutUld(reqObj).subscribe(data => {
        this.resp = data;
        this.refreshFormMessages(data);
        if (data.success) {
          this.showSuccessStatus('uld.uld.to.flight.sucessfully.saved');
          this.uldFlightoutform.reset();
          this.resetForms.emit();
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors[0].message);
        }
      }, error => this.showErrorStatus('uld.validation.error'));
    } else {
      this.showWarningStatus('uld.date.time.airport.position.dest.airport.is.mandatory');
    }
  }

  /***
  * This function is to reset the current form.
  */
  public cancel() {
    this.resetForms.emit('OFL');
  }

  /***
  * This function will get the flight details.
  */
  public onChange(event) {
    const reqObject: ULD = new ULD();
    const reqObj: ULDIn = new ULDIn();
    reqObj.flightKey = this.uldFlightoutform.get('flight').value;
    console.log(this.uldFlightoutform.get('depDate').value);
    reqObj.depDate = JSON.stringify(this.uldFlightoutform.get('depDate').value);
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
          }),
            this.arrdropdown.source = this.destAirportlist;
          this.desdropdown.source = this.originAirportlist;
          console.log(this.originAirportlist);
          console.log(event);
        } else {
          this.showInfoStatus('uld.no.flight');
        }
      });
    }
  }
}
