import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, DateTimeKey,
  NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration, NgcDataTableComponent
} from 'ngc-framework';
import { FormArray, FormControl, AbstractControl, Validator, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { SearchForMssDetails } from '../dashboard.sharedmodel';
import { Subscription, Observable, interval } from 'rxjs';

@Component({
  selector: 'app-mss-dashboard-videoWall',
  templateUrl: './mss-dashboard-videoWall.component.html',
  styleUrls: ['./mss-dashboard-videoWall.component.scss']
})

export class MssDashboardVideoWallComponent extends NgcPage implements OnInit {

  @ViewChild('MssDashboadViewTable') MssDashboadViewTable: NgcDataTableComponent;

  resp: any;
  showForSats: boolean = true;
  showForDnata: boolean = true;
  private autoRefreshSubscription: Subscription;
  currentPageIndex = 0;
  pageSize = 5;

  private mssDashboardForm: NgcFormGroup = new NgcFormGroup({
    auto: new NgcFormControl(true),
    sats: new NgcFormControl(false),
    dnata: new NgcFormControl(false),
    fromDate: new NgcFormControl(NgcUtility.subtractDate(new Date(), 90, DateTimeKey.MINUTES)),
    toDate: new NgcFormControl(NgcUtility.addDate(new Date(), 600, DateTimeKey.MINUTES))
  })

  private mssDashboardFormResponse: NgcFormGroup = new NgcFormGroup({
    responseForMssDashboard: new NgcFormArray([])
  })

  /**
   *
   * @param appZone
   * @param appElement
   * @param appContainerElement
   * @param router
   * @param activated
   */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private activatedRouter: ActivatedRoute, private dashboardService: DashboardService)
  { super(appZone, appElement, appContainerElement); }


  ngOnInit() {
    this.activatedRouter.queryParams.subscribe((data) => {
      let request: SearchForMssDetails = new SearchForMssDetails();
      if (data.screenmode && data.screenmode == 'DNATA') {
        request.dnata = true;
        this.showForDnata = true;
        this.showForSats = false;
        this.pageNavigateIntialize();
        this.onAutoSearchDnata(request.dnata);
      } else {
        request.sats = true;
        this.showForSats = true;
        this.showForDnata = false;
        this.pageNavigateIntialize();
        this.onAutoSearchSats(request.sats);
      }

    });

  }

  pageNavigateIntialize(): void {
    this.currentPageIndex = 0;
    interval(1000 * 7).subscribe(x => {
      this.currentPageIndex++;
      if (this.currentPageIndex >= (
        (this.resp.length + (this.pageSize - (this.resp.length % this.pageSize)
        )) / this.pageSize)) {
        this.currentPageIndex = 0;
      }
      this.MssDashboadViewTable.goToPage(this.currentPageIndex);
    });
  }

  public onAutoSearchDnata(value) {
    let search: SearchForMssDetails = new SearchForMssDetails();
    search.dnata = value;
    this.mssDashboardForm.get('dnata').setValue(value);
    search = this.mssDashboardForm.getRawValue();

    this.dashboardService.getMssDashBoard(search).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.resp = data.data;
        this.mssDashboardFormResponse.get('responseForMssDashboard').patchValue(this.resp);
      }
    },
      error => {
        this.showErrorStatus(error);
      })
  }

  public onAutoSearchSats(value) {
    let search: SearchForMssDetails = new SearchForMssDetails();
    search.sats = value;
    this.mssDashboardForm.get('sats').setValue(value);
    search = this.mssDashboardForm.getRawValue();

    this.dashboardService.getMssDashBoard(search).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.resp = data.data;
        this.mssDashboardFormResponse.get('responseForMssDashboard').patchValue(this.resp);
      }
    },
      error => {
        this.showErrorStatus(error);
      })
  }

  // public onSearch() {
  //   this.resetFormMessages();
  //   let search: SearchForMssDetails = new SearchForMssDetails();
  //   search = this.mssDashboardForm.getRawValue();

  //   this.dashboardService.getMssDashBoard(search).subscribe(data => {
  //     this.showForSats = false;
  //     this.showForDnata = false;
  //     if (!this.showResponseErrorMessages(data)) {

  //       if (search.fromDate != null || search.toDate != null) {
  //         if (search.sats) {
  //           this.showForSats = true;
  //           this.showForDnata = false;
  //         } else {
  //           this.showForDnata = true;
  //           this.showForSats = false;
  //         }
  //         this.resp = data.data;
  //         this.mssDashboardFormResponse.get('responseForMssDashboard').patchValue(this.resp);
  //       }
  //     }
  //   },
  //     error => {
  //       this.showErrorStatus(error);
  //     })
  // }

  /**
 * On SwitchChange
 */
  public onSwitchChange(event) {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = null;
    }
    if (event === true) {
      //this.onSearch();

      //-------------------------------- AutoPaginate on every 10 seconds--------------------------------
      this.currentPageIndex = 0;

      interval(1000 * 7).subscribe(x => {
        this.currentPageIndex++;
        if (this.currentPageIndex >= (
          (this.resp.length + (this.pageSize - (this.resp.length % this.pageSize)
          )) / this.pageSize)) {
          this.currentPageIndex = 0;
        }
        this.MssDashboadViewTable.goToPage(this.currentPageIndex);
      });

      // this.autoRefreshSubscription = this.getTimer(30000).subscribe((data) => {
      //   this.onSearch();
      // });
    }

  }

  /**
    * Cells Renderer
    * @param value Value
    * @param rowData Row Data
    * @param level Level
    */
  public cellsRenderer = (row: number, column: string, value: any, rowData: any): string => {

    if (column === 'allocation') {
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.allocation} " />
                </svg>
            </div>
            `
    }

    else if (column === 'truckDocColorCode') {
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.truckDocColorCode} " />
                </svg>
            </div>
            `
    }

    else if (column === 'infeedColorCode') {
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.infeedColorCode} " />
                </svg>
            </div>
            `
    }
    else if (column === 'manfColorCode') {
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.manfColorCode} " />
                </svg>
            </div>
            `
    }
    else if (column === 'hndColorCode') {
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.hndColorCode} " />
                </svg>
            </div>
            `
    }
    else if (column === 'ofdColorCode') {
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.ofdColorCode} " />
                </svg>
            </div>
            `
    }
    else if (column === 'releaseToDnata') {
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.releaseToDnata} " />
                </svg>
            </div>
            `
    }
  };

}
