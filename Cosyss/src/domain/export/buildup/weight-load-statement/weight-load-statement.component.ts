import {
  Component,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {
  WeightLoadStatement,
  WeightLoadStmtFlight,
  WlsDLSULDTrolley,
  WeightLoadStmtEnums
} from "./../buildup.sharedmodel";
import { BuildupService } from "./../buildup.service";
import {
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcPage,
  PageConfiguration,
  NgcUtility,
  NgcReportComponent
} from "ngc-framework";

@Component({
  selector: 'app-weight-load-statement',
  templateUrl: './weight-load-statement.component.html',
  styleUrls: ['./weight-load-statement.component.scss']
})

/* page configuration on page initialization */
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

export class WeightLoadStatementComponent extends NgcPage {
  transferData: any;
  oldFlightSegmentId: any;
  showPage = false;
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  reportParameters: any;

  /*
  * search Form
  */
  private formSearch = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    flightSegmentId: new NgcFormControl(),
    flightOriginDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
  });

  /*
  * search result Form
  */
  private form = new NgcFormGroup({
    flightId: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightSegmentId: new NgcFormControl(),
    flightOriginDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    std: new NgcFormControl(),
    etd: new NgcFormControl(),
    aircraftType: new NgcFormControl(),
    routingInfo: new NgcFormControl(),
    status: new NgcFormControl(),
    weightLoadStatementULDTrolleyList: new NgcFormArray([]),
    preparedBy: new NgcFormControl(),
    telephoneNo: new NgcFormControl(),
    checkedBy: new NgcFormControl(),
    remarks: new NgcFormControl(),
    wlsFinalizeDate: new NgcFormControl(),
    wlsStatus: new NgcFormControl(),
    wlsCompletedBy: new NgcFormControl(),
    completed: new NgcFormControl(),
    finalize: new NgcFormControl(),
    reportTemplate: new NgcFormControl()
  });

  /* constructor for dependency injection */
  constructor(appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private buildService: BuildupService) {
    super(appZone, appElement, appContainerElement);
  }

  /* Oninit function */
  ngOnInit() {
    super.ngOnInit();
    //Search and show data on Navigation from other screen
    this.transferData = this.getNavigateData(this.activatedRoute);
    try {
      if (!NgcUtility.isBlank(this.transferData)) {
        const s = new WeightLoadStatement();
        s.flightKey = this.transferData.flightKey;
        s.flightOriginDate = this.transferData.flightOriginDate;
        if (this.transferData.flightSegmentId) {
          s.flightSegmentId = this.transferData.flightSegmentId;
          this.formSearch.patchValue(s);
          this.searchWLS();
        } else {
          this.formSearch.patchValue(s);
          this.onSearch();
        }
      }
    } catch (e) { }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    //On segment change populate segment wise data on table
    this.form.get('flightSegmentId').valueChanges.subscribe(res => {
      if (res && this.oldFlightSegmentId != res) {
        this.oldFlightSegmentId = res;
        this.formSearch.get('flightSegmentId').setValue(res);
        this.searchWLS();
      } else if (NgcUtility.isBlank(res)) {
        this.oldFlightSegmentId = res;
        this.formSearch.get('flightSegmentId').setValue(res);
        this.searchWLS();
      }
    });
  }

  /**
   * Method to populate the Search Results in the screen
   */
  onSearch() {
    this.form.reset();
    this.formSearch.validate();
    if (this.formSearch.invalid) {
      return;
    }
    const sourceIdSegmentDropdown = this.createSourceParameter(this.formSearch.get('flightKey').value
      , this.formSearch.get('flightOriginDate').value
    );
    this.retrieveDropDownListRecords('FLIGHTSEGMENT', 'query', sourceIdSegmentDropdown)
      .subscribe(data => {
        if (data && data.length > 0) {
          this.formSearch.get('flightSegmentId').setValue(data[0].code);
          this.oldFlightSegmentId = this.formSearch.get('flightSegmentId').value;
          this.searchWLS();
        }
      }, (error: string) => {
        this.searchWLS();
      }
      );
  }

  /**
   * Method to call WLS search Api
   */
  searchWLS() {
    //Search Api Call
    this.buildService.searchWeightLoadStatement(this.formSearch.getRawValue()).subscribe(resp => {
      if (!this.showResponseErrorMessages(resp)) {
        if (resp.data && resp.data.weightLoadStatementULDTrolleyList && resp.data.weightLoadStatementULDTrolleyList.length > 0) {
          this.patchTheSearchResponse(resp);
        } else {
          this.showErrorMessage('no.record');
        }
      }
    }, (error: string) => {
      this.showErrorMessage(error);
    }
    );
  }

  /**
   * Method to patch the Search Results in Form
   */
  patchTheSearchResponse(resp) {
    this.refreshFormMessages(resp);
    if (!NgcUtility.isBlank(resp.data)) {
      if (resp.data.status == 'DEP') {
        this.form.disable();
      }
      if (resp.data.wlsStatus == WeightLoadStmtEnums.FINALLOAD) {
        resp.data.finalize = true;
        this.form.disable();
      }
      let uldTrolleyListSegmentWise = new Array<WlsDLSULDTrolley>();
      resp.data.weightLoadStatementULDTrolleyList.forEach(element => {
        if (element.uldTrolleyNumber != 'NIL' && element.flightSegmentId == this.oldFlightSegmentId) {
          uldTrolleyListSegmentWise.push(element);
        }
      });
      if (!NgcUtility.isBlank(this.oldFlightSegmentId)) {
        resp.data.weightLoadStatementULDTrolleyList = uldTrolleyListSegmentWise;
      }
      this.form.patchValue(resp.data, { onlySelf: true, emitEvent: false });
      this.showPage = true;
    }
  }

  /**
   * Method to Save the Search data from Screen
   */
  globalSave(event) {
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    //Save Api Call
    this.buildService.saveWeightLoadStatement(this.getWLSObject('save')).subscribe(resp => {
      const response = resp;
      if (!this.showResponseErrorMessages(resp)) {
        this.showSuccessStatus("g.completed.successfully");
        this.searchWLS();
      }
    }, (error: string) => {
      this.showErrorMessage(error);
    }
    );
  }

  /**
   * Method to Navigate back to previous screen
   */
  onCancel() {
    this.navigateBack(this.transferData);
  }

  /**
   * Method to reset form and hide search result on search change
   */
  onSearchChange() {
    this.resetFormMessages();
    this.showPage = false;
    this.form.reset();
  }

  /**
   * Method to Finalize data for a Flight
   */
  finalizeWLS() {
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    //FinalizeOrUnfinalize  Api Call
    this.buildService.finalizeOrUnfinalizeWeightLoadStatement(this.getWLSObject('finalize')).subscribe(resp => {
      const response = resp;
      if (!this.showResponseErrorMessages(resp)) {
        this.showSuccessStatus("g.completed.successfully");
        this.searchWLS();
      }
    }, (error: string) => {
      this.showErrorMessage(error);
    }
    );
  }

  /**
   * Method to Unfinalize data for a Flight
   */
  unFinalizeWLS() {
    //FinalizeOrUnfinalize  Api Call
    this.buildService.finalizeOrUnfinalizeWeightLoadStatement(this.getWLSObject('unfinalize')).subscribe(resp => {
      const response = resp;
      if (!this.showResponseErrorMessages(resp)) {
        this.showSuccessStatus("g.completed.successfully");
        this.form.enable();
        this.searchWLS();
      }
    }, (error: string) => {
      this.showErrorMessage(error);
    }
    );
  }

  getWLSObject(type): WeightLoadStmtFlight {
    const wls: WeightLoadStmtFlight = new WeightLoadStmtFlight();
    wls.flightId = this.form.get("flightId").value;
    wls.flightKey = this.form.get("flightKey").value;
    wls.flightOriginDate = this.form.get("flightOriginDate").value;
    wls.flagCRUD = this.form.get('flagCRUD').value;
    const uldTrolley = (<NgcFormGroup>this.form.get("weightLoadStatementULDTrolleyList")).getRawValue();
    let uldTrolleyList = new Array<WlsDLSULDTrolley>();
    uldTrolley.forEach(element => {
      if (element.uldTrolleyNumber && element.uldTrolleyNumber != "NIL" && element.uldTrolleyNumber != "") {
        element.terminal = this.getUserProfile().terminalId;
        element.handlingArea = this.getUserProfile().terminalId;
        uldTrolleyList.push(element);
      }
    });
    wls.preparedBy = this.form.get('preparedBy').value;
    wls.telephoneNo = this.form.get('telephoneNo').value;
    wls.checkedBy = this.form.get('checkedBy').value;
    wls.remarks = this.form.get('remarks').value;
    wls.flightSegmentId = this.form.get('segmentId').value;
    wls.wlsStatus = (type == 'save') || (type == 'unfinalize') ? WeightLoadStmtEnums.PRELOAD : WeightLoadStmtEnums.FINALLOAD;
    wls.finalize = (type == 'finalize') ? true : false;
    wls.weightLoadStatementULDTrolleyList = uldTrolleyList;
    return wls;
  }
  printReport() {
    this.reportParameters = new Object();
    this.reportParameters.flightId = this.form.get("flightId").value;
    this.reportParameters.routingInfo = this.form.get("routingInfo").value;
    this.reportParameters.reportTemplate = this.form.get("reportTemplate").value;
    this.reportWindow.downloadReport();
  }

}
