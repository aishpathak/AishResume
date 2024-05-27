import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcUtility, NgcFormArray, NgcWindowComponent, PageConfiguration } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { ExportService } from './../export.service';

@Component({
  selector: 'app-bypass-aed-acas',
  templateUrl: './bypass-aed-acas.component.html',
  styleUrls: ['./bypass-aed-acas.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class BypassAedAcasComponent extends NgcPage {

  /**
  * Initialize
  * @param appZone Ng Zone
  * @param appElement Element Ref
  * @param appContainerElement View Container Ref
  */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private exportService: ExportService) {
    super(appZone, appElement, appContainerElement);
  }

  private aedacasform: NgcFormGroup = new NgcFormGroup({

    saveFormGroup: new NgcFormGroup({
      shipmentNumber: new NgcFormControl('')
    }),

    changeFormGroup: new NgcFormGroup({
      byAed: new NgcFormControl(true),
      byAcas: new NgcFormControl('')
    }),

    saveFormGroup1: new NgcFormGroup({
      grossWeight: new NgcFormControl(''),
      tolerance: new NgcFormControl(''),
      scinsp: new NgcFormControl('')
    }),


    saveFormGroup2: new NgcFormGroup({
      psn: new NgcFormControl('')
    })

  });

  aedMessageLogId: Number = 0;
  scinspection: any[];
  screenModeFlag: boolean = true;

  ngOnInit() {
    super.ngOnInit();
    this.scinspection = new Array();
    this.scinspection.push('R');
    this.scinspection.push('S');
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.aedacasform.get(['changeFormGroup', 'byAed']).valueChanges.subscribe(aedChangedValue => {
      if (aedChangedValue == true) {
        this.screenModeFlag = true;
        this.aedacasform.get(['saveFormGroup1', 'grossWeight']).reset();
        this.aedacasform.get(['saveFormGroup1', 'tolerance']).reset();
        this.aedacasform.get(['saveFormGroup1', 'scinsp']).reset();
      }
    });

    this.aedacasform.get(['changeFormGroup', 'byAcas']).valueChanges.subscribe(acasChangedValue => {
      if (acasChangedValue == true) {
        this.screenModeFlag = false;
        this.aedacasform.get(['saveFormGroup2', 'psn']).reset();
      }
    });
  }

  onSave() {

    const saveFormGroup: NgcFormGroup = (<NgcFormGroup>this.aedacasform.get('saveFormGroup'));
    const saveFormGroup1: NgcFormGroup = (<NgcFormGroup>this.aedacasform.get('saveFormGroup1'));
    const saveFormGroup2: NgcFormGroup = (<NgcFormGroup>this.aedacasform.get('saveFormGroup2'));
    saveFormGroup.validate();
    if (this.aedacasform.get('saveFormGroup').invalid) {
      return;
    }

    if (this.screenModeFlag) {
      saveFormGroup1.validate();
      if (this.aedacasform.get('saveFormGroup1').invalid) {
        return;
      }
    } else {
      saveFormGroup2.validate();
      if (this.aedacasform.get('saveFormGroup2').invalid) {
        return;
      }

    }

    let req: any = new Object();
    req.shipmentNumber = this.aedacasform.get(['saveFormGroup', 'shipmentNumber']).value;
    req.grossWeight = this.aedacasform.get(['saveFormGroup1', 'grossWeight']).value;
    req.tolerance = this.aedacasform.get(['saveFormGroup1', 'tolerance']).value;
    req.scinsp = this.aedacasform.get(['saveFormGroup1', 'scinsp']).value;
    req.psn = this.aedacasform.get(['saveFormGroup2', 'psn']).value;
    req.aedMessageLogId = this.aedMessageLogId;

    if (this.screenModeFlag) {
      req.searchMode = 'byAed'
    } else {
      req.searchMode = 'byAcas'
    }

    this.exportService.saveAedAcasDetails(req).subscribe(response => {
      console.log("Resp", response);
      if (response && response.data) {
        this.aedMessageLogId = response.data.aedMessageLogId;
      }

      if (!this.showResponseErrorMessages(response, null, "saveFormGroup")) {
        this.showSuccessStatus('exp.savedsuccessfully.m');
      }
    })
  }

}
