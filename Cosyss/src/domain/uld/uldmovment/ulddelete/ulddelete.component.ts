import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Input, EventEmitter, Output } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, PageConfiguration } from 'ngc-framework';
import { UldService } from '../../uld.service';
import { ULD, ULDIn } from '../../uld.shared';
import { Validators } from '@angular/forms';

@Component({
  selector: 'ngc-ulddelete',
  templateUrl: './ulddelete.component.html',
  styleUrls: ['./ulddelete.component.scss']
})

@PageConfiguration({
  noAutoFocus: true
})

export class UlddeleteComponent extends NgcPage {
  // TODO Use JSDoc style comments for functions, interfaces, enums, and classes
  @Input('uldNumber') uldNumber: string;
  @Input('status') status: string;
  // TODO use camelCase for flaguldInout and uldAgentform.
  @Input('flaguldInout') flaguldInout: boolean;
  @Output('resetForms') resetForms = new EventEmitter<any>();
  @Input() newDeleteUldForm: NgcFormGroup;
  resp: any;
  sucess: boolean;
  errors: any[];
  // TODO remove all commented code(s), which is not required anymore
  // conditionTypelist: string[] = ['Serviceable', 'Damaged'];

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    // TODO avoid names beginning with _ for custom names
    private _uldService: UldService) {
    super(appZone, appElement, appContainerElement);
  }
  // TODO camelCase for uldDeleteForm
  private uldDeleteform: NgcFormGroup = new NgcFormGroup
    ({
      conditionType: new NgcFormControl(),
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
        // TODO camelCase
        this.flaguldInout = true;
        this.deleteUld();
      }).catch(reason => {
        this.flaguldInout = false;
        this.uldDeleteform.reset();
        this.resetForms.emit();
      });
  }

  /***
   * This function will delete the ULD.
   *
   */
  public deleteUld() {
    // TODO no need to use two brackets, one is enough
    if ((this.uldDeleteform.get('date').value)) {
      if (!this.uldNumber) {
        this.showErrorStatus('uld.enter.the.uld.no.please');
      }
      if (!this.flaguldInout) {
        this.onConfirm();
        return;
      }
      if (!this.uldDeleteform.get('conditionType').value) {
        this.uldDeleteform.get('conditionType').setValue('');
      }
      const reqObject: ULD = new ULD();
      const reqObj: ULDIn = new ULDIn();
      reqObject.uldNumberConcat = this.uldNumber;
      reqObject.uldType = this.uldNumber.substr(0, 3);
      reqObject.uldNumber = this.uldNumber.substr(3, this.uldNumber.length - 5);
      reqObject.uldCarrier = this.uldNumber.substr(this.uldNumber.length - 2, this.uldNumber.length);
      reqObject.remarks = this.uldDeleteform.get('remarks').value;
      reqObject.uldDate = JSON.stringify(this.uldDeleteform.get('date').value);
      reqObject.uldDate = reqObject.uldDate.substring(1, reqObject.uldDate.length - 2);
      reqObject.uldDate += '0';
      reqObject.conditionType = (this.uldDeleteform.get('conditionType').value).substr(0, 3).toUpperCase();
      reqObject.uldIn = reqObj;
      this._uldService.deleteUld(reqObject).subscribe(data => {
        this.resp = data;
        this.refreshFormMessages(data);
        if (data.success) {
          this.showSuccessStatus('uld.uld.deleted.sucessfully');
          this.uldDeleteform.reset();
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
    this.resetForms.emit('ODL');
  }
}
