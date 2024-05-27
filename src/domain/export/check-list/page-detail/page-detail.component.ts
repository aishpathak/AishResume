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
  selector: 'app-page-detail',
  templateUrl: './page-detail.component.html',
  styleUrls: ['./page-detail.component.scss']
})
export class PageDetailComponent extends NgcPage {
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
    fontStyle: new NgcFormControl(),
    alignment: new NgcFormControl(),
    fontFamily: new NgcFormControl(),
    pageDetail: new NgcFormArray([]),
    carrierCode: new NgcFormControl(),
    applyToAll: new NgcFormControl(false),
    backGroundColor: new NgcFormControl('FFFFFF'),
    carrierCodeData: new NgcFormControl(),
    applyBorder: new NgcFormControl(false),
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
    const pageDetailRequest = (<NgcFormArray>this.form.controls['pageDetail']).getRawValue();
    let count = 0;
    for (const eachRow of pageDetailRequest) {
      count++;
      if (eachRow.sequence) {
        eachRow.sequence = count;
      }
      if (!eachRow.checkListId) {
        eachRow.checkListId = this.checkListIdData;
      }
    }
    if (count > 0) {
      this._checklistService.onSavePageDetail(pageDetailRequest).subscribe(data => {
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

  onAddPageDetail() {
    let dataToChangeAdd = (<NgcFormArray>this.form.controls['applyToAll']).value;
    const lengthToDisplay = (<NgcFormArray>this.form.get(['pageDetail'])).length;
    if (dataToChangeAdd) {
      (<NgcFormArray>this.form.get(['pageDetail'])).addValue([
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
      (<NgcFormArray>this.form.get(['pageDetail'])).addValue([
        {
          lineItem: '',
          fontSize: '',
          alignment: '',
          fontStyle: '',
          fontFamily: '',
          applyBorder: false,
          backGroundColor: null,
          sequence: lengthToDisplay + 1,
        }
      ]);
    }
  }

  onDeletePageDetail(index) {
    this.showConfirmMessage('export.delete.page.detail.record.confirmation').then(fulfilled => {
      (<NgcFormArray>this.form.controls['pageDetail']).markAsDeletedAt(index);
      const dataToChangeNotes = (<NgcFormArray>this.form.get(['pageDetail'])).length;
      for (let k = 0; k < dataToChangeNotes; k++) {
        this.form.get(['pageDetail', k, 'sequence']).setValue(k + 1);
      }
    });
  }

  onCancel() {
    this.navigateTo(this.router, '/export/checklist/checklisttemplate', this.dataToForward);
  }

  onChangeCheckAll(event) {
    if (event) {
      let dataToChange = (<NgcFormArray>this.form.controls['pageDetail']).length;
      console.log(dataToChange);
      for (let i = 0; i < dataToChange; i++) {
        this.form.get(['pageDetail', i, 'fontStyle']).setValue(this.form.get('fontStyle').value);
        this.form.get(['pageDetail', i, 'fontSize']).setValue(this.form.get('fontSize').value);
        this.form.get(['pageDetail', i, 'alignment']).setValue(this.form.get('alignment').value);
        this.form.get(['pageDetail', i, 'fontFamily']).setValue(this.form.get('fontFamily').value);
        this.form.get(['pageDetail', i, 'applyBorder']).setValue(this.form.get('applyBorder').value);
        this.form.get(['pageDetail', i, 'backGroundColor']).setValue(this.form.get('backGroundColor').value);
      }
    }
  }

  onSearch() {
    this.hasReadPermission = NgcUtility.hasReadPermission('SETUP_IATA_AIRLINE_CHECK_LIST');
    this._checklistService.onSearchPageDetail(this.forwardedData).subscribe(data => {
      this.resp = data;
      this.arrayUser = this.resp.data;
      this.form.get('carrierCodeData').setValue(this.forwardedData.carrierCode);
      let count = 0;
      for (const eachRow of this.arrayUser) {
        count++;
        eachRow.sequence = count;
      }
      (<NgcFormArray>this.form.controls['pageDetail']).patchValue(this.arrayUser);
    }, error => this.showErrorStatus('g.error'));
  }
}
