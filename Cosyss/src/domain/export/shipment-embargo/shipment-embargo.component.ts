import { Embargo } from './../export.sharedmodel';
import { ExportService } from './../export.service';
import { NgcFormGroup, NgcFormControl, NgcFormArray, NgcWindowComponent, PageConfiguration } from 'ngc-framework';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
/**
 *
 * @export
 * @class ShipmentEmbargoComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-shipment-embargo',
  templateUrl: './shipment-embargo.component.html',
  styleUrls: ['./shipment-embargo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ShipmentEmbargoComponent implements OnInit {
  private response;
  private indexModified = -1;
  @ViewChild('addWindow') addWindow: NgcWindowComponent;
  private form = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    embargoList: new NgcFormArray([])
  });

  private addForm = new NgcFormGroup({
    country: new NgcFormControl(),
    flightSector: new NgcFormControl(),
    shcGroup: new NgcFormControl(),
    schCode: new NgcFormControl(),
    startDate: new NgcFormControl(),
    endDate: new NgcFormControl(),
    aircraftType: new NgcFormControl(),
    paxOrFrt: new NgcFormControl(),
    reason: new NgcFormControl(),
    // isUpdated: new NgcFormControl(),
    // isAdded: new NgcFormControl(),
    isSelected: new NgcFormControl()
  });

  /**
   * Creates an instance of ShipmentEmbargoComponent.
   * @memberof ShipmentEmbargoComponent
   */
   constructor(private exportService: ExportService) { }

   /**
   *
   * @memberof ShipmentEmbargoComponent
   */
  ngOnInit() {
    // this.response = [
    //   {
    //     "country": 'AUS',
    //     "flightSector": 'SYD',
    //     "shcGroup": 'PER',
    //     "schCode": 'PER',
    //     "startDate": '14SEP2017',
    //     "endDate": '14SEP2017',
    //     "aircraftType": '777',
    //     "paxOrFrt": 'PAX',
    //     "reason": 'Destination does not allow',
    //     "isSelected": false
    //     // isUpdated: false,
    //     // isAdded: false,
    //   },
    //   {
    //     "country": 'AUS',
    //     "flightSector": 'SYD',
    //     "shcGroup": 'PER',
    //     "schCode": 'PER',
    //     "startDate": '13SEP2017',
    //     "endDate": '13SEP2017',
    //     "aircraftType": '777',
    //     "paxOrFrt": 'PAX',
    //     "reason": 'Destination does not allow',
    //     "isSelected": false
    //     // isUpdated: false,
    //     // isAdded: false,
    //   },
    //   {
    //     "country": 'AUS',
    //     "flightSector": 'SYD',
    //     "shcGroup": 'PER',
    //     "schCode": 'PER',
    //     "startDate": '19SEP2017',
    //     "endDate": '19SEP2017',
    //     "aircraftType": '777',
    //     "paxOrFrt": 'PAX',
    //     "reason": 'Destination does not allow',
    //     "isSelected": false
    //     // isUpdated: false,
    //     // isAdded: false,
    //   },
    //   {
    //     "country": 'AUS',
    //     "flightSector": 'SYD',
    //     "shcGroup": 'PER',
    //     "schCode": 'PER',
    //     "startDate": '23SEP2017',
    //     "endDate": '23SEP2017',
    //     "aircraftType": '777',
    //     "paxOrFrt": 'PAX',
    //     "reason": 'Destination does not allow',
    //     "isSelected": false
    //     // isUpdated: false,
    //     // isAdded: false,
    //   }
    // ];
  }
  onSearchWithCarrier() {
    const request: Embargo = new Embargo();
    request.carrierCode = this.form.controls.carrierCode.value;
    this.exportService.getEmbargoList(request).subscribe( (resp) => {
      this.form.controls.embargoList.patchValue(resp);
    });
  }

  onEditRow(event) {
    this.indexModified = event.record.uid;
    this.addForm.patchValue(this.form.getRawValue().embargoList[this.indexModified]);
    this.addWindow.open();
  }

  onDeleteRows() {
    const formValue = this.form.getRawValue();
    const deleteEmbargoRequest = [];
    for (const eachRow of formValue.embargoList) {
      if (eachRow.isSelected) {
        if (!eachRow.isUpdated && !eachRow.isAdded) { // this statement might be useless (depends on final decision on use case)
          deleteEmbargoRequest.push({
            carrierCode: this.form.controls.carrierCode.value,
            country: eachRow.country,
            flightSector: eachRow.flightSector,
            schCode: eachRow.schCode,
            aircraftType: eachRow.aircraftType
          }); // only primary key (or candidate key) needs to be pushed
        }
        if (this.exportService.deleteEmbargoList(deleteEmbargoRequest)) {
          // if deletion is successful on the back-end, deleteEmbargoRequest is sent as request
          (<NgcFormArray>this.form.controls.embargoList).deleteValue([eachRow]);
        }
      }
    }
  }

  onSave(event) {
    // Maintain two flags, addFlag and updateFlag
    // addFlag and updateFlag will sent as false when the data comes from the back end
    // when clicked on add button, new row will get added and for that row, addFlag will be true
    // when clicked on edit button, that row will get in edit state and for that row, updateFlag will be true
    // before sending it to back end, if addFlag is true then add, else if updateFlag is true then update (give priority to addFlag)
    // add and then update case will be covered by following above
    // if add ==> send an array containing rows with addFlag set to true. Similar for update
    // for delete ==> send an array containing the marked rows with both addUpdate addFlag set to false
    // If the user clicks on save and the save is successful, addFlag and updateFlag of all the existing rows is set to false
    // As per latest discussions, the add and update flag not required.
  }

  onAddRow() {
    this.addForm.reset();
    this.addWindow.open();
  }

  onSaveRow() {
    if (this.indexModified === -1) {
      this.addForm.reset();
      if (this.exportService.addEmbargo(this.addForm.getRawValue())) {
         // if add is successful on backend, this.addForm.getRawValue() sent as request
        (<NgcFormArray>this.form.controls.embargoList).addValue([this.addForm.getRawValue()]);
      }
    } else {
      if (this.exportService.udpateEmbargo(this.addForm.getRawValue())) {
        // if update is successful on backend, this.addForm.getRawValue() sent as request
        (<NgcFormArray>this.form.controls.embargoList).controls[this.indexModified].patchValue(this.addForm.getRawValue());
      }
      this.indexModified = -1;
    }
  }
}
