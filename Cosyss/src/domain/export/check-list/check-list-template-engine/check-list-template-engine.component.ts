import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckListService } from '../check-list.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, OnDestroy, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent,
  NgcFormControl, PageConfiguration
} from 'ngc-framework';

@Component({
  selector: 'app-check-list-template-engine',
  templateUrl: './check-list-template-engine.component.html',
  styleUrls: ['./check-list-template-engine.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})

export class CheckListTemplateEngineComponent extends NgcPage {
  resp: any;
  idCode: any;
  errors: any;
  arrayUser: any;
  formArray: any;
  idCodeData: any;
  requestData: any;
  ReceivedData: any;
  errorData: boolean;
  dataRetrieved: any;
  disableFlag = false;
  isSelected: boolean;
  carrierCodeData: any;
  carrierCodeCopy: any;
  checkListTypeData: any;
  hideCarrierCode = false;
  checkListTypesId: boolean;
  requiredCarrierCode = false;
  AirlineByCheckListIDDropdown: any;
  private form: NgcFormGroup = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    fromOtherAirlines: new NgcFormControl(),
    checkListId: new NgcFormControl()
  });
  private checklistForm: NgcFormGroup = new NgcFormGroup({
    checkListId: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    fromOtherAirlines: new NgcFormControl(),
    iataCheckListModel: new NgcFormArray([]),
  });

  /**
  * Initialize
  * @param appZone Ng Zone
  * @param appElement Element Ref
  * @param appContainerElement View Container Ref
  */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private router: Router, private activatedRoute: ActivatedRoute, private _checklistService: CheckListService) {
    super(appZone, appElement, appContainerElement);
  }

  public ngOnInit() {
    super.ngOnInit();
    this.ReceivedData = this.getNavigateData(this.activatedRoute);
    if (this.ReceivedData) {
      this.form.controls.checkListId.valueChanges.subscribe(
        (newValue) => {
          this.AirlineByCheckListIDDropdown = this.createSourceParameter(
            this.form.get("checkListId").value
          );

        }
      );
      this.form.get('checkListId').setValue(this.ReceivedData.checkListId);
      this.form.get('carrierCode').setValue(this.ReceivedData.carrierCode);
      this.onSearch();
    }
    this.checkListTypesId = false;
  }

  /**
  * This function is responsible for Searching the CheckList Record
  */
  onSearch() {
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    const checklistRequest = this.form.getRawValue();
    this._checklistService.dataFromChecklistTemplate = this.form.getRawValue();
    this._checklistService.onSearchChecklist(checklistRequest || event).subscribe(data => {
      this.resp = data;
      this.arrayUser = this.resp.data;
      this.refreshFormMessages(data);
      if (this.arrayUser.length > 0) {
        this.disableFlag = true;
        this.checkListTypesId = true;
        (<NgcFormArray>this.checklistForm.controls['iataCheckListModel']).patchValue(this.arrayUser);
      } else {
        this.checkListTypesId = false;
        this.showErrorStatus('export.no.data.found');
      }
      let count = 0;
      for (const eachRow of this.arrayUser) {
        if (eachRow.carrierCode === 'IATA') {
          count++;
        } else {
          this.requiredCarrierCode = false;
        }
      }
      if (count) {
        this.requiredCarrierCode = true;
      }
      this.formArray = this.checklistForm.get('iataCheckListModel') as NgcFormArray;
    }, error => this.showErrorStatus('g.error'));
  }

  /**
  * @param event
  * For Saving All the record whether it is
  * Updated
  * Inserted
  * Deleted
  */
  onSave(event) {
    this.checklistForm.validate();
    if (this.checklistForm.invalid) {
      return;
    }
    const checklistRequest = (<NgcFormArray>this.checklistForm.controls['iataCheckListModel']).getRawValue();
    if (this.idCodeData) {
      for (const eachRow of checklistRequest) {
        eachRow.checklistType = this.checklistForm.get('checkListId').value;
        eachRow.checkListId = this.idCodeData;
        if (!eachRow.carrierCode) {
          eachRow.carrierCode = 'IATA';
        }
      }
    } else {
      for (const eachRow of checklistRequest) {
        eachRow.checkListId = this.ReceivedData.checkListId;
        eachRow.checklistType = this.checklistForm.get('checkListId').value;
        if (!eachRow.carrierCode) {
          eachRow.carrierCode = 'IATA';
        }
      }
    }
    this._checklistService.onSaveChecklist(checklistRequest).subscribe(data => {
      if (!data) {
        this.showSuccessStatus('g.completed.successfully');
        this.onSearch();
      } else {
        this.showErrorStatus(data.messageList[0].message);
      }
    });
  }

  /**
  * For Navigating to Page Parameter
  */
  onPageParameter() {
    this.formArrayFunction();
    if (this.isSelected) {
      this.requestData.checkListTypeData = this.idCode;
      this.requestData.idData = this.requestData.checkListId;
      this.requestData.checklistTypeDataToPatch = this.idCodeData;
      this.requestData.carrierCodeData = this.carrierCodeData;
      this.navigateTo(this.router, '/export/checklist/pageparameter', this.requestData);
    }
  }

  /**
  * For Navigating to Page Header
  */
  onPageHeader() {
    this.formArrayFunction();
    if (this.isSelected) {
      this.requestData.checkListTypeData = this.idCode;
      this.requestData.idData = this.requestData.checkListId;
      this.navigateTo(this.router, '/export/checklist/pageheader', this.requestData);
    }
  }

  /**
  * For Navigating to Page Details
  */
  onPageDetails() {
    this.formArrayFunction();
    if (this.isSelected) {
      this.requestData.checkListTypeData = this.idCode;
      this.requestData.idData = this.requestData.checkListId;
      this.navigateTo(this.router, '/export/checklist/pagedetail', this.requestData);
    }
  }

  /**
  * For Navigating to Questionnaire with Sub Headings
  */
  onQuestionWithSubHeadings() {
    this.formArrayFunction();
    if (this.isSelected) {
      this.requestData.checkListTypeData = this.idCode;
      this.requestData.idData = this.requestData.checkListId;
      this.navigateTo(this.router, '/export/checklist/questionnairewithsubheadings', this.requestData);
    }
  }

  /**
  * For Navigating to Questionnaire without Sub Headings
  */
  onQuestionWithoutSubHeadings() {
    this.formArrayFunction();
    if (this.isSelected) {
      this.requestData.checkListTypeData = this.idCode;
      this.requestData.idData = this.requestData.checkListId;
      this.navigateTo(this.router, '/export/checklist/questionnairewithoutsubheadings', this.requestData);
    }
  }

  /**
  * For Navigating to Page Footer Screen 
  */
  onPageFooter() {
    this.formArrayFunction();
    if (this.isSelected) {
      this.requestData.carrierCodeData = this.checklistForm.controls.carrierCode.value;
      this.requestData.idData = this.requestData.checkListId;
      this.navigateTo(this.router, '/export/checklist/pagefooter', this.requestData);
    }
  }

  /**
  * For Adding new Record 
  */
  onAddChecklist() {
    const checklistTypeLength = (<NgcFormArray>this.checklistForm.controls['iataCheckListModel']).length;
    if (checklistTypeLength > 0) {
      const checkLength = checklistTypeLength - 1;
      const airlineLength = (<NgcFormArray>this.checklistForm.get(['iataCheckListModel', checkLength, 'carrierCode'])).value;
      if (airlineLength === '') {
        this.showInfoStatus('export.select.airline');
        return;
      }
    }
    this.checkListTypesId = true;
    (<NgcFormArray>this.checklistForm.controls['iataCheckListModel']).addValue([
      {
        select: false,
        carrierCode: '',
        checkListPageDetailExists: '',
        checkListPageFooterExists: '',
        checkListParametersExists: '',
        checkListPageHeaderExists: '',
        requiredAlignmentForQuestions: 'SC',
        requiredAlignmentForParameters: 'SC',
        checkListQuestionnaireWithSubHeadingExists: '',
        checkListQuestionnaireWithoutSubHeadingExists: '',
      }
    ]);
  }

  /**
  * selectLov
  * @param object
  * For selecting and setting LOV value for displaying in another screens
  */
  selectLov(object) {
    this.checklistForm.get('carrierCode').setValue(object.desc);
    if (object.code) {
      this.hideCarrierCode = true;
    } else {
      this.hideCarrierCode = false;
    }
  }

  /**
  * select Dropdown
  * @param object
  * For selecting and setting dropdown value for displaying in another screens
  */
  selectDropDown(object) {
    this.AirlineByCheckListIDDropdown = this.createSourceParameter(
      this.form.get("checkListId").value
    );

    this.checklistForm.get('checkListId').setValue(object.desc);
    this.idCode = object.desc;
    this.idCodeData = object.code;
  }

  /*
  * For Deleting the Value of Checklist
  */
  onDeleteChecklist(index) {
    this.showConfirmMessage('export.delete.checklist.record.confirmation').then(fulfilled => {
      (<NgcFormArray>this.checklistForm.get(['iataCheckListModel'])).markAsDeletedAt(index);
    });
  }

  /*
  * For Checking whether Airline is selected or not to navigate to respective screen
  */
  formArrayFunction() {
    if (this.formArray) {
      try {
        this.formArray.controls.forEach((formGroup: NgcFormGroup) => {
          const selectControl = formGroup.get('select');
          if (selectControl.value) {
            this.requestData = {
              checkListId: formGroup.controls.iataId.value,
              carrierCode: formGroup.controls.carrierCode.value
            };
            if (selectControl && selectControl.value === true) {
              this.isSelected = true;
              throw new Error('export.data.found');
            }
          } else {
            this.errorData = true;
          }
        });
        if (this.errorData) {
          this.showInfoStatus('export.select.airline');
        }
      } catch (e) { }
    }
  }

  onCopyChecklist(event) {
    let dataToCheckkDuplicate: any = (<NgcFormArray>this.checklistForm.get("iataCheckListModel")).getRawValue();

    for (let i = 0; i < dataToCheckkDuplicate.length; i++) {
      for (let j = 0; j < dataToCheckkDuplicate.length; j++) {
        if (i != j) {
          if (dataToCheckkDuplicate[i].carrierCode == dataToCheckkDuplicate[j].carrierCode) {
            this.showErrorStatus("error.duplicate.airline");
            return;
          }
        }
      }
    }

    const airlineData = (<NgcFormArray>this.checklistForm.controls['iataCheckListModel']).length;
    const airlineDataPresent = this.checklistForm.get(['iataCheckListModel', airlineData - 1, 'carrierCode']).value;
    if (airlineDataPresent === '') {
      this.showInfoStatus('export.select.airline');
      return;
    }
    if (this.carrierCodeCopy) {
      if (this.checklistForm.controls.fromOtherAirlines.value) {
        const copyRequest = {
          comCheckListTypesId: this.form.controls.checkListId.value,
          carrierCode: this.checklistForm.controls.fromOtherAirlines.value,
          carrierCodeCopy: this.carrierCodeCopy
        }
        this._checklistService.onCopyChecklist(copyRequest).subscribe(data => {
          if (data) {
            this.showSuccessStatus('g.completed.successfully');
            this.onSearch();
          } else {
            this.showErrorStatus(data.messageList[0].message);
          }
        });
      } else {
        this.showInfoStatus('export.select.airline.from.dropdown');
      }
    } else {
      this.showInfoStatus('export.add.airline');
      return;
    }

  }

  onSelectLOV(event, index) {
    this.carrierCodeCopy = event.code;
  }
}
