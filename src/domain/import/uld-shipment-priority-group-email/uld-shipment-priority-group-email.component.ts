import { Component, OnInit } from '@angular/core';
import {
  NgZone,
  ElementRef,
  ViewContainerRef,
  ChangeDetectorRef
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  PageConfiguration,

} from "ngc-framework";
import { ImportService } from '../import.service';

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: false,
  dontRestoreOnBrowserBack: false
})

@Component({
  selector: 'app-uld-shipment-priority-group-email',
  templateUrl: './uld-shipment-priority-group-email.component.html',
  styleUrls: ['./uld-shipment-priority-group-email.component.scss']
})
export class UldShipmentPriorityGroupEmailComponent extends NgcPage {
  resp: any;
  displayResults: boolean = false;
  shipmentPriorityList: any;

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
    groupCode: new NgcFormControl(),
    shipmentPriorityList: new NgcFormArray([
      new NgcFormGroup({
        emailGroupDetailsId: new NgcFormControl(),
        groupCode: new NgcFormControl(),
        emailAddress: new NgcFormControl(),
      })

    ]),

  });

  onAdd() {
    (<NgcFormArray>this.form.controls["shipmentPriorityList"]).addValue(
      [{
        emailGroupDetailsId: null,
        groupCode: null,
        emailAddress: null
      }]
    )
  }

  onSearch = () => {
    this.displayResults = false;
    this.form.get("shipmentPriorityList").patchValue(null);
    let req = this.form.getRawValue();

    this.resetFormMessages();
    // this.importService.fetchShipmentPriorityGroupEmail(req).subscribe(data => {

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
    //   this.form.get("shipmentPriorityList").patchValue(this.resp);

    // })
  }

  onSave() {
    let rawData = this.form.getRawValue();
    console.log(rawData.shipmentPriorityList);
    if (rawData.shipmentPriorityList.length == 0) {
      this.showErrorStatus("no.record.found");
      return;
    }
    if (!this.form.valid) {
      this.form.validate();
      return;
    }
    // this.importService.updateShipmentPriorityGroupEmail(rawData.shipmentPriorityList).subscribe(response => {

    //   if (!this.showResponseErrorMessages(response)) {
    //     this.onSearch();
    //     this.showSuccessStatus('shipment.updated.successfully');
    //   }
    // }, (error) => {
    //   this.showErrorStatus(error);
    // });
  }

  delete(data: any, index: any) {
    (<NgcFormArray>this.form.get(['shipmentPriorityList'])).markAsDeletedAt(index);
  }
}
