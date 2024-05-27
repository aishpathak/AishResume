import { request } from 'http';
import { ActivatedRoute, Router } from '@angular/router';
import { CargoProcessingEngineService } from './../cargoprocessingengine.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, PageConfiguration, CreateFormByModel
} from 'ngc-framework';

/*class SetupTriggerPoints {
  triggerPoints: any = [];
  moduleCode: string = null;
}*/

@Component({
  selector: 'app-setup-trigger-points',
  styleUrls: ['./setup-trigger-points.component.scss'],
  templateUrl: './setup-trigger-points.component.html'
})

export class SetupTriggerPointsComponent extends NgcPage {
  resp: any[];
  disableFlag = true;
  // @CreateFormByModel(SetupTriggerPoints)
  private form: NgcFormGroup = new NgcFormGroup({
    triggerPoints: new NgcFormArray([]),
    moduleCode: new NgcFormControl()
  });
  /**
  * Initialize
  *
  * @param appZone Ng Zone
  * @param appElement Element Ref
  * @param appContainerElement View Container Ref
  */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private _cargoEngineProcessService: CargoProcessingEngineService) {
    super(appZone, appElement, appContainerElement);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
  }

  onSearchTriggerPoints() {
    const searchRequest = {
      moduleCode: this.form.controls.moduleCode.value
    }
    this._cargoEngineProcessService.onSearchTriggerPoints(searchRequest).subscribe(response => {
      this.refreshFormMessages(response);
      this.resetFormMessages();
      this.resp = response.data;
      if (this.resp) {
        ((<NgcFormArray>this.form.get(['triggerPoints']))).patchValue(this.resp);
      } else {
        const errors = response.messageList;
        this.showErrorStatus(errors[0].message);
      }
    });
  }

  onSave(event) {
    const saveRequest = ((<NgcFormArray>this.form.get(['triggerPoints']))).getRawValue();
    this._cargoEngineProcessService.saveSetupTriggerPoints(saveRequest).subscribe(response => {
      this.refreshFormMessages(response);
      this.resetFormMessages();
      this.resp = response.data;
      if (this.resp) {
        this.showSuccessStatus('g.completed.successfully');
        ((<NgcFormArray>this.form.get(['triggerPoints']))).patchValue(this.resp);
      } else {
        const errors = response.messageList;
        this.showErrorStatus(errors[0].message);
      }
    });
  }

  onSelectSearch(event) {
    console.log(event);
    if (event.desc) {
      this.disableFlag = false;
    } else {
      this.disableFlag = true;
    }
  }

  onCancel(event) {
    this.navigateHome();
  }
}
