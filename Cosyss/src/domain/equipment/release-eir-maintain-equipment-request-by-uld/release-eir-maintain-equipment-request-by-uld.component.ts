import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// NGC framework imports
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcUtility, PageConfiguration,
} from 'ngc-framework';
import { EquipmentService } from '../equipment.service';

@Component({
  selector: 'app-release-eir-maintain-equipment-request-by-uld',
  templateUrl: './release-eir-maintain-equipment-request-by-uld.component.html',
  styleUrls: ['./release-eir-maintain-equipment-request-by-uld.component.scss']
})

/* page configuration on page initialization */
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

/* this class is used for all the operations on Release EIR pop up in Maintain mULD Assignment screen */
export class ReleaseEirMaintainEquipmentRequestByUldComponent extends NgcPage implements OnInit {

  /* Maintain mULD Assignment screen is sending the input using releaseEirWindowObject */
  @Input('releaseEirWindowObject') releaseEirWindowObject;

  /*this is used to send the input data from Maintain mULD Assignment screen */
  private _inputData: any;

  /*this is used to call the search method  from this component */
  @Output() autoSearchReleaseInfo = new EventEmitter<boolean>();

  /*this is used to close the release eir  window from this component */
  @Output() closeWindow = new EventEmitter<boolean>();

  /*this is used to send the input data from Maintain mULD Assignment screen */
  @Input('inputData')
  public set inputData(data: any) {
    this._inputData = data;
    this.releaseEirForm.reset();
    this.releaseEirForm.get(['uldListRecord']).patchValue([this._inputData]);
  }

  /* this form  is used for the fields used  in Maintain mULD Assignment screen */
  private releaseEirForm: NgcFormGroup = new NgcFormGroup({
    uldListRecord: new NgcFormArray([]),
  })

  /* constructor for dependency injection */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private equipmentService: EquipmentService) {
    super(appZone, appElement, appContainerElement);
  }

  /* Oninit function */
  ngOnInit() {

  }

  /*this method is used to save the released records which are in processed or part released  state */
  onSave() {
    this.resetFormMessages();
    this.releaseEirForm.validate();
    if (this.releaseEirForm.invalid) {
      return;
    }
    this.showConfirmMessage(NgcUtility.translateMessage("do.you.want.to.close.this.eir", [])).then(fulfilled => {
      let request: any = this.releaseEirForm.getRawValue();
      this.equipmentService.releaseEIR(request).subscribe(response => {
        if (!this.showResponseErrorMessages(response) && (response.data != null)) {
          if (response.success) {
            this.showSuccessStatus('g.operation.successful');
            this.autoSearchReleaseInfo.emit(true);
          }
        }
      })
    })
  }

  /*this method is used to close the release eir window */
  onClose() {
    this.closeWindow.emit(true);
  }
}
