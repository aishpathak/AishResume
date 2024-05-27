import { Component, OnInit, ElementRef, NgZone, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormControl, PageConfiguration, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility } from 'ngc-framework';
import { InterfaceService } from '../interface.service';

@Component({
  selector: 'app-edi-interface-set-up',
  templateUrl: './edi-interface-set-up.component.html',
  styleUrls: ['./edi-interface-set-up.component.scss']
})
@PageConfiguration({
  trackInit: true,
  autoBackNavigation: true,
  callNgOnInitOnClear: true
})
export class EdiInterfaceSetUpComponent extends NgcPage {
  @ViewChild('saveWindow') saveWindow: NgcWindowComponent;
  @ViewChild('editWindow') editWindow: NgcWindowComponent;
  private editInterfaceSetUp: NgcFormGroup = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    interfacingSystemName: new NgcFormControl(),
    messageHeaderFormat: new NgcFormControl(),
    interfacingSystemId: new NgcFormControl(),
    referenceId: new NgcFormControl(),
    interfacingSystemHeaderFormatId: new NgcFormControl(),
    messageHandlingDefinition: new NgcFormArray([])
  });
  savesetupForm: NgcFormGroup = new NgcFormGroup({
    flagCRUD: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    interfacingSystemName: new NgcFormControl(),
    messageHeaderFormat: new NgcFormControl(),
    interfacingSystemId: new NgcFormControl()
  });
  editsetupForm: NgcFormGroup = new NgcFormGroup({
    flagCRUD: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    interfacingSystemName: new NgcFormControl(),
    messageHeaderFormat: new NgcFormControl(),
    interfacingSystemId: new NgcFormControl(),
    referenceId: new NgcFormControl()
  });
  showData: boolean = false;
  response: any;
  hasReadPermission: boolean = false;
  constructor(appZone: NgZone, appElement: ElementRef, private interfaceService:
    InterfaceService, appContainerElement: ViewContainerRef,) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }
  onSearch() {
    this.hasReadPermission = NgcUtility.hasReadPermission('EDI_INTERFACE_SETUP');
    this.showData = false;
    let request = this.editInterfaceSetUp.getRawValue();
    this.interfaceService.fetchEdiInterfaceSetUp(request).subscribe(response => {
      console.log("response", response);
      if (response && response.data) {
        this.showData = true;
        this.response = response.data;
        this.editInterfaceSetUp.get('messageHandlingDefinition').patchValue(this.response.messageHandlingDefinition);
      } else {
        if(response.messageList && response.messageList.length != 0) {
          response.messageList.forEach(message => {
            if(message.code != null && message.code != '') {
              this.showErrorMessage(message.code);
              return;
            }
          });         
        }
      }
    });
  }
  onAdd() {
    this.saveWindow.open();
  }
  saveSetUp() {
    let request = this.savesetupForm.getRawValue();
    if (request.interfacingSystemId == null) {
      this.showErrorMessage("edi.interfacing.system.mandatory");
      return;
    }
    if (request.messageHeaderFormat == null) {
      this.showErrorMessage("edi.message.header.format.mandatory");
      return;
    }
    request.flagCRUD = 'C';
    this.interfaceService.saveEdiInterfaceSetUp(request).subscribe(response => {
      if (response && response.data) {
        this.showSuccessStatus("g.completed.successfully");
        // this.editInterfaceSetUp.get('carrierCode').setValue(request.getCarrierCode);
        // this.editInterfaceSetUp.get('interfacingSystemName').setValue(request.interfacingSystemName);
        // this.editInterfaceSetUp.get('messageHeaderFormat').setValue(request.messageHeaderFormat);
        // this.editInterfaceSetUp.get('interfacingSystemId').setValue(request.interfacingSystemId);
        // this.editInterfaceSetUp.get('interfacingSystemHeaderFormatId').setValue(request.interfacingSystemId);
        this.onSearch();
        this.savesetupForm.reset();
        this.saveWindow.close();
      } else {
        if(response.messageList && response.messageList.length != 0) {
          response.messageList.forEach(message => {
            if(message.code != null && message.code != '') {
              this.showErrorMessage(message.code);
              return;
            }
          });         
        }
      }
    });
  }
  onLinkClick(event) {
    if (event.column === 'delete') {
      this.showConfirmMessage('edi.delete.record.confirmation').then(fulfilled => {
        let deleteObject = (this.editInterfaceSetUp.get(["messageHandlingDefinition", event.record.NGC_ROW_ID]) as NgcFormGroup).getRawValue();
        deleteObject.flagCRUD = 'D';
        this.interfaceService.saveEdiInterfaceSetUp(deleteObject).subscribe(response => {
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
      let updateObject = (this.editInterfaceSetUp.get(["messageHandlingDefinition", event.record.NGC_ROW_ID]) as NgcFormGroup).getRawValue();
      this.editsetupForm.patchValue(updateObject);

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
    let request = this.editsetupForm.getRawValue();
    if (request.interfacingSystemId == null) {
      this.showErrorMessage("edi.interfacing.system.mandatory");
      return;
    }
    if (request.messageHeaderFormat == null) {
      this.showErrorMessage("edi.message.header.format.mandatory");
      return;
    }
    request.flagCRUD = 'U';
    this.interfaceService.saveEdiInterfaceSetUp(request).subscribe(response => {
      if (!this.showFormErrorMessages(response)) {
        this.showSuccessStatus("g.completed.successfully");
        this.onSearch();
        this.editWindow.close();
      } else {
        this.showFormErrorMessages(response);
      }
    });
  }
  onWindowClose(formName) {
    formName.reset();
  }

  getInterfaceSystemName(event) {
    if (event)
      this.savesetupForm.get('interfacingSystemId').setValue(event.code);
  }
}
