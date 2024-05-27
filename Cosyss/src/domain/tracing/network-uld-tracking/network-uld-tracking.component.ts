import { element } from 'protractor';
import { AWB_ENV } from './../../../environments/environment.prod';
import { DISABLED } from '@angular/forms/src/model';
import { MaintainTracingActivitiesActivityModel, MaintainTracingActivityDimensionModel, MaintainTracingActivityLocationModel, MaintainTracingActivityShipmentInventoryModel } from './../tracing.shared';
import { TracingService } from './../tracing.service';
import { SearchNetworkUldDetails } from '../tracing.shared'
import { Component, OnInit } from '@angular/core';
import {
  NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, ContentChildren, forwardRef, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroupDirective, FormArray, FormGroup, FormControl, FormControlName, Validators } from '@angular/forms';
// Application
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, BaseResponse, NgcWindowComponent,
  NgcUtility, NgcTabsComponent, PageConfiguration, CellsRendererStyle, NgcFormControl, NgcSHCInputComponent
} from 'ngc-framework';

@Component({
  selector: 'app-network-uld-tracking',
  templateUrl: './network-uld-tracking.component.html',
  styleUrls: ['./network-uld-tracking.component.scss']
})
export class NetworkUldTrackingComponent extends NgcPage {
  isTableFlag: boolean = true;
  networkUldTrackingResponse: any;
  carrierGroupCodeParam: any;
  indicatorType: any;
  airportCode: any;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private tracingService: TracingService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);

  }

  ngOnInit() {
  }


  private networkuldtrackingform: NgcFormGroup = new NgcFormGroup({
    uldNumber: new NgcFormControl(),
    inStation: new NgcFormControl(),
    inFlight: new NgcFormControl(),
    inDate: new NgcFormControl(),
    outStation: new NgcFormControl(),
    outFlight: new NgcFormControl(),
    outDate: new NgcFormControl(),
    uldKey: new NgcFormControl()
  });

  private displayNetworkUldTrackingForm: NgcFormGroup = new NgcFormGroup({

    uldNumber: new NgcFormControl(),
    inStation: new NgcFormControl(),
    inFlight: new NgcFormControl(),
    inDate: new NgcFormControl(),
    outStation: new NgcFormControl(),
    outFlight: new NgcFormControl(),
    outDate: new NgcFormControl(),
    uldKey: new NgcFormControl()
  });

  onSearch() {
    console.log("==test===");

    //this.networkuldtrackingform.get('displayTracingListForm').reset();
    const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.networkuldtrackingform.get('serchNetworkuldtrackingform'));
    const req: SearchNetworkUldDetails = new SearchNetworkUldDetails();
    req.uldKey = this.networkuldtrackingform.get('uldNumber').value;

    this.tracingService.getNetworkUldTrackingRecordsToDisplay(req).subscribe(response => {


      if (response.data && response.data.length == 0) {
        this.showInfoStatus("tracing.no.record.found");
        return;
      }
      if (response.data) {
        //this.isTableFlag = true;
        this.networkUldTrackingResponse = response.data;
        //this.displayNetworkUldTrackingForm.get(['displayNetworkUldTrackingForm', 'tracingList']).patchValue(this.tracingSearchList);
        this.networkuldtrackingform.get('uldKey').patchValue(this.networkUldTrackingResponse.uldNumber);
        this.networkuldtrackingform.get('inStation').patchValue(this.networkUldTrackingResponse.inStation);
        this.networkuldtrackingform.get('inFlight').patchValue(this.networkUldTrackingResponse.inFlight);
        this.networkuldtrackingform.get('inDate').patchValue(this.networkUldTrackingResponse.inDate);
        this.networkuldtrackingform.get('outStation').patchValue(this.networkUldTrackingResponse.outStation);
        this.networkuldtrackingform.get('outFlight').patchValue(this.networkUldTrackingResponse.outFlight);
        this.networkuldtrackingform.get('outDate').patchValue(this.networkUldTrackingResponse.outDate);

        // } 
      } else {
        this.showInfoStatus("tracing.cannot.display.search.no.too.high");
        this.isTableFlag = false;
      }

      // else if (response.data && response.data.length > 100) {
      //   this.showInfoStatus("Please update more filter criteria");
      //   this.isTableFlag = false;
      // }
    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }

}
