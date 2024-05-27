import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageConfiguration, NgcPage, NgcFormControl, NgcUtility, DateTimeKey, NgcWindowComponent, NgcFormGroup, ReactiveModel, NgcFormArray } from 'ngc-framework';
import { Subscription } from 'rxjs';
import { DashboardService, REFRESH_IN_MS } from '../dashboard.service';
import { SearchFlightDashboard } from '../dashboard.sharedmodel';
@Component({
  selector: 'app-export-flight-dashboard',
  templateUrl: './export-flight-dashboard.component.html',
  styleUrls: ['./export-flight-dashboard.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
})

export class ExportFlightDashboardComponent extends NgcPage implements OnInit {
  detailsDashboardObject: any;
  showWindow: boolean = false;
  @ViewChild('flightDashboardWindow') flightDashboardWindow: NgcWindowComponent;
  onSuccess: boolean = false;
  title: string;
  autoRefreshSubscription: Subscription;
  expCargAccp: boolean = false;
  expBuLink: boolean = false;
  expUldReady: boolean = false;
  expUldHO: boolean = false;
  expDocAccp: boolean = false;
  expPreManifest: boolean = false;

  /* constructor for dependency injection */
  constructor(
    appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router, private dashboardService: DashboardService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  /* This form is used for getting the respose */
  public searchForm: NgcFormGroup = new NgcFormGroup({
    fromDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 90, DateTimeKey.DAYS),
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
  public exportFlightDashboard: NgcFormGroup;

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
    //api call to fetch export dashboard list
    this.dashboardService.getSlaDashBoardTVExport(this.searchForm.getRawValue()).subscribe(response => {
      this.resetFormMessages();
      this.exportFlightDashboard.reset();
      if (!this.showResponseErrorMessages(response)) {
        if (response.data && response.data.exportList && response.data.exportList.length > 0) {
          //The below flags are used for column preferences
          this.expCargAccp = response.data.exportList[0].expCargAccp;
          this.expBuLink = response.data.exportList[0].expBuLink;
          this.expUldReady = response.data.exportList[0].expUldReady;
          this.expUldHO = response.data.exportList[0].expUldHO;
          this.expDocAccp = response.data.exportList[0].expDocAccp;
          this.expPreManifest = response.data.exportList[0].expPreManifest;
          //Patching the data into the export dashboard table
          this.exportFlightDashboard.patchValue(response.data);
          this.onSuccess = true;
        } else {
          this.showErrorMessage('no.record');
        }
      }
    }, (error: string) => {
      this.showErrorMessage(error);
    }
    );
  }
  /* This object is used for condition based window title change */
  private paramValue = {
    cargoAcceptance: {
      title: 'Cargo Acceptance',
      value: 'cargoAcceptance'
    },
    buLink: {
      title: 'Build Up',
      value: 'buLink'
    },
    uldReady: {
      title: 'ULD Ready',
      value: 'uldReady'
    },
    uldHo: {
      title: 'ULD H/O',
      value: 'uldHo'
    },
    documentAcceptance: {
      title: 'Document Acceptance',
      value: 'documentAcceptance'
    },
    preManifest: {
      title: 'PreManifest',
      value: 'preManifest'
    }
  }

  /* This function is used to pass parameters for window */
  onClickFlightDetails(parameter, index) {
    this.showWindow = true;
    this.detailsDashboardObject = this.exportFlightDashboard.get(['exportList', index]).value;
    this.detailsDashboardObject.parameter = parameter;
    this.detailsDashboardObject.parameter1 = "export";
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