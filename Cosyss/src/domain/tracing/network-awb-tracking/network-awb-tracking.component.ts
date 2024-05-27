import { element } from 'protractor';
import { AWB_ENV } from './../../../environments/environment.prod';
import { DISABLED } from '@angular/forms/src/model';
import { MaintainTracingActivitiesActivityModel, MaintainTracingActivityDimensionModel, MaintainTracingActivityLocationModel, MaintainTracingActivityShipmentInventoryModel } from './../tracing.shared';
import { TracingService } from './../tracing.service';
import { SearchNetworkAwbDetails } from '../tracing.shared'
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
  selector: 'app-network-awb-tracking',
  templateUrl: './network-awb-tracking.component.html',
  styleUrls: ['./network-awb-tracking.component.scss']
})
export class NetworkAwbTrackingComponent extends NgcPage {
  isTableFlag: boolean = true;
  dispTableFlag: boolean = true;
  networkawbTrackingResponse: any;
  carrierGroupCodeParam: any;
  indicatorType: any;
  airportCode: any;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private tracingService: TracingService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);

  }

  ngOnInit() {
  }

  private networkawbtrackingform: NgcFormGroup = new NgcFormGroup({
    awbNumber: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    awbKey: new NgcFormControl(),
    shcDetails: new NgcFormArray([]),
    awbTrackingDetails: new NgcFormArray([])
  });



  onSearch() {
    console.log("==test===");

    //this.networkuldtrackingform.get('displayTracingListForm').reset();

    const req: SearchNetworkAwbDetails = new SearchNetworkAwbDetails();
    req.shipmentNumber = this.networkawbtrackingform.get('awbNumber').value;

    this.tracingService.getNetworkAWBTrackingRecordsToDisplay(req).subscribe(response => {



      if (response.data && response.data.length == 0) {
        this.showInfoStatus("tracing.no.record.found");
        return;
      }
      if (response.data) {
        //this.isTableFlag = true;
        this.networkawbTrackingResponse = response.data;
        console.log("==awbmi===" + this.networkawbTrackingResponse);
        console.log("==awbmi===" + this.networkawbTrackingResponse.awbNumber);


        //this.displayNetworkUldTrackingForm.get(['displayNetworkUldTrackingForm', 'tracingList']).patchValue(this.tracingSearchList);
        this.networkawbtrackingform.get('awbKey').patchValue(this.networkawbTrackingResponse.shipmentNumber);
        this.networkawbtrackingform.get('origin').patchValue(this.networkawbTrackingResponse.origin);
        this.networkawbtrackingform.get('destination').patchValue(this.networkawbTrackingResponse.destination);
        this.networkawbtrackingform.get('pieces').patchValue(this.networkawbTrackingResponse.pieces);
        this.networkawbtrackingform.get('weight').patchValue(this.networkawbTrackingResponse.weight);
        this.networkawbtrackingform.get('shcDetails').patchValue(this.networkawbTrackingResponse.shcDetails);

        //(<NgcFormArray>this.networkawbtrackingform.controls['shcDetails']).patchValue(this.networkawbTrackingResponse.shcDetails);
        (<NgcFormArray>this.networkawbtrackingform.controls['awbTrackingDetails']).patchValue(this.networkawbTrackingResponse.awbTrackingDetails);
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
