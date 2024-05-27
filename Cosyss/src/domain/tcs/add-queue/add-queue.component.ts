
import { Component, NgZone, ElementRef, ViewContainerRef, OnChanges, OnInit, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TcsService } from '../tcs.service'
// Application
import {
	NgcPage, PageConfiguration, NgcFormGroup, NgcFormControl
} from 'ngc-framework';

@Component({
	selector: 'app-add-queue',
	templateUrl: './add-queue.component.html',
	styleUrls: ['./add-queue.component.scss']
})
@PageConfiguration({
	trackInit: true, callNgOnInitOnClear: true
})
export class AddQueueComponent extends NgcPage {
	//
	private _vehicleNo: string;
	public popup: boolean = false;
	public searched: boolean = false;

	@Input('title')
	public title: string;

	@Input('updatePurpose')
	public updatePurpose: boolean = false;


	/**
	 * Add Queue Form
	 */
	public addQueueForm: NgcFormGroup = new NgcFormGroup({
		search: new NgcFormGroup({
			vehicleNo: new NgcFormControl(null, [Validators.maxLength(10), Validators.required]),
		}),
		info: new NgcFormGroup({
			vehicleNo: new NgcFormControl(),
			companyName: new NgcFormControl(),
			banStatus: new NgcFormControl(),
			truckStatus: new NgcFormControl(),
			newPurpose: new NgcFormControl(),
			newPurposeCompanyId: new NgcFormControl(),
			currentPurpose: new NgcFormControl(),
			terminal: new NgcFormControl(),
			floor: new NgcFormControl(),
			autoEnqueue: new NgcFormControl(),
			queueOrder: new NgcFormControl(),
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
	 * Sets Vehicle No.
	 */
	@Input('vehicleNo')
	public set vehicleNo(vehicleNo: string) {
		if (this._vehicleNo != vehicleNo) {
			this._vehicleNo = vehicleNo;
			//
			this.addQueueForm.get('search.vehicleNo').setValue(this._vehicleNo);
			// Search
			this.onSearch(true);

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
	 * 
	 * @returns 
	 */
	public onSearch(noInfo?: boolean) {
		const searchGroup: NgcFormGroup = this.addQueueForm.get('search') as NgcFormGroup;
		const request: any = searchGroup.value;
		//
		searchGroup.validate();
		//
		if (searchGroup.invalid) {
			return;
		}
		// Reset
		this.addQueueForm.get('info').reset();
		// Search For AddQueue
		this.service.searchAddQueue(request).subscribe((response) => {
			if (!this.showResponseErrorMessages(response, null, "search")) {
				if (response.data) {
					this.searched = true;
					this.addQueueForm.get('info').patchValue(response.data);
				} else {
					if (!noInfo) {
						this.showInfoStatus("no.record");
					}
				}
			}
		});
	}

	/**
	 * Add To Queue
	 */
	public addToQueue(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			const infoGroup: NgcFormGroup = this.addQueueForm.get('info') as NgcFormGroup;
			const request: any = infoGroup.value;
			//
			infoGroup.validate();
			//
			if (infoGroup.invalid) {
				return;
			}
			if (this.updatePurpose == true) {
				request.autoEnqueue = false;
			} else {
				request.autoEnqueue = true;
			}

			//
			//Check wheater Truck is already allocated
			if (this.addQueueForm.get('info.queueOrder').value != null) {

				this.showConfirmMessage("Do you want to add truck to queue?").then(fulfilled => {
					this.service.addToQueue(request).subscribe((response) => {
						if (!this.showResponseErrorMessages(response, null, "info")) {
							this.showSuccessStatus('g.operation.successful');
							resolve(true);
						}
					});
				})

			} else {
				this.service.addToQueue(request).subscribe((response) => {
					if (!this.showResponseErrorMessages(response, null, "info")) {
						this.showSuccessStatus('g.operation.successful');
						resolve(true);
					}
				});

			}
		})
	}

	/**
	 * Reset Value
	 */
	public resetValue(): void {
		this.addQueueForm.reset();
		this.addQueueForm.get('search.vehicleNo').setValue(this._vehicleNo);
		this.addQueueForm.clearErrors();
		this.addQueueForm.markAsPristine();
	}
}
