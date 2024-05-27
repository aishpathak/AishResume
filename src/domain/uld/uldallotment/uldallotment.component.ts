import { Router } from '@angular/router';
import { NgcPage, PageConfiguration, NgcFormGroup, NgcFormControl, NgcFormArray, NgcInputComponent, NgcWindowComponent, ReactiveModel } from 'ngc-framework';
import { Component, OnInit, NgZone, OnDestroy, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { UldService } from '../uld.service';
import { UldAllotmentGroupModel, UldAllotmentListModel, UldAllotmentModel, UldEnquire } from '../uld.shared';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-uldallotment',
  templateUrl: './uldallotment.component.html',
  styleUrls: ['./uldallotment.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true

})


export class UldallotmentComponent extends NgcPage implements OnInit {
  @ViewChild('uldAllotmentGroupWindow') uldAllotmentGroupWindow: NgcWindowComponent;
  @ViewChild('uldAllotmentAddWindow') uldAllotmentAddWindow: NgcWindowComponent;
  showUldAllotment: boolean = true;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router, private uldAllotmentService: UldService) {
    super(appZone, appElement, appContainerElement);
    // this.functionId = "PLAYGROUND";
  }

  ngOnInit() {
    this.searchUldAllotment();
  }

  @ReactiveModel(UldAllotmentModel)
  public uldAllotmentFormGroup: NgcFormGroup;


  @ReactiveModel(UldAllotmentListModel)
  public uldAllotmentEditFormGroup: NgcFormGroup;

  @ReactiveModel(UldAllotmentListModel)
  public uldAllotmentGroupFormGroup: NgcFormGroup;


  searchUldAllotment() {
    if (!this.uldAllotmentFormGroup.valid) {
      return;
    }
    else {
      let request: UldAllotmentModel = this.uldAllotmentFormGroup.getRawValue();
      this.uldAllotmentService.searchUldAllotment(request).subscribe(response => {
        if (response !== null) {
          this.uldAllotmentFormGroup.patchValue(response.data);
        }
      })
    }

  }
  onAddRow() {
    const newRow: UldAllotmentListModel = new UldAllotmentListModel();
    (<NgcFormArray>this.uldAllotmentFormGroup.get(['uldAllotmentList'])).addValue([newRow]);
  }

  onDelete(index) {
    //(<NgcFormArray>this.uldAllotmentFormGroup.get(['uldAllotmentList'])).markAsDeletedAt(index);
    this.showConfirmMessage('uld.uldallotment.deleteconfirm').then(fulfilled => {
      let request: UldAllotmentListModel = (((<NgcFormArray>this.uldAllotmentFormGroup.get("uldAllotmentList")).getRawValue())[index]);
      this.uldAllotmentService.deleteUldAllotment(request).subscribe(response => {
        this.resetFormMessages();
        if (response !== null) {
          if (!this.showResponseErrorMessages(response)) {
            this.uldAllotmentFormGroup.patchValue(response.data);
            this.showSuccessStatus('uld.operation.completed.successfully');
          }
        }
      })
    }).catch(reason => {
    });
  }

  onDeleteUldGroup(index) {
    (<NgcFormArray>this.uldAllotmentGroupFormGroup.get(['uldAllotmentGroupList'])).markAsDeletedAt(index);
  }


  public onAddEditUldAllotment(index): void {
    this.uldAllotmentEditFormGroup.reset();
    this.showUldAllotment = true;
    if (index != undefined) {
      this.uldAllotmentEditFormGroup.patchValue(((<NgcFormArray>this.uldAllotmentFormGroup.get("uldAllotmentList")).getRawValue())[index]);
      this.showUldAllotment = false;

    }
    this.uldAllotmentAddWindow.open();

  }

  onSaveUldAllotment() {
    this.uldAllotmentEditFormGroup.validate();
    if (!this.uldAllotmentEditFormGroup.valid) {
      return;
    }
    else {
      let request: UldAllotmentListModel = this.uldAllotmentEditFormGroup.getRawValue();
      this.uldAllotmentService.saveUldAllotment(request).subscribe(response => {
        this.resetFormMessages();
        if (response !== null) {
          if (!this.showResponseErrorMessages(response)) {
            this.uldAllotmentFormGroup.patchValue(response.data);
            this.uldAllotmentAddWindow.close();
            this.showSuccessStatus('uld.operation.completed.successfully');
          }
        }
      })
    }
  }

  public onUldAllotMentGroup(index): void {
    let uldAllotmentListModel = (<NgcFormArray>this.uldAllotmentFormGroup.get(["uldAllotmentList", index])).getRawValue();
    this.uldAllotmentGroupFormGroup.patchValue(uldAllotmentListModel);
    this.uldAllotmentGroupWindow.open();
  }

  onAddUldGroup() {
    // const newRow: UldAllotmentGroupModel = new UldAllotmentGroupModel();
    //(<NgcFormArray>this.uldAllotmentGroupFormGroup.get(['uldAllotmentGroupList'])).addValue([newRow]);
    const newRow: UldAllotmentGroupModel = new UldAllotmentGroupModel();

    (<NgcFormArray>this.uldAllotmentGroupFormGroup.get(['uldAllotmentGroupList'])).addValue([newRow]);

    let slist: NgcFormArray = (<NgcFormArray>this.uldAllotmentGroupFormGroup.get(['uldAllotmentGroupList']));

    let index: number = 0;

    if (slist != null) {

      index = slist.getSize() - 1;

    }

    this.async(() => {

      (<NgcFormControl>this.uldAllotmentGroupFormGroup.get(["uldAllotmentGroupList", index, "uldAllotmentGroup"])).focus();

    }, 100);

  }

  onSaveUldGroup() {
    this.uldAllotmentGroupFormGroup.validate();
    if (!this.uldAllotmentGroupFormGroup.valid) {
      return;
    }
    else {
      let request: UldAllotmentListModel = this.uldAllotmentGroupFormGroup.getRawValue();
      this.uldAllotmentService.saveUldAllotmentGroup(request).subscribe(response => {
        this.resetFormMessages();
        if (response !== null) {
          if (!this.showResponseErrorMessages(response)) {
            this.uldAllotmentFormGroup.patchValue(response.data);
            this.uldAllotmentGroupWindow.close();
            this.showSuccessStatus('uld.operation.completed.successfully');
          }
        }
      })
    }
  }

}
