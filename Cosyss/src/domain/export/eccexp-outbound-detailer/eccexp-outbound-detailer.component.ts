import { Embargo } from './../export.sharedmodel';
import { ExportService } from './../export.service';
import { NgcFormGroup, NgcFormControl, NgcFormArray, NgcWindowComponent, PageConfiguration } from 'ngc-framework';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

@Component({
  selector: 'app-eccexp-outbound-detailer',
  templateUrl: './eccexp-outbound-detailer.component.html',
  styleUrls: ['./eccexp-outbound-detailer.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class EccexpOutboundDetailerComponent implements OnInit {

 private form = new NgcFormGroup({
    dateFrom: new NgcFormControl(),
    dateTo: new NgcFormControl(),
    flight: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    expressSer: new NgcFormControl(),
  });
constructor(private exportService: ExportService) { }

  ngOnInit() {
  }

}
