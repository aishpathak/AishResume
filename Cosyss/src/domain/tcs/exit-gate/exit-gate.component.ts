import { Component, ElementRef, NgZone, OnChanges, ViewChild, ViewContainerRef, } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExitGateSearchModel } from '../tcs.sharedmodel'
import {
	NgcFormGroup, NgcFormArray, NgcUtility, NgcPage,
	NgcFormControl, NgcWindowComponent, PageConfiguration,
	SystemParameter
} from 'ngc-framework';
import { TcsService } from '../tcs.service'
import { Subscription } from 'rxjs';
import { TruckInformationComponent } from '../truck-information/truck-information.component';

@Component({
	selector: 'app-exit-gate',
	templateUrl: './exit-gate.component.html',
	styleUrls: ['./exit-gate.component.scss']
})
@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true,
	autoBackNavigation: true,
	restorePageOnBack: true
})
export class ExitGateComponent extends NgcPage {

	windowType: string;
	truckNo: any;
	showData: boolean = false;
	showWindow: boolean = false;
	truckequest: ExitGateSearchModel;
	public searched: boolean = false;
	public datainfo = [];
	private recordRefreshSubscription: Subscription;
	responseData: any;

	constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
		private activatedRoute: ActivatedRoute, private router: Router, private service: TcsService) {
		super(appZone, appElement, appContainerElement);
	}

	public exitGateForm: NgcFormGroup = new NgcFormGroup({
		search: new NgcFormGroup({
			gateNumber: new NgcFormControl(null, Validators.required),
			auto: new NgcFormControl(true),
			gateRecords: new NgcFormArray([])
		})
	});

	/**
	 * On Destroy
	 */
	public ngOnDestroy() {
		//
		this.unsubscribeRefresh();
		//
		super.ngOnDestroy();
	}


	/**
	 * On Search
	 */
	public onSearch() {
		let searchGroup = (this.exitGateForm.get('search') as NgcFormGroup)
		//
		searchGroup.validate();
		// check for the validtaion of the form components 
		if (searchGroup.invalid) {
			return;
		}
		this.searched = false;
		this.search();
	}

	/**
	 * Search
	 */
	private search() {
		//  Store the request data components into form group 
		const searchGroup = (this.exitGateForm.get('search') as NgcFormGroup)
		const request: ExitGateSearchModel = searchGroup.getRawValue();

		// call the service which retrives the 
		// 1: ExitGateData  last parked vehicles
		this.service.getExitGateData(request).subscribe((response) => {
			if (!this.showResponseErrorMessages(response, null, "search")) {
				if (response && response.data
					&& (response.data.length > 0)) {
					this.refreshFormMessages(response);
					this.datainfo = response.data;
					this.exitGateForm.get('search').get('gateRecords').patchValue(response.data);
					this.searched = true;
					//
					this.autoRefresh();
				} else {
					this.showInfoStatus("no.record");
					this.searched = false;
				}
			}
		});
	}

	/**
	  * Create
	  * 
	  * @param data Window Ref
	  */
	public onInfo(event, vehicleInfoWindow: NgcWindowComponent, truckInfoScreen: TruckInformationComponent) {
		if (vehicleInfoWindow && truckInfoScreen) {
			truckInfoScreen.tripId = event.record.tripId;
			//
			vehicleInfoWindow.open();
		}
	}

	/**
	 * On Cancel
	 * 
	 * @param window Window
	 */
	public cancel(window: NgcWindowComponent) {
		if (window) {
			window.close();
		}
	}

	/**
	 * Auto Refresh
	 */
	public onSwitchChange(event) {
		this.unsubscribeRefresh();
		//
		if (event.checked == true) {
			this.autoRefresh();
		}
	}

	/**
	 * Auto Refresh
	 */
	private autoRefresh() {
		this.unsubscribeRefresh();
		//
		const systemParameter: SystemParameter = NgcUtility.getSystemParameter('TCS_DATA_AUTO_REFRESH_DURATION');
		let duration: number = 30000;
		//
		if (systemParameter) {
			duration = systemParameter.numericValue;
			duration = duration ? duration * 1000 : 30000;
		}
		// Refresh
		this.recordRefreshSubscription = this.getTimer(duration).subscribe(() => {
			this.search();
		});
	}

	/**
	 * Unsubscribe Refresh
	 */
	private unsubscribeRefresh() {
		if (this.recordRefreshSubscription) {
			this.recordRefreshSubscription.unsubscribe();
			this.recordRefreshSubscription = null;
		}
	}

}
