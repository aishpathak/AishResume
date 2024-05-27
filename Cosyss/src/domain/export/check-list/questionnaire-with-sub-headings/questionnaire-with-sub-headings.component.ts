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
  selector: 'app-questionnaire-with-sub-headings',
  templateUrl: './questionnaire-with-sub-headings.component.html',
  styleUrls: ['./questionnaire-with-sub-headings.component.scss']
})
export class QuestionnaireWithSubHeadingsComponent extends NgcPage {
  resp: any;
  arrayUser: any;
  indexData: any;
  forwardedData: any;
  dataToForward: any;
  checkListIdData: any;
  checkListTypeData: any;
  questionnairRrequest: any;
  dataForParameterDropdown: any;
  hasReadPermission: boolean = false;
  @ViewChild('questionnaireWithSubHeadingsWindow') questionnaireWithSubHeadingsWindow: NgcWindowComponent;
  private form: NgcFormGroup = new NgcFormGroup({
    id: new NgcFormControl(),
    idData: new NgcFormControl(),
    fontSize: new NgcFormControl(),
    questions: new NgcFormArray([]),
    fontStyle: new NgcFormControl(),
    alignment: new NgcFormControl(),
    fontFamily: new NgcFormControl(),
    applyToAll: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    carrierCodeData: new NgcFormControl(),
    backGroundColor: new NgcFormControl(null),
    applyBorder: new NgcFormControl(false),
    checkListTypeData: new NgcFormControl(),
    questionnaireWithSubHeadings: new NgcFormArray([]),
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
    const lengthToDisplay = (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings'])).length;
    if (dataToChangeAdd) {
      (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings'])).addValue([
        {
          lineItem: '',
          sequence: lengthToDisplay + 1,
          fontSize: this.form.get('fontSize').value,
          fontStyle: this.form.get('fontStyle').value,
          alignment: this.form.get('alignment').value,
          fontFamily: this.form.get('fontFamily').value,
          applyBorder: this.form.get('applyBorder').value,
          backGroundColor: this.form.get('backGroundColor').value,
          questions: [{
            sequence: 1,
            lineItem: '',
            required: false,
            originId: '',
            fontSize: this.form.get('fontSize').value,
            fontStyle: this.form.get('fontStyle').value,
            alignment: this.form.get('alignment').value,
            fontFamily: this.form.get('fontFamily').value,
            applyBorder: this.form.get('applyBorder').value,
            backGroundColor: this.form.get('backGroundColor').value,
            notes: [{
              sequence: 1,
              lineItem: '',
              fontSize: this.form.get('fontSize').value,
              fontStyle: this.form.get('fontStyle').value,
              alignment: this.form.get('alignment').value,
              fontFamily: this.form.get('fontFamily').value,
              applyBorder: this.form.get('applyBorder').value,
              backGroundColor: this.form.get('backGroundColor').value
            }]
          }]
        }
      ]);
    } else {
      (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings'])).addValue([
        {
          sequence: lengthToDisplay + 1,
          lineItem: '',
          fontSize: '',
          alignment: '',
          fontStyle: '',
          fontFamily: '',
          applyBorder: false,
          backGroundColor: null,
          questions: [{
            sequence: 1,
            lineItem: '',
            originId: '',
            fontSize: '',
            fontStyle: '',
            alignment: '',
            fontFamily: '',
            required: false,
            applyBorder: false,
            backGroundColor: null,
            notes: [{
              sequence: 1,
              lineItem: '',
              fontStyle: '',
              fontSize: '',
              alignment: '',
              fontFamily: '',
              applyBorder: false,
              backGroundColor: null,
            }]
          }]
        }
      ]);
    }
  }

  onAddQuestions(index) {
    let dataToChangeAdd = (<NgcFormArray>this.form.controls['applyToAll']).value;
    const lengthToDisplay = (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings', index, 'questions'])).length;
    if (dataToChangeAdd) {
      (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings', index, 'questions'])).addValue([
        {
          lineItem: '',
          required: false,
          originId: '',
          sequence: lengthToDisplay + 1,
          fontSize: this.form.get('fontSize').value,
          fontStyle: this.form.get('fontStyle').value,
          alignment: this.form.get('alignment').value,
          fontFamily: this.form.get('fontFamily').value,
          applyBorder: this.form.get('applyBorder').value,
          backGroundColor: this.form.get('backGroundColor').value,
          notes: [{
            sequence: 1,
            lineItem: '',
            fontSize: this.form.get('fontSize').value,
            alignment: this.form.get('alignment').value,
            fontStyle: this.form.get('fontStyle').value,
            fontFamily: this.form.get('fontFamily').value,
            applyBorder: this.form.get('applyBorder').value,
            backGroundColor: this.form.get('backGroundColor').value,
          }]
        }
      ]);
    } else {
      (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings', index, 'questions'])).addValue([
        {
          sequence: lengthToDisplay + 1,
          lineItem: '',
          fontStyle: '',
          required: false,
          fontSize: '',
          alignment: '',
          fontFamily: '',
          applyBorder: false,
          originId: '',
          backGroundColor: null,
          notes: [{
            sequence: 1,
            lineItem: '',
            fontStyle: '',
            fontSize: '',
            alignment: '',
            fontFamily: '',
            applyBorder: false,
            backGroundColor: null,
          }]
        }
      ]);
    }
  }

  onAddNotes(index, sindex) {
    let dataToChangeAdd = (<NgcFormArray>this.form.controls['applyToAll']).value;
    const lengthToDisplay = (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings', index, 'questions', sindex, 'notes'])).length;
    if (dataToChangeAdd) {
      (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings', index, 'questions', sindex, 'notes']))
        .addValue([
          {
            lineItem: '',
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
      (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings', index, 'questions', sindex, 'notes']))
        .addValue([
          {
            fontSize: '',
            lineItem: '',
            fontStyle: '',
            alignment: '',
            fontFamily: '',
            applyBorder: false,
            backGroundColor: null,
            sequence: lengthToDisplay + 1,
          }
        ]);
    }
  }

  onQuestionaireCancel(event) {
    this.questionnaireWithSubHeadingsWindow.close();
  }

  onSave(event) {
    this.resetFormMessages();
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    this.questionnairRrequest = (this.form.get(['questionnaireWithSubHeadings']) as NgcFormArray).getRawValue();
    let count = 0;
    for (const eachRow of this.questionnairRrequest) {
      count++;
      eachRow.sequence = count;
      eachRow.checkListId = this.checkListIdData;
      const questionIdData = eachRow.questionId;
      const questionsData = eachRow.questions;
      let countQuestion = 0;
      for (const eachRowData of questionsData) {
        countQuestion++;
        eachRowData.sequence = countQuestion;
        eachRowData.checkListId = this.checkListIdData;
        const notesData = eachRowData.notes;
        let countNotes = 0;
        for (const eachRowDataValue of notesData) {
          countNotes++;
          eachRowDataValue.sequence = countNotes;
          eachRowDataValue.checkListId = this.checkListIdData;
        }
      }
    }
    if (count > 0) {
      this._checklistService.onSaveQuestionnaireWithSubHeadings(this.questionnairRrequest).subscribe(data => {
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


  onDeleteSubheadings(index) {
    this.showConfirmMessage('export.delete.sub.headings.record.confirmation').then(fulfilled => {
      (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings'])).markAsDeletedAt(index);
      const dataToChange = (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings'])).length;
      for (let i = 0; i < dataToChange; i++) {
        this.form.get(['questionnaireWithSubHeadings', i, 'sequence']).setValue(i + 1);
        let dataToChangeQuestion = (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings', i, 'questions'])).length;
        for (let j = 0; j < dataToChangeQuestion; j++) {
          this.form.get(['questionnaireWithSubHeadings', i, 'questions', j, 'sequence']).setValue(j + 1);
          let dataToChangeNotes = (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings', i, 'questions', j, 'notes'])).length;
          for (let k = 0; k < dataToChangeQuestion; k++) {
            this.form.get(['questionnaireWithSubHeadings', i, 'questions', j, 'notes', k, 'sequence']).setValue(k + 1);
          }
        }
      }
    });
  }

  onDeleteQuestions(index, sindex) {
    this.showConfirmMessage('export.delete.questionnaire.sub.headings.record.confirmation').then(fulfilled => {
      (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings', index, 'questions'])).markAsDeletedAt(sindex);
      const dataToChangeQuestion = (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings', index, 'questions'])).length;
      for (let j = 0; j < dataToChangeQuestion; j++) {
        this.form.get(['questionnaireWithSubHeadings', index, 'questions', j, 'sequence']).setValue(j + 1);
        let dataToChangeNotes = (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings', index, 'questions', j, 'notes'])).length;
        for (let k = 0; k < dataToChangeNotes; k++) {
          this.form.get(['questionnaireWithSubHeadings', index, 'questions', j, 'notes', k, 'sequence']).setValue(k + 1);
        }
      }
    }).catch(error => {
      console.log(error);
    });
  }

  onDeleteNotes(index, sindex, tindex) {
    this.showConfirmMessage('export.delete.questionnaire.notes.sub.headings.record.confirmation').then(fulfilled => {
      (<NgcFormArray>this.form.get([
        'questionnaireWithSubHeadings', index, 'questions', sindex, 'notes'])).markAsDeletedAt(tindex);
      const dataToChangeNotes = (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings', index, 'questions', sindex, 'notes'])).length;
      for (let k = 0; k < dataToChangeNotes; k++) {
        this.form.get(['questionnaireWithSubHeadings', index, 'questions', sindex, 'notes', k, 'sequence']).setValue(k + 1);
      }
    });
  }

  onCancel() {
    this.navigateTo(this.router, '/export/checklist/checklisttemplate', this.dataToForward);
  }


  onChangeCheckAll(event) {
    if (event) {
      let dataToChange = (<NgcFormArray>this.form.controls['questionnaireWithSubHeadings']).length;
      console.log(dataToChange);
      for (let i = 0; i < dataToChange; i++) {
        this.form.get(['questionnaireWithSubHeadings', i, 'fontSize']).setValue(this.form.get('fontSize').value);
        this.form.get(['questionnaireWithSubHeadings', i, 'fontStyle']).setValue(this.form.get('fontStyle').value);
        this.form.get(['questionnaireWithSubHeadings', i, 'alignment']).setValue(this.form.get('alignment').value);
        this.form.get(['questionnaireWithSubHeadings', i, 'fontFamily']).setValue(this.form.get('fontFamily').value);
        this.form.get(['questionnaireWithSubHeadings', i, 'applyBorder']).setValue(this.form.get('applyBorder').value);
        this.form.get(['questionnaireWithSubHeadings', i, 'backGroundColor']).setValue(this.form.get('backGroundColor').value);
        let dataToChangeQuestion = (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings', i, 'questions'])).length;
        for (let j = 0; j < dataToChangeQuestion; j++) {
          this.form.get(['questionnaireWithSubHeadings', i, 'questions', j, 'fontSize']).setValue(this.form.get('fontSize').value);
          this.form.get(['questionnaireWithSubHeadings', i, 'questions', j, 'fontStyle']).setValue(this.form.get('fontStyle').value);
          this.form.get(['questionnaireWithSubHeadings', i, 'questions', j, 'alignment']).setValue(this.form.get('alignment').value);
          this.form.get(['questionnaireWithSubHeadings', i, 'questions', j, 'fontFamily']).setValue(this.form.get('fontFamily').value);
          this.form.get(['questionnaireWithSubHeadings', i, 'questions', j, 'applyBorder']).setValue(this.form.get('applyBorder').value);
          this.form.get(['questionnaireWithSubHeadings', i, 'questions', j, 'backGroundColor']).setValue(this.form.get('backGroundColor').value);
          let dataToChangeNotes = (<NgcFormArray>this.form.get(['questionnaireWithSubHeadings', i, 'questions', j, 'notes'])).length;
          for (let k = 0; k < dataToChangeQuestion; k++) {
            this.form.get(['questionnaireWithSubHeadings', i, 'questions', j, 'notes', k, 'fontSize']).setValue(this.form.get('fontSize').value);
            this.form.get(['questionnaireWithSubHeadings', i, 'questions', j, 'notes', k, 'fontStyle']).setValue(this.form.get('fontStyle').value);
            this.form.get(['questionnaireWithSubHeadings', i, 'questions', j, 'notes', k, 'alignment']).setValue(this.form.get('alignment').value);
            this.form.get(['questionnaireWithSubHeadings', i, 'questions', j, 'notes', k, 'fontFamily']).setValue(this.form.get('fontFamily').value);
            this.form.get(['questionnaireWithSubHeadings', i, 'questions', j, 'notes', k, 'applyBorder']).setValue(this.form.get('applyBorder').value);
            this.form.get(['questionnaireWithSubHeadings', i, 'questions', j, 'notes', k, 'backGroundColor']).setValue(this.form.get('backGroundColor').value);
          }
        }
      }
    }
  }

  onSearch() {
    this.hasReadPermission = NgcUtility.hasReadPermission('SETUP_IATA_AIRLINE_CHECK_LIST');
    this._checklistService.onSearchQuestionnaireWithSubHeadings(this.forwardedData).subscribe(data => {
      this.resp = data;
      this.arrayUser = this.resp.data;
      this.form.get('carrierCodeData').setValue(this.forwardedData.carrierCode);
      this.form.get('checkListTypeData').setValue(this.dataToForward.checkListId);
      let count = 0;
      for (const eachRow of this.arrayUser) {
        count++
        eachRow.sequence = count;
        if (eachRow.questions) {
          let countQuestion = 0;
          for (const eachRowQuestions of eachRow.questions) {
            countQuestion++
            eachRowQuestions.sequence = countQuestion;
            if (eachRow.notes) {
              let countNotes = 0;
              for (const eachRowNotes of eachRow.notes) {
                countNotes++
                eachRowNotes.sequence = countNotes;
              }

            }
          }
        }
      }
      (<NgcFormArray>this.form.controls['questionnaireWithSubHeadings']).patchValue(this.arrayUser);
      console.log(JSON.stringify(this.arrayUser));
    }, error => this.showErrorStatus('g.error'));
  }
}
