import { Component, ElementRef, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportService } from '../../import.service';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcWindowComponent, PageConfiguration, NgcUtility, NgcReportComponent, ReactiveModel } from "ngc-framework";

@Component({
  selector: 'app-uldRhoPriorityMaster',
  templateUrl: './uldRhoPriorityMaster.component.html',
  styleUrls: ['./uldRhoPriorityMaster.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: false,
  dontRestoreOnBrowserBack: false
})
export class UldRhoPriorityMasterComponent extends NgcPage {
  resp: any;
  displayResults: boolean = false;
  rhoPriorityList: any;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    this.onSearch();
  }

  private form: NgcFormGroup = new NgcFormGroup({
    rhoTowingGroupPriority: new NgcFormControl(),
    rhoPriorityList: new NgcFormArray([
      new NgcFormGroup({
        shipmentPriorityMasterId: new NgcFormControl(),
        rhoTowingGroupPriority: new NgcFormControl(),
        rhoTowingPriorityDescription: new NgcFormControl(),
      })

    ]),

  });

  onAdd() {
    (<NgcFormArray>this.form.controls["rhoPriorityList"]).addValue(
      [{
        shipmentPriorityMasterId: null,
        rhoTowingGroupPriority: null,
        rhoTowingPriorityDescription: null

      }]
    )
  }

  onSearch = () => {

    this.displayResults = false;
    this.form.get("rhoPriorityList").patchValue(null);
    let req = this.form.getRawValue();

    this.resetFormMessages();
    // this.importService.fetchRHOPriority(req).subscribe(data => {

    //   this.resp = data.data;

    //   if (!this.showResponseErrorMessages(data)) {
    //     if (data.data == null) {
    //       this.showErrorStatus("no.record.found");
    //       this.displayResults = false;
    //       return;
    //     } else {
    //       this.displayResults = true;
    //     }
    //   }
    //   this.form.get("rhoPriorityList").patchValue(this.resp);
    // })
  }


  onSave() {
    let rawData = this.form.getRawValue();
    console.log(rawData.rhoPriorityList);
    if (rawData.rhoPriorityList.length == 0) {
      this.showErrorStatus("no.record.found");
      return;
    }
    if (!this.form.valid) {
      this.form.validate();
      return;
    }

    // this.importService.updateRHOPriority(rawData.rhoPriorityList).subscribe(response => {

    //   if (!this.showResponseErrorMessages(response)) {
    //     this.onSearch();
    //     this.showSuccessStatus('shipment.updated.successfully');
    //   }
    // }, (error) => {
    //   this.showErrorStatus(error);
    // });
  }

  delete(data: any, index: any) {
    (this.form.get(["rhoPriorityList", index]) as NgcFormControl).markAsDeleted();
  }


}
