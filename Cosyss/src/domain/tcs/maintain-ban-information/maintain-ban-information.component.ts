import { Component, ElementRef, Input, NgZone, ViewContainerRef, } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, NgcPage,
  PageConfiguration, NgcFormControl, CellsRendererStyle
} from 'ngc-framework';
import { CreateBanComponent } from '../create-ban/create-ban.component';
import { ReleaseBanComponent } from '../release-ban/release-ban.component';
import { TcsService } from '../tcs.service';
import { BanTruckSearchModel } from './maintain-ban-information.model';

@Component({
  selector: 'app-maintain-ban-information',
  templateUrl: './maintain-ban-information.component.html',
  styleUrls: ['./maintain-ban-information.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true

})

export class MaintainBanInformationComponent extends NgcPage {

  public maintainBanInfoForm: NgcFormGroup = new NgcFormGroup({
    search: new NgcFormGroup({
      companyId: new NgcFormControl(),
      banStatus: new NgcFormControl(),
      vehicleNo: new NgcFormControl(null, Validators.required),
      banType: new NgcFormControl(),
      banCreateFrom: new NgcFormControl(),
      banCreateTo: new NgcFormControl(),
      banPeriodFrom: new NgcFormControl(),
      banPeriodTill: new NgcFormControl(),
      banReleaseFrom: new NgcFormControl(),
      banReleaseTill: new NgcFormControl()
    }),
    updatebaninfo: new NgcFormGroup({
      vehicleNo: new NgcFormControl(),
      penalty: new NgcFormControl(),
      penaltyDesc: new NgcFormControl(),
      banReasonDesc: new NgcFormControl(null, Validators.required),
      banStatusDesc: new NgcFormControl(),
      banPeriodStarted: new NgcFormControl(),
      fine: new NgcFormControl(),
      remarks: new NgcFormControl(),
      banPeriodFrom: new NgcFormControl(),
      banPeriodTill: new NgcFormControl(),
      banId: new NgcFormControl(),
      modifiedBy: new NgcFormControl(),
      modifiedOn: new NgcFormControl(),
    }),
    searchResults: new NgcFormArray([]),
  });
  public isSearch: boolean = false;
  public banHistoryFlag: boolean = false;
  historyDetails: any;
  vehicleNo: string;
  createWindow: NgcWindowComponent;
  updateWindow: NgcWindowComponent;
  releaseWindow: NgcWindowComponent;
  historyWindow: NgcWindowComponent;
  updatePenalty: Number;
  selectedBanReason: boolean = true;
  banStatusDesc: string;
  dataDisplay: boolean = false;
  toMin = new Date(NgcUtility.getCurrentDateOnly());
  currentDate = new Date(NgcUtility.getCurrentDateOnly());
  banperiodDateRange: any;
  historyData: any;
  banStatus: any
  banPeriodFrom: any
  remarks: any
  outstandingFine: any
  fine: any
  banType: string;
  companyId: string;
  banReasonCode: string;
  banReasonDesc: any;
  banCreateFrom: any;
  banCreateTo: any;
  banPeriodTill: any;
  showWindow: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router, private service: TcsService) {
    super(appZone, appElement, appContainerElement);

  }
  ngOnInit() {
    super.ngOnInit();
  }
  /**
   * 
  //  * @param changes 
  //  */

  public onSearch() {
    let searchGroup = (this.maintainBanInfoForm.get('search') as NgcFormGroup)
    searchGroup.validate();
    if (searchGroup.invalid) {
      return;
    }
    let request: BanTruckSearchModel = searchGroup.getRawValue();
    this.service.searchBanTruckInfo(request).subscribe((response) => {
      (<NgcFormArray>this.maintainBanInfoForm.get('searchResults')).resetValue([]);
      if (response && !this.showResponseErrorMessages(response)) {
        if (response.data && response.data.length > 0) {
          this.isSearch = true;
          response.data.map(element => {
            let banPeriodStarted: boolean = false;
            let banStatusDisable: boolean = false;

            let from = NgcUtility.getDateTimeAsString(element['banPeriodFrom']);
            let to = NgcUtility.getDateTimeAsString(element['banPeriodTill']);
            let banPeriodFromDate = NgcUtility.getDateAsString(element['banPeriodFrom']);
            let banPeriodToDate = NgcUtility.getDateAsString(element['banPeriodTill']);
            const banperiodDateRange = (`${from} - ${to}`);
            if (element.banStatusDesc == 'Released' || banPeriodFromDate <= NgcUtility.getDateAsString(this.currentDate) && NgcUtility.getDateAsString(this.currentDate) <= banPeriodToDate) {
              banStatusDisable = true;
            }
            else {
              banStatusDisable = false;
            }
            if (banPeriodFromDate <= NgcUtility.getDateAsString(this.currentDate) && NgcUtility.getDateAsString(this.currentDate) <= banPeriodToDate) {
              banPeriodStarted = true;
            }
            const obj = Object.assign(element, { banperiodDateRange: banperiodDateRange }, { banPeriodStarted: banPeriodStarted },
              { banStatusDisable: banStatusDisable }
            );

          });
          this.maintainBanInfoForm.get('searchResults').patchValue(response.data);
        }
        else {
          this.isSearch = false;
          this.maintainBanInfoForm.get('searchResults').setValue([]);
          this.showInfoStatus("No Records Found");
        }
      }
    })
  }
  public onDataTableClick(event, updateWindow, releaseBanWindow, banHistoryWindow) {
    if (event.type === 'link' && event.column === 'banUpdate') {
      this.updateWindow = updateWindow;
      this.updateWindow.open();
      this.maintainBanInfoForm.get('updatebaninfo').patchValue(event.record);
      let value = this.maintainBanInfoForm.get('updatebaninfo').value;
      this.updatePenalty = value.penalty;
    }
    if (event.type === 'link' && event.column === 'banRelease') {
      this.vehicleNo = event.record.vehicleNo;
      this.open(releaseBanWindow);
    }
    if (event.type === 'link' && event.column === 'banHistory') {
      this.vehicleNo = event.record.vehicleNo,
        this.banperiodDateRange = event.record.banperiodDateRange,
        this.outstandingFine = event.record.fine,
        this.banType = event.record.banType,
        this.companyId = event.record.companyName,
        this.banStatusDesc = event.record.banStatusDesc;
      this.banReasonDesc = event.record.banReasonDesc,
        this.open(banHistoryWindow);
    }
  }


  onUpdateSave() {
    let updateGroup = this.maintainBanInfoForm.get('updatebaninfo') as NgcFormGroup
    let request = updateGroup.getRawValue();
    updateGroup.validate();
    if (updateGroup.invalid) {
      return;
    }
    this.service.updateBruckInfo(request).subscribe((response) => {
      if (!this.showResponseErrorMessages(response, null, "updatebaninfo")) {
        this.updateWindow.close();
        this.showSuccessStatus("Data Saved Successfully");
        this.onSearch();
      }
      this.updateWindow.close();
      updateGroup.reset();
    }), (error) => {
      this.showErrorMessage(error);
    };
  }

  onBanReason(event) {
    const request = { 'reasonCode': event.code };
    this.service.fetchBanReasonData(request).subscribe((response) => {
      if (response && !this.showResponseErrorMessages(response)) {
        this.maintainBanInfoForm.get('updatebaninfo').get('fine').patchValue(response.data.fine);
        this.maintainBanInfoForm.get('updatebaninfo').get('penalty').patchValue(response.data.penalty);
      }
      else {
        this.maintainBanInfoForm.get('updatebaninfo').get('fine').patchValue(null);
        this.maintainBanInfoForm.get('updatebaninfo').get('penalty').patchValue(null);
      }
    }, error => {
      this.showErrorStatus('Error:' + error);
    });
  }

  /**
 * Open
 */
  public open(window: NgcWindowComponent) {
    if (window) {
      window.open();
    }
  }

  /**
   * On Cancel
   * 
   * @param window Window
   */
  public cancel(window: NgcWindowComponent) {
    if (window) {
      window.close();
    }
  }

  /**
 * On Create Ban
 */
  public onCreateRecord(createRecordScreen: CreateBanComponent, window: NgcWindowComponent) {
    if (createRecordScreen) {
      createRecordScreen.onSave().then(() => {
        this.cancel(window);
        this.isSearch = false;
        createRecordScreen.resetValue();
        (this.maintainBanInfoForm.get('search') as NgcFormGroup).reset();
        (<NgcFormArray>this.maintainBanInfoForm.get('searchResults')).resetValue([]);
      });
    }
  }
  /**
 * On Release Record
 */
  public onReleaseRecord(releaseRecordScreen: ReleaseBanComponent, window: NgcWindowComponent) {
    if (releaseRecordScreen) {
      releaseRecordScreen.onSave().then(() => {
        this.cancel(window);
        this.onSearch();
      });
    }
  }
  public cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    if (rowData) {
      const groupIndex: number = parseInt(rowData.NGC_ROW_ID);
      const group: NgcFormGroup = this.maintainBanInfoForm.get(['searchResults', groupIndex]) as NgcFormGroup;
      //
      cellsStyle.data = NgcUtility.getDateAsString(group.get('banPeriodFrom').value)
        + '-' + NgcUtility.getDateAsString(group.get('banPeriodTill').value);
    }
    return cellsStyle;
  };

  banCreateFromDate(event) {
    this.banCreateFrom = null;
    if (this.maintainBanInfoForm.get('search.banPeriodFrom').value && this.maintainBanInfoForm.get('search.banPeriodTill').value
      || ((this.maintainBanInfoForm.get('search.banPeriodFrom').value && this.maintainBanInfoForm.get('search.banCreateTo').value))
      || ((this.maintainBanInfoForm.get('search.banPeriodTill').value && this.maintainBanInfoForm.get('search.banCreateTo').value))) {
      this.maintainBanInfoForm.get('search.banCreateFrom').setValue(null);
    }
    else {
      this.maintainBanInfoForm.get('search.banCreateFrom').setValue(event);
    }
  }
  banCreateToDate(event) {
    this.banCreateTo = null;
    if (this.maintainBanInfoForm.get('search.banPeriodFrom').value && this.maintainBanInfoForm.get('search.banPeriodTill').value
      || ((this.maintainBanInfoForm.get('search.banPeriodFrom').value && this.maintainBanInfoForm.get('search.banCreateFrom').value))
      || ((this.maintainBanInfoForm.get('search.banPeriodTill').value && this.maintainBanInfoForm.get('search.banCreateFrom').value))) {
      this.maintainBanInfoForm.get('search.banCreateTo').setValue(null);
    }
    else {
      this.maintainBanInfoForm.get('search.banCreateTo').setValue(event);
    }
  }
  banPeriodFromDate(event) {
    this.banPeriodFrom = null;
    if (this.maintainBanInfoForm.get('search.banCreateFrom').value && this.maintainBanInfoForm.get('search.banCreateTo').value
      || ((this.maintainBanInfoForm.get('search.banCreateFrom').value && this.maintainBanInfoForm.get('search.banPeriodTill').value))
      || ((this.maintainBanInfoForm.get('search.banCreateTo').value && this.maintainBanInfoForm.get('search.banPeriodTill').value))) {
      this.maintainBanInfoForm.get('search.banPeriodFrom').setValue(null);
    }
    else {
      this.maintainBanInfoForm.get('search.banPeriodFrom').setValue(event);
    }
  }
  banPeriodTillDate(event) {
    this.banPeriodTill = event;
    if ((this.maintainBanInfoForm.get('search.banCreateFrom').value && this.maintainBanInfoForm.get('search.banCreateTo').value) || ((this.maintainBanInfoForm.get('search.banCreateFrom').value && this.maintainBanInfoForm.get('search.banPeriodFrom').value))
      || ((this.maintainBanInfoForm.get('search.banCreateTo').value && this.maintainBanInfoForm.get('search.banPeriodFrom').value))) {
      this.maintainBanInfoForm.get('search.banPeriodTill').setValue(null);
    }
    else {
      this.maintainBanInfoForm.get('search.banPeriodTill').setValue(event);
    }
  }
}