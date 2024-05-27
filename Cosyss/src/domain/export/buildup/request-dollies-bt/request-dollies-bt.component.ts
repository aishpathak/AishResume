import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, ReactiveModel, NgcFormGroup, PageConfiguration, NgcFormArray, NgcWindowComponent, NgcUtility } from 'ngc-framework';
import { WarehouseService } from '../../../warehouse/warehouse.service';
import { BuildupService } from '../buildup.service';
import { FlightDetailsModel, RequestDolliesBTInfoModel, RequestDolliesBTModel } from '../buildup.sharedmodel';

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})

@Component({
  selector: 'app-request-dollies-bt',
  templateUrl: './request-dollies-bt.component.html',
  styleUrls: ['./request-dollies-bt.component.scss']
})
export class RequestDolliesBTComponent extends NgcPage {
  /**
   * Popup window component for create and editing Request/Receive Dollies/BT Info
   */
  @ViewChild('RequestDolliesBTInfoWindow') requestDolliesBTInfoWindow: NgcWindowComponent;

  /*
  * search Reactive Form
  */
  @ReactiveModel(RequestDolliesBTModel)
  public searchFormGroup: NgcFormGroup;

  /*
  * search result Reactive Form
  */
  @ReactiveModel(RequestDolliesBTModel)
  public requestDolliesBTModelFormGroup: NgcFormGroup;

  /*
  * Popup Window Reactive Form
  */
  @ReactiveModel(RequestDolliesBTInfoModel)
  public requestDolliesBTInfoModelFormGroup: NgcFormGroup;

  /**
   * displayFlag is meant to hide/unhide the result section
   */
  public displayFlag = false;

  constructor(private router: Router, appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private changeDetectorRef: ChangeDetectorRef, private activatedRoute: ActivatedRoute,
    private buildUpService: BuildupService, private warehouseService: WarehouseService) {
    super(appZone, appElement, appContainerElement);
  }

  /**
   * Method that executed on launch of the screen.
   */
  ngOnInit() {
  }

  /**
   * Method to Handle Event changes of controls in Search section
   */
  onSearchChange() {
    if (this.displayFlag) {
      this.resetFormMessages();
      this.displayFlag = false;
      this.resetRequestDolliesBTModelFormGroup();
    }
  }

  /**
   * Method to populate the Search Results in the screen
   */
  onSearch() {
    this.resetFormMessages();
    this.searchFormGroup.validate();
    if (this.searchFormGroup.invalid || !this.isValidSearch()) {
      return;
    }
    this.displayFlag = false;
    this.resetRequestDolliesBTModelFormGroup();
    let request: RequestDolliesBTModel = this.searchFormGroup.getRawValue();
    this.buildUpService.getRequestDolliesBTInfo(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.displayFlag = true;
        this.requestDolliesBTModelFormGroup.patchValue(response.data);
      }
    });
  }

  /**
   * Private method has required UI validations before making backend Search api call 
   * @returns true if the form is valid for search
   */
  private isValidSearch(): Boolean {
    if (this.searchFormGroup.get('requestNo').value == null) {
      if (this.searchFormGroup.get('requestedDateTimeFrom').value == null || this.searchFormGroup.get('requestedDateTimeTo').value == null) {
        //Request Date Range or Request No has to be filled
        this.showErrorMessage('exp.ramp.fill.requestno.or.daterange', null, null);
        return false;
      }
    }
    if (this.searchFormGroup.get('requestedDateTimeFrom').value > this.searchFormGroup.get('requestedDateTimeTo').value) {
      //From Date Cannot be greater than To Date
      this.showErrorMessage('export.accpt.daterangevalidation', null, null);
      return false;
    }
    return true;
  }

  /**
   * Method to Handle Event of Send Button 
   * User can select one or more rows (Dolley/BT Requeste) and click on this button
   * Backend Api call is made to send email notifications for the selected rows/requests.
   */
  onSend() {
    this.resetFormMessages();
    this.requestDolliesBTModelFormGroup.validate();
    if (this.requestDolliesBTModelFormGroup.invalid) {
      return;
    }
    let request: RequestDolliesBTModel = this.requestDolliesBTModelFormGroup.getRawValue();
    this.buildUpService.sendNotification(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('uld.operation.completed.successfully');
        this.requestDolliesBTModelFormGroup.patchValue(response.data);
      }
    });
  }

  /**
   * Method to Handle the Event of Create Button which opens popup window
   * User can create the new Dolley/BT request from the popup window 
   */
  onCreate() {
    this.requestDolliesBTInfoWindow.open();
  }

  /**
   * Method to Handle Event of Edit Button which opens popup window
   * User can edit the existing request in the popup window
   */
  onEdit(index) {
    this.requestDolliesBTInfoModelFormGroup.patchValue(this.requestDolliesBTModelFormGroup.get(['requestDolliesBTInfo', index]).value);
    if (this.requestDolliesBTInfoModelFormGroup.get('confirmed').value) {
      this.requestDolliesBTInfoModelFormGroup.disable();
      this.requestDolliesBTInfoModelFormGroup.get('flightDetails').disable();
    }
    this.requestDolliesBTInfoWindow.open();
  }

  /**
   * Method To handle Save button in  Popup window.
   * In this method API call is made to the service to insert/update the data. 
   */
  onClickSave() {
    this.resetFormMessages();
    this.requestDolliesBTInfoModelFormGroup.validate();
    if (this.requestDolliesBTInfoModelFormGroup.invalid || !this.isValidSave()) {
      return;
    }
    let request: RequestDolliesBTModel = this.displayFlag ? this.requestDolliesBTModelFormGroup.getRawValue() : this.searchFormGroup.getRawValue();
    request.requestDolliesBTInfo = [this.requestDolliesBTInfoModelFormGroup.getRawValue()];
    this.buildUpService.saveRequestDolliesBTInfo(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.displayFlag = true;
        this.requestDolliesBTModelFormGroup.patchValue(response.data);
        this.requestDolliesBTInfoWindow.close();
        this.showSuccessStatus('uld.operation.completed.successfully');
      }
    });
  }

  /**
   * Method To handle confirm button in Popup window
   * User can click on this button once he has received the requested Dollies/BT
   */
  onClickConfirm() {
    this.resetFormMessages();
    this.requestDolliesBTInfoModelFormGroup.validate();
    if (this.requestDolliesBTInfoModelFormGroup.invalid || !this.isValidSave()) {
      return;
    }
    let request: RequestDolliesBTModel = this.searchFormGroup.getRawValue();
    request.requestDolliesBTInfo = [this.requestDolliesBTInfoModelFormGroup.getRawValue()];
    this.buildUpService.confirmRequestDolliesBTInfo(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.displayFlag = true;
        this.requestDolliesBTModelFormGroup.patchValue(response.data);
        this.requestDolliesBTInfoWindow.close();
        this.showSuccessStatus('uld.operation.completed.successfully');
      }
    });
  }

  /**
   * Private method that is being used in onClickSave() and onClickConfirm()
   * This method has required UI validations before making backend Save or Confirm api call 
   * @returns true if the form is valid for save
   */
  private isValidSave(): Boolean {
    //Validation - Duplicate Flight Entry
    let message: any = {
      messageList: []
    };
    let individualMessageList = this.warehouseService.checkForAnyDuplicateEntries('flightDetails', ['flightKey', 'flightDate'], 'exp.ramp.duplicate.record', (<Array<FlightDetailsModel>>this.requestDolliesBTInfoModelFormGroup.get(['flightDetails']).value).filter(obj => (obj.flightKey != null && obj.flightDate != null)));
    message.messageList.push(...individualMessageList);
    if (message.messageList.length) {
      this.showResponseErrorMessages(message);
      return false;
    }
    //Validation - Checking if requested quantity is atleast 1 for one of the Dolly/Bt types
    if (!(this.requestDolliesBTInfoModelFormGroup.get('dolliesRequested20Ft').value > 0 || this.requestDolliesBTInfoModelFormGroup.get('dolliesRequested10Ft').value > 0 || this.requestDolliesBTInfoModelFormGroup.get('dolliesRequested5Ft').value > 0 || this.requestDolliesBTInfoModelFormGroup.get('btRequested').value > 0)) {
      this.showErrorMessage('exp.ramp.invalid.requested.quantity', null, null);
      return false;
    }
    return true;
  }

  /**
   * Method To handle cancel button in Popup window
   */
  onClickCancel() {
    this.requestDolliesBTInfoWindow.close();
  }

  /**  
   * On Popup window close
   * Reset Popup Window Form
   */
  onCloseWindow() {
    this.resetRequestDolliesBTInfoModelFormGroup();
  }

  /**
   * Mehtod returns true if atlease 1 row is selected
   */
  isRowSelected() {
    return (<Array<RequestDolliesBTInfoModel>>this.requestDolliesBTModelFormGroup.get('requestDolliesBTInfo').value).some(obj => obj.select);
  }

  /**
   * Common utility method to reset the requestDolliesBTModelFormGroup form
   */
  private resetRequestDolliesBTModelFormGroup() {
    (<NgcFormArray>this.requestDolliesBTModelFormGroup.get('requestDolliesBTInfo')).patchValue([]);
    this.requestDolliesBTModelFormGroup.reset();
  }

  /**
   * Common utility method to reset the requestDolliesBTInfoModelFormGroup form
   */
  private resetRequestDolliesBTInfoModelFormGroup() {
    (<NgcFormArray>this.requestDolliesBTInfoModelFormGroup.get('requestDolliesBTLogInfo')).patchValue([]);
    (<NgcFormArray>this.requestDolliesBTInfoModelFormGroup.get('requestDolliesBTLogInfo')).clearValidators();
    (<NgcFormArray>this.requestDolliesBTInfoModelFormGroup.get('flightDetails')).patchValue([new FlightDetailsModel(), new FlightDetailsModel(), new FlightDetailsModel()]);
    (<NgcFormArray>this.requestDolliesBTInfoModelFormGroup.get('flightDetails')).clearValidators();
    this.requestDolliesBTInfoModelFormGroup.enable();
    this.requestDolliesBTInfoModelFormGroup.clearValidators();
    this.requestDolliesBTInfoModelFormGroup.reset();
  }

}
