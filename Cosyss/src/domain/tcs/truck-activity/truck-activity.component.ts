import { Component, NgZone, ElementRef, ViewContainerRef, Input } from '@angular/core';
import {
	NgcFormControl
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import {
	NgcPage, PageConfiguration, NgcFormGroup,
	NgcFormArray, NgcUtility, DateTimeKey, SystemParameter, CellsRendererStyle
} from 'ngc-framework';
import { TruckActivitySearchModel } from '../tcs.sharedmodel';
import { TcsService } from '../tcs.service';
import { Subscription } from 'rxjs';
import { CellsStyleClass } from '../../../shared/shared.data';

@Component({
	selector: 'app-truck-activity',
	templateUrl: './truck-activity.component.html',
	styleUrls: ['./truck-activity.component.scss']
})
@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true,
	autoBackNavigation: true,
	restorePageOnBack: true
})
export class TruckActivityComponent extends NgcPage {
	// 
	private _vehicleNo: string;
	public isSearch: boolean = false;
	public maxDate: Date = null;
	private MAX_DAYS: number = 6;
	public popup: boolean = false;
	private recordRefreshSubscription: Subscription;

	//Truck activity history form group
	private truckActivityHistoryForm: NgcFormGroup = new NgcFormGroup({
		search: new NgcFormGroup({
			companyId: new NgcFormControl(null, Validators.required),
			vehicleNo: new NgcFormControl(),
			auto: new NgcFormControl(true),
			terminalEntryFromDate: new NgcFormControl(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), this.MAX_DAYS, 'd'), Validators.required),
			terminalEntryTillDate: new NgcFormControl(NgcUtility.endOfDate(new Date(), DateTimeKey.DAYS), Validators.required)
		}),
		bannedTrucks: new NgcFormArray([]),
		finedTrucks: new NgcFormArray([]),
		truckActivityHistory: new NgcFormArray([]),
	});

	/**
	  * Initialize
	  *
	  * @param appZone Ng Zone
	  * @param appElement Element Ref
	  * @param appContainerElement View Container Ref
	  */
	constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
		private activatedRoute: ActivatedRoute, private router: Router, private service: TcsService) {
		//
		super(appZone, appElement, appContainerElement);
		//Get the currentdate as maxdate
		this.maxDate = NgcUtility.getCurrentDateOnly();
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
	 * Sets Vehicle No.
	 */
	@Input('vehicleNo')
	public set vehicleNo(vehicleNo: string) {
		if (this._vehicleNo != vehicleNo) {
			this._vehicleNo = vehicleNo;
			// setting searchGroup for setValue and clearValidators
			const searchGroup: NgcFormGroup = (this.truckActivityHistoryForm.get('search') as NgcFormGroup);
			// setting vehicle number in search group
			searchGroup.get('vehicleNo').setValue(this._vehicleNo);
			// Make Company Id Not Mandatory
			searchGroup.get('companyId').clearValidators();
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
	 * History Search function 
	 */
	public onSearch(noInfo?: boolean) {
		if (noInfo) {
			this.isSearch = false;
		}
		const searchGroup: NgcFormGroup = (this.truckActivityHistoryForm.get('search') as NgcFormGroup);
		const request: TruckActivitySearchModel = searchGroup.getRawValue();
		// Validating the search form before API call
		searchGroup.validate();
		// if search form invalid returning with validating the search form
		if (searchGroup.invalid) {
			return;
		}
		// Reset Before Search
		(this.truckActivityHistoryForm.get('bannedTrucks') as NgcFormArray).resetValue([]);
		(this.truckActivityHistoryForm.get('finedTrucks') as NgcFormArray).resetValue([]);
		(this.truckActivityHistoryForm.get('truckActivityHistory') as NgcFormArray).resetValue([]);
		// Search Truck history API Call to fetch list of Banned trucks, finde trucks and History
		this.service.searchTruckActivity(request).subscribe((response) => {
			if (!this.showResponseErrorMessages(response, null, "search")) {
				this.truckActivityHistoryForm.patchValue(response.data);
				//
				const hasBanned: boolean = response.data.bannedTrucks && response.data.bannedTrucks.length;
				const hasFined: boolean = response.data.finedTrucks && response.data.finedTrucks.length;
				const hasHistory: boolean = response.data.truckActivityHistory && response.data.truckActivityHistory.length;
				//
				if (!hasBanned && !hasFined && !hasHistory) {
					if (!noInfo) {
						this.showInfoStatus('no.record.found');
					}
				} else {
					this.isSearch = true;
					//
					this.autoRefresh();
				}
			}
		})
	}

	/*
	This function is called on change of From Date to get the maxDate 
	 */
	public onFromDateChange() {
		const fromDate: Date = this.truckActivityHistoryForm.get('search.terminalEntryFromDate').value;
		// FromDate as a parameter for NULL CHECK
		if (fromDate) {
			this.maxDate = NgcUtility.addDate(fromDate, this.MAX_DAYS, 'd');
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
		// No Auto Refresh for Popup
		if (this.popup) {
			return;
		}
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
			this.onSearch(true);
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

	public cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
		let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
		//
		cellsStyle.data = NgcUtility.getDateAsString(rowData.banPeriodFrom) + "-" + NgcUtility.getDateAsString(rowData.banPeriodTill);
		//
		return cellsStyle;
	};

}

