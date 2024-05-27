import { Component, ElementRef, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcFormArray, NgcFormGroup, NgcPage, PageConfiguration } from 'ngc-framework';
import { WarehouseService } from '../warehouse.service';
import { MaintainSystemParameterReq } from '../../masters/masters.sharedmodel';
import { MastersService } from '../../masters/masters.service';

@Component({
  selector: 'app-query-bin',
  templateUrl: './query-bin.component.html',
  styleUrls: ['./query-bin.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
})
export class QueryBinComponent extends NgcPage implements OnInit {
  id: any;
  path: any;
  errors: any;
  rowData: any;

  ngOnInit() {
    this.fetchSystemParameterByName();
  }

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private queryBinService: WarehouseService,
    private route: ActivatedRoute,
    private maintainSysService: MastersService,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  public queryBinForm: NgcFormGroup = new NgcFormGroup({
    queryBinList: new NgcFormArray([])
  });

  sendQueryBin() {
    let queryBinPath = this.path + this.id
    let redirectPath = this.queryBinService.generateQueryBinPath(queryBinPath, (this.queryBinForm.get(['queryBinList']) as NgcFormArray).getRawValue());
    window.open(redirectPath);
  }
  /**
   * This Function will Fetch All System Parameter List
   */
  public fetchSystemParameterByName() {
    this.maintainSysService.fetchSystemParameterByName('ARTS_INTERFACE_', null).subscribe(response => {
      this.rowData = response.data;
      for (const eachRow of this.rowData) {
        if (eachRow.code === 'ARTS_INTERFACE_PATH') {
          this.path = eachRow.value;
        } else if (eachRow.code === 'ARTS_INTERFACE_ID') {
          this.id = eachRow.value;
       }
      }
    },
      error => {
        this.errors = this.rowData.messageList;
        this.showErrorStatus(this.errors[0].message);
      }
    );
  }



}
