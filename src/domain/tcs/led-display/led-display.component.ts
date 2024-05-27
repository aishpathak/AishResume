import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MAX_RECORDS, PAGE_REFRESH_MS, REFRESH_IN_MS, TcsService } from '../tcs.service'
import {
  NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, NgcPage,
  NgcButtonComponent, PageConfiguration, NgcFormControl
}
  from 'ngc-framework';
import { Subscription } from 'rxjs';
import { LedDisplayModel } from '../tcs.sharedmodel';

@Component({
  selector: 'app-led-display',
  templateUrl: './led-display.component.html',
  styleUrls: ['./led-display.component.scss']
})

@PageConfiguration({
  callNgOnInitOnClear: true,
  dashboard: true,
  trackInit: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class LedDisplayComponent extends NgcPage implements OnInit {
  public searched: boolean = false;
  public currentPage: number = 0;
  public recordRefreshSubscription: Subscription;
  public pageRefreshSubscription: Subscription;

  public ledDisplay: NgcFormGroup = new NgcFormGroup({
    floor: new NgcFormControl(),
    sNo: new NgcFormControl(),
    vehicleNo: new NgcFormControl(),
    truckDockNo: new NgcFormControl(),
    serialNo: new NgcFormControl(),
    records: new NgcFormArray([]),
    currentPageRecords: new NgcFormArray([])
  });
  /**
     * Initialize
     * 
     * @param appZone Ng Zone
     * @param appElement Element Ref
     * @param appContainerElement View Container Ref
     */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private service: TcsService) {
    super(appZone, appElement, appContainerElement);

  }
  public ngOnDestroy(): void {
    // Clear Subscriptions
    this.clearSubscription();
    //
    super.ngOnDestroy();
  }
  private clearSubscription() {
    if (this.recordRefreshSubscription) {
      this.recordRefreshSubscription.unsubscribe();
      this.recordRefreshSubscription = null;
    }
    if (this.pageRefreshSubscription) {
      this.pageRefreshSubscription.unsubscribe();
      this.pageRefreshSubscription = null;
    }
  }
  public populateCurrentPageRecords() {
    const recordsFormArray: NgcFormArray = this.ledDisplay.get('records') as NgcFormArray;
    let records: Array<any> = [];
    let totalRecords: number = recordsFormArray.length;
    let totalPages: number = parseInt(String(totalRecords / MAX_RECORDS));
    //
    if (totalRecords < MAX_RECORDS || (totalRecords > MAX_RECORDS && totalRecords % MAX_RECORDS != 0)) {
      totalPages++;
    }
    if ((this.currentPage + 1) > totalPages) {
      this.currentPage = 1;
    } else {
      this.currentPage++;
    }

    for (let index = 0; index < MAX_RECORDS; index++) {
      const at: number = ((this.currentPage - 1) * MAX_RECORDS) + index;
      if (at >= totalRecords) {
        break;
      }
      const record: any = recordsFormArray.get([at]).value;
      records.push(record);
    }
    // Refresh
    this.ledDisplay.get('currentPageRecords').patchValue(records);
  }
  //Search Function 
  public onSearch() {
    // Clear Subscriptions
    this.clearSubscription();
    // Reset Current Page to Zero
    this.currentPage = 0;
    // Search
    this.search(true);
    // Refresh Page
    this.pageRefreshSubscription = this.getTimer(PAGE_REFRESH_MS).subscribe(() => {
      this.populateCurrentPageRecords();
    });
    // Refresh Records
    this.recordRefreshSubscription = this.getTimer(REFRESH_IN_MS).subscribe(() => {
      this.search(false);
    });
  }
  public search(userSearch: boolean) {
    // Reset
    this.searched = false;
    let request = new LedDisplayModel();
    (<NgcFormArray>this.ledDisplay.get('records')).resetValue([]);
    this.service.searchLedInfo(request).subscribe((response) => {
      if (response.success) {
        this.ledDisplay.get('records').patchValue(response.data);
      }
      else {
        this.showErrorStatus("g.no.data.found");
      }
    });
    this.searched = true;
    if (userSearch) {
      this.populateCurrentPageRecords();
    }
  }
  //To Navigate to home Page
  oncancel($event) {
    this.navigateHome();
  }
}
