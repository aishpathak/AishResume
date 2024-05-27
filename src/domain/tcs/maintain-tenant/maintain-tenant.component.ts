import { Component, NgZone, ElementRef, ViewContainerRef, OnChanges, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Application
import {
	NgcPage, StatusMessage, PageConfiguration, NgcUtility,
	NgcFormGroup, NgcFormArray, NgcFormControl,
	NgcWindowComponent
} from 'ngc-framework';
import { MaintainTenantModel, MaintainTenantSearch } from '../tcs.sharedmodel';
import { TcsService } from '../tcs.service'

@Component({
	selector: 'app-maintain-tenant',
	templateUrl: './maintain-tenant.component.html',
	styleUrls: ['./maintain-tenant.component.scss']
})
@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true
})
export class MaintainTenantComponent extends NgcPage {
	//
	public isSearch: boolean = false;
	/**
	 * maintainTenantForm
	 */
	public maintainTenantForm: NgcFormGroup = new NgcFormGroup({
		search: new NgcFormGroup({
			companyId: new NgcFormControl(),
			records: new NgcFormArray([])
		}),
		/**
		 *  Create Info
		 */
		createInfo: new NgcFormGroup({
			tcsTenantId: new NgcFormControl(),
			companyId: new NgcFormControl(null, Validators.required),
			dockPoolSize: new NgcFormControl(null, [Validators.min(1), Validators.required]),
			parkPoolSize: new NgcFormControl(null, [Validators.min(1), Validators.required]),
			gateChargeRequired: new NgcFormControl(false),
			autoEnqueueRequired: new NgcFormControl(false),
			parkOverlapMinute: new NgcFormControl(null, [Validators.min(1), Validators.required]),
			parkOverlapSize: new NgcFormControl(null, [Validators.min(1), Validators.required]),
			docks: new NgcFormControl(null, Validators.required),
			vehicleNos: new NgcFormControl()
		}),
		/**
		 *  Update Info
		 */
		updateInfo: new NgcFormGroup({
			tcsTenantId: new NgcFormControl(),
			companyId: new NgcFormControl(),
			dockPoolSize: new NgcFormControl(null, [Validators.min(1), Validators.required]),
			parkPoolSize: new NgcFormControl(null, [Validators.min(1), Validators.required]),
			gateChargeRequired: new NgcFormControl(),
			autoEnqueueRequired: new NgcFormControl(),
			parkOverlapMinute: new NgcFormControl(null, [Validators.min(1), Validators.required]),
			parkOverlapSize: new NgcFormControl(null, [Validators.min(1), Validators.required]),
			docks: new NgcFormControl(null, Validators.required),
			modifiedBy: new NgcFormControl(),
			modifiedDate: new NgcFormControl(),
			vehicleNos: new NgcFormControl()
		})
	});

	constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
		private activatedRoute: ActivatedRoute, private router: Router, private service: TcsService) {
		//
		super(appZone, appElement, appContainerElement);
	}

	/**
	 * On Search
	 */
	public onSearch() {
		let searchGroup: NgcFormGroup = (this.maintainTenantForm.get('search') as NgcFormGroup);
		//
		searchGroup.validate();
		//
		if (searchGroup.invalid) {
			return;
		}
		let request: MaintainTenantSearch = searchGroup.getRawValue();
		//
		(<NgcFormArray>this.maintainTenantForm.get('search.records')).resetValue([]);
		//
		this.service.searchMaintainTenant(request).subscribe((response) => {
			if (!this.showResponseErrorMessages(response, null, "search")) {
				if (response.data && response.data.length > 0) {
					this.isSearch = true;
					this.maintainTenantForm.get('search.records').patchValue(response.data);
				} else {
					this.isSearch = false;
					this.showInfoStatus("no.record");
				}
			}
		})
	}

	/**
	 * On Create Click
	 */
	public onCreate(createWindow: NgcWindowComponent) {
		if (createWindow) {
			(this.maintainTenantForm.get('createInfo') as NgcFormGroup).reset();
			createWindow.open();
		}
	}

	/**
	 * Create
	 */
	public onCreateSave(createWindow: NgcWindowComponent) {
		this.validate(true);
		//
		if (this.maintainTenantForm.get('createInfo').invalid) {
			return;
		}
		const request: MaintainTenantModel = (this.maintainTenantForm.get('createInfo') as NgcFormGroup).getRawValue();
		//
		this.service.createMaintainTenant(request).subscribe((response) => {
			if (!this.showResponseErrorMessages(response, null, "createInfo")) {
				this.showSuccessStatus("g.operation.successful");
				createWindow.close();
				// Search Again
				if (this.isSearch) {
					this.onSearch();
				}
			}
		});
	}

	/**
	 * Find for Update
	 */
	public findMaintainTenant(request: any, updateWindow: NgcWindowComponent) {
		if (updateWindow) {
			this.service.findMaintainTenant(request).subscribe((response) => {
				if (response && response.data) {
					(this.maintainTenantForm.get('updateInfo') as NgcFormGroup).patchValue(response.data);
					updateWindow.open();
				}
			});
		}
	}

	/**
	 *  Update
	 */
	public onUpdateSave(updateWindow: NgcWindowComponent) {
		this.validate(false);
		//
		if (this.maintainTenantForm.get('updateInfo').invalid) {
			return;
		}
		const request: any = (this.maintainTenantForm.get('updateInfo') as NgcFormGroup).getRawValue();
		//
		this.service.updateMaintainTenant(request).subscribe((response) => {
			if (!this.showResponseErrorMessages(response, null, "updateInfo")) {
				this.showSuccessStatus("g.operation.successful");
				updateWindow.close();
				// Search Again
				this.onSearch();
			}
		})
	}


	//
	public onDataTableClick(event: any, updateWindow: NgcWindowComponent) {
		if (event && event.type == 'link') {
			if (event.column == 'update') {
				this.findMaintainTenant(event.record, updateWindow);
			}
		}
		if (event && event.type == 'link') {
			if (event.column === 'delete') {
				this.deleteTenant(event.record);
			}
		}
	}


	//
	private deleteTenant(request: any) {
		this.service.deleteMaintainTenant(request).subscribe((response) => {
			if (!this.showResponseErrorMessages(response, null, "search")) {
				this.showSuccessStatus("g.operation.successful");
				// Search Again
				this.onSearch();
			}
		});
	}


	//
	public onCancel(window: NgcWindowComponent) {
		if (window) {
			window.close();
		}
	}

	/**
	 * On Dock Change
	 * 
	 * @param create Create?
	 */
	public validate(create: boolean) {
		let formGroup: NgcFormGroup = null;
		//
		if (create) {
			formGroup = this.maintainTenantForm.get('createInfo') as NgcFormGroup;
		} else {
			formGroup = this.maintainTenantForm.get('updateInfo') as NgcFormGroup;
		}
		// Validate
		formGroup.validate();
		//
		const dockPoolSize: number = formGroup.get('dockPoolSize').value;
		const docks: string[] = formGroup.get('docks').value;
		//
		if (dockPoolSize < docks.length) {
			this.showFormControlErrorMessage(formGroup.get('docks') as NgcFormControl, 'err.moreThanPool');
		}
	}

}
