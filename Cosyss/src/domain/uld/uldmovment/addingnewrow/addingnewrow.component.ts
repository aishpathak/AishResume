import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcDropDownComponent, PageConfiguration } from 'ngc-framework';
import { UldService } from '../../uld.service';

@Component({
  selector: 'ngc-addingnewrow',
  templateUrl: './addingnewrow.component.html',
  styleUrls: ['./addingnewrow.component.css']
})
export class AddingnewrowComponent extends NgcPage implements OnInit {
  @Input('uldNumber') uldNumber: string;
  childFormArray: NgcFormArray;
  @Output('resetForms') resetForms = new EventEmitter<any>();

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    // TODO avoid names beginning with _ for custom names
    private uldService: UldService) {
    super(appZone, appElement, appContainerElement);
  }
  @Input()
  newRowAdd: NgcFormGroup;

  ngOnInit() {
    let newArray = new Array();
    (<NgcFormArray>this.newRowAdd
      .get("newUldArray")).patchValue(newArray);
    for (let i = 0; i < 5; i++) {
      (<NgcFormArray>this.newRowAdd
        .get("newUldArray")).addValue([
          {
            uldNumberConcat: ''
          }
        ]);
    }
    const formGroup: NgcFormGroup = this.newRowAdd.get(['newUldArray', 0]) as NgcFormGroup;
    //
    formGroup.get('uldNumberConcat').setValidators(Validators.required);
    // formGroup.get('uldNumber').setValidators(Validators.required);
    // formGroup.get('uldCarrier').setValidators(Validators.required);
  }

  sendDataToService(item) {
    let arrayData = (<NgcFormArray>this.newRowAdd.controls["newUldArray"]).getRawValue();
    this.uldService.dataFromCommonTable = arrayData;
    this.resetForms.emit(arrayData);
    console.log(arrayData);
  }

  addRow() {
    (<NgcFormArray>this.newRowAdd
      .get("newUldArray")).addValue([
        {
          check: false,
          uldType: '',
          uldNumber: '',
          uldCarrier: ''
        }
      ]);
  }

  deleteRow(item, index) {
    (<NgcFormArray>this.newRowAdd.controls["newUldArray"]).deleteValueAt(index);
  }

}
