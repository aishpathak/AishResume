import { ULD } from './../../uld.shared';
import { UldService } from './../../uld.service';
import { NgcFormGroup, NgcFormControl, NgcPage, PageConfiguration } from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Input, PipeTransform, EventEmitter, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Validators } from '@angular/forms';

// TODO If PipeTransform is not being used anywhere, please remove it.
@Component({
  selector: 'ngc-returnfromagent',
  templateUrl: './returnfromagent.component.html',
  styleUrls: ['./returnfromagent.component.scss']
})

@PageConfiguration({
  noAutoFocus: true
})
// TODO Use JSDoc style comments for functions, interfaces, enums, and classes

export class ReturnfromagentComponent extends NgcPage {

  @Input('uldNumber') uldNumber: string;
  @Input('status') status: string;
  @Input('flaguldInout') flaguldInout: boolean;
  @Output('resetForms') resetForms = new EventEmitter<any>();
  datepipe: any = new DatePipe('en-US');
  // TODO datepipe is not being used anywhere
  resp: any;
  sucess: boolean;
  errors: any;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    // TODO avoid names beginning with _ for custom names
    private _uldService: UldService) {
    super(appZone, appElement, appContainerElement);
  }

  private returnfromagentform: NgcFormGroup = new NgcFormGroup
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
   */
  public onConfirm() {
    const self = this;
    this.showConfirmMessage('uld.action.will.cause.discrepancy').then(fulfilled => {
        this.flaguldInout = false;
        this.feedreturnagent();
      }).catch(reason => {
        this.flaguldInout = true;
        this.returnfromagentform.reset();
        this.resetForms.emit();
      });
  }

  /***
   * This function will return the ULD to agent.
   */
  // TODO use camelCase below
  public feedreturnagent() {
    if (!this.uldNumber) {
      this.showErrorStatus('uld.enter.the.uld.no.please');
    }
    if (this.flaguldInout) {
      this.onConfirm();
      return;
    }

    const reqObject: ULD = new ULD();

    // TODO no need to use two brackets, one is enough
    if ((this.returnfromagentform.get('date').value)) {
      reqObject.uldNumberConcat = this.uldNumber;
      reqObject.uldType = this.uldNumber.substr(0, 3);
      reqObject.uldNumber = this.uldNumber.substr(3, this.uldNumber.length - 5);
      reqObject.uldCarrier = this.uldNumber.substr(this.uldNumber.length - 2, this.uldNumber.length);
      reqObject.remarks = this.returnfromagentform.get('remarks').value;
      reqObject.uldDate = JSON.stringify(this.returnfromagentform.get('date').value);
      reqObject.uldDate = reqObject.uldDate.substring(1, reqObject.uldDate.length - 2);
      reqObject.uldDate += '0';
      reqObject.uldTime = '';
      console.log(JSON.stringify(reqObject));
      this._uldService.feedInReturnFromAgent(reqObject).subscribe(data => {
        this.resp = data;
        this.refreshFormMessages(data);
        if (data.success) {
          this.showSuccessStatus('uld.uld.return.from.agent.sucessfully.saved');
          this.returnfromagentform.reset();
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
    this.resetForms.emit('IRA');
  }
}
