
import { Component, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import { NgcFormControl } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcWindowComponent, PageConfiguration, NgcFormGroup, NgcFormArray } from 'ngc-framework';
import { TcsService } from '../tcs.service';

@Component({
	selector: 'app-vehicle-information',
	templateUrl: './vehicle-information.component.html',
	styleUrls: ['./vehicle-information.component.scss']
})

@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true,
	autoBackNavigation: true,
	restorePageOnBack: true
})

export class VehicleInformationComponent extends NgcPage {
	public isSearch: boolean = false;
	showData: boolean = false;
	private vehicleImage: string;
	private unknownRegistration: boolean;

	// Vehicle Information search form
	public vehicleInfoSearchForm: NgcFormGroup = new NgcFormGroup({
		companyId: new NgcFormControl(),
		vehicleNo: new NgcFormControl(),
		vehicleType: new NgcFormControl(),
		active: new NgcFormControl(true),
		natureOfBusiness: new NgcFormControl(),
		associatedId: new NgcFormControl(),
		qrCode: new NgcFormControl()
	});

	// Vehicle Information display comment
	public vehicleInfo: NgcFormGroup = new NgcFormGroup({
		records: new NgcFormArray([])
	});

	// Vehicle Information create/update form
	public vehicleInfoCreateUpdateForm: NgcFormGroup = new NgcFormGroup({
		singleUse: new NgcFormControl(),
		driverName: new NgcFormControl(),
		associatedId: new NgcFormControl(),
		companyId: new NgcFormControl(),
		vehicleId: new NgcFormControl(),
		vehicleNo: new NgcFormControl(),
		vehicleType: new NgcFormControl(),
		phoneNo: new NgcFormControl(),
		notificationPhoneNo: new NgcFormControl(),
		active: new NgcFormControl(true),
		natureOfBusiness: new NgcFormControl(),
		deActiveReason: new NgcFormControl(),
		remarks: new NgcFormControl(),
		bypassGate: new NgcFormControl(),
		bypassGate5And6: new NgcFormControl(),
		allowFreeParking: new NgcFormControl(),
		nonCargoVehicle: new NgcFormControl(),
		setFee: new NgcFormControl(),
		waiveSet: new NgcFormControl(),
		waiveSETReason: new NgcFormControl(),
		tenantGateChargeFee: new NgcFormControl(),
		waiveTenantGateCharge: new NgcFormControl(),
		waiveTenantGateChargeReason: new NgcFormControl(),
		adminFee: new NgcFormControl(),
		acceptAdminFee: new NgcFormControl(),
		vehicleImage: new NgcFormControl()
	});

	// Unknown Vehicle Form
	public unknownVehicleForm: NgcFormGroup = new NgcFormGroup({
		unknownVehicleList: new NgcFormArray([]),
	})

	/**
	 * Initialize
	 * 
	 * @param appZone Ng Zone
	 * @param appElement Element Ref
	 * @param appContainerElement View Container Ref
	 */
	constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
		private activatedRoute: ActivatedRoute, private router: Router, private service: TcsService) {
		//
		super(appZone, appElement, appContainerElement);
	}

	/**
	 * Search Vehicle Information
	 */
	public onSearch() {
		this.showData = false;
		this.vehicleInfoSearchForm.validate()
		//
		if (this.vehicleInfoSearchForm.invalid) {
			return;
		}
		// Reset
		this.vehicleImage = null;
		//
		const request: any = this.vehicleInfoSearchForm.getRawValue();
		// search the vehicle Information
		this.service.searchVehicleInfo(request).subscribe((response) => {
			if (!this.showResponseErrorMessages(response)) {
				this.showData = true;
				this.vehicleInfo.get('records').patchValue(response.data);
			}
		}, error => {
			this.showErrorStatus('Error:' + error);
		});
	}

	/**
	  * Create  registration for unknown vehicle
	  */
	public onRegister(createWindow: NgcWindowComponent, unknownList: NgcWindowComponent, formGroup: NgcFormGroup) {
		if (createWindow) {
			this.vehicleInfoCreateUpdateForm.reset();
			//
			if (unknownList) {
				this.vehicleInfoCreateUpdateForm.get('active').setValue(true);
				this.vehicleInfoCreateUpdateForm.get('vehicleNo').setValue(formGroup.get('vehicleNo').value);
				this.vehicleInfoCreateUpdateForm.get('vehicleImage').setValue(formGroup.get('vehicleImage').value);
			}
			if (formGroup.get('vehicleImage').value) {
				createWindow.width = 1000
			} else {
				createWindow.width = 800;
			}
			this.unknownRegistration = true;
			createWindow.open();
		}
	}

	/**
	 * Create
	 */
	private onCreate(createWindow: NgcWindowComponent) {
		if (createWindow) {
			this.vehicleImage = null;
			this.vehicleInfoCreateUpdateForm.reset();
			//
			this.vehicleInfoCreateUpdateForm.get('active').setValue(true);
			//
			this.unknownRegistration = false;
			createWindow.open();
		}
	}

	/**
	 * Save
	 */
	public onSave(createWindow: NgcWindowComponent) {
		this.vehicleInfoCreateUpdateForm.validate();
		//
		if (this.vehicleInfoCreateUpdateForm.invalid) {
			return;
		}
		const request: any = this.vehicleInfoCreateUpdateForm.getRawValue();
		// Save the vehicle Information
		this.service.saveVehicleInfo(request).subscribe((response) => {
			if (!this.showResponseErrorMessages(response, "save")) {
				createWindow.close();
				this.vehicleImage = null;
				//
				if (!this.unknownRegistration) {
					this.onSearch();
				} else {
					this.search();
				}
				this.showSuccessStatus('g.operation.successful');
			}
		})
	}

	/**
	 *  close the popup
	 */
	public onCancel(window: NgcWindowComponent) {
		if (window) {
			window.close();
		}
	}

	/**
	 * Datatable events 
	 */
	public onDataTableClick(event: any, createWindow: NgcWindowComponent) {
		// Reset
		this.vehicleImage = null;
		//
		if (event && event.type == 'link') {
			if (event.column == 'updateFlag') {
				// Reset
				this.vehicleInfoCreateUpdateForm.reset();
				this.service.findVehicleInfo(event.record).subscribe((response) => {
					if (response && response.data) {
						this.vehicleInfoCreateUpdateForm.patchValue(response.data);
						this.unknownRegistration = false;
						createWindow.open();
					}
				});
			} else if (event.column === 'deleteFlag') {
				this.showConfirmMessage("Do you want to delete the record?").then(fulfilled => {
					this.service.deleteVehicleInfo(event.record).subscribe(response => {
						if (!this.showResponseErrorMessages(response)) {
							// Search Again
							this.onSearch();
							this.showSuccessStatus('g.operation.successful');
						}
					});
				}).catch(response => {
				});
			}
		}
	}

	// unknownVehicleList
	public onUnknownVehicleList(unknownList: NgcWindowComponent) {
		if (unknownList) {
			const request: any = this.vehicleInfoSearchForm.getRawValue();
			//get the unknown vehicle list
			this.service.searchUnknownVehicleList(request).subscribe((response) => {
				if (response.data && response.data.length > 0) {
					(<NgcFormArray>this.unknownVehicleForm.get(['unknownVehicleList'])).patchValue(response.data);
					unknownList.open();
				} else {
					this.showInfoStatus('no.record');
				}
			});
		}
	}

	/**
	 * Show Vehicle Image
	 */
	private onViewImage(imageWindow: NgcWindowComponent, vehicleImage: string) {
		if (imageWindow && vehicleImage) {
			this.vehicleImage = vehicleImage;
			imageWindow.open();
		}
	}

	/**
	 * Map
	 */
	private onMap(formGroup: NgcFormGroup) {
		if (formGroup) {
			formGroup.validate();
			//
			if (formGroup.invalid) {
				return;
			}
			const request: any = formGroup.value;
			// Map
			this.service.mapToVehicleService(request).subscribe((response) => {
				if (!this.showResponseErrorMessages(response)) {
					this.search();
					this.showSuccessStatus('g.operation.successful');
				}
			});
		}
	}

	/**
	 * Search
	 */
	private search() {
		const request: any = this.vehicleInfoSearchForm.getRawValue();
		//
		this.service.searchUnknownVehicleList(request).subscribe((response) => {
			if (response.data) {
				(<NgcFormArray>this.unknownVehicleForm.get(['unknownVehicleList'])).patchValue(response.data);
			}
		});
	}

	/**
	 * On Active
	 */
	private onActive() {
		const active: boolean = this.vehicleInfoCreateUpdateForm.get('active').value;
		//
		if (active) {
			this.vehicleInfoCreateUpdateForm.get('deActiveReason').setValue(null);
		}
	}

	/**
	 * On Waive SET
	 */
	private onWaiveSET() {
		const waiveSet: boolean = this.vehicleInfoCreateUpdateForm.get('waiveSet').value;
		//
		if (!waiveSet) {
			this.vehicleInfoCreateUpdateForm.get('waiveSETReason').setValue(null);
		}
	}

	/**
	 * On Waive Gate Fee
	 */
	private onWaiveGateFee() {
		const waiveGateFee: boolean = this.vehicleInfoCreateUpdateForm.get('waiveTenantGateCharge').value;
		//
		if (!waiveGateFee) {
			this.vehicleInfoCreateUpdateForm.get('waiveTenantGateChargeReason').setValue(null);
		}
	}
}
