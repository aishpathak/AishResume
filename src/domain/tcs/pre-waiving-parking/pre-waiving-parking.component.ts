import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  NgcPage, StatusMessage, PageConfiguration,
  NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcUtility
} from 'ngc-framework';
import { TcsService } from '../tcs.service';
import { PreWaiveParkingModel } from '../tcs.sharedmodel';

@Component({
  selector: 'app-pre-waiving-parking',
  templateUrl: './pre-waiving-parking.component.html',
  // styleUrls: ['./pre-waiving-parking.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class PreWaivingParkingComponent extends NgcPage {
  @ViewChild('createUpdateWindow') createUpdateWindow: NgcWindowComponent;
  windowType: string;
  showData: boolean = false;

  /**
   * Initialize
   *
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private tcsService: TcsService) {
    //
    super(appZone, appElement, appContainerElement);
  }

  //Pre-waive Search form
  public preWaivingParkActivitySearchForm: NgcFormGroup = new NgcFormGroup({
    vehicleNo: new NgcFormControl(),
    effectiveFromDateTime: new NgcFormControl(),
    effectiveTillDateTime: new NgcFormControl(),
    active: new NgcFormControl(true)
  });

  //Pre-waive display form
  public preWaivingParkActivity: NgcFormGroup = new NgcFormGroup({
    truckParkList: new NgcFormArray([])
  });

  //pre-waive create or update form
  private preWaivingParkActivityCreateUpdateForm: NgcFormGroup = new NgcFormGroup({
    vehicleNo: new NgcFormControl(),
    visitorName: new NgcFormControl(),
    visitorCompanyId: new NgcFormControl(),
    effectiveFromDateTime: new NgcFormControl(),
    effectiveTillDateTime: new NgcFormControl(),
    waiveHours: new NgcFormControl(),
    waiveFee: new NgcFormControl(),
    multiUse: new NgcFormControl(),
    reason: new NgcFormControl(),
    applicationDateTime: new NgcFormControl(),
    collectionDateTime: new NgcFormControl(),
    remarks: new NgcFormControl(),
    active: new NgcFormControl(true),
    preWaiveId: new NgcFormControl()
  });

  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * Create
   * 
   * @param data Window Ref
   */
  onCreateUpdateWindow(data: any) {
    if (data == 'create') {
      this.windowType = 'create';
      this.preWaivingParkActivityCreateUpdateForm.get('waiveFee').setValue(false);
      this.preWaivingParkActivityCreateUpdateForm.get('multiUse').setValue(false);
      this.createUpdateWindow.open();
    } else if (data.column == 'delete') {
      //Validation-If the vehicle is active,cannot delete the record
      if (data.record.active === 'true') {
        this.showErrorMessage("Can not delete as the vehicle is still in use");
        return;
      }
      this.showConfirmMessage("Do you want to delete the record?").then(fulfilled => {
        //Pre-waive parking  API call for deleting the records
        this.tcsService.deletePreWaiveParking(data.record).subscribe(data => {
          if (!this.showResponseErrorMessages(data)) {
            this.showSuccessStatus('g.completed.successfully');
            // Search Again
            this.onSearch();
          }
        });
      }).catch(reason => {
      });
    } else {
      this.windowType = 'update';
      this.preWaivingParkActivityCreateUpdateForm.patchValue(data.record);
      this.createUpdateWindow.open();
    }
  }

  onCreateUpdateWindowClose() {
    this.preWaivingParkActivityCreateUpdateForm.reset();
    this.createUpdateWindow.close();
  }

  // search the pre-waivepark Activity
  onSearch() {
    this.showData = false;
    //Validate the search before API call
    this.preWaivingParkActivitySearchForm.validate();
    // if search form invalid returning with validating the search form
    if (this.preWaivingParkActivitySearchForm.invalid) {
      return;
    }
    let request = this.preWaivingParkActivitySearchForm.getRawValue();
    //Pre-Waiving Parking API CALL tofetch the pre-waiving list
    this.tcsService.searchPreWaiveParking(request).subscribe((response) => {
      if (response.data && response.data.length > 0) {
        this.showData = true;
        (<NgcFormArray>this.preWaivingParkActivity.get(['truckParkList'])).patchValue(response.data);
      } else {
        this.showInfoStatus('no.record.found');
        this.showData = false;
        this.refreshFormMessages(response);
      }
    }, error => {
      this.showErrorStatus('Error:' + error);
    });
  }

  //Create or  update pre-waive parking
  onCreateUpdate() {
    const request = this.preWaivingParkActivityCreateUpdateForm.getRawValue();
    //Validate the create form before create
    this.preWaivingParkActivityCreateUpdateForm.validate();
    // if search form invalid returning with validating the search form
    if (this.preWaivingParkActivityCreateUpdateForm.invalid) {
      return;
    }
    if (this.windowType == 'update') {
      //Update Pre waiving API call to update 
      this.tcsService.updatePreWaiveParking(request).subscribe((response) => {
        if (!this.showResponseErrorMessages(response, null, "createInfo")) {
          this.createUpdateWindow.close();
          this.showSuccessStatus('g.completed.successfully');
          this.onSearch();
        }
      });
      //Reset the update form
      this.preWaivingParkActivityCreateUpdateForm.reset();
      this.createUpdateWindow.close();

    } else {
      //Pre-waive Parking API Call to create pre-waive parking
      this.tcsService.createPreWaiveParking(request).subscribe((response) => {
        if (!this.showResponseErrorMessages(response, null, "createInfo")) {
          this.preWaivingParkActivityCreateUpdateForm.reset();
          this.createUpdateWindow.close();
          this.showSuccessStatus('g.completed.successfully');
          this.onSearch();
        }
      });
    }
  }

}
