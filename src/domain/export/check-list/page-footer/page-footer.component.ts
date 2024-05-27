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
  selector: 'app-page-footer',
  templateUrl: './page-footer.component.html',
  styleUrls: ['./page-footer.component.scss']
})

export class PageFooterComponent extends NgcPage {
  resp: any;
  arrayUser: any;
  forwardedData: any;
  dataToForward: any;
  checkListIdData: any;
  checkListTypeData: any;
  hasReadPermission: boolean = false;
  private form: NgcFormGroup = new NgcFormGroup({
    id: new NgcFormControl(),
    idData: new NgcFormControl(),
    fontSize: new NgcFormControl(),
    fontStyle: new NgcFormControl(),
    alignment: new NgcFormControl(),
    pageFooter: new NgcFormArray([]),
    fontFamily: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    applyToAll: new NgcFormControl(false),
    backGroundColor: new NgcFormControl('FFFFFF'),
    carrierCodeData: new NgcFormControl(),
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
    this.checkListTypeData = this.forwardedData.checkListTypeData;
    this.onSearch();
  }

  onAddPageFooter() {
    let dataToChangeAdd = (<NgcFormArray>this.form.controls['applyToAll']).value;
    const lengthToDisplay = (<NgcFormArray>this.form.get(['pageFooter'])).length;
    if (dataToChangeAdd) {
      (<NgcFormArray>this.form.get(['pageFooter'])).addValue([
        {
          lineItem: '',
          sequence: lengthToDisplay + 1,
          fontSize: this.form.get('fontSize').value,
          fontStyle: this.form.get('fontStyle').value,
          alignment: this.form.get('alignment').value,
          fontFamily: this.form.get('fontFamily').value,
          applyBorder: this.form.get('applyBorder').value,
          backGroundColor: this.form.get('backGroundColor').value,
          pageFooterNotes: [{
            sequence: 1,
            lineItem: '',
            fontSize: this.form.get('fontSize').value,
            fontStyle: this.form.get('fontStyle').value,
            alignment: this.form.get('alignment').value,
            fontFamily: this.form.get('fontFamily').value,
            applyBorder: this.form.get('applyBorder').value,
            backGroundColor: this.form.get('backGroundColor').value,
          }]
        }
      ]);
    }
    else {
      (<NgcFormArray>this.form.get(['pageFooter'])).addValue([
        {
          fontSize: '',
          lineItem: '',
          fontStyle: '',
          alignment: '',
          fontFamily: '',
          applyBorder: false,
          backGroundColor: null,
          sequence: lengthToDisplay + 1,
          pageFooterNotes: [{
            sequence: 1,
            lineItem: '',
            fontSize: '',
            fontStyle: '',
            alignment: '',
            fontFamily: '',
            applyBorder: false,
            backGroundColor: null
          }]
        }
      ]);
    }
  }

  onAddPageFooterNotes(index) {
    let dataToChangeAdd = (<NgcFormArray>this.form.controls['applyToAll']).value;
    const lengthToDisplay = (<NgcFormArray>this.form.get(['pageFooter', index, 'pageFooterNotes'])).length;
    if (dataToChangeAdd) {
      (<NgcFormArray>this.form.get(['pageFooter', index, 'pageFooterNotes'])).addValue([
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
      (<NgcFormArray>this.form.get(['pageFooter', index, 'pageFooterNotes'])).addValue([
        {
          sequence: lengthToDisplay + 1,
          lineItem: '',
          fontSize: '',
          fontStyle: '',
          alignment: '',
          fontFamily: '',
          applyBorder: false,
          backGroundColor: ''
        }
      ]);
    }
  }

  onSave(event) {
    this.resetFormMessages();
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    const pageFooterRequest = (<NgcFormArray>this.form.controls['pageFooter']).getRawValue();
    let count = 0;
    let countNotes = 0;
    for (const eachRow of pageFooterRequest) {
      if (eachRow.flagCRUD === 'R') {
        eachRow.flagCRUD = 'U';
      }
      if (!eachRow.checkListId) {
        eachRow.checkListId = this.checkListIdData;
      }
      count++;
      eachRow.sequence = count;
      if (eachRow.pageFooterNotes) {
        for (const eachRowNotes of eachRow.pageFooterNotes) {
          eachRowNotes.footerId = eachRow.footerId;
          if (eachRowNotes.flagCRUD === 'R') {
            eachRowNotes.flagCRUD = 'U';
          }
          countNotes++;
          eachRowNotes.sequence = countNotes;
        }
      }
    }
    if (count > 0) {
      this._checklistService.onSavePageFooter(pageFooterRequest).subscribe(data => {
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

  onDeletePageFooter(index) {
    this.showConfirmMessage('export.delete.page.footer.record.confirmation').then(fulfilled => {
      (<NgcFormArray>this.form.get(['pageFooter'])).markAsDeletedAt(index);
      const dataToChangeQuestion = (<NgcFormArray>this.form.get(['pageFooter'])).length;
      for (let j = 0; j < dataToChangeQuestion; j++) {
        this.form.get(['pageFooter', j, 'sequence']).setValue(j + 1);
        let dataToChangeNotes = (<NgcFormArray>this.form.get(['pageFooter', j, 'pageFooterNotes'])).length;
        for (let k = 0; k < dataToChangeNotes; k++) {
          this.form.get(['pageFooter', j, 'pageFooterNotes', k, 'sequence']).setValue(k + 1);
        }
      }
    });
  }

  onDeletePageFooterLineItems(index, sindex) {
    this.showConfirmMessage('export.delete.page.footer.notes.record.confirmation').then(fulfilled => {
      (<NgcFormArray>this.form.get(['pageFooter', index, 'pageFooterNotes'])).markAsDeletedAt(sindex);
      const dataToChangeNotes = (<NgcFormArray>this.form.get(['pageFooter', index, 'pageFooterNotes'])).length;
      for (let k = 0; k < dataToChangeNotes; k++) {
        this.form.get(['pageFooter', index, 'pageFooterNotes', k, 'sequence']).setValue(k + 1);
      }
    });
  }

  onCancel() {
    this.navigateTo(this.router, '/export/checklist/checklisttemplate', this.dataToForward);
  }

  onChangeCheckAll(event) {
    if (event) {
      let dataToChange = (<NgcFormArray>this.form.controls['pageFooter']).length;
      console.log(dataToChange);
      for (let i = 0; i < dataToChange; i++) {
        this.form.get(['pageFooter', i, 'fontSize']).setValue(this.form.get('fontSize').value);
        this.form.get(['pageFooter', i, 'fontStyle']).setValue(this.form.get('fontStyle').value);
        this.form.get(['pageFooter', i, 'alignment']).setValue(this.form.get('alignment').value);
        this.form.get(['pageFooter', i, 'fontFamily']).setValue(this.form.get('fontFamily').value);
        this.form.get(['pageFooter', i, 'applyBorder']).setValue(this.form.get('applyBorder').value);
        this.form.get(['pageFooter', i, 'backGroundColor']).setValue(this.form.get('backGroundColor').value);
        let dataToChangeNotes = (<NgcFormArray>this.form.get(['pageFooter', i, 'pageFooterNotes'])).length;
        for (let j = 0; j < dataToChangeNotes; j++) {
          this.form.get(['pageFooter', i, 'pageFooterNotes', j, 'fontSize']).setValue(this.form.get('fontSize').value);
          this.form.get(['pageFooter', i, 'pageFooterNotes', j, 'fontStyle']).setValue(this.form.get('fontStyle').value);
          this.form.get(['pageFooter', i, 'pageFooterNotes', j, 'alignment']).setValue(this.form.get('alignment').value);
          this.form.get(['pageFooter', i, 'pageFooterNotes', j, 'fontFamily']).setValue(this.form.get('fontFamily').value);
          this.form.get(['pageFooter', i, 'pageFooterNotes', j, 'applyBorder']).setValue(this.form.get('applyBorder').value);
          this.form.get(['pageFooter', i, 'pageFooterNotes', j, 'backGroundColor']).setValue(this.form.get('backGroundColor').value);
        }
      }
    }
  }

  onSearch() {
    this.hasReadPermission = NgcUtility.hasReadPermission('SETUP_IATA_AIRLINE_CHECK_LIST');
    this._checklistService.onSearchPageFooter(this.forwardedData).subscribe(data => {
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
        if (eachRow.pageFooterNotes) {
          for (const eachRowNotes of eachRow.pageFooterNotes) {
            countNotes++;
            eachRowNotes.sequence = countNotes;
          }
        }
      }
      (<NgcFormArray>this.form.controls['pageFooter']).patchValue(this.arrayUser);
    }, error => this.showErrorStatus('g.error'));
  }

}
