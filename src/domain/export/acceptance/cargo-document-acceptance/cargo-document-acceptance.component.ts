import { request } from 'http';
// import { CargoAcceptanceRequest } from './../../export.sharedmodel';
import { AcceptanceService } from '../acceptance.service';
import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, PageConfiguration, NgcUtility
} from 'ngc-framework';
import { FormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-cargo-document-acceptance',
  templateUrl: './cargo-document-acceptance.component.html',
  styleUrls: ['./cargo-document-acceptance.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  restorePageOnBack: true,
  autoBackNavigation: true 
})

export class CargoDocumentAcceptanceComponent extends NgcPage {
  resp: any;
  arrayUser: any;
  private response;
  nextFlag = false;
  acceptanceTypeRequest: any;
  editItemServiceNumber: any;
  disableControls: any = false;
  disableCourierTranshipment: any = false;
  disableContractorICPass = false;
  authorizationIdentificationNameRequest: any;
  authorizationIdentificationNumberRequest: any;
  agentCodeFlag = true;
  agentNameFlag = true;
  @ViewChild('window') window: NgcWindowComponent;
  private form: NgcFormGroup = new NgcFormGroup({
    status: new NgcFormControl(),
    agentCode: new NgcFormControl(),
    agentName: new NgcFormControl(),
    awbNumber: new NgcFormControl('',[Validators.maxLength(11)]),
    serviceNumber: new NgcFormControl(),
    incomingFlight: new NgcFormControl(),
    serviceTerminal: new NgcFormControl(),
    serviceNumberList: new NgcFormArray([]),
    incomingFlightDate: new NgcFormControl(),
    serviceNumberLength: new NgcFormControl(),
    serviceCreationDate: new NgcFormControl(),
    authorizationIdentificationName: new NgcFormControl(),
    authorizationIdentificationNumber: new NgcFormControl(),
    customerId: new NgcFormControl(),
    acceptanceType: new NgcFormControl('PRE_LODGE_SHIPMENT')
  });
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router
    , private _acceptanceService: AcceptanceService) {
    super(appZone, appElement, appContainerElement);
  }
  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    super.ngOnInit();
    this.nextFlag = false;
    this.form.controls.acceptanceType.valueChanges.subscribe(
      (newValue) => {
        this.disableCourierTranshipment = false;
        // this.disableContractorICPass = true;
        if (newValue === 'PRE_LODGE_SHIPMENT' || newValue === 'TRUCKING_SERVICE_FLIGHT'
          || newValue === 'TRUCKING_SERVICE_SURF' || newValue === 'TERMINAL_TO_TERMINAL') {
          this.disableCourierTranshipment = false;
        }
        if (newValue === 'TRANSHIPMENT_COURIER') {
          this.disableCourierTranshipment = true;
        }
      }
    );
  }
  /**
  * On Destroy
  */
  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
  /**
  * This function is responsible for Searching
  */
  onSearch() {
    this.disableControls = true;
    let subscribeFlag = false;
    // const request1 = this.form.getRawValue();
    // const request: CargoAcceptanceRequest = request1;
    const request1 = this.form.getRawValue();
    this.acceptanceTypeRequest = request1.acceptanceType;
    //
    if (!(request1.awbNumber || request1.serviceNumber)) {
      if (request1.incomingFlight && request1.incomingFlightDate) {
        subscribeFlag = true;
      } else if (!(request1.acceptanceType === 'TRANSHIPMENT_COURIER')) {
        subscribeFlag = false;
        this.showErrorStatus('expaccpt.provide.awb.service.no');
      } else {
        subscribeFlag = true;
      }
    } else {
      subscribeFlag = true;
    }
    
    if (subscribeFlag) {
      this._acceptanceService.getContractorInformation(request1).subscribe(data => {
        // this.form.reset();
        this.resp = data;
        if (data.data) {
          this.disableControls = true;
          this.refreshFormMessages(data);
          // this.resp.data.serviceCreationDate = this.resp.data.serviceCreationDate.toUpperCase();
          this.form.patchValue(this.resp.data);
          this.form.controls.acceptanceType.setValue(request1.acceptanceType);
          this.form.controls['agentCode'].value !== null ? this.agentCodeFlag = true : this.agentCodeFlag = false;
          this.form.controls['agentName'].value !== null ? this.agentNameFlag = true : this.agentNameFlag = false;
        } else {
          this.disableControls = false;
          this.showErrorStatus('expaccpt.awb.not.exists');
        }
      });
    }
    // this.authorizationIdentificationNameRequest = request.authorizationIdentificationName;
    // this.authorizationIdentificationNumberRequest = request.authorizationIdentificationNumber;
  }
  /**
  * This function is responsible for Searching
  */
  onServiceNumber() {
    this._acceptanceService.onServiceNumber().subscribe(data => {
      this.resp = data;
      this.arrayUser = this.resp.data;
      (<NgcFormArray>this.form.controls['serviceNumberList']).patchValue(this.arrayUser);
    }, error => this.showErrorStatus('g.error'));
    this.window.open();
  }

  /**
  * This function will take on the Update User along with the data saved for the user
  * @param value Value
  */
  public onValidate(value) {
    const requestValidate = this.form.getRawValue();
    this._acceptanceService.onValidateContractor(requestValidate).subscribe(data => {
      this.resp = data.data;
      if (!this.resp || (this.resp && this.resp.length === 0)) {
        this.showConfirmMessage('expaccpt.contractor.not.recognized').then(fulfilled => {
          this.nextFlag = true;
        }
        ).catch(reason => {
        });
      } else {
        this.nextFlag = true;
        this.form.controls['authorizationIdentificationName'].setValue(
          this.resp[0].authorizationIdentificationName);
      }
    });
  }

  public onNext(value) {
    const request = this.form.getRawValue();
    request.acceptanceType = this.acceptanceTypeRequest;
    this._acceptanceService.dataFromCargoAcceptanceToShipmentSummary = request;
    const summaryForm = this._acceptanceService.dataFromCargoAcceptanceToShipmentSummary;
    if (summaryForm.authorizationIdentificationName === ''
      ||summaryForm.authorizationIdentificationName === null
      ||summaryForm.authorizationIdentificationNumber === ''
      ||summaryForm.authorizationIdentificationNumber === null) {
      this.showErrorStatus('expaccpt.contractor.id.name.blank');
      return;
    } else {
      this.router.navigate(['export', 'acceptance', 'shipmentsummary']);
    }
  }

  /**
 * Function which is called when a link in datatable is called
 * @param event
 */
  public onLinkClick(event) {
    if (event.type === 'link') {
      const columnName = event.column;
      const record = event.record;
      this.editItemServiceNumber = event.record.serviceNumber;
      this.form.get('serviceNumber').patchValue(this.editItemServiceNumber);
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
    this.form.get('authorizationIdentificationName').setValue(object.desc);
  }

  onAgentNameAutoFill(object, item) {
    // onAgentNameAutoFill
    this.form.get('agentName').setValue(object.desc);
  }

  onSearchFilter(event, array: any[]) {
    const filtered = this.arrayUser
      .filter(ele => ele.serviceNumber.startsWith(this.form.get(['serviceTerminal']).value));
    (<NgcFormArray>this.form.controls['serviceNumberList']).patchValue(filtered);
  }
}
