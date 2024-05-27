import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, ReactiveModel, NgcFormGroup, PageConfiguration, NgcFormArray, NgcWindowComponent, NgcUtility } from 'ngc-framework';
import { ReportsService } from '../reports.service';
import { ServiceStandardMaintenanceInformationModel, ServiceStandardMaintenanceModel } from '../reports.sharedmodel';

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})

@Component({
  selector: 'app-service-standard-maintenance',
  templateUrl: './service-standard-maintenance.component.html',
  styleUrls: ['./service-standard-maintenance.component.scss']
})
export class ServiceStandardMaintenanceComponent extends NgcPage {

  /**
   * Popup window component for create and editing Service Standard Maintenance Info
   */
  @ViewChild('ServiceStandardMaintenanceInfoWindow') serviceStandardMaintenanceInfoWindow: NgcWindowComponent;

  /*
  * search Reactive Form
  */
  @ReactiveModel(ServiceStandardMaintenanceModel)
  public searchFormGroup: NgcFormGroup;

  /*
  * search result Reactive Form
  */
  @ReactiveModel(ServiceStandardMaintenanceModel)
  public serviceStandardMaintenanceFormGroup: NgcFormGroup;

  /*
  * Popup Window Reactive Form
  */
  @ReactiveModel(ServiceStandardMaintenanceInformationModel)
  public serviceStandardMaintenanceInfoFormGroup: NgcFormGroup;

  /**
   * displayFlag is meant to hide/unhide the result section
   */
  public displayFlag = false;

  constructor(private router: Router, appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private changeDetectorRef: ChangeDetectorRef, private activatedRoute: ActivatedRoute,
    private reportsService: ReportsService) {
    super(appZone, appElement, appContainerElement);
  }

  /**
   * Method that executed on launch of the screen.
   */
  ngOnInit() {
    this.onSearch();
  }

  /**
   * Method to Handle Event changes of controls in Search section
   */
  onSearchChange() {
    if (this.displayFlag) {
      this.resetFormMessages();
      this.displayFlag = false;
      this.resetServiceStandardMaintenanceFormGroup();
    }
  }

  /**
   * Method to populate the Search Results in the screen
   */
  onSearch() {
    this.resetFormMessages();
    this.searchFormGroup.validate();
    if (!this.searchFormGroup.valid) {
      return;
    }
    this.displayFlag = false;
    this.resetServiceStandardMaintenanceFormGroup();
    let request: ServiceStandardMaintenanceModel = this.searchFormGroup.getRawValue();
    this.reportsService.getServiceStandardMaintenanceInfo(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.displayFlag = true;
        this.serviceStandardMaintenanceFormGroup.patchValue(response.data);
      }
    });
  }

  /**
   * Method to delete the selected records by making Backend API call.
   */
  onDelete() {
    this.showConfirmMessage('admin.delete.selected.records.confirmation').then(fulfilled => {
      this.resetFormMessages();
      let request: ServiceStandardMaintenanceModel = this.serviceStandardMaintenanceFormGroup.getRawValue();
      this.reportsService.deleteServiceStandardMaintenanceInfo(request).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.serviceStandardMaintenanceFormGroup.patchValue(response.data);
        }
      });
    }).catch(reason => {
    });
  }

  /**
   * Method to Delete the Selected row
   */
  onDeleteRow(index) {
    this.showConfirmMessage('edi.delete.record.confirmation').then(fulfilled => {
      this.resetFormMessages();
      let request: ServiceStandardMaintenanceModel = new ServiceStandardMaintenanceModel();
      request.serviceStandardMaintenanceInformation = [(<Array<ServiceStandardMaintenanceInformationModel>>this.serviceStandardMaintenanceFormGroup.get('serviceStandardMaintenanceInformation').value)[index]];
      request.serviceStandardMaintenanceInformation[0].select = true;
      this.reportsService.deleteServiceStandardMaintenanceInfo(request).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.serviceStandardMaintenanceFormGroup.patchValue(response.data);
        }
      });
    }).catch(reason => {
    });
  }

  /**
   * Method to open the Service Standard Maintenance Info Popup Window and create new record
   */
  onCreate() {
    this.serviceStandardMaintenanceInfoWindow.open();
  }

  /**
   * Method to Open the Service Standard Maintenance Info Popup Window and edit the existing record
   */
  onEdit(index) {
    this.serviceStandardMaintenanceInfoFormGroup.patchValue(this.serviceStandardMaintenanceFormGroup.get(['serviceStandardMaintenanceInformation', index]).value);
    this.serviceStandardMaintenanceInfoWindow.open();
  }

  /**
   * Method To handle Save button in Standard Maintenance Info Popup window.
   * In this method API call is made to the service to insert/update the data. 
   */
  onClickSave() {
    this.resetFormMessages();
    this.serviceStandardMaintenanceInfoFormGroup.validate();
    if (!this.serviceStandardMaintenanceInfoFormGroup.valid) {
      return;
    }
    let request: ServiceStandardMaintenanceInformationModel = this.serviceStandardMaintenanceInfoFormGroup.getRawValue();
    this.reportsService.saveServiceStandardMaintenanceInfo(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.displayFlag = true;
        this.serviceStandardMaintenanceFormGroup.patchValue(response.data);
        this.serviceStandardMaintenanceInfoWindow.close();
      }
    });
  }

  /**
   * Method To handle cancel button in Standard Maintenance Info Popup window
   */
  onClickCancel() {
    this.serviceStandardMaintenanceInfoWindow.close();
  }

  /* 
   * On Popup window close
   */
  onCloseWindow() {
    this.resetServiceStandardMaintenanceInfoFormGroup();
  }

  /**
   * Mehtod returns true if atlease 1 row is selected
   */
  isRowSelected() {
    return (<Array<ServiceStandardMaintenanceInformationModel>>this.serviceStandardMaintenanceFormGroup.get('serviceStandardMaintenanceInformation').value).some(obj => obj.select);
  }

  /**
   * Common utility method to reset the serviceStandardMaintenanceInfoFormGroup form
   */
  private resetServiceStandardMaintenanceFormGroup() {
    (<NgcFormArray>this.serviceStandardMaintenanceFormGroup.get('serviceStandardMaintenanceInformation')).patchValue([]);
    this.serviceStandardMaintenanceFormGroup.reset();
  }

  /**
   * Common utility method to reset the serviceStandardMaintenanceFormGroup form
   */
  private resetServiceStandardMaintenanceInfoFormGroup() {
    this.serviceStandardMaintenanceInfoFormGroup.reset();
  }
}