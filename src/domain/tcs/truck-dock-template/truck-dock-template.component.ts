import { OnInit } from '@angular/core';
import { Component, ElementRef, NgZone, ViewContainerRef, } from '@angular/core';
import {
	NgcFormGroup, NgcFormArray, NgcPage, PageConfiguration, NgcFormControl
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { TcsService } from '../tcs.service';

@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true
})
@Component({
	selector: 'app-truck-dock-template',
	templateUrl: './truck-dock-template.component.html',
	styleUrls: ['./truck-dock-template.component.scss']
})
export class TruckDockTemplateComponent extends NgcPage {

	constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private activatedRoute: ActivatedRoute,
		private router: Router, private service: TcsService) {
		super(appZone, appElement, appContainerElement);
	}

	public truckDockTemplateForm: NgcFormGroup = new NgcFormGroup({
		templateList: new NgcFormArray([
			new NgcFormGroup({
				select: new NgcFormControl(false)
			})
		]),
	});

	public ngOnInit() {
		super.ngOnInit();
		//
		this.getTemplateList();
	}

	getTemplateList() {
		this.service.getTemplateList().subscribe((response) => {
			if (response.data) {
				response.data.map(element => {
					if (element.active === true) {
						element.status = 'Online';
						element.action = "Restore";
					} else {
						element.status = 'Offline';
						element.action = "Make Online";
					}
				});
				this.truckDockTemplateForm.get('templateList').patchValue(response.data);
				// Enable/Disable Selection
				this.disableEnableSelection();
			}
		});
	}

	createNewTemplate() {
		this.navigate('tcs/truck-dock-maintenance', {});
	}

	updateTemplate(event) {
		if (event.column === 'templateCode') {
			this.navigateTo(this.router, 'tcs/truck-dock-maintenance', event.record);
		}
		// to update template status
		else if (event.column === 'action') {
			let request = { 'templateId': event.record.templateId };
			//
			this.service.updateTemplateStatus(request).subscribe((response) => {
				if (response) {
					if (!this.showResponseErrorMessages(response)) {
						this.showSuccessStatus("g.operation.successful");
						// Search Again
						this.getTemplateList();
					}
				}
			})
		}
	}

	deleteTemplate() {
		const selectedTemplateIds = [];
		const templateList: Array<any> = (<NgcFormArray>(this.truckDockTemplateForm.get('templateList'))).getRawValue();
		//
		templateList.forEach(template => {
			if (template.select === true) {
				selectedTemplateIds.push(template.templateId);
			}
		});
		if (selectedTemplateIds.length == 0) {
			this.showInfoStatus("master.select.atleast.one.row");
			return;
		}
		//
		this.showConfirmMessage('export.are.you.sure.to.delete').then(() => {
			if (selectedTemplateIds.length >= 0) {
				let request = { 'templateIds': selectedTemplateIds };
				//
				this.service.deleteData(request).subscribe(data => {
					this.showSuccessStatus("g.operation.successful");
					// Search Again
					this.getTemplateList();
				});
			}
		}).catch(() => {
			// Do Nothing
		});
	}

	public disableEnableSelection() {
		const formArray: NgcFormArray = this.truckDockTemplateForm.get('templateList') as NgcFormArray;
		formArray.controls.forEach((group: NgcFormGroup) => {
			if (group.get('active').value === true) {
				group.get('select').disable();
			} else {
				group.get('select').enable();
			}
		});
	}
}
