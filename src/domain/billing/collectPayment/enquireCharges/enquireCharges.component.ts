
import { filter } from 'rxjs/operators';
import { HouseInformationModel } from './../../../export/export.sharedmodel';
import { Router, ActivatedRoute } from '@angular/router';
import { CollectPaymentService } from '../collectPayment.service';
import { NgcFormControl } from 'ngc-framework';
import { Validators } from '@angular/forms';
import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcReportComponent, DateTimeKey,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcInputComponent, PageConfiguration
} from 'ngc-framework';
import { ApplicationEntities } from '../../../common/applicationentities';
import { AwbManagementService } from '../../../awbManagement/awbManagement.service';
import { AdviceSHC } from '../../../export/export.sharedmodel';
import { isNull } from 'util';
import { ApplicationFeatures } from '../../../common/applicationfeatures';
import { Console } from 'console';
import { a } from '@angular/core/src/render3';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { forEach } from '@angular/router/src/utils/collection';
import { BillingService } from '../../billing.service';

@Component({
  selector: 'app-enquireCharges',
  templateUrl: './enquireCharges.component.html',
  styleUrls: ['./enquireCharges.component.scss']
})

@PageConfiguration({
  trackInit: true
})

export class EnquireChargesComponent extends NgcPage {
  handledbyHouse: boolean = false;
  showCheckBox: boolean = false;
  colspanLength: any = 13;
  showMoreFlag: boolean = true;
  waivedStatusApproved: boolean = false;
  searchElementsFlag: boolean = false;
  addFlag: boolean = false;
  totalAmount: any = 0;
  amountToCollect: any = 0;
  roundOffDelta: any = 0;
  roundUptoLeastCount: any = 0;
  totalAmt: any = 0;
  totalAmountTotal: any = 0;
  taxAmountTotal: any = 0;
  customer: any;
  data: any = {};
  waiveTotal: any = 0;
  amountTotal: any = 0;
  paidTotal: any = 0;
  waiverPendingFlag: boolean = false;
  hidePayCharges: boolean = false;
  screenShipmentFlag: boolean = true;
  checked: boolean = false;
  tenderedAmount: number;
  paymentStatus: boolean;
  counter: number;
  customerInfoIndex: any;
  chargeAdviceIndex: any;
  payeeAGTCNE: any = '';
  payeeCustomerId: any;
  payeeChanged: boolean = false;
  invoicedToCustomerId: any = null;
  //flag to show charge amount or amount based on feature.
  showChargeAmount: boolean = false;
  pureAgent: any = null;
  reportParameters: any;
  displayChargesByShipment: boolean = false;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private collectPaymentService: CollectPaymentService,
    private awbManagementService: AwbManagementService, private billingService: BillingService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }
  @ViewChild('selectionWindow') selectWindow: NgcWindowComponent;
  @ViewChild('pdchangesAccount') pdchangesAccount: NgcWindowComponent;
  @ViewChild('reportWindow')
  private reportWindow: NgcReportComponent;
  @ViewChild('reportWindow1')
  private reportWindow1: NgcReportComponent;
  @ViewChild('reportWindow2')
  private reportWindow2: NgcReportComponent;
  customerSelectionFlag: boolean = false;

  private enquireChargesForm: NgcFormGroup = new NgcFormGroup({
    requiredAuthorizationDetails: new NgcFormControl(false),
    changePayee: new NgcFormControl(),
    changePayeeName: new NgcFormControl(),
    changePayeeCode: new NgcFormControl(),
    changePdAccount: new NgcFormControl(),
    changePdBalance: new NgcFormControl(),
    changePaymentAccountId: new NgcFormControl(),
    changeCustomerId: new NgcFormControl(),
    domIntl: new NgcFormControl(),
    cavFob: new NgcFormControl(),
    duty: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    awbPiece: new NgcFormControl(),
    awbWeight: new NgcFormControl(),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    shpcne: new NgcFormControl(),
    agent: new NgcFormControl(),
    pureAgent: new NgcFormControl(),
    payee: new NgcFormControl(),
    payeename: new NgcFormControl(),
    pdAccount: new NgcFormControl(),
    payeeInformation: new NgcFormGroup({
      payeeCustomerType: new NgcFormControl(),
      payeeCustomerName: new NgcFormControl(),
      paymentAccountNumber: new NgcFormControl(),
      paymentAccountBalance: new NgcFormControl()
    }),
    pdBalance: new NgcFormControl(),
    sbnumber: new NgcFormControl(),
    chargeableWeight: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    shipmentHouseId: new NgcFormControl(),
    waivedStatus: new NgcFormControl(),
    icPassNumber: new NgcFormControl(),
    receivedFrom: new NgcFormControl(),
    counter: new NgcFormControl(),
    searchModeShipment: new NgcFormControl(true),
    searchModecustomer: new NgcFormControl(),
    whsTerminalId: new NgcFormControl(),
    chargeAdvice: new NgcFormArray([]),
    changePdAccountArray: new NgcFormArray([]),
    paymentDetails: new NgcFormArray([
      new NgcFormGroup({
        requiredReferenceNo: new NgcFormControl(false),
        mode: new NgcFormControl(''),
        date: new NgcFormControl(NgcUtility.getCurrentDateOnly()),
        issuingBank: new NgcFormControl(),
        transactionNumber: new NgcFormControl(''),
        tenderedAmount: new NgcFormControl(''),
        paymentStatus: new NgcFormControl('Processed'),
        paymentRemarks: new NgcFormControl(''),
      })
    ]),


    shipmentType: new NgcFormControl(),
    shipment: new NgcFormControl(),
    service: new NgcFormControl(),
    customer: new NgcFormControl(),
    customerName: new NgcFormControl(),
    altCustomerId: new NgcFormControl(),
    additionalReferenceNumber: new NgcFormControl(),
    codeName: new NgcFormControl(),
    customerId: new NgcFormControl(),
    paymentStatus: new NgcFormControl('Pending'),
    transactionDateFrom: new NgcFormControl(),
    transactionDateTo: new NgcFormControl(),
    shc: new NgcFormControl(),
    handlingArea: new NgcFormControl(),
    exportImportFlag: new NgcFormControl(),
    customerInfo: new NgcFormArray([
      new NgcFormGroup({
        checkCustomer: new NgcFormControl(),  //To maintain checkbox value against customer for Make Payment
        collectCustomer: new NgcFormControl(),  //To store true if there is any fully Pending, Collect charge against the customer(for Change Customer functionality)
        customerName: new NgcFormControl(),
        chargeAdvice: new NgcFormArray([])
      })
    ]),
    shipmentInformation: new NgcFormGroup({
      shipmentType: new NgcFormControl(),
      cavFob: new NgcFormControl(),
      duty: new NgcFormControl(),
      shipment: new NgcFormControl(),
      awbNumber: new NgcFormControl(),
      origin: new NgcFormControl(),
      destination: new NgcFormControl(),
      pieces: new NgcFormControl(),
      weight: new NgcFormControl(),
      chargeableWgt: new NgcFormControl(),
      shpcne: new NgcFormControl(),
      agent: new NgcFormControl(),
      pureAgent: new NgcFormControl(),
      payee: new NgcFormControl(),
      payeeName: new NgcFormControl(),
      pdAccount: new NgcFormControl(),
      pdBalance: new NgcFormControl(),
      sbNumber: new NgcFormControl(),
      chargeableWeight: new NgcFormControl(),
      houseMaster: new NgcFormControl(),
      domIntl: new NgcFormControl(),
      handlingArea: new NgcFormControl(),
      exportImportFlag: new NgcFormControl()
    }),
    houseInformation: new NgcFormGroup({
      duty: new NgcFormControl(),
      hawbNumber: new NgcFormControl(),
      shipmentHouseId: new NgcFormControl(),
      pieces: new NgcFormControl(),
      weight: new NgcFormControl(),
      chargeableWeight: new NgcFormControl(),
      shc: new NgcFormControl(),
      shpcne: new NgcFormControl(),
      agent: new NgcFormControl(),
      pureAgent: new NgcFormControl(),
      payee: new NgcFormControl(),
      payeeName: new NgcFormControl(),
      pdAccount: new NgcFormControl(),
      pdBalance: new NgcFormControl()
    }),
    totalTax: new NgcFormControl(),
    taxComp1: new NgcFormControl(),
    taxComp2: new NgcFormControl(),
    taxComp3: new NgcFormControl(),
    totalGrossAmount: new NgcFormControl(),
    roundUptoLeastCount: new NgcFormControl()
  });
  functionTitle: string = 'bil.enquireCharges'; //To switch Function Title on Change Customer and back
  resp: any = new Object();
  response: any = new Object();
  showSearch: any;
  navigateData: any;
  last: any;
  shipmentInfoFlag: boolean = false;
  shipmentInfoData: any;
  poFlag: boolean = false;
  returnRejectFlag: boolean = false;
  returnRejectData: any;
  poChargeCode: any;
  poNumber: any;
  poData: any;
  changeCustomer: boolean = false;  //Flag to store true if current state is Change Customer and false if otherwise
  alternateCustomerName: any = null;
  fractionScale: number;

  private customerIdForDrop: any;
  private customerId: any;

  ngAfterViewInit() {
    super.ngAfterViewInit();

    this.fractionScale = NgcUtility.getApplicationInternationalCurrencyDecimals();
    this.showChargeAmount = (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_WaiverApprovalNotRequired) ? true : false);
    this.showCheckBox = (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_PartialPaymentForSelectCharges) ? true : false);
    let fromDate = NgcUtility.getDateOnly(new Date());
    let toDate = NgcUtility.getDateOnly(new Date());
    toDate.setDate(fromDate.getDate() + 1);
    this.enquireChargesForm.get('transactionDateFrom').patchValue(fromDate);
    this.enquireChargesForm.get('transactionDateTo').patchValue(toDate);

    (this.enquireChargesForm.get('shipment') as NgcFormControl).focus();

    this.enquireChargesForm.get('customer').valueChanges.subscribe(value => {
      if (value) {
        this.customerSelectionFlag = true;
      } else {
        this.customerSelectionFlag = false;
      }
    })
    /*Changes for Radio Button,For Shipment Type and Customer Name */
    this.enquireChargesForm.get(['searchModeShipment']).valueChanges.subscribe(shipmentChangedValue => {
      if (shipmentChangedValue == true) {
        this.showSearch = false;
        this.changeCustomer = false;
        this.searchElementsFlag = false;
        this.functionTitle = 'bil.enquireCharges';
        this.screenShipmentFlag = true;
        this.enquireChargesForm.get(['paymentStatus']).reset();
        this.enquireChargesForm.get(['transactionDateFrom']).reset();
        this.enquireChargesForm.get(['transactionDateTo']).reset();
        this.enquireChargesForm.get(['customer']).reset();

      }
    });
    this.enquireChargesForm.get(['searchModecustomer']).valueChanges.subscribe(customerChangedValue => {
      if (customerChangedValue == true) {
        this.showSearch = false;
        this.changeCustomer = false;
        this.searchElementsFlag = false;
        this.functionTitle = 'bil.enquireCharges';
        this.screenShipmentFlag = false;
        this.enquireChargesForm.get(['codeName']).reset();
        this.enquireChargesForm.get(['additionalReferenceNumber']).reset();
        this.enquireChargesForm.get(['service']).reset();
        this.enquireChargesForm.get(['shipment']).reset();
      }
    });
    this.navigateData = this.getNavigateData(this.activatedRoute);
    if (this.navigateData) {
      if (this.navigateData.awbNumber) {
        this.enquireChargesForm.get('shipment').patchValue(this.navigateData.awbNumber);
      }
      if (this.navigateData.hawbNumber) {
        this.handledbyHouse = true;
        this.enquireChargesForm.get('hawbNumber').patchValue(this.navigateData.hawbNumber);
        this.enquireChargesForm.get('shipmentHouseId').patchValue(this.navigateData.shipmentHouseId);

      }
      if (this.navigateData.poNumber) {
        this.enquireChargesForm.get('additionalReferenceNumber').patchValue(this.navigateData.poNumber);
        this.poNumber = this.navigateData.poNumber;
        this.poData = this.navigateData.data;
      }
      if (this.navigateData.poFlag) {
        this.poFlag = true;
        this.poChargeCode = this.navigateData.poChargeCode;
      }
      if (this.navigateData.returnRejectFlag) {
        this.returnRejectFlag = true;
        this.returnRejectData = this.navigateData.data;
      }
      if (this.navigateData.shipmentInfoFlag) {
        this.shipmentInfoFlag = true;
        this.shipmentInfoData = this.navigateData.data;
      }
      if (this.navigateData.shipment) {
        this.enquireChargesForm.get('shipment').patchValue(this.navigateData.shipment);
        this.onEnquire();
      } else if (this.navigateData.service) {
        this.enquireChargesForm.get('service').patchValue(this.navigateData.service);
        this.onEnquire();
      } else if (this.navigateData.customer) {
        this.enquireChargesForm.get('customer').patchValue(this.navigateData.customer);
        this.enquireChargesForm.get('searchModecustomer').patchValue(this.navigateData.searchModecustomer);
        this.enquireChargesForm.get('paymentStatus').patchValue(this.navigateData.paymentStatus);
        this.enquireChargesForm.get('transactionDateFrom').patchValue(this.navigateData.transactionDateFrom);
        this.enquireChargesForm.get('transactionDateTo').patchValue(this.navigateData.transactionDateTo);
        this.onEnquire();
      }
      if (this.navigateData.downloadReport && this.navigateData.receiptId) {
        let reportParam: any = {};
        reportParam.PaymentReceiptId = this.navigateData.receiptId;
        reportParam.ShipmentId = 0;
        reportParam.ServiceRequestId = 0;
        reportParam.ReferenceType = '';
        reportParam.ReferenceId = 0;
        reportParam.shipmentHouseId = 0;
        reportParam.ShowPaymentRecepit = 'true';
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_TaxInvoice)) {
          this.reportWindow1.reportParameters = reportParam;
          this.reportWindow1.open();
        }
        else {
          this.reportWindow.reportParameters = reportParam;
          this.reportWindow.open();
        }
      }
    }
  }

  onInvoiceLinkClick(index, subIndex) {
    let reportParam: any = {};
    let referenceValues: any = this.enquireChargesForm.getRawValue();
    reportParam.PaymentReceiptId = 0;
    reportParam.ShipmentId = 0;
    reportParam.ServiceRequestId = 0;
    reportParam.shipmentHouseId = 0;
    reportParam.ReferenceType = referenceValues.customerInfo[index].chargeAdvice[subIndex].referenceType;
    reportParam.ReferenceId = referenceValues.customerInfo[index].chargeAdvice[subIndex].referenceId;
    reportParam.ShowPaymentRecepit = 'false';
    this.reportWindow.reportParameters = reportParam;
    this.reportWindow.open();
  }
  onEnquire() {
    this.enquireChargesForm.get('altCustomerId').reset();
    let obj = {
      shipmentType: '',
      shipment: null,
      customerId: null,
      service: null,
      additionalReferenceNumber: null,
      codeName: null,
      paymentStatus: null,
      transactionDateFrom: null,
      transactionDateTo: null,
      hawbNumber: null,
      shipmentHouseId: null
    }
    let formValue = this.enquireChargesForm.getRawValue();
    obj.additionalReferenceNumber = formValue.additionalReferenceNumber;
    obj.codeName = formValue.codeName;

    if ((formValue.shipment && formValue.service) || (formValue.shipment && formValue.customer)
      || (formValue.customer && formValue.service)) {
      this.showErrorStatus('billing.error.search');
    } else {

      if (formValue.shipment) {
        obj.shipment = formValue.shipment;
        obj.shipmentType = 'Shipment Number';
      }
      if (this.handledbyHouse) {
        if (formValue.hawbNumber) {
          obj.hawbNumber = formValue.hawbNumber;
          obj.shipmentHouseId = formValue.shipmentHouseId;
        } else {
          // this.showErrorStatus('hawb.mandatory');
          // return;
        }
      }
      if (formValue.service) {
        obj.service = formValue.service;
        obj.shipmentType = 'Service ID';
      }
      if (formValue.customer) {
        obj.customerId = formValue.customer;
        obj.shipmentType = 'Customer';
        obj.paymentStatus = formValue.paymentStatus;
        obj.transactionDateFrom = formValue.transactionDateFrom;
        obj.transactionDateTo = formValue.transactionDateTo;
      }
      this.showSearch = false;
      this.collectPaymentService.enquireCharges(obj)
        .subscribe(data => {
          //Code To Remove
          //data = this.dataToPatch;
          //
          this.colspanLength = 13;
          (<NgcFormControl>this.enquireChargesForm.get(['counter'])).reset();
          (<NgcFormControl>this.enquireChargesForm.get(['icPassNumber'])).reset();
          (<NgcFormControl>this.enquireChargesForm.get(['receivedFrom'])).reset();


          //reset pd account Change Values
          this.enquireChargesForm.get('changePayee').setValue(null);
          this.enquireChargesForm.get('changePayeeName').setValue(null);
          this.enquireChargesForm.get('changePayeeCode').setValue(null);
          this.enquireChargesForm.get('changePdAccount').setValue(null);
          this.enquireChargesForm.get('changePdBalance').setValue(null);
          this.enquireChargesForm.get('changePaymentAccountId').setValue(null);
          this.enquireChargesForm.get('changeCustomerId').setValue(null);

          this.waivedStatusApproved = false;
          this.resp = data.data;
          this.response = Object.assign({}, this.resp[0]);
          this.response.collectSum = 0;
          this.response.billSum = 0;
          this.response.paidSum = 0;
          this.response.billByAirlineSum = 0;
          this.response.totalAmount = 0;
          this.response.totalTaxAmount = 0;
          this.response.totalWaivedAmount = 0;

          let paymentDetails = new Array();
          this.enquireChargesForm.getList(['paymentDetails']).forEach((element, indexValue) => {
            if (indexValue == 0) {
              (<NgcFormControl>this.enquireChargesForm.get(['paymentDetails', 0, 'mode'])).reset();
              (<NgcFormControl>this.enquireChargesForm.get(['paymentDetails', 0, 'date'])).reset();
              (<NgcFormControl>this.enquireChargesForm.get(['paymentDetails', 0, 'issuingBank'])).reset();
              (<NgcFormControl>this.enquireChargesForm.get(['paymentDetails', 0, 'transactionNumber'])).reset();
              (<NgcFormControl>this.enquireChargesForm.get(['paymentDetails', 0, 'tenderedAmount'])).reset();
              (<NgcFormControl>this.enquireChargesForm.get(['paymentDetails', 0, 'paymentStatus'])).reset();
              (<NgcFormControl>this.enquireChargesForm.get(['paymentDetails', 0, 'paymentRemarks'])).reset();
              paymentDetails.push(this.enquireChargesForm.get(['paymentDetails', 0]).value);
            }
          })
          this.enquireChargesForm.get('paymentDetails').patchValue(paymentDetails);
          // this.dataForNavigation();
          this.resetFormMessages();
          if (!this.showResponseErrorMessages(data)) {
            this.dataForNavigation();
            this.resp.forEach(value => {
              this.response.collectSum += value.collectSum;
              this.response.billSum += value.billSum;
              this.response.paidSum += value.paidSum;
              this.response.billByAirlineSum += value.billByAirlineSum;
              this.payeeCustomerId = value.payeeCustomerId;
              if (!NgcUtility.isBlank(value.paymentDetails)) {
                this.enquireChargesForm.get(['paymentDetails']).patchValue(value.paymentDetails);
              }
              value.chargeAdvice.forEach(advice => {
                if (advice.amount && !NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_WaiverApprovalNotRequired)) {
                  this.response.totalAmount += advice.amount;
                } else if (advice.chargeAmount && NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_WaiverApprovalNotRequired)) {
                  this.response.totalAmount += advice.chargeAmount;
                }
                if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_SalesTax)) {
                  this.showMoreFlag = false;
                }
                if (advice.waivedStatus == 'APPROVED' || advice.waivedStatus == 'PENDING') {
                  this.waivedStatusApproved = true;
                  this.colspanLength = 14;

                }
                if (advice.waivedAmount) {
                  this.response.totalWaivedAmount += advice.waivedAmount;
                }
                if (this.handledbyHouse) {
                  advice.hawbNumber = this.enquireChargesForm.get('hawbNumber').value;
                }
              })
            });
            if (!NgcUtility.isBlank(this.resp[0].payeeInformation)) {
              if (!NgcUtility.isBlank(this.resp[0].payeeInformation.payeeCustomerName)) {
                this.resp[0].payeeInformation.payeeCustomerName =
                  !isNull(this.resp[0].payeeInformation.payeeCustomerType)
                    ? this.resp[0].payeeInformation.payeeCustomerName + '(' + this.resp[0].payeeInformation.payeeCustomerType + ')' : this.resp[0].payeeInformation.payeeCustomerName;
              }
            }
            this.refreshCheckboxValues('search');
            this.enquireChargesForm.get('roundUptoLeastCount').patchValue(this.resp[0].roundUptoLeastCount);
            //this.roundOffDelta = this.enquireChargesForm.get('roundUptoLeastCount').value;
            this.roundUptoLeastCount = (NgcUtility.isBlank(this.enquireChargesForm.get('roundUptoLeastCount').value) ? 0 : this.enquireChargesForm.get('roundUptoLeastCount').value);
            if (!this.enquireChargesForm.get('customer').value) {
              this.enquireChargesForm.get('shipment').patchValue(this.resp[0].shipment);
              this.enquireChargesForm.get('hawbNumber').patchValue(this.resp[0].hawbNumber);
              this.enquireChargesForm.get('shipmentHouseId').patchValue(this.resp[0].shipmentHouseId);
              if (this.resp[0].shipmentInformation) {
                this.enquireChargesForm.get('origin').patchValue(this.resp[0].shipmentInformation.origin);
                this.enquireChargesForm.get('destination').patchValue(this.resp[0].shipmentInformation.destination);
                this.enquireChargesForm.get('pieces').patchValue(this.resp[0].shipmentInformation.pieces);
                this.enquireChargesForm.get('weight').patchValue(this.resp[0].shipmentInformation.weight);
                this.enquireChargesForm.get('agent').patchValue(this.resp[0].shipmentInformation.agent);
                this.enquireChargesForm.get('domIntl').patchValue(this.resp[0].shipmentInformation.domIntl);
                this.enquireChargesForm.get('shpcne').patchValue(this.resp[0].shipmentInformation.shpcne);
                this.enquireChargesForm.get('cavFob').patchValue(this.resp[0].shipmentInformation.cavFob);
                this.enquireChargesForm.get('duty').patchValue(this.resp[0].shipmentInformation.duty);
                this.enquireChargesForm.get('pureAgent').patchValue(this.resp[0].shipmentInformation.pureAgent);
                this.enquireChargesForm.get('payee').patchValue(this.resp[0].shipmentInformation.payee);
                this.enquireChargesForm.get('payeename').patchValue(this.resp[0].shipmentInformation.payeeName);
                this.enquireChargesForm.get('pdAccount').patchValue(!isNull(this.resp[0].payeeInformation) ? this.resp[0].payeeInformation.paymentAccountNumber : this.resp[0].shipmentInformation.pdAccount)
                this.enquireChargesForm.get('pdBalance').patchValue(!isNull(this.resp[0].payeeInformation) ? this.resp[0].payeeInformation.paymentAccountBalance : this.resp[0].shipmentInformation.pdBalance);
                this.enquireChargesForm.get('chargeableWeight').patchValue(this.resp[0].shipmentInformation.chargeableWeight);
              } else {
                this.enquireChargesForm.get('pdAccount').patchValue(this.resp[0].pdAccountNumber);
                this.enquireChargesForm.get('pdBalance').patchValue(this.resp[0].pdAccountBalance);
              }
              this.enquireChargesForm.get('service').patchValue(this.resp[0].service);
              this.enquireChargesForm.get('exportImportFlag').patchValue(this.resp[0].exportImportFlag);
              this.enquireChargesForm.get('shc').patchValue(this.resp[0].shc.length ? this.resp[0].shc : null);
              this.enquireChargesForm.get('handlingArea').patchValue(this.resp[0].chargeAdvice[0].handlingArea);
              this.enquireChargesForm.get('payeeInformation').patchValue(this.resp[0].payeeInformation);
              // PATCH DATA OF AWB AND HOUSE handleByHouseFlag use

              if (this.handledbyHouse) {
                this.enquireChargesForm.get('shipmentInformation').patchValue(this.resp[0].shipmentInformation);
                this.enquireChargesForm.get('houseInformation').patchValue(this.resp[0].houseInformation);
              }
            } else {
              this.enquireChargesForm.get('pdAccount').patchValue(this.resp[0].pdAccountNumber);
              this.enquireChargesForm.get('pdBalance').patchValue(this.resp[0].pdAccountBalance);
            }
            //this.showSearch = true;
            this.searchElementsFlag = true;
            //Pay Charges Changes this.amountTotal = this.amountTotal + a.amountToPay;
            this.paidTotal = 0;
            this.totalAmountTotal = 0;
            this.payeeAGTCNE = !isNull(this.resp[0].hawbNumber) ? this.resp[0].houseInformation.payee
              : !isNull(this.resp[0].shipmentInformation)
                ? this.resp[0].shipmentInformation.payee
                : 'AGT';
            this.invoicedToCustomerId = !isNull(this.resp[0].hawbNumber) ? this.resp[0].houseInformation.invoicedToCustomerId
              : isNull(this.resp[0].hawbNumber) && !isNull(this.resp[0].shipmentInformation)
                ? this.resp[0].shipmentInformation.invoicedToCustomerId
                : null;
            this.pureAgent = !isNull(this.resp[0].hawbNumber) ? this.resp[0].houseInformation.pureAgent
              : isNull(this.resp[0].hawbNumber) && !isNull(this.resp[0].shipmentInformation)
                ? this.resp[0].shipmentInformation.pureAgent
                : 'N';
            this.taxAmountTotal = 0;
            this.waiveTotal = 0;
            this.amountTotal = 0;
            let payChargesValue = this.response.chargeAdvice;
            payChargesValue.forEach((a: any) => {
              if (a.waivedStatus == 'PENDING') {
                this.waivedStatusApproved = true;
              }
              this.waiveTotal = this.waiveTotal + a.waivedAmount;
              a.toCollect = parseFloat(a.toCollect);
              this.amountTotal = this.amountTotal + (isNaN(a.toCollect) ? 0 : a.toCollect);
              this.paidTotal = this.paidTotal + a.paid;
              this.totalAmountTotal = this.totalAmountTotal + a.amount;
              //this.taxAmountTotal = this.taxAmountTotal + a.taxAmount;
            })
            this.customer = this.createSourceParameter(!isNull(this.payeeCustomerId) ? this.payeeCustomerId : this.enquireChargesForm.get(['customerInfo', 0, 'customerId']).value, Math.random().toString());
            // this.totalAmount = this.amountTotal;
            // this.totalAmount = parseFloat(this.totalAmount);
            this.amountToCollect = this.amountTotal;
            this.amountToCollect = parseFloat(this.amountToCollect);
            this.totalAmount = (this.roundUptoLeastCount > 0 ? Math.round(this.amountToCollect /
              this.enquireChargesForm.get('roundUptoLeastCount').value) *
              this.enquireChargesForm.get('roundUptoLeastCount').value : this.amountToCollect)
            this.roundOffDelta = this.totalAmount - this.amountToCollect;
            this.enquireChargesForm.get(['paymentDetails', 0, 'tenderedAmount']).patchValue(this.totalAmount);
            // Default Date Value
            if ((<NgcFormArray>this.enquireChargesForm.get(['paymentDetails'])) && (<NgcFormArray>this.enquireChargesForm.get(['paymentDetails'])).length == 1) {
              this.enquireChargesForm.get(['paymentDetails', 0, 'date']).patchValue(NgcUtility.getCurrentDateOnly());
            }
            // Payemnt status as PROCESSED if null
            if (NgcUtility.isBlank(this.enquireChargesForm.getRawValue().paymentDetails.paymentStatus)) {
              this.enquireChargesForm.get(['paymentDetails', 0, 'paymentStatus']).patchValue('Processed');
            }
            this.retrieveDropDownListRecords('KEY_BILLING_PAYMENT_MODE', 'query').subscribe(data => {
              this.onChangeMode(data[0], 0);
            });
            this.totalAmt = this.totalAmount;
            let arrayValue = this.enquireChargesForm.getRawValue().paymentDetails;
            (<NgcFormArray>this.enquireChargesForm.controls["chargeAdvice"]).patchValue(this.response.chargeAdvice);
            for (let i = 0; i < arrayValue.length; i++) {
              this.enquireChargesForm.get(['paymentDetails', i, 'paymentStatus']).valueChanges.subscribe(a => {
                arrayValue = this.enquireChargesForm.getRawValue().paymentDetails;
                this.totalAmt = 0;
                arrayValue.forEach(b => {
                  if (!b.tenderedAmount) {
                    b.tenderedAmount = 0;
                  }
                  if (b.paymentStatus == 'Processed') {
                    this.totalAmt = this.totalAmt + b.tenderedAmount;
                  }
                });
                this.totalAmt = this.totalAmt;
                this.resetFormMessages();
                if (this.totalAmt > this.totalAmount) {
                  this.showErrorStatus('billing.error.payment');
                  this.addFlag = false;
                } else {
                  this.addFlag = true;
                }
              })
              this.enquireChargesForm.get(['paymentDetails', i, 'tenderedAmount']).valueChanges.subscribe(a => {
                arrayValue = this.enquireChargesForm.getRawValue().paymentDetails;
                this.totalAmt = 0;
                arrayValue.forEach(b => {
                  if (!b.tenderedAmount) {
                    b.tenderedAmount = 0;
                  }
                  if (b.paymentStatus == 'Processed') {
                    this.totalAmt = this.totalAmt + b.tenderedAmount;
                  }
                });
                this.totalAmt = this.totalAmt;
                this.resetFormMessages();
                if (this.totalAmt > this.totalAmount) {
                  this.showErrorStatus('billing.error.payment');
                  this.addFlag = false;
                } else {
                  this.addFlag = true;
                }
              })
            }
            this.showSearch = true;
          } else {
            this.showSearch = false;
            this.searchElementsFlag = false;
          }
          this.changeCustomer = false;
          this.functionTitle = 'bil.enquireCharges';
        }, error => {
          this.showErrorMessage(error);
        })
    }
  }

  refreshCheckboxValues(event = 'chargeUpdate') {
    this.checked = false;
    if (event == 'chargeUpdate') {
      let formValue: any = this.enquireChargesForm.getRawValue().customerInfo;
      this.resp = formValue;
    }
    this.resp.forEach((value, indexValue) => {
      value.checkCustomer = false;
      value.collectCustomer = false;
      value.paidCustomer = true;
      let billCount: number = 0;
      value.chargeAdvice.forEach(chargeRecord => {
        if (chargeRecord.paymentStatus == 'Pending') {
          // To select all fully Pending, Collect charges by default for Change Customer functionality(keeping commmented for future use)
          // if (!chargeRecord.paid) {
          //   chargeRecord.checkCharge = true;
          // }
          // if (chargeRecord.taxAmount) {
          //   chargeRecord.taxCompCode = this.taxPaymentText(chargeRecord);
          // }
          chargeRecord.checkCharge = false;
          if (chargeRecord.paymentType == 'Collect') {
            // To check customer for Make Payment, if has any Pending, Collect charges(Commented, as of now only required to pay one customer at a time)
            // value.checkCustomer = true;
            value.paidCustomer = false;
          } else if (chargeRecord.paymentType == 'Bill/Collect') {
            billCount++;
          }
          if (chargeRecord.toCollect != 0) {
            // To filter customer having unpaid(including partially paid), Pending charges
            value.collectCustomer = true;
          }

        }
        chargeRecord.creditDebitNoteNumber.forEach(element => {
          chargeRecord.receiptNumber.push(element);
        });
        chargeRecord.creditDebitNoteIdList.forEach(element => {
          chargeRecord.receiptIdList.push(element);
        });
      });
      if (value.collectCustomer && !this.checked) {
        this.checked = true;
        value.checkCustomer = true;
        this.customerInfoIndex = indexValue;
        value.chargeAdvice.forEach((a: any) => {
          a.select = true;
        });
        (<NgcFormArray>this.enquireChargesForm.controls["chargeAdvice"]).patchValue(value.chargeAdvice);
        this.response.chargeAdvice = value.chargeAdvice;
        // this.onMakePayment();
      }
      if (value.chargeAdvice.length == billCount) {
        value.checkCustomer = false;
        value.paidCustomer = true;
      }
    });
    this.enquireChargesForm.get('customerInfo').patchValue(this.resp);
  }

  filterCustomerBeforePaymentOrWaiver() {
    let navData = this.collect('filterByCustomer');
    if (navData.checkedCustomerCount > 1) {
      this.showErrorStatus('bill.selectSingleCustomer');
      return;
    } else {
      return navData;
    }
  }

  settingAdditionalDetails(navData: any) {
    if (this.poFlag || this.returnRejectFlag || this.shipmentInfoFlag) {
      let allChargeData = this.collect('filterByAllUnpaidCharges');
      if (navData.chargeAdvice.length == allChargeData.chargeAdvice.length) {
        navData.totalPaymentFlag = true;
        if (this.navigateData) {
          this.navigateData.totalPaymentFlag = true;
        }
      } else {
        navData.totalPaymentFlag = false;
      }
      if (this.poFlag) {
        navData.data = this.poData;
      } else if (this.returnRejectFlag) {
        navData.data = this.returnRejectData;
      } else if (this.shipmentInfoFlag) {
        navData.data = this.shipmentInfoData;
      }
    }
  }

  onWaiveCharges() {
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_WaiverApproveOrReject)) {
      this.waiverPendingFlag = false;
      this.checkWaiverStatus();
    }
    if (!this.waiverPendingFlag) {
      this.hidePayCharges = false;
      let navData = this.filterCustomerBeforePaymentOrWaiver();
      navData.chargeAdvice = this.response.chargeAdvice.filter(advise => advise.paymentType == 'Collect');
      if (navData.chargeAdvice.length) {
        navData.waiveFlag = true;
        navData.poFlag = this.poFlag;
        navData.returnRejectFlag = this.returnRejectFlag;
        navData.shipmentInfoFlag = this.shipmentInfoFlag;
        navData.poNumber = this.poNumber;
        navData.poChargeCode = this.poChargeCode;
        this.settingAdditionalDetails(navData);
        this.navigateTo(this.router, '/billing/collectPayment/waveCharges', navData);
      }
      else {
        this.hidePayCharges = true
        this.showErrorStatus('bill.noPendingCollectCharge');

      }
    }
  }

  onMakePayment() {
    let navData = this.filterCustomerBeforePaymentOrWaiver();
    let count = navData.chargeAdvice.filter(advice => advice.select == true).length;
    navData.chargeAdvice = navData.chargeAdvice.filter(advise => advise.paymentType == 'Collect');
    if (navData.chargeAdvice.length) {
      // navData.waiveFlag = false;
      // navData.poFlag = this.poFlag;
      // navData.returnRejectFlag = this.returnRejectFlag;
      // navData.shipmentInfoFlag = this.shipmentInfoFlag;
      // navData.poNumber = this.poNumber;
      // navData.poChargeCode = this.poChargeCode;
      // this.settingAdditionalDetails(navData);
      // this.navigateTo(this.router, '/billing/collectPayment/payCharges', navData);

      //require feature
      if (count == 0 && NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_PartialPaymentForSelectCharges)) {
        this.showErrorStatus('selectAtleastOneRecord');
      }

    } else {
      this.showErrorStatus('bill.noPendingCollectCharge');
    }
  }

  onAddService() {
    let req: any = new Object();
    let value = this.enquireChargesForm.getRawValue();
    req.customerId = value.customerId;
    req.customerName = value.customerName;
    req.shipmentNumber = value.shipment;
    this.navigateTo(this.router, '/billing/createServiceRequest', req);
  }

  collect(filterValue) {
    let data = this.enquireChargesForm.getRawValue();
    this.response.chargeAdvice = new Array();
    let checkedCustomerCount: number = 0
    data.customerInfo.forEach(customer => {
      if (customer.checkCustomer) {
        checkedCustomerCount++;
        customer.chargeAdvice.forEach((advice, chargeAdviceIndex) => {
          // Filter all checked charges for Change Customer
          if (filterValue == 'filterByCharge' && advice.checkCharge) {
            this.response.chargeAdvice.push(advice);
          }
          // Filter all unpaid(excluding partially paid), collect charges
          else if (filterValue == 'filterByUnpaidCharges' && !advice.paid) {
            this.response.chargeAdvice.push(advice);
          }
          // Filter all unpaid(including partially paid), collect charges
          else if (filterValue == 'filterByAllUnpaidCharges' && (!advice.paid || advice.paid <= advice.amount) && advice.paymentType == 'Collect') {
            this.response.chargeAdvice.push(advice);
          }
          // Filter all checked customers for Make Payment
          else if (filterValue == 'filterByCustomer' && customer.checkCustomer) {
            this.response.chargeAdvice.push(advice);
          }
          //Fetch all charges without any filter
          else if (filterValue == 'noFilter' && (isNaN(advice.toCollect) ? 0 : advice.toCollect)) {
            //TODO require feature for check box
            if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_PartialPaymentForSelectCharges)) {
              if (advice.select) {
                this.response.chargeAdvice.push(advice);
                this.chargeAdviceIndex = chargeAdviceIndex;
              }
            } else {
              this.response.chargeAdvice.push(advice);
              this.chargeAdviceIndex = chargeAdviceIndex;
            }
          }
        })
      }
    })

    data.checkedCustomerCount = checkedCustomerCount;
    data.chargeAdvice = this.response.chargeAdvice;

    data.chargeAdvice.forEach(a => {
      if (!a.paid) {
        a.paid = 0;
      }
      if (!a.waivedAmount) {
        a.waivedAmount = 0;
      }
    })
    data.chargeAdvice = data.chargeAdvice.filter(a =>
      (a.toCollect) > 0);
    data.chargeAdvice.forEach(a => {
      a['amountToPay'] = a['toCollect'];
    });
    if (!this.response.chargeSlip) {
      data.chargeSlip = null;
    }
    return data;
  }

  // taxPaymentText(advice) {
  //   return '' + (!isNull(advice.taxComp1Code) ?
  //     advice.taxComp1Code : '') + (!isNull(advice.taxComp2Code) ? ' +' +
  //       advice.taxComp2Code : '') + (!isNull(advice.taxComp3Code) ? ' +' +
  //         advice.taxComp3Code : '');
  // }

  onChange(item, index, subIndex) {
    if (item == 'Bill/Collect') {
      let bill = this.enquireChargesForm.get(['customerInfo', index, 'chargeAdvice', subIndex, 'toCollect']).value;
      this.enquireChargesForm.get(['customerInfo', index, 'chargeAdvice', subIndex, 'toBill']).patchValue(bill);
      this.enquireChargesForm.get(['customerInfo', index, 'chargeAdvice', subIndex, 'toCollect']).patchValue(null);
      this.response.collectSum -= bill;
      this.response.billSum += bill;
      let customerBillSum: number = this.enquireChargesForm.get(['customerInfo', index, 'billSum']).value;
      let customerCollectSum: number = this.enquireChargesForm.get(['customerInfo', index, 'collectSum']).value;
      this.enquireChargesForm.get(['customerInfo', index, 'billSum']).patchValue(customerBillSum + bill);
      this.enquireChargesForm.get(['customerInfo', index, 'collectSum']).patchValue(customerCollectSum - bill);
      this.refreshCheckboxValues();
      this.selectCheckCustomer(index);
    } else if (item == 'Collect') {
      //this.totalAmount = this.enquireChargesForm.get(['customerInfo', index, 'chargeAdvice', subIndex, 'amount']).value;
      //this.enquireChargesForm.get(['paymentDetails', 0, 'tenderedAmount']).patchValue(this.totalAmount);
      //this.totalAmt = this.totalAmount;
      let bill = this.enquireChargesForm.get(['customerInfo', index, 'chargeAdvice', subIndex, 'toBill']).value;
      this.enquireChargesForm.get(['customerInfo', index, 'chargeAdvice', subIndex, 'toCollect']).patchValue(bill);
      this.enquireChargesForm.get(['customerInfo', index, 'chargeAdvice', subIndex, 'toBill']).patchValue(null);
      this.response.billSum -= bill;
      this.response.collectSum += bill;
      let customerBillSum: number = this.enquireChargesForm.get(['customerInfo', index, 'billSum']).value;
      let customerCollectSum: number = this.enquireChargesForm.get(['customerInfo', index, 'collectSum']).value;
      this.enquireChargesForm.get(['customerInfo', index, 'billSum']).patchValue(customerBillSum - bill);
      this.enquireChargesForm.get(['customerInfo', index, 'collectSum']).patchValue(customerCollectSum + bill);
      this.refreshCheckboxValues();
      this.selectCheckCustomer(index);
    }
    else {
      if (item != 'calculate') {
        this.enquireChargesForm.get(['customerInfo', index, 'chargeAdvice', subIndex, 'toCollect']).patchValue(null);
        this.enquireChargesForm.get(['customerInfo', index, 'chargeAdvice', subIndex, 'toBill']).patchValue(null);
        if (this.last == 'Collect') {
          this.selectCheckCustomer(index);
          this.response.collectSum -= this.enquireChargesForm.get(['customerInfo', index, 'chargeAdvice', subIndex, 'toCollect']).value;
        } else if (this.last == 'Bill/Collect') {
          this.response.billSum -= this.enquireChargesForm.get(['customerInfo', index, 'chargeAdvice', subIndex, 'toBill']).value;
        }
      }
    }
    this.last = item;
    let amountToCollect = 0;
    this.enquireChargesForm.get(['customerInfo', index, 'chargeAdvice']).value.forEach(charge => {
      if (charge.toCollect) {
        amountToCollect = amountToCollect + (isNaN(charge.toCollect) ? 0 : charge.toCollect);
      }
      //charge.checkCustomer = true;
    });
    // this.totalAmount = amountToCollect;
    this.amountToCollect = amountToCollect;
    this.amountToCollect = parseFloat(this.amountToCollect);
    this.totalAmount = (this.roundUptoLeastCount > 0 ? Math.round(this.amountToCollect /
      this.enquireChargesForm.get('roundUptoLeastCount').value) *
      this.enquireChargesForm.get('roundUptoLeastCount').value : this.amountToCollect)
    this.roundOffDelta = this.totalAmount - this.amountToCollect;
    this.enquireChargesForm.get(['paymentDetails', 0, 'tenderedAmount']).patchValue(this.totalAmount);
    this.totalAmt = this.totalAmount;
  }
  onSave() {
    if (!this.changeCustomer) {
      this.enquireChargesForm.validate();
      if (this.enquireChargesForm.get('icPassNumber').value && this.enquireChargesForm.get('icPassNumber').invalid) {
        return;
      }
      else if (this.enquireChargesForm.get('receivedFrom').value && this.enquireChargesForm.get('receivedFrom').invalid) {
        return;
      }
      else if (!this.enquireChargesForm.valid) {
        this.showErrorMessage("billing.error.mandatory.fields");
        return;
      }
      else {

      }
    }
    let request: any;
    let errorFlag: boolean = false;
    if (this.changeCustomer) {
      // If in Change Customer mode, check for Alternate Customer value(mandatory)
      if (!this.enquireChargesForm.get('altCustomerId').value) {
        this.showFormControlErrorMessage(<NgcFormControl>this.enquireChargesForm.get('altCustomerId'), 'g.mandatory');
        errorFlag = true;
      }
      request = this.collect('filterByCharge');
      if (!request.chargeAdvice.filter(advise => advise.checkCharge).length) {
        // If in Change Customer mode, validation for selecting atleast on checkbox
        this.showErrorMessage('bill.noChangeCustomerCharge');
        errorFlag = true;
      }
      request.chargeAdvice.forEach(charge => {
        charge.alternateCustomerName = this.alternateCustomerName;
      });
      if (errorFlag) {
        return;
      }
      this.collectPaymentService.saveEnquireCharges(request)
        .subscribe(data => {
          if (!this.showResponseErrorMessages(data)) {
            this.showSuccessStatus('billing.sucess.charges');
            this.enquireChargesForm.get('altCustomerId').setValidators([]);
            this.onEnquire();
          }
        }, error => {
          this.showErrorMessage(error);
        });
    } else {
      if (this.enquireChargesForm.get('altCustomerId').value) {
        this.enquireChargesForm.get('altCustomerId').reset();
      }
      request = this.collect('noFilter');

      // Pay Charges Starts Here
      this.onMakePayment();
      if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_WaiverApproveOrReject)) {
        this.waiverPendingFlag = false;
        this.checkWaiverStatus();
      }
      if (!this.waiverPendingFlag) {
        let length = this.enquireChargesForm.get('paymentDetails').value.length;
        if (length) {
          let data = this.enquireChargesForm.getRawValue();
          let mode = data.paymentDetails[length - 1].mode;
          let bank = data.paymentDetails[length - 1].issuingBank;
          let date = data.paymentDetails[length - 1].date;
          let transaction = data.paymentDetails[length - 1].transactionNumber;
          let amt = data.paymentDetails[length - 1].tenderedAmount;

          if (Number(this.totalAmount.toFixed(this.fractionScale)) < Number(this.totalAmt.toFixed(this.fractionScale))) {
            this.showErrorStatus('billing.error.totalpayment');

          } else if (Number(this.totalAmount.toFixed(this.fractionScale)) > Number(this.totalAmt.toFixed(this.fractionScale))) {
            this.showErrorStatus('billing.error.totalpayment');
          } else {
            let chargeAdviceArray = [];
            const payData = this.collect('noFilter');
            payData.amountToBeCollect = this.amountToCollect;
            payData.roundOffDelta = this.roundOffDelta;
            payData.paymentTotal = this.totalAmount;
            payData.waivedTotal = this.waiveTotal;
            payData.customerId = payData.changeCustomerId ? payData.changeCustomerId : payData.chargeAdvice[0].customerId;
            payData.invoicedToCustomerId = this.invoicedToCustomerId;
            payData.pureAgent = this.pureAgent;
            payData.waiveFlag = false;
            payData.taxComp1 = 0;
            payData.taxComp2 = 0;
            payData.taxComp3 = 0;
            payData.totalTax = 0;
            payData.totalGrossAmount = 0;
            payData.paymentDetails = this.enquireChargesForm.getRawValue().paymentDetails;
            //calculate grossToPay,taxToPay
            payData.chargeAdvice.forEach((a, index) => {
              payData.totalGrossAmount += a['toPayGrossAmount'];
              payData.totalTax += a['toPayTaxAmount'];
              payData.taxComp1 += a['toPayTaxComp1'];
              payData.taxComp2 += a['toPayTaxComp2'];
              payData.taxComp3 += a['toPayTaxComp3'];
              if (a.paymentType == 'Collect' && a.paymentStatus != 'Paid') {
                chargeAdviceArray.push(a);
              }
            });
            payData.chargeAdvice = chargeAdviceArray;
            payData.payeeAGTCNE = this.payeeAGTCNE;
            payData.payeeCustomerId = !isNull(this.enquireChargesForm.get('changeCustomerId').value) && this.payeeChanged
              ? this.enquireChargesForm.get('changeCustomerId').value
              : !isNull(this.payeeCustomerId) ? this.payeeCustomerId : payData.customerId;
            payData.pdAccount = !isNull(payData.payeeInformation.paymentAccountNumber) ? payData.payeeInformation.paymentAccountNumber : payData.pdAccount;
            payData.pdBalance = !isNull(payData.payeeInformation.paymentAccountBalance) ? payData.payeeInformation.paymentAccountBalance : payData.pdBalance;
            payData.paymentDetails[0].payee = this.payeeAGTCNE;
            this.collectPaymentService.savePayCharges(payData).subscribe(a => {
              if (!this.showResponseErrorMessages(a)) {
                this.showSuccessStatus('billing.sucess.payment');
                this.data.receiptId = a.data.receiptId;
                let poData: any = new Object();
                if (this.navigateData && this.navigateData.poFlag) {
                  poData.shipmentNumber = this.navigateData.shipment;
                  poData.chargeCode = this.navigateData.poChargeCode;
                  poData.data = this.navigateData.data;
                  let allChargeData = this.collect('filterByAllUnpaidCharges');
                  if (payData.chargeAdvice.length == allChargeData.chargeAdvice.length) {
                    payData.totalPaymentFlag = true;
                    if (this.navigateData) {
                      this.navigateData.totalPaymentFlag = true;
                    }
                  }
                  if (this.navigateData && this.navigateData.totalPaymentFlag) {
                    poData.paymentSuccessfulFlag = true;
                    this.navigateTo(this.router, '/import/issuepo', poData);
                  } else {
                    poData.paymentSuccessfulFlag = false;
                    this.onEnquire();
                    this.openReport();
                  }
                } else if (this.navigateData && this.navigateData.returnRejectFlag) {
                  poData.shipmentNumber = this.navigateData.shipment;
                  poData.data = this.navigateData.data;
                  if (this.navigateData && this.navigateData.totalPaymentFlag) {
                    poData.paymentSuccessfulFlag = true;
                    this.navigateTo(this.router, '/export/acceptance/rejectshipment', poData);
                  } else {
                    poData.paymentSuccessfulFlag = false;
                    this.onEnquire();
                    this.openReport();
                  }
                } else if (this.navigateData && this.navigateData.returnAWBWeighing) {
                  var dataToSendToAcceptanceWeighing = {
                    returnAWBWeighing: this.navigateData.returnAWBWeighing && this.navigateData ? this.navigateData.returnAWBWeighing : null,
                    acceptanceType: this.response.domIntl,
                    shipmentNumber: this.enquireChargesForm.get('shipment').value,
                    shipmentType: this.enquireChargesForm.get('shipmentType').value
                  }
                  this.navigateTo(this.router, 'export/acceptance/acceptanceweighing', dataToSendToAcceptanceWeighing);
                } else if (this.navigateData && (this.navigateData.returnAWBSummary || this.navigateData.cancelHouseSummary)) {
                  if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_ReportPopupOnNavigation)) {
                    this.onEnquire();
                    this.openReport();
                  } else {
                    const dataToSendToAcceptanceWeighing = {
                      cancelHouseSummary: this.navigateData.cancelHouseSummary && this.navigateData ? this.navigateData.cancelHouseSummary : null,
                      returnAWBSummary: this.navigateData.returnAWBSummary && this.navigateData ? this.navigateData.returnAWBSummary : null,
                      acceptanceType: this.response.domIntl,
                      shipmentNumber: this.enquireChargesForm.get('shipment').value,
                      shipmentType: this.enquireChargesForm.get('shipmentType').value
                    }
                    this.navigateTo(this.router, 'export/acceptance/acceptancesummarybyhouse', dataToSendToAcceptanceWeighing);
                  }
                } else {
                  this.onEnquire();
                  this.openReport();
                }
              }
            }, error => {
              this.showErrorMessage(error);
            });
          }
        }
      }
    }
  }
  onCancel() {
    if (this.changeCustomer) {
      this.enquireChargesForm.get('altCustomerId').reset();
      this.changeCustomer = false;
      this.calculateAmountTotals('noFilter');
      this.functionTitle = 'bil.enquireCharges';
    } else {
      let navData: any = new Object();
      navData.paymentSuccessfulFlag = false;
      if (this.poFlag) {
        navData.shipmentNumber = this.navigateData.shipment;
        navData.chargeCode = this.poChargeCode;
        navData.data = this.navigateData.data;
        this.navigateTo(this.router, '/import/issuepo', navData);
      } else if (this.returnRejectFlag) {
        navData.shipmentNumber = this.navigateData.shipment;
        navData.data = this.navigateData.data;
        this.navigateTo(this.router, '/export/acceptance/rejectshipment', navData);
      } else if (this.shipmentInfoFlag) {
        navData = this.navigateData.data;
        this.navigateTo(this.router, '/awbmgmt/shipmentinfoCR', navData);
      } else {
        this.navigateBack(this.navigateData);
      }
    }
  }

  generateChargeSlipReport(item, index, subIndex, subsubIndex) {
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_TaxInvoice)) {
      if (this.resp[index].chargeAdvice[subIndex].receiptNumber[subsubIndex].substring(0, 2) == 'PR') {
        let reportParam: any = {};
        reportParam.PaymentReceiptId = parseFloat(this.resp[index].chargeAdvice[subIndex].receiptIdList[subsubIndex]);
        reportParam.ShipmentId = (this.resp[index].chargeAdvice[subIndex].referenceType == 'Shipment' ? this.resp[index].chargeAdvice[subIndex].referenceId : 0);
        reportParam.ServiceRequestId = 0;
        reportParam.ReferenceType = (NgcUtility.isBlank(this.resp[index].chargeAdvice[subIndex].referenceType) ? this.resp[index].chargeSlip[subIndex].referenceType : this.resp[index].chargeAdvice[subIndex].referenceType);
        reportParam.ReferenceId = this.resp[index].chargeAdvice[subIndex].referenceId;
        if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
          reportParam.shipmentHouseId = this.resp[index].chargeAdvice[subIndex].shipmentHouseId;
        }
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_SalesTax)) {
          reportParam.pureAgent = (!NgcUtility.isBlank(this.resp[index].houseInformation) ? this.resp[index].houseInformation.pureAgent : !NgcUtility.isBlank(this.resp[index].shipmentInformation) ? this.resp[index].shipmentInformation.pureAgent : 'N');
        }
        reportParam.ShowPaymentRecepit = 'true';
        reportParam.Screen = "COLLECT_PAYMENT";
        reportParam.customerType = (this.resp[index].exportImportFlag == 'IMPORT' ? 'CNE' : 'AGT');
        reportParam.loginuser = this.getUserProfile().userShortName;
        this.reportWindow1.reportParameters = reportParam;
        this.reportWindow1.open();
      } else {

        this.reportParameters = new Object();
        this.reportParameters.creditDebitnoteScreen = true;
        this.reportParameters.documentNumber = this.resp[index].chargeAdvice[subIndex].receiptNumber[subsubIndex];
        this.reportParameters.paymentReceiptId = parseFloat(this.resp[index].chargeAdvice[subIndex].receiptIdList[subsubIndex]);
        this.reportParameters.ShipmentId = (this.resp[index].chargeAdvice[subIndex].referenceType == 'Shipment' ? this.resp[index].chargeAdvice[subIndex].referenceId : 0);
        this.reportParameters.HouseId = this.resp[index].chargeAdvice[subIndex].shipmentHouseId;
        this.reportParameters.customerType = (this.resp[index].exportImportFlag == 'IMPORT' ? 'CNE' : 'AGT');
        this.reportWindow2.reportParameters = this.reportParameters;
        this.reportWindow2.open();
      }
    }
    else {
      let reportParam: any = {};
      reportParam.PaymentReceiptId = parseFloat(this.resp[index].chargeAdvice[subIndex].receiptIdList[subsubIndex]);
      reportParam.ShipmentId = 0;
      reportParam.ServiceRequestId = 0;
      reportParam.ReferenceType = '';
      reportParam.ReferenceId = 0;
      reportParam.ShowPaymentRecepit = 'true';
      this.reportWindow.reportParameters = reportParam;
      this.reportWindow.open();
    }
  }

  /**
 *
 *called when custumer code selected
 * @param {any} event
 * @memberof 
 */
  onClickCustomer(event) {
    this.showSearch = false;
    this.searchElementsFlag = false;
    this.customerIdForDrop = event.code;
    this.customerId = this.createSourceParameter(
      event.code
    );
  }

  /**
    *
    *called when custumer code selected
    * @param {any} event
    * @memberof 
    */
  onClickService(event) {
    if (this.customerIdForDrop == null) {
      this.showFormErrorMessages("billing.error.select.customer");
    }
  }

  //Change back to initial state of Collect Payment function
  onClear() {
    this.showSearch = false;
    this.changeCustomer = false;
    this.searchElementsFlag = false;
    this.handledbyHouse = false;
    this.functionTitle = 'bil.enquireCharges';
    this.enquireChargesForm.reset();
    this.enquireChargesForm.get('searchModeShipment').patchValue(true);
    this.enquireChargesForm.get('searchModecustomer').patchValue(false);
    (this.enquireChargesForm.get('shipment') as NgcFormControl).focus();
    this.resetFormMessages();
  }

  //Called from Change Customer button, changes function title, and filters charges to show(Unpaid, Collect)
  onChangeCustomer() {
    this.resetFormMessages();
    this.calculateAmountTotals('filterByUnpaidCharges');
    if (this.response.chargeAdvice && this.response.chargeAdvice.length) {
      this.functionTitle = 'bill.changeCustomer';
      this.changeCustomer = true;
      this.enquireChargesForm.get('altCustomerId').setValidators(Validators.required);
    } else {
      this.showErrorMessage('billing.error.pending');
    }
  }

  // To calculate Amount total while switching between Change Customer mode and Collect Payment mode
  calculateAmountTotals(filterValue) {
    this.collect(filterValue);
    this.response.totalAmount = 0;
    this.response.chargeAdvice.forEach(value => {
      if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_WaiverApprovalNotRequired)) {
        this.response.totalAmount += value.chargeAmount;
      } else {
        this.response.totalAmount += value.amount;
      }
    });
  }

  //Manual updation of Shipment charges
  onChargeUpdate() {
    let request: any = new Object();
    let importExport = this.enquireChargesForm.get('exportImportFlag').value;
    if (importExport == 'EXPORT' || importExport == 'IMPORT') {
      request.processType = importExport;
    }

    request.shipmentNumber = this.enquireChargesForm.get('shipment').value;
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable) && this.enquireChargesForm.get('hawbNumber').value) {
      request.houseNumber = this.enquireChargesForm.get('hawbNumber').value;
    }
    request.userCode = this.getUserProfile().userLoginCode;
    request.handlingTerminal = this.getUserProfile().terminalId;
    request.manualUpdateFlag = true;
    this.collectPaymentService.updateCharges(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.onEnquire();
        this.showSuccessStatus('billing.sucess.charge.updated')
      }
    })
  }

  onAlternateCustomerSelect(item) {
    this.alternateCustomerName = item.deckFlag;
  }
  /*  */
  setAWBNumber(object) {
    this.showSearch = false;
    this.searchElementsFlag = false;
    if (object.code == null) {
      this.showErrorStatus('hawb.invalid');
    }
    else {
      this.resetFormMessages();
      this.enquireChargesForm.get('hawbNumber').setValue(object.code);
      this.enquireChargesForm.get('shipmentHouseId').setValue(object.param2);
    }
  }

  /*  */
  onTabOutCheckHandledBy() {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      let search = {
        shipmentNumber: this.enquireChargesForm.get('shipment').value,
        shipment: this.enquireChargesForm.get('shipment').value,
        shipmentType: this.enquireChargesForm.get('shipmentType').value,
        appFeatures: null
      }
      if (this.showSearch) {
        this.enquireChargesForm.get('hawbNumber').setValue(null);
        this.enquireChargesForm.get('shipmentHouseId').setValue(null);
      }
      this.billingService.checkHandledByOrAccpByHouse(search).subscribe(data => {
        this.handledbyHouse = false;
        if (!this.showResponseErrorMessages(data)) {
          if (data) {
            this.handledbyHouse = true;
            this.async(() => {
              try {
                (this.enquireChargesForm.get('hawbNumber') as NgcFormControl).focus();
              } catch (e) { }
            });
          }
        }
      })
    }
  }

  dataForNavigation() {
    this.response.origin = this.resp[0] &&
      this.resp[0].shipmentInformation && this.resp[0].shipmentInformation.origin ? this.resp[0].shipmentInformation.origin : this.resp.origin;
    this.response.destination = this.resp[0] &&
      this.resp[0].shipmentInformation && this.resp[0].shipmentInformation.destination ? this.resp[0].shipmentInformation.destination : this.resp.destination;
    this.response.pieces = this.resp[0] &&
      this.resp[0].shipmentInformation && this.resp[0].shipmentInformation.pieces ? this.resp[0].shipmentInformation.pieces : this.resp.pieces;
    this.response.weight = this.resp[0] &&
      this.resp[0].shipmentInformation && this.resp[0].shipmentInformation.weight ? this.resp[0].shipmentInformation.weight : this.resp.weight;
    this.response.agent = this.resp[0] &&
      this.resp[0].shipmentInformation && this.resp[0].shipmentInformation.agent ? this.resp[0].shipmentInformation.agent : this.resp.agent;
    this.response.domIntl = this.resp[0] &&
      this.resp[0].shipmentInformation && this.resp[0].shipmentInformation.domIntl ? this.resp[0].shipmentInformation.domIntl : this.resp.domIntl;
    this.response.shpcne = this.resp[0] &&
      this.resp[0].shipmentInformation && this.resp[0].shipmentInformation.shpcne ? this.resp[0].shipmentInformation.shpcne : this.resp.shpcne;
    this.response.cavFob = this.resp[0] &&
      this.resp[0].shipmentInformation && this.resp[0].shipmentInformation.cavFob ? this.resp[0].shipmentInformation.cavFob : this.resp.cavFob;
    this.response.duty = this.resp[0] &&
      this.resp[0].shipmentInformation && this.resp[0].shipmentInformation.duty ? this.resp[0].shipmentInformation.duty : this.resp.duty;
    this.response.pureAgent = this.resp[0] &&
      this.resp[0].shipmentInformation && this.resp[0].shipmentInformation.pureAgent ? this.resp[0].shipmentInformation.pureAgent : this.resp.pureAgent;
    this.response.payee = this.resp[0] &&
      this.resp[0].shipmentInformation && this.resp[0].payeeInformation && this.resp[0].payeeInformation.payeeCustomerType ? this.resp[0].payeeInformation.payeeCustomerType : this.resp.payee;
    this.response.payeeCustomerCode = this.resp[0] &&
      this.resp[0].shipmentInformation && this.resp[0].payeeInformation && this.resp[0].payeeInformation.payeeCustomerCode ? this.resp[0].payeeInformation.payeeCustomerCode : this.resp.shpcne;
    if (!this.enquireChargesForm.get('customer').value) {
      this.response.pdAccount = this.resp[0].payeeInformation && !isNull(this.resp[0].payeeInformation.paymentAccountNumber) ? this.resp[0].payeeInformation.paymentAccountNumber : this.resp[0].pdAccountNumber;
      this.response.pdBalance = this.resp[0].payeeInformation && !isNull(this.resp[0].payeeInformation.paymentAccountBalance) ? this.resp[0].payeeInformation.paymentAccountBalance : this.resp[0].pdAccountBalance;
    } else {
      this.response.pdAccount = this.resp[0].pdAccountNumber;
      this.response.pdBalance = this.resp[0].pdAccountBalance;
    }
    this.response.shipmentHouseId = this.resp[0] &&
      this.resp[0].shipmentInformation && this.resp[0].shipmentInformation.shipmentHouseId ? this.resp[0].shipmentInformation.shipmentHouseId : this.resp.shipmentHouseId;
  }
  showMore(event) {
    this.showMoreFlag = !event;
    if (this.showMoreFlag) {
      this.colspanLength = 18;
      if (this.handledbyHouse) {
        this.colspanLength += 1;
      }
      if (this.waivedStatusApproved) {
        this.colspanLength += 1;
      }
    } else {
      this.colspanLength = 13;
      if (this.waivedStatusApproved) {
        this.colspanLength += 1;
      }
    }
  }

  showSearchItems(value) {
    this.searchElementsFlag = !value;
  }

  onCounterSelect(item) {
    this.enquireChargesForm.get('whsTerminalId').patchValue(item.numericCode);
  }

  addRow() {
    (<NgcFormArray>this.enquireChargesForm.get('paymentDetails')).addValue([
      {
        mode: '',
        issuingBank: '',
        transactionNumber: '',
        date: '',
        tenderedAmount: null,
        paymentStatus: 'Processed',
        paymentRemarks: '',
      }
    ])
    let arrayValue = this.enquireChargesForm.getRawValue().paymentDetails;
    for (let i = 0; i < arrayValue.length; i++) {
      this.enquireChargesForm.get(['paymentDetails', i, 'paymentStatus']).valueChanges.subscribe(a => {
        arrayValue = this.enquireChargesForm.getRawValue().paymentDetails;
        this.totalAmt = 0;
        arrayValue.forEach(b => {
          if (!b.tenderedAmount) {
            b.tenderedAmount = 0;
          }
          if (b.paymentStatus == 'Processed') {
            this.totalAmt = this.totalAmt + b.tenderedAmount;
          }
        });
        this.totalAmt = this.totalAmt;
        this.resetFormMessages();
        if (this.totalAmt > this.totalAmount) {
          this.showErrorStatus('billing.error.payment');
          this.addFlag = false;
        } else {
          this.addFlag = true;
        }
      })
      this.enquireChargesForm.get(['paymentDetails', i, 'tenderedAmount']).valueChanges.subscribe(a => {
        arrayValue = this.enquireChargesForm.getRawValue().paymentDetails;
        this.totalAmt = 0;
        arrayValue.forEach(b => {
          if (!b.tenderedAmount) {
            b.tenderedAmount = 0;
          }
          if (b.paymentStatus == 'Processed') {
            this.totalAmt = this.totalAmt + b.tenderedAmount;
          }
        });
        this.totalAmt = this.totalAmt;
        this.resetFormMessages();
        if (this.totalAmt > this.totalAmount) {
          this.showErrorStatus('billing.error.payment');
          this.addFlag = false;
        }
      });
    }
  }

  onPayDelete(item, index) {
    let paymentRecord: any = this.enquireChargesForm.getRawValue().paymentDetails[index];
    if (!paymentRecord.tenderedAmount) {
      paymentRecord.tenderedAmount = 0;
    }
    if (paymentRecord.paymentStatus == 'Processed') {
      let tendered: any = parseFloat(paymentRecord.tenderedAmount);
      this.totalAmt = this.totalAmt - tendered;
      this.totalAmt = this.totalAmt
    }
    (<NgcFormArray>this.enquireChargesForm.get('paymentDetails')).deleteValueAt(index);
  }

  ngOnInit() {
    super.ngOnInit();
    this.enquireChargesForm.get('icPassNumber').valueChanges.subscribe(newValue => {
      this.enquireChargesForm.get('receivedFrom').reset();
      if (this.enquireChargesForm.get('icPassNumber').valid) {
        let reqObj: any = new Object();
        reqObj.customerId = this.enquireChargesForm.get(['chargeAdvice', 0, 'customerId']).value;
        reqObj.icPassNumber = this.enquireChargesForm.get('icPassNumber').value;
        this.collectPaymentService.getAuthorizedPersonnelInfo(reqObj).subscribe(response => {
          if (!this.showResponseErrorMessages(response)) {
            if (response.data == null || response.data == '') {
              this.showConfirmMessage('personnel.not.registered'
              ).then(fulfilled => {
                this.enquireChargesForm.get('receivedFrom').reset();
                (this.enquireChargesForm.get('receivedFrom') as NgcFormControl).focus();
              }
              ).catch(reason => {
                this.enquireChargesForm.get('receivedFrom').reset();
                (this.enquireChargesForm.get('icPassNumber') as NgcFormControl).focus();
              });
            } else {
              this.enquireChargesForm.get('receivedFrom').patchValue(response.data);
            }
          }
        })
      } else {
        return;
      }
    })
  }

  /*  This method used to check if waiver is pending then show error to user for AISATS */
  checkWaiverStatus() {
    let data = this.enquireChargesForm.getRawValue();
    data.chargeAdvice.forEach(element => {
      if (element.waivedStatus == 'PENDING') {
        this.waiverPendingFlag = true;
      }
    });

    if (this.waiverPendingFlag) {
      this.showErrorStatus('billing.waiver.approval');
    }

  }

  onCheckCustomer(subitem, subIndex) {
    this.paidTotal = 0;
    this.totalAmountTotal = 0;
    this.taxAmountTotal = 0;
    this.waiveTotal = 0;
    this.amountTotal = 0;
    let payChargesValue = subitem.value.chargeAdvice;
    payChargesValue.forEach((a: any, index) => {
      if (a.waivedStatus == 'PENDING') {
        this.waivedStatusApproved = true;
      }
      // let collectCharge = subIndex.value.chargeAdvice;
      // collectCharge.forEach(element => {
      //   if (element.toCollect > 0) {
      //     this.changeCustomer = true;
      //   }
      // });
      this.waiveTotal = this.waiveTotal + a.waivedAmount;
      a.toCollect = parseFloat(a.toCollect);
      this.amountTotal = this.amountTotal + (isNaN(a.toCollect) ? 0 : a.toCollect);
      this.paidTotal = this.paidTotal + a.paid;
      this.totalAmountTotal = this.totalAmountTotal + a.amount;

      if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_PartialPaymentForSelectCharges)) {
        this.enquireChargesForm.get(['customerInfo', subIndex, 'chargeAdvice', index, 'select']).setValue(true);
      }
      //this.taxAmountTotal = this.taxAmountTotal + a.taxAmount;
    })
    this.customer = this.createSourceParameter(this.enquireChargesForm.get(['customerInfo', 0, 'customerId']).value);
    // this.totalAmount = this.amountTotal;
    // this.totalAmount = parseFloat(this.totalAmount);
    this.amountToCollect = this.amountTotal;
    this.amountToCollect = parseFloat(this.amountToCollect);
    this.totalAmount = (this.roundUptoLeastCount > 0 ? Math.round(this.amountToCollect /
      this.enquireChargesForm.get('roundUptoLeastCount').value) *
      this.enquireChargesForm.get('roundUptoLeastCount').value : this.amountToCollect);
    this.roundOffDelta = this.totalAmount - this.amountToCollect;
    this.enquireChargesForm.get(['paymentDetails', 0, 'tenderedAmount']).patchValue(this.totalAmount);
    this.totalAmt = this.totalAmount;
    let arrayValue = this.enquireChargesForm.getRawValue().paymentDetails;
    (<NgcFormArray>this.enquireChargesForm.controls["chargeAdvice"]).patchValue(subitem.value.chargeAdvice);
    for (let i = 0; i < arrayValue.length; i++) {
      this.enquireChargesForm.get(['paymentDetails', i, 'paymentStatus']).valueChanges.subscribe(a => {
        arrayValue = this.enquireChargesForm.getRawValue().paymentDetails;
        this.totalAmt = 0;
        arrayValue.forEach(b => {
          if (!b.tenderedAmount) {
            b.tenderedAmount = 0;
          }
          if (b.paymentStatus == 'Processed') {
            this.totalAmt = this.totalAmt + b.tenderedAmount;
          }
        });
        this.totalAmt = this.totalAmt;
      });
    }
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_PartialPaymentForSelectCharges)) {
      this.enquireChargesForm.getList(['customerInfo']).forEach((element, indexValue) => {
        if (subIndex != indexValue) {
          this.resetCheckBox(indexValue);
        }
      })
    }
  }

  //ADDED FOR PD ACCOUNT CHANGES
  editPDAccount() {
    (<NgcFormControl>this.enquireChargesForm.get('changePayee')).setValidators([Validators.required]);
    (<NgcFormControl>this.enquireChargesForm.get('changePdAccount')).setValidators([Validators.required]);
    this.pdchangesAccount.open();
  }

  setPDAccount(event) {
    if (this.enquireChargesForm.get('changePayee').value == 'CNE') {
      this.payeeAGTCNE = 'CNE';
    } else {
      this.payeeAGTCNE = 'AGT';
    }
    let request = this.resp[0];
    if (this.resp[0].payeeInformation.payeeCustomerId != event.param2) {
      request.customerId = event.param2;
      request.payeeAGTCNE = this.payeeAGTCNE;
      request.shipmentNumber = this.enquireChargesForm.get('shipment').value;
      request.shipment = this.enquireChargesForm.get('shipment').value;
      request.hawbNumber = this.enquireChargesForm.get('hawbNumber').value;
      request.shipmentId = this.resp[0].shipmentInformation.shipmentId;
      request.shipmentHouseId = !isNull(this.resp[0].houseInformation) ? this.resp[0].houseInformation.shipmentHouseId : null;
      this.billingService.updateCustomerForChangePDAccount(request).subscribe(result => {
        this.refreshFormMessages(result);
        if (!this.showResponseErrorMessages(result)) {
          this.enquireChargesForm.get('changePdAccount').patchValue(event.code);
          this.enquireChargesForm.get('changePdBalance').patchValue(event.desc);
          this.enquireChargesForm.get('changePaymentAccountId').patchValue(event.param1);
          this.onPayChangesSave();
          this.onEnquire();
        }
      })
    } else {
      this.enquireChargesForm.get('changePdAccount').patchValue(event.code);
      this.enquireChargesForm.get('changePdBalance').patchValue(event.desc);
      this.enquireChargesForm.get('changePaymentAccountId').patchValue(event.param1);
      this.onPayChangesSave();
    }

  }

  onPayChangesSave() {
    if (!this.enquireChargesForm.get('changePdAccount').value &&
      !this.enquireChargesForm.get('changePdBalance').value) {
      return;
    }

    this.enquireChargesForm.get(['payeeInformation', 'paymentAccountNumber']).setValue(this.enquireChargesForm.get('changePdAccount').value);
    this.enquireChargesForm.get(['payeeInformation', 'paymentAccountBalance']).setValue(this.enquireChargesForm.get('changePdBalance').value);
    this.enquireChargesForm.get(['payeeInformation', 'payeeCustomerType']).setValue(this.enquireChargesForm.get('changePayee').value);
    this.enquireChargesForm.get(['payeeInformation', 'payeeCustomerName']).setValue(this.enquireChargesForm.get('changePayeeName').value);
    this.response.payee = this.enquireChargesForm.get('changePayee').value;
    this.response.payeeCustomerCode = this.enquireChargesForm.get('changePayeeCode').value;
    this.response.pdAccount = this.enquireChargesForm.get('changePdAccount').value;
    this.response.pdBalance = this.enquireChargesForm.get('changePdBalance').value;


    (<NgcFormControl>this.enquireChargesForm.get('changePayee')).setValidators([]);
    (<NgcFormControl>this.enquireChargesForm.get('changePdAccount')).setValidators([]);
    this.payeeChanged = true;
    this.pdchangesAccount.close();
  }

  onPayChangesCancel() {
    (<NgcFormControl>this.enquireChargesForm.get('changePdAccount')).setValue(null);
    (<NgcFormControl>this.enquireChargesForm.get('changePdBalance')).setValue(null);
    (<NgcFormControl>this.enquireChargesForm.get('changePayee')).setValue(null);
    (<NgcFormControl>this.enquireChargesForm.get('changePayeeCode')).setValue(null);
    (<NgcFormControl>this.enquireChargesForm.get('changePayeeName')).setValue(null);
    (<NgcFormControl>this.enquireChargesForm.get('changePaymentAccountId')).setValue(null);
    (<NgcFormControl>this.enquireChargesForm.get('changePayee')).setValidators([]);
    (<NgcFormControl>this.enquireChargesForm.get('changePdAccount')).setValidators([]);
    (<NgcFormArray>this.enquireChargesForm.get(['changePdAccountArray'])).patchValue([]);
    this.pdchangesAccount.close();

  }
  openReport() {
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_TaxInvoice)) {
      const param = this.enquireChargesForm.getRawValue();
      let reportParam: any = {};
      reportParam.PaymentReceiptId = parseFloat(this.data.receiptId);
      reportParam.ShipmentId = (param.customerInfo[this.customerInfoIndex].chargeAdvice[this.chargeAdviceIndex].referenceType == 'Shipment' ? param.customerInfo[this.customerInfoIndex].chargeAdvice[this.chargeAdviceIndex].referenceId : 0);
      reportParam.ServiceRequestId = 0;
      reportParam.ReferenceType = (NgcUtility.isBlank(param.customerInfo[this.customerInfoIndex].chargeAdvice[this.chargeAdviceIndex].referenceType) ? param.customerInfo[this.customerInfoIndex].chargeAdvice[this.chargeAdviceIndex].referenceType : param.customerInfo[this.customerInfoIndex].chargeAdvice[this.chargeAdviceIndex].referenceType);
      reportParam.ReferenceId = param.customerInfo[this.customerInfoIndex].chargeAdvice[this.chargeAdviceIndex].referenceId;
      if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
        reportParam.shipmentHouseId = param.customerInfo[this.customerInfoIndex].chargeAdvice[this.chargeAdviceIndex].shipmentHouseId;
      }
      if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_SalesTax)) {
        reportParam.pureAgent = ((NgcUtility.isBlank(param.houseInformation) && this.handledbyHouse) ? param.houseInformation.pureAgent : param.pureAgent);
      }
      reportParam.ShowPaymentRecepit = 'true';
      reportParam.Screen = "COLLECT_PAYMENT";
      reportParam.customerType = (param.exportImportFlag == 'IMPORT' ? 'CNE' : 'AGT');
      reportParam.loginuser = this.getUserProfile().userShortName;
      this.reportWindow1.reportParameters = reportParam;
      this.reportWindow1.open();
    }
    else {
      const param = this.enquireChargesForm.getRawValue();
      let reportParam: any = {};
      reportParam.PaymentReceiptId = parseFloat(this.data.receiptId);
      reportParam.ShipmentId = 0;
      reportParam.ServiceRequestId = 0;
      reportParam.ReferenceType = '';
      reportParam.ReferenceId = 0;
      reportParam.ShowPaymentRecepit = 'true';
      this.reportWindow.reportParameters = reportParam;
      this.reportWindow.open();
    }
  }

  onSelectPayee(event) {
    this.enquireChargesForm.get('changePayeeCode').patchValue(event.parameter3);
    this.enquireChargesForm.get('changePayeeName').patchValue(event.parameter1);
    this.enquireChargesForm.get('changeCustomerId').patchValue(event.parameter2);
    this.enquireChargesForm.get('changePdAccount').patchValue(null);
    this.enquireChargesForm.get('changePdBalance').patchValue(null);
    (<NgcFormArray>this.enquireChargesForm.get(['changePdAccountArray'])).patchValue([]);
    this.retrieveLOVRecords("KEY_PD_ACCOUNT_LIST", { 'parameter1': this.enquireChargesForm.get('changeCustomerId').value }).subscribe(record => {
      this.enquireChargesForm.get('changePdAccountArray').patchValue(record);
    });
  }

  onChangeMode(event, index) {
    if (event.parameter1 == '1') {
      (<NgcFormControl>this.enquireChargesForm.get(['paymentDetails', index, 'requiredReferenceNo'])).setValue(true);
      (<NgcFormControl>this.enquireChargesForm.get(['paymentDetails', index, 'transactionNumber'])).setValidators([Validators.required]);
    } else {
      this.enquireChargesForm.get(['paymentDetails', index, 'requiredReferenceNo']).setValue(false);
      (<NgcFormControl>this.enquireChargesForm.get(['paymentDetails', index, 'transactionNumber'])).setValidators([]);
    }
    if (event.parameter2 == '1') {
      (<NgcFormControl>this.enquireChargesForm.get('requiredAuthorizationDetails')).setValue(true);
      document.querySelector('[formControlName="receivedFrom"]').setAttribute("required", "required");
      document.querySelector('[formControlName="icPassNumber"]').setAttribute("required", "required");
    } else {
      (<NgcFormControl>this.enquireChargesForm.get('requiredAuthorizationDetails')).setValue(false);
      document.querySelector('[formControlName="receivedFrom"]').removeAttribute("required");
      document.querySelector('[formControlName="icPassNumber"]').removeAttribute("required");
    }
    if (event.parameter3 == '1') {
      (<NgcFormControl>this.enquireChargesForm.get(['paymentDetails', index, 'issuingBank'])).setValidators([Validators.required]);
    } else {
      (<NgcFormControl>this.enquireChargesForm.get(['paymentDetails', index, 'issuingBank'])).setValidators([]);
    }

  }

  selectCheckCustomer(indexToSelect) {
    let data = this.enquireChargesForm.getRawValue();
    data.customerInfo.forEach((customer, index) => {
      if (index == indexToSelect) {
        customer.checkCustomer = true;
        this.customerInfoIndex = index;
        this.enquireChargesForm.get(['customerInfo', index, 'checkCustomer']).patchValue(true);
      } else {
        customer.checkCustomer = false;
        this.enquireChargesForm.get(['customerInfo', index, 'checkCustomer']).patchValue(false);
      }
    });
  }

  //on selecting checkbox values 
  onSelectCharge(index, childIndex) {
    this.enquireChargesForm.getList(['customerInfo']).forEach((element, indexValue) => {
      if (indexValue == index) {
        this.enquireChargesForm.get(['customerInfo', indexValue, 'checkCustomer']).setValue(true);
        this.setPaymentValue(index, childIndex);
      } else {
        this.enquireChargesForm.get(['customerInfo', indexValue, 'checkCustomer']).setValue(false);
        this.resetCheckBox(indexValue);
      }
    })
  }

  //To reset checkBox values of non-selected customer
  resetCheckBox = indexValue => {
    this.enquireChargesForm.getList(['customerInfo', indexValue, 'chargeAdvice']).forEach((element, chargeindex) => {
      this.enquireChargesForm.get(['customerInfo', indexValue, 'chargeAdvice', chargeindex, 'select']).setValue(false);
    })
  }

  //set payment values according to selected charge only 
  setPaymentValue = (index, childIndex) => {
    this.amountToCollect = 0;
    this.totalAmount = 0;
    this.roundOffDelta = 0;
    var flag = false;
    this.enquireChargesForm.getList(['customerInfo', index, 'chargeAdvice']).forEach((element, chargeindex) => {
      if (!NgcUtility.isBlank(element.value.select) && element.value.select && element.value.toCollect != 0) {
        flag = true;
        this.amountToCollect += element.value.toCollect;
        this.amountToCollect = parseFloat(this.amountToCollect);
        this.totalAmount = (this.roundUptoLeastCount > 0 ? Math.round(this.amountToCollect /
          this.enquireChargesForm.get('roundUptoLeastCount').value) *
          this.enquireChargesForm.get('roundUptoLeastCount').value : this.amountToCollect);
        this.roundOffDelta = this.totalAmount - this.amountToCollect;
        this.enquireChargesForm.get(['paymentDetails', 0, 'tenderedAmount']).patchValue(this.totalAmount);
      }
    })
    if (!flag) {
      this.onChange('calculate', index, childIndex);
    }
  }


}

