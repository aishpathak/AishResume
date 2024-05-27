import { Component, NgZone, ElementRef, ViewContainerRef, OnChanges, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TcsService } from '../tcs.service'
import {
  NgcPage, StatusMessage, PageConfiguration, NgcUtility,
  NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent
} from 'ngc-framework';
import { TruckAssignSearch } from '../tcs.sharedmodel';


@Component({
  selector: 'app-truck-assign',
  templateUrl: './truck-assign.component.html',
  styleUrls: ['./truck-assign.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class TruckAssignComponent extends NgcPage implements OnInit {
  /**
   * TruckAssignSearchForm
   */
  public truckAssignSearchForm: NgcFormGroup = new NgcFormGroup({
    vehicleNo: new NgcFormControl(null, [Validators.maxLength(10), Validators.required]),
    tripId: new NgcFormControl()
  });

  /**
   * TruckassignForm
   */
  public truckAssignForm: NgcFormGroup = new NgcFormGroup({
    truckAssignDetails: new NgcFormArray([]),
  })
  //
  public isSearch: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private service: TcsService) {
    super(appZone, appElement, appContainerElement);
  }

  /**
   * onSearch
   */
  public onSearch() {
    this.truckAssignSearchForm.validate();
    if (this.truckAssignSearchForm.invalid) {
      return;
    }
    this.isSearch = false;
    // let searchGroup: NgcFormGroup = (this.truckAssignSearchForm.get('truckAssignDetails') as NgcFormGroup);
    // searchGroup.validate();
    // //
    // if (searchGroup.invalid) {
    //   return;
    // }
    // let request: TruckAssignSearch = searchGroup.getRawValue();
    // //
    // (<NgcFormArray>this.truckAssignSearchForm.get('SRF Number')).resetValue([]);
    // //

    this.service.searchTruckAssign(this.truckAssignSearchForm.getRawValue()).subscribe(response => {
      this.refreshFormMessages(response);
      console.log(response.data);
      if (response.data && response.data.length > 0) {
        this.isSearch = true;
        (<NgcFormArray>this.truckAssignForm.controls['truckAssignDetails']).patchValue(response.data);
      } else {
        this.showErrorMessage("no.record");
      }

    });
  }

  /**
   * This function, opens Addwindow and set field blank
  */
  public onAddRow() {
    this.isSearch = true;
    (<NgcFormArray>this.truckAssignForm.get('truckAssignDetails')).addValue([
      {
        select: null,
        srfNo: null,
        tripId: null,
        srfId: null
      }
    ]);
  }

  deleteDetails(index) {
    (<NgcFormGroup>this.truckAssignForm.get(['truckAssignDetails', index])).markAsDeleted();
  }

  /**
   * onSave
   */
  onSaveTruckAssignSrf(event) {
    this.truckAssignForm.validate();
    if (this.truckAssignForm.invalid) {
      return;
    }
    const saveRequest: any = {};
    saveRequest.vehicleNo = this.truckAssignSearchForm.get('vehicleNo').value;
    saveRequest.truckAssignDetails = this.truckAssignForm.get(['truckAssignDetails']).value;
    console.log(saveRequest.truckAssignDetails);
    for (let i = 0; i < saveRequest.truckAssignDetails.length; i++) {
      for (let j = 0; j < saveRequest.truckAssignDetails.length; j++) {
        if (i != j) {
          if (saveRequest.truckAssignDetails[i].srfNo === saveRequest.truckAssignDetails[j].srfNo) {
            this.showErrorStatus("SRF No already exists");
            return;
          }
        }
      }
    }
    this.service.saveTruckAssignSRF(saveRequest).subscribe(data => {
      this.refreshFormMessages(data);
      if (!data.messageList) {
        this.onSearch();
        this.showSuccessStatus('g.completed.successfully');

      } else {
        this.showErrorStatus(data.messageList[0].message);
      }
    });
  }
  //
  vehicleNoChange(event) {
    console.log(event);
  }
}
