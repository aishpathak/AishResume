import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcFormControl, PageConfiguration, NgcUtility } from 'ngc-framework';
import { ImportService } from "../import.service";
import { Validators } from '@angular/forms';
import { ShipmentDeliveryEquipmentReleaseModel } from "../import.sharedmodel";
import { Router, ActivatedRoute } from '@angular/router';
import { DuplicatenamepopupComponent } from '../../common/duplicatenamepopup/duplicatenamepopup.component';
@Component({
  selector: 'app-agent-issuedo',
  templateUrl: './agent-issuedo.component.html',
  styleUrls: ['./agent-issuedo.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class AgentIssuedoComponent extends NgcPage implements OnInit {
  @ViewChild('duplicateNamePopup') duplicateNamePopup: DuplicatenamepopupComponent;

  clearingAgentParam: any;
  agentIssueDoSaveRequest: any;
  excemptionCodeFlag: boolean;
  permitNumberFlag: boolean;
  permitToFollowFlag: boolean;
  showTable = false
  response1: any;
  request: { receivingPartyIdentificationNumber: any; agentCode: any; };
  appointedAgentValue: any;
  appointedAgentCode: any;
  appointedAgentName: any;
  icfinLength: any = 4;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private importService: ImportService, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }
  private agentIssueDoForm = new NgcFormGroup(
    {
      agentCode: new NgcFormControl(),
      deliveryRequestedFrom: new NgcFormControl(),
      deliveryRequestedTo: new NgcFormControl(),
      agentDeliveryLocation: new NgcFormControl(),
      receivingPartyIdentificationNumber: new NgcFormControl(),
      receivingPartyName: new NgcFormControl(),
      receivingPartyCompanyName: new NgcFormControl(),
      shipments: new NgcFormArray([
        new NgcFormGroup({
          documentReceivedOn1: new NgcFormControl(),
          breakDownPieces1: new NgcFormControl()
        })

      ]),
      equipment: new NgcFormArray([]),
      localAuthority: new NgcFormGroup({
        type: new NgcFormControl(),
        localAuthorityDetail: new NgcFormArray([
          new NgcFormGroup({
            referenceNumber: new NgcFormControl(),
            appointedAgent: new NgcFormControl(),
            license: new NgcFormControl(),
            remarks: new NgcFormControl(),
          })
        ])

      })

    }
  )


  ngOnInit() {
    this.agentIssueDoForm.get(['localAuthority', 'type']).setValue('IA');
    this.permitToFollowFlag = true;
    this.agentIssueDoForm.get(['localAuthority', 'type']).valueChanges.subscribe(
      (newValue) => {
        if (newValue) {
          if (newValue === 'EC') {
            this.agentIssueDoForm.get(['localAuthority', 'localAuthorityDetail']).patchValue([{
              referenceNumber: null,
              license: null,
              remarks: null,
            }]);
            // this.showLicenseRemarksFlag = true;
            this.permitNumberFlag = false;
            this.excemptionCodeFlag = true;
            this.permitToFollowFlag = false;
          }
          if (newValue === 'PN') {
            this.agentIssueDoForm.get(['localAuthority', 'localAuthorityDetail']).patchValue([{
              referenceNumber: null,
              license: null,
              remarks: null,
            }]);
            // this.showLicenseRemarksFlag = false;
            this.permitNumberFlag = true;
            this.excemptionCodeFlag = false;
            this.permitToFollowFlag = false;
          }
          if (newValue === 'IA') {
            this.agentIssueDoForm.get(['localAuthority', 'localAuthorityDetail']).patchValue([{
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
  }
  onAddPermitNumber(index) {
    (<NgcFormArray>this.agentIssueDoForm.get('localAuthority.localAuthorityDetail')).addValue([
      {
        referenceNumber: ''
      }
    ]);
  }

  onDeletePermitNumberRows(index) {
    (<NgcFormArray>this.agentIssueDoForm.get('localAuthority.localAuthorityDetail')).deleteValueAt(index);
  }

  onSelectResetForm(event) {
    this.resetFormMessages();
    this.showTable = false;
  }

  onSearch() {
    this.resetFormMessages();

    if (this.agentIssueDoForm.invalid) {
      return;
    }
    const requestData = {
      agentCode: this.agentIssueDoForm.get('agentCode').value,
      deliveryRequestedFrom: this.agentIssueDoForm.get('deliveryRequestedFrom').value,
      deliveryRequestedTo: this.agentIssueDoForm.get('deliveryRequestedTo').value,
    };
    this.importService.getMultiShipment(requestData).subscribe((response) => {
      this.response1 = response.data;
      const resp = response.data;
      this.refreshFormMessages(response);
      if (response.data != null &&
        response.data.shipments != null &&
        response.data.shipments.length <= 0) {
        this.showTable = false;
        this.showErrorStatus("data.awb.not.found");
      }
      else {
        /// add
        if (!this.showResponseErrorMessages(response)) {
          this.agentIssueDoForm.patchValue(resp);
          this.showTable = true;
          let j = 0;
          for (const eachRow of resp.shipments) {
            if (eachRow.documentReceivedOn === null || eachRow.breakDownPieces === null || eachRow.paymentStatus === 'Pending' || eachRow.customerDetails === null || eachRow.isPOGenerated || !eachRow.isReady) {
              this.agentIssueDoForm.get(['shipments', j, 'deliverShipment']).disable();
            }
            ++j
          }
          let i = 0;
          for (const eachRow of resp.shipments) {
            if (eachRow.documentReceivedOn) {
              this.agentIssueDoForm.get(['shipments', i, 'documentReceivedOn1']).setValue(true)
            }
            else {
              this.agentIssueDoForm.get(['shipments', i, 'documentReceivedOn1']).setValue(false)
            }
            if (eachRow.breakDownPieces) {
              this.agentIssueDoForm.get(['shipments', i, 'breakDownPieces1']).setValue(true)
            }
            else {
              this.agentIssueDoForm.get(['shipments', i, 'breakDownPieces1']).setValue(false)
            }
            if (eachRow.paymentStatus == 'Paid' || eachRow.paymentStatus == 'ChargeNotCreated') {
              this.agentIssueDoForm.get(['shipments', i, 'paymentStatus1']).setValue(true)
            }
            else {
              this.agentIssueDoForm.get(['shipments', i, 'paymentStatus1']).setValue(false)
            }

            if (eachRow.customerDetails) {
              this.agentIssueDoForm.get(['shipments', i, 'customerDetails1']).setValue(true)
            } else {
              this.agentIssueDoForm.get(['shipments', i, 'customerDetails1']).setValue(false)
            }

            ++i
          }


        }
        this.refreshFormMessages(response);


      }

    }, (error) => {
      this.refreshFormMessages(error)
      this.showTable = false
      // }else {
      //   this.showTable = false;
      // }

    })
  }
  onSelectClearingAgent(event, index) {
    this.clearingAgentParam = event.param1;
  }
  onSave() {
    this.agentIssueDoSaveRequest = this.agentIssueDoForm.getRawValue();
    if (this.agentIssueDoSaveRequest.localAuthority.type === 'IA') {
      this.agentIssueDoSaveRequest.localAuthority.localAuthorityDetail[0].appointedAgent = this.appointedAgentValue;
    }

    if ((null == this.agentIssueDoSaveRequest.receivingPartyIdentificationNumber)
      || !this.agentIssueDoForm.get('receivingPartyIdentificationNumber').valid) {
      return;
    }

    if ((null == this.agentIssueDoSaveRequest.receivingPartyName)
      || this.agentIssueDoSaveRequest.receivingPartyName.length < 4) {
      this.showErrorMessage("ERROR_IC_NAME_CHR");
      return;
    }

    this.agentIssueDoSaveRequest.customerId = this.agentIssueDoSaveRequest.agentCode;

    if (this.agentIssueDoSaveRequest.receivingPartyIdentificationNumber != null && this.agentIssueDoSaveRequest.receivingPartyName != null) {
      // this.importService.checkForBlackListCustomer(this.agentIssueDoSaveRequest).subscribe(response => {
      //   if (response.success === false) {
      //     if (response.messageList.length > 0) {
      //       var icName: string[] = [];
      //       icName.push(this.agentIssueDoSaveRequest.receivingPartyIdentificationNumber);
      //       icName.push(this.agentIssueDoSaveRequest.receivingPartyName);
      //       var error = NgcUtility.translateMessage(response.messageList[0].code, icName);
      //       this.showErrorStatus(error + " " + response.messageList[0].message);
      //       return;
      //     }
      //   }
      //   if (!this.showResponseErrorMessages(response)) {
      //     this.importService.createMultiShipment(this.agentIssueDoSaveRequest).subscribe(response => {
      //       // const resp = response.data;
      //       // this.refreshFormMessages(response);

      //       if (!this.showResponseErrorMessages(response)) {
      //         this.showSuccessStatus('g.completed.successfully');
      //         this.showTable = false;
      //         this.appointedAgentValue = null;
      //         this.appointedAgentCode = null;
      //         this.appointedAgentName = null;
      //         this.onSearch();
      //       }
      //     }, error => {

      //     })
      //   }
      // });
    }
  }
  // public onImageSelect(event) {

  //   this.agentIssueDoForm.get('image').setValue(event.data);
  // }
  validateAirportPass(event) {
    this.request = {
      receivingPartyIdentificationNumber: this.agentIssueDoForm.get('receivingPartyIdentificationNumber').value,
      agentCode: this.agentIssueDoForm.get('agentCode').value
    }
    if (!this.agentIssueDoForm.get('receivingPartyIdentificationNumber').value) {
      this.showFormControlErrorMessage(<NgcFormControl>this.agentIssueDoForm.get('receivingPartyIdentificationNumber'), 'g.mandatory');
      return;
    }
    if (!this.agentIssueDoForm.get('receivingPartyIdentificationNumber').valid) {
      return;
    }

    this.importService.validateAgentIcNumber(this.request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        const resp = response.data;
        if (resp === null) {
          this.showConfirmMessage('contractor.is.not.recognized'
          ).then(fulfilled => {
            (this.agentIssueDoForm.get('receivingPartyName') as NgcFormControl).focus();
          }
          ).catch(reason => {
            (this.agentIssueDoForm.get('receivingPartyIdentificationNumber') as NgcFormControl).focus();
          });
          this.resetAuthorizedPersonDetail();

        }
        else {
          if (resp.authorizedPersonDetailList == null || resp.authorizedPersonDetailList.length == 0) {
            this.showConfirmMessage('contractor.is.not.recognized'
            ).then(fulfilled => {
              (this.agentIssueDoForm.get('receivingPartyName') as NgcFormControl).focus();
            }
            ).catch(reason => {
              (this.agentIssueDoForm.get('receivingPartyIdentificationNumber') as NgcFormControl).focus();
            });
            this.resetAuthorizedPersonDetail();
          }
          else if (resp.authorizedPersonDetailList.length == 1) {
            (this.agentIssueDoForm.get('receivingPartyName') as NgcFormControl).focus();
            this.agentIssueDoForm.get('receivingPartyName').setValue(resp.authorizedPersonDetailList[0].authorizedPersonnelName);
            this.agentIssueDoForm.get('receivingPartyCompanyName').setValue(resp.authorizedPersonDetailList[0].customerShortName);
          }
          else {
            this.duplicateNamePopup.open(resp.authorizedPersonDetailList);
          }


        }
      }
    }, error => {

    })
  }

  onCancel(event) {
    this.agentIssueDoForm.reset();
    this.navigateHome();
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

            this.agentIssueDoForm.controls.localAuthority.get(['localAuthorityDetail', 0, 'appointedAgent']).patchValue('');
            this.appointedAgentValue = null
          }


          this.agentIssueDoForm.controls.localAuthority.get(['localAuthorityDetail', 0, 'appointedAgent']).patchValue(resp.appointedAgent);
          this.appointedAgentCode = resp.appointedAgent;
          this.appointedAgentName = resp.appointedAgentName;
          this.appointedAgentValue = resp.id;

        }

      })
    }
  }

  // Methods for duplicate name popup component
  onConfirmNewEntry(boolean) {
    (this.agentIssueDoForm.get('receivingPartyName') as NgcFormControl).focus();
    this.resetAuthorizedPersonDetail();
  }

  onNameSelect(selectedName) {
    (this.agentIssueDoForm.get('receivingPartyName') as NgcFormControl).focus();
    this.agentIssueDoForm.get('receivingPartyName').setValue(selectedName.authorizedPersonnelName);
    this.agentIssueDoForm.get('receivingPartyCompanyName').setValue(selectedName.customerShortName);
  }
  resetAuthorizedPersonDetail() {
    this.agentIssueDoForm.get('receivingPartyName').reset();
    this.agentIssueDoForm.get('receivingPartyCompanyName').setValue("");
  }
  onChangeIC(event) {
    this.resetAuthorizedPersonDetail();
  }
}