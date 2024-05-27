import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageConfiguration, NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcReportComponent, NgcUtility, NgcWindowComponent } from 'ngc-framework';
import { CustomACESService } from '../customs.service';
import { Subscription, timer } from 'rxjs'
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-e-itt-submission-confirmation-cancellation',
  templateUrl: './e-itt-submission-confirmation-cancellation.component.html',
  styleUrls: ['./e-itt-submission-confirmation-cancellation.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class EIttSubmissionConfirmationCancellationComponent extends NgcPage implements OnInit {

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private route: ActivatedRoute,
    private router: Router,
    private eIttService: CustomACESService) {
    super(appZone, appElement, appContainerElement);
  }

  @ViewChild("eIttStatusWindow") eIttStatusWindow: NgcWindowComponent;
  @ViewChild("errorMessageWindow") errorMessageWindow: NgcWindowComponent;

  eIttForm: NgcFormGroup = new NgcFormGroup({
    ittReqType: new NgcFormControl("Submit-in"),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    startDate: new NgcFormControl(),
    endDate: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    ittReqNo: new NgcFormControl(),
    ittReqDate: new NgcFormControl(),
    ittReqCode: new NgcFormControl(),
    submissionsList: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        sno: new NgcFormControl(),
        flightKey: new NgcFormControl,
        flightDate: new NgcFormControl(),
        awbNo: new NgcFormControl(),
        pieces: new NgcFormControl(),
        weight: new NgcFormControl(),
        clearanceInfo: new NgcFormControl(),
        status: new NgcFormControl(),
        destinationCargoHandler: new NgcFormControl(),
        ittReqNo: new NgcFormControl(),
        ittReqDate: new NgcFormControl(),
        ittReqCode: new NgcFormControl(),
        ittAuthCode: new NgcFormControl()
      })
    ]),
    confirmationList: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        sno: new NgcFormControl(),
        ittReqCode: new NgcFormControl(),
        ittAuthCode: new NgcFormControl(),
        originCargoHandler: new NgcFormControl(),
        destinationCargoHandler: new NgcFormControl(),
        dutiableCommodities: new NgcFormControl(),
        ittConfirmDenied: new NgcFormControl(),
        confirmDeniedDateTime: new NgcFormControl(),
        status: new NgcFormControl(),
        flightKey: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        awbNo: new NgcFormControl(),
        hawbNo: new NgcFormControl(),
        ctmRefNo: new NgcFormControl(),
        eittStatus: new NgcFormControl(),
        userId: new NgcFormControl()
      })
    ]),
    cancellationList: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        sno: new NgcFormControl(),
        ittReqNo: new NgcFormControl(),
        ittReqDate: new NgcFormControl(),
        ittReqCode: new NgcFormControl(),
        ittAuthCode: new NgcFormControl(),
        destinationCargoHandler: new NgcFormControl(),
        flightKey: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        awbNo: new NgcFormControl(),
        pieces: new NgcFormControl(),
        weight: new NgcFormControl(),
        clearanceInfo: new NgcFormControl(),
        status: new NgcFormControl()
      })
    ])

  });

  eittStatus: NgcFormGroup = new NgcFormGroup({
    ittReqNo: new NgcFormControl(),
    ittReqDate: new NgcFormControl(),
    ittReqCode: new NgcFormControl(),
    ittAuthCode: new NgcFormControl(),
    originCargoHandler: new NgcFormControl(),
    destinationCargoHandler: new NgcFormControl(),
    ittConfirmDenied: new NgcFormControl(),
    ittReqType: new NgcFormControl(),
    status: new NgcFormControl(),
    eittStatusList: new NgcFormArray([
      new NgcFormGroup({
        sno: new NgcFormControl(),
        ittReqType: new NgcFormControl(),
        submissionDate: new NgcFormControl(),
        acknowledgeDate: new NgcFormControl(),
        errorMsgInd: new NgcFormControl()
      })
    ])
  });

  errorMessage: NgcFormGroup = new NgcFormGroup({
    requestDetailsList: new NgcFormArray([
      new NgcFormGroup({
        ittReqNo: new NgcFormControl(),
        ittReqDate: new NgcFormControl(),
        ittReqCode: new NgcFormControl(),
        ittReqType: new NgcFormControl(),
        status: new NgcFormControl()
      })
    ]),
    eittStatusList: new NgcFormArray([
      new NgcFormGroup({
        sno: new NgcFormControl(),
        awbNo: new NgcFormControl(),
        hawbNo: new NgcFormControl(),
        errorMsgInd: new NgcFormControl(),
        ittReqType: new NgcFormControl(),
      })
    ])
  });

  submissionFlag: boolean = false;
  confirmFlag: boolean = false;
  cancellationFlag: boolean = false;
  selectionDateTimeOptionalFlag: boolean = false;
  flightOptionalFlag: boolean = false;
  timerSubscription: Subscription;



  ngOnInit() {
    super.ngOnInit();
    this.startAutoRefresh();

  }

  /**
   * Method to search the records
   * 
   * @param type 
   */
  onSearch(type?: string) {

    if (!this.validateField()) {
      this.eIttForm.validate();
      this.showErrorStatus('g.fill.all.details')
      return;
    }

    this.clearErrorList();
    let formData = this.eIttForm.getRawValue();
    this.hideAllForms();
    if (type === 'Cancel-in') formData.ittReqType = 'Cancel-in';
    const request = {
      ittReqType: formData.ittReqType,
      flightKey: formData.flightKey,
      flightDate: formData.flightDate,
      startDate: formData.startDate,
      endDate: formData.endDate,
      awbNo: formData.shipmentNumber,
      ittReqNo: formData.ittReqNo,
      ittReqDate: formData.ittReqDate,
      ittReqCode: formData.ittReqCode
    }
    console.log(request);
    this.eIttService.getEIttData(request).subscribe(response => {
      console.log(response.data);
      // console.log(response.data.eittShipments);

      if (response.messageList) {
        this.showErrorStatus(response.messageList[0].code);
        return;
      }

      else if (response.data) {
        let data = response.data;
        let sno = 0;
        if (data.eittShipments.length == 0) {
          this.showErrorMessage("No Record Found");
          return;
        }
        data.eittShipments.forEach(element => {
          if (element.pieces == 0 || element.weight == 0.0) element.select = null;
          else element.select = false;
          sno += 1;
          element.sno = sno;

          let statusSno = 0;
          if (element.eittStatus) {
            element.eittStatus.forEach(status => {
              statusSno += 1;
              status.sno = statusSno;
            });
          }
        });

        if (formData.ittReqType === 'Confirm-in') {
          this.eIttForm.get('confirmationList').patchValue(data.eittShipments);
          this.confirmFlag = true;
        }
        else if (formData.ittReqType === 'Submit-in') {
          this.eIttForm.get('submissionsList').patchValue(data.eittShipments);
          this.submissionFlag = true;
        }
        else if (formData.ittReqType === 'Cancel-in') {
          this.eIttForm.get('cancellationList').patchValue(data.eittShipments);
          this.cancellationFlag = true;
        }
      }
      else {
        this.showErrorMessage("no.record");
      }

    });
  }


  validateField() {
    return (
      this.eIttForm.get('ittReqType').valid
      && this.eIttForm.get('flightKey').valid
      && this.eIttForm.get('flightDate').valid
      && this.eIttForm.get('startDate').valid
      && this.eIttForm.get('endDate').valid
      && this.eIttForm.get('shipmentNumber').valid
      && this.eIttForm.get('ittReqNo').valid
      && this.eIttForm.get('ittReqDate').valid
      && this.eIttForm.get('ittReqCode').valid
    ) ? true : false;
  }


  hideAllForms() {
    this.confirmFlag = false;
    this.submissionFlag = false;
    this.cancellationFlag = false;
  }

  openStatusWindow() {
    this.eIttStatusWindow.open();
  }

  closeStatusWindow() {
    this.eIttStatusWindow.close();
  }

  openErrorWindow() {
    this.errorMessageWindow.open();
  }

  closeErrorWindow() {
    this.errorMessageWindow.close();
  }

  onClear(event) {
    this.hideAllForms();
    this.eIttForm.reset();
  }

  onSubmitITTClick() {
    console.log('in onSubmitITTClick');
    let formData = this.eIttForm.getRawValue();
    let submissionData = [];
    let lengthErrorFlag = false;
    formData.submissionsList.forEach(element => {
      if (element.select) {

        if (element.destinationCargoHandler == null) {
          lengthErrorFlag = true;
          return;
        }

        if (element.originCargoHandler.length > 3 || element.destinationCargoHandler.length > 3) {
          this.showErrorStatus("Cargo Handler length should not be greater then 3");
          lengthErrorFlag = true;
          return;
        }

        element.ittReqType = 'ITT';
        submissionData.push(element)
      }
    });

    if (lengthErrorFlag) {
      return;
    }

    if (submissionData.length == 0) {
      this.showErrorStatus("selectAtleastOneRecord");
      return;
    }

    let request = {
      submissionType: 'ITTRequestSubmission',
      eittShipments: submissionData
    }
    console.log(request);
    this.eIttService.saveSubmission(request).subscribe(response => {
      if (response.messageList) {
        this.showErrorStatus(response.messageList[0].code);
        return;
      }
      else {
        console.log(response);
        this.onSearch();
      }
    });

  }

  onRejectITTClick() {
    let formData = this.eIttForm.getRawValue();
    let submissionData = [];
    formData.confirmationList.forEach(element => {
      if (element.select) {
        element.ittReqType = 'ITF';
        submissionData.push(element)
      }
    });

    if (submissionData.length == 0) {
      this.showErrorStatus("selectAtleastOneRecord");
      return;
    }

    let request = {
      submissionType: 'ITTRejectSubmission',
      eittShipments: submissionData
    }
    console.log(request);
    this.eIttService.saveSubmission(request).subscribe(response => {
      if (response.messageList) {
        this.showErrorStatus(response.messageList[0].code);
        return;
      }
      else {
        console.log(response);
        this.onSearch();
      }
    });
  }

  onConfirmITTClick() {
    let formData = this.eIttForm.getRawValue();
    let submissionData = [];
    formData.confirmationList.forEach(element => {
      if (element.select) {
        element.ittReqType = 'ITF';
        submissionData.push(element)
      }
    });
    let request = {
      submissionType: 'ITTConfirmationSubmission',
      eittShipments: submissionData
    }

    if (submissionData.length == 0) {
      this.showErrorStatus("selectAtleastOneRecord");
      return;
    }

    console.log(request);
    this.eIttService.saveSubmission(request).subscribe(response => {
      if (response.messageList) {
        this.showErrorStatus(response.messageList[0].code);
        return;
      }
      else {
        console.log(response);
        this.onSearch();
      }

    });

  }

  onCancelIttClick() {
    let formData = this.eIttForm.getRawValue();
    let submissionData = [];
    formData.cancellationList.forEach(element => {
      if (element.select) {
        element.ittReqType = 'ITC';
        submissionData.push(element)
      }
    });
    let request = {
      submissionType: 'ITTCancellationSubmission',
      eittShipments: submissionData
    }

    if (submissionData.length == 0) {
      this.showErrorStatus("selectAtleastOneRecord");
      return;
    }

    console.log(request);
    this.eIttService.saveSubmission(request).subscribe(response => {
      if (response.messageList) {
        this.showErrorStatus(response.messageList[0].code);
        return;
      }
      else {
        console.log(response);
        this.onSearch('Cancel-in');
      }

    });

  }

  onFlightChange(event) {
    if (this.eIttForm.get('flightKey').value != null || this.eIttForm.get('flightDate').value != null) {
      this.flightOptionalFlag = true;
      this.selectionDateTimeOptionalFlag = true;
    } else {
      this.flightOptionalFlag = false;
      this.selectionDateTimeOptionalFlag = false;
    }
  }

  startAutoRefresh() {
    this.timerSubscription = timer(0, (2 * 60 * 1000)).pipe(
      map(() => {
        this.autoRefresh()
      })
    ).subscribe();
    this.showSuccessStatus("Auto Refresh Started");
  }

  autoRefresh() {
    if (this.confirmFlag) {
      this.onSearch()
    }
  }

  stopAutoRefresh() {
    this.timerSubscription.unsubscribe();
    this.showSuccessStatus("Auto Refresh Paused");
  }

  onStatusClick(index: any, list: any) {
    let eittStatusdata = this.eIttForm.get([list, index]).value;
    if (list === 'submissionsList') eittStatusdata.ittReqType = 'ITT'
    else if (list === 'confirmationList') eittStatusdata.ittReqType = 'ITF'
    console.log(eittStatusdata.eittStatus);
    this.eittStatus.reset();
    this.eittStatus.patchValue(eittStatusdata);
    this.eittStatus.get('eittStatusList').patchValue(eittStatusdata.eittStatus);
    this.openStatusWindow();
  }


  onCancellationStatusClick(index) {
    let requestDetailsList = this.eIttForm.get(['cancellationList', index]).value;
    console.log(requestDetailsList);
    console.log({ requestDetailsList });
    this.errorMessage.reset();
    let submissionDetaiList = [];
    let count = 0;
    requestDetailsList.eittStatus.forEach(element => {
      element.eittShipments.forEach(shipment => {
        count += 1;
        shipment.sno = count;
        submissionDetaiList.push(shipment);
      });
    });
    console.log(submissionDetaiList);

    this.errorMessage.get('requestDetailsList').patchValue(requestDetailsList.eittStatus);
    this.errorMessage.get('eittStatusList').patchValue(submissionDetaiList);
    this.openErrorWindow();
    console.log(this.errorMessage.getRawValue());
  }


  confirmationListSelectCheck(index) {
    /**
     * add condtion to hide check box
     */
    return true;
  }


  cancellationListSelectCheck(index) {
    /**
     * add condtion to hide check box
     */
    return true;
  }

  submissionListSelectCheck(index) {
    /**
     * add condtion to hide check box
     */
    return true;
  }


}
