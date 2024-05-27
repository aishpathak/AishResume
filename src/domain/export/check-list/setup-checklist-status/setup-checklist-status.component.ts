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
  NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcFormControl,NgcUtility, PageConfiguration
} from 'ngc-framework';
@Component({
  selector: 'app-setup-checklist-status',
  templateUrl: './setup-checklist-status.component.html',
  styleUrls: ['./setup-checklist-status.component.css']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true

})
export class SetupChecklistStatusComponent extends NgcPage {
  resp: any;
  arrayUser: any;
  forwardedData: any;
  showHideTable = false;
  showAWBNumber = false;
  navigateToInsertOrUpdate = true;
  private searchForm: NgcFormGroup = new NgcFormGroup({
    status: new NgcFormControl(),
    flightId: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    acceptanceTo: new NgcFormControl(),
    shipmentDate: new NgcFormControl(),
    // 21721001101
    shipmentNumber: new NgcFormControl(),
    acceptanceFrom: new NgcFormControl(),
    shipmentChecklist: new NgcFormArray([]),
    comCheckListTypesId: new NgcFormControl(),
  })
  private form: NgcFormGroup = new NgcFormGroup({
    status: new NgcFormControl(),
    flightId: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightKeydate: new NgcFormControl(),
    acceptanceTo: new NgcFormControl(),
    shipmentDate: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    acceptanceFrom: new NgcFormControl(),
    shipmentChecklist: new NgcFormArray([]),
    comCheckListTypesId: new NgcFormControl(),
  })

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private router: Router, private activatedRoute: ActivatedRoute, private _checklistService: CheckListService) {
    super(appZone, appElement, appContainerElement);
  }
  ngOnInit() {
    super.ngOnInit();
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    if (this.forwardedData.screen == 'Acceptance') {
      this._checklistService.dataFromChecklist = this.forwardedData
    }
    if (this.forwardedData) {
      if (this.forwardedData.requestDataToEdit) {
        this.searchForm.patchValue(this.forwardedData.requestDataToEdit);
        this.onSearch();
      } else {

        this.searchForm.patchValue(this.forwardedData);
        this.onSearch();
      }
    }
    this.form.get("acceptanceTo").setValue(null);
    this.form.get("acceptanceFrom").setValue(null);
  }

  onSearchAsPerShipmentNumber(item, index) {
    this.resetFormMessages();
    if (!item.comCheckListTypesId) {
      this.showErrorStatus('export.select.checklist.type');
      (<NgcFormControl>this.form.get(['shipmentChecklist', index, 'shipmentNumber'])).setValue('');
      return;
    }
    const dataToRequest = {
      shipmentNumber: item.shipmentNumber
    }
    this._checklistService.onSearchChecklistAsPerShipmentNumber(dataToRequest).subscribe(data => {
      const response = data;
      const arrayUser = response.data;
      if (arrayUser === null) {
        this.showErrorStatus('export.no.data.found');
        this.form.get(['shipmentChecklist', index, 'shipmentNumberData']).setValue(false);
        return;
      } else {
        console.log(JSON.stringify(arrayUser));
        if (arrayUser.shc) {
          let shcList = arrayUser.shc.split(',');
          arrayUser.shcs = [];
          for (let eachShc of shcList) {
            arrayUser.shcs.push({
              specialHandlingCode: eachShc
            });
          }
        }
        arrayUser.shipmentNumber = item.shipmentNumber;
        (<NgcFormArray>this.form.get(['shipmentChecklist', index])).patchValue(arrayUser);
        this.form.get(['shipmentChecklist', index, 'shipmentNumberData']).setValue(true);
        this.form.get(['shipmentChecklist', index, 'comCheckListTypesId']).setValue(item.comCheckListTypesId);
        this.form.get(['shipmentChecklist', index, 'status']).setValue('pending');
        this.form.get(['shipmentChecklist', index, 'flagCRUD']).setValue('C');

      }
    });
  }

  onSearch() {
    this.resetFormMessages();
    this.showHideTable = false;
    this.searchForm.validate();
    if (this.searchForm.invalid) {
      return;
    }
    this.showAWBNumber = true;
    const searchRequest = this.searchForm.getRawValue();
    this._checklistService.onSearchSetupChecklist(searchRequest).subscribe(data => {
      this.resp = data;
      this.refreshFormMessages(data);
      this.arrayUser = this.resp.data;
      for (let eachRow of this.arrayUser) {
        if (eachRow.shc) {
          let shcList = eachRow.shc.split(',');
          eachRow.shcs = [];
          for (let eachShc of shcList) {
            eachRow.shcs.push({
              specialHandlingCode: eachShc
            });
          }
        }
      }
      if (this.arrayUser.length > 0) {
        this.showHideTable = true;
        for (const eachRow of this.arrayUser) {
          eachRow.shipmentNumberData = true;
        }
        (<NgcFormArray>this.form.get(['shipmentChecklist'])).patchValue(this.arrayUser);
      } else {
        this.showErrorStatus('export.no.data.found');
      }
    });
  }

  public onAddChecklist() {
    this.showHideTable = true;
    this.showAWBNumber = false;
    (<NgcFormArray>this.form.controls['shipmentChecklist']).addValue([
      {
        origin: null,
        pieces: null,
        weight: null,
        flightId: null,
        flagCRUD: 'C',
        flightKey: null,
        carrierCode: null,
        destination: null,
        shipmentDate: null,
        status: 'PENDING',
        shipmentNumber: null,
        shipmentNumberData: false,
        comCheckListTypesId: this.searchForm.get('comCheckListTypesId').value,
        shcs: [{
          specialHandlingCode: ''
        }]
      }
    ]);
  }

  public onSave() {
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    this.resetFormMessages();
    const saveRequest = (<NgcFormArray>this.form.get(['shipmentChecklist'])).getRawValue();
    // To check duplicate records in a row
    for (let i = 0; i < saveRequest.length; i++) {
      if (saveRequest[i].flagCRUD !== 'D') {
        for (let j = 0; j < saveRequest.length; j++) {
          if (i != j) {
            if (saveRequest[j].flagCRUD !== 'D') {
              if (saveRequest[i].shipmentNumber == saveRequest[j].shipmentNumber &&
                saveRequest[i].comCheckListTypesId == saveRequest[j].comCheckListTypesId) {
                this.showErrorStatus("export.duplicate.data.input.other.one");
                return;
              }
            }
          }
        }

      }
    }
    // To check valid record with proper values patched in it like
    // : origin destination pieces carrierCode weight
    // Can not add in the above loop as it wil definitely break the condition
    for (let i = 0; i < saveRequest.length; i++) {
      // removing other flags, asi
      if (saveRequest[i].flagCRUD === 'C') {
        if (!saveRequest[i].origin && !saveRequest[i].destination && !saveRequest[i].pieces && !saveRequest[i].carrierCode
          && !saveRequest[i].weight) {
          this.showErrorStatus(NgcUtility.translateMessage("record.not.found.for.item",[Number(i + 1).toString()]));
          return;
        }
      }
    }
    console.log(JSON.stringify(saveRequest));
    this._checklistService.onSaveSetupChecklist(saveRequest).subscribe(data => {
      this.refreshFormMessages(data);
      this.resp = data;
      this.arrayUser = this.resp.data;
      if (data.messageList) {
        this.showErrorMessage(data.messageList[0].message);
      } else {
        this.showSuccessStatus('g.completed.successfully');
        this.onSearch();
      }
    });
  }

  public deleteShipmentChecklist(index) {
    (<NgcFormArray>this.form.controls['shipmentChecklist']).markAsDeletedAt(index);
  }

  public onEditShipmentChecklist(index) {
    const requestDataToEdit = (<NgcFormGroup>this.form.get(['shipmentChecklist', index])).getRawValue();

    if (!requestDataToEdit.comCheckListTypesId && !requestDataToEdit.shipmentNumber) {
      this.showErrorStatus("export.input.checklist.type.awb");
      return;
    }
    if (!requestDataToEdit.shipmentNumberData) {
      this.showErrorStatus("export.save.the.record");
      return;
    }
    if (requestDataToEdit.shipmentCheckListStatusId) {
      this._checklistService.onSearchQuestionnaire(requestDataToEdit).subscribe(response => {
        this.refreshFormMessages(response);
        const arrayTosendToEditChecklist = response.data;
        if (response.messageList) {
          this.showErrorMessage(response.messageList[0].message);
        } else {
          if (arrayTosendToEditChecklist.length > 0) {
            arrayTosendToEditChecklist.requestDataToEdit = requestDataToEdit;
            this.navigateTo(this.router, '/export/checklist/editchecklist', arrayTosendToEditChecklist);
          } else {
            this.navigateTo(this.router, '/export/checklist/fillchecklist', requestDataToEdit);
          }

        }
      });
    } else {
      this.showErrorMessage('export.save.record.before.editing');
    }
  }

  public onAcceptanceFrom(event) {
    if (event === null && (this.form.controls.acceptanceTo.value === null)) {
      this.form.controls.acceptanceTo.setValidators([]);
      this.form.controls.acceptanceFrom.setValidators([]);
    } else {
      this.form.controls.acceptanceTo.setValidators(Validators.required);
      this.form.controls.acceptanceFrom.setValidators(Validators.required);
    }
  }

  public onAcceptanceTo(event) {
    if (event === null && (this.form.controls.acceptanceFrom.value === null)) {
      this.form.controls.acceptanceTo.setValidators([]);
      this.form.controls.acceptanceFrom.setValidators([]);
    } else {
      this.form.controls.acceptanceTo.setValidators(Validators.required);
      this.form.controls.acceptanceFrom.setValidators(Validators.required);
    }
  }

  onClear(event) {
    (<NgcFormArray>this.form.get('shipmentChecklist')).resetValue([]);
    this.form.reset();
    this.searchForm.reset();
    this.showHideTable = false;
  }

  onCancel(event) {
    if (this._checklistService.dataFromChecklist) {
      if (this._checklistService.dataFromChecklist.screen == "Acceptance") {
        if (this._checklistService.dataFromChecklist.acceptanceType == "PRE_LODGE_SHIPMENT") {
          this.navigateTo(this.router, 'export/acceptance/managecargoprelodge', this._checklistService.dataFromChecklist);
        }
        else if (this._checklistService.dataFromChecklist.acceptanceType == "TRANSHIPMENT_COURIER") {
          this.navigateTo(this.router, 'export/acceptance/managecargotranshipmentcourier', this._checklistService.dataFromChecklist);
        }
        else if (this._checklistService.dataFromChecklist.acceptanceType == "NAWB_SHIPMENT") {
          this.navigateTo(this.router, 'export/acceptance/managecargonawbshipment', this._checklistService.dataFromChecklist);
        }
        else if (this._checklistService.dataFromChecklist.acceptanceType == "TRUCKING_SERVICE_SURF") {
          this.navigateTo(this.router, 'export/acceptance/managecargotruckingsurf', this._checklistService.dataFromChecklist);
        }
        else if (this._checklistService.dataFromChecklist.acceptanceType == "TRUCKING_SERVICE_FLIGHT") {
          this.navigateTo(this.router, 'export/acceptance/managecargotruckingflight', this._checklistService.dataFromChecklist);
        }
        else if (this._checklistService.dataFromChecklist.acceptanceType == "TERMINAL_TO_TERMINAL") {
          this.navigateTo(this.router, 'export/acceptance/managecargoawbinformation', this._checklistService.dataFromChecklist);
        }
        else if (this._checklistService.dataFromChecklist.acceptanceType == "LOCAL_COURIER") {
          this.navigateTo(this.router, 'export/acceptance/managecargolocalcourier', this._checklistService.dataFromChecklist);
        }
        else if (this._checklistService.dataFromChecklist.acceptanceType == "E_READY_SHIPMENTS") {
          this.navigateTo(this.router, 'export/acceptance/managecargoereadyshipment', this._checklistService.dataFromChecklist);
        }
        else if (this._checklistService.dataFromChecklist.acceptanceType == "ECC_ACCEPTANCE") {
          this.navigateTo(this.router, 'export/acceptance/managecargoawbinformation', this._checklistService.dataFromChecklist);
        }


      }
    }
    else {
      this.navigateHome();
    }
  }




}

