import {
  NgcFormGroup, NgcFormArray, NgcApplication, NgcDropDownComponent, NgcButtonComponent,
  NgcPage, NotificationMessage, StatusMessage, MessageType, DropDownListRequest, BaseResponse, PageConfiguration
} from "ngc-framework";

import {
  Component, NgZone, ElementRef, OnInit,
  OnDestroy, ViewContainerRef, ViewChild
} from "@angular/core";
import { Validators } from '@angular/forms';
import { NgcFormControl, NgcUtility, DateTimeKey, NgcFileUploadComponent } from "ngc-framework";
import { ActivatedRoute, Router } from "@angular/router";
import { BillingService } from '../billing.service';
import { ListServiceRequest } from '../billing.sharedmodel';
import { AwbManagementService } from "../../awbManagement/awbManagement.service";
import { ApplicationEntities } from "../../common/applicationentities";

@Component({
  selector: 'app-editServiceRequest',
  templateUrl: './editServiceRequest.component.html',
  styleUrls: ['./editServiceRequest.component.scss']
})

@PageConfiguration({
  trackInit: true,
  //callNgOnInitOnClear: true/* disable clear button in edit screen */
})
export class EditServiceRequestComponent extends NgcPage {
  handledbyHouse: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private billingService: BillingService, private route: ActivatedRoute, private router: Router, private awbManagementService: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }
  hawbInvalid: boolean = false;
  private forwardedData: any = null;
  private customerId: any;
  private serviceMasterId: any;
  resp: any;
  requestedDateTime: any = null;
  editedDateTime: any = null;
  isAWB: boolean = true;
  isGeneric = false;
  isTruck = false;
  isULD = false;
  showOption: any = false;
  arrString: any;
  showDuration: any = false;
  showQuantity: any = false;
  disableQuantity: boolean = false;

  @ViewChild("fileUpload")
  private fileUpload: NgcFileUploadComponent;

  private editServiceRequestForm: NgcFormGroup = new NgcFormGroup({
    hawbNumber: new NgcFormControl(),
    serviceCode: new NgcFormControl(),
    status: new NgcFormControl(),
    uom: new NgcFormControl(),
    customerId: new NgcFormControl(),
    customerName: new NgcFormControl(),
    requestedOn: new NgcFormControl(),
    requestedBy: new NgcFormControl('', [Validators.maxLength(64)]),
    associatedTo: new NgcFormControl(),
    requestorContactNumber: new NgcFormControl(),
    serviceCategory: new NgcFormControl(),
    quantityOf: new NgcFormControl(),
    requestedQuantity: new NgcFormControl(''),
    remarks: new NgcFormControl('', [Validators.maxLength(65)]),
    documentReferenceId: new NgcFormControl(),
    durationOf: new NgcFormControl(),
    duration: new NgcFormControl(),
    durationUom: new NgcFormControl(),
    notificationEmailId1: new NgcFormControl(),
    notificationEmailId2: new NgcFormControl(),
    notificationEmailId3: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    flightId: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    containerNumber: new NgcFormControl(),
    startedOn: new NgcFormControl(),
    completedOn: new NgcFormControl(),
    rejectReason: new NgcFormControl('', [Validators.maxLength(65)]),
    validateRequestedOn: new NgcFormControl(),
    additionalRemarks: new NgcFormControl('', [Validators.maxLength(65)]),
    serviceRequestNo: new NgcFormControl(),
    optionName: new NgcFormControl(),
    optionValue: new NgcFormControl(),
    shipmentHouseId: new NgcFormControl(),
    truckNumber: new NgcFormControl()
  });
  showButtons: boolean = true;

  ngOnInit() {
    super.ngOnInit();
    this.forwardedData = this.getNavigateData(this.route);
    this.editServiceRequestForm.get('serviceCode').disable();
    this.editServiceRequestForm.get('customerId').disable();
  }

  /**
   * back To previous page
   * @param {any} $event
   * @memberof 
   */
  onCancel($event) {
    this.navigateBack(this.forwardedData ? this.forwardedData : {});
  }

  /**
   * After View Init
   */
  ngAfterViewInit() {
    super.ngAfterViewInit();
    // checking if the fetched data is not null
    if (this.forwardedData != null) {
      this.setFetchedData(this.forwardedData.editSearchData);
    }
  }

  /**
 * Called when the data is forwarded from listServiceRequest screen
 * This patches the forwarded data with serviceSetup.
 * @param forwardedData
 * @returns void
 */
  private setFetchedData(forwardedData: any): void {
    this.requestedDateTime = NgcUtility.getDateTimeAsString(forwardedData.requestedOn);
    let fetchRecord: ListServiceRequest = forwardedData;
    this.billingService.getServiceRequest(fetchRecord).subscribe(response => {
      if (response.success) {
        this.resp = response.data;
        if (this.resp.status == 'Completed' || this.resp.status == 'Rejected') {
          this.showButtons = false;
        } else {
          this.showButtons = true;
        }
        if (this.resp.optionValue != null) {
          this.arrString = this.resp.optionValue.split(',');
        }
        if ((response.data as any).duration) {
          this.showDuration = true;
        } else {
          this.showDuration = false;
        }
        if ((response.data as any).requestedQuantity) {
          this.showQuantity = true;
        } else {
          this.showQuantity = false;
        }
        if ((response.data as any).quantityModifiable) {
          this.disableQuantity = false;
        } else {
          this.disableQuantity = true;
        }
        if (response.data.associatedTo === 'AWB') {
          this.isAWB = true;
          this.isGeneric = false;
          this.isTruck = false;
          this.isULD = false;
        } else if (response.data.associatedTo === 'generic') {
          this.isAWB = false;
          this.isGeneric = true;
          this.isTruck = false;
          this.isULD = false;
        } else if (response.data.associatedTo === 'TRUCK') {
          this.isAWB = false;
          this.isGeneric = false;
          this.isTruck = true;
          this.isULD = false;
        } else if (response.data.associatedTo === 'ULD') {
          this.isAWB = false;
          this.isGeneric = false;
          this.isTruck = false;
          this.isULD = true;
        }
        if (response.data.optionName) {
          this.showOption = true;
        } else {
          this.showOption = false;
        }

        this.editServiceRequestForm.patchValue(this.resp);
      } else {
        this.refreshFormMessages(response.data);
      }
    });

  }

  /**
     * Called when data has to be updated 
     * 
     */
  public onSave() {
    let update: ListServiceRequest = this.editServiceRequestForm.getRawValue();
    this.editedDateTime = NgcUtility.getDateTimeAsString(update.requestedOn);
    //set flag if the requestedon is  edited
    if (this.requestedDateTime == this.editedDateTime) {
      update['validateRequestedOn'] = false;
    } else {
      update['validateRequestedOn'] = true;
    }
    //set the type of request
    if (this.isAWB) {
      update['associatedTo'] = 'AWB';
    } else if (this.isGeneric) {
      update['associatedTo'] = 'generic';
    } else if (this.isULD) {
      update['associatedTo'] = 'ULD';
    } else if (this.isTruck) {
      update['associatedTo'] = 'TRUCK';
    }
    this.fileUpload.upload();
    this.billingService.updateServiceRequest(update).subscribe(response => {
      if (response.success && !response.messageList) {
        this.resp = response.data;
        this.showSuccessStatus("billing.sucess.service.updated");
        this.navigateBack(this.forwardedData ? this.forwardedData : {});
      } else {
        if (response.messageList && response.messageList.length > 0) {
          this.refreshFormMessages(response);
        } else {
          this.refreshFormMessages(response.data);
        }
      }
    });
  }

  /**
       * Called when services is rejected
       * 
       */
  rejectServices(event) {
    let req: any = new Array();
    let rejUpdate: ListServiceRequest = this.editServiceRequestForm.getRawValue();
    rejUpdate['status'] = 'Rejected';
    this.editedDateTime = NgcUtility.getDateTimeAsString(rejUpdate.requestedOn);
    //set flag if the requestedon is  edited
    if (this.requestedDateTime == this.editedDateTime) {
      rejUpdate['validateRequestedOn'] = false;
    } else {
      rejUpdate['validateRequestedOn'] = true;
    }
    //set the type of request
    if (this.isAWB) {
      rejUpdate['associatedTo'] = 'AWB';
    } else if (this.isGeneric) {
      rejUpdate['associatedTo'] = 'generic';
    } else if (this.isULD) {
      rejUpdate['associatedTo'] = 'ULD';
    } else if (this.isTruck) {
      rejUpdate['associatedTo'] = 'TRUCK';
    }
    req.push(rejUpdate);
    this.billingService.completeServiceRequest(req).subscribe(response => {
      if (response.success && !response.messageList) {
        this.resp = response.data;
        this.showSuccessStatus("billing.sucess.rejected");
        this.navigateBack(this.forwardedData ? this.forwardedData : {});
      } else {
        if (response.messageList && response.messageList.length > 0) {
          this.refreshFormMessages(response);
        } else {
          this.refreshFormMessages(response.data);
        }
      }
    });
  }

  /**
       * Called when service has to be completed
       * 
       */
  completeServiceRequest(event) {
    let req: any = new Array();
    let comUpdate: ListServiceRequest = this.editServiceRequestForm.getRawValue();
    comUpdate['status'] = 'updateTime';
    this.editedDateTime = NgcUtility.getDateTimeAsString(comUpdate.requestedOn);
    //set flag if the requestedon is  edited
    if (this.requestedDateTime == this.editedDateTime) {
      comUpdate['validateRequestedOn'] = false;
    } else {
      comUpdate['validateRequestedOn'] = true;
    }
    //set the type of request
    if (this.isAWB) {
      comUpdate['associatedTo'] = 'AWB';
    } else {
      comUpdate['associatedTo'] = 'generic';
    }
    req.push(comUpdate);
    this.billingService.completeServiceRequest(req).subscribe(response => {
      if (response.success && !response.messageList) {
        this.resp = response.data;
        this.showSuccessStatus("billing.sucess.service.completed");
        this.navigateBack(this.forwardedData ? this.forwardedData : {});
      } else {
        if (response.messageList && response.messageList.length > 0) {
          this.refreshFormMessages(response);
        } else {
          this.refreshFormMessages(response.data);
        }
      }
    });
  }

  public getReferenceId(): string {
    return String(this.editServiceRequestForm.get('documentReferenceId').value);
  }
  setAWBNumber(object, index) {
    if (object.code == null) {
      this.hawbInvalid = true;
      this.showErrorStatus('hawb.invalid');
    }
    else {
      this.hawbInvalid = false;
      this.resetFormMessages();
      this.editServiceRequestForm.get('hawbNumber').setValue(object.code);
      this.editServiceRequestForm.get('shipmentHouseId').setValue(object.param2);
    }
  }

  getFlightDetails(event) {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      let search = {
        shipmentNumber: this.editServiceRequestForm.get('shipmentNumber').value,
        shipment: this.editServiceRequestForm.get('shipmentNumber').value,
        shipmentType: 'AWB',
        appFeatures: null,
      }
      this.billingService.checkHandledByOrAccpByHouse(search).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          if (data) {
            this.handledbyHouse = true;
          } else {
            this.handledbyHouse = false;
          }
        }
      })
    }

  }
}
