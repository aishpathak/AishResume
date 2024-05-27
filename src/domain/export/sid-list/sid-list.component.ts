import { ExportService } from './../export.service';
import {
  Component, OnInit, NgZone, ElementRef, ViewContainerRef,
  ViewChild, Directive, OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent,
  NgcButtonComponent, NgcUtility, PageConfiguration
} from 'ngc-framework';
import {
  SIDSearchRequest, SIDHeaderDetailResponse, SIDHeaderDetail
} from '../export.sharedmodel';

@Component({
  selector: 'ngc-sid-list',
  templateUrl: './sid-list.component.html',
  styleUrls: ['./sid-list.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class SidListComponent extends NgcPage {
  arraySID: any[];
  response: any;
  numberCheckboxSelected: any = 0;
  disableNAWBButton: Boolean = false;
  @ViewChild('searchButton') searchButton: NgcButtonComponent;
  @ViewChild('issueNawbButton') issueNawbButton: NgcButtonComponent;
  showTableFlag: boolean;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private exportService: ExportService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }
  private sidForm: NgcFormGroup = new NgcFormGroup({
    sidNumber: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    status: new NgcFormControl(),
    terminal: new NgcFormControl(),
    stockId: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    sidListArray: new NgcFormArray([])
  });

  public ngOnInit(): void { }

  /**
 * This function is responsible for displaying the List of the SID
 * @param event
 */
  public onSearch(event) {
    const request: SIDSearchRequest = new SIDSearchRequest();
    request.sidNumber = this.sidForm.get('sidNumber').value;
    request.awbNumber = this.sidForm.get('shipmentNumber').value;
    request.status = this.sidForm.get('status').value;
    request.terminal = this.sidForm.get('terminal').value;
    request.stockId = this.sidForm.get('stockId').value;
    request.carrierCode = this.sidForm.get('carrierCode').value;
    request.fromDate = this.sidForm.get('fromDate').value;
    request.toDate = this.sidForm.get('toDate').value;

    this.exportService.searchSID(request).subscribe(dataDetail => {
      this.response = dataDetail;
      this.arraySID = this.response.data;
      this.resetFormMessages();
      if (this.arraySID.length > 0) {
        this.showTableFlag = true;
        (<NgcFormArray>this.sidForm.get('sidListArray')).reset();
        this.resetFormMessages();
        // conversion of date
        // if (this.arraySID && this.arraySID.length > 0) {
        //   this.arraySID.forEach((record: any) => {
        //     record['createdOn'] = NgcUtility.toDateFromLocalDate(record['createdOn']);
        //   });
        // }
        (<NgcFormArray>this.sidForm.controls['sidListArray']).patchValue(this.arraySID);
      } else {
        this.showTableFlag = false;
        (<NgcFormArray>this.sidForm.get('sidListArray')).reset();
        this.showErrorStatus('NO_RECORDS_EXIST');
      }
    });

  }
  /**
   * This function is responsible for Issuing NAWB
   * @param event
   */
  public onNAWBIssue(event) {
    if (this.sidForm.get(["sidListArray"]).value.filter((element) => element.selectFlag == true).length > 1) {
      this.showErrorStatus("export.select.atmost.one.shipment");
    }
    else if (this.sidForm.get(["sidListArray"]).value.filter((element) => element.selectFlag == true).length < 1) {
      this.showErrorStatus("export.select.atmost.one.shipment");
    }
    else {
      const sidFormArray: NgcFormArray = <NgcFormArray>this.sidForm.get('sidListArray');
      //
      if (sidFormArray && sidFormArray.length > 0) {
        sidFormArray.controls.forEach((control: any) => {
          const formGroup: NgcFormGroup = <NgcFormGroup>control;
          //
          if (formGroup && formGroup.controls['selectFlag'] && formGroup.controls['selectFlag'].value === true) {
            if ((formGroup.controls['status'].value).toLowerCase() !== 'EXPIRED'.toLowerCase()) {
              //  this.navigateTo(this.router, 'export/neutralairwaybill', formGroup.getRawValue());
              this.navigateTo(this.router, 'export/maintainnawb', formGroup.getRawValue());
            } else {
              // this.disableNAWBButton = true;
              this.showErrorStatus('export.nawb.with.expired.statud.cannot.issued');
            }
          }
        });
      }
    }


  }


}
