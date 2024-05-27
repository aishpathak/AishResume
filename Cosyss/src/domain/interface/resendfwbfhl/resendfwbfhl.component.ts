import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, ReactiveModel, NgcFormGroup, PageConfiguration, NgcFormArray, NgcWindowComponent, NgcUtility } from 'ngc-framework';
import { InterfaceService } from '../interface.service';
import { ResendMessageFwbFhlHouseModel, ResendMessageFwbFhlModel, ResendMessageFwbFhlShipmentModel } from '../interface.sharedmodel';

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})

@Component({
  selector: 'app-resendfwbfhl',
  templateUrl: './resendfwbfhl.component.html',
  styleUrls: ['./resendfwbfhl.component.scss']
})

export class ResendfwbfhlComponent extends NgcPage {

  /**
   * Popup window component for displaying HouseInformation
   */
  @ViewChild('houseInfoWindow') houseInfoWindow: NgcWindowComponent;

  /*
  * search Reactive Form
  */
  @ReactiveModel(ResendMessageFwbFhlModel)
  public searchFormGroup: NgcFormGroup;

  /*
  * search result Reactive Form
  */
  @ReactiveModel(ResendMessageFwbFhlModel)
  public resendFwbFhlFormGroup: NgcFormGroup;


  /*
  * House Information Popup window Reactive Form
  */
  @ReactiveModel(ResendMessageFwbFhlShipmentModel)
  public shipmentInfoFormGroup: NgcFormGroup;

  // public addressList : Array<object> = [{code : null},{code : null},{code : null}];
  public displayFlag = false;

  constructor(private router: Router, appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private changeDetectorRef: ChangeDetectorRef, private activatedRoute: ActivatedRoute,
    private interfaceService: InterfaceService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }

  /**
   * Common Method to Handle Event changes of controls in Search section 
   * @param controlName  name of the desired formcontrol for which the value has to be set null
   * @param event value of the formcontrol
   * @param isBoolean to check the type of formcontrol we want to change is of type boolean
   */
  onSearchChange(controlName, event, isBoolean) {
    if (this.displayFlag) {
      this.resetFormMessages();
      this.displayFlag = false;
      this.resetResendFwbFhlFormGroup();
    }
    if (controlName) {
      if (isBoolean && NgcUtility.isBlank(event)) {
        this.searchFormGroup.get(controlName).setValue(false);
      } else if (!isBoolean) {
        this.searchFormGroup.get(controlName).setValue(null);
      }
    }
  }

  /**
   * 
   * @param index used to get the information on which shipment's "All FHL" is selected
   * @param $event used to get the value of the checkabox after the event is occured
   */
  onAllFhlChange(index, event) {
    if (index == null) {
      if (event) {
        (<NgcFormArray>this.shipmentInfoFormGroup.get('houseInformation')).controls.forEach(obj => obj.get('selectFhl').setValue(true));
      } else {
        (<NgcFormArray>this.shipmentInfoFormGroup.get('houseInformation')).controls.forEach(obj => obj.get('selectFhl').setValue(false));
      }
    } else {
      if (event) {
        (<Array<ResendMessageFwbFhlHouseModel>>this.resendFwbFhlFormGroup.get(['shipmentInformation', index, 'houseInformation']).value).map(obj => obj.selectFhl = true);
      } else {
        (<Array<ResendMessageFwbFhlHouseModel>>this.resendFwbFhlFormGroup.get(['shipmentInformation', index, 'houseInformation']).value).map(obj => obj.selectFhl = false);
      }
    }
  }

  /**
   * 
   * @param event value of the checkbox of houses
   */
  onFhlChange(event) {
    if (event) {
      (<Array<ResendMessageFwbFhlHouseModel>>(<NgcFormArray>this.shipmentInfoFormGroup.get('houseInformation')).getRawValue()).findIndex(obj => !obj.selectFhl) > - 1 ? this.shipmentInfoFormGroup.get('allFhl').setValue(false) : this.shipmentInfoFormGroup.get('allFhl').setValue(true);
    } else {
      this.shipmentInfoFormGroup.get('allFhl').setValue(false)
    }
  }

  /**
   * Method to populate the Search Results in the screen
   */
  onSearch() {
    this.resetFormMessages();
    this.searchFormGroup.validate();
    if (!this.searchFormGroup.valid) {
      return;
    }
    this.displayFlag = false;
    this.resetResendFwbFhlFormGroup();
    let request: ResendMessageFwbFhlModel = this.searchFormGroup.getRawValue();
    this.interfaceService.getInfoForResendFWBFHL(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.displayFlag = true;
        this.resendFwbFhlFormGroup.patchValue(response.data);
      }
    })
  }

  /**
   * Method to make Backend Api call to retrigger the selected FWB's or FHL's in UI.
   */
  onSendNotification() {
    this.resetFormMessages();
    this.resendFwbFhlFormGroup.validate();
    if (!this.resendFwbFhlFormGroup.valid) {
      return;
    }
    //To check if atlease 1 Fwb or Select All FHL is selected
    if (!(<Array<ResendMessageFwbFhlShipmentModel>>this.resendFwbFhlFormGroup.get('shipmentInformation').value).some(obj => (!obj.hideFwb && obj.selectFwb) || (!obj.hideFhl && obj.allFhl))) {
      this.showErrorStatus('messages.select.checkbox.warning');
      return;
    }
    this.interfaceService.reSendFWBFHL(this.resendFwbFhlFormGroup.getRawValue()).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.resendFwbFhlFormGroup.patchValue(response.data);
        this.showSuccessStatus('edi.message.resend.successful');
      }
    })
  }

  /**
   * Common utility method to reset the result form
   */
  private resetResendFwbFhlFormGroup() {
    (<NgcFormArray>this.resendFwbFhlFormGroup.get('shipmentInformation')).patchValue([]);
    this.resendFwbFhlFormGroup.reset();
  }

  /**
  * Method to Open the house information Pop Screen
  * @param index is used for index of the displayed items in the table
  */
  onOpenFhlPopup(index) {
    if (this.resendFwbFhlFormGroup.get(['shipmentInformation', index, 'houseInformation']).value
      && this.resendFwbFhlFormGroup.get(['shipmentInformation', index, 'houseInformation']).value.length > 0) {
      this.shipmentInfoFormGroup.patchValue(this.resendFwbFhlFormGroup.get(['shipmentInformation', index]).value);
      this.houseInfoWindow.open();
    }
  }

  /* 
  * On window close
  */
  onCloseWindow() {
    this.houseInfoWindow.close();
    this.shipmentInfoFormGroup.reset();
    this.shipmentInfoFormGroup.get(['houseInformation']).setValue([]);
  }
  /**
   * Method To handle OK button in Houseinformation Popup window
   */
  onClickOk() {
    let shipmentInfomrationaArr: Array<ResendMessageFwbFhlShipmentModel> = (<NgcFormArray>this.resendFwbFhlFormGroup.get('shipmentInformation')).getRawValue();
    this.resendFwbFhlFormGroup.get(['shipmentInformation', shipmentInfomrationaArr.findIndex(obj => obj.shipmentId === this.shipmentInfoFormGroup.getRawValue().shipmentId)])
      .patchValue(this.shipmentInfoFormGroup.getRawValue());
    this.houseInfoWindow.close();
  }

  /**
   * Method To handle cancel button in Houseinformation Popup window
   */
  onClickCancel() {
    this.houseInfoWindow.close();
  }

}
