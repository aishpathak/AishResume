import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey, NgcCodeEditorComponent } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { InterfaceService } from '../interface.service';
import { SearchMessageRequest, GetErrorMsgRequest } from './../interface.sharedmodel';
@Component({
  selector: 'app-monitoringmessages',
  templateUrl: './monitoringmessages.component.html',
  styleUrls: ['./monitoringmessages.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class MonitoringmessagesComponent extends NgcPage implements OnInit {
  @ViewChild('errorMessagePopUp') errorMessagePopUp: NgcWindowComponent;
  @ViewChild('errorMessagePopUpNull') errorMessagePopUpNull: NgcWindowComponent;

  showDataFlag: Boolean = false;
  maxDate: Date;
  messageList = [];

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private interfaceService: InterfaceService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    const today = new Date();
    this.maxDate = today;
  }

  private searchMessageForm: NgcFormGroup = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    flightFromDate: new NgcFormControl(),
    flightToDate: new NgcFormControl(),
  })

  private monitoringMessageForm: NgcFormGroup = new NgcFormGroup({
    flightDetail: new NgcFormArray([]),
    erroreMessageListData: new NgcFormArray([])
  })

  onSearch() {
    this.resetFormMessages();
    this.showDataFlag = false;
    const requestForSearch: SearchMessageRequest = this.searchMessageForm.getRawValue();
    let one_day = 1000 * 60 * 60 * 24;
    let fromDate = new Date(this.searchMessageForm.get('flightFromDate').value);
    let toDate = new Date(this.searchMessageForm.get('flightToDate').value);
    let dateDiff = Math.round((toDate.getTime() - fromDate.getTime()) / one_day);
    if (dateDiff > 2) {
      this.showErrorStatus("edi.daterange.cannot.more.of.2.days");
    }
    else {
      this.interfaceService.monitoringMessageInfo(requestForSearch).subscribe(response => {
        const responseData = response.data;
        if (responseData && responseData.length > 0) {
          this.showDataFlag = true;
          for (const eachRow of responseData) {
            if (eachRow.monitorMessageList && eachRow.monitorMessageList.length > 0) {
              let dataToPatch = eachRow.monitorMessageList;
              eachRow.monitorMessageList = [];
              for (const eachRowChild of dataToPatch) {
                if (eachRowChild.messageStatus) {
                  eachRow.monitorMessageList.push(eachRowChild);
                }
              }
            }
          }
          (<NgcFormArray>this.monitoringMessageForm.get(['flightDetail'])).patchValue(responseData);
        } else if (!response.messageList) {
          this.showErrorStatus("no.record");
        } else {
          this.showErrorStatus(response.messageList[0].code);
        }
      });
    }
  }

  openErrorMsgPopUp(index, subIndex) {
    let flightId = this.monitoringMessageForm.get(['flightDetail', index]).get('flightId').value;
    let messagelog = this.monitoringMessageForm.get(['flightDetail', index, 'monitorMessageList', subIndex]).value;
    let requestForErrorMsg = { flightId: '', subMessageType: '', messageType: '' };
    requestForErrorMsg.flightId = flightId;
    requestForErrorMsg.subMessageType = messagelog.subMessageType;
    requestForErrorMsg.messageType = messagelog.messageType;
    this.interfaceService.getErrorMsgList(requestForErrorMsg).subscribe(response => {
      if (response.data.length > 0) {
        (<NgcFormArray>this.monitoringMessageForm.get(['erroreMessageListData'])).patchValue(response.data);
        this.errorMessagePopUp.open();
      }
      else {
        this.errorMessagePopUpNull.open();
      }
    });
  }
}

