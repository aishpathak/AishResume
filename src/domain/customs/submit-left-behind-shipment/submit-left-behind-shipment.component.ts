import { Subscription } from 'rxjs';
// NGC framework imports
import {
  NgcFormGroup,
  NgcFormArray,
  NgcApplication,
  NgcWindowComponent,
  NgcDropDownComponent,
  NgcButtonComponent, NgcInputComponent,
  NgcPage,
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  PageConfiguration,
  NgcReportComponent,
  NgcLOVComponent,
  NgcUtility
} from "ngc-framework";

import {
  Component,
  NgZone,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ViewChild, HostListener, Input, Output, EventEmitter, TemplateRef
} from "@angular/core";

import { NgcFormControl } from "ngc-framework";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule, Validators } from '@angular/forms';
import { CustomACESService } from '../customs.service';
import { CustomsHouseSearchModel } from '../customs.sharedmodel';

@Component({
  selector: 'app-submit-left-behind-shipment',
  templateUrl: './submit-left-behind-shipment.component.html',
  styleUrls: ['./submit-left-behind-shipment.component.scss']
})
export class SubmitLeftBehindShipmentComponent extends NgcPage implements OnInit {
  shipmentList: any;
  resp: any;
  forwardedData: any;
  data: any;
  saveRequest: any;
  saveResponse: any;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private customsService: CustomACESService) {
    super(appZone, appElement, appContainerElement);
  }

  private searchShipmentForm: NgcFormGroup = new NgcFormGroup({
    flightId: new NgcFormControl(),
    searchFlag: new NgcFormControl()
  });
  private customsForm: NgcFormGroup = new NgcFormGroup({
    flightDate: new NgcFormControl(),
    flightId: new NgcFormControl(),
    flightData: new NgcFormGroup({
      ata: new NgcFormControl(),
      flightNo: new NgcFormControl(),
      virtualFlightNo: new NgcFormControl(),
      flightDate: new NgcFormControl(),
      virtualFlightDate: new NgcFormControl(),
      eta: new NgcFormControl(),
      sta: new NgcFormControl(),
      status: new NgcFormControl(),
      freezeIndicator: new NgcFormControl(),
      leftBehindExpiry: new NgcFormControl(),
      aircraftType: new NgcFormControl(),
      mawb: new NgcFormControl(),
      hawb: new NgcFormControl(),
      simpleCsgn: new NgcFormControl(),
      cnslCsgn: new NgcFormControl(),
      fltPriority: new NgcFormControl(),
      loadingpoint: new NgcFormControl(),
      shipmentList: new NgcFormArray([
        new NgcFormGroup({
          awbPiecesWeight: new NgcFormControl(),
          manifestPiecesWeight: new NgcFormControl(),
          hawbPiecesWeight: new NgcFormControl(),
        })
      ])
    })
  })


  ngOnInit() {
    super.ngOnInit();
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    if (this.forwardedData) {
      this.data = this.forwardedData;
      this.searchShipmentForm.patchValue(this.data);
      console.log(this.searchShipmentForm.value);
      this.OnSearch();
    }
  }

  /**
    * Retreive all shipment records for a flightId
    *
    */
  OnSearch() {
    let request = <NgcFormGroup>this.searchShipmentForm.getRawValue();
    this.customsService.customFlightShipmentInfo(request).subscribe(data => {
      this.refreshFormMessages(data);
      this.resp = data.data;
      this.customsForm.get('flightData').patchValue(data.data);
        
      let appendPiecesWeight = this.customsForm.get('flightData').get('shipmentList').value;
      if (appendPiecesWeight != null) {
        appendPiecesWeight.forEach(element => {
          //Concatinating Hawb Piece and Weight/Awb Piece and Weight/Manifest Piece and Weight
          if (element.hawbPieces != null && element.hawbWeight != null) {
            element.hawbPiecesWeight = element.hawbPieces + "/" + element.hawbWeight.toFixed(1);
          }
          if (element.awbPieces != null && element.awbWeight != null) {
            element.awbPiecesWeight = element.awbPieces + "/" + element.awbWeight.toFixed(1);
          }
          if (element.manifestPieces != null && element.manifestWeight != null) {
            element.manifestPiecesWeight = element.manifestPieces + "/" + element.manifestWeight.toFixed(1);
          }
        })
      }
    });
  }

  /**
  * Returns row value for serial number
  *
  * @returns
  */
  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  /**
  * Save Flight and shipment related information
  *
  * @returns
  */
  onSave(event) {
    let request = this.customsForm.get('flightData').value;
    //check if left behind is expired before performing operations
    if (this.customsForm.get('flightData').get('leftBehindExpiry').value == 'No') {
      this.customsService.saveShipmentInfo(request).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          if (response.data) {
            this.showSuccessStatus("g.completed.successfully");
            this.OnSearch();
          }
        }
      })
    }
    else {
      this.showErrorMessage('lbs.expired');
    }
  }

  /**
   * Update FlightSubmission type and shipment submission status
   *
   * @returns
   */
  onUpdate(event) {
    this.saveRequest = this.customsForm.get('flightData').value;
    //check if left behind is expired before performing operations
    if (this.customsForm.get('flightData').get('leftBehindExpiry').value == 'No') {
      // this.customsService.updateShipmentInfo(this.saveRequest).subscribe(data => {
      //   this.refreshFormMessages(data);
      //   this.saveResponse = data.data
      //   if (!this.showResponseErrorMessages(data)) {
      //     this.showSuccessStatus("g.completed.successfully");
      //     this.OnSearch();
      //   }
      // }, error => {
      //   this.showErrorStatus(error);
      // });
    }
    else {
      this.showErrorMessage('lbs.expired');
    }
  }

  /**
      * Used for navigation to maintain accs screen
      * on the basis of shipment number
      *
      *@param index
      */
  openShipment(index: any) {
    this.shipmentList = this.customsForm.controls.flightData.get(['shipmentList', index]).value;
    //check if left behind is expired before performing operations
    if (this.customsForm.get('flightData').get('leftBehindExpiry').value == 'No') {
      this.navigateTo(this.router, '/customs/maintainaccs', this.shipmentList);
    }
    else {
      this.showErrorMessage('lbs.expired');
    }
  }

  /**
      * Used for navigating back to submit left behind
      * consignment screen
      *
      *
      */
  public onBack(event) {
    let transferData = this.customsForm.get('flightData').value
    let date = this.customsForm.controls.flightData.get('flightDate').value
    transferData.flightDate = date;
    this.navigateTo(this.router, '/customs/leftbehindconsignment', transferData);
  }

  /**
      * Used for navigation to maintain hawb information screen
      * 
      *
      *@param index
      */
  onLinkClick(index) {
    let request = new CustomsHouseSearchModel();
    request.awbNumber = this.resp.shipmentList[index].shipmentNumber;
    request.flightKey = this.resp.flightNo;
    request.flightDate = this.resp.flightDate;
    request.flightId = this.resp.flightId;
    //check if left behind is expired before performing operations
    if (this.customsForm.get('flightData').get('leftBehindExpiry').value == 'No') {
      this.navigateTo(this.router, '/customs/maintainhawblist', request);
    }
    else {
      this.showErrorMessage('lbs.expired');
    }
  }
}


