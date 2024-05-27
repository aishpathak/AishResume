import { Component, OnInit, ElementRef, NgZone, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormControl, PageConfiguration, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility } from 'ngc-framework';
import { InterfaceService } from '../interface.service';

@Component({
  selector: 'app-interfacing-syetm-telexaddress-setup',
  templateUrl: './interfacing-system-telexaddress-setup.component.html',
  styleUrls: ['./interfacing-system-telexaddress-setup.component.scss']
})
@PageConfiguration({
  trackInit: true,
  autoBackNavigation: true,
  callNgOnInitOnClear: true
})
export class InterfacingSystemTelexaddressSetupComponent extends NgcPage {
  @ViewChild('saveWindow') saveWindow: NgcWindowComponent;
  @ViewChild('editWindow') editWindow: NgcWindowComponent;
  private ediInterfaceTelexSetUp: NgcFormGroup = new NgcFormGroup({
    interfacingSystemName: new NgcFormControl(),
    interfacingSystemTelexAddress: new NgcFormControl(),
    interfacingSystemId: new NgcFormControl(),
    referenceId: new NgcFormControl(),
    interfacingSystemTelexAddressId: new NgcFormControl(),
    messageHandlingDefinition: new NgcFormArray([])
  });
  saveInterfaceTelexSetUp: NgcFormGroup = new NgcFormGroup({
    flagCRUD: new NgcFormControl(),
    interfacingSystemName: new NgcFormControl(),
    interfacingSystemTelexAddress: new NgcFormControl(),
    interfacingSystemId: new NgcFormControl(),
    referenceId: new NgcFormControl(),
    interfacingSystemTelexAddressId: new NgcFormControl(),
    telexAddress: new NgcFormArray([
      new NgcFormGroup({
        interfacingSystemId: new NgcFormControl(),
        interfacingSystemTelexAddress: new NgcFormControl()
      })
    ])
  });
  editInterfaceTelexSetUp: NgcFormGroup = new NgcFormGroup({
    flagCRUD: new NgcFormControl(),
    interfacingSystemName: new NgcFormControl(),
    interfacingSystemTelexAddress: new NgcFormControl(),
    interfacingSystemId: new NgcFormControl(),
    referenceId: new NgcFormControl(),
    interfacingSystemTelexAddressId: new NgcFormControl(),
  });
  showData: boolean = false;
  response: any;
  interfacingSystem: any;
  hasReadPermission: boolean = false;
  constructor(appZone: NgZone, appElement: ElementRef, private interfaceService:
    InterfaceService, appContainerElement: ViewContainerRef,) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }
  onSearch() {
    this.hasReadPermission = NgcUtility.hasReadPermission('EDI_INTERFACE_TELEX_SETUP');
    this.showData = false;
    let request = this.ediInterfaceTelexSetUp.getRawValue();
    this.interfaceService.fetchEdiInterfaceTelexAddressSetUp(request).subscribe(response => {
      console.log("response", response);
      if (!this.showResponseErrorMessages(response)) {
        this.showData = true;
        this.response = response.data;
        this.ediInterfaceTelexSetUp.get('messageHandlingDefinition').patchValue(this.response.messageHandlingDefinition);
      } else {
        this.showResponseErrorMessages(response);
      }
    });
  }
  onAdd() {
    if ((<NgcFormArray>this.saveInterfaceTelexSetUp.get("telexAddress")).length == 0) {
      this.addEmptyRow();
    }
    this.saveWindow.open();
  }

  onAddTelexAddress() {
    this.addEmptyRow();
    this.saveWindow.open();
  }

  private addEmptyRow() {
    let obj = {
      flagCRUD: 'C',
      interfacingSystemTelexAddress: null,
      interfacingSystemId: this.ediInterfaceTelexSetUp.get('interfacingSystemId').value
    };
    (<NgcFormArray>this.saveInterfaceTelexSetUp.get("telexAddress")).addValue([
      obj
    ]);
  }

  saveSetUp() {
    let request = this.saveInterfaceTelexSetUp.getRawValue();
    for (let i = 0; i < request.telexAddress.length; i++) {
      if (!request.telexAddress[i].interfacingSystemTelexAddress) {
        this.showErrorMessage("edi.telex.address.mandatory");
        return;
      }
      if (!request.telexAddress[i].interfacingSystemId) {
        this.showErrorMessage("edi.interfacing.system.mandatory");
        return;
      }
    }
    request.flagCRUD = 'C';
    this.interfaceService.addEdiInterfaceTelexAddressSetUp(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus("g.completed.successfully");

        // this.ediInterfaceTelexSetUp.get('interfacingSystemName').setValue(request.interfacingSystemName);
        // this.ediInterfaceTelexSetUp.get('interfacingSystemTelexAddress').setValue(request.interfacingSystemTelexAddress);
        // this.ediInterfaceTelexSetUp.get('interfacingSystemId').setValue(request.interfacingSystemId);
        this.onSearch();
        (this.saveInterfaceTelexSetUp.get('telexAddress') as NgcFormArray).resetValue([]);
        this.saveInterfaceTelexSetUp.reset();
        this.saveWindow.close();
      } else {
        this.showResponseErrorMessages(response);
      }
    });
  }
  onLinkClick(event) {
    if (event.column === 'delete') {
      this.showConfirmMessage('edi.delete.record.confirmation').then(fulfilled => {
        let deleteObject = (this.ediInterfaceTelexSetUp.get(["messageHandlingDefinition", event.record.NGC_ROW_ID]) as NgcFormGroup).getRawValue();
        deleteObject.flagCRUD = 'D';
        this.interfaceService.addEdiInterfaceTelexAddressSetUp(deleteObject).subscribe(response => {
          const resp = response.data;
          if (!this.showResponseErrorMessages(response)) {
            this.onSearch();
            this.showSuccessStatus('g.completed.successfully')
          }
          else {
            this.showResponseErrorMessages(response);
          }
        }, error => {
          this.showErrorStatus(error);
        });
      }).catch(reason => {
        console.log('failed' + reason);
      });
    } else if (event.column === 'edit') {
      let updateObject = (this.ediInterfaceTelexSetUp.get(["messageHandlingDefinition", event.record.NGC_ROW_ID]) as NgcFormGroup).getRawValue();
      this.editInterfaceTelexSetUp.patchValue(updateObject);

      // this.editsetupForm.get('flagCRUD').patch('U');
      // this.editsetupForm.get('carrierCode').setValue(updateObject.getCarrierCode);
      // this.editsetupForm.get('interfacingSystemName').setValue(updateObject.interfacingSystemName);
      // this.editsetupForm.get('messageHeaderFormat').setValue(updateObject.messageHeaderFormat);
      // this.editsetupForm.get('interfacingSystemId').setValue(updateObject.interfacingSystemId);
      // this.editsetupForm.get('referenceId').setValue(updateObject.referenceId);
      this.editWindow.open();
    }
  }
  updateSetUp() {
    let request = this.editInterfaceTelexSetUp.getRawValue();
    if (request.interfacingSystemId == null) {
      this.showErrorMessage("edi.interfacing.system.mandatory");
      return;
    }
    if (request.interfacingSystemTelexAddress == null) {
      this.showErrorMessage("edi.telex.address.mandatory");
      return;
    }
    request.flagCRUD = 'U';
    this.interfaceService.addEdiInterfaceTelexAddressSetUp(request).subscribe(response => {
      if (!this.showFormErrorMessages(response)) {
        this.showSuccessStatus("g.completed.successfully");
        this.onSearch();
        this.editWindow.close();
      } else {
        this.showFormErrorMessages(response);
      }
    });
  }
  onDeleteTelexAddress(event, index) {
    (<NgcFormArray>this.saveInterfaceTelexSetUp.get("telexAddress")).deleteValueAt(index);
  }
  getInterfaceSystemName(event) {
    if (this.ediInterfaceTelexSetUp.get('interfacingSystemId') && this.ediInterfaceTelexSetUp.get('interfacingSystemId').value)
      this.saveInterfaceTelexSetUp.get(['telexAddress', 0, 'interfacingSystemId']).setValue(this.ediInterfaceTelexSetUp.get('interfacingSystemId').value);
  }
  onWindowClose(formName) {
    formName.reset();
    (<NgcFormArray>this.saveInterfaceTelexSetUp.controls['telexAddress']).resetValue([]);
  }
}
