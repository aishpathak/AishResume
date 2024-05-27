import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, NgModule, ViewChild, Input } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Validators, PatternValidator } from '@angular/forms';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, PageConfiguration } from 'ngc-framework';
import { MastersService } from '../masters.service';
import { MaintainUldSeriesRequest, MaintainUldSeriesResponse } from '../masters.sharedmodel';

@Component({
  selector: 'ngc-maintainairlinemaster',
  templateUrl: './maintainairlinemaster.component.html',
  styleUrls: ['./maintainairlinemaster.component.scss']
})

/**
 * This class Allow user to configure Airline uld series data
 */
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})

export class MaintainairlinemasterComponent extends NgcPage {
  displayAddEditForm: boolean;
  searchButton: boolean;
  showTable: boolean;
  resp: any;
  responseArray: any[];
  addFormData: boolean;
  updateFormData: boolean;
  lovStatus: true;
  errors: any[];

  @ViewChild('window') window: NgcWindowComponent;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private masterAirlineService: MastersService, private route: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  public maintainAirlineForm: NgcFormGroup = new NgcFormGroup({
    carrierCodeDetails: new NgcFormControl(),
    uldTypeDetails: new NgcFormControl(),

    uldCarrierCode: new NgcFormControl(),
    uldtype: new NgcFormControl(),
    uldSeriesNumberFrom: new NgcFormControl(),
    uldSeriesNumberTo: new NgcFormControl(),
    uldSeriesTareWeight: new NgcFormControl(),
    transactionSequenceNo: new NgcFormControl(),
    operationCode: new NgcFormControl(),
    aircraftList: new NgcFormArray([
    ]),
  });

  /**
   * On Initialization
   */
  ngOnInit() {
    super.ngOnInit();
    this.showTable = false;

  }

  /**
   * Function to get data for populating Uld tare weight records
   */
  public getUldSeriesData() {
    const uldSeriesData: MaintainUldSeriesRequest = new MaintainUldSeriesRequest();
    this.masterAirlineService.fetchUldSeriesList(uldSeriesData).subscribe(data => {
      this.resp = data;
      this.responseArray = this.resp.data;

      if (this.responseArray.length > 0) {
        this.showTable = true;
        this.selFunction();
        this.editFunction();
        this.populateTable();
      }
    },
    );
  }

  /**
   * Function to initialize edit button in tables
   */
  public editFunction() {
    for (let index = 0; index < this.responseArray.length; index++) {
      this.responseArray[index]['edit'] = 'Edit';
    }
  }

  /**
   * Function to initialize select button in tables
   */
  public selFunction() {
    for (let index = 0; index < this.responseArray.length; index++) {
      this.responseArray[index]['scInd'] = false;
    }
  }

  /**
   * Function to handle Insert/Update records request
   * @param event Event
   */
  public onEditAddLink(event): void {
    this.displayAddEditForm = true;

    if (event.column === 'edit') {
      this.updateFormData = true;
      this.addFormData = false;
      if (event.record) {
        this.maintainAirlineForm.get('uldCarrierCode').setValue(event.record.uldCarrierCode);
        this.maintainAirlineForm.get('uldtype').setValue(event.record.uldtype);
        this.maintainAirlineForm.get('uldSeriesNumberFrom').setValue(event.record.uldSeriesNumberFrom);
        this.maintainAirlineForm.get('uldSeriesNumberTo').setValue(event.record.uldSeriesNumberTo);
        this.maintainAirlineForm.get('uldSeriesTareWeight').setValue(event.record.uldSeriesTareWeight);
        this.maintainAirlineForm.get('transactionSequenceNo').setValue(event.record.transactionSequenceNo);
        this.maintainAirlineForm.get('operationCode').setValue(event.record.operationCode);

        this.window.open();
      }
    } else {
      this.displayAddEditForm = true;
      this.addFormData = true;
      this.updateFormData = false;
      this.maintainAirlineForm.get('uldCarrierCode').setValue(this.maintainAirlineForm.controls.carrierCodeDetails.value);
      this.maintainAirlineForm.get('uldtype').setValue(this.maintainAirlineForm.controls.uldTypeDetails.value);
      this.window.open();
      // this.maintainAirlineForm.get('uldCarrierCode').setValue('');
      // this.maintainAirlineForm.get('uldtype').setValue('');
      this.maintainAirlineForm.get('uldSeriesNumberFrom').setValue('');
      this.maintainAirlineForm.get('uldSeriesNumberTo').setValue('');
      this.maintainAirlineForm.get('uldSeriesTareWeight').setValue('');
      this.maintainAirlineForm.get('transactionSequenceNo').setValue('');
      this.maintainAirlineForm.get('operationCode').setValue(null);



    }
  }

  /**
   * Function to populate table with data
   */
  populateTable() {
    (<NgcFormArray>this.maintainAirlineForm.controls['aircraftList']).patchValue(this.responseArray);
  }

  /**
   * Function to close popup window
   */
  onCancelButton() {
    this.window.hide();
  }

  /**
   * Function to handle search request for ULD tare qeight records
   * @param event Event
   */
  onSearchAirline(event) {
    const uldSeriesSearchData: MaintainUldSeriesRequest = new MaintainUldSeriesRequest();
    uldSeriesSearchData.uldCarrierCode = this.maintainAirlineForm.get('carrierCodeDetails').value;
    uldSeriesSearchData.uldtype = this.maintainAirlineForm.get('uldTypeDetails').value;
    uldSeriesSearchData.uldSeriesNumberFrom = '';
    uldSeriesSearchData.uldSeriesNumberTo = '';
    uldSeriesSearchData.uldSeriesTareWeight = 0;

    (<NgcFormArray>this.maintainAirlineForm.controls['aircraftList']).resetValue([]);
    this.resetFormMessages();
    this.masterAirlineService.searchUldSeriesByCarrierCode(uldSeriesSearchData).subscribe(data => {
      this.resp = data;
      this.responseArray = this.resp.data;
      if (this.responseArray.length > 0) {
        this.showTable = true;
        this.selFunction();
        this.editFunction();
        this.populateTable();
      } else {
        this.showTable = true;
        this.showErrorStatus('no.record.found');
      }
    },
    );
  }

  /**
   * Function to call service to Insert/update ULD tare qeight records
   * @param event Event
   */
  onSubmitData(event) {
    const uldSeriesData: MaintainUldSeriesRequest = new MaintainUldSeriesRequest();
    if (this.updateFormData === true) {
      uldSeriesData.uldCarrierCode = this.maintainAirlineForm.get('uldCarrierCode').value;
      uldSeriesData.uldtype = this.maintainAirlineForm.get('uldtype').value;
      uldSeriesData.uldSeriesNumberFrom = this.maintainAirlineForm.get('uldSeriesNumberFrom').value;
      uldSeriesData.uldSeriesNumberTo = this.maintainAirlineForm.get('uldSeriesNumberTo').value;
      uldSeriesData.uldSeriesTareWeight = this.maintainAirlineForm.get('uldSeriesTareWeight').value;
      uldSeriesData.transactionSequenceNo = this.maintainAirlineForm.get('transactionSequenceNo').value;
      uldSeriesData.operationCode = this.maintainAirlineForm.get('operationCode').value;
      if (this.maintainAirlineForm.invalid) {
        return;
      }
      this.masterAirlineService.updateUldSeriesData(uldSeriesData).subscribe(data => {
        this.resp = data;
        this.responseArray = this.resp.data;
        if (this.responseArray != null) {
          this.selFunction();
          this.editFunction();
          this.window.hide();
          this.refreshFormMessages(data);
          this.showSuccessStatus('g.completed.successfully');
          this.onSearchAirline(event);
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors[0].message);
        }
      },
      );
    } else {
      uldSeriesData.uldCarrierCode = this.maintainAirlineForm.get('uldCarrierCode').value;
      uldSeriesData.uldtype = this.maintainAirlineForm.get('uldtype').value;
      uldSeriesData.uldSeriesNumberFrom = this.maintainAirlineForm.get('uldSeriesNumberFrom').value;
      uldSeriesData.uldSeriesNumberTo = this.maintainAirlineForm.get('uldSeriesNumberTo').value;
      uldSeriesData.uldSeriesTareWeight = this.maintainAirlineForm.get('uldSeriesTareWeight').value;
      uldSeriesData.operationCode = this.maintainAirlineForm.get('operationCode').value;
      uldSeriesData.transactionSequenceNo = 0;
      if (this.maintainAirlineForm.invalid) {
        return;
      }
      this.masterAirlineService.addUldSeriesData(uldSeriesData).subscribe(data => {
        this.resp = data;
        this.responseArray = this.resp.data;
        if (!this.resp.messageList) {
          this.selFunction();
          this.editFunction();
          this.window.hide();
          this.refreshFormMessages(data);
          this.showSuccessStatus('g.completed.successfully');
          this.onSearchAirline(event);
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors[0].message);
        }
      },
      );
    }
  }

  onSelect(event) {
    this.searchButton = true;
  }

  /**
   * On Click on delete button to delete the selected records
   * @param event Event
   */
  onDeleteButtonClick(event) {
    this.showConfirmMessage('delete.selected.records').then(fulfilled => {
      const indices: any = [];
      for (let index = this.responseArray.length - 1; index >= 0; index--) {
        const item = (<NgcFormArray>this.maintainAirlineForm.get('aircraftList'))['controls'][index]['value'];
        if (item.scInd) {
          indices.push(item);
        }
      }
      // console.log(indices);
      this.masterAirlineService.deleteUldSeriesData(indices).subscribe(data => {
        this.resp = data;
        this.responseArray = this.resp.data;
        if (this.responseArray != null) {
          this.selFunction();
          this.editFunction();
          this.refreshFormMessages(data);
          this.window.hide();
          this.showSuccessStatus('g.completed.successfully');
          this.onSearchAirline(event);
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors[0].message);

        }
      },
      );
    }).catch(reason => {
    });
  }
}
