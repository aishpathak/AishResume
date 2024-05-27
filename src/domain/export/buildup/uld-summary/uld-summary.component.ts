import { Validators } from '@angular/forms';
import {
  NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcButtonComponent, NgcUtility, DateTimeKey, PageConfiguration
  , CellsRendererStyle
} from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { BuildupService } from './../buildup.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-uld-summary',
  templateUrl: './uld-summary.component.html',
  styleUrls: ['./uld-summary.component.scss']
})

@PageConfiguration({
  trackInit: true,
  autoBackNavigation: true
})

export class UldSummaryComponent extends NgcPage implements OnInit {
  uldDetailsPassedData: any = null;
  response: any;
  dataTableFlag = false;
  defaultFromDate = new Date();
  defaultToDate = NgcUtility.addDate(this.defaultFromDate, 8, DateTimeKey.HOURS);
  private uldSummaryForm: NgcFormGroup = new NgcFormGroup({
    terminals: new NgcFormControl(),
    fromDateTime: new NgcFormControl(this.defaultFromDate),
    toDateTime: new NgcFormControl(this.defaultToDate),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(new Date()),
    carrierCode: new NgcFormControl(),
    listofflight: new NgcFormArray([])
  });

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private _buildupService: BuildupService, private toRoute: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }


  ngOnInit() {
    super.ngOnInit();
    this.uldDetailsPassedData = null;
    //setting terminal
    if (this.getUserProfile().terminalId != null && this.getUserProfile().terminalId != undefined) {
      this.uldSummaryForm.get('terminals').setValue(this.getUserProfile().terminalId);
    }
    this.uldSummaryForm.get('fromDateTime').valueChanges.subscribe((data) => {
      if (!this.uldDetailsPassedData) {
        this.uldSummaryForm.get('flightKey').reset();
        this.uldSummaryForm.get('flightDate').reset();
      }


    });
    this.uldSummaryForm.get('toDateTime').valueChanges.subscribe((data) => {
      if (!this.uldDetailsPassedData) {
        this.uldSummaryForm.get('flightKey').reset();
        this.uldSummaryForm.get('flightDate').reset();
      }
    });

    this.uldDetailsPassedData = this.getNavigateData(this.activatedRoute);
    if (this.uldDetailsPassedData) {
      if (!this.uldDetailsPassedData.terminalPoint) {
        this.uldSummaryForm.get('terminals').setValue(this.getUserProfile().terminalId);
      } else if (!this.uldDetailsPassedData.terminalToSendBack) {
        this.uldSummaryForm.get('terminals').setValue(this.getUserProfile().terminalId);
      }
      else {
        this.uldSummaryForm.get('terminals').setValue(this.uldDetailsPassedData.terminalToSendBack);
      }
      this.uldSummaryForm.patchValue(this.uldDetailsPassedData);
      this.uldSummaryForm.get('flightKey').reset();
      this.uldSummaryForm.get('flightDate').reset();
      // this.uldSummaryForm.get('fromDateTime').setValue(this.uldDetailsPassedData.fromDateTime);
      //this.uldSummaryForm.get('toDateTime').setValue(this.uldDetailsPassedData.toDateTime);

      if ((this.uldSummaryForm.get('fromDateTime').value == null || this.uldSummaryForm.get('fromDateTime').value == undefined) &&
        (this.uldSummaryForm.get('fromDateTime').value == null || this.uldSummaryForm.get('fromDateTime').value == undefined)) {
        this.uldSummaryForm.get('fromDateTime').setValue(this.defaultFromDate);
        this.uldSummaryForm.get('toDateTime').setValue(this.defaultToDate);
      }
      // set back to null
      this.uldDetailsPassedData = null;
      this.onSearch();
      return;
    }
  }

  // public ngAfterViewInit() {
  //      this.onSearch();
  // }

  public onSearch() {
    this.dataTableFlag = false;
    const request = this.uldSummaryForm.getRawValue();
    const fromDate = this.uldSummaryForm.get('fromDateTime').value;
    const toDate = this.uldSummaryForm.get('toDateTime').value;
    const dateDiffence = toDate - fromDate;


    if (!request.flightKey) {
      //check for date range 
      if (!fromDate && !toDate) {
        this.showErrorMessage("export.enter.date.range.or.flight.details");
        return;
      }
      if (!fromDate && toDate) {
        this.showErrorMessage("export.enter.from.date.to.perform.search");
        return;
      }
      if (fromDate && !toDate) {
        this.showErrorMessage("export.enter.to.date.to.perform.search");
        return;
      }
    } else if (!fromDate && !toDate) {
      if (request.flightKey && !request.flightDate) {
        this.showErrorMessage("export.enter.flight.date.to.perform.search");
        return;
      }

    }
    

    //clearing the to and from date when user input flightkey and date 
    if (request.flightKey != null && request.flightDate != null) {
      request.toDateTime = null;
      request.fromDateTime = null;
    }

    this._buildupService.fetchUldSummery(request).subscribe(data => {
      this.response = data.data;
      this.refreshFormMessages(this.response);
      if (data.success && this.response.uldSummaryFlightDetailsList.length !== 0) {
        this.uldSummaryForm.get('listofflight').patchValue(this.response.uldSummaryFlightDetailsList);
        if (request.flightKey != null && request.flightDate != null) {
          this.uldSummaryForm.get('toDateTime').setValue(request.toDateTime);
          this.uldSummaryForm.get('fromDateTime').setValue(request.fromDateTime);
          this.uldSummaryForm.get('flightKey').setValue(request.flightKey);
          this.uldSummaryForm.get('flightDate').setValue(request.flightDate);
        }

        this.dataTableFlag = true;
        this.showSuccessStatus('g.completed.successfully');
      } else {
        this.uldSummaryForm.reset();
        this.uldSummaryForm.get('fromDateTime').setValue(this.defaultFromDate);
        this.uldSummaryForm.get('toDateTime').setValue(this.defaultToDate);
        this.uldSummaryForm.get('terminals').setValue(this.getUserProfile().terminalId);
        this.uldSummaryForm.get('flightDate').setValue(new Date());
        this.showInfoStatus('export.no.summary');
      }
    }, error => {
      this.showErrorMessage('g.not.able.to.connect');
      return;
    });
  }

  // public UldDetailsComponent(event) {
  //   // exmp
  //   const req = 'getNavigated';
  //   this.navigateTo(this.toRoute,'/export/buildup/ulddetails',req);
  // }

  public onLinkClick(event) {
    let req = null;
    req = event.record;
    console.log("data", event.record);
    req.terminals = this.uldSummaryForm.get('terminals').value;
    req.fromDateTime = this.uldSummaryForm.get('fromDateTime').value;
    req.toDateTime = this.uldSummaryForm.get('toDateTime').value;
    this.navigateTo(this.toRoute, '/export/buildup/ulddetails', req);

  }


  public ngOnDestroy(): void {
    super.ngOnDestroy();
    // Unsubscribe
    // if  (this.cacheSubscription) {
    //   this.cacheSubscription.unsubscribe();
    // }
  }
  public etdDateCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.showDateFlag === 'false') {
      cellsStyle.data = NgcUtility.getTimeAsString(NgcUtility.getDateTime(rowData.dateEtd))
    }
    else {
      cellsStyle.data = NgcUtility.getDateTimeAsString(rowData.dateEtd);
    }

    return cellsStyle;
  }

  onClear(event) {
    this.dataTableFlag = false;
    this.uldSummaryForm.reset();
    this.uldSummaryForm.get('fromDateTime').setValue(this.defaultFromDate);
    this.uldSummaryForm.get('toDateTime').setValue(this.defaultToDate);
    this.uldSummaryForm.get('terminals').setValue(this.getUserProfile().terminalId);

  }
}
