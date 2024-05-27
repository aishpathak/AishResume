import { ULD } from './../../uld.shared';
import { NgcPage, NgcFormGroup, NgcFormControl, PageConfiguration } from 'ngc-framework';
import { UldService } from './../../uld.service';
import { Component, OnInit, Input, NgZone, ElementRef, ViewContainerRef, EventEmitter, Output } from '@angular/core';
import { Validators } from '@angular/forms';
// TODO Use JSDoc style comments for functions, interfaces, enums, and classes
@Component({
  selector: 'ngc-foundatapron',
  templateUrl: './foundatapron.component.html',
  styleUrls: ['./foundatapron.component.scss']
})

@PageConfiguration({
  noAutoFocus: true
})

export class FoundatapronComponent extends NgcPage implements OnInit {

  @Input('uldNumber') uldNumber: string;
  @Input('status') status: string;
  @Input('flaguldInout') flaguldInout: boolean;
  @Output('resetForms') resetForms = new EventEmitter<any>();
  @Input() newFoundAtApronForm: NgcFormGroup;
  resp: any;
  sucess: boolean;
  errors: any;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    // TODO avoid names beginning with _ for custom names
    private _uldService: UldService) {
    super(appZone, appElement, appContainerElement);
  }

  private foundatapronform: NgcFormGroup = new NgcFormGroup
    ({
      date: new NgcFormControl(new Date()),
      remarks: new NgcFormControl('', [Validators.maxLength(65)]),
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
        this.feedfoundatapron();
      }).catch(reason => {
        this.flaguldInout = true;
        this.foundatapronform.reset();
        this.resetForms.emit();
      });
  }

  /***
   * This function will update ULD movement status.
   *
   */
  // TODO use camelCase convention
  public feedfoundatapron() {
    if (!this.uldNumber) {
      this.showErrorStatus('uld.enter.the.uld.no.please');
    }

    if (this.flaguldInout) {
      this.onConfirm();
      return;
    }
    const reqObject: ULD = new ULD();

    // TODO no need to use two brackets, one is enough
    if ((this.foundatapronform.get('date').value)) {
      reqObject.uldNumberConcat = this.uldNumber;
      reqObject.uldType = this.uldNumber.substr(0, 3);
      reqObject.uldNumber = this.uldNumber.substr(3, this.uldNumber.length - 5);
      reqObject.uldCarrier = this.uldNumber.substr(this.uldNumber.length - 2, this.uldNumber.length);
      reqObject.remarks = this.foundatapronform.get('remarks').value;
      reqObject.uldDate = JSON.stringify(this.foundatapronform.get('date').value);
      reqObject.uldDate = reqObject.uldDate.substring(1, reqObject.uldDate.length - 2);
      reqObject.uldDate += '0';
      // TODO remove (or comment if code is to change in future) all console.log
      console.log(reqObject.uldDate);
      this._uldService.feedInUpdateATApron(reqObject).subscribe(data => {
        this.resp = data;
        this.refreshFormMessages(data);
        if (data.success) {
          this.showSuccessStatus('uld.uld.found.at.apron.sucessfully.saved');
          this.foundatapronform.reset();
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
    this.resetForms.emit('IFN');
  }
}
