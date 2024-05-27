import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcPrinterComponent, PageConfiguration, NgcWindowComponent, NgcUtility, 
  ReportFormat
} from 'ngc-framework';
import { EquipmentService } from '../equipment.service';
import { CreateEquipmentRequestByULDModel, PrinterType, ReportRequest, ReportRequestType } from '../equipmentsharedmodel';

/* Components used */
@Component({
  selector: 'app-equipment-request-by-uld',
  templateUrl: './equipment-request-by-uld.component.html',
  styleUrls: ['./equipment-request-by-uld.component.scss']
})

/* Page Decorator */
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

/* Class starts here */
export class EquipmentRequestByULDComponent extends NgcPage implements OnInit {

  /* Form 1 - Contains the data that has to saved */
  private mUldAssignmentForm = new NgcFormGroup({
    requestPrinterId: new NgcFormControl,
    uldListRecord: new NgcFormArray([
      new NgcFormGroup({
        carrierCode: new NgcFormControl,
        carrierName: new NgcFormControl,
        requiredByCarrier: new NgcFormControl(false),
        flightKey: new NgcFormControl,
        flightDate: new NgcFormControl,
        customerCode: new NgcFormControl,
        customerId: new NgcFormControl,
        customerName: new NgcFormControl,
        reqContainers: new NgcFormArray([]),
        reqAccessory: new NgcFormArray([]),
        specialinstruction: new NgcFormControl,
        emailNotificationFlag: new NgcFormControl(false),
      })
    ]),
  });
  /* Form 2 - Transaction number Pop up window after saving the data */
  private windowForm = new NgcFormGroup({
    arrayOfTransactionNumber: new NgcFormArray([])
  })

  /* Component for printer */
  @ViewChild('printerName') printerName: NgcPrinterComponent;
  /* Window component for eir number pop up */
  @ViewChild("transactionNumberPopUpWindow") transactionNumberPopUpWindow: NgcWindowComponent;
  /* flags defined */
  windowFlag: boolean = false;

  /**
  * Initialize
  * @param appZone Ng Zone
  * @param appElement Element Ref
  * @param appContainerElement View Container Ref
  */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private equipmentService: EquipmentService,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  /* On page initialization */
  ngOnInit() {
    this.onAddUldTypeGroup(0);
    this.onAddAccessoryType(0);
  }

  /* Add button for ULD type/group table to add blank rows */
  onAddUldTypeGroup(index) {
    const addUldType: NgcFormArray =
      <NgcFormArray>this.mUldAssignmentForm.get(["uldListRecord", index, "reqContainers"]);
    addUldType.addValue([
      {
        uldType: null,
        qty: null,
      },
      {
        uldType: null,
        qty: null,
      },
      {
        uldType: null,
        qty: null,
      }
    ])
  }

  /* For deleting the rows in the ULD type/group table */
  onDeleteUldTypeGroup(event, index, segmentrow) {
    (this.mUldAssignmentForm.get(["uldListRecord", segmentrow, "reqContainers"]) as NgcFormArray).markAsDeletedAt(index);
  }

  /* Add button for Accessory type table to add blank rows */
  onAddAccessoryType(index) {
    const addAccType: NgcFormArray =
      <NgcFormArray>this.mUldAssignmentForm.get(["uldListRecord", index, "reqAccessory"]);
    addAccType.addValue([
      {
        accessoryType: null,
        qty: null,
      },
      {
        accessoryType: null,
        qty: null,
      },
      {
        accessoryType: null,
        qty: null,
      }
    ])
  }

  /* For deleting the rows in the Accessory type table */
  onDeleteAccessoryType(event, index, segmentrow) {
    (this.mUldAssignmentForm.get(["uldListRecord", segmentrow, "reqAccessory"]) as NgcFormArray).markAsDeletedAt(index);
  }

  /* For creating another section- with the same set of fields */
  addMoremULD() {
    (this.mUldAssignmentForm.get('uldListRecord') as NgcFormArray).addValue([{
      carrierCode: null,
      carrierName: null,
      requiredByCarrier: false,
      flightKey: null,
      flightDate: null,
      customerCode: null,
      customerId: null,
      customerName: null,
      reqContainers: [
        {
          uldType: null,
          qty: null,
        },
        {
          uldType: null,
          qty: null,
        },
        {
          uldType: null,
          qty: null,
        }
      ],
      reqAccessory: [
        {
          accessoryType: null,
          qty: null,
        },
        {
          accessoryType: null,
          qty: null,
        },
        {
          accessoryType: null,
          qty: null,
        }
      ],
      specialinstruction: null,
      emailNotificationFlag: false,
    }]);
  }

  /* This method is for the save function */
  onSave() {
    this.resetFormMessages();
    const saveEquipmentReqByUld: NgcFormGroup = (<NgcFormGroup>this.mUldAssignmentForm);
    saveEquipmentReqByUld.validate();
    if (this.mUldAssignmentForm.invalid && (!this.carrierCodechange())) {
      return;
    }
    else {
      let index: any;
      let request: any = new CreateEquipmentRequestByULDModel();
      request.requestPrinterId = this.mUldAssignmentForm.get("requestPrinterId").value;
      request.uldListRecord = (<NgcFormArray>this.mUldAssignmentForm.get("uldListRecord")).getRawValue();

      this.equipmentService.saveEquipmentReqByULD(request).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus("g.completed.successfully");
          this.windowFlag = true;
          (<NgcFormArray>this.windowForm.controls['arrayOfTransactionNumber']).patchValue(data.data.uldListRecord);
          this.transactionNumberPopUpWindow.open();
          if(this.windowForm.get(["arrayOfTransactionNumber"]).value[0].requestPrinterId != null){
            this.showSuccessStatus("g.report.print.initiated");
            // print function
            this.onPrintReport();  
          }
        } else {
          this.refreshFormMessages(data);
          this.showResponseErrorMessages(data);
        }
      }, error => {
        this.showErrorMessage(error);
      });
    }
  }

  /** 
  For OK & CLOSE button - inside pop up
  on click - close the pop up & reload the page
*/
  okButton() {
    this.transactionNumberPopUpWindow.close();
    this.reloadPage();
  }

  /* This method deletes entire section */
  deleteSection(index) {
    (<NgcFormArray>this.mUldAssignmentForm.get(['uldListRecord'])).deleteValueAt(index);
  }

  /* To fetch the name of the carrier */
  getCarrierName(event, index) {
    if (event && event.code) {
      this.mUldAssignmentForm.get(['uldListRecord', index, 'carrierName']).setValue(event.desc);
    }
  }

  /* To fetch the ID and Name of Agent*/
  getCustomerIdName(event, index) {
    if (event && event.code) {
      this.mUldAssignmentForm.get(['uldListRecord', index, 'customerId']).setValue(event.param1);
      this.mUldAssignmentForm.get(['uldListRecord', index, 'customerName']).setValue(event.desc);
    }
  }

  /* 
    When required by carrier field is checked, 
    agent will be disabled and agent name is cleared 
  */
  disableAgentName(requiredByCarrier, index) {
    if (requiredByCarrier) {
      (<NgcFormArray>this.mUldAssignmentForm.get(['uldListRecord', index, 'customerCode'])).disable();
      (<NgcFormArray>this.mUldAssignmentForm.get(['uldListRecord', index, 'customerCode'])).reset();
      (<NgcFormArray>this.mUldAssignmentForm.get(['uldListRecord', index, 'customerId'])).reset();
      (<NgcFormArray>this.mUldAssignmentForm.get(['uldListRecord', index, 'customerName'])).reset();
    }
    else {
      (<NgcFormArray>this.mUldAssignmentForm.get(['uldListRecord', index, 'customerCode'])).enable();
    }
  }

  /* Close button on pop up window */
  onCloseWindow() {
    this.transactionNumberPopUpWindow.close();
    this.reloadPage();
  }

  /* To check invalid carrier*/
  carrierCodechange() {
    let uldListRecord = (<NgcFormArray>this.mUldAssignmentForm.get("uldListRecord")).getRawValue();

    for (let index = 0; index < uldListRecord.length; index++) {
      const carrierCode = this.mUldAssignmentForm.get(['uldListRecord', index]).value;
      if (carrierCode.carrierCode.invalid) {
        return false;
      }
    }
    return true;
  }
  /* Print function to print the report */
  onPrintReport(){
    let data: any = <NgcFormArray>this.windowForm.get(["arrayOfTransactionNumber"]).value;
    if(data != null){
        data.forEach(element => {
          const reportRequest: ReportRequest  = new ReportRequest();
          const reportParameters: any = new Object();
          reportParameters.equipmentRequestId = element.equipmentRequestId;
          reportRequest.requestType = ReportRequestType.PRINT;
          reportRequest.printerType = PrinterType.LASER;
          reportRequest.reportName = 'mULD_Assignment';
          reportRequest.queueName = element.requestPrinterId;
          reportRequest.format = ReportFormat.PDF;
          reportRequest.parameters = reportParameters;
          this.equipmentService.printReport(reportRequest).subscribe(res => {
            this.showResponseErrorMessages(res);
          }, error => {
            this.showErrorMessage(error);
          });
        });
    }
  }
}