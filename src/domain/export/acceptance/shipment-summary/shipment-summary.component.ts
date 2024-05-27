import { async } from '@angular/core/testing';
import { request } from 'http';
import { filter } from 'rxjs/operators';
import { AcceptanceService } from './../acceptance.service';
import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, PageConfiguration, NgcUtility, MessageType, NotificationMessage
} from 'ngc-framework';
import { FormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'ngc-shipment-summary',
  templateUrl: './shipment-summary.component.html',
  styleUrls: ['./shipment-summary.component.scss']
})
@PageConfiguration({
  trackInit: true,
})
export class ShipmentSummaryComponent extends NgcPage {
  ghaAgentFlag = false;
  eStartAcceptanceData: any;
  temp: any;
  contractorValidationFlag = false;
  sendData: any;
  ucbFlag: boolean;
  errors: any;
  statusRequest: any;
  hidePreLoadgeFlag: boolean;
  acceptanceTypeRequest: any;
  displayPreLoadgeFlag: boolean;
  authorizationIdentificationNameRequest: any;
  authorizationIdentificationNumberRequest: any;
  arrayUser: any;
  resp: any;
  dataRetrieved: any;
  acceptanceWeighingData: any;
  shipmentDetailsFlag = false;
  eStartShipemntScreenButtonFlag = false;
  eStartColumnFlag = true;
  editButtonFlag = false;
  validateButtonFlag = true;
  // 1st screen content START
  resp1: any;
  arrayUser1: any;
  private response;
  nextFlag = false;
  acceptanceTypeRequest1: any;
  editItemServiceNumber: any;
  disableControls: boolean = false;
  disableCourierTranshipment: boolean = false;
  disableContractorICPass = false;
  authorizationIdentificationNameRequest1: any;
  authorizationIdentificationNumberRequest1: any;
  agentCodeFlag = true;
  agentNameFlag = true;
  handlingDefination: any;
  @ViewChild('window') window: NgcWindowComponent;
  private form1st: NgcFormGroup = new NgcFormGroup({
    status: new NgcFormControl(),
    agentCode: new NgcFormControl(),
    agentName: new NgcFormControl(),
    awbNumber: new NgcFormControl('', [Validators.maxLength(11)]),
    shipmentNumber: new NgcFormControl(null),
    serviceNumber: new NgcFormControl(null, [Validators.maxLength(11)]),
    incomingFlight: new NgcFormControl(),
    serviceTerminal: new NgcFormControl(),
    serviceNumberList: new NgcFormArray([]),
    incomingFlightDate: new NgcFormControl(),
    serviceNumberLength: new NgcFormControl(),
    serviceCreationDate: new NgcFormControl(),
    authorizationIdentificationName: new NgcFormControl(),
    authorizationIdentificationNumber: new NgcFormControl(),
    acceptanceType: new NgcFormControl()
  });
  //  1st screen content ENDS
  private form: NgcFormGroup = new NgcFormGroup({
    // addShipment: new NgcFormControl(),
    addedShipmentNumber: new NgcFormControl('', [Validators.maxLength(11)]),
    serviceNumber: new NgcFormControl(),
    shipmentType: new NgcFormControl('AWB'),
    acceptanceType: new NgcFormControl(),
    agentCode: new NgcFormControl(),
    agentName: new NgcFormControl(),
    cashHandlingAgent: new NgcFormControl(),
    serviceCreationDate: new NgcFormControl(),
    contractorIcAirportPass: new NgcFormControl(),
    authorizationIdentificationName: new NgcFormControl(),
    authorizationIdentificationNumber: new NgcFormControl(),
    shipmentSummary: new NgcFormArray([])
  });
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef
    , private activatedRoute: ActivatedRoute, private router: Router,
    private _acceptanceService: AcceptanceService) {
    super(appZone, appElement, appContainerElement);
  }

  public ngOnInit() {
    super.ngOnInit();

    this.form.get('shipmentType').valueChanges.subscribe(
      (newValue) => {
        if (newValue) {
          if (newValue === 'UCB') {
            this.ucbFlag = false;
          } else {
            this.ucbFlag = true;
          }
        }
      });

    this.form1st.get('acceptanceType').valueChanges.subscribe(
      newVal => {
        this.disableCourierTranshipment = false;
        // this.disableContractorICPass = true;
        if (newVal === 'PRE_LODGE_SHIPMENT' || newVal === 'TRUCKING_SERVICE_FLIGHT'
          || newVal === 'TRUCKING_SERVICE_SURF' || newVal === 'TERMINAL_TO_TERMINAL'
          || newVal === 'LOCAL_COURIER') {
          this.disableCourierTranshipment = false;
        }
        if (newVal === 'TRANSHIPMENT_COURIER') {
          this.disableCourierTranshipment = true;
        }
        // eStart Column Flag disable for 
        if (newVal !== null) {
          if (newVal === 'PRE_LODGE_SHIPMENT'
            || newVal === 'E_READY_SHIPMENTS'
            || newVal === 'NAWB_SHIPMENT'
            || newVal === 'TRANSHIPMENT_COURIER') {
            this.eStartColumnFlag = false;
            this.editButtonFlag = true;
          }
        }
      }
    );

    this.form.get('shipmentType').valueChanges.subscribe(
      (newValue) => {
        if (newValue) {
          if (newValue === 'UCB') {
            this.ucbFlag = false;
          } else {
            this.ucbFlag = true;
          }
        }
      });

    // super.ngAfterViewInit(); 
    // 1st screen starts   
    // -------------------------------------------
    let pageFlag = this.getNavigateData(this.activatedRoute);
    if (pageFlag === true) {
      pageFlag = false;
      this.disableControls = false;
      this.form1st.reset();
      this.form.reset();
      this.form1st.get('awbNumber').patchValue(this._acceptanceService.dataToSearchOnShipmentSummary)
      this.onSearch();
      return;
    }
    // -------------------------------------------
    this.nextFlag = false;
    // 1st screen ends 
    // from Weighing to Shipment Summary screen.
    this.acceptanceWeighingData = this.getNavigateData(this.activatedRoute);
    if (this.acceptanceWeighingData !== null) {
      this.form1st.get('serviceNumber').patchValue(this.acceptanceWeighingData);
      this.onSearch();
      return;
    }

    this.dataRetrieved = this._acceptanceService.dataFromCargoAcceptanceToShipmentSummary;
    if (this.acceptanceWeighingData) {
      this.dataRetrieved.serviceNumber = this.acceptanceWeighingData;
      this.statusRequest = this.dataRetrieved.status;
      this.acceptanceTypeRequest = this.dataRetrieved.acceptanceType;
      this.authorizationIdentificationNameRequest = this.dataRetrieved.authorizationIdentificationName;
      this.authorizationIdentificationNumberRequest = this.dataRetrieved.authorizationIdentificationNumber;
      if (this.dataRetrieved.acceptanceType === 'PRE_LODGE_SHIPMENT'
        || this.dataRetrieved.acceptanceType === 'NAWB_SHIPMENT') {
        this.displayPreLoadgeFlag = false;
        this.eStartColumnFlag = false;
      } else {
        this.displayPreLoadgeFlag = true;
        this.ucbFlag = true;
      }
      this.form.patchValue(this.dataRetrieved);
      if (this.dataRetrieved.acceptanceType === 'TRUCKING_SERVICE_SURF'
        || this.dataRetrieved.acceptanceType === 'TRUCKING_SERVICE_FLIGHT'
        || this.dataRetrieved.acceptanceType === 'TERMINAL_TO_TERMINAL'
        || this.dataRetrieved.acceptanceType === 'LOCAL_COURIER') {
        this._acceptanceService.onValidateForAwbNoValidation(this.dataRetrieved).subscribe(data => {
          //  this.showResponseErrorMessages(data);
          this.resp = data;
          this.arrayUser = this.resp.data;
          this.arrayUser.forEach(element => {
            element.selectCheckForShipment = false;
          });
          (<NgcFormArray>this.form.controls['shipmentSummary']).patchValue(this.arrayUser);
          if (this.dataRetrieved.acceptanceType === 'LOCAL_COURIER') {
            this.form.get('shipmentType').setValue('UCB');
          } else {
            this.form.get('shipmentType').setValue('AWB');
          }
          this.showResponseErrorMessages(data);
        }, error => this.showErrorStatus('g.servernotresponding.m'));
      } else {
        this._acceptanceService.onValidate(this.dataRetrieved).subscribe(data => {
          //  this.showResponseErrorMessages(data);
          this.resp = data;
          this.arrayUser = this.resp.data;
          this.arrayUser.forEach(element => {
            element.selectCheckForShipment = false;
          });
          (<NgcFormArray>this.form.controls['shipmentSummary']).patchValue(this.arrayUser);
          this.form.get('shipmentType').setValue('AWB');
          this.showResponseErrorMessages(data);
        }, error => this.showErrorStatus('g.servernotresponding.m'));
      }
    }
  }


  /**
  * This function is responsible for adding new record
  */
  onAddRow() {
  }
  /**
  * This function will take on the AWB Information screen along with the data saved for the user
  * @param value Value
  */
  onAddShipment(value) {
    // this._acceptanceService.dataFromShipmentSummaryToAwbInformation = this.form.getRawValue();
    // this.router.navigate(['export', 'acceptance', 'awbinformation']);
    // const requestObj = this.form.getRawValue();
    const requestObj = this.form1st.getRawValue();
    requestObj.awbNumber = this.form.get('addedShipmentNumber').value;
    requestObj.shipmentType = this.form.get('shipmentType').value;
    if (requestObj.awbNumber) {
      this._acceptanceService.onValidateForAwbNoValidation(requestObj).subscribe(data => {
        //  this.showResponseErrorMessages(data);
        this.resp = null;
        this.resp = data.data;
        // this.arrayUser.push(this.resp);
        this.resp.forEach(element => {
          this.arrayUser.push(element);
        });
        if (this.arrayUser) {
          this.shipmentDetailsFlag = true;
          this.arrayUser.forEach(element => {
            element.selectCheckForShipment = false;

          });
        }
        this._acceptanceService.dataforShipmentList = this.arrayUser;
        (<NgcFormArray>this.form.controls['shipmentSummary']).patchValue(this.arrayUser);
        this.showResponseErrorMessages(data);
        this.form.get('addedShipmentNumber').reset();
      }, error => this.showErrorStatus('g.error'));
    } else {
      this.showErrorStatus('export.enter.shipment.number.before.add');
    }
  }
  /**
  * This function will take on the AWB Information screen along with the data saved for the user
  * @param value Value
  */
  startEFromShipment(index) {
    //   
    // const eStartAcceptanceData1 = this._acceptanceService.dataforShipmentList[index];   
    this.eStartAcceptanceData = (<NgcFormGroup>this.form.get(['shipmentSummary', index])).getRawValue();
    this.eStartAcceptanceData.acceptanceService.status = this.statusRequest;
    this.eStartAcceptanceData.acceptanceService.acceptanceType = this.form1st.get('acceptanceType').value;
    this.eStartAcceptanceData.acceptanceService.serviceNumber = this.form1st.get('serviceNumber').value;
    this.eStartAcceptanceData.acceptanceService.agentCode = this.form1st.get('agentCode').value;
    this.eStartAcceptanceData.acceptanceService.agentName = this.form1st.get('agentName').value;
    this.eStartAcceptanceData.acceptanceService.shipmentType = this.form.get('shipmentType').value;
    this.eStartAcceptanceData.acceptanceService.authorizationIdentificationName = this.form1st.get('authorizationIdentificationName').value;
    this.eStartAcceptanceData.acceptanceService.authorizationIdentificationNumber = this.form1st.get('authorizationIdentificationNumber').value;

    if (!this.form.valid && !this.form1st.valid) {
      this.showWarningMessage('export.mandatory.fields.missing');
      return;
    }
    //startEFromShipment
    this._acceptanceService.onStartEAcceptance(this.eStartAcceptanceData).subscribe(data1 => {
      this.resp = data1;
      // this.arrayUser = this.resp.data;

      if (!this.showResponseErrorMessages(data1.data)) {
        this.showSuccessStatus('g.completed.successfully');
        // this.editButtonFlag = false;
        // this.eStartShipemntScreenButtonFlag = true;
        this.form.get(['shipmentSummary', index, 'shipment', 'customStatus']).patchValue('SERVICING');
      }
    }, error => this.showErrorStatus('g.error'));
  }

  // onSave 
  onSave() {
    // -------------------------------
    this.form1st.validate();
    //
    if (this.form1st.invalid) {
      return;
    }
    let selectedShipment: any;
    let rowCount = 0;
    const rowData = (<NgcFormArray>this.form.get('shipmentSummary')).getRawValue();
    for (const eachRow of rowData) {
      if (eachRow.selectCheckForShipment) {
        rowCount++;
      }
    }
    if (rowCount > 1) {
      this.showWarningStatus('Select only one Shipment to Save. Selected: ' + rowCount);
      return;
    }
    if (rowCount === 0) {
      this.showWarningStatus('Select Shipment to Save Shipment.');
      return;
    }
    for (const eachRow of rowData) {
      if (eachRow.selectCheckForShipment) {
        eachRow.shipment.pouchReceived = eachRow.shipment.pouchReceived === '1' ? 1 : 0;
        selectedShipment = eachRow;
      }
    }
    // -------------------------------
    const eAcceptanceData = selectedShipment;
    eAcceptanceData.acceptanceService.status = this.statusRequest;
    eAcceptanceData.acceptanceService.acceptanceType = this.acceptanceTypeRequest;
    eAcceptanceData.acceptanceService.serviceNumber = this.form1st.get('serviceNumber').value;
    eAcceptanceData.acceptanceService.agentCode = this.form1st.get('agentCode').value;
    eAcceptanceData.acceptanceService.agentName = this.form1st.get('agentName').value;
    eAcceptanceData.acceptanceService.shipmentType = this.form.get('shipmentType').value;
    eAcceptanceData.acceptanceService.authorizationIdentificationName = this.form1st.get('authorizationIdentificationName').value;
    eAcceptanceData.acceptanceService.authorizationIdentificationNumber = this.form1st.get('authorizationIdentificationNumber').value;
    if (!this.form.valid && !this.form1st.valid) {
      this.showWarningMessage('export.mandatory.fields.missing');
      return;
    }
    //startEFromShipment
    this._acceptanceService.startEFromShipment(eAcceptanceData).subscribe(data1 => {
      this.resp = data1;
      // this.arrayUser = this.resp.data;

      if (!this.showResponseErrorMessages(data1)) {
        this.showSuccessStatus('g.completed.successfully');
        // this.editButtonFlag = false;
        // (<NgcFormArray>this.form.controls['shipmentSummary']).patchValue(this.arrayUser);
        // this.eStartShipemntScreenButtonFlag = true;
        // this.router.navigate(['cosys']);
      }
    }, error => this.showErrorStatus('g.error'));
  }
  /**
  * This function will take on the AWB Information screen along with the data saved for the user
  * @param value Value
  */
  onEdit(index) {
    this.form1st.validate();
    //
    if (this.form1st.invalid) {
      return;
    }
    this.temp = this._acceptanceService.dataforShipmentList;
    this.temp.data = this._acceptanceService.dataforShipmentList[index];
    this.temp.data.acceptanceService.status = this.statusRequest;
    this.temp.data.acceptanceService.acceptanceType = this.form1st.get('acceptanceType').value;
    this.temp.data.acceptanceService.serviceNumber = this.form1st.get('serviceNumber').value;
    this.temp.data.acceptanceService.agentCode = this.form1st.get('agentCode').value;
    this.temp.data.acceptanceService.agentName = this.form1st.get('agentName').value;
    this.temp.data.acceptanceService.shipmentType = this.form.get('shipmentType').value;
    this.temp.data.acceptanceService.authorizationIdentificationName = this.form1st.get('authorizationIdentificationName').value;
    this.temp.data.acceptanceService.authorizationIdentificationNumber = this.form1st.get('authorizationIdentificationNumber').value;
    this.temp.handlingDefination = this.handlingDefination;
    this._acceptanceService.dataFromShipmentSummaryToAwbInformation = this.temp;
    this.navigate('export/acceptance/awbinformation', {});
  }

  onClickOfFreightAcceptance(event) {
    let rowCount = 0;
    const rowData = (<NgcFormArray>this.form.get('shipmentSummary')).getRawValue();
    for (const eachRow of rowData) {
      if (eachRow.selectCheckForShipment) {
        rowCount++;
      }
    }
    if (rowCount > 1) {
      this.showWarningStatus('Select only one Shipment for Start Freight Acceptance. Selected ' + rowCount);
      return;
    }
    if (rowCount === 0) {
      this.showWarningStatus('Select Shipment to Start Freight Acceptance. Selected' + rowCount);
      return;
    }
    for (const eachRow of rowData) {
      if (eachRow.selectCheckForShipment) {
        this.sendData = eachRow;
      }
    }

    if (this.sendData.acceptanceService.awbNumber) {
      this.navigateTo(this.router, '/export/acceptance/manageacceptanceweighing',
        this.sendData.acceptanceService.awbNumber);
    } else {
      this.navigateTo(this.router, '/export/acceptance/manageacceptanceweighing',
        this.sendData.acceptanceService.shipmentNumber);
    }
  }

  // 1st screen starts 
  /**
  * This function is responsible for Searching
  */
  onSearch() {
    this.eStartShipemntScreenButtonFlag = false;
    this.shipmentDetailsFlag = false;
    this.eStartColumnFlag = true;
    let subscribeFlag = false;
    // const request1 = this.form1st.getRawValue();
    // const request: CargoAcceptanceRequest = request1;
    const request1 = this.form1st.getRawValue();
    //
    if (!(request1.awbNumber || request1.serviceNumber)) {
      if (request1.incomingFlight && request1.incomingFlightDate) {
        subscribeFlag = true;
      } else if (!(request1.acceptanceType === 'TRANSHIPMENT_COURIER')) {
        subscribeFlag = false;
        this.showErrorStatus('expaccpt.provide.awb.service.no');
        return;
      } else {
        subscribeFlag = true;
      }
    } else {
      subscribeFlag = true;
    }
    if (subscribeFlag) {
      this._acceptanceService.getContractorInformation(request1).subscribe(data => {
        this.showResponseErrorMessages(data);
        this.resp = data;
        // 
        if (data.data) {
          this.disableControls = true;
          this.form1st.patchValue(this.resp.data);
          this.acceptanceTypeRequest = data.data.acceptanceType;
          // this.form1st.controls.acceptanceType.setValue(request1.acceptanceType);.
          //-----------------------

          this.form1st.controls['agentCode'].value !== null ? this.agentCodeFlag = true : this.agentCodeFlag = false;
          this.form1st.controls['agentName'].value !== null ? this.agentNameFlag = true : this.agentNameFlag = false;
          this.form1st.controls['authorizationIdentificationName'].value !== null
            && this.form1st.controls['authorizationIdentificationName'].value !== '' ?
            this.validateButtonFlag = false : this.validateButtonFlag = true;
          this.form1st.controls['authorizationIdentificationNumber'].value !== null
            && this.form1st.controls['authorizationIdentificationNumber'].value !== '' ?
            this.eStartShipemntScreenButtonFlag = true : this.eStartShipemntScreenButtonFlag = false;
          // this.form1st.get('authorizationIdentificationName').patchValue()
          // login terminal are different
          if ((this.resp.data.logInTerminal !== null && this.resp.data.logInTerminal !== '')
            && (this.resp.data.logInTerminal !== request1.terminal)) {
            this.showConfirmMessage(NgcUtility.translateMessage('error.prelodged.login.acceptance.terminal',[this.resp.data.logInTerminal,request1.terminal])).then(fulfilled => {
                // this.eStartShipemntScreenButtonFlag = true;
                // continue;
                this.getShipemntDetails();
              }
              ).catch(reason => {
                return;
              });
          } else {
            this.getShipemntDetails();
          }
          // -- login validation ends 
          //this.getShipemntDetails();
          // HandlingDefination for Validation           
          if (this.resp.data.handlingDefination !== null) {
            //reseting the flags
            this.ghaAgentFlag = false;


            this.handlingDefination = this.resp.data.handlingDefination;
            const contractorCheckFlag = this.resp.data.handlingDefination[0].handlingDefinition[0].contractorDetailsRequired;
            if (contractorCheckFlag === '1') {
              this.contractorValidationFlag = true;
            } else {
              this.contractorValidationFlag = false;
            }
            // Pre-lodge req or not if req then auto populate GHA Agent 
            if (this.handlingDefination[0].handlingDefinition[0].requiredprelodging === '1') {
              this.ghaAgentFlag = true;
              //this.form1st.get('agentCode').patchValue('GHA');
            }
          } else {
            this.ghaAgentFlag = false;
            this.contractorValidationFlag = true;
          }
          if (this.contractorValidationFlag) {
            this.form1st.get('authorizationIdentificationNumber').setValidators([Validators.required]);
            this.form1st.get('authorizationIdentificationName').setValidators([Validators.required]);
          } else {
            this.form1st.get('authorizationIdentificationNumber').clearValidators();
            this.form1st.get('authorizationIdentificationName').clearValidators();
            this.eStartShipemntScreenButtonFlag = true;
            this.validateButtonFlag = false;
          }
        } else {
          this.disableControls = false;
          this.shipmentDetailsFlag = false;
          // this.showErrorStatus('expaccpt.awb.not.exists');
          return;
        }
      });
    }
  }
  /**
  * This function is responsible for Searching
  */
  onServiceNumber() {
    this._acceptanceService.onServiceNumber().subscribe(data => {
      this.resp = data;
      this.arrayUser = this.resp.data;
      (<NgcFormArray>this.form1st.controls['serviceNumberList']).patchValue(this.arrayUser);
    }, error => this.showErrorStatus('g.error'));
    this.window.open();
  }

  /**
 * This function will take on the Update User along with the data saved for the user
 * @param value Value
 */
  onValidate(value) {
    const requestValidate = this.form1st.getRawValue();
    this._acceptanceService.onValidateContractor(requestValidate).subscribe(data => {
      this.resp = data.data;
      if (!this.resp || (this.resp && this.resp.length === 0)) {
        this.showConfirmMessage('export.contractor.ic.airport.pass.not.recognized.confirmation').then(fulfilled => {
          // this.nextFlag = true;
          this.eStartShipemntScreenButtonFlag = true;
          // this.editButtonFlag = true;
        }
        ).catch(reason => {
        });
      } else if (this.resp[0].blackListFlag) {
        //this.show.sendNotificationMessage('Contractor is Black Listed, you can not continue?');
        this.showMessage('Contractor IC/Airport Pass is Black Listed.');
        return;
      } else if (this.resp[0].validationExpiredFlag) {
        this.showMessage('Contractor IC/Airport Pass is Validation is over.');
        return;
      }
      // {
      //   // this.nextFlag = true;
      this.eStartShipemntScreenButtonFlag = true;
      this.form1st.controls['authorizationIdentificationName'].setValue(
        this.resp[0].authorizationIdentificationName);
      // }
    });
  }

  onNext(value) {
    const request = this.form1st.getRawValue();
    request.acceptanceType = this.acceptanceTypeRequest;
    this._acceptanceService.dataFromCargoAcceptanceToShipmentSummary = request;
    const summaryForm = this._acceptanceService.dataFromCargoAcceptanceToShipmentSummary;
    if (summaryForm.authorizationIdentificationName === ''
      || summaryForm.authorizationIdentificationName === null
      || summaryForm.authorizationIdentificationNumber === ''
      || summaryForm.authorizationIdentificationNumber === null) {
      this.showErrorStatus('expaccpt.contractor.id.name.blank');
      return;
    } else {
      // No need navigate
      // this.router.navigate(['export', 'acceptance', 'shipmentsummary']);
    }
  }

  /**
  * Function which is called when a link in datatable is called
  * @param event
  */
  onLinkClick(event) {
    if (event.type === 'link') {
      const columnName = event.column;
      const record = event.record;
      this.editItemServiceNumber = event.record.serviceNumber;
      this.form1st.get('serviceNumber').patchValue(this.editItemServiceNumber);
      this.form1st.get('awbNumber').setValue('');
      this.window.close();
      this.disableControls = false;
    }
  }
  /**
   * onSelectAircraftType On Select Aircraft Type
   * @param object
   * @param item
   */
  onSelectContractor(object, item) {
    this.form1st.get('authorizationIdentificationName').setValue(object.desc);
  }

  onAgentNameAutoFill(object: any, item) {
    // onAgentNameAutoFill    
    if (this.ghaAgentFlag) {
      // let r =this.retrieveLOVRecord(object.code, "SQL_COMPANY_AGENT_LIST_GHA");
      this.retrieveLOVRecord(object.code, "SQL_COMPANY_AGENT_LIST_GHA").subscribe((record) => {
        this.form1st.get('agentName').setValue(record.desc);
      });
    } else {
      // onAgentNameAutoFill
      this.form1st.get('agentName').setValue(object.desc);
    }

  }

  onSearchFilter(event, array: any[]) {
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
  // 1st screen ends 

  // Getting all the shipment details 
  getShipemntDetails() {
    (<NgcFormArray>this.form1st.controls['serviceNumberList']).resetValue([]);
    const reqObjForShipmentInfo = this.form1st.getRawValue();
    if (reqObjForShipmentInfo.acceptanceType === 'PRE_LODGE_SHIPMENT') {
      this.displayPreLoadgeFlag = false;
    } else {
      this.displayPreLoadgeFlag = true;
      this.ucbFlag = true;
    }
    if (reqObjForShipmentInfo.acceptanceType === 'TRUCKING_SERVICE_SURF'
      || reqObjForShipmentInfo.acceptanceType === 'TRUCKING_SERVICE_FLIGHT'
      || reqObjForShipmentInfo.acceptanceType === 'TERMINAL_TO_TERMINAL'
      || reqObjForShipmentInfo.acceptanceType === 'LOCAL_COURIER') {
      this._acceptanceService.onValidateForAwbNoValidation(reqObjForShipmentInfo).subscribe(data => {
        //  this.showResponseErrorMessages(data);
        this.resp = data;
        this.arrayUser = this.resp.data;
        this._acceptanceService.dataforShipmentList = this.resp.data;
        if (this.arrayUser) {
          this.shipmentDetailsFlag = true;
          this.arrayUser.forEach(element => {
            element.selectCheckForShipment = false;
          });
        }
        (<NgcFormArray>this.form.controls['shipmentSummary']).patchValue(this.arrayUser);
        // this.form.get(['shipmentSummary', 0, 'acceptanceService', 'acceptanceType']).setValue(reqObjForShipmentInfo.acceptanceType);
        this.form.get(['shipmentSummary', 0, 'acceptanceService', 'acceptanceType']).setValue(this.form1st.get('acceptanceType').value);

        this.showResponseErrorMessages(data);
      }, error => this.showErrorStatus('g.error'));
    } else {
      this._acceptanceService.onValidate(reqObjForShipmentInfo).subscribe(data => {
        //  this.showResponseErrorMessages(data);
        this.resp = data;
        this.arrayUser = this.resp.data;
        this._acceptanceService.dataforShipmentList = this.resp.data;
        if (this.arrayUser) {
          this.shipmentDetailsFlag = true;
          this.arrayUser.forEach(element => {
            element.selectCheckForShipment = false;
          });
        }
        (<NgcFormArray>this.form.controls['shipmentSummary']).patchValue(this.arrayUser);
        this.form.get('shipmentType').setValue('AWB');
        // this.form.get(['shipmentSummary', 0, 'acceptanceService', 'acceptanceType']).setValue(reqObjForShipmentInfo.acceptanceType);
        this.form.get(['shipmentSummary', 0, 'acceptanceService', 'acceptanceType']).setValue(this.form1st.get('acceptanceType').value);
        this.showResponseErrorMessages(data);
      }, error => this.showErrorStatus('g.error'));
    }
  }

  // export/acceptance/rejectshipment
  rejectShipment(index) {
    const rejectedShipment = this.arrayUser[index].acceptanceService.awbNumber;
    this.navigateTo(this.router, '/export/acceptance/rejectshipment',
      rejectedShipment);
  }

  // public ngAfterViewInit() {
  //   // super.ngAfterViewInit();   
  //   this.subscribeAgentCode();
  // }

  // private subscribeAgentCode() {
  //   this.form1st.get('agentCode').valueChanges.subscribe(
  //     (newValue) => {
  //       if (newValue !== null && newValue !== '') {
  //           this.retrieveLOVRecord(newValue, "SQL_COMPANY_AGENT_LIST_GHA").subscribe((record) => {
  //           this.form1st.get('agentName').setValue(record.desc);          
  //         });
  //       }
  //     });
  // }


  /**
  * On Destroy
  */
  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnDestroy() {
    super.ngOnDestroy();
  }

  onClear(event) {
    // ShipmentSummaryComponent.call;    
    this.form.reset();
    this.form1st.reset();
    this.disableControls = false;
    this.shipmentDetailsFlag = false;
    this.eStartColumnFlag = true;
    this.eStartShipemntScreenButtonFlag = false;
  }
}
