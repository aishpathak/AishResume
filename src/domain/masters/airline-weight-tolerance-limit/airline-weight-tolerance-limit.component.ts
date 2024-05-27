import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, NgModule, ViewChild, Input } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Validators, PatternValidator } from '@angular/forms';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, PageConfiguration
} from 'ngc-framework';
import { MastersService } from '../masters.service';

@Component({
  selector: 'app-airline-weight-tolerance-limit',
  templateUrl: './airline-weight-tolerance-limit.component.html',
  styleUrls: ['./airline-weight-tolerance-limit.component.scss']
})
export class AirlineWeightToleranceLimitComponent extends NgcPage {

  @ViewChild('complexSlabWindow') complexSlabWindow: NgcWindowComponent;
  @ViewChild('flatSlabWindow') flatSlabWindow: NgcWindowComponent;
  @ViewChild('SHCSlabWindow') SHCSlabWindow: NgcWindowComponent;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private masterAirlineService: MastersService, private route: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  public form: NgcFormGroup = new NgcFormGroup({
    carrier: new NgcFormControl(),
    complexSlab: new NgcFormControl(),
    flatSlab: new NgcFormControl(),
    shcSlab: new NgcFormControl(),
    airlineWeigthToleranceLimit: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        carrier: new NgcFormControl(),
        absoluteWeight: new NgcFormControl(),
        weight: new NgcFormControl(),
        startDate: new NgcFormControl(),
        enddate: new NgcFormControl(),
      })
    ]),
  });
  ngOnInit() {
  }
  onSearchComplex(index) {
    this.complexSlabWindow.open();
  }
  onSearchFlat(index) {
    this.flatSlabWindow.open();
  }
  onSearchSHC(index) {
    this.SHCSlabWindow.open();

  }
  onAddAirlineWeight() {
    (<NgcFormArray>this.form.get('airlineWeigthToleranceLimit')).addValue([
      {
        select: '',
        carrier: '',
        absoluteWeight: '',
        weight: '',
        startDate: '',
        enddate: ''
      }
    ]);
  }
}
