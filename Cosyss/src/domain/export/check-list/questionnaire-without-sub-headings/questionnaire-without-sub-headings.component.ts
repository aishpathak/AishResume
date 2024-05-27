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

@Component({
  selector: 'app-questionnaire-without-sub-headings',
  templateUrl: './questionnaire-without-sub-headings.component.html',
  styleUrls: ['./questionnaire-without-sub-headings.component.scss']
})
export class QuestionnaireWithoutSubHeadingsComponent extends NgcPage {
  resp: any;
  arrayUser: any;
  forwardedData: any;
  dataToForward: any;
  checkListIdData: any;
  checkListTypeData: any;
  dataForParameterDropdown: any;
  hasReadPermission: boolean = false;
  private form: NgcFormGroup = new NgcFormGroup({
    id: new NgcFormControl(),
    idData: new NgcFormControl(),
    fontSize: new NgcFormControl(),
    fontStyle: new NgcFormControl(),
    alignment: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    applyToAll: new NgcFormControl(false),
    carrierCodeData: new NgcFormControl(),
    backGroundColor: new NgcFormControl(null),
    applyBorder: new NgcFormControl(false),
    checkListTypeData: new NgcFormControl(),
    questionnaireWithoutSubHeadings: new NgcFormArray([]),
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
    this.checkListTypeData = this.forwardedData.checkListTypeData;
    this.dataForParameterDropdown = this.createSourceParameter(
      this.checkListIdData
    );
    this.onSearch();
  }

  onAddQuestionnaireWithSubHeadings() {
    let dataToChangeAdd = (<NgcFormArray>this.form.controls['applyToAll']).value;
    const lengthToDisplay = (<NgcFormArray>this.form.get(['questionnaireWithoutSubHeadings'])).length;
    if (dataToChangeAdd) {
      (<NgcFormArray>this.form.get(['questionnaireWithoutSubHeadings'])).addValue([
        {
          originId: '',
          lineItem: '',
          required: false,
          sequence: lengthToDisplay + 1,
          fontSize: this.form.get('fontSize').value,
          fontStyle: this.form.get('fontStyle').value,
          alignment: this.form.get('alignment').value,
          applyBorder: this.form.get('applyBorder').value,
          fontFamily: this.form.get('fontFamily').value,
          backGroundColor: this.form.get('backGroundColor').value,
          notes: [{
            sequence: 1,
            lineItem: '',
            fontSize: this.form.get('fontSize').value,
            fontStyle: this.form.get('fontStyle').value,
            alignment: this.form.get('alignment').value,
            applyBorder: this.form.get('applyBorder').value,
            fontFamily: this.form.get('fontFamily').value,
            backGroundColor: this.form.get('backGroundColor').value,
          }]
        }
      ]);
    } else {
      (<NgcFormArray>this.form.get(['questionnaireWithoutSubHeadings'])).addValue([
        {
          originId: '',
          lineItem: '',
          fontSize: '',
          required: false,
          fontStyle: '',
          fontFamily: '',
          alignment: '',
          applyBorder: false,
          backGroundColor: null,
          sequence: lengthToDisplay + 1,
          notes: [{
            select: '',
            sequence: 1,
            lineItem: '',
            fontFamily: '',
            fontSize: '',
            fontStyle: '',
            alignment: '',
            applyBorder: false,
            backGroundColor: null,
          }]
        }
      ]);

    }
  }
  onAddQuestionnaireWithSubHeadingsNotes(index) {
    let dataToChangeAdd = (<NgcFormArray>this.form.controls['applyToAll']).value;
    const lengthToDisplay = (<NgcFormArray>this.form.get(['questionnaireWithoutSubHeadings', index, 'notes'])).length;
    if (dataToChangeAdd) {
      (<NgcFormArray>this.form.get(['questionnaireWithoutSubHeadings', index, 'notes'])).addValue([
        {
          lineItem: '',
          sequence: lengthToDisplay + 1,
          fontSize: this.form.get('fontSize').value,
          fontStyle: this.form.get('fontStyle').value,
          alignment: this.form.get('alignment').value,
          applyBorder: this.form.get('applyBorder').value,
          fontFamily: this.form.get('fontFamily').value,
          backGroundColor: this.form.get('backGroundColor').value,
        }]);
    } else {
      (<NgcFormArray>this.form.get(['questionnaireWithoutSubHeadings', index, 'notes'])).addValue([
        {
          lineItem: '',
          fontSize: '',
          fontStyle: '',
          alignment: '',
          fontFamily: '',
          applyBorder: false,
          backGroundColor: null,
          sequence: lengthToDisplay + 1,
        }]);
    }
  }

  onSave(event) {
    this.resetFormMessages();
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    const requestData = (<NgcFormArray>this.form.get('questionnaireWithoutSubHeadings')).getRawValue();
    let count = 0;
    let countNotes = 0;
    for (const eachRow of requestData) {
      if (!eachRow.checkListId) {
        eachRow.checkListId = this.checkListIdData;
      }
      count++;
      eachRow.sequence = count;
      if (eachRow.notes) {
        for (const eachRowNotes of eachRow.notes) {
          if (eachRowNotes.flagCRUD === 'R') {
            eachRowNotes.flagCRUD = 'U';
          }
          countNotes++;
          eachRowNotes.sequence = countNotes;
        }
      }
    }
    if (count > 0) {
      this._checklistService.onSaveQuestionnaireWithoutSubHeadings(requestData).subscribe(data => {
        console.log(JSON.stringify(data));
        this.resp = data;
        if (data.messageList != null) {
          this.showErrorStatus(data.messageList[0].message);
        } else {
          this.showSuccessStatus('g.completed.successfully');
          this.onSearch();
        }
      }, error => this.showErrorStatus('g.error'));
    } else {
      this.showErrorStatus("export.add.atleast.one.record");
    }
  }

  onDeleteQuestionnaireWithoutSubheadings(index) {
    this.showConfirmMessage('export.delete.questionnaire.without.sub.headings.record.confirmation').then(fulfilled => {
      (<NgcFormArray>this.form.get(['questionnaireWithoutSubHeadings'])).markAsDeletedAt(index);
      const dataToChangeQuestion = (<NgcFormArray>this.form.get(['questionnaireWithoutSubHeadings'])).length;
      for (let j = 0; j < dataToChangeQuestion; j++) {
        this.form.get(['questionnaireWithoutSubHeadings', j, 'sequence']).setValue(j + 1);
        let dataToChangeNotes = (<NgcFormArray>this.form.get(['questionnaireWithoutSubHeadings', j, 'notes'])).length;
        for (let k = 0; k < dataToChangeNotes; k++) {
          this.form.get(['questionnaireWithoutSubHeadings', j, 'notes', k, 'sequence']).setValue(k + 1);
        }
      }
    });
  }

  onDeleteQuestionnaireNotesWithoutSubheadings(index, sindex) {
    this.showConfirmMessage('export.delete.page.footer.notes.record.confirmation').then(fulfilled => {
      (<NgcFormArray>this.form.get(['questionnaireWithoutSubHeadings', index, 'notes'])).markAsDeletedAt(sindex);
      const dataToChangeNotes = (<NgcFormArray>this.form.get(['questionnaireWithoutSubHeadings', index, 'notes'])).length;
      for (let k = 0; k < dataToChangeNotes; k++) {
        this.form.get(['questionnaireWithoutSubHeadings', index, 'notes', k, 'sequence']).setValue(k + 1);
      }
    });
  }

  onCancel() {
    this.navigateTo(this.router, '/export/checklist/checklisttemplate', this.dataToForward);
  }

  onChangeCheckAll(event) {
    if (event) {
      let dataToChange = (<NgcFormArray>this.form.controls['questionnaireWithoutSubHeadings']).length;
      console.log(dataToChange);
      for (let i = 0; i < dataToChange; i++) {
        this.form.get(['questionnaireWithoutSubHeadings', i, 'fontStyle']).setValue(this.form.get('fontStyle').value);
        this.form.get(['questionnaireWithoutSubHeadings', i, 'fontSize']).setValue(this.form.get('fontSize').value);
        this.form.get(['questionnaireWithoutSubHeadings', i, 'alignment']).setValue(this.form.get('alignment').value);
        this.form.get(['questionnaireWithoutSubHeadings', i, 'applyBorder']).setValue(this.form.get('applyBorder').value);
        this.form.get(['questionnaireWithoutSubHeadings', i, 'fontFamily']).setValue(this.form.get('fontFamily').value);
        this.form.get(['questionnaireWithoutSubHeadings', i, 'backGroundColor']).setValue(this.form.get('backGroundColor').value);
        let dataToChangeNotes = (<NgcFormArray>this.form.get(['questionnaireWithoutSubHeadings', i, 'notes'])).length;
        for (let j = 0; j < dataToChangeNotes; j++) {
          this.form.get(['questionnaireWithoutSubHeadings', i, 'notes', j, 'fontStyle']).setValue(this.form.get('fontStyle').value);
          this.form.get(['questionnaireWithoutSubHeadings', i, 'notes', j, 'fontSize']).setValue(this.form.get('fontSize').value);
          this.form.get(['questionnaireWithoutSubHeadings', i, 'notes', j, 'alignment']).setValue(this.form.get('alignment').value);
          this.form.get(['questionnaireWithoutSubHeadings', i, 'notes', j, 'applyBorder']).setValue(this.form.get('applyBorder').value);
          this.form.get(['questionnaireWithoutSubHeadings', i, 'notes', j, 'fontFamily']).setValue(this.form.get('fontFamily').value);
          this.form.get(['questionnaireWithoutSubHeadings', i, 'notes', j, 'backGroundColor']).setValue(this.form.get('backGroundColor').value);
        }
      }
    }
  }

  onSearch() {
    this.hasReadPermission = NgcUtility.hasReadPermission('SETUP_IATA_AIRLINE_CHECK_LIST');
    this._checklistService.onSearchQuestionnaireWithoutSubHeadings(this.forwardedData).subscribe(data => {
      this.resp = data;
      this.arrayUser = this.resp.data;
      this.form.get('checkListTypeData').setValue(this.dataToForward.checkListId);
      if (this.forwardedData.carrierCodeData) {
        this.form.get('carrierCodeData').setValue(this.forwardedData.carrierCodeData);
      } else {
        this.form.get('carrierCodeData').setValue(this.forwardedData.carrierCode);
      }
      let count = 0;
      let countNotes = 0;
      for (const eachRow of this.arrayUser) {
        count++;
        eachRow.sequence = count;
        if (eachRow.notes) {
          for (const eachRowNotes of eachRow.notes) {
            countNotes++;
            eachRowNotes.sequence = countNotes;
          }
        }
      }
      (<NgcFormArray>this.form.controls['questionnaireWithoutSubHeadings']).patchValue(this.arrayUser);
    }, error => this.showErrorStatus('g.error'));
  }
}
