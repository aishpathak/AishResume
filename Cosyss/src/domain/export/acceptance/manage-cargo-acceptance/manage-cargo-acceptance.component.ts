import { request } from 'http';
import { FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AcceptanceService } from './../acceptance.service';
import { ExportService } from './../../export.service';
import {
  CargoWeighingRevisedServiceModelRevised, ShipmentModel
} from './../../export.sharedmodel';
import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, PageConfiguration, MessageType, NotificationMessage, NgcUtility
} from 'ngc-framework';
import { identifierModuleUrl } from '@angular/compiler';
import { DuplicatenamepopupComponent } from '../../../common/duplicatenamepopup/duplicatenamepopup.component';

@Component({
  selector: 'app-manage-cargo-acceptance',
  templateUrl: './manage-cargo-acceptance.component.html',
  styleUrls: ['./manage-cargo-acceptance.component.scss']
})

@PageConfiguration({
  trackInit: true,
  // callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})

export class ManageCargoAcceptanceComponent extends NgcPage {
  @ViewChild('duplicateNamePopup') duplicateNamePopup: DuplicatenamepopupComponent;
  collectFlag: boolean;

  afterSuccessSearchFlag = false;

  onValidateFlag = false;
  statusRequest: any;
  printerNameForAT: any;
  showEccFlag = false;
  editButtonFlag = true;
  // disabeSaveFlag = false;
  disableEditButton = true;
  showAcceptanceData = false;
  dropdownData: any;
  earlyLodgeInTime: any;
  lateLodgeInTime: any;
  currentDateTime = new Date();
  editItemServiceNumber: any;
  showNawbShipmentFlag = false;
  showTruckingSurfFlag = false;
  showLocalCourierFlag = false;
  showTruckingFlightFlag = false;
  showEReadyShipmentFlag = false;
  showPreLodgeShipmentFlag = false;
  showTerminalToTerminalFlag = false;
  showTrnashipmentCourierFlag = false;
  requiredContractorAuthorizationFlag = false;
  agentCode = false;
  agentName = false;
  validEready: boolean;
  dataRetrievedFromManageAWB: any;
  authorizationIdentificationName: any;
  authorizationIdentificationNumber: any;
  trmNumber: any;
  carrierCode: any;
  incomingFlightNumber: any;
  incomingFlightDate: any;
  forwardedAgentCode: any;
  forwardedAgentName: any;
  forwardedIncomingFlight: any;
  incomingFlightValidateRes: any;
  @ViewChild('serviceNumberListWindow') serviceNumberListWindow: NgcWindowComponent;
  private form: NgcFormGroup = new NgcFormGroup({
    svc: new NgcFormControl(),
    status: new NgcFormControl(),
    awbNumber: new NgcFormControl('', [Validators.minLength(11), Validators.maxLength(11), Validators.pattern('[0-9]*')]),
    agentCode: new NgcFormControl(),
    agentName: new NgcFormControl(),
    serviceNumber: new NgcFormControl(),
    acceptanceType: new NgcFormControl(),

    incomingFlight: new NgcFormControl('', [Validators.minLength(6), Validators.maxLength(8)]),
    incomingFlightCarrier: new NgcFormControl(),
    incomingFlightNumber: new NgcFormControl(),
    incomingFlightDate: new NgcFormControl(),
    trmNumber: new NgcFormControl('', [Validators.maxLength(15)]),

    serviceTerminal: new NgcFormControl(),

    authorizationIdentificationName: new NgcFormControl(),
    authorizationIdentificationNumber: new NgcFormControl(),
    customerId: new NgcFormControl(),
    blockSpace: new NgcFormControl(0),
    printerQueueName: new NgcFormControl(),
    serviceNumberList: new NgcFormArray([]),
    originalServiceNumberList: new NgcFormArray([]),
    shipmentSummary: new NgcFormArray([])
  });

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    private router: Router,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private _acceptanceService: AcceptanceService, private exportService: ExportService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    this.authorizationIdentificationName = '';
    this.authorizationIdentificationNumber = '';
    this.trmNumber = '';
    this.carrierCode = '';
    this.incomingFlightNumber = '';
    this.incomingFlightDate = '';
    this.requiredContractorAuthorizationFlag = false;
    this.forwardedAgentCode = '';
    this.forwardedAgentName = '';
    this.forwardedIncomingFlight = '';
    this.validEready = true;
    this.dataRetrievedFromManageAWB = this.getNavigateData(this.activatedRoute);
    if (this.dataRetrievedFromManageAWB && !this.dataRetrievedFromManageAWB.fromDate) {
      this.form.get('awbNumber').setValue(this.dataRetrievedFromManageAWB);
      this.onSearch(event);
    } else if (this.dataRetrievedFromManageAWB && this.dataRetrievedFromManageAWB.fromDate) {
      this.form.get('awbNumber').setValue(this.dataRetrievedFromManageAWB.shipmentNumber);
      this.form.get('acceptanceType').setValue(this.dataRetrievedFromManageAWB.acceptanceType);
      this.onSearch(event);
      this.authorizationIdentificationName = this.dataRetrievedFromManageAWB.authorizationIdentificationName;
      this.authorizationIdentificationNumber = this.dataRetrievedFromManageAWB.authorizationIdentificationNumber;
      this.trmNumber = this.dataRetrievedFromManageAWB.trmNumber;
      this.carrierCode = this.dataRetrievedFromManageAWB.incomingFlightCarrier;
      this.incomingFlightNumber = this.dataRetrievedFromManageAWB.incomingFlightNumber;
      this.incomingFlightDate = this.dataRetrievedFromManageAWB.incomingFlightDate;
      this.forwardedAgentCode = this.dataRetrievedFromManageAWB.agentCode;
      this.forwardedAgentName = this.dataRetrievedFromManageAWB.agentName;
      this.forwardedIncomingFlight = this.dataRetrievedFromManageAWB.incomingFlight;
    }
    this.form.get('agentCode').valueChanges.subscribe(response => {
      this.collectFlag = false;

      let code = this.form.get('agentCode').value;
      if (code) {
        this.exportService.getAgentDetail(code).subscribe(response => {
          let data = response.data;
          if (data) {
            this.collectFlag = true;
          }
        })
      }
    });
  }
  checkIncomingFlight(event) {
    this.incomingFlightValidateRes = null;
    if (this.form.get('acceptanceType').value == 'TRUCKING_SERVICE_FLIGHT') {
      if (this.form.get('incomingFlightCarrier').value == null || this.form.get('incomingFlightCarrier').value == "") {
        this.showErrorMessage("expaccpt.provide.carrier");
        return;
      }
      if (this.form.get('incomingFlightNumber').value == null || this.form.get('incomingFlightNumber').value == "") {
        this.showErrorMessage("export.input.flight.number");
        return;
      }
      if (this.form.get('incomingFlightDate').value == null || this.form.get('incomingFlightDate').value == "") {
        this.showErrorMessage("export.input.flight.date");
        return;
      }
      let object: any = new Object();
      object.incomingFlightCarrier = this.form.get('incomingFlightCarrier').value;
      object.incomingFlightNumber = this.form.get('incomingFlightNumber').value;
      object.incomingFlightDate = this.form.get('incomingFlightDate').value;
      this._acceptanceService.checkIncomingFlight(object).subscribe(response => {
        let data = response.data;
        this.incomingFlightValidateRes = response;
        if (!this.showResponseErrorMessages(response)) {

        }
      })
    }

  }
  /**
  * This function is responsible for Searching
  */

  onSearch(event) {
    this.form.validate();
    if (this.form.get('blockSpace').value == true) {
      this.form.get('blockSpace').setValue(1);
    }
    if (this.form.get('awbNumber').invalid === true) {
      this.showErrorMessage('export.details.not.valid.to.search');
      return;
    }

    const searchRequest = this.form.getRawValue();

    this.requiredContractorAuthorizationFlag = false;
    if (searchRequest.serviceNumber === null && searchRequest.awbNumber === null) {
      this.showErrorMessage('export.shipment.number.service.number.required');
      return;
    }
    searchRequest.validEready = this.validEready;
    this._acceptanceService.getContractorInformation(searchRequest).subscribe(response => {




      this.showResponseErrorMessages(response);

      if (response.data.validEready === true && this.validEready == true) {


        this.validEready = false;
        // return;



      }
      if (response.data.handledInCurrentCosys === true) {
        this.showConfirmMessage('g.flight.not.handled.confirmation').then(fulfilled => {

          this.showResponseErrorMessages(response);
          const searchResponse = response.data;

          this.requiredContractorAuthorizationFlag = true;
          if (searchResponse.agentCode !== null && searchResponse.agentName !== null) {
            this.agentCode = true;
            this.agentName = true;
          } else {

            this.agentCode = false;
            this.agentName = false;
          }
          // login terminal are different
          if ((searchResponse.logInTerminal !== null && searchResponse.logInTerminal !== '')
            && (searchResponse.logInTerminal !== searchResponse.terminal)) {
            this.showConfirmMessage(NgcUtility.translateMessage('error.prelodged.login.acceptance.terminal', [searchResponse.logInTerminal, searchResponse.terminal])).then(fulfilled => {
              this.getShipmentAndValidateService(searchResponse);
            }
            ).catch(reason => {

              return;
            });
          } else {
            this.getShipmentAndValidateService(searchResponse);
          }
        }
        ).catch(reason => {

          return;
        });
      } else {
        this.showResponseErrorMessages(response);
        const searchResponse = response.data;

        this.requiredContractorAuthorizationFlag = true;
        if (searchResponse.agentCode !== null && searchResponse.agentName !== null) {
          this.agentCode = true;
          this.agentName = true;
        } else {

          this.agentCode = false;
          this.agentName = false;
        }
        // login terminal are different
        if ((searchResponse.logInTerminal !== null && searchResponse.logInTerminal !== '')
          && (searchResponse.logInTerminal !== searchResponse.terminal)) {
          this.showConfirmMessage('Pre-Lodged login terminal is ' + searchResponse.logInTerminal + ' & Acceptance login terminal is '
            + searchResponse.terminal + ' , would you still like to continue?').then(fulfilled => {
              this.getShipmentAndValidateService(searchResponse);
            }
            ).catch(reason => {

              return;
            });
        } else {
          this.getShipmentAndValidateService(searchResponse);
        }
      }





    });
  }

  getShipmentAndValidateService(searchResponse: any) {
    if (searchResponse && searchResponse.serviceNumber) {
      if (searchResponse.authorizationIdentificationName && searchResponse.authorizationIdentificationNumber) {
        this.editButtonFlag = false;
        this.onValidateFlag = true;
      } else {

        this.onValidateFlag = false;
      }
      searchResponse.code = searchResponse.acceptanceType;
      this.onSelectAcceptanceType(searchResponse);
      searchResponse.authorizationIdentificationName = searchResponse.authorizationIdentificationName ? searchResponse.authorizationIdentificationName : this.authorizationIdentificationName;
      searchResponse.authorizationIdentificationNumber = searchResponse.authorizationIdentificationNumber ? searchResponse.authorizationIdentificationNumber : this.authorizationIdentificationNumber;
      searchResponse.incomingFlightCarrier = searchResponse.incomingFlightCarrier ? searchResponse.incomingFlightCarrier : this.carrierCode;
      searchResponse.incomingFlightNumber = searchResponse.incomingFlightNumber ? searchResponse.incomingFlightNumber : this.incomingFlightNumber;
      searchResponse.incomingFlightDate = searchResponse.incomingFlightDate ? searchResponse.incomingFlightDate : this.incomingFlightDate;
      searchResponse.trmNumber = searchResponse.trmNumber ? searchResponse.trmNumber : this.trmNumber;
      searchResponse.agentCode = searchResponse.agentCode ? searchResponse.agentCode : this.forwardedAgentCode;
      searchResponse.agentName = searchResponse.agentName ? searchResponse.agentName : this.forwardedAgentName;
      searchResponse.incomingFlight = searchResponse.incomingFlight ? searchResponse.incomingFlight : this.forwardedIncomingFlight;
      this.form.patchValue(searchResponse);

      if (this.form.get('acceptanceType').value == 'TRUCKING_SERVICE_SURF') {
        if (this.form.get('agentCode').value == null || this.form.get('agentCode').value == '') {
          this.retrieveLOVRecord('EXX', "SQL_COMPANY_AGENT_LIST_GHA").subscribe((record) => {
            this.form.get('agentName').setValue(record.desc);
          });
          this.form.get('agentCode').setValue('EXX');
        }

      }
      this.getShipemntDetails();
    }
  }




  /**
  * This function will take on the AWB Information screen along with the data saved for the user
  * @param value Value
  */


  private startEacceptanceParent(index) {
    const eAcceptanceData = this.form.getRawValue();
    this.retrieveDropDownListRecords('Acceptance$LodgeInTime').subscribe(data => {


      this.dropdownData = data;
      if (this.form.get(['shipmentSummary', index]).get('shipment').get('flight').value == null) {
        this.showErrorMessage('export.flight.details.missing');
        return;
      }

      this.dropdownData.forEach(element => {
        if (element.code === "EarlyLodgeIn") {
          this.earlyLodgeInTime = element.desc;
        } else if (this.form.get(['shipmentSummary', index]).get('shipment').get('flight').get('flightType').value === 'P' && element.code === "LateLodgeIn_PAX") {
          this.lateLodgeInTime = element.desc;
        } else if (this.form.get(['shipmentSummary', index]).get('shipment').get('flight').get('flightType').value === 'C' && element.code === "LateLoggeIn_CAO") {
          this.lateLodgeInTime = element.desc;
        } else if (this.form.get(['shipmentSummary', index]).get('shipment').get('isPerishableShipment').value === true && element.code === "EarlyLodgeIn_PERISHABLE") {
          this.earlyLodgeInTime = element.desc;
        } else if (this.form.get(['shipmentSummary', index]).get('shipment').get('isPerishableShipment').value === true && element.code === "LateLodgeIn_PERISHABLE") {
          this.lateLodgeInTime = element.desc;
        }
      });







      if (this.form.get(['shipmentSummary', index]).get('shipment').get('chargeCode').value == null
        && (this.form.get('acceptanceType').value == 'PRE_LODGE_SHIPMENT'
          || this.form.get('acceptanceType').value == 'E_READY_SHIPMENTS')
      ) {
        this.showErrorMessage('export.charge.code.missing');
        return;
      }
      if (this.form.get(['shipmentSummary', index]).get('shipment').get('flight').get('flightNumber').value == null
        || (
          this.form.get(['shipmentSummary', index]).get('shipment').get('flight').get('flightNumber') != null &&


          this.form.get(['shipmentSummary', index]).get('shipment').get('flight').get('flightNumber').value == '')) {
        this.showErrorMessage('export.flight.number.missing');

        return;
      }

      if (this.form.get(['shipmentSummary', index]).get('shipment').get('flight').get('flightDate').value == null
        || (
          this.form.get(['shipmentSummary', index]).get('shipment').get('flight').get('flightNumber') != null &&
          this.form.get(['shipmentSummary', index]).get('shipment').get('flight').get('flightDate').value == '')) {
        this.showErrorMessage('export.flight.date.missing');
        return;
      }



      let dateSTD = NgcUtility.toDateFromLocalDate(this.form.get(['shipmentSummary', index]).get('shipment').get('flight').get('dateSTD').value);
      var differnceInTime = (dateSTD.getTime() -
        this.currentDateTime.getTime()) / 1000;
      differnceInTime /= (60 * 60);





      if (differnceInTime > 0) {


        if (Math.abs(differnceInTime) < this.lateLodgeInTime) {
          this.showConfirmMessage('exp.accpt.latelodgein').then(fulfilled => {
            this.startEFromShipment(index);
          }
          ).catch(reason => {

            return;
          });
        }
        else if (Math.abs(differnceInTime) > this.earlyLodgeInTime) {
          this.showConfirmMessage('exp.accpt.earlylodgein').then(fulfilled => {
            this.startEFromShipment(index);
          }

          ).catch(reason => {

            return;
          });
        } else {
          this.startEFromShipment(index);

        }

      } else {
        this.startEFromShipment(index);
      }

    });



  }




  startEFromShipment(index) {

    if (this.form.get(['shipmentSummary', index]).get('shipment').get('flight').value == null) {
      this.showErrorMessage('export.flight.details.missing');
      return;
    }
    if (this.form.get(['shipmentSummary', index]).get('shipment').get('flight').get('flightNumber').value == null
      || (
        this.form.get(['shipmentSummary', index]).get('shipment').get('flight').get('flightNumber') != null &&


        this.form.get(['shipmentSummary', index]).get('shipment').get('flight').get('flightNumber').value == '')) {
      this.showErrorMessage('export.flight.number.missing');

      return;
    }

    if (this.form.get(['shipmentSummary', index]).get('shipment').get('flight').get('flightDate').value == null
      || (
        this.form.get(['shipmentSummary', index]).get('shipment').get('flight').get('flightNumber') != null &&
        this.form.get(['shipmentSummary', index]).get('shipment').get('flight').get('flightDate').value == '')) {
      this.showErrorMessage('export.flight.date.missing');
      return;
    }


    (this.form.get('authorizationIdentificationNumber') as NgcFormGroup).validate();
    if (this.form.get('authorizationIdentificationNumber').invalid) {

      return;
    }
    (this.form.get('authorizationIdentificationName') as NgcFormGroup).validate();
    if (this.form.get('authorizationIdentificationName').invalid) {
      return;
    }


    (this.form.get('printerQueueName') as NgcFormGroup).validate();
    if (this.form.get('printerQueueName').invalid) {
      return;
    }

    if (this.form.get('incomingFlightCarrier').invalid) {
      return;
    }
    (this.form.get('incomingFlight') as NgcFormGroup).validate();
    if (this.form.get('incomingFlight').invalid) {
      return;
    }

    (this.form.get('incomingFlightDate') as NgcFormGroup).validate();
    if (this.form.get('incomingFlightDate').invalid) {
      return;
    }

    (this.form.get('agentCode') as NgcFormGroup).validate();
    if (this.form.get('agentCode').invalid) {
      return;
    }

    (this.form.get('agentName') as NgcFormGroup).validate();
    if (this.form.get('agentName').invalid) {
      return;
    }

    (this.form.get(['shipmentSummary', index]) as NgcFormGroup).validate();
    if ((this.form.get(['shipmentSummary', index]) as NgcFormGroup).invalid) {
      return;
    }

    //startEFromShipment
    const eStartAcceptanceData = (<NgcFormGroup>this.form.get(['shipmentSummary', index])).getRawValue();

    eStartAcceptanceData.acceptanceService.agentCode = this.form.get('agentCode').value;
    eStartAcceptanceData.acceptanceService.agentName = this.form.get('agentName').value;
    eStartAcceptanceData.acceptanceService.serviceNumber = this.form.get('serviceNumber').value;
    eStartAcceptanceData.acceptanceService.acceptanceType = this.form.get('acceptanceType').value;
    eStartAcceptanceData.printerQueueName = this.form.get('printerQueueName').value;
    eStartAcceptanceData.printerNameForAT = this.printerNameForAT;
    eStartAcceptanceData.acceptanceService.authorizationIdentificationName = this.form.get('authorizationIdentificationName').value;
    eStartAcceptanceData.acceptanceService.authorizationIdentificationNumber = this.form.get('authorizationIdentificationNumber').value;





    this._acceptanceService.isFlightExistInCurrentCosys(eStartAcceptanceData).subscribe(response => {
      if (!response.messageList) {


        if (response.data.handledInCurrentCosys === true) {


          this.showConfirmMessage('g.flight.not.handled.confirmation').then(fulfilled => {


            this._acceptanceService.onStartEAcceptance(eStartAcceptanceData).subscribe(response => {
              if (response != null && response.data != null && response.data.messageList != null) {
                if (!this.showResponseErrorMessages(response.data)) {
                  this.showSuccessStatus('g.completed.successfully');
                  this.form.get(['shipmentSummary', index, 'shipment', 'customStatus']).patchValue('SERVICING');
                }
              } else {
                if (!this.showResponseErrorMessages(response)) {
                  this.showSuccessStatus('g.completed.successfully');
                  this.form.get(['shipmentSummary', index, 'shipment', 'customStatus']).patchValue('SERVICING');
                }
              }

            }, error => this.showErrorStatus('g.error'));


          }
          ).catch(reason => {

            return;
          });


        } else {
          this._acceptanceService.onStartEAcceptance(eStartAcceptanceData).subscribe(response => {
            if (response != null && response.data != null && response.data.messageList != null) {
              if (!this.showResponseErrorMessages(response.data)) {
                this.showSuccessStatus('g.completed.successfully');
                this.form.get(['shipmentSummary', index, 'shipment', 'customStatus']).patchValue('SERVICING');
              }
            } else {
              if (!this.showResponseErrorMessages(response)) {
                this.showSuccessStatus('g.completed.successfully');
                this.form.get(['shipmentSummary', index, 'shipment', 'customStatus']).patchValue('SERVICING');
              }
            }

          }, error => this.showErrorStatus('g.error'));
        }
      } else {
        const errors = response.messageList;
        if (errors[0].message != null) {
          this.showErrorStatus(errors[0].message);
        } else if (errors[0].code != null) {
          this.showResponseErrorMessages(response);
        } else {
          this.showErrorStatus("data.invalid.dummy.entry");
        }
      }


    });



  }

  /**
  * This function is responsible for Searching
  */
  onServiceNumber(event) {
    this._acceptanceService.onServiceNumber().subscribe(response => {
      const dataToPatchForServiceNumberList = response.data;
      (<NgcFormArray>this.form.controls['serviceNumberList']).patchValue(dataToPatchForServiceNumberList);
      (<NgcFormArray>this.form.controls['originalServiceNumberList']).patchValue(dataToPatchForServiceNumberList);
    }, error => this.showErrorStatus('g.error'));
    this.serviceNumberListWindow.open();
  }

  onEdit(index) {

    (this.form.get('authorizationIdentificationNumber') as NgcFormGroup).validate();
    if (this.form.get('authorizationIdentificationNumber').invalid) {
      return;
    }
    (this.form.get('authorizationIdentificationName') as NgcFormGroup).validate();
    if (!this.form.get('authorizationIdentificationNumber').invalid && this.form.get('authorizationIdentificationNumber').value != null) {
      if (this.form.get('authorizationIdentificationNumber').value.length == 4) {
        if (this.form.get('authorizationIdentificationName').value == null || this.form.get('authorizationIdentificationName').value.length < 4) {
          this.showErrorMessage("ERROR_IC_NAME_CHR");
          return;
        }
      }
    }

    // TRM Number needed only in case of DNATA
    if (this.form.get('acceptanceType').value === 'TERMINAL_TO_TERMINAL'
    ) {
      (this.form.get('trmNumber') as NgcFormGroup).validate();
      if (this.form.get('trmNumber').invalid) {
        return;
      }
    }

    // Incoming Flight carrier to be mandatory in case of DNATA and Trucking Flight
    if (this.form.get('acceptanceType').value === 'TERMINAL_TO_TERMINAL' ||
      this.form.get('acceptanceType').value === 'TRUCKING_SERVICE_FLIGHT'
    ) {
      (this.form.get('incomingFlightCarrier') as NgcFormGroup).validate();
      if (this.form.get('incomingFlightCarrier').invalid) {
        return;
      }
    }

    // Incoming Flight to be mandatory in case of Trucking Flight
    if (this.form.get('acceptanceType').value === 'TRUCKING_SERVICE_FLIGHT'
    ) {

      (this.form.get('incomingFlightNumber') as NgcFormGroup).validate();
      if (this.form.get('incomingFlightNumber').invalid) {
        return;
      }
      (this.form.get('incomingFlightDate') as NgcFormGroup).validate();
      if (this.form.get('incomingFlightDate').invalid) {
        return;
      }
      if (this.showResponseErrorMessages(this.incomingFlightValidateRes)) {
        return;
      }
    }

    (this.form.get('printerQueueName') as NgcFormGroup).validate();
    if (this.form.get('printerQueueName').invalid) {
      return;
    }

    (this.form.get('incomingFlight') as NgcFormGroup).validate();
    if (this.form.get('incomingFlight').invalid) {
      return;
    }

    (this.form.get('incomingFlightDate') as NgcFormGroup).validate();
    if (this.form.get('incomingFlightDate').invalid) {
      return;
    }

    (this.form.get('agentCode') as NgcFormGroup).validate();
    if (this.form.get('agentCode').invalid) {
      return;
    }

    (this.form.get('agentName') as NgcFormGroup).validate();
    if (this.form.get('agentName').invalid) {
      return;
    }

    (this.form.get(['shipmentSummary', index]) as NgcFormGroup).validate();
    if ((this.form.get(['shipmentSummary', index]) as NgcFormGroup).invalid) {
      return;
    }


    //this.form.get(['shipmentSummary', index, 'shipment', 'shc']).patchValue(this.form.get(['shipmentSummary', index, 'shipment', 'concatSHC']).value);
    const requestToAwbInformation = this.form.getRawValue();
    requestToAwbInformation.shipmentNumber = requestToAwbInformation.shipmentSummary[index].acceptanceService.shipmentNumber;
    requestToAwbInformation.concatSHC = requestToAwbInformation.shipmentSummary[index].shipment.concatSHC;
    requestToAwbInformation.awbNumber = null;
    requestToAwbInformation.pouchReceived = requestToAwbInformation.shipmentSummary[index].shipment.pouchReceived;
    requestToAwbInformation.rcarTypeCode = requestToAwbInformation.shipmentSummary[index].shipment.rcarTypeCode;
    requestToAwbInformation.awbReceived = requestToAwbInformation.shipmentSummary[index].shipment.awbReceived;
    requestToAwbInformation.exemptionCode = requestToAwbInformation.shipmentSummary[index].shipment.exemptionCode;
    requestToAwbInformation.origin = requestToAwbInformation.shipmentSummary[index].shipment.origin;
    requestToAwbInformation.printerNameForAT = this.printerNameForAT;
    requestToAwbInformation.servicecreationdate = this.form.get('serviceCreationDate').value;
    requestToAwbInformation.screen = 'Acceptance';

    if (requestToAwbInformation.authorizationIdentificationName != null
      && requestToAwbInformation.authorizationIdentificationNumber != null) {
      // this._acceptanceService.validateBlackListCustomer(requestToAwbInformation).subscribe(response => {
      //   if (response.success === false) {
      //     if (response.messageList.length > 0) {
      //       var icName: string[] = [];
      //       icName.push(requestToAwbInformation.authorizationIdentificationName);
      //       icName.push(requestToAwbInformation.authorizationIdentificationNumber);
      //       var error = NgcUtility.translateMessage(response.messageList[0].code, icName);
      //       this.showErrorStatus(error + " " + response.messageList[0].message);
      //       return;
      //     }
      //   }
      //   if (!this.showResponseErrorMessages(response)) {
      //     this.navigateToFlow(requestToAwbInformation);
      //   }
      // });
    } else {
      this.navigateToFlow(requestToAwbInformation);
    }

    //requestToAwbInformation.svc = requestToAwbInformation.svc;

  }

  /**
  * This function will take on the Update User along with the data saved for the user
  * @param value Value
  */
  private onValidate() {
    const requestValidate = this.form.getRawValue();
    if (!requestValidate.authorizationIdentificationNumber) {
      this.showWarningStatus('export.enter.contractoric.airportpass');
      return;
    }
    if (requestValidate.authorizationIdentificationNumber.length != 4) {
      this.showWarningStatus('export.enter.contractoric.airportpass');
      return;
    }

    this._acceptanceService.onValidateContractor(requestValidate).subscribe(response => {
      const resp = response.data;
      if (response.messageList != null && response.messageList.length > 0) {
        this.showMessage(response.messageList[0].code);
        return;
      } else {
        if (resp != null) {
          if ((resp.length === 0) || resp[0].authorizedPersonDetailList == null || resp[0].authorizedPersonDetailList.length == 0) {
            this.form.controls['authorizationIdentificationName'].setValue("");
            this.showConfirmMessage('expaccpt.contractor.not.recognized').then(fulfilled => {
              this.editButtonFlag = false;
            }
            ).catch(reason => {
              this.editButtonFlag = true;
            });
          }
          else if (resp[0].authorizedPersonDetailList.length == 1) {
            this.form.controls['authorizationIdentificationName'].setValue(resp[0].authorizedPersonDetailList[0].authorizedPersonnelName);
          } else {
            this.duplicateNamePopup.open(resp[0].authorizedPersonDetailList);
          }
        } else {
          this.form.controls['authorizationIdentificationName'].setValue("");
          this.showConfirmMessage('expaccpt.contractor.not.recognized').then(fulfilled => {
            this.editButtonFlag = false;
          }
          ).catch(reason => {
            this.editButtonFlag = true;
          });
        }
      }
    });
  }

  onConfirmNewEntry(boolean) {
    this.form.controls['authorizationIdentificationName'].setValue("");
  }

  onNameSelect(selectedName) {
    this.form.controls['authorizationIdentificationName'].setValue(selectedName.authorizedPersonnelName);
  }
  onChangeIC(event) {
    this.form.controls['authorizationIdentificationName'].reset();
  }
  private getShipemntDetails() {
    const reqObjForShipmentInfo = this.form.getRawValue();
    this._acceptanceService.onValidateForAwbNoValidation(reqObjForShipmentInfo).subscribe(response => {
      const dataToPatchForShipmentSummary = response.data;
      if (dataToPatchForShipmentSummary != null && dataToPatchForShipmentSummary[0] != null && dataToPatchForShipmentSummary[0].acceptanceService.acceptanceType != null) {
        if (dataToPatchForShipmentSummary[0].acceptanceService.acceptanceType == "LOCAL_COURIER") {
          if (dataToPatchForShipmentSummary[0].shipment != null) {
            dataToPatchForShipmentSummary[0].shipment.concatSHC = "COU";
          }

        }
        if (dataToPatchForShipmentSummary[0].eawb != null && dataToPatchForShipmentSummary[0].eawb == true) {
          dataToPatchForShipmentSummary[0].shipment.awbReceived = "Y";
        }
      } else {
        if (dataToPatchForShipmentSummary != null && dataToPatchForShipmentSummary[0] != null && dataToPatchForShipmentSummary[0].eawb != null && dataToPatchForShipmentSummary[0].eawb == true) {
          dataToPatchForShipmentSummary[0].shipment.awbReceived = "Y";
        }
      }

      (<NgcFormArray>this.form.controls['shipmentSummary']).patchValue(dataToPatchForShipmentSummary);
      /*to disable field after successful search */
      this.afterSuccessSearchFlag = true;
      this.showResponseErrorMessages(response);
      this.showAcceptanceData = true;
      if (this.validEready == false) {
        this.showWarningMessage('exp.accpt.valideready');
      }

    }, error => this.showErrorStatus('g.error'));
  }

  onAgentNameAutoFill(object: any, item) {
    this.form.get('agentName').setValue(object.desc);
    this.form.get('customerId').setValue(object.param1);

  }

  /**
  * Function which is called when a link in datatable is called
  * @param event
  */
  onLinkClick(event) {
    if (event.type === 'link') {
      this.serviceNumberListWindow.close();
      this.form.get('awbNumber').setValue('');
      // this.form.get('acceptanceType').patchValue('PRE_LODGE_SHIPMENT');
      this.form.get('serviceNumber').patchValue(event.record.serviceNumber);
    }
  }

  onSave() {

    this.form.validate();

    if (this.form.get('awbNumber').invalid) {
      return;
    }

    if (this.form.get('acceptanceType').invalid) {
      return;
    }

    if (this.form.get('incomingFlight').invalid) {
      return;
    }

    // TRM Number needed only in case of DNATA
    if (this.form.get('acceptanceType').value === 'TERMINAL_TO_TERMINAL'
    ) {

      if (this.form.get('trmNumber').invalid) {
        return;
      }

    }





    // Incoming Flight carrier to be mandatory in case of DNATA and Trucking Flight
    if (this.form.get('acceptanceType').value === 'TERMINAL_TO_TERMINAL' ||
      this.form.get('acceptanceType').value === 'TRUCKING_SERVICE_FLIGHT'
    ) {
      (this.form.get('incomingFlightCarrier') as NgcFormGroup).validate();
      if (this.form.get('incomingFlightCarrier').invalid) {
        return;
      }
    }

    // Incoming Flight to be mandatory in case of Trucking Flight
    if (this.form.get('acceptanceType').value === 'TRUCKING_SERVICE_FLIGHT'
    ) {
      (this.form.get('incomingFlight') as NgcFormGroup).validate();
      if (this.form.get('incomingFlightNumber').invalid) {
        return;
      }
      (this.form.get('incomingFlightDate') as NgcFormGroup).validate();
      if (this.form.get('incomingFlightDate').invalid) {
        return;
      }
      if (this.showResponseErrorMessages(this.incomingFlightValidateRes)) {
        return;
      }
    }


    if (this.form.get('agentCode').invalid) {
      return;
    }

    if (this.form.get('agentName').invalid) {
      return;
    }
    if (this.form.get('authorizationIdentificationNumber').value == null) {
      this.form.get('authorizationIdentificationNumber').setValue("");
    }
    if (this.form.get('authorizationIdentificationName').value == null) {
      this.form.get('authorizationIdentificationName').setValue("");
    }

    if (this.form.get('authorizationIdentificationNumber').invalid) {
      return;
    }
    if (!this.form.get('authorizationIdentificationNumber').invalid && this.form.get('authorizationIdentificationNumber').value.length == 4) {
      if (this.form.get('authorizationIdentificationName').value == null || this.form.get('authorizationIdentificationName').value.length < 4) {
        this.showErrorMessage("ERROR_IC_NAME_CHR");
        return;
      }
    }

    const eStartAcceptanceData = this.form.getRawValue();
    // if (this.form.get('authorizationIdentificationName').value != null
    //  && this.form.get('authorizationIdentificationNumber').value != null) {
    // this._acceptanceService.validateBlackListCustomer(eStartAcceptanceData).subscribe(response => {
    //   if (response.success === false) {
    //     if (response.messageList.length > 0) {
    //       var icName: string[] = [];
    //       icName.push(eStartAcceptanceData.authorizationIdentificationName);
    //       icName.push(eStartAcceptanceData.authorizationIdentificationNumber);
    //       var error = NgcUtility.translateMessage(response.messageList[0].code, icName);
    //       this.showErrorStatus(error + " " + response.messageList[0].message);
    //       return;
    //     }
    //   }
    //   if (!this.showResponseErrorMessages(response)) {
    //     console.log("save")
    //     if (this.form.get('printerQueueName').invalid) {
    //       return;
    //     }

    //     if (this.form.get('incomingFlightNumber').invalid) {
    //       return;
    //     }
    //     if (this.form.get('incomingFlightDate').invalid) {
    //       return;
    //     }
    //     if (this.form.get('incomingFlightCarrier').invalid) {
    //       return;
    //     }


    //     const shipments = this.form.getRawValue();
    //     if (shipments.shipmentSummary) {
    //       let count = 0;
    //       for (const eachRow of shipments.shipmentSummary) {
    //         if (eachRow.select) {
    //           if (this.form.get(['shipmentSummary', count]).invalid) {
    //             return;
    //           }
    //           count++;
    //         }
    //       }
    //     }

    //     this.form.validate();
    //     if (this.form.invalid) {
    //       return;
    //     }

    //     // For pre-lodge
    //     if (this.form.get('acceptanceType').value === 'PRE_LODGE_SHIPMENT'
    //     ) {
    //       // get the selected shipment 

    //       let rowCount = 0;
    //       var index = null;
    //       const shipments = this.form.getRawValue();
    //       if (shipments.shipmentSummary) {
    //         for (const eachRow of shipments.shipmentSummary) {
    //           if (eachRow.select) {
    //             rowCount++;
    //           }
    //         }
    //       }
    //       if (rowCount === 0) {
    //         this.showWarningStatus('export.select.shipment.save.');
    //         return;
    //       } else if (rowCount > 1) {
    //         this.showWarningStatus('export.select.only.one.shipment.save');
    //         return
    //       }
    //       for (var i = 0; i < shipments.shipmentSummary.length; i++) {
    //         if (shipments.shipmentSummary[i].select) {
    //           index = i;
    //         }
    //       }
    //       const eStartAcceptanceData = (<NgcFormGroup>this.form.get(['shipmentSummary', index])).getRawValue();
    //       eStartAcceptanceData.acceptanceService.agentCode = this.form.get('agentCode').value;
    //       eStartAcceptanceData.acceptanceService.agentName = this.form.get('agentName').value;
    //       eStartAcceptanceData.acceptanceService.serviceNumber = this.form.get('serviceNumber').value;
    //       eStartAcceptanceData.acceptanceService.acceptanceType = this.form.get('acceptanceType').value;
    //       eStartAcceptanceData.acceptanceService.authorizationIdentificationName = this.form.get('authorizationIdentificationName').value;
    //       eStartAcceptanceData.acceptanceService.authorizationIdentificationNumber = this.form.get('authorizationIdentificationNumber').value;
    //       eStartAcceptanceData.shipment.svc = this.form.get('svc').value;
    //       if (eStartAcceptanceData.shipment.customStatus === 'ACCEPTED') {
    //         this.showErrorMessage('export.shipment.accepted.cannot.modify');
    //         return;
    //       }

    //       this._acceptanceService.isFlightExistInCurrentCosysSummary(eStartAcceptanceData).subscribe(response => {
    //         if (!response.messageList) {

    //           if (response.data.handledInCurrentCosys === true) {


    //             this.showConfirmMessage('g.flight.not.handled.confirmation').then(fulfilled => {
    //               this._acceptanceService.onSaveAwbInformation(eStartAcceptanceData).subscribe(response => {
    //                 this.showResponseErrorMessages(response);
    //                 if (!response.messageList) {
    //                   this.showSuccessStatus('g.completed.successfully');
    //                 } else {
    //                   const errors = response.messageList;
    //                   if (errors[0].message != null) {
    //                     this.showErrorStatus(errors[0].message);
    //                   } else if (errors[0].code != null) {
    //                     this.showResponseErrorMessages(response);
    //                   } else {
    //                     this.showErrorStatus("data.invalid.dummy.entry");
    //                   }
    //                 }
    //               });
    //               return;
    //             }
    //             ).catch(reason => {

    //               return;
    //             });


    //           } else {
    //             this._acceptanceService.onSaveAwbInformation(eStartAcceptanceData).subscribe(response => {
    //               this.showResponseErrorMessages(response);
    //               if (!response.messageList) {
    //                 this.showSuccessStatus('g.completed.successfully');
    //               } else {
    //                 const errors = response.messageList;
    //                 if (errors[0].message != null) {
    //                   this.showErrorStatus(errors[0].message);
    //                 } else if (errors[0].code != null) {
    //                   this.showResponseErrorMessages(response);
    //                 } else {
    //                   this.showErrorStatus("data.invalid.dummy.entry");
    //                 }
    //               }
    //             });
    //             return;
    //           }
    //         } else {
    //           const errors = response.messageList;
    //           if (errors[0].message != null) {
    //             this.showErrorStatus(errors[0].message);
    //           } else if (errors[0].code != null) {
    //             this.showResponseErrorMessages(response);
    //           } else {
    //             this.showErrorStatus("data.invalid.dummy.entry");
    //           }
    //         }


    //       });
    //     } else {
    //       //End for pre-lodge
    //       const selectedShipment = [];
    //       let rowCount = 0;
    //       const rowData = this.form.getRawValue();
    //       if (rowData.shipmentSummary) {
    //         for (const eachRow of rowData.shipmentSummary) {
    //           if (eachRow.select) {
    //             rowCount++;
    //           }
    //         }
    //         // if (rowCount === 0) {
    //         //   this.showWarningStatus('Select Shipment to Save Shipment.');
    //         //   return;
    //         // }
    //         for (const eachRow of rowData.shipmentSummary) {
    //           if (eachRow.select && rowCount > 0) {
    //             this.statusRequest = eachRow.shipment.customStatus;
    //             eachRow.shipment.pouchReceived = eachRow.shipment.pouchReceived === '1' ? 1 : eachRow.shipment.pouchReceived === '0' ? 0 : null;
    //             selectedShipment.push(eachRow);
    //           } else if (rowCount == 0) {
    //             this.statusRequest = eachRow.shipment.customStatus;
    //             eachRow.shipment.pouchReceived = eachRow.shipment.pouchReceived === '1' ? 1 : eachRow.shipment.pouchReceived === '0' ? 0 : null;
    //             selectedShipment.push(eachRow);
    //           }
    //         }
    //       }
    //       for (const eachRow of selectedShipment) {
    //         eachRow.acceptanceService.status = this.statusRequest;
    //         eachRow.acceptanceService.serviceNumber = rowData.serviceNumber;
    //         eachRow.acceptanceService.trmNumber = this.form.get('trmNumber').value;

    //         eachRow.acceptanceService.incomingFlightCarrier = this.form.get('incomingFlightCarrier').value;
    //         if (this.form.get('incomingFlightCarrier').value != null && this.form.get('incomingFlightNumber').value != null) {
    //           let flightKey: any = this.form.get('incomingFlightCarrier').value + this.form.get('incomingFlightNumber').value;
    //           eachRow.acceptanceService.incomingFlight = flightKey;
    //         } else {
    //           eachRow.acceptanceService.incomingFlight = null;
    //         }

    //         eachRow.acceptanceService.incomingFlightDate = this.form.get('incomingFlightDate').value;

    //         eachRow.acceptanceService.acceptanceType = rowData.acceptanceType;
    //         eachRow.acceptanceService.agentCode = this.form.get('agentCode').value;
    //         eachRow.acceptanceService.agentName = this.form.get('agentName').value;
    //         eachRow.acceptanceService.authorizationIdentificationName = this.form.get('authorizationIdentificationName').value;
    //         eachRow.acceptanceService.authorizationIdentificationNumber = this.form.get('authorizationIdentificationNumber').value;
    //       }
    //       const reqObjForShipmentList: any = new Object();
    //       reqObjForShipmentList.shipmentList = selectedShipment;
    //       let saveFlag: boolean = true;
    //       reqObjForShipmentList.shipmentList.forEach(element => {
    //         element.shipment.svc = this.form.get('svc').value;
    //         if (element.shipment.customStatus === 'ACCEPTED') {
    //           this.showErrorMessage('export.shipment.accepted.cannot.modify');
    //           saveFlag = false;
    //           return;
    //         }
    //       });

    //       if (saveFlag) {





    //         this._acceptanceService.isFlightExistInCurrentCosysSummary(reqObjForShipmentList).subscribe(response => {
    //           if (!response.messageList) {

    //             if (response.data.handledInCurrentCosys === true) {


    //               this.showConfirmMessage('g.flight.not.handled.confirmation').then(fulfilled => {
    //                 this._acceptanceService.startEFromShipment(reqObjForShipmentList).subscribe(response => {
    //                   if (!this.showResponseErrorMessages(response)) {
    //                     this.showSuccessStatus('g.completed.successfully');
    //                   }
    //                 }, error => this.showErrorStatus('g.error'));
    //               }
    //               ).catch(reason => {

    //                 return;
    //               });


    //             } else {
    //               this._acceptanceService.startEFromShipment(reqObjForShipmentList).subscribe(response => {
    //                 if (!this.showResponseErrorMessages(response)) {
    //                   this.showSuccessStatus('g.completed.successfully');
    //                 }
    //               }, error => this.showErrorStatus('g.error'));
    //             }
    //           } else {
    //             const errors = response.messageList;
    //             if (errors[0].message != null) {
    //               this.showErrorStatus(errors[0].message);
    //             } else if (errors[0].code != null) {
    //               this.showResponseErrorMessages(response);
    //             } else {
    //               this.showErrorStatus("data.invalid.dummy.entry");
    //             }
    //           }


    //         });
    //       }
    //     }
    //   }
    // });
    //  }

  }

  /**
  * This function will take on the AWB Information screen along with the data saved for the user
  * @param value event
  */
  onAddShipment(event) {
    const requestObj = this.form.getRawValue();
    // Validate newly added Shipment number
    if (!/^\d+$/.test(requestObj.addedShipmentNumber)) {
      this.showErrorStatus('export.added.shipment.wrong');
      return;
    }
    for (let i = 0; i < requestObj.shipmentSummary.length; i++) {
      if (requestObj.shipmentSummary[i].acceptanceService.shipmentNumber == requestObj.addedShipmentNumber) {
        this.showErrorStatus("export.duplicate.data.input.other.awb");
        return;
      }
    }

    if (requestObj.addedShipmentNumber) {
      const requestObjToSend = {
        agentCode: requestObj.agentCode,

        awbNumber: requestObj.addedShipmentNumber,
        acceptanceType: requestObj.acceptanceType,
        serviceNumber: requestObj.serviceNumber
      }

      this._acceptanceService.onAddShipment(requestObjToSend).subscribe(response => {
        const dataForAddShipment = response.data;
        this.showResponseErrorMessages(response);
        this.form.get('addedShipmentNumber').setValue('');
        (<NgcFormArray>this.form.controls['shipmentSummary']).addValue(dataForAddShipment);
      }, error => this.showErrorStatus('g.error'));
    } else {
      this.showErrorStatus('export.enter.awb.before.add');
    }
  }

  routeToDG() {
    const rowData = (<NgcFormArray>this.form.get('shipmentSummary')).getRawValue();
    let rowCount = 0;
    let shipmentDetails = null;
    if (rowData) {
      for (const eachRow of rowData) {
        if (eachRow.select) {
          rowCount++;
          shipmentDetails = eachRow;
        }
      }
    }

    if (rowCount == 0) {
      this.showWarningStatus('export.select.a.shipment');
      return;
    }

    if (rowCount > 1) {
      this.showWarningStatus('export.select.one.shipment.at.time');
      return;
    }
    const eAcceptanceData = (<NgcFormGroup>this.form.get(['shipmentSummary', rowCount - 1])).getRawValue();
    let shipmentNumber = eAcceptanceData.acceptanceService.shipmentNumber;

    this.navigateTo(this.router, '/export/dangerousgoods/dgdradioactive', eAcceptanceData.acceptanceService);

  }


  onClickOfFreightAcceptance(event) {



    const rowData = (<NgcFormArray>this.form.get('shipmentSummary')).getRawValue();
    let rowCount = 0;
    let shipmentDetails = null;
    if (rowData) {
      for (const eachRow of rowData) {
        if (eachRow.select) {
          rowCount++;
          shipmentDetails = eachRow;
        }
      }
    }

    if (rowCount == 0) {
      this.showWarningStatus('export.select.a.shipment.start.freight.acceptance');
      return;
    }

    if (rowCount > 1) {
      this.showWarningStatus(NgcUtility.translateMessage("export.start.freight.acceptance.selected.shipment", [rowCount.toString()]));
      return;
    }

    //Update piece & weight in booking    
    //this._acceptanceService.updateBooking(shipmentDetails);
    let cargo: CargoWeighingRevisedServiceModelRevised = new CargoWeighingRevisedServiceModelRevised();



    //
    let index = 0;
    for (const eachRow of rowData) {
      if (eachRow.select) {
        const shipmentObj: ShipmentModel = new ShipmentModel();

        if (eachRow.acceptanceService.awbNumber) {
          shipmentObj.shipmentNumber = eachRow.acceptanceService.awbNumber;
          shipmentObj.customStatus = eachRow.shipment.customStatus;
          cargo.shipmentModel = shipmentObj;
          //   this.callFreightRuleExecution(index);



          const eAcceptanceData = (<NgcFormGroup>this.form.get(['shipmentSummary', index])).getRawValue();

          this.exportService.fetchStartFreightRuleExecutionList(eAcceptanceData).subscribe(response => {
            if (response.messageList != null && response.messageList.length > 0) {
              var message = response.messageList[0];
              if (message.code === 'DG_DETAILS_REQ_VALIDATION' || message.code === 'CPE.DYN.ERRORS') {
                if (message.type === 'E') {
                  if (message.code === 'CPE.DYN.ERRORS' && message.placeHolder != null) {

                    this.showErrorStatus(message.placeHolder[0]);
                  } if (message.code === 'DG_DETAILS_REQ_VALIDATION') {
                    this.showErrorStatus(message.code);
                  }

                  return;
                } else {
                  this.showConfirmMessage(message.code).then(fulfilled => {
                    if (response.success == true || response.messageList == null) {
                      this.showInfoStatus("expaccpt.rules.create.sucess");
                      this.callRuleExecution(cargo, eachRow.acceptanceService.awbNumber);
                    }
                  }).catch(reason => {

                  })
                }
              }

            } else {
              if (response.success == true || response.messageList == null) {
                this.showInfoStatus("expaccpt.rules.create.sucess");
                this.callRuleExecution(cargo, eachRow.acceptanceService.awbNumber);
              }
            }

          })



          //  this.navigateTo(this.router, '/export/acceptance/manageacceptanceweighingrevised', eachRow.acceptanceService.awbNumber);
        } else {
          shipmentObj.shipmentNumber = eachRow.acceptanceService.shipmentNumber;
          shipmentObj.customStatus = eachRow.shipment.customStatus;
          cargo.shipmentModel = shipmentObj;
          const eAcceptanceData = (<NgcFormGroup>this.form.get(['shipmentSummary', index])).getRawValue();
          this.exportService.fetchStartFreightRuleExecutionList(eAcceptanceData).subscribe(response => {

            if (response.messageList != null && response.messageList.length > 0) {
              var message = response.messageList[0];
              if (message.code === 'DG_DETAILS_REQ_VALIDATION' || message.code === 'CPE.DYN.ERRORS') {
                if (message.type === 'E') {
                  if (message.code === 'CPE.DYN.ERRORS' && message.placeHolder != null) {

                    this.showErrorStatus(message.placeHolder[0]);
                  } if (message.code === 'DG_DETAILS_REQ_VALIDATION') {
                    this.showErrorStatus(message.code);
                  }

                  return;
                } else {
                  this.showConfirmMessage(message.code).then(fulfilled => {
                    if (response.success == true || response.messageList == null) {
                      this.showInfoStatus("expaccpt.rules.create.sucess");
                      this.callRuleExecution(cargo, eachRow.acceptanceService.shipmentNumber);
                    }
                  }).catch(reason => {

                  })
                }
              } else {

                this.showErrorMessage(message.code);
              }
            } else {
              if (response.success == true || response.messageList == null) {
                this.showInfoStatus("expaccpt.rules.create.sucess");
                this.callRuleExecution(cargo, eachRow.acceptanceService.shipmentNumber);
              }
            }
          })
          //  this.navigateTo(this.router, '/export/acceptance/manageacceptanceweighingrevised', eachRow.acceptanceService.shipmentNumber);
        }
      }
      index = index + 1;
    }
  }



  // callFreightRuleExecution(index: any) {
  //   const eAcceptanceData = (<NgcFormGroup>this.form.get(['shipmentSummary', index])).getRawValue();

  //   this.exportService.fetchStartFreightRuleExecutionList(eAcceptanceData).subscribe(response => {
  //     if (response.success == true || response.messageList == null) {
  //       this.showInfoStatus("expaccpt.rules.create.sucess");
  //     }
  //   })
  // }
  callRuleExecution(cargo: CargoWeighingRevisedServiceModelRevised, shipmentNumber: any) {
    this.exportService.fetchRuleShipmentExecutionListAcceptance(cargo).subscribe(response => {
      let ruleShipmentExecutionDetails: any;
      if (response.success == true || response.messageList == null) {


        // this.showSuccessStatus('g.completed.successfully');
        ruleShipmentExecutionDetails = response.data.ruleShipmentExecutionDetails;
        // this.weighingForm.get('ruleShipmentExecutionDetails').patchValue(response.data.ruleShipmentExecutionDetails);
        // if (response.data.acknowledgeindicatornotclose == false) {
        //   this.actionlistindicator = "error"
        // } else {

        //   this.actionlistindicator = "";
        // }
        if (
          (ruleShipmentExecutionDetails.execInfoList.length > 0 && ruleShipmentExecutionDetails.execInfoList[0].status != "CLOSED")
        ) {
          this.showErrorMessage("exp.accpt.actionlist.pendingitems");
          return;
        }
        if (
          (ruleShipmentExecutionDetails.execWarnList.length > 0 && ruleShipmentExecutionDetails.execWarnList[0].status != "CLOSED")
        ) {
          this.showErrorMessage("exp.accpt.actionlist.pendingitems");
          return;
        }

        if (
          (ruleShipmentExecutionDetails.execErrorList.length > 0 && ruleShipmentExecutionDetails.execErrorList[0].status != "CLOSED")
        ) {
          this.showErrorMessage("exp.accpt.actionlist.pendingitems");
          return;
        }
        if (cargo.shipmentModel.customStatus === 'SERVICING' || cargo.shipmentModel.customStatus === 'ACCEPTED') {
          this.navigateTo(this.router, '/export/acceptance/manageacceptanceweighingrevised', shipmentNumber);
        } else {
          this.showErrorMessage("expaccpt.eacceptnace.not.done");
          return;
        }

      }
    });
  }
  // export/acceptance/rejectshipment
  rejectShipment(index) {
    const rejectedShipment = this.form.getRawValue();
    const awbNumberToReject = rejectedShipment.shipmentSummary[index].acceptanceService.shipmentNumber;
    this.navigateTo(this.router, '/export/acceptance/rejectshipment', awbNumberToReject);
  }

  navigateToFlow(requestToAwbInformation) {
    if (this.showEccFlag) {
      this.navigate('export/acceptance/managecargoawbinformation', requestToAwbInformation);
    } else if (this.showNawbShipmentFlag) {
      this.navigate('export/acceptance/managecargonawbshipment', requestToAwbInformation);
    } else if (this.showTruckingSurfFlag) {
      this.navigate('export/acceptance/managecargotruckingsurf', requestToAwbInformation);
    } else if (this.showLocalCourierFlag) {
      requestToAwbInformation.shipmentType = 'UCB';
      this.navigate('export/acceptance/managecargolocalcourier', requestToAwbInformation);
    } else if (this.showTruckingFlightFlag) {
      this.navigate('export/acceptance/managecargotruckingflight', requestToAwbInformation);
    } else if (this.showPreLodgeShipmentFlag) {
      this.navigate('export/acceptance/managecargoprelodge', requestToAwbInformation);
    } else if (this.showEReadyShipmentFlag) {
      this.navigate('export/acceptance/managecargoereadyshipment', requestToAwbInformation);
    } else if (this.showTerminalToTerminalFlag) {
      this.navigate('export/acceptance/managecargoawbinformation', requestToAwbInformation);
    } else if (this.showTrnashipmentCourierFlag) {
      requestToAwbInformation.shipmentType = 'UCB';
      this.navigate('export/acceptance/managecargotranshipmentcourier', requestToAwbInformation);
    }
  }

  onSelectAcceptanceType(event) {
    this.flagAsFalse();
    this.form.get('authorizationIdentificationName').clearValidators();
    this.form.get('authorizationIdentificationNumber').clearValidators();
    this.showAcceptanceData = false;
    if (event.code === 'TRANSHIPMENT_COURIER') {
      this.showTrnashipmentCourierFlag = true;
    } else if (event.code === 'NAWB_SHIPMENT') {
      // this.disabeSaveFlag = true;
      this.showNawbShipmentFlag = true;
    } else if (event.code === 'PRE_LODGE_SHIPMENT') {
      // this.disabeSaveFlag = true;
      this.showPreLodgeShipmentFlag = true;
      //
      // authorizationIdentificationName: new NgcFormControl(),
      //   authorizationIdentificationNumber: new NgcFormControl(),
      //
    } else if (event.code === 'TRUCKING_SERVICE_SURF') {
      this.showTruckingSurfFlag = true;
    } else if (event.code === 'TRUCKING_SERVICE_FLIGHT') {
      this.showTruckingFlightFlag = true;
    } else if (event.code === 'TERMINAL_TO_TERMINAL') {
      this.showTerminalToTerminalFlag = true;
    } else if (event.code === 'LOCAL_COURIER') {
      // this.disabeSaveFlag = true;
      this.showLocalCourierFlag = true;
    } else if (event.code === 'E_READY_SHIPMENTS') {
      // this.disabeSaveFlag = true;
      this.showEReadyShipmentFlag = true;
    } else if (event.code === 'ECC_ACCEPTANCE') {
      this.showEccFlag = true;


    }
  }

  flagAsFalse() {
    this.showEccFlag = false;
    // this.disabeSaveFlag = false;
    this.showNawbShipmentFlag = false;
    this.showTruckingSurfFlag = false;
    this.showLocalCourierFlag = false;
    this.showTruckingFlightFlag = false;
    this.showEReadyShipmentFlag = false;
    this.showPreLodgeShipmentFlag = false;
    this.showTerminalToTerminalFlag = false;
    this.showTrnashipmentCourierFlag = false;
  }

  onClear() {
    this.authorizationIdentificationName = '';
    this.authorizationIdentificationNumber = '';
    this.trmNumber = '';
    this.carrierCode = '';
    this.incomingFlightNumber = '';
    this.incomingFlightDate = '';
    this.forwardedAgentCode = '';
    this.forwardedAgentName = '';
    this.forwardedIncomingFlight = '';
    this.form.reset();
    this.form.clearValidators();
    this.clearErrorList();
    this.showAcceptanceData = false;

    this.afterSuccessSearchFlag = false;
    this.showTrnashipmentCourierFlag = false;
    this.form.get('trmNumber').clearValidators();
    this.form.get('incomingFlightCarrier').clearValidators();
    this.form.get('incomingFlightNumber').clearValidators();
    this.form.get('incomingFlightDate').clearValidators();
    this.async(() => {
      try {
        (this.form.get('awbNumber') as NgcFormControl).focus();
      } catch (e) { }
    });
    this.validEready = true;
  }

  onClearFilter(event) {
    this.form.get(['serviceNumber']).setValue('');
    this.form.get(['serviceTerminal']).setValue('');
    this.form.get(['agentCode']).setValue('');
    this.form.get(['status']).setValue('');

    (<NgcFormArray>this.form.controls['serviceNumberList']).patchValue((<NgcFormArray>this.form.get('originalServiceNumberList')).getRawValue());
  }

  onSearchFilter(event) {
    const dataArrayToFilter = (<NgcFormArray>this.form.get('serviceNumberList')).getRawValue();
    if (this.form.get(['serviceNumber']).value !== null) {
      let filteredSN = dataArrayToFilter
        .filter(ele => ele.serviceNumber.startsWith(this.form.get(['serviceNumber']).value));
      (<NgcFormArray>this.form.controls['serviceNumberList']).patchValue(filteredSN);
    }
    if (this.form.get(['agentCode']).value !== null) {
      let filteredAC = dataArrayToFilter
        .filter(ele => ele.agentCode.startsWith(this.form.get(['agentCode']).value));
      (<NgcFormArray>this.form.controls['serviceNumberList']).patchValue(filteredAC);
    }
    if (this.form.get(['status']).value !== null) {
      let filteredS = dataArrayToFilter
        .filter(ele => ele.status.startsWith(this.form.get(['status']).value));
      (<NgcFormArray>this.form.controls['serviceNumberList']).patchValue(filteredS);
    }
    if (this.form.get(['serviceTerminal']).value !== null) {
      let filteredS = dataArrayToFilter
        .filter(ele => ele.terminal.startsWith(this.form.get(['serviceTerminal']).value));
      (<NgcFormArray>this.form.controls['serviceNumberList']).patchValue(filteredS);
    }
  }

  deleteShipmntSummary(index) {
    (this.form.get(['shipmentSummary', index]) as NgcFormGroup).markAsDeleted();
  }
  onClickFlightPlanner() {
    this.navigateTo(this.router, '/export/planning-list', this.dataRetrievedFromManageAWB);
  }

  onSelectPrinter(event) {
    this.printerNameForAT = event.desc;
  }

}
