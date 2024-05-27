import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// NGC framework imports
import {
  NgcPage, NgcFormGroup, NgcFormArray, DateTimeKey,
  NgcUtility, NgcContainerComponent, PageConfiguration, NgcFormControl, NgcWindowComponent
} from 'ngc-framework';
import { EquipmentService } from '../equipment.service';
import { EquipmentRequestByULD, MaintainEquipmentRequestByULD } from '../equipmentsharedmodel';

@Component({
  selector: 'app-maintain-equipment-request-by-uld',
  templateUrl: './maintain-equipment-request-by-uld.component.html',
  styleUrls: ['./maintain-equipment-request-by-uld.component.scss']
})

/* page configuration on page initialization */
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

/* this class is used for all the operations in Maintain mULD Assignment screen */
export class MaintainEquipmentRequestByULDComponent extends NgcPage implements OnInit {
  /* this flag is used to disable the save */
  disableSaveFlag: boolean = false;

  /* this flag is used to disable the grid and the total uldtype and accessory type count */
  showDownSection: boolean = false;

  /* this flag is used to disable the cancel button */
  disableFlag: boolean = false;

  /* this flag is used to disable the approve button */
  approveFlag: boolean = false;

  /* this flag is used to disable the split button */
  splitFlag: boolean = false;

  /* this flag is used to disable the release button */
  releaseFlag: boolean = false;

  /* this flag is used to open the split ,edit and view window */
  showWindow: boolean = false;

  /* this flag is used to open the release window */
  showReleaseWindow: boolean = false;
  /* edit/view/split */
  title: string;
  userName: string;
  staffId: string;
  staffName: string;
  editViewSplitWindowObject: any;
  releaseEirWindowObject: any;
  inputData = null;

  //used to open the editViewSplitDetails window
  @ViewChild('editViewSplitDetails') editViewSplitDetails: NgcWindowComponent;

  //used to open release eir window
  @ViewChild('releaseEirWindow') releaseEirWindow: NgcWindowComponent;


  /* this form  is used for the fields used for the search  operations in Maintain mULD Assignment screen */
  private maintainEquipmentRequestByULDformSearch: NgcFormGroup = new NgcFormGroup({
    muldFromDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), 0, DateTimeKey.MINUTES)),
    muldToDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES)),
    carrierCode: new NgcFormControl(),
    carrierGroup: new NgcFormControl(),
    checkBox: new NgcFormControl(false),
    customerName: new NgcFormControl(),
    truckCompany: new NgcFormControl(),
    iataAgentCode: new NgcFormControl(),
    referenceNumber: new NgcFormControl(),
    truckNumber: new NgcFormControl(),
    requestStatus: new NgcFormControl("PENDING"),
    selectedCheckBox: new NgcFormControl(),
    specialinstruction: new NgcFormControl(),
  });

  /* this form  is used for the fields used for the resulting data from  search  operations in Maintain mULD Assignment screen */
  private maintainEquipmentRequestByULDform: NgcFormGroup = new NgcFormGroup({
    maintainUldList: new NgcFormArray([]),
    uldTypeQuantityInfo: new NgcFormControl(),
    accessoryTypeQuantityInfo: new NgcFormControl(),
  });


  /* constructor for dependency injection */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private equipmentService: EquipmentService) {
    super(appZone, appElement, appContainerElement);
  }

  /* Oninit function */
  ngOnInit() {
    this.disableFlag = true;
    this.disableSaveFlag = true;
    this.splitFlag = true;
    this.releaseFlag = true;
  }

  /* On search : called when search is clicked */
  onSearch() {
    this.showDownSection = false;
    this.resetFormMessages();
    let request = this.maintainEquipmentRequestByULDformSearch.getRawValue();
    this.equipmentService.maintain(request).subscribe(res => {
      if (!this.showResponseErrorMessages(res)) {
        if (res.data) {
          this.showDownSection = true;
          this.maintainEquipmentRequestByULDform.patchValue(res.data);
        }
      }
    });
  }

  /* this method is used to enable or disable carrierGroup whenever checbkox is selected or not selected */
  selectCheckBoxForCarrier(checkbox) {
    if (checkbox) {
      this.maintainEquipmentRequestByULDformSearch.get('carrierCode').reset();
    } else {
      this.maintainEquipmentRequestByULDformSearch.get('carrierGroup').reset();
    }
  }

  /**
  * @param mUldFromDate : fetch uld from date
  * @param mUldToDate : fetch uld to date
  * this method is used to make the to date null when it is lesser than from date
  **/

  fromAndToDateChanges(mUldFromDate, mUldToDate) {
    if (mUldFromDate > mUldToDate) {
      this.maintainEquipmentRequestByULDformSearch.get('muldToDate').patchValue(null);
    }
  }

  /* this method is used to confirm that atleast one checkbox is selected */
  checkBoxSelected() {
    let rows: any[] = this.maintainEquipmentRequestByULDform.getRawValue().maintainUldList.filter((element) => {
      return element.selectedCheckBox;
    });
    return rows.length > 0 ? true : false;
  }

  /* this method is used to disable and enabling of cancel and approve buttons based on the selected checkbox status */
  onSelectCheckBox() {
    this.resetFormMessages();
    this.disableFlag = true;
    this.approveFlag = true;
    this.splitFlag = true;
    this.releaseFlag = true;
    let maintainUldList = (<NgcFormArray>this.maintainEquipmentRequestByULDform.get("maintainUldList")).value;
    for (let index = 0; index < maintainUldList.length; index++) {
      const status = this.maintainEquipmentRequestByULDform.get(['maintainUldList', index]).value;
      if (status.selectedCheckBox == true) {
        if (status.status == "PROCESSED") {
          this.disableFlag = false;
          this.splitFlag = false;
          this.releaseFlag = false;
          this.resetFormMessages();
          return false;
        } else if (status.status == "PENDING") {
          this.approveFlag = false;
          this.resetFormMessages();
          return false;
        } else if (status.status == "PART RELEASED") {
          this.releaseFlag = false;
          this.resetFormMessages();
          return false;
        }
      }
    }
    return true;
  }

  /* this method is used to confirm that single record should be selected */
  onSelectionofSingleRecord() {
    let rows = this.maintainEquipmentRequestByULDform.getRawValue().maintainUldList;
    let count = 0;
    for (let row of rows) {
      if (row.selectedCheckBox) {
        count++
      }
      if (count > 1) {
        return false;
      }
    }
    return true;
  }


  /* this method is used to cancel the selected record */
  onCancelled() {
    this.resetFormMessages();
    if (!this.checkBoxSelected()) {
      this.showErrorStatus('equipment.request.by.uld.selectonerecord');
      return;
    }
    if (this.onSelectCheckBox()) {
      return;
    } else {
      let request: any = new MaintainEquipmentRequestByULD();
      this.showConfirmMessage(NgcUtility.translateMessage("cancel.confirmation.message", [])).then(fulfilled => {
        request.maintainUldList = this.maintainEquipmentRequestByULDform.get(['maintainUldList']).value;
        this.equipmentService.cancel(request).subscribe(data => {
          if (!this.showResponseErrorMessages(data)) {
            this.showSuccessStatus('g.operation.successful');
            this.onSearch();
            this.disableFlag = true;
            this.approveFlag = true;
          } else {
            this.showResponseErrorMessages(data)
          }
        });
      });
    }
  }

  /* this method is used to approve the selected record */
  onApprove() {
    this.resetFormMessages();
    if (!this.checkBoxSelected()) {
      this.showErrorStatus('equipment.request.by.uld.selectonerecord');
      return;
    }
    if (this.onSelectCheckBox()) {
      return;
    } else {
      let request: any = new MaintainEquipmentRequestByULD();
      this.showConfirmMessage(NgcUtility.translateMessage("approve.confirmation.message", [])).then(fulfilled => {
        request.maintainUldList = this.maintainEquipmentRequestByULDform.get(['maintainUldList']).value;
        this.equipmentService.approve(request).subscribe(res => {
          if (!this.showResponseErrorMessages(res)) {
            if (res.success) {
              this.showSuccessStatus('g.operation.successful');
              this.onSearch();
              this.disableFlag = true;
              this.approveFlag = true;
            }
          }
        })
      });
    }
  }

  /* edit/view/split */
  autoSearchAccessoryInfo() {
    this.editViewSplitDetails.close();
    this.onSearch();
  }

  /* this method is used to open the edit window  */
  onEdit(i) {
    this.resetFormMessages();
    this.showWindow = true;
    this.title = "edit.eir.details";
    this.editViewSplitWindowObject = "Edit";
    let equipmentRequestId = this.maintainEquipmentRequestByULDform.get(['maintainUldList', i, 'equipmentRequestId']).value;
    let request: any = new EquipmentRequestByULD();
    request.equipmentRequestId = equipmentRequestId;
    this.equipmentService.fetchEquipmentRequestData(request).subscribe(res => {
      if (!this.showResponseErrorMessages(res)) {
        this.inputData = res.data;

      }
    })
    this.editViewSplitDetails.open();
  }

  /* this method is used to open the view window  */
  onView(i) {
    this.resetFormMessages();
    this.showWindow = true;
    this.title = "view.eir.details";
    this.editViewSplitWindowObject = "View";
    let equipmentRequestId = this.maintainEquipmentRequestByULDform.get(['maintainUldList', i, 'equipmentRequestId']).value;
    let request: any = new EquipmentRequestByULD();
    request.equipmentRequestId = equipmentRequestId;
    this.equipmentService.fetchEquipmentRequestData(request).subscribe(res => {
      if (!this.showResponseErrorMessages(res)) {
        this.inputData = res.data;
      }
    })
    this.editViewSplitDetails.open();
  }

  /* this method is used to open the split window  */
  onSplit() {
    this.resetFormMessages();
    if (!this.checkBoxSelected()) {
      this.showErrorStatus('equipment.request.by.uld.selectonerecord');
      return;
    }
    if (!this.onSelectionofSingleRecord()) {
      this.showErrorStatus('split.eir.cannot.process.more.than.one.record');
      return;
    }
    if (this.onSelectCheckBox()) {
      return;
    } else {
      this.showWindow = true;
      this.title = "split.eir.details";
      this.editViewSplitWindowObject = 'splitEIR';
      let maintainUldList = (<NgcFormArray>this.maintainEquipmentRequestByULDform.get("maintainUldList")).value;
      for (let i = 0; i < maintainUldList.length; i++) {
        const status = this.maintainEquipmentRequestByULDform.get(['maintainUldList', i]).value;
        if (status.selectedCheckBox == true) {
          status.reqContainers = [{
            uldType: null,
            qty: null
          }];
          status.reqAccessory = [{
            accessoryType: null,
            qty: null
          }];
          status.specialinstruction = null;
          this.inputData = status;
        }
      }
      this.editViewSplitDetails.open();
    }
  }

  /* this method is used to delete the selected record  */
  onDelete(index) {
    let request: MaintainEquipmentRequestByULD = (((<NgcFormArray>this.maintainEquipmentRequestByULDform.get("maintainUldList")).getRawValue())[index]);
    this.showConfirmMessage(NgcUtility.translateMessage("delete.confirmation.message", [])).then(fulfilled => {
      this.equipmentService.delete(request).subscribe(res => {
        if (!this.showResponseErrorMessages(res)) {
          if (res.success) {
            this.showSuccessStatus('g.operation.successful');
            this.onSearch();
          }
        }
      })
    })
  }

  //To do when related story- booking truck dock slot is picked
  bookTimeSlot() {
    this.resetFormMessages();
    if (!this.checkBoxSelected()) {
      this.showErrorStatus('equipment.request.by.uld.selectonerecord');
      return;
    } else if (!this.onSelectionofSingleRecord()) {
      this.showErrorStatus('equipment.cannot.select.more.than.one.record');
      return;
    }
    var dataToSend = {
      carrierCode: this.maintainEquipmentRequestByULDformSearch.get('carrierCode'),
      customerName: this.maintainEquipmentRequestByULDformSearch.get('customerName')
    }
    this.navigateHome();
    // it will be uncommented when booking time slot screen will be completed
    // this.navigateTo(this.router, '', dataToSend);
  }

  /* this method is used to relaese eir */
  onRelease() {
    this.resetFormMessages();
    if (!this.checkBoxSelected()) {
      this.showErrorStatus('equipment.request.by.uld.selectonerecord');
      return;
    }
    if (!this.onSelectionofSingleRecord()) {
      this.showErrorStatus('release.eir.cannot.process.more.than.one.record');
      return;
    }
    if (this.onSelectCheckBox()) {
      return;
    } else {
      this.showReleaseWindow = true;
      this.title = "release.eir";
      this.releaseEirWindowObject = 'releaseEIR';
      let maintainUldList = (<NgcFormArray>this.maintainEquipmentRequestByULDform.get("maintainUldList")).value;
      for (let i = 0; i < maintainUldList.length; i++) {
        const status = this.maintainEquipmentRequestByULDform.get(['maintainUldList', i]).value;
        let request: any = new EquipmentRequestByULD();
        if (status.selectedCheckBox == true) {
          request.equipmentRequestId = status.equipmentRequestId;
          this.equipmentService.fetchEquipmentRequestData(request).subscribe(response => {
            if (!this.showResponseErrorMessages(response) && (response.data != null)) {
              this.staffId = this.getUserProfile().userLoginCode;
              this.staffName = this.getUserProfile().userShortName;
              let qty = 0;
              let releaseUld = [];
              let accessoryqty = 0;
              let accessoryUld = [];
              response.data.reqContainers.forEach(element => {
                qty = qty + element.qty;
              });
              for (i = 0; i < qty; i++) {
                releaseUld.push({
                  releaseUldNumber: null
                })
              }
              response.data.reqAccessory.forEach(element => {
                accessoryqty = accessoryqty + element.qty;
              });
              for (i = 0; i < 3; i++) {
                accessoryUld.push({
                  releaseAccessoryType: null,
                  qty: null

                })
              }
              response.data.releaseUldDetails = releaseUld;
              response.data.releaseAccessoryDetails = accessoryUld;
              response.data.staffName = this.staffName;
              response.data.staffId = this.staffId;
              response.data.collDate = NgcUtility.getDateTimeOnly(new Date());
              this.inputData = response.data;
            }
          })
        }
      }
    }
    this.releaseEirWindow.open();
  }

  /* this method is used to close the relaese eir window and call the search method after save is successfull */
  autoSearchReleaseInfo() {
    this.releaseEirWindow.close();
    this.onSearch();
  }

  /* this method is used to close the relaese eir window and call the search method */
  closeWindow() {
    this.releaseEirWindow.close();
    this.onSearch();
  }

  /* this method is used to cancel and navigate back to home page */
  onCancel() {
    this.navigateHome();
  }
}