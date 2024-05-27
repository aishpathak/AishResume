import { ULD } from './../../uld.shared';
import { UldService } from './../../uld.service';
import { NgcFormControl, NgcFormGroup, NgcPage, PageConfiguration } from 'ngc-framework';
import { Component, OnInit, Input, NgZone, ElementRef, ViewContainerRef, EventEmitter, Output } from '@angular/core';
import { Validators } from '@angular/forms';
// TODO Use JSDoc style comments for functions, interfaces, enums, and classes
@Component({
  selector: 'ngc-foundatcargo',
  templateUrl: './foundatcargo.component.html',
  styleUrls: ['./foundatcargo.component.scss']
})

@PageConfiguration({
  noAutoFocus: true
})

export class FoundatcargoComponent extends NgcPage implements OnInit {

  @Input('uldNumber') uldNumber: string;
  @Input('status') status: string;
  @Input('flaguldInout') flaguldInout: boolean;
  @Output('resetForms') resetForms = new EventEmitter<any>();

  @Input() foundAtCargoForm: NgcFormGroup;
  resp: any;
  success: boolean;
  errors: any[];
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    // TODO avoid names beginning with _ for custom names
    private _uldService: UldService) {
    super(appZone, appElement, appContainerElement);
  }

  private foundatcargoform: NgcFormGroup = new NgcFormGroup
    ({
      date: new NgcFormControl(new Date()),
      remarks: new NgcFormControl('', [Validators.maxLength(65)]),
    });

  ngOnInit() {
    this.resp = null;
    this.success = false;
  }

  /***
   * This function  will work for Confirm the uld IN movement followed by IN movement.
   *
   */
  public onConfirm() {
    const self = this;
    this.showConfirmMessage('uld.action.will.cause.discrepancy').then(fulfilled => {
        this.flaguldInout = false;
        this.feedfoundatcargo();
      }).catch(reason => {
        this.flaguldInout = true;
        this.foundatcargoform.reset();
        this.resetForms.emit();
      });
  }

  /***
   * This function will upadte the ULD movement.
   *
   */
  // TODO camelCase below
  public feedfoundatcargo() {
    if (!this.uldNumber) {
      this.showErrorStatus('uld.enter.the.uld.no.please');
    }
    if (this.flaguldInout) {
      this.onConfirm();
      return;
    }

    const reqObject: ULD = new ULD();

    // TODO no need to use two brackets, one is enough
    if ((this.foundatcargoform.get('date').value)) {
      reqObject.uldNumberConcat = this.uldNumber;
      reqObject.uldType = this.uldNumber.substr(0, 3);
      reqObject.uldNumber = this.uldNumber.substr(3, this.uldNumber.length - 5);
      reqObject.uldCarrier = this.uldNumber.substr(this.uldNumber.length - 2, this.uldNumber.length);
      reqObject.remarks = this.foundatcargoform.get('remarks').value;
      reqObject.uldDate = JSON.stringify(this.foundatcargoform.get('date').value);
      reqObject.uldDate = reqObject.uldDate.substring(1, reqObject.uldDate.length - 2);
      reqObject.uldDate += '0';
      reqObject.uldTime = '';
      this._uldService.feedInUpdateATCargo(reqObject).subscribe(data => {
        this.resp = data;
        this.refreshFormMessages(data);
        if (data.success) {
          this.showSuccessStatus('uld.uld.found.at.cargo.successfully.saved');
          this.foundatcargoform.reset();
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
    this.resetForms.emit('IFW');
  }
}
