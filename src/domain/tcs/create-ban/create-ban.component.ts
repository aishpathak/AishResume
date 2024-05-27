import { Component, ElementRef, Input, NgZone, ViewContainerRef } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  NgcFormGroup, PageConfiguration, NgcFormControl, NgcPage
} from 'ngc-framework';
import { TcsService } from '../tcs.service';
@Component({
  selector: 'app-create-ban',
  templateUrl: './create-ban.component.html',
  styleUrls: ['./create-ban.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class CreateBanComponent extends NgcPage {
  public createBanInfoForm: NgcFormGroup = new NgcFormGroup({
    createBanInfo: new NgcFormGroup({
      vehicleNo: new NgcFormControl(null, Validators.required),
      penalty: new NgcFormControl(null, Validators.required),
      banReasonCode: new NgcFormControl(null, Validators.required),
      banStatus: new NgcFormControl(),
      fine: new NgcFormControl(),
      remarks: new NgcFormControl(),
      banPeriodFrom: new NgcFormControl(null, Validators.required),
      banPeriodTill: new NgcFormControl(null, Validators.required)
    })
  });
  public popup: boolean = false;
  private _vehicleNo: string;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private service: TcsService) {
    super(appZone, appElement, appContainerElement);
  }
  @Input('vehicleNo')
  public set vehicleNo(vehicleNo: string) {
    if (this._vehicleNo != vehicleNo) {
      this._vehicleNo = vehicleNo;
      //
      this.createBanInfoForm.get('createBanInfo.vehicleNo').setValue(this._vehicleNo);
    }
    this.popup = true;
  }

  /**
   * Gets Vehicle No.
   */
  public get vehicleNo(): string {
    return this._vehicleNo;
  }
  ngOnInit() {

  }

  /*
   *Method to save created Ban Record
   */
  public onSave(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let createGroup = (this.createBanInfoForm.get('createBanInfo') as NgcFormGroup)

      createGroup.validate();
      if (this.createBanInfoForm.invalid) {
        return;
      }
      let request = createGroup.getRawValue();
      this.service.createBanTruckInfo(request).subscribe((response) => {
        if (response) {
          if (!this.showResponseErrorMessages(response)) {
            this.showSuccessStatus("g.operation.successful");
            resolve(true);
          }
        }
      }, error => {
        this.showErrorMessage(error)
        reject(true);
      });
    });
  }

  onBanReason(event) {
    const request = { 'reasonCode': event.code };
    this.service.fetchBanReasonData(request).subscribe((response) => {
      if (response) {
        if (response && !this.showResponseErrorMessages(response)) {
          this.createBanInfoForm.get('createBanInfo').get('fine').patchValue(response.data.fine);
          this.createBanInfoForm.get('createBanInfo').get('penalty').patchValue(response.data.penalty);
          this.createBanInfoForm.get('createBanInfo').get('banStatus').patchValue('BANNED');
        }
        else {
          this.createBanInfoForm.get('createBanInfo').get('fine').patchValue(null);
          this.createBanInfoForm.get('createBanInfo').get('penalty').patchValue(null);
          this.createBanInfoForm.get('createBanInfo').get('banStatus').patchValue(null);
        }
      } error => {
        this.showErrorStatus('Error:' + error);
      }
    });
  }

  /**
* Reset Value
*/
  public resetValue(): void {
    this.createBanInfoForm.reset();
    this.createBanInfoForm.clearErrors();
    this.createBanInfoForm.markAsPristine();
  }

}

