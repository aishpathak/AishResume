import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, NgcWindowComponent, NgcDropDownComponent, NgcDropDownListComponent, PageConfiguration
} from 'ngc-framework';

import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, OnInit, ViewChild, OnDestroy
} from '@angular/core';

import { LocationConfigResultBO, PigeonHoleLocationFlightMapping } from './../../document/document.sharedmodel';
import { DocumentService } from './../../document/document.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-locationconfiguration',
  templateUrl: './locationconfiguration.component.html',
  styleUrls: ['./locationconfiguration.component.css']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class LocationconfigurationComponent extends NgcPage implements OnInit, OnDestroy {
  deleteObj: NgcFormGroup;
  pigeonHoleList: any;
  resp: any;
  responseArray: any[];
  previousRoute: any;

  @ViewChild('window') window: NgcWindowComponent;
  @ViewChild('locationTypeDropDown') locationTypeDropDown: NgcDropDownListComponent;
  @ViewChild('locationTypeDropDownInWindow') locationTypeDropDownInWindow: NgcDropDownListComponent;

  private form: NgcFormGroup = new NgcFormGroup({
    sNo: new NgcFormControl(),
    documentOfficeDropDown: new NgcFormControl(),
    locationTypeDropDown: new NgcFormControl(),
    LocationTypeInWindow: new NgcFormControl(),
    locDesc: new NgcFormControl(),
    type: new NgcFormControl(),
    locationId: new NgcFormControl(),
    locationName: new NgcFormControl(),
    locationCode: new NgcFormControl(),
    regionId: new NgcFormControl(),
    regionNameInWindow: new NgcFormControl(),
    carrier: new NgcFormControl(),
    locationconfigId: new NgcFormControl(),
    destination: new NgcFormControl(),
    flightno: new NgcFormControl(),
    flightId: new NgcFormControl(),
    locationTypeDropDownInWindow: new NgcFormControl(),
    locationdropdown: new NgcFormControl(),
    locdisplay: new NgcFormControl(),
    locationId1: new NgcFormControl(),
    locationDesc: new NgcFormControl(),
    dispDeviceId: new NgcFormControl(),
    officeId: new NgcFormControl(),
    resultListPopup: new NgcFormArray([]),
    resultList: new NgcFormArray([]),
    PigeonHoleLocationFlightMapping: new NgcFormArray([]),
  });

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private documentService: DocumentService, private router: Router) {
    super(appZone, appElement, appContainerElement);
    this.previousRoute = sessionStorage.getItem('previousRoute');
    sessionStorage.setItem('previousRoute', this.router.url);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  OnSearch() {
    (<NgcFormArray>this.form.controls['resultList']).resetValue([]);
    this.resetFormMessages();

    if (this.form.get('documentOfficeDropDown').value === null) {
      this.showErrorStatus("export.select.document.office.to.search");
      return;
    }

    let locConfig: LocationConfigResultBO = new LocationConfigResultBO();
    locConfig.officeId = this.form.get('documentOfficeDropDown').value;
    locConfig.type = this.form.get('locationTypeDropDown').value;
    this.form.controls['LocationTypeInWindow'].setValue(locConfig.type);
    this.documentService.getLocationConfigDetails(locConfig).subscribe(responseBean => {
      this.resp = responseBean.data;
      this.responseArray = this.resp;
      if (this.responseArray != null && this.responseArray.length > 0) {
        // this.showtable = true;
        this.editFunction();
        this.form.controls['resultList'].patchValue(this.responseArray);
      }
      else {
        this.showInfoStatus("export.no.records.found.with.search.criteria")
        // this.showtable = false;
      }
    }, error => {
      this.showErrorStatus(error);
      // this.showtable = false;
    }
    );
  }

  onEdit(event) {
    (this.form.controls['resultListPopup'] as NgcFormArray).resetValue([]);
    (this.form.controls['PigeonHoleLocationFlightMapping'] as NgcFormArray).resetValue([]);
    let locConfig: LocationConfigResultBO = new LocationConfigResultBO();
    locConfig.locationId = this.form.get('locationId').value;
    // if (this.form.get('locationTypeDropDownInWindow').value === "Flight") {
    //   this.documentService.getLocationConfigEditForFlightMapping(locConfig).subscribe(pigeonHole => {
    this.documentService.getLocationConfigEdit(locConfig).subscribe(responseBean => {
      this.resp = responseBean.data;
      this.responseArray = this.resp;
      if (this.responseArray != null && this.responseArray.length > 0) {
        this.editFunction();
        this.form.controls['resultListPopup'].patchValue(this.responseArray);
      }
    }, error => { this.showErrorStatus(error); }
    );
    // }
  }

  public editFunction() {
    for (let index = 0; index < this.responseArray.length; index++) {
      this.responseArray[index]['edit'] = 'EDIT';
      this.responseArray[index]['sno'] = index + 1;
    }
  }

  public onEditPigeonHoleLocation(event) {
    this.form.get('officeId').setValue(this.getOffice(this.form.get('documentOfficeDropDown').value));
    this.form.get('locationTypeDropDownInWindow').setValue(this.form.get('locationTypeDropDown').value);
    this.window.open();
    this.form.get('locationId').setValue(event.record.locationId);
    this.form.controls['regionNameInWindow'].setValue(event.record.regionName);
    this.form.controls['locationCode'].setValue(event.record.locationCode);
    this.form.controls['locationName'].setValue(event.record.locationName);
    this.form.controls['locDesc'].setValue(event.record.locDesc);
    this.form.controls['dispDeviceId'].setValue(event.record.dispDeviceId);
    this.form.controls['locationTypeDropDownInWindow'].setValue(event.record.type);
    this.onEdit(event);
  }

  public addRow(event) {
    //this.form.get('locdisplay').setValue(this.form.get('locationId1').value);
    (<NgcFormArray>this.form.get(["resultListPopup"])).addValue([
      {
        carrier: null,
        destination: null,
        flightno: null
      }
    ]);
  }

  public getOffice(officeId) {
    if (officeId == 1) {
      return 'T3';
    } else if (officeId == 2) {
      return 'T5';
    }
  }

  cancelWindow() {
    this.showConfirmMessage("export.cancel.before.location.details.update.confirmation")
      .then(fulfilled => {
        this.window.hide();
      }).catch(reason => {
      });
  }

  updateLocation(event) {
    if ((this.form.get('locationTypeDropDownInWindow').value === null) || (this.form.get('locationName').value === null)) {
      this.showErrorStatus("export.location.type.name.mandatory");
      return;
    }
    let request: LocationConfigResultBO = new LocationConfigResultBO();
    request.type = this.form.get('locationTypeDropDownInWindow').value;
    request.locationName = this.form.get('locationName').value;
    request.locDesc = this.form.get('locDesc').value;
    request.locationId = this.form.get('locationId').value;
    request.dispDeviceId = this.form.get('dispDeviceId').value;
    request.officeId = this.form.get('documentOfficeDropDown').value;
    request.officeName = this.form.get('officeId').value;
    request.regionName = this.form.get('regionNameInWindow').value;
    request.locationCode = this.form.get('locationCode').value;
   
    this.documentService.updateLocation(request).subscribe(responseBean => {
      this.OnSearch();
      this.showSuccessStatus("export.location.updated.successfully");
      this.form.get('dispDeviceId').setValue(request.dispDeviceId);
      this.window.hide();
    }, error => { this.showErrorStatus("export.error.while.updating.data"); }
    );
    // }
  }

  deleteLocationRow(index) {
    (this.form.get(["resultListPopup", index]) as NgcFormGroup).markAsDeleted();
  }

  saveData() {
    this.resetFormMessages();
    let request: any = (this.form.get(['resultListPopup']) as NgcFormArray).getRawValue();

    if (request.length <= 0) {
      this.showErrorStatus("export.add.atleast.one.flight.details")
      return;
    }
    else if (this.checkEmptyRecords() > 0) {
      this.showErrorStatus("export.empty.records.not.allowed");
      return;
    }
    else {
      if (request != null && request.length > 0) {
        request.forEach(
          (location) => {
            location.locationId = this.form.get('locationId').value;
            location.locationCode = this.form.get('locationCode').value;
            location.officeName = this.form.get('officeId').value;
            location.regionName = this.form.get('regionNameInWindow').value;
            location.type = this.form.get('LocationTypeInWindow').value;
          }
        )
      }

      this.documentService.SaveLocationConfigEdit(request).subscribe(responseBean => {
        let locConfig: LocationConfigResultBO = new LocationConfigResultBO();
        locConfig.locationId = this.form.get('locationId').value;
        if (!this.refreshFormMessages(responseBean)) {
          this.onEdit(event);
          this.showSuccessStatus("export.details.updated.successfully");
        }
      }, error => { this.showErrorStatus(error); }
      );
    }
  }

  checkEmptyRecords() {
    let count = 0;
    (this.form.get(["resultListPopup"]) as NgcFormArray).controls.forEach(
      (element: any, index: any) => {
        if ((element.get('carrier').value === null || element.get('carrier').value === "")
          && (element.get('flightno').value === null || element.get('flightno').value === "")
          && (element.get('destination').value === null || element.get('destination').value === "")
          && element.get('flagCRUD').value == 'C'
        ) {
          count++;
        }
      }
    );
    return count;
  }

  fltNumMasking(controls, index) {
    let maskedFltNum = this.documentService.fltNumMasking(controls.flightno.value);
    if (maskedFltNum == "0000" || maskedFltNum == "00000") {
      (this.form.get(["resultListPopup", index, 'flightno']) as NgcFormControl).setValue('');
    }
    else {
      (this.form.get(["resultListPopup", index, 'flightno']) as NgcFormControl).setValue(maskedFltNum);
    }
  }


}

