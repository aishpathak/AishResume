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

/* 
 *
    Function of this screen is to confirm the Checked In unconfirmed ULD's 
 *
*/

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: false,
  focusToBlank: true
})
@Component({
  selector: 'app-confirm-uld',
  templateUrl: './confirm-uld.component.html',
  styleUrls: ['./confirm-uld.component.scss']
})
export class ConfirmUldComponent extends NgcPage implements OnInit {

  data: any;
  obj = [];
  show: boolean = false;
  constructor(appZone: NgZone,
    private importService: ImportService,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef) {
    super(appZone, appElement, appContainerElement);
  }

  private confirmUldForm: NgcFormGroup = new NgcFormGroup({
    flightNumber: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    flightId: new NgcFormControl(),
    confirmUldListModel: new NgcFormArray([]),

  });
  ngOnInit() {

    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData != null) {
      this.confirmUldForm.get("flightNumber").patchValue(forwardedData.flightNumber);
      if (forwardedData.uldNumber != null) {
        this.confirmUldForm.get("uldNumber").patchValue(forwardedData.uldNumber);
      }
      this.confirmUldForm.get("flightDate").patchValue(forwardedData.flightDate);
      this.onSearch();
    }
  }
  protected afterFocus() {
    (this.confirmUldForm.get('flightNumber') as NgcFormControl).focus();
  }
  onChangeFlight = (event: any) => {

  }

  /*  Function responsible for  confirming ULD's */
  confirmUld = () => {
    this.confirmUldForm.validate();
    if (this.confirmUldForm.invalid) {
      return;
    }
    let count = 0;
    let item = (<NgcFormArray>this.confirmUldForm.controls["confirmUldListModel"]).getRawValue();
    for (let index = 0; index <= item.length - 1; index++) {
      if (item[index].flag == true) {
        this.obj.push(item[index]);
        count++;
      }
    }
    if (count == 0) {
      this.showErrorStatus('export.select.a.record');
      return;
    }
    let req = this.obj;
    (<NgcFormArray>this.confirmUldForm.controls["confirmUldListModel"]).patchValue(this.obj);
    let value = this.confirmUldForm.getRawValue();
    (<NgcFormArray>this.confirmUldForm.controls["confirmUldListModel"]).patchValue([]);
    this.importService.updateConfirmUld(value).subscribe(data => {
      this.onSearch();
      this.showSuccessStatus('g.completed.successfully');
    }, error => {
      this.showErrorStatus(error);
    }
    )
    this.obj.splice(0, this.obj.length);
  }


  /* Function responsible for searching unconfirmed ULD's */
  onSearch = () => {
    /* validate The form */
    this.confirmUldForm.validate();
    if (this.confirmUldForm.invalid) {
      return;
    }
    this.resetFormMessages();
    let req = this.confirmUldForm.getRawValue();
    (<NgcFormArray>this.confirmUldForm.controls["confirmUldListModel"]).patchValue([]);
    this.importService.confirmUldFetch(req).subscribe(data => {
      if (data.data.confirmUldListModel.length == 0) {
        this.show = false;
        this.showErrorStatus("SHCCODE036");
        return;
      }
      this.show = true;
      this.data = data.data.confirmUldListModel;
      (<NgcFormArray>this.confirmUldForm.controls["confirmUldListModel"]).patchValue(this.data);
      this.confirmUldForm.get("flightId").patchValue(this.data[0].flightId);
    }
      , error => {
        this.showErrorStatus(error);
      }
    )

  }
  onCheckBoxClick = (event: any) => {

  }
  onLinkClick = (event: any) => {

  }
}
