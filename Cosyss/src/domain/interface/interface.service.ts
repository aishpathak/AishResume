import { BaseService, RestService, BaseResponse, TrackRestCallProgress, HTTPContentType, NgcUtility } from 'ngc-framework';
import { Injectable } from '@angular/core';
import { CARGOMESSAGING_ENV, Environment, IMP_ENV, IMPDLV_ENV, SATSSGINTERFACE_ENV } from '../../environments/environment';
import { DomainEnvironement } from '../../environments/environment';
import { Observable } from 'rxjs';

import { VAL_ENV, CFG_ENV } from '../../environments/environment';
@Injectable()
export class InterfaceService extends BaseService {
  dataFromImportToMail: any;
  /**
         * Initialize
         *
         * @param restService Rest Service
         */
  constructor(private restService: RestService) {
    super();
  }
  /*----------------------AwB barcode print*------------------------*/


  @TrackRestCallProgress()
  public getIncomingMessage(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.fetchIncomingMessage,
      request
    );

  }

  @TrackRestCallProgress()
  public checkHandledByHouse(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.checkHandledByHouse,
      request
    );

  }

  @TrackRestCallProgress()
  public getResendMessage(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.fetchResendMessage,
      request
    );

  }

  @TrackRestCallProgress()
  public sendResendMessage(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.sendResendMessage,
      request
    );

  }

  @TrackRestCallProgress()
  public getTelexSetupData(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.telexSetup,
      request
    );

  }

  // @TrackRestCallProgress()
  // public sendResendMessage(request: any): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>this.restService.post(
  //     CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.sendResendMessage,
  //     request
  //   );

  // }


  @TrackRestCallProgress()
  public getOutgoingMessage(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.fetchOutgoingMessage,
      request
    );

  }
  @TrackRestCallProgress()
  public ediAndSendTsm(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.editAndSendTsmMessage,
      request
    );

  }

  @TrackRestCallProgress()
  public sendTsmManually(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      IMP_ENV.serviceBaseURL + IMP_ENV.sendTsmManually,
      request
    );

  }
  @TrackRestCallProgress()
  public getMonitoringExternalInterface(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.fetchMonitorExternalInterface,
      request
    );

  }

  @TrackRestCallProgress()
  public sendIncomingMessageProcess(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.sendIncomingMessageProcess,
      request
    );

  }
  @TrackRestCallProgress()
  public sendTelexMessages(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.sendTelexMessages,
      request
    );

  }



  @TrackRestCallProgress()
  public sendTelexMessage(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.sendTelex,
      request
    );

  }

  @TrackRestCallProgress()
  public searchSetupMessage(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.setUpMessageDefination,
      request
    );

  }
  @TrackRestCallProgress()
  public saveSetupMessage(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.saveSetUpMessageDefination,
      request
    );

  }

  @TrackRestCallProgress()
  public monitoringMessageInfo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.fetchmonitoringMessage,
      request
    );

  }

  @TrackRestCallProgress()
  public getErrorMsgList(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.fetchErrorMessage,
      request
    );

  }

  @TrackRestCallProgress()
  public pullMailTelexMessage(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.pullMailTelexMessage,
      request
    );

  }



  checkForAnyDuplicateEntries(arrayName, controlNameList, errorCode, arrayValue) {
    if (typeof controlNameList === 'string') {
      controlNameList = [controlNameList];
    }
    let hashMap = {};
    let arrayNameList = arrayValue;
    let messageList = [];
    let index = 0;
    for (let arrayInstance of arrayNameList) {
      let hashKey = {
        // controlName: arrayInstance[controlName]
      };
      let i = 1;
      for (const eachControlName of controlNameList) {
        hashKey['controlName' + i] = arrayInstance[eachControlName];
        ++i;
      }
      if (!hashMap[JSON.stringify(hashKey)])
        hashMap[JSON.stringify(hashKey)] = 1;
      else {
        let j = 0;
        for (const controlName in hashKey) {
          if (hashKey.hasOwnProperty(controlName)) {
            let k = j;
            messageList.push(
              {
                code: errorCode,
                referenceId: arrayName + '[' + index + '].' + controlNameList[k]
              }
            );
            ++j;
          }
        }
      }
      ++index;
    }
    return messageList;
  }

  @TrackRestCallProgress()
  public fetchEdiInterfaceSetUp(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.fetchEdiInterfaceSetUp,
      request
    );

  }

  @TrackRestCallProgress()
  public saveEdiInterfaceSetUp(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.saveEdiInterfaceSetUp,
      request
    );

  }
  @TrackRestCallProgress()
  public fetchEdiInterfaceTelexAddressSetUp(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.fetchEdiInterfaceTelexAddressSetUp,
      request
    );

  }
  @TrackRestCallProgress()
  public addEdiInterfaceTelexAddressSetUp(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.addEdiInterfaceTelexAddressSetUp,
      request
    );

  }
  @TrackRestCallProgress()
  public fetchEdiInterfaceEventSetUp(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.fetchEdiInterfaceEventSetUp,
      request
    );

  }
  @TrackRestCallProgress()
  public saveEdiInterfaceEventSetUp(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.addEdiInterfaceEventSetUp,
      request
    );

  }

  @TrackRestCallProgress()
  public addEdiMessagesDefinition(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.addEdiMessageDefinition,
      request
    );

  }

  //---Grouped message handling definifiton services---------//
  @TrackRestCallProgress()
  public searchGroupedSetupMessage(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.setUpGroupedMessageDefination,
      request
    );

  }
  @TrackRestCallProgress()
  public searchEditroupedSetupMessage(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.editGroupedMessageDefination,
      request
    );
  }
  @TrackRestCallProgress()
  public onDeleteGroupedMessageDetails(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.deleteGroupedMessageDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public fetchEventTypesForGroupedDefinition(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.fetchEventTypesForGroupedDefinition,
      request
    );
  }

  @TrackRestCallProgress()
  public editGroupedMessageHandlingDefinfition(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.editGroupedMessageHandlingDefinfition,
      request
    );
  }

  @TrackRestCallProgress()
  public replaceIncomingMessageFFM(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.repalceFFMmessage,
      request
    );
  }

  @TrackRestCallProgress()
  public processInboundMsgFile(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.processInboundMsgFile, request);
    //TODO Multi Part implementation
    //return <Observable<BaseResponse<any>>>NgcUtility.upload(CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.processInboundMsgFile, request, true);
  }

  @TrackRestCallProgress()
  public getUploadedDocId(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.getUploadedDocId, request);

  }

  // @TrackRestCallProgress()
  // public getFSUAgainstTenant(request: any): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>this.restService.post(SATSSGINTERFACE_ENV.serviceBaseURL + SATSSGINTERFACE_ENV.getFsuApiStatus, request);

  // }

  // @TrackRestCallProgress()
  // public saveFsuApiStatus(request: any): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>this.restService.post(SATSSGINTERFACE_ENV.serviceBaseURL + SATSSGINTERFACE_ENV.saveFsuApiStatus, request);

  // }

  /**
   * Method to fetch Fwb and Fhl info
   */
  @TrackRestCallProgress()
  public getInfoForResendFWBFHL(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.fetchResendFwbFhlInfo, request);
  }

  /**
   * Method to resend the selected FWB's and FHL's by the user
   */
  @TrackRestCallProgress()
  public reSendFWBFHL(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.resendFwbFhl, request);
  }

}
