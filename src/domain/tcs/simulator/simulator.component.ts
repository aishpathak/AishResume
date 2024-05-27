
// Angular
import { Component, ElementRef, NgZone, ViewContainerRef, } from '@angular/core';
import { Validators } from '@angular/forms';
import {
	NgcPage, PageConfiguration, NgcFormGroup, NgcFormArray, NgcFormControl,
	NgcUtility, NgcWindowComponent, DateTimeKey
} from 'ngc-framework';
// TCS
import { TcsService } from '../tcs.service'
import { TimeSlotComponent } from '../time-slot/time-slot.component';

@Component({
	selector: 'app-simulator',
	templateUrl: './simulator.component.html',
	styleUrls: ['./simulator.component.scss']
})
@PageConfiguration({ trackInit: true, callNgOnInitOnClear: true })
export class SimulatorComponent extends NgcPage {
	//
	private triggerSourceId: string;
	private blankCheckpointSourceId: string;
	private checkpointSourceId: string;
	private entryCheckpointSourceId: string;
	private exitCheckpointSourceId: string;
	private currentCheckpointSourceId: string;
	private purposeSourceId: string;
	//
	private currentTrigger: string;
	private declare: boolean = false;
	//
	private form: NgcFormGroup = new NgcFormGroup({
		// Device API Simulator
		entry: new NgcFormGroup({
			kioskId: new NgcFormControl(),
			vehicleNo: new NgcFormControl(),
			qrCode: new NgcFormControl(NgcUtility.generateUUID()),
			seqNo: new NgcFormControl(1234567890),
			timeStamp: new NgcFormControl(new Date()),
			image: new NgcFormControl(),
		}),
		exit: new NgcFormGroup({
			kioskId: new NgcFormControl(),
			vehicleNo: new NgcFormControl(),
			qrCode: new NgcFormControl(NgcUtility.generateUUID()),
			seqNo: new NgcFormControl(1234567890),
			timeStamp: new NgcFormControl(new Date())
		}),
		key: new NgcFormGroup({
			kioskId: new NgcFormControl(),
			keyCode: new NgcFormControl(),
			layer: new NgcFormControl(1),
			seqNo: new NgcFormControl(1234567890),
			timeStamp: new NgcFormControl(new Date()),
		}),
		checkpoint: new NgcFormGroup({
			kioskId: new NgcFormControl(),
			vehicleNo: new NgcFormControl(),
			seqNo: new NgcFormControl(1234567890),
			timeStamp: new NgcFormControl(new Date())
		}),
		dock: new NgcFormGroup({
			kioskId: new NgcFormControl(),
			vehicleNo: new NgcFormControl(),
			dockId: new NgcFormControl(),
			status: new NgcFormControl(1),
			seqNo: new NgcFormControl(1234567890),
			timeStamp: new NgcFormControl(new Date()),
		}),
		kiosk: new NgcFormGroup({
			kioskId: new NgcFormControl(),
			seqNo: new NgcFormControl(1234567890),
			timeStamp: new NgcFormControl(new Date())
		}),
		// Device Events
		device: new NgcFormGroup({
			vehicleNo: new NgcFormControl(),
			qrCode: new NgcFormControl(NgcUtility.generateUUID()),
			dockNo: new NgcFormControl(),
			purpose: new NgcFormControl(),
			purposeCompanyId: new NgcFormControl(),
			trigger: new NgcFormControl(),
			device: new NgcFormControl()
		}),
		// Trip
		trip: new NgcFormGroup({
			tripId: new NgcFormControl(),
			vehicleNo: new NgcFormControl(),
			allocatedResourceCode: new NgcFormControl(),
			currentLocation: new NgcFormControl(),
			status: new NgcFormControl(),
			vehicleImage: new NgcFormControl(),
			events: new NgcFormArray([])
		}),
		// Slots
		slot: new NgcFormGroup({
			slotPurpose: new NgcFormControl(),
			slotDuration: new NgcFormControl(15),
			terminal: new NgcFormControl('T2'),
			level: new NgcFormControl('G'),
			zone: new NgcFormControl(),
			vehicleType: new NgcFormControl(),
			xRay: new NgcFormControl(),
			customs: new NgcFormControl(),
			requestDuration: new NgcFormControl(),
			days: new NgcFormArray([])
		}),
	});

	/**
	 * Initialize
	 * 
	 * @param appZone Zone
	 * @param appElement Element
	 * @param appContainerElement Container Element
	 * @param service TCS Service
	 */
	constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
		private service: TcsService) {
		super(appZone, appElement, appContainerElement);
	}

	/**
	 * On Init
	 */
	public ngOnInit(): void {
		super.ngOnInit();
		// Create Temporary Drop Downs
		this.triggerSourceId = NgcUtility.createAndCacheSourceByObjectList([
			{ code: 'ENTER', desc: 'Enter Terminal (At Gate)' },
			{ code: 'CHECKPOINT', desc: 'Checkpoint' },
			{ code: 'OCCUPY', desc: 'Occupy Dock' },
			{ code: 'LEAVE', desc: 'Leaving Dock' },
			{ code: 'EXIT', desc: 'Exit Terminal (At Gate)' },
		]);
		this.blankCheckpointSourceId = NgcUtility.createAndCacheSourceByObjectList([
			{ code: 'NONE', desc: 'Default' },
		]);
		this.checkpointSourceId = NgcUtility.createAndCacheSourceByObjectList([
			{ code: 'GE1', desc: 'G/F Terminal Entrance Gate GE1' },
			{ code: 'GE2', desc: 'G/F Terminal Entrance Gate GE2' },
			{ code: '1E1', desc: '1/F Terminal Entrance Gate 1E1' },
			{ code: '1E2', desc: '1/F Terminal Entrance Gate 1E2' },
			{ code: 'GE4', desc: 'G/F Truck Dock Area Entrance GE4' },
			{ code: 'GE5', desc: 'G/F Truck Dock Area Entrance GE5' },
			{ code: 'GE6', desc: 'G/F Truck Dock Area Entrance GE6' },
			{ code: '1E3', desc: '1/F Truck Dock Area Entrance 1E3' },
			{ code: '2E1', desc: '2/F Truck Dock Area Entrance 2E1' },
			{ code: '3E1', desc: '3/F Truck Dock Area Entrance 3E1' },
			{ code: '1X1', desc: '1/F Truck Dock Area Exit 1X1' },
			{ code: '2X1', desc: '2/F Truck Dock Area Exit 2X1' },
			{ code: '3X1', desc: '3/F Truck Dock Area Exit 3X1' },
			{ code: 'GX1', desc: 'Terminal Exit Gate GX1' },
			{ code: 'GX2', desc: 'Terminal Exit Gate GX2' },
			{ code: 'GX3', desc: 'Terminal Exit Gate GX3' },
		]);
		this.entryCheckpointSourceId = NgcUtility.createAndCacheSourceByObjectList([
			{ code: 'GE1', desc: 'G/F Terminal Entrance Gate GE1' },
			{ code: 'GE2', desc: 'G/F Terminal Entrance Gate GE2' },
			{ code: '1E1', desc: '1/F Terminal Entrance Gate 1E1' },
			{ code: '1E2', desc: '1/F Terminal Entrance Gate 1E2' }
		]);
		this.exitCheckpointSourceId = NgcUtility.createAndCacheSourceByObjectList([
			{ code: 'GX1', desc: 'Terminal Exit Gate GX1' },
			{ code: 'GX2', desc: 'Terminal Exit Gate GX2' },
			{ code: 'GX3', desc: 'Terminal Exit Gate GX3' },
		]);
		this.purposeSourceId = NgcUtility.createAndCacheSourceByObjectList([
			{ code: 'EXPORT_BULK', desc: 'Export Bulk' },
			{ code: 'EXPORT_COURIER', desc: 'Export Courier' },
			{ code: 'EXPORT_PERISHABLE', desc: 'Export Perishable' },
			{ code: 'EXPORT_PREPACKED', desc: 'Export Prepacked' },
			{ code: 'EXPORT_VALUEABLE', desc: 'Export Valueable' },
			{ code: 'IMPORT_BULK', desc: 'Import Bulk' },
			{ code: 'IMPORT_COURIER', desc: 'Import Courier' },
			{ code: 'IMPORT_PERISHABLE', desc: 'Import Perishable' },
			{ code: 'IMPORT_PREPACKED', desc: 'Import Prepacked' },
			{ code: 'IMPORT_VALUEABLE', desc: 'Import Valueable' },
			{ code: 'SCHEDULE_COLLECTION', desc: 'Schedule Collection' },
			{ code: 'TENANT', desc: 'Tenant' },
			{ code: 'ULD_HANDLING', desc: 'ULD Handling' },
		]);
		// Default
		this.currentCheckpointSourceId = this.blankCheckpointSourceId;
	}

	/**
	 * On Trigger Select
	 * 
	 * @param event Event
	 */
	private onTriggerSelect(event) {
		if (event) {
			this.currentTrigger = event.code;
			this.form.get('device.vehicleNo').clearValidators();
			this.form.get('device.dockNo').clearValidators();
			this.form.get('device.purpose').clearValidators();
			this.form.get('device.purpose').setValue(null);
			this.form.get('device.purposeCompanyId').setValue(null);
			this.form.get('device.device').setValue(null);
			this.declare = false;
			//
			switch (event.code) {
				case 'ENTER':
					this.currentCheckpointSourceId = this.entryCheckpointSourceId;
					break;
				case 'EXIT':
					this.currentCheckpointSourceId = this.exitCheckpointSourceId;
					this.form.get('device.vehicleNo').setValidators(Validators.required);
					break;
				case 'CHECKPOINT':
					this.currentCheckpointSourceId = this.checkpointSourceId;
					this.form.get('device.vehicleNo').setValidators(Validators.required);
					break;
				default:
					this.currentCheckpointSourceId = this.blankCheckpointSourceId;
					this.form.get('device.dockNo').setValidators(Validators.required);
					break;
			}
		}
	}

	/**
	 * On Trigger
	 */
	private onTrigger() {
		(this.form.get('device') as NgcFormGroup).validate();
		//
		if (this.form.get('device').valid) {
			//
			this.service.simulate(this.form.get('device').value).subscribe((response) => {
				if (response && response.data) {
					const trigger: string = this.form.get('device.trigger').value;
					const purpose: string = this.form.get('device.purpose').value;
					//
					if (response.data.responseMessage) {
						this.showInfoStatus(response.data.responseMessage);
					}
					//
					if (trigger == 'ENTER') {
						if (!purpose) {
							if (response.data.responseCode == 'DECLARE_PURPOSE') {
								this.declare = true;
								this.form.get('device.purpose').setValidators(Validators.required);
							}
						}
					}
					//
					if (!response.data.responseMessage) {
						this.showSuccessStatus("Done!");
					}
				}
			});
		}
	}

	/**
	 * Show Trip Information
	 */
	private onTrip(window: NgcWindowComponent) {
		this.service.simulatorTrip(this.form.get('device').value).subscribe((response) => {
			if (response && response.data) {
				this.form.get('trip').patchValue(response.data);
				window.open();
			} else {
				this.showInfoStatus("No Record");
			}
		});
	}

	/**
	 * Close Window
	 */
	private onClose(window: NgcWindowComponent) {
		window.close();
	}

	/**
	 * Show Free Slots
	 */
	private onFreeSlots(timeSlotComponent: TimeSlotComponent) {
		// Set Parameters
		timeSlotComponent.purpose = this.form.get('slot.slotPurpose').value;
		timeSlotComponent.duration = this.form.get('slot.slotDuration').value;
		timeSlotComponent.terminal = this.form.get('slot.terminal').value;
		timeSlotComponent.level = this.form.get('slot.level').value;
		timeSlotComponent.zone = this.form.get('slot.zone').value;
		timeSlotComponent.vehicleType = this.form.get('slot.vehicleType').value;
		// Open
		timeSlotComponent.showTimeSlot();
	}

	/**
	 * Generate Slots
	 */
	public onGenerateSlots() {
		this.service.simulatorGenerateSlots({}).subscribe((response) => {
			this.showSuccessStatus("Done!");
		});
	}

	/**
	 * Vehicle At Entry Gate
	 */
	public onVehicleAtEntryGate() {
		const group: NgcFormGroup = this.form.get('entry') as NgcFormGroup;
		const request: any = group.value;
		//
		this.service.simulateVehicleAtGate(request).subscribe((response) => {
			if (response && (response as any).returnCode) {
				this.showErrorStatus((response as any).returnMessage);
			} else {
				this.showSuccessStatus("Done!");
			}
		});
	}

	/**
	 * Vehicle At Exit Gate
	 */
	public onVehicleAtExitGate() {
		const group: NgcFormGroup = this.form.get('exit') as NgcFormGroup;
		const request: any = group.value;
		//
		this.service.simulateVehicleAtGate(request).subscribe((response) => {
			if (response && (response as any).returnCode) {
				this.showErrorStatus((response as any).returnMessage);
			} else {
				this.showSuccessStatus("Done!");
			}
		});
	}

	/**
	 * Update Kiosk Status
	 */
	public onUpdateKioskStatus() {
		const group: NgcFormGroup = this.form.get('kiosk') as NgcFormGroup;
		const request: any = group.value;
		//
		this.service.simulateUpdateKioskStatus(request).subscribe((response) => {
			if (response && (response as any).returnCode) {
				this.showErrorStatus((response as any).returnMessage);
			} else {
				this.showSuccessStatus("Done!");
			}
		});
	}

	/**
	 * Update Dock Status
	 */
	public onUpdateDockStatus() {
		const group: NgcFormGroup = this.form.get('dock') as NgcFormGroup;
		const request: any = group.value;
		//
		this.service.simulateUpdateDockStatus(request).subscribe((response) => {
			if (response && (response as any).returnCode) {
				this.showErrorStatus((response as any).returnMessage);
			} else {
				this.showSuccessStatus("Done!");
			}
		});
	}

	/**
	 * Kiosk Key Press
	 */
	public onKioskKeyPress(keyCode: string) {
		const group: NgcFormGroup = this.form.get('key') as NgcFormGroup;
		const request: any = group.value;
		//
		request.keyCode = keyCode;
		//
		this.service.simulateKioskPressKey(request).subscribe((response) => {
			if (response && (response as any).returnCode) {
				this.showErrorStatus((response as any).returnMessage);
			} else {
				this.showSuccessStatus("Done!");
			}
		});
	}

	/**
	 * Log Event
	 */
	public onLogEvent() {
		const group: NgcFormGroup = this.form.get('checkpoint') as NgcFormGroup;
		const request: any = group.value;
		//
		this.service.simulateLogEvent(request).subscribe((response) => {
			if (response && (response as any).returnCode) {
				this.showErrorStatus((response as any).returnMessage);
			} else {
				this.showSuccessStatus("Done!");
			}
		});
	}
}
