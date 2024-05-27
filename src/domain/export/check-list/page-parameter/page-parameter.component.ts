import { Validators } from '@angular/forms';
import {
  Component, OnInit, NgZone, ElementRef, ViewContainerRef, OnDestroy, ViewChild
} from '@angular/core';
import {
  NgcUtility, NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcFormControl, PageConfiguration
} from 'ngc-framework';
import {
  ActivatedRoute, Router
} from '@angular/router';
import {
  CheckListService
} from '../check-list.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-page-parameter',
  templateUrl: './page-parameter.component.html',
  styleUrls: ['./page-parameter.component.scss']
})
export class PageParameterComponent extends NgcPage {
  resp: any;
  idCode: any;
  arrayUser: any;
  forwardedData: any;
  dataToForward: any;
  checkListIdData: any;
  hasReadPermission: boolean = false;
  private form: NgcFormGroup = new NgcFormGroup({
    id: new NgcFormControl(),
    idData: new NgcFormControl(),
    fontSize: new NgcFormControl(),
    alignment: new NgcFormControl(),
    fontStyle: new NgcFormControl(),
    fontFamily: new NgcFormControl(),
    parameters: new NgcFormArray([]),
    carrierCode: new NgcFormControl(),
    applyToAll: new NgcFormControl(false),
    carrierCodeData: new NgcFormControl(),
    backGroundColor: new NgcFormControl('FFFFFF'),
    applyBorder: new NgcFormControl(false),
    checkListTypeData: new NgcFormControl(),
  });
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private router: Router, private activatedRoute: ActivatedRoute, private _checklistService: CheckListService) {
    super(appZone, appElement, appContainerElement);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    super.ngOnInit();
    this.dataToForward = this._checklistService.dataFromChecklistTemplate;
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    this.checkListIdData = this.forwardedData.idData;
    this.onSearch();
  }

  onSave(event) {
    this.resetFormMessages();
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    const pageParameterRequest = (<NgcFormArray>this.form.controls['parameters']).getRawValue();
    let count = 0;
    for (const eachRow of pageParameterRequest) {
      count++;
      if (eachRow.sequence) {
        eachRow.sequence = count;
      }
      if (!eachRow.checkListId) {
        eachRow.checkListId = this.checkListIdData;
      }
    }
    if (count > 0) {
      this._checklistService.onSavePageParameter(pageParameterRequest).subscribe(data => {
        this.resp = data;
        if (data.messageList != null) {
          this.showErrorStatus(data.messageList[0].message);
        } else {
          this.showSuccessStatus('g.completed.successfully');
          this.onSearch();
        }
      });
    } else {
      this.showErrorStatus("export.add.atleast.one.record");
    }
  }

  onAddPageParameter() {
    const lengthToDisplay = (<NgcFormArray>this.form.get(['parameters'])).length;
    let dataToChangeAdd = (<NgcFormArray>this.form.controls['applyToAll']).value;
    if (dataToChangeAdd === true) {
      (<NgcFormArray>this.form.get(['parameters'])).addValue([
        {
          name: '',
          label: '',
          dataType: '',
          maxLength: '',
          positionAt: '',
          required: false,
          renderSignatureField: false,
          sequence: lengthToDisplay + 1,
          fontSize: this.form.get('fontSize').value,
          fontStyle: this.form.get('fontStyle').value,
          alignment: this.form.get('alignment').value,
          fontFamily: this.form.get('fontFamily').value,
          applyBorder: this.form.get('applyBorder').value,
          backGroundColor: this.form.get('backGroundColor').value,
        }
      ]);
    } else {
      (<NgcFormArray>this.form.get(['parameters'])).addValue([
        {
          name: '',
          label: '',
          dataType: '',
          fontSize: '',
          fontStyle: '',
          maxLength: '',
          alignment: '',
          positionAt: '',
          fontFamily: '',
          required: false,
          applyBorder: false,
          backGroundColor: null,
          renderSignatureField: false,
          sequence: lengthToDisplay + 1,
        }
      ]);
    }
  }

  onDeletePageParameter(index) {
    this.showConfirmMessage('export.delete.page.parameter.record.confirmation').then(fulfilled => {
      (<NgcFormArray>this.form.controls['parameters']).markAsDeletedAt(index);
      const dataToChangeNotes = (<NgcFormArray>this.form.get(['parameters'])).length;
      for (let k = 0; k < dataToChangeNotes; k++) {
        this.form.get(['parameters', k, 'sequence']).setValue(k + 1);
      }
    });
  }

  onCancel() {
    this.navigateTo(this.router, '/export/checklist/checklisttemplate', this.dataToForward);
  }

  onChangeCheckAll(event) {
    if (event) {
      let dataToChange = (<NgcFormArray>this.form.controls['parameters']).length;
      console.log(dataToChange);
      for (let i = 0; i < dataToChange; i++) {
        this.form.get(['parameters', i, 'fontSize']).setValue(this.form.get('fontSize').value);
        this.form.get(['parameters', i, 'fontStyle']).setValue(this.form.get('fontStyle').value);
        this.form.get(['parameters', i, 'alignment']).setValue(this.form.get('alignment').value);
        this.form.get(['parameters', i, 'fontFamily']).setValue(this.form.get('fontFamily').value);
        this.form.get(['parameters', i, 'applyBorder']).setValue(this.form.get('applyBorder').value);
        this.form.get(['parameters', i, 'backGroundColor']).setValue(this.form.get('backGroundColor').value);
      }
    }
  }

  onDataType(event, index) {
    if (event.code === 'Date') {

    } else if (event.code === 'DateTime') {

    } else if (event.code === 'Text') {

    } else if (event.code === 'Number') {

    } else if (event.code === 'AWB') {

    }
  }

  onSearch() {
    this.hasReadPermission = NgcUtility.hasReadPermission('SETUP_IATA_AIRLINE_CHECK_LIST')
    this._checklistService.onSearchPageParameter(this.forwardedData).subscribe(data => {
      this.resp = data;
      this.arrayUser = this.resp.data;
      this.form.get('checkListTypeData').setValue(this.dataToForward.checkListId);
      if (this.forwardedData.carrierCodeData) {
        this.form.get('carrierCodeData').setValue(this.forwardedData.carrierCodeData);
      } else {
        this.form.get('carrierCodeData').setValue(this.forwardedData.carrierCode);
      }
      let count = 0;
      for (const eachRow of this.arrayUser) {
        count++;
        eachRow.sequence = count;
      }
      (<NgcFormArray>this.form.controls['parameters']).patchValue(this.arrayUser);
      for (let i = 0; i < this.arrayUser.length; i++) {
        if (this.form.get(['parameters', i, 'dataType']).value === 'Number' || this.form.get(['parameters', i, 'dataType']).value === 'Text') {
          this.form.get(['parameters', i, 'maxLength']).setValidators([Validators.required]);
        } else {
          this.form.get(['parameters', i, 'maxLength']).setValidators([]);
        }

      }
    }, error => this.showErrorStatus('g.error'));
  }
}



