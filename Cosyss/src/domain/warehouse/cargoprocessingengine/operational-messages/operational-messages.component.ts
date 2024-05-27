import { request } from 'http';
import { ActivatedRoute, Router } from '@angular/router';
import { CargoProcessingEngineService } from './../cargoprocessingengine.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, PageConfiguration, CreateFormByModel
} from 'ngc-framework';

/*class OperationalMessages {
  operationalMessages: any = [];
}*/

@Component({
  selector: 'app-operational-messages',
  templateUrl: './operational-messages.component.html',
  styleUrls: ['./operational-messages.component.scss']
})
export class OperationalMessagesComponent extends NgcPage {
  resp: any[];
  // @CreateFormByModel(OperationalMessages)
  private form: NgcFormGroup = new NgcFormGroup({
    operationalMessages: new NgcFormArray([])
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
    this._cargoEngineProcessService.onSearchOperationalMessages().subscribe(response => {
      this.refreshFormMessages(response);
      this.resetFormMessages();
      this.resp = response.data;
      if (this.resp) {
        (<NgcFormArray>this.form.get(['operationalMessages'])).patchValue(this.resp);
      } else {
        const errors = response.messageList;
        this.showErrorStatus(errors[0].message);
      }
    });
  }

  addOperationalProcessArea(event) {
    (<NgcFormArray>this.form.controls['operationalMessages']).addValue([
      {
        processAreaId: '',
        operationalMessage: ''
      }
    ]);
  }

  onSave(event) {
    const saveRequest = (<NgcFormArray>this.form.get(['operationalMessages'])).getRawValue();
    this._cargoEngineProcessService.saveOperationalMessage(saveRequest).subscribe(response => {
      this.refreshFormMessages(response);
      this.resetFormMessages();
      this.resp = response.data;
      if (!response.messageList.length) {
        this.showSuccessStatus('g.completed.successfully');
        (<NgcFormArray>this.form.get(['operationalMessages'])).patchValue(this.resp);
      } else {
        const errors = response.messageList;
        this.showErrorStatus(errors[0].code);
      }
    });
  }

  deleteOperationalMessages(index) {
    this.showConfirmMessage('warehouse.warning.delete.recordfor.operationalmessages').then(fulfilled => {
      (this.form.get(['operationalMessages', index]) as NgcFormGroup).markAsDeleted();
    });
  }

  onCancel(event) {
    this.navigateHome();
  }
}
