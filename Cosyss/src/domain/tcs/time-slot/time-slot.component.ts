// Angular
import { Component, ElementRef, EventEmitter, Input, NgZone, Output, ViewChild, ViewContainerRef, } from '@angular/core';
import {
	NgcPage, PageConfiguration, NgcWindowComponent,
	NgcFormArray, NgcFormGroup, NgcFormControl,
	NgcUtility, DateTimeKey
} from 'ngc-framework';
// TCS
import { TcsService } from '../tcs.service'

@Component({
	selector: 'tcs-time-slot',
	templateUrl: './time-slot.component.html',
	styleUrls: ['./time-slot.component.scss']
})
@PageConfiguration({ trackInit: true, callNgOnInitOnClear: true })
export class TimeSlotComponent extends NgcPage {
	//
	private _purpose: string;
	private _duration: number;
	private _terminal: string;
	private _level: string;
	private _xRay: boolean;
	private _zone: string;
	private _vehicleType: string;
	private _customs: boolean;
	//
	private showInfo: boolean = false;
	private slotsHeader: Array<any> = [];
	private slotsHeader24: Array<any> = [];
	//
	@Output('select')
	private selectEmitter: EventEmitter<any> = new EventEmitter<any>();
	//
	@ViewChild('slotWindow')
	private window: NgcWindowComponent;
	//
	private form: NgcFormGroup = new NgcFormGroup({
		// Slots
		slot: new NgcFormGroup({
			purpose: new NgcFormControl(),
			duration: new NgcFormControl(15),
			terminal: new NgcFormControl(),
			level: new NgcFormControl(),
			zone: new NgcFormControl(),
			vehicleType: new NgcFormControl(),
			xRay: new NgcFormControl(false),
			customs: new NgcFormControl(false),
			slotStartDate: new NgcFormControl(),
			slotEndDate: new NgcFormControl(),
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
		//
		const day: Date = NgcUtility.getCurrentDateOnly();
		// Slots Header (96 Slots)
		for (let index = 0; index < 96; index++) {
			const header: any = {};
			//
			header.from = NgcUtility.addDate(day, index * 15, DateTimeKey.MINUTES);
			header.till = NgcUtility.addDate(header.from, 15, DateTimeKey.MINUTES);
			header.column = NgcUtility.getTimeAsString(header.from) + "-" + NgcUtility.getTimeAsString(header.till);
			//
			this.slotsHeader.push(header);
		}
		// Slots Header (24 Slots)
		for (let index = 0; index < 24; index++) {
			const header: any = {};
			//
			header.from = NgcUtility.addDate(day, index * 60, DateTimeKey.MINUTES);
			header.till = NgcUtility.addDate(header.from, 60, DateTimeKey.MINUTES);
			header.column = NgcUtility.getTimeAsString(header.from) + "-" + NgcUtility.getTimeAsString(header.till);
			//
			this.slotsHeader24.push(header);
		}
	}

	/**
	 * Sets Purpose
	 */
	@Input('purpose')
	public set purpose(purpose: string) {
		if (this._purpose != purpose) {
			this._purpose = purpose;
			//
			this.form.get('slot.purpose').setValue(this._purpose);
		}
	}

	/**
	 * Gets Purpose
	 */
	public get purpose(): string {
		return this._purpose;
	}

	/**
	 * Sets Duration
	 */
	@Input('duration')
	public set duration(duration: number) {
		if (this._duration != duration) {
			this._duration = duration;
			//
			this.form.get('slot.duration').setValue(this._duration);
		}
	}

	/**
	 * Gets Duration
	 */
	public get duration(): number {
		return this._duration;
	}

	/**
	 * Sets Terminal
	 */
	@Input('terminal')
	public set terminal(terminal: string) {
		if (this._terminal != terminal) {
			this._terminal = terminal;
			//
			this.form.get('slot.terminal').setValue(this._terminal);
		}
	}

	/**
	 * Gets Terminal
	 */
	public get terminal(): string {
		return this._terminal;
	}

	/**
	 * Sets Level
	 */
	@Input('level')
	public set level(level: string) {
		if (this._level != level) {
			this._level = level;
			//
			this.form.get('slot.level').setValue(this._level);
		}
	}

	/**
	 * Gets Level
	 */
	public get level(): string {
		return this._level;
	}

	/**
	 * Sets Vehicle Type
	 */
	@Input('vehicleType')
	public set vehicleType(vehicleType: string) {
		if (this._vehicleType != vehicleType) {
			this._vehicleType = vehicleType;
			//
			this.form.get('slot.vehicleType').setValue(this._vehicleType);
		}
	}

	/**
	 * Gets Vehicle Type
	 */
	public get vehicleType(): string {
		return this._vehicleType;
	}

	/**
	 * Sets Zone
	 */
	@Input('zone')
	public set zone(zone: string) {
		if (this._zone != zone) {
			this._zone = zone;
			//
			this.form.get('slot.zone').setValue(this._zone);
		}
	}

	/**
	 * Gets Zone
	 */
	public get zone(): string {
		return this._zone;
	}

	/**
	 * Sets X Ray
	 */
	@Input('xRay')
	public set xRay(xRay: boolean) {
		if (this._xRay != xRay) {
			this._xRay = xRay;
			//
			this.form.get('slot.xRay').setValue(this._xRay);
		}
	}

	/**
	 * Gets X Ray
	 */
	public get xRay(): boolean {
		return this._xRay;
	}

	/**
	 * Sets Customs
	 */
	@Input('customs')
	public set customs(customs: boolean) {
		if (this._customs != customs) {
			this._customs = customs;
			//
			this.form.get('slot.customs').setValue(this._customs);
		}
	}

	/**
	 * Gets Customs
	 */
	public get customs(): boolean {
		return this._customs;
	}

	/**
	 * Show Time Slot
	 */
	public showTimeSlot() {
		this.onFreeSlots();
	}

	/**
	 * Show Free Slots
	 */
	private onFreeSlots() {
		(this.form.get('slot') as NgcFormControl).validate();
		//
		if (this.form.get('slot').invalid) {
			return;
		}
		const startTime: Date = new Date();
		//
		this.service.getFreeSlots(this.form.get('slot').value).subscribe((response) => {
			if (response && response.data) {
				const endTime: Date = new Date();
				const duration: number = NgcUtility.dateDifference(endTime, startTime);
				//
				for (let day of response.data) {
					for (let slot of day.freeSlots) {
						slot.selected = false;
					}
				}
				//
				this.form.get('slot.requestDuration').setValue(duration);
				this.form.get('slot.days').patchValue(response.data);
				this.window.open();
			} else {
				this.showInfoStatus("no.record");
			}
		});
	}

	/**
	 * On Time Slot Selection
	 * 
	 * @param slotItem Slot Item
	 */
	private onTimeSlotSelection(slotItem: NgcFormGroup) {
		if (slotItem && slotItem.get('reservable').value) {
			const selectedItem: any = slotItem.value;
			//
			this.form.get('slot.slotStartDate').setValue(selectedItem.slotFromDateTime);
			this.form.get('slot.slotEndDate').setValue(NgcUtility.addDate(
				this.form.get('slot.slotStartDate').value,
				this.form.get('slot.duration').value,
				DateTimeKey.MINUTES));
			//
			if (this.selectEmitter.observers.length > 0) {
				this.selectEmitter.emit(selectedItem);
			}
			// Update
			this.updateTimeSlotSelectionOnSlots(slotItem);
		}
	}

	/**
	 * On Date Time Change
	 */
	private onDateTimeChange() {
		const startDate: Date = this.form.get('slot.slotStartDate').value;
		//
		if (!startDate) {
			return;
		}
		//
		const daysArray: NgcFormArray = this.form.get('slot.days') as NgcFormArray;
		let slotItem: NgcFormGroup = null;
		let findNextReservable: boolean = false;
		//
		if (daysArray) {
			for (let dayIndex: number = 0; dayIndex < daysArray.controls.length; dayIndex++) {
				const dayGroup: NgcFormGroup = daysArray.get([dayIndex]) as NgcFormGroup;
				const slotsArray: NgcFormArray = dayGroup.get('freeSlots') as NgcFormArray;
				//
				if (slotsArray) {
					for (let slotIndex: number = 0; slotIndex < slotsArray.controls.length; slotIndex++) {
						const slotGroup: NgcFormGroup = slotsArray.get([slotIndex]) as NgcFormGroup;
						const slotFrom: Date = slotGroup.get('slotFromDateTime').value;
						const slotTill: Date = slotGroup.get('slotTillDateTime').value;
						//
						if (!findNextReservable) {
							if (NgcUtility.dateDifference(startDate, slotFrom) >= 0
								&& NgcUtility.dateDifference(startDate, slotTill) < 0) {
								//
								if (slotGroup.get('reservable').value) {
									slotItem = slotGroup;
									break;
								} else {
									findNextReservable = true;
								}
							}
						} else {
							if (slotGroup.get('reservable').value) {
								slotItem = slotGroup;
								break;
							}
						}
					}
				}
				if (slotItem) {
					break;
				}
			}
		}
		if (slotItem) {
			this.onTimeSlotSelection(slotItem);
		} else {
			this.form.get('slot.slotStartDate').setValue(null);
			this.form.get('slot.slotEndDate').setValue(null);
		}
	}

	/**
	 * Update Time Slot Selection
	 * 
	 * @param slotItem Slot Item
	 */
	private updateTimeSlotSelectionOnSlots(slotItem: NgcFormGroup) {
		const days: NgcFormArray = this.form.get('slot.days') as NgcFormArray;
		const startDate: Date = this.form.get('slot.slotStartDate').value;
		const duration: number = this.form.get('slot.duration').value;
		let slots: number = Math.ceil(duration / 15);
		slots += (duration - (slots * 15)) > 0 ? 1 : 0;
		const endDate: Date = NgcUtility.addDate(startDate, slots * 15, DateTimeKey.MINUTES);
		//
		if (days) {
			days.controls.forEach((control: NgcFormGroup) => {
				const slots: NgcFormArray = control.get('freeSlots') as NgcFormArray;
				//
				slots.controls.forEach((group: NgcFormGroup) => {
					const from: Date = group.get('slotFromDateTime').value;
					const till: Date = group.get('slotTillDateTime').value;
					const between: boolean = NgcUtility.dateDifference(from, startDate) >= 0
						&& NgcUtility.dateDifference(from, endDate) < 0;
					//
					if (between) {
						group.get('selected').setValue(true, { onlySelf: true, emitEvent: false });
					} else {
						group.get('selected').setValue(false, { onlySelf: true, emitEvent: false });
					}
				});
			});
		}
	}

	/**
	 * Close Window
	 */
	private onClose(window: NgcWindowComponent) {
		window.close();
	}

	/**
	 * On Info
	 */
	private onInfo() {
		this.showInfo = !this.showInfo;
	}

}
