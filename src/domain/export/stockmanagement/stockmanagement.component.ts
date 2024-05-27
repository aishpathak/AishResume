/**
* @copyright NIIT Technologies Ltd. 2017-18.
*/

// Angular
import {
  Component, OnInit, NgZone, ElementRef, ViewContainerRef,
  ViewChild, Directive
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// NGC Framework
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcButtonComponent, PageConfiguration
} from 'ngc-framework';

import { WorkingList } from './../export.sharedmodel';
import { ExportService } from './../export.service';

@Component({
  selector: 'ngc-stockmanagement',
  templateUrl: './stockmanagement.component.html',
  styleUrls: ['./stockmanagement.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class StockManagementComponent extends NgcPage {
  private displayFlag: boolean = true;

  // Initialize
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private exportService: ExportService, private activatedRoute: ActivatedRoute,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  // Formgroup
  private stockManagementForm: NgcFormGroup = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    stockId: new NgcFormControl(),
    category: new NgcFormControl(),
    firstAwbNumber: new NgcFormControl(),
    numberOfAwb: new NgcFormControl(),
    lowStockLimit: new NgcFormControl(),
    newLowStockLimit: new NgcFormControl()
  });
}


