
import { Component, OnInit } from '@angular/core';
import {
  NgZone,
  ElementRef,
  ViewContainerRef,
  ChangeDetectorRef
} from "@angular/core";
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  PageConfiguration,

} from "ngc-framework";
import { ImportService } from '../import.service';

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: false,
  dontRestoreOnBrowserBack: false
})

@Component({
  selector: 'app-cargodamagereportlist',
  templateUrl: './cargodamagereportlist.component.html',
  styleUrls: ['./cargodamagereportlist.component.scss']
})
export class CargodamagereportlistComponent extends NgcPage {
  flightId: number;
  resp: any;
  showTable = false
  datAta: any;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  private form: NgcFormGroup = new NgcFormGroup({
    flight: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    flightId: new NgcFormControl(),
    datAta: new NgcFormControl(null, [Validators.required]),
    damageReportList: new NgcFormArray([])
  });

  onSearch() {
    this.showTable = false;
    if (!this.form.valid) {
      this.form.validate();
      return;
    }

    const request = this.form.getRawValue();
    request.flightNumber = request.flight
    this.resetFormMessages();
    (this.form.get("damageReportList") as NgcFormArray).resetValue([]);
    this.importService.fetchCargoDamageReportList(request).subscribe(
      response => {
        this.refreshFormMessages(response);
        if (response) {
          this.form.patchValue(response);
          this.showTable = true;
        } else {
          this.showTable = false;
        }
        this.form.get("damageReportList").patchValue(response.data);
      },
      error => {
        this.showErrorMessage(error);
      }
    );

  }

  transferData(event) {
    this.navigateTo(this.router, "/import/createdamagereport", { 'flight': event.record.flight, 'flightDate': event.record.flightDate, 'flightATA': event.record.ata });
  }

}
