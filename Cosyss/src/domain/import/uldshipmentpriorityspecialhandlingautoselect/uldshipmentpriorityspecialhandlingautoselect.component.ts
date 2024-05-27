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
  selector: 'app-uldshipmentpriorityspecialhandlingautoselect',
  templateUrl: './uldshipmentpriorityspecialhandlingautoselect.component.html',
  styleUrls: ['./uldshipmentpriorityspecialhandlingautoselect.component.scss']
})
export class UldshipmentpriorityspecialhandlingautoselectComponent extends NgcPage {
  resp: any;
  displayResults: boolean = false;
  specialHandlingAutoSelectList: any;

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
    specialHandlingAutoSelectList: new NgcFormArray([
      new NgcFormGroup({
        specialCargoHandlingAutoSelectId: new NgcFormControl(),
        breakdownHandlingForm: new NgcFormControl(),
        priorityOptions: new NgcFormControl(),
        autoSelect: new NgcFormControl(),
      })

    ]),

  });


  onAdd() {
    (<NgcFormArray>this.form.controls["specialHandlingAutoSelectList"]).addValue(
      [{
        specialCargoHandlingAutoSelectId: null,
        breakdownHandlingForm: null,
        priorityOptions: null,
        autoSelect: null
      }]
    )
  }

  onSearch = () => {

    this.displayResults = false;
    this.form.get("specialHandlingAutoSelectList").patchValue(null);

    let req = this.form.getRawValue();

    this.resetFormMessages();
    // this.importService.fetchSpecialHandlingAutoSelect(req).subscribe(data => {

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
    //   this.form.get("specialHandlingAutoSelectList").patchValue(this.resp);

    // })
  }


  onSave() {
    let rawData = this.form.getRawValue();
    console.log(rawData.specialHandlingAutoSelectList);
    if (rawData.specialHandlingAutoSelectList.length == 0) {
      this.showErrorStatus("no.record.found");
      return;
    }
    // rawData.specialHandlingAutoSelectList.forEach(element => {
    //   if (element.flagCRUD != 'C') {
    //     element.specialCargoHandlingAutoSelectId = rawData.specialCargoHandlingAutoSelectId;
    //   }
    // });
    if (!this.form.valid) {
      this.form.validate();
      return;
    }
    // this.importService.updateSpecialHandlingAutoSelect(rawData.specialHandlingAutoSelectList).subscribe(response => {

    //   if (!this.showResponseErrorMessages(response)) {
    //     this.onSearch();
    //     this.showSuccessStatus('shipment.updated.successfully');
    //   }
    // }, (error) => {
    //   this.showErrorStatus(error);
    // });
  }

  delete(event, index) {
    (<NgcFormArray>this.form.get(['specialHandlingAutoSelectList'])).markAsDeletedAt(index);
  }
}
