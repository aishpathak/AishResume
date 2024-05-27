import { Component, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TcsService } from '../tcs.service'

import {
	NgcFormGroup, NgcUtility, NgcPage, PageConfiguration, NgcFormControl
} from 'ngc-framework';
import { Validators } from '@angular/forms';

@Component({
	selector: 'app-manual-capture-event',
	templateUrl: './manual-capture-event.component.html',
	styleUrls: ['./manual-capture-event.component.scss']
})
@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true,
	autoBackNavigation: true,
	restorePageOnBack: true
})

export class ManualCaptureEventComponent extends NgcPage {
	// For date Validation
	private currentCheckpointSourceId: string;
	private currentTrigger: string;
	private purposeFlag: boolean = false;
	private purposeSelect: string;
	//
	public manualCapture: NgcFormGroup = new NgcFormGroup({
		vehicleNo: new NgcFormControl(null, [Validators.required, Validators.maxLength(10)]),
		checkpointDevice: new NgcFormControl(),
		timestamp: new NgcFormControl(new Date(), Validators.required),
		//trigger: new NgcFormControl(),
		dockNo: new NgcFormControl(),
		device: new NgcFormControl(),
		purposeCompanyId: new NgcFormControl(),
		purpose: new NgcFormControl()
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
		super(appZone, appElement, appContainerElement);

	}
	/*
	Method to save event 
	*/
	public onSave() {
		const request: any = this.manualCapture.value;
		//
		this.manualCapture.validate();
		//
		if (this.manualCapture.invalid) {
			return;
		}
		//
		this.service.triggerEvent(request).subscribe((response) => {
			if (response) {
				if (response.data.responseCode == "DECLARE_PURPOSE") {
					this.purposeFlag = true;
					return;
				} else if (response.data.responseCode == "FAILURE") {
					this.showErrorStatus(response.data.responseMessage);
					return;
				}
				if (response.data.responseCode) {
					this.showInfoStatus(response.data.responseCode);
				} else {
					this.showSuccessStatus('g.operation.successful');
				}
				this.reloadPage();
			}
		}, error => {
			this.showErrorMessage(error);
		});
	};
	/**
	 * On Purpose Select
	 */
	private onPurposeSelect(event) {
		if (event) {
			this.purposeSelect = event.code;
		}
	}
}
