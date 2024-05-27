import { ViewChild } from '@angular/core';
import { ThroughTransitWorkingAdviceModel, Message } from './../../transhipment/transhipment.sharedmodel.ts';
import { TranshipmentService } from './../transhipment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementRef, ViewContainerRef } from '@angular/core';
import {
  PageConfiguration, NgcPage, NgcFormGroup, NgcFormControl, NgcUtility, NgcWindowComponent, NgcFormArray, NgcButtonComponent, NgcDateTimeInputComponent, NgcReportComponent
} from 'ngc-framework';
import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-SendThroughTransitAdvicetoApron',
  templateUrl: './SendThroughTransitAdvicetoApron.component.html',
  styleUrls: []
})

@PageConfiguration({
  trackInit: true,
  // callNgOnInitOnClear: true
})
export class SendThroughTransitAdvicetoApronComponent extends NgcPage implements OnInit {

  reportParameters: any;
  searchFlag: boolean = false;
  header = "";
  adviceSentFlag = false;
  navigateBackData: any;
  insertotheraddresses: boolean = true;
  @ViewChild('sendWindow') sendWindow: NgcWindowComponent;
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  resultData: any;
  carrierGroupCodeParam: {};
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private route: ActivatedRoute,
    private router: Router,
    private _transhipmentService: TranshipmentService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    const transferData = this.getNavigateData(this.route);
    try {
      if (transferData !== null && transferData !== undefined) {
        this.navigateBackData = transferData;
        this.form.get('flightType').setValue(transferData.flightType);
        if (transferData.flightType === 'P' || transferData.flightType === 'PAX') {
          this.form.get('shift').setValue(transferData.shift);
          this.form.get('adviceDate').setValue(transferData.adviceDate);
        }
        this.form.get('flightPairSequence').setValue(transferData.flightPairSequence);
        if (transferData.flightType === 'C' || transferData.flightType === 'FRT') {
          this.form.get('outboundFlight').setValue(transferData.outboundFlight);
          this.form.get('outboundFlightDate').setValue(transferData.outboundFlightDate);
        }
        this.onSearch();
      }
    } catch (e) { }
  }

  form: NgcFormGroup = new NgcFormGroup({
    flightType: new NgcFormControl(),
    shift: new NgcFormControl(),
    adviceDate: new NgcFormControl(),
    outboundFlight: new NgcFormControl(),
    outboundFlightDate: new NgcFormControl(),
    flightPairSequence: new NgcFormControl(),
    adviceSentFlag: new NgcFormControl(false),
    fromAddress: new NgcFormControl(),
    adressList: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    carrierGroupCode: new NgcFormControl()
  });

  onSearch() {
    const send: ThroughTransitWorkingAdviceModel = new ThroughTransitWorkingAdviceModel();
    send.flightType = this.form.get('flightType').value;
    send.shift = this.form.get('shift').value;
    send.adviceDate = this.form.get('adviceDate').value;
    send.outboundFlight = this.form.get('outboundFlight').value;
    send.outboundFlightDate = this.form.get('outboundFlightDate').value;
    send.flightPairSequence = this.form.get('flightPairSequence').value;
    send.carrierCode = this.form.get('carrierCode').value;
    send.carrierGroupCode = this.form.get('carrierGroupCode').value;
    if (!send.flightPairSequence) {
      send.flightPairSequence = 0;
    }
    this.resetFormMessages();
    this.searchFlag = false;
    if (send.outboundFlight !== null && send.outboundFlightDate === null) {
      const x: any[] = [];
      if (send.outboundFlightDate === null) {
        x.push({ referenceId: 'outboundFlightDate', message: 'Required', type: 'E' });
      }
      const data = { messageList: x };
      this.refreshFormMessages(data);
      return;
    } else if (send.outboundFlightDate !== null && send.outboundFlight === null) {
      const x: any[] = [];
      if (send.outboundFlight === null) {
        x.push({ referenceId: 'outboundFlight', message: 'Required', type: 'E' });
      }
      const data = { messageList: x };
      this.refreshFormMessages(data);
      return;
    } else if (send.outboundFlightDate !== null && send.outboundFlight !== null) {

    }
    else if (send.flightType === null || send.adviceDate === null) {

      const x: any[] = [];
      if (send.flightType === null) {
        x.push({ referenceId: 'flightType', message: 'Required', type: 'E' });
      }
      if (send.adviceDate === null) {
        x.push({ referenceId: 'adviceDate', message: 'Required', type: 'E' });
      }
      const data = { messageList: x };
      this.refreshFormMessages(data);
      return;
    }
    this._transhipmentService.getSearchTTWAApron(send).subscribe(resp => {
      this.refreshFormMessages(resp);
      const concat = resp.data;
      this.resultData = concat;
      if (concat !== null) {
        this.adviceSentFlag = concat.adviceSentFlag;
        concat.shift = send.shift;
        this.form.patchValue(concat);
        this.resetFormMessages();
        const c = send.flightType === 'C' ? "CAO" : "PAX";
        if (!send.adviceDate) {
          send.adviceDate = this.resultData.adviceDate
        }
        //dddd DDMMMYYYY
        if (send.adviceDate) {
          if (send.flightType === 'C') {
            if (send.outboundFlight != null && send.outboundFlightDate != null) {
              this.header = c + " " + send.outboundFlight + "/" + NgcUtility.getDateTimeAsStringByFormat(send.outboundFlightDate, 'DDMMMYY').toLocaleUpperCase() + "     -THROUGH TRANSIT ADVICE FOR SQ FLT";
            } else {
              this.header = c + " -THROUGH TRANSIT ADVICE FOR SQ FLT";
            }

          } else {
            this.header = c + " " + send.shift.toLocaleUpperCase() + "     " + NgcUtility.getDateTimeAsStringByFormat(send.adviceDate, 'dddd     DDMMMYYYY').toLocaleUpperCase() + "     -THROUGH TRANSIT ADVICE FOR SQ FLT"
          }
        }
        else if (send.flightType == 'C' && send.outboundFlight != null && send.outboundFlightDate != null) {
          this.header = 'FREIGHTER ' + send.outboundFlight + '/' + NgcUtility.getDateTimeAsStringByFormat(send.outboundFlightDate, 'DDMMMYY').toLocaleUpperCase() + ' -THROUGH TRANSIT ADVICE FOR SQ FLIGHT';
        }
        this.searchFlag = true;
      } else {
        this.searchFlag = false;
      }
    });
  }
  onSave() { }

  send() {
    let send: ThroughTransitWorkingAdviceModel = new ThroughTransitWorkingAdviceModel();
    send = this.form.getRawValue();
    send.adviceReSentFlag = false;
    if (!send.adviceDate) {
      send.adviceDate = this.resultData.adviceDate;
    }
    this._transhipmentService.getSendTTWAApron(send).subscribe(resp => {
      this.refreshFormMessages(resp);
      const concat = resp.data;
      if (concat !== null) {
        let sendMessage: Message = new Message();
        const sendMessageForm = this.form.getRawValue();
        sendMessage.adviceDate = sendMessageForm.adviceDate;
        sendMessage.shift = sendMessageForm.shift;
        sendMessage.flightType = sendMessageForm.flightType
        sendMessage.flightKey = sendMessageForm.outboundFlight;
        sendMessage.flightDate = sendMessageForm.outboundFlightDate;
        // this._transhipmentService.getSendTTWAApronMessage(send).subscribe(mresp => {
        //   this.onSearch();
        // });
        setTimeout(() => { this.onSearch() }, 3000);
      }
    });
  }

  sendUpdate() {
    let send: ThroughTransitWorkingAdviceModel = new ThroughTransitWorkingAdviceModel();
    send = this.form.getRawValue();
    send.adviceReSentFlag = false;
    if (!send.adviceDate) {
      send.adviceDate = this.resultData.adviceDate;
    }
    this._transhipmentService.getSendUpdateTTWAApron(send).subscribe(resp => {
      if (resp.messageList && resp.messageList.length > 0 && resp.messageList[0].code !== 'data.through.advice.shipmentandbulk.size') {
        this.showInfoStatus(resp.messageList[0].message);
        return;
      } else {
        this.refreshFormMessages(resp);
      }
      const concat = resp.data;
      if (concat !== null) {
        let sendMessage: Message = new Message();
        const sendMessageForm = this.form.getRawValue();
        sendMessage.adviceDate = sendMessageForm.adviceDate;
        sendMessage.shift = sendMessageForm.shift;
        sendMessage.flightType = sendMessageForm.flightType
        sendMessage.flightKey = sendMessageForm.outboundFlight;
        sendMessage.flightDate = sendMessageForm.outboundFlightDate;
        // this._transhipmentService.getSendTTWAApronMessage(send).subscribe(mresp => {
        //   this.onSearch();
        // });
        setTimeout(() => { this.onSearch() }, 3000);
      }
    });
  }
  reSend() {
    let send: ThroughTransitWorkingAdviceModel = new ThroughTransitWorkingAdviceModel();
    send.adviceReSentFlag = true;
    let resendData: any = this.form.getRawValue();
    if (!resendData.fromAddress || resendData.fromAddress.length < 1) {
      this.showErrorStatus('export.from.address.mandatory');
      return;
    }
    if (!resendData.adressList || resendData.adressList.length < 1) {
      this.showErrorStatus('export.to.address.mandatory');
      return;
    }
    send.fromAddress = resendData.fromAddress;
    send.toAddress = resendData.adressList;
    send.adviceDate = this.resultData.adviceDate;
    send.flightType = resendData.flightType;
    send.shift = resendData.shift;
    send.outboundFlight = resendData.outboundFlight;
    send.outboundFlightDate = resendData.outboundFlightDate;
    send.connectingFlights = resendData.connectingFlights;
    send.searchTime = resendData.searchTime;
    send.transThroughTransitWorkingAdviceId = resendData.transThroughTransitWorkingAdviceId;
    this._transhipmentService.getReSendTTWAApron(send).subscribe(resp => {
      this.refreshFormMessages(resp);
      const concat = resp.data;
      if (concat !== null) {
        this.sendWindow.close();
        setTimeout(() => { this.onSearch() }, 3000);
      }
    });
  }

  sendWindowOpen() {
    this.insertotheraddresses = true;
    this.form.get('fromAddress').reset();
    this.form.get('adressList').reset();
    this.sendWindow.open();

  }



  onprint() {
    if (!this.searchFlag) {
      this.showErrorStatus('export.search.should.happen.first')
      return;
    }
    this.reportParameters = new Object();
    this.reportParameters.flighttype = this.form.get('flightType').value;
    this.reportParameters.shift = this.form.get('shift').value;
    this.reportParameters.date = this.form.get('adviceDate').value;
    if (this.form.get('outboundFlight').value != null && this.form.get('outboundFlightDate').value != null) {
      this.reportParameters.outbounflight = this.form.get('outboundFlight').value;
      this.reportParameters.outbounddate = this.form.get('outboundFlightDate').value;
      this.reportParameters.outboundflag = '1';
    }
    else {
      this.reportParameters.outboundflag = '0';
    }
    this.reportParameters.status = 'NEW'
    this.reportParameters.Header = this.header;
    this.reportParameters.loggedinuser = this.getUserProfile().userShortName;
    this.reportParameters.carrierCode = this.form.get('carrierCode').value;
    this.reportParameters.carrierGroupCode = this.form.get('carrierGroupCode').value;
    this.reportWindow.open();
  }

  onCancel() {
    if (this.navigateBackData && this.navigateBackData.url) {
      this.navigate(this.navigateBackData.url, this.navigateBackData);
    } else {
      this.navigateBack(this.navigateBackData);
    }
  }

  /*
  Navigate to Through Transit with latest ad selected record
  */
  onThroughTransit() {
    let count = 0;
    const dataTosend = {
      shift: null,
      adviceDate: null,
      flightType: null,
      outboundFlight: null,
      outboundFlightDate: null,
      flightPairSequence: null,
      outboundFlightSegmentId: null,
      inboundFlight: null,
      formattedInboundDate: null,
      flightBoardPoint: null,
      formattedInboundTime: null,
      mode: 'sendTT'

    };
    const checkValue = (<NgcFormArray>this.form.get(['connectingFlights'])).getRawValue();
    for (const eachRow of checkValue) {
      if (eachRow.select) {
        count++
        // Later to be used for Flight and Flight Date
        const flightToPatch = eachRow.inboundOutboundFlight;
        const temp = flightToPatch.split(" ");
        dataTosend.shift = this.form.get('shift').value;
        dataTosend.adviceDate = this.form.get('adviceDate').value;
        dataTosend.flightType = this.form.get('flightType').value;
        dataTosend.outboundFlight = eachRow.outboundFlight;
        dataTosend.outboundFlightDate = eachRow.outboundFlightDate;
        dataTosend.flightPairSequence = eachRow.flightPairSequence;
        dataTosend.outboundFlightSegmentId = eachRow.outboundFlightSegmentId;
        dataTosend.inboundFlight = eachRow.inboundFlight;
        dataTosend.formattedInboundDate = eachRow.formattedInboundDate;
        dataTosend.flightBoardPoint = eachRow.flightBoardPoint;
        dataTosend.formattedInboundTime = eachRow.formattedInboundTime;
      }
    }
    if (count === 1) {
      this.navigate('export/through-transit-working-advice', dataTosend);
    } else {
      this.showErrorStatus('export.select.only.1.record');
    }
  }

  sentAll() {
    this._transhipmentService.getConfiguredAddressesForTTM().subscribe(resp => {
      this.refreshFormMessages(resp);
      if (resp.data) {
        let response: any = resp.data;
        this.form.get('adressList').patchValue(response.toAddress);
        this.form.get('fromAddress').patchValue(response.fromAddress);
        this.insertotheraddresses = true;
      }

    });
  }

  insertOtherAddresses() {
    this.insertotheraddresses = false;
  }

  onClear() {
    this.form.reset();
    this.searchFlag = false;
  }
  getCarrierCodeByCarrierGroup(event) {

    this.carrierGroupCodeParam = this.createSourceParameter(this.form.get('carrierGroupCode').value);
  }

}
