import { ValueTransformer } from '@angular/compiler/src/util';
import { MaintainHouseWayBillAddNewComponent } from './../../../awbManagement/maintain-house-way-bill-add-new/maintain-house-way-bill-add-new.component';
import { Subscriber } from 'rxjs';
import { group } from '@angular/animations';
import { Component, ElementRef, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// NGC framework imports
import { NgcPage, PageConfiguration, NgcFormGroup, NgcWindowComponent, NgcUtility, NgcFormArray, ReactiveModel, NgcFormControl } from 'ngc-framework';
import { UldService } from '../../uld.service';
import { SightedUldRequest } from '../../uld.shared';

@Component({
  selector: 'app-maintain-global-uld-characteristics',
  templateUrl: './maintain-global-uld-characteristics.component.html',
  //styleUrls: ['./maintain-global-uld-characteristics.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
})
export class MaintainGlobalUldCharacteristicsComponent extends NgcPage {

  /*windowFlag is the flag used in ngIf in pop up window*/
  windowFlag: boolean = false;
  /*searchFlag is the flag used for search*/
  searchFlag: boolean = false;
  /*updateEditFormData is the flag used for EditSave window*/
  updateEditFormData: boolean = false;
  /*addFormData is the flag used for Save window*/
  addFormData: boolean = false;
  /*flagGreater,flagMinMax is the flag used for MinMax Allow validation*/
  flagGreater: boolean = false;
  flagMinMax: boolean = false;
  /*disabledFlag is the flag used for Save and EditSave button enable*/
  disabledFlag: boolean = true;
  /*it is used for edit and editSave api*/
  globalInventoryUldCharacteristicsId: any;
  globalUldList: any;
  /*it is used for saving the api data*/
  response: any;
  /*it is used for edit index*/
  index: any;

  /* constructor for dependency injection */
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router,
    private uldCharacteristicService: UldService) {
    super(appZone, appElement, appContainerElement);
  }
  /*view child is the pop up add window for adding ULD table data*/
  @ViewChild('addWindow')
  /*addWindow is the component for pop up window*/
  private addWindow: NgcWindowComponent;
  /*
  * Reactive Form
  */
  /* This form is used for searchForm Form , It carries the search request to the backend */
  @ReactiveModel(SightedUldRequest)
  public searchForm: NgcFormGroup;
  /* This is the main form, it  is used for saving the respose of list data */
  @ReactiveModel(SightedUldRequest)
  public form: NgcFormGroup;
  /* This is the edit and add form, it  is used for saving the new record */
  @ReactiveModel(SightedUldRequest)
  public windowForm: NgcFormGroup;

  /* Oninit function */
  ngOnInit() {
    super.ngOnInit();
  }

  /* On search : called when search is clicked */
  onSearch() {
    this.resetFormMessages();
    this.windowFlag = true;
    this.searchFlag = false;
    let request = this.searchForm.getRawValue();
    this.uldCharacteristicService.getGlobalUldCharacteristicsDetails(request).subscribe(response => {
      this.resetFormMessages();
      this.form.reset();
      if (!this.showResponseErrorMessages(response.data)) {
        /* when globalUldList data is received */
        this.globalUldList = response.data;
        if (this.globalUldList && this.globalUldList.length > 0) {
          this.searchFlag = true;
          // if (response.data.length > 9999) {
          //   this.showInfoStatus('global Uld  records are more than 10000');
          // }
          /* when globalUld List data is received patch is uldCharacteristicsGroup formArray */
          this.form.get('uldCharacteristicsGroup').patchValue(response.data);
        }
      }
      if (response.data == null || response.data == '') {
        this.showErrorMessage('no.record');
      }
    });
  }

  /* to close the pop up window */
  closeAddWindow() {
    this.windowFlag = true;
    this.addWindow.close();
  }

  /* to open the pop up window by clicking on Add button */
  onAdd() {
    this.windowForm.reset();
    this.windowFlag = true;
    this.addFormData = true;
    this.updateEditFormData = false;
    /* to open the pop up window */
    this.addWindow.open();
  }

  /* to save the global Uld data in pop up window */
  onSave() {
    /* validation for save*/
    if (this.flagGreater) {
      this.showInfoStatus("Min Allow value must not be greater than Max Allow");
      return;
    } else if (this.flagMinMax) {
      this.showInfoStatus("Max Allow value must be greater than Min Allow");
      return;
    }
    /* to validate the windowform global Uld data */
    this.windowForm.validate();
    if (!this.windowForm.valid) {
      return;
    } else {
      let request = this.windowForm.getRawValue();
      /* action is used to perform Save operation for inserting the data*/
      request.action = 'save';
      this.uldCharacteristicService.saveGlobalUldCharacteristic(request).subscribe(response => {
        this.resetFormMessages();
        if (response != null) {
          if (!this.showResponseErrorMessages(response)) {
            this.form.patchValue(response.data);
            this.windowFlag = false;
            this.closeAddWindow();
            this.showSuccessStatus('uld.operation.completed.successfully');
            this.onSearch();
          }
        }
      }, error => {
        this.showErrorStatus(error);
      });
    }
  }

  /* by clicking on edit we will get the edit windowForm data */
  onEdit(index) {
    this.addFormData = false;
    this.updateEditFormData = true;
    /* to patch the response data on edit windowForm*/
    this.globalInventoryUldCharacteristicsId = (<NgcFormControl>this.form.get(['uldCharacteristicsGroup', index, 'globalInventoryUldCharacteristicsId'])).value;
    this.windowForm.patchValue(<NgcFormGroup>this.form.get(['uldCharacteristicsGroup', index]).value);
    if (NgcUtility.isBlank(this.windowForm.get('stdLimit').value)) {
      this.windowForm.get('stdLimit').patchValue(this.form.get(['uldCharacteristicsGroup', index, 'stdLimit']).value);
    }
    this.addWindow.open();
  }

  /* to save the editSave data in the windowForm*/
  onEditSave() {
    /* validation for editsave*/
    if (this.flagGreater) {
      this.showInfoStatus("uld.min.greater.max");
      return;
    } else if (this.flagMinMax) {
      this.showInfoStatus("uld.max.greater.min");
      return;
    }
    this.resetFormMessages();
    /* to validatw the window form*/
    this.windowForm.validate();
    if (!this.windowForm.valid) {
      return;
    }
    const dataToGet = this.windowForm.getRawValue();
    dataToGet.globalInventoryUldCharacteristicsId = this.globalInventoryUldCharacteristicsId;
    /* action is used to perform save operation for update the data in db*/
    dataToGet.action = 'editSave';
    this.uldCharacteristicService.saveGlobalUldCharacteristic(dataToGet).subscribe(response => {
      if (!this.showResponseErrorMessages(response.data)) {
        this.resetFormMessages();
        this.windowFlag = false;
        this.closeAddWindow();
        this.showSuccessStatus('g.completed.successfully');
        this.onSearch();
        this.windowForm.reset();
      }
      this.addWindow.close();
    });
  }

  /* this is used to perform delete operation based on index in db*/
  onDelete(index) {
    this.showConfirmMessage("import.are.You.Sure.To.Delete").then(fulfilled => {
      (this.form.get(["uldCharacteristicsGroup", index]) as NgcFormControl).markAsDeleted();
      const dataToGet = {
        globalInventoryUldCharacteristicsId: (<NgcFormControl>this.form.get(['uldCharacteristicsGroup', index, 'globalInventoryUldCharacteristicsId'])).value
      }
      this.uldCharacteristicService.deleteGlobalUldCharacteristic(dataToGet).subscribe(response => {
        if (!this.showResponseErrorMessages(response.data)) {
          this.resetFormMessages();
          this.showErrorStatus('g.no.record.delete');
          this.onSearch();
        }
      });
    });
  }

  /* this is used to fetch UldType based on UldGroup we select*/
  onSelectUldGroup(event) {
    if (event && event.code) {
      this.searchForm.get('uldGroupId').setValue(event.param1);
    } else {
      this.searchForm.get('uldGroupId').setValue(null);
    }
  }

  /* this is used to put validation on min and max in windowform so that Min is not greater than Max and vice-versa*/
  minMaxValue(type, value, event) {
    this.flagGreater = false;
    this.flagMinMax = false;
    if (this.windowForm.get('stdLimit').value > 0 && this.windowForm.get('minAllow').value > 0 && this.windowForm.get('maxAllow').value > 0) {
      this.disabledFlag = false;
    }
    /* this type is called when the value is enter in minAllow */
    if (type == 'min') {
      if ((this.windowForm.get('minAllow').value > this.windowForm.get('maxAllow').value) && this.windowForm.get('maxAllow').value > 0) {
        this.showErrorMessage("uld.min.greater.max");
        this.flagGreater = true;
      } /* this type is called when the value is enter in maxAllow*/
    } else if (type == 'max') {
      if ((this.windowForm.get('maxAllow').value < this.windowForm.get('minAllow').value) && this.windowForm.get('maxAllow').value > 0) {
        this.flagMinMax = true;
        this.showErrorMessage("uld.max.greater.min");
      }
    }
    if (this.flagGreater == false && this.flagMinMax == false) {
      this.refreshFormMessages(event);
    }
  }
  onClickCarrierGroup(event) {
    this.searchForm.get('carrierGroup').patchValue(event.code);
    this.searchForm.get('carrierCode').patchValue(null);
    this.searchFlag = false;
  }
  onClickCarrierCode() {
    this.searchForm.get('carrierGroup').patchValue(null);
    this.searchForm.get('carrierGroupDesc').patchValue(null);
    this.searchFlag = false;
  }
}
