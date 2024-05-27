import {
  Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Input, Output,
  EventEmitter
} from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { InterfaceService } from '../interface.service';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-grouped-message-handling-definition',
  templateUrl: './edit-grouped-message-handling-definition.component.html',
  styleUrls: ['./edit-grouped-message-handling-definition.component.scss']
})


@PageConfiguration({
  trackInit: true,
  autoBackNavigation: false,
  callNgOnInitOnClear: false
})
export class EditGroupedMessageHandlingDefinitionComponent extends NgcPage {
  _formData: any;
  @Input()
  set formData(formData: any) {
    if (formData) {
      this._formData = formData;
      this.form.reset();
      this.resetFormMessages();
      this.initialise();
    }
  }
  @Input()
  manualEvent = false;
  @Output() closeWindow = new EventEmitter<boolean>();

  showMe = true;;
  originalEventList: any;
  eventDropdownSourceId: any;
  sectorData: any;
  parameter3: any;
  dataToPatch: any;
  carrierData: any;
  countryData: any;
  dropdownData: any;
  flightKeyData: any;
  messageTypeId: any;
  dataToPatchData: any;
  showMessageBySegment = false;
  communicationAddressData: any;
  addressData: any;
  performAction: boolean;
  messageTypeIdMessageType: any;
  msgTypeToEnableSegmentSelection: any = ["FFM", "XPS", "PIL", "ARM", "OFD", "FDL"];
  negativeNumber: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    appContainerElement: ViewContainerRef, private interfaceService: InterfaceService) {
    super(appZone, appElement, appContainerElement);
  }

  private form: NgcFormGroup = new NgcFormGroup({
    sendFNA: new NgcFormControl(),
    sendFMA: new NgcFormControl(),
    eventType: new NgcFormControl(),
    dayOfWeek1: new NgcFormControl(),
    dayOfWeek2: new NgcFormControl(),
    dayOfWeek3: new NgcFormControl(),
    dayOfWeek4: new NgcFormControl(),
    dayOfWeek5: new NgcFormControl(),
    dayOfWeek6: new NgcFormControl(),
    dayOfWeek7: new NgcFormControl(),
    messageType: new NgcFormControl(),
    channelType: new NgcFormControl(),
    messageOrder: new NgcFormControl(),
    messageDelay: new NgcFormControl(),
    messageFormat: new NgcFormControl(),
    subMessageType: new NgcFormControl(),
    messageVersion: new NgcFormControl(),
    messagePriority: new NgcFormControl(),
    aircraftBodyType: new NgcFormControl(),
    effectiveEndDate: new NgcFormControl(),
    irregularityType: new NgcFormControl(),
    effectiveStartDate: new NgcFormControl(),
    canMessageBeReSent: new NgcFormControl(),
    interfacingSystemId: new NgcFormControl(),
    canMessageBeReBuild: new NgcFormControl(),
    messageHeaderFormat: new NgcFormControl(),
    scheduledTriggerTime: new NgcFormControl(),
    sendMessageBySegment: new NgcFormControl(),
    senderOriginatorAddress: new NgcFormControl(),
    requiredDoubleSignature: new NgcFormControl(),
    canMessageBeSentMultipleTimes: new NgcFormControl(),
    selectedEventTypes: new NgcFormControl(),
    telexAddress: new NgcFormArray([]),
    telexAddressGroup: new NgcFormArray([]),
    scheduleDayOfWeek: new NgcFormArray([]),
    processingParameters: new NgcFormArray([]),
    communicationAddress: new NgcFormArray([
      new NgcFormGroup({
        addressInfo: new NgcFormArray([])
      })
    ]),
    interfaceIncomingOutgoingMessageDefinitionId: new NgcFormControl()

  })

  ngOnInit() {
    this.form.reset();
    this.resetFormMessages();
    this.initialise();
  }

  /**
  * Called when clear button is clicked.
  * This clears all the forms
  * @param event
  */
  onClear(event): void {
    this.form.reset();
    this.resetFormMessages();
  }

  initialise() {
    this.form.reset();
    if (this.manualEvent) {
      this.dataToPatch = this._formData;
    }
    else {
      this.dataToPatch = this.getNavigateData(this.activatedRoute);
    }

    /*
    * To perform all the Specific function before patching the record
    * after coming from Setup Message Handling Definition to EDI
    */
    this.initialization();
  }

  onSave() {

    if (this.negativeNumber) {
      this.showErrorStatus("edi.negative.numbers.not.allowed");
      return;
    }

    let request = this.dataToPatch;
    request.messageHandlingDefinition = [];
    request.messageHandlingDefinition[0] = this.form.getRawValue();
    request.messageHandlingDefinition[0].originalEventList = this.originalEventList;
    if (!request.messageHandlingDefinition[0].selectedEventTypes) {
      this.showErrorMessage("edi.event.type.mandatory");
      return;
    }
    if (request.messageHandlingDefinition[0].selectedEventTypes && request.messageHandlingDefinition[0].selectedEventTypes.length == 0) {
      this.showErrorMessage("edi.event.type.mandatory");
      return;
    }
    if (!this.checkValidationforWeek(request.messageHandlingDefinition[0])
      || !this.checkValidationforTelex(request.messageHandlingDefinition[0])
    ) {
      return;
    }

    if (!request.messageHandlingDefinition[0].senderOriginatorAddress) {
      this.showErrorMessage("edi.sender.address.mandatory");
      return;
    }
    if (this.form.invalid) {

      //return
      return;
    }
    if (request.messageHandlingDefinition[0].processingParameters && request.messageHandlingDefinition[0].processingParameters.length > 0) {
      for (let i = 0; i < request.messageHandlingDefinition[0].processingParameters.length; i++) {
        if (request.messageHandlingDefinition[0].processingParameters[i].type === "Boolean") {
          if (request.messageHandlingDefinition[0].processingParameters[i].value) {
            request.messageHandlingDefinition[0].processingParameters[i].value = "Y";
          } else {
            request.messageHandlingDefinition[0].processingParameters[i].value = "N";
          }
        }
      }
    }
    if (request.messageHandlingDefinition[0].messageType === 'FSU') {
      if(request.messageHandlingDefinition[0].subMessageType === null || request.messageHandlingDefinition[0].subMessageType === '') {
        this.showErrorMessage("submessage.type.required");
        return;
      }
    }
    if (request.messageHandlingDefinition[0].messageType === 'FSU' && request.messageHandlingDefinition[0].subMessageType === 'DIS') {
      if(request.messageHandlingDefinition[0].irregularityType === null || request.messageHandlingDefinition[0].irregularityType === '' || request.messageHandlingDefinition[0].irregularityType.length === 0) {
        this.showErrorMessage("irregularity.type.mandatory");
        return;
      }
      if (request.messageHandlingDefinition[0].irregularityType) {
        let changeIrregularityType = request.messageHandlingDefinition[0].irregularityType;
        request.messageHandlingDefinition[0].irregularityType = changeIrregularityType.toString();
        request.messageHandlingDefinition[0].irregularityTypes = request.messageHandlingDefinition[0].irregularityType.split(",");
      }
    } else {
      request.messageHandlingDefinition[0].irregularityType = null;
    }
   
    if(request.messageHandlingDefinition[0].telexAddress === null || request.messageHandlingDefinition[0].telexAddress.length === 0) {
      this.showErrorMessage("telex.address.required");
      return;
    } else {
      var validTelexAddress: any = [];
      request.messageHandlingDefinition[0].telexAddress.forEach(telexaddress => {
        if(telexaddress.flagCRUD != 'D') {
          validTelexAddress.push(telexaddress);
        }
      });
      if(validTelexAddress.length === 0) {
        this.showErrorMessage("telex.address.required");
        return;
      }
    }
    request.messageHandlingDefinition[0].communicationAddress = (<NgcFormArray>this.form.controls['communicationAddress']).getRawValue();
    if (request.messageHandlingDefinition[0].communicationAddress && request.messageHandlingDefinition[0].communicationAddress.length > 0) {
      request.messageHandlingDefinition[0].communicationAddress.forEach(element => {
        var addresses = [];
        if (element.addressInfo && element.addressInfo.length > 0) {
          element.addressInfo.forEach(address => {
            addresses.push(address.address);
          });
        }
        element.address = addresses;
      });
    }

    this.interfaceService.editGroupedMessageHandlingDefinfition(request).subscribe(response => {
      const resp = response.data;
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.operation.successful');
        if (!this.manualEvent) {
          this.navigateTo(this.router, 'interface/setupGroupedMessageHandlingDefinition', this.dataToPatch);
        }
        else {
          this.closeWindow.emit(true);
        }
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }


  onSelectMessageType(event) {
    this.form.get('subMessageType').setValue(null);
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
    if (this.msgTypeToEnableSegmentSelection.includes(event.code)) {
      this.showMessageBySegment = true;
    } else {
      this.showMessageBySegment = false;
      this.form.get('sendMessageBySegment').setValue(false);
    }
    if (this.manualEvent) {
      this.methodToSetEventList();
    }
  }

  methodToSetEventList() {
    let messageHandlingDefinfition = this.form.getRawValue();
    messageHandlingDefinfition.carrierCode = this.dataToPatch.carrier;
    this.interfaceService.fetchEventTypesForGroupedDefinition(messageHandlingDefinfition).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        let responseData = response.data;
        let eventTypeList = [];
        if (responseData.eventTypeObjectList && responseData.eventTypeObjectList.length > 0) {
          responseData.eventTypeObjectList.filter(e => e.manualEvent == this.manualEvent).forEach(t => {
            eventTypeList.push({
              code: t.code,
              desc: t.name
            });
          });
          this.eventDropdownSourceId = NgcUtility.createAndCacheSourceByObjectList(eventTypeList);
        } else {
          this.eventDropdownSourceId = NgcUtility.createAndCacheSourceByObjectList(eventTypeList);
        }
      } else {
        this.showResponseErrorMessages(response);
      }
    });
  }

  onSelectSubMessageType(event) {
    if (event.code) {
      this.messageTypeId = event.param4;
    } else {
      this.retrieveLOVRecords("KEY_MESSAGE_TYPES_FOR_CARGO_MESSAGING").subscribe(record => {
        for (const eachRow of record) {
          if (this.form.get('messageType').value) {
            if (eachRow.desc === this.form.get('messageType').value) {
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
      this.form.get('subMessageType').setValue(null, { onlySelf: true, emitEvent: false });
    }
  }

  onSelectValue(event, index) {
    if (event) {
      (<NgcFormControl>this.form.get(['processingParameters', index, 'value'])).setValue('Y');
    } else {
      (<NgcFormControl>this.form.get(['processingParameters', index, 'value'])).setValue('N');
    }
  }

  // DELETION OF ALL THE ARRAYS STARTS HERE

  onDeleteSchedules(index) {
    (<NgcFormArray>this.form.get(['scheduleDayOfWeek'])).markAsDeletedAt(index);
  }

  onDeleteCommunication(index) {
    (<NgcFormArray>this.form.get(['communicationAddress'])).markAsDeletedAt(index);
  }

  onDeleteTelex(index) {
    (<NgcFormArray>this.form.get(['telexAddress'])).markAsDeletedAt(index);
  }

  onDeleteTelexGroup(index) {
    (<NgcFormArray>this.form.get(['telexAddressGroup'])).markAsDeletedAt(index);
  }

  onDeleteParameters(index) {
    (<NgcFormArray>this.form.get(['processingParameters'])).markAsDeletedAt(index);
  }

  // ADDITION OF ALL THE ARRAYS STARTS HERE

  onAddTelexAddress() {
    (<NgcFormArray>this.form.controls['telexAddress']).addValue([
      {
        address: null,
        acasAddress: null,
        blackListed: false,
      }
    ]);
  }

  onAddCommunication() {
    if ((<NgcFormArray>this.form.controls['communicationAddress']).length < 1) {
      (<NgcFormArray>this.form.controls['communicationAddress']).addValue([
        {
          type: 'MAIL',
          addressInfo: []
        }
      ]);
    }
  }

  onAddSchedules() {
    (<NgcFormArray>this.form.controls['scheduleDayOfWeek']).addValue([
      {
        selectAll: false,
        dayOfWeek1: false,
        dayOfWeek2: false,
        dayOfWeek3: false,
        dayOfWeek4: false,
        dayOfWeek5: false,
        dayOfWeek6: false,
        dayOfWeek7: false,
        scheduledTriggerTime: null,
        index: (<NgcFormArray>this.form.controls['scheduleDayOfWeek']).length
      }
    ]);
  }

  onAddTelexAddressGroup() {
    (<NgcFormArray>this.form.controls['telexAddressGroup']).addValue([
      {
        name: null,
        referenceId: null,
        telexAddressGroupId: null
      }
    ]);
  }

  onAddProcessingParameters() {
    (<NgcFormArray>this.form.controls['processingParameters']).addValue([
      {
        type: null,
        name: null,
        value: null,
        valueType: null,
        description: null,
      }
    ]);
  }

  // On Cancel will route to Setup Message Handling Definition
  onCancel(event) {
    this.navigateTo(this.router, 'interface/setupGroupedMessageHandlingDefinition', this.dataToPatch);
  }

  /**
  * Changing value in case of type is BOOLEAN to Y and null
  * @param void
  */
  changeValueFromBoolean() {
    if (this.dataToPatchData.processingParameters) {
      for (let eachRow of this.dataToPatchData.processingParameters) {
        if (eachRow.type === 'Boolean') {
          if (eachRow.value === 'Y') {
            eachRow.valueType = true;
          } else {
            eachRow.valueType = false;
          }
        }
      }
    }
  }

  /**
  * On select name of processing parameters Changing the value of all the parameters
  * from null to the respective selected value of LOV
  * @param event
  * @param index
  */
  onSelectName(event, index) {
    (<NgcFormControl>this.form.get(['processingParameters', index, 'name'])).setValue(event.code);
    (<NgcFormControl>this.form.get(['processingParameters', index, 'description'])).setValue(event.desc);
    (<NgcFormControl>this.form.get(['processingParameters', index, 'type'])).setValue(event.parameter1);
    (<NgcFormControl>this.form.get(['processingParameters', index, 'value'])).setValue(event.parameter2);
    if (event.type === 'Boolean') {
      if (event.type === 'Y') {
        (<NgcFormControl>this.form.get(['processingParameters', index, 'valueType'])).setValue(true);
      } else {
        (<NgcFormControl>this.form.get(['processingParameters', index, 'valueType'])).setValue(false);
      }
    }
  }

  /**
  * Required Validation on behalf of selecting TEXT in message format
  * @param event
  */
  onSelectMessageFormat(event) {
    if (event.code === 'TEXT') {
      (<NgcFormControl>this.form.get('messagePriority')).setValidators([Validators.required]);
      (<NgcFormControl>this.form.get('messageHeaderFormat')).setValidators([Validators.required]);
    } else {
      (<NgcFormControl>this.form.get('messagePriority')).setValidators([]);
      (<NgcFormControl>this.form.get('messageHeaderFormat')).setValidators([]);
    }
  }

  /**
  * To perform all the required actions before patching the record
  * @param null
  */
  initialization() {
    if (this.dataToPatch) {
      this.retrieveDropDownListRecords('Customer$Notification_Type').subscribe(data => {
        this.dropdownData = data;
      });
      this.carrierData = this.dataToPatch.carrier;
      let data = {
        carrierData: this.dataToPatch.carrier
      }
      this.form.patchValue(data)
      if (!this.dataToPatch.messageHandlingDefinition) {
        return;
      }
      if (this.dataToPatch.updateFlagIndex) {
        this.dataToPatchData = this.dataToPatch.messageHandlingDefinition[this.dataToPatch.updateFlagIndex];
      }
      else {
        this.dataToPatchData = this.dataToPatch.messageHandlingDefinition[0];
      }

      if (this.dataToPatch.eventType) {
        this.dataToPatchData.eventType = this.dataToPatch.eventType;
      }

      this.carrierData = this.dataToPatchData.carrierCode;
      this.countryData = this.dataToPatchData.country;
      this.sectorData = this.dataToPatchData.sector;
      this.flightKeyData = this.dataToPatchData.flightKey;
      this.dataToPatch.carrier = this.carrierData;
      this.dataToPatch.country = this.countryData;
      this.dataToPatch.airport = this.sectorData;
      this.dataToPatch.flightKey = this.flightKeyData;

      this.dataToPatchData.manualEvent = this.manualEvent;
      // service call to fetch all related messagedefiniiton
      this.interfaceService.searchEditroupedSetupMessage(this.dataToPatchData).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.dataToPatchData = response.data;
          if (this.dataToPatchData.communicationAddress && this.dataToPatchData.communicationAddress.length > 0) {
            this.performAction = true;
            for (let eachRow of this.dataToPatchData.communicationAddress) {
              let shcList = eachRow.address;
              eachRow.address = [];
              if (eachRow.type) {
                for (let addressList of shcList) {
                  eachRow.address.push(addressList);
                }
              }
            }
          }
          if (this.dataToPatchData.processingParameters && this.dataToPatchData.processingParameters.length > 0) {
            for (let eachRow of this.dataToPatchData.processingParameters) {
              if (eachRow.type === 'Number') {
                eachRow.value = parseInt(eachRow.value);
              } else if (eachRow.type === 'Boolean') {
                if (eachRow.value === 'Y') {
                  eachRow.value = true;
                } else {
                  eachRow.value = false;
                }
              } else {

              }

            }
          }
          if (!this.dataToPatchData.subMessageType) {
            this.retrieveLOVRecords('KEY_MESSAGE_TYPES_FOR_CARGO_MESSAGING').subscribe(data => {
              for (const eachRow of data) {
                if (eachRow.desc === this.dataToPatchData.messageType) {
                  this.messageTypeId = eachRow.param4;
                }
              }
            });
          } else {
            this.retrieveLOVRecords('KEY_SUBMESSAGE_TYPES_FOR_CARGO_MESSAGING').subscribe(data => {
              for (const eachRow of data) {
                if (eachRow.messageTypeId === this.dataToPatchData.messageType && eachRow.code === this.dataToPatchData.subMessageType) {
                  this.messageTypeId = eachRow.param4;
                }
              }
            });
          }
          if (this.dataToPatchData.irregularityType) {
            let splitted: String[] = this.dataToPatchData.irregularityType.split(",");
            this.dataToPatchData.irregularityType = splitted;
          }
          // SETTING VALUE IN CASE OF BOOLEAN FOR PROCESSING PARAMETERS
          this.changeValueFromBoolean();
          // Function for changing list of an array ti list of strings
          this.changeCommunicationAddress();
          this.form.patchValue(this.dataToPatchData);
          // set eventType List
          if (this.dataToPatchData.eventTypeObjectList && this.dataToPatchData.eventTypeObjectList.length > 0) {
            let eventTypeList = [];
            // filter seletedValue and non selected value
            let selectedValue = this.dataToPatchData.eventTypeObjectList.filter(t => t.selectFlag);
            this.dataToPatchData.eventTypeObjectList.filter(e => e.manualEvent == this.manualEvent).forEach(element => {
              eventTypeList.push({
                code: element.code,
                desc: element.name
              });
            });
            if (selectedValue && selectedValue.length > 0) {
              let selectedValueCode = selectedValue.map(t => t.code);
              this.originalEventList = selectedValueCode;
              this.form.get('selectedEventTypes').patchValue(selectedValueCode);
            }
            this.eventDropdownSourceId = NgcUtility.createAndCacheSourceByObjectList(eventTypeList);
          }


          if (this.dataToPatchData.messageFormat === 'TEXT') {
            (<NgcFormControl>this.form.get('messagePriority')).setValidators([Validators.required]);
            (<NgcFormControl>this.form.get('messageHeaderFormat')).setValidators([Validators.required]);
          } else {
            (<NgcFormControl>this.form.get('messagePriority')).setValidators([]);
            (<NgcFormControl>this.form.get('messageHeaderFormat')).setValidators([]);
          }
          if (this.msgTypeToEnableSegmentSelection.includes(this.dataToPatchData.messageType)) {
            this.showMessageBySegment = true;
          } else {
            this.showMessageBySegment = false;
          }
          this.showSelectAllSchedule(this.dataToPatchData);
        } else {
          this.showResponseErrorMessages(response);
        }
      });

    }
  }
  /**
  * LIST OF ARRAY TO LIST OF STRING IN NESTED ARRAY
  */
  changeCommunicationAddress() {
    if (this.performAction) {
      const addressDataValue = [];
      if (this.dataToPatchData.communicationAddress) {
        if (this.dataToPatchData.communicationAddress.length > 1) {
          for (const eachRow of this.dataToPatchData.communicationAddress) {
            if (eachRow.type === 'MAIL') {
              addressDataValue.push(eachRow.address);
            }
          }
        }
      }
      if (this.dataToPatchData.communicationAddress.length > 1) {
        this.addressData = [];
        for (const eachRowAddress of addressDataValue) {
          this.addressData.push(eachRowAddress[0]);
        }
        this.dataToPatchData.communicationAddress[0].address = this.addressData;
        this.communicationAddressData = this.dataToPatchData.communicationAddress[0];
        this.dataToPatchData.communicationAddress = [];
        this.dataToPatchData.communicationAddress[0] = this.communicationAddressData;
      }
    }
  }

  checkValidationforWeek(request) {
    let message: any = {
      messageList: []
    };
    let individualMessageList = [];
    individualMessageList = this.interfaceService.checkForAnyDuplicateEntries('scheduleDayOfWeek', ['dayOfWeek1', 'dayOfWeek2', 'dayOfWeek3', 'dayOfWeek4', 'dayOfWeek5', 'dayOfWeek6', 'dayOfWeek7', 'scheduledTriggerTime'], 'edi.duplicate.schedule.day.of.week', request.scheduleDayOfWeek);
    if (individualMessageList.length > 0) {
      message.messageList.push(individualMessageList);
    }
    if (message.messageList.length) {
      this.showErrorMessage('edi.duplicate.schedule.day.of.week');
      return false;
    }
    return true;
  }

  checkValidationforTelex(request) {
    let message: any = {
      messageList: []
    };
    let individualMessageList = [];
    individualMessageList = this.interfaceService.checkForAnyDuplicateEntries('telexAddressGroup', ['telexAddressGroupId'], 'edi.duplicate.telex.address.group', request.telexAddressGroup);
    if (individualMessageList.length > 0) {
      message.messageList.push(individualMessageList);
    }
    if (message.messageList.length) {
      this.showErrorMessage('edi.duplicate.telex.address.group');
      return false;
    }
    return true;
  }

  onChangeParameterValue(item, index) {
    if (item < 0) {
      this.showErrorStatus("edi.negative.numbers.not.allowed");
      this.negativeNumber = true;
      return;
    } else {
      this.negativeNumber = false;
      this.resetFormMessages();
    }
  }

  onClose() {
    this.closeWindow.emit(true)
  }

  showSelectAllSchedule(data) {
    if(data.scheduleDayOfWeek && data.scheduleDayOfWeek.length !=0) {
      data.scheduleDayOfWeek.forEach(scheduleDay => {
        if(scheduleDay.dayOfWeek1 && scheduleDay.dayOfWeek2 && scheduleDay.dayOfWeek3 && scheduleDay.dayOfWeek4 && scheduleDay.dayOfWeek5 && scheduleDay.dayOfWeek6 && scheduleDay.dayOfWeek7) {
          scheduleDay.selectAll = true;
        }
      });
    }
    this.form.get(['scheduleDayOfWeek']).patchValue(data.scheduleDayOfWeek);
  }

  onClick(event, formGroupName, index) {
     if(formGroupName === 'selectAll') {
        if(this.form.get(['scheduleDayOfWeek', index, 'selectAll']).value) {
          this.form.get(['scheduleDayOfWeek', index, 'dayOfWeek1']).setValue(true);
        this.form.get(['scheduleDayOfWeek', index, 'dayOfWeek2']).setValue(true);
        this.form.get(['scheduleDayOfWeek', index, 'dayOfWeek3']).setValue(true);
        this.form.get(['scheduleDayOfWeek', index, 'dayOfWeek4']).setValue(true);
        this.form.get(['scheduleDayOfWeek', index, 'dayOfWeek5']).setValue(true);
        this.form.get(['scheduleDayOfWeek', index, 'dayOfWeek6']).setValue(true);
        this.form.get(['scheduleDayOfWeek', index, 'dayOfWeek7']).setValue(true);
        } else {
          this.form.get(['scheduleDayOfWeek', index, 'dayOfWeek1']).setValue(false);
          this.form.get(['scheduleDayOfWeek', index, 'dayOfWeek2']).setValue(false);
          this.form.get(['scheduleDayOfWeek', index, 'dayOfWeek3']).setValue(false);
          this.form.get(['scheduleDayOfWeek', index, 'dayOfWeek4']).setValue(false);
          this.form.get(['scheduleDayOfWeek', index, 'dayOfWeek5']).setValue(false);
          this.form.get(['scheduleDayOfWeek', index, 'dayOfWeek6']).setValue(false);
          this.form.get(['scheduleDayOfWeek', index, 'dayOfWeek7']).setValue(false);
        }
     } else {
      var scheduleDayRow = this.form.get(['scheduleDayOfWeek', index]).value;
       if(!this.form.get(['scheduleDayOfWeek', index, formGroupName]).value) {
         this.form.get(['scheduleDayOfWeek', index, 'selectAll']).setValue(false);
       } else if(scheduleDayRow.dayOfWeek1 && scheduleDayRow.dayOfWeek2 && scheduleDayRow.dayOfWeek3 && scheduleDayRow.dayOfWeek4 && scheduleDayRow.dayOfWeek5 && scheduleDayRow.dayOfWeek6 && scheduleDayRow.dayOfWeek7) {
        this.form.get(['scheduleDayOfWeek', index, 'selectAll']).setValue(true);
       }
     }
  }
}
