import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, PageConfiguration } from 'ngc-framework';
import { UldService } from '../../uld.service';
import { ULD } from '../../uld.shared';

@Component({
  selector: 'ngc-uldrepair',
  templateUrl: './uldrepair.component.html',
  styleUrls: ['./uldrepair.component.scss']
})

@PageConfiguration({
  noAutoFocus: true
})

export class UldrepairComponent extends NgcPage implements OnInit {
  // TODO Use JSDoc style comments for functions, interfaces, enums, and classes
  conditionType: string;
  @Input('uldNumber') uldNumber: string;
  @Input('status') status: string;
  @Input('flaguldInout') flaguldInout: boolean;
  @Output('resetForms') resetForms = new EventEmitter<any>();
  @Input() newUldRepairForm: NgcFormGroup;

  resp: any;
  sucess: boolean;
  formDisplay = true;
  errors: any[];

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    // TODO avoid names beginning with _ for custom names
    private _uldService: UldService) {
    super(appZone, appElement, appContainerElement);
  }

  // TODO camelCase convention
  private uldRepairform: NgcFormGroup = new NgcFormGroup
    ({
      date: new NgcFormControl(new Date()),
      remarks: new NgcFormControl()
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
        this.createRepairUld();
      }).catch(reason => {
        this.flaguldInout = false;
        this.uldRepairform.reset();
        this.resetForms.emit();
      });
  }

  /***
   * This function  is to repaire existing ULD.
   *
   */
  public createRepairUld() {
    if (!this.uldNumber) {
      this.showErrorStatus('uld.enter.the.uld.no.please');
    }
    if (!this.flaguldInout) {
      this.onConfirm();
      return;
    }
    const reqObject: ULD = new ULD();
    // TODO no need to use two brackets, one is enough
    if ((this.uldRepairform.get('date').value)) {
      reqObject.uldNumberConcat = this.uldNumber;
      reqObject.uldType = this.uldNumber.substr(0, 3);
      reqObject.uldNumber = this.uldNumber.substr(3, this.uldNumber.length - 5);
      reqObject.uldCarrier = this.uldNumber.substr(this.uldNumber.length - 2, this.uldNumber.length);
      reqObject.remarks = this.uldRepairform.get('remarks').value;
      // this.conditionType = this.resp.data.conditionType==='SER'?'Damaged':'Serviceable';
      reqObject.uldDate = JSON.stringify(this.uldRepairform.get('date').value);
      reqObject.uldDate = reqObject.uldDate.substring(1, reqObject.uldDate.length - 2);
      reqObject.uldDate += '0';
      reqObject.uldTime = '';
      this._uldService.feedRepairUld(reqObject).subscribe(data => {
        this.resp = data;
        this.refreshFormMessages(data);
        if (data.success) {
          this.showSuccessStatus('uld.uld.repaired.sucessfully');
          this.resetForms.emit();
          this.uldRepairform.reset();
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
    this.resetForms.emit('ORP');
  }
}
