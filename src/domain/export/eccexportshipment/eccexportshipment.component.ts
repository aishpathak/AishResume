
import { Embargo } from './../export.sharedmodel';
import { ExportService } from './../export.service';
import { NgcFormGroup, NgcFormControl, NgcFormArray, NgcWindowComponent, NgcErrorComponent, 
  NgcErrorModule, NgcPage, PageConfiguration } from 'ngc-framework';
import {
  EccExportRequest
} from './../export.sharedmodel';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
@Component({
  selector: 'app-eccexportshipment',
  templateUrl: './eccexportshipment.component.html',
  styleUrls: ['./eccexportshipment.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class EccexportshipmentComponent extends NgcPage
  implements OnInit {
  @ViewChild('addPlanningwindow') addPlanningwindow: NgcWindowComponent;
  @ViewChild('awbDetailsWindow') awbDetailsWindow: NgcWindowComponent;
  @ViewChild('addAwbWindow') addAwbWindow: NgcWindowComponent;
  showTable = false;
  private form = new NgcFormGroup({
    dateFrom: new NgcFormControl(),
    dateTo: new NgcFormControl(),
    flight: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    expressSer: new NgcFormControl(),
    resultList: new NgcFormArray([
    ]),

  });

  private addPlanningForm = new NgcFormGroup({
    flight: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    off: new NgcFormControl(),
    planningAdvice: new NgcFormControl()
  });

  private addAwbForm = new NgcFormGroup({
    weight: new NgcFormControl(),
    pieces: new NgcFormControl(),
    bay: new NgcFormControl(),
    units: new NgcFormControl(),
    shc: new NgcFormControl(),
    awbNo: new NgcFormControl(),
    addAwbList: new NgcFormArray([
    ]),
  });

 private awbDetailsForm = new NgcFormGroup({
   AwbDetailsList: new NgcFormArray([])
 });

  constructor(private exportService: ExportService,
    appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }
  ngOnInit() {
  }

  onSearch() {
    let request: EccExportRequest = new EccExportRequest();
    request.flight = this.form.get('flight').value
    request.flightDate = this.form.get('flightDate').value;
    this.exportService.onSearchEccExpDetails(request).subscribe(responseBean => {
      this.form.get('resultList').patchValue(responseBean.data.eccExportPlannerList);
      this.showTable = true;
    }, error => {
      this.showErrorStatus('g.no.result.found.for.search');
    }
    );
  }


  addplanningWindow() {
    this.addPlanningwindow.open();
  }

  addAwbWindows() {
    this.addAwbWindow.open();
  }

  onClickNavigate() {
    this.router.navigate(['/export/eccexpoutdetailer']);
  }

  awbDetailsWindows() {
    this.awbDetailsWindow.open();
  }

}
