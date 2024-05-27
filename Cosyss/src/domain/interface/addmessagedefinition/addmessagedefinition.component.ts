import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { InterfaceService } from '../interface.service';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-addmessagedefinition',
  templateUrl: './addmessagedefinition.component.html',
  styleUrls: ['./addmessagedefinition.component.scss']
})
@PageConfiguration({
  trackInit: true
})
export class AddmessagedefinitionComponent extends NgcPage {
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
  noErrorFlag: Boolean = false;
  interfacingSystemName: any;

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
    this.dataToPatch = this.getNavigateData(this.activatedRoute);
    this.carrierData = this.dataToPatch.carrier;
    this.countryData = this.dataToPatch.country;
    this.sectorData = this.dataToPatch.airport;
    this.flightKeyData = this.dataToPatch.flightKey;
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

  setDesc(event) {
    this.interfacingSystemName = event.desc;
  }

  onSave() {
    this.noErrorFlag = true;
    let request = this.dataToPatch;
    request.messageHandlingDefinition = [];
    request.messageHandlingDefinition[0] = this.form.getRawValue();
    request.messageHandlingDefinition[0].interfacingSystemName = this.interfacingSystemName;
    request.messageHandlingDefinition[0].flagCRUD = 'C';
    if (!this.checkValidationforWeek(request.messageHandlingDefinition[0]) ||
      !this.checkValidationforTelex(request.messageHandlingDefinition[0])) {
      return;
    }
    if (!request.messageHandlingDefinition[0].senderOriginatorAddress) {
      this.showErrorMessage("edi.sender.address.mandatory");
      return;
    }

    if (!request.messageHandlingDefinition[0].eventType) {
      this.showErrorMessage("edi.event.type.mandatory");
      return;
    }

    if (this.form.invalid) {
      return;
    }
    if (request.messageHandlingDefinition[0].communicationAddress) {
      for (const eachRow of request.messageHandlingDefinition[0].communicationAddress) {
        eachRow.referenceId = this.dataToPatch.id;
      }
    }
    if (request.messageHandlingDefinition[0].messageType === 'FSU' && request.messageHandlingDefinition[0].subMessageType === 'DIS') {
      if (request.messageHandlingDefinition[0].irregularityType === null || request.messageHandlingDefinition[0].irregularityType === '' || request.messageHandlingDefinition[0].irregularityType.length === 0) {
        this.showErrorMessage("irregularity.type.mandatory");
        return;
      }
      if (request.messageHandlingDefinition[0].irregularityType) {
        let changeIrregularityType = request.messageHandlingDefinition[0].irregularityType;
        request.messageHandlingDefinition[0].irregularityType = changeIrregularityType.toString();
      }
    } else {
      request.messageHandlingDefinition[0].irregularityType = null;
    }
    request.messageHandlingDefinition.forEach(element => {
      if (element.telexAddressGroup.length == 0 && element.telexAddress.length == 0 && element.communicationAddress.length == 0) {
        this.showErrorStatus('edi.enter.anyoneof.address');
        this.noErrorFlag = false;
      }
    });

    if (this.noErrorFlag) {
      this.interfaceService.saveSetupMessage(request).subscribe(response => {
        const resp = response.data;
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus('g.operation.successful');
          this.navigateTo(this.router, 'interface/setupmessagedefination', this.dataToPatch);
        }
      }, error => {
        this.showErrorStatus(error);
      });
    }
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
        dayOfWeek1: false,
        dayOfWeek2: false,
        dayOfWeek3: false,
        dayOfWeek4: false,
        dayOfWeek5: false,
        dayOfWeek6: false,
        dayOfWeek7: false,
        scheduledTriggerTime: null,
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
    if (this.msgTypeToEnableSegmentSelection.includes(event.code)) {
      this.showMessageBySegment = true;
    } else {
      this.showMessageBySegment = false;
      this.form.get('sendMessageBySegment').setValue(false);
    }
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
    this.navigateTo(this.router, 'interface/setupmessagedefination', this.dataToPatch);
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
}
