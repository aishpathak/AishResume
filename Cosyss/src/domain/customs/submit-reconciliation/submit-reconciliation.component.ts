import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration, NgcContainerComponent, ReactiveModel
  , NgcReportComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomACESService } from './../customs.service';

@Component({
  selector: 'app-submit-reconciliation',
  templateUrl: './submit-reconciliation.component.html',
  styleUrls: ['./submit-reconciliation.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class SubmitReconciliationComponent extends NgcPage implements OnInit {
  onSearchFlag: boolean;
  resp: any;
  showTable: boolean;
  itfsFlag: boolean;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private route: ActivatedRoute, private customsService: CustomACESService) {
    super(appZone, appElement, appContainerElement);
  }
  private reconciliationForm: NgcFormGroup = new NgcFormGroup({
    controlDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    recList: new NgcFormArray([
      new NgcFormGroup({
        recDetailList: new NgcFormArray([
        ])
      })
    ])
  })

  ngOnInit() {
    super.ngOnInit();
    const transferData = this.getNavigateData(this.activatedRoute);
    try {
      if (transferData !== null && transferData !== undefined) {
        this.onSearchAuto(transferData);
      }
    }
    catch (e) { }
  }
  /**
    * Setting flight date when navigating back
    *
    * @param transferData
    */
  onSearchAuto(transferData) {
    this.reconciliationForm.get('controlDate').setValue(transferData.controlDate);
    this.onSearch();
  }
  onSearch() {
    let request = this.reconciliationForm.getRawValue();
    if (request.controlDate == null || request.controlDate == '') {
      return this.showFormControlErrorMessage(<NgcFormControl>this.reconciliationForm.get('controlDate'), "Mandatory");
    }
    this.onSearchFlag = true;
    this.customsService.fetchRecList(request).subscribe(data => {
      this.refreshFormMessages(data);
      this.resp = data.data;

      if (!this.showResponseErrorMessages(data)) {
        if (this.resp != null) {
          this.reconciliationForm.patchValue(this.resp);
          this.showTable = true;
        }
        else {
          this.showTable = false;
          this.showErrorMessage("No Data Found");
        }
      }
    });
  }

  /**
   * Returns row value for serial number
   *
   * @returns
   */
  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  /**
   * Methos to navigate to message Details screen
   *
   * @returns
   */
  openReconciliationMessage(index: any) {
    var dataToSend = {
      recHeaderId: this.reconciliationForm.get(['recList', index, 'recHeaderId']).value,
    }
    this.navigateTo(this.router, '/customs/submitreconciliationmessage', dataToSend);
  }
}
