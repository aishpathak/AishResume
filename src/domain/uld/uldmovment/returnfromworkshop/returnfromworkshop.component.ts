import { NgcFormGroup, NgcFormControl, NgcPage, PageConfiguration } from 'ngc-framework';
import { Component, OnInit, Input, NgZone, ElementRef, ViewContainerRef, EventEmitter, Output } from '@angular/core';
import { UldService } from '../../uld.service';
import { ULD } from '../../uld.shared';
import { Validators } from '@angular/forms';

@Component({
  selector: 'ngc-returnfromworkshop',
  templateUrl: './returnfromworkshop.component.html',
  styleUrls: ['./returnfromworkshop.component.scss']
})

@PageConfiguration({
  noAutoFocus: true
})

export class ReturnfromworkshopComponent extends NgcPage {
  // TODO Use JSDoc style comments for functions, interfaces, enums, and classes
  @Input('uldNumber') uldNumber: string;
  @Input('status') status: string;
  @Input('flaguldInout') flaguldInout: boolean;
  @Output('resetForms') resetForms = new EventEmitter<any>();
  @Input() returnFromWorkShopForm: NgcFormGroup;
  resp: any;
  sucess: boolean;
  errors: any[];
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    // TODO avoid names beginning with _ for custom names
    private _uldService: UldService) {
    super(appZone, appElement, appContainerElement);
  }

  private returnfromworkshopform: NgcFormGroup = new NgcFormGroup
    ({
      date: new NgcFormControl(new Date()),
      remarks: new NgcFormControl('', [Validators.maxLength(65)]),
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
        this.flaguldInout = false;
        this.feedcreaterepair();
      }).catch(reason => {
        this.flaguldInout = true;
        this.returnfromworkshopform.reset();
        this.resetForms.emit();
      });
  }

  /***
  * This function will return the ULD from workshop.
  *
  */
  // TODO use camelCase naming convention for function
  public feedcreaterepair() {
    if (!this.uldNumber) {
      this.showErrorStatus('uld.enter.the.uld.no.please');
    }
    if (this.flaguldInout) {
      this.onConfirm();
      return;
    }

    const reqObject: ULD = new ULD();
    // TODO no need to use two brackets, one is enough
    if ((this.returnfromworkshopform.get('date').value)) {
      reqObject.uldNumberConcat = this.uldNumber;
      reqObject.uldType = this.uldNumber.substr(0, 3);
      reqObject.uldNumber = this.uldNumber.substr(3, this.uldNumber.length - 5);
      reqObject.uldCarrier = this.uldNumber.substr(this.uldNumber.length - 2, this.uldNumber.length);
      reqObject.remarks = this.returnfromworkshopform.get('remarks').value;
      reqObject.uldDate = JSON.stringify(this.returnfromworkshopform.get('date').value);
      reqObject.uldDate = reqObject.uldDate.substring(1, reqObject.uldDate.length - 2);
      reqObject.uldDate += '0';
      reqObject.uldTime = '0';
      this._uldService.feedInReturnFromWorkshop(reqObject).subscribe(data => {
        this.resp = data;
        this.refreshFormMessages(data);
        if (data.success) {
          this.showSuccessStatus('uld.uld.return.from.workshop.sucessfully.saved');
          this.returnfromworkshopform.reset();
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
    this.resetForms.emit('IRF');
  }
}
