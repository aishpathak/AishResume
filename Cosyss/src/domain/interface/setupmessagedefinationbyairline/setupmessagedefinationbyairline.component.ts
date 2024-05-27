import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey } from 'ngc-framework';
import { NgcFormControl, PageConfiguration, CellsRendererStyle, NgcReportComponent } from 'ngc-framework';
import { InterfaceService } from '../interface.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CellsStyleClass } from './../../../shared/shared.data';

@Component({
  selector: 'app-setupmessagedefinationbyairline',
  templateUrl: './setupmessagedefinationbyairline.component.html',
  styleUrls: ['./setupmessagedefinationbyairline.component.scss'],
  encapsulation: ViewEncapsulation.None
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: false
})
export class SetupmessagedefinationbyairlineComponent extends NgcPage {
  resp: any;
  reportParameters: any;
  dataToPatch: any;
  showAddress = false;
  showAddressData = false;
  dataToPatchFlight: any;
  dataToPatchAirport: any;
  dataToPatchCountry: any;
  dataToPatchCarrier: any;
  dataToPatchTelexAddress: any;
  hasReadPermission: boolean = false;

  private subMessageParameter: {};
  dataToPatchCommunicationAddress: any;
  // @ViewChild('editScreen') editScreen: NgcWindowComponent;
  // @ViewChild('ediTelexAddres') ediTelexAddres: NgcWindowComponent;
  // @ViewChild('ediTelexAdress') ediTelexAddresss: NgcWindowComponent;
  // @ViewChild('communicationAddres') communicationAddres: NgcWindowComponent;
  // @ViewChild('processingParameters') processingParameter: NgcWindowComponent;
  // @ViewChild('communicationAddress') communicationAddress: NgcWindowComponent;
  @ViewChild('openAddresWindow') openAddresWindow: NgcWindowComponent;
  CT = ['EDI Message']
  private setupmessagedefination: NgcFormGroup = new NgcFormGroup(
    {
      carrierforedi: new NgcFormControl(),
      flight: new NgcFormControl(),
      airport: new NgcFormControl(),
      messageTypes: new NgcFormControl(),
      id: new NgcFormControl(),
      carrier: new NgcFormControl(),
      country: new NgcFormControl(),
      flightKey: new NgcFormControl(),
      senderOriginatorAddress: new NgcFormControl(),
      eventType: new NgcFormControl(),
      requiredDoubleSignature: new NgcFormControl(false),
      messageType: new NgcFormControl(),
      messageHandlingDefinition: new NgcFormArray([]),
      communicationAddress: new NgcFormArray([]),
      telexAddress: new NgcFormArray([]),
      telexAddressGroup: new NgcFormArray([]),
      acasAddress: new NgcFormArray([]),
    }
  )
  interfaceIdToPatch: any;
  @ViewChild("Report") Report: NgcReportComponent;
  constructor(appZone: NgZone, appElement: ElementRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    appContainerElement: ViewContainerRef, private interfaceService: InterfaceService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.setupmessagedefination.reset();
    const dataToPatch = this.getNavigateData(this.activatedRoute);
    if (dataToPatch) {
      if (dataToPatch.updateFlag) {
        this.setupmessagedefination.get('airport').setValue(dataToPatch.searchedAirport);
        this.setupmessagedefination.get('carrier').setValue(dataToPatch.carrier);
        this.setupmessagedefination.get('country').setValue(dataToPatch.searchedCountry);
        this.setupmessagedefination.get('flightKey').setValue(dataToPatch.searchedFlightKey);
        this.setupmessagedefination.get('messageType').setValue(dataToPatch.messageType);
        this.setupmessagedefination.get('subMessageType').setValue(dataToPatch.subMessageType);
        this.onSearch();

      }
    }
  }

  /**
  * Called when clear button is clicked.
  * This clears all the form
  * @param event
  * @returns void
  */
  onClear(event): void {
    this.showAddress = false;
    this.showAddressData = false;
    this.setupmessagedefination.get('airport').enable();
    this.setupmessagedefination.get('carrier').enable();
    this.setupmessagedefination.get('country').enable();
    this.setupmessagedefination.get('flightKey').enable();
    (<NgcFormArray>this.setupmessagedefination.get(['telexAddress'])).resetValue([]);
    (<NgcFormArray>this.setupmessagedefination.get(['communicationAddress'])).resetValue([]);
    (<NgcFormArray>this.setupmessagedefination.get(['messageHandlingDefinition'])).resetValue([]);
    this.setupmessagedefination.reset();
    this.resetFormMessages();
  }
  onSearch() {
    this.hasReadPermission = NgcUtility.hasReadPermission('MESSAGE_ADDRESSING_SETUP');
    this.showAddress = false;
    let request = <NgcFormGroup>this.setupmessagedefination.getRawValue();
    (<NgcFormArray>this.setupmessagedefination.get('telexAddress')).resetValue([]);
    (<NgcFormArray>this.setupmessagedefination.get('communicationAddress')).resetValue([]);
    this.interfaceService.searchSetupMessage(request).subscribe(response => {
      this.refreshFormMessages(response);
      this.resp = response.data;
      if (this.resp) {
        this.interfaceIdToPatch = this.resp.id;
        this.showAddressData = true;
        if (this.resp.messageHandlingDefinition) {
          for (const eachRow of this.resp.messageHandlingDefinition) {
            if (eachRow.canMessageBeReSent) {
              eachRow.datacanMessageBeReSent = 'Y'
            } else {
              eachRow.datacanMessageBeReSent = 'N'
            }
            if (eachRow.sendFNA) {
              eachRow.datasendFNA = 'Y'
            } else {
              eachRow.datasendFNA = 'N'
            }
            if (eachRow.sendFMA) {
              eachRow.datasendFMA = 'Y'
            } else {
              eachRow.datasendFMA = 'N'
            }
            if (eachRow.canMessageBeReBuild) {
              eachRow.datacanMessageBeReBuild = 'Y'
            } else {
              eachRow.datacanMessageBeReBuild = 'N'
            }
            if (eachRow.canMessageBeSentMultipleTimes) {
              eachRow.datacanMessageBeSentMultipleTimes = 'Y'
            } else {
              eachRow.datacanMessageBeSentMultipleTimes = 'N'
            }
            if (eachRow.requiredDoubleSignature) {
              eachRow.datarequiredDoubleSignature = 'Y'
            } else {
              eachRow.datarequiredDoubleSignature = 'N'
            }
            if (eachRow.sendMessageBySegment) {
              eachRow.datasendMessageBySegment = 'Y'
            } else {
              eachRow.datasendMessageBySegment = 'N'
            }
          }
          this.setupmessagedefination.get('messageHandlingDefinition').patchValue(this.resp.messageHandlingDefinition);
          this.setupmessagedefination.get('airport').disable();
          this.setupmessagedefination.get('carrier').disable();
          this.setupmessagedefination.get('country').disable();
          this.setupmessagedefination.get('flightKey').disable();
          this.showAddress = true;
        } else {
          this.showErrorStatus('no.record.found');
        }
      } else {
        this.showErrorStatus(response.messageList[0].message);
      }
    });
  }

  onAddRow() {
    this.dataToPatch = this.resp;
    this.dataToPatch.updateFlag = true;
    this.dataToPatch.country = this.setupmessagedefination.get('country').value;
    this.dataToPatch.airport = this.setupmessagedefination.get('airport').value;
    this.dataToPatch.flightKey = this.setupmessagedefination.get('flightKey').value;
    this.dataToPatch.carrier = this.setupmessagedefination.get('carrier').value;
    this.navigateTo(this.router, 'interface/addmessagedefination', this.dataToPatch);
  }

  onChange(event) {
    console.log(event.InterfaceMessageTypesId)
    this.subMessageParameter = this.createSourceParameter(event.code)
  }

  onSave(windowFlag) {
    let request = this.setupmessagedefination.getRawValue();
    request.messageHandlingDefinition = [];
    this.interfaceService.saveSetupMessage(request).subscribe(response => {
      this.refreshFormMessages(response);
      const resp = response.data;
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully')
        this.onSearch();
        if (windowFlag) {
          this.openAddresWindow.close();
        }
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  onAddTelexAddress() {
    (<NgcFormArray>this.setupmessagedefination.get(["telexAddress"])).addValue([
      {
        address: null,
        blackListed: false,
        flagCRUD: 'C'
      }
    ])
  }

  onAddCommunicationAddress() {
    (<NgcFormArray>this.setupmessagedefination.get(["communicationAddress"])).addValue([
      {
        addressInfo: [{
          address: '',
        }],
        type: null,
        flagCRUD: 'C'
      }
    ])
  }

  onAddProcessingParameter(index: number) {
    (<NgcFormArray>this.setupmessagedefination.get(["messageHandlingDefinition", index, "processingParameters"])).addValue([
      {
        name: "",
        value: ""
      }
    ])
  }

  onOpenAddressWindow() {
    const dataToPatch = this.setupmessagedefination.getRawValue();
    this.dataToPatchAirport = dataToPatch.airport;
    this.dataToPatchCarrier = dataToPatch.carrier;
    this.dataToPatchCountry = dataToPatch.country;
    this.dataToPatchFlight = dataToPatch.flightKey;
    this.dataToPatchTelexAddress = this.resp.telexAddress;
    this.dataToPatchCommunicationAddress = this.resp.communicationAddress;
    (<NgcFormControl>this.setupmessagedefination.get('airport')).setValue(dataToPatch.airport);
    (<NgcFormControl>this.setupmessagedefination.get('country')).setValue(dataToPatch.country);
    (<NgcFormControl>this.setupmessagedefination.get('flight')).setValue(dataToPatch.flightKey);
    (<NgcFormControl>this.setupmessagedefination.get('carrierforedi')).setValue(dataToPatch.carrier);
    (<NgcFormArray>this.setupmessagedefination.get('telexAddress')).patchValue(this.resp.telexAddress);
    (<NgcFormArray>this.setupmessagedefination.get('communicationAddress')).patchValue(this.resp.communicationAddress);
    this.openAddresWindow.open();
  }

  onDeleteTelexAddress(index) {
    (<NgcFormArray>this.setupmessagedefination.get(['telexAddress'])).markAsDeletedAt(index);
  }

  onDeleteCommunicationAddress(index) {
    (<NgcFormArray>this.setupmessagedefination.get(['communicationAddress'])).markAsDeletedAt(index);
  }

  onDelete(index) {
    (<NgcFormArray>this.setupmessagedefination.get('communicationAddress.addressInfo')).deleteValueAt(index);
  }

  onSaveAddressSetup() {
    this.setupmessagedefination.validate();
    if (!this.setupmessagedefination.valid) {
      return;
    }
    this.onSave(true);
    // this.openAddresWindow.close();
  }

  onLinkClick(event) {
    if (event.column === 'edit') {
      const dataToPatch1 = this.setupmessagedefination.getRawValue();
      dataToPatch1.country = this.setupmessagedefination.get('country').value;
      dataToPatch1.airport = this.setupmessagedefination.get('airport').value;
      dataToPatch1.flightKey = this.setupmessagedefination.get('flightKey').value;
      dataToPatch1.carrier = this.setupmessagedefination.get('carrier').value;
      dataToPatch1.id = this.interfaceIdToPatch;
      dataToPatch1.searchedAirport =  dataToPatch1.airport;
      dataToPatch1.searchedFlightKey =  dataToPatch1.flightKey;
      dataToPatch1.searchedCountry = dataToPatch1.country;
      dataToPatch1.updateFlag = true;
      dataToPatch1.updateFlagIndex = event.record.NGC_ROW_ID;
      this.navigateTo(this.router, 'interface/editmessagedefination', dataToPatch1);
    } else if (event.column === 'delete') {
      this.showConfirmMessage('edi.delete.record.confirmation').then(fulfilled => {
        const dataToPatch = this.setupmessagedefination.getRawValue();
        const arrayforMessageHandling = dataToPatch.messageHandlingDefinition[event.record.NGC_ROW_ID];
        dataToPatch.acasAddress = [];
        dataToPatch.telexAddress = [];
        dataToPatch.telexAddressGroup = [];
        dataToPatch.communicationAddress = [];
        dataToPatch.id = this.interfaceIdToPatch;
        dataToPatch.messageHandlingDefinition = [];
        dataToPatch.messageHandlingDefinition[0] = arrayforMessageHandling;
        dataToPatch.messageHandlingDefinition[0].flagCRUD = 'D';
        this.interfaceService.saveSetupMessage(dataToPatch).subscribe(response => {
          const resp = response.data;
          if (!this.showResponseErrorMessages(response)) {
            this.onSearch();
            this.showSuccessStatus('g.completed.successfully')
          }
        }, error => {
          this.showErrorStatus(error);
        });
      }).catch(reason => {
        console.log('failed' + reason);
      });
    }
  }

  addAddressInfo(index, sindex) {
    (<NgcFormArray>this.setupmessagedefination.get(['communicationAddress', index, 'addressInfo'])).addValue([
      {
        address: ''
      }
    ]);
  }

  deleteAddressInfo(index, sindex) {
    (this.setupmessagedefination.get(['communicationAddress', index, 'addressInfo', sindex]) as NgcFormGroup).markAsDeleted();
  }

  onAddGroupedDefinition() {
    this.dataToPatch = this.resp;
    this.dataToPatch.updateFlag = true;
    this.dataToPatch.country = this.setupmessagedefination.get('country').value;
    this.dataToPatch.airport = this.setupmessagedefination.get('airport').value;
    this.dataToPatch.flightKey = this.setupmessagedefination.get('flightKey').value;
    this.dataToPatch.carrier = this.setupmessagedefination.get('carrier').value;
    this.navigateTo(this.router, 'interface/addNewMessageHandlingDefinition', this.dataToPatch);
  }

  private rowCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.effectiveEndDate) {
      cellsStyle.className = CellsStyleClass.TRASH_GREY_BG;
    }
    return cellsStyle;
  };


  onPrint() {
    this.reportParameters = new Object();
    if (this.setupmessagedefination.get('carrier').value) {
      this.reportParameters.carrier = this.setupmessagedefination.get('carrier').value;
    }
    else
    {this.reportParameters.carrier = null};
    if (this.setupmessagedefination.get('airport').value) {
      this.reportParameters.airport = this.setupmessagedefination.get('airport').value;
    }
    {this.reportParameters.airport = null};
    if (this.setupmessagedefination.get('country').value) {
      this.reportParameters.country = this.setupmessagedefination.get('country').value;
    }
    else
    {this.reportParameters.country = null};
    if (this.setupmessagedefination.get('flightKey').value) {
      this.reportParameters.flightKey = this.setupmessagedefination.get('flightKey').value;
    }
    {this.reportParameters.flightKey = null};
    if (this.setupmessagedefination.get('messageType').value) {
      this.reportParameters.messageType = this.setupmessagedefination.get('messageType').value;
    }
    else
    { this.reportParameters.messageType = null};
    this.reportParameters.tenantID = NgcUtility.getTenantConfiguration().airportCode;
    this.Report.downloadReport();
  }

  onCancel() {
    this.navigateHome();
  }
}
