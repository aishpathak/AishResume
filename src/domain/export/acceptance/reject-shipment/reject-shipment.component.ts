import { Component, OnInit, ViewChild, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import {
  NgcButtonComponent, NgcPage, NgcFormGroup,
  NgcFormControl, NgcFormArray, PageConfiguration, NgcUtility
} from 'ngc-framework';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AcceptanceService } from '../acceptance.service';
import {
  GetRejectReturnShipmentDetails, RejectShipmentRequest,
  ReturnShipmentRequest, IcCodeValidation
} from '../.././export.sharedmodel';
import { DuplicatenamepopupComponent } from '../../../common/duplicatenamepopup/duplicatenamepopup.component';
@Component({
  selector: 'app-reject-shipment',
  templateUrl: './reject-shipment.component.html',
  styleUrls: ['./reject-shipment.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class RejectShipmentComponent extends NgcPage {
  @ViewChild('duplicateNamePopup') duplicateNamePopup: DuplicatenamepopupComponent;
  showReturnButton: boolean = false;
  // @ViewChild('searchbutton') searchbutton: NgcButtonComponent;
  isDataAvailable = false;
  isReject: boolean;
  serviceResponse: any;
  stopFlag = false;
  returnShipmentFlag = false;
  searchFlag = false;
  transferData: any;
  contractorInfoRequired: boolean;
  rejectreturnFlag: boolean = true;
  paymentSuccessfulFlag: boolean = false;

  private rejectShipmentForm: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    natureOfGoods: new NgcFormControl(),
    concatSHC: new NgcFormControl(),
    firstBookedFlight: new NgcFormControl(),
    firstBookedFlightDate: new NgcFormControl(),
    customerCode: new NgcFormControl(),
    returnShipmentList: new NgcFormArray([
      new NgcFormGroup({
        returnRequested: new NgcFormControl()
      })
    ]),
    rejectTypeDangerous: new NgcFormControl(false),
    rejectTypeGeneral: new NgcFormControl(false),
    rejectType: new NgcFormControl(),
    icCode: new NgcFormControl(),
    icName: new NgcFormControl(),
    //reasonId: new NgcFormControl(),
    email: new NgcFormArray([]),
    remarks1: new NgcFormArray([
      new NgcFormGroup({
        data: new NgcFormControl('', [Validators.maxLength(65)])
      })
    ])
  });




  constructor(appZone: NgZone, appElement: ElementRef, private router: Router,
    appContainerElement: ViewContainerRef, private exportService: AcceptanceService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }


  ngOnInit() {
    this.transferData = this.getNavigateData(this.activatedRoute);
    //this.rejectShipmentForm.controls['icName'].disable();
    if (this.transferData !== null) {
      if (this.transferData.shipmentNumber != null) {
        this.transferData.data.paymentSuccessfulFlag = this.transferData.paymentSuccessfulFlag;
        this.exportService.updateRejectReturnShipment(this.transferData.data)
          .subscribe(response => {
            if (response.data !== null) {
              this.isDataAvailable = true;
              this.serviceResponse = response.data;
              if (this.serviceResponse.returnShipmentList !== null && this.serviceResponse.returnShipmentList.length > 0) {
                this.returnShipmentFlag = true;
              }

              this.rejectShipmentForm.patchValue(this.serviceResponse);
              this.contractorInfoRequired = this.serviceResponse.contractorInfoRequired;
              if (this.transferData.data.paymentSuccessfulFlag && this.returnShipmentFlag) {
                this.isDataAvailable = false;
                this.rejectShipmentForm.reset();
                var shipmentNumber = this.transferData.shipmentNumber;
                this.showSuccessStatus(NgcUtility.translateMessage("export.returned.successfully", [shipmentNumber]));
              } else {
                this.onSearch();
              }

            }
          });
        this.rejectShipmentForm.get('shipmentNumber').setValue(this.transferData.shipmentNumber);
      }
      else {
        this.rejectShipmentForm.get('shipmentNumber').setValue(this.transferData);
      }
    }

  }
  /**
  * On Destroy
  */
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    // this.rejectShipmentForm.get('icCode').valueChanges.subscribe(changedValue => {
    //   if (changedValue !== null && changedValue !== '') {
    //     this.checkIcCodeValidation();
    //   }
    // });

  }

  checkIcCodeValidation() {
    const icCodeValidationData = new IcCodeValidation();
    icCodeValidationData.shipmentId = this.serviceResponse.shipmentId;
    icCodeValidationData.customerId = this.serviceResponse.customerId;
    if (this.rejectShipmentForm.get('icCode').value == null || this.rejectShipmentForm.get('icCode').value.length < 4) {
      return;
    }
    if ((this.rejectShipmentForm.get('icCode').value !== null) || (this.rejectShipmentForm.get('icCode').value !== '')) {
      icCodeValidationData.icCode = this.rejectShipmentForm.get('icCode').value;
      this.exportService.checkIcCode(icCodeValidationData).subscribe(response => {
        const resp = response.data
        if (resp === null) {
          this.showConfirmMessage('contractor.is.not.recognized'
          ).then(fulfilled => {
            this.rejectShipmentForm.get('icName').setValue("");
            (this.rejectShipmentForm.get('icName') as NgcFormControl).focus();
          }
          ).catch(reason => {
            (this.rejectShipmentForm.get('icCode') as NgcFormControl).focus();
          });
        }
        else {
          if (resp.authorizedPersonDetailList == null || resp.authorizedPersonDetailList.length == 0) {
            this.showConfirmMessage('contractor.is.not.recognized'
            ).then(fulfilled => {
              this.rejectShipmentForm.get('icName').setValue("");
              (this.rejectShipmentForm.get('icName') as NgcFormControl).focus();
            }
            ).catch(reason => {
              (this.rejectShipmentForm.get('icCode') as NgcFormControl).focus();
            });
          }
          else if (resp.authorizedPersonDetailList.length == 1) {
            this.rejectShipmentForm.get('icName').setValue(resp.authorizedPersonDetailList[0].authorizedPersonnelName);
            (this.rejectShipmentForm.get('icName') as NgcFormControl).focus();
          }
          else {
            this.duplicateNamePopup.open(resp.authorizedPersonDetailList);
          }
        }

      }, error => { });
    }

  }

  onConfirmNewEntry(boolean) {
    this.rejectShipmentForm.get('icName').setValue("");
    (this.rejectShipmentForm.get('icName') as NgcFormControl).focus();
  }

  onNameSelect(selectedName) {
    this.rejectShipmentForm.get('icName').setValue(selectedName.authorizedPersonnelName);
    (this.rejectShipmentForm.get('icName') as NgcFormControl).focus();
  }

  onChangeIC(event) {
    this.rejectShipmentForm.get('icName').reset();
  }
  onSearch() {
    (<NgcFormArray>this.rejectShipmentForm.get('remarks1')).reset();
    this.returnShipmentFlag = false;
    this.showReturnButton = false;
    this.searchFlag = true;
    this.isDataAvailable = false;
    const requestData = new GetRejectReturnShipmentDetails();
    requestData.shipmentNumber = this.rejectShipmentForm.get('shipmentNumber').value;
    this.exportService.getRejectReturnShipment(requestData)
      .subscribe(response => {
        this.refreshFormMessages(response);
        if (response.data !== null) {
          this.isDataAvailable = true;
          this.serviceResponse = response.data;
          if (this.serviceResponse.returnShipmentList !== null && this.serviceResponse.returnShipmentList.length > 0) {
            this.returnShipmentFlag = true;
          }

          this.rejectShipmentForm.patchValue(this.serviceResponse);
          this.serviceResponse.returnShipmentList.forEach(element => {
            if (element.returnRequested) {
              this.showReturnButton = true;
            }
          });
          this.contractorInfoRequired = this.serviceResponse.contractorInfoRequired;
          this.searchFlag = false;
        } else {
          this.searchFlag = false;
        }
      });
  }

  onReject() {
    if (this.rejectShipmentForm.get('rejectTypeDangerous').value) {
      this.rejectShipmentForm.get('rejectType').setValue(1);
    }
    if (this.rejectShipmentForm.get('rejectTypeGeneral').value) {
      this.rejectShipmentForm.get('rejectType').setValue(0);
    }
    let rejectShipmentRequest: any;
    let rejectRemaks: any = new Array();
    (<NgcFormArray>this.rejectShipmentForm.get('remarks1')).value.forEach(element => {
      if (element.data && (element.data !== null || element.data !== "")) {
        rejectRemaks.push(element.data);
      }
    });

    if (!this.rejectShipmentForm.get('icCode').valid) {
      return;
    }
    if (this.rejectShipmentForm.get('icName').value != null && this.rejectShipmentForm.get('icCode').value.length > 4) {
      this.showErrorMessage("ERROR_IC_NAME_CHR");
      return;
    }
    if (rejectRemaks.length == 0) {
      this.showErrorStatus("expaccpt.provide.remarks.validation");
      return;
    }
    rejectShipmentRequest = this.rejectShipmentForm.getRawValue();
    rejectShipmentRequest.remarks1 = null;
    rejectShipmentRequest['remarks'] = rejectRemaks;
    rejectShipmentRequest['documentInformationId'] = this.serviceResponse.documentInformationId;
    rejectShipmentRequest['prelodgeDocumentId'] = this.serviceResponse.prelodgeDocumentId;
    rejectShipmentRequest['shipmentId'] = this.serviceResponse.shipmentId;
    rejectShipmentRequest['dateOfNotification'] = NgcUtility.getDateAsString(new Date());
    rejectShipmentRequest['timeOfNotification'] = NgcUtility.getTimeAsString(new Date());
    rejectShipmentRequest['email'] = this.serviceResponse.email;
    if (rejectShipmentRequest['icCode'] != null && rejectShipmentRequest['icName'] != null) {
      // this.exportService.checkForBlackListCustomer(rejectShipmentRequest).subscribe(response => {
      //   if (response.success === false) {
      //     if (response.messageList.length > 0) {
      //       var icName: string[] = [];
      //       icName.push(rejectShipmentRequest['icName']);
      //       icName.push(rejectShipmentRequest['icCode']);
      //       var error = NgcUtility.translateMessage(response.messageList[0].code, icName);
      //       this.showErrorStatus(error + " " + response.messageList[0].message);
      //       return;
      //     }
      //   }

      //   if (!this.showResponseErrorMessages(response)) {
      //     this.exportService.rejectShipmentRecord(rejectShipmentRequest)
      //       .subscribe(response => {
      //         this.refreshFormMessages(response);
      //         if (response.data !== null) {
      //           var shipmentNumber = this.rejectShipmentForm.get('shipmentNumber').value;
      //           this.showSuccessStatus(NgcUtility.translateMessage("export.rejected.successfully", [shipmentNumber]));

      //           this.isDataAvailable = false;
      //           this.rejectShipmentForm.reset();
      //           //this.onSearch();
      //         }
      //       });
      //   }
      // });
    }


  }

  onPiecesChange(event, i) {
    if (event) {

      let bookingData = this.rejectShipmentForm.getRawValue();
      bookingData.fromAddPart = true;
      bookingData.totalPieces = this.rejectShipmentForm.get(['returnShipmentList', i]).get('piecesToReturn').value;
      bookingData.remainingPcs = this.rejectShipmentForm.get(['returnShipmentList', i]).get('pieces').value;
      bookingData.remainingWt = this.rejectShipmentForm.get(['returnShipmentList', i]).get('weight').value;
      this.exportService.getProportionalWeightForTRejectShipment(bookingData).subscribe(response => {
        if (this.showResponseErrorMessages(response)) {
          this.showResponseErrorMessages(response);
          return;
        } else {
          this.rejectShipmentForm
            .get(['returnShipmentList', i]).get('weightToReturn').setValue(response);
        }
      })

    }
  }
  onCancelReturn(index) {
    this.checkPiecesAndWeightEntered();
    if (!this.stopFlag) {

      // this.rejectShipmentForm.get('returnShipmentList').value.forEach(element => {
      //   if (element.piecesToReturn === null) {
      //     element.piecesToReturn = 0;
      //   }
      //   if (element.weightToReturn === null) {
      //     element.weightToReturn = 0.0;
      //   }
      // });
      let returnRemaks: any = new Array();
      let item: any = new Array();
      (<NgcFormArray>this.rejectShipmentForm.get('remarks1')).value.forEach(element => {
        if (element.data && (element.data !== null || element.data !== "")) {
          returnRemaks.push(element.data);
        }
      });
      // if (returnRemaks.length == 0) {
      //   this.showErrorStatus("expaccpt.provide.remarks.validation");
      //   return;
      // }
      const returnShipmentRequest = new ReturnShipmentRequest();
      returnShipmentRequest.documentInformationId = this.serviceResponse.documentInformationId;
      returnShipmentRequest.prelodgeDocumentId = this.serviceResponse.prelodgeDocumentId;
      returnShipmentRequest.shipmentId = this.serviceResponse.shipmentId;
      returnShipmentRequest.shipmentNumber = this.serviceResponse.shipmentNumber;
      returnShipmentRequest.contractorInfoRequired = this.serviceResponse.contractorInfoRequired;
      returnShipmentRequest.pieces = this.serviceResponse.pieces;
      returnShipmentRequest.weight = this.serviceResponse.weight;
      returnShipmentRequest.origin = this.rejectShipmentForm.get('origin').value;
      returnShipmentRequest.natureOfGoods = this.rejectShipmentForm.get('natureOfGoods').value;
      returnShipmentRequest.destination = this.rejectShipmentForm.get('destination').value;
      returnShipmentRequest.firstBookedFlight = this.rejectShipmentForm.get('firstBookedFlight').value;
      returnShipmentRequest.firstBookedFlightDate = this.rejectShipmentForm.get('firstBookedFlightDate').value;
      returnShipmentRequest.specialHandlingCode = this.serviceResponse.specialHandlingCode;
      returnShipmentRequest.rejectType = this.rejectShipmentForm.get('rejectType').value;
      returnShipmentRequest.icCode = this.rejectShipmentForm.get('icCode').value;
      returnShipmentRequest.icName = this.rejectShipmentForm.get('icName').value;
      //returnShipmentRequest.reasonId = this.rejectShipmentForm.get('reasonId').value;
      returnShipmentRequest.remarks = returnRemaks;
      this.rejectShipmentForm.get(['returnShipmentList', index, 'shipmentId']).setValue(returnShipmentRequest.shipmentId);
      item.push(this.rejectShipmentForm.get(['returnShipmentList', index]).value);
      returnShipmentRequest.returnShipmentList = item;
      returnShipmentRequest.email = (this.serviceResponse.email);
      if (!this.rejectShipmentForm.get('icCode').valid) {
        return;
      }
      if (this.rejectShipmentForm.get('icName').value != null && this.rejectShipmentForm.get('icCode').value.length > 4) {
        this.showErrorMessage("ERROR_IC_NAME_CHR");
        return;
      }
      // if (returnShipmentRequest['icCode'] != null && returnShipmentRequest['icName'] != null) {
      //   this.exportService.checkForBlackListCustomer(returnShipmentRequest).subscribe(response => {
      //     if (response.success === false) {
      //       if (response.messageList.length > 0) {
      //         var icName: string[] = [];
      //         icName.push(returnShipmentRequest['icName']);
      //         icName.push(returnShipmentRequest['icCode']);
      //         var error = NgcUtility.translateMessage(response.messageList[0].code, icName);
      //         this.showErrorStatus(error + " " + response.messageList[0].message);
      //         return;
      //       }
      //     }
      //     if (!this.showResponseErrorMessages(response)) {
      //       this.exportService.cancelReturnShipmentRecord(returnShipmentRequest)
      //         .subscribe(response => {
      //           this.refreshFormMessages(response);
      //           if (response.data !== null) {
      //             this.onSearch();
      //           }
      //         });
      //     }
      //   });
      // }
    }
  }
  onReturn(index) {
    this.checkPiecesAndWeightEntered();
    if (!this.stopFlag) {

      // this.rejectShipmentForm.get('returnShipmentList').value.forEach(element => {
      //   if (element.piecesToReturn === null) {
      //     element.piecesToReturn = 0;
      //   }
      //   if (element.weightToReturn === null) {
      //     element.weightToReturn = 0.0;
      //   }
      // });
      let returnRemaks: any = new Array();
      let item: any = new Array();
      (<NgcFormArray>this.rejectShipmentForm.get('remarks1')).value.forEach(element => {
        if (element.data && (element.data !== null || element.data !== "")) {
          returnRemaks.push(element.data);
        }
      });
      // if (returnRemaks.length == 0) {
      //   this.showErrorStatus("expaccpt.provide.remarks.validation");
      //   return;
      // }
      const returnShipmentRequest = new ReturnShipmentRequest();
      returnShipmentRequest.documentInformationId = this.serviceResponse.documentInformationId;
      returnShipmentRequest.prelodgeDocumentId = this.serviceResponse.prelodgeDocumentId;
      returnShipmentRequest.shipmentId = this.serviceResponse.shipmentId;
      returnShipmentRequest.shipmentNumber = this.serviceResponse.shipmentNumber;
      returnShipmentRequest.contractorInfoRequired = this.serviceResponse.contractorInfoRequired;
      returnShipmentRequest.pieces = this.serviceResponse.pieces;
      returnShipmentRequest.weight = this.serviceResponse.weight;
      returnShipmentRequest.piecesToReturn = this.serviceResponse.piecesToReturn;
      returnShipmentRequest.weightToReturn = this.serviceResponse.weightToReturn;
      returnShipmentRequest.origin = this.rejectShipmentForm.get('origin').value;
      returnShipmentRequest.natureOfGoods = this.rejectShipmentForm.get('natureOfGoods').value;
      returnShipmentRequest.destination = this.rejectShipmentForm.get('destination').value;
      returnShipmentRequest.firstBookedFlight = this.rejectShipmentForm.get('firstBookedFlight').value;
      returnShipmentRequest.firstBookedFlightDate = this.rejectShipmentForm.get('firstBookedFlightDate').value;
      returnShipmentRequest.specialHandlingCode = this.serviceResponse.specialHandlingCode;
      returnShipmentRequest.rejectType = this.rejectShipmentForm.get('rejectType').value;
      returnShipmentRequest.icCode = this.rejectShipmentForm.get('icCode').value;
      returnShipmentRequest.icName = this.rejectShipmentForm.get('icName').value;
      //returnShipmentRequest.reasonId = this.rejectShipmentForm.get('reasonId').value;
      returnShipmentRequest.remarks = returnRemaks;
      this.rejectShipmentForm.get(['returnShipmentList', index, 'shipmentId']).setValue(returnShipmentRequest.shipmentId);
      item.push(this.rejectShipmentForm.get(['returnShipmentList', index]).value);
      returnShipmentRequest.returnShipmentList = item;
      returnShipmentRequest.email = (this.serviceResponse.email);

      if (!this.rejectShipmentForm.get('icCode').valid) {
        return;
      }
      if (this.rejectShipmentForm.get('icName').value != null && this.rejectShipmentForm.get('icCode').value.length > 4) {
        this.showErrorMessage("ERROR_IC_NAME_CHR");
        return;
      }
      if (returnShipmentRequest['icCode'] != null && returnShipmentRequest['icName'] != null) {
        // this.exportService.checkForBlackListCustomer(returnShipmentRequest).subscribe(response => {
        //   if (response.success === false) {
        //     if (response.messageList.length > 0) {
        //       var icName: string[] = [];
        //       icName.push(returnShipmentRequest['icName']);
        //       icName.push(returnShipmentRequest['icCode']);
        //       var error = NgcUtility.translateMessage(response.messageList[0].code, icName);
        //       this.showErrorStatus(error + " " + response.messageList[0].message);
        //       return;
        //     }
        //   }
        //   if (!this.showResponseErrorMessages(response)) {
        //     this.exportService.returnShipmentRecord(returnShipmentRequest)
        //       .subscribe(response => {
        //         this.refreshFormMessages(response);
        //         if (response.data !== null) {

        //           this.returnPayment(response.data);
        //           this.onSearch();

        //         }
        //       });
        //   }
        // });
      }
    }
  }

  onReturnRequest() {
    this.checkPiecesAndWeightEntered();
    if (!this.stopFlag) {

      let item: any = new Array();
      let returnRemaks: any = new Array();
      (<NgcFormArray>this.rejectShipmentForm.get('remarks1')).value.forEach(element => {
        if (element.data && (element.data !== null || element.data !== "")) {
          returnRemaks.push(element.data);
        }
      });
      this.rejectShipmentForm.get('returnShipmentList').value.forEach(element => {
        if (!element.returnRequested && element.piecesToReturn != null && element.weightToReturn != null && element.piecesToReturn != '' && element.weightToReturn != '') {
          element.shipmentId = this.rejectShipmentForm.get('shipmentId').value;
          item.push(element);
        }
      });
      const returnShipmentRequest = new ReturnShipmentRequest();
      returnShipmentRequest.documentInformationId = this.serviceResponse.documentInformationId;
      returnShipmentRequest.prelodgeDocumentId = this.serviceResponse.prelodgeDocumentId;
      returnShipmentRequest.shipmentId = this.serviceResponse.shipmentId;
      returnShipmentRequest.shipmentNumber = this.serviceResponse.shipmentNumber;
      returnShipmentRequest.contractorInfoRequired = this.serviceResponse.contractorInfoRequired;
      returnShipmentRequest.pieces = this.serviceResponse.pieces;
      returnShipmentRequest.weight = this.serviceResponse.weight;
      returnShipmentRequest.origin = this.rejectShipmentForm.get('origin').value;
      returnShipmentRequest.natureOfGoods = this.rejectShipmentForm.get('natureOfGoods').value;
      returnShipmentRequest.destination = this.rejectShipmentForm.get('destination').value;
      returnShipmentRequest.firstBookedFlight = this.rejectShipmentForm.get('firstBookedFlight').value;
      returnShipmentRequest.firstBookedFlightDate = this.rejectShipmentForm.get('firstBookedFlightDate').value;
      returnShipmentRequest.specialHandlingCode = this.serviceResponse.specialHandlingCode;
      returnShipmentRequest.rejectType = this.rejectShipmentForm.get('rejectType').value;
      returnShipmentRequest.icCode = this.rejectShipmentForm.get('icCode').value;
      returnShipmentRequest.icName = this.rejectShipmentForm.get('icName').value;
      //returnShipmentRequest.reasonId = this.rejectShipmentForm.get('reasonId').value;
      returnShipmentRequest.remarks = returnRemaks;
      returnShipmentRequest.returnShipmentList = item;
      returnShipmentRequest.email = (this.serviceResponse.email);

      console.log(returnShipmentRequest);
      this.exportService.returnRequestShipmentRecord(returnShipmentRequest)
        .subscribe(response => {
          this.refreshFormMessages(response);
          if (response.data !== null) {
            //this.returnPayment(response.data);
            this.onSearch();
          }
        });
    }
  }

  navigateToEnquireCharges() {
    let request: any = {};
    request.shipment = this.rejectShipmentForm.get('shipmentNumber').value;
    this.navigateTo(this.router, '/billing/collectPayment/enquireCharges', request);
  }
  checkPiecesAndWeightEntered() {


  }

  addRemarksRow() {
    (<NgcFormArray>(
      this.rejectShipmentForm.get("remarks1")
    )).addValue([{ data: "" }]);
  }

  returnPayment(response) {
    var dataToSend = {
      shipment: response.shipmentNumber,
      returnRejectFlag: this.rejectreturnFlag,
      data: response
    }
    const requestData = new ReturnShipmentRequest();
    requestData.shipmentNumber = this.rejectShipmentForm.get('shipmentNumber').value;
    requestData.paymentSuccessfulFlag = this.paymentSuccessfulFlag;
    requestData.remarks = "";
    requestData.pieces = this.serviceResponse.pieces;
    requestData.weight = this.serviceResponse.weight;
    requestData.shipmentId = this.serviceResponse.shipmentId;

    if (response.paymentStatus != null && response.paymentStatus != '') {
      if (response.paymentStatus == "Pending" || !response.updatePiecesWeightFlag) {
        this.showErrorMessage("export.charges.pending");
      }
      else {
        response.paymentSuccessfulFlag = true;
        this.exportService.updateRejectReturnShipment(response)
          .subscribe(response => {
            if (response.data == null && response.success == false) {
              return;
            }
          });

      }
    }
  }
}
