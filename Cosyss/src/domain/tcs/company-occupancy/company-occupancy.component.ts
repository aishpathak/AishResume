
import { Component, NgZone, ElementRef, ViewContainerRef, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Application
import {
	NgcPage, PageConfiguration, NgcUtility,
	NgcFormGroup, NgcFormArray, NgcFormControl,
	NgcWindowComponent, SystemParameter
} from 'ngc-framework';
import { Subscription } from 'rxjs';
import { CompanyOccupanySearchModel } from '../tcs.sharedmodel';
import { TcsService } from '../tcs.service'


@Component({
	selector: 'app-company-occupancy',
	templateUrl: './company-occupancy.component.html',
	styleUrls: ['./company-occupancy.component.scss']
})
@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true,
	autoBackNavigation: true,
	restorePageOnBack: true
})
export class CompanyOccupancyComponent extends NgcPage implements OnInit {
	/**
	 * companyOccupancyForm:
	 */
	private companyOccupancyForm: NgcFormGroup = new NgcFormGroup({
		search: new NgcFormGroup({
			tenant: new NgcFormControl(false),
			companyId: new NgcFormControl(),
			auto: new NgcFormControl(true),
			//
			companyDetails: new NgcFormArray([]),
		}),
		/**
		 * DetailsInfo
		 */
		detailsInfo: new NgcFormGroup({
			tenant: new NgcFormControl(),
			companyName: new NgcFormControl(),
			parkPoolSize: new NgcFormControl(),
			dockPoolSize: new NgcFormControl(),
			parkOverlapSize: new NgcFormControl(),
			parkOverlapMinute: new NgcFormControl(),
			allocatedVehicles: new NgcFormControl(),
			vehiclesInDockPool: new NgcFormControl(),
			vehiclesInParkPool: new NgcFormControl(),
			vehiclesInOverlapPool: new NgcFormControl(),
			vehiclesInHourlyPool: new NgcFormControl(),
		}),
	});
	//
	public isSearch: boolean = false;
	private recordRefreshSubscription: Subscription;

	constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
		private activatedRoute: ActivatedRoute, private router: Router, private service: TcsService) {
		//
		super(appZone, appElement, appContainerElement);
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
	 * On Search Click
	 */
	public onSearch() {
		let searchGroup: NgcFormGroup = (this.companyOccupancyForm.get('search') as NgcFormGroup);
		searchGroup.validate();
		//
		if (searchGroup.invalid) {
			return;
		}
		let request: CompanyOccupanySearchModel = searchGroup.getRawValue();
		//
		(<NgcFormArray>this.companyOccupancyForm.get('search.companyDetails')).resetValue([]);
		//
		this.service.searchCompanyOccupancy(request).subscribe((response) => {
			if (response && !this.showResponseErrorMessages(response, null, "search")) {
				if (response.data && response.data.length > 0) {
					this.isSearch = true;
					this.companyOccupancyForm.get('search.companyDetails').patchValue(response.data);
					//
					this.autoRefresh();
				} else {
					this.showInfoStatus("no.record");
				}
			}
		})
	}

	//
	onClose(detailsWindow: NgcWindowComponent) {
		if (detailsWindow) {
			detailsWindow.close();
		}
	}

	/**
	 *  On Detail Click
	 */
	public onDataTableClick(event: any, detailsWindow: NgcWindowComponent) {
		//debuger
		if (event && event.type == 'link') {
			if (event.column == 'details') {
				// Reset
				this.companyOccupancyForm.get('detailsInfo').reset();
				// Update
				this.companyOccupancyForm.get('detailsInfo').patchValue(event.record);
				//
				this.service.detailsCompanyOccupancy(event.record).subscribe((response) => {
					if (response && response.data) {
						this.companyOccupancyForm.get('detailsInfo.allocatedVehicles').setValue(response.data.allocatedVehicles);
						this.companyOccupancyForm.get('detailsInfo.vehiclesInDockPool').setValue(response.data.vehiclesInDockPool);
						this.companyOccupancyForm.get('detailsInfo.vehiclesInParkPool').setValue(response.data.vehiclesInParkPool);
						this.companyOccupancyForm.get('detailsInfo.vehiclesInOverlapPool').setValue(response.data.vehiclesInOverlapPool);
						this.companyOccupancyForm.get('detailsInfo.vehiclesInHourlyPool').setValue(response.data.vehiclesInHourlyPool);
					}
				})
				//
				detailsWindow.open();
			}
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
			this.onSearch();
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
