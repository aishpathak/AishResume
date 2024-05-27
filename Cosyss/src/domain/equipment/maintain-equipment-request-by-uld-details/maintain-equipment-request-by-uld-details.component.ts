import { Component, ElementRef, NgZone, OnInit, ViewContainerRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// NGC framework imports
import {
  NgcPage, NgcFormGroup, NgcFormArray, DateTimeKey,
  NgcUtility, NgcContainerComponent, PageConfiguration, NgcFormControl, NgcWindowComponent
} from 'ngc-framework';
import { EquipmentService } from '../equipment.service';
import { MaintainEquipmentRequestByULD } from '../equipmentsharedmodel';

@Component({
  selector: 'app-maintain-equipment-request-by-uld-details',
  templateUrl: './maintain-equipment-request-by-uld-details.component.html',
  styleUrls: ['./maintain-equipment-request-by-uld-details.component.scss']
})

/* page configuration on page initialization */
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

/* this class is used for all the operations in Maintain Equipment Request By Uld Details Component */
export class MaintainEquipmentRequestByUldDetailsComponent extends NgcPage implements OnInit {
  /* Maintain mULD Assignment screen is sending the input using editViewSplitWindowObject */
  @Input('editViewSplitWindowObject') editViewSplitWindowObject;
  /*this boolean input is used to show the entire component as pop up */
  @Input('showAsPopup') showAsPopup: boolean;
  /*this is used to send the data from this component */
  @Output() autoSearchAccessoryInfo = new EventEmitter<boolean>();
  /*this component is used to for transactionNumberPopUpWindow */
  @ViewChild("transactionNumberPopUpWindow") transactionNumberPopUpWindow: NgcWindowComponent;
  /*this flag is used to open the transactionNumberPopUpWindow */
  windowFlag: boolean = false;
  /*this is used to send the input data from Maintain mULD Assignment screen */
  private _inputData: any;

  @Input('inputData')
  public set inputData(data: any) {
    this._inputData = data;
    /*this is used to patching the input data from Maintain mULD Assignment screen */
    this.maintainEquipmentRequestByUldDetails.reset();
    this.maintainEquipmentRequestByUldDetails.get(['uldListRecord']).patchValue([this._inputData]);

  }

  /* constructor for dependency injection */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private equipmentService: EquipmentService) {
    super(appZone, appElement, appContainerElement);
  }

  /* this form  is used for the fields used  in Maintain mULD Assignment screen */
  private maintainEquipmentRequestByUldDetails: NgcFormGroup = new NgcFormGroup({
    requiredByCarrier: new NgcFormControl(false),
    uldListRecord: new NgcFormArray([]),
  });

  /* Form 2 - Transaction number Pop up window after saving the data */
  private windowForm = new NgcFormGroup({
    arrayOfTransactionNumber: new NgcFormArray([])
  });

  /* Oninit function */
  ngOnInit() {

  }

  /* For deleting the rows in the ULD type/group table */
  onDeleteUldTypeGroup(event, index, segmentrow) {
    (this.maintainEquipmentRequestByUldDetails.get(["uldListRecord", segmentrow, "reqContainers"]) as NgcFormArray).markAsDeletedAt(index);
  }

  /* For deleting the rows in the Accessory type table */
  onDeleteAccessoryType(event, index, segmentrow) {
    (this.maintainEquipmentRequestByUldDetails.get(["uldListRecord", segmentrow, "reqAccessory"]) as NgcFormArray).markAsDeletedAt(index);
  }

  /* This method deletes entire section */
  deleteSection(index) {
    (<NgcFormArray>this.maintainEquipmentRequestByUldDetails.get(['uldListRecord'])).deleteValueAt(index);
  }

  /* For creating another section- with the same set of fields */
  addMoreAgent(index) {
    (this.maintainEquipmentRequestByUldDetails.get('uldListRecord') as NgcFormArray).addValue([{
      customerCode: null,
      customerId: null,
      customerName: null,
      requiredByCarrier: null,
      flightKey: null,
      flightDate: null,
      truckNumber: null,
      scheduledDateTime: null,
      carrierCode: this.maintainEquipmentRequestByUldDetails.get(['uldListRecord', 0, 'carrierCode']).value,
      equipmentRequestId: this.maintainEquipmentRequestByUldDetails.get(['uldListRecord', 0, 'equipmentRequestId']).value,
      eirNumber: null,
      uldType: null,
      accessoryType: null,
      reqContainers: [
        {
          uldType: null,
          qty: null,
        },
      ],
      reqAccessory: [
        {
          accessoryType: null,
          qty: null,
        },
      ],
      specialinstruction: null,
    }]);
  }

  /* Add button for ULD type/group table to add blank rows */
  onAdd(index, array) {
    const addArray: NgcFormArray =
      <NgcFormArray>this.maintainEquipmentRequestByUldDetails.get(["uldListRecord", index, array]);
    addArray.addValue([
      {
        uldType: null,
        accessoryType: null,
        qty: null,
      },
    ])
  }

  /* To fetch the ID and Name of Agent*/
  getCustomerIdName(event, index) {
    if (event && event.code) {
      this.maintainEquipmentRequestByUldDetails.get(['uldListRecord', index, 'customerId']).setValue(event.param1);
      this.maintainEquipmentRequestByUldDetails.get(['uldListRecord', index, 'customerName']).setValue(event.desc);
    }
  }

  /*this method is used to split the records which are in processed state */
  onSave() {
    this.resetFormMessages();
    const saveEquipmentReqByUldsplitEir: NgcFormGroup = (<NgcFormGroup>this.maintainEquipmentRequestByUldDetails);
    saveEquipmentReqByUldsplitEir.validate();
    if (this.maintainEquipmentRequestByUldDetails.invalid) {
      return;
    }
    let request: any = this.maintainEquipmentRequestByUldDetails.getRawValue();
    this.equipmentService.splitEir(request).subscribe(res => {
      if (!this.showResponseErrorMessages(res)) {
        if (res.success) {
          this.showSuccessStatus('g.operation.successful');
          (<NgcFormArray>this.windowForm.controls['arrayOfTransactionNumber']).patchValue(res.data.uldListRecord);
          this.windowFlag = true;
          this.transactionNumberPopUpWindow.open();
        }
      }
    });
  }

  /* Close button on pop up window */
  onClose() {
    this.transactionNumberPopUpWindow.close();
    this.autoSearchAccessoryInfo.emit(true);
    this.maintainEquipmentRequestByUldDetails.reset();
  }

  /*this method is used to update the pending records */
  onEdit() {
    this.resetFormMessages();
    const saveEquipmentReqByUldEdit: NgcFormGroup = (<NgcFormGroup>this.maintainEquipmentRequestByUldDetails);
    saveEquipmentReqByUldEdit.validate();
    if (this.maintainEquipmentRequestByUldDetails.invalid) {
      return;
    }
    let request: any = this.maintainEquipmentRequestByUldDetails.getRawValue();
    this.equipmentService.edit(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        if (response.success) {
          this.showSuccessStatus('g.operation.successful');
          this.autoSearchAccessoryInfo.emit(true);
          this.maintainEquipmentRequestByUldDetails.reset();
        }
      }
    });
  }

  /*
    When required by carrier field is checked,
    agent will be disabled and agent name is cleared
  */

  disableAgentName(requiredByCarrier, index) {
    if (requiredByCarrier) {
      (<NgcFormArray>this.maintainEquipmentRequestByUldDetails.get(['uldListRecord', index, 'customerCode'])).disable();
      (<NgcFormArray>this.maintainEquipmentRequestByUldDetails.get(['uldListRecord', index, 'customerCode'])).reset();
      (<NgcFormArray>this.maintainEquipmentRequestByUldDetails.get(['uldListRecord', index, 'customerId'])).reset();
      (<NgcFormArray>this.maintainEquipmentRequestByUldDetails.get(['uldListRecord', index, 'customerName'])).reset();
    }
    else {
      (<NgcFormArray>this.maintainEquipmentRequestByUldDetails.get(['uldListRecord', index, 'customerCode'])).enable();
    }
  }

  /* get customer id for split functionality */
  getCustomerIdNameSplit(event, index) {
    if (event && event.code) {
      this.maintainEquipmentRequestByUldDetails.get(['uldListRecord', index, 'customerId']).setValue(event.param1);
    }
  }
}
