import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcInputComponent, NgcUtility,
  NgcWindowComponent, NgcContainerComponent, PageConfiguration, NgcReportComponent
} from 'ngc-framework';
import { Router, ActivatedRoute } from '@angular/router';
import { ImportService } from '../import.service';
import { maintainScheduleCollectionSearch, maintainScheduleCollectionSave, } from '../import.sharedmodel';


@Component({
  selector: 'app-maintain-schedule-collection-master',
  templateUrl: './maintain-schedule-collection-master.component.html',
  styleUrls: ['./maintain-schedule-collection-master.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class MaintainScheduleCollectionMasterComponent extends NgcPage implements OnInit {

  /* Flags */
  maintainScheduleEntryData: any = [];
  showData: boolean = false;
  windowFlag: boolean = false;
  printFlag: boolean = false;
  displayData: boolean;
  saveResponse: any;
  editedTrue: boolean = false;

  /* Form : that contain the search parameters */
  private maintainScheduleSearch = new NgcFormGroup({
    customerName: new NgcFormControl(),
    customerNo: new NgcFormControl(),
    iataCode: new NgcFormControl(),
    maintainScheduleEntryData: new NgcFormArray([]),

  });
  private maintainSchedulePopUp = new NgcFormGroup({
    scheduledCollectionTimeSlotConfigId: new NgcFormControl(),
    customerName: new NgcFormControl(),
    customerNo: new NgcFormControl(),
    iataCode: new NgcFormControl(),
    truckDock: new NgcFormControl(),
    fromTime: new NgcFormControl(),
    toTime: new NgcFormControl(),
    isAll: new NgcFormControl(),
    isMon: new NgcFormControl(),
    isTue: new NgcFormControl(),
    isWed: new NgcFormControl(),
    isThu: new NgcFormControl(),
    isFri: new NgcFormControl(),
    isSat: new NgcFormControl(),
    isSun: new NgcFormControl(),
    remarks: new NgcFormControl(),

  });


  /* Window component - Adding records in the Pop up */
  @ViewChild("maintainScheduleRecordWindow") maintainScheduleRecordWindow: NgcWindowComponent;
  @ViewChild("maintainScheduleEditWindow") maintainScheduleEditWindow: NgcWindowComponent;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }


  ngOnInit() {
    //this.onSearch();
  }




  onSearch() {
    let search: maintainScheduleCollectionSearch = new maintainScheduleCollectionSearch();

    this.showData = false;
    this.maintainScheduleSearch.validate();
    if (this.maintainScheduleSearch.invalid) {
      this.showErrorStatus('g.fill.all.details');
      return;
    }
    this.printFlag = true;
    search.customerName = this.maintainScheduleSearch.get('customerName').value;
    search.customerNo = this.maintainScheduleSearch.get('customerNo').value;
    search.iataCode = this.maintainScheduleSearch.get('iataCode').value;
    // this.importService.fetchmaintainScheduleCollection(search).subscribe(data => {
    //   this.refreshFormMessages(data);
    //   this.maintainScheduleEntryData = data.data;
    //   if (this.maintainScheduleEntryData && this.maintainScheduleEntryData.length > 0) {
    //     this.showData = true;
    //     this.maintainScheduleSearch.get('maintainScheduleEntryData').patchValue(this.maintainScheduleEntryData);
    //   } else {
    //     this.showErrorMessage('CUST002');
    //   }
    // })
  }


  /* on click of add button on the screen - pop up will open */
  onAdd() {
    this.resetFormMessages();
    this.windowFlag = true;
    this.maintainSchedulePopUp.reset();
    this.maintainScheduleRecordWindow.open();
  }

  /* close window method */
  onCloseWindow() {
    this.windowFlag = false;
    this.maintainSchedulePopUp.reset();
    this.editedTrue = false;
  }



  onSavePopUp(event) {

    let save: maintainScheduleCollectionSave = new maintainScheduleCollectionSave();
    if (this.maintainSchedulePopUp.invalid) {
      this.showErrorStatus('g.fill.all.details');
      return;
    }
    save = this.maintainSchedulePopUp.getRawValue();
    if ((save.isMon == null || save.isMon == false) &&
      (save.isTue == null || save.isTue == false) &&
      (save.isWed == null || save.isWed == false) &&
      (save.isThu == null || save.isThu == false) &&
      (save.isFri == null || save.isFri == false) &&
      (save.isSat == null || save.isSat == false) &&
      (save.isSun == null || save.isSun == false)) {
      this.showErrorStatus('import.select.Day Frequency');
      return;
    }
    // this.importService.saveMaintainSchedule(save).subscribe(data => {
    //   this.refreshFormMessages(data);
    //   this.saveResponse = data.data
    //   if (!this.showResponseErrorMessages(data)) {
    //     this.showSuccessStatus("g.completed.successfully");
    //     //calling Search method on successfull insertion
    //     this.onSearch();
    //     this.maintainScheduleEditWindow.close();
    //     this.maintainScheduleRecordWindow.close();

    //   }
    // });

  }
  onClick(event) {
    if (event.column == 8) {
      this.openEdit(event.record);
    } else if (event.column == 9) {
      this.onDelete(event.record);
    }

  }

  openEdit(data1) {
    let data = this.maintainScheduleSearch.get('maintainScheduleEntryData').value;
    this.editedTrue = true;
    if (this.maintainSchedulePopUp.invalid) {
      this.showErrorStatus('g.fill.all.details');
      return;
    }

    let redata = {};
    data.forEach((obj: any) => {
      if (obj.scheduledCollectionTimeSlotConfigId == data1.scheduledCollectionTimeSlotConfigId) {
        redata = obj;
        return;
      }
    });

    this.maintainSchedulePopUp.patchValue(redata);
    this.windowFlag = true;
    this.maintainScheduleEditWindow.open();


  }


  onDelete(data1) {
    let data = this.maintainScheduleSearch.get('maintainScheduleEntryData').value;
    let redata = {};
    data.forEach((obj: any) => {
      if (obj.scheduledCollectionTimeSlotConfigId == data1.scheduledCollectionTimeSlotConfigId) {
        redata = obj;
        return;
      }
    });
    // this.showConfirmMessage('import.are.You.Sure.To.Delete').then(fulfilled => {
    //   this.importService.deleteMaintainSchedule(redata).subscribe(response => {
    //     this.resetFormMessages();
    //     if (response !== null) {
    //       if (!this.showResponseErrorMessages(response)) {
    //         this.showSuccessStatus('g.deleted.successfully');
    //         this.onSearch();
    //       }
    //     }
    //   })
    // }).catch(reason => {
    // });
  }

  onSelectAll(event) {
    if (event) {
      this.maintainSchedulePopUp.get("isMon").setValue(true);
      this.maintainSchedulePopUp.get("isTue").setValue(true);
      this.maintainSchedulePopUp.get("isWed").setValue(true);
      this.maintainSchedulePopUp.get("isThu").setValue(true);
      this.maintainSchedulePopUp.get("isFri").setValue(true);
      this.maintainSchedulePopUp.get("isSat").setValue(true);
      this.maintainSchedulePopUp.get("isSun").setValue(true);
    } else {

      this.maintainSchedulePopUp.get("isMon").setValue(false);
      this.maintainSchedulePopUp.get("isTue").setValue(false);
      this.maintainSchedulePopUp.get("isWed").setValue(false);
      this.maintainSchedulePopUp.get("isThu").setValue(false);
      this.maintainSchedulePopUp.get("isFri").setValue(false);
      this.maintainSchedulePopUp.get("isSat").setValue(false);
      this.maintainSchedulePopUp.get("isSun").setValue(false);

    }

  }
  onCompanyNameLOVSelect(event) {
    this.maintainSchedulePopUp.get("customerNo").setValue(event.code);
    this.maintainSchedulePopUp.get("iataCode").setValue(event.param3);
  }
  onCustomerNameLOVSelect(event) {
    this.maintainScheduleSearch.get("customerNo").setValue(event.code);
    this.maintainScheduleSearch.get("iataCode").setValue(event.param3);
  }
  Onchange() {
    this.showData = false;
  }

}