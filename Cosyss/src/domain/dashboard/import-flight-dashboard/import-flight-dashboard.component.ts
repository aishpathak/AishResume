import { Component, ElementRef, Input, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageConfiguration, NgcFormGroup, NgcFormControl, NgcUtility, NgcPage, NgcWindowComponent, ReactiveModel, DateTimeKey, NgcFormArray } from 'ngc-framework';
import { interval, Subscription } from 'rxjs';
import { DashboardService, REFRESH_IN_MS } from '../dashboard.service';
import { SearchFlightDashboard } from '../dashboard.sharedmodel';

@Component({
  selector: 'app-import-flight-dashboard',
  templateUrl: './import-flight-dashboard.component.html',
  styleUrls: ['./import-flight-dashboard.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
})

export class ImportFlightDashboardComponent extends NgcPage implements OnInit {
  @ViewChild('flightDashboardWindow') flightDashboardWindow: NgcWindowComponent;
  showWindow: boolean = false;
  detailsDashboardObject: any;
  onSuccess: boolean = false;
  detailsDashboard: boolean = false;
  title: string = null;
  autoRefreshSubscription: Subscription;
  impAWBDoc: boolean = false;
  impConstraintCode: boolean = false;
  impUldCheckIn: boolean = false;
  impECAN: boolean = false;

  /* constructor for dependency injection */
  constructor(
    appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router, private dashboardService: DashboardService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  /* This form is used for getting the respose */
  public searchForm: NgcFormGroup = new NgcFormGroup({
    fromDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 30, DateTimeKey.DAYS),
      (0 * 60) + 0,
      DateTimeKey.MINUTES), Validators.required),
    toDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59,
      DateTimeKey.MINUTES), Validators.required),
    carrierCode: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightStatusDescription: new NgcFormControl(),
    auto: new NgcFormControl()
  });

  /* This is the main form, it  is used for saving the respose of list data */
  @ReactiveModel(SearchFlightDashboard)
  public importFlightDashboardForm: NgcFormGroup;

  /* Oninit function */
  ngOnInit() {
    this.onChangeData(this.searchForm.get('auto').value);
    const forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData) {
      this.searchForm.patchValue(forwardedData);
      this.onSearch('onLoad');
    } else {
      this.onSearch('onLoad')
    }
  }

  /* On search : called when search is clicked */
  onSearch(event) {
    this.onSuccess = false;
    if (event !== 'onLoad') {
      if (this.searchForm.invalid) {
        this.searchForm.validate();
        return;
      }
    }
    //api call to fetch import dashboard list
    this.dashboardService.getSlaDashBoardTVImport(this.searchForm.getRawValue()).subscribe(response => {
      this.resetFormMessages();
      this.importFlightDashboardForm.reset();
      if (!this.showResponseErrorMessages(response)) {
        if (response.data && response.data.importList && response.data.importList.length > 0) {
          //The below flags are used for column preferences
          this.impAWBDoc = response.data.importList[0].impAWBDoc;
          this.impConstraintCode = response.data.importList[0].impConstraintCode;
          this.impUldCheckIn = response.data.importList[0].impUldCheckIn;
          this.impECAN = response.data.importList[0].impECAN;
          //Patching the data into the import dashboard table
          this.importFlightDashboardForm.patchValue(response.data);
          this.onSuccess = true;
        } else {
          this.showErrorMessage('no.record');
        }
      }
    }, (error: string) => {
      this.showErrorMessage('error');
    });
  }

  /* This object is used for condition based window title change */
  private paramValue = {
    totalManifestWeight: {
      title: 'Total Tonnage',
      value: 'totalManifestWeight'
    },
    totalDocumentReceived: {
      title: 'AWB Document',
      value: 'totalDocumentReceived'
    },
    flightCustomSubmission: {
      title: 'Customs Submission',
      value: 'flightCustomSubmission'
    },
    ccTotalShipment: {
      title: 'Maintain Constraint Code',
      value: 'ccTotalShipment'
    },
    towinRamp: {
      title: 'ULD Check-In',
      value: 'towinRamp'
    },
    IMR: {
      title: 'BreakDown Details(CBD)',
      value: 'IMR'
    },
    PRI: {
      title: 'BreakDown Details(CBD)',
      value: 'PRI'
    },
    GEN: {
      title: 'BreakDown Details(CBD)',
      value: 'GEN'
    },
    ECAN: {
      title: 'BreakDown Details(CBD)',
      value: 'ECAN'
    }
  }
  /* This function is used to pass parameters for window */
  onClickFlightDetails(parameter, index) {
    this.showWindow = true;
    this.detailsDashboardObject = this.importFlightDashboardForm.get(['importList', index]).value;
    this.detailsDashboardObject.parameter = parameter;
    this.detailsDashboardObject.parameter1 = "import";
    this.title = this.paramValue[parameter].title;
    this.flightDashboardWindow.open();
  }

  /* This function is used make null of details dashboard object after closing the window */
  detailsDashboardResponse() {
    this.title = null;
    this.detailsDashboardObject = null;
    this.flightDashboardWindow.close();
  }

  /* This function is used to auto refresh the table list data */
  onChangeData(event) {
    if (this.autoRefreshSubscription && this.onSuccess) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = null;
    }
    if (event === true && this.onSuccess) {
      this.autoRefreshSubscription = this.getTimer(REFRESH_IN_MS).subscribe((data) => {
        this.onSearch(event);
      });
    }
  }
}


