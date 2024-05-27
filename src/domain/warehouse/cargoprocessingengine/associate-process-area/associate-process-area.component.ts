import { request } from 'http';
import { ActivatedRoute, Router } from '@angular/router';
import { CargoProcessingEngineService } from './../cargoprocessingengine.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, PageConfiguration, CreateFormByModel
} from 'ngc-framework';

/*class AssociateProcessArea {
  processAreaId: string = null;
  exportTriggerPoints: any = [];
  importTriggerPoints: any = [];
}*/

@Component({
  selector: 'app-associate-process-area',
  templateUrl: './associate-process-area.component.html',
  styleUrls: ['./associate-process-area.component.scss']
})
export class AssociateProcessAreaComponent extends NgcPage {
  displayProcessName: any;
  disableAddExport = false;
  disableAddImport = false;
  dataToFilterExport: any;
  dataToFilterImport: any;
  showData = false;
  resp: any[];
  activeData = [
    'WARNING',
    'ERROR',
    'INFO'
  ];
  // @CreateFormByModel(AssociateProcessArea)
  private form: NgcFormGroup = new NgcFormGroup({
    processAreaId: new NgcFormControl(),
    exportTriggerPoints: new NgcFormArray([]),
    importTriggerPoints: new NgcFormArray([]),
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

  onSearchAssociateProcessArea() {
    this.disableAddImport = false;
    this.disableAddExport = false;
    const searchRequest = {
      processAreaId: this.form.controls.processAreaId.value
    }
    this._cargoEngineProcessService.onSearchAssociateProcessArea(searchRequest).subscribe(response => {
      this.refreshFormMessages(response);
      this.resetFormMessages();
      this.resp = response.data;
      if (this.resp) {
        this.form.patchValue(this.resp);
        this.showData = true;
      } else {
        const errors = response.messageList;
        this.showData = false;
        this.showErrorStatus(errors[0].message);
      }
    });
  }

  onSave(event) {
    const saveRequest = this.form.getRawValue();
    this._cargoEngineProcessService.saveAssociateProcessArea(saveRequest).subscribe(response => {
      this.resp = response.data;
      if (!response.messageList.length) {
        this.showSuccessStatus('g.completed.successfully');
        this.form.patchValue(this.resp);
      } else {
        const errors = response.messageList;
        this.showErrorStatus(errors[0].code);
        return;
      }
      this.refreshFormMessages(response);
      this.resetFormMessages();
    });
    // Search
    this.onSearchAssociateProcessArea();
  }

  onAddExport(event) {
    const lengthDisable = (<NgcFormArray>this.form.controls['exportTriggerPoints']).length;
    if (lengthDisable < 20) {
      (<NgcFormArray>this.form.controls['exportTriggerPoints']).addValue([
        {
          actionType: '',
          triggerPoint: {
            processorName: '',
            triggerPointId: ''
          },
          triggerPointOperation: {
            operationName: '',
            triggerPointOperationId: ''
          },
        }
      ]);
      this.disableAddExport = false;
    } else {
      this.disableAddExport = true;
    }
  }

  onAddImport(event) {
    const lengthDisable = (<NgcFormArray>this.form.controls['importTriggerPoints']).length;
    if (lengthDisable < 20) {
      (<NgcFormArray>this.form.controls['importTriggerPoints']).addValue([
        {
          actionType: '',
          triggerPoint: {
            processorName: '',
            triggerPointId: ''
          },
          triggerPointOperation: {
            operationName: '',
            triggerPointOperationId: ''
          },
        }
      ]);
      this.disableAddImport = false;
    } else {
      this.disableAddImport = true;
    }
  }

  onSelectDropdown(event) {
    this.displayProcessName = event.desc;
  }

  selectExportProcessorName(event, index) {
    (<NgcFormArray>this.form.get(['exportTriggerPoints', index, 'triggerPoint', 'processorName'])).setValue(event.desc);
    (<NgcFormArray>this.form.get(
      ['exportTriggerPoints', index, 'triggerPoint', 'triggerPointId'])).setValue(event.code);
    this.dataToFilterExport = event.desc;
  }
  selectImportProcessorName(event, index) {
    (<NgcFormArray>this.form.get(['importTriggerPoints', index, 'triggerPoint', 'processorName'])).setValue(event.desc);
    (<NgcFormArray>this.form.get(
      ['importTriggerPoints', index, 'triggerPoint', 'triggerPointId'])).setValue(event.code);
    this.dataToFilterImport = event.desc;
  }

  deleteExportTriggerPoints(index) {
    this.showConfirmMessage('warehouse.warning.deleterecord.for.exporttriggerpoints').then(fulfilled => {
      (this.form.get(['exportTriggerPoints', index]) as NgcFormGroup).markAsDeleted();
    });
  }


  deleteImportTriggerPoints(index) {
    this.showConfirmMessage('warehouse.warning.deleterecord.for.importtriggerpoints').then(fulfilled => {
      (this.form.get(['importTriggerPoints', index]) as NgcFormGroup).markAsDeleted();
    });
  }

  onCancel(event) {
    this.navigateHome();
  }
}
