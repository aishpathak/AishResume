import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { InterfaceService } from '../interface.service';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-new-message-handling-definition',
  templateUrl: './add-new-message-handling-definition.component.html',
  styleUrls: ['./add-new-message-handling-definition.component.scss']
})
@PageConfiguration({
  trackInit: true
})
export class AddNewMessageHandlingDefinitionComponent extends NgcPage {
  _formData: any;
  flagCrud: any;
  @Input()
  set formData(formData: any) {
    if (formData) {
      this.flagCrud = 'C';
      this._formData = formData;
      this.form.reset();
      this.resetFormMessages();
      this.initialise();
    }
  }
  @Input()
  manualEvent = false;
  @Output() closeWindow = new EventEmitter<boolean>();

  eventDropdownSourceId: any;
  sectorData: any;
  dataToPatch: any;
  carrierData: any;
  countryData: any;
  dropdownData: any;
  flightKeyData: any;
  messageTypeId: any;
  dataToPatchData: any;
  showMessageBySegment = false;
  messageTypeIdMessageType: any;
  msgTypeToEnableSegmentSelection: any = ["FFM", "XPS", "PIL", "ARM", "OFD", "FDL"];
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    private router: Router,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private interfaceService: InterfaceService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private form: NgcFormGroup = new NgcFormGroup({
    eventType: new NgcFormControl(),
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
    interfacingSystemId: new NgcFormControl(),
    messageHeaderFormat: new NgcFormControl(),
    scheduledTriggerTime: new NgcFormControl(),
    senderOriginatorAddress: new NgcFormControl(),
    sendFNA: new NgcFormControl(false),
    sendFMA: new NgcFormControl(false),
    dayOfWeek1: new NgcFormControl(false),
    dayOfWeek2: new NgcFormControl(false),
    dayOfWeek3: new NgcFormControl(false),
    dayOfWeek4: new NgcFormControl(false),
    dayOfWeek5: new NgcFormControl(false),
    dayOfWeek6: new NgcFormControl(false),
    dayOfWeek7: new NgcFormControl(false),
    canMessageBeReSent: new NgcFormControl(false),
    canMessageBeReBuild: new NgcFormControl(false),
    sendMessageBySegment: new NgcFormControl(false),
    requiredDoubleSignature: new NgcFormControl(false),
    canMessageBeSentMultipleTimes: new NgcFormControl(false),
    selectedEventTypes: new NgcFormControl(),
    telexAddress: new NgcFormArray([]),
    scheduleDayOfWeek: new NgcFormArray([]),
    telexAddressGroup: new NgcFormArray([]),
    processingParameters: new NgcFormArray([]),
    communicationAddress: new NgcFormArray([]),
  })

  ngOnInit() {
    this.form.reset();
    this.initialise();
  }

  initialise() {
    if (this.manualEvent) {
      this.dataToPatch = this._formData;
      this.carrierData = this.dataToPatch.carrier;
    }
    else {
      this.dataToPatch = this.getNavigateData(this.activatedRoute);
      this.carrierData = this.dataToPatch.carrier;
      this.countryData = this.dataToPatch.country;
      this.sectorData = this.dataToPatch.airport;
      this.flightKeyData = this.dataToPatch.flightKey;
    }
    this.retrieveDropDownListRecords('Customer$Notification_Type').subscribe(data => {
      this.dropdownData = data;
    });
    this.form.reset();
  }

  /**
  * Called when clear button is clicked.
  * This clears all the forms
  * @param event
  * @returns void
  */
  onClear(event): void {
    this.form.reset();
    this.form.get('eventType').setValue(null);
    this.resetFormMessages();
  }

  onSave() {
    let request = this.dataToPatch;

    request.messageType = this.form.get('messageType').value;
    request.subMessageType = this.form.get('subMessageType').value;
    request.messageHandlingDefinition = [];
    request.messageHandlingDefinition[0] = this.form.getRawValue();
    request.messageHandlingDefinition[0].flagCRUD = 'C';
    if (!this.checkValidationforWeek(request.messageHandlingDefinition[0]) ||
      !this.checkValidationforTelex(request.messageHandlingDefinition[0])) {
      return;
    }
    if (this.form.invalid) {
      return;
    }

    if (!request.messageHandlingDefinition[0].selectedEventTypes) {
      this.showErrorMessage("edi.event.mandatory");
      return;
    }
    if (request.messageHandlingDefinition[0].selectedEventTypes && request.messageHandlingDefinition[0].selectedEventTypes.length == 0) {
      this.showErrorMessage("edi.event.mandatory");
      return;
    }

    if (!request.messageHandlingDefinition[0].senderOriginatorAddress) {
      this.showErrorMessage("edi.sender.address.mandatory");
      return;
    }
    if (request.messageHandlingDefinition[0].communicationAddress) {
      for (const eachRow of request.messageHandlingDefinition[0].communicationAddress) {
        eachRow.referenceId = this.dataToPatch.id;
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
    }
    
    this.interfaceService.addEdiMessagesDefinition(request).subscribe(response => {
      const resp = response.data;
      if (!this.showResponseErrorMessages(response)) {
        if (!this.manualEvent) {
          this.navigateTo(this.router, 'interface/setupGroupedMessageHandlingDefinition', this.dataToPatch);
        }
        else {
          this.closeWindow.emit(true);
        }
        this.showSuccessStatus('g.operation.successful');
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  // All the Addition Starts here

  onAddCommunication() {
    if ((<NgcFormArray>this.form.controls['communicationAddress']).length < 1) {
      (<NgcFormArray>this.form.controls['communicationAddress']).addValue([
        {
          type: 'MAIL',
          address: null
        }
      ]);
    }
  }

  onAddTelexAddress() {
    (<NgcFormArray>this.form.controls['telexAddress']).addValue([
      {
        address: null,
        acasAddress: null,
        blackListed: null,
      }
    ]);
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

  // All the deletion starts here

  onDeleteCommunication(index) {
    (<NgcFormArray>this.form.get(['communicationAddress'])).markAsDeletedAt(index);
  }

  onDeleteSchedules(index) {
    (<NgcFormArray>this.form.get(['scheduleDayOfWeek'])).markAsDeletedAt(index);
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
    if(event.code !== event.desc) {
      this.form.get('subMessageType').setValue(event.code);
    }
    if (this.msgTypeToEnableSegmentSelection.includes(event.code)) {
      this.form.get('sendMessageBySegment').setValue(true);
      this.showMessageBySegment = true;
    } else {
      this.showMessageBySegment = false;
      this.form.get('sendMessageBySegment').setValue(false);
    }
    this.methodToSetEventList();
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
    this.methodToSetEventList();
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
   * If processingParameters array value is coming as true then display Y else N
   * @param event 
   * @param index 
   */
  onSelectValue(event, index) {
    if (event) {
      (<NgcFormControl>this.form.get(['processingParameters', index, 'value'])).setValue('Y');
    } else {
      (<NgcFormControl>this.form.get(['processingParameters', index, 'value'])).setValue('N');
    }
  }

  /**
   * In cancel will take us without performing any function to setupmessagedefination
   */
  onCancel() {
    this.form.reset();
    this.navigateTo(this.router, 'interface/setupGroupedMessageHandlingDefinition', this.dataToPatch);
  }

  checkValidationforWeek(request) {
    let message: any = {
      messageList: []
    };
    let individualMessageList = [];
    individualMessageList = this.interfaceService.checkForAnyDuplicateEntries('scheduleDayOfWeek', ['dayOfWeek1', 'dayOfWeek2', 'dayOfWeek3', 'dayOfWeek4', 'dayOfWeek5', 'dayOfWeek6', 'dayOfWeek7', 'scheduledTriggerTime'], 'edi.duplicate.schedule.day.of.week', request.scheduleDayOfWeek);
    message.messageList.push(...individualMessageList);
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
    message.messageList.push(...individualMessageList);
    if (message.messageList.length) {
      this.showErrorMessage('edi.duplicate.telex.address.group');
      return false;
    }
    return true;
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

  onselectMessageBySegment(event) {
    if (!event) {
      if (this.flightKeyData === '' || this.flightKeyData === null || this.flightKeyData === undefined) {
        this.form.get('sendMessageBySegment').setValue(true);
        this.showErrorMessage("edi.flight.details.mandatory.incase.message.not.by.segment");
        return;
      }
    }
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
