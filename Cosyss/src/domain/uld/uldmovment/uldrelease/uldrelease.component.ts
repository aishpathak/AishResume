import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Input, EventEmitter, Output } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, PageConfiguration } from 'ngc-framework';
import { UldService } from '../../uld.service';
import { ULD } from '../../uld.shared';
import { Validators } from '@angular/forms';


@Component({
  selector: 'ngc-uldrelease',
  templateUrl: './uldrelease.component.html',
  styleUrls: ['./uldrelease.component.scss']
})

@PageConfiguration({
  noAutoFocus: true
})

export class UldreleaseComponent extends NgcPage {
  // TODO Use JSDoc style comments for functions, interfaces, enums, and classes
  @Input('uldNumber') uldNumber: string;
  @Input('status') status: string;
  // TODO camelCase convention
  @Input('flaguldInout') flaguldInout: boolean;
  @Output('resetForms') resetForms = new EventEmitter<any>();
  @Input() newUldReleaseOtherGroundHandlers: NgcFormGroup;
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
  private uldReleaseform: NgcFormGroup = new NgcFormGroup
    ({
      date: new NgcFormControl(new Date()),
      remarks: new NgcFormControl()
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
        this.flaguldInout = true;
        this.releaseUld();
      }).catch(reason => {
        this.flaguldInout = false;
        this.uldReleaseform.reset();
        this.resetForms.emit();
      });
  }

  /***
  * This function will released the ULD.
  *
  */
  public releaseUld() {
    if (!this.uldNumber) {
      this.showErrorStatus('uld.enter.the.uld.no.please');
    }
    if (!this.flaguldInout) {
      this.onConfirm();
      return;
    }

    const reqObject: ULD = new ULD();
    // TODO no need to use two brackets, one is enough
    if ((this.uldReleaseform.get('date').value)) {
      reqObject.uldNumberConcat = this.uldNumber;
      reqObject.uldType = this.uldNumber.substr(0, 3);
      reqObject.uldNumber = this.uldNumber.substr(3, this.uldNumber.length - 5);
      reqObject.uldCarrier = this.uldNumber.substr(this.uldNumber.length - 2, this.uldNumber.length);
      reqObject.remarks = this.uldReleaseform.get('remarks').value;
      reqObject.uldDate = JSON.stringify(this.uldReleaseform.get('date').value);
      reqObject.uldDate = reqObject.uldDate.substring(1, reqObject.uldDate.length - 2);
      reqObject.uldDate += '0';
      reqObject.uldTime = ''; // this.uldReleaseform.get('time').value;
      this._uldService.feedReleaseUld(reqObject).subscribe(data => {
        this.resp = data;
        this.refreshFormMessages(data);
        if (data.success) {
          this.showSuccessStatus('uld.uld.released.sucessfully');
          this.resetForms.emit();
          this.uldReleaseform.reset();
        } else {
          this.errors = this.resp.messageList;
          console.log(this.errors);
          this.showErrorStatus(this.errors[0].message);
        }
      }, error => this.showErrorStatus('uld.validation.error'));

    } else {
      this.showWarningStatus('uld.date.&.time.is.mandatory');
    }
  }

  /***
  * This function is to reset the current form.
  *
  */
  public cancel() {
    this.resetForms.emit('OGH');
  }
}
