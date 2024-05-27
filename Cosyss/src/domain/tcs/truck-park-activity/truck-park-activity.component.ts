import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, PageConfiguration, NgcWindowComponent,
	SystemParameter, NgcUtility
} from 'ngc-framework';
import { TcsService } from '../tcs.service';
import { Subscription } from 'rxjs';


@Component({
	selector: 'app-truck-park-activity',
	templateUrl: './truck-park-activity.component.html',
	styleUrls: ['./truck-park-activity.component.scss']
})
@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true,
	autoBackNavigation: true,
	restorePageOnBack: true
})
export class TruckParkActivityComponent extends NgcPage {
	showFlag: boolean = false;
	currentDateTime = new Date();
	private recordRefreshSubscription: Subscription;
	public vehicleNo: any = null;
	@ViewChild('maintainTruckDockWindow') maintainTruckDockWindow: NgcWindowComponent;

	private truckSearchForm: NgcFormGroup = new NgcFormGroup({
		auto: new NgcFormControl(true),
		truckNumber: new NgcFormControl(),
		vehicleNumber: new NgcFormControl(),
		incomingPurpose: new NgcFormControl()
	});

	private truckParkActivityForm: NgcFormGroup = new NgcFormGroup({
		truckParkActivityList: new NgcFormArray([])
	});

	/**
	 * Initialize
	 *
	 * @param appZone Ng Zone
	 * @param appElement Element Ref
	 * @param appContainerElement View Container Ref
	 */
	constructor(appZone: NgZone, appElement: ElementRef,
		appContainerElement: ViewContainerRef, private _tcsService: TcsService, private router: Router, private activatedRoute: ActivatedRoute) {
		super(appZone, appElement, appContainerElement);
	}

	ngOnInit() {
		super.ngOnInit();
		const forwardedData = this.getNavigateData(this.activatedRoute);
		//
		if (forwardedData) {
			this.truckSearchForm.patchValue(forwardedData);
			this.onSearch('onLoad');
		}
	}

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
	 * Search
	 */
	onSearch(event) {
		this.showFlag = false;
		if (event !== 'onLoad') {
			//Validate the truck search form before search
			this.truckSearchForm.validate();
			// if search form invalid returning with validating the search form
			if (this.truckSearchForm.invalid) {
				return;
			}
		}
		const request = this.truckSearchForm.getRawValue();
		//Truck park activity search API call
		this._tcsService.search(request).subscribe(response => {
			if (!this.showResponseErrorMessages(response)) {
				this.showFlag = true;
				(<NgcFormArray>this.truckParkActivityForm.get(['truckParkActivityList'])).patchValue(response.data);
				//
				this.autoRefresh();
			} else {
				this.showInfoStatus('no.record.found');
			}
		}, error => {
			this.showErrorStatus('Error:' + error);
		});
	}

	//on click of the truck number,redirects to the maintain dock allocation
	onHyperLinkClick(vehicleNo): void {
		const event = {
			vehicleNo: vehicleNo,
			searchData: this.truckSearchForm.getRawValue()
		}
		this.navigateTo(this.router, "tcs/maintain-truck-dock", event);
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
			this.onSearch('onLoad');
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