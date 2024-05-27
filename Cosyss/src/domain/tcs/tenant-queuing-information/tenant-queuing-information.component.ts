
import { Component, ElementRef, NgZone, ViewChild, ViewContainerRef, } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantQueueChange, tenentQueueSearchModel, } from '../tcs.sharedmodel';
import {
	NgcFormGroup, NgcFormArray, NgcPage, PageConfiguration, NgcFormControl, NgcWindowComponent,
	SystemParameter, NgcUtility
} from 'ngc-framework';

import { TcsService } from '../tcs.service'
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-tenant-queuing-information',
	templateUrl: './tenant-queuing-information.component.html',
	styleUrls: ['./tenant-queuing-information.component.scss']
})
@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true,
	autoBackNavigation: true,
	restorePageOnBack: true
})
export class TenantQueuingInformationComponent extends NgcPage {
	@ViewChild('maintainTruckDockWindow') maintainTruckDockWindow: NgcWindowComponent;
	//flag  to hide   the table 
	public searched: boolean = false;
	private recordRefreshSubscription: Subscription;
	public vehicleNo: any;
	public callerScreen = "Tenant"

	public tenatQueingInfoForm: NgcFormGroup = new NgcFormGroup({
		search: new NgcFormGroup({
			companyId: new NgcFormControl(null, Validators.required),
			auto: new NgcFormControl(true),
		}),
		enableAutoQueue: new NgcFormControl(),
		tenantName: new NgcFormControl(),
		tenantQueue: new NgcFormArray([]),
		allocatedVehicle: new NgcFormArray([]),
		waitingManualQueue: new NgcFormArray([])
	});

	constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
		private activatedRoute: ActivatedRoute, private router: Router, private service: TcsService) {
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

	//on click of the truck number,redirects to the maintain dock allocation
	onHyperLinkClick(event): void {
		let request: TenantQueueChange = new TenantQueueChange();
		request.vehicleNo = event.record.vehicleNo
		//
		if (event.column === "vehicleNo") {
			let vehicleNo = { value: event.record.vehicleNo }
			const eventdata = {
				vehicleNo: vehicleNo
			}
			this.navigateTo(this.router, "tcs/maintain-truck-dock", eventdata);
		} else {
			// service to Cancel the queue allocation
			if (event.record[event.column] == 'Cancel Allocation') {
				this.service.tenantCancelAllocation(request).subscribe((response) => {
					if (!this.showResponseErrorMessages(response, null, "search")) {
						if (response) {
							this.showSuccessStatus("g.operation.successful")
							this.onSearch()

						} else {
							this.showErrorMessage(response.messageList[0].code);
						}
					} else {
						this.showErrorMessage(response.messageList[0].code);
					}
				})
			} else {
				// service to Allcoate Tenent Queue
				this.service.tenantAddToQueue(request).subscribe((response) => {
					if (!this.showResponseErrorMessages(response, null, "search")) {
						if (response) {
							this.showSuccessStatus("g.operation.successful")
							this.onSearch()
						} else {
							this.showErrorMessage(response.messageList[0].code);
						}
					} else {
						this.showErrorMessage(response.messageList[0].code);
					}
				})
			}
		}
	}

	/**
	 *  On Search
	 * search the tenant queuing info 
	 */
	onSearch() {
		this.searched = false;
		this.search();
	}

	public search() {
		let searchGroup = (this.tenatQueingInfoForm.get('search') as NgcFormGroup);
		//validate the form 
		searchGroup.validate();
		// search for any invalid componenets  
		if (searchGroup.invalid) {
			return;
		}
		let request: tenentQueueSearchModel = searchGroup.getRawValue();
		// Reset Before Search
		(this.tenatQueingInfoForm.get("tenantQueue") as NgcFormArray).resetValue([]);
		(this.tenatQueingInfoForm.get("waitingManualQueue") as NgcFormArray).resetValue([]);
		(this.tenatQueingInfoForm.get("allocatedVehicle") as NgcFormArray).resetValue([]);

		//call the  search tenant  info service which returns the  
		//object of array of 
		//  1  : waitingManualQueue 
		//  2  : allocatedVehicle
		//  3  : enableAutoQueue  
		//  4  : tenantName 

		this.service.searchTenantInfo(request).subscribe((response) => {
			if (!this.showResponseErrorMessages(response, null, "search")) {
				if (response && response.data
					&& ((response.data.tenantQueue && response.data.tenantQueue.length > 0)
						|| (response.data.enableAutoQueue)
						|| (response.data.waitingManualQueue && response.data.waitingManualQueue.length > 0)
						|| (response.data.allocatedVehicle && response.data.allocatedVehicle.length > 0))) {
					this.tenatQueingInfoForm.get('tenantQueue').patchValue(response.data.tenantQueue);
					this.tenatQueingInfoForm.get('waitingManualQueue').patchValue(response.data.waitingManualQueue);
					this.tenatQueingInfoForm.get('allocatedVehicle').patchValue(response.data.allocatedVehicle);
					this.tenatQueingInfoForm.get('enableAutoQueue').patchValue(response.data.tenantInfo.enableAutoQueue);
					this.tenatQueingInfoForm.get('tenantName').patchValue(response.data.tenantInfo.tenantName);
					this.searched = true;
					//
					this.autoRefresh();
				} else {
					this.showInfoStatus("no.record");
					this.searched = false;
				}
			}
		})
	}

	/**
	 * Open
	 */
	public open(window: NgcWindowComponent) {
		if (window) {
			window.open();
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
