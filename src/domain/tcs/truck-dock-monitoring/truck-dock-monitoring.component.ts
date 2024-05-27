import { ElementRef, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
	NgcWindowComponent, PageConfiguration, NgcFormGroup, NgcFormControl, NgcPage, NgcUtility,
	NgcFormArray, SystemParameter
} from 'ngc-framework';
import { Subscription } from 'rxjs';
import { AdhocDockUpdateComponent } from '../adhoc-dock-update/adhoc-dock-update.component';
import { AssignTruckDockComponent } from '../assign-truck-dock/assign-truck-dock.component';
import { ConnectingTruckComponent } from '../connecting-truck/connecting-truck.component';
import { CreateBanComponent } from '../create-ban/create-ban.component';
import { ReleaseTruckDockComponent } from '../release-truck-dock/release-truck-dock.component';
import { ReserveTruckDockSaveComponent } from '../reserve-truck-dock-save/reserve-truck-dock-save.component';
import { TcsService } from '../tcs.service';
import { UnReserveTruckDockComponent } from '../unreserve-truck-dock/unreserve-truck-dock.component';

const MENU_ACTION = {
	ASSIGN_DOCK: 'ASSIGN_DOCK',
	RESERVE_DOCK: 'RESERVE_DOCK',
	RELEASE_DOCK: 'RELEASE_DOCK',
	ADHOC_CHANGE: 'ADHOC_CHANGE',
	UNRESERVE_DOCK: 'UNRESERVE_DOCK',
	//
	BAN_TRUCK: 'BAN_TRUCK',
	CONNECT_TRUCK: 'CONNECT_TRUCK'

};

@Component({
	selector: 'app-truck-dock-monitoring',
	templateUrl: './truck-dock-monitoring.component.html',
	styleUrls: ['./truck-dock-monitoring.component.scss']
})
@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true,
	dashboard: true
})
export class TruckDockMonitoringComponent extends NgcPage {
	// Dock Data
	private terminals: Array<any> = null;
	private parkOrDock: string = "DOCK";
	private preferredTerminal: string = 'ALL';
	private preferredLevel: string = 'ALL';
	private dockNumber: string;
	private vehicleNumber: string;
	private resourceId: number;
	private reservationId: number = null;
	private tripId: number
	//
	public recordRefreshSubscription: Subscription;
	// Dock Menu
	public dockMenu: Array<any> = [
		{ label: "tcs.assignDock", id: MENU_ACTION.ASSIGN_DOCK },
		{ label: "tcs.reserveDock", id: MENU_ACTION.RESERVE_DOCK },
		{ label: "tcs.unReserveTruckDock", id: MENU_ACTION.UNRESERVE_DOCK },
		{ label: "tcs.releaseDock", id: MENU_ACTION.RELEASE_DOCK },
		{ separator: true },
		{ label: "tcs.adhocChange", id: MENU_ACTION.ADHOC_CHANGE }
	];
	// Vehicle Menu
	public vehicleMenu: Array<any> = [
		{ label: "tcs.assignDock", id: MENU_ACTION.ASSIGN_DOCK },
		{ separator: true },
		{ label: "tcs.banTruck", id: MENU_ACTION.BAN_TRUCK },
		{ separator: true },
		{ label: "tcs.connectTruck", id: MENU_ACTION.CONNECT_TRUCK }
	];
	//
	public truckDockMonitoring: NgcFormGroup = new NgcFormGroup({
		auto: new NgcFormControl(true),
		parkOrDock: new NgcFormControl(this.parkOrDock),
		terminal: new NgcFormControl(this.preferredTerminal),
		level: new NgcFormControl(this.preferredLevel),
		dockInfo: new NgcFormGroup({
			dockNo: new NgcFormControl(),
			vehicleNo: new NgcFormControl(),
			occupied: new NgcFormControl(),
			dockAllocatedDateTime: new NgcFormControl(),
			dockAllocatedTillDateTime: new NgcFormControl(),
			overstayed: new NgcFormControl(),
			dockPurpose: new NgcFormControl(),
			dockPurpose2: new NgcFormControl(),
			dockPurpose3: new NgcFormControl(),
			dockPurpose4: new NgcFormControl(),
			dockPurpose5: new NgcFormControl()
		}),
		parkSummary: new NgcFormArray([]),
		legendArray: new NgcFormArray([]),
	});
	//

	constructor(appZone: NgZone, appElement: ElementRef,
		appContainerElement: ViewContainerRef, private service: TcsService, private router: Router,) {
		super(appZone, appElement, appContainerElement);
	}

	/**
	 * On Init
	 */
	public ngOnInit() {
		super.ngOnInit();
		// Get Data
		this.getMonitoringData();
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
	 * Find Level Width
	 * 
	 * @param levelDiv
	 * @returns 
	 */
	public levelWidth(levelDiv: HTMLDivElement) {
		const nodeList: NodeListOf<HTMLDivElement> = levelDiv.querySelectorAll('div.tcs-dock');
		//
		if (!nodeList || nodeList.length < 1) {
			return null;
		}
		const size: number = nodeList.length;
		const minX: number = nodeList.item(0).offsetLeft;
		const maxX: number = nodeList.item(size - 1).offsetLeft + nodeList.item(size - 1).offsetWidth;
		//
		return (maxX - minX);
	}

	/**
	 * Get Data & Subscribe for Refresh
	 */
	public getMonitoringData() {
		this.autoRefresh();
		this.search();
	}

	/**
	 * Search
	 */
	private search() {
		this.service.dockMonitoringSearch().subscribe((response) => {
			if (response) {
				if (!this.showResponseErrorMessages(response)) {
					if (response.data && response.data.length > 0) {
						for (let terminal of response.data) {
							this.updateParkSummary(terminal);
							this.updateLegendData(terminal);
						}
						this.terminals = response.data;
					} else {
						this.terminals = null;
					}
				}
			}
		});
	}

	/**
	 * Update Park Summary
	 */
	private updateParkSummary(terminal: any) {
		if (terminal.parkOrDock == 'PARK') {
			const summary: any = [];
			const dupMap: any = {};
			//
			for (let level of terminal.sectors) {
				for (let vehicle of level.subSectors) {
					const purpose: string = vehicle.declaredPurpose ? vehicle.declaredPurpose : 'None';
					let info: any = dupMap[purpose];
					//
					if (!info) {
						dupMap[purpose] = info = {};
						info.purpose = purpose;
						info.totalVehicles = 1;
					} else {
						info.totalVehicles++;
					}
				}
			}
			const keys: string[] = Object.keys(dupMap).sort();
			// Update Park Summary 
			for (let key of keys) {
				summary.push(dupMap[key]);
			}
			//
			this.truckDockMonitoring.get('parkSummary').patchValue(summary);
		}
	}

	/**
	 * Update Legend Data
	 */
	private updateLegendData(terminal: any) {
		const legendArray: any = [];
		const dupMap: any = {};
		//
		for (let level of terminal.sectors) {
			for (let vehicle of level.subSectors) {
				const purpose: string = vehicle.dockPurpose ? vehicle.dockPurpose : 'None';
				const color: string = vehicle.dockPurposeColor ? vehicle.dockPurposeColor : 'None';
				let info: any = dupMap[purpose];
				//
				if (!info) {
					dupMap[purpose] = info = {};
					info.purpose = purpose;
					info.dockPurposeColor = color
				}
			}
		}
		const keys: string[] = Object.keys(dupMap).sort();
		// Update Legend
		for (let key of keys) {
			if (key != 'None') {
				legendArray.push(dupMap[key]);
			}
		}
		//
		this.truckDockMonitoring.get('legendArray').patchValue(legendArray);
	}
	/**
	 * On Park Or Dock Click
	 * 
	 * @param event Event
	 */
	private onParkDockClick(event: any) {
		if (event && event.code) {
			this.parkOrDock = event.code;
		}
	}

	/**
	 * On Terminal Click
	 * 
	 * @param event Event
	 */
	private onTerminalClick(event: any) {
		if (event && event.code) {
			this.preferredTerminal = event.code;
		}
	}

	/**
	 * On Level Click
	 * 
	 * @param event Event
	 */
	private onLevelClick(event: any) {
		if (event && event.code) {
			this.preferredLevel = event.code == '0' ? 'G' : event.code;
		}
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
	 * On Dock Click
	 * 
	 * @param event Event
	 * @param dockInfo Dock Info
	 */
	public onDockClick(event: Event, dockInfo: any, dockInfoWindow: NgcWindowComponent) {
		if (event && event.stopPropagation) {
			event.stopPropagation();
		}
		if (dockInfoWindow && dockInfo) {
			this.truckDockMonitoring.get('dockInfo').patchValue(dockInfo);
			//
			dockInfoWindow.open();
		}
	}

	/**
	 * On Vehicle Click
	 * 
	 * @param event Event
	 * @param dockInfo Dock Info
	 */
	public onVehicleClick(event: Event, dockInfo: any, truckInfoWindow: NgcWindowComponent) {
		if (event && event.stopPropagation) {
			event.stopPropagation();
			this.tripId = dockInfo.tripId;
			this.open(truckInfoWindow);
		}
	}

	/**
	 * Gets Dock Menu
	 * 
	 * @param dockInfo Dock Info
	 */
	public getDockMenu(dockInfo: any) {
		const menu: any[] = NgcUtility.cloneArray(this.dockMenu);
		//
		if (dockInfo) {
			for (let item of menu) {
				item.disabled = false;
				//
				if (dockInfo.dockPurpose == 'TENANT') {
					item.disabled = true;
					continue;
				}
				if (!dockInfo.vehicleNo) {
					if (item.id == MENU_ACTION.RELEASE_DOCK) {
						item.disabled = true;
					}
				}
				if (!dockInfo.reservationId) {
					if (item.id == MENU_ACTION.UNRESERVE_DOCK) {
						item.disabled = true;
					}
				}
			}
			// For Identification
			menu.push({ separator: true });
			menu.push({ label: dockInfo.dockNo, id: 'DOCK', disabled: true, icon: 'fa fa-info-circle' });
		}
		return menu;
	}

	/**
	 * On Dock Context Menu Select
	 * 
	 * @param event Event
	 * @param dockInfo  Dock Info
	 */
	public onDockMenuSelect(event: any, dockInfo: any, assignWindow: NgcWindowComponent, reserveWindow: NgcWindowComponent, releaseWindow: NgcWindowComponent, adhocWindow: NgcWindowComponent, unReserveWindow: NgcWindowComponent) {
		//
		if (dockInfo) {
			this.vehicleNumber = dockInfo.vehicleNo;
			this.dockNumber = dockInfo.dockNo;
		}
		if (event) {
			switch (event.id) {
				case MENU_ACTION.ASSIGN_DOCK:
					this.dockNumber = dockInfo.dockNo;
					this.vehicleNumber = dockInfo.vehicleNo;
					this.open(assignWindow);
					break;
				case MENU_ACTION.RESERVE_DOCK:
					this.resourceId = dockInfo.resourceId;
					this.dockNumber = dockInfo.dockNo;
					this.vehicleNumber = dockInfo.vehicleNo;
					this.open(reserveWindow);
					break;
				case MENU_ACTION.RELEASE_DOCK:
					this.dockNumber = dockInfo.dockNo;
					this.vehicleNumber = dockInfo.vehicleNo;
					this.open(releaseWindow);
					break;
				case MENU_ACTION.ADHOC_CHANGE:
					this.resourceId = dockInfo.resourceId;
					this.open(adhocWindow);
					break;
				case MENU_ACTION.UNRESERVE_DOCK:
					this.reservationId = dockInfo.reservationId;
					this.resourceId = dockInfo.resourceId;
					this.open(unReserveWindow);
					break;
			}
		}
	}

	/**
	 * Gets Vehicle Menu
	 * 
	 * @param dockInfo Dock Info
	 */
	public getVehicleMenu(dockInfo: any) {
		const menu: any[] = NgcUtility.cloneArray(this.vehicleMenu);
		//
		if (dockInfo) {
			for (let item of menu) {
				item.disabled = false;
			}
			// For Identification
			menu.push({ separator: true });
			menu.push({ label: dockInfo.vehicleNo, id: 'VEHICLE', disabled: true, icon: 'fa fa-info-circle' });
		}
		return menu;
	}

	/**
	 * On Vehicle Context Menu Select
	 * 
	 * @param event Event
	 * @param dockInfo  Dock Info
	 */
	public onVehicleMenuSelect(event: any, dockInfo: any, assignWindow: NgcWindowComponent, banTruckWindow: NgcWindowComponent, releaseBanWindow: NgcWindowComponent, connectingWindow: NgcWindowComponent) {
		if (dockInfo) {
			this.vehicleNumber = dockInfo.vehicleNo;
			this.dockNumber = dockInfo.dockNo;
		}
		if (event) {
			switch (event.id) {
				case MENU_ACTION.ASSIGN_DOCK:
					this.dockNumber = dockInfo.dockNo;
					this.vehicleNumber = dockInfo.vehicleNo;
					this.open(assignWindow);
					break;
				case MENU_ACTION.BAN_TRUCK:
					this.dockNumber = dockInfo.dockNo;
					this.vehicleNumber = dockInfo.vehicleNo;
					this.open(banTruckWindow);
					break;
				case MENU_ACTION.CONNECT_TRUCK:
					this.dockNumber = dockInfo.dockNo;
					this.vehicleNumber = dockInfo.vehicleNo;
					this.open(connectingWindow);
					break;
			}
		}
	}

	/**
	 * On Ban Truck Open
	 */
	public onBanTruckOpen(banTruckScreen: CreateBanComponent) {
		if (banTruckScreen) {
			// banTruckScreen.resetValue();
			banTruckScreen.vehicleNo = this.vehicleNumber;
		}
	}

	/**
	 * On Ban Truck Save
	 */
	public onBanTruckSave(createRecordScreen: CreateBanComponent, window: NgcWindowComponent) {
		if (createRecordScreen) {
			createRecordScreen.onSave().then(() => {
				this.cancel(window);
				createRecordScreen.resetValue();
			});
		}
	}

	/**
	 * On Release Dock Open
	 */
	public onReleaseDockOpen(releaseDockScreen: ReleaseTruckDockComponent) {
		if (releaseDockScreen) {
			// releaseDockScreen.resetValue();
			releaseDockScreen.dockNo = this.dockNumber;
		}
	}

	/**
	 * On Release Dock
	 */
	public onReleaseDock(releaseDockScreen: ReleaseTruckDockComponent, window: NgcWindowComponent) {
		if (releaseDockScreen) {
			releaseDockScreen.onSave().then(() => {
				this.cancel(window);
				releaseDockScreen.resetValue();
			});
		}
	}

	/**
	 * On Reserve Dock
	 */
	public onReserveDockOpen(reserveDockScreen: ReserveTruckDockSaveComponent) {
		if (reserveDockScreen) {
			reserveDockScreen.resetValue();
			reserveDockScreen.resourceId = this.resourceId;
			reserveDockScreen.vehicleNo = this.vehicleNumber;
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
	 * On Unreserve Dock Open
	 */
	public onUnreserveDockOpen(unReserveDockScreen: UnReserveTruckDockComponent) {
		if (unReserveDockScreen) {
			unReserveDockScreen.resetValue();
			unReserveDockScreen.resourceId = this.resourceId;
			unReserveDockScreen.reservationId = this.reservationId;
			unReserveDockScreen.onSearch();
		}
	}

	/**
	 * On UnReserve Dock
	 */
	public onUnReserveDock(unReserveDockScreen: UnReserveTruckDockComponent, window: NgcWindowComponent) {
		if (unReserveDockScreen) {
			unReserveDockScreen.onSave().then(() => {
				this.cancel(window);
				unReserveDockScreen.resetValue();
			});
		}
	}

	/**
	 * On Adhoc Open
	 */
	public onAdhocOpen(adhocDockScreen: AdhocDockUpdateComponent) {
		if (adhocDockScreen) {
			adhocDockScreen.resetValue();
			adhocDockScreen.resourceId = this.resourceId;
		}
	}

	/**
	 * On Adhoc Dock
	 */
	public onAdhocDock(adhocDockScreen: AdhocDockUpdateComponent, window: NgcWindowComponent) {
		if (adhocDockScreen) {
			adhocDockScreen.onSave().then(() => {
				this.cancel(window);
			});
		}
	}

	/**
	 * On Assign Dock Open
	 */
	public onAssignDockOpen(assignDockScreen: AssignTruckDockComponent) {
		if (assignDockScreen) {
			// assignDockScreen.resetValue();
			assignDockScreen.dockNo = this.dockNumber;
			assignDockScreen.vehicleNo = this.vehicleNumber;
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

	/**
	 * Truck Park Summary
	 */
	public onTruckParkSummary(summaryWindow: NgcWindowComponent) {
		this.open(summaryWindow);
	}

	onlegendClick(summaryWindow: NgcWindowComponent) {
		this.open(summaryWindow);
	}
}