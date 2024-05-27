import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Request } from './../model/resp';
import { Environment, BILL_ENV } from '../../environments/environment';
import { NgcCoreModule, BaseResponse, RestService, TrackRestCallProgress } from 'ngc-framework';
import {
  SearchChargeCode, ChargeCode, ChargeFactor, CustomerBillingSetupInfo, CustomerBillingInfoForSearch, BillingVerificationForSearch, BillingVerification, WaiveApprovalListForSearch, ChargePostConfigurationSearch, ChargePostConfiguration, CounterClosureVerificationForSearch, BillingPayment, BillingServiceMasterRequest, BillingServiceMasterResponse, BillingCreateServiceSetupRequest, CreateServiceRequest, ListServiceRequest, EditServiceRequest,
  AirlineTonnageReport, SapInvoiceCreditNote, SapInvCreditNoteListForAmount
} from './billing.sharedmodel';


@Injectable()
export class BillingService {

  constructor(private restService: RestService) { }

  @TrackRestCallProgress()
  public searchAllChargeCodes(request: SearchChargeCode):
    Observable<BaseResponse<SearchChargeCode>> {
    return <Observable<BaseResponse<SearchChargeCode>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.searchAllChargeCodes, request);
  }

  @TrackRestCallProgress()
  public searchChargeCode(request: SearchChargeCode):
    Observable<BaseResponse<ChargeCode>> {
    return <Observable<BaseResponse<ChargeCode>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.searchChargeCode, request);
  }

  @TrackRestCallProgress()
  public saveChargeCode(request: ChargeCode):
    Observable<BaseResponse<ChargeCode>> {
    return <Observable<BaseResponse<ChargeCode>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.saveChargeCode, request);
  }

  @TrackRestCallProgress()
  public searchChargeFactor(request: SearchChargeCode):
    Observable<BaseResponse<ChargeFactor>> {
    return <Observable<BaseResponse<ChargeFactor>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.searchChargeFactor, request);
  }

  @TrackRestCallProgress()
  public saveChargeFactor(request: ChargeFactor):
    Observable<BaseResponse<ChargeFactor>> {
    return <Observable<BaseResponse<ChargeFactor>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.saveChargeFactor, request);
  }

  @TrackRestCallProgress()
  public searchChargeModel(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.searchChargeModel, request);
  }

  @TrackRestCallProgress()
  public searchCopyChargeModel(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.searchCopyModel, request);
  }

  @TrackRestCallProgress()
  public saveChargeModel(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.saveChargeModel, request);
  }

  @TrackRestCallProgress()
  public getMasterServiceList(request: BillingServiceMasterRequest):
    Observable<BaseResponse<BillingServiceMasterRequest>> {
    return <Observable<BaseResponse<BillingServiceMasterRequest>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.searchServiceMaster,
      request
    );
  }

  @TrackRestCallProgress()
  public deleteServiceList(request: BillingServiceMasterRequest):
    Observable<BaseResponse<BillingServiceMasterRequest>> {
    return <Observable<BaseResponse<BillingServiceMasterRequest>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.deleteServiceMaster,
      request
    );
  }

  @TrackRestCallProgress()
  public saveServiceMaster(request: BillingCreateServiceSetupRequest):
    Observable<BaseResponse<BillingCreateServiceSetupRequest>> {
    return <Observable<BaseResponse<BillingCreateServiceSetupRequest>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.createServiceSetup,
      request
    );
  }

  @TrackRestCallProgress()
  public getServiceSetupRecord(request: BillingServiceMasterRequest):
    Observable<BaseResponse<BillingServiceMasterRequest>> {
    return <Observable<BaseResponse<BillingServiceMasterRequest>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.fetchServiceSetup,
      request
    );
  }

  @TrackRestCallProgress()
  public updateServiceMaster(request: BillingCreateServiceSetupRequest):
    Observable<BaseResponse<BillingCreateServiceSetupRequest>> {
    return <Observable<BaseResponse<BillingCreateServiceSetupRequest>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.updateServiceSetup,
      request
    );
  }
  /** Customer Billing Setup Service Requests starts here  */
  @TrackRestCallProgress()
  public searchCustomerBillingSetup(customerBillingInfoForSearch: CustomerBillingInfoForSearch):
    Observable<BaseResponse<CustomerBillingSetupInfo>> {
    return <Observable<BaseResponse<CustomerBillingSetupInfo>>>
      this.restService.post(BILL_ENV.serviceBaseURL +
        BILL_ENV.searchCustomerBillingSetup, customerBillingInfoForSearch);
  }
  @TrackRestCallProgress()
  public saveCustomerBillingSetup(customerBillingInfoForSave: CustomerBillingSetupInfo):
    Observable<BaseResponse<CustomerBillingSetupInfo>> {
    return <Observable<BaseResponse<CustomerBillingSetupInfo>>>
      this.restService.cleanAndPost(BILL_ENV.serviceBaseURL +
        BILL_ENV.saveCustomerBillingSetUp, customerBillingInfoForSave);
  }


  /**CreateServiceRequest Starts here */
  @TrackRestCallProgress()
  public checkServiceType(request: CreateServiceRequest):
    Observable<BaseResponse<CreateServiceRequest>> {
    return <Observable<BaseResponse<CreateServiceRequest>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.checkServiceType,
      request
    );
  }

  @TrackRestCallProgress()
  public getFlightDetails(request: CreateServiceRequest):
    Observable<BaseResponse<CreateServiceRequest>> {
    return <Observable<BaseResponse<CreateServiceRequest>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.getFlightDetails,
      request
    );
  }


  @TrackRestCallProgress()
  public saveServiceRequest(request: CreateServiceRequest):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.cleanAndPost(
      BILL_ENV.serviceBaseURL + BILL_ENV.createServiceRequest,
      request
    );
  }

  @TrackRestCallProgress()
  public getChargeEstimation(request: CreateServiceRequest):
    Observable<BaseResponse<CreateServiceRequest>> {
    return <Observable<BaseResponse<CreateServiceRequest>>>this.restService.cleanAndPost(
      BILL_ENV.serviceBaseURL + BILL_ENV.getEstimatedCharges,
      request
    );
  }
  /**CreateServiceRequest ends here */

  /** Customer Billing Setup Service Requests ends here  */

  /**Billing Verification Requests Starts here */
  @TrackRestCallProgress()
  public searchBillingVerification(billingVerificationForSearch: BillingVerificationForSearch): Observable<BaseResponse<BillingVerificationForSearch>> {
    return <Observable<BaseResponse<BillingVerificationForSearch>>>this.restService.post(BILL_ENV.serviceBaseURL +
      BILL_ENV.searchBillingVerification, billingVerificationForSearch);
  }

  @TrackRestCallProgress()
  public saveBillingVerification(billingVerificationForSave: BillingVerification): Observable<BaseResponse<BillingVerification>> {
    return <Observable<BaseResponse<BillingVerification>>>this.restService.post(BILL_ENV.serviceBaseURL +
      BILL_ENV.saveBillingVerification, billingVerificationForSave);
  }
  /**Billing Verification ends here */
  /** WaiveApprovalList starts here  */
  @TrackRestCallProgress()
  public searchWaiveApprovalList(waiveApprovalListForSearch: WaiveApprovalListForSearch): Observable<BaseResponse<WaiveApprovalListForSearch>> {
    return <Observable<BaseResponse<WaiveApprovalListForSearch>>>this.restService.post(BILL_ENV.serviceBaseURL +
      BILL_ENV.searchWaiveApprovalList, waiveApprovalListForSearch);
  }
  /** WaiveApprovalList ends here */
  /** Charge Posting Configuration starts here */
  @TrackRestCallProgress()
  public searchChargePostConfiguration(chargePostConfigurationForSearch: ChargePostConfigurationSearch): Observable<BaseResponse<ChargePostConfiguration>> {
    return <Observable<BaseResponse<ChargePostConfiguration>>>this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.searchChargePostConfiguration, chargePostConfigurationForSearch)
  }
  @TrackRestCallProgress()
  public saveChargePostConfiguration(chargePostConfiguration: ChargePostConfiguration): Observable<BaseResponse<ChargePostConfiguration>> {
    return <Observable<BaseResponse<ChargePostConfiguration>>>
      this.restService.cleanAndPost(BILL_ENV.serviceBaseURL +
        BILL_ENV.saveChargePostConfiguration, chargePostConfiguration);
  }
  /** Charge Posting Configuration ends here */

  /** ListServiceRequest starts  here */
  @TrackRestCallProgress()
  public getServiceRequestList(request: ListServiceRequest):
    Observable<BaseResponse<ListServiceRequest>> {
    return <Observable<BaseResponse<ListServiceRequest>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.listServices,
      request
    );
  }

  @TrackRestCallProgress()
  public getServiceRequest(request: ListServiceRequest):
    Observable<BaseResponse<ListServiceRequest>> {
    return <Observable<BaseResponse<ListServiceRequest>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.fetchServiceRequest,
      request
    );
  }

  @TrackRestCallProgress()
  public updateServiceRequest(request: ListServiceRequest):
    Observable<BaseResponse<ListServiceRequest>> {
    return <Observable<BaseResponse<ListServiceRequest>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.updateServiceRequest,
      request
    );
  }
  /** ListServiceRequest ends here */
  /**CounterClosureVerification Requests Starts here */
  @TrackRestCallProgress()
  public searchCounterClosureVerification(counterClosureVerificationForSearch: CounterClosureVerificationForSearch): Observable<BaseResponse<BillingPayment>> {
    return <Observable<BaseResponse<BillingPayment>>>this.restService.post(BILL_ENV.serviceBaseURL +
      BILL_ENV.searchCounterClosureVerification, counterClosureVerificationForSearch);
  }

  @TrackRestCallProgress()
  public saveCounterClosureVerification(counterClosureVerificationForSave: BillingPayment): Observable<BaseResponse<BillingPayment>> {
    return <Observable<BaseResponse<BillingPayment>>>this.restService.post(BILL_ENV.serviceBaseURL +
      BILL_ENV.updateCounterClosureVerification, counterClosureVerificationForSave);
  }

  @TrackRestCallProgress()
  public updateCounterClosureVerificationForReport(counterClosureVerificationForSave: BillingPayment): Observable<BaseResponse<BillingPayment>> {
    return <Observable<BaseResponse<BillingPayment>>>this.restService.post(BILL_ENV.serviceBaseURL +
      BILL_ENV.updateCounterClosureVerificationForReport, counterClosureVerificationForSave);
  }

  @TrackRestCallProgress()
  public updateCounterPaymentDetails(counterClosureVerificationForSave: BillingPayment): Observable<BaseResponse<BillingPayment>> {
    return <Observable<BaseResponse<BillingPayment>>>this.restService.post(BILL_ENV.serviceBaseURL +
      BILL_ENV.updatecounterpaymentdetails, counterClosureVerificationForSave);
  }

  /**CounterClosureVerification ends here */
  @TrackRestCallProgress()
  public startServiceRequest(request: ListServiceRequest):
    Observable<BaseResponse<ListServiceRequest>> {
    return <Observable<BaseResponse<ListServiceRequest>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.startServiceRequest,
      request
    );
  }

  @TrackRestCallProgress()
  public completeServiceRequest(request: ListServiceRequest):
    Observable<BaseResponse<ListServiceRequest>> {
    return <Observable<BaseResponse<ListServiceRequest>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.completeServiceRequest,
      request
    );
  }
  /** ListServiceRequest ends here */

  @TrackRestCallProgress()
  public getGroupInfo(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.searchGroupPay,
      request
    );
  }

  @TrackRestCallProgress()
  public makeGroupPayment(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.makeGroupPayment,
      request
    );
  }

  /** start of sap invoice credit note */
  @TrackRestCallProgress()
  public fetchSapInvoice(request: SapInvoiceCreditNote):
    Observable<BaseResponse<SapInvoiceCreditNote>> {
    return <Observable<BaseResponse<SapInvoiceCreditNote>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.fetchSapInvoice,
      request
    );
  }
  @TrackRestCallProgress()
  public updateIsVoid(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.updateIsVoid, request
    );
  }

  @TrackRestCallProgress()
  public updateSapInvoice(request: SapInvCreditNoteListForAmount):
    Observable<BaseResponse<SapInvCreditNoteListForAmount>> {
    return <Observable<BaseResponse<SapInvCreditNoteListForAmount>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.updateSapInvoice,
      request
    );
  }
  @TrackRestCallProgress()
  public getReport(request: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.getReport, request);
  }
  @TrackRestCallProgress()
  public getBillingReport(request: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.getBillingReport, request);
  }
  @TrackRestCallProgress()
  public getDriverDetail(request: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.getDriverDetail, request);

  }
  /** end of sap invoice credit note */


  @TrackRestCallProgress()
  public getReportsList(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.listReportRecords,
      request
    );
  }

  @TrackRestCallProgress()
  public updateStatus(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.updateStatus,
      request
    );
  }

  @TrackRestCallProgress()
  public updateId(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.updateId,
      request
    );
  }

  @TrackRestCallProgress()
  public fetchEntityForNewUpload(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.fetchEntityForNewUpload,
      request
    );
  }

  @TrackRestCallProgress()
  public saveTonnageDoc(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.saveTonnageDoc,
      request
    );
  }

  @TrackRestCallProgress()
  public fetchRecord(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.fetchRecord,
      request
    );
  }

  @TrackRestCallProgress()
  public fetchExchangeRates(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.fetchExchangeRates, request);
  }

  @TrackRestCallProgress()
  public saveExchangeRates(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.saveExchangeRates, request);
  }

  @TrackRestCallProgress()
  public saveCustomerPaymentAccount(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.saveCustomerPaymentAccount, request);

  }

  @TrackRestCallProgress()
  public deleteCustomerPaymentAccount(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.deleteCustomerPaymentAccount, request);
  }

  @TrackRestCallProgress()
  public topupPaymentAccount(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.topupPaymentAccount, request);
  }

  /* Method used for waiving service charges*/

  @TrackRestCallProgress()
  public waiveApproveOrReject(waiveApprovalData: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(BILL_ENV.serviceBaseURL +
      BILL_ENV.waiveApproveOrReject, waiveApprovalData);
  }

  @TrackRestCallProgress()
  public getCreditDebitList(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.getCreditDebitList, request);
  }
  @TrackRestCallProgress()
  public sendToIRN(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.sendToIRN, request);
  }

  @TrackRestCallProgress()
  public getInvoicesList(request: any): Observable<BaseResponse<any>> {

    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.getListOfInvoices, request
    );
  }

  @TrackRestCallProgress()
  public getPDAccountTransactions(request: any): Observable<any> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (BILL_ENV.serviceBaseURL + BILL_ENV.getPDAccountTransactions, request);
  }
  @TrackRestCallProgress()
  public searchCreditDebitNoteData(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.searchCreditDebitNoteData, request
    );
  }

  @TrackRestCallProgress()
  public sendInvoiceToIRN(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.sendInvoiceToIRN, request
    );
  }

  @TrackRestCallProgress()
  public payCreditDebitNote(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.payCreditDebitNote, request
    );
  }

  @TrackRestCallProgress()
  public checkHandledByOrAccpByHouse(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.checkHandledByOrAccpByHouse, request
    );
  }
  @TrackRestCallProgress()
  public updateCustomerForChangePDAccount(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      BILL_ENV.serviceBaseURL + BILL_ENV.updateCustomerForChangePDAccount, request
    );
  }
  // @TrackRestCallProgress()
  // public fetchCustomerTaxApplicability(request: any): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>this.restService.post(
  //     BILL_ENV.serviceBaseURL + BILL_ENV.fetchCustomerTaxApplicability, request
  //   );
  // }
}



