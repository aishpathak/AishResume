import {
  Component, OnInit, NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild
} from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcFormArray, NgcDropDownListComponent, PageConfiguration, NgcWindowComponent } from 'ngc-framework';
import { ImportService } from '../import.service';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-display-cpm',
  templateUrl: './display-cpm.component.html',
  styleUrls: ['./display-cpm.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class DisplayCpmComponent extends NgcPage implements OnInit {
  showTable: boolean = false;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }
  resp: any;
  private displaycpm: NgcFormGroup = new NgcFormGroup({
    flight: new NgcFormControl('', [Validators.maxLength(8)]),
    flightDate: new NgcFormControl(),
    flightId: new NgcFormControl(),
    sta: new NgcFormControl(),
    eta: new NgcFormControl(),
    ata: new NgcFormControl(),
    acRegistration: new NgcFormControl(),
    listDisplayCpmDetails: new NgcFormArray([])

  });


  ngOnInit() {

  }

  onCancel() {
    this.navigateTo(this.router, "/", null);
  }



  // onClear(event): void {
  //   this.displaycpm.reset();
  //   this.resetFormMessages();
  // }

  onSearch() {

    if (this.displaycpm.get('flight').invalid === true) {
      this.showErrorMessage('flight.info.required');
      return;
    }
    if (this.displaycpm.get('flightDate').invalid === true) {
      this.showErrorMessage('flight.data.required');
      return;
    }

    const request = this.displaycpm.getRawValue();
    this.importService.getOnSearch(request).subscribe(response => {
      if (response.success) {
        this.resetFormMessages();
        this.resp = response.data;
        if (this.resp.sta)
          this.resp.sta = this.resp.sta.substring(0, 5);
        if (this.resp.ata)
          this.resp.ata = this.resp.ata.substring(0, 5);
        if (this.resp.eta)
          this.resp.eta = this.resp.eta.substring(0, 5);
        console.log(this.resp.sta.length);
        this.displaycpm.patchValue(this.resp);
        this.showTable = true;

      } else {
        this.showTable = false;
        this.showErrorMessage("no.cpm.message.received");
        this.refreshFormMessages(response);
      }
    });
    // console.log(response);

  };
}

