import { Component, ElementRef, Input, NgZone, ViewContainerRef, } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
	NgcFormGroup, NgcPage, PageConfiguration, NgcFormControl
} from 'ngc-framework';

import { TcsService } from '../tcs.service'


@Component({
	selector: 'app-release-truck-dock',
	templateUrl: './release-truck-dock.component.html',
	styleUrls: ['./release-truck-dock.component.scss']
})
@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true,
	autoBackNavigation: true,
	restorePageOnBack: true
})
export class ReleaseTruckDockComponent extends NgcPage {
	//
	private _dockNo: string;
	public popup: boolean = false;
	public searched: boolean = false;
	//
	public truckDockReleaseform: NgcFormGroup = new NgcFormGroup({
		search: new NgcFormGroup({
			truckDocNo: new NgcFormControl(null, Validators.required),
		}),
		update: new NgcFormGroup({
			vehicleNo: new NgcFormControl(),
			resourceId: new NgcFormControl(),
			requeue: new NgcFormControl(false),
			release: new NgcFormControl(true),
			remarks: new NgcFormControl(null, Validators.pattern("^[a-zA-Z0-9\\s]+$"))
		}),
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
		super(appZone, appElement, appContainerElement);
	}

	/**
	 * Sets Dock No.
	 */
	@Input('dockNo')
	public set dockNo(dockNo: string) {
		if (this._dockNo != dockNo) {
			this._dockNo = dockNo;
			//
			this.truckDockReleaseform.get('search.truckDocNo').setValue(this._dockNo);
			// Search
			this.onSearch(true);
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
	 * On Save
	 */
	public onSave(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			const searchGroup = (this.truckDockReleaseform.get('update') as NgcFormGroup)
			const request: any = searchGroup.value;
			//
			searchGroup.validate();
			//
			if (searchGroup.invalid) {
				return;
			}
			// call manually release dock 
			this.service.updateReleaseDock(request).subscribe((response) => {
				if (!this.showResponseErrorMessages(response, null, "update")) {
					if (response) {
						this.showSuccessStatus("g.operation.successful")
						resolve(true);
					}
				}
			});
		});
	}

	/**
	 * On Search
	 */
	public onSearch(noInfo?: boolean) {
		let searchGroup = (this.truckDockReleaseform.get('search') as NgcFormGroup);
		const request: any = searchGroup.getRawValue();
		//check for invalid
		if (searchGroup.invalid) {
			return;
		}

		this.searched = false;
		// Reset
		this.truckDockReleaseform.get('update').reset();
		//call the Truck information  info API 
		this.service.getVehicleInfo(request).subscribe((response) => {
			if (!this.showResponseErrorMessages(response, null, "search")) {
				if (response && response.data) {
					this.truckDockReleaseform.get('update').patchValue(response.data);
					this.truckDockReleaseform.get('update.release').setValue(true);
					this.searched = true
					console.log(this.searched)

				} else {
					if (!noInfo) {
						this.showInfoStatus("no.record");
					}
				}
			}
		});
	}

	/**
	 * Reset Value
	 */
	public resetValue(): void {
		this.truckDockReleaseform.reset();
		this.truckDockReleaseform.get('search.truckDocNo').setValue(this._dockNo);
		this.truckDockReleaseform.clearErrors();
		this.truckDockReleaseform.markAsPristine();
	}
}
