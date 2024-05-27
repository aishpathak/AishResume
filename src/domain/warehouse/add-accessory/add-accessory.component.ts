import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration, NgcContainerComponent, ReactiveModel
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { WarehouseService } from '../warehouse.service';



@Component({
  selector: 'app-add-accessory',
  templateUrl: './add-accessory.component.html',
  styleUrls: ['./add-accessory.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
  // restorePageOnBack: true
})
export class AddAccessoryComponent extends NgcPage implements OnInit {

  transferData: any;
  addNew: boolean = false;
  resp: any;
  flightId: any;
  showTable: boolean = false;
  saveResponse: any;
  saveRequest: any;
  deleteRequest: any;
  select: boolean = false;
  saveDataArray: any[] = [];
  onSearchFlag = false;
  uldFlag = false;
  @Input('showAsPopup') showAsPopup: boolean;
  private _inputData: any;
  @Input('inputData')
  public set inputData(data: any) {
    this._inputData = data;
    this.materialForm.get('flightType').patchValue(this._inputData.modeType);
    this.materialForm.get('flightNo').patchValue(this._inputData.flightKey);
    this.materialForm.get('fltDate').patchValue(this._inputData.flightDate);
    this.materialForm.get('uldNo').patchValue(this._inputData.uldNumber);
    this.onSearch();
  }
  @Output() autoSearchAccessoryInfo = new EventEmitter<boolean>();

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private warehouseService: WarehouseService) {
    super(appZone, appElement, appContainerElement);
  }

  private materialForm: NgcFormGroup = new NgcFormGroup({
    flightType: new NgcFormControl(),
    flightNo: new NgcFormControl(),
    flightId: new NgcFormControl(),
    fltDate: new NgcFormControl(),
    uldNo: new NgcFormControl(),
    uldList: new NgcFormArray([])
  })


  ngOnInit() {
    this.transferData = this.getNavigateData(this.activatedRoute);
    if (this.transferData != null) {
      this.materialForm.get('flightType').patchValue(this.transferData.mode);
      this.materialForm.get('flightNo').patchValue(this.transferData.flightKey);
      this.materialForm.get('fltDate').patchValue(this.transferData.flightDate);
      this.materialForm.get('uldNo').patchValue(this.transferData.uldNumber);
      this.onSearch();
    }
  }
  /**
     * Retreive all accessory related data for a flight and a uld
     *
     */
  onSearch() {
    let request = this.materialForm.getRawValue();

    if (request.flightType == null || request.flightType == '') {
      return this.showFormControlErrorMessage(<NgcFormControl>this.materialForm.get('flightType'), "Mandatory");
    }
    if (request.flightNo == null || request.flightNo == '') {
      return this.showFormControlErrorMessage(<NgcFormControl>this.materialForm.get('flightNo'), "Mandatory");
    }
    if (request.fltDate == null) {
      return this.showFormControlErrorMessage(<NgcFormControl>this.materialForm.get('fltDate'), "Mandatory");
    }
    request.mode = request.flightType;
    request.uldNumber = request.uldNo;
    request.flightKey = request.flightNo;
    request.flightDate = request.fltDate;
    //disabling input fields
    this.onSearchFlag = true;
    if (this.materialForm.get('uldNo').value != null) {
      //disabling input uld field when searching using uldNumber
      this.uldFlag = true;
    }

    // this.warehouseService.searchAccessory(request).subscribe(data => {
    //   this.refreshFormMessages(data);
    //   this.resp = data.data;
    //   if (!this.showResponseErrorMessages(data)) {
    //     if (this.resp != null) {
    //       this.flightId = this.createSourceParameter(this.resp.flightId);
    //       this.materialForm.get('flightId').patchValue(this.resp.flightId);
    //       this.materialForm.patchValue(this.resp);
    //       this.showTable = true;
    //     }
    //     else {
    //       this.showTable = false;
    //       if (this.materialForm.get('flightType').value == 'IMPORT') {
    //         this.showErrorMessage("accessory.uld.notcheckedin");
    //       }
    //       if (this.materialForm.get('flightType').value == 'EXPORT') {
    //         this.showErrorMessage("accessory.uld.notassigned");
    //       }
    //     }
    //   }
    // });
  }

  /**
  * adding new rows
  */
  onAdd() {
    this.showTable = true;

    //if searching by uld number
    if (this.materialForm.get('uldNo').value != null) {
      this.uldFlag = true;
      let request = this.materialForm.get('uldNo').value;
      (<NgcFormArray>this.materialForm.get('uldList')).addValue([
        {
          select: false,
          uldNumber: request,
          uldId: '',
          materialCode: '',
          quantity: '',
          materialDescription: '',
          remarks: ''
        }
      ])
    }
    //if searching without uld number
    else {
      this.uldFlag = false;
      (<NgcFormArray>this.materialForm.get('uldList')).addValue([
        {
          select: false,
          uldNumber: '',
          uldId: '',
          materialCode: '',
          quantity: '',
          materialDescription: '',
          remarks: ''
        }
      ])
    }
  }

  /**
  * Save accessory data assigned to a uld,Uld data and flight data
  *
  * @returns
  */
  onSave() {
    this.saveRequest = this.materialForm.getRawValue();
    this.saveRequest.uldNumber = this.saveRequest.uldNo;
    this.saveRequest.mode = this.saveRequest.flightType;
    this.saveRequest.flightKey = this.saveRequest.flightNo;
    this.saveRequest.flightDate = this.saveRequest.fltDate;
    let lenght: any = (<NgcFormArray>this.materialForm.controls["uldList"]).length;
    for (let i = 0; i < lenght; i++) {
      //checking if quantity is null or zero
      if (this.materialForm.get(['uldList', i, 'quantity']).value == 0 || this.materialForm.get(['uldList', i, 'quantity']).value == null) {
        this.showFormControlErrorMessage(<NgcFormControl>this.materialForm.get(['uldList', i, 'quantity']), "accessory.uld.quantity.not.zero");
        return;
      }
      //checking if material code is empty
      if (this.materialForm.get(['uldList', i, 'materialCode']).value == '' || this.materialForm.get(['uldList', i, 'materialCode']).value == null) {
        this.showFormControlErrorMessage(<NgcFormControl>this.materialForm.get(['uldList', i, 'materialCode']), "accessory.uld.code.blank");
        return;
      }
      //checking if uldNumber is empty
      if (this.materialForm.get(['uldList', i, 'uldNumber']).value == '' || this.materialForm.get(['uldList', i, 'uldNumber']).value == null) {
        this.showFormControlErrorMessage(<NgcFormControl>this.materialForm.get(['uldList', i, 'uldNumber']), "export.uldnumber.blank");
        return;
      }

    }

    //saving data
    // this.warehouseService.saveAccessory(this.saveRequest).subscribe(data => {
    //   this.refreshFormMessages(data);
    //   this.saveResponse = data.data
    //   this.autoSearchAccessoryInfo.emit(true);
    //   if (!this.showResponseErrorMessages(data)) {
    //     this.showSuccessStatus("g.completed.successfully");
    //     //calling Search method on successfull insertion
    //     this.onSearch();
    //   }
    // });
  }

  /**
 * Used for selecting a particular accessory from lov
 *
 * @returns
 */
  onSelectCode(object, index) {
    this.materialForm.get(['uldList', index, 'materialDescription']).setValue(object.desc);
  }

  onClear() {
    this.materialForm.reset();
  }
  /**
   * Used for deleting accessory data for selected records
   *
   * @returns
   */
  onDelete() {
    let deleteArray: any = new Array();
    this.deleteRequest = this.materialForm.getRawValue();
    //pushing the selected records to list for deleting
    for (const eachRow of this.deleteRequest.uldList) {
      if (eachRow.select) {
        deleteArray.push(eachRow);
      }
    }
    this.deleteRequest.uldList = deleteArray;
    if (this.deleteRequest.uldList.length > 0) {
      this.showConfirmMessage('delete.selected.records').then(fulfilled => {
        // this.warehouseService.deleteAccessory(this.deleteRequest).subscribe(data => {
        //   this.refreshFormMessages(data);
        //   if (!this.showResponseErrorMessages(data)) {
        //     this.showSuccessStatus("g.completed.successfully");
        //     //calling Search method on successfull deletion
        //     this.onSearch();
        //   }
        // });
      })
    }
    else {
      this.showErrorMessage('please.select.record');
    }
  }

}
