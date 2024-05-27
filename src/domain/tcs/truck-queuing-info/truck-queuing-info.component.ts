
import { Component, ElementRef, NgZone, ViewChild, ViewContainerRef, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TruckQueueSearchModel } from '../tcs.sharedmodel'
import {
	NgcFormGroup, NgcFormArray, NgcPage,
	NgcFormControl, CellsRendererStyle, PageConfiguration, SystemParameter,
	NgcUtility
} from 'ngc-framework';

import { TcsService } from '../tcs.service'
import { CellsStyleClass } from '../../../shared/shared.data';
import { Subscription } from 'rxjs';


@Component({
	selector: 'app-truck-queuing-info',
	templateUrl: './truck-queuing-info.component.html',
	styleUrls: ['./truck-queuing-info.component.scss']
})
@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true,
	autoBackNavigation: true,
	restorePageOnBack: true
})
export class TruckQueuingInfoComponent extends NgcPage {

	private recordRefreshSubscription: Subscription;

	//flag to hide data table id servie fails or no data found 
	public searched: boolean = false;

	// for  checking the service level
	public serviceLevelconstant = null;
	// Truck queue info form
	public truckQueingInfoForm: NgcFormGroup = new NgcFormGroup({
		search: new NgcFormGroup({
			declaredPurposeCode: new NgcFormControl(),
			vehicleNo: new NgcFormControl(),
			auto: new NgcFormControl(true),
			priority: new NgcFormControl()

		}),
		priorityQueue: new NgcFormArray([]),
		normalQueue: new NgcFormArray([])
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

	/**
	 * On Search
	 */
	public onSearch() {
		let searchGroup = (this.truckQueingInfoForm.get('search') as NgcFormGroup)
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
		const searchGroup = (this.truckQueingInfoForm.get('search') as NgcFormGroup)
		const request: TruckQueueSearchModel = searchGroup.getRawValue();
		// Reset Before Search
		(this.truckQueingInfoForm.get('priorityQueue') as NgcFormArray).resetValue([]);
		(this.truckQueingInfoForm.get('normalQueue') as NgcFormArray).resetValue([]);

		// call the service which retrives the 
		// 1: priorityQueue where  the  queuetype is PRIORITY
		// 2: normalQueue where  the  queuetype is NORMAL
		this.service.getPriorityList(request).subscribe((response) => {
			if (!this.showResponseErrorMessages(response, null, "search")) {
				if (response && response.data
					&& ((response.data.priorityQueue && response.data.priorityQueue.length > 0)
						|| (response.data.normalQueue && response.data.normalQueue.length > 0)
					)) {
					// Add Move Up/Down to Q List Before Patching
					if (response.data.priorityQueue && response.data.priorityQueue.length > 0) {
						for (let record of response.data.priorityQueue) {
							record.moveUp = null;
							record.moveDown = null;
						}
					}
					// check weather normal queue data is present
					if (response.data.normalQueue && response.data.normalQueue.length > 0) {
						for (let record of response.data.normalQueue) {
							record.moveUp = null;
							record.moveDown = null;
						}
					}
					this.truckQueingInfoForm.get('priorityQueue').patchValue(response.data.priorityQueue);
					this.truckQueingInfoForm.get('normalQueue').patchValue(response.data.normalQueue);

					this.serviceLevelconstant = response.data.serviceLevelconstant
					this.searched = true;


					// Disable the up functonaly of first row down functonaly  last row 
					if (response.data.priorityQueue.length > 0) {
						this.truckQueingInfoForm.get(['priorityQueue', 0, 'moveUp']).disable();
						this.truckQueingInfoForm.get(['priorityQueue', response.data.priorityQueue.length - 1, 'moveDown']).disable();
					}
					if (response.data.normalQueue.length > 0) {
						this.truckQueingInfoForm.get(['normalQueue', 0, 'moveUp']).disable();
						this.truckQueingInfoForm.get(['normalQueue', response.data.normalQueue.length - 1, 'moveDown']).disable();
					}
					this.autoRefresh();
				} else {
					this.showInfoStatus("no.record");
				}
			}
		});
	}

	/**
	 * 
	 * @param event 
	 * this function recive the up down inputs from the table and then it sends the 
	 * data to exchange to service whch updates it in db and rttricve the updated data  
	 */
	onPriorityDataTableClick(event) {
		const priorityQData: any = (this.truckQueingInfoForm.get('priorityQueue') as NgcFormArray).getRawValue();
		const position: number = parseInt(event.record.NGC_ROW_ID);
		// UP arrow pressed 
		if (event.column == 'moveUp') {
			// Discard first row to go up 
			if (event.record.NGC_ROW_ID != 0) {
				//
				let updateObject: any = {
					firstQueueOrder: priorityQData[position].positionNo,
					firstTripId: priorityQData[position].tripId,
					secondQueueOrder: priorityQData[position - 1].positionNo,
					secondTripId: priorityQData[position - 1].tripId
				}
				//
				this.service.updateQueueOrder(updateObject).subscribe((response) => {
					if (!this.showResponseErrorMessages(response)) {
						this.search();
						this.showSuccessStatus("g.operation.successful");
					}
				});
			}
		}
		// down array pressed 
		if (event.column == 'moveDown') {
			//Discard last  to go down 
			if (position != (priorityQData.length - 1)) {
				//
				let updateObject: any = {
					firstQueueOrder: priorityQData[position].positionNo,
					firstTripId: priorityQData[position].tripId,
					secondQueueOrder: priorityQData[position + 1].positionNo,
					secondTripId: priorityQData[position + 1].tripId
				}
				//
				this.service.updateQueueOrder(updateObject).subscribe((response) => {
					if (!this.showResponseErrorMessages(response)) {
						this.search();
						this.showSuccessStatus("g.operation.successful");
					}
				});
			}
		}
		// Update priority of trip  
		if (event.column == "action") {
			let updateRequest: any = { queueType: "NORMAL", vehicleNo: event.record.vehicleNo };
			// Call service which updates  the trip to  to NORMAL
			this.service.updateQueueType(updateRequest).subscribe((response) => {
				if (!this.showResponseErrorMessages(response)) {
					this.search();
					this.showSuccessStatus("g.operation.successful");
				}
			});
		}
	}

	/**
	 * 
	 * @param event 
	 */
	onNormalDataTableClick(event) {
		const normalQData: any = (this.truckQueingInfoForm.get("normalQueue") as NgcFormArray).getRawValue();
		const position: number = parseInt(event.record.NGC_ROW_ID);
		// UP arrow pressed 
		if (event.column == 'moveUp') {
			// Discard first 
			if (event.record.NGC_ROW_ID != 0) {
				//
				let updateObject: any = {
					firstQueueOrder: normalQData[position].positionNo,
					firstTripId: normalQData[position].tripId,
					secondQueueOrder: normalQData[position - 1].positionNo,
					secondTripId: normalQData[position - 1].tripId
				}
				//
				this.service.updateQueueOrder(updateObject).subscribe((response) => {
					if (!this.showResponseErrorMessages(response)) {
						this.search();
						this.showSuccessStatus("g.operation.successful");
					}
				})
			}
		}
		// down array pressed 
		if (event.column == 'moveDown') {
			if (position != (normalQData.length - 1)) {
				//
				let updateObject: any = {
					firstQueueOrder: normalQData[position].positionNo,
					firstTripId: normalQData[position].tripId,
					secondQueueOrder: normalQData[position + 1].positionNo,
					secondTripId: normalQData[position + 1].tripId
				}
				//
				this.service.updateQueueOrder(updateObject).subscribe((response) => {
					if (!this.showResponseErrorMessages(response)) {
						this.search();
						this.showSuccessStatus("g.operation.successful");
					}
				});
			}
		}
		// Update priority
		if (event.column == "action") {
			let updateRequest: any = { queueType: "PRIORITY", vehicleNo: event.record.vehicleNo };
			// // Call service which updates the trip to  to Priority 
			this.service.updateQueueType(updateRequest).subscribe((response) => {
				if (!this.showResponseErrorMessages(response)) {
					this.search();
					this.showSuccessStatus("g.operation.successful");
				}
			})
		}
	}

	// it is used to highilgt the Column  queuing time exceeding service level
	public cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
		let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
		// change the style of  the cell whcih goes beyond some  service level
		// date difference is gereater than service level 
		if ((rowData.dateDifference == 1)) {
			cellsStyle.data = value;
			cellsStyle.className = CellsStyleClass.CRITICAL_RED;
		} else {
			cellsStyle.data = value;
		}
		return cellsStyle;
	};

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
