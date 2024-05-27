import { Component, OnInit, ViewChild, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import {
  NgcButtonComponent, NgcPage, NgcFormGroup,
  NgcFormControl, NgcFormArray, PageConfiguration
} from 'ngc-framework';
import { AcceptanceService } from '../acceptance.service';
import { GetRejectReturnShipmentDetails, ReturnShipmentRequest } from '../.././export.sharedmodel';

@Component({
  selector: 'app-return-shipment',
  templateUrl: './return-shipment.component.html',
  styleUrls: ['./return-shipment.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ReturnShipmentComponent extends NgcPage {
  private returnShipmentForm: NgcFormGroup = null;
  @ViewChild('searchbutton') searchbutton: NgcButtonComponent;
  isDataAvailable = true;
  isReject: boolean;
  serviceResponse: any;
  stopFlag = false;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private exportService: AcceptanceService) {
    super(appZone, appElement, appContainerElement);
  }


  public ngOnInit(): void {
    super.ngOnInit();
    this.initialize();
  }

  public initialize() {
    this.returnShipmentForm = new NgcFormGroup({
      shipmentNumber: new NgcFormControl(),
      origin: new NgcFormControl(),
      destination: new NgcFormControl(),
      pieces: new NgcFormControl(),
      weight: new NgcFormControl(),
      natureOfGoods: new NgcFormControl(),
      concatSHC: new NgcFormControl(),
      firstBookedFlight: new NgcFormControl(),
      firstBookedFlightDate: new NgcFormControl(),
      returnShipmentList: new NgcFormArray([]),
      rejectTypeDangerous: new NgcFormControl(false),
      rejectTypeGeneral: new NgcFormControl(false),
      rejectType: new NgcFormControl(),
      icCode: new NgcFormControl(),
      icName: new NgcFormControl(),
      reasonId: new NgcFormControl(),
      remarks: new NgcFormControl(),
      returnedICCode: new NgcFormControl(),
      returnedICName: new NgcFormControl(),
      reasonOfReturn: new NgcFormControl(),
      returnRemarks: new NgcFormControl()
    });

  }


  onSearch() {
    this.searchbutton.disabled = true;
    this.isDataAvailable = false;
    const requestData = new GetRejectReturnShipmentDetails();
    requestData.shipmentNumber = this.returnShipmentForm.get('shipmentNumber').value;
    this.exportService.getRejectReturnShipment(requestData)
      .subscribe(response => {
        this.refreshFormMessages(response);
        if (response.data !== null) {
          this.isDataAvailable = true;
          this.serviceResponse = response.data;
          this.returnShipmentForm.patchValue(this.serviceResponse);
          this.searchbutton.disabled = false;
        } else {
          this.searchbutton.disabled = false;
        }
      }, error => { });
  }


  onReturn() {

    this.checkPiecesAndWeightEntered();
    if (!this.stopFlag) {
      const returnShipmentRequest = new ReturnShipmentRequest();
      returnShipmentRequest.documentInformationId = this.serviceResponse.documentInformationId;
      returnShipmentRequest.prelodgeDocumentId = this.serviceResponse.prelodgeDocumentId;
      returnShipmentRequest.shipmentId = this.serviceResponse.shipmentId;
      returnShipmentRequest.shipmentNumber = this.serviceResponse.shipmentNumber;
      returnShipmentRequest.pieces = this.serviceResponse.pieces;
      returnShipmentRequest.weight = this.serviceResponse.weight;
      returnShipmentRequest.specialHandlingCode = this.serviceResponse.specialHandlingCode;
      returnShipmentRequest.rejectType = this.returnShipmentForm.get('rejectType').value;
      returnShipmentRequest.icCode = this.returnShipmentForm.get('icCode').value;
      returnShipmentRequest.icName = this.returnShipmentForm.get('icName').value;
      returnShipmentRequest.reasonId = this.returnShipmentForm.get('reasonId').value;
      returnShipmentRequest.remarks = this.returnShipmentForm.get('remarks').value;
      returnShipmentRequest.returnShipmentList = this.returnShipmentForm.get('returnShipmentList').value;

      this.exportService.returnShipmentRecord(returnShipmentRequest)
        .subscribe(response => {
          this.refreshFormMessages(response);
          if (response.success) {
            this.showSuccessStatus('export.shipment.returned.successfull');
            this.ngOnInit();
          }
        });
    }
  }

  checkPiecesAndWeightEntered() {
    this.stopFlag = false;
    const shipmentInventory: NgcFormArray =
      <NgcFormArray>this.returnShipmentForm.get('returnShipmentList');
    //
    if (shipmentInventory) {
      shipmentInventory.controls.forEach((control: any, index: number) => {
        const formGroup: NgcFormGroup = <NgcFormGroup>control;


        if (formGroup.controls['piecesToReturn'].value > formGroup.controls['pieces'].value) {
          this.showErrorStatus('expaccpt.return.pieces.more.warehouse.pieces');
          this.stopFlag = true;
        }

        //
        if (formGroup.controls['weightToReturn'].value > formGroup.controls['weight'].value) {
          this.showErrorStatus('expaccpt.return.weight.more.warehouse.weight');
          this.stopFlag = true;
        }
      });

    }

  }

}
