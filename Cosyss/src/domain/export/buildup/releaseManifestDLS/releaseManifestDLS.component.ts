import { Validators } from '@angular/forms';
import {
  NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcButtonComponent, NgcCheckBoxComponent,
  PageConfiguration
} from 'ngc-framework';
import { Component, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { BuildupService } from './../buildup.service';
import { Flight, FlightEvent } from '../../export.sharedmodel';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-releaseManifestDLS',
  templateUrl: './releaseManifestDLS.component.html',
  styleUrls: ['./releaseManifestDLS.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  // restorePageOnBack: true,
  // autoBackNavigation: true
})
export class ReleaseManifestDLSComponent extends NgcPage {
  @ViewChild('releasebutton') releasebutton: NgcButtonComponent;
  @ViewChild('releaseManifestCheckBox') releaseManifestCheckBox: NgcCheckBoxComponent;
  @ViewChild('releaseDLSCheckBox') releaseDLSCheckBox: NgcCheckBoxComponent;
  data: any;
  displayBoolean: boolean;
  releaseButtonEnabled: boolean;
  transferData: any;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private buildupService: BuildupService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  private releaseManifestDLSForm: NgcFormGroup = null;

  onSearch() {
    const flightRequest: Flight = new Flight();
    flightRequest.flightKey = this.releaseManifestDLSForm.get('flightKey').value;
    flightRequest.flightOriginDate = this.releaseManifestDLSForm.get('flightOriginDate').value;
    this.buildupService.displayFlightStatus(flightRequest).subscribe(data => {
      this.displayBoolean = false;
      this.refreshFormMessages(data);
      if (data.data) {
        this.displayBoolean = true;
        this.data = data.data;
        this.bindData(this.data);
      }
    }, error => {
      this.displayBoolean = false;
    });
  }

  bindData(flightEvent: FlightEvent) {
    const interpretedData = {
      releaseManifest: false,
      releaseDLS: false,
      manifestControl: 'N',
      dlsControl: 'N',
      status: flightEvent.status
    }
    if (flightEvent.dlsCompletedAt !== null && flightEvent.dlsCompletedBy !== null) {
      interpretedData.dlsControl = 'Y'
    }
    if (flightEvent.manifestCompletedAt !== null && flightEvent.manifestCompletedBy !== null) {
      interpretedData.manifestControl = 'Y'
    }
    this.releaseManifestDLSForm.patchValue(interpretedData);
    this.releaseManifestDLSForm.get('releaseDLS').enable();
    this.releaseManifestDLSForm.get('releaseManifest').enable();
    if ((flightEvent.firstTimeDLSCompletedAt === null || flightEvent.firstTimeDLSCompletedBy === null)
      || (flightEvent.dlsCompletedAt === null || flightEvent.dlsCompletedBy === null)) {
      this.releaseManifestDLSForm.get('releaseDLS').disable();
    }
    if ((flightEvent.firstTimeManifestCompletedAt === null || flightEvent.firstTimeManifestCompletedBy === null)
      || (flightEvent.manifestCompletedAt === null || flightEvent.manifestCompletedBy === null)) {
      this.releaseManifestDLSForm.get('releaseManifest').disable();
    }
    this.releaseButtonEnabled = !(flightEvent.departed || (this.releaseManifestDLSForm.get('releaseManifest').disabled && this.releaseManifestDLSForm.get('releaseDLS').disabled));
  }

  onRelease() {
    const updateRequest: FlightEvent = new FlightEvent();
    updateRequest.releaseManifest = (!this.releaseManifestDLSForm.get('releaseManifest').disabled && this.releaseManifestDLSForm.get('releaseManifest').value);
    updateRequest.releaseDLS = (!this.releaseManifestDLSForm.get('releaseDLS').disabled && this.releaseManifestDLSForm.get('releaseDLS').value);
    updateRequest.flightId = this.data.flightId;
    updateRequest.flightKey = this.releaseManifestDLSForm.get('flightKey').value;
    updateRequest.flightOriginDate = this.releaseManifestDLSForm.get('flightOriginDate').value;

    if (!updateRequest.releaseManifest && !updateRequest.releaseDLS) {
      this.showInfoStatus('export.select.atleast.one.control.to.release');
    } else {
      this.releaseButtonEnabled = false;
      this.buildupService.updateFlightStatus(updateRequest).subscribe(data => {
        this.refreshFormMessages(data);
        if (!data.messageList) {
          this.showSuccessStatus('g.completed.successfully');
          this.onSearch();
        }
      },
        error => {
          this.releaseButtonEnabled = true;
        });
    }
  }

  ngOnInit() {
    this.initialize();
    this.data = null;
    this.transferData = this.getNavigateData(this.activatedRoute);
    if (this.transferData) {
      this.releaseManifestDLSForm.patchValue(this.transferData);
      this.onSearch();
    }
  }

  onCancel(event) {
    console.log(this.transferData);
    this.navigateBack(this.transferData);
  }

  initialize() {
    this.displayBoolean = false;
    this.releaseButtonEnabled = false;
    this.releaseManifestDLSForm = new NgcFormGroup({
      flightKey: new NgcFormControl(),
      manifestControl: new NgcFormControl('N'),
      dlsControl: new NgcFormControl('N'),
      flightOriginDate: new NgcFormControl(new Date()),
      releaseManifest: new NgcFormControl(),
      releaseDLS: new NgcFormControl()
    });
  }
}
