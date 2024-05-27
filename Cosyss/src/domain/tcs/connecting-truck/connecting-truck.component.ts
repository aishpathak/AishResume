import { Component, NgZone, ElementRef, ViewContainerRef, Input, Output } from '@angular/core';
import { NgcFormControl } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, PageConfiguration, NgcFormGroup, NgcFormArray, NgcUtility } from 'ngc-framework';
import { TcsService } from '../tcs.service';
@Component({
	selector: 'app-connecting-truck',
	templateUrl: './connecting-truck.component.html',
	styleUrls: ['./connecting-truck.component.scss']
})
@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true
})
export class ConnectingTruckComponent extends NgcPage {
	//
	public isSearch: boolean = false;
	//
	private _dockNo: string;
	private _vehicleNo: string;
	public popup: boolean = false;
	/**
	* connecting truck form
	*/
	public connectingTruckForm: NgcFormGroup = new NgcFormGroup({
		search: new NgcFormGroup({
			truckDockNo: new NgcFormControl()
		}),
		details: new NgcFormGroup({
			resourceId: new NgcFormControl(),
			vehicleNo: new NgcFormControl(),
			vehicleDetails: new NgcFormArray([])
		})
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
		//
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
			this.connectingTruckForm.get('search.truckDockNo').setValue(this._dockNo);
			this.onSearch();
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
			//
			this.connectingTruckForm.get('details.vehicleNo').setValue(this._vehicleNo);
			this.onSearch();
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
	 * On Search
	 */
	public onSearch() {
		const formGroup: NgcFormGroup = this.connectingTruckForm.get('search') as NgcFormGroup;
		const request: any = formGroup.value;
		//
		formGroup.validate();
		//
		if (formGroup.invalid) {
			return;
		}
		// Reset
		this.isSearch = false;
		(<NgcFormArray>this.connectingTruckForm.get("details.vehicleDetails")).resetValue([]);
		//
		this.service.connectingTruckSearch(request).subscribe(response => {
			if (!this.showResponseErrorMessages(response)) {
				if (response.data && response.data.vehicleDetails && response.data.vehicleDetails.length > 0) {
					this.isSearch = true;
					this.connectingTruckForm.get(['details']).patchValue(response.data);
				} else {
					if (!this.popup) {
						this.showInfoStatus('no.record');
					}
				}
			}
		});
	}

	/**
	 * On Save
	 */
	public onSave(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			const formGroup: NgcFormGroup = this.connectingTruckForm.get('details') as NgcFormGroup;
			const request: any = formGroup.value;
			//
			formGroup.validate();
			//
			if (formGroup.invalid) {
				return;
			}
			// Reset
			this.connectingTruckForm.reset;
			this.service.saveConnectTruck(request).subscribe(response => {
				if (!this.showResponseErrorMessages(response)) {
					if (!this.popup) {
						this.onSearch();
					}
					this.showSuccessStatus('g.operation.successful');
					resolve(true);
				}
			});
		});
	}

	/**
	 * Reset Value
	 */
	public resetValue(): void {
		this.isSearch = false;
		this.connectingTruckForm.reset();
		this.connectingTruckForm.clearErrors();
		this.connectingTruckForm.markAsPristine();
	}
}
