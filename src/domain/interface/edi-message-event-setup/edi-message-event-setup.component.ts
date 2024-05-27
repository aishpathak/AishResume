import { Component, OnInit, ElementRef, NgZone, ViewContainerRef, ViewChild, TemplateRef } from '@angular/core';
import { NgcPage, NgcFormControl, PageConfiguration, NgcFormGroup, NgcFormArray, NgcWindowComponent } from 'ngc-framework';
import { InterfaceService } from '../interface.service';

@Component({
  selector: 'app-edi-message-event-setup',
  templateUrl: './edi-message-event-setup.component.html',
  styleUrls: ['./edi-message-event-setup.component.scss']
})
@PageConfiguration({
  trackInit: true,
  autoBackNavigation: true,
  callNgOnInitOnClear: true
})
export class EdiMessageEventSetupComponent extends NgcPage {
  @ViewChild('saveWindow') saveWindow: NgcWindowComponent;
  @ViewChild('editWindow') editWindow: NgcWindowComponent;
  @ViewChild('addTelexSetupEdit') addTelexSetupEdit: NgcWindowComponent;
  @ViewChild('addTelexSetupAdd') addTelexSetupAdd: NgcWindowComponent;
  private ediInterfaceEventSetUp: NgcFormGroup = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    eventType: new NgcFormControl(),
    messageType: new NgcFormControl(),
    subMessageType: new NgcFormControl(),
    messageHandlingDefinition: new NgcFormArray([])
  });
  saveEdiInterfaceEventSetUp: NgcFormGroup = new NgcFormGroup({
    flagCRUD: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    eventType: new NgcFormControl(),
    messageType: new NgcFormControl(),
    subMessageType: new NgcFormControl(),
    interfaceMessageTypesId: new NgcFormControl()
  });
  editEdiInterfaceEventSetUp: NgcFormGroup = new NgcFormGroup({
    flagCRUD: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    eventType: new NgcFormControl(),
    messageType: new NgcFormControl(),
    subMessageType: new NgcFormControl(),
    interfaceMessageTypesId: new NgcFormControl(),
    interfaceMessageEventId: new NgcFormControl()
  });
  showData: boolean = false;
  response: any;
  messageTypeId: any;
  messageTypeIdMessageType: any;
  dataToPatch: any;
  dataToPatchEdit: any;

  templateRef: TemplateRef<any>;
  isClosePopupScreen: boolean;
  addressingSetUpData: any;
  showMe: boolean;
  rowData: any;

  constructor(appZone: NgZone, appElement: ElementRef, private interfaceService:
    InterfaceService, appContainerElement: ViewContainerRef,) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }
  onSearch() {
    this.showData = false;
    let request = this.ediInterfaceEventSetUp.getRawValue();
    console.log("requestdata", request);
    this.interfaceService.fetchEdiInterfaceEventSetUp(request).subscribe(response => {
      console.log("response", response);
      if (response && response.data) {
        this.showData = true;
        this.response = response.data;
        this.ediInterfaceEventSetUp.get('messageHandlingDefinition').patchValue(this.response.messageHandlingDefinition);
      } else {
        if(response.messageList && response.messageList.length != 0) {
          response.messageList.forEach(message => {
            if(message.code != null && message.code != '') {
              this.showErrorMessage(message.code);
              return;
            }
          });         
        }
      }
    });
  }
  onAdd() {
    this.saveEdiInterfaceEventSetUp.get('messageType').setValue(this.ediInterfaceEventSetUp.get('messageType').value);
    this.saveWindow.open();
  }
  saveSetUp() {
    let request = this.saveEdiInterfaceEventSetUp.getRawValue();
    if (request.eventType == null) {
      this.showErrorMessage("edi.event.type.mandatory");
      return;
    }
    if (request.messageType == null) {
      this.showErrorMessage("edi.message.type.mandatory");
      return;
    }
    request.flagCRUD = 'C';
    this.interfaceService.saveEdiInterfaceEventSetUp(request).subscribe(response => {
      if (response && response.data) {
        this.showSuccessStatus("g.completed.successfully");
        // this.ediInterfaceEventSetUp.get('carrierCode').setValue(request.getCarrierCode);
        // this.ediInterfaceEventSetUp.get('messageType').setValue(request.messageType);
        // this.ediInterfaceEventSetUp.get('subMessageType').setValue(request.subMessageType);
        this.onSearch();
        this.saveEdiInterfaceEventSetUp.reset();
        this.saveWindow.close();
      } else {
        if(response.messageList && response.messageList.length != 0) {
          response.messageList.forEach(message => {
            if(message.code != null && message.code != '') {
              this.showErrorMessage(message.code);
              return;
            }
          });         
        }
      }
    });
  }
  onLinkClick(type, index) {
    if (type === 'delete') {
      this.showConfirmMessage('edi.message.definition.delete.confirmation').then(fulfilled => {
        let deleteObject = (this.ediInterfaceEventSetUp.get(["messageHandlingDefinition", index]) as NgcFormGroup).getRawValue();
        deleteObject.flagCRUD = 'D';
        this.interfaceService.saveEdiInterfaceEventSetUp(deleteObject).subscribe(response => {
          const resp = response.data;
          if (!this.showResponseErrorMessages(response)) {
            this.onSearch();
            this.showSuccessStatus('g.completed.successfully')
          }

          let data = this.ediInterfaceEventSetUp.getRawValue();
          let request1 = this.ediInterfaceEventSetUp.getRawValue();
          this.rowData = (this.ediInterfaceEventSetUp.get(["messageHandlingDefinition", index]) as NgcFormGroup).getRawValue();
          const request = {
            'carrier': this.rowData.carrierCode,
            'messageType': this.rowData.messageType,
            'eventType': this.rowData.eventType,
            'subMessageType': this.rowData.subMessageType,
            'manualEvent': true,
            'messageFormat': ''
          };


          this.interfaceService.searchGroupedSetupMessage(request).subscribe(response => {
            let resp = response.data;
            if (resp) {
              //this.interfaceIdToPatch = resp.id;
              if (resp.messageHandlingDefinition) {
                for (const eachRow of resp.messageHandlingDefinition) {
                  request.messageFormat = eachRow.messageFormat;
                  this.interfaceService.onDeleteGroupedMessageDetails(request).subscribe(response => {
                    const resp = response.data;
                    if (!this.showResponseErrorMessages(response)) {
                      this.onSearch();
                      this.showSuccessStatus('g.completed.successfully')
                    }
                  }, error => {
                    this.showErrorStatus(error);
                  });
                }
              }
            }
          });
        });
      });
    }
    else if (type === 'edit') {
      let updateObject = (this.ediInterfaceEventSetUp.get(["messageHandlingDefinition", index]) as NgcFormGroup).getRawValue();
      this.editEdiInterfaceEventSetUp.patchValue(updateObject);
      this.editWindow.open();
    }
  }
  updateSetUp() {
    let request = this.editEdiInterfaceEventSetUp.getRawValue();
    console.log("update ", request);
    if (request.eventType == null) {
      this.showErrorMessage("edi.event.type.mandatory");
      return;
    }
    request.flagCRUD = 'U';
    this.interfaceService.saveEdiInterfaceEventSetUp(request).subscribe(response => {
      if (response && response.data) {
        this.showSuccessStatus("g.completed.successfully");
        this.onSearch();
        this.editWindow.close();
      } else {
        if(response.messageList && response.messageList.length != 0) {
          response.messageList.forEach(message => {
            if(message.code != null && message.code != '') {
              this.showErrorMessage(message.code);
              return;
            }
          });         
        }
      }
    });
  }
  onSelectMessageType(event) {
    this.ediInterfaceEventSetUp.get('subMessageType').setValue(null);
    this.retrieveLOVRecords("KEY_MESSAGE_TYPES_FOR_CARGO_MESSAGING").subscribe(record => {
      for (const eachRow of record) {
        if (event.code === eachRow.desc) {
          if (!eachRow.param5 || eachRow.param5 === 'NULL' || eachRow.param5 === '') {
            this.messageTypeId = event.param4;
            this.messageTypeIdMessageType = event.param4;
            break;
          } else {
            this.messageTypeId = event.param4;
            this.messageTypeIdMessageType = event.param4;
          }
        }
      }
    });
    if (this.ediInterfaceEventSetUp.get('messageType') && this.ediInterfaceEventSetUp.get('messageType').value) {
      this.saveEdiInterfaceEventSetUp.get('messageType').setValue(this.ediInterfaceEventSetUp.get('messageType').value);
      if(event.code !== event.desc) {
        this.ediInterfaceEventSetUp.get('subMessageType').setValue(event.code);
        this.saveEdiInterfaceEventSetUp.get('subMessageType').setValue(event.code);
      }
    }
  }
  onSelectSubMessageType(event) {
    if (event.code) {
      this.messageTypeId = event.param4;
    } else {
      this.retrieveLOVRecords("KEY_MESSAGE_TYPES_FOR_CARGO_MESSAGING").subscribe(record => {
        for (const eachRow of record) {
          if (this.ediInterfaceEventSetUp.get('messageType').value) {
            if (eachRow.desc === this.ediInterfaceEventSetUp.get('messageType').value) {
              if (!eachRow.param5 || eachRow.param5 === 'NULL' || eachRow.param5 === '') {
                this.messageTypeId = event.param4;
                this.messageTypeIdMessageType = event.param4;
                break;
              } else {
                this.messageTypeId = event.param4;
                this.messageTypeIdMessageType = event.param4;
              }
            }
          }
        }
      });
      this.ediInterfaceEventSetUp.get('subMessageType').setValue(null, { onlySelf: true, emitEvent: false });
    }
    this.saveEdiInterfaceEventSetUp.get('subMessageType').setValue(event.code);
  }
  onWindowClose(formName) {
    formName.reset();
  }

  onLinkClickTelex(type, index) {

    let data = this.ediInterfaceEventSetUp.getRawValue();
    let request1 = this.ediInterfaceEventSetUp.getRawValue();
    this.rowData = (this.ediInterfaceEventSetUp.get(["messageHandlingDefinition", index]) as NgcFormGroup).getRawValue();
    const request = {
      'carrier': this.rowData.carrierCode,
      'messageType': this.rowData.messageType,
      'eventType': this.rowData.eventType,
      'subMessageType': this.rowData.subMessageType,
      'manualEvent': true
    };


    this.interfaceService.searchGroupedSetupMessage(request).subscribe(response => {
      let resp = response.data;
      if (resp) {
        //this.interfaceIdToPatch = resp.id;
        if (resp.messageHandlingDefinition) {
          for (const eachRow of resp.messageHandlingDefinition) {
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
          resp.carrier = this.rowData.carrierCode;
          resp.messageType = this.rowData.messageType;
          resp.subMessageType = this.rowData.subMessageType;
          resp.eventType = this.rowData.eventType;
          resp.updateFlag = true;
          resp.updateFlagIndex = "0";
          this.dataToPatchEdit = resp;
          this.addTelexSetupEdit.open();
        }
        else {
          resp = {};
          resp.carrier = this.rowData.carrierCode;
          resp.messageType = this.rowData.messageType;
          resp.subMessageType = this.rowData.subMessageType;
          resp.eventType = this.rowData.eventType;
          resp.updateFlag = true;
          resp.updateFlagIndex = "0";
          this.dataToPatchEdit = resp;
          this.addTelexSetupAdd.open();
        }
      }
    });

  }

  closeWindow() {
    this.addTelexSetupEdit.close();
  }
}
