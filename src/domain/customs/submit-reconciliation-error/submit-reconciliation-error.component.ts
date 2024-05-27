import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration, NgcContainerComponent, ReactiveModel
  , NgcReportComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomACESService } from './../customs.service';


@Component({
  selector: 'app-submit-reconciliation-error',
  templateUrl: './submit-reconciliation-error.component.html',
  styleUrls: ['./submit-reconciliation-error.component.scss']
})
export class SubmitReconciliationErrorComponent extends NgcPage implements OnInit {
  forwardedData: any;
  data: any;
  resp: any;

  private searchRecDetailForm: NgcFormGroup = new NgcFormGroup({
    recHeaderId: new NgcFormControl(),
    searchFlag: new NgcFormControl()
  });
  private RecErrorForm: NgcFormGroup = new NgcFormGroup({
    recHeaderId: new NgcFormControl(),
    recData: new NgcFormGroup({
      status: new NgcFormControl(),
      uid: new NgcFormControl(),
      controlDate: new NgcFormControl(),
      versionNo: new NgcFormControl(),
      messageType: new NgcFormControl(),
    }),
    reconData: new NgcFormArray([
      new NgcFormGroup({
        status: new NgcFormControl(),
        versionNo: new NgcFormControl(),
        subDateTime: new NgcFormControl(),
        ackDateTime: new NgcFormControl()
      })
    ])
  })

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private route: ActivatedRoute, private customsService: CustomACESService) {
    super(appZone, appElement, appContainerElement);
  }
  ngOnInit() {
    super.ngOnInit();
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    if (this.forwardedData) {
      this.data = this.forwardedData;
      this.searchRecDetailForm.patchValue(this.data);
      console.log(this.searchRecDetailForm.value);
      this.OnSearch();
    }
  }
  OnSearch() {
    let request = <NgcFormGroup>this.searchRecDetailForm.getRawValue();
    this.customsService.fetchRecData(request).subscribe(data => {
      this.refreshFormMessages(data);
      this.resp = data.data;
      this.RecErrorForm.get('recData').patchValue(data.data);
      (<NgcFormControl>this.RecErrorForm.get(["reconData", 0, "status"])).setValue(this.RecErrorForm.controls.recData.get('status').value);
      (<NgcFormControl>this.RecErrorForm.get(["reconData", 0, "versionNo"])).setValue(this.RecErrorForm.controls.recData.get('versionNo').value);
      (<NgcFormControl>this.RecErrorForm.get(["reconData", 0, "subDateTime"])).setValue(this.RecErrorForm.controls.recData.get('createdOn').value);
      (<NgcFormControl>this.RecErrorForm.get(["reconData", 0, "ackDateTime"])).setValue(this.RecErrorForm.controls.recData.get('ackDateTime').value);
    });
  }
  //method for navigating to reconciliation error detail screen
  openReconciliationErrorDetail(index: any) {
    var dataToSend = {
      recHeaderId: this.RecErrorForm.controls.recData.get('recHeaderId').value,
    }
    this.navigateTo(this.router, '/customs/submitreconciliationerrordetails', dataToSend);
  }

  //method to navigate back to reconciliation message detail screen
  public onBack(event) {
    let transferData = this.RecErrorForm.get('recData').value
    let id = this.RecErrorForm.controls.recData.get('recHeaderId').value
    transferData.recHeaderId = id;
    this.navigateTo(this.router, '/customs/submitreconciliationmessage', transferData);
  }

  //method to generate serial number
  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }
}
