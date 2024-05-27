// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, PageConfiguration } from 'ngc-framework';

import {
  Component, OnInit, NgZone, ElementRef, ViewContainerRef, forwardRef, ComponentRef,
  ComponentFactoryResolver, ViewChild, ViewChildren, ContentChildren, QueryList,
  Input, Output, EventEmitter
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NgcPage, CacheService, UserProfile, UserFavourite, NgcApplication,
  NgcFormGroup, NgcFormArray, NgcFormControl, MessageType, StatusMessage, NgcWindowComponent, NgcDropDownListComponent, ErrorMessage
} from 'ngc-framework';
import { FormGroupDirective, FormArray, FormGroup, FormControl, FormControlName, Validators } from '@angular/forms';
import { viewParentEl } from '@angular/core/src/view/util';
import { Console } from 'console';

@Component({
  selector: 'app-duplicatenamepopup',
  templateUrl: './duplicatenamepopup.component.html',
  styleUrls: ['./duplicatenamepopup.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class DuplicatenamepopupComponent extends NgcApplication implements OnInit {

  @ViewChild('duplicateNamePopup') duplicateNamePopup: NgcWindowComponent;
  @Output('onConfirmNewEntry') onConfirmNewEntry = new EventEmitter<Boolean>();
  @Output('onNameSelect') onNameSelect = new EventEmitter<String>();
  @Output('onClose') onClose = new EventEmitter<String>();
  @Output('onCancelClear') onCancelClear = new EventEmitter<Number>();


  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    appComponentResolver: ComponentFactoryResolver, private router: Router, private activatedRouter: ActivatedRoute) {
    super(appZone, appElement, appContainerElement, appComponentResolver);
  }

  selectedName: any;
  items: any[];
  index: any;
  isAuthorizedPersonnelScreen: boolean = false;
  windowTitle: string = 'Multiple Names against same IC/Airport Pass Number';

  private duplicateNamesForm: NgcFormGroup = new NgcFormGroup({
    duplicateNames: new NgcFormControl()
  })

  ngOnInit() {
    // this.titlecheck();
  }

  // titlecheck() {
  //   this.windowTitle = this.isAuthorizedPersonnelScreen ? "Duplicate Entries" : "Duplicate Names";
  // }

  open(personList: any, index?: number) {
    if (index != null) {
      this.index = index;
    }
    this.items = personList;
    this.duplicateNamesForm.reset();
    this.selectedName = null;
    this.duplicateNamePopup.open();
  }

  close() {
    this.onClose.emit(null);
    this.duplicateNamePopup.close();
  }

  confirmNewEntry() {
    this.onConfirmNewEntry.emit(false);
    this.duplicateNamePopup.close();
  }

  nameSelect() {
    // Method to populate name

    if (!this.selectedName) {
      this.showErrorMessage('Please select a name');
      return;
    }
    this.onNameSelect.emit(this.selectedName);
    this.duplicateNamePopup.close();
  }

  onNameChange(event) {
    this.selectedName = event;
  }

  cancelClear() {
    this.onCancelClear.emit(this.index);
    this.duplicateNamePopup.close();
  }

}
