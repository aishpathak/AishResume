import { Component, ElementRef, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcCheckBoxComponent, NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage, NgcWindowComponent, PageConfiguration, NgcUtility, NgcFileUploadComponent, NgcSignaturePadComponent, CellsRendererStyle, NgcReportComponent } from 'ngc-framework';
import { ImportService } from '../import.service';
import { ApplicationFeatures } from '../../common/applicationfeatures';
import { Validators } from '@angular/forms';
import { IssueSRFCustomerInfo } from "../import.sharedmodel";


@Component({
  selector: 'app-issuesrf',
  templateUrl: './issuesrf.component.html',
  styleUrls: ['./issuesrf.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: false,
  dontRestoreOnBrowserBack: false
})
export class IssuesrfComponent extends NgcPage {
  responseLateSubmission: boolean;
  responseBankEndorsement: any;
  dataToPatch1: any;
  showBankEndorsement: boolean;
  lateSubmissionRequired: boolean;
  showTable = false;
  chargesflag: boolean = false;
  clearingAgent: any;
  disableClear: boolean;
  firstField: any;
  resp: any;
  issueSRFSaveRequest: any;
  appointedAgentName: any;
  printerName: any;
  appointedAgentFlag: boolean = false;
  reportParameters: any = {};
  patchDataValue: { shipmentNumber: any, srfNo: any };
  issueSRFCustomerInfo: IssueSRFCustomerInfo = new IssueSRFCustomerInfo();
  @ViewChild('uploadedfiles') uploadedfiles: NgcFileUploadComponent;
  @ViewChild('issueSRFReport') issueSRFReport: NgcReportComponent;

  @ViewChild('docUploadWindow') docUploadWindow: NgcWindowComponent;
  shipmentNumber: any;
  showCDIF: boolean;
  cdifNo: any;
  showFlightInfo: boolean;
  shipmentType1: any = "AWB";
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
    this.shipmentType1 = "AWB";
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData != null) {
      this.issueSRFForm.get('shipmentNumber').setValue(forwardedData.shipment);
      this.onSearch();
    }
    super.ngOnInit();
  }

  private form: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    printerName: new NgcFormControl(),
    shipmentType: new NgcFormControl(),
  })

  private issueSRFForm: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    printerName: new NgcFormControl(),
    deliveryRequestOrderNo: new NgcFormControl(),
    srfexpiry: new NgcFormControl(),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    natureOfGoodsDescription: new NgcFormControl(),
    shc: new NgcFormControl(),
    docUploaded: new NgcFormControl(),
    approvalStatus: new NgcFormControl(),
    consigneeName: new NgcFormControl(),
    appointedAgent: new NgcFormControl(),
    iataCode: new NgcFormControl(),
    bankEndorsementCollected: new NgcFormControl(),
    bank: new NgcFormControl(),
    paymentStatus: new NgcFormControl(),
    receivingPartyName: new NgcFormControl(),
    receivingPartyIdentificationNumber: new NgcFormControl(),
    truckCompany: new NgcFormControl(),
    truckNumber: new NgcFormControl(),
    truckDockNo: new NgcFormControl(),
    timeslot: new NgcFormControl(),
    srfRemarks: new NgcFormControl(),
    agentPD: new NgcFormControl(),
    agentBalance: new NgcFormControl(),
    airlinePF: new NgcFormControl(),
    airlineBalance: new NgcFormControl(),
    unDeliveredPieces: new NgcFormControl(),
    unDeliveredWeight: new NgcFormControl(),
    deliveredPieces: new NgcFormControl(),
    deliveredWeight: new NgcFormControl(),
    letterOfDeclaration: new NgcFormControl(),
    lateSubmission: new NgcFormControl(),
    onHoldShipment: new NgcFormControl(),

    inventoryGroupInfoByFlight: new NgcFormArray([
      new NgcFormGroup({
        checkBoxValue: new NgcFormControl(),
        serialNo: new NgcFormControl(),
        flight: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        cdifNo: new NgcFormControl(),
        dateATA: new NgcFormControl(),
        inventoryPiecesWeight: new NgcFormControl(),
        warehouseLocation: new NgcFormControl(),
        manifestPieceWeight: new NgcFormControl(),
        cirType: new NgcFormControl(),
        cirPieceWeight: new NgcFormControl(),
        clearenceInfo: new NgcFormControl(),
        ceRemarks: new NgcFormControl()
      })
    ]),

    licensePermitDetails: new NgcFormArray([
      new NgcFormGroup({
        serialNo: new NgcFormControl(),
        liscensePermitType: new NgcFormControl(),
        liscensePermitNUmber: new NgcFormControl(),
        issueDate: new NgcFormControl(),
        duration: new NgcFormControl(),
        expiryDate: new NgcFormControl()
      })
    ]),


    charges: new NgcFormArray([
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
    awbNumber: new NgcFormControl(),
    documentNames: new NgcFormArray([
    ]),
  });

  onSearch() {
    this.chargesflag = false;
    this.showTable = false;
    this.form.get("printerName").reset();
    this.form.get("printerName").clearValidators();
    this.issueSRFForm.controls["licensePermitDetails"].patchValue([]);
    if (this.form.invalid) {
      return;
    }
    const requestData = this.form.getRawValue();

    this.importService.getShipmemtInfo(requestData).subscribe(response => {
      const resp = response.data;

      if (this.showResponseErrorMessages(response)) {
        this.showTable = false;
        return;
      }

      //calculate undelivered pieces/weight
      let unDeliveredPieces = Number(resp.pieces) - Number(resp.deliveredPieces);
      this.issueSRFForm.get('unDeliveredPieces').setValue(unDeliveredPieces);

      let unDeliveredWeight = Number(resp.weight) - Number(resp.deliveredWeight);
      this.issueSRFForm.get('unDeliveredWeight').setValue(unDeliveredWeight);

      if (resp != null) {
        this.responseBankEndorsement = resp.bankEndorsementCollected
        this.dataToPatch1 = resp.bankEndorsementCollected
        if (resp.bankEndorsementCollected === false) {
          this.showBankEndorsement = false
        }
        //late submission disabled flag
        if (resp.latesubmissionRequired) {
          this.responseLateSubmission = false;
        } else {
          this.responseLateSubmission = true;
        }
      }

      this.refreshFormMessages(response);
      if (!this.showResponseErrorMessages(response)) {
        if (resp) {

          this.issueSRFForm.patchValue(resp);

          if (this.issueSRFCustomerInfo != null && this.issueSRFCustomerInfo.previousAppointedAgent != null) {
            console.log(this.issueSRFCustomerInfo.previousAppointedAgent);
            this.issueSRFForm.get("appointedAgent").setValue(this.issueSRFCustomerInfo.previousAppointedAgent);
            this.issueSRFForm.get("iataCode").setValue(this.issueSRFCustomerInfo.prevIATACode);
            this.issueSRFForm.get("bank").setValue(this.issueSRFCustomerInfo.prevBank);
            this.issueSRFForm.get("receivingPartyIdentificationNumber").setValue(this.issueSRFCustomerInfo.prevHkid);
            this.issueSRFForm.get("receivingPartyName").setValue(this.issueSRFCustomerInfo.prevCollectedBy);
            this.issueSRFForm.get("truckCompany").setValue(this.issueSRFCustomerInfo.prevTruckCompany);
            this.issueSRFForm.get("truckNumber").setValue(this.issueSRFCustomerInfo.prevTruckNumber);
            this.issueSRFForm.get("srfRemarks").setValue(this.issueSRFCustomerInfo.prevSRFRemarks);
          }

          resp.inventoryGroupInfoByFlight.forEach((element, i) => {
            if (element.reason == null) {
              this.issueSRFForm.get(['inventoryGroupInfoByFlight', i, 'checkBoxValue']).patchValue(true);
            }

          });
          this.showTable = true;
          this.form.get("printerName").setValidators([Validators.required])
          this.addLicensePermit();
        } else {
          this.showTable = false;
        }

        let i = 0;
        for (const eachRow of resp.inventoryGroupInfoByFlight) {
          if (eachRow.onHold || eachRow.ready) {
            this.issueSRFForm.get(['inventoryGroupInfoByFlight', i, 'checkBoxValue']).disable();
          }
          ++i;
        }
        this.clearingAgent = resp.customerId
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  public onCharges() {
    this.chargesflag = true;
  }

  addLicensePermit() {
    (<NgcFormArray>this.issueSRFForm.controls["licensePermitDetails"]).addValue(
      [{
        impDeliveryRequestId: null,
        liscensePermitType: null,
        liscensePermitNUmber: null,
        issueDate: null,
        duration: null,
        expiryDate: null

      }]
    )
  }

  delete(event: any, index: any) {
    (this.issueSRFForm.get(["licensePermitDetails", index]) as NgcFormControl).markAsDeleted();
  }

  onSave() {

    this.issueSRFForm.validate();
    if (this.issueSRFForm.invalid) {
      return;
    }
    if (!this.showTable) {
      return;
    }
    this.issueSRFSaveRequest = this.issueSRFForm.getRawValue();


    this.issueSRFSaveRequest.customerId = this.clearingAgent;
    console.log(this.issueSRFSaveRequest);
    this.issueSRFSaveRequest.inventoryGroupInfoByFlight.forEach(groupBy => {
      if (groupBy.checkBoxValue) {
        this.issueSRFSaveRequest.inventory.forEach(element => {
          if (element.flightId == groupBy.flightId) {
            element.checkBoxValue = true;
          }
        });
      }
    });
    if (this.form.get("printerName").value == null) {
      this.showErrorMessage("select a printer");
      return;
    } else {
      this.issueSRFSaveRequest.printerName = this.form.get("printerName").value;
    }
    //issue SRF Service call
    this.saveIsseSRF();
  }



  saveIsseSRF() {
    this.importService.checkPaymentStatus(this.issueSRFSaveRequest).subscribe(response => {
      const resp = response.data;
      if (!this.showResponseErrorMessages(response)) {
        if (resp.paymentStatus === 'Charges are Pending') {
          this.showConfirmMessage(NgcUtility.translateMessage("import.confirm104", [NgcUtility.getTenantConfiguration().format.currencySymbol, resp.pendingAmount])).then(fulfilled => {
            var dataToSend = {
              shipment: resp.shipmentNumber,
              poFlag: true,
              poChargeCode: resp.chargeCode,
              poNumber: resp.deliveryRequestOrderNo,
              data: resp
            }
            this.navigateTo(this.router, '/billing/collectPayment/enquireCharges', dataToSend);
          }
          ).catch(reason => {
            this.issueSRFSaveRequest.id = resp.id
            this.importService.cancelPaymentRequest(this.issueSRFSaveRequest).subscribe(response => {
            })
          });
        } else {
          if (this.issueSRFSaveRequest.blackListed == 'N') {
            this.importService.onSaveIssuePo(resp).subscribe(response => {
              const resp = response.data;
              this.refreshFormMessages(response);
              if (!this.showResponseErrorMessages(response)) {
                this.showSuccessStatus('g.completed.successfully');

                const reportParameters: any = {};

                reportParameters.ImpDeliveryRequestId = response.data.id;
                reportParameters.airPortcode = NgcUtility.getTenantConfiguration().airportCode;
                this.reportParameters = reportParameters;
                this.issueSRFReport.open();


                this.issueSRFForm.reset();
                this.chargesflag = false;
                this.showTable = false;
                this.form.get("printerName").reset();
                this.showConfirmMessage(NgcUtility.translateMessage("import.confirm002", [resp.deliveryRequestOrderNo, resp.poExpiryDate])).then(fulfilled => {

                  this.issueSRFCustomerInfo.previousAppointedAgent = this.issueSRFForm.get("appointedAgent").value;
                  this.issueSRFCustomerInfo.prevIATACode = this.issueSRFForm.get("iataCode").value;
                  this.issueSRFCustomerInfo.prevBank = this.issueSRFForm.get("bank").value;
                  this.issueSRFCustomerInfo.prevCollectedBy = this.issueSRFForm.get("receivingPartyName").value;
                  this.issueSRFCustomerInfo.prevHkid = this.issueSRFForm.get("receivingPartyIdentificationNumber").value;
                  this.issueSRFCustomerInfo.prevTruckCompany = this.issueSRFForm.get("truckCompany").value;
                  this.issueSRFCustomerInfo.prevTruckNumber = this.issueSRFForm.get("truckNumber").value;
                  this.issueSRFCustomerInfo.prevSRFRemarks = this.issueSRFForm.get("srfRemarks").value;
                  this.issueSRFForm.reset();
                }).catch(reason => {
                  this.issueSRFCustomerInfo = null;
                  this.issueSRFForm.reset();
                });

              }
            }, error => {
              this.showErrorStatus(error);
            });

          }
          else {
            this.showErrorStatus('AGTBLOCKLISTED')
          }
        }
      }
    })
  }

  onShipmentInfo() {
    this.patchData();
    this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', this.patchDataValue);
  }

  patchData() {
    this.patchDataValue = {
      shipmentNumber: this.issueSRFForm.get('shipmentNumber').value,
      srfNo: this.issueSRFForm.get('deliveryRequestOrderNo').value
    }
  }
  onSRFMonitoring() {
    this.patchData();
    this.navigateTo(this.router, 'import/SRFMonitoring', this.patchDataValue);
  }

  onESRFApproval() {
    this.patchData();
    this.navigateTo(this.router, 'import/eSRFApproval', this.patchDataValue);
  }

  onCDIF() {
    this.patchData();
    this.navigateTo(this.router, 'import/maintaincdif', this.patchDataValue);
  }

  onChangePermitType(data, index) {
    this.issueSRFForm.get(['licensePermitDetails', index, 'duration']).setValue(data.parameter1);
    this.issueSRFForm.get(['licensePermitDetails', index, 'issueDate']).setValue(data.parameter2);
    this.issueSRFForm.get(['licensePermitDetails', index, 'expiryDate']).reset();
    if (data.parameter3 !== "1900-01-01 00:00:00.0") {
      this.issueSRFForm.get(['licensePermitDetails', index, 'expiryDate']).setValue(data.parameter3);
    }
  }


  onDocUpload(data) {
    this.issueSRFForm.get('awbNumber').setValue(this.issueSRFForm.get('shipmentNumber').value);
    this.shipmentNumber = this.issueSRFForm.get('shipmentNumber').value;
    this.docUploadWindow.open();
  }

  onCompanyLOVSelect(data) {
    console.log(data);
    if (data.param3 != null && data.param3 != '') {
      this.issueSRFForm.get("iataCode").setValue(Number(data.param3));
      this.clearingAgent = Number(data.param1)
    }
  }

  private onShipmentSelect(event) {
    if (event.shipmentType) {
      this.form.get('shipmentType').patchValue(event.shipmentType);
    }
  }



}

