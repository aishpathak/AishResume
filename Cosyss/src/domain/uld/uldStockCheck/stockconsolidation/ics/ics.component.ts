import { SightedUldRequest } from './../../../uld.shared';
import { UldService } from './../../../uld.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, PageConfiguration } from 'ngc-framework';

@Component({
  selector: 'ngc-ics',
  templateUrl: './ics.component.html',
  styleUrls: ['./ics.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class IcsComponent extends NgcPage implements OnInit {
  errors: any;
  dataDisplay: boolean;
  // sightedOn: any;
  movementdetails: any;
  lastmovementtype: any;
  damagedetails: any;
  condition: any;
  // stockArea: any;
  source: any;
  uldNumber: any;
  carrier: any;
  resp: any;

  private icsconsolidationform: NgcFormGroup = new NgcFormGroup
    ({
      carrier: new NgcFormControl(),
      heldBy: new NgcFormControl(),
      stockArea: new NgcFormControl(),
      uldType: new NgcFormControl(),
      icsUldsList: new NgcFormArray(
        [
          new NgcFormGroup({
            uldNumber: new NgcFormControl(),
            source: new NgcFormControl(),
            // stockArea: new NgcFormControl(),
            condition: new NgcFormControl(),
            lastmovementtype: new NgcFormControl(),
            movementdetails: new NgcFormControl(),
            // sightedOn: new NgcFormControl(),
            damagedetails: new NgcFormControl()
          })
        ]
      ),
    });

  constructor(appZone: NgZone
    , appElement: ElementRef
    , appContainerElement: ViewContainerRef
    , private uldService: UldService) {
    super(appZone, appElement, appContainerElement);
    this.functionId = 'PLAYGROUND';
  }

  ngOnInit() { }

  onSearch(event) {
    const sightedulds: SightedUldRequest = new SightedUldRequest();
    if (this.icsconsolidationform.get('carrier').value) {
      this.uldService.fetchSightedUlds(new SightedUldRequest()).subscribe(data => {
        this.resp = data;
        this.refreshFormMessages(data.data);
        if (data.success) {
          this.carrier = (this.icsconsolidationform.get('carrier').value);
          this.uldNumber = this.resp.data.uldNumber;
          this.source = this.resp.data.source;
          this.condition = this.resp.Condition;
          this.damagedetails = this.resp.damagedetails;
          this.lastmovementtype = this.resp.lastmovementtype;
          this.movementdetails = this.resp.movementdetails;
          this.dataDisplay = true;
          this.showSuccessStatus('g.operation.successful');
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus('uld.updation.failed');
        }
      }, error => this.showErrorStatus('uld.validation.error'));
    } else {
      this.showWarningStatus('uld.carrier.is.mandatory');
    }
    this.populateTable();
  }
  public populateTable() {
    for (const obj of this.resp) {
      (<NgcFormArray>this.icsconsolidationform.controls['icsUldsList']).patchValue([
        {
          uldNumber: obj.uldNumber,
          source: obj.source,
          // stockArea: obj.stockArea,
          condition: obj.condition,
          lastmovementtype: obj.lastmovementtype,
          movementdetails: obj.movementdetails,
          // sightedOn: obj.sightedOn,
          damagedetails: obj.damagedetails
        }
      ]);
    }
  }
}
