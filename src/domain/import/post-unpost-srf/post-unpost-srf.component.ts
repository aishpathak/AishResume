import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ImportService } from '../import.service';
import { NgcCheckBoxComponent, NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage, NgcWindowComponent, PageConfiguration, NgcUtility, NgcFileUploadComponent, NgcSignaturePadComponent, CellsRendererStyle, NgcReportComponent } from 'ngc-framework';
import { ApplicationFeatures } from '../../common/applicationfeatures';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-post-unpost-srf',
  templateUrl: './post-unpost-srf.component.html',
  styleUrls: ['./post-unpost-srf.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: false,
  dontRestoreOnBrowserBack: false
})
export class PostUnpostSrfComponent extends NgcPage {
  @ViewChild('cancelSRF') cancelSRF: NgcWindowComponent;
  @ViewChild('unpostSRF') unpostSRF: NgcWindowComponent;

  DOClientPrint: boolean;
  showTable: boolean;
  shc: any;
  issueDoSaveRequest: any;
  reportParameters: any;
  sectorId: any;
  delivered: boolean = false;
  patchDataValue: { srfNumber: any, shipmentNumber: any; };

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData != null) {
      this.form.get('deliveryRequestOrderNo').setValue(forwardedData.deliveryRequestOrderNo);
      this.onSearch();
    }
  }

  private form: NgcFormGroup = new NgcFormGroup({
    deliveryRequestOrderNo: new NgcFormControl(),
    printerName: new NgcFormControl(),
  })

  private postSRFForm: NgcFormGroup = new NgcFormGroup({

    deliveryRequestOrderNo: new NgcFormControl(),
    deliveryRequestedExpiredOn: new NgcFormControl(),
    deliveryRequestedOn: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    natureOfGoodsDescription: new NgcFormControl(),
    shc: new NgcFormControl(),
    poStatus: new NgcFormControl(),
    cargoOfficeArrivalTime: new NgcFormControl(),
    firstCargoDelivery: new NgcFormControl(),
    deliveryComplete: new NgcFormControl(),
    deliveredOn: new NgcFormControl(),
    paymentStatus: new NgcFormControl(),
    cancelSrf: new NgcFormControl(),
    consigneeName: new NgcFormControl(),
    appointedAgent: new NgcFormControl(),
    iataCode: new NgcFormControl(),
    authorizedAppointedAgent: new NgcFormControl(),
    authorizedAppointedAgentIATACode: new NgcFormControl(),
    bankEndorsementCollected: new NgcFormControl(),
    bank: new NgcFormControl(),
    receivingPartyIdentificationNumber: new NgcFormControl(),
    receivingPartyName: new NgcFormControl(),
    truckerCompany: new NgcFormControl(),
    truckNo: new NgcFormControl(),
    truckDockNo: new NgcFormControl(),
    timeslot: new NgcFormControl(),
    poRemarks: new NgcFormControl(),
    awbNumber: new NgcFormControl(),
    reason: new NgcFormControl(),
    impDeliveryId: new NgcFormControl(),
    deliveryRequestOrderId: new NgcFormControl(),
    shipmentId: new NgcFormControl(),
    inventoryGroupInfoByFlight: new NgcFormArray([
      new NgcFormGroup({
        serialNo: new NgcFormControl(),
        flight: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        dateATA: new NgcFormControl(),
        inventoryPiecesWeight: new NgcFormControl(),
        manifestPieceWeight: new NgcFormControl(),
        cirType: new NgcFormControl(),
        cirPieceWeight: new NgcFormControl(),
        clearenceInfo: new NgcFormControl(),
        ceRemarks: new NgcFormControl()
      })
    ]),

    locationDetails: new NgcFormArray([
      new NgcFormGroup({
        pieces: new NgcFormControl(),
        weight: new NgcFormControl(),
        shipmentLocation: new NgcFormControl(),
        actualLocation: new NgcFormControl(),
        warehouseLocation: new NgcFormControl()
      })
    ]),
    cancellationReason: new NgcFormControl(),

    chargeDetails: new NgcFormArray([
      new NgcFormGroup({
        serviceType: new NgcFormControl(),
        quantity: new NgcFormControl(),
        duration: new NgcFormControl(),
        amount: new NgcFormControl(),
        paid: new NgcFormControl(),
        receiptNo: new NgcFormControl(),
        paymentMode: new NgcFormControl()
      })
    ]),
    cancelPo: new NgcFormGroup(
      {
        deliveryRequestOrderNo: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        cancellationReason: new NgcFormControl(''),
        deliveryRequestId: new NgcFormControl(),
        id: new NgcFormControl(),
        customerId: new NgcFormControl(),
        airlineCustomerId: new NgcFormControl(),
        handlingSector: new NgcFormControl(),
        shipmentId: new NgcFormControl(),
        checkForDelivery: new NgcFormControl(),
        poStatus: new NgcFormControl(),
        source: new NgcFormControl(),
        hawbNumber: new NgcFormControl(),
        shipmentHouseId: new NgcFormControl()
      }
    )
  });

  onSearch() {
    this.showTable = false;
    this.form.get("printerName").reset;
    this.DOClientPrint = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Dlv_DOClientPrint);
    const requestData = {
      deliveryRequestOrderNo: this.form.get('deliveryRequestOrderNo').value
    }
    this.importService.getDeliveryInfo(requestData).subscribe(response => {
      const resp = response.data;
      this.refreshFormMessages(response);
      if (!this.showResponseErrorMessages(response)) {
        if (resp) {
          this.postSRFForm.patchValue(resp);
          this.postSRFForm.get('deliveryRequestOrderNo').setValue(resp.deliveryRequestOrderNo);
          if (resp.deliveredOn != null) {
            this.delivered = true;
          } else {
            this.delivered = false;
          }
          const inventoryFormArray: NgcFormArray = this.postSRFForm.get('inventory') as NgcFormArray;
          if (inventoryFormArray) {
            inventoryFormArray.controls.forEach((inventoryGroup: NgcFormGroup) => {
              if (inventoryGroup.get('onHold').value == true) {
                inventoryGroup.get('deliver').setValue(false);
                inventoryGroup.get('deliver').disable();
                inventoryGroup.get('reason').setValue(inventoryGroup.get('reasonForHold').value)
              }
              else if (inventoryGroup.get('ready').value == true) {
                inventoryGroup.get('deliver').setValue(false);
                inventoryGroup.get('deliver').disable();
                inventoryGroup.get('reason').setValue(inventoryGroup.get('reason').value)
              }
              else {
                inventoryGroup.get('deliver').setValue(true);
                inventoryGroup.get('deliver').disable();
              }
            });
          }
        }
        let i = 0;
        for (const eachRow of resp.inventory) {
          if (eachRow.onHold) {
            this.postSRFForm.get(['inventory', i, 'deliver']).disable();
          }
          ++i;
        }
        this.showTable = true;
        this.form.get("printerName").setValidators([Validators.required])
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  onCancelSRF() {

    const shipmentGroup = this.postSRFForm.getRawValue()
    this.showConfirmMessage('want.to.cancel.issueSRF').then(fulfilled => {
      this.cancelSRF.open();
      this.postSRFForm.get("cancelPo.deliveryRequestOrderNo").setValue(shipmentGroup.deliveryRequestOrderNo);
      this.postSRFForm.get("cancelPo.shipmentNumber").setValue(shipmentGroup.shipmentNumber);
      this.postSRFForm.get("cancelPo.deliveryRequestId").setValue(Number(shipmentGroup.deliveryRequestOrderId));
      this.postSRFForm.get("cancelPo.customerId").setValue(shipmentGroup.customerId)
      this.postSRFForm.get("cancelPo.shipmentId").setValue(shipmentGroup.shipmentId)
      this.postSRFForm.get("cancelPo.handlingSector").setValue(shipmentGroup.handlingSector)
      this.postSRFForm.get("cancelPo.checkForDelivery").setValue(shipmentGroup.checkForDelivery)
      this.postSRFForm.get("cancelPo.poStatus").setValue("CANCELLED")
      this.postSRFForm.get("cancelPo.source").setValue(shipmentGroup.poStatus)
    }
    ).catch(reason => {
    });
  }

  saveCancelSRF() {
    let request = (<NgcFormGroup>this.postSRFForm.get(['cancelPo'])).getRawValue();
    this.importService.cancelDeliveryRequest(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.showTable = false;
        this.cancelSRF.close()
      }
      this.patchData();
      this.navigateTo(this.router, '/import/IssueSRF', this.patchDataValue);
    }, error => {
      this.showErrorStatus(error);
    });
  }

  onPostSRF() {
    this.issueDoSaveRequest = this.postSRFForm.getRawValue();
    if (this.postSRFForm.get("paymentStatus").value != null && this.postSRFForm.get("paymentStatus").value === 'Charges are Pending') {
      this.showErrorStatus('impdlv.err103');
      return;
    }
    if (this.postSRFForm.get("deliveryComplete").value == null) {
      this.showErrorMessage("imp.dlv.deliveryComplete.timestamp");
      return;
    }
    if (this.form.get("printerName").value == null) {
      this.showErrorMessage("expaccpt.select.printer");
      return;
    }
    this.issueDoSaveRequest.printerName = this.form.get("printerName").value;
    console.log(this.issueDoSaveRequest);
    this.issueDoSaveRequest.inventoryGroupInfoByFlight.forEach(groupBy => {
      this.issueDoSaveRequest.inventory.forEach(element => {
        if (element.flightId == groupBy.flightId) {
          element.checkBoxValue = true;
        }
      });
    });
    this.issueDoSaveRequest.customerId = this.postSRFForm.get('customerId').value

    if (this.issueDoSaveRequest.blackListed == 'Y') {
      this.showErrorStatus('AGTBLOCKLISTED');
      return;
    }
    if (this.issueDoSaveRequest.receivingPartyIdentificationNumber != null && this.issueDoSaveRequest.receivingPartyName != null) {
      this.importService.checkForBlackListCustomer(this.issueDoSaveRequest).subscribe(response => {
        if (response.success === false) {
          if (response.messageList.length > 0) {
            var icName: string[] = [];
            icName.push(this.issueDoSaveRequest.receivingPartyName);
            icName.push(this.issueDoSaveRequest.receivingPartyIdentificationNumber);
            var error = NgcUtility.translateMessage(response.messageList[0].code, icName);
            this.showErrorStatus(error + " " + response.messageList[0].message);
            return;
          }
        }
      });
      this.importService.onSaveIssueDo(this.issueDoSaveRequest).subscribe(response => {
        const resp = response.data;
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus('g.completed.successfully');
          this.postSRFForm.reset();
          this.showTable = false;
        }
      }, error => {
        this.showErrorStatus(error);
      });

    }
  }

  onExtedSRF() {
    if (this.postSRFForm.get("paymentStatus").value != null && this.postSRFForm.get("paymentStatus").value === 'Charges are Pending') {
      this.showErrorStatus('impdlv.err103');
      return;
    }
    let unpostDoRequest = this.postSRFForm.getRawValue();
    const request = {
      shipmentType: unpostDoRequest.shipmentType,
      shipmentNumber: unpostDoRequest.shipmentNumber,
      shipmentDate: unpostDoRequest.shipmentDate,
      customerId: unpostDoRequest.customerId,
      shipmentid: unpostDoRequest.shipmentId,
      deliveryRequestId: Number(unpostDoRequest.deliveryRequestOrderId),
      deliveryRequestOrderNo: unpostDoRequest.deliveryRequestOrderNo
    }
    this.importService.extendIssueSrf(request).subscribe(response => {
      const resp = response.data;
      this.refreshFormMessages(response);
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.onSearch();
      }
    }, error => {
      this.showErrorStatus(error);
    });

  }

  onUnpostSRF() {
    let unpostDoRequest = this.postSRFForm.getRawValue();
    this.postSRFForm.get('locationDetails').patchValue(unpostDoRequest.inventory);
    this.unpostSRF.open();
  }

  saveUnpostSRF() {
    let unpostDoRequest = this.postSRFForm.getRawValue();
    let locationDetails = this.postSRFForm.get('locationDetails').value;
    console.log(unpostDoRequest);
    const request = {
      shipmentType: unpostDoRequest.shipmentType,
      shipmentNumber: unpostDoRequest.shipmentNumber,
      shipmentDate: unpostDoRequest.shipmentDate,
      deliveryId: unpostDoRequest.impDeliveryId,
      customerId: unpostDoRequest.customerId,
      shipmentid: unpostDoRequest.shipmentId,
      deliveryRequestId: Number(unpostDoRequest.deliveryRequestOrderId),
      deliveryRequestOrderNo: unpostDoRequest.deliveryRequestOrderNo,
      status: 'CANCELLED',
      freightOutList: this.postSRFForm.get('locationDetails').value,
      cancellationReason: this.postSRFForm.get('cancellationReason').value
    }
    console.log(request);
    this.importService.cancelPostSrf(request).subscribe(response => {
      const resp = response.data;
      this.refreshFormMessages(response);
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.unpostSRF.close();
        this.onSearch();
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  onSRFMonitoring() {
    this.patchData();
    this.navigateTo(this.router, 'import/SRFMonitoring', this.patchDataValue);
  }

  patchData() {
    this.patchDataValue = {
      srfNumber: this.form.get('deliveryRequestOrderNo').value,
      shipmentNumber: this.postSRFForm.get('shipmentNumber').value
    }
  }
  onLocationChange(data, index) {
    this.sectorId = data.parameter2;
  }
}
