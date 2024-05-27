import {
  Component, NgZone, ElementRef, ViewContainerRef, OnInit,
  ViewChild, ViewChildren, QueryList
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  NgcTabsComponent,
  CellsRendererStyle,
  NgcPage, NgcFormGroup, NgcWindowComponent, NgcFormArray, NgcFormControl, NgcCodeEditorComponent
  , NgcDropDownComponent, NgcUtility, NgcButtonComponent, NgcDataTableComponent, PageConfiguration, NgcReportComponent
} from 'ngc-framework';
import { FlightComplete, FlightCompleteSearch, FlightCompleteResendModel, MessageHandlingDefinitionByCustomerModel, FlightMail } from './../buildup.sharedmodel';
import { BuildupService } from './../buildup.service';

@Component({
  selector: 'app-flight-complete',
  templateUrl: './flight-complete.component.html',
  styleUrls: ['./flight-complete.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  //autoBackNavigation: true
})
export class FlightCompleteComponent extends NgcPage {
  searchResponse: any;
  resendMessageListResponse: any;
  flightCompleteFlg: boolean = false;
  manifestFlg: boolean = false;
  offloadFlg: boolean = false;
  resendMsgFlg: boolean = true;
  sendPldMailFlg: boolean = false;
  lhSendFlg: boolean = false;
  customLflagForMF: boolean = false;
  mfmflag: boolean = true;
  delayText: any = "";
  transferData: any;
  @ViewChild('resendMessagesWindow') resendMessagesWindow: NgcWindowComponent;
  searchRequest: FlightCompleteSearch = new FlightCompleteSearch();
  private flightCompleteSerachGroup: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    flightOriginDate: new NgcFormControl(new Date()),
    displayDate: new NgcFormControl(),
    displayEtd: new NgcFormControl(),
    displayStd: new NgcFormControl(),
    displayAtd: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    std: new NgcFormControl(),
    etd: new NgcFormControl(),
    status: new NgcFormControl(),
    offPoint: new NgcFormControl(),
    boardPoint: new NgcFormControl(),
    fwbDiscrepancyCount: new NgcFormControl(),
    fhlDiscrepancyCount: new NgcFormControl(),
    flightId: new NgcFormControl(),
    customOut: new NgcFormControl(),
    dateStd: new NgcFormControl(),
    aircraftRegCode: new NgcFormControl(),
    flightCompletedBy: new NgcFormControl(),
    autoFlightCompleteConfig: new NgcFormControl(),
    noOfConsolShipments: new NgcFormControl(),
    noOfConsolShipmentsWithFHL: new NgcFormControl(),
    noOfConsolShipmentsWithoutFHL: new NgcFormControl(),
    flightCompleteList: new NgcFormArray([
      new NgcFormGroup({
        flightId: new NgcFormControl(),
        offPoint: new NgcFormControl(),
        boardPoint: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        originDestination: new NgcFormControl(),
        shipmentPieces: new NgcFormControl(),
        shipmentWeight: new NgcFormControl(),
        shcs: new NgcFormControl(),
        natureOfGoods: new NgcFormControl(),
        volume: new NgcFormControl(),
        customOut: new NgcFormControl(),
        fwbFlag: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        shipmentDate: new NgcFormControl(),
        pieces: new NgcFormControl(),
        weight: new NgcFormControl(),
      })
    ]),
    messageToResendList: new NgcFormArray([
      new NgcFormGroup({
        messageType: new NgcFormControl(),
        subMessageType: new NgcFormControl(),
        selectFlg: new NgcFormControl(),
        flagCRUD: new NgcFormControl("R"),
        eventType: new NgcFormControl()
      })
    ])
  })

  private ffmPreviewButton: NgcFormGroup = new NgcFormGroup({
    ffmPreviewSummary: new NgcFormArray([
      new NgcFormGroup({
        message: new NgcFormControl(),
        interfaceName: new NgcFormControl(),
        channel: new NgcFormControl(),
      })
    ]),
  })

  private searchFlg: boolean = false;
  reportParameters: any = new Object();
  @ViewChild("reportWindow1") reportWindow1: NgcReportComponent;
  @ViewChild("reportWindow2") reportWindow2: NgcReportComponent;
  @ViewChild("reportWindow3") reportWindow3: NgcReportComponent;
  @ViewChild('codeEditor') codeEditor: NgcCodeEditorComponent;
  @ViewChild('onFFMpreview') onFFMpreview: NgcWindowComponent;

  constructor(private buildUpService: BuildupService, appZone: NgZone,
    appElement: ElementRef, appContainerElement: ViewContainerRef, private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.transferData = this.getNavigateData(this.activatedRoute);
    console.log("transferred data ", this.transferData);
    try {
      if (this.transferData !== null && this.transferData !== undefined) {
        this.flightCompleteSerachGroup.patchValue(this.transferData);

        this.onSearch();
      }
    } catch (e) { }
  }
  onSearch() {
    this.delayText = "";
    //this.flightCompleteFlg = true;
    this.searchFlg = false;
    const request = this.flightCompleteSerachGroup.getRawValue();
    this.searchRequest.flightKey = request.flightKey;
    this.searchRequest.flightOriginDate = request.flightOriginDate;

    this.buildUpService.searchFlightComplete(this.searchRequest).subscribe((response) => {
      if (!this.showResponseErrorMessages(response)) {
        console.log("response", response.data);
        if (response.data != null) {
          this.searchFlg = true;
          this.flightCompleteSerachGroup.patchValue(this.searchResponse);
          this.flightCompleteSerachGroup.get('displayAtd').setValue(null);
          this.searchResponse = response.data;
          if (this.searchResponse.customOut != null) {
            this.searchResponse.customOut = NgcUtility.getDateAsString(this.searchResponse.customOut);
          }
          //setting customs
          let flightCompletelist = this.searchResponse.flightCompleteList.map(i => {
            if (this.searchResponse.customOut != null) {
              i.customOut = this.searchResponse.customOut.toUpperCase();
            }

            return i;
          });
          if (this.searchResponse.carrierCode == 'MF') {
            this.customLflagForMF = true;
          }
          if (this.searchResponse.carrierCode == 'LH') {
            this.lhSendFlg = true;
          }
          if (this.searchResponse.carrierCode == 'KE') {
            this.sendPldMailFlg = true;
          }
          if (flightCompletelist) {
            flightCompletelist.forEach(element => {
              if (element.offPoint == "MFM") {
                this.mfmflag = false;
              }
              if (element.offPoint !== "MFM") {
                this.mfmflag = true;
              }
            })
          }

          this.searchResponse.flightCompleteList = flightCompletelist;
          let currentDatTime = Date.now();

          //if atd is not present show pop up
          if (this.searchResponse.atd == null && this.searchResponse.flightCompletedBy == null) {
            this.showMessage('ATD of the flight is not captured.');
          }

          // for checking trucking Flight 
          if (this.searchResponse.aircraftType == 'TRK') {
            this.flightCompleteFlg = false;
          }
          else if (this.searchResponse.atd != null) {
            console.log("atd", this.searchResponse.atd);
            let atd = Date.parse(this.searchResponse.atd);
            //if (currentDatTime > atd) {
            this.flightCompleteFlg = false;
            // }
          }
          // else if (this.searchResponse.etd != null) {
          //   let etd = Date.parse(this.searchResponse.etd);
          //   if (currentDatTime > etd) {
          //     this.flightCompleteFlg = true;
          //   }
          // }
          // else if (this.searchResponse.std != null) {
          //   let std = Date.parse(this.searchResponse.std);
          //   if (currentDatTime > std) {
          //     this.flightCompleteFlg = true;
          //   }

          // }
          if (this.searchResponse.status == "DEP") {
            this.showErrorStatus("export.flight.has.already.departed");
            this.flightCompleteFlg = true;
          }
          if (this.searchResponse.delayFlag == true) {
            this.showErrorStatus("export.flight.completion.not.allowed");
            this.flightCompleteFlg = true;
          }
          // let tempDate = this.searchResponse.dateStd.substring(0, 10);
          // if (this.searchResponse.atd != null)
          //   this.searchResponse.displayAtd = this.searchResponse.atd.substring(10, this.searchResponse.atd.length);
          // if (this.searchResponse.std != null)
          //   this.searchResponse.displayStd = this.searchResponse.dateStd.substring(10, this.searchResponse.dateStd.length);
          // if (this.searchResponse.etd != null)
          //   this.searchResponse.displayEtd = this.searchResponse.etd.substring(10, this.searchResponse.etd.length);
          // this.searchResponse.displayDate = tempDate.toUpperCase();

          this.searchResponse.displayDate = NgcUtility.getDateAsString(this.searchResponse.std);
          this.searchResponse.std = NgcUtility.getTimeAsString(NgcUtility.getDateTime(this.searchResponse.std));

          if (!this.searchResponse.showDateFlag) {
            this.searchResponse.etd = NgcUtility.getTimeAsString(NgcUtility.getDateTime(this.searchResponse.etd));
            this.searchResponse.atd = NgcUtility.getTimeAsString(NgcUtility.getDateTime(this.searchResponse.atd));
          }
          this.searchResponse.flightCompleteList.map((i) => {
            if (i.shcCodes) {
              let temp = "";
              i.shcCodes.map((j) => {
                temp = temp + j + ",";
              });
              i.shcs = temp.substring(0, temp.length - 1);
            }

          });
          this.flightCompleteSerachGroup.patchValue(this.searchResponse);
        }
        else {
          this.showErrorStatus("export.flight.not.an.outgoing.flight");
        }
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }
  onFlightComplete() {
    let request = this.flightCompleteSerachGroup.getRawValue();
    if (request.atd == null) {
      this.showErrorMessage("export.atd.not.captured");
      return;
    }
    request.etd = null;
    request.std = null;
    request.atd = null;
    request.customOut = null;
    request.flightCompleteList.forEach(t => t.customOut = null);
    request.dateStd = this.searchResponse.dateStd;
    console.log("request", request);
    //show confirm Message to ask autoFlight Complete enabled 
    if (request.autoFlightCompleteConfig == true) {
      this.showConfirmMessage('export.auto.flight.complete.confirmation').then(fulfilled => {
        this.flightCompleteFinalOperation(request);
      }).catch(reason => {
        console.log('failed' + reason);
      });
    } else {
      this.flightCompleteFinalOperation(request);
    }

  }
  flightCompleteFinalOperation(request: any) {
    this.buildUpService.flightComplete(request).subscribe((response) => {
      if (!this.showResponseErrorMessages(response)) {
        // if (response.data != null) {
        this.showSuccessStatus("export.flight.completion.successful");
        this.flightCompleteFlg = true;
        // }
      } else {
        this.showResponseErrorMessages(response);
        if (response.data.atd == null) {
          this.flightCompleteSerachGroup.get('displayAtd').setValue(null);
        }
      }

    }, error => {
      this.showErrorStatus(error);
    });
  }
  onManifest() {
    let navigateObj = {
      flightKey: this.flightCompleteSerachGroup.get('flightKey').value,
      flightOriginDate: this.flightCompleteSerachGroup.get('flightOriginDate').value
    };
    this.navigateTo(this.router, '/export/buildup/cargomanifest', navigateObj);
  }
  onOffload() {
    let navigateObj = {
      flightKey: this.flightCompleteSerachGroup.get('flightKey').value,
      flightOriginDate: this.flightCompleteSerachGroup.get('flightOriginDate').value
    };
    this.navigateTo(this.router, '/export/buildup/offloaduld', navigateObj);
  }

  onResendMsg() {
    let messagelist = [];
    // fetching the messages list for resend function
    let resendRequest = new FlightCompleteResendModel();
    resendRequest.flightId = this.searchResponse.flightId;
    let reducedMessageList = [];
    this.buildUpService.fetchResendMessageList(resendRequest).subscribe(response => {

      if (response != null) {
        this.resendMessageListResponse = response;
        messagelist = this.resendMessageListResponse.messageHandlingDefinition.map(i => {
          let obj = {
            messageType: i.messageType,
            selectFlg: false,
            subMessageType: i.subMessageType,
            eventType: i.eventType,
            flagCRUD: "R"
          }
          return obj;
        });
        console.log("messageList", messagelist);
        // for removing duplicate messages from resend messages list
        let listOfMessage = messagelist.map(i => i.messageType);
        let tempMessageList = [];
        for (let i = 0; i < listOfMessage.length; i++) {
          if (listOfMessage.indexOf(listOfMessage[i]) == listOfMessage.lastIndexOf(listOfMessage[i])) {
            reducedMessageList.push(messagelist[i]);
            tempMessageList.push(listOfMessage[i]);
          }
          else if (tempMessageList.indexOf(listOfMessage[i]) < 0) {
            tempMessageList.push(listOfMessage[i]);
            reducedMessageList.push(messagelist[i]);
          }

        }
        console.log("reducedMessageList", reducedMessageList);
        this.searchResponse.messageToResendList = reducedMessageList;
        this.flightCompleteSerachGroup.patchValue(this.searchResponse);
        this.flightCompleteSerachGroup.get('messageToResendList').setValue(reducedMessageList);
        this.resendMessagesWindow.open();
      }
    }, error => {
      this.showErrorMessage(error);
    });

  }

  onPrint() {
    this.reportParameters = new Object();
    this.reportParameters.FlightId = this.searchResponse.flightId;
    // alert(JSON.stringify(this.reportParameters));
    this.reportWindow1.downloadReport();
    this.reportWindow2.downloadReport();
  }

  onPrintMFM() {
    this.reportParameters = new Object();
    this.reportParameters.flightId = this.searchResponse.flightId;
    this.reportParameters.tenantId = NgcUtility.getTenantConfiguration().airportCode;
    this.reportWindow3.downloadReport();
  }

  resendMsg() {
    let resendmessageList = (<NgcFormArray>this.flightCompleteSerachGroup.get('messageToResendList')).getRawValue();
    let messageToResend = resendmessageList.filter(i => i.selectFlg);
    if (messageToResend == undefined || messageToResend == null) {
      this.showErrorMessage("export.select.message.resend");
      return;
    }
    let request = this.flightCompleteSerachGroup.getRawValue();
    request.customOut = null;
    request.std = null;
    request.etd = null;
    request.atd = null;
    request.flightCompleteList.forEach(element => {
      element.customOut = null;
    });
    request.messageToResendList = messageToResend;
    this.buildUpService.flightCompleteResendMessages(request).subscribe(response => {

      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus("export.message.sent.success");
      }
      else {
        this.showResponseErrorMessages(response);
      }
      this.resendMessagesWindow.close();
    });
  }
  public groupsRendererForFligthComplete(
    value: string | number,
    rowData: any,
    level: any
  ): string {
    return "Segment - " + rowData.data.boardPoint + " - " + rowData.data.offPoint;
  }

  onLhSendFwb() {
    let request: FlightMail = new FlightMail();
    request.flightId = this.flightCompleteSerachGroup.get('flightId').value;
    request.flightKey = this.flightCompleteSerachGroup.get('flightKey').value;
    request.flightOriginDate = this.flightCompleteSerachGroup.get('flightOriginDate').value;
    request.carrierCode = this.flightCompleteSerachGroup.get('carrierCode').value;
    request.flightType = 'export';

    console.log("request", request);
    this.buildUpService.onLhSendFwb(request).subscribe((response) => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus("export.mail.sent.successful");
      }
    }, error => {
      this.showErrorStatus(error);
    });

  }

  onSendingPldEmail() {
    let request: FlightMail = new FlightMail();
    request.flightId = this.flightCompleteSerachGroup.get('flightId').value;
    request.flightKey = this.flightCompleteSerachGroup.get('flightKey').value;
    request.flightOriginDate = this.flightCompleteSerachGroup.get('flightOriginDate').value;
    request.carrierCode = this.flightCompleteSerachGroup.get('carrierCode').value;
    request.flightType = 'export';

    console.log("request", request);
    this.buildUpService.onKESendPldMail(request).subscribe((response) => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus("export.mail.sent.successful");
      }
    }, error => {
      this.showErrorStatus(error);
    });

  }
  onCancel() {
    this.navigateBack(this.transferData);
  }
  onClose() {
    this.onFFMpreview.close();
  }

  public fwbCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.shipmentNumber == 'NIL') {
      cellsStyle.data = null;
    }
    return cellsStyle;
  }

  // onPrintFFMpreview() {
  //   let request = new FlightCompleteResendModel();
  //   request.flightId = this.searchResponse.flightId;
  //   this.buildUpService.getFfmPreview(request).subscribe(response => {
  //     if (response) {
  //       this.ffmPreviewButton.get(['ffmPreviewSummary']).patchValue(response);
  //       this.onFFMpreview.open();
  //     }
  //   },
  //     error => {
  //       this.showErrorStatus(error);
  //     });
  // }
}


