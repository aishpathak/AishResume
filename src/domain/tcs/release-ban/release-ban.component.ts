import { Component, ElementRef, Input, NgZone, ViewContainerRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcFormControl
  , PageConfiguration
} from 'ngc-framework';
import { TcsService } from '../tcs.service';
@Component({
  selector: 'app-release-ban',
  templateUrl: './release-ban.component.html',
  styleUrls: ['./release-ban.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class ReleaseBanComponent extends NgcPage {

  private _vehicleNo: string;
  public popup: boolean = false;

  public releaseBanForm: NgcFormGroup = new NgcFormGroup({
    releaseban: new NgcFormGroup({
      vehicleNo: new NgcFormControl(),
      releaseRemarks: new NgcFormControl(null, Validators.required),
      banId: new NgcFormControl(),
      releaseDateTime: new NgcFormControl()
    })
  });
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private service: TcsService) {
    super(appZone, appElement, appContainerElement);
  }
  @Input('vehicleNo')

  public set vehicleNo(vehicleNo: string) {
    if (this._vehicleNo != vehicleNo) {
      this._vehicleNo = vehicleNo;
      //
      this.releaseBanForm.get('releaseban.vehicleNo').setValue(this._vehicleNo);
    }
    this.popup = true;
  }

  /**
   * Gets Vehicle No.
   */
  public get vehicleNo(): string {
    return this._vehicleNo;
  }
  /*
     Method to release truck dock
  */
  public onSave(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let releaseFormGroup = (this.releaseBanForm.get('releaseban') as NgcFormGroup)
      releaseFormGroup.validate();
      if (this.releaseBanForm.invalid) {
        return;
      }
      let rquest = { 'vehicleNo': this._vehicleNo };
      this.service.searchBanTruckInfo(rquest).subscribe((response) => {
        if (response && !this.showResponseErrorMessages(response)) {
          if (response.data && response.data.length > 0) {
            let request = response.data[0];
            request.releaseRemarks = this.releaseBanForm.get('releaseban').get('releaseRemarks').value;
            this.service.releaseBruckInfo(request).subscribe((response) => {
              if (response) {
                if (!this.showResponseErrorMessages(response)) {
                  this.showSuccessStatus("g.operation.successful");
                  releaseFormGroup.get('releaseRemarks').setValue(null);
                  resolve(true);
                }
              }
            }, error => {
              this.showErrorMessage(error)
            });
          }
        }
      });

    });
  }

  /**
* Reset Value
*/
  public resetValue(): void {
    this.releaseBanForm.reset();
    this.releaseBanForm.clearErrors();
    this.releaseBanForm.markAsPristine();
  }
}
