import { Component, ElementRef, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgcCheckBoxComponent, NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage, NgcWindowComponent, PageConfiguration, NgcUtility, NgcFileUploadComponent, NgcSignaturePadComponent, CellsRendererStyle, NgcReportComponent } from 'ngc-framework';
import { ImportService } from '../import.service';
import { IfStmt } from '../../../../node_modules/@angular/compiler';
import { ApplicationFeatures } from '../../common/applicationfeatures';
import { NgcRegularReportComponent } from '../../billing/ngc-regular-report/ngc-regular-report.component';
import { DuplicatenamepopupComponent } from '../../common/duplicatenamepopup/duplicatenamepopup.component';
import { C } from "@angular/core/src/render3";



@Component({
  selector: 'app-issuepo',
  templateUrl: './issuepo.component.html',
  styleUrls: ['./issuepo.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
})

export class IssuepoComponent extends NgcPage {
  @ViewChild('duplicateNameWindow') duplicateNameWindow: NgcWindowComponent;
  responseBankEndorsement: any;
  dataToPatch1 = false
  shipmentType1: any = "AWB";
  showBankEndorsement = true;
  appointedAgent = false
  subMessageParameter: {};
  locationParameter: {};
  disableClear = false
  issuePoSaveRequest: any;
  clearingAgentParam: any;
  dataToPatch: any;
  arraySumPiecesData: any;
  searchFlag: boolean;
  // showLicenseRemarksFlag: boolean;
  excemptionCodeFlag: boolean;
  permitNumberFlag: boolean;
  permitToFollowFlag: boolean;
  issuePoSave: any;
  showTable = false
  isSignature = false
  bankEndorsement: boolean;
  showRemarks = false
  @ViewChild('houses') houses: NgcWindowComponent;
  @ViewChild('upload') upload: NgcFileUploadComponent;
  @ViewChild('sign') sign: NgcSignaturePadComponent;
  @ViewChild('inventoryField') firstField: NgcCheckBoxComponent;
  @ViewChild('windowPrinter') windowPrinter: NgcWindowComponent;
  @ViewChild('issuePoReport') issuePoReport: NgcReportComponent;
  param1: {};
  referenceNumber: any;
  resp: any;
  expireAppointedAgent = true;
  appointedAgentValue: any;
  appointedAgentCode: any;
  shc: any;
  popupPrinterForm: NgcFormGroup = new NgcFormGroup({
    printerdropdown: new NgcFormControl(),
  });
  printerName: any;
  request: { receivingPartyIdentificationNumber: any; customerId: any; shipmentNumber: any; shipmentDate: any; };
  id: any;
  navigateData: any;
  patchDataValue: { shipmentNumber: any, hawbNumber: any; };
  appointedAgentName: any;
  clearingAgent: any;
  hideClearingAgent = false;
  hawbSourceParameters: {};
  handledByMasterHouse: boolean;
  hawbHandling: boolean;
  poClientPrint: boolean;
  awbPieces: any;
  hawbPieces: any;
  reportParameters: any = {};
  validNamesUponValidate: any = [];
  isValidName: boolean = false;




  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private importService: ImportService,
    private router: Router, private activatedRoute: ActivatedRoute) { super(appZone, appElement, appContainerElement); }


  private form: NgcFormGroup = new NgcFormGroup({
    chargeCode: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    deliveryRequestOrderNo: new NgcFormControl(),
    shipmentType: new NgcFormControl(),
    hawbnumber: new NgcFormControl(),


  })

  private issuePoForm: NgcFormGroup = new NgcFormGroup({
    terminal: new NgcFormControl(),
    svc: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    deliveryRequestOrderNo: new NgcFormControl(),
    chargeCode: new NgcFormControl('', Validators.required),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    authorizedRemarks: new NgcFormControl(null, [Validators.maxLength(65)]),
    deliveredPieces: new NgcFormControl(),
    deliveredWeight: new NgcFormControl(),
    awbChargeableWeight: new NgcFormControl(),
    natureOfGoodsDescription: new NgcFormControl(),
    shc: new NgcFormControl(),
    consigneeName: new NgcFormControl(),
    blackListed: new NgcFormControl(),
    notifyParty: new NgcFormControl(),
    customerId: new NgcFormControl(),
    appointedAgent: new NgcFormControl(),
    appointedAgentName: new NgcFormControl(),
    paid: new NgcFormControl(),
    bankEndorsementCollected: new NgcFormControl(),
    bankEndorsement: new NgcFormControl(),
    isTruckdocksAvailableForAgent: new NgcFormControl(),
    receivingPartyIdentificationNumber: new NgcFormControl(),
    receivingPartyCompanyName: new NgcFormControl(null, [Validators.maxLength(35)]),
    receivingPartyName: new NgcFormControl(),
    authorizedSignature: new NgcFormControl(),
    authroizedPerson: new NgcFormControl(false),
    paymentStatus: new NgcFormControl(),
    onHoldShipment: new NgcFormControl(),
    airportPassValidation: new NgcFormControl(),
    invChargeableWeight: new NgcFormControl(),
    hawbnumber: new NgcFormControl(),


    hawbInfo: new NgcFormGroup({
      hawbnumber: new NgcFormControl(),
      hawbOrigin: new NgcFormControl(),
      hawbDestination: new NgcFormControl(),
      hawbPieces: new NgcFormControl(),
      hawbWeight: new NgcFormControl(),
      hawbChargeableWeight: new NgcFormControl(),
      hawbNatureOfGoodsDescription: new NgcFormControl(),
      hawbDeliveredPieces: new NgcFormControl(),
      hawbDeliveredWeight: new NgcFormControl(),
      hawbShc: new NgcFormControl(),
      consigneeName: new NgcFormControl(),
      appointedAgent: new NgcFormControl(),
      blackListed: new NgcFormControl(),
      notifyParty: new NgcFormControl(),
      paymentStatus: new NgcFormControl(),
      hawbCustomerId: new NgcFormControl()

    }),


    inventory: new NgcFormArray([
      new NgcFormGroup(
        {
          house: new NgcFormArray([])
        }
      )
    ]),

    customsInfo: new NgcFormArray([
      new NgcFormGroup({
        customsFreightIn: new NgcFormControl(),
        customsFreightDate: new NgcFormControl(),
        customsImportFlightNumber: new NgcFormControl(),
        customsImportDocumentNumber: new NgcFormControl(),
        customsClearanceNumber: new NgcFormControl()
      })
    ]),

    localAuthority: new NgcFormGroup({
      type: new NgcFormControl(),
      localAuthorityDetail: new NgcFormArray([
        new NgcFormGroup({
          referenceNumber: new NgcFormControl(),
          appointedAgent: new NgcFormControl(),
          appointedAgentName: new NgcFormControl(),
          license: new NgcFormControl(null, [Validators.maxLength(25)]),
          remarks: new NgcFormControl(null, [Validators.maxLength(65)]),
        })
      ])

    }),
    totalDeliveryPieces: new NgcFormControl()
  });
  @ViewChild('duplicateNamePopup') duplicateNamePopup: DuplicatenamepopupComponent;
  ngOnInit() {
    this.hawbHandling = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling);

    super.ngOnInit();
    this.shipmentType1 = "AWB"
    this.issuePoForm.get(['localAuthority', 'type']).setValue('IA');
    this.permitToFollowFlag = true;
    this.issuePoForm.get(['localAuthority', 'type']).valueChanges.subscribe(
      (newValue) => {
        if (newValue) {
          if (newValue === 'EC') {
            this.issuePoForm.get(['localAuthority', 'localAuthorityDetail']).patchValue([{
              referenceNumber: null,
              license: null,
              remarks: null,
            }]);
            this.permitNumberFlag = false;
            this.excemptionCodeFlag = true;
            this.permitToFollowFlag = false;
          }
          if (newValue === 'PN') {
            this.issuePoForm.get(['localAuthority', 'localAuthorityDetail']).patchValue([{
              referenceNumber: null,
              license: null,
              remarks: null,
            }]);
            this.permitNumberFlag = true;
            this.excemptionCodeFlag = false;
            this.permitToFollowFlag = false;
          }
          if (newValue === 'IA') {
            this.issuePoForm.get(['localAuthority', 'localAuthorityDetail']).patchValue([{
              referenceNumber: null,
              appointedAgent: null,
              license: null,
              remarks: null,
            }]);
            // this.showLicenseRemarksFlag = false;
            this.permitNumberFlag = false;
            this.permitToFollowFlag = true;
            this.excemptionCodeFlag = false;
          }
        }
      }
    );
    this.trackInventoryChanges();
    this.navigateData = this.getNavigateData(this.activatedRoute)

    if (this.navigateData != null) {
      if (this.navigateData.paymentSuccessfulFlag == true) {
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
          this.hawbSourceParameters = this.createSourceParameter(this.navigateData.shipmentNumber);

          this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
            if (data != null && data.length > 0) {
              this.handledByMasterHouse = true;
              this.form.get('hawbnumber').setValidators([Validators.required, Validators.maxLength(16)]);
              this.retrieveLOVRecords("HWBNUMBER", this.hawbSourceParameters).subscribe(data => {
                console.log(data[0].code);
                if (data != null && data.length == 1) {
                  this.form.get('hawbnumber').setValue(data[0].code);
                }

              })

            } else {
              this.handledByMasterHouse = false;
              this.form.get('hawbnumber').clearValidators();
            }
          },
          );
        }

        this.importService.onSaveIssuePo(this.navigateData.data).subscribe(response => {
          const resp = response.data;
          this.refreshFormMessages(response);
          if (!this.showResponseErrorMessages(response)) {
            this.showSuccessStatus('g.completed.successfully');

            if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Dlv_POClientPrint)) {
              const reportParameters: any = {};

              reportParameters.ImpDeliveryRequestId = response.data.id;

              reportParameters.tenantAirportCode = NgcUtility.getTenantConfiguration().airportCode;
              reportParameters.tenantCityCode = NgcUtility.getTenantConfiguration().cityCode;
              reportParameters.Hawbflg = false;
              if (this.handledByMasterHouse) {
                reportParameters.Hawbflg = true;
              }
              this.reportParameters = reportParameters;
              this.issuePoReport.open();
            }



            this.issuePoForm.reset();
            this.showTable = false;
            this.disableClear = true;
          }
        }, error => {
          this.showErrorStatus(error);
        });


      }
      else {

        this.importService.cancelPaymentRequest(this.navigateData.data).subscribe(response => {
          this.showSuccessStatus("po.cancelled")
        })

      }
    }

  }
  ngAfterViewInit() {
    super.ngAfterViewInit()

    this.issuePoForm.get(['localAuthority', 'type']).valueChanges.subscribe(
      (newValue) => {
        if (newValue) {
          if (newValue === 'EC') {
            this.issuePoForm.get(['localAuthority', 'localAuthorityDetail']).patchValue([{
              referenceNumber: null,
              appointedAgent: this.clearingAgent,
              license: null,
              remarks: null,
            }]);
            this.permitNumberFlag = false;
            this.excemptionCodeFlag = true;
            this.permitToFollowFlag = false;
          }
          if (newValue === 'PN') {
            this.issuePoForm.get(['localAuthority', 'localAuthorityDetail']).patchValue([{
              referenceNumber: null,
              appointedAgent: this.clearingAgent,
              license: null,
              remarks: null,
            }]);
            this.permitNumberFlag = true;
            this.excemptionCodeFlag = false;
            this.permitToFollowFlag = false;
          }
          if (newValue === 'IA') {
            this.issuePoForm.get(['localAuthority', 'localAuthorityDetail']).patchValue([{
              referenceNumber: null,
              appointedAgent: null,
              license: null,
              remarks: null,
            }]);
            // this.showLicenseRemarksFlag = false;
            this.permitNumberFlag = false;
            this.permitToFollowFlag = true;
            this.excemptionCodeFlag = false;
          }
        }
      }
    );

  }  /**
   * Track Inventory Changes
   */
  private trackInventoryChanges() {
    const inventoryArray: NgcFormArray = this.issuePoForm.get('inventory') as NgcFormArray;
    //
    if (inventoryArray) {
      inventoryArray.valueChanges.subscribe(() => {
        let totalDeliveryPieces: number = 0;
        //
        inventoryArray.controls.forEach((inventoryGroup: NgcFormGroup) => {
          const selectFlag: boolean = inventoryGroup.get('checkBoxValue').value;
          const pieces: number = inventoryGroup.get('pieces').value;
          //
          if (selectFlag) {
            totalDeliveryPieces += (pieces ? pieces : 0);
          }
        });
        this.issuePoForm.get('totalDeliveryPieces').setValue(totalDeliveryPieces);
      });
    }
  }


  onSearch() {

    this.poClientPrint = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Dlv_POClientPrint);
    if (this.form.invalid) {
      return;
    }
    const requestData = this.form.getRawValue();

    if (this.sign) {
      this.sign.deleted = true;
    }
    if (this.upload) {
      this.upload.entityKey = null;
    }
    this.showRemarks = false;

    this.importService.getShipmemtInfo(requestData).subscribe(response => {
      const resp = response.data;

      if (resp != null) {
        this.shc = resp.shc;
        this.responseBankEndorsement = resp.bankEndorsementCollected
        this.dataToPatch1 = resp.bankEndorsementCollected
        if (resp.bankEndorsementCollected === false) {
          this.showBankEndorsement = false
        }
      }
      this.refreshFormMessages(response);
      if (!this.showResponseErrorMessages(response)) {
        if (resp) {
          this.issuePoForm.patchValue(resp);
          resp.inventory.forEach((element, i) => {
            if (element.reason == null) {
              this.issuePoForm.get(['inventory', i, 'checkBoxValue']).patchValue(true);
            }

          });

          this.showTable = true;
        } else {
          this.showTable = false;
        }
        if (resp.svc === '0') {
          this.issuePoForm.get('svc').setValue('N');
        }
        else {
          resp.svc = 'Y'
        }
        let i = 0;
        for (const eachRow of resp.inventory) {
          if (eachRow.onHold || eachRow.ready) {
            this.issuePoForm.get(['inventory', i, 'checkBoxValue']).disable();
          }
          ++i;
        }


        this.clearingAgent = resp.customerId

      }
    }, error => {
      this.showErrorStatus(error);
    });


  }

  public afterFocus() {
    if (!this.showTable) {
      this.async(() => {
        try {
          this.firstField.focus();
        } catch (e) { }
      }, 100);
    }
  }
  private onShipmentSelect(event) {

    this.showTable = false;
    if (event.shipmentType) {
      this.form.get('shipmentType').patchValue(event.shipmentType);
    }
    this.handledByMasterHouse = false;
    this.form.get('hawbnumber').patchValue("");
    this.form.get('hawbnumber').clearValidators();
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
      this.hawbSourceParameters = this.createSourceParameter(this.form.get('shipmentNumber').value);

      this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
        if (data != null && data.length > 0) {
          this.handledByMasterHouse = true;
          this.form.get('hawbnumber').setValidators([Validators.required, Validators.maxLength(16)]);
          this.retrieveLOVRecords("HWBNUMBER", this.hawbSourceParameters).subscribe(data => {
            console.log(data[0].code);
            if (data != null && data.length == 1) {
              this.form.get('hawbnumber').setValue(data[0].code);
            }

          })

        } else {
          this.handledByMasterHouse = false;
          this.form.get('hawbnumber').clearValidators();
        }
      },
      );
    }
  }
  onSave() {
    this.issuePoSaveRequest = this.issuePoForm.getRawValue();
    if (this.issuePoSaveRequest.localAuthority.type === 'IA') {
      this.issuePoSaveRequest.localAuthority.localAuthorityDetail[0].appointedAgent = this.appointedAgentValue
      this.issuePoSaveRequest.localAuthority.localAuthorityDetail[0].appointedAgentCode = this.appointedAgentCode
      this.issuePoSaveRequest.localAuthority.localAuthorityDetail[0].appointedAgentName = this.appointedAgentName

    }

    if (this.issuePoSaveRequest.blackListed == 'Y') {
      this.showErrorStatus('AGTBLOCKLISTED')
      return;
    }
    if (!NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Dlv_LocalAuthorityInfoRequiredAtDelivery)) {
      if (this.issuePoSaveRequest.hawbInfo != null && this.issuePoSaveRequest.hawbInfo.appointedAgent == null && this.handledByMasterHouse) {
        this.showErrorMessage("import.no.appointed.agent");
        return;
      }
    }

    if ((null == this.issuePoSaveRequest.receivingPartyIdentificationNumber)
      || !this.issuePoForm.get('receivingPartyIdentificationNumber').valid) {
      return;
    }

    if ((null == this.issuePoSaveRequest.receivingPartyName)
      || this.issuePoSaveRequest.receivingPartyName.length < 4) {
      this.showErrorMessage("ERROR_IC_NAME_CHR");
      return;
    }
    if (this.showRemarks === true) {
      if (this.issuePoForm.get('authorizedRemarks').value == null || this.issuePoForm.get('authorizedRemarks').value.length == 0) {
        if (!this.isValidName) {
          this.showErrorMessage("please.enter.remarks.not.authorized");
        }
        else {
          this.showErrorMessage("please.enter.remarks");
        }
        return;
      }
    }
    if (this.issuePoSaveRequest.receivingPartyIdentificationNumber != null && this.issuePoSaveRequest.receivingPartyName != null) {
      this.importService.checkForBlackListCustomer(this.issuePoSaveRequest).subscribe(response => {
        if (response.success === false) {
          if (response.messageList.length > 0) {
            var icName: string[] = [];
            icName.push(this.issuePoSaveRequest.receivingPartyIdentificationNumber);
            icName.push(this.issuePoSaveRequest.receivingPartyName);
            var error = NgcUtility.translateMessage(response.messageList[0].code, icName);
            this.showErrorStatus(error + " " + response.messageList[0].message);
            return;
          }
        }

        if (!this.showResponseErrorMessages(response)) {
          this.importService.checkPaymentStatus(this.issuePoSaveRequest).subscribe(response => {
            const resp = response.data;


            if (!this.showResponseErrorMessages(response)) {
              this.id = resp.id
              if (resp.paymentStatus === 'Charges are Pending') {
                this.showConfirmMessage(NgcUtility.translateMessage("import.confirm104", [NgcUtility.getTenantConfiguration().format.currencySymbol, resp.pendingAmount])).then(fulfilled => {
                  var dataToSend = {
                    shipment: resp.shipmentNumber,
                    hawbNumber: resp.hawbnumber,
                    shipmentHouseId: resp.shipmentHouseId,
                    poFlag: true,
                    poChargeCode: resp.chargeCode,
                    poNumber: resp.deliveryRequestOrderNo,
                    data: resp
                  }
                  this.navigateTo(this.router, '/billing/collectPayment/enquireCharges', dataToSend);//
                }
                ).catch(reason => {
                  this.issuePoSaveRequest.id = this.id
                  this.importService.cancelPaymentRequest(this.issuePoSaveRequest).subscribe(response => {
                  })
                });
              }
              else {
                if (this.issuePoSaveRequest.blackListed == 'N') {
                  this.importService.onSaveIssuePo(resp).subscribe(response => {
                    const resp = response.data;
                    this.refreshFormMessages(response);
                    if (!this.showResponseErrorMessages(response)) {
                      this.showSuccessStatus('g.completed.successfully');

                      if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Dlv_POClientPrint)) {
                        const reportParameters: any = {};

                        reportParameters.ImpDeliveryRequestId = response.data.id;

                        reportParameters.Hawbflg = false;
                        if (this.handledByMasterHouse) {
                          reportParameters.Hawbflg = true;
                        }
                        reportParameters.airPortcode = NgcUtility.getTenantConfiguration().airportCode;
                        this.reportParameters = reportParameters;
                        this.issuePoReport.open();
                      }

                      this.issuePoForm.reset();
                      this.showTable = false;
                      this.appointedAgentValue = null;
                      this.appointedAgentCode = null;
                      this.appointedAgentName = null;
                      this.clearingAgent = null;
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
      });
    }
  }

  onAddPermitNumber(index) {
    (<NgcFormArray>this.issuePoForm.get('localAuthority.localAuthorityDetail')).addValue([
      {
        referenceNumber: ''
      }
    ]);

  }

  onDeletePermitNumberRows(index) {
    (<NgcFormArray>this.issuePoForm.get('localAuthority.localAuthorityDetail')).deleteValueAt(index);
  }






  onSelectCheckbox(event: any, index) {
    let sumData = 0;
    if (this.issuePoForm.get(['locationDetailsList', index, 'checkBoxValue']).value) {
      sumData = this.issuePoForm.get(['locationDetailsList', index, 'pieces']).value;
      this.dataToPatch = sumData;
    }
  }

  onSelectClearingAgent(event, index) {
    this.clearingAgentParam = event.param1;
    this.clearingAgent = null;
  }

  onRemarks() {
    this.patchData();
    this.navigateTo(this.router, '/awbmgmt/maintainremarks', this.patchDataValue);
  }

  onPayment() {
    this.patchData();
    this.navigateTo(this.router, '/billing/collectPayment/enquireCharges',
      {
        awbNumber: this.issuePoForm.get('shipmentNumber').value,
        hawbNumber: this.issuePoForm.get('hawbnumber').value,
      }
    );
  }
  onShipmentInfo() {
    this.patchData();
    this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', this.patchDataValue);
  }

  onSelectShipmentInfoForHAWBHandling() {
    var dataToSend = {
      shipmentNumber: this.form.get('shipmentNumber').value,
      hawbNumber: this.form.get('hawbnumber').value,
    }

    // if handled by master
    if (this.handledByMasterHouse == false) {
      this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', dataToSend);
    }
    else {
      // if handled by hosue
      this.navigateTo(this.router, 'awbmgmt/maintainhousemaster', dataToSend)
    }
  }

  onShipmentLocation() {
    this.patchData();
    this.navigateTo(this.router, 'awbmgmt/shipmentLocation', this.patchDataValue);
  }

  onAwbDocument() {
    this.patchData();
    this.navigateTo(this.router, 'awbmgmt/awbdocument', { "shipmentNumber": this.issuePoForm.get('shipmentNumber').value, "shipmentType": this.issuePoForm.get('shipmentType').value });
    // this.navigateTo(this.router, 'awbmgmt/awbdocument', { "documentVerification": { "shipmentNumber": this.patchDataValue.shipmentNumber } });
  }

  onAddService() {
    this.patchData();
    this.navigateTo(this.router, '/billing/createServiceRequest', this.patchDataValue);

  }

  patchData() {
    this.patchDataValue = {
      shipmentNumber: this.issuePoForm.get('shipmentNumber').value,
      hawbNumber: this.issuePoForm.get('hawbnumber').value
    }
  }

  public onCancel(event) {
    this.navigateBack(this.issuePoForm.getRawValue());
  }

  validateAirportPass(event) {
    this.validNamesUponValidate.length = 0;
    this.isValidName = false;
    this.showRemarks = false;
    if (!this.issuePoForm.get('receivingPartyIdentificationNumber').value) {
      this.showFormControlErrorMessage(<NgcFormControl>this.issuePoForm.get('receivingPartyIdentificationNumber'), 'g.mandatory');
      return;
    }
    if (!this.issuePoForm.get('receivingPartyIdentificationNumber').valid) {
      return;
    }

    if (this.appointedAgentValue == null) {
      this.request = {
        receivingPartyIdentificationNumber: this.issuePoForm.get('receivingPartyIdentificationNumber').value,
        customerId: this.issuePoForm.get('customerId').value,
        shipmentNumber: this.issuePoForm.get('shipmentNumber').value,
        shipmentDate: this.issuePoForm.get('shipmentDate').value
      }
    }
    else {
      this.request = {
        receivingPartyIdentificationNumber: this.issuePoForm.get('receivingPartyIdentificationNumber').value,
        customerId: this.appointedAgentValue,
        shipmentNumber: this.issuePoForm.get('shipmentNumber').value,
        shipmentDate: this.issuePoForm.get('shipmentDate').value
      }
    }
    this.importService.validatePOAirportPass(this.request).subscribe(response => {
      const resp = response.data
      if (resp === null) {
        this.showConfirmMessage('contractor.is.not.recognized'
        ).then(fulfilled => {
          this.showRemarks = true;
          (this.issuePoForm.get('receivingPartyName') as NgcFormControl).focus();
          this.issuePoForm.get('airportPassValidation').setValue('Fail (N)');
          this.resetAuthorizedPersonDetail();
        }
        ).catch(reason => {
          this.showRemarks = false;
          this.issuePoForm.get('airportPassValidation').setValue('Fail (N)');
          (this.issuePoForm.get('receivingPartyIdentificationNumber') as NgcFormControl).focus();
          this.resetAuthorizedPersonDetail();
        });
      }
      else {
        if (resp.authorizedPersonDetailList == null || resp.authorizedPersonDetailList.length == 0) {
          this.showConfirmMessage('contractor.is.not.recognized'
          ).then(fulfilled => {
            this.showRemarks = true
            this.issuePoForm.get('airportPassValidation').setValue('Fail (N)');
            (this.issuePoForm.get('receivingPartyName') as NgcFormControl).focus();
            this.resetAuthorizedPersonDetail();
          }
          ).catch(reason => {
            this.showRemarks = false;
            this.issuePoForm.get('airportPassValidation').setValue('Fail (N)');
            (this.issuePoForm.get('receivingPartyIdentificationNumber') as NgcFormControl).focus();
            this.resetAuthorizedPersonDetail();
          });
        }
        else if (resp.authorizedPersonDetailList.length == 1) {
          this.issuePoForm.get('receivingPartyName').setValue(resp.authorizedPersonDetailList[0].authorizedPersonnelName);
          (this.issuePoForm.get('receivingPartyIdentificationNumber') as NgcFormControl).focus();
          this.issuePoForm.get('receivingPartyCompanyName').setValue(resp.authorizedPersonDetailList[0].customerShortName);
          this.issuePoForm.get('airportPassValidation').setValue('Pass (Y)');
          this.validNamesUponValidate.push(resp.authorizedPersonDetailList[0].authorizedPersonnelName);
          this.isValidName = true;
          if (resp.authorizedPersonDetailList[0].authorizedSignature != null) {
            this.isSignature = true
            this.issuePoForm.get('authorizedSignature').setValue(resp.authorizedPersonDetailList[0].authorizedSignature);
          }
        }
        else {
          resp.authorizedPersonDetailList.forEach(authorizedPerson => {
            this.validNamesUponValidate.push(authorizedPerson.authorizedPersonnelName);
          });
          this.isValidName = true;
          this.duplicateNamePopup.open(resp.authorizedPersonDetailList);
        }
      }

    }, error => {
      this.showErrorStatus(error);
    });

  }
  house(event) {
    this.houses.open()
    const dataToPatch = this.issuePoForm.getRawValue()
  }

  onChangeValue(item) {
    this.param1 = this.createSourceParameter(item.parameter1, item.parameter2);
  }

  fetchICSLocation() {
    let selectedShipments: string[] = [];
    let inventoryList = this.issuePoForm.getRawValue().inventory;
    inventoryList.forEach(record => {
      if (record.checkBoxValue === true) {
        selectedShipments.push(record.shipmentLocation);
      }
    })
    if (selectedShipments.length === 0) {
      this.showErrorStatus('imp.err116');
      return;
    } else {
      this.clearErrorList();
      let requestModel = {
        containerId: []
      }
      selectedShipments.forEach(selectedRecord => {
        requestModel.containerId.push(selectedRecord);
      })

      this.importService.getICSLocationByShipmentLocation(requestModel).subscribe(response => {
        console.log(response);
        if (response !== null) {
          if (response['status'] === 'Success') {
            const inventoryArray: NgcFormArray = this.issuePoForm.get('inventory') as NgcFormArray;
            for (let inventory = 0; inventory < inventoryArray.length; inventory++) {
              for (let container = 0; container < response['containerInfo'].length; container++) {
                if (inventoryArray.getRawValue()[inventory].shipmentLocation === response['containerInfo'][container].containerId) {
                  this.issuePoForm.get(['inventory', inventory, 'exitDate']).setValue(response['containerInfo'][container].exitDate);
                  this.issuePoForm.get(['inventory', inventory, 'exitTime']).setValue(response['containerInfo'][container].exitTime);
                  this.issuePoForm.get(['inventory', inventory, 'pchLocation']).setValue(response['containerInfo'][container].location);
                }
                if (response['errorNumber'] === '404') {
                  this.issuePoForm.get(['inventory', inventory, 'pchLocation']).setValue('ICS failure – retrieve Manually')
                }
                if (this.shc == 'VAL') {
                  this.issuePoForm.get(['inventory', inventory, 'pchLocation']).setValue('VAL SHIPMENT');
                }
                if (this.shc == 'VUN') {
                  this.issuePoForm.get(['inventory', inventory, 'pchLocation']).setValue('VUN SHIPMENT');
                }
              }
            }
            console.log(inventoryArray.getRawValue());
          }
          if (response['status'] === 'Fail') {
            this.showErrorStatus('imp.err117');
          }

        }
      }, error => {
        this.showErrorStatus(error);
      });
    }
  }

  onChangeIA(event) {
    const requestData = {
      referenceNumber: event.controls.referenceNumber.value
    }
    if (event.controls.referenceNumber.value != null) {
      this.importService.validateIANumber(requestData).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          const resp = response.data
          if (resp == null) {
            this.showConfirmMessage('ia.number.not.matched'
            ).then(fulfilled => {
            }
            ).catch(reason => {

            });
            // this.appointedAgent = true;
            // this.expireAppointedAgent = false;
            this.issuePoForm.controls.localAuthority.get(['localAuthorityDetail', 0, 'appointedAgent']).patchValue('');
            this.appointedAgentValue = null
          }

          // if (resp) {
          //   this.appointedAgent = true;
          //   this.expireAppointedAgent = false;
          // }
          // this.appointedAgentValue = null
          this.issuePoForm.controls.localAuthority.get(['localAuthorityDetail', 0, 'appointedAgent']).patchValue(resp.appointedAgent);
          this.appointedAgentCode = resp.appointedAgent;
          this.appointedAgentName = resp.appointedAgentName;
          this.appointedAgentValue = resp.id;

        }

      })
    }
  }
  shipmentOnHold() {
    var dataToSend = {
      shipmentNumber: this.issuePoForm.get('shipmentNumber').value,
      hwbNumber: this.issuePoForm.get('hawbnumber').value
    }
    this.navigateTo(this.router, '/awbmgmt/shipmentonhold', dataToSend)
  }
  onConfirmNewEntry(boolean) {
    this.issuePoForm.get('airportPassValidation').setValue('Pass (N)');
    (this.issuePoForm.get('receivingPartyName') as NgcFormControl).focus();
    this.showRemarks = true;
    this.resetAuthorizedPersonDetail();
  }

  onNameSelect(selectedName) {
    this.issuePoForm.get('receivingPartyName').setValue(selectedName.authorizedPersonnelName);
    (this.issuePoForm.get('receivingPartyIdentificationNumber') as NgcFormControl).focus();
    this.issuePoForm.get('receivingPartyCompanyName').setValue(selectedName.customerShortName);
    this.issuePoForm.get('airportPassValidation').setValue('Pass (Y)');
    if (selectedName.authorizedSignature != null) {
      this.isSignature = true
      this.issuePoForm.get('authorizedSignature').setValue(selectedName.authorizedSignature);
    }
  }
  resetAuthorizedPersonDetail() {
    this.issuePoForm.get('receivingPartyName').reset();
    this.issuePoForm.get('authorizedSignature').reset();
    this.issuePoForm.get('receivingPartyCompanyName').setValue("");
    this.issuePoForm.get('authroizedPerson').reset();
    this.showRemarks = false;
    this.validNamesUponValidate.length = 0;
    this.issuePoForm.get('authorizedRemarks').reset();
  }
  onChangeIC(event) {
    this.issuePoForm.get('airportPassValidation').setValue('Pass (N)');
    this.resetAuthorizedPersonDetail();
  }
  private onHawbSelect(event) {
    this.showTable = false;
  }

  onChangeName(event) {
    this.isValidName = this.validNamesUponValidate.includes(event.target.value.toUpperCase()) ? true : false;
    if (event.target.value != "" && !this.isValidName) {
      this.showRemarks = true;
    }
    else {
      this.showRemarks = false;
    }
  }
}


