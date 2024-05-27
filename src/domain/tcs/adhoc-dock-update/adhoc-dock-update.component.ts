import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, OnChanges, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TcsService } from '../tcs.service'
import { Validators } from '@angular/forms';
import {
	NgcFormGroup, NgcUtility, NgcPage,
	PageConfiguration, NgcFormControl
} from 'ngc-framework';
import { AdhocUpdateChange } from '../tcs.sharedmodel';

@Component({
	selector: 'app-adhoc-dock-update',
	templateUrl: './adhoc-dock-update.component.html',
	styleUrls: ['./adhoc-dock-update.component.scss']
})
@PageConfiguration({
	trackInit: true,
	callNgOnInitOnClear: true,
	autoBackNavigation: true,
	restorePageOnBack: true
})
export class AdhocDockUpdateComponent extends NgcPage {
	//
	private onsearch: Boolean = false;
	//
	private _resourceId: number;
	public popup: boolean = false;
	//
	//
	adhocDockUpdateForm: NgcFormGroup = new NgcFormGroup({
		search: new NgcFormGroup({
			resourceId: new NgcFormControl(null, Validators.required)
		}),
		dockUpdate: new NgcFormGroup({
			carrier: new NgcFormControl(),
			country: new NgcFormControl(),
			destination: new NgcFormControl(),
			firstPurpose: new NgcFormControl(null, Validators.required),
			secondPurpose: new NgcFormControl(),
			thirdPurpose: new NgcFormControl(),
			fourthPurpose: new NgcFormControl(),
			fifthPurpose: new NgcFormControl(),
			flightDate: new NgcFormControl(),
			flightKey: new NgcFormControl(),
			xray: new NgcFormControl(),
			changeFromDateTime: new NgcFormControl(new Date(), Validators.required),
			changeTillDateTime: new NgcFormControl(new Date(), Validators.required),
			shc: new NgcFormControl(),
		}),
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
		super(appZone, appElement, appContainerElement); { }
	}

	/**
 * Sets Dock No.
 */
	@Input('resourceId')
	public set resourceId(resourceId: number) {
		if (this._resourceId != resourceId) {
			this._resourceId = resourceId;
			//
			this.adhocDockUpdateForm.get('search.resourceId').setValue(this._resourceId);
			this.onSearch();
		}
		this.popup = true;
	}

	/**
	 * Gets Dock No.
	 */
	public get resourceId(): number {
		return this._resourceId;
	}

	//To search for dock for Adhock Change
	public onSearch() {
		const searchGroup: NgcFormGroup = (this.adhocDockUpdateForm.get('search') as NgcFormGroup);
		//	Pre form Validation
		searchGroup.validate();
		//
		if (searchGroup.invalid) {
			return;
		}
		this.onsearch = false;
		const request: any = (this.adhocDockUpdateForm.get('search') as NgcFormGroup).getRawValue();
		//In case form is invalid
		this.service.searchAdhocUpdate(request).subscribe((response) => {
			if (!this.showResponseErrorMessages(response)) {
				this.adhocDockUpdateForm.get('dockUpdate').patchValue(response.data);
				this.onsearch = true;
			}
		}, error => {
			this.showErrorMessage(error)
		});
	}

	/**
	 * Save data for adhock Change
	 */
	public onSave(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			const searchGroup = (this.adhocDockUpdateForm.get('dockUpdate') as NgcFormGroup);
			//Pre form Validation
			searchGroup.validate();
			//In case form is invalid
			if (searchGroup.invalid) {
				return;
			}
			const request: AdhocUpdateChange = (this.adhocDockUpdateForm.get('dockUpdate') as NgcFormGroup).getRawValue();
			// Saving Data
			this.service.saveAdhocUpdate(request).subscribe((response) => {
				if (response) {
					if (!this.refreshFormMessages(response)) {
						this.showSuccessStatus("g.operation.successful");
						resolve(true);
					}
				}
			}, error => {
				this.showErrorMessage(error)
			});
			this.onsearch = false;
		});
	}

	/**
	 * Reset Value
	 */
	public resetValue(): void {
		this.adhocDockUpdateForm.reset();
		this.clearAllFormControlMessages();
		//
		if (this._resourceId) {
			this.adhocDockUpdateForm.get('resourceId').setValue(this._resourceId);
		}
		this.adhocDockUpdateForm.clearErrors();
		this.adhocDockUpdateForm.markAsPristine();
	}
}
