import { SightedUldRequest } from './../../../uld.shared';
import { UldService } from './../../../uld.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import { NgcFormControl, NgcFormGroup, NgcPage, NgcFormArray, PageConfiguration } from 'ngc-framework';

@Component({
  selector: 'ngc-sightedulds',
  templateUrl: './sightedulds.component.html',
  styleUrls: ['./sightedulds.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class SighteduldsComponent extends NgcPage implements OnInit {

  form: NgcFormGroup = new NgcFormGroup
    ({
      sightedUldsList: new NgcFormArray(
        [
          new NgcFormGroup({
            uldNumber: new NgcFormControl(),
            source: new NgcFormControl(),
            stockArea: new NgcFormControl(),
            condition: new NgcFormControl(),
            lastmovementtype: new NgcFormControl(),
            movementdetails: new NgcFormControl(),
            sightedOn: new NgcFormControl(),
            damagedetails: new NgcFormControl()
          })
        ]
      ),
    });
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private uldService: UldService) {
    super(appZone, appElement, appContainerElement);
    this.functionId = 'PLAYGROUND';
  }

  ngOnInit() { }

  onLinkClick(event) { }

  /**
   * @param event
   */
  onSearch(event) {
    const sightedulds: SightedUldRequest = new SightedUldRequest();
    this.uldService.fetchSightedUlds(new SightedUldRequest()).subscribe(data => {
     
    }, error => this.showErrorStatus('uld.validation.error'));
  }
}
