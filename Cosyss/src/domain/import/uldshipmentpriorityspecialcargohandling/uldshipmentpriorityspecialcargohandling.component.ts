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
  selector: 'app-uldshipmentpriorityspecialcargohandling',
  templateUrl: './uldshipmentpriorityspecialcargohandling.component.html',
  styleUrls: ['./uldshipmentpriorityspecialcargohandling.component.scss']
})
export class UldshipmentpriorityspecialcargohandlingComponent extends NgcPage {
  resp: any;
  displayResults: boolean = false;
  specialCargoHandlingList: any;


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
    breakdownHandlingForm: new NgcFormControl(),
    specialCargoHandlingList: new NgcFormArray([
      new NgcFormGroup({
        specialCargoHandlingId: new NgcFormControl(),
        breakdownHandlingForm: new NgcFormControl(),
        handlingFormInputType: new NgcFormControl(),
      })

    ]),

  });


  onAdd() {
    (<NgcFormArray>this.form.controls["specialCargoHandlingList"]).addValue(
      [{
        specialCargoHandlingId: null,
        breakdownHandlingForm: null,
        handlingFormInputType: null
      }]
    )
  }

  onSearch = () => {

    this.displayResults = false;
    this.form.get("specialCargoHandlingList").patchValue(null);
    let req = this.form.getRawValue();
    this.resetFormMessages();
    // this.importService.fetchSpecialCargoHandling(req).subscribe(data => {
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
    //   this.form.get("specialCargoHandlingList").patchValue(this.resp);
    // })
  }

  onSave() {
    let rawData = this.form.getRawValue();
    console.log(rawData.specialCargoHandlingList);
    if (rawData.specialCargoHandlingList.length == 0) {
      this.showErrorStatus("no.record.found");
      return;
    }

    if (!this.form.valid) {
      this.form.validate();
      return;
    }
    // this.importService.updateSpecialCargoHandling(rawData.specialCargoHandlingList).subscribe(response => {

    //   if (!this.showResponseErrorMessages(response)) {
    //     this.onSearch();
    //     this.showSuccessStatus('shipment.updated.successfully');
    //   }
    // }, (error) => {
    //   this.showErrorStatus(error);
    // });
  }

  delete(event, index) {
    (<NgcFormArray>this.form.get(['specialCargoHandlingList'])).markAsDeletedAt(index);
  }

}

