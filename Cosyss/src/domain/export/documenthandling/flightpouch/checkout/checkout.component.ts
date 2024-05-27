import { FlightpouchService } from './../flightpouch.service';
import { FlightPouchRequest, FlightPouchBO, FlightPouchResponse } from './../flightpouch.shared';
import { DocumentService } from '../../document/document.service';

import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, NgcInputComponent, PageConfiguration
} from 'ngc-framework';

import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, OnInit, ViewChild, OnDestroy
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})

export class CheckoutComponent extends NgcPage implements OnInit, OnDestroy {

  @ViewChild('pouchId') pouchId: NgcInputComponent;
  previousRoute: any;
  displayFlag = false;
  // sessionDetails = null;

  checkoutForm: NgcFormGroup = new NgcFormGroup({
    pouchId: new NgcFormControl(),
    flightNumber: new NgcFormControl(),
    flightOriDate: new NgcFormControl(),
    phlocId: new NgcFormControl(),
    status: new NgcFormControl(),
    locationName: new NgcFormControl(),
    validationFlag: new NgcFormControl(false)
  })

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.pouchId.focus();
  }

  constructor(appZone: NgZone, appElement: ElementRef, private documentService: DocumentService,
    appContainerElement: ViewContainerRef, private router: Router, private flightpouchService: FlightpouchService) {
    super(appZone, appElement, appContainerElement);
    this.previousRoute = sessionStorage.getItem('previousRoute');
    console.log('CHECKOUT : ' + this.previousRoute);
    sessionStorage.setItem('previousRoute', this.router.url);
  }

  pouchTrimming() {
    let trimmedPouchId = this.documentService.trimPouch(this.checkoutForm.get("pouchId").value);
    this.checkoutForm.controls.pouchId.setValue(trimmedPouchId);
    this.updatePouchCheckout();
  }

  updatePouchCheckout() {
    let resp: any;
    let request: FlightPouchRequest = new FlightPouchRequest();
    request.pouchId = this.checkoutForm.get("pouchId").value;
    // request.officeId = '1';
    // request.modifiedBy = '';
    request.tempType = "checkout";
    request.validationFlag = this.checkoutForm.get("validationFlag").value;

    if (request.pouchId == null || request.pouchId == "") {
      this.pouchId.focus();
      return;
    }
    else {
      request.pouchId = this.checkoutForm.get("pouchId").value == null ? "" : this.checkoutForm.get("pouchId").value.toUpperCase();
      this.flightpouchService.updatePouchCheckout(request).subscribe(responseBean => {
        resp = responseBean.data;
        if (!this.showFormErrorMessages(responseBean)) {
          this.checkoutForm.patchValue(resp);
          this.displayFlag = true;
          if (resp.status == "Ready") {
            this.showSuccessStatus("export.pouch.moved.to.checkout.area");
          } else {
            this.showErrorStatus("export.pouch.not.finalized");
          }
        }
        this.checkoutForm.controls.pouchId.setValue("");
        this.checkoutForm.controls.validationFlag.setValue(false);
        this.pouchId.focus();
      }, error => {
        this.showErrorStatus("export.unable.fetch.details");
        this.checkoutForm.controls.pouchId.setValue("");
        this.pouchId.focus();
      });
    }
  }



}
