import { Component, ElementRef, NgZone, OnChanges, ViewContainerRef, } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DockUtlizationSearchModel } from '../tcs.sharedmodel'
import {
  NgcFormGroup, NgcFormArray, NgcUtility, NgcPage,
  NgcFormControl, PageConfiguration, CellsRendererStyle
} from 'ngc-framework';
import { PAGE_REFRESH_MS, REFRESH_IN_MS, TcsService } from '../tcs.service'
import { CellsStyleClass } from '../../../shared/shared.data';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dock-utilization-details',
  templateUrl: './dock-utilization-details.component.html',
  styleUrls: ['./dock-utilization-details.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class DockUtilizationDetailsComponent extends NgcPage {
  // flag to hide table if data not found 
  public searched: boolean = false;
  // Docklist array to create the columns 
  public dockList: Array<string> = null;
  // maxmin date varables  to add the maxmin date 
  public minDateTime: Date = NgcUtility.getDateOnly(new Date());
  public maxDateTime: Date = NgcUtility.addDate(NgcUtility.getDateOnly(new Date()), 1, 'd');


  autoRefresh: Subscription;

  // Dock utlization form 
  public docUtilizationForm: NgcFormGroup = new NgcFormGroup({
    search: new NgcFormGroup({
      dockCharacteristics: new NgcFormControl(null, Validators.required),
      floor: new NgcFormControl(),
      zone: new NgcFormControl(),
      auto: new NgcFormControl(),
      startPeriodDate: new NgcFormControl(this.minDateTime, Validators.required),
      endPeriodDate: new NgcFormControl(this.maxDateTime, Validators.required),

    }),
    dockUtilizationList: new NgcFormArray([])
  });



  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private service: TcsService) {
    super(appZone, appElement, appContainerElement);
  }

  /**
   * On Sarch
   * 
   */
  onSearch() {
    this.searched = false;
    this.search()
  }

  search() {

    let searchGroup = (this.docUtilizationForm.get('search') as NgcFormGroup)
    //validate formgroup
    searchGroup.validate();
    //
    if (searchGroup.invalid) {
      return;
    }
    // get the data from the form 
    let request: DockUtlizationSearchModel = searchGroup.getRawValue();
    // Reset
    (this.docUtilizationForm.get("dockUtilizationList") as NgcFormArray).resetValue([]);
    this.searched = false;
    // Get the Dock Util Details 
    this.service.searchDockUtilDetails(request).subscribe((response) => {
      if (!this.showResponseErrorMessages(response)) {
        if (response.data.dockList)
          this.dockList = response.data.dockList;
        if (this.dockList.length != 0) {
          this.docUtilizationForm.get("dockUtilizationList").patchValue(response.data.dockUtilizationList);
          this.searched = true;
        } else {
          this.searched = false;
          this.showInfoStatus("no.record");
        }

      } else if (response && response.data && response.data.length == 0) {
        this.showInfoStatus("no.record");
        this.searched = false;
      } else {
        this.showInfoStatus("no.record");
        this.searched = false;

      }
    });

  }

  ngOnInit() {
    this.docUtilizationForm.get('search.endPeriodDate').setValue(NgcUtility.addDate(new Date(), 5, 'h'));
    this.docUtilizationForm.get('search.startPeriodDate').setValue(NgcUtility.addDate(new Date(), -1, 'h'));

  }
  /**
   * On From Date/Time Change
   */
  public onFromDateChange() {
    const fromDate: Date = this.docUtilizationForm.get('search.startPeriodDate').value;
    if (fromDate) {

      this.maxDateTime = NgcUtility.addDate(fromDate, 1, 'd');

    }
  }

  /**
   * Groups Renderer
   * 
   * @param value 
   * @param rowData 
   * @param level 
   * @param groupData 
   * @returns  
   */
  protected groupsRenderer = (
    value: any, rowData: any, level: any, groupData: any
  ): any => {
    if (rowData) {
      return NgcUtility.getDateAsString(rowData.data.startDate);
    }
    return null;
  };

  /**
   * 
   * @param row 
   * @param column 
   * @param value 
   * @param rowData 
   * @returns 
   */
  public cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    if (rowData) {
      const groupIndex: number = parseInt(rowData.NGC_ROW_ID);
      const group: NgcFormGroup = this.docUtilizationForm.get(['dockUtilizationList', groupIndex]) as NgcFormGroup;
      //
      cellsStyle.data = NgcUtility.getTimeAsString(group.get('startDateTime').value)
        + '-' + NgcUtility.getTimeAsString(group.get('endDateTime').value);
    }
    return cellsStyle;
  };


  onchangedata(event) {
    if (event.checked === false && this.searched) {
      this.autoRefresh.unsubscribe();
      this.autoRefresh = null;
    }
    if (event.checked === true && this.searched) {
      this.autoRefresh = this.getTimer(REFRESH_IN_MS).subscribe(data => {
        this.onSearch();
      });
    }
  }



}
