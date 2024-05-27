import {
  CheckListService
} from '../check-list.service';
import {
  ActivatedRoute, Router
} from '@angular/router';
import {
  Component, OnInit, NgZone, ElementRef, ViewContainerRef, OnDestroy, ViewChild
} from '@angular/core';
import {
  FormGroupDirective, FormArray, FormGroup, FormControl, FormControlName, Validators
} from '@angular/forms';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcFormControl, PageConfiguration, NgcReportComponent
} from 'ngc-framework';

@Component({
  selector: 'app-edit-check-list',
  templateUrl: './edit-check-list.component.html',
  styleUrls: ['./edit-check-list.component.scss']
})
export class EditCheckListComponent extends NgcPage {
  fillFooter: any;
  fillHeader: any;
  fillDetails: any;
  multiColumn: any;
  forwardedData: any;
  shipmentChecklistId: any;
  shipmentNumber: any;
  destination: any;
  parameterFooterArray: any;
  parameterHeaderArray: any;
  flagToUpdateStatus = false;
  reportParameters: any;
  fillQuestionnaireWithSubHeadings: any;
  fillQuestionnaireWithoutSubHeadings: any;
  private form: NgcFormGroup = new NgcFormGroup({
    shcs: new NgcFormArray([]),
    destination: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),

    comCheckListTypesId: new NgcFormControl(),
    fillChecklistwithHeadings: new NgcFormArray([]),
    fillChecklistwithoutHeadings: new NgcFormArray([]),
    fillChecklistParameterFooter: new NgcFormArray([]),
    fillChecklistParameterHeader: new NgcFormArray([])
  })

  private formHeader: NgcFormGroup = new NgcFormGroup({
    shcs: new NgcFormArray([]),
    destination: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    comCheckListTypesId: new NgcFormControl(),
    fillChecklistwithHeadings: new NgcFormArray([]),
    fillChecklistwithoutHeadings: new NgcFormArray([]),
    fillChecklistParameterFooter: new NgcFormArray([]),
    fillChecklistParameterHeader: new NgcFormArray([])
  })

  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  disableSaveFlag = false;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private router: Router, private activatedRoute: ActivatedRoute, private _checklistService: CheckListService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    this.disableSaveFlag = false;
    this.fillHeader = [];
    this.fillFooter = [];
    this.fillDetails = [];
    this.parameterFooterArray = [];
    this.parameterHeaderArray = [];
    this.fillQuestionnaireWithSubHeadings = [];
    this.fillQuestionnaireWithoutSubHeadings = [];
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    this.shipmentChecklistId = this.forwardedData.requestDataToEdit.shipmentCheckListStatusId;
    this.destination = this.forwardedData.requestDataToEdit.destination;
    this.shipmentNumber = this.forwardedData.requestDataToEdit.shipmentNumber;
    this.formHeader.patchValue(this.forwardedData.requestDataToEdit);
    for (const eachRow of this.forwardedData) {
      if (eachRow.checkListType === 'Header') {
        this.fillHeader.push(eachRow);
      }
      if (eachRow.checkListType === 'Footer') {
        this.fillFooter.push(eachRow);
      }
      if (eachRow.checkListType === 'Details') {
        this.fillDetails.push(eachRow);
      }
      // PAGE PARAMETERS POSITION AT HEADER AND FOOTER
      if (!eachRow.question) {
        if (eachRow.positionAt === 'Header') {
          this.parameterHeaderArray.push(eachRow);
        } else if (eachRow.positionAt === 'Footer') {
          this.parameterFooterArray.push(eachRow);
        }
      } else {
        if (eachRow.lineItemHeading) {
          this.fillQuestionnaireWithSubHeadings.push(eachRow);
        } else {
          this.fillQuestionnaireWithoutSubHeadings.push(eachRow);
        }
      }
    }

    this.form.get(['fillChecklistParameterFooter']).patchValue(this.parameterFooterArray);
    this.form.get(['fillChecklistParameterHeader']).patchValue(this.parameterHeaderArray);
    this.form.get(['fillChecklistwithHeadings']).patchValue(this.fillQuestionnaireWithSubHeadings);
    this.form.get(['fillChecklistwithoutHeadings']).patchValue(this.fillQuestionnaireWithoutSubHeadings);
  }



  onSave(event) {
    console.log(this.form.getRawValue());
    const saveRequest = this.form.getRawValue();
    const saveRequestData = [];
    if (saveRequest.fillChecklistwithoutHeadings) {
      for (const eachRow of saveRequest.fillChecklistwithoutHeadings) {
        if (!eachRow.checkListType) {
          if (!eachRow.notAccepted && !eachRow.notApplicable && !eachRow.accepted) {
            this.flagToUpdateStatus = true;
          }
        }
      }
    }
    if (saveRequest.fillChecklistwithHeadings) {
      for (const eachRow of saveRequest.fillChecklistwithHeadings) {
        if (!eachRow.checkListType) {
          if (!eachRow.notAccepted && !eachRow.notApplicable && !eachRow.accepted) {
            this.flagToUpdateStatus = true;
          }
        }
      }
    }
    saveRequestData.push(...saveRequest.fillChecklistwithHeadings);
    saveRequestData.push(...saveRequest.fillChecklistParameterHeader);
    saveRequestData.push(...saveRequest.fillChecklistParameterFooter);
    saveRequestData.push(...saveRequest.fillChecklistwithoutHeadings);
    saveRequest.saveRequestData = [];
    saveRequest.fillingChecklists = saveRequestData;
    console.log(JSON.stringify(saveRequestData));
    this.forwardedData.requestDataToEdit.comCheckListTypesId = this.formHeader.get('comCheckListTypesId').value;
    if (this.flagToUpdateStatus) {
      this.showConfirmMessage("checklist.question.pending").then(fulfilled => {
        this._checklistService.onStatusFlagInProgress(this.forwardedData.requestDataToEdit).subscribe(response => {
          const dataInProgress = response.data;
          this._checklistService.onSaveFillChecklist(saveRequest).subscribe(response => {
            const arrayUser = response.data;
            if (response.messageList) {
              this.showErrorMessage(response.messageList[0].message);
            } else {
              this.forwardedData.requestDataToEdit.status = "";
              this.navigateTo(this.router, '/export/checklist/setupcheckliststatus', this.forwardedData.requestDataToEdit);
            }
          });
        });
      });
    } else {
      this._checklistService.onStatusFlagCompleted(this.forwardedData.requestDataToEdit).subscribe(response => {
        const dataInProgress = response.data;
        this._checklistService.onSaveFillChecklist(saveRequest).subscribe(response => {
          const arrayUser = response.data;
          if (response.messageList) {
            this.showErrorMessage(response.messageList[0].message);
          } else {
            this.forwardedData.requestDataToEdit.status = "";
            this.navigateTo(this.router, '/export/checklist/setupcheckliststatus', this.forwardedData.requestDataToEdit);
          }
        });
      });
    }
  }

  onCancel(event) {
    this.navigateTo(this.router, '/export/checklist/setupcheckliststatus', this.forwardedData);
  }

  checklistreport() {
    this.reportParameters = new Object();
    this.reportParameters.ShipmentCheckListStatusId = this.shipmentChecklistId.toString();
    this.reportParameters.AWBNumber = this.shipmentNumber;
    this.reportParameters.Destination = this.destination;
    this.reportParameters.SHC = this.forwardedData.requestDataToEdit.shc;;
    this.reportWindow.open();
  }

}
