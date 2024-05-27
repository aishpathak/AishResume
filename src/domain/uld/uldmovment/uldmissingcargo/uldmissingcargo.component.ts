import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Input, EventEmitter, Output } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, PageConfiguration } from 'ngc-framework';
import { UldService } from '../../uld.service';
import { ULD } from '../../uld.shared';
import { Validators } from '@angular/forms';

@Component({
  selector: 'ngc-uldmissingcargo',
  templateUrl: './uldmissingcargo.component.html',
  styleUrls: ['./uldmissingcargo.component.scss']
})

@PageConfiguration({
  noAutoFocus: true
})

export class UldmissingcargoComponent extends NgcPage {
  // TODO Use JSDoc style comments for functions, interfaces, enums, and classes
  @Input('uldNumber') uldNumber: string;
  @Input('status') status: string;
  // TODO camelCase convention
  @Input('flaguldInout') flaguldInout: boolean;
  @Output('resetForms') resetForms = new EventEmitter<any>();
  @Input() newUldMissingAtCargoForm: NgcFormGroup;

  resp: any;
  sucess: boolean;
  errors: any[];

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    // TODO avoid names beginning with _ for custom names
    private _uldService: UldService) {
    super(appZone, appElement, appContainerElement);
  }
  // TODO camelCase convention
  private uldCargoform: NgcFormGroup = new NgcFormGroup
    ({
      date: new NgcFormControl(new Date()),
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
        this.missingCargoUld();
      }).catch(reason => {
        this.flaguldInout = false;
        this.uldCargoform.reset();
        this.resetForms.emit();
      });
  }

  /***
   * This function will update ULD missing status from Cargo.
   *
   */
  public missingCargoUld() {
    if (!this.uldNumber) {
      this.showErrorStatus('uld.enter.the.uld.no.please');
    }
    if (!this.flaguldInout) {
      this.onConfirm();
      return;
    }

    const reqObject: ULD = new ULD();
    // TODO no need to use two brackets, one is enough
    if ((this.uldCargoform.get('date').value)) {
      reqObject.uldNumberConcat = this.uldNumber;
      reqObject.uldType = this.uldNumber.substr(0, 3);
      reqObject.uldNumber = this.uldNumber.substr(3, this.uldNumber.length - 5);
      reqObject.uldCarrier = this.uldNumber.substr(this.uldNumber.length - 2, this.uldNumber.length);
      reqObject.remarks = this.uldCargoform.get('remarks').value;
      reqObject.uldDate = JSON.stringify(this.uldCargoform.get('date').value);
      reqObject.uldDate = reqObject.uldDate.substring(1, reqObject.uldDate.length - 2);
      reqObject.uldDate += '0';
      reqObject.uldTime = '';
      this._uldService.feedCargoUld(reqObject).subscribe(data => {
        this.resp = data;
        this.refreshFormMessages(data);
        if (data.success) {
          this.showSuccessStatus('uld.uld.movement.sucessfully.saved');
          this.uldCargoform.reset();
          this.resetForms.emit();
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors[0].message);
        }
      }, error => this.showErrorStatus('uld.validation.error'));

    } else {
      this.showWarningStatus('uld.date.&.time.is.mandatory');
    }
  }

  /***
  * This function is to reset the current form.
  */
  public cancel() {
    this.resetForms.emit('OLW');
  }
}
