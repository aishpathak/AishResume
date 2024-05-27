import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, OnChanges, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TcsService } from '../tcs.service'

import {
	NgcFormGroup, NgcPage,
	PageConfiguration, NgcFormControl
} from 'ngc-framework';
import { Validators } from '@angular/forms';

@Component({
	selector: 'app-assign-truck-dock',
	templateUrl: './assign-truck-dock.component.html',
	styleUrls: ['./assign-truck-dock.component.scss']
})
@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true,
	autoBackNavigation: true,
	restorePageOnBack: true
}) export class AssignTruckDockComponent extends NgcPage {
	//
	private _dockNo: string;
	private _vehicleNo: string;
	public popup: boolean = false;
	//
	private assignTruckDockForm: NgcFormGroup = new NgcFormGroup({
		dockNo: new NgcFormControl(null, Validators.required),
		purpose: new NgcFormControl(),
		vehicleNo: new NgcFormControl(null, [Validators.required, Validators.maxLength(10)]),
		remarks: new NgcFormControl(null, [Validators.maxLength(100), Validators.pattern("^[a-zA-Z0-9\\s]+$")]),
		currentDockNo: new NgcFormControl(),
		banStatus: new NgcFormControl(),
	});

	/**
	 * Initialize
	 * 
	 * @param appZone 
	 * @param appElement 
	 * @param appContainerElement 
	 * @param activatedRoute 
	 * @param router 
	 * @param service 
	 */
	constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
		private activatedRoute: ActivatedRoute, private router: Router, private service: TcsService) {
		super(appZone, appElement, appContainerElement); { }
	}

	/**
	 * Sets Dock No.
	 */
	@Input('dockNo')
	public set dockNo(dockNo: string) {
		if (this._dockNo != dockNo) {
			this._dockNo = dockNo;
			//
			this.assignTruckDockForm.get('dockNo').setValue(this._dockNo);
		}
		this.popup = true;
	}

	/**
	 * Gets Dock No.
	 */
	public get dockNo(): string {
		return this._dockNo;
	}

	/**
	 * Sets Vehicle No.
	 */
	@Input('vehicleNo')
	public set vehicleNo(vehicleNo: string) {
		if (this._vehicleNo != vehicleNo) {
			this._vehicleNo = vehicleNo;
			//Pre Form Validation
			this.assignTruckDockForm.get('vehicleNo').setValue(this._vehicleNo);
			// Search
			this.onVehicleNoChange();
		}
		this.popup = true;
	}

	/**
	 * Gets Vehicle No.
	 */
	public get vehicleNo(): string {
		return this._vehicleNo;
	}

	/**
	 * On Vehicle No. Change
	 */
	public onVehicleNoChange() {
		const request: any = this.assignTruckDockForm.value;
		// Reset
		this.assignTruckDockForm.get('purpose').setValue(null);
		this.assignTruckDockForm.get('currentDockNo').setValue(null);
		// Get Vehicle Info
		this.service.assignDockGetVehicleInfo(request).subscribe((response) => {
			if (response) {
				// setting values from response

				if (!this.refreshFormMessages(response)) {
					this.assignTruckDockForm.get('purpose').setValue(response.data.purpose);
					this.assignTruckDockForm.get('currentDockNo').setValue(response.data.currentDockNo);
					this.assignTruckDockForm.get('banStatus').setValue(response.data.banStatus);
				}
			}
		}, error => {
			this.showErrorMessage(error)
		});
	}

	// Method to Assign Truck Dock
	public onSave(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			const request: any = this.assignTruckDockForm.value;
			// Pre form Validation
			this.assignTruckDockForm.validate();
			//when validation fails
			if (this.assignTruckDockForm.invalid) {
				return;
			}
			if (this.assignTruckDockForm.get('banStatus').value == true) {
				this.showConfirmMessage('Vehicle.is.Banned').then(() => {
					this.checkDockAndAllocate(request, resolve);
				})
			}
			else {
				this.checkDockAndAllocate(request, resolve);
			}
		});
	}
	//Check wheater Dock is already allocated
	private checkDockAndAllocate(request: any, resolve: (value: boolean | PromiseLike<boolean>) => void) {
		if (this.assignTruckDockForm.get('dockNo').value != this.assignTruckDockForm.get('currentDockNo').value &&
			this.assignTruckDockForm.get('currentDockNo').value != null) {
			this.showConfirmMessage('Dock.is.already.allocated').then(() => {
				this.assignDock(request, resolve);
			})
		}
		if (this.assignTruckDockForm.get('currentDockNo').value == null) {
			this.assignDock(request, resolve);
		}
	}
	//Save data
	private assignDock(request: any, resolve: (value: boolean | PromiseLike<boolean>) => void) {
		this.service.assignTruckDock(request).subscribe((response) => {
			if (response) {
				if (!this.refreshFormMessages(response)) {
					this.showSuccessStatus("g.operation.successful");
					resolve(true);
				}
			}
		}, error => {
			this.showErrorMessage(error);
		});
	}

	/**
	 * Reset Value
	 */
	public resetValue(): void {
		this.assignTruckDockForm.reset();
		this.assignTruckDockForm.get('currentDockNo').setValue(this._dockNo);
		this.assignTruckDockForm.get('vehicleNo').setValue(this._vehicleNo);
		this.assignTruckDockForm.clearErrors();
		this.assignTruckDockForm.markAsPristine();
	}
}




