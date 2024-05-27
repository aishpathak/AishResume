// import { index } from 'chalk';
import { filter } from 'rxjs/operators';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcButtonComponent, PageConfiguration, NgcUtility, NgcWindowComponent } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { UldService } from '../uld.service';
import { UldEnquire } from '../uld.shared';

@Component({
  selector: 'app-uld-maintain-movable-location-types',
  templateUrl: './uld-maintain-movable-location-types.component.html',
  styleUrls: ['./uld-maintain-movable-location-types.component.scss']
})

@PageConfiguration({
  trackInit: true,
  autoBackNavigation: true,
  callNgOnInitOnClear: true
})
export class UldMaintainMovableLocationTypesComponent extends NgcPage {
  uldFlag = true;
  binFlag = false;
  showFlag = false;
  responseData: any;
  lastUldSeries: any;
  firstUldSeries: any;
  flagGreater = false;
  showAddButton = true;
  dataToSeriesInfo: any;
  showSeriesKey = false;
  locationTypeValue: any;
  valueNotInRange = false;
  movableLocationType: any;
  showCarrierCodeFlag = true;
  @ViewChild('seriesInformationWindow')
  private seriesInformationWindow: NgcWindowComponent;
  private form: NgcFormGroup = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    lastUldSeries: new NgcFormControl(),
    uldSeriesList: new NgcFormArray([]),
    uldSeriesNumberFrom: new NgcFormControl(),
    uldType: new NgcFormControl(),
    uldSeriesNumberTo: new NgcFormControl(),
    firstUldSeries: new NgcFormControl(),
    moveableLocationTypeList: new NgcFormArray([]),
    moveableLocationType: new NgcFormControl('ULD')
  });

  constructor(
    appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router, private uldService: UldService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }

  onSearch() {
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    const searchRequest = this.form.getRawValue();
    this.uldService.getMovementLocationTypes(searchRequest).subscribe(response => {
      this.resetFormMessages();
      this.responseData = response.data;
      this.form.get(['moveableLocationTypeList']).patchValue(this.responseData);
      this.showFlag = true;
    },
      error => { this.showErrorStatus(error); });
  }

  onAddNewRow() {
    this.showFlag = true;
    if (this.uldFlag) {
      this.uldFlag = true;
    }
    (<NgcFormArray>this.form.get('moveableLocationTypeList')).addValue(
      [{
        uldType: null,
        usedFor: null,
        checkDigit: null,
        availableToUse: null,
        uldCarrierCode: null,
        uldSeriesNumberTo: null,
        uldSeriesNumberFrom: null,
        uldSeriesTareWeight: null,
        effectiveEndDate: null,
        effectiveStartDate: null,
        availableForLoading: false,
        moveableLocationType: 'ULD',
      }]);
  }

  onSave(event) {
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    let dataToCheckkDuplicate: any = (<NgcFormArray>this.form.get("moveableLocationTypeList")).getRawValue();
    for (let i = 0; i < dataToCheckkDuplicate.length; i++) {
      for (let j = 0; j < dataToCheckkDuplicate.length; j++) {
        if (i != j) {
          if (dataToCheckkDuplicate[i].flagCRUD !== 'D' && dataToCheckkDuplicate[j].flagCRUD !== 'D') {
            if (Number(dataToCheckkDuplicate[i].uldSeriesNumberFrom) >= Number(dataToCheckkDuplicate[j].uldSeriesNumberFrom) &&
              Number(dataToCheckkDuplicate[i].uldSeriesNumberFrom) <= Number(dataToCheckkDuplicate[j].uldSeriesNumberTo) &&
              dataToCheckkDuplicate[i].uldType === dataToCheckkDuplicate[j].uldType &&
              dataToCheckkDuplicate[i].uldCarrierCode === dataToCheckkDuplicate[j].uldCarrierCode) {
              this.showErrorStatus("uld.operation.failed.overlapping.series.cannot.be.added");
              return;
            }
            if (Number(dataToCheckkDuplicate[i].uldSeriesNumberTo) <= Number(dataToCheckkDuplicate[j].uldSeriesNumberFrom) &&
              Number(dataToCheckkDuplicate[i].uldSeriesNumberTo) >= Number(dataToCheckkDuplicate[j].uldSeriesNumberTo) &&
              dataToCheckkDuplicate[i].uldType === dataToCheckkDuplicate[j].uldType &&
              dataToCheckkDuplicate[i].uldCarrierCode === dataToCheckkDuplicate[j].uldCarrierCode) {
              this.showErrorStatus("uld.operation.failed.overlapping.series.cannot.be.added");
              return;
            }
          }
        }
      }
    }
    const saveRequest = (<NgcFormArray>this.form.get(['moveableLocationTypeList'])).getRawValue();
    if (this.flagGreater) {
      this.showInfoStatus("uld.series.to.must.be.greater.than.series.from");
      return;
    }
    for (const eachRow of saveRequest) {
      if (!eachRow.uldType) {
        eachRow.uldType = this.form.get('moveableLocationType').value;
      }
      eachRow.moveableLocationType = this.form.get('moveableLocationType').value;
    }
    this.uldService.setMovementLocationTypes(saveRequest).subscribe(response => {
      this.resetFormMessages();
      if (response.messageList) {
        this.showErrorMessage(response.messageList[0].code);
      } else {
        this.onSearch();
        this.responseData = response.data;
        this.showSuccessStatus('operation.success');
      }
    },
      error => { this.showErrorStatus(error); });
  }

  deleteMovableLocation(index) {
    (this.form.get(['moveableLocationTypeList', index]) as NgcFormGroup).markAsDeleted();
  }

  selectCarrierData(event) {
    if (event.code) {
      this.showAddButton = true;
    }
  }

  selectSeriesTo(event, index) {
    this.flagGreater = false;
    if (this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberFrom']).value && this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberTo']).value) {
      if (this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberFrom']).value > this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberTo']).value) {
        this.showInfoStatus("uld.series.to.must.be.greater.than.series.from");
        this.flagGreater = true;
      }
    }
  }

  selectSeriesFrom(event, index) {
    this.flagGreater = false;
    if (this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberFrom']).value && this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberTo']).value) {
      if (this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberFrom']).value > this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberTo']).value) {
        this.showInfoStatus("uld.series.to.must.be.greater.than.series.from");
        this.flagGreater = true;
      }
    }
  }

  onSeriesInfo(index) {
    this.dataToSeriesInfo = (<NgcFormGroup>this.form.get(['moveableLocationTypeList', index])).getRawValue();
    this.dataToSeriesInfo.uldType = this.locationTypeValue;
    let firstInString = this.dataToSeriesInfo.uldSeriesNumberFrom.toString();
    let lastInString = this.dataToSeriesInfo.uldSeriesNumberTo.toString();
    let lenFirst = firstInString.length;
    let lenLast = lastInString.length;
    while (4 - lenLast) {
      lastInString = '0' + lastInString;
      ++lenLast;
    }
    while (4 - lenFirst) {
      firstInString = '0' + firstInString;
      ++lenFirst;
    }
    this.dataToSeriesInfo.lastUldSeries = lastInString;
    this.dataToSeriesInfo.firstUldSeries = lastInString;
    this.uldService.getUldSeriesTypes(this.dataToSeriesInfo).subscribe(response => {
      this.resetFormMessages();
      this.responseData = response.data;
      this.seriesInformationWindow.open();
      if (!this.responseData.uldSeriesList) {
        const arr = []
        for (var i = this.dataToSeriesInfo.uldSeriesNumberFrom; i <= this.dataToSeriesInfo.uldSeriesNumberTo; i++) {
          arr.push({
            uldNumber: i,
            uldKey: null,
            status: null,
            uldFlag: false,
            effectiveStartDate: null,
            effectiveEndDate: null,
            uldType: this.dataToSeriesInfo.uldType
          })
        }
        (<NgcFormArray>this.form.get(['uldSeriesList'])).patchValue(arr);
      } else {
        for (const eachRow of this.responseData.uldSeriesList) {
          eachRow.uldNumber = eachRow.uldKey;
        }
        (<NgcFormArray>this.form.get(['uldSeriesList'])).patchValue(this.responseData.uldSeriesList);
      }
    },
      error => { this.showErrorStatus(error); });
  }

  onCancel(event) {
    this.navigateTo(this.router, '/', null);
  }

}