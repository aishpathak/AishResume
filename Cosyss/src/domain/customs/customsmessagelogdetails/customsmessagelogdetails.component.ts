import { Component, OnInit } from '@angular/core';
import { NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { ActivatedRoute } from '@angular/router';
import { CustomACESService } from '../customs.service';

@Component({
  selector: 'app-customsmessagelogdetails',
  templateUrl: './customsmessagelogdetails.component.html',
  styleUrls: ['./customsmessagelogdetails.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class CustomsmessagelogdetailsComponent extends NgcPage implements OnInit {
  subMessageParameter: {
  };
  showTable = false;
  @ViewChild('messageLog') messageLog: NgcWindowComponent;
  processingErrorsArray: NgcFormArray;
  response1: any;
  processingerrorcheck = false
  indexNumber: number;
  indexNumberDisplay: number;
  showWindow = false;

  /**
  *
  * @param appZone
  * @param appElement
  * @param appContainerElement
  */

  constructor(appZone: NgZone, appElement: ElementRef, private activatedRoute: ActivatedRoute,
    appContainerElement: ViewContainerRef, private customsService: CustomACESService, ) {
    super(appZone, appElement, appContainerElement);
  }

  private customsmessage: NgcFormGroup = new NgcFormGroup({

    messageVersion: new NgcFormControl(),
    messageType: new NgcFormControl(),
    subMessageType: new NgcFormControl(),
    uniqueIdentifier: new NgcFormControl(),
    recordType: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    messageStatus: new NgcFormControl('COMPLETE'),
    message: new NgcFormControl(''),
    messageDateTime: new NgcFormControl(),
    shipmentDate: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    messageFromDateTime: new NgcFormControl(),
    messageToDateTime: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES)),
    customsMessages: new NgcFormArray([]),
    processingErrors: new NgcFormArray(
      [

      ]
    ),
    processingErrorsArray: new NgcFormArray([
      new NgcFormGroup({
        errorCode: new NgcFormControl(),
        errorMessage: new NgcFormControl(''),
        lineItem: new NgcFormControl('')
      })
    ])

  })

  /**
   * Method to retrieve Data of Customs_MessageLog Table
   */
  onSearch() {
    let request = <NgcFormGroup>this.customsmessage.getRawValue();

    this.customsService.getCustomsMessage(request).subscribe(response => {
      this.response1 = response.data;
      const resp = response.data;
      this.refreshFormMessages(response);
      if (!response.messageList) {
        this.customsmessage.get('customsMessages').patchValue(resp);
        this.showTable = true;
      } else {
        if (response.messageList[0].errorMessage != null
          && response.messageList[0].errorMessage != '') {
          this.showErrorStatus(response.messageList[0].errorMessage);
        } else {
          this.showErrorStatus(response.messageList[0].code);
        }
      }
    });
  }

  /**
   * This method will be called on click Message Type and
   * open message and error message
   */
  onLinkClick(event) {
    this.messageLog.open();
    this.showWindow = true;
    this.processingerrorcheck = false;
    this.indexNumber = event.record.NGC_ROW_ID;
    this.indexNumberDisplay = Number(event.record.NGC_ROW_ID) + 1;
    this.customsmessage.get('message').setValue(event.record.message);
    const processingerrors: NgcFormArray = this.response1[event.record.NGC_ROW_ID].processingErrors as NgcFormArray
    if (processingerrors.length != 0) {
      this.customsmessage.get('processingErrorsArray').patchValue(processingerrors)
      this.processingerrorcheck = true
    }
    else {
      this.processingerrorcheck = false;
    }
  }

  /**
   * This method will be called on click Message Type and
   * set sourceParameters to filter dropdown as per message type
   */
  onChange() {
    this.subMessageParameter = this.createSourceParameter(this.customsmessage.get("messageType").value);
  }

  /**
   * Method to navigate previous screen.
   * This Method will be called on click on cancel button
   * @param event
   */
  public onCancel(event) {
    this.navigateBack(this.customsmessage.getRawValue());
  }

  /**
   * This method will be called on click previous icon in messageLog Window-Footer and
   * open previous index's message and error message
   */
  onPrevious() {
    if (this.indexNumber > 0) {
      this.indexNumber = Number(this.indexNumber) - 1;
      this.indexNumberDisplay = Number(this.indexNumber) + 1;
      const customsMessageList = (<NgcFormGroup>this.customsmessage.get(['customsMessages', this.indexNumber])).getRawValue();
      this.customsmessage.get('message').setValue(customsMessageList.message)
      if (customsMessageList.processingErrors) {
        if (customsMessageList.processingErrors.length != 0) {
          this.customsmessage.get('processingErrorsArray').patchValue(customsMessageList.processingErrors)
          this.processingerrorcheck = true
        }
        else {
          this.processingerrorcheck = false;
        }
      }
    }
  }

  /**
  * This method will be called on click next icon in messageLog Window-Footer and
  * open next index's message and error message
  */
  onNext() {
    this.indexNumber = Number(this.indexNumber) + 1;
    if (this.indexNumber < (<NgcFormArray>this.customsmessage.get(['customsMessages'])).length) {
      this.indexNumberDisplay = Number(this.indexNumber) + 1;
      const customsMessageList = (<NgcFormGroup>this.customsmessage.get(['customsMessages', this.indexNumber])).getRawValue();
      this.customsmessage.get('message').setValue(customsMessageList.message)
      if (customsMessageList.processingErrors) {
        if (customsMessageList.processingErrors.length != 0) {
          this.customsmessage.get('processingErrorsArray').patchValue(customsMessageList.processingErrors)
          this.processingerrorcheck = true
        }
        else {
          this.processingerrorcheck = false;
        }
      }
    } else {
      this.indexNumber = Number(this.indexNumber) - 1;
    }
  }

  /**
   * Method to close messageLog Window
   */
  onCloseWindow(event) {
    this.showWindow = false;
    this.indexNumberDisplay = 0;
  }

}
