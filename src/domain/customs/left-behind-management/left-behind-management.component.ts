
import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { PageConfiguration, NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcUtility, NgcReportComponent, NgcWindowComponent, ReportFormat } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { CustomACESService } from './../customs.service';
import { and } from '@angular/router/src/utils/collection';
// import { timeStamp } from 'console';
// import { element } from 'protractor';
@Component({
  selector: 'app-left-behind-management',
  templateUrl: './left-behind-management.component.html',
  styleUrls: ['./left-behind-management.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class LeftBehindManagementComponent extends NgcPage implements OnInit {
  reportParameters: any;
  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;
  shipmentLists: any;
  resp: any;
  showTable: boolean;
  searchButtonClicked: boolean;

  constructor(appZone: NgZone, appElement: ElementRef, private activatedRoute: ActivatedRoute,
    appContainerElement: ViewContainerRef, private customsService: CustomACESService,) {
    super(appZone, appElement, appContainerElement);
  }

  private managementForm: NgcFormGroup = new NgcFormGroup({

    startDate: new NgcFormControl('', Validators.required),
    endDate: new NgcFormControl('', Validators.required),
    carrier: new NgcFormControl(),
    fltNo: new NgcFormControl(),

    data: new NgcFormArray([
      new NgcFormGroup({
        fltNo: new NgcFormControl(),
        fltDate: new NgcFormControl(),
        awbNo: new NgcFormControl(),
        hawbNo: new NgcFormControl(),
        agentName: new NgcFormControl(),
      })
    ])
  })




  ngOnInit() {
  }

  /**
   * Method to retrieve Data of Left behind management screen
   */
  onSearch() {
    if (NgcUtility.isBlank(this.managementForm.get('startDate').value) || NgcUtility.isBlank(this.managementForm.get('endDate').value)) {

      this.showErrorMessage("mandatory.fields.cannot.be.empty");
      return;

    }
    let requestData = this.managementForm.getRawValue();
    this.customsService.fetchManagementDetails(requestData).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.refreshFormMessages(response);
        this.resp = response.data;
        if (this.resp.data.length != 0) {
          var sno = 1;
          for (const eachRow of this.resp.data) {
            eachRow[sno] = sno;
            sno++;
          }

          this.managementForm.get('data').patchValue(this.resp.data);
          this.showTable = true;
        }
        else {
          this.showTable = false;
          this.showErrorMessage("val.noRecordFound");
        }
      }
    }, error => {
      this.showErrorStatus(error);
      this.showTable = false;
    })
  }
  /**
 * Returns row value for serial number
 *
 * @returns
 */
  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  onPrint() {
    this.reportParameters = new Object();
    this.reportParameters.startDate = this.managementForm.get('startDate').value;
    this.reportParameters.endDate = this.managementForm.get('endDate').value;
    this.reportParameters.fltKey = this.managementForm.get('fltNo').value;
    this.reportParameters.carrierCode = this.managementForm.get('carrier').value;
    this.reportWindow.open();
  }
  /**
   * Method to clear the screen
   */
  onClear() {
    this.searchButtonClicked = false;
    this.managementForm.reset();
    this.resetFormMessages();
  }
  /**
   * Method to cancel the screen
   */
  onCancel(event) {
    this.navigateBack(this.managementForm.getRawValue());
  }
}


