import { error } from '@angular/compiler/src/util';
import { Component, ElementRef, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcUtility, PageConfiguration } from 'ngc-framework';
import { UldService } from '../../uld.service';

@Component({
  selector: 'app-global-uld-tracking',
  templateUrl: './global-uld-tracking.component.html',
  styleUrls: ['./global-uld-tracking.component.scss']
})

export class GlobalUldTrackingComponent extends NgcPage {

  showTable: boolean;
  eachValue: any;
  responseData: any;
  // for fetching the navigated data
  forwardedData: any;

  constructor(
    appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router,
    private uldService: UldService, private activatedRoute: ActivatedRoute) { super(appZone, appElement, appContainerElement); }

  //form Group for the SearchForm
  private searchForm = new NgcFormGroup({
    uldNum: new NgcFormControl('', Validators.required),
    fromDate: new NgcFormControl('', Validators.required),
    toDate: new NgcFormControl('', Validators.required)
  });

  //form Group for the GlobalUldTracking
  private globalUldTracking = new NgcFormGroup({
    uldNum: new NgcFormControl(),
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    lastSignedIn: new NgcFormControl(),
    lastOut: new NgcFormControl(),
    lastIn: new NgcFormControl(),
    uldTracking: new NgcFormArray([])
  });

  ngOnInit() {
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    if (this.forwardedData) {
      this.searchForm.get('uldNum').patchValue(this.forwardedData.uldKey);
      this.onSearch('noCheck');
    }
  }

  //Search function for the feaching the data
  onSearch(event) {
    if (event !== 'noCheck') {
      this.searchForm.validate();
      if (!this.searchForm.valid) {
        this.showTable = false;
        return;
      }
    }
    let requestData = this.searchForm.getRawValue();
    //Api creation for the requestData and response for the data
    this.uldService.getUldTrackingRequest(requestData).subscribe(res => {
      this.refreshFormMessages(res);
      //if response is not empty
      if (!res.messageList) {
        //patching the values on to the screen
        this.globalUldTracking.get('uldTracking').patchValue(res.data);
        this.globalUldTracking.get('lastSignedIn').patchValue(res.data[res.data.length - 1].lastSignedIn);
        this.globalUldTracking.get('lastOut').patchValue(res.data[res.data.length - 1].lastOut);
        this.globalUldTracking.get('lastIn').patchValue(res.data[res.data.length - 1].lastIn);
        this.globalUldTracking.get('uldNum').patchValue(res.data[res.data.length - 1].uldNum);
        this.showTable = true;
      }
      else {
        //error code if repose is empty
        this.showErrorStatus(res.messageList[0].code);
        this.showTable = false;
      }
    }, error => { this.showErrorStatus(error); });

  }
  //clear screen for the data
  onClear() {
    this.resetFormMessages();
    this.searchForm.reset();
    this.globalUldTracking.reset();
    this.showTable = false;
  }
  //onCancel to navigate to perviews screen
  onCancel(event) {
    this.navigateTo(this.router, '/uld/maintainGlobalUldInventoryList', this.forwardedData.searchRequest);
  }
  //onChangeValue for the blanks of the form
  onChangeValue() {
    this.showTable = false;
    this.resetFormMessages();
    this.globalUldTracking.reset();
  }
}
