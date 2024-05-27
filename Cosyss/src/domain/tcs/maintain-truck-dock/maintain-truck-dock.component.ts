import { Component, NgZone, ElementRef, ViewContainerRef, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// Application
import {
	NgcPage, PageConfiguration,
	NgcFormGroup, NgcFormArray, NgcFormControl,
	NgcWindowComponent
} from 'ngc-framework';
import { MaintainTruckSearch } from '../tcs.sharedmodel';
import { TcsService } from '../tcs.service';
import { AddQueueComponent } from '../add-queue/add-queue.component';
import { AssignTruckDockComponent } from '../assign-truck-dock/assign-truck-dock.component';
import { ReleaseTruckDockComponent } from '../release-truck-dock/release-truck-dock.component';
import { ReserveTruckDockSaveComponent } from '../reserve-truck-dock-save/reserve-truck-dock-save.component';
import { ConnectingTruckComponent } from '../connecting-truck/connecting-truck.component';
import { CreateBanComponent } from '../create-ban/create-ban.component';
import { ReleaseBanComponent } from '../release-ban/release-ban.component';
import { TruckActivityComponent } from '../truck-activity/truck-activity.component';

@Component({
	selector: 'app-maintain-truck-dock',
	templateUrl: './maintain-truck-dock.component.html',
	styleUrls: ['./maintain-truck-dock.component.scss']
})
@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true,
	autoBackNavigation: true,
	restorePageOnBack: true
})
export class MaintainTruckDockComponent extends NgcPage {
	//
	public searched: boolean = false;
	public banned: boolean = false;
	private _vehicleNo: string;
	public popup: boolean = false;
	//
	/**
	 * Maintain Truck 
	 */
	private maintainTruck: NgcFormGroup = new NgcFormGroup({
		search: new NgcFormGroup({
			vehicleNo: new NgcFormControl(null, [Validators.maxLength(10), Validators.required])
		}),

		/**
		 * Vehicle Info 
		 */
		vehicleInfo: new NgcFormGroup({
			vehicleNo: new NgcFormControl(),
			companyId: new NgcFormControl(),
			companyName: new NgcFormControl(),
			purpose: new NgcFormControl(),
			dockNo: new NgcFormControl(),
			banStatus: new NgcFormControl(),
			outstandingAmount: new NgcFormControl(),
		}),
		events: new NgcFormArray([])
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

	@Input('callerScreen') callerScreen;

	@Input('incomingVehicleNo')
	public set vehicleNo(incomingVehicleNo: string) {
		if (incomingVehicleNo && this._vehicleNo != incomingVehicleNo) {
			this._vehicleNo = incomingVehicleNo;
			this.maintainTruck.get('search.vehicleNo').setValue(this._vehicleNo);
			this.onSearch();
		}
		this.popup = true;
	}

	public ngOnInit() {
		super.ngOnInit();
		// patching the truck park activity vehicle No
		const forwardedData = this.getNavigateData(this.activatedRoute);
		if (forwardedData) {
			this.maintainTruck.get(['search', 'vehicleNo']).patchValue(forwardedData.vehicleNo.value);
			this.onSearch();
		}
	}

	/**
	 * On Search Click
	 */
	public onSearch() {
		let searchGroup: NgcFormGroup = (this.maintainTruck.get('search') as NgcFormGroup);
		searchGroup.validate();
		//
		if (searchGroup.invalid) {
			return;
		}
		let request: MaintainTruckSearch = searchGroup.getRawValue();
		//
		(<NgcFormArray>this.maintainTruck.get('events')).resetValue([]);
		this.searched = false;
		//
		this.service.searchMaintainTruckDock(request).subscribe((response) => {
			if (!this.showResponseErrorMessages(response, null, "search")) {
				if (response.data.vehicleInfo) {
					this.searched = true;
					this.banned = response.data.vehicleInfo.banned;
					this.maintainTruck.get('vehicleInfo').patchValue(response.data.vehicleInfo);
					this.maintainTruck.get('events').patchValue(response.data.events);
				} else {
					this.showInfoStatus('no.record');
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
	 * On Assign Dock
	 */
	public onAssignDock(assignDockScreen: AssignTruckDockComponent, window: NgcWindowComponent) {
		if (assignDockScreen) {
			assignDockScreen.onSave().then(() => {
				this.cancel(window);
				assignDockScreen.resetValue();
				this.onSearch();
			});
		}
	}

	/**
	 * On Add to Queue
	 */
	public onAddToQueue(addToQueueScreen: AddQueueComponent, window: NgcWindowComponent) {
		if (addToQueueScreen) {
			addToQueueScreen.addToQueue().then(() => {
				this.cancel(window);
				addToQueueScreen.resetValue();
				addToQueueScreen.onSearch(true);
			});
		}
	}
	// /**
	//  * 
	//  * @param queueScreen 
	//  * @param window 
	//  */
	// public onQueue(queueScreen: AddQueueComponent, window: NgcWindowComponent) {
	// 	if (queueScreen) {
	// 		queueScreen.addToQueue().then(() => {
	// 			this.cancel(window);
	// 			queueScreen.resetValue();
	// 			queueScreen.onSearch(true);
	// 		});
	// 	}
	// }

	/**
	 * On Release Dock
	 */
	public onReleaseDock(releaseDockScreen: ReleaseTruckDockComponent, window: NgcWindowComponent) {
		if (releaseDockScreen) {
			releaseDockScreen.onSave().then(() => {
				this.cancel(window);
				releaseDockScreen.resetValue();
				releaseDockScreen.onSearch(true);
			});
		}
	}

	/**
	 * On Reserve Dock
	 */
	public onReserveDock(reserveDockScreen: ReserveTruckDockSaveComponent, window: NgcWindowComponent) {
		if (reserveDockScreen) {
			reserveDockScreen.onSave().then(() => {
				this.cancel(window);
				reserveDockScreen.resetValue();
			});
		}
	}

	/**
	 * On Connect Truck
	 */
	public onConnectTruck(connectTruckScreen: ConnectingTruckComponent, window: NgcWindowComponent) {
		if (connectTruckScreen) {
			connectTruckScreen.onSave().then(() => {
				this.cancel(window);
				connectTruckScreen.resetValue();
			});
		}
	}

	/**
	* On Create Ban
	*/
	public onCreateRecord(createRecordScreen: CreateBanComponent, window: NgcWindowComponent) {
		if (createRecordScreen) {
			createRecordScreen.onSave().then(() => {
				this.cancel(window);
				createRecordScreen.resetValue()
			});
		}
	}

	/**
	* On Release Record
	*/
	public onReleaseRecord(releaseRecordScreen: ReleaseBanComponent, window: NgcWindowComponent) {
		if (releaseRecordScreen) {
			releaseRecordScreen.onSave().then(() => {
				this.cancel(window);
				releaseRecordScreen.resetValue()
			});
		}
	}

	/**
	 * Before Opening the Truck Activity Window
	 */
	public onActivityOpen(truckActivityScreen: TruckActivityComponent) {
		if (truckActivityScreen) {
			truckActivityScreen.onSearch(true);
		}
	}

}
