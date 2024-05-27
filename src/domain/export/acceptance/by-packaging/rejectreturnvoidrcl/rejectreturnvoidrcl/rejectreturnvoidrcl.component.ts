import { Component, OnInit } from '@angular/core';
import { ComponentFactoryResolver, ElementRef, NgZone, ViewContainerRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage } from 'ngc-framework';
import { RclserviceService } from '../../rclservice.service';


// to do
@Component({
  selector: 'app-rejectreturnvoidrcl',
  templateUrl: './rejectreturnvoidrcl.component.html',
  styleUrls: ['./rejectreturnvoidrcl.component.scss']
})

// to do
export class RejectreturnvoidrclComponent extends NgcPage implements OnInit {
  selectionRowIndex: any;
  showStorageDetails: boolean = false;
  searchResult: boolean = false;
  showTable: boolean = false;
  private RejRetVoidData = ["Reject", "Return", "Void"];

  // to do
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router, private activatedRoute: ActivatedRoute,
    appComponentResolver: ComponentFactoryResolver, private rclService: RclserviceService) {
    super(appZone, appElement, appContainerElement);
  }

  /* 
  Form for response
   */
  private rejectReturnVoidSearchForm: NgcFormGroup = new NgcFormGroup({
    shipmentDate: new NgcFormControl(),
    serviceNumber: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    actionType: new NgcFormControl(),
  });

  /* 
  Form for response
   */
  private rejectReturnVoidForm: NgcFormGroup = new NgcFormGroup({
    reason: new NgcFormControl(),
    serviceNumber: new NgcFormControl(),
    shipmentDate: new NgcFormControl(),
    reqretreasonrejectwaivechg: new NgcFormControl(),
    shipmentInfo: new NgcFormArray([
      new NgcFormGroup({
        shipmentStorageInfo: new NgcFormArray([])
      })
    ]),
  });

  /* to do */
  ngOnInit() {
  }

  search() {
    this.resetFormMessages();
    this.showTable = false;
    // For validating and displaying of error
    this.rejectReturnVoidSearchForm.validate();
    if (this.rejectReturnVoidSearchForm.invalid) {
      return;
    }
    this.rclService.get(this.rejectReturnVoidSearchForm.getRawValue()).subscribe(resp => {
      if (!this.showResponseErrorMessages(resp) && resp.data) {
        this.showTable = true;
        this.rejectReturnVoidForm.patchValue(resp.data);
      }
    });

  }

  //voidRclAndRemoveInventories
  onSave() {
    // For validating and displaying of error
    this.rejectReturnVoidForm.validate();
    if (this.rejectReturnVoidForm.invalid) {
      return;
    }
    this.rclService.process(this.rejectReturnVoidForm.getRawValue()).subscribe(resp => {

      if (!this.showResponseErrorMessages(resp) && resp.data) {
        this.showSuccessStatus('g.data.update.successful');
        this.search();
      }
    });

  }

  /* to do */
  onCancel() {
    // this.navigateBack(this.navigateData);
  }

  /* to do */
  clear(event): void {
    this.rejectReturnVoidForm.reset();
    this.rejectReturnVoidSearchForm.reset();
    this.resetFormMessages();
  }

  selectType = (data) => {
    this.rejectReturnVoidSearchForm.get('serviceNumber').clearValidators();
    this.rejectReturnVoidSearchForm.get('shipmentNumber').clearValidators();
    this.rejectReturnVoidSearchForm.get('uldNumber').clearValidators();
    this.rejectReturnVoidSearchForm.get('serviceNumber').patchValue(null);
    this.rejectReturnVoidSearchForm.get('shipmentNumber').patchValue(null);
    this.rejectReturnVoidSearchForm.get('uldNumber').patchValue(null);
    this.rejectReturnVoidForm.get('authorizedPeronalName').clearValidators();
    this.rejectReturnVoidForm.get('authorizedPeronalNumber').clearValidators();
    this.rejectReturnVoidForm.get('truckNumber').clearValidators();
    if (data == 'Void') {
      this.rejectReturnVoidSearchForm.get('serviceNumber').setValidators([Validators.required]);
    } else if (data == 'Reject') {
      this.rejectReturnVoidSearchForm.get('shipmentNumber').setValidators([Validators.required]);
      this.rejectReturnVoidSearchForm.get('uldNumber').setValidators([Validators.required]);
    } else if (data == 'Return') {
      this.rejectReturnVoidSearchForm.get('shipmentNumber').setValidators([Validators.required]);
      this.rejectReturnVoidSearchForm.get('uldNumber').setValidators([Validators.required]);
      this.rejectReturnVoidForm.get('authorizedPeronalName').setValidators([Validators.required]);
      this.rejectReturnVoidForm.get('authorizedPeronalNumber').setValidators([Validators.required]);
    }
  }
}
