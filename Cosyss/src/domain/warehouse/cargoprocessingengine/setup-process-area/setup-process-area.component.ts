import { request } from 'http';
import { ActivatedRoute, Router } from '@angular/router';
import { CargoProcessingEngineService } from './../cargoprocessingengine.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, PageConfiguration, CreateFormByModel
} from 'ngc-framework';

/*class SetupProcessArea {
  processArea: any = [];
}*/

@Component({
  selector: 'app-setup-process-area',
  templateUrl: './setup-process-area.component.html',
  styleUrls: ['./setup-process-area.component.scss']
})
export class SetupProcessAreaComponent extends NgcPage {
  resp: any;
  disableAdd = false;
  // @CreateFormByModel(SetupProcessArea)
  private form: NgcFormGroup = new NgcFormGroup({
    processArea: new NgcFormArray([])
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
    super.ngOnInit();
    this._cargoEngineProcessService.getSetupProcessArea().subscribe(response => {
      this.refreshFormMessages(response);
      this.resetFormMessages();
      this.resp = response.data;
      if (this.resp) {
        ((<NgcFormArray>this.form.get(['processArea']))).patchValue(this.resp);
      } else {
        const errors = response.messageList;
        this.showErrorStatus(errors[0].message);
      }
    });
  }

  onSave(event) {
    this.form.validate();
    //
    if (this.form.invalid) {
      return;
    }
    const saveRequest = ((<NgcFormArray>this.form.get(['processArea']))).getRawValue();
    console.log(JSON.stringify(saveRequest));
    this._cargoEngineProcessService.saveSetupProcessArea(saveRequest).subscribe(response => {
      this.refreshFormMessages(response);
      this.resetFormMessages();
      this.resp = response.data;
      if (response.messageList.length === 0) {
        this.showSuccessStatus('g.completed.successfully');
        ((<NgcFormArray>this.form.get(['processArea']))).patchValue(this.resp);
      } else {
        const errors = response.messageList;
        this.showErrorStatus(errors[0].code);
      }
    });
  }

  addSetupProcessArea(event) {
    const lengthDisable = (<NgcFormArray>this.form.controls['processArea']).length;
    if (lengthDisable === 9) {
      this.disableAdd = true;
    }
    (<NgcFormArray>this.form.controls['processArea']).addValue([
      {
        processAreaName: '',
        processAreaCode: '',
        processAreaType: {
          processAreaTypeId: '',
        },
        processAreaDesc: '',
        active: false
      }
    ]);
    this.disableAdd = false;
  }

  selectDropDown(event, index) {
    (<NgcFormArray>this.form.get(['processArea', index, 'processAreaCode'])).setValue(event.desc);
  }

  onCancel(event) {
    this.navigateHome();
  }
}
