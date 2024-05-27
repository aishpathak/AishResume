import { Validators } from '@angular/forms';
// import { index } from 'chalk';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, PageConfiguration, NgcWindowComponent, NgcUtility } from 'ngc-framework';
import { Router } from '@angular/router';
import { UldService } from '../uld.service';
@Component({
  selector: 'app-maintain-movable-location-types',
  templateUrl: './maintain-movable-location-types.component.html',
  styleUrls: ['./maintain-movable-location-types.component.css']
})

@PageConfiguration({
  trackInit: true,
  autoBackNavigation: true,
  callNgOnInitOnClear: true
})
export class MaintainMovableLocationTypesComponent extends NgcPage {
  num: '';
  uldFlag = true;
  globalIndex = 0;
  binFlag = false;
  lspFlag = false;
  showFlag = false;
  responseData: any;
  binFlagShow = false;
  lastUldSeries: any;
  btmtpdFlag = false;
  firstUldSeries: any;
  flagGreater = false;
  showAddButton = true;
  dataToSeriesInfo: any;
  showSeriesKey = false;
  locationTypeValue: any;
  valueNotInRange = false;
  movableLocationType: any;
  recordCount = 0;
  uldSeriesCompleteList = [];
  maxLength: any;
  minLength: any;
  popupFlag = false;

  @ViewChild('seriesInformationWindow')
  private seriesInformationWindow: NgcWindowComponent;

  private form: NgcFormGroup = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    lastUldSeries: new NgcFormControl(),
    uldSeriesList: new NgcFormArray([]),
    firstUldSeries: new NgcFormControl(),
    uldSeriesNumberTo: new NgcFormControl(),
    uldSeriesNumberFrom: new NgcFormControl(),
    moveableLocationType: new NgcFormControl(),
    moveableLocationTypeList: new NgcFormArray([]),
    rowSelectedSeriesFrom: new NgcFormArray([]),
    rowSelectedSeriesTo: new NgcFormArray([])
  });

  char: any;
  iNumValue: any;
  jNumValue: any;
  globalNum: string;
  globalChar: any;
  binFromNumber: any;
  globalNumFrom: string;
  flagUldSeries = false;
  validNumberCheck = true;
  seriesInformationTitle: any;
  seriesFromList: any;
  seriesToList: any;
  constructor(
    appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router, private uldService: UldService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }

  onSearch() {
    if (NgcUtility.isBlank(this.form.get('moveableLocationType').value)) {
      this.showErrorMessage("mandatory.fields.cannot.be.empty");
      return;
    }
    const searchRequest = this.form.getRawValue();
    searchRequest.uldSeriesNumberFrom = null;
    searchRequest.uldSeriesNumberTo = null;
    this.uldService.getMovementLocationTypes(searchRequest).subscribe(response => {
      this.resetFormMessages();
      this.responseData = response.data;
      this.form.get(['moveableLocationTypeList']).patchValue(this.responseData);
      this.showFlag = true;
    },
      error => { this.showErrorStatus(error); });
  }

  onAddNewRow() {
    this.getMaxAndMinLengthValidationsBasedonLocationType();
    (<NgcFormArray>this.form.get('moveableLocationTypeList')).addValue(
      [{
        flagCRUD: 'C',
        uldType: null,
        usedFor: null,
        allowEdit: true,
        checkDigit: null,
        availableToUse: this.form.get('moveableLocationType').value == 'LSP' ? true : null,
        uldCarrierCode: null,
        effectiveEndDate: null,
        uldSeriesNumberTo: null,
        effectiveStartDate: new Date(),
        uldSeriesNumberFrom: null,
        uldSeriesTareWeight: null,
        htClass: null,
        availableForLoading: false,
        moveableLocationType: this.locationTypeValue,
      }]);
  }

  onSelectDropdown(event) {
    this.resetFormMessages();
    if (event.code) {
      const checkLength = event.code.length;
      if (checkLength > 3) {
        this.showErrorStatus("uld.movable.location.type.length.canot.be.more.than.3");
        (<NgcFormControl>this.form.get(['moveableLocationType'])).setValue(null);
        return;
      }
    }
    this.showFlag = false;
    this.showAddButton = false;
    this.binFlagShow = true;
    this.locationTypeValue = event.code;
    if (event.code == 'BIN') {
      this.binFlagShow = false;
      (<NgcFormArray>this.form.get(['moveableLocationTypeList'])).resetValue([]);
      this.form.get('carrierCode').setValue(null);
      this.uldFlag = false;
      this.binFlag = true;
      this.lspFlag = false;
      this.btmtpdFlag = false;
      this.showAddButton = true;
    } else if (event.code === 'HPD') {
      (<NgcFormArray>this.form.get(['moveableLocationTypeList'])).resetValue([]);
      this.form.get('carrierCode').setValue(null);
      this.uldFlag = true;
      this.binFlag = false;
      this.btmtpdFlag = false;
      this.lspFlag = false;
      this.showAddButton = true;
    } else if (event.code == 'LSP') {
      (<NgcFormArray>this.form.get(['moveableLocationTypeList'])).resetValue([]);
      this.form.get('carrierCode').setValue(null);
      this.uldFlag = false;
      this.lspFlag = true;
      this.binFlag = false;
      this.btmtpdFlag = false;
      this.showAddButton = true;
    } else if (event.code) {
      (<NgcFormArray>this.form.get(['moveableLocationTypeList'])).resetValue([]);
      this.form.get('carrierCode').setValue(null);
      this.uldFlag = false;
      this.binFlag = false;
      this.btmtpdFlag = true;
      this.lspFlag = false;
      this.showAddButton = true;
    }
    else {
      (<NgcFormArray>this.form.get(['moveableLocationTypeList'])).resetValue([]);
      this.uldFlag = false;
      this.binFlag = false;
      this.btmtpdFlag = false;
      this.lspFlag = false;
      this.showAddButton = true;
    }
  }

  onSave(event) {
    if (this.flagUldSeries) {
      this.showErrorStatus("uld.difference.between.series.from.and.to.must.be.lesser.than.500");
      return;
    }
    (<NgcFormArray>this.form.get(['uldSeriesList'])).resetValue([]);
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    let dataToCheckkDuplicate: any = (<NgcFormArray>this.form.get("moveableLocationTypeList")).getRawValue();
    if (this.locationTypeValue !== 'BIN') {
      for (let i = 0; i < dataToCheckkDuplicate.length; i++) {
        for (let j = 0; j < dataToCheckkDuplicate.length; j++) {
          if (i != j) {
            if (dataToCheckkDuplicate[i].flagCRUD !== 'D' && dataToCheckkDuplicate[j].flagCRUD !== 'D') {
              if (Number(dataToCheckkDuplicate[i].uldSeriesNumberFrom) >= Number(dataToCheckkDuplicate[j].uldSeriesNumberFrom) &&
                Number(dataToCheckkDuplicate[i].uldSeriesNumberFrom) <= Number(dataToCheckkDuplicate[j].uldSeriesNumberTo)) {
                this.showErrorStatus("uld.operation.failed.overlapping.series.cannot.be.added");
                return;
              }
              if (Number(dataToCheckkDuplicate[i].uldSeriesNumberTo) <= Number(dataToCheckkDuplicate[j].uldSeriesNumberFrom) &&
                Number(dataToCheckkDuplicate[i].uldSeriesNumberTo) >= Number(dataToCheckkDuplicate[j].uldSeriesNumberTo)) {
                this.showErrorStatus("uld.operation.failed.overlapping.series.cannot.be.added");
                return;
              }
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
    this.flagUldSeries = false;
    if ((this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberTo']).value -
      this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberFrom']).value) > 500) {
      this.showInfoStatus("uld.difference.between.series.from.and.to.must.be.lesser.than.500");
      this.flagUldSeries = true;
      return;
    }
    if (this.locationTypeValue === 'BIN') {
      if (this.form.get(['moveableLocationTypeList', index, 'flagCRUD']).value === 'C') {
        this.onValueChanges(this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberFrom']).value);
      }
      this.flagGreater = false;
      if (this.globalNum && this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberTo']).value) {
        if (this.globalNum > this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberTo']).value) {
          this.showInfoStatus("uld.series.to.must.be.greater.than.series.from");
          this.flagGreater = true;
        }
      }
    } else if (this.locationTypeValue === 'HPD') {
      this.flagGreater = false;
      if (this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberFrom']).value && this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberTo']).value) {
        if (parseInt(this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberFrom']).value) > parseInt((this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberTo']).value))) {
          this.showInfoStatus("uld.series.to.must.be.greater.than.series.from");
          this.flagGreater = true;
        }
      }
    } else {
      this.flagGreater = false;
      if (this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberFrom']).value && this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberTo']).value) {
        if (this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberFrom']).value > this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberTo']).value) {
          this.showInfoStatus("uld.series.to.must.be.greater.than.series.from");
          this.flagGreater = true;
        }
      }
    }
  }

  selectSeriesFrom(event, index) {
    this.flagUldSeries = false;
    if ((this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberTo']).value -
      this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberFrom']).value) > 500) {
      this.showInfoStatus("uld.difference.between.series.from.and.to.must.be.lesser.than.500");
      this.flagUldSeries = true;
      return;
    }
    if (this.locationTypeValue === 'BIN') {
      this.onValueChanges(this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberFrom']).value);
      this.flagGreater = false;
      if (this.globalNum && this.form.get(['moveableLocationTypeList', index, 'uldSeriesglobalNumberTo']).value) {
        if (this.globalNum > this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberTo']).value) {
          this.showInfoStatus("uld.series.to.must.be.greater.than.series.from");
          this.flagGreater = true;
        }
      }
    } else {
      this.flagGreater = false;
      if (this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberFrom']).value && this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberTo']).value) {
        if (this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberFrom']).value > this.form.get(['moveableLocationTypeList', index, 'uldSeriesNumberTo']).value) {
          this.showInfoStatus("uld.series.to.must.be.greater.than.series.from");
          this.flagGreater = true;
        }
      }
    }
  }

  onSeriesInfo(index, event) {
    this.globalIndex = index;
    this.dataToSeriesInfo = (<NgcFormGroup>this.form.get(['moveableLocationTypeList', index])).getRawValue();
    this.dataToSeriesInfo.rowSelectedSeriesFrom = this.dataToSeriesInfo.uldSeriesNumberFrom;
    this.dataToSeriesInfo.rowSelectedSeriesTo = this.dataToSeriesInfo.uldSeriesNumberTo;
    this.dataToSeriesInfo.offSet = 0;
    this.getMaxAndMinLengthValidationsBasedonLocationType();
    this.uldService.getUldSeriesTypes(this.dataToSeriesInfo).subscribe(response => {
      this.resetFormMessages();
      this.seriesInformationTitle = NgcUtility.translateMessage("uld.series.information.title", [this.locationTypeValue]);
      this.seriesInformationWindow.open();
      this.form.get('uldSeriesNumberFrom').setValidators(Validators.required);
      this.form.get('uldSeriesNumberTo').setValidators(Validators.required);
      if (!response.messageList) {
        this.form.get('uldSeriesNumberFrom').patchValue(this.dataToSeriesInfo.uldSeriesNumberFrom);
        this.form.get('uldSeriesNumberTo').patchValue(this.dataToSeriesInfo.uldSeriesNumberTo);
        this.recordCount = response.data.recordCount;
        this.uldSeriesCompleteList = response.data.uldSeriesList;
        this.onSearchList(event);
        (<NgcFormArray>this.form.get(['uldSeriesList'])).patchValue(response.data.uldSeriesList);
      } else {
        this.showErrorStatus(response.messageList[0].code);
      }
    },
      error => { this.showErrorStatus(error); });
  }

  getMaxAndMinLengthValidationsBasedonLocationType() {
    if (this.locationTypeValue === 'BT' || this.locationTypeValue === 'PD' || this.locationTypeValue === 'MT') {
      this.maxLength = 6;
      this.minLength = 4;
    } else if (this.locationTypeValue === 'HPD') {
      this.maxLength = 3;
      this.minLength = 3;
    } else {
      this.maxLength = 4;
      this.minLength = 4;
    }
  }

  onSearchList(event) {
    var rowSelectedSeriesTo = this.dataToSeriesInfo.rowSelectedSeriesTo;
    var rowSelectedSeriesFrom = this.dataToSeriesInfo.rowSelectedSeriesFrom;
    let offSetValue = this.dataToSeriesInfo.offSet;
    this.dataToSeriesInfo = (<NgcFormGroup>this.form.get(['moveableLocationTypeList', this.globalIndex])).getRawValue();
    this.dataToSeriesInfo.uldSeriesNumberTo = this.form.get('uldSeriesNumberTo').value;
    this.dataToSeriesInfo.uldSeriesNumberFrom = this.form.get('uldSeriesNumberFrom').value;
    this.dataToSeriesInfo.rowSelectedSeriesTo = rowSelectedSeriesTo;
    this.dataToSeriesInfo.rowSelectedSeriesFrom = rowSelectedSeriesFrom;
    if (NgcUtility.isBlank(this.dataToSeriesInfo.uldSeriesNumberTo) || NgcUtility.isBlank(this.dataToSeriesInfo.uldSeriesNumberFrom)) {
      this.showErrorStatus("uld.please.enter.from.and.to");
      return;
    }
    this.getMaxAndMinLengthValidationsBasedonLocationType();
    this.dataToSeriesInfo.offSet = !event ? 0 : event && event == 'next' ? (offSetValue + 10) : (offSetValue - 10);
    this.uldService.getUldSeriesTypes(this.dataToSeriesInfo).subscribe(response => {
      this.resetFormMessages();
      this.seriesInformationTitle = NgcUtility.translateMessage("uld.series.information.title", [this.locationTypeValue]);
      this.seriesInformationWindow.open();
      if (!response.messageList) {
        this.recordCount = (this.dataToSeriesInfo.uldSeriesNumberTo - this.dataToSeriesInfo.uldSeriesNumberFrom) + 1;
        (<NgcFormArray>this.form.get(['uldSeriesList'])).patchValue(response.data.uldSeriesList);
      } else {
        this.showErrorStatus(response.messageList[0].code);
      }
      this.popupFlag = true;
      this.form.get('uldSeriesNumberFrom').setValidators(Validators.required);
      this.form.get('uldSeriesNumberTo').setValidators(Validators.required);
    },
      error => { this.showErrorStatus(error); });
  }

  deleteSeriesInfo(index) {
    (this.form.get(['uldSeriesList', index]) as NgcFormGroup).markAsDeleted();
  }

  onSaveUldSeries(index) {
    this.form.validate();
    const searchFormGroup: NgcFormArray = (<NgcFormArray>this.form.get('uldSeriesList'));
    // Validate
    searchFormGroup.validate();
    if (NgcUtility.isBlank(this.form.get(['uldSeriesList']).invalid)) {
      this.showErrorMessage("mandatory.fields.cannot.be.empty");
      return;
    }
    const saveUldSeriesRequest = (<NgcFormGroup>this.form.get(['uldSeriesList'])).getRawValue();
    if (this.locationTypeValue == 'LSP') {
      for (let i = 0; i < this.uldSeriesCompleteList.length; i++) {
        for (let j = 0; j < saveUldSeriesRequest.length; j++) {
          if (saveUldSeriesRequest[j].flagCRUD == 'C'
            && this.uldSeriesCompleteList[i].uldNumber == saveUldSeriesRequest[j].uldNumber) {
            this.showErrorStatus("uld.overlapping.series.range");
            return;
          }
        }
      }
    } else {
      for (let i = 0; i < saveUldSeriesRequest.length; i++) {
        for (let j = 0; j < saveUldSeriesRequest.length; j++) {
          if (i != j) {
            if (saveUldSeriesRequest[i].uldNumber == saveUldSeriesRequest[j].uldNumber) {
              this.showErrorStatus("uld.overlapping.series.range");
              return;
            }
          }
        }
      }
    }
    this.valueNotInRange = true;
    for (const eachRow of saveUldSeriesRequest) {
      eachRow.uldType = this.locationTypeValue;
      let noInString = eachRow.uldNumber.toString();
      if (this.locationTypeValue === 'LSP') {
        let noInString = eachRow.uldKey.toString();
        eachRow.uldKey = noInString;
        this.valueNotInRange = true;
      }
      if (Number(eachRow.uldNumber) < this.dataToSeriesInfo.uldSeriesNumberFrom ||
        this.dataToSeriesInfo.uldSeriesNumberTo < Number(eachRow.uldNumber)) {
        this.valueNotInRange = false;
      }
      if (eachRow.flagCRUD !== 'D' && this.locationTypeValue !== 'LSP') {
        let len = noInString.length;
        if (this.locationTypeValue === 'HPD') {
          while (3 - len) {
            noInString = '0' + noInString;
            ++len;
          }
        } else {
          while (4 - len) {
            noInString = '0' + noInString;
            ++len;
          }
        }
        if (this.locationTypeValue === 'BIN') {
          eachRow.uldNumber = noInString;
          eachRow.uldKey = noInString;
        }
        if (this.locationTypeValue !== 'BIN') {
          eachRow.uldKey = this.locationTypeValue + noInString;
        }
      }

    }
    if (this.valueNotInRange) {
      this.uldService.setUldSeriesTypes(saveUldSeriesRequest).subscribe(response => {
        this.resetFormMessages();
        this.responseData = response.data;
        if (response.messageList != null) {
          this.showErrorMessage(response.messageList[0].code,
            response.messageList[0].message,
            response.messageList[0].placeHolder, null);
        } else {
          this.showSuccessStatus('operation.success');
          this.seriesInformationWindow.close();
        }

      });
    } else {
      this.showErrorStatus('uld.number.can.be.between.series.from.and.series.to');
      return;
    }
  }


  onAddUldSeries(event) {
    (<NgcFormArray>this.form.get('uldSeriesList')).addValue(
      [{
        flagCRUD: 'C',
        uldKey: null,
        uldNumber: null,
        status: 'SER',
        allowEdit: true,
        uldFlag: true,
        effectiveEndDate: null,
        effectiveStartDate: new Date(),
        uldType: this.dataToSeriesInfo.uldType,
        uldSeriesNumberFrom: this.dataToSeriesInfo.uldSeriesNumberFrom,
        uldSeriesNumberTo: this.dataToSeriesInfo.uldSeriesNumberTo
      }]);
  }

  onCancel(event) {
    this.navigateTo(this.router, '/', null);
  }

  onValueChanges(event) {
    this.num = '';
    this.char = '';
    this.validNumberCheck = true;
    const lengthOfValue = event.length;
    for (let i = 0; i < lengthOfValue; i++) {
      if (event[i] >= 0 && event[i] <= 9) {
        this.num += event[i];
        this.globalNum = this.num;
        this.validNumberCheck = false;
      } else {
        if (this.validNumberCheck) {
          this.char += event[i];
          this.globalChar = this.char;
        } else {
          this.showErrorMessage("uld.invalid.input.entered");
          return;
        }
      }
    }
  }

  onValueChangesFrom(event) {
    this.num = '';
    const lengthOfValue = event.length;
    for (let i = 0; i < lengthOfValue; i++) {
      if (event[i] >= 0 && event[i] <= 9) {
        this.num += event[i];
        this.binFromNumber = this.num;
      }
    }
  }

  onClose() {
    (<NgcFormArray>this.form.get(['uldSeriesList'])).resetValue([]);
    this.form.get('uldSeriesNumberFrom').setValidators([]);
    this.form.get('uldSeriesNumberTo').setValidators([]);
  }

  onEnterLspNumber(value, index) {
    if (value.length == 5) {
      (<NgcFormControl>this.form.get(['uldSeriesList', index, 'uldNumber'])).patchValue(value.slice(0, 4));
    }
  }
  onSearchChange() {
    this.seriesFromList = this.form.get('uldSeriesNumberFrom').value;
    this.seriesToList = this.form.get('uldSeriesNumberTo').value;
    if (!this.seriesFromList && !this.seriesToList
      && NgcUtility.isBlank(this.seriesToList) && NgcUtility.isBlank(this.seriesFromList)) {
      this.showErrorStatus("uld.please.enter.from.and.to");
      this.popupFlag = false;
    } else {
      this.popupFlag = false;
    }
  }
}
