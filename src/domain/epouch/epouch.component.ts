import { Component, OnInit } from '@angular/core';
import { NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import {
  NgcFormGroup, NgcFormControl, NgcFormArray, NgcPage, NgcUtility, DateTimeKey, PageConfiguration
} from 'ngc-framework';
import { Router, ActivatedRoute } from '@angular/router';
import { SummaryOfEpouch } from './epouch.sharedModel';
import { EpouchService } from './epouch.service';

@Component({
  selector: 'app-epouch',
  templateUrl: './epouch.component.html',
  styleUrls: ['./epouch.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true,
  focusToBlank: true
})
export class EpouchComponent extends NgcPage implements OnInit {

  resp: any;
  summaryListFlag: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private epouchService: EpouchService) {
    super(appZone, appElement, appContainerElement);
  }

  private summaryForm: NgcFormGroup = new NgcFormGroup({
    //fromDate: new NgcFormControl(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 1, DateTimeKey.MONTHS)),
    //toDate: new NgcFormControl(NgcUtility.getDateOnly(NgcUtility.addDate(new Date(), 1, DateTimeKey.DAYS))),
    flightDepDate: new NgcFormControl(),
    ePouchUploaded: new NgcFormControl(),
    agentCode: new NgcFormControl(),
    summaryListArray: new NgcFormArray([])
  })

  ngOnInit() {
  }

  ngAfterViewInit() {
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData) {
      this.searchSummary();
    }
    this.summaryForm.get('ePouchUploaded').valueChanges.subscribe(data => {
      this.searchSummary();
    });
  }


  public searchSummary() {
    let searchSummary: SummaryOfEpouch = new SummaryOfEpouch();
    searchSummary = this.summaryForm.getRawValue();
    searchSummary.fromDate = this.summaryForm.get('flightDepDate').value;
    searchSummary.toDate = this.summaryForm.get('flightDepDate').value;
    this.epouchService.fetchSummaryOfEpouch(searchSummary).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.summaryListFlag = true;
        this.resp = data.data;
        console.log("", searchSummary, data.data);
        this.resp.forEach(ele => {
          ele.epouchCreatedDateTime = (NgcUtility.getDateTimeAsStringByFormat(new Date(ele.epouchCreatedDateTime), 'DDMMMYYYY HH:mm')).toUpperCase();
        });
        this.summaryForm.get("summaryListArray").patchValue(this.resp);

      } else {
        this.summaryListFlag = false;
      }
    }, error => {
      this.showErrorMessage(error);
    })
  }

  public onClickLink(event) {
    const obj = {
      shipmentId: event.record.shipmentId,
      shipmentNumber: event.record.shipmentNumber
    }
    this.navigateTo(this.router, '/awbmgmt/shipmentinfo', obj);
  }
}
