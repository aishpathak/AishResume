
import { Component, ElementRef, Input, NgZone, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, PageConfiguration
} from 'ngc-framework';
import { TcsService } from '../tcs.service';

@Component({
	selector: 'app-truck-information',
	templateUrl: './truck-information.component.html',
	styleUrls: ['./truck-information.component.scss']
})
@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true
})
export class TruckInformationComponent extends NgcPage {
	//
	private _tripId: number;
	public popup: boolean = false;

	private truckDetails: NgcFormGroup = new NgcFormGroup({

		truckInfo: new NgcFormGroup({
			tripId: new NgcFormControl(),
			truckNo: new NgcFormControl(),
			purpose: new NgcFormControl(),
			dockNo: new NgcFormControl(),
			totalCharges: new NgcFormControl(),
			freeParkingHours: new NgcFormControl(),
		}),

		arriveTerminalTime: new NgcFormControl(),
		declarePurposeTime: new NgcFormControl(),
		parkingFee: new NgcFormControl(),
		outstayCharge: new NgcFormControl(),
		queueTime: new NgcFormControl(),
		dockAllocatedTime: new NgcFormControl(),

		chargeRecords: new NgcFormArray([]),
		truckEvent: new NgcFormArray([
			new NgcFormGroup({
				eventName: new NgcFormControl(),
				eventTime: new NgcFormControl()
			})
		]),
		truckCharges: new NgcFormArray([
			new NgcFormGroup({
				chargeType: new NgcFormControl(),
				quantity: new NgcFormControl(),
				rate: new NgcFormControl(),
				amount: new NgcFormControl()


			})
		]),
	});

	constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
		private activatedRoute: ActivatedRoute, private router: Router, private tcsService: TcsService) {
		super(appZone, appElement, appContainerElement);
	}

	/**
	 * Sets Trip Id
	 */
	@Input('tripId')
	public set tripId(tripId: number) {
		if (this._tripId != tripId) {
			this._tripId = tripId;
			//
			this.search();
			// Search
		}
		this.popup = true;
	}

	/**
	 * Gets Trip Id
	 */
	public get tripId(): number {
		return this._tripId;
	}

	public search() {
		if (this.tripId) {
			const request: any = {};
			//
			request.tripId = this._tripId;
			//
			this.tcsService.getTruckDetails(request).subscribe(response => {
				if (!this.showResponseErrorMessages(response)) {
					if (response.data) {
						(<NgcFormArray>this.truckDetails.controls['truckEvent']).patchValue(response.data.truckEvent);
						(<NgcFormArray>this.truckDetails.controls['truckCharges']).patchValue(response.data.charges);

						this.truckDetails.get('truckInfo').patchValue(response.data.truckInformation);
					} else {
						this.showMessage("no.record");
					}
				}
			});
		}
	}
}
