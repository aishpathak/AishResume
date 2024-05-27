import { DatePipe } from '@angular/common';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Input, PipeTransform, EventEmitter, Output } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, PageConfiguration } from 'ngc-framework';
import { UldService } from '../../uld.service';
import { ULD } from '../../uld.shared';
import { Validators } from '@angular/forms';

@Component({
  selector: 'ngc-uldmissingapron',
  templateUrl: './uldmissingapron.component.html',
  styleUrls: ['./uldmissingapron.component.scss']
})

@PageConfiguration({
  noAutoFocus: true
})

export class UldmissingapronComponent extends NgcPage {
  // TODO Use JSDoc style comments for functions, interfaces, enums, and classes
  @Input('uldNumber') uldNumber: string;
  @Input('status') status: string;
  @Input('flaguldInout') flaguldInout: boolean;
  @Output('resetForms') resetForms = new EventEmitter<any>();
  @Input() newUldMissingAtApron: NgcFormGroup;
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
  private uldApronform: NgcFormGroup = new NgcFormGroup
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
        this.missingApronUld();
      }).catch(reason => {
        this.flaguldInout = false;
        this.uldApronform.reset();
        this.resetForms.emit();
      });
  }

  /***
   * This function will update ULD missing status from Apron.
   *
   */
  public missingApronUld() {
    if (!this.uldNumber) {
      this.showErrorStatus('uld.enter.the.uld.no.please');
    }
    if (!this.flaguldInout) {
      this.onConfirm();
      return;
    }

    const reqObject: ULD = new ULD();
    // TODO no need to use two brackets, one is enough
    if ((this.uldApronform.get('date').value)) {
      reqObject.uldNumberConcat = this.uldNumber;
      reqObject.uldType = this.uldNumber.substr(0, 3);
      reqObject.uldNumber = this.uldNumber.substr(3, this.uldNumber.length - 5);
      reqObject.uldCarrier = this.uldNumber.substr(this.uldNumber.length - 2, this.uldNumber.length);
      reqObject.remarks = this.uldApronform.get('remarks').value;
      reqObject.uldDate = JSON.stringify(this.uldApronform.get('date').value);
      reqObject.uldDate = reqObject.uldDate.substring(1, reqObject.uldDate.length - 2);
      reqObject.uldDate += '0';
      reqObject.uldTime = '';
      this._uldService.feedApronUld(reqObject).subscribe(data => {
        this.resp = data;
        this.refreshFormMessages(data);
        console.log(this.resp);
        if (data.success) {
          this.showSuccessStatus('uld.uld.missing.at.apron.sucessfully.saved');
          this.uldApronform.reset();
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
    this.resetForms.emit('OLS');
  }
}
