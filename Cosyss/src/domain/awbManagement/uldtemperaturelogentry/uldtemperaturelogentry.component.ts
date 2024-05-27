import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, DateTimeKey, ReportFormat,
  NgcUtility, NgcWindowComponent, PageConfiguration, NgcReportComponent
} from 'ngc-framework';
import { AwbManagementService } from '../awbManagement.service';
import { ULDTempEntrySave, ULDTemperatureEntrySearch, ULDTemperatureLogEntry } from '../awbManagement.shared';

@Component({
  selector: 'app-uldtemperaturelogentry',
  templateUrl: './uldtemperaturelogentry.component.html',
  styleUrls: ['./uldtemperaturelogentry.component.scss'],
  providers: [AwbManagementService]
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class uldTemperatureLogEntryComponent extends NgcPage implements OnInit {

  /* Flags */
  uldTempLogEntryData: any = [];
  showData: boolean = false;
  windowFlag: boolean = false;
  printFlag: boolean = false;
  reportParameters: any = new Object();

  /* Form : that contain the search parameters */
  private uldTemperatureSearch = new NgcFormGroup({
    uldKey: new NgcFormControl(),
    dateFrom: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 30, DateTimeKey.DAYS),
      (0 * 60) + 0, DateTimeKey.MINUTES)),
    dateTo: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59,
      DateTimeKey.MINUTES))
  });

  /* Form : that contain whole screen data */
  private uldTemperatureData = new NgcFormGroup({
    uldTempLogEntryData: new NgcFormArray([]),
    addUldTemperature: new NgcFormArray([])
  })

  /* Window component - Adding records in the Pop up */
  @ViewChild("uldTemperatureRecordWindow") uldTemperatureRecordWindow: NgcWindowComponent;
  /* Window component - Report */
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;

  constructor(private awbService: AwbManagementService, appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private AwbManagementService: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }

  /* search function - on click of search button, data will be displayed */
  onSearch() {
    let uldSearch: ULDTemperatureEntrySearch = new ULDTemperatureEntrySearch();
    this.resetFormMessages();
    this.showData = false;
    this.printFlag = true;
    uldSearch.uldKey = this.uldTemperatureSearch.get('uldKey').value;
    uldSearch.dateFrom = this.uldTemperatureSearch.get('dateFrom').value;
    uldSearch.dateTo = this.uldTemperatureSearch.get('dateTo').value;
    // this.AwbManagementService.fetchUldTemperature(uldSearch).subscribe(data => {
    //   this.refreshFormMessages(data);
    //   this.uldTempLogEntryData = data.data;
    //   if (this.uldTempLogEntryData && this.uldTempLogEntryData.length > 0) {
    //     this.showData = true;
    //     if (this.uldTempLogEntryData && this.uldTempLogEntryData.length == 1) {
    //       this.printFlag = true;
    //     }
    //     else {
    //       this.printFlag = false;
    //     }
    //     this.uldTemperatureData.get('uldTempLogEntryData').patchValue(this.uldTempLogEntryData);
    //   } else {
    //     this.showErrorMessage('CUST002');
    //   }
    // })
  }

  /* on click of add button on the screen - pop up will open */
  onAdd() {
    this.resetFormMessages();
    const uldFormArray: NgcFormArray = <NgcFormArray>this.uldTemperatureData.get(['addUldTemperature']);
    uldFormArray.resetValue([]);
    this.onAddPopUp();
    this.windowFlag = true;
    this.uldTemperatureRecordWindow.open();
  }

  /* user can delete the record on click of delete icon present on corresponsing record */
  onDelete(index) {
    this.showConfirmMessage('export.are.you.sure.to.delete').then(fulfilled => {
      let request: ULDTemperatureLogEntry = (((<NgcFormArray>this.uldTemperatureData.get("uldTempLogEntryData")).getRawValue())[index]);
      // this.AwbManagementService.deleteUldTemperature(request).subscribe(response => {
      //   this.resetFormMessages();
      //   if (response !== null) {
      //     if (!this.showResponseErrorMessages(response)) {
      //       this.uldTemperatureData.patchValue(response.data);
      //       this.showSuccessStatus('g.deleted.successfully');
      //       this.onSearch();
      //     }
      //   }
      // })
    }).catch(reason => {
    });
  }

  /* add button function present inside the pop up - new rows will get added */
  onAddPopUp() {
    const uldFormArray: NgcFormArray =
      <NgcFormArray>this.uldTemperatureData.get(['addUldTemperature']);
    uldFormArray.addValue([
      {
        uldKey: '',
        temperatureType: '',
        temperatureTypeValue: '',
        uldEvent: '',
        temperature: '',
        temperatureCaptureDt: NgcUtility.getDateTimeOnly(new Date()),
        remarks: '',
      }
    ], { onlySelf: true, emitEvent: false });
  }

  /*  delete function inside the pop up window - rows will get deleted */
  onDeletePopUp(index) {
    (<NgcFormArray>this.uldTemperatureData.get('addUldTemperature')).markAsDeletedAt(index);
  }

  /*  save function - data will be saved on click of save button after entering the data inside pop up */
  onSavePopUp($event) {
    let uldTempEntrySave: ULDTempEntrySave = new ULDTempEntrySave();
    uldTempEntrySave.addUldTemperature = this.uldTemperatureData.get('addUldTemperature').value;
    this.uldTemperatureData.validate();
    if (!this.uldTemperatureData.valid) {
      this.showErrorStatus('g.fill.all.details');
      return;
    }
    if (uldTempEntrySave.addUldTemperature.length > 0) {
      // this.AwbManagementService.saveListUldTemperature(uldTempEntrySave.addUldTemperature).subscribe(data => {
      //   if (data) {
      //     this.showSuccessStatus('data.updated.successfully');
      //     this.windowFlag = false;
      //     this.uldTemperatureRecordWindow.close();
      //     this.onSearch();
      //   }
      // })
    }
  }

  /* close window method */
  onCloseWindow() {
    this.windowFlag = true;
  }

  /* on click of print button - pdf report will be generated  */
  public onPrint() {
    this.reportParameters.uld = this.uldTemperatureSearch.get('uldKey').value;
    this.reportParameters.fromDate = this.uldTemperatureSearch.get('dateFrom').value;
    this.reportParameters.toDate = this.uldTemperatureSearch.get('dateTo').value;
    this.reportParameters.loginuser = this.getUserProfile().userLoginCode;
    this.reportWindow.reportParameters = this.reportParameters;
    this.reportWindow.format = ReportFormat.PDF;
    this.reportWindow.open();
  }
}