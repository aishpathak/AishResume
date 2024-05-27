import { NgcFormControl } from 'ngc-framework';
import { UldMovmentComponent } from './../uldmovment.component';
import { UldService } from './../../uld.service';
import { ULD } from './../../uld.shared';
import { NgcPage, NgcFormGroup, PageConfiguration } from 'ngc-framework';
import { Component, OnInit, Input, ViewContainerRef, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'ngc-uldnew',
  templateUrl: './uldnew.component.html',
  styleUrls: ['./uldnew.component.scss']
})

@PageConfiguration({
  noAutoFocus: true
})

export class UldnewComponent extends NgcPage {
  // TODO Use JSDoc style comments for functions, interfaces, enums, and classes
  @Input('uldNumber') uldNumber: string;
  @Input('status') status: string;
  // TODO camelCase convention
  @Input('flaguldInout') flaguldInout: boolean;
  @Output('resetForms') resetForms = new EventEmitter<any>();

  @Input() uldNewData: NgcFormGroup;

  resp: any;
  sucess: boolean;
  errors: any[];

  // airportpositiponlist: string[] = ['Apron', 'Cargo', 'Agent'];

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    // TODO avoid names beginning with _ for custom names
    private _uldService: UldService,
    private uldMovmentComponent: UldMovmentComponent) {
    super(appZone, appElement, appContainerElement);
  }


  // TODO camelCase convention
  private uldNewform: NgcFormGroup = new NgcFormGroup
    ({
      usedBy: new NgcFormControl(),
      contourIndicator: new NgcFormControl(),
      warehouseLocation: new NgcFormControl(),
      airportPosition: new NgcFormControl(),
      UpperLowerDeckFlag: new NgcFormControl(),
      remarks: new NgcFormControl('', [Validators.maxLength(65)]),
      code: new NgcFormControl(),
      conditionType: new NgcFormControl(),
      date: new NgcFormControl(new Date()),
    });

  ngOnInit() {
    this.resp = null;
    this.sucess = false;
  }

  /***
   * This function  will work for Confirm the uld IN movement followed by IN movement.
   *
   */
  public onConfirm() {
    const self = this;
    this.showConfirmMessage('uld.action.will.cause.discrepancy').then(fulfilled => {
        this.flaguldInout = false;
        this.createUld();
        this.uldNewform.reset();
      }).catch(reason => {
        this.flaguldInout = true;
        this.uldNewform.reset();
        this.resetForms.emit();
      });
  }

  /***
   * This function  will create New ULD.
   *
   */
  public createUld() {
    if (!this.uldNumber) {
      this.showErrorStatus('uld.enter.the.uld.no.please');
    }
    if (this.flaguldInout) {
      this.onConfirm();
      return;
    }

    const reqObject: ULD = new ULD();
    if ((this.uldNewform.get('airportPosition').value) && (this.uldNewform.get('date').value)) {
      reqObject.uldNumberConcat = this.uldNumber;
      reqObject.contourIndicator = this.uldNewform.get('contourIndicator').value;
      reqObject.uldType = this.uldNumber.substr(0, 3);
      reqObject.uldNumber = this.uldNumber.substr(3, this.uldNumber.length - 5);
      reqObject.uldCarrier = this.uldNumber.substr(this.uldNumber.length - 2, this.uldNumber.length);
      reqObject.usedBy = this.uldNewform.get('usedBy').value;
      reqObject.destinationWhLocation = this.uldNewform.get('warehouseLocation').value;
      reqObject.airportPosition = this.uldNewform.get('airportPosition').value.substr(0, 1).toUpperCase();
      if ((this.uldNewform.get('date').value)) {
        reqObject.uldNumberConcat = this.uldNumber;
        reqObject.uldType = this.uldNumber.substr(0, 3);
        reqObject.uldNumber = this.uldNumber.substr(3, this.uldNumber.length - 5);
        reqObject.uldCarrier = this.uldNumber.substr(this.uldNumber.length - 2, this.uldNumber.length);
        reqObject.remarks = this.uldNewform.get('remarks').value;
        reqObject.uldDate = JSON.stringify(this.uldNewform.get('date').value);
        reqObject.uldDate = reqObject.uldDate.substring(1, reqObject.uldDate.length - 2);
        reqObject.uldDate += '0';

        console.log(JSON.stringify(reqObject));
        this._uldService.feedNewUld(reqObject).subscribe(data => {
          this.resp = data;
          this.refreshFormMessages(data);
          if (data.success) {
            //this.uldMovmentComponent.findUld(this.uldNumber);
            this.showSuccessStatus('uld.new.uld.created.sucessfully');
            this.uldNewform.reset();
            this.resetForms.emit();
          } else {
            // this.uldNewform.reset();
            this.errors = this.resp.messageList;
            this.showErrorStatus(this.errors[0].message);
          }
        }, error => this.showErrorStatus('uld.validation.error'));

      } else {
        this.showWarningStatus('uld.airpos.date.time.is.mandatory');
      }
    } else {
      this.showWarningStatus('uld.airpos.date.time.is.mandatory');
    }
  }
  /***
   * This function is to reset the current form.
   */
  public cancel() {
    this.resetForms.emit('INW');
  }
}

