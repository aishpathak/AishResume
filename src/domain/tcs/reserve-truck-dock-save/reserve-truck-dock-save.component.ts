import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	NgcPage, NgcFormGroup, NgcFormControl, PageConfiguration
} from 'ngc-framework';
import { TcsService } from '../tcs.service';

@Component({
	selector: 'app-reserve-truck-dock-save',
	templateUrl: './reserve-truck-dock-save.component.html',
	styleUrls: ['./reserve-truck-dock-save.component.scss']
})
@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true
})
export class ReserveTruckDockSaveComponent extends NgcPage {
	//
	private _vehicleNo: string;
	private _resourceId: number;
	public popup: boolean = false;
	public type: string = 'create';

	private reserveTruckDockCreateUpdateForm: NgcFormGroup = new NgcFormGroup({
		resourceId: new NgcFormControl(),
		vehicleNo: new NgcFormControl(),
		reservedFromDateTime: new NgcFormControl(),
		reservedTillDateTime: new NgcFormControl(),
		reason: new NgcFormControl(),
	});

	/**
	 * Initialize
	 *
	 * @param appZone Ng Zone
	 * @param appElement Element Ref
	 * @param appContainerElement View Container Ref
	 */
	constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
		private activatedRoute: ActivatedRoute, private router: Router, private tcsService: TcsService) {
		//
		super(appZone, appElement, appContainerElement);
	}

	/**
	 * Sets Vehicle No.
	 */
	@Input('vehicleNo')
	public set vehicleNo(vehicleNo: string) {
		if (this._vehicleNo != vehicleNo) {
			this._vehicleNo = vehicleNo;
			//
			this.reserveTruckDockCreateUpdateForm.get('vehicleNo').setValue(this._vehicleNo);
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
	 * Sets Dock No.
	 */
	@Input('resourceId')
	public set resourceId(resourceId: number) {
		if (this._resourceId != resourceId) {
			this._resourceId = resourceId;
			//
			this.reserveTruckDockCreateUpdateForm.get('resourceId').setValue(this._resourceId);
		}
		this.popup = true;
	}

	/**
	 * Gets Dock No.
	 */
	public get resourceId(): number {
		return this._resourceId;
	}

	/**
	 * On Save
	 */
	public onSave(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			const request = this.reserveTruckDockCreateUpdateForm.getRawValue();
			//
			this.reserveTruckDockCreateUpdateForm.validate();
			//
			if (this.reserveTruckDockCreateUpdateForm.invalid) {
				return;
			}
			if (this.type == 'create') {
				this.tcsService.createReserveTruckDock(request).subscribe((response) => {
					if (!this.showResponseErrorMessages(response)) {
						this.showSuccessStatus("g.operation.successful");
						resolve(true);
					}
				});
			}
		});
	}

	/**
	 * Reset Value
	 */
	public resetValue(): void {
		this.reserveTruckDockCreateUpdateForm.reset();
		this.clearAllFormControlMessages();
		//
		if (this._vehicleNo) {
			this.reserveTruckDockCreateUpdateForm.get('vehicleNo').setValue(this._vehicleNo);
		}
		//
		if (this._resourceId) {
			this.reserveTruckDockCreateUpdateForm.get('resourceId').setValue(this._resourceId);
		}
		this.reserveTruckDockCreateUpdateForm.clearErrors();
		this.reserveTruckDockCreateUpdateForm.markAsPristine();
	}
}
