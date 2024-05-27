import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl } from 'ngc-framework';
@Component({
  selector: 'app-details-fight-dashboard',
  templateUrl: './details-fight-dashboard.component.html',
  styleUrls: ['./details-fight-dashboard.component.scss']
})
export class DetailsFightDashboardComponent extends NgcPage implements OnInit {
  @Input('detailsDashboardObject') detailsDashboardObject;
  @Output()
  responseObject = new EventEmitter();

  /* constructor for dependency injection */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private dashboardService: DashboardService) {
    super(appZone, appElement, appContainerElement);
  }

  /* This form is used for data fields in the window*/
  private detailsDashboard: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    flightId: new NgcFormControl(),
    parameter: new NgcFormControl(),
    etd: new NgcFormControl(),
    atd: new NgcFormControl(),
    aircraftRegCode: new NgcFormControl(),
    aircraftType: new NgcFormControl(),
    flightType: new NgcFormControl(),
    dashboardList: new NgcFormArray([]),
  });

  /* Oninit function */
  ngOnInit() {
    this.detailsDashboard.patchValue(this.detailsDashboardObject);
    const flightShipmentDetailsRequest = {
      flightKey: this.detailsDashboardObject.flightKey,
      flightId: this.detailsDashboardObject.flightId,
      parameter: this.detailsDashboardObject.parameter,
    }
    this.dashboardService.getFlightShipmentDetails(flightShipmentDetailsRequest).subscribe(response => {
      this.resetFormMessages();
      if (response.data && !this.showResponseErrorMessages(response.data)) {
        this.detailsDashboard.patchValue(response.data);
      }
    }, (error: string) => {
      this.showErrorMessage(error);
    });
  }
}
