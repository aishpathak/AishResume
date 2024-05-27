import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageConfiguration, NgcPage, NgcFormArray, NgcFormGroup, NgcFormControl, NgcUtility, NgcReportComponent, ReportFormat } from 'ngc-framework';
import { UldService } from '../../uld.service';

@Component({
  selector: 'app-maintain-global-uld-inventory-list',
  templateUrl: './maintain-global-uld-inventory-list.component.html',
  styleUrls: ['./maintain-global-uld-inventory-list.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
})

export class MaintainGlobalUldInventoryListComponent extends NgcPage implements OnInit {
  @ViewChild("ReportExcel") ReportExcel: NgcReportComponent;
  /* This form is used for getting the respose */
  private searchUldInventory = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    carrierGroup: new NgcFormControl(),
    carrierGroupDesc: new NgcFormControl(),
    stationAirport: new NgcFormControl(),
    uldType: new NgcFormControl(),
    uldGroup: new NgcFormControl(),
    uldGroupId: new NgcFormControl()
  })

  /* This form is used for saving the respose */
  private globalUldInventory = new NgcFormGroup({
    globalUldInventoryList: new NgcFormArray([])
  })
  forwardedData: any;
  reportParameters: any;
  disabledFlag: boolean = true;

  constructor(
    appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router, private uldService: UldService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }
  //empty list to store the response in onsearch function
  globalUldInventoryList: any = [];
  //this flag will be enabled in the when search function is called
  resultFlag: boolean = false;
  hasReadPermission: boolean = true;

  /* Oninit function */
  ngOnInit() {
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    if (this.forwardedData) {
      this.searchUldInventory.patchValue(this.forwardedData);
      this.onSearch();
    }
  }

  /* On search : called when search is clicked */
  onSearch() {
    var request = this.searchUldInventory.getRawValue();
    this.resetFormMessages();
    this.resultFlag = false;
    this.uldService.getGlobalUldInventoryList(request).subscribe(response => {
      this.refreshFormMessages(response);
      if (response.data == null) {
        this.disabledFlag = true;
      }
      this.globalUldInventoryList = response.data;
      if (this.globalUldInventoryList && this.globalUldInventoryList.length > 0) {
        this.resultFlag = true;
        this.disabledFlag = false;
        this.globalUldInventory.get('globalUldInventoryList').patchValue(this.globalUldInventoryList);
      }
    }, error => {
      this.showErrorMessage('g.error' + error);
    })
  }

  /* onDeleteInventoryList : this function is called to delete the record in table*/
  onDeleteInventoryList(index) {
    (<NgcFormArray>this.globalUldInventory.get(['globalUldInventoryList'])).markAsDeletedAt(index);
    let request = (<NgcFormArray>this.globalUldInventory.get(['globalUldInventoryList', index])).getRawValue();
    this.showConfirmMessage("import.are.You.Sure.To.Delete").then(fulfilled => {
      this.uldService.deleteGlobalInventoryList(request).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus('g.completed.successfully');
          this.resetFormMessages();
          this.onSearch();
        } else {
          this.refreshFormMessages(data);
        }
      }, error => {
        this.showErrorStatus(error);
      });
    });
  }
  //this function is used to fetch the uld type lov details based on the uld group details selected
  onSelectUldGroup(event) {
    if (event && event.code) {
      this.searchUldInventory.get('uldGroupId').setValue(event.param1);
    } else {
      this.searchUldInventory.get('uldGroupId').setValue(null);
    }
  }

  /* onAddInventoryList : this function is called to add new record in the inventory list*/
  onAddInventoryList(event) {
    this.hasReadPermission = false;
    this.resultFlag = true;
    (<NgcFormArray>this.globalUldInventory.get(['globalUldInventoryList'])).addValue([
      {
        uldKey: null,
        ownedBy: null,
        usedBy: null,
        station: null,
        flightKey: null,
        flightDate: null,
        flowType: 'MAN',
        source: 'MANUAL',
        damaged: false,
        lastUpdatedDateTime: null,
        lastScmDateTime: null,
        remarks: null,
        delete: null,
        check: null
      }
    ]);
  }

  /* Onsave : called to save new record in the inventory list table*/
  onSave(event) {
    let arrayList = [];
    for (const eachRow of (<NgcFormArray>this.globalUldInventory.get(['globalUldInventoryList'])).value) {
      if (eachRow.flagCRUD == 'C') {
        arrayList.push(eachRow);
      }
    }
    if (arrayList.length > 0) {
      // Check form valid or not and return
      this.globalUldInventory.validate();
      if (this.globalUldInventory.invalid) {
        return;
      }
      this.uldService.saveGlobalInventoryList(arrayList).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.hasReadPermission = true;
          this.showSuccessStatus('g.completed.successfully');
          this.resetFormMessages();
          this.onSearch();
        }
      }, error => {
        this.showErrorStatus(error);
      });
    }
  }

  /* moveToGlobalUldTracking : this function is used to redirect to global uld tracking screen*/
  moveToGlobalUldTracking() {
    let count = 0;
    let valueTosend;
    for (const eachRow of (<NgcFormArray>this.globalUldInventory.get(['globalUldInventoryList'])).value) {
      if (eachRow.check) {
        count++;
        valueTosend = eachRow;
        valueTosend.searchRequest = this.searchUldInventory.getRawValue();
      }
    }
    if (count == 1) {
      this.navigateTo(this.router, '/uld/globalUldTracking', valueTosend);
    } else if (count == 0) {
      this.showErrorStatus('expaccpt.select.least.one.record');
    } else if (count > 1) {
      this.showErrorStatus('export.select.only.one.record');
    }
  }
  onExport() {
    if (this.resultFlag) {
      this.reportParameters = new Object();
      this.reportParameters.carrierCode = this.searchUldInventory.get('carrierCode').value;
      this.reportParameters.stationAirport = this.searchUldInventory.get('stationAirport').value;
      this.reportParameters.uldType = this.searchUldInventory.get('uldType').value;
      this.reportParameters.uldGroupId = this.searchUldInventory.get('uldGroupId').value;
      this.ReportExcel.format = ReportFormat.XLS;
      this.ReportExcel.downloadReport();
    }
  }
  onClickCarrierGroup(event) {
    this.searchUldInventory.get('carrierGroup').patchValue(event.code);
    this.searchUldInventory.get('carrierCode').patchValue(null);
    this.resultFlag = false;
  }
  onClickCarrierCode() {
    this.searchUldInventory.get('carrierGroup').patchValue(null);
    this.searchUldInventory.get('carrierGroupDesc').patchValue(null);
    this.resultFlag = false;
  }
}
