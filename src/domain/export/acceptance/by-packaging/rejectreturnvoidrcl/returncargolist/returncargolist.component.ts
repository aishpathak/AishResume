import { Component, ChangeDetectorRef } from '@angular/core';
import { ComponentFactoryResolver, ElementRef, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcApplication, NgcButtonComponent, NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage, PageConfiguration, UserProfile, NgcReportComponent, NgcWindowComponent } from 'ngc-framework';
import { ReturncargolistService } from './returncargolist.service';
@Component({
  selector: 'app-returncargolist',
  templateUrl: './returncargolist.component.html',
  styleUrls: ['./returncargolist.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class ReturncargolistComponent extends NgcPage {
  @ViewChild("reportWindow") reportWindow: NgcReportComponent; // Testing purpose, To do (remove)
  reportParameters: any;
  selectionRowIndex: any;
  editdisplay: boolean;
  @ViewChild('window') window: NgcWindowComponent;


  // show: boolean = false;
  // resp: any;
  // responseArray: any = null;
  // showDataTable = false;
  // ReturnCargoListTableArray: any[];
  // searchResult: boolean = false;
  constructor(appZone: NgZone

    , appElement: ElementRef
    , appContainerElement: ViewContainerRef, private returncargolistservice: ReturncargolistService, private router: Router,

    appComponentResolver: ComponentFactoryResolver) {
    super(appZone, appElement, appContainerElement);
  }
  onClear(event): void {
    this.ReturnCargoListForm.reset();
    this.resetFormMessages();
  }
  public onCancel(event) {
    this.navigateBack(this.ReturnCargoListForm.getRawValue);
  }

  ReturnCargoListForm: NgcFormGroup = new NgcFormGroup({
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    agentName: new NgcFormControl(),
    printer: new NgcFormControl(),
    ReturnCargoListTableArray: new NgcFormArray([
      // new NgcFormGroup({
      //   sel: new NgcFormControl(),
      //   sequenceNumber: new NgcFormControl(),
      //   carrierCode: new NgcFormControl(),
      //   agentName: new NgcFormControl(),
      //   awbNumber: new NgcFormControl(),
      //   rclPcsWt: new NgcFormControl(),
      //   returnSRFNo: new NgcFormControl(),
      //   returnPcsWt: new NgcFormControl(),
      //   returnDate: new NgcFormControl(),
      //   storageCharge: new NgcFormControl(),
      //   waiveCharge: new NgcFormControl(),
      //   paid: new NgcFormControl(),
      // })

    ]),
    EditTableArray: new NgcFormArray([
    ]),

  });
  onSearch() {
    this.resetFormMessages();
    if (!(this.ReturnCargoListForm.get('fromDate').value && this.ReturnCargoListForm.get('toDate').value)) {
      this.showErrorMessage('export.accpt.datevalidation');
      return;
    }

    // this.searchResult = true;
    this.returncargolistservice.getReturnCargoListData("").subscribe(data => {
      this.ReturnCargoListForm.get("ReturnCargoListTableArray").patchValue(data)
    })

  }
  print() {
    this.reportParameters = new Object();
    this.reportWindow.reportParameters = this.reportParameters;
    this.reportWindow.open();
  }
  // for pop up
  onEdit() {
    this.window.open();
  }
  onDeleteButton(event) {
    const sendReq = this.ReturnCargoListForm.getRawValue();
    this.returncargolistservice.getReturnCargoListDelete(sendReq).subscribe(data => {
      if (data.success === true) {
        this.showSuccessStatus("deleted");
      }
    });
  }

  shipmentInfo() {
    this.navigateTo(this.router, 'awbmgmt/shipmentinfo', '');
  }
  rejectReturnVoidRCL() {
    this.navigateTo(this.router, 'export/rejectreturnvoidrcl', '');
  }


}



