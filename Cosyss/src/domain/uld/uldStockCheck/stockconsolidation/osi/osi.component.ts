import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Directive, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormControl,
  NgcTabsComponent, NgcTabComponent, NgcFormArray, NgcUtility, NgcWindowComponent,
  PageConfiguration
} from 'ngc-framework';

import { UldService } from './../../../uld.service';
@Component({
  selector: 'ngc-osi',
  templateUrl: './osi.component.html',
  styleUrls: ['./osi.component.scss']
})
export class OsiComponent extends NgcPage {
  formOsi: NgcFormGroup = new NgcFormGroup({
    osiRemarkFormGp: new NgcFormGroup({
      osiRemarks: new NgcFormArray([
        new NgcFormGroup({
          osiRemark: new NgcFormControl()
        })
      ])
    })

  });

  ngOnInit() { }

  constructor(appZone: NgZone
    , appElement: ElementRef
    , appContainerElement: ViewContainerRef
    , private uldService: UldService) {
    super(appZone, appElement, appContainerElement);
    // this.functionId = 'PLAYGROUND';
  }



  addRow() {
    (<NgcFormArray>this.formOsi.get(["osiRemarkFormGp", "osiRemarks"])).addValue([
      {
        osiRemark: ''
      }
    ]);
  }
  delRow(item, index) {
    console.log("item", item);
    console.log("item1", item.value.transactionSeqNo);
    (<NgcFormArray>this.formOsi.get(["osiRemarkFormGp", "osiRemarks"])).removeAt(index)

    const osiRemarksRequest: any = new Object();
    osiRemarksRequest.scmCycleId = item.value.scmCycleId;
    osiRemarksRequest.transactionSeqNo = item.value.transactionSeqNo;

    this.uldService.delOsiRemark(osiRemarksRequest).subscribe((data) => {
      const resp = data;
      if (data.success) {
        this.showSuccessStatus('g.operation.successful');
      }
    });

  }
}
