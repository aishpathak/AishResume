import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcInputComponent, NgcUtility,
  NgcWindowComponent, NgcContainerComponent, PageConfiguration, NgcReportComponent
} from 'ngc-framework';
import { Router, ActivatedRoute } from '@angular/router';
import { ImportService } from '../import.service';
import { captureTimeStampSearch } from '../import.sharedmodel';

@Component({
  selector: 'app-capture-time-stamp',
  templateUrl: './capture-time-stamp.component.html',
  styleUrls: ['./capture-time-stamp.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class CaptureTimeStampComponent extends NgcPage implements OnInit {

  captureTimeEntryData: any = [];
  showData: boolean = false;


  private captureTimeStampSearch = new NgcFormGroup({
    truckNo: new NgcFormControl(),
    purpose: new NgcFormControl(),
    srfNumber: new NgcFormControl(),
    captureType: new NgcFormControl(),
    captureTimeEntryData: new NgcFormArray([]),

  });


  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData != null) {
      let srfnumbers: any[] = [];
      srfnumbers.push(forwardedData.srfNumber);
      this.captureTimeStampSearch.get('srfNumber').setValue(srfnumbers);
      this.onSearch();
    }

  }

  onSearch() {

    let search: captureTimeStampSearch = new captureTimeStampSearch();
    this.captureTimeStampSearch.validate();
    if (
      !this.captureTimeStampSearch.valid
    ) {
      return;
    }
    if ((this.captureTimeStampSearch.get('truckNo').value == "" || this.captureTimeStampSearch.get('truckNo').value == null
    )
      && (this.captureTimeStampSearch.get('srfNumber').value == "" || this.captureTimeStampSearch.get('srfNumber').value == null)) {
      this.showErrorMessage('import.enter.Truckno.Or.Srfno');
      return;
    }
    if (this.captureTimeStampSearch.get('truckNo').value != null && this.captureTimeStampSearch.get('truckNo').value != ""
      && (this.captureTimeStampSearch.get('purpose').value == null || this.captureTimeStampSearch.get('purpose').value == "")) {
      this.showErrorMessage('import.Purpose.mandatory');
      return;
    }

    this.showData = false;

    search.truckNo = this.captureTimeStampSearch.get('truckNo').value;
    search.purpose = this.captureTimeStampSearch.get('purpose').value;
    search.srfNumber = this.captureTimeStampSearch.get('srfNumber').value;

    this.importService.fetchCaptureTimeStamp(search).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.captureTimeEntryData = data.data;
        if (this.captureTimeEntryData && this.captureTimeEntryData.length > 0) {
          this.showData = true;
          this.captureTimeStampSearch.get('captureTimeEntryData').patchValue(this.captureTimeEntryData);
          let ccCodeError = "";
          this.captureTimeEntryData.forEach(element => {
            if (element.ccCodeError > 1) {
              ccCodeError = ccCodeError + "  " + element.srfNumber;
            }
          });
          // if (ccCodeError != "") {
          //   let placeHolder: any = [];
          //   placeHolder.push(ccCodeError);
          //   this.showErrorMessage('import.check.ccCode', null, placeHolder, true);
          // }
        } else {
          this.showErrorMessage('no.record');
        }
      }
    })
  }

  onCaptureTime() {
    let resultList = this.captureTimeStampSearch.get("captureTimeEntryData").value;
    if (this.captureTimeStampSearch.get("captureType").value == null) {
      this.showErrorMessage("import.select.Capture.Time.Stamp.Type");
      return;
    }
    let statuserror = false;
    resultList.forEach(element => {
      element.captureType = this.captureTimeStampSearch.get("captureType").value;
      //   if (element.status == "Charges are Pending") {
      //     statuserror = true;
      //   }
    });
    if (statuserror) {
      this.showErrorMessage("import.charges.pending");
      return;
    }
    this.importService.updateCaptureTime(resultList).subscribe(data => {

      this.refreshFormMessages(data);
      if (!this.showResponseErrorMessages(data)) {
        this.onSearch();
      } else {
        this.showErrorMessage(data.messageList[0].code, null, data.messageList[0].placeHolder, true);
      }
    })
  }


}
