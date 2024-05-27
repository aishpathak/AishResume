import {
  Component, OnInit, NgZone, ElementRef, ViewContainerRef, OnDestroy, ViewChild
} from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcFormControl, PageConfiguration
} from 'ngc-framework';
import {
  ActivatedRoute, Router
} from '@angular/router';
import {
  CheckListService
} from '../check-list.service';


@Component({
  selector: 'app-fill-check-list',
  templateUrl: './fill-check-list.component.html',
  styleUrls: ['./fill-check-list.component.css']
})
export class FillCheckListComponent extends NgcPage {
  resp: any;
  arrayUser: any;
  fillFooter: any;
  fillHeader: any;
  fillDetails: any;
  fillParameter: any;
  forwardedData: any;
  multiColumn = false;
  arrayUserToPatch: any;
  questionsAlignment: any;
  shipmentChecklistId: any;
  parametersAlignment: any;
  parameterFooterArray: any;
  parameterHeaderArray: any;
  flagToUpdateStatus = false;
  fillQuestionnaireWithSubHeadings: any;
  fillQuestionnaireWithoutSubHeadings: any;
  totalQuestionsWithoutSubHeadings: number = 0;
  totalQuestionsWithoutSubHeadingsInPage: number = 0;
  //
  private form: NgcFormGroup = new NgcFormGroup({
    destination: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    comCheckListTypesId: new NgcFormControl(),
    fillChecklistwithHeadings: new NgcFormArray([]),
    fillChecklistwithoutHeadings: new NgcFormArray([]),
    fillChecklistParameterFooter: new NgcFormArray([]),
    fillChecklistParameterHeader: new NgcFormArray([]),
  })
  private formToPatch: NgcFormGroup = new NgcFormGroup({
    destination: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    comCheckListTypesId: new NgcFormControl(),
    fillChecklistwithHeadings: new NgcFormArray([]),
    fillChecklistwithoutHeadings: new NgcFormArray([]),
    fillChecklistParameterFooter: new NgcFormArray([]),
    fillChecklistParameterHeader: new NgcFormArray([])
  })
  disableSaveFlag = false;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private router: Router, private activatedRoute: ActivatedRoute, private _checklistService: CheckListService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    this.disableSaveFlag = false;
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    this.shipmentChecklistId = this.forwardedData.shipmentCheckListStatusId;
    this.form.patchValue(this.forwardedData);
    this._checklistService.onSearchFillChecklist(this.forwardedData).subscribe(data => {
      this.resp = data;
      this.arrayUser = this.resp.data;
      if (!this.arrayUser) {
        this.disableSaveFlag = true;
        this.showErrorMessage("export.setup.not.configured");
        return;
      }
      if (this.arrayUser.requiredAlignmentForQuestions === 'MS') {
        this.multiColumn = true;
      }
      let indexNum = 1;
      let indexNumHeading = 1;
      this.fillFooter = this.arrayUser.pageFooter;
      this.fillHeader = this.arrayUser.pageHeader;
      this.fillDetails = this.arrayUser.pageDetail;
      this.fillParameter = this.arrayUser.pageParameter;
      this.questionsAlignment = this.resp.requiredAlignmentForQuestions;
      this.parametersAlignment = this.resp.requiredAlignmentForParameters;
      this.fillQuestionnaireWithSubHeadings = this.arrayUser.checkListWithSubHeadings;
      this.fillQuestionnaireWithoutSubHeadings = this.arrayUser.checkListWithoutSubHeadings;

      for (let i = 0; i < this.fillQuestionnaireWithSubHeadings.length; i++) {
        ++indexNumHeading;
        for (let j = 0; j < this.fillQuestionnaireWithSubHeadings[i].questions.length; j++) {
          this.fillQuestionnaireWithSubHeadings[i].questions[j].indexNum = j + 1;
          this.fillQuestionnaireWithSubHeadings[i].questions[j].headingsFlag = true;
          this.fillQuestionnaireWithSubHeadings[i].questions[j].indexNumHeading = i + 1;
          this.fillQuestionnaireWithSubHeadings[i].questions[0].sequenceHeading = this.fillQuestionnaireWithSubHeadings[i].sequence;
          this.fillQuestionnaireWithSubHeadings[i].questions[0].fontSizeHeading = this.fillQuestionnaireWithSubHeadings[i].fontSize;
          this.fillQuestionnaireWithSubHeadings[i].questions[j].lineItemHeading = this.fillQuestionnaireWithSubHeadings[i].lineItem;
          this.fillQuestionnaireWithSubHeadings[i].questions[0].alignmentHeading = this.fillQuestionnaireWithSubHeadings[i].indexNum;
          this.fillQuestionnaireWithSubHeadings[i].questions[0].fontStyleHeading = this.fillQuestionnaireWithSubHeadings[i].fontStyle;
          this.fillQuestionnaireWithSubHeadings[i].questions[0].questionIdHeading = this.fillQuestionnaireWithSubHeadings[i].questionId;
          this.fillQuestionnaireWithSubHeadings[i].questions[0].applyBorderHeading = this.fillQuestionnaireWithSubHeadings[i].applyBorder;
          this.fillQuestionnaireWithSubHeadings[i].questions[0].backGroundColorHeading = this.fillQuestionnaireWithSubHeadings[i].backGroundColor;
          ++indexNum;
        }
      }
      for (let j = 0; j < this.fillQuestionnaireWithoutSubHeadings.length; j++) {
        this.fillQuestionnaireWithoutSubHeadings[j].indexNumHeading = indexNumHeading;
        this.fillQuestionnaireWithoutSubHeadings[j].headingsFlag = false;
        ++indexNumHeading;
      }
      this.totalQuestionsWithoutSubHeadingsInPage = Number((Math.round(indexNum / 2)).toFixed(0));
      for (let eachRowWithHeadings of this.fillQuestionnaireWithSubHeadings) {
        if (eachRowWithHeadings.questions) {
          for (let eachRowQuestion of eachRowWithHeadings.questions) {
            eachRowQuestion.notApplicable = false;
            eachRowQuestion.accepted = false;
            eachRowQuestion.notAccepted = false;
            eachRowQuestion.question = eachRowQuestion.lineItem;
            eachRowQuestion.shipmentCheckListStatusId = this.shipmentChecklistId;
          }
        }
      }
      for (let eachRowWithoutHeadings of this.fillQuestionnaireWithoutSubHeadings) {
        eachRowWithoutHeadings.notApplicable = false;
        eachRowWithoutHeadings.accepted = false;
        eachRowWithoutHeadings.notAccepted = false;
        eachRowWithoutHeadings.question = eachRowWithoutHeadings.lineItem;
        eachRowWithoutHeadings.shipmentCheckListStatusId = this.shipmentChecklistId;
      }
      this.fillQuestionnaireWithSubHeadings.push({
        questions: this.arrayUser.checkListWithoutSubHeadings,
        fontStyle: '',
        fontFamily: '',
        fontSize: '',
        alignment: '',
        backGroundColor: '',
        lineItem: '',
        notApplicable: '',
        accepted: '',
        notAccepted: '',
      })
      let questionsArray = [];
      for (let i = 0; i < this.fillQuestionnaireWithSubHeadings.length; i++) {
        questionsArray.push(...this.fillQuestionnaireWithSubHeadings[i].questions);
      }
      this.parameterFooterArray = [];
      this.parameterHeaderArray = [];
      for (let i = 0; i < this.fillParameter.length; i++) {
        if (this.fillParameter[i].positionAt === 'Header') {
          this.parameterHeaderArray.push(this.fillParameter[i]);
        } else if (this.fillParameter[i].positionAt === 'Footer') {
          this.parameterFooterArray.push(this.fillParameter[i]);
        }
      }
      this.formToPatch.get(['fillChecklistwithoutHeadings']).patchValue(questionsArray);
      this.formToPatch.get(['fillChecklistParameterFooter']).patchValue(this.parameterFooterArray);
      this.formToPatch.get(['fillChecklistParameterHeader']).patchValue(this.parameterHeaderArray);
      console.log(this.formToPatch.get(['fillChecklistwithoutHeadings']));
    });
  }

  onSave() {
    console.log(this.formToPatch.getRawValue());
    const saveRequest = this.formToPatch.getRawValue();
    const saveRequestData = [];
    if (saveRequest.fillChecklistwithoutHeadings) {
      for (const eachRow of saveRequest.fillChecklistwithoutHeadings) {
        if (!eachRow.notAccepted && !eachRow.notApplicable && !eachRow.accepted) {
          this.flagToUpdateStatus = true;
        }
      }
    }
    if (saveRequest.fillChecklistwithHeadings) {
      for (const eachRow of saveRequest.fillChecklistwithHeadings) {
        if (!eachRow.notAccepted && !eachRow.notApplicable && !eachRow.accepted) {
          this.flagToUpdateStatus = true;
        }
      }
    }
    if (this.fillHeader) {
      for (const eachRow of this.fillHeader) {
        eachRow.checkListType = 'Header'
      }
    }
    if (this.fillDetails) {
      for (const eachRow of this.fillDetails) {
        eachRow.checkListType = 'Details'
      }
    }
    if (this.fillFooter) {
      for (const eachRow of this.fillFooter) {
        eachRow.checkListType = 'Footer'
      }
    }
    saveRequest.fillFooter = this.fillFooter;
    saveRequest.fillHeader = this.fillHeader;
    saveRequest.fillDetails = this.fillDetails;
    saveRequestData.push(...saveRequest.fillFooter);
    saveRequestData.push(...saveRequest.fillHeader);
    saveRequestData.push(...saveRequest.fillDetails);
    saveRequestData.push(...saveRequest.fillChecklistParameterHeader);
    saveRequestData.push(...saveRequest.fillChecklistParameterFooter);
    saveRequestData.push(...saveRequest.fillChecklistwithoutHeadings);
    for (let eachRow of saveRequestData) {
      eachRow.flagCRUD = 'C';
      eachRow.shipmentCheckListStatusId = this.shipmentChecklistId;
    }
    saveRequest.saveRequestData = [];
    saveRequest.fillingChecklists = saveRequestData;
    if (this.flagToUpdateStatus) {
      this.showConfirmMessage("checklist.question.pending").then(fulfilled => {
        this._checklistService.onStatusFlagInProgress(this.forwardedData).subscribe(response => {
          const dataInProgress = response.data;
          this._checklistService.onSaveFillChecklist(saveRequest).subscribe(data => {
            this.resp = data;
            this.arrayUser = this.resp.data;
            if (this.resp.messageList) {
              this.showErrorMessage(this.resp.messageList[0].message);
            } else {
              this.forwardedData.status = "";
              this.navigateTo(this.router, '/export/checklist/setupcheckliststatus', this.forwardedData);
            }
          });
        });
      }).catch(reason => { });
    } else {
      this.forwardedData.comCheckListTypesId = this.forwardedData.comCheckListTypesId;

      this._checklistService.onStatusFlagCompleted(this.forwardedData).subscribe(response => {
        const dataInProgress = response.data;
        this._checklistService.onSaveFillChecklist(saveRequest).subscribe(data => {
          this.resp = data;
          this.arrayUser = this.resp.data;
          if (this.resp.messageList) {
            this.showErrorMessage(this.resp.messageList[0].message);
          } else {
            this.forwardedData.status = "";
            this.navigateTo(this.router, '/export/checklist/setupcheckliststatus', this.forwardedData);
          }
        });
      });
    }
  }

  onCancel(event) {

    this.navigateTo(this.router, '/export/checklist/setupcheckliststatus', this.forwardedData);
  }

}
