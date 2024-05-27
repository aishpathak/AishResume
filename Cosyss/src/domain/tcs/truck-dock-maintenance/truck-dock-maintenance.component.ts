import { Component, OnInit, ElementRef, NgZone, OnChanges, SimpleChanges, ViewContainerRef, } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
	NgcFormGroup, NgcFormArray, NgcPage, PageConfiguration, NgcFormControl
} from 'ngc-framework';
import { TcsService } from '../tcs.service';

@Component({
	selector: 'app-truck-dock-maintenance',
	templateUrl: './truck-dock-maintenance.component.html',
	styleUrls: ['./truck-dock-maintenance.component.scss']
})
@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true,
	autoBackNavigation: true
})
export class TruckDockMaintenanceComponent extends NgcPage {
	//
	public createPage: boolean = false;
	public title: string = '';
	public templateStatus: boolean = false;
	//
	public truckDockMaintenceForm: NgcFormGroup = new NgcFormGroup({
		templateId: new NgcFormControl(null),
		templateCode: new NgcFormControl(null, Validators.required),
		description: new NgcFormControl(null, Validators.required),
		resources: new NgcFormArray([
			new NgcFormGroup({
				zoneId: new NgcFormControl(),
				resourceCode: new NgcFormControl(),
				characteristicCode: new NgcFormControl(),
				carrierCode: new NgcFormControl(),
				countryCode: new NgcFormControl(),
				cityCode: new NgcFormControl(),
				topUrgent: new NgcFormControl(),
				customs: new NgcFormControl(),
				active: new NgcFormControl(true),
				xray: new NgcFormControl(),
				booking: new NgcFormControl(),
				walkin: new NgcFormControl(),
			})
		]),
	});

	public show: boolean = false;
	public active: boolean = false;


	constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
		private activatedRoute: ActivatedRoute, private router: Router, private service: TcsService) {
		super(appZone, appElement, appContainerElement);
	}

	ngOnInit() {
		super.ngOnInit();
		//
		this.getTemplateResources();
	}

	public getTemplateResources() {
		let request: any = this.getNavigateData(this.activatedRoute);
		//
		if (request && request.templateCode) {
			this.title = 'tcs.updateTruckDockTemplate';
			this.service.getUpdateTableData(request).subscribe((response) => {
				if (response && response.data) {
					this.show = true;
					this.truckDockMaintenceForm.patchValue(response.data);
					if (request.active === true) {
						this.active = true;
						this.disableFields();
					}
				}
			}, error => {
				this.showErrorStatus('Error:' + error);
			});
		} else {
			this.title = 'tcs.createTruckDockTemplate';
			this.createPage = true;
			this.service.creatNewTeamplate().subscribe((response) => {
				if (response && response.data) {
					this.show = true;
					this.active = false;
					this.truckDockMaintenceForm.patchValue(response.data);
				}
			}, error => {
				this.showErrorStatus('Error:' + error);
			});
		}
	}

	onSave() {
		let templateData = this.truckDockMaintenceForm.getRawValue();
		this.truckDockMaintenceForm.validate();
		if (this.truckDockMaintenceForm.invalid) {
			return;
		}
		//
		this.service.saveData(templateData).subscribe((response) => {
			if (response) {
				if (!this.showResponseErrorMessages(response)) {
					this.showSuccessStatus('g.operation.successful');
					// Back to Template List
					this.navigate('tcs/truck-dock-template', {});
				}
			}
		});
	}

	public disableFields() {
		this.truckDockMaintenceForm.disable();
		const formArray: NgcFormArray = this.truckDockMaintenceForm.get('resources') as NgcFormArray;
		//
		formArray.controls.forEach((control: NgcFormGroup) => {
			control.disable();
		});
	}

	onWalkinSelect(group) {
		const formGroup: NgcFormGroup = this.truckDockMaintenceForm.get(['resources', group]) as NgcFormGroup;
		//
		formGroup.get('booking').setValue(false);
	}

	onBookingSelect(group) {

		const formGroup: NgcFormGroup = this.truckDockMaintenceForm.get(['resources', group]) as NgcFormGroup;
		//
		formGroup.get('walkin').setValue(false);
	}

	onCountrySelect(group) {
		const formGroup: NgcFormGroup = this.truckDockMaintenceForm.get(['resources', group]) as NgcFormGroup;
		//
		if (formGroup.get('countryCode').value) {
			formGroup.get('cityCode').setValue(null);
		}
	}

	onDestSelect(group) {
		const formGroup: NgcFormGroup = this.truckDockMaintenceForm.get(['resources', group]) as NgcFormGroup;
		//
		if (formGroup.get('cityCode').value) {
			formGroup.get('countryCode').setValue(null);
		}
	}

	onActiveClick(event, group) {
		const formGroup: NgcFormGroup = this.truckDockMaintenceForm.get(['resources', group]) as NgcFormGroup;
		//
		formGroup.get('active').setValue(event);
	}
}