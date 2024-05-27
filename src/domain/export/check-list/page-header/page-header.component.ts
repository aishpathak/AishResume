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
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent extends NgcPage {
  resp: any;
  idCode: any;
  arrayUser: any;
  dataToForward: any;
  forwardedData: any;
  checkListIdData: any;
  checkListTypeData: any;
  hasReadPermission: boolean = false;
  private form: NgcFormGroup = new NgcFormGroup({
    id: new NgcFormControl(),
    idData: new NgcFormControl(),
    fontSize: new NgcFormControl(),
    alignment: new NgcFormControl(),
    fontStyle: new NgcFormControl(),
    fontFamily: new NgcFormControl(),
    pageHeader: new NgcFormArray([]),
    applyToAll: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
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
    this.checkListTypeData = this.forwardedData.checkListTypeData;
    this.onSearch();
  }

  onSave(event) {
    this.resetFormMessages();
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    const pageHeaderRequest = (<NgcFormArray>this.form.controls['pageHeader']).getRawValue();
    let count = 0;
    for (const eachRow of pageHeaderRequest) {
      count++;
      if (eachRow.sequence) {
        eachRow.sequence = count;
      }
      if (!eachRow.checkListId) {
        eachRow.checkListId = this.checkListIdData;
      }
    }
    if (count > 0) {
      this._checklistService.onSavePageHeader(pageHeaderRequest).subscribe(data => {
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
  onAddPageHeader() {
    let dataToChangeAdd = (<NgcFormArray>this.form.controls['applyToAll']).value;
    const lengthToDisplay = (<NgcFormArray>this.form.get(['pageHeader'])).length;
    if (dataToChangeAdd) {
      (<NgcFormArray>this.form.get(['pageHeader'])).addValue([
        {
          lineItem: '',
          applyBorder: false,
          sequence: lengthToDisplay + 1,
          fontSize: this.form.get('fontSize').value,
          fontStyle: this.form.get('fontStyle').value,
          alignment: this.form.get('alignment').value,
          fontFamily: this.form.get('fontFamily').value,
          backGroundColor: this.form.get('backGroundColor').value,
        }
      ]);
    } else {
      (<NgcFormArray>this.form.get(['pageHeader'])).addValue([
        {
          select: '',
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

  onDeletePageHeader(index) {
    this.showConfirmMessage('export.delete.page.header.record.confirmation').then(fulfilled => {
      (<NgcFormArray>this.form.controls['pageHeader']).markAsDeletedAt(index);
      const dataToChangeNotes = (<NgcFormArray>this.form.get(['pageHeader'])).length;
      for (let k = 0; k < dataToChangeNotes; k++) {
        this.form.get(['pageHeader', k, 'sequence']).setValue(k + 1);
      }
    });
  }

  onCancel() {
    this.navigateTo(this.router, '/export/checklist/checklisttemplate', this.dataToForward);
  }

  onChangeCheckAll(event) {
    if (event) {
      let dataToChange = (<NgcFormArray>this.form.controls['pageHeader']).length;
      console.log(dataToChange);
      for (let i = 0; i < dataToChange; i++) {
        this.form.get(['pageHeader', i, 'applyBorder']).setValue(false);
        this.form.get(['pageHeader', i, 'fontSize']).setValue(this.form.get('fontSize').value);
        this.form.get(['pageHeader', i, 'alignment']).setValue(this.form.get('alignment').value);
        this.form.get(['pageHeader', i, 'fontStyle']).setValue(this.form.get('fontStyle').value);
        this.form.get(['pageHeader', i, 'fontFamily']).setValue(this.form.get('fontFamily').value);
        this.form.get(['pageHeader', i, 'backGroundColor']).setValue(this.form.get('backGroundColor').value);
      }
    }
  }

  onSearch() {
    this.hasReadPermission = NgcUtility.hasReadPermission('SETUP_IATA_AIRLINE_CHECK_LIST');
    this._checklistService.onSearchPageHeader(this.forwardedData).subscribe(data => {
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
      (<NgcFormArray>this.form.controls['pageHeader']).patchValue(this.arrayUser);
    }, error => this.showErrorStatus('g.error'));
  }
}
