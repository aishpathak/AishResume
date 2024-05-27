import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	NgcPage, NgcFormGroup, NgcFormControl, NgcWindowComponent, NgcFormArray
	, PageConfiguration
} from 'ngc-framework';
import { TcsService } from '../tcs.service';

@Component({
	selector: 'app-unreserve-truck-dock',
	templateUrl: './unreserve-truck-dock.component.html',
	// styleUrls: ['./ureserve-truck-dock.component.scss']
})

@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true,
	autoBackNavigation: true
})

export class UnReserveTruckDockComponent extends NgcPage {
	@ViewChild('createUpdateWindow') createUpdateWindow: NgcWindowComponent;
	private _resourceId: number;
	private _reservationId: number;

	@Output("cancel")
	cancel: EventEmitter<number> = new EventEmitter<number>();
	windowType: string;
	public popup: boolean = true;

	//unreserve search form
	private unReserveTruckDockForm: NgcFormGroup = new NgcFormGroup({
		reservationId: new NgcFormControl(),
		resourceId: new NgcFormControl(),
		vehicleNo: new NgcFormControl(),
		reservedFromDateTime: new NgcFormControl(),
		reservedTillDateTime: new NgcFormControl(),
		reason: new NgcFormControl(),
		resourceCode: new NgcFormControl(),
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

	// search the pre-waivepark Activity
	public onSearch() {
		//Validate the search before API call
		this.unReserveTruckDockForm.validate();
		// if search form invalid returning with validating the search form
		if (this.unReserveTruckDockForm.invalid) {
			return;
		}
		//Get the searched value
		const request = this.unReserveTruckDockForm.getRawValue();
		//Search UnReserve API CALL to fetch the unreserve data
		this.tcsService.searchReserveTruckDock(request).subscribe((response) => {
			if (!this.showResponseErrorMessages(response)) {
				this.unReserveTruckDockForm.patchValue(response.data[0]);
			}
		}, error => {
			this.showErrorStatus('Error:' + error);
		});
	}

	public onSave(): Promise<any> {
		return new Promise<boolean>((resolve, reject) => {
			const request = this.unReserveTruckDockForm.getRawValue();
			//Search UnReserve API CALL to fetch the unreserve data
			this.tcsService.unReserveTruckDock(request).subscribe((response) => {
				if (!this.showResponseErrorMessages(response)) {
					this.showSuccessStatus('g.operation.successful');
					resolve(true);
				}
			});
		});
	}

	/**
	 * Sets reservationId.
	 */
	@Input('reservationId')
	public set reservationId(reservationId: number) {
		if (this._reservationId != reservationId) {
			this._reservationId = reservationId;
			//set the resourceId from the truck dock monitoring
			this.unReserveTruckDockForm.get('reservationId').setValue(this._reservationId);
		}
		this.popup = true;
	}

	/**
	 * Gets Reference Id
	 */
	public get reservationId(): number {
		return this._reservationId;
	}

	/**
	 * Sets resourceId.
	 */
	@Input('resourceId')
	public set resourceId(resourceId: number) {
		if (this._resourceId != resourceId) {
			this._resourceId = resourceId;
			//set the resourceId from the truck dock monitoring
			this.unReserveTruckDockForm.get('resourceId').setValue(this._resourceId);
		}
		this.popup = true;
	}

	/**
	 * Gets Resource Id
	 */
	public get resourceId(): number {
		return this._resourceId;
	}

	/**
	 * Reset Value
	 */
	public resetValue(): void {
		this.unReserveTruckDockForm.reset();
		this.clearAllFormControlMessages();
		//
		if (this._reservationId) {
			this.unReserveTruckDockForm.get('reservationId').setValue(this._reservationId);
		}
		//
		if (this._resourceId) {
			this.unReserveTruckDockForm.get('resourceId').setValue(this._resourceId);
		}
		this.unReserveTruckDockForm.clearErrors();
		this.unReserveTruckDockForm.markAsPristine();
	}

}
