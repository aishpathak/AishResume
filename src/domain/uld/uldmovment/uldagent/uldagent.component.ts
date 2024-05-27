import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Input, EventEmitter, Output } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, PageConfiguration } from 'ngc-framework';
import { UldService } from '../../uld.service';
import { ULD } from '../../uld.shared';
import { Validators } from '@angular/forms';

@Component({
  selector: 'ngc-uldagent',
  templateUrl: './uldagent.component.html',
  styleUrls: ['./uldagent.component.scss']
})

@PageConfiguration({
  noAutoFocus: true
})

export class UldagentComponent extends NgcPage {
  // TODO Use JSDoc style comments for functions, interfaces, enums, and classes
  @Input('uldNumber') uldNumber: string;
  @Input('status') status: string;
  @Input('flaguldInout') flaguldInout: boolean;
  @Output('resetForms') resetForms = new EventEmitter<any>();
  @Input() newUldAgentForm: NgcFormGroup;
  resp: any;
  sucess: boolean;
  errors: any[];
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    // TODO avoid names beginning with _ for custom names
    private _uldService: UldService) {
    super(appZone, appElement, appContainerElement);
  }

  private uldAgentform: NgcFormGroup = new NgcFormGroup
    ({
      date: new NgcFormControl(new Date()),
      remarks: new NgcFormControl('', [Validators.maxLength(65)])
    });

  ngOnInit() {
    // TODO is there any use of setting resp by default as null
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
        this.createAgentUld();
      }).catch(reason => {
        // TODO use camelCase for flaguldInout and uldAgentform.
        this.flaguldInout = false;
        this.uldAgentform.reset();
        this.resetForms.emit();
      });
  }

  /***
   * This function  will send the ULD to agent.
   *
   */
  public createAgentUld() {
    if (!this.uldNumber) {
      this.showErrorStatus('uld.enter.the.uld.no.please');
    }
    if (!this.flaguldInout) {
      this.onConfirm();
      return;
    }

    // TODO PascalCase should be followed for interface/class names (should be Uld instead of ULD)
    const reqObject: ULD = new ULD();

    // TODO no need to use two brackets, one is enough
    if ((this.uldAgentform.get('date').value)) {
      reqObject.uldNumberConcat = this.uldNumber;
      reqObject.uldType = this.uldNumber.substr(0, 3);
      reqObject.uldNumber = this.uldNumber.substr(3, this.uldNumber.length - 5);
      reqObject.uldCarrier = this.uldNumber.substr(this.uldNumber.length - 2, this.uldNumber.length);
      reqObject.remarks = this.uldAgentform.get('remarks').value;
      reqObject.uldDate = JSON.stringify(this.uldAgentform.get('date').value);
      reqObject.uldDate = reqObject.uldDate.substring(1, reqObject.uldDate.length - 2);
      reqObject.uldDate += '0';
      reqObject.uldTime = '0';
      this._uldService.feedAgentUld(reqObject).subscribe(data => {
        this.resp = data;
        this.refreshFormMessages(data);
        if (data.success) {
          this.showSuccessStatus('uld.uld.sent.to.agent.sucessfully.saved');
          this.uldAgentform.reset();
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
    this.resetForms.emit('ORA');
  }
}
